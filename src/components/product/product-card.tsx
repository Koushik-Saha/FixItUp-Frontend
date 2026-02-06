'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, Eye, ShoppingCart, Star } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn, formatCurrency, calculateDiscount } from '@/lib/utils'
import { useAuthStore } from '@/store'
import { useCartStore } from '@/store'
import { useWishlistStore } from '@/store'
import type { Product } from '@/types'
import StockIndicator from '@/components/stock-indicator'

interface ProductCardProps {
  product: Product
  showQuickView?: boolean
  className?: string
}

export function ProductCard({ product, showQuickView = true, className }: ProductCardProps) {
  const { user } = useAuthStore()
  const { addItem } = useCartStore()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore()

  const isWishlisted = isInWishlist(product.id)

  // Calculate pricing based on user type
  // Pricing helper removed (unused)

  const showBusinessPricing = user?.role === 'business'
  const discount = showBusinessPricing
    ? calculateDiscount(product.retailPrice, product.wholesalePrice)
    : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem(product, 1)
  }

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isWishlisted) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product.id)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('group', className)}
    >
      <Link href={`/products/${product.id}`}>
        <Card className="relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
          {/* Discount Badge */}
          {showBusinessPricing && discount > 0 && (
            <Badge
              variant="discount"
              className="absolute left-3 top-3 z-10"
            >
              {discount}% OFF
            </Badge>
          )}

          {/* Quick Actions */}
          <div className="absolute right-3 top-3 z-10 flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              size="icon-sm"
              variant="secondary"
              className="h-8 w-8 rounded-full bg-white/90 backdrop-blur hover:bg-white"
              onClick={handleToggleWishlist}
            >
              <Heart
                className={cn(
                  'h-4 w-4',
                  isWishlisted && 'fill-red-500 text-red-500'
                )}
              />
            </Button>
            {showQuickView && (
              <Button
                size="icon-sm"
                variant="secondary"
                className="h-8 w-8 rounded-full bg-white/90 backdrop-blur hover:bg-white"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Product Image */}
          <div className="relative aspect-square w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900">
            <Image
              src={product.images[0]?.url || '/placeholder-product.png'}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          </div>

          {/* Product Info */}
          <div className="p-4">
            {/* Brand & Model */}
            <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
              {product.brand} • {product.model}
            </p>

            {/* Product Name */}
            <h3 className="mt-1 line-clamp-2 text-base font-semibold text-neutral-900 dark:text-white">
              {product.name}
            </h3>

            {/* SKU */}
            <p className="mt-1 font-mono text-xs text-neutral-500">
              SKU: {product.sku}
            </p>

            {/* Rating */}
            <div className="mt-2 flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-3.5 w-3.5',
                      i < Math.floor(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-neutral-200 text-neutral-200'
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-neutral-600 dark:text-neutral-400">
                ({product.reviewCount})
              </span>
            </div>

            {/* Quality Badge */}
            <div className="mt-3">
              <Badge
                variant={
                  product.qualityGrade === 'oem'
                    ? 'success'
                    : product.qualityGrade === 'premium'
                      ? 'info'
                      : 'default'
                }
                size="sm"
              >
                {product.qualityGrade.toUpperCase()}
              </Badge>
            </div>

            {/* Pricing */}
            <div className="mt-4 space-y-2">
              {/* Guest User */}
              {!user && (
                <>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-neutral-900 dark:text-white">
                      {formatCurrency(product.retailPrice)}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    Business Price:{' '}
                    <Link
                      href="/auth/login"
                      className="font-semibold text-retail-primary hover:underline"
                    >
                      Sign In
                    </Link>
                  </p>
                </>
              )}

              {/* Retail Customer */}
              {user?.role === 'retail' && (
                <>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-retail-primary">
                      {formatCurrency(product.retailPrice)}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    💼 Business Account? Save up to 45%!
                  </p>
                </>
              )}

              {/* Business User */}
              {user?.role === 'business' && (
                <>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-neutral-600 line-through dark:text-neutral-400">
                      Retail: {formatCurrency(product.retailPrice)}
                    </span>
                    <span className="text-2xl font-bold text-business-primary">
                      {formatCurrency(product.wholesalePrice)}
                    </span>
                  </div>
                  {product.bulkPricing.length > 0 && (
                    <div className="rounded-lg bg-neutral-50 p-2 text-xs dark:bg-neutral-900">
                      <p className="font-semibold text-neutral-900 dark:text-white">
                        Bulk Pricing:
                      </p>
                      <div className="mt-1 space-y-0.5 text-neutral-600 dark:text-neutral-400">
                        {product.bulkPricing.map((tier, i) => (
                          <p key={i}>
                            {tier.minQuantity}+ units:{' '}
                            {formatCurrency(
                              product.wholesalePrice * (1 - tier.discount / 100)
                            )}{' '}
                            ({tier.discount}% off)
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className="mt-3">
              <StockIndicator stock={product.stock} showCount={false} size="sm" />
            </div>

            {/* Add to Cart Button */}
            <Button
              variant={
                user?.role === 'business'
                  ? 'business-primary'
                  : 'retail-primary'
              }
              className="mt-4 w-full"
              disabled={product.stock === 0}
              onClick={handleAddToCart}
              leftIcon={<ShoppingCart className="h-4 w-4" />}
            >
              Add to Cart
            </Button>
          </div>
        </Card>
      </Link>
    </motion.div>
  )
}
