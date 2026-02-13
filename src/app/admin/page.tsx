'use client'

import {
    Users,
    ShoppingCart,
    Wrench,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    Loader2,
    Package,
    Store
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'

interface DashboardData {
    overview: {
        orders: { total: number; pending: number; processing: number; completed: number; cancelled: number }
        revenue: { total: number; orders: number; average: number }
        products: { total: number; active: number; inactive: number }
        repairs: { total: number; submitted: number; in_progress: number; completed: number }
    }
    recent_orders: Array<{
        id: string
        order_number: string
        customer_name: string
        total_amount: number
        status: string
        created_at: string
    }>
    low_stock: Array<{
        id: string
        name: string
        sku: string
        total_stock: number
        low_stock_threshold: number
    }>
}

export default function AdminDashboard() {
    const [data, setData] = useState<DashboardData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await fetch('/api/admin/dashboard')
                if (!res.ok) throw new Error('Failed to fetch dashboard data')
                const json = await res.json()
                setData(json.data)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred')
            } finally {
                setLoading(false)
            }
        }

        fetchDashboard()
    }, [])

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-6 bg-red-50 text-red-600 rounded-lg border border-red-200">
                Error: {error}
            </div>
        )
    }

    if (!data) return null

    const stats = [
        {
            title: 'Total Revenue',
            value: formatCurrency(data.overview.revenue.total),
            change: `${data.overview.orders.total} orders`,
            trend: 'up',
            icon: DollarSign,
            color: 'text-green-600',
            bg: 'bg-green-100'
        },
        {
            title: 'Pending Orders',
            value: data.overview.orders.pending.toString(),
            change: 'Needs attention',
            trend: 'up',
            icon: ShoppingCart,
            color: 'text-blue-600',
            bg: 'bg-blue-100'
        },
        {
            title: 'Active Repairs',
            value: (data.overview.repairs.submitted + data.overview.repairs.in_progress).toString(),
            change: 'In progress',
            trend: 'down',
            icon: Wrench,
            color: 'text-orange-600',
            bg: 'bg-orange-100'
        },
        {
            title: 'Low Stock Items',
            value: data.low_stock.length.toString(),
            change: 'Restock needed',
            trend: 'down',
            icon: Package,
            color: 'text-red-600',
            bg: 'bg-red-100'
        }
    ]

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon
                    return (
                        <div key={index} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-slate-500 text-sm font-medium">{stat.title}</span>
                                <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="flex items-end justify-between">
                                <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                                <div className={`flex items-center text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                    {stat.change}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-800">Recent Orders</h2>
                        <Link href="/admin/orders" className="text-sm text-blue-600 font-medium hover:underline">View All</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Order</th>
                                    <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="text-right py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {data.recent_orders.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="py-8 text-center text-slate-500">No recent orders</td>
                                    </tr>
                                ) : (
                                    data.recent_orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="text-sm font-medium text-slate-900">#{order.order_number}</div>
                                                <div className="text-xs text-slate-500">{order.customer_name}</div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                                    ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : ''}
                                                    ${order.status === 'PROCESSING' || order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' : ''}
                                                    ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                                                    ${order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : ''}
                                                `}>
                                                    {order.status.toLowerCase()}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-right text-sm font-medium text-slate-900">
                                                {formatCurrency(Number(order.total_amount))}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Low Stock Alert */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-800">Low Stock Alert</h2>
                        <Link href="/admin/products?stock=low" className="text-sm text-blue-600 font-medium hover:underline">View All</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</th>
                                    <th className="text-right py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Stock</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {data.low_stock.length === 0 ? (
                                    <tr>
                                        <td colSpan={2} className="py-8 text-center text-slate-500">No low stock items</td>
                                    </tr>
                                ) : (
                                    data.low_stock.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="text-sm font-medium text-slate-900 truncate max-w-[200px]">{item.name}</div>
                                                <div className="text-xs text-slate-500">{item.sku}</div>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                    ${item.total_stock === 0 ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}
                                                `}>
                                                    {item.total_stock} / {item.low_stock_threshold}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
