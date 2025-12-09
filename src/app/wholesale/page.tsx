'use client'

import { useState } from 'react'
import {
    ShoppingCart, Package, FileText, Download, Plus, Trash2,
    Search, Calendar, DollarSign, TrendingUp, Clock, CheckCircle,
    AlertCircle, Save, Copy
} from 'lucide-react'
import Link from 'next/link'

// Sample data
const QUICK_ORDER_ITEMS = [
    { sku: 'IP15PM-OLED-01', name: 'iPhone 15 Pro Max OLED Display', price: 59.99, inStock: true },
    { sku: 'S24U-SCR-01', name: 'Samsung S24 Ultra Screen', price: 89.99, inStock: true },
    { sku: 'IP14P-CAM-01', name: 'iPhone 14 Pro Camera', price: 44.99, inStock: true },
    { sku: 'P9-BAT-01', name: 'Google Pixel 9 Battery', price: 24.99, inStock: false },
]

const ORDER_HISTORY = [
    {
        id: 'WO-2024-001',
        date: '2024-12-05',
        items: 15,
        total: 1249.50,
        status: 'Delivered',
        invoice: '/invoices/WO-2024-001.pdf'
    },
    {
        id: 'WO-2024-002',
        date: '2024-12-01',
        items: 8,
        total: 567.92,
        status: 'Shipped',
        tracking: 'TRK123456789'
    },
    {
        id: 'WO-2024-003',
        date: '2024-11-28',
        items: 22,
        total: 1876.34,
        status: 'Processing',
        invoice: '/invoices/WO-2024-003.pdf'
    },
    {
        id: 'WO-2024-004',
        date: '2024-11-25',
        items: 12,
        total: 945.67,
        status: 'Delivered',
        invoice: '/invoices/WO-2024-004.pdf'
    }
]

const SAVED_TEMPLATES = [
    {
        id: 1,
        name: 'Monthly Restock - iPhone Parts',
        items: [
            { sku: 'IP15PM-OLED-01', quantity: 20 },
            { sku: 'IP14P-CAM-01', quantity: 15 },
            { sku: 'IP15-BAT-01', quantity: 30 }
        ],
        total: 2345.50,
        lastUsed: '2024-11-15'
    },
    {
        id: 2,
        name: 'Samsung Screen Bundle',
        items: [
            { sku: 'S24U-SCR-01', quantity: 10 },
            { sku: 'S23U-SCR-01', quantity: 15 }
        ],
        total: 1789.90,
        lastUsed: '2024-11-20'
    }
]

export default function WholesalePortal() {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'quick-order' | 'history' | 'templates'>('dashboard')
    const [orderItems, setOrderItems] = useState<Array<{sku: string, quantity: number}>>([])
    const [skuInput, setSkuInput] = useState('')
    const [quantityInput, setQuantityInput] = useState('1')
    const [searchQuery, setSearchQuery] = useState('')

    // Quick order functions
    const addToOrder = () => {
        if (skuInput.trim() && parseInt(quantityInput) > 0) {
            setOrderItems([...orderItems, { sku: skuInput.trim().toUpperCase(), quantity: parseInt(quantityInput) }])
            setSkuInput('')
            setQuantityInput('1')
        }
    }

    const removeFromOrder = (index: number) => {
        setOrderItems(orderItems.filter((_, i) => i !== index))
    }

    const calculateOrderTotal = () => {
        return orderItems.reduce((sum, item) => {
            const product = QUICK_ORDER_ITEMS.find(p => p.sku === item.sku)
            return sum + (product ? product.price * item.quantity : 0)
        }, 0)
    }

    const loadTemplate = (template: any) => {
        setOrderItems(template.items)
        setActiveTab('quick-order')
    }

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
                                Acme Repair Shop Inc. • Account #WS-12345
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">Account Balance</p>
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">$2,450.00</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                <div className="container mx-auto px-4">
                    <nav className="flex gap-1">
                        {[
                            { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
                            { id: 'quick-order', label: 'Quick Order', icon: ShoppingCart },
                            { id: 'history', label: 'Order History', icon: Package },
                            { id: 'templates', label: 'Saved Templates', icon: Save }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`
                  flex items-center gap-2 px-6 py-4 font-medium transition-colors border-b-2
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
                                    <h3 className="text-neutral-600 dark:text-neutral-400">This Month</h3>
                                    <DollarSign className="h-8 w-8 text-blue-600" />
                                </div>
                                <p className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">$4,639.43</p>
                                <p className="text-sm text-green-600 dark:text-green-400">+23% from last month</p>
                            </div>

                            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-neutral-600 dark:text-neutral-400">Total Orders</h3>
                                    <Package className="h-8 w-8 text-purple-600" />
                                </div>
                                <p className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">57</p>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">4 pending</p>
                            </div>

                            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-neutral-600 dark:text-neutral-400">Total Savings</h3>
                                    <TrendingUp className="h-8 w-8 text-green-600" />
                                </div>
                                <p className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">$1,234.56</p>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">Bulk discounts</p>
                            </div>

                            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-neutral-600 dark:text-neutral-400">Avg. Delivery</h3>
                                    <Clock className="h-8 w-8 text-orange-600" />
                                </div>
                                <p className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">2.3 days</p>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">Express available</p>
                            </div>
                        </div>

                        {/* Bulk Discounts */}
                        <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
                            <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
                                Your Bulk Discount Tiers
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                    <tr className="border-b border-neutral-200 dark:border-neutral-700">
                                        <th className="text-left py-3 px-4 text-neutral-600 dark:text-neutral-400">Order Quantity</th>
                                        <th className="text-left py-3 px-4 text-neutral-600 dark:text-neutral-400">Discount Rate</th>
                                        <th className="text-left py-3 px-4 text-neutral-600 dark:text-neutral-400">Example Savings</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr className="border-b border-neutral-200 dark:border-neutral-700">
                                        <td className="py-3 px-4 text-neutral-900 dark:text-white">1-9 units</td>
                                        <td className="py-3 px-4 text-neutral-900 dark:text-white">Base price</td>
                                        <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">$0.00</td>
                                    </tr>
                                    <tr className="border-b border-neutral-200 dark:border-neutral-700 bg-blue-50 dark:bg-blue-900/20">
                                        <td className="py-3 px-4 text-neutral-900 dark:text-white font-medium">10-49 units</td>
                                        <td className="py-3 px-4 text-blue-600 dark:text-blue-400 font-bold">8% OFF</td>
                                        <td className="py-3 px-4 text-green-600 dark:text-green-400 font-medium">Save $48.00</td>
                                    </tr>
                                    <tr className="border-b border-neutral-200 dark:border-neutral-700 bg-purple-50 dark:bg-purple-900/20">
                                        <td className="py-3 px-4 text-neutral-900 dark:text-white font-medium">50-99 units</td>
                                        <td className="py-3 px-4 text-purple-600 dark:text-purple-400 font-bold">17% OFF</td>
                                        <td className="py-3 px-4 text-green-600 dark:text-green-400 font-medium">Save $510.00</td>
                                    </tr>
                                    <tr className="bg-green-50 dark:bg-green-900/20">
                                        <td className="py-3 px-4 text-neutral-900 dark:text-white font-medium">100+ units</td>
                                        <td className="py-3 px-4 text-green-600 dark:text-green-400 font-bold">25% OFF</td>
                                        <td className="py-3 px-4 text-green-600 dark:text-green-400 font-medium">Save $1,500.00</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Recent Orders */}
                        <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
                            <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
                                Recent Orders
                            </h2>
                            <div className="space-y-3">
                                {ORDER_HISTORY.slice(0, 3).map(order => (
                                    <div key={order.id} className="flex items-center justify-between py-3 border-b border-neutral-200 dark:border-neutral-700">
                                        <div>
                                            <p className="font-semibold text-neutral-900 dark:text-white">{order.id}</p>
                                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                                {order.date} • {order.items} items
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-neutral-900 dark:text-white">${order.total.toFixed(2)}</p>
                                            <span className={`
                        text-sm px-2 py-1 rounded
                        ${order.status === 'Delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : ''}
                        ${order.status === 'Shipped' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                        ${order.status === 'Processing' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : ''}
                      `}>
                        {order.status}
                      </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
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
                                Quick Order by SKU
                            </h2>
                            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                                Enter product SKUs to quickly add items to your order. Bulk discounts applied automatically.
                            </p>

                            {/* SKU Input */}
                            <div className="flex gap-3 mb-6">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={skuInput}
                                        onChange={(e) => setSkuInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && addToOrder()}
                                        placeholder="Enter SKU (e.g., IP15PM-OLED-01)"
                                        className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                                    />
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
                                    onClick={addToOrder}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-semibold"
                                >
                                    <Plus className="h-5 w-5" />
                                    Add
                                </button>
                            </div>

                            {/* Common SKUs */}
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">
                                    Common SKUs:
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {QUICK_ORDER_ITEMS.map(item => (
                                        <button
                                            key={item.sku}
                                            onClick={() => setSkuInput(item.sku)}
                                            className="px-3 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors text-sm"
                                        >
                                            {item.sku}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Order Items */}
                            {orderItems.length > 0 && (
                                <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
                                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">
                                        Current Order
                                    </h3>
                                    <div className="space-y-3 mb-6">
                                        {orderItems.map((item, index) => {
                                            const product = QUICK_ORDER_ITEMS.find(p => p.sku === item.sku)
                                            return (
                                                <div key={index} className="flex items-center justify-between py-3 px-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-neutral-900 dark:text-white">
                                                            {product?.name || item.sku}
                                                        </p>
                                                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                                            SKU: {item.sku} • Qty: {item.quantity}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <p className="font-bold text-neutral-900 dark:text-white">
                                                            ${product ? (product.price * item.quantity).toFixed(2) : '0.00'}
                                                        </p>
                                                        <button
                                                            onClick={() => removeFromOrder(index)}
                                                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                                        >
                                                            <Trash2 className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>

                                    {/* Order Summary */}
                                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-neutral-600 dark:text-neutral-400">Subtotal</span>
                                            <span className="font-semibold text-neutral-900 dark:text-white">
                        ${calculateOrderTotal().toFixed(2)}
                      </span>
                                        </div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-neutral-600 dark:text-neutral-400">Bulk Discount (8%)</span>
                                            <span className="font-semibold text-green-600 dark:text-green-400">
                        -${(calculateOrderTotal() * 0.08).toFixed(2)}
                      </span>
                                        </div>
                                        <div className="border-t border-blue-200 dark:border-blue-800 pt-2 mt-2">
                                            <div className="flex justify-between">
                                                <span className="text-lg font-bold text-neutral-900 dark:text-white">Total</span>
                                                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          ${(calculateOrderTotal() * 0.92).toFixed(2)}
                        </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 mt-6">
                                        <button className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                                            Place Order
                                        </button>
                                        <button className="px-6 py-3 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
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
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search orders..."
                                    className="pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                <tr className="border-b border-neutral-200 dark:border-neutral-700">
                                    <th className="text-left py-3 px-4 text-neutral-600 dark:text-neutral-400">Order ID</th>
                                    <th className="text-left py-3 px-4 text-neutral-600 dark:text-neutral-400">Date</th>
                                    <th className="text-left py-3 px-4 text-neutral-600 dark:text-neutral-400">Items</th>
                                    <th className="text-left py-3 px-4 text-neutral-600 dark:text-neutral-400">Total</th>
                                    <th className="text-left py-3 px-4 text-neutral-600 dark:text-neutral-400">Status</th>
                                    <th className="text-left py-3 px-4 text-neutral-600 dark:text-neutral-400">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {ORDER_HISTORY.map(order => (
                                    <tr key={order.id} className="border-b border-neutral-200 dark:border-neutral-700">
                                        <td className="py-4 px-4">
                                            <span className="font-semibold text-neutral-900 dark:text-white">{order.id}</span>
                                        </td>
                                        <td className="py-4 px-4 text-neutral-700 dark:text-neutral-300">{order.date}</td>
                                        <td className="py-4 px-4 text-neutral-700 dark:text-neutral-300">{order.items}</td>
                                        <td className="py-4 px-4">
                                            <span className="font-bold text-neutral-900 dark:text-white">${order.total.toFixed(2)}</span>
                                        </td>
                                        <td className="py-4 px-4">
                        <span className={`
                          px-3 py-1 rounded text-sm font-medium
                          ${order.status === 'Delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : ''}
                          ${order.status === 'Shipped' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                          ${order.status === 'Processing' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : ''}
                        `}>
                          {order.status}
                        </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex gap-2">
                                                {order.invoice && (
                                                    <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors">
                                                        <Download className="h-5 w-5" />
                                                    </button>
                                                )}
                                                <button className="p-2 text-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700 rounded transition-colors">
                                                    <Copy className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Saved Templates */}
                {activeTab === 'templates' && (
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700 mb-6">
                            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                                Saved Order Templates
                            </h2>
                            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                                Save frequently ordered items as templates for quick reordering.
                            </p>

                            <div className="space-y-4">
                                {SAVED_TEMPLATES.map(template => (
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
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                                                    ${template.total.toFixed(2)}
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
                                            <button className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
                                                Edit
                                            </button>
                                            <button className="px-4 py-2 border border-red-300 dark:border-red-600 text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
