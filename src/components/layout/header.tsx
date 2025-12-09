'use client'

import Link from 'next/link'
import { useState } from 'react'
import Image from 'next/image'
import {
  ShoppingCart,
  Search,
  User,
  Heart,
  Menu,
  Phone,
  ChevronDown,
  Smartphone,
  Laptop,
  Tablet,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useAuthStore, useCartStore, useWishlistStore, useUIStore } from '@/store'
import {CategorySection} from "@/components/category-section";

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
  const { user, isAuthenticated } = useAuthStore()
  const { getItemCount } = useCartStore()
  const { items: wishlistItems } = useWishlistStore()
  const { isMobileMenuOpen, toggleMobileMenu } = useUIStore()

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

        {/* Top Bar */}
        <div className="bg-neutral-900 dark:bg-neutral-950 text-white py-2">
          <div className="container">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3" />
                  <span>626-347-5662</span>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <span>✅ Free Shipping on Orders $50+</span>
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
        <div className="container py-4">
          <div className="flex items-center justify-between gap-4">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 flex-shrink-0">
              <div className="relative w-16 h-16">
                <Image
                    src="/images/fix_it_logo.png"
                    alt="Max Fix IT"
                    fill
                    className="object-contain"
                    priority
                />
              </div>
              <div>
                <div className="text-xl font-bold text-black dark:text-white">
                  Max Fix IT
                </div>
                <div className="text-xs text-neutral-500">
                  Wholesale B2B & B2C California, USA
                </div>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-2xl">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <Input
                    placeholder="Search by brand, model, or product..."
                    className="pl-10 pr-4 h-12 bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">

              {/* Mobile Search */}
              <Button variant="ghost" size="icon" className="md:hidden">
                <Search className="h-5 w-5" />
              </Button>

              <Link href="/stores">
                <div>
                  <span className="text-sm">Find In-Store</span>
                </div>
              </Link>

              {/* Wishlist */}
              <Link href="/wishlist">
                <Button variant="ghost" size="icon" className="relative hidden sm:flex">
                  <Heart className="h-5 w-5" />
                  {wishlistCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 hover:bg-red-500">
                        {wishlistCount}
                      </Badge>
                  )}
                </Button>
              </Link>

              {/* Cart */}
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-blue-600 hover:bg-blue-600">
                        {cartCount}
                      </Badge>
                  )}
                </Button>
              </Link>

              {/* User Account */}
              {/*{isAuthenticated ? (*/}
                  <Link href="/dashboard">
                    <Button variant="ghost" size="icon" className="hidden sm:flex">
                      <User className="h-5 w-5" />
                    </Button>
                  </Link>
              {/*) : (*/}
                  <Link href="/login">
                    <Button size="sm" className="hidden sm:flex">
                      Sign In
                    </Button>
                  </Link>
              {/*)}*/}

              {/* Mobile Menu */}
              <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={toggleMobileMenu}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation with Mega Menu */}
        <div
            className="border-t border-neutral-200 dark:border-neutral-800"
            onMouseLeave={handleMenuLeave}
        >
            <CategorySection />
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
            <div className="lg:hidden fixed inset-0 bg-black/50 z-50" onClick={toggleMobileMenu}>
              <div className="bg-white dark:bg-neutral-900 w-80 h-full overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                  <h2 className="font-bold text-lg dark:text-white">Menu</h2>
                  <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="p-4">
                  {/* Mobile Search */}
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                    <Input
                        placeholder="Search products..."
                        className="pl-10 bg-neutral-50 dark:bg-neutral-800"
                    />
                  </div>

                  {/* Mobile Links */}
                  <div className="space-y-1">
                    <Link
                        href="/phones"
                        className="block px-4 py-3 text-sm font-medium rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:text-white"
                        onClick={toggleMobileMenu}
                    >
                      📱 Phones
                    </Link>
                    <Link
                        href="/laptops"
                        className="block px-4 py-3 text-sm font-medium rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:text-white"
                        onClick={toggleMobileMenu}
                    >
                      💻 Laptops
                    </Link>
                    <Link
                        href="/tablets"
                        className="block px-4 py-3 text-sm font-medium rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:text-white"
                        onClick={toggleMobileMenu}
                    >
                      📱 Tablets
                    </Link>
                    <Link
                        href="/deals"
                        className="block px-4 py-3 text-sm font-semibold text-red-600 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        onClick={toggleMobileMenu}
                    >
                      🔥 Deals & Offers
                    </Link>
                    <Link
                        href="/repair-tools"
                        className="block px-4 py-3 text-sm font-medium rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:text-white"
                        onClick={toggleMobileMenu}
                    >
                      🛠️ Repair Tools
                    </Link>

                    {!isAuthenticated && (
                        <div className="pt-4 mt-4 border-t border-neutral-200 dark:border-neutral-800">
                          <Link href="/login" onClick={toggleMobileMenu}>
                            <Button className="w-full">Sign In</Button>
                          </Link>
                        </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
        )}
      </header>
  )
}
