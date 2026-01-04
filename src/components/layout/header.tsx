'use client'

import Link from 'next/link'
import { useState } from 'react'
import Image from 'next/image'
import {
  ShoppingCart,
  Search,
  User,
  Heart,
  Phone,
  ChevronDown,
  Smartphone,
  Laptop,
  Tablet,
  Mail
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useCartStore, useWishlistStore } from '@/store'
import { useAuth } from '@/hooks/useAuth'
import {CategorySection} from "@/components/category-section"
import {MobileMenu} from "@/components/mobile-menu"
import { ThemeToggle } from '@/components/ui/theme-toggle'
import SmartSearch from '@/components/smart-search'

// All US Phone Brands
const PHONE_BRANDS = [
  { id: 'apple', name: 'Apple', logo: '🍎', popular: true, count: 2847 },
  { id: 'samsung', name: 'Samsung', logo: '📱', popular: true, count: 3421 },
  { id: 'google', name: 'Google', logo: '🔍', popular: true, count: 567 },
  { id: 'motorola', name: 'Motorola', logo: '📲', popular: true, count: 892 },
  { id: 'lg', name: 'LG', logo: '📱', popular: false, count: 234 },
  { id: 'oneplus', name: 'OnePlus', logo: '1️⃣', popular: false, count: 445 },
  { id: 'nokia', name: 'Nokia', logo: '📞', popular: false, count: 123 },
  { id: 'asus', name: 'ASUS', logo: '📱', popular: false, count: 198 },
  { id: 'htc', name: 'HTC', logo: '📱', popular: false, count: 87 },
  { id: 'sony', name: 'Sony', logo: '🎮', popular: false, count: 156 },
  { id: 'tcl', name: 'TCL', logo: '📺', popular: false, count: 92 },
  { id: 'zte', name: 'ZTE', logo: '📱', popular: false, count: 78 },
  { id: 'alcatel', name: 'Alcatel', logo: '📱', popular: false, count: 65 },
  { id: 'blu', name: 'BLU', logo: '🔵', popular: false, count: 134 }
]

// All Laptop Brands
const LAPTOP_BRANDS = [
  { id: 'apple', name: 'Apple', logo: '🍎', popular: true, count: 456 },
  { id: 'dell', name: 'Dell', logo: '💻', popular: true, count: 892 },
  { id: 'hp', name: 'HP', logo: '💻', popular: true, count: 1234 },
  { id: 'lenovo', name: 'Lenovo', logo: '💻', popular: true, count: 987 },
  { id: 'asus', name: 'ASUS', logo: '💻', popular: true, count: 654 },
  { id: 'acer', name: 'Acer', logo: '💻', popular: false, count: 432 },
  { id: 'msi', name: 'MSI', logo: '🎮', popular: false, count: 234 },
  { id: 'razer', name: 'Razer', logo: '🐍', popular: false, count: 178 },
  { id: 'microsoft', name: 'Microsoft', logo: '🪟', popular: true, count: 345 },
  { id: 'samsung', name: 'Samsung', logo: '📱', popular: false, count: 267 },
  { id: 'lg', name: 'LG', logo: '📱', popular: false, count: 123 },
  { id: 'toshiba', name: 'Toshiba', logo: '💻', popular: false, count: 98 }
]

// All Tablet Brands
const TABLET_BRANDS = [
  { id: 'apple', name: 'Apple', logo: '🍎', popular: true, count: 678 },
  { id: 'samsung', name: 'Samsung', logo: '📱', popular: true, count: 892 },
  { id: 'microsoft', name: 'Microsoft', logo: '🪟', popular: true, count: 234 },
  { id: 'amazon', name: 'Amazon', logo: '📦', popular: true, count: 456 },
  { id: 'lenovo', name: 'Lenovo', logo: '💻', popular: false, count: 198 },
  { id: 'google', name: 'Google', logo: '🔍', popular: false, count: 134 },
  { id: 'asus', name: 'ASUS', logo: '💻', popular: false, count: 167 },
  { id: 'huawei', name: 'Huawei', logo: '📱', popular: false, count: 89 }
]

// Product Categories (for all devices)
const PRODUCT_CATEGORIES = [
  { id: 'cases', name: 'Cases & Covers', icon: '📱', count: 8234 },
  { id: 'screens', name: 'LCD Screens', icon: '📺', count: 1567 },
  { id: 'batteries', name: 'Batteries', icon: '🔋', count: 892 },
  { id: 'chargers', name: 'Chargers & Cables', icon: '🔌', count: 2341 },
  { id: 'cameras', name: 'Cameras', icon: '📷', count: 456 },
  { id: 'speakers', name: 'Speakers & Audio', icon: '🔊', count: 678 },
  { id: 'keyboards', name: 'Keyboards', icon: '⌨️', count: 534 },
  { id: 'stylus', name: 'Stylus & Pens', icon: '✏️', count: 234 },
  { id: 'memory', name: 'Memory & Storage', icon: '💾', count: 789 },
  { id: 'tools', name: 'Repair Tools', icon: '🛠️', count: 432 }
]

export function Header() {
  const { user } = useAuth()
  const isAuthenticated = !!user
  const { getItemCount } = useCartStore()
  const { items: wishlistItems } = useWishlistStore()

  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [activeDevice, setActiveDevice] = useState<'phones' | 'laptops' | 'tablets' | null>(null)

  const cartCount = getItemCount()
  const wishlistCount = wishlistItems.length

  const handleMenuEnter = (menu: string) => {
    setActiveMenu(menu)
  }

  const handleMenuLeave = () => {
    setActiveMenu(null)
    setActiveDevice(null)
  }

  return (
      <header className="sticky top-0 z-50 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 shadow-sm">

        {/* Top Bar - Desktop Only */}
        <div className="hidden lg:block bg-neutral-900 dark:bg-neutral-950 text-white py-2">
          <div className="container">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3" />
                  <span>818-402-4931</span>
                </div>
                <div className="hidden xl:flex items-center gap-2">
                  <span>✅ Free Shipping on Orders $100+</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link href="/order-tracking" className="hover:text-blue-400 transition-colors">
                  Track Order
                </Link>
                <Link href="/contact-us" className="hover:text-blue-400 transition-colors">
                  Contact US
                </Link>
                <Link href="/about-us" className="hover:text-blue-400 transition-colors">
                  About US
                </Link>
                <Link href="/wholesale" className="hover:text-blue-400 transition-colors">
                  Wholesale B2B & B2C
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="container py-3 lg:py-4">
          <div className="flex items-center justify-between gap-2 lg:gap-4">

            {/* Left - Mobile Menu + Notification (Mobile Only) */}
            <div className="flex items-center gap-2 lg:hidden">
              <MobileMenu />

              <Button variant="ghost" size="icon" className="h-9 w-9 relative">
                <Mail className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
            </div>

            {/* Logo - Center on Mobile, Left on Desktop */}
            <Link href="/" className="flex items-center gap-2 lg:gap-3 flex-shrink-0 absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
              <div className="relative w-10 h-10 lg:w-16 lg:h-16">
                <Image
                    src="/images/fix_it_logo.png"
                    alt="Max Fix IT"
                    fill
                    className="object-contain"
                    priority
                />
              </div>
              <div className="hidden lg:block">
                <div className="text-lg lg:text-xl font-bold text-black dark:text-white">
                  Max Fix IT
                </div>
                <div className="text-xs text-neutral-500">
                  Wholesale B2B & B2C California, USA
                </div>
              </div>
            </Link>

            {/* Search Bar - Desktop Only */}
            <div className="hidden lg:flex flex-1 max-w-2xl">
              <SmartSearch />
            </div>

            {/* Right - Actions */}
            <div className="flex items-center gap-1 lg:gap-3">

              {/* Search - Mobile Only */}
              <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9">
                <Search className="h-5 w-5" />
              </Button>

              {/* Find In-Store - Desktop Only */}
              <Link href="/stores" className="hidden lg:block">
                <Button variant="ghost" className="text-sm text-black dark:text-white">
                  Find In-Store
                </Button>
              </Link>

              {/* Wishlist - Desktop Only */}
              <Link href="/wishlist" className="hidden lg:block">
                <Button variant="ghost" size="icon" className="relative text-black dark:text-white">
                  <Heart className="h-5 w-5" />
                  {wishlistCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 hover:bg-red-500">
                        {wishlistCount}
                      </Badge>
                  )}
                </Button>
              </Link>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Cart */}
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative h-9 w-9 lg:h-10 lg:w-10 text-black dark:text-white">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-blue-600 hover:bg-blue-600 text-xs">
                        {cartCount}
                      </Badge>
                  )}
                </Button>
              </Link>

              {/* User Account - Desktop Only */}
              {isAuthenticated && user ? (
                  <Link href="/dashboard" className="hidden lg:flex items-center gap-2">
                    <Button variant="ghost" className="flex items-center gap-2 text-black dark:text-white">
                      <User className="h-5 w-5" />
                      <span className="text-sm">{user.full_name}</span>
                    </Button>
                  </Link>
              ) : (
                  <Link href="/auth/login" className="hidden lg:block">
                    <Button variant="ghost" size="sm" className="text-black dark:text-white">
                      Sign In
                    </Button>
                  </Link>
              )}
            </div>
          </div>
        </div>

        {/* Navigation with Category Section - Desktop Only */}
        <div
            className="hidden lg:block border-t border-neutral-200 dark:border-neutral-800"
            onMouseLeave={handleMenuLeave}
        >
          <CategorySection />
        </div>
      </header>
  )
}
