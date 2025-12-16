// components/ui/product-card.tsx
// Dynamic Product Card with Pricing

'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Heart } from 'lucide-react'

interface Product {
    id: string
    name: string
    slug: string
    imageUrl: string
    basePrice: number
    displayPrice: number
    discountPercentage?: number
    isNew?: boolean
}

interface ProductCardProps {
    product: Product
    showDiscount?: boolean
    showNewBadge?: boolean
    dealBadge?: string
}

export function ProductCard({
                                product,
                                showDiscount,
                                showNewBadge,
                                dealBadge,
                            }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false)
    const [addingToCart, setAddingToCart] = useState(false)

    const discount = product.discountPercentage ||
        (product.basePrice > product.displayPrice
            ? Math.round(((product.basePrice - product.displayPrice) / product.basePrice) * 100)
            : 0)

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        try {
            setAddingToCart(true)

            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    product_id: product.id,
                    quantity: 1,
                }),
            })

            if (!response.ok) {
                const error = await response.json()
                alert(error.error || 'Failed to add to cart')
                return
            }

            // Show success (you can replace with toast notification)
            alert('Added to cart!')

        } catch (error) {
            console.error('Add to cart error:', error)
            alert('Failed to add to cart')
        } finally {
            setAddingToCart(false)
        }
    }

    return (
        <Link
            href={`/products/${product.slug}`}
            className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-gray-100">
                <Image
                    src={product.imageUrl || '/placeholder-product.png'}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition duration-300"
                />

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-2">
                    {dealBadge && (
                        <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">
              {dealBadge}
            </span>
                    )}
                    {showNewBadge && product.isNew && (
                        <span className="px-2 py-1 bg-green-600 text-white text-xs font-bold rounded">
              NEW
            </span>
                    )}
                    {showDiscount && discount > 0 && (
                        <span className="px-2 py-1 bg-orange-600 text-white text-xs font-bold rounded">
              -{discount}%
            </span>
                    )}
                </div>

                {/* Wishlist Button */}
                <button
                    onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        // Add wishlist logic
                    }}
                    className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition opacity-0 group-hover:opacity-100"
                >
                    <Heart className="w-5 h-5 text-gray-600 hover:text-red-600 transition" />
                </button>

                {/* Quick Add to Cart */}
                <button
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className={`absolute bottom-2 left-2 right-2 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 ${
                        isHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                    }`}
                >
                    <ShoppingCart className="w-4 h-4" />
                    {addingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
            </div>

            {/* Product Info */}
            <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition">
                    {product.name}
                </h3>

                <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-gray-900">
            ${product.displayPrice.toFixed(2)}
          </span>
                    {discount > 0 && (
                        <span className="text-sm text-gray-500 line-through">
              ${product.basePrice.toFixed(2)}
            </span>
                    )}
                </div>

                {discount > 0 && (
                    <p className="text-xs text-green-600 font-medium mt-1">
                        Save ${(product.basePrice - product.displayPrice).toFixed(2)}
                    </p>
                )}
            </div>
        </Link>
    )
}
