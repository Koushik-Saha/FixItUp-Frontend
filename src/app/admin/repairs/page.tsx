'use client'

import { useState, useEffect } from 'react'
import {
    Search,
    Filter,
    Eye,
    Loader2,
    Wrench,
    Clock,
    CheckCircle,
    XCircle
} from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import { useDebounce } from '@/hooks/useDebounce'

interface RepairTicket {
    id: string
    ticketNumber: string
    customerName: string
    deviceModel: string
    issueDescription: string
    status: string
    priority: string
    estimatedCost: number
    createdAt: string
}

interface Pagination {
    page: number
    limit: number
    total: number
    totalPages: number
}

export default function RepairsPage() {
    const [tickets, setTickets] = useState<RepairTicket[]>([])
    const [pagination, setPagination] = useState<Pagination | null>(null)
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const debouncedSearch = useDebounce(searchTerm, 500)
    const [statusFilter, setStatusFilter] = useState('all')

    const fetchTickets = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (debouncedSearch) params.append('search', debouncedSearch)
            if (statusFilter !== 'all') params.append('status', statusFilter)
            params.append('page', '1')
            params.append('limit', '20')

            const res = await fetch(`/api/admin/repairs?${params.toString()}`)
            if (!res.ok) throw new Error('Failed to fetch tickets')
            const data = await res.json()
            setTickets(data.data)
            setPagination(data.pagination)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTickets()
    }, [debouncedSearch, statusFilter])

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'bg-green-100 text-green-800'
            case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800'
            case 'WAITING_PARTS': return 'bg-orange-100 text-orange-800'
            case 'SUBMITTED': return 'bg-yellow-100 text-yellow-800'
            case 'CANCELLED': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'URGENT': return 'text-red-600 font-bold'
            case 'HIGH': return 'text-orange-600 font-semibold'
            case 'LOW': return 'text-slate-500'
            default: return 'text-slate-700'
        }
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">Repair Tickets</h1>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search tickets by number, customer, device..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                </div>
                <div className="flex gap-4">
                    <select
                        className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="SUBMITTED">Submitted</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="WAITING_PARTS">Waiting Parts</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Tickets Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Ticket #</th>
                                <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                                <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Device / Issue</th>
                                <th className="text-center py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="text-center py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority</th>
                                <th className="text-right py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Est. Cost</th>
                                <th className="text-right py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="py-20 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-2" />
                                            <p className="text-slate-500">Loading tickets...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : tickets.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-20 text-center text-slate-500">
                                        No tickets found matching your filters.
                                    </td>
                                </tr>
                            ) : (
                                tickets.map((ticket) => (
                                    <tr key={ticket.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-4 px-6 text-sm font-medium text-slate-900">
                                            #{ticket.ticketNumber}
                                            <div className="text-xs text-slate-500 mt-0.5">{new Date(ticket.createdAt).toLocaleDateString()}</div>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-slate-900">
                                            {ticket.customerName}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="text-sm font-medium text-slate-900">{ticket.deviceModel}</div>
                                            <div className="text-xs text-slate-500 truncate max-w-[200px]">{ticket.issueDescription}</div>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(ticket.status)}`}>
                                                {ticket.status.toLowerCase().replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-center text-xs uppercase">
                                            <span className={getPriorityColor(ticket.priority)}>
                                                {ticket.priority}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right text-sm font-medium text-slate-900">
                                            {ticket.estimatedCost ? formatCurrency(Number(ticket.estimatedCost)) : '-'}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <Link
                                                href={`/admin/repairs/${ticket.id}`}
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
