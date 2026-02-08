/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getOrder, Order } from "@/lib/api/orders";
import { Loader2, ArrowLeft, MapPin, CreditCard, ShoppingBag, Truck, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!user) return;
            try {
                setLoading(true);
                const response = await getOrder(id);
                setOrder(response.data);
            } catch (err) {
                console.error("Failed to fetch order:", err);
                setError("Failed to load order details.");
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchOrder();
        }
    }, [user, id]);

    if (authLoading || loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-neutral-500" />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="text-center py-12">
                <p className="text-red-400 mb-4">{error || "Order not found"}</p>
                <Button asChild variant="outline">
                    <Link href="/dashboard/orders">Back to Orders</Link>
                </Button>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Helper to calculate item subtotal safely
    const calculateItemTotal = (item: any) => {
        return (Number(item.unitPrice) * item.quantity).toFixed(2);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild className="rounded-full">
                        <Link href="/dashboard/orders">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-3">
                            Order #{order.order_number}
                            <StatusBadge status={order.status} />
                        </h1>
                        <p className="text-neutral-400 text-sm mt-1">
                            Placed on {formatDate(order.created_at)}
                        </p>
                    </div>
                </div>
                {/* Actions (Print, etc. - Optional for later) */}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content: Items */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl overflow-hidden">
                        <div className="p-6 border-b border-neutral-800">
                            <h2 className="font-semibold flex items-center gap-2">
                                <ShoppingBag className="h-4 w-4 text-blue-500" />
                                Order Items
                            </h2>
                        </div>
                        <div className="divide-y divide-neutral-800">
                            {(order as any).orderItems?.map((item: any) => (
                                <div key={item.id} className="p-6 flex gap-4 md:items-center">
                                    <div className="h-16 w-16 bg-neutral-800 rounded-lg flex-shrink-0 overflow-hidden">
                                        {item.productImage ? (
                                            <img
                                                src={item.productImage}
                                                alt={item.productName}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-neutral-600">
                                                <Package className="h-6 w-6" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-white">{item.productName}</h3>
                                        <p className="text-sm text-neutral-400">SKU: {item.productSku}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-white">
                                            ${Number(item.unitPrice).toFixed(2)}
                                        </p>
                                        <p className="text-sm text-neutral-500">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Timeline / Progress could go here */}
                </div>

                {/* Sidebar: Summary & Info */}
                <div className="space-y-6">
                    {/* Order Summary */}
                    <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 space-y-4">
                        <h2 className="font-semibold text-lg">Order Summary</h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-neutral-400">
                                <span>Subtotal</span>
                                <span>${Number(order.subtotal).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-neutral-400">
                                <span>Shipping</span>
                                <span>${Number(order.shipping_cost).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-neutral-400">
                                <span>Tax</span>
                                <span>${Number(order.tax_amount).toFixed(2)}</span>
                            </div>
                            {Number(order.discount_amount) > 0 && (
                                <div className="flex justify-between text-green-400">
                                    <span>Discount</span>
                                    <span>-${Number(order.discount_amount).toFixed(2)}</span>
                                </div>
                            )}
                            <Separator className="bg-neutral-800 my-2" />
                            <div className="flex justify-between font-bold text-lg text-white">
                                <span>Total</span>
                                <span>${Number(order.total_amount).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 space-y-6">
                        {/* Shipping */}
                        <div>
                            <h3 className="text-sm font-medium text-neutral-500 uppercase mb-3 flex items-center gap-2">
                                <Truck className="h-4 w-4" /> Shipping Address
                            </h3>
                            <div className="text-sm text-neutral-300 pl-6 border-l-2 border-neutral-800">
                                <p className="font-medium text-white">{order.shipping_address.full_name}</p>
                                <p>{order.shipping_address.address_line_1}</p>
                                {order.shipping_address.address_line_2 && (
                                    <p>{order.shipping_address.address_line_2}</p>
                                )}
                                <p>
                                    {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                                </p>
                                <p className="text-neutral-500 mt-1">{order.shipping_address.country}</p>
                            </div>
                        </div>

                        {/* Payment Status */}
                        <div>
                            <h3 className="text-sm font-medium text-neutral-500 uppercase mb-3 flex items-center gap-2">
                                <CreditCard className="h-4 w-4" /> Payment Status
                            </h3>
                            <div className="pl-6 border-l-2 border-neutral-800">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${order.payment_status === 'PAID' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                    'bg-neutral-500/10 text-neutral-500 border-neutral-500/20'
                                    }`}>
                                    {order.payment_status}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        PENDING: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
        PROCESSING: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        SHIPPED: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
        DELIVERED: "bg-green-500/10 text-green-500 border-green-500/20",
        CANCELLED: "bg-red-500/10 text-red-500 border-red-500/20",
    };

    const defaultStyle = "bg-neutral-500/10 text-neutral-500 border-neutral-500/20";

    return (
        <span
            className={`px-3 py-1 rounded-full text-sm font-medium border ${styles[status] || defaultStyle
                }`}
        >
            {status}
        </span>
    );
}
