'use client'

import { useState } from 'react'
import { Trash2, Plus, Minus, Tag, ShoppingCart, ArrowRight, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function CartPage() {
    const [cart, setCart] = useState([
        { id: 1, name: 'iPhone 15 Pro Max OLED Display', sku: 'IP15PM-OLED-01', price: 89.99, quantity: 1, image: '/images/products/iphone-15-display.jpg' },
        { id: 2, name: 'Premium Phone Repair Tool Kit', sku: 'TK-PREM-01', price: 49.99, quantity: 1, image: '/images/products/tool-kit.jpg' },
        { id: 3, name: 'Samsung S24 Ultra Screen', sku: 'S24U-SCR-01', price: 129.99, quantity: 1, image: '/images/products/s24-display.jpg' }
    ])

    const [couponCode, setCouponCode] = useState('')
    const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount: number} | null>(null)
    const [zipCode, setZipCode] = useState('')
    const [shippingEstimate, setShippingEstimate] = useState<number | null>(null)

    const updateQuantity = (id: number, change: number) => {
        setCart(cart.map(item =>
            item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
        ))
    }

    const removeItem = (id: number) => {
        setCart(cart.filter(item => item.id !== id))
    }

    const applyCoupon = () => {
        const coupons: Record<string, number> = { 'SAVE10': 10, 'WELCOME': 15, 'REPAIR20': 20 }
        if (coupons[couponCode.toUpperCase()]) {
            setAppliedCoupon({ code: couponCode.toUpperCase(), discount: coupons[couponCode.toUpperCase()] })
            setCouponCode('')
        } else {
            alert('Invalid coupon code')
        }
    }

    const calculateShipping = () => {
        if (zipCode.length === 5) {
            setShippingEstimate(subtotal > 50 ? 0 : 9.99)
        }
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const discount = appliedCoupon ? (subtotal * appliedCoupon.discount / 100) : 0
    const shipping = shippingEstimate !== null ? shippingEstimate : 0
    const total = subtotal - discount + shipping

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
            <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                <div className="container mx-auto px-4 py-6">
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-white flex items-center gap-3">
                        <ShoppingCart className="h-8 w-8" />
                        Shopping Cart ({cart.length} items)
                    </h1>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {cart.length === 0 ? (
                    <div className="text-center py-16">
                        <ShoppingCart className="h-24 w-24 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Your cart is empty</h2>
                        <p className="text-neutral-600 dark:text-neutral-400 mb-6">Add some products to get started!</p>
                        <Link href="/shop" className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-[1fr_400px] gap-8">
                        <div className="space-y-4">
                            {cart.map(item => (
                                <div key={item.id} className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
                                    <div className="flex gap-6">
                                        <div className="w-24 h-24 bg-neutral-100 dark:bg-neutral-700 rounded flex items-center justify-center flex-shrink-0">
                                            <span className="text-4xl">📦</span>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-neutral-900 dark:text-white mb-1">{item.name}</h3>
                                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">SKU: {item.sku}</p>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center border border-neutral-300 dark:border-neutral-600 rounded-lg">
                                                    <button onClick={() => updateQuantity(item.id, -1)} className="px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                                                        <Minus className="h-4 w-4" />
                                                    </button>
                                                    <span className="px-4 py-2 border-x border-neutral-300 dark:border-neutral-600 font-semibold">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, 1)} className="px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                                                        <Plus className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                <button onClick={() => removeItem(item.id)} className="text-red-600 hover:text-red-700 flex items-center gap-1">
                                                    <Trash2 className="h-4 w-4" />
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-neutral-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</p>
                                            <p className="text-sm text-neutral-600 dark:text-neutral-400">${item.price.toFixed(2)} each</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div>
                            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700 sticky top-4 space-y-6">
                                <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Order Summary</h2>

                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Coupon Code</label>
                                    <div className="flex gap-2">
                                        <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Enter code" className="flex-1 px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white" />
                                        <button onClick={applyCoupon} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Apply</button>
                                    </div>
                                    {appliedCoupon && (
                                        <div className="mt-2 flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                                            <span className="text-sm text-green-700 dark:text-green-400">{appliedCoupon.code} ({appliedCoupon.discount}% off)</span>
                                            <button onClick={() => setAppliedCoupon(null)} className="text-red-600 hover:text-red-700"><X className="h-4 w-4" /></button>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Shipping Estimate</label>
                                    <div className="flex gap-2">
                                        <input type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value)} placeholder="ZIP Code" maxLength={5} className="flex-1 px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white" />
                                        <button onClick={calculateShipping} className="px-4 py-2 bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors">Calculate</button>
                                    </div>
                                    {shippingEstimate !== null && (
                                        <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                                            {shippingEstimate === 0 ? '✓ Free shipping!' : `Shipping: $${shippingEstimate.toFixed(2)}`}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-3 border-t border-neutral-200 dark:border-neutral-700 pt-4">
                                    <div className="flex justify-between text-neutral-700 dark:text-neutral-300"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                                    {appliedCoupon && <div className="flex justify-between text-green-600 dark:text-green-400"><span>Discount ({appliedCoupon.discount}%)</span><span>-${discount.toFixed(2)}</span></div>}
                                    {shippingEstimate !== null && <div className="flex justify-between text-neutral-700 dark:text-neutral-300"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span></div>}
                                    <div className="flex justify-between text-xl font-bold text-neutral-900 dark:text-white border-t border-neutral-200 dark:border-neutral-700 pt-3"><span>Total</span><span>${total.toFixed(2)}</span></div>
                                </div>

                                <Link href="/checkout" className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold text-lg flex items-center justify-center gap-2">
                                    Proceed to Checkout <ArrowRight className="h-6 w-6" />
                                </Link>

                                <Link href="/shop" className="block text-center text-blue-600 dark:text-blue-400 hover:underline">Continue Shopping</Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
