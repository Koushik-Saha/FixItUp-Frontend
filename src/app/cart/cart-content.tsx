'use client'

import { useState, useEffect } from 'react'
import { Trash2, Plus, Minus, Tag, ShoppingCart, ArrowRight, X, Loader2, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { getCart, updateCartItem, removeFromCart, CartItem, CartSummary } from '@/lib/api/cart'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

export default function CartContent() {
    const router = useRouter()
    const { user } = useAuth()
    
    // State
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [cartSummary, setCartSummary] = useState<CartSummary | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [updateLoading, setUpdateLoading] = useState<string | null>(null)
    const [removeLoading, setRemoveLoading] = useState<string | null>(null)
    
    // Coupon and shipping states
    const [couponCode, setCouponCode] = useState('')
    const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount: number} | null>(null)
    const [zipCode, setZipCode] = useState('')
    const [shippingEstimate, setShippingEstimate] = useState<number | null>(null)

    // Load cart data
    const loadCart = async () => {
        try {
            setLoading(true)
            setError(null)
            
            const response = await getCart()
            setCartItems(response.data.items)
            setCartSummary(response.data.summary)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load cart')
        } finally {
            setLoading(false)
        }
    }

    // Update quantity
    const handleUpdateQuantity = async (itemId: string, change: number) => {
        try {
            setUpdateLoading(itemId)
            
            const currentItem = cartItems.find(item => item.id === itemId)
            if (!currentItem) return
            
            const newQuantity = Math.max(1, currentItem.quantity + change)
            
            await updateCartItem(itemId, newQuantity)
            await loadCart() // Reload to get updated pricing
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update quantity')
        } finally {
            setUpdateLoading(null)
        }
    }

    // Remove item
    const handleRemoveItem = async (itemId: string) => {
        try {
            setRemoveLoading(itemId)
            await removeFromCart(itemId)
            await loadCart() // Reload cart
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to remove item')
        } finally {
            setRemoveLoading(null)
        }
    }

    // Apply coupon (mock functionality)
    const applyCoupon = () => {
        const coupons: Record<string, number> = { 
            'SAVE10': 10, 
            'WELCOME': 15, 
            'REPAIR20': 20,
            'NEWUSER': 25
        }
        
        if (coupons[couponCode.toUpperCase()]) {
            setAppliedCoupon({ 
                code: couponCode.toUpperCase(), 
                discount: coupons[couponCode.toUpperCase()] 
            })
            setCouponCode('')
        } else {
            setError('Invalid coupon code')
            setTimeout(() => setError(null), 3000)
        }
    }

    // Calculate shipping (mock functionality)
    const calculateShipping = () => {
        if (zipCode.length === 5) {
            const subtotal = cartSummary?.subtotal || 0
            setShippingEstimate(subtotal > 50 ? 0 : 9.99)
        }
    }

    // Load cart on mount and when user changes
    useEffect(() => {
        if (user) {
            loadCart()
        } else {
            // Guest user - cart will be managed via localStorage/Zustand
            // Show empty state or load from Zustand store
            setLoading(false)
            setCartItems([])
            setCartSummary({
                subtotal: 0,
                total_items: 0,
                total_savings: 0,
                is_wholesale: false,
                wholesale_tier: null,
            })
        }
    }, [user])

    // Calculate totals with coupons and shipping
    const subtotal = cartSummary?.subtotal || 0
    const wholesaleSavings = cartSummary?.total_savings || 0
    const discount = appliedCoupon ? (subtotal * appliedCoupon.discount / 100) : 0
    const shipping = shippingEstimate !== null ? shippingEstimate : 0
    const finalTotal = subtotal - discount + shipping

    // Loading state
    if (loading && !error && cartItems.length <= 0 ) {
        return (
            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                    <p className="text-neutral-600 dark:text-neutral-400">Loading cart...</p>
                </div>
            </div>
        )
    }

    // Error state
    if (error && !cartItems.length) {
        return (
            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center p-4">
                <Alert className="max-w-md">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        {error}
                        <Button 
                            onClick={loadCart} 
                            variant="outline" 
                            size="sm" 
                            className="mt-2 w-full"
                        >
                            Try Again
                        </Button>
                    </AlertDescription>
                </Alert>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
            {/* Error Toast */}
            {error && (
                <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
                    {error}
                </div>
            )}

            {/* Header */}
            <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                <div className="container mx-auto px-4 py-6">
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-white flex items-center gap-3">
                        <ShoppingCart className="h-8 w-8" />
                        Shopping Cart ({cartItems.length} items)
                    </h1>
                    {cartSummary?.is_wholesale && (
                        <p className="text-green-600 dark:text-green-400 mt-2">
                            🎉 Wholesale pricing applied • Saving ${wholesaleSavings.toFixed(2)}
                        </p>
                    )}
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {cartItems.length === 0 ? (
                    <div className="text-center py-16">
                        <ShoppingCart className="h-24 w-24 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Your cart is empty</h2>
                        <p className="text-neutral-600 dark:text-neutral-400 mb-6">Add some products to get started!</p>
                        <Button asChild size="lg">
                            <Link href="/shop">
                                Browse Products
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-[1fr_400px] gap-8">
                        {/* Cart Items */}
                        <div className="space-y-4">
                            {cartItems.map(item => (
                                <div key={item.id} className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
                                    <div className="flex gap-6">
                                        {/* Product Image */}
                                        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                                            {item.product.image ? (
                                                <Image
                                                    src={item.product.image}
                                                    alt={item.product.name}
                                                    width={96}
                                                    height={96}
                                                    className="object-cover w-full h-full"
                                                />
                                            ) : (
                                                <span className="text-4xl">{item.product.brand?.[0] || 'P'}</span>
                                            )}
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-1">
                                            <Link href={`/products/${item.product.id}`}>
                                                <h3 className="font-bold text-neutral-900 dark:text-white mb-1 hover:text-blue-600 dark:hover:text-blue-400">
                                                    {item.product.name}
                                                </h3>
                                            </Link>
                                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                                                SKU: {item.product.sku} | {item.product.brand}
                                            </p>
                                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                                                Device: {item.product.device_model}
                                            </p>
                                            
                                            {/* Stock Info */}
                                            <p className={`text-sm font-medium mb-3 ${
                                                item.product.in_stock
                                                    ? 'text-green-600 dark:text-green-400'
                                                    : 'text-red-600 dark:text-red-400'
                                            }`}>
                                                {item.product.in_stock 
                                                    ? `${item.product.available_quantity} available` 
                                                    : 'Out of stock'
                                                }
                                            </p>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center border border-neutral-300 dark:border-neutral-600 rounded-lg">
                                                    <button 
                                                        onClick={() => handleUpdateQuantity(item.id, -1)} 
                                                        disabled={updateLoading === item.id || item.quantity <= 1}
                                                        className="px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </button>
                                                    <span className="px-4 py-2 border-x border-neutral-300 dark:border-neutral-600 font-semibold">
                                                        {updateLoading === item.id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            item.quantity
                                                        )}
                                                    </span>
                                                    <button 
                                                        onClick={() => handleUpdateQuantity(item.id, 1)} 
                                                        disabled={updateLoading === item.id || item.quantity >= item.product.available_quantity}
                                                        className="px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                
                                                <button 
                                                    onClick={() => handleRemoveItem(item.id)} 
                                                    disabled={removeLoading === item.id}
                                                    className="text-red-600 hover:text-red-700 flex items-center gap-1 disabled:opacity-50"
                                                >
                                                    {removeLoading === item.id ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="h-4 w-4" />
                                                    )}
                                                    Remove
                                                </button>
                                            </div>
                                        </div>

                                        {/* Pricing */}
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                                                ${item.pricing.subtotal.toFixed(2)}
                                            </p>
                                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                                ${item.pricing.unit_price.toFixed(2)} each
                                            </p>
                                            {item.pricing.discount_percentage > 0 && (
                                                <p className="text-sm text-green-600 dark:text-green-400">
                                                    -{item.pricing.discount_percentage}% wholesale
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div>
                            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700 sticky top-4 space-y-6">
                                <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Order Summary</h2>

                                {/* Coupon Code */}
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                        Coupon Code
                                    </label>
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            value={couponCode} 
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && applyCoupon()}
                                            placeholder="Enter code" 
                                            className="flex-1 px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white" 
                                        />
                                        <Button onClick={applyCoupon}>
                                            Apply
                                        </Button>
                                    </div>
                                    {appliedCoupon && (
                                        <div className="mt-2 flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                                            <span className="text-sm text-green-700 dark:text-green-400">
                                                {appliedCoupon.code} ({appliedCoupon.discount}% off)
                                            </span>
                                            <button 
                                                onClick={() => setAppliedCoupon(null)} 
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Shipping Estimate */}
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                        Shipping Estimate
                                    </label>
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            value={zipCode} 
                                            onChange={(e) => setZipCode(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && calculateShipping()}
                                            placeholder="ZIP Code" 
                                            maxLength={5} 
                                            className="flex-1 px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white" 
                                        />
                                        <Button variant="outline" onClick={calculateShipping}>
                                            Calculate
                                        </Button>
                                    </div>
                                    {shippingEstimate !== null && (
                                        <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                                            {shippingEstimate === 0 ? '✓ Free shipping!' : `Shipping: $${shippingEstimate.toFixed(2)}`}
                                        </p>
                                    )}
                                </div>

                                {/* Totals */}
                                <div className="space-y-3 border-t border-neutral-200 dark:border-neutral-700 pt-4">
                                    <div className="flex justify-between text-neutral-700 dark:text-neutral-300">
                                        <span>Subtotal</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    
                                    {wholesaleSavings > 0 && (
                                        <div className="flex justify-between text-green-600 dark:text-green-400">
                                            <span>Wholesale Savings</span>
                                            <span>-${wholesaleSavings.toFixed(2)}</span>
                                        </div>
                                    )}
                                    
                                    {appliedCoupon && (
                                        <div className="flex justify-between text-green-600 dark:text-green-400">
                                            <span>Discount ({appliedCoupon.discount}%)</span>
                                            <span>-${discount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    
                                    {shippingEstimate !== null && (
                                        <div className="flex justify-between text-neutral-700 dark:text-neutral-300">
                                            <span>Shipping</span>
                                            <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                                        </div>
                                    )}
                                    
                                    <div className="flex justify-between text-xl font-bold text-neutral-900 dark:text-white border-t border-neutral-200 dark:border-neutral-700 pt-3">
                                        <span>Total</span>
                                        <span>${finalTotal.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Checkout Button */}
                                <Button asChild size="lg" className="w-full">
                                    <Link href="/checkout">
                                        Proceed to Checkout <ArrowRight className="h-5 w-5 ml-2" />
                                    </Link>
                                </Button>

                                <Link href="/shop" className="block text-center text-blue-600 dark:text-blue-400 hover:underline">
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
