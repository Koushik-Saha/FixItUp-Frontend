'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, Package, Truck, Calendar, MapPin, CreditCard, Download, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function OrderConfirmationPage() {
    const [orderNumber, setOrderNumber] = useState('')

    useEffect(() => {
        // Get order number from URL
        const params = new URLSearchParams(window.location.search)
        const order = params.get('order') || 'ORD-' + Date.now().toString().slice(-6)
        setOrderNumber(order)
    }, [])

    // Sample order data
    const order = {
        number: orderNumber,
        date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
        items: [
            {
                id: 1,
                name: 'iPhone 15 Pro Max OLED Display',
                sku: 'IP15PM-OLED-01',
                price: 89.99,
                quantity: 1,
                image: '/images/products/iphone-15-display.jpg'
            },
            {
                id: 2,
                name: 'Premium Phone Repair Tool Kit',
                sku: 'TK-PREM-01',
                price: 49.99,
                quantity: 1,
                image: '/images/products/tool-kit.jpg'
            }
        ],
        shipping: {
            firstName: 'John',
            lastName: 'Smith',
            address: '123 Main Street',
            city: 'Santa Barbara',
            state: 'CA',
            zipCode: '93105',
            country: 'United States'
        },
        shippingMethod: 'Standard Shipping (5-7 business days)',
        payment: {
            method: 'Visa ending in 4242',
            amount: 139.98
        },
        subtotal: 139.98,
        shipping: 0,
        tax: 12.25,
        total: 152.23,
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">

            {/* Success Banner */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-12">
                <div className="container mx-auto px-4 text-center">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="h-12 w-12 text-green-600" />
                    </div>
                    <h1 className="text-4xl font-bold mb-4">
                        Order Confirmed!
                    </h1>
                    <p className="text-xl text-green-100 mb-6">
                        Thank you for your purchase. Your order has been received.
                    </p>
                    <p className="text-lg">
                        Order Number: <span className="font-bold text-2xl">{orderNumber}</span>
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">

                    {/* Important Info */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8">
                        <div className="flex items-start gap-4">
                            <CheckCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-bold text-neutral-900 dark:text-white mb-2">
                                    What happens next?
                                </h3>
                                <ul className="space-y-2 text-neutral-700 dark:text-neutral-300">
                                    <li>• You'll receive an email confirmation at the address provided</li>
                                    <li>• We'll send you tracking information once your order ships</li>
                                    <li>• Estimated delivery: <strong>{order.estimatedDelivery}</strong></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <Link
                            href={`/order-tracking?order=${orderNumber}`}
                            className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-shadow text-center group"
                        >
                            <Truck className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                            <h3 className="font-bold text-neutral-900 dark:text-white mb-1">Track Order</h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                                Monitor your shipment
                            </p>
                            <span className="text-blue-600 dark:text-blue-400 text-sm flex items-center justify-center gap-1 group-hover:gap-2 transition-all">
                Track Now <ArrowRight className="h-4 w-4" />
              </span>
                        </Link>

                        <button
                            onClick={() => window.print()}
                            className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-shadow text-center group"
                        >
                            <Download className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                            <h3 className="font-bold text-neutral-900 dark:text-white mb-1">Download Invoice</h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                                Save for your records
                            </p>
                            <span className="text-blue-600 dark:text-blue-400 text-sm flex items-center justify-center gap-1 group-hover:gap-2 transition-all">
                Download <ArrowRight className="h-4 w-4" />
              </span>
                        </button>

                        <Link
                            href="/shop"
                            className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-shadow text-center group"
                        >
                            <Package className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                            <h3 className="font-bold text-neutral-900 dark:text-white mb-1">Continue Shopping</h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                                Browse more products
                            </p>
                            <span className="text-blue-600 dark:text-blue-400 text-sm flex items-center justify-center gap-1 group-hover:gap-2 transition-all">
                Shop Now <ArrowRight className="h-4 w-4" />
              </span>
                        </Link>
                    </div>

                    {/* Order Details */}
                    <div className="bg-white dark:bg-neutral-800 rounded-lg p-8 border border-neutral-200 dark:border-neutral-700 mb-8">
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
                            Order Details
                        </h2>

                        {/* Order Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Calendar className="h-5 w-5 text-neutral-400" />
                                    <h3 className="font-semibold text-neutral-900 dark:text-white">Order Date</h3>
                                </div>
                                <p className="text-neutral-700 dark:text-neutral-300">{order.date}</p>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Truck className="h-5 w-5 text-neutral-400" />
                                    <h3 className="font-semibold text-neutral-900 dark:text-white">Estimated Delivery</h3>
                                </div>
                                <p className="text-neutral-700 dark:text-neutral-300">{order.estimatedDelivery}</p>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <CreditCard className="h-5 w-5 text-neutral-400" />
                                    <h3 className="font-semibold text-neutral-900 dark:text-white">Payment Method</h3>
                                </div>
                                <p className="text-neutral-700 dark:text-neutral-300">{order.payment.method}</p>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Package className="h-5 w-5 text-neutral-400" />
                                    <h3 className="font-semibold text-neutral-900 dark:text-white">Shipping Method</h3>
                                </div>
                                <p className="text-neutral-700 dark:text-neutral-300">{order.shippingMethod}</p>
                            </div>
                        </div>

                        {/* Items Purchased */}
                        <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6 mb-6">
                            <h3 className="font-bold text-neutral-900 dark:text-white mb-4">
                                Items Purchased
                            </h3>
                            <div className="space-y-4">
                                {order.items.map(item => (
                                    <div key={item.id} className="flex gap-4 py-4 border-b border-neutral-200 dark:border-neutral-700 last:border-0">
                                        <div className="w-20 h-20 bg-neutral-100 dark:bg-neutral-700 rounded flex items-center justify-center flex-shrink-0">
                                            <span className="text-3xl">📦</span>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-neutral-900 dark:text-white mb-1">
                                                {item.name}
                                            </h4>
                                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                                                SKU: {item.sku}
                                            </p>
                                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                                Quantity: {item.quantity}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-neutral-900 dark:text-white">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Totals */}
                        <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
                            <div className="space-y-3 max-w-sm ml-auto">
                                <div className="flex justify-between text-neutral-700 dark:text-neutral-300">
                                    <span>Subtotal</span>
                                    <span>${order.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-neutral-700 dark:text-neutral-300">
                                    <span>Shipping</span>
                                    <span>{order.shipping === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`}</span>
                                </div>
                                <div className="flex justify-between text-neutral-700 dark:text-neutral-300">
                                    <span>Tax</span>
                                    <span>${order.tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold text-neutral-900 dark:text-white border-t border-neutral-200 dark:border-neutral-700 pt-3">
                                    <span>Total Paid</span>
                                    <span>${order.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white dark:bg-neutral-800 rounded-lg p-8 border border-neutral-200 dark:border-neutral-700 mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <MapPin className="h-6 w-6 text-blue-600" />
                            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                                Shipping Address
                            </h2>
                        </div>
                        <div className="text-neutral-700 dark:text-neutral-300">
                            <p className="font-semibold">
                                {order.shipping.firstName} {order.shipping.lastName}
                            </p>
                            <p>{order.shipping.address}</p>
                            <p>
                                {order.shipping.city}, {order.shipping.state} {order.shipping.zipCode}
                            </p>
                            <p>{order.shipping.country}</p>
                        </div>
                    </div>

                    {/* Customer Support */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                        <h3 className="font-bold text-neutral-900 dark:text-white mb-3">
                            Need Help?
                        </h3>
                        <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                            If you have any questions about your order, our customer support team is here to help.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="/contact"
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                Contact Support
                            </Link>
                            <Link
                                href="/account"
                                className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors font-medium"
                            >
                                View Account
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
