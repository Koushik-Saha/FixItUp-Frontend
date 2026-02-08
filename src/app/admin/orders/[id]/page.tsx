'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
    Loader2,
    ArrowLeft,
    Banknote,
    Calendar,
    MapPin,
    Package,
    User,
    Mail,
    Phone
} from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'

export default function OrderDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const [order, setOrder] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch(`/api/admin/orders/${params.id}`)
                if (!res.ok) throw new Error('Failed to fetch order')
                const data = await res.json()
                setOrder(data.data)
            } catch (error) {
                console.error(error)
                router.push('/admin/orders')
            } finally {
                setLoading(false)
            }
        }
        if (params.id) fetchOrder()
    }, [params.id, router])

    const updateStatus = async (newStatus: string) => {
        setUpdating(true)
        try {
            const res = await fetch(`/api/admin/orders/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            })

            if (!res.ok) throw new Error('Failed to update status')

            setOrder((prev: any) => ({ ...prev, status: newStatus }))
            toast.success('Order status updated')
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setUpdating(false)
        }
    }

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        )
    }

    if (!order) return null

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'bg-green-100 text-green-800'
            case 'PROCESSING': return 'bg-blue-100 text-blue-800'
            case 'SHIPPED': return 'bg-blue-100 text-blue-800'
            case 'PENDING': return 'bg-yellow-100 text-yellow-800'
            case 'CANCELLED': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-20">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/orders" className="p-2 hover:bg-slate-100 rounded-full">
                        <ArrowLeft className="h-5 w-5 text-slate-500" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Order #{order.orderNumber}</h1>
                        <p className="text-slate-500 text-sm">{new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        disabled={updating}
                        value={order.status}
                        onChange={(e) => updateStatus(e.target.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 cursor-pointer ${getStatusColor(order.status)}`}
                    >
                        <option value="PENDING">Pending</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Items & Payment */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Items */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-slate-200 font-medium text-slate-800">Order Items</div>
                        <div className="divide-y divide-slate-200">
                            {order.orderItems.map((item: any) => (
                                <div key={item.id} className="p-4 flex items-center gap-4">
                                    <div className="h-16 w-16 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200">
                                        {item.product?.thumbnail && (
                                            <img src={item.product.thumbnail} alt={item.product.name} className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-medium text-slate-900">{item.product?.name || 'Unknown Product'}</h3>
                                        <p className="text-xs text-slate-500">SKU: {item.product?.sku}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-medium text-slate-900">{formatCurrency(item.price)}</div>
                                        <div className="text-xs text-slate-500">Qty: {item.quantity}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Subtotal</span>
                                <span className="font-medium text-slate-900">{formatCurrency(order.totalAmount)}</span>
                            </div>
                            {/* Tax/Shipping logic if applicable */}
                            <div className="flex justify-between text-base font-bold pt-2 border-t border-slate-200">
                                <span className="text-slate-900">Total</span>
                                <span className="text-blue-600">{formatCurrency(order.totalAmount)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Customer & Shipping */}
                <div className="space-y-6">
                    {/* Customer */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-2 flex items-center gap-2">
                            <User className="h-4 w-4" /> Customer
                        </h2>
                        <div>
                            <p className="text-sm font-medium text-slate-900">{order.user.fullName}</p>
                            <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                                <Mail className="h-3 w-3" /> {order.user.email}
                            </div>
                            {order.user.phone && (
                                <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                                    <Phone className="h-3 w-3" /> {order.user.phone}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-2 flex items-center gap-2">
                            <MapPin className="h-4 w-4" /> Shipping Address
                        </h2>
                        {order.shippingAddress ? (
                            <div className="text-sm text-slate-600 leading-relaxed">
                                <p className="font-medium text-slate-900">{order.shippingAddress.fullName}</p>
                                <p>{order.shippingAddress.addressLine1}</p>
                                {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                                <p>{order.shippingAddress.country}</p>
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500 italic">No shipping address provided</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
