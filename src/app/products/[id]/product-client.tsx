/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useEffect } from 'react'
import { ShoppingCart, Heart, Share2, ChevronLeft, ChevronRight, Truck, Shield, RotateCcw, Star, Loader2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import Link from 'next/link'
import StockIndicator from '@/components/stock-indicator'
import NotifyWhenAvailable from '@/components/notify-when-available'
import QualityComparisonTool from '@/components/quality-comparison-tool'
import RecentlyViewedProducts from '@/components/recently-viewed-products'
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed'
import { addToCart } from '@/lib/api/cart'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Product } from '@/lib/api/products'

interface ProductClientProps {
    product: Product
}

import { useCartStore, useWishlistStore } from '@/store'

// ... existing imports

export default function ProductClient({ product }: ProductClientProps) {
    const { user } = useAuth()
    const { addProduct } = useRecentlyViewed()

    // Stores
    const { addItem: addItemToCart } = useCartStore()
    const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore()

    const [selectedImage, setSelectedImage] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [userRole, setUserRole] = useState<'retail' | 'wholesale'>('retail')
    const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'shipping' | 'warranty'>('description')
    const [cartLoading, setCartLoading] = useState(false)

    // Track recently viewed on mount
    useEffect(() => {
        if (product) {
            addProduct({
                id: product.id,
                name: product.name,
                brand: product.brand,
                deviceModel: product.deviceModel,
                thumbnail: product.thumbnail || (product.images && product.images[0]) || null,
                price: product.basePrice,
                retailPrice: product.basePrice // Ensure compatibility
            } as any)
        }
    }, [product, addProduct])

    const handleAddToCart = async () => {
        if (!product) {
            return
        }
        try {
            setCartLoading(true)
            await addToCart(product.id, quantity)

            // Sync with local store for immediate UI update
            addItemToCart(product as any, quantity)

            toast.success('Item added to cart successfully!')
        } catch (err) {
            console.error('Failed to add to cart', err)
            // Fallback for guests if API fails (likely 401)
            // Just add to local store
            addItemToCart(product as any, quantity)
            toast.success('Item added to cart (Local)!')
        } finally {
            setCartLoading(false)
        }
    }

    const handleToggleWishlist = () => {
        if (isInWishlist(product.id)) {
            removeFromWishlist(product.id)
            toast.success('Removed from wishlist')
        } else {
            addToWishlist(product as any)
            toast.success('Added to wishlist')
        }
    }

    const currentPrice = userRole === 'retail'
        ? product.basePrice
        : (product.basePrice * (1 - (product.tier1Discount || 0) / 100))

    const totalPrice = currentPrice * quantity
    const images = product.images && product.images.length > 0 ? product.images : [product.thumbnail || '/placeholder.png']

    const nextImage = () => {
        setSelectedImage((prev) => (prev + 1) % images.length)
    }

    const prevImage = () => {
        setSelectedImage((prev) => (prev - 1 + images.length) % images.length)
    }

    return (
        <div className="min-h-screen bg-white dark:bg-neutral-900">
            {/* Breadcrumbs */}
            <div className="border-b border-neutral-200 dark:border-neutral-700">
                <div className="container mx-auto px-4 py-4">
                    <nav className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                        <Link href="/" className="hover:text-neutral-900 dark:hover:text-white">Home</Link>
                        <span>/</span>
                        <Link href="/shop" className="hover:text-neutral-900 dark:hover:text-white">Shop</Link>
                        <span>/</span>
                        <span className="text-neutral-900 dark:text-white truncate max-w-[200px]">{product.name}</span>
                    </nav>
                </div>
            </div>

            {/* Main Product Section */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-2 gap-12 mb-16">

                    {/* Left: Images */}
                    <div>
                        <div className="relative aspect-square bg-neutral-100 dark:bg-neutral-800 rounded-lg mb-4 overflow-hidden group">
                            <Image
                                src={images[selectedImage]}
                                alt={product.name}
                                fill
                                className="object-cover"
                            />

                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white dark:bg-neutral-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <ChevronLeft className="h-6 w-6 text-neutral-900 dark:text-white" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white dark:bg-neutral-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <ChevronRight className="h-6 w-6 text-neutral-900 dark:text-white" />
                                    </button>
                                </>
                            )}
                        </div>

                        {images.length > 1 && (
                            <div className="grid grid-cols-4 gap-3">
                                {images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`
                                            aspect-square rounded-lg overflow-hidden border-2 transition-all relative
                                            ${selectedImage === index
                                                ? 'border-blue-600 dark:border-blue-400'
                                                : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-400'
                                            }
                                        `}
                                    >
                                        <Image src={img} alt={`Thumbnail ${index + 1}`} fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Product Info */}
                    <div>
                        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-3">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-5 w-5 ${i < 4
                                            ? 'fill-yellow-500 text-yellow-500'
                                            : 'text-neutral-300 dark:text-neutral-600'
                                            }`}
                                    />
                                ))}
                                <span className="ml-2 text-neutral-600 dark:text-neutral-400">
                                    4.5 (10 reviews)
                                </span>
                            </div>
                            <span className="text-neutral-500 dark:text-neutral-400">
                                SKU: {product.sku}
                            </span>
                        </div>

                        <div className="mb-6">
                            {userRole === 'retail' ? (
                                <div className="text-4xl font-bold text-neutral-900 dark:text-white">
                                    ${product.basePrice.toFixed(2)}
                                </div>
                            ) : (
                                <div>
                                    <div className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2">
                                        Wholesale Pricing (Estimated)
                                    </div>
                                    <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700">
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-neutral-700 dark:text-neutral-300">Wholesale Price</span>
                                            <span className="font-bold text-neutral-900 dark:text-white">${currentPrice.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mb-6">
                            <StockIndicator stock={product.totalStock} showCount={true} size="md" />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                Quantity
                            </label>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border border-neutral-300 dark:border-neutral-600 rounded-lg">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                        className="w-20 text-center border-x border-neutral-300 dark:border-neutral-600 py-2 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                                    />
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                                <div className="text-xl font-bold text-neutral-900 dark:text-white">
                                    Total: ${totalPrice.toFixed(2)}
                                </div>
                            </div>
                        </div>

                        {product.totalStock === 0 ? (
                            <div className="mb-6">
                                <NotifyWhenAvailable
                                    productId={product.id}
                                    productName={product.name}
                                />
                            </div>
                        ) : (
                            <div className="flex gap-3 mb-6">
                                <Button
                                    onClick={handleAddToCart}
                                    disabled={cartLoading}
                                    className="flex-1 px-6 py-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-semibold"
                                >
                                    {cartLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShoppingCart className="h-5 w-5" />}
                                    Add to Cart
                                </Button>
                                <button
                                    onClick={handleToggleWishlist}
                                    className={`p-3 border rounded-lg transition-colors ${isInWishlist(product.id)
                                        ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100'
                                        : 'border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                                        }`}
                                >
                                    <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                                </button>
                                <button className="p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                                    <Share2 className="h-5 w-5" />
                                </button>
                            </div>
                        )}

                        <div className="grid grid-cols-3 gap-4 py-6 border-y border-neutral-200 dark:border-neutral-700">
                            <div className="text-center">
                                <Truck className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                                <p className="text-sm font-medium text-neutral-900 dark:text-white">Free Shipping</p>
                                <p className="text-xs text-neutral-500">Orders over $50</p>
                            </div>
                            <div className="text-center">
                                <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                                <p className="text-sm font-medium text-neutral-900 dark:text-white">12 Month Warranty</p>
                                <p className="text-xs text-neutral-500">Full coverage</p>
                            </div>
                            <div className="text-center">
                                <RotateCcw className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                                <p className="text-sm font-medium text-neutral-900 dark:text-white">Easy Returns</p>
                                <p className="text-xs text-neutral-500">30-day policy</p>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="border-t border-neutral-200 dark:border-neutral-700 pt-8 mb-16">
                    <div className="flex gap-4 border-b border-neutral-200 dark:border-neutral-700 mb-8 overflow-x-auto">
                        {(['description', 'specifications', 'shipping', 'warranty'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`
                                    px-4 py-3 font-medium transition-colors border-b-2 capitalize whitespace-nowrap
                                    ${activeTab === tab
                                        ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                                        : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                                    }
                                `}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="max-w-4xl">
                        {activeTab === 'description' && (
                            <div>
                                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                                    Product Description
                                </h2>
                                <div className="prose dark:prose-invert max-w-none">
                                    <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-line mb-6">
                                        {product.description || 'No description available.'}
                                    </p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'specifications' && (
                            <div>
                                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                                    Technical Specifications
                                </h2>
                                <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg overflow-hidden">
                                    {product.specifications && typeof product.specifications === 'object' ? (
                                        Object.entries(product.specifications).map(([key, value], index) => (
                                            <div
                                                key={key}
                                                className={`
                                                    flex py-3 px-4
                                                    ${index % 2 === 0 ? 'bg-white dark:bg-neutral-900' : 'bg-neutral-50 dark:bg-neutral-800'}
                                                `}
                                            >
                                                <span className="w-1/3 font-semibold text-neutral-900 dark:text-white capitalize">{key.replace(/_/g, ' ')}</span>
                                                <span className="w-2/3 text-neutral-700 dark:text-neutral-300">{String(value)}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="p-4 text-neutral-500">No specifications available</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'shipping' && (
                            <div>
                                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                                    Shipping Information
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <Truck className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">Standard Shipping</h3>
                                            <p className="text-neutral-700 dark:text-neutral-300">Free shipping on orders over $50 (3-5 business days)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'warranty' && (
                            <div>
                                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                                    Warranty & Support
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">Warranty Duration</h3>
                                        <p className="text-neutral-700 dark:text-neutral-300">12 months</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mb-16">
                    <QualityComparisonTool />
                </div>

                <div className="mb-16">
                    <RecentlyViewedProducts limit={8} />
                </div>

            </div>
        </div>
    )
}
