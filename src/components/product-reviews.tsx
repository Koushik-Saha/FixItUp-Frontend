'use client'

import { useState } from 'react'
import { Star, ThumbsUp, ThumbsDown, Video, Filter } from 'lucide-react'
import Image from 'next/image'
import { ReviewSkeleton } from './skeleton'
import ReviewSubmissionForm from './review-submission-form'

interface Review {
    id: string
    user_name: string
    user_avatar?: string
    rating: number
    title: string
    review: string
    created_at: string
    helpful_count: number
    media: ReviewMedia[]
    verified_purchase: boolean
    quality_grade?: 'oem' | 'premium' | 'standard'
    device_model?: string
}

interface ReviewMedia {
    id: string
    type: 'image' | 'video'
    url: string
    thumbnail?: string
}

interface ProductReviewsProps {
    productId: string
    productName: string
    averageRating: number
    totalReviews: number
}

export default function ProductReviews({
    productId,
    productName,
    averageRating,
    totalReviews
}: ProductReviewsProps) {
    // Reviews state (using sample data for now)
    // const [reviews, setReviews] = useState<Review[]>([])
    const [loading] = useState(false)
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const [showReviewForm, setShowReviewForm] = useState(false)

    // Filters
    const [filterRating, setFilterRating] = useState<number | null>(null)
    const [filterGrade, setFilterGrade] = useState<string | null>(null)
    const [filterDevice, setFilterDevice] = useState<string | null>(null)
    const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'rating_high' | 'rating_low'>('recent')

    // Pagination
    const [page, setPage] = useState(1)
    const [hasMore] = useState(true)

    // Sample data - replace with actual API call
    const sampleReviews: Review[] = [
        {
            id: '1',
            user_name: 'John Smith',
            rating: 5,
            title: 'Excellent quality, works perfectly!',
            review: 'Installed this screen on my iPhone 15 Pro Max and it works flawlessly. The True Tone feature works perfectly, and the touch sensitivity is just as good as the original. The quality is outstanding and the installation was easier than I expected. Highly recommend!',
            created_at: '2024-01-15',
            helpful_count: 24,
            media: [
                {
                    id: 'm1',
                    type: 'image',
                    url: '/placeholder-review-1.jpg'
                }
            ],
            verified_purchase: true,
            quality_grade: 'premium',
            device_model: 'iPhone 15 Pro Max'
        },
        {
            id: '2',
            user_name: 'Sarah Johnson',
            rating: 4,
            title: 'Great value for the price',
            review: 'The screen quality is very good for the price. Installation took about 20 minutes with the tools that came with it. The only minor issue is that the oleophobic coating seems slightly different from the original, but it\'s not a deal breaker.',
            created_at: '2024-01-10',
            helpful_count: 15,
            media: [],
            verified_purchase: true,
            quality_grade: 'premium',
            device_model: 'iPhone 15 Pro Max'
        }
    ]

    const ratingDistribution = [
        { stars: 5, count: 145, percentage: 72 },
        { stars: 4, count: 35, percentage: 17 },
        { stars: 3, count: 15, percentage: 7 },
        { stars: 2, count: 5, percentage: 2 },
        { stars: 1, count: 2, percentage: 1 }
    ]

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    return (
        <div className="space-y-8">
            {/* Rating Summary */}
            <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-6">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Overall Rating */}
                    <div className="text-center md:text-left">
                        <div className="text-5xl font-bold text-neutral-900 dark:text-white mb-2">
                            {averageRating.toFixed(1)}
                        </div>
                        <div className="flex items-center justify-center md:justify-start gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-5 w-5 ${i < Math.floor(averageRating)
                                        ? 'fill-yellow-500 text-yellow-500'
                                        : 'text-neutral-300 dark:text-neutral-600'
                                        }`}
                                />
                            ))}
                        </div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Based on {totalReviews} reviews
                        </p>

                        <button
                            onClick={() => setShowReviewForm(!showReviewForm)}
                            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Write a Review
                        </button>
                    </div>

                    {/* Rating Distribution */}
                    <div className="space-y-2">
                        {ratingDistribution.map((item) => (
                            <button
                                key={item.stars}
                                onClick={() => setFilterRating(filterRating === item.stars ? null : item.stars)}
                                className={`w-full flex items-center gap-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded p-2 transition-colors ${filterRating === item.stars ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                    }`}
                            >
                                <div className="flex items-center gap-1 w-16">
                                    <span className="text-sm font-medium">{item.stars}</span>
                                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                </div>
                                <div className="flex-1 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-yellow-500"
                                        style={{ width: `${item.percentage}%` }}
                                    />
                                </div>
                                <span className="text-sm text-neutral-600 dark:text-neutral-400 w-12 text-right">
                                    {item.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Review Form */}
            {showReviewForm && (
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
                    <ReviewSubmissionForm
                        productId={productId}
                        productName={productName}
                        onSuccess={() => {
                            setShowReviewForm(false)
                            // Refresh reviews
                        }}
                    />
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    <Filter className="h-4 w-4" />
                    <span>Filter by:</span>
                </div>

                {/* Grade Filter */}
                <select
                    value={filterGrade || ''}
                    onChange={(e) => setFilterGrade(e.target.value || null)}
                    className="px-3 py-1.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm"
                >
                    <option value="">All Grades</option>
                    <option value="oem">OEM</option>
                    <option value="premium">Premium</option>
                    <option value="standard">Standard</option>
                </select>

                {/* Device Filter */}
                <select
                    value={filterDevice || ''}
                    onChange={(e) => setFilterDevice(e.target.value || null)}
                    className="px-3 py-1.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm"
                >
                    <option value="">All Devices</option>
                    <option value="iPhone 15 Pro Max">iPhone 15 Pro Max</option>
                    <option value="iPhone 15 Pro">iPhone 15 Pro</option>
                    <option value="iPhone 15">iPhone 15</option>
                </select>

                <div className="flex-1" />

                {/* Sort */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">Sort by:</span>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'recent' | 'helpful' | 'rating_high' | 'rating_low')}
                        className="px-3 py-1.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm"
                    >
                        <option value="recent">Most Recent</option>
                        <option value="helpful">Most Helpful</option>
                        <option value="rating_high">Highest Rating</option>
                        <option value="rating_low">Lowest Rating</option>
                    </select>
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
                {loading ? (
                    [...Array(3)].map((_, i) => <ReviewSkeleton key={i} />)
                ) : sampleReviews.length > 0 ? (
                    sampleReviews.map((review) => (
                        <div
                            key={review.id}
                            className="border-b border-neutral-200 dark:border-neutral-700 pb-6"
                        >
                            <div className="flex items-start gap-4">
                                {/* Avatar */}
                                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                    {review.user_name.charAt(0).toUpperCase()}
                                </div>

                                <div className="flex-1">
                                    {/* Header */}
                                    <div className="flex items-start justify-between gap-4 mb-2">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold text-neutral-900 dark:text-white">
                                                    {review.user_name}
                                                </span>
                                                {review.verified_purchase && (
                                                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full">
                                                        Verified Purchase
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`h-4 w-4 ${i < review.rating
                                                                ? 'fill-yellow-500 text-yellow-500'
                                                                : 'text-neutral-300 dark:text-neutral-600'
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                                                    {formatDate(review.created_at)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Grade & Device Badges */}
                                        <div className="flex flex-col gap-1 items-end">
                                            {review.quality_grade && (
                                                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                                                    {review.quality_grade.toUpperCase()}
                                                </span>
                                            )}
                                            {review.device_model && (
                                                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                                    {review.device_model}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Title */}
                                    {review.title && (
                                        <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">
                                            {review.title}
                                        </h4>
                                    )}

                                    {/* Review Text */}
                                    <p className="text-neutral-700 dark:text-neutral-300 mb-3 whitespace-pre-line">
                                        {review.review}
                                    </p>

                                    {/* Media */}
                                    {review.media.length > 0 && (
                                        <div className="flex gap-2 mb-3 flex-wrap">
                                            {review.media.map((media) => (
                                                <div key={media.id} className="relative w-24 h-24 bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden group cursor-pointer">
                                                    {media.type === 'image' ? (
                                                        <Image
                                                            src={media.thumbnail || media.url}
                                                            alt="Review media"
                                                            fill
                                                            className="object-cover group-hover:scale-110 transition-transform"
                                                        />
                                                    ) : (
                                                        <div className="relative w-full h-full">
                                                            <Image
                                                                src={media.thumbnail || '/placeholder-video.jpg'}
                                                                alt="Video thumbnail"
                                                                fill
                                                                className="object-cover"
                                                            />
                                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                                                <Video className="h-6 w-6 text-white" />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Helpful */}
                                    <div className="flex items-center gap-4">
                                        <button className="flex items-center gap-1 text-sm text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400">
                                            <ThumbsUp className="h-4 w-4" />
                                            <span>Helpful ({review.helpful_count})</span>
                                        </button>
                                        <button className="flex items-center gap-1 text-sm text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400">
                                            <ThumbsDown className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12">
                        <p className="text-neutral-500 dark:text-neutral-400">No reviews yet</p>
                        <button
                            onClick={() => setShowReviewForm(true)}
                            className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            Be the first to review this product
                        </button>
                    </div>
                )}
            </div>

            {/* Load More */}
            {hasMore && sampleReviews.length > 0 && (
                <div className="text-center">
                    <button
                        onClick={() => setPage(page + 1)}
                        className="px-6 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                    >
                        Load More Reviews
                    </button>
                </div>
            )}
        </div>
    )
}
