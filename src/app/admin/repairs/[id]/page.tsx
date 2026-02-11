'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
    Loader2,
    ArrowLeft,
    User,
    Mail,
    Phone,
    Save,
    Calendar
} from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'

// ... imports

interface RepairTicket {
    id: string
    ticketNumber: string
    customerName: string
    customerEmail: string
    customerPhone?: string
    deviceBrand: string
    deviceModel: string
    issueDescription: string
    imeiSerial?: string
    status: string
    priority: string
    technicianNotes?: string
    estimatedCost?: number | null
    partsCost?: number | null
    laborCost?: number | null
    createdAt: string
}

export default function RepairDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const [ticket, setTicket] = useState<RepairTicket | null>(null)
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)

    // Form State
    const [status, setStatus] = useState('')
    const [priority, setPriority] = useState('')
    const [techNotes, setTechNotes] = useState('')
    const [estimates, setEstimates] = useState({
        estimated_cost: 0,
        parts_cost: 0,
        labor_cost: 0
    })

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const res = await fetch(`/api/admin/repairs/${params.id}`)
                if (!res.ok) throw new Error('Failed to fetch ticket')
                const data = await res.json()
                setTicket(data.data)

                // Init Form
                setStatus(data.data.status)
                setPriority(data.data.priority)
                setTechNotes(data.data.technicianNotes || '')
                setEstimates({
                    estimated_cost: Number(data.data.estimatedCost) || 0,
                    parts_cost: Number(data.data.partsCost) || 0,
                    labor_cost: Number(data.data.laborCost) || 0
                })
            } catch (error) {
                console.error(error)
                router.push('/admin/repairs')
            } finally {
                setLoading(false)
            }
        }
        if (params.id) fetchTicket()
    }, [params.id, router])

    const handleSave = async () => {
        setUpdating(true)
        try {
            const payload = {
                status,
                priority,
                technician_notes: techNotes,
                ...estimates
            }

            const res = await fetch(`/api/admin/repairs/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (!res.ok) throw new Error('Failed to update ticket')

            toast.success('Ticket updated successfully')
            // Refresh logic if needed, or just stay
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message)
            } else {
                toast.error('Failed to update ticket')
            }
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

    if (!ticket) return null

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-20">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/repairs" className="p-2 hover:bg-slate-100 rounded-full">
                        <ArrowLeft className="h-5 w-5 text-slate-500" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Repair #{ticket.ticketNumber}</h1>
                        <p className="text-slate-500 text-sm">{new Date(ticket.createdAt).toLocaleString()}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSave}
                        disabled={updating}
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                    >
                        {updating && <Loader2 className="h-4 w-4 animate-spin" />}
                        <Save className="h-4 w-4" />
                        Save Changes
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Details & Tech Notes */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Device Info */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                        <h2 className="text-lg font-semibold text-slate-800">Device & Issue</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-slate-500 uppercase font-semibold">Device Model</label>
                                <p className="text-slate-900 font-medium">{ticket.deviceModel}</p>
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 uppercase font-semibold">Brand</label>
                                <p className="text-slate-900 font-medium">{ticket.deviceBrand}</p>
                            </div>
                            <div className="col-span-2">
                                <label className="text-xs text-slate-500 uppercase font-semibold">Issue Description</label>
                                <p className="text-slate-700 mt-1">{ticket.issueDescription}</p>
                            </div>
                            {ticket.imeiSerial && (
                                <div className="col-span-2">
                                    <label className="text-xs text-slate-500 uppercase font-semibold">IMEI / Serial</label>
                                    <p className="text-slate-900 font-medium font-mono">{ticket.imeiSerial}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Technician Notes */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                        <h2 className="text-lg font-semibold text-slate-800">Technician Notes</h2>
                        <textarea
                            value={techNotes}
                            onChange={(e) => setTechNotes(e.target.value)}
                            rows={6}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="Internal notes about the repair process..."
                        />
                    </div>
                </div>

                {/* Right Column: Status, Costs, Customer */}
                <div className="space-y-6">
                    {/* Status & Priority */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                        <h2 className="text-lg font-semibold text-slate-800">Status & Priority</h2>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            >
                                <option value="SUBMITTED">Submitted</option>
                                <option value="CONFIRMED">Confirmed</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="WAITING_PARTS">Waiting Parts</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="CANCELLED">Cancelled</option>
                                <option value="CUSTOMER_PICKUP">Ready for Pickup</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            >
                                <option value="LOW">Low</option>
                                <option value="NORMAL">Normal</option>
                                <option value="HIGH">High</option>
                                <option value="URGENT">Urgent</option>
                            </select>
                        </div>
                    </div>

                    {/* Cost Estimates */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                        <h2 className="text-lg font-semibold text-slate-800">Cost Estimates</h2>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Parts Cost ($)</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={estimates.parts_cost}
                                onChange={(e) => setEstimates({ ...estimates, parts_cost: parseFloat(e.target.value) })}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Labor Cost ($)</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={estimates.labor_cost}
                                onChange={(e) => setEstimates({ ...estimates, labor_cost: parseFloat(e.target.value) })}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>

                        <div className="pt-2 border-t border-slate-100">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Total Estimated ($)</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={estimates.estimated_cost}
                                onChange={(e) => setEstimates({ ...estimates, estimated_cost: parseFloat(e.target.value) })}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold bg-slate-50"
                            />
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-2 flex items-center gap-2">
                            <User className="h-4 w-4" /> Customer
                        </h2>
                        <div>
                            <p className="text-sm font-medium text-slate-900">{ticket.customerName}</p>
                            <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                                <Mail className="h-3 w-3" /> {ticket.customerEmail}
                            </div>
                            {ticket.customerPhone && (
                                <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                                    <Phone className="h-3 w-3" /> {ticket.customerPhone}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
