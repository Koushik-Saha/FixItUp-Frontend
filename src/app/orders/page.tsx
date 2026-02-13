// src/app/orders/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    Package,
    Calendar,
    DollarSign,
    ChevronRight,
    AlertCircle,
    Loader2,
} from 'lucide-react'
import { toast } from 'sonner'
import QuickReorderButton from '@/components/quick-reorder-button'

// Adjust this type if your /api/orders response shape differs slightly
type OrderSummary = {
    id: string
    order_number: string
    created_at: string
    total_amount: number
    status: string
    payment_status: string
    item_count?: number
}

type OrdersResponse = {
    data: {
        orders: OrderSummary[]
        pagination?: {
            total: number
            page: number
            per_page: number
            total_pages: number
        }
    }
}

export default function OrdersPage() {
    const router = useRouter()
    const [orders, setOrders] = useState<OrderSummary[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadOrders = async () => {
            try {
                setLoading(true)
                setError(null)

                const res = await fetch('/api/orders', { credentials: 'include' })
                const json = await res.json().catch(() => ({}))

                if (!res.ok) {
                    const msg = json.message || json.error || 'Failed to load orders'
                    setError(msg)
                    toast.error(msg)
                    return
                }

                const data = (json as OrdersResponse).data
                setOrders(data.orders || [])
            } catch (err: any) {
                console.error(err)
                const msg = err.message || 'Failed to load orders'
                setError(msg)
                toast.error(msg)
            } finally {
                setLoading(false)
            }
        }

        loadOrders()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-50">
                <div className="flex items-center gap-2 text-sm">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading your orders...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-50">
            <div className="max-w-5xl mx-auto px-4 py-10 md:py-16">
                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                            My Orders
                        </h1>
                        <p className="mt-1 text-sm text-neutral-400">
                            View your recent purchases and their status.
                        </p>
                    </div>

                    <button
                        onClick={() => router.push('/')}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-sm font-medium"
                    >
                        Continue Shopping
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>

                {/* Error state */}
                {error && (
                    <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-500/60 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                        <AlertCircle className="h-4 w-4" />
                        <span>{error}</span>
                    </div>
                )}

                {/* No orders */}
                {orders.length === 0 && !error && (
                    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-8 text-center">
                        <Package className="h-10 w-10 mx-auto mb-3 text-neutral-500" />
                        <h2 className="text-lg font-semibold mb-2">No orders yet</h2>
                        <p className="text-sm text-neutral-400 mb-4">
                            When you place an order, it will appear here.
                        </p>
                        <button
                            onClick={() => router.push('/')}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm font-medium"
                        >
                            Start Shopping
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                )}

                {/* Orders list */}
                {orders.length > 0 && (
                    <div className="space-y-4">
                        {orders.map((order) => {
                            const createdDate = new Date(order.created_at).toLocaleDateString(
                                'en-US',
                                {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                },
                            )

                            const statusColor =
                                order.status === 'completed'
                                    ? 'text-green-400 bg-green-500/10 border-green-500/40'
                                    : order.status === 'cancelled'
                                        ? 'text-red-400 bg-red-500/10 border-red-500/40'
                                        : 'text-amber-300 bg-amber-500/10 border-amber-500/40'

                            const paymentLabel =
                                order.payment_status === 'paid'
                                    ? 'Paid'
                                    : order.payment_status === 'pending'
                                        ? 'Pending'
                                        : order.payment_status === 'failed'
                                            ? 'Payment Failed'
                                            : order.payment_status

                            return (
                                <div
                                    key={order.id}
                                    className="group rounded-2xl border border-neutral-800 bg-neutral-900/80 hover:bg-neutral-900 hover:border-neutral-700 transition-colors px-4 py-4 md:px-5 md:py-5"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <Link
                                            href={`/order-confirmation?orderId=${encodeURIComponent(
                                                order.id,
                                            )}&orderNumber=${encodeURIComponent(order.order_number)}`}
                                            className="flex items-start gap-3 flex-1"
                                        >
                                            <div className="mt-0.5">
                                                <div className="rounded-lg bg-neutral-800 p-2">
                                                    <Package className="h-4 w-4 text-neutral-300" />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs text-neutral-400 mb-1">
                                                    Order #{order.order_number}
                                                </p>
                                                <p className="text-sm font-medium">
                                                    {order.item_count ?? '—'} item
                                                    {(order.item_count ?? 0) !== 1 ? 's' : ''} · Placed on {createdDate}
                                                </p>
                                                <p className="mt-1 text-xs text-neutral-500">
                                                    Order ID: <span className="font-mono">{order.id}</span>
                                                </p>
                                            </div>
                                        </Link>

                                        <div className="flex flex-col items-end gap-2">
                                            <div className="flex items-center gap-1 text-sm font-semibold">
                                                <DollarSign className="h-3 w-3" />
                                                <span>${order.total_amount.toFixed(2)}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <span
                                                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${statusColor}`}
                                                >
                                                    {order.status}
                                                </span>
                                                <span className="inline-flex items-center rounded-full bg-neutral-800 px-2 py-0.5 text-[11px] text-neutral-300">
                                                    {paymentLabel}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-3 flex items-center justify-between gap-3">
                                        <Link
                                            href={`/order-confirmation?orderId=${encodeURIComponent(
                                                order.id,
                                            )}&orderNumber=${encodeURIComponent(order.order_number)}`}
                                            className="text-xs text-neutral-400 hover:text-neutral-300 flex items-center gap-1"
                                        >
                                            View details
                                            <ChevronRight className="h-3 w-3" />
                                        </Link>
                                        <div onClick={(e) => e.stopPropagation()}>
                                            <QuickReorderButton
                                                orderId={order.id}
                                                orderNumber={order.order_number}
                                                variant="outline"
                                                size="sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
