'use client'

import { useState, useEffect } from 'react'
import {
    Search,
    Filter,
    Eye,
    Loader2
} from 'lucide-react'
import Link from 'next/link'
import { useDebounce } from '@/hooks/useDebounce'

interface Application {
    id: string
    businessName: string
    businessType: string
    status: string
    requestedTier: string
    createdAt: string
    user: {
        fullName: string
        email: string
    }
}

interface Pagination {
    page: number
    limit: number
    total: number
    totalPages: number
}

export default function WholesalePage() {
    const [apps, setApps] = useState<Application[]>([])
    const [pagination, setPagination] = useState<Pagination | null>(null)
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState('all')

    const fetchApps = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (statusFilter !== 'all') params.append('status', statusFilter)
            params.append('page', '1')
            params.append('limit', '20')

            const res = await fetch(`/api/admin/wholesale?${params.toString()}`)
            if (!res.ok) throw new Error('Failed to fetch applications')
            const data = await res.json()
            setApps(data.data)
            setPagination(data.pagination)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchApps()
    }, [statusFilter])

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPROVED': return 'bg-green-100 text-green-800'
            case 'PENDING': return 'bg-yellow-100 text-yellow-800'
            case 'REJECTED': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">Wholesale Applications</h1>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                <select
                    className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Business</th>
                                <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
                                <th className="text-center py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Requested Tier</th>
                                <th className="text-center py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="text-right py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Received</th>
                                <th className="text-right py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="py-20 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-2" />
                                            <p className="text-slate-500">Loading applications...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : apps.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-20 text-center text-slate-500">
                                        No applications found.
                                    </td>
                                </tr>
                            ) : (
                                apps.map((app) => (
                                    <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="text-sm font-medium text-slate-900">{app.businessName}</div>
                                            <div className="text-xs text-slate-500">{app.businessType}</div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="text-sm text-slate-900">{app.user.fullName}</div>
                                            <div className="text-xs text-slate-500">{app.user.email}</div>
                                        </td>
                                        <td className="py-4 px-6 text-center text-sm text-slate-600">
                                            {app.requestedTier}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(app.status)}`}>
                                                {app.status.toLowerCase()}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right text-sm text-slate-500">
                                            {new Date(app.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <Link
                                                href={`/admin/wholesale/${app.id}`}
                                                className="inline-flex p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Link>
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
