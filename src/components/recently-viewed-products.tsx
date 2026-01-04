'use client'

import { useRecentlyViewed } from '@/hooks/useRecentlyViewed'
import { Clock, X, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useRef, useState } from 'react'

interface RecentlyViewedProductsProps {
    title?: string
    showClearButton?: boolean
    limit?: number
    className?: string
}

export default function RecentlyViewedProducts({
    title = 'Recently Viewed',
    showClearButton = true,
    limit,
    className = ''
}: RecentlyViewedProductsProps) {
    const { recentlyViewed, removeProduct, clearAll, getProducts } = useRecentlyViewed()
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [showLeftScroll, setShowLeftScroll] = useState(false)
    const [showRightScroll, setShowRightScroll] = useState(false)

    const products = limit ? getProducts(limit) : recentlyViewed

    const checkScroll = () => {
        const container = scrollContainerRef.current
        if (!container) return

        setShowLeftScroll(container.scrollLeft > 0)
        setShowRightScroll(
            container.scrollLeft < container.scrollWidth - container.clientWidth - 10
        )
    }

    const scroll = (direction: 'left' | 'right') => {
        const container = scrollContainerRef.current
        if (!container) return

        const scrollAmount = 300
        const newScrollLeft = direction === 'left'
            ? container.scrollLeft - scrollAmount
            : container.scrollLeft + scrollAmount

        container.scrollTo({
            left: newScrollLeft,
            behavior: 'smooth'
        })

        setTimeout(checkScroll, 100)
    }

    if (products.length === 0) {
        return null
    }

    return (
        <div className={`bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                        {title}
                    </h2>
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">
                        ({products.length})
                    </span>
                </div>
                {showClearButton && products.length > 0 && (
                    <button
                        onClick={clearAll}
                        className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1"
                    >
                        <X className="h-4 w-4" />
                        Clear All
                    </button>
                )}
            </div>

            {/* Products Carousel */}
            <div className="relative">
                {/* Left Scroll Button */}
                {showLeftScroll && (
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-neutral-800 p-2 rounded-full shadow-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                    >
                        <ChevronLeft className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
                    </button>
                )}

                {/* Right Scroll Button */}
                {showRightScroll && (
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-neutral-800 p-2 rounded-full shadow-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                    >
                        <ChevronRight className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
                    </button>
                )}

                {/* Scrollable Container */}
                <div
                    ref={scrollContainerRef}
                    onScroll={checkScroll}
                    className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        WebkitOverflowScrolling: 'touch'
                    }}
                >
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="flex-shrink-0 w-48 group relative"
                        >
                            {/* Remove Button */}
                            <button
                                onClick={(e) => {
                                    e.preventDefault()
                                    removeProduct(product.id)
                                }}
                                className="absolute top-2 right-2 z-10 bg-white dark:bg-neutral-800 p-1 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                            </button>

                            <Link
                                href={`/products/${product.id}`}
                                className="block bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                {/* Image */}
                                <div className="relative aspect-square bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
                                    {product.thumbnail ? (
                                        <Image
                                            src={product.thumbnail}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                            sizes="192px"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-4xl">
                                            📱
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="p-3">
                                    <h3 className="font-semibold text-sm text-neutral-900 dark:text-white line-clamp-2 mb-1 min-h-[40px]">
                                        {product.name}
                                    </h3>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">
                                        {product.brand} • {product.deviceModel}
                                    </p>
                                    <p className="text-lg font-bold text-neutral-900 dark:text-white">
                                        ${product.price.toFixed(2)}
                                    </p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* View All Link */}
            {products.length > 6 && (
                <div className="mt-4 text-center">
                    <Link
                        href="/shop"
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        View All Recently Viewed Products →
                    </Link>
                </div>
            )}
        </div>
    )
}
