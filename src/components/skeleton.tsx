'use client'

import { cn } from '@/lib/utils'

interface SkeletonProps {
    className?: string
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn(
                'animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-800',
                className
            )}
        />
    )
}

export function ProductCardSkeleton() {
    return (
        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
            {/* Image */}
            <Skeleton className="aspect-square w-full" />

            {/* Content */}
            <div className="p-4 space-y-3">
                {/* Brand */}
                <Skeleton className="h-3 w-24" />

                {/* Title */}
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />

                {/* SKU */}
                <Skeleton className="h-3 w-20" />

                {/* Rating */}
                <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-12" />
                </div>

                {/* Badge */}
                <Skeleton className="h-5 w-16" />

                {/* Price */}
                <Skeleton className="h-6 w-24" />

                {/* Stock */}
                <Skeleton className="h-5 w-20" />

                {/* Button */}
                <Skeleton className="h-10 w-full" />
            </div>
        </div>
    )
}

export function ProductDetailSkeleton() {
    return (
        <div className="min-h-screen bg-white dark:bg-neutral-900">
            {/* Breadcrumbs */}
            <div className="border-b border-neutral-200 dark:border-neutral-700">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Left - Images */}
                    <div>
                        <Skeleton className="aspect-square w-full rounded-lg mb-4" />
                        <div className="grid grid-cols-4 gap-3">
                            {[...Array(4)].map((_, i) => (
                                <Skeleton key={i} className="aspect-square rounded-lg" />
                            ))}
                        </div>
                    </div>

                    {/* Right - Info */}
                    <div className="space-y-6">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export function ReviewSkeleton() {
    return (
        <div className="border-b border-neutral-200 dark:border-neutral-700 py-6">
            <div className="flex items-start gap-4">
                {/* Avatar */}
                <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />

                <div className="flex-1 space-y-3">
                    {/* Name & Rating */}
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-20" />
                    </div>

                    {/* Date */}
                    <Skeleton className="h-3 w-24" />

                    {/* Review Text */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>

                    {/* Images */}
                    <div className="flex gap-2">
                        {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} className="h-20 w-20 rounded-lg" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export function CartItemSkeleton() {
    return (
        <div className="flex gap-4 p-4 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <Skeleton className="h-24 w-24 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-1/4" />
                <div className="flex items-center gap-4 mt-3">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-6 w-20" />
                </div>
            </div>
            <Skeleton className="h-6 w-16" />
        </div>
    )
}

export function OrderSkeleton() {
    return (
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-8 w-24" />
            </div>

            <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex gap-3">
                        <Skeleton className="h-16 w-16 rounded" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-3 w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export function WishlistItemSkeleton() {
    return (
        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
            <div className="flex gap-4 p-4">
                <Skeleton className="h-24 w-24 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-6 w-24" />
                    <div className="flex gap-2 mt-3">
                        <Skeleton className="h-9 w-32" />
                        <Skeleton className="h-9 w-9" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
    return (
        <div className="space-y-3">
            {/* Header */}
            <div className="flex gap-4 pb-3 border-b border-neutral-200 dark:border-neutral-700">
                {[...Array(columns)].map((_, i) => (
                    <Skeleton key={i} className="h-4 flex-1" />
                ))}
            </div>

            {/* Rows */}
            {[...Array(rows)].map((_, rowIndex) => (
                <div key={rowIndex} className="flex gap-4 py-3">
                    {[...Array(columns)].map((_, colIndex) => (
                        <Skeleton key={colIndex} className="h-4 flex-1" />
                    ))}
                </div>
            ))}
        </div>
    )
}
