'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ShoppingCart,
  Search,
  Heart,
  Star,
  Truck,
  Shield,
  CreditCard,
  TrendingUp,
  Zap,
  Tag,
  ChevronRight,
  Smartphone,
  Headphones,
  Watch,
  Laptop,
  Camera,
  Gamepad2,
  Speaker,
  Battery,
  ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/store'

export default function HomePage() {
  const { user } = useAuthStore()

  // Mock data - replace with real data later
  const featuredDeals = [
    {
      id: '1',
      name: 'iPhone 15 Pro Max',
      image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400&h=400&fit=crop',
      price: 1199,
      originalPrice: 1299,
      discount: 8,
      rating: 4.8,
      reviews: 2847,
      badge: 'Hot Deal',
      inStock: true
    },
    {
      id: '2',
      name: 'AirPods Pro (2nd Gen)',
      image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400&h=400&fit=crop',
      price: 199,
      originalPrice: 249,
      discount: 20,
      rating: 4.9,
      reviews: 5421,
      badge: 'Best Seller',
      inStock: true
    },
    {
      id: '3',
      name: 'Samsung Galaxy Watch 6',
      image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=400&fit=crop',
      price: 279,
      originalPrice: 399,
      discount: 30,
      rating: 4.7,
      reviews: 1234,
      badge: 'Limited Offer',
      inStock: true
    },
    {
      id: '4',
      name: 'Sony WH-1000XM5',
      image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop',
      price: 349,
      originalPrice: 399,
      discount: 13,
      rating: 4.9,
      reviews: 3891,
      badge: 'Top Rated',
      inStock: true
    }
  ]

  const categories = [
    { id: 1, name: 'Smartphones', icon: Smartphone, count: '2,450+', color: 'bg-blue-500' },
    { id: 2, name: 'Headphones', icon: Headphones, count: '1,230+', color: 'bg-purple-500' },
    { id: 3, name: 'Smart Watches', icon: Watch, count: '890+', color: 'bg-green-500' },
    { id: 4, name: 'Laptops', icon: Laptop, count: '567+', color: 'bg-orange-500' },
    { id: 5, name: 'Cameras', icon: Camera, count: '432+', color: 'bg-red-500' },
    { id: 6, name: 'Gaming', icon: Gamepad2, count: '1,890+', color: 'bg-indigo-500' },
    { id: 7, name: 'Audio', icon: Speaker, count: '756+', color: 'bg-pink-500' },
    { id: 8, name: 'Accessories', icon: Battery, count: '3,200+', color: 'bg-cyan-500' }
  ]

  const topBrands = [
    { name: 'Apple', logo: '🍎', products: 2847 },
    { name: 'Samsung', logo: '📱', products: 3421 },
    { name: 'Sony', logo: '🎧', products: 1567 },
    { name: 'Dell', logo: '💻', products: 892 },
    { name: 'Canon', logo: '📷', products: 654 },
    { name: 'Nintendo', logo: '🎮', products: 432 }
  ]

  return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">

        {/* Flash Sale Banner */}
        <div className="bg-gradient-to-r from-red-600 via-orange-600 to-red-600 text-white py-2">
          <div className="container">
            <div className="flex items-center justify-center gap-2 text-sm font-semibold">
              <Zap className="h-4 w-4 animate-pulse" />
              <span>FLASH SALE: Up to 50% OFF on Selected Items!</span>
              <Link href="/deals" className="underline">Shop Now →</Link>
            </div>
          </div>
        </div>

        {/* Hero Section - E-Commerce Style */}
        <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 py-16 md:py-20 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>

          <div className="container relative z-10">
            <div className="grid gap-12 lg:grid-cols-2 items-center">

              {/* Left Column */}
              <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
              >
                <Badge className="mb-4 bg-yellow-400 text-black hover:bg-yellow-400">
                  ⚡ New Arrivals
                </Badge>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                  Latest Tech at<br />
                  Unbeatable Prices
                </h1>

                <p className="text-lg sm:text-xl mb-8 text-white/90">
                  Shop the newest smartphones, laptops, and accessories from top brands. Free shipping on orders over $50!
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link href="/shop">
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-neutral-100">
                      Shop Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/deals">
                    <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10">
                      View All Deals
                    </Button>
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="mt-12 flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    <span className="text-sm font-medium">Free Shipping</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    <span className="text-sm font-medium">2-Year Warranty</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    <span className="text-sm font-medium">Secure Payment</span>
                  </div>
                </div>
              </motion.div>

              {/* Right Column - Featured Product */}
              <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="relative hidden lg:block"
              >
                <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="relative"
                >
                  <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                    <img
                        src="/images/phone_repair.jpg"
                        alt="Featured Product"
                        className="w-full h-auto object-contain drop-shadow-2xl"
                    />

                    {/* Price Tag */}
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg">
                      -20% OFF
                    </div>
                  </div>
                </motion.div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* Quick Search Categories */}
        <section className="py-12 bg-white dark:bg-neutral-800">
          <div className="container">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center dark:text-white">
              Shop by Category
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              {categories.map((category, index) => (
                  <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Link href={`/category/${category.name.toLowerCase()}`}>
                      <Card className="text-center hover:shadow-lg transition-all cursor-pointer group">
                        <CardContent className="p-6">
                          <div className={`${category.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                            <category.icon className="h-8 w-8 text-white" />
                          </div>
                          <h3 className="font-semibold text-sm mb-1 dark:text-white">{category.name}</h3>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">{category.count} items</p>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Flash Deals */}
        <section className="py-16 bg-gradient-to-br from-orange-50 to-red-50 dark:from-neutral-900 dark:to-neutral-800">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold dark:text-white">⚡ Flash Deals</h2>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1">Limited time offers - Grab them fast!</p>
              </div>
              <Link href="/deals">
                <Button variant="outline">
                  View All
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredDeals.map((product, index) => (
                  <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card className="group hover:shadow-2xl transition-all duration-300 overflow-hidden">
                      <div className="relative">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Badge */}
                        <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-500">
                          {product.badge}
                        </Badge>

                        {/* Wishlist */}
                        <button className="absolute top-3 right-3 bg-white/90 p-2 rounded-full hover:bg-white transition-colors">
                          <Heart className="h-5 w-5 text-neutral-600" />
                        </button>

                        {/* Discount Badge */}
                        <div className="absolute bottom-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full font-bold text-sm">
                          -{product.discount}%
                        </div>
                      </div>

                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2 dark:text-white">
                          {product.name}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-3">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                        i < Math.floor(product.rating)
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-neutral-300'
                                    }`}
                                />
                            ))}
                          </div>
                          <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        ({product.reviews})
                      </span>
                        </div>

                        {/* Price */}
                        <div className="mb-4">
                          <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          ${product.price}
                        </span>
                            <span className="text-sm text-neutral-500 line-through">
                          ${product.originalPrice}
                        </span>
                          </div>
                          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                            Save ${product.originalPrice - product.price}
                          </p>
                        </div>
                      </CardContent>

                      <CardFooter className="p-4 pt-0">
                        <Button className="w-full" size="lg">
                          <ShoppingCart className="mr-2 h-5 w-5" />
                          Add to Cart
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Top Brands */}
        <section className="py-16 bg-white dark:bg-neutral-800">
          <div className="container">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 dark:text-white">
              Shop by Brand
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
              {topBrands.map((brand, index) => (
                  <motion.div
                      key={brand.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Link href={`/brand/${brand.name.toLowerCase()}`}>
                      <Card className="text-center hover:shadow-xl transition-all cursor-pointer group p-6">
                        <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
                          {brand.logo}
                        </div>
                        <h3 className="font-bold text-lg mb-1 dark:text-white">{brand.name}</h3>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          {brand.products} products
                        </p>
                      </Card>
                    </Link>
                  </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Shop With Us */}
        <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-neutral-900 dark:to-neutral-800">
          <div className="container">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 dark:text-white">
              Why Shop With Us?
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-bold text-lg mb-2 dark:text-white">Free Shipping</h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                  On orders over $50
                </p>
              </div>

              <div className="text-center">
                <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-bold text-lg mb-2 dark:text-white">Secure Payment</h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                  100% protected transactions
                </p>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-bold text-lg mb-2 dark:text-white">Top Quality</h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                  Authentic products only
                </p>
              </div>

              <div className="text-center">
                <div className="bg-orange-100 dark:bg-orange-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="font-bold text-lg mb-2 dark:text-white">Best Prices</h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                  Unbeatable deals daily
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4">Get Exclusive Deals</h2>
            <p className="text-lg mb-8 text-white/90">
              Subscribe to our newsletter and get 10% off your first order!
            </p>

            <div className="max-w-md mx-auto flex gap-3">
              <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white text-black"
              />
              <Button className="bg-orange-500 hover:bg-orange-600" size="lg">
                Subscribe
              </Button>
            </div>
          </div>
        </section>

      </div>
  )
}
