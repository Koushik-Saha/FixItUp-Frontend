"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { getOrders, Order } from "@/lib/api/orders";
import { Loader2, Package, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function OrdersPage() {
    const { user, isLoading: authLoading } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) return;
            try {
                setLoading(true);
                // Fetch all orders for now, pagination can be added later if needed
                const response = await getOrders({ limit: 50 });
                setOrders(response.data || []);
            } catch (err) {
                console.error("Failed to fetch orders:", err);
                setError("Failed to load orders. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchOrders();
        }
    }, [user]);

    const filteredOrders = orders.filter((order) => {
        const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
        const matchesSearch =
            order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.totalAmount.toString().includes(searchQuery);
        return matchesStatus && matchesSearch;
    });

    if (authLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-neutral-500" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center py-12">
                <p>Please log in to view your orders.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Order History</h1>
                    <p className="text-neutral-400 text-sm">
                        View and track your past purchases.
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                    <Input
                        placeholder="Search by Order # or Amount..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-neutral-900/50 border-neutral-800"
                    />
                </div>
                <div className="w-full md:w-[200px]">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="bg-neutral-900/50 border-neutral-800">
                            <SelectValue placeholder="Filter by Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Statuses</SelectItem>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="PROCESSING">Processing</SelectItem>
                            <SelectItem value="SHIPPED">Shipped</SelectItem>
                            <SelectItem value="DELIVERED">Delivered</SelectItem>
                            <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Orders List */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    <p className="text-neutral-400">Loading orders...</p>
                </div>
            ) : error ? (
                <div className="text-red-400 p-4 border border-red-900/50 rounded-lg bg-red-900/10 text-center">
                    {error}
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-neutral-800 rounded-xl">
                    <Package className="h-12 w-12 mx-auto text-neutral-600 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No orders found</h3>
                    <p className="text-neutral-400 mb-6">
                        {statusFilter !== "ALL" || searchQuery
                            ? "Try adjusting your filters."
                            : "You haven't placed any orders yet."}
                    </p>
                    <Button asChild>
                        <Link href="/shop">Start Shopping</Link>
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map((order) => (
                        <div
                            key={order.id}
                            className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 md:p-6 transition-all hover:border-neutral-700 hover:shadow-lg group"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-semibold text-lg text-white">
                                            #{order.orderNumber}
                                        </h3>
                                        <StatusBadge status={order.status} />
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-neutral-400">
                                        <span>
                                            {new Date(order.createdAt).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                        <span>&bull;</span>
                                        <span>{order.orderItems?.length || 0} Items</span> {/* Items count might need check if not included in list list */}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between md:justify-end gap-6">
                                    <div className="text-right">
                                        <p className="text-xs text-neutral-500 uppercase font-medium">Total</p>
                                        <p className="text-lg font-bold text-white">
                                            ${Number(order.totalAmount).toFixed(2)}
                                        </p>
                                    </div>
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="border-neutral-700 hover:bg-neutral-800 hover:text-white group-hover:border-blue-500/50 transition-colors"
                                    >
                                        <Link href={`/dashboard/orders/${order.id}`}>
                                            Details
                                            <ChevronRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
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
            className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || defaultStyle
                }`}
        >
            {status}
        </span>
    );
}
