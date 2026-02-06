'use client'

import { useState, useEffect } from 'react'
import { Heart, ShoppingCart, X, TrendingDown, Bell, BellOff, Trash2, Share2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { WishlistItemSkeleton } from '@/components/skeleton'
import StockIndicator from '@/components/stock-indicator'

interface WishlistItem {
    id: string
    product_id: string
    product_name: string
    product_image: string
    brand: string
    device_model: string
    current_price: number
    original_price: number
    stock: number
    price_drop_alert: boolean
    alert_price?: number
    lowest_price_30days: number
    added_at: string
}

// Sample data moved outside to avoid dependency issues
const sampleItems: WishlistItem[] = [
    {
        id: '1',
        product_id: '1',
        product_name: 'iPhone 15 Pro Max OLED Display Assembly',
        product_image: '/placeholder-product.jpg',
        brand: 'Apple',
        device_model: 'iPhone 15 Pro Max',
        current_price: 89.99,
        original_price: 99.99,
        stock: 50,
        price_drop_alert: true,
        alert_price: 80.00,
        lowest_price_30days: 85.99,
        added_at: '2024-01-10'
    },
    {
        id: '2',
        product_id: '2',
        product_name: 'iPhone 15 Pro Battery Replacement',
        product_image: '/placeholder-product.jpg',
        brand: 'Apple',
        device_model: 'iPhone 15 Pro',
        current_price: 44.99,
        original_price: 44.99,
        stock: 0,
        price_drop_alert: false,
        lowest_price_30days: 42.99,
        added_at: '2024-01-08'
    }
]

export default function WishlistPage() {
    const router = useRouter()
    const [items, setItems] = useState<WishlistItem[]>([])
    const [loading, setLoading] = useState(true)
    const [removingId, setRemovingId] = useState<string | null>(null)

    useEffect(() => {
        // Simulate loading
        // In real app, fetch from API here
        const timer = setTimeout(() => {
            setItems(sampleItems)
            setLoading(false)
        }, 1000)
        return () => clearTimeout(timer)
    }, [])

    const removeItem = async (itemId: string) => {
        setRemovingId(itemId)
        try {
            // API call to remove item
            await new Promise(resolve => setTimeout(resolve, 500))
            setItems(items.filter(item => item.id !== itemId))
            toast.success('Removed from wishlist')
        } catch {
            toast.error('Failed to remove item')
        } finally {
            setRemovingId(null)
        }
    }

    const togglePriceAlert = async (itemId: string) => {
        try {
            setItems(items.map(item =>
                item.id === itemId
                    ? { ...item, price_drop_alert: !item.price_drop_alert }
                    : item
            ))
            const item = items.find(i => i.id === itemId)
            toast.success(
                item?.price_drop_alert
                    ? 'Price alert disabled'
                    : 'Price alert enabled! We\'ll notify you when price drops.'
            )
        } catch {
            toast.error('Failed to update price alert')
        }
    }

    const updateAlertPrice = async (itemId: string, newPrice: number) => {
        try {
            setItems(items.map(item =>
                item.id === itemId
                    ? { ...item, alert_price: newPrice }
                    : item
            ))
            toast.success('Alert price updated')
        } catch {
            toast.error('Failed to update alert price')
        }
    }

    const addToCart = async () => {
        try {
            // API call to add to cart
            await new Promise(resolve => setTimeout(resolve, 500))
            toast.success('Added to cart')
        } catch {
            toast.error('Failed to add to cart')
        }
    }

    const clearWishlist = async () => {
        if (!confirm('Are you sure you want to clear your entire wishlist?')) return

        try {
            await new Promise(resolve => setTimeout(resolve, 500))
            setItems([])
            toast.success('Wishlist cleared')
        } catch {
            toast.error('Failed to clear wishlist')
        }
    }

    const shareWishlist = () => {
        const url = `${window.location.origin}/wishlist/shared/user123`
        navigator.clipboard.writeText(url)
        toast.success('Wishlist link copied to clipboard')
    }

    const getPriceDropPercentage = (item: WishlistItem) => {
        if (item.current_price >= item.original_price) return 0
        return Math.round(((item.original_price - item.current_price) / item.original_price) * 100)
    }

    const getTotalSavings = () => {
        return items.reduce((total, item) => {
            const savings = item.original_price - item.current_price
            return total + (savings > 0 ? savings : 0)
        }, 0)
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
                            {getTotalSavings() > 0 && (
                                <span className="ml-2 text-green-600 dark:text-green-400 font-semibold">
                                    • ${getTotalSavings().toFixed(2)} total savings
                                </span>
                            )}
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
                                onClick={clearWishlist}
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
                        const priceDropPercent = getPriceDropPercentage(item)
                        const hasRecentDrop = item.current_price < item.lowest_price_30days

                        return (
                            <div
                                key={item.id}
                                className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                <div className="p-4 md:p-6">
                                    <div className="flex gap-4">
                                        {/* Image */}
                                        <Link href={`/products/${item.product_id}`} className="flex-shrink-0">
                                            <div className="w-24 h-24 md:w-32 md:h-32 bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden relative">
                                                <div className="absolute inset-0 flex items-center justify-center text-4xl">
                                                    📱
                                                </div>
                                            </div>
                                        </Link>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            {/* Title & Brand */}
                                            <Link href={`/products/${item.product_id}`}>
                                                <h3 className="font-semibold text-neutral-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 mb-1 line-clamp-2">
                                                    {item.product_name}
                                                </h3>
                                            </Link>
                                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                                                {item.brand} • {item.device_model}
                                            </p>

                                            {/* Stock & Price Drop Badge */}
                                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                                <StockIndicator stock={item.stock} showCount={false} size="sm" />

                                                {priceDropPercent > 0 && (
                                                    <div className="inline-flex items-center gap-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full font-medium">
                                                        <TrendingDown className="h-3 w-3" />
                                                        {priceDropPercent}% OFF
                                                    </div>
                                                )}

                                                {hasRecentDrop && (
                                                    <div className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-1 rounded-full font-medium">
                                                        Lowest in 30 days!
                                                    </div>
                                                )}
                                            </div>

                                            {/* Price */}
                                            <div className="flex items-baseline gap-2 mb-4">
                                                <span className="text-2xl font-bold text-neutral-900 dark:text-white">
                                                    ${item.current_price.toFixed(2)}
                                                </span>
                                                {item.current_price < item.original_price && (
                                                    <span className="text-sm text-neutral-500 line-through">
                                                        ${item.original_price.toFixed(2)}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Price Alert */}
                                            <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-3 mb-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        {item.price_drop_alert ? (
                                                            <Bell className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                        ) : (
                                                            <BellOff className="h-4 w-4 text-neutral-400" />
                                                        )}
                                                        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                                            Price Drop Alert
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={() => togglePriceAlert(item.id)}
                                                        className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${item.price_drop_alert
                                                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                                            : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400'
                                                            }`}
                                                    >
                                                        {item.price_drop_alert ? 'Enabled' : 'Disabled'}
                                                    </button>
                                                </div>

                                                {item.price_drop_alert && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-neutral-600 dark:text-neutral-400">
                                                            Notify me when price drops to:
                                                        </span>
                                                        <input
                                                            type="number"
                                                            value={item.alert_price || ''}
                                                            onChange={(e) => updateAlertPrice(item.id, parseFloat(e.target.value))}
                                                            placeholder="$0.00"
                                                            className="w-20 px-2 py-1 text-xs bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded"
                                                            step="0.01"
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    onClick={() => addToCart()}
                                                    disabled={item.stock === 0}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-neutral-300 disabled:text-neutral-500 dark:disabled:bg-neutral-700 dark:disabled:text-neutral-400 transition-colors flex items-center gap-2"
                                                >
                                                    <ShoppingCart className="h-4 w-4" />
                                                    {item.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                                </button>

                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    disabled={removingId === item.id}
                                                    className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
                                                >
                                                    {removingId === item.id ? (
                                                        <>
                                                            <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                            Removing...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <X className="h-4 w-4" />
                                                            Remove
                                                        </>
                                                    )}
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
