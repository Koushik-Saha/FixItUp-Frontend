'use client'

import { useState } from 'react'
import { Heart, ShoppingCart, X, Trash2, Share2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { WishlistItemSkeleton } from '@/components/skeleton'
import StockIndicator from '@/components/stock-indicator'
import { useWishlistStore, useCartStore } from '@/store'
import { formatCurrency } from '@/lib/utils'

export default function WishlistPage() {
    const router = useRouter()
    const { items, removeItem, clearWishlist: clearStoreWishlist } = useWishlistStore()
    const { addItem: addToCartStore } = useCartStore()

    // Derived state (no longer using local state for items)
    const loading = false // Store is instant (persisted)

    const handleRemoveItem = (itemId: string) => {
        removeItem(itemId)
        toast.success('Removed from wishlist')
    }

    const handleAddToCart = (product: any) => {
        addToCartStore(product, 1)
        toast.success('Added to cart')
    }

    const handleClearWishlist = () => {
        if (!confirm('Are you sure you want to clear your entire wishlist?')) return
        clearStoreWishlist()
        toast.success('Wishlist cleared')
    }

    const shareWishlist = () => {
        const url = window.location.href
        navigator.clipboard.writeText(url)
        toast.success('Wishlist link copied to clipboard')
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-8">
                <div className="container mx-auto px-4">
                    <div className="mb-8">
                        <div className="h-8 w-48 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse mb-2" />
                        <div className="h-4 w-64 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
                    </div>
                    <div className="grid gap-4">
                        {[...Array(3)].map((_, i) => (
                            <WishlistItemSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-8">
            <div className="container mx-auto px-4 max-w-5xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                            My Wishlist
                        </h1>
                        <p className="text-neutral-600 dark:text-neutral-400">
                            {items.length} {items.length === 1 ? 'item' : 'items'} saved
                        </p>
                    </div>

                    {items.length > 0 && (
                        <div className="flex gap-2">
                            <button
                                onClick={shareWishlist}
                                className="px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors flex items-center gap-2"
                            >
                                <Share2 className="h-4 w-4" />
                                Share
                            </button>
                            <button
                                onClick={handleClearWishlist}
                                className="px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
                            >
                                <Trash2 className="h-4 w-4" />
                                Clear All
                            </button>
                        </div>
                    )}
                </div>

                {/* Empty State */}
                {items.length === 0 && (
                    <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 p-12 text-center">
                        <Heart className="h-16 w-16 mx-auto mb-4 text-neutral-300 dark:text-neutral-600" />
                        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                            Your wishlist is empty
                        </h2>
                        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                            Save items you love to your wishlist and get notified when prices drop!
                        </p>
                        <button
                            onClick={() => router.push('/shop')}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Start Shopping
                        </button>
                    </div>
                )}

                {/* Wishlist Items */}
                <div className="space-y-4">
                    {items.map((item) => {
                        return (
                            <div
                                key={item.id}
                                className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                <div className="p-4 md:p-6">
                                    <div className="flex gap-4">
                                        {/* Image */}
                                        <Link href={`/products/${item.id}`} className="flex-shrink-0">
                                            <div className="w-24 h-24 md:w-32 md:h-32 bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden relative">
                                                <Image
                                                    src={item.images?.[0]?.url || '/placeholder-product.png'}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </Link>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            {/* Title & Brand */}
                                            <Link href={`/products/${item.id}`}>
                                                <h3 className="font-semibold text-neutral-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 mb-1 line-clamp-2">
                                                    {item.name}
                                                </h3>
                                            </Link>
                                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                                                {item.brand} • {item.model}
                                            </p>

                                            {/* Stock */}
                                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                                <StockIndicator stock={item.stock} showCount={false} size="sm" />
                                            </div>

                                            {/* Price */}
                                            <div className="flex items-baseline gap-2 mb-4">
                                                <span className="text-2xl font-bold text-neutral-900 dark:text-white">
                                                    {formatCurrency(item.retailPrice)}
                                                </span>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    onClick={() => handleAddToCart(item)}
                                                    disabled={item.stock === 0}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-neutral-300 disabled:text-neutral-500 dark:disabled:bg-neutral-700 dark:disabled:text-neutral-400 transition-colors flex items-center gap-2"
                                                >
                                                    <ShoppingCart className="h-4 w-4" />
                                                    {item.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                                </button>

                                                <button
                                                    onClick={() => handleRemoveItem(item.id)}
                                                    className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
                                                >
                                                    <X className="h-4 w-4" />
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
