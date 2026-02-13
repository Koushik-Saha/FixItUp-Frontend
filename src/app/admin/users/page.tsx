'use client'

import { useState, useEffect } from 'react'
import {
    Search,
    User,
    Mail,
    Phone,
    Loader2,
    ShoppingBag,
    Wrench
} from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'

interface Customer {
    id: string
    email: string
    fullName: string
    phone: string | null
    role: string
    createdAt: string
    _count: {
        orders: number
        repairTickets: number
    }
}

interface Pagination {
    page: number
    limit: number
    total: number
    totalPages: number
}

export default function UsersPage() {
    const [users, setUsers] = useState<Customer[]>([])
    const [pagination, setPagination] = useState<Pagination | null>(null)
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const debouncedSearch = useDebounce(searchTerm, 500)

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (debouncedSearch) params.append('search', debouncedSearch)
            params.append('page', '1')
            params.append('limit', '20')

            const res = await fetch(`/api/admin/users?${params.toString()}`)
            if (!res.ok) throw new Error('Failed to fetch users')
            const data = await res.json()
            setUsers(data.data)
            setPagination(data.pagination)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [debouncedSearch])

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">Customers</h1>

            {/* Search */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm max-w-md">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search customers by name, email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                                <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
                                <th className="text-center py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Orders</th>
                                <th className="text-center py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Repairs</th>
                                <th className="text-right py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-2" />
                                            <p className="text-slate-500">Loading customers...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center text-slate-500">
                                        No customers found.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                                                    {user.fullName?.[0]?.toUpperCase() || 'U'}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-slate-900">{user.fullName || 'Unknown'}</div>
                                                    <span className="text-xs text-slate-400 capitalize">{user.role.toLowerCase()}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                                <Mail className="h-3 w-3" /> {user.email}
                                            </div>
                                            {user.phone && (
                                                <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                                                    <Phone className="h-3 w-3" /> {user.phone}
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                                                <ShoppingBag className="h-3 w-3" />
                                                {user._count.orders}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 text-xs font-medium border border-orange-100">
                                                <Wrench className="h-3 w-3" />
                                                {user._count.repairTickets}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-right text-sm text-slate-500">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {pagination && pagination.totalPages > 1 && (
                    <div className="p-4 border-t border-slate-200 flex items-center justify-between">
                        <span className="text-sm text-slate-500">
                            Page {pagination.page} of {pagination.totalPages}
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}
