'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  ShoppingCart,
  Search,
  User,
  Heart,
  Phone,
  Mail
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCartStore, useWishlistStore } from '@/store'
import { useAuth } from '@/hooks/useAuth'
import { CategorySection } from "@/components/category-section"
import { MobileMenu } from "@/components/mobile-menu"
import { ThemeToggle } from '@/components/ui/theme-toggle'
import SmartSearch from '@/components/smart-search'

// All US Phone Brands
// Product Categories (removed unused constants)

export function Header() {
  const { user } = useAuth()
  const isAuthenticated = !!user
  const { getItemCount } = useCartStore()
  const { items: wishlistItems } = useWishlistStore()

  const cartCount = getItemCount()
  const wishlistCount = wishlistItems.length

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
      <div className="container py-2">
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
            <div className="relative w-8 h-8 lg:w-12 lg:h-12">
              <Image
                src="/images/fix_it_logo.png"
                alt="Max Fix IT"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="hidden lg:block">
              <div className="text-base lg:text-lg font-bold text-black dark:text-white leading-tight">
                Max Fix IT
              </div>
              <div className="text-[10px] text-neutral-500 leading-tight">
                Wholesale B2B & B2C
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
      <div className="hidden lg:block border-t border-neutral-200 dark:border-neutral-800">
        <CategorySection />
      </div>
    </header>
  )
}
