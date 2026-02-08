'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getRepair, Repair } from '@/lib/api/repairs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Loader2, ArrowLeft, Wrench, Calendar, Smartphone, FileText, DollarSign } from 'lucide-react'
import { toast } from 'sonner'

export default function RepairDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string

    const [repair, setRepair] = useState<Repair | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchRepair = async () => {
            try {
                const res = await getRepair(id)
                // Map API response to match Repair type if needed, 
                // but getRepair now returns typed response
                // Wait, getRepair returns { data: Repair }? 
                // Check src/lib/api/repairs.ts update
                // It returns Promise<{ data: Repair }>
                setRepair(res.data)
            } catch (error) {
                toast.error("Failed to load repair details")
            } finally {
                setLoading(false)
            }
        }
        if (id) fetchRepair()
    }, [id])

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-neutral-500" />
            </div>
        )
    }

    if (!repair) {
        return (
            <div className="text-center py-10">
                <p className="text-neutral-500">Repair ticket not found.</p>
                <Button variant="link" onClick={() => router.back()}>Go Back</Button>
            </div>
        )
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Wrench className="h-8 w-8 text-blue-500" />
                        Repair #{repair.ticketNumber}
                    </h1>
                    <p className="text-neutral-500 mt-2">
                        Created on {formatDate(repair.createdAt)}
                    </p>
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-semibold text-center
                    ${repair.status === 'COMPLETED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        repair.status === 'IN_PROGRESS' || repair.status === 'DIAGNOSED' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                            repair.status === 'CANCELLED' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                    {repair.status.replace('_', ' ')}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Details */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Smartphone className="h-5 w-5 text-neutral-500" /> Device Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-neutral-500">Brand</p>
                                    <p>{repair.deviceBrand}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-neutral-500">Model</p>
                                    <p>{repair.deviceModel}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <FileText className="h-5 w-5 text-neutral-500" /> Issue Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-neutral-500">Category</p>
                                <p className="capitalize">{repair.issueCategory}</p>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-sm font-medium text-neutral-500 mb-2">Description</p>
                                <p className="text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-900 p-4 rounded-lg">
                                    {repair.issueDescription}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {repair.technicianNotes && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Wrench className="h-5 w-5 text-neutral-500" /> Technician Notes
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-neutral-700 dark:text-neutral-300">
                                    {repair.technicianNotes}
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Side Panel Costs */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <DollarSign className="h-5 w-5 text-neutral-500" /> Cost Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {repair.actualCost ? (
                                <div>
                                    <p className="text-sm font-medium text-neutral-500">Final Cost</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        ${Number(repair.actualCost).toFixed(2)}
                                    </p>
                                </div>
                            ) : repair.estimatedCost ? (
                                <div>
                                    <p className="text-sm font-medium text-neutral-500">Estimated Cost</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        ${Number(repair.estimatedCost).toFixed(2)}
                                    </p>
                                    <p className="text-xs text-neutral-400 mt-1">
                                        Final price may vary based on diagnosis.
                                    </p>
                                </div>
                            ) : (
                                <p className="text-neutral-500 italic">
                                    Cost estimate pending diagnosis.
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Calendar className="h-5 w-5 text-neutral-500" /> Timeline
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative border-l border-neutral-200 dark:border-neutral-800 ml-2 pl-6 space-y-6">
                                <div className="relative">
                                    <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-blue-500 ring-4 ring-white dark:ring-neutral-950" />
                                    <p className="text-sm font-semibold">Ticket Created</p>
                                    <p className="text-xs text-neutral-500">{formatDate(repair.createdAt)}</p>
                                </div>
                                {/* Add more timeline events if available in data */}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
