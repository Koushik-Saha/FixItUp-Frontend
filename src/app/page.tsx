'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Search,
  Package,
  Zap,
  Shield,
  ChevronRight,
  TrendingUp,
  Building2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ProductCard } from '@/components/product/product-card'
import { MainLayout } from '@/components/layout/main-layout'
import { useAuthStore } from '@/store'
import type { Product } from '@/types'

// Mock data - will be replaced with API calls
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    sku: 'IPH-14PRO-OLED-001',
    name: 'iPhone 14 Pro OLED Display Assembly',
    description: 'High quality OLED display for iPhone 14 Pro',
    brand: 'Apple',
    model: 'iPhone 14 Pro',
    category: { id: '1', name: 'Screens', slug: 'screens', description: '', order: 1, productCount: 100 },
    images: [{ id: '1', url: 'https://images.unsplash.com/photo-1592286162042-c49e06318e61?w=800', alt: 'iPhone 14 Pro Screen', isPrimary: true, order: 1 }],
    retailPrice: 89.99,
    wholesalePrice: 58.49,
    costPrice: 45.00,
    qualityGrade: 'oem',
    installDifficulty: 'medium',
    compatibility: ['iPhone 14 Pro'],
    specifications: {},
    stock: 234,
    bulkPricing: [
      { minQuantity: 10, discount: 40 },
      { minQuantity: 50, discount: 45 },
    ],
    warranty: 90,
    features: ['True Tone Support', 'Face ID Compatible'],
    rating: 4.8,
    reviewCount: 156,
    isFeatured: true,
    isNew: false,
    tags: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Add more mock products...
]

const categories = [
  { id: '1', name: 'Screens', icon: '📱', count: 1234, href: '/products?category=screens' },
  { id: '2', name: 'Batteries', icon: '🔋', count: 856, href: '/products?category=batteries' },
  { id: '3', name: 'Cameras', icon: '📷', count: 432, href: '/products?category=cameras' },
  { id: '4', name: 'Tools', icon: '🛠️', count: 523, href: '/products?category=tools' },
  { id: '5', name: 'Audio', icon: '🎧', count: 654, href: '/products?category=audio' },
  { id: '6', name: 'Charging', icon: '🔌', count: 789, href: '/products?category=charging' },
]

export default function HomePage() {
  const { user } = useAuthStore()

  return (
    <MainLayout>
      <div className="min-h-screen">
        {/* Hero Section - Different for each user type */}
        {!user && <GuestHero />}
        {user?.role === 'retail' && <RetailHero user={user} />}
        {user?.role === 'business' && <BusinessHero user={user} />}

        {/* Business Promo Banner */}
        <PromoBanner user={user} />

        {/* Categories Section */}
        <CategoriesSection />

        {/* Trending Products */}
        <TrendingProductsSection user={user} />

        {/* Why Choose Us */}
        <WhyChooseUsSection />

        {/* CTA Section */}
        {(!user || user.role === 'retail') && <BusinessCTASection />}
      </div>
    </MainLayout>
  )
}

// Guest Hero Component
function GuestHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero py-16 md:py-24">
      <div className="container">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center"
          >
            <h1 className="text-display font-bold text-neutral-900 dark:text-white">
              Professional Phone Repair Parts
            </h1>
            <p className="mt-4 text-body-lg text-neutral-600 dark:text-neutral-400">
              Quality parts for every device, every time. From screens to batteries,
              we've got everything you need.
            </p>

            {/* Device Finder Card */}
            <Card className="mt-8 p-6">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Find Parts for Your Device
              </h2>
              <div className="mt-4 space-y-3">
                <Input placeholder="Select Brand" />
                <Input placeholder="Select Model" disabled />
                <Button variant="retail-primary" className="w-full" size="lg">
                  Search Parts
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>

            {/* Trust Badges */}
            <div className="mt-8 flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-retail-primary" />
                <span className="font-medium">OEM Quality</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-retail-primary" />
                <span className="font-medium">Same Day Ship</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-retail-primary" />
                <span className="font-medium">90-Day Warranty</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="animate-float">
              <div className="relative aspect-square w-full max-w-md">
                {/* Placeholder for hero image */}
                <div className="h-full w-full rounded-2xl bg-gradient-to-br from-retail-primary/20 to-retail-accent/20" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Retail Customer Hero
function RetailHero({ user }: { user: any }) {
  return (
    <section className="bg-gradient-hero py-12 md:py-16">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h1 className="text-h1 font-bold text-neutral-900 dark:text-white">
            Welcome back, {user.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-body-lg text-neutral-600 dark:text-neutral-400">
            Continue shopping or find new parts for your devices
          </p>

          {/* Quick Actions */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Link href="/dashboard/orders">
              <Card className="group cursor-pointer p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
                <Package className="h-8 w-8 text-retail-primary" />
                <h3 className="mt-3 font-semibold">Track Orders</h3>
                <p className="mt-1 text-sm text-neutral-600">View order status</p>
              </Card>
            </Link>
            <Link href="/products">
              <Card className="group cursor-pointer p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
                <TrendingUp className="h-8 w-8 text-retail-primary" />
                <h3 className="mt-3 font-semibold">Reorder</h3>
                <p className="mt-1 text-sm text-neutral-600">Buy again</p>
              </Card>
            </Link>
            <Link href="/auth/business-application">
              <Card className="group cursor-pointer p-6 transition-all hover:-translate-y-1 hover:shadow-business">
                <Building2 className="h-8 w-8 text-business-primary" />
                <h3 className="mt-3 font-semibold">Business Account</h3>
                <p className="mt-1 text-sm text-neutral-600">Apply now</p>
              </Card>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Business Account Hero
function BusinessHero({ user }: { user: any }) {
  return (
    <section className="bg-gradient-to-br from-business-light/10 to-business-accent/10 py-12">
      <div className="container">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <Badge variant="business" className="mb-4">
              Business Account • 35% OFF
            </Badge>
            <h1 className="text-h2 font-bold">Welcome back, {user.companyName || user.name}</h1>
            <p className="mt-2 text-neutral-600">Account Manager: Sarah Johnson</p>
          </div>

          {/* Business Metrics */}
          <Card className="p-6">
            <h3 className="font-semibold">This Month</h3>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-neutral-600">Orders</p>
                <p className="text-2xl font-bold text-business-primary">47</p>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Spent</p>
                <p className="text-2xl font-bold">$12,450</p>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Saved</p>
                <p className="text-2xl font-bold text-business-primary">$6,789</p>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Credit Available</p>
                <p className="text-2xl font-bold">$11,800</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}

// Promo Banner
function PromoBanner({ user }: { user: any }) {
  if (user?.role === 'business') return null

  return (
    <div className="border-y border-neutral-200 bg-retail-primary py-4 text-white dark:border-neutral-800">
      <div className="container">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <Building2 className="h-5 w-5" />
            <p className="font-semibold">
              Business Account? Get up to 45% OFF wholesale pricing
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/business/learn-more">
              <Button variant="secondary" size="sm">
                Learn More
              </Button>
            </Link>
            <Link href="/auth/business-application">
              <Button variant="secondary" size="sm">
                Apply Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// Categories Section
function CategoriesSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="text-center">
          <h2 className="text-h2 font-bold">Shop by Category</h2>
          <p className="mt-2 text-body text-neutral-600">
            Find the perfect part for your device
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link href={category.href}>
                <Card className="group cursor-pointer p-8 text-center transition-all hover:-translate-y-2 hover:shadow-xl">
                  <div className="text-5xl">{category.icon}</div>
                  <h3 className="mt-4 text-h4 font-semibold">{category.name}</h3>
                  <p className="mt-1 text-sm text-neutral-600">
                    {category.count} parts
                  </p>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Trending Products Section
function TrendingProductsSection({ user }: { user: any }) {
  return (
    <section className="bg-neutral-50 py-16 dark:bg-neutral-900/50 md:py-24">
      <div className="container">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-h2 font-bold">
              {user ? 'Recommended for You' : 'Trending Parts'}
            </h2>
            <p className="mt-2 text-body text-neutral-600">
              {user ? 'Based on your recent orders' : 'Most popular this week'}
            </p>
          </div>
          <Link href="/products">
            <Button variant="ghost">
              View All
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

// Why Choose Us Section
function WhyChooseUsSection() {
  const features = [
    {
      icon: Shield,
      title: 'OEM Quality',
      description: 'Genuine parts from trusted manufacturers',
    },
    {
      icon: Zap,
      title: 'Fast Shipping',
      description: 'Same-day ship on orders before 3 PM',
    },
    {
      icon: Package,
      title: '90-Day Warranty',
      description: 'All parts come with 90-day warranty',
    },
  ]

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <h2 className="text-center text-h2 font-bold">Why Repair Shops Choose Us</h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-retail-primary/10">
                <feature.icon className="h-8 w-8 text-retail-primary" />
              </div>
              <h3 className="mt-6 text-h4 font-semibold">{feature.title}</h3>
              <p className="mt-2 text-body text-neutral-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Business CTA Section
function BusinessCTASection() {
  return (
    <section className="bg-gradient-to-br from-retail-primary to-retail-dark py-16 text-white md:py-24">
      <div className="container text-center">
        <h2 className="text-h2 font-bold">Ready to Start Your Business Account?</h2>
        <p className="mt-4 text-body-lg text-white/90">
          Get wholesale pricing and exclusive benefits
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link href="/auth/business-application">
            <Button variant="secondary" size="lg" className="min-w-[200px]">
              Apply for Business Account
            </Button>
          </Link>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-8 text-sm">
          <div className="flex items-center gap-2">
            ✓ <span>Up to 45% OFF</span>
          </div>
          <div className="flex items-center gap-2">
            ✓ <span>Net 30 Terms</span>
          </div>
          <div className="flex items-center gap-2">
            ✓ <span>Dedicated Support</span>
          </div>
        </div>
      </div>
    </section>
  )
}
