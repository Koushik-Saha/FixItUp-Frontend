'use client'

import { useState } from 'react'
import { Shield, Upload, X, Calendar, Package, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

type ClaimStatus = 'pending' | 'reviewing' | 'approved' | 'rejected' | 'completed'

interface WarrantyClaim {
    id: string
    order_number: string
    product_name: string
    product_image: string
    issue_type: string
    description: string
    status: ClaimStatus
    created_at: string
    updated_at: string
    resolution?: string
}

interface MediaFile {
    id: string
    file: File
    preview: string
}

export default function WarrantyClaimsPage() {
    const [claims, setClaims] = useState<WarrantyClaim[]>([])
    const [showNewClaimForm, setShowNewClaimForm] = useState(false)
    const [selectedClaim, setSelectedClaim] = useState<WarrantyClaim | null>(null)

    // New claim form state
    const [orderNumber, setOrderNumber] = useState('')
    const [productId, setProductId] = useState('')
    const [issueType, setIssueType] = useState('')
    const [description, setDescription] = useState('')
    const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
    const [submitting, setSubmitting] = useState(false)

    const sampleClaims: WarrantyClaim[] = [
        {
            id: '1',
            order_number: 'ORD-20240115-001',
            product_name: 'iPhone 15 Pro Max OLED Display',
            product_image: '/placeholder-product.jpg',
            issue_type: 'Dead Pixels',
            description: 'Found several dead pixels on the left side of the screen after installation.',
            status: 'reviewing',
            created_at: '2024-01-20',
            updated_at: '2024-01-21'
        }
    ]

    const issueTypes = [
        { value: 'dead_pixels', label: 'Dead Pixels' },
        { value: 'touch_not_working', label: 'Touch Not Working' },
        { value: 'display_issues', label: 'Display Issues' },
        { value: 'fitment_problems', label: 'Fitment Problems' },
        { value: 'color_mismatch', label: 'Color Mismatch' },
        { value: 'defective_part', label: 'Defective Part' },
        { value: 'other', label: 'Other' }
    ]

    const getStatusConfig = (status: ClaimStatus) => {
        const configs = {
            pending: {
                label: 'Pending Review',
                color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
                icon: Clock
            },
            reviewing: {
                label: 'Under Review',
                color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
                icon: AlertCircle
            },
            approved: {
                label: 'Approved',
                color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
                icon: CheckCircle
            },
            rejected: {
                label: 'Rejected',
                color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
                icon: X
            },
            completed: {
                label: 'Completed',
                color: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300',
                icon: CheckCircle
            }
        }
        return configs[status]
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])

        if (mediaFiles.length + files.length > 5) {
            toast.error('Maximum 5 images allowed')
            return
        }

        const newMediaFiles: MediaFile[] = files.map(file => ({
            id: Math.random().toString(36).substring(7),
            file,
            preview: URL.createObjectURL(file)
        }))

        setMediaFiles(prev => [...prev, ...newMediaFiles])
    }

    const removeMedia = (id: string) => {
        setMediaFiles(prev => {
            const file = prev.find(f => f.id === id)
            if (file) {
                URL.revokeObjectURL(file.preview)
            }
            return prev.filter(f => f.id !== id)
        })
    }

    const handleSubmitClaim = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!orderNumber || !issueType || !description) {
            toast.error('Please fill in all required fields')
            return
        }

        try {
            setSubmitting(true)

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000))

            toast.success('Warranty claim submitted successfully!')

            // Reset form
            setOrderNumber('')
            setProductId('')
            setIssueType('')
            setDescription('')
            setMediaFiles([])
            setShowNewClaimForm(false)

        } catch (error) {
            toast.error('Failed to submit claim')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
                                Warranty Claims
                            </h1>
                            <p className="text-neutral-600 dark:text-neutral-400">
                                Manage your warranty claims and replacements
                            </p>
                        </div>
                    </div>

                    {!showNewClaimForm && (
                        <button
                            onClick={() => setShowNewClaimForm(true)}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                            File New Claim
                        </button>
                    )}
                </div>

                {/* Info Banner */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
                    <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 text-sm text-blue-900 dark:text-blue-100">
                            <p className="font-semibold mb-1">12-Month Warranty Coverage</p>
                            <p className="text-blue-800 dark:text-blue-200">
                                All our products are covered by a comprehensive 12-month warranty against manufacturing defects.
                                Claims are typically processed within 2-3 business days.
                            </p>
                        </div>
                    </div>
                </div>

                {/* New Claim Form */}
                {showNewClaimForm && (
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6 mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                                File New Warranty Claim
                            </h2>
                            <button
                                onClick={() => setShowNewClaimForm(false)}
                                className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitClaim} className="space-y-6">
                            {/* Order Number */}
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                    Order Number *
                                </label>
                                <input
                                    type="text"
                                    value={orderNumber}
                                    onChange={(e) => setOrderNumber(e.target.value)}
                                    placeholder="ORD-20240115-001"
                                    className="w-full px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            {/* Issue Type */}
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                    Issue Type *
                                </label>
                                <select
                                    value={issueType}
                                    onChange={(e) => setIssueType(e.target.value)}
                                    className="w-full px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select issue type</option>
                                    {issueTypes.map(type => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                    Issue Description *
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Please describe the issue in detail..."
                                    rows={6}
                                    className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    required
                                />
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                                    Please provide as much detail as possible to help us process your claim faster.
                                </p>
                            </div>

                            {/* Photo Upload */}
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                    Photos of the Issue
                                </label>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">
                                    Upload clear photos showing the defect. Max 5 images (10MB each)
                                </p>

                                {mediaFiles.length < 5 && (
                                    <label className="block w-full border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleFileUpload}
                                            className="hidden"
                                        />
                                        <Upload className="h-8 w-8 mx-auto mb-2 text-neutral-400" />
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                            Click to upload or drag and drop
                                        </p>
                                        <p className="text-xs text-neutral-500 mt-1">JPG, PNG (max 10MB)</p>
                                    </label>
                                )}

                                {mediaFiles.length > 0 && (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-4">
                                        {mediaFiles.map((media) => (
                                            <div key={media.id} className="relative group aspect-square bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden">
                                                <Image
                                                    src={media.preview}
                                                    alt="Claim evidence"
                                                    fill
                                                    className="object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeMedia(media.id)}
                                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Submit */}
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-neutral-300 disabled:text-neutral-500 dark:disabled:bg-neutral-700 transition-colors"
                                >
                                    {submitting ? 'Submitting...' : 'Submit Claim'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowNewClaimForm(false)}
                                    className="px-6 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Claims List */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
                        Your Claims
                    </h2>

                    {sampleClaims.length === 0 ? (
                        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg p-12 text-center">
                            <FileText className="h-12 w-12 mx-auto mb-4 text-neutral-300 dark:text-neutral-600" />
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                                No Claims Yet
                            </h3>
                            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                                You haven't filed any warranty claims yet.
                            </p>
                        </div>
                    ) : (
                        sampleClaims.map((claim) => {
                            const statusConfig = getStatusConfig(claim.status)
                            const StatusIcon = statusConfig.icon

                            return (
                                <div
                                    key={claim.id}
                                    className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                                >
                                    <div className="p-6">
                                        <div className="flex gap-4">
                                            {/* Product Image */}
                                            <div className="flex-shrink-0 w-20 h-20 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center text-3xl">
                                                📱
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between gap-4 mb-3">
                                                    <div>
                                                        <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">
                                                            {claim.product_name}
                                                        </h3>
                                                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                                            Order: {claim.order_number}
                                                        </p>
                                                    </div>
                                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${statusConfig.color} text-sm font-medium`}>
                                                        <StatusIcon className="h-4 w-4" />
                                                        {statusConfig.label}
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <AlertCircle className="h-4 w-4 text-neutral-400" />
                                                        <span className="font-medium text-neutral-700 dark:text-neutral-300">
                                                            Issue:
                                                        </span>
                                                        <span className="text-neutral-600 dark:text-neutral-400">
                                                            {claim.issue_type}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Calendar className="h-4 w-4 text-neutral-400" />
                                                        <span className="font-medium text-neutral-700 dark:text-neutral-300">
                                                            Filed:
                                                        </span>
                                                        <span className="text-neutral-600 dark:text-neutral-400">
                                                            {new Date(claim.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>

                                                    <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-3">
                                                        {claim.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {claim.resolution && (
                                            <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                                                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                                                    <span className="font-semibold">Resolution:</span> {claim.resolution}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    )
}
