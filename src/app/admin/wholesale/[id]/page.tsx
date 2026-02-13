'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
    Loader2,
    ArrowLeft,
    Building2,
    Globe,
    FileText,
    CheckCircle,
    XCircle
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function WholesaleDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const [app, setApp] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [processing, setProcessing] = useState(false)
    const [rejectReason, setRejectReason] = useState('')

    useEffect(() => {
        const fetchApp = async () => {
            try {
                const res = await fetch(`/api/admin/wholesale/${params.id}`)
                if (!res.ok) throw new Error('Failed to fetch application')
                const data = await res.json()
                setApp(data.data)
            } catch (error) {
                console.error(error)
                router.push('/admin/wholesale')
            } finally {
                setLoading(false)
            }
        }
        if (params.id) fetchApp()
    }, [params.id, router])

    const handleAction = async (status: 'APPROVED' | 'REJECTED') => {
        if (status === 'REJECTED' && !rejectReason) {
            toast.error('Please provide a rejection reason')
            return
        }

        if (!confirm(`Are you sure you want to ${status.toLowerCase()} this application?`)) return

        setProcessing(true)
        try {
            const res = await fetch(`/api/admin/wholesale/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status,
                    approved_tier: status === 'APPROVED' ? app.requestedTier : null,
                    rejection_reason: status === 'REJECTED' ? rejectReason : null
                })
            })

            if (!res.ok) throw new Error('Failed to update application')

            toast.success(`Application ${status.toLowerCase()}`)
            router.push('/admin/wholesale')
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setProcessing(false)
        }
    }

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        )
    }

    if (!app) return null

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-20">
            <div className="flex items-center gap-4">
                <Link href="/admin/wholesale" className="p-2 hover:bg-slate-100 rounded-full">
                    <ArrowLeft className="h-5 w-5 text-slate-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">{app.businessName}</h1>
                    <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize 
                        ${app.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                            app.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {app.status.toLowerCase()}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Business Info */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-slate-500" /> Business Details
                    </h2>
                    <div className="space-y-3">
                        <div>
                            <span className="text-xs text-slate-500 uppercase font-semibold">Type</span>
                            <p className="text-sm font-medium">{app.businessType}</p>
                        </div>
                        <div>
                            <span className="text-xs text-slate-500 uppercase font-semibold">Tax ID / EIN</span>
                            <p className="text-sm font-medium font-mono bg-slate-50 p-1 rounded inline-block">{app.taxId}</p>
                        </div>
                        {app.website && (
                            <div>
                                <span className="text-xs text-slate-500 uppercase font-semibold flex items-center gap-1">
                                    <Globe className="h-3 w-3" /> Website
                                </span>
                                <a href={app.website.startsWith('http') ? app.website : `https://${app.website}`} target="_blank" className="text-sm text-blue-600 hover:underline">
                                    {app.website}
                                </a>
                            </div>
                        )}
                        <div>
                            <span className="text-xs text-slate-500 uppercase font-semibold">Requested Tier</span>
                            <p className="text-sm font-medium">{app.requestedTier}</p>
                        </div>
                    </div>
                </div>

                {/* Contact Info */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <h2 className="text-lg font-semibold text-slate-800">Contact Information</h2>
                    <div className="space-y-3">
                        <div>
                            <span className="text-xs text-slate-500 uppercase font-semibold">Contact Person</span>
                            <p className="text-sm font-medium">{app.user.fullName}</p>
                            <p className="text-xs text-slate-500">{app.user.email}</p>
                        </div>
                        <div>
                            <span className="text-xs text-slate-500 uppercase font-semibold">Business Phone</span>
                            <p className="text-sm font-medium">{app.businessPhone}</p>
                        </div>
                        <div>
                            <span className="text-xs text-slate-500 uppercase font-semibold">Business Email</span>
                            <p className="text-sm font-medium">{app.businessEmail}</p>
                        </div>
                        <div>
                            <span className="text-xs text-slate-500 uppercase font-semibold">Business Address</span>
                            <div className="text-sm text-slate-600 mt-1">
                                <p>{app.businessAddress.street1}</p>
                                {app.businessAddress.street2 && <p>{app.businessAddress.street2}</p>}
                                <p>{app.businessAddress.city}, {app.businessAddress.state} {app.businessAddress.zipCode}</p>
                                <p>{app.businessAddress.country}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Documents */}
                <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-slate-500" /> Documents
                    </h2>
                    {app.documents && app.documents.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {app.documents.map((doc: string, idx: number) => (
                                <a key={idx} href={doc} target="_blank" className="block p-4 border border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center">
                                    <FileText className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                                    <span className="text-xs text-slate-600 truncate block">Document {idx + 1}</span>
                                </a>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-500 italic">No documents uploaded.</p>
                    )}
                </div>

                {/* Action Area */}
                {app.status === 'PENDING' && (
                    <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                        <h2 className="text-lg font-semibold text-slate-800">Review Application</h2>

                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Rejection Reason (if rejecting)</label>
                                <textarea
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    placeholder="Please provide a reason for rejection..."
                                />
                            </div>
                            <div className="flex flex-col justify-end gap-3">
                                <button
                                    onClick={() => handleAction('APPROVED')}
                                    disabled={processing}
                                    className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
                                >
                                    {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                                    Approve Application
                                </button>
                                <button
                                    onClick={() => handleAction('REJECTED')}
                                    disabled={processing}
                                    className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
                                >
                                    {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                                    Reject Application
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
