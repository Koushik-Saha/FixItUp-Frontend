'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { Order, OrderDetailsItem } from '@/lib/api/orders'

export default function PrintOrderPage() {
    const params = useParams()
    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch(`/api/admin/orders/${params.id}`)
                if (!res.ok) throw new Error('Failed to fetch order')
                const data = await res.json()
                setOrder(data.data)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        if (params.id) fetchOrder()
    }, [params.id])

    useEffect(() => {
        if (!loading && order) {
            setTimeout(() => {
                window.print()
            }, 500)
        }
    }, [loading, order])

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-black" />
            </div>
        )
    }

    if (!order) return <div className="p-8 text-center">Order not found</div>

    return (
        <div className="bg-white text-black p-8 max-w-[210mm] mx-auto min-h-screen print:p-0">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-black pb-6 mb-6">
                <div>
                    <h1 className="text-2xl font-bold uppercase tracking-wider">Packing Slip</h1>
                    <p className="mt-1 font-medium">Order #{order.orderNumber}</p>
                    <p className="text-sm mt-1">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                    <h2 className="font-bold text-lg">Max Phone Repair</h2>
                    <p className="text-sm">123 Tech Street</p>
                    <p className="text-sm">San Francisco, CA 94107</p>
                    <p className="text-sm">support@maxphonerepair.com</p>
                </div>
            </div>

            {/* Addresses */}
            <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                    <h3 className="font-bold uppercase text-xs text-gray-500 mb-2">Bill To:</h3>
                    <div className="text-sm">
                        <p className="font-bold">{order.customerName}</p>
                        <p>{order.customerEmail}</p>
                        {order.customerPhone && <p>{order.customerPhone}</p>}
                    </div>
                </div>
                <div>
                    <h3 className="font-bold uppercase text-xs text-gray-500 mb-2">Ship To:</h3>
                    {order.shippingAddress ? (
                        <div className="text-sm">
                            <p className="font-bold">{order.shippingAddress.fullName}</p>
                            <p>{order.shippingAddress.addressLine1}</p>
                            {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                            <p>{order.shippingAddress.country}</p>
                        </div>
                    ) : (
                        <p className="text-sm italic">No shipping address</p>
                    )}
                </div>
            </div>

            {/* Items Table */}
            <table className="w-full mb-8 border-collapse">
                <thead>
                    <tr className="border-b-2 border-black text-left text-sm uppercase">
                        <th className="py-2 font-bold">Item</th>
                        <th className="py-2 font-bold">SKU</th>
                        <th className="py-2 text-right font-bold">Qty</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {order.orderItems?.map((item: OrderDetailsItem) => (
                        <tr key={item.id}>
                            <td className="py-3 pr-4">
                                <p className="font-medium">{item.productName}</p>
                            </td>
                            <td className="py-3 text-sm">{item.productSku}</td>
                            <td className="py-3 text-right font-medium">{item.quantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Footer */}
            <div className="border-t border-black pt-6 text-center text-sm">
                <p className="font-medium mb-1">Thank you for your business!</p>
                <p>If you have any questions about this shipment, please contact us at support@maxphonerepair.com</p>
            </div>

            <style jsx global>{`
                @media print {
                    @page { margin: 2cm; }
                    body { -webkit-print-color-adjust: exact; }
                }
            `}</style>
        </div>
    )
}
