/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-html-link-for-pages */
'use client'

import { useState } from 'react'
import { Search, Package, Truck, CheckCircle, Clock, ExternalLink } from 'lucide-react'

const ORDER_STATUSES = [
    { id: 'processing', label: 'Order Processing', icon: Clock, description: 'Your order is being prepared' },
    { id: 'shipped', label: 'Shipped', icon: Truck, description: 'Your order is on the way' },
    { id: 'delivered', label: 'Delivered', icon: CheckCircle, description: 'Your order has been delivered' }
]

export default function OrderTrackingPage() {
    const [orderNumber, setOrderNumber] = useState('')
    const [email, setEmail] = useState('')
    const [tracking, setTracking] = useState<any>(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            // Call API to track order
            const response = await fetch('/api/orders/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    order_number: orderNumber,
                    email: email,
                }),
            })

            const result = await response.json()

            if (!response.ok) {
                setError(result.error || 'Failed to track order')
                setTracking(null)
                return
            }

            // Transform API response to match UI expectations
            const order = result.data
            setTracking({
                number: order.order_number,
                status: order.status,
                email: email,
                items: order.items.map((item: any) => ({
                    name: item.product_name,
                    quantity: item.quantity,
                })),
                trackingNumber: order.tracking_number || 'N/A',
                carrier: order.carrier || 'Not shipped yet',
                carrierLink: getCarrierLink(order.carrier),
                estimatedDelivery: order.delivered_at
                    ? `Delivered on ${new Date(order.delivered_at).toLocaleDateString()}`
                    : order.shipped_at
                        ? 'In Transit'
                        : 'Processing',
                currentLocation: getStatusLabel(order.status),
                timeline: generateTimeline(order),
            })
        } catch (err: any) {
            setError(err.message || 'Failed to track order')
            setTracking(null)
        } finally {
            setLoading(false)
        }
    }

    const getCarrierLink = (carrier: string | null) => {
        if (!carrier) return ''
        const carriers: Record<string, string> = {
            'USPS': 'https://tools.usps.com/go/TrackConfirmAction?tLabels=',
            'FedEx': 'https://www.fedex.com/fedextrack/?trknbr=',
            'UPS': 'https://www.ups.com/track?loc=en_US&tracknum=',
        }
        return carriers[carrier] || ''
    }

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            pending: 'Order Received',
            processing: 'Processing Order',
            shipped: 'In Transit',
            delivered: 'Delivered',
            cancelled: 'Cancelled',
        }
        return labels[status] || status
    }

    const generateTimeline = (order: any) => {
        const timeline = []

        timeline.push({
            date: new Date(order.created_at).toLocaleString(),
            status: 'Order Placed',
            location: 'Online',
        })

        if (order.status !== 'pending') {
            timeline.push({
                date: new Date(order.updated_at).toLocaleString(),
                status: 'Order Processed',
                location: order.shipping_address?.city || 'Processing Center',
            })
        }

        if (order.shipped_at) {
            timeline.push({
                date: new Date(order.shipped_at).toLocaleString(),
                status: 'Shipped',
                location: order.shipping_address?.city || 'Warehouse',
            })
        }

        if (order.delivered_at) {
            timeline.push({
                date: new Date(order.delivered_at).toLocaleString(),
                status: 'Delivered',
                location: order.shipping_address?.city || 'Destination',
            })
        }

        return timeline.reverse()
    }

    const getStatusIndex = (status: string) => {
        return ORDER_STATUSES.findIndex(s => s.id === status)
    }

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">

            {/* Header */}
            <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                        Track Your Order
                    </h1>
                    <p className="text-neutral-600 dark:text-neutral-400">
                        Enter your order details to check the status of your shipment
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-2xl mx-auto">

                    {/* Tracking Form */}
                    <div className="bg-white dark:bg-neutral-800 rounded-lg p-8 border border-neutral-200 dark:border-neutral-700 mb-8">
                        <form onSubmit={handleTrack} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                    Order Number *
                                </label>
                                <input
                                    type="text"
                                    value={orderNumber}
                                    onChange={(e) => setOrderNumber(e.target.value)}
                                    placeholder="ORD-123456"
                                    className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="john@example.com"
                                    className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                                    required
                                />
                            </div>

                            {error && (
                                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                    <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Tracking...
                                    </>
                                ) : (
                                    <>
                                        <Search className="h-5 w-5" />
                                        Track Order
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                            <p className="text-sm text-neutral-700 dark:text-neutral-300">
                                <strong>Note:</strong> Your order number can be found in the confirmation email sent to you after placing your order.
                            </p>
                        </div>
                    </div>

                    {/* Tracking Results */}
                    {tracking && (
                        <div className="space-y-6">

                            {/* Status Progress */}
                            <div className="bg-white dark:bg-neutral-800 rounded-lg p-8 border border-neutral-200 dark:border-neutral-700">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">
                                            Order {tracking.number}
                                        </h2>
                                        <p className="text-neutral-600 dark:text-neutral-400">
                                            Current Status: <span className="font-semibold capitalize">{tracking.status}</span>
                                        </p>
                                    </div>
                                    <Package className="h-12 w-12 text-blue-600" />
                                </div>

                                {/* Progress Bar */}
                                <div className="relative mb-12">
                                    <div className="flex items-center justify-between">
                                        {ORDER_STATUSES.map((status, index) => {
                                            const StatusIcon = status.icon
                                            const currentIndex = getStatusIndex(tracking.status)
                                            const isComplete = index <= currentIndex
                                            const isCurrent = index === currentIndex

                                            return (
                                                <div key={status.id} className="flex-1 relative">
                                                    <div className="flex flex-col items-center">
                                                        {/* Icon */}
                                                        <div className={`
                              w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-all
                              ${isComplete ? 'bg-green-600' : 'bg-neutral-200 dark:bg-neutral-700'}
                              ${isCurrent ? 'ring-4 ring-blue-200 dark:ring-blue-800' : ''}
                            `}>
                                                            <StatusIcon className={`h-8 w-8 ${isComplete ? 'text-white' : 'text-neutral-400'}`} />
                                                        </div>

                                                        {/* Label */}
                                                        <p className={`text-sm font-semibold text-center ${isComplete ? 'text-neutral-900 dark:text-white' : 'text-neutral-500 dark:text-neutral-400'
                                                            }`}>
                                                            {status.label}
                                                        </p>
                                                        <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center mt-1">
                                                            {status.description}
                                                        </p>
                                                    </div>

                                                    {/* Connector Line */}
                                                    {index < ORDER_STATUSES.length - 1 && (
                                                        <div className={`absolute top-8 left-1/2 w-full h-1 -z-10 ${index < currentIndex ? 'bg-green-600' : 'bg-neutral-200 dark:bg-neutral-700'
                                                            }`} />
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Current Location */}
                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Truck className="h-6 w-6 text-blue-600" />
                                        <h3 className="font-bold text-neutral-900 dark:text-white">Current Location</h3>
                                    </div>
                                    <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-2">
                                        {tracking.currentLocation}
                                    </p>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                        Estimated Delivery: <strong>{tracking.estimatedDelivery}</strong>
                                    </p>
                                </div>
                            </div>

                            {/* Tracking Details */}
                            <div className="bg-white dark:bg-neutral-800 rounded-lg p-8 border border-neutral-200 dark:border-neutral-700">
                                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">
                                    Tracking Details
                                </h3>

                                {/* Carrier Info */}
                                <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg mb-6">
                                    <div>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Tracking Number</p>
                                        <p className="font-bold text-neutral-900 dark:text-white">{tracking.trackingNumber}</p>
                                    </div>
                                    <a
                                        href={`${tracking.carrierLink}${tracking.trackingNumber}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                    >
                                        Track on {tracking.carrier}
                                        <ExternalLink className="h-4 w-4" />
                                    </a>
                                </div>

                                {/* Items */}
                                <div className="mb-6">
                                    <h4 className="font-semibold text-neutral-900 dark:text-white mb-3">Items in this shipment</h4>
                                    <div className="space-y-2">
                                        {tracking.items.map((item: any, index: number) => (
                                            <div key={index} className="flex justify-between py-2 border-b border-neutral-200 dark:border-neutral-700 last:border-0">
                                                <span className="text-neutral-700 dark:text-neutral-300">{item.name}</span>
                                                <span className="text-neutral-600 dark:text-neutral-400">Qty: {item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Timeline */}
                                <div>
                                    <h4 className="font-semibold text-neutral-900 dark:text-white mb-4">Shipment Timeline</h4>
                                    <div className="space-y-4">
                                        {tracking.timeline.map((event: any, index: number) => (
                                            <div key={index} className="flex gap-4">
                                                <div className="flex flex-col items-center">
                                                    <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-green-600' : 'bg-neutral-300 dark:bg-neutral-600'
                                                        }`} />
                                                    {index < tracking.timeline.length - 1 && (
                                                        <div className="w-0.5 h-full bg-neutral-200 dark:bg-neutral-700 my-1" />
                                                    )}
                                                </div>
                                                <div className="flex-1 pb-6">
                                                    <p className="font-semibold text-neutral-900 dark:text-white">{event.status}</p>
                                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">{event.location}</p>
                                                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{event.date}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Help Section */}
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                                <h3 className="font-bold text-neutral-900 dark:text-white mb-3">
                                    Need Help with Your Order?
                                </h3>
                                <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                                    If you have any questions or concerns about your shipment, our customer support team is here to help.
                                </p>
                                <a
                                    href="/contact"
                                    className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    Contact Support
                                </a>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}
