'use client'

import { useState, useEffect } from 'react'
import {
    ShoppingCart, Package, Plus, Trash2,
    TrendingUp, Clock, Save, Loader2
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { getOrders, Order } from '@/lib/api/orders'
import { searchProducts, Product } from '@/lib/api/products'
import { addToCart } from '@/lib/api/cart'
import { useRouter } from 'next/navigation'

// LocalStorage key for templates
const TEMPLATES_KEY = 'wholesale_order_templates'

interface OrderTemplate {
    id: string
    name: string
    items: { sku: string; quantity: number }[]
    lastUsed: string
}

type TabId = 'dashboard' | 'quick-order' | 'history' | 'templates'

export default function WholesalePortal() {
    const { user, isLoading: authLoading } = useAuth()
    const router = useRouter()

    const [activeTab, setActiveTab] = useState<TabId>('dashboard')
    const [orderItems, setOrderItems] = useState<Array<{ sku: string, quantity: number, price?: number, name?: string }>>([])
    const [skuInput, setSkuInput] = useState('')
    const [quantityInput, setQuantityInput] = useState('1')
    // const [searchQuery, setSearchQuery] = useState('') // Unused

    // Data states
    const [orders, setOrders] = useState<Order[]>([])
    const [loadingData, setLoadingData] = useState(false)
    const [templates, setTemplates] = useState<OrderTemplate[]>([])
    // const [productSearchLoading, setProductSearchLoading] = useState(false) // Unused in render
    const [searchResults, setSearchResults] = useState<Product[]>([])

    // Load templates on mount
    useEffect(() => {
        const saved = localStorage.getItem(TEMPLATES_KEY)
        if (saved) {
            try {
                setTemplates(JSON.parse(saved))
            } catch (e) {
                console.error("Failed to parse templates", e)
            }
        }
    }, [])

    // Fetch orders when tab changes to history or dashboard
    useEffect(() => {
        if (!user) return

        const fetchData = async () => {
            try {
                setLoadingData(true)
                // Fetch recent orders
                const response = await getOrders({ limit: 10 })
                setOrders(response.data || [])
            } catch (e) {
                console.error("Failed to fetch orders", e)
            } finally {
                setLoadingData(false)
            }
        }

        fetchData()
    }, [user])

    // Product Search for Quick Order
    useEffect(() => {
        const search = async () => {
            if (skuInput.length < 3) {
                setSearchResults([])
                return
            }

            try {
                // setProductSearchLoading(true)
                const res = await searchProducts({ query: skuInput, limit: 5 })
                setSearchResults(res.data)
            } catch (e) {
                console.error("Search failed", e)
            } finally {
                // setProductSearchLoading(false)
            }
        }

        const debounce = setTimeout(search, 500)
        return () => clearTimeout(debounce)
    }, [skuInput])

    // Quick order functions
    const addToOrder = async (product?: Product) => {
        const qty = parseInt(quantityInput)
        if (qty <= 0) return

        let itemToAdd: { sku: string, quantity: number, price?: number, name?: string } | null = null

        if (product) {
            itemToAdd = {
                sku: product.sku,
                quantity: qty,
                price: product.basePrice,
                name: product.name
            }
        } else if (skuInput) {
            // Try to find in search results first
            const found = searchResults.find(p => p.sku.toLowerCase() === skuInput.toLowerCase())
            if (found) {
                itemToAdd = {
                    sku: found.sku,
                    quantity: qty,
                    price: found.basePrice,
                    name: found.name
                }
            } else {
                // Determine if we want to allow adding by raw SKU without validation (risky)
                // For now, require selection or exact match
                return
            }
        }

        if (itemToAdd) {
            // Check if already in list
            const existingIndex = orderItems.findIndex(i => i.sku === itemToAdd!.sku)
            if (existingIndex >= 0) {
                const newItems = [...orderItems]
                newItems[existingIndex].quantity += qty
                setOrderItems(newItems)
            } else {
                setOrderItems([...orderItems, itemToAdd])
            }
            setSkuInput('')
            setQuantityInput('1')
            setSearchResults([])
        }
    }

    const removeFromOrder = (index: number) => {
        setOrderItems(orderItems.filter((_, i) => i !== index))
    }

    const calculateOrderTotal = () => {
        return orderItems.reduce((sum, item) => sum + ((item.price || 0) * item.quantity), 0)
    }

    const saveTemplate = () => {
        const name = prompt("Enter template name:")
        if (!name) return

        const newTemplate: OrderTemplate = {
            id: Date.now().toString(),
            name,
            items: orderItems.map(i => ({ sku: i.sku, quantity: i.quantity })),
            lastUsed: new Date().toLocaleDateString()
        }

        const newTemplates = [...templates, newTemplate]
        setTemplates(newTemplates)
        localStorage.setItem(TEMPLATES_KEY, JSON.stringify(newTemplates))
    }

    const loadTemplate = async (template: OrderTemplate) => {
        // Here we would ideally fetch product details for these SKUs to get current prices
        // For simplicity, we'll just load them and assume user resolves prices on checkout or we fetch them one by one
        // A better approach: bulk fetch product details by SKU. For now, we load what we have.

        // TODO: Implement bulk fetch. Currently just mapping.
        // As a workaround, we will assume 0 price until fetched or just redirect to cart where backend handles it
        setOrderItems(template.items.map(i => ({
            sku: i.sku,
            quantity: i.quantity,
            price: 0, // Placeholder
            name: `SKU: ${i.sku}`
        })))
        setActiveTab('quick-order')
    }

    const deleteTemplate = (id: string) => {
        const newTemplates = templates.filter(t => t.id !== id)
        setTemplates(newTemplates)
        localStorage.setItem(TEMPLATES_KEY, JSON.stringify(newTemplates))
    }

    const handlePlaceOrder = async () => {
        // Add all items to cart
        setLoadingData(true)
        try {
            for (const item of orderItems) {
                // We need product ID to add to cart, but we might only have SKU.
                // The cart API expects Product ID. 
                // So we need to search by SKU to get ID first if we don't have it.
                // This is a limitation of current cart API vs Quick Order by SKU.
                // WORKAROUND: We assume we have the product object if added via search.
                // If loaded from template, we might fail.

                // Real world: Backend would have addBySku endpoint.
                // Here: We search for the product first.
                const res = await searchProducts({ query: item.sku, limit: 1 })
                if (res.data && res.data.length > 0) {
                    await addToCart(res.data[0].id, item.quantity)
                }
            }
            router.push('/cart')
        } catch (e) {
            console.error("Failed to add to cart", e)
            alert("Failed to add items to cart. Please try again.")
        } finally {
            setLoadingData(false)
        }
    }

    if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-950">
                <div className="text-center">
                    <p className="text-lg text-neutral-200">Please log in to view the wholesale portal.</p>
                    <Link href="/auth/login" className="mt-4 inline-block text-blue-500 hover:underline">
                        Go to Login
                    </Link>
                </div>
            </div>
        )
    }

    if (user.role !== 'wholesale' && user.role !== 'admin') {
        // Show application plea
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 px-4">
                <h1 className="text-2xl font-bold mb-4">Wholesale Access Required</h1>
                <p className="mb-6 text-center max-w-md">Your account is not approved for wholesale access. Apply now to get exclusive pricing.</p>
                <Link href="/wholesale/apply" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Apply for Wholesale</Link>
            </div>
        )
    }

    // Stats calculation (Client side based on fetched orders - approximate)
    const totalSpent = orders.reduce((sum, o) => sum + Number(o.totalAmount), 0)
    const totalOrdersCount = orders.length // Only shows fetched count

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">

            {/* Header */}
            <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                                Wholesale Portal
                            </h1>
                            <p className="text-neutral-600 dark:text-neutral-400">
                                {user.company_name || user.full_name} • Tier: {user.wholesale_tier || 'Standard'}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">Total Spent (Recent)</p>
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">${totalSpent.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                <div className="container mx-auto px-4">
                    <nav className="flex gap-1 overflow-x-auto">
                        {[
                            { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
                            { id: 'quick-order', label: 'Quick Order', icon: ShoppingCart },
                            { id: 'history', label: 'Order History', icon: Package },
                            { id: 'templates', label: 'Saved Templates', icon: Save }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as TabId)}
                                className={`
                  flex items-center gap-2 px-6 py-4 font-medium transition-colors border-b-2 whitespace-nowrap
                  ${activeTab === tab.id
                                        ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                                        : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                                    }
                `}
                            >
                                <tab.icon className="h-5 w-5" />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-8">

                {/* Dashboard */}
                {activeTab === 'dashboard' && (
                    <div className="space-y-8">

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-neutral-600 dark:text-neutral-400">Total Orders</h3>
                                    <Package className="h-8 w-8 text-purple-600" />
                                </div>
                                <p className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">{totalOrdersCount}</p>
                            </div>

                            {/* Static Info Cards */}
                            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-neutral-600 dark:text-neutral-400">Avg. Delivery</h3>
                                    <Clock className="h-8 w-8 text-orange-600" />
                                </div>
                                <p className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">2-3 days</p>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">Express available</p>
                            </div>
                        </div>

                        {/* Recent Orders */}
                        <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
                            <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
                                Recent Orders
                            </h2>
                            {loadingData ? (
                                <Loader2 className="animate-spin h-6 w-6" />
                            ) : orders.length === 0 ? (
                                <p className="text-neutral-500">No recent orders found.</p>
                            ) : (
                                <div className="space-y-3">
                                    {orders.slice(0, 3).map(order => (
                                        <div key={order.id} className="flex items-center justify-between py-3 border-b border-neutral-200 dark:border-neutral-700">
                                            <div>
                                                <p className="font-semibold text-neutral-900 dark:text-white">#{order.orderNumber}</p>
                                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-neutral-900 dark:text-white">${Number(order.totalAmount).toFixed(2)}</p>
                                                <span className="text-sm px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-700">
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <button
                                onClick={() => setActiveTab('history')}
                                className="w-full mt-4 px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            >
                                View All Orders
                            </button>
                        </div>
                    </div>
                )}

                {/* Quick Order */}
                {activeTab === 'quick-order' && (
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700 mb-6">
                            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                                Quick Order by SKU / Search
                            </h2>
                            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                                Search for products or enter SKU to add to your bulk order.
                            </p>

                            {/* SKU Input */}
                            <div className="flex gap-3 mb-6 relative">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={skuInput}
                                        onChange={(e) => setSkuInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && addToOrder()}
                                        placeholder="Enter SKU or Product Name..."
                                        className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                                    />
                                    {/* Search Results Dropdown */}
                                    {skuInput.length > 2 && searchResults.length > 0 && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                                            {// Fix: filter out items already in current results that match exactly if we want logic, but for now just show results
                                                searchResults.map(p => (
                                                    <button
                                                        key={p.id}
                                                        onClick={() => { setSkuInput(p.sku); addToOrder(p); }}
                                                        className="w-full text-left px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex justify-between"
                                                    >
                                                        <span>{p.name}</span>
                                                        <span className="text-neutral-400 text-sm">{p.sku}</span>
                                                    </button>
                                                ))
                                            }
                                        </div>
                                    )}
                                </div>
                                <div className="w-32">
                                    <input
                                        type="number"
                                        value={quantityInput}
                                        onChange={(e) => setQuantityInput(e.target.value)}
                                        min="1"
                                        placeholder="Qty"
                                        className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                                    />
                                </div>
                                <button
                                    onClick={() => addToOrder()}
                                    disabled={!skuInput}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-semibold disabled:opacity-50"
                                >
                                    <Plus className="h-5 w-5" />
                                    Add
                                </button>
                            </div>

                            {/* Order Items */}
                            {orderItems.length > 0 && (
                                <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
                                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">
                                        Current Order
                                    </h3>
                                    <div className="space-y-3 mb-6">
                                        {orderItems.map((item, index) => (
                                            <div key={index} className="flex items-center justify-between py-3 px-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                                                <div className="flex-1">
                                                    <p className="font-semibold text-neutral-900 dark:text-white">
                                                        {item.name || item.sku}
                                                    </p>
                                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                                        SKU: {item.sku} • Qty: {item.quantity}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <p className="font-bold text-neutral-900 dark:text-white">
                                                        ${((item.price || 0) * item.quantity).toFixed(2)}
                                                    </p>
                                                    <button
                                                        onClick={() => removeFromOrder(index)}
                                                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Order Summary */}
                                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-neutral-600 dark:text-neutral-400">Total Estimated</span>
                                            <span className="font-semibold text-neutral-900 dark:text-white">
                                                ${calculateOrderTotal().toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 mt-6">
                                        <button
                                            onClick={handlePlaceOrder}
                                            disabled={loadingData}
                                            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
                                        >
                                            {loadingData ? 'Processing...' : 'Add All to Cart'}
                                        </button>
                                        <button
                                            onClick={saveTemplate}
                                            className="px-6 py-3 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                                        >
                                            Save as Template
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Order History */}
                {activeTab === 'history' && (
                    <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                                Order History
                            </h2>
                        </div>

                        {loadingData ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-neutral-200 dark:border-neutral-700">
                                            <th className="text-left py-3 px-4 text-neutral-600 dark:text-neutral-400">Order #</th>
                                            <th className="text-left py-3 px-4 text-neutral-600 dark:text-neutral-400">Date</th>
                                            <th className="text-left py-3 px-4 text-neutral-600 dark:text-neutral-400">Total</th>
                                            <th className="text-left py-3 px-4 text-neutral-600 dark:text-neutral-400">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(order => (
                                            <tr key={order.id} className="border-b border-neutral-200 dark:border-neutral-700">
                                                <td className="py-4 px-4 font-semibold">#{order.orderNumber}</td>
                                                <td className="py-4 px-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                                                <td className="py-4 px-4 font-bold">${Number(order.totalAmount).toFixed(2)}</td>
                                                <td className="py-4 px-4">
                                                    <span className="px-2 py-1 bg-neutral-100 dark:bg-neutral-700 rounded text-sm">
                                                        {order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Saved Templates */}
                {activeTab === 'templates' && (
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700 mb-6">
                            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                                Saved Order Templates
                            </h2>

                            {templates.length === 0 ? (
                                <p>No saved templates.</p>
                            ) : (
                                <div className="space-y-4">
                                    {templates.map(template => (
                                        <div key={template.id} className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">
                                                        {template.name}
                                                    </h3>
                                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                                        {template.items.length} items • Last used: {template.lastUsed}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-2 mb-4">
                                                {template.items.map((item, index) => (
                                                    <div key={index} className="flex justify-between text-sm">
                                                        <span className="text-neutral-700 dark:text-neutral-300">{item.sku}</span>
                                                        <span className="text-neutral-600 dark:text-neutral-400">Qty: {item.quantity}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => loadTemplate(template)}
                                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                                >
                                                    Use Template
                                                </button>
                                                <button
                                                    onClick={() => deleteTemplate(template.id)}
                                                    className="px-4 py-2 border border-red-300 dark:border-red-600 text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
