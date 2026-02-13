'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { CheckCircle, Loader2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getOrder, Order } from '@/lib/api/orders'

export default function OrderConfirmationPage() {
    const params = useParams()
    const orderId = params?.id as string

    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (orderId) {
            const fetchOrder = async () => {
                try {
                    const response = await getOrder(orderId)
                    setOrder(response.data)
                } catch (error) {
                    console.error('Failed to load order', error)
                } finally {
                    setLoading(false)
                }
            }
            fetchOrder()
        }
    }, [orderId])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        )
    }

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <p className="text-xl text-neutral-600 mb-4">Order not found</p>
                <Link href="/shop">
                    <Button>Return to Shop</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-12 px-4">
            <div className="container mx-auto max-w-2xl text-center">

                <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-8 mb-8">
                    <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>

                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                        Order Placed!
                    </h1>
                    <p className="text-neutral-600 dark:text-neutral-400 text-lg mb-6">
                        Thank you for your purchase. Your order has been received.
                    </p>

                    <div className="bg-neutral-50 dark:bg-neutral-700/50 rounded-lg p-6 text-left mb-6">
                        <div className="flex justify-between mb-2">
                            <span className="text-neutral-600 dark:text-neutral-400">Order Number:</span>
                            <span className="font-mono font-bold">{order.orderNumber}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="text-neutral-600 dark:text-neutral-400">Date:</span>
                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="text-neutral-600 dark:text-neutral-400">Total Amount:</span>
                            <span className="font-bold text-lg">${Number(order.totalAmount).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-neutral-600 dark:text-neutral-400">Status:</span>
                            <span className="uppercase text-sm font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                {order.status}
                            </span>
                        </div>
                    </div>

                    <p className="text-sm text-neutral-500 mb-8">
                        A confirmation email has been sent to <strong>{order.customerEmail}</strong>.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/shop">
                            <Button variant="outline">Continue Shopping</Button>
                        </Link>
                        {/* 
                            This could link to /dashboard/orders if user dashboard has order history.
                            Assuming /dashboard/orders based on roadmap.
                        */}
                        <Link href="/dashboard/orders">
                            <Button className="flex items-center">
                                View Order Details
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    )
}
