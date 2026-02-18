'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import StockIndicator from '@/components/stock-indicator'
import { Product } from '@/lib/api/products'

interface ProductCardProps {
    product: Product
    viewMode: 'grid' | 'list'
    onAddToCart: (productId: string) => void
    isLoading: boolean
    user: { id: string } | null
}

export function ProductCard({ product, viewMode, onAddToCart, isLoading, user }: ProductCardProps) {
    const price = product.displayPrice || product.basePrice
    const originalPrice = product.originalPrice || product.basePrice
    const discountPercentage = product.discountPercentage || 0
    const isWholesale = product.isWholesale || false

    if (viewMode === 'list') {
        return (
            <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-4 hover:shadow-lg transition-shadow">
                <div className="flex gap-4">
                    {/* Image */}
                    <Link href={`/products/${product.id}`} className="flex-shrink-0">
                        <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg flex items-center justify-center overflow-hidden">
                            {product.thumbnail ? (
                                <Image
                                    src={product.thumbnail}
                                    alt={product.name}
                                    width={128}
                                    height={128}
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <span className="text-4xl">{product.brand?.[0] || 'P'}</span>
                            )}
                        </div>
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1">
                                <Link href={`/products/${product.id}`}>
                                    <h3 className="font-semibold text-neutral-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 mb-1">
                                        {product.name}
                                    </h3>
                                </Link>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    SKU: {product.sku} | {product.brand} | {product.deviceModel}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                                    ${price.toFixed(2)}
                                    {isWholesale && (
                                        <span className="text-xs text-green-600"> (Wholesale)</span>
                                    )}
                                </p>
                                {discountPercentage > 0 && (
                                    <p className="text-sm text-neutral-500 line-through">
                                        ${originalPrice.toFixed(2)}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mb-3">
                            {/* Stock */}
                            <StockIndicator stock={product.totalStock} showCount={true} size="sm" />

                            {/* Badges */}
                            {product.isNew && (
                                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-bold">NEW</span>
                            )}
                            {product.isFeatured && (
                                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded font-bold">FEATURED</span>
                            )}
                        </div>

                        <Button
                            onClick={() => onAddToCart(product.id)}
                            disabled={isLoading || product.totalStock <= 0}
                            className="w-full md:w-auto"
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <ShoppingCart className="h-4 w-4 mr-2" />
                            )}
                            Add to Cart
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    // Grid View
    return (
        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-xl transition-shadow group">
            {/* Image */}
            <Link href={`/products/${product.id}`} className="block relative aspect-square bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
                {product.thumbnail ? (
                    <Image
                        src={product.thumbnail}
                        alt={product.name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl">{product.brand?.[0] || 'P'}</span>
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.isNew && (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-bold">NEW</span>
                    )}
                    {product.isFeatured && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded font-bold">FEATURED</span>
                    )}
                    {discountPercentage > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">
                            -{Math.round(discountPercentage)}%
                        </span>
                    )}
                </div>
            </Link>

            {/* Info */}
            <div className="p-4">
                <Link href={`/products/${product.id}`}>
                    <h3 className="font-semibold text-neutral-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 mb-1 line-clamp-2 min-h-[48px]">
                        {product.name}
                    </h3>
                </Link>

                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">
                    {product.brand} | {product.deviceModel}
                </p>

                {/* Price */}
                <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-2xl font-bold text-neutral-900 dark:text-white">
                        ${price.toFixed(2)}
                    </span>
                    {isWholesale && (
                        <span className="text-xs text-green-600">(Wholesale)</span>
                    )}
                </div>

                {discountPercentage > 0 && (
                    <p className="text-sm text-neutral-500 line-through mb-2">
                        ${originalPrice.toFixed(2)}
                    </p>
                )}

                {/* Stock */}
                <div className="mb-3">
                    <StockIndicator stock={product.totalStock} showCount={true} size="sm" />
                </div>

                {/* Add to Cart */}
                <Button
                    onClick={() => onAddToCart(product.id)}
                    disabled={isLoading || product.totalStock <= 0}
                    className="w-full"
                >
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                        <ShoppingCart className="h-4 w-4 mr-2" />
                    )}
                    Add to Cart
                </Button>
            </div>
        </div>
    )
}
