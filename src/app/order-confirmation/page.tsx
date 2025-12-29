'use client'

import { useEffect, useState, Suspense } from 'react'
import {
    CheckCircle,
    Package,
    Truck,
    Calendar,
    MapPin,
    CreditCard,
    Download,
    ArrowRight,
} from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

type OrderItem = {
    id: string
    product_id: string
    product_name: string
    product_sku?: string
    product_image?: string | null
    unit_price: number
    discount_percentage: number
    quantity: number
    subtotal: number
}

type Order = {
    id: string
    order_number: string
    created_at: string
    subtotal: number
    discount_amount: number
    tax_amount: number
    shipping_cost: number
    total_amount: number
    shipping_address: {
        full_name: string
        address_line1: string
        address_line2?: string | null
        city: string
        state: string
        zip_code: string
        phone?: string | null
    }
    status: string
    payment_status: string
    order_items: OrderItem[]
}

// Separate component that uses useSearchParams
function OrderConfirmationContent() {
    const searchParams = useSearchParams()
    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(true)

    const orderId = searchParams.get('orderId')
    const orderNumberParam = searchParams.get('orderNumber') || ''

    useEffect(() => {
        const loadOrder = async () => {
            if (!orderId) {
                setLoading(false)
                return
            }
            try {
                setLoading(true)
                const res = await fetch(`/api/orders/${orderId}`, { credentials: 'include' })
                const json = await res.json().catch(() => ({}))
                if (!res.ok) {
                    const msg = json.message || json.error || 'Failed to load order'
                    toast.error(msg)
                    setLoading(false)
                    return
                }
                setOrder(json.data as Order)
            } catch (err: any) {
                console.error(err)
                toast.error(err.message || 'Failed to load order')
            } finally {
                setLoading(false)
            }
        }

        loadOrder()
    }, [orderId])

    const displayOrderNumber =
        order?.order_number || orderNumberParam || 'ORD-' + Date.now().toString().slice(-6)

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-50">
                <p className="text-lg">Loading your order...</p>
            </div>
        )
    }

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 text-neutral-50 px-4">
                <CheckCircle className="w-12 h-12 text-green-400 mb-4" />
                <h1 className="text-2xl font-semibold mb-2">Order Confirmed!</h1>
                <p className="text-sm text-neutral-400 mb-4">
                    Your order number is <span className="font-mono">{displayOrderNumber}</span>.
                </p>
                <p className="text-sm text-neutral-400 mb-6">
                    We couldn&apos;t load full order details, but you&apos;ll receive an email confirmation
                    shortly.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-sm font-medium"
                >
                    Continue Shopping
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        )
    }

    const createdDate = new Date(order.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    const estimatedDelivery = new Date(
        new Date(order.created_at).getTime() + 7 * 24 * 60 * 60 * 1000,
    ).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-50">
            <div className="max-w-4xl mx-auto px-4 py-10 md:py-16">
                {/* Success banner */}
                <div className="bg-gradient-to-r from-green-500/20 via-blue-500/10 to-purple-500/20 border border-green-500/40 rounded-2xl p-6 md:p-8 mb-8">
                    <div className="flex items-start gap-4">
                        <div className="mt-1">
                            <CheckCircle className="w-8 h-8 text-green-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-semibold mb-1">Order Confirmed!</h1>
                            <p className="text-sm text-neutral-200 mb-2">
                                Thank you for your purchase. Your order has been received.
                            </p>
                            <p className="text-sm text-neutral-300">
                                Order Number:{' '}
                                <span className="font-mono font-semibold">{order.order_number}</span>
                            </p>
                            <p className="mt-1 text-xs text-neutral-400">
                                You will receive an email confirmation with your order details shortly.
                            </p>
                        </div>
                    </div>

                    {/* Info row */}
                    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3 text-sm">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-neutral-200" />
                            <div>
                                <p className="text-xs text-neutral-400">Order Date</p>
                                <p className="font-medium">{createdDate}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Truck className="w-4 h-4 text-neutral-200" />
                            <div>
                                <p className="text-xs text-neutral-400">Estimated Delivery</p>
                                <p className="font-medium">{estimatedDelivery}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-neutral-200" />
                            <div>
                                <p className="text-xs text-neutral-400">Payment Status</p>
                                <p className="font-medium capitalize">{order.payment_status}</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick actions */}
                    <div className="mt-6 flex flex-wrap gap-3">
                        <Link
                            href={`/`}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-neutral-900 text-sm font-medium hover:bg-neutral-100"
                        >
                            Continue Shopping
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-700 text-sm font-medium hover:bg-neutral-900"
                        >
                            <Download className="w-4 h-4" />
                            Download Invoice
                        </button>
                    </div>
                </div>

                {/* Order details */}
                <div className="space-y-6">
                    <section className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Package className="w-4 h-4 text-blue-400" />
                            Items Purchased
                        </h2>
                        <div className="space-y-4">
                            {order.order_items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-3 border border-neutral-800 rounded-lg px-3 py-2"
                                >
                                    <div className="h-12 w-12 rounded-md bg-neutral-800 flex items-center justify-center text-xs text-neutral-300">
                                        {item.product_image ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={item.product_image}
                                                alt={item.product_name}
                                                className="h-12 w-12 object-cover rounded-md"
                                            />
                                        ) : (
                                            <span>{item.product_name.charAt(0)}</span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{item.product_name}</p>
                                        <p className="text-xs text-neutral-400">
                                            SKU: {item.product_sku ?? 'N/A'} · Qty {item.quantity}
                                        </p>
                                    </div>
                                    <div className="text-right text-sm font-semibold">
                                        ${(item.subtotal || 0).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Totals */}
                        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6">
                            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-neutral-400">Subtotal</span>
                                    <span>${order.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-neutral-400">Discounts</span>
                                    <span>- ${order.discount_amount.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-neutral-400">Shipping</span>
                                    <span>
                    {order.shipping_cost === 0
                        ? 'FREE'
                        : `$${order.shipping_cost.toFixed(2)}`}
                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-neutral-400">Tax</span>
                                    <span>${order.tax_amount.toFixed(2)}</span>
                                </div>
                                <div className="border-t border-neutral-800 pt-3 flex items-center justify-between">
                                    <span className="font-medium">Total Paid</span>
                                    <span className="text-lg font-semibold">
                    ${order.total_amount.toFixed(2)}
                  </span>
                                </div>
                            </div>
                        </div>

                        {/* Shipping address */}
                        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-blue-400" />
                                Shipping Address
                            </h2>
                            <div className="space-y-1 text-sm">
                                <p className="font-medium">{order.shipping_address.full_name}</p>
                                <p>{order.shipping_address.address_line1}</p>
                                {order.shipping_address.address_line2 && (
                                    <p>{order.shipping_address.address_line2}</p>
                                )}
                                <p>
                                    {order.shipping_address.city}, {order.shipping_address.state}{' '}
                                    {order.shipping_address.zip_code}
                                </p>
                                {order.shipping_address.phone && (
                                    <p className="text-neutral-400">{order.shipping_address.phone}</p>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Support */}
                    <section className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-semibold mb-1">Need Help?</h2>
                            <p className="text-sm text-neutral-400">
                                If you have any questions about your order, our customer support team is here to
                                help.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Link
                                href="/support"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-700 text-sm hover:bg-neutral-900"
                            >
                                Contact Support
                            </Link>
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-sm font-medium"
                            >
                                View Account
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

// Loading fallback component
function OrderConfirmationLoading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-50">
            <p className="text-lg">Loading your order...</p>
        </div>
    )
}

// Main page component with Suspense boundary
export default function OrderConfirmationPage() {
    return (
        <Suspense fallback={<OrderConfirmationLoading />}>
            <OrderConfirmationContent />
        </Suspense>
    )
}
