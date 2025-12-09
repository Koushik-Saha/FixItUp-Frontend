'use client'

import { useState } from 'react'
import { Search, Package, Truck, CheckCircle, Clock, ExternalLink } from 'lucide-react'

const ORDER_STATUSES = [
    { id: 'processing', label: 'Order Processing', icon: Clock, description: 'Your order is being prepared' },
    { id: 'shipped', label: 'Shipped', icon: Truck, description: 'Your order is on the way' },
    { id: 'delivered', label: 'Delivered', icon: CheckCircle, description: 'Your order has been delivered' }
]

// Sample order data
const SAMPLE_ORDERS: Record<string, any> = {
    'ORD-123456': {
        number: 'ORD-123456',
        status: 'shipped',
        email: 'john@example.com',
        items: [
            { name: 'iPhone 15 Pro Max OLED Display', quantity: 1 },
            { name: 'Premium Tool Kit', quantity: 1 }
        ],
        trackingNumber: 'TRK-9876543210',
        carrier: 'USPS',
        carrierLink: 'https://tools.usps.com/go/TrackConfirmAction?tLabels=',
        estimatedDelivery: 'Friday, December 15, 2024',
        currentLocation: 'Los Angeles, CA Distribution Center',
        timeline: [
            { date: 'Dec 10, 2024 10:30 AM', status: 'Order Placed', location: 'Santa Barbara, CA' },
            { date: 'Dec 10, 2024 2:15 PM', status: 'Order Processed', location: 'Santa Barbara, CA' },
            { date: 'Dec 11, 2024 8:00 AM', status: 'Shipped', location: 'Santa Barbara, CA' },
            { date: 'Dec 12, 2024 3:45 PM', status: 'In Transit', location: 'Los Angeles, CA' }
        ]
    },
    'ORD-789012': {
        number: 'ORD-789012',
        status: 'delivered',
        email: 'jane@example.com',
        items: [
            { name: 'Samsung S24 Screen', quantity: 1 }
        ],
        trackingNumber: 'TRK-1234567890',
        carrier: 'FedEx',
        carrierLink: 'https://www.fedex.com/fedextrack/?trknbr=',
        estimatedDelivery: 'Delivered on December 8, 2024',
        currentLocation: 'Delivered',
        timeline: [
            { date: 'Dec 5, 2024 9:00 AM', status: 'Order Placed', location: 'Santa Barbara, CA' },
            { date: 'Dec 5, 2024 1:30 PM', status: 'Order Processed', location: 'Santa Barbara, CA' },
            { date: 'Dec 6, 2024 7:00 AM', status: 'Shipped', location: 'Santa Barbara, CA' },
            { date: 'Dec 7, 2024 10:30 AM', status: 'Out for Delivery', location: 'Campbell, CA' },
            { date: 'Dec 8, 2024 2:15 PM', status: 'Delivered', location: 'Campbell, CA' }
        ]
    }
}

export default function OrderTrackingPage() {
    const [orderNumber, setOrderNumber] = useState('')
    const [email, setEmail] = useState('')
    const [tracking, setTracking] = useState<any>(null)
    const [error, setError] = useState('')

    const handleTrack = (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        // Check if order exists
        const order = SAMPLE_ORDERS[orderNumber]

        if (!order) {
            setError('Order not found. Please check your order number.')
            setTracking(null)
            return
        }

        // Verify email
        if (order.email.toLowerCase() !== email.toLowerCase()) {
            setError('Email does not match our records.')
            setTracking(null)
            return
        }

        setTracking(order)
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
                                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
                            >
                                <Search className="h-5 w-5" />
                                Track Order
                            </button>
                        </form>

                        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-2">
                                <strong>Sample Orders (for demo):</strong>
                            </p>
                            <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
                                <li>• Order: ORD-123456 | Email: john@example.com (Shipped)</li>
                                <li>• Order: ORD-789012 | Email: jane@example.com (Delivered)</li>
                            </ul>
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
                                                        <p className={`text-sm font-semibold text-center ${
                                                            isComplete ? 'text-neutral-900 dark:text-white' : 'text-neutral-500 dark:text-neutral-400'
                                                        }`}>
                                                            {status.label}
                                                        </p>
                                                        <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center mt-1">
                                                            {status.description}
                                                        </p>
                                                    </div>

                                                    {/* Connector Line */}
                                                    {index < ORDER_STATUSES.length - 1 && (
                                                        <div className={`absolute top-8 left-1/2 w-full h-1 -z-10 ${
                                                            index < currentIndex ? 'bg-green-600' : 'bg-neutral-200 dark:bg-neutral-700'
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
                                                    <div className={`w-3 h-3 rounded-full ${
                                                        index === 0 ? 'bg-green-600' : 'bg-neutral-300 dark:bg-neutral-600'
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
