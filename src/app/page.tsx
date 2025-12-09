'use client'

import { HeroCarousel } from '@/components/hero-carousel'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Smartphone,
  Headphones,
  Watch,
  Laptop,
  Camera,
  Gamepad2,
  Volume2,
  Cable,
  Star,
  Heart,
  ShoppingCart
} from 'lucide-react'
import {Payment} from "@/components/layout/payment"
import {CategorySection} from "@/components/category-section"
import {StoreLocations} from "@/components/store-locations"

// Categories Data
const categories = [
  { id: 'apple', name: 'Apple', icon: '🍎', color: 'bg-gradient-to-br from-gray-800 to-gray-600', count: '2,847' },
  { id: 'samsung', name: 'Samsung', icon: '📱', color: 'bg-gradient-to-br from-blue-600 to-blue-800', count: '3,421' },
  { id: 'google', name: 'Google', icon: '🔍', color: 'bg-gradient-to-br from-red-500 to-yellow-500', count: '567' },
  { id: 'motorola', name: 'Motorola', icon: '📲', color: 'bg-gradient-to-br from-blue-500 to-cyan-500', count: '892' },
  { id: 'cases', name: 'Cases & Covers', icon: '📱', color: 'bg-gradient-to-br from-purple-500 to-pink-500', count: '8,234' },
  { id: 'screens', name: 'LCD Screens', icon: '📺', color: 'bg-gradient-to-br from-orange-500 to-red-500', count: '1,567' },
  { id: 'batteries', name: 'Batteries', icon: '🔋', color: 'bg-gradient-to-br from-green-500 to-emerald-600', count: '892' },
  { id: 'tools', name: 'Repair Tools', icon: '🛠️', color: 'bg-gradient-to-br from-indigo-500 to-purple-600', count: '432' },
]

// Flash Deals Products
const featuredDeals = [
  {
    id: 1,
    name: 'iPhone 15 Pro Max',
    image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800&h=800&fit=crop&q=80',
    originalPrice: 1199,
    salePrice: 1099,
    discount: 8,
    rating: 4.9,
    reviews: 5421,
    badge: 'Hot Deal',
    badgeColor: 'bg-red-500'
  },
  {
    id: 2,
    name: 'AirPods Pro 2nd Gen',
    image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800&h=800&fit=crop&q=80',
    originalPrice: 249,
    salePrice: 199,
    discount: 20,
    rating: 4.8,
    reviews: 3247,
    badge: 'Best Seller',
    badgeColor: 'bg-blue-500'
  },
  {
    id: 3,
    name: 'Samsung Galaxy Watch 6',
    image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800&h=800&fit=crop&q=80',
    originalPrice: 399,
    salePrice: 279,
    discount: 30,
    rating: 4.7,
    reviews: 1892,
    badge: 'Limited',
    badgeColor: 'bg-orange-500'
  },
  {
    id: 4,
    name: 'Sony WH-1000XM5',
    image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800&h=800&fit=crop&q=80',
    originalPrice: 399,
    salePrice: 299,
    discount: 25,
    rating: 4.9,
    reviews: 4123,
    badge: 'Top Rated',
    badgeColor: 'bg-green-500'
  },
]

// Top Brands
const topBrands = [
  { name: 'Apple', icon: '🍎', products: '2,847' },
  { name: 'Samsung', icon: '📱', products: '3,421' },
  { name: 'Sony', icon: '🎧', products: '1,567' },
  { name: 'Dell', icon: '💻', products: '892' },
  { name: 'Canon', icon: '📷', products: '654' },
  { name: 'Nintendo', icon: '🎮', products: '432' },
]

export default function HomePage() {
  return (
      <div className="min-h-screen">

        {/* Hero Carousel */}
        <HeroCarousel />

        {/* Shop by Category */}
        <section className="py-8 md:py-10 lg:py-12 bg-neutral-50 dark:bg-neutral-900">
          <div className="container px-4 mx-auto">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6 lg:mb-8 text-center dark:text-white">
              Shop by Category
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4">
              {categories.map((category, index) => {
                const Icon = category.icon
                return (
                    <motion.div
                        key={category.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Link href={`/category/${category.id}`}>
                        <Card className="group hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1 md:hover:-translate-y-2">
                          <CardContent className="p-3 md:p-4 text-center">
                            <div className={`${category.color} w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-2 md:mb-3 group-hover:scale-110 transition-transform`}>
                              <Icon className="h-6 w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 text-white" />
                            </div>
                            <h3 className="font-semibold text-xs md:text-sm mb-1 dark:text-white line-clamp-2">
                              {category.name}
                            </h3>
                            <p className="text-[10px] md:text-xs text-neutral-600 dark:text-neutral-400">
                              {category.count}
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Flash Deals */}
        <section className="py-8 md:py-10 lg:py-12 bg-white dark:bg-neutral-950">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 lg:mb-8 gap-3 md:gap-4">
              <div>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold dark:text-white">⚡ Flash Deals</h2>
                <p className="text-xs md:text-sm lg:text-base text-neutral-600 dark:text-neutral-400 mt-1">
                  Limited time offers
                </p>
              </div>
              <Link href="/deals">
                <Button variant="outline" size="sm" className="text-xs md:text-sm h-8 md:h-9 lg:h-10">
                  View All
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
              {featuredDeals.map((product, index) => (
                  <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="group hover:shadow-2xl transition-all overflow-hidden">
                      <div className="relative aspect-square bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <Badge className={`absolute top-2 left-2 md:top-3 md:left-3 ${product.badgeColor} text-white text-xs px-2 py-0.5`}>
                          {product.badge}
                        </Badge>
                        <button className="absolute top-2 right-2 md:top-3 md:right-3 bg-white dark:bg-neutral-800 p-1.5 md:p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900 transition-colors">
                          <Heart className="h-4 w-4 md:h-5 md:w-5 text-neutral-600 dark:text-neutral-400" />
                        </button>
                        <Badge className="absolute bottom-2 right-2 md:bottom-3 md:right-3 bg-red-500 text-white text-sm md:text-lg font-bold px-2 py-1 md:px-3">
                          -{product.discount}%
                        </Badge>
                      </div>
                      <CardContent className="p-3 md:p-4">
                        <h3 className="font-semibold text-sm md:text-base lg:text-lg mb-2 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-1.5 md:gap-2 mb-2 md:mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 md:h-4 md:w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs md:text-sm font-semibold">{product.rating}</span>
                          </div>
                          <span className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400">
                            ({product.reviews.toLocaleString()})
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2 mb-2 md:mb-3 lg:mb-4">
                          <span className="text-lg md:text-xl lg:text-2xl font-bold text-blue-600 dark:text-blue-400">
                            ${product.salePrice}
                          </span>
                          <span className="text-xs md:text-sm text-neutral-500 line-through">
                            ${product.originalPrice}
                          </span>
                        </div>
                        <p className="text-xs md:text-sm text-green-600 dark:text-green-400 font-medium mb-3 md:mb-4">
                          Save ${product.originalPrice - product.salePrice}
                        </p>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 h-8 md:h-9 lg:h-10 text-xs md:text-sm">
                          <ShoppingCart className="mr-1.5 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                          Add to Cart
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Top Brands */}
        <section className="py-8 md:py-10 lg:py-12 bg-neutral-50 dark:bg-neutral-900">
          <div className="container px-4 mx-auto">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6 lg:mb-8 text-center dark:text-white">
              Top Brands
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5 lg:gap-6">
              {topBrands.map((brand, index) => (
                  <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Link href={`/brand/${brand.name.toLowerCase()}`}>
                      <Card className="group hover:shadow-xl transition-all cursor-pointer hover:scale-105">
                        <CardContent className="p-4 md:p-5 lg:p-6 text-center">
                          <div className="text-3xl md:text-4xl lg:text-5xl mb-2 md:mb-3 group-hover:scale-110 transition-transform">
                            {brand.icon}
                          </div>
                          <h3 className="font-bold text-sm md:text-base lg:text-lg mb-1 dark:text-white">
                            {brand.name}
                          </h3>
                          <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400">
                            {brand.products}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Store Locations */}
        <StoreLocations />

        {/* Why Shop With Us */}
        <section className="py-8 md:py-10 lg:py-12 bg-white dark:bg-neutral-950">
          <div className="container px-4 mx-auto">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6 lg:mb-8 text-center dark:text-white">
              Why Shop With Us
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-4 md:p-5 lg:p-6">
                  <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 text-2xl md:text-3xl">
                    🚚
                  </div>
                  <h3 className="font-bold text-sm md:text-base lg:text-lg mb-2 dark:text-white">Free Shipping</h3>
                  <p className="text-neutral-600 dark:text-neutral-400 text-xs md:text-sm">
                    On all orders over $50
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-4 md:p-5 lg:p-6">
                  <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 text-2xl md:text-3xl">
                    🛡️
                  </div>
                  <h3 className="font-bold text-sm md:text-base lg:text-lg mb-2 dark:text-white">Secure Payment</h3>
                  <p className="text-neutral-600 dark:text-neutral-400 text-xs md:text-sm">
                    100% secure
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-4 md:p-5 lg:p-6">
                  <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 text-2xl md:text-3xl">
                    ⭐
                  </div>
                  <h3 className="font-bold text-sm md:text-base lg:text-lg mb-2 dark:text-white">Top Quality</h3>
                  <p className="text-neutral-600 dark:text-neutral-400 text-xs md:text-sm">
                    Authentic products
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-4 md:p-5 lg:p-6">
                  <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 text-2xl md:text-3xl">
                    💰
                  </div>
                  <h3 className="font-bold text-sm md:text-base lg:text-lg mb-2 dark:text-white">Best Prices</h3>
                  <p className="text-neutral-600 dark:text-neutral-400 text-xs md:text-sm">
                    Unbeatable deals
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-8 md:py-10 lg:py-12 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="container px-4 mx-auto">
            <div className="text-center text-white max-w-2xl mx-auto">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4">Get Exclusive Deals</h2>
              <p className="text-sm md:text-base lg:text-lg mb-4 md:mb-6 opacity-90">
                Subscribe and get 10% off your first order
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 max-w-md mx-auto">
                <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2.5 md:py-3 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-white text-sm md:text-base"
                />
                <Button size="lg" className="bg-white text-blue-600 hover:bg-neutral-100 font-bold h-10 md:h-12 text-sm md:text-base">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </section>

        <Payment />

      </div>
  )
}
