'use client'

import { useState } from 'react'
import { Star, Upload, X, Image as ImageIcon, Video, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface ReviewSubmissionFormProps {
    productId: string
    productName: string
    onSuccess?: () => void
}

interface MediaFile {
    id: string
    file: File
    preview: string
    type: 'image' | 'video'
}

export default function ReviewSubmissionForm({
    productId,
    productName,
    onSuccess
}: ReviewSubmissionFormProps) {
    const [rating, setRating] = useState(0)
    const [hoveredRating, setHoveredRating] = useState(0)
    const [title, setTitle] = useState('')
    const [review, setReview] = useState('')
    const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
    const [uploading, setUploading] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])

        if (mediaFiles.length + files.length > 5) {
            toast.error('Maximum 5 photos/videos allowed')
            return
        }

        const newMediaFiles: MediaFile[] = files.map(file => {
            const isVideo = file.type.startsWith('video/')

            // Validate file size (10MB for images, 50MB for videos)
            const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024
            if (file.size > maxSize) {
                toast.error(`${file.name} is too large. Max ${isVideo ? '50MB' : '10MB'} for ${isVideo ? 'videos' : 'images'}`)
                return null
            }

            return {
                id: Math.random().toString(36).substring(7),
                file,
                preview: URL.createObjectURL(file),
                type: isVideo ? 'video' : 'image'
            }
        }).filter(Boolean) as MediaFile[]

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (rating === 0) {
            toast.error('Please select a rating')
            return
        }

        if (!review.trim()) {
            toast.error('Please write a review')
            return
        }

        try {
            setSubmitting(true)

            // Upload media files first (in real app, upload to cloud storage)
            const mediaUrls: string[] = []
            if (mediaFiles.length > 0) {
                setUploading(true)
                // Simulated upload - replace with actual upload logic
                await new Promise(resolve => setTimeout(resolve, 1500))
                // In production, upload to S3/Cloudinary and get URLs
                mediaFiles.forEach(media => {
                    mediaUrls.push(media.preview) // Replace with actual uploaded URL
                })
                setUploading(false)
            }

            // Submit review
            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product_id: productId,
                    rating,
                    title,
                    review,
                    media: mediaUrls
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to submit review')
            }

            toast.success('Review submitted successfully!')

            // Reset form
            setRating(0)
            setTitle('')
            setReview('')
            setMediaFiles([])

            onSuccess?.()

        } catch (error: any) {
            console.error('Review submission error:', error)
            toast.error(error.message || 'Failed to submit review')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header */}
            <div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                    Write a Review
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Share your experience with {productName}
                </p>
            </div>

            {/* Rating */}
            <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                    Overall Rating *
                </label>
                <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            className="transition-transform hover:scale-110"
                        >
                            <Star
                                className={`h-8 w-8 ${
                                    star <= (hoveredRating || rating)
                                        ? 'fill-yellow-500 text-yellow-500'
                                        : 'text-neutral-300 dark:text-neutral-600'
                                }`}
                            />
                        </button>
                    ))}
                    {rating > 0 && (
                        <span className="ml-2 text-sm text-neutral-600 dark:text-neutral-400">
                            {rating} out of 5 stars
                        </span>
                    )}
                </div>
            </div>

            {/* Title */}
            <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                    Review Title
                </label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Summarize your experience"
                    className="w-full px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxLength={100}
                />
            </div>

            {/* Review Text */}
            <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                    Your Review *
                </label>
                <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Tell us about your experience with this product..."
                    rows={6}
                    className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    maxLength={1000}
                />
                <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Minimum 50 characters
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {review.length}/1000
                    </p>
                </div>
            </div>

            {/* Media Upload */}
            <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                    Add Photos or Videos (Optional)
                </label>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">
                    Help others by showing your purchase. Max 5 files (Images: 10MB, Videos: 50MB each)
                </p>

                {/* Upload Area */}
                {mediaFiles.length < 5 && (
                    <label className="block w-full border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                        <input
                            type="file"
                            accept="image/*,video/*"
                            multiple
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                        <Upload className="h-8 w-8 mx-auto mb-2 text-neutral-400" />
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                            JPG, PNG, MP4, MOV
                        </p>
                    </label>
                )}

                {/* Media Preview */}
                {mediaFiles.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-4">
                        {mediaFiles.map((media) => (
                            <div key={media.id} className="relative group aspect-square bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden">
                                {media.type === 'image' ? (
                                    <Image
                                        src={media.preview}
                                        alt="Review media"
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="relative w-full h-full">
                                        <video
                                            src={media.preview}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                            <Video className="h-8 w-8 text-white" />
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={() => removeMedia(media.id)}
                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="h-4 w-4" />
                                </button>

                                <div className="absolute bottom-1 left-1">
                                    {media.type === 'image' ? (
                                        <ImageIcon className="h-4 w-4 text-white drop-shadow" />
                                    ) : (
                                        <Video className="h-4 w-4 text-white drop-shadow" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={submitting || uploading || rating === 0 || review.length < 50}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-neutral-300 disabled:text-neutral-500 dark:disabled:bg-neutral-700 dark:disabled:text-neutral-400 transition-colors flex items-center justify-center gap-2"
                >
                    {uploading ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Uploading media...
                        </>
                    ) : submitting ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Submitting...
                        </>
                    ) : (
                        'Submit Review'
                    )}
                </button>
            </div>
        </form>
    )
}
