'use client'

import Link from 'next/link'
import { ShoppingCart, Search, User, Heart, Menu, MapPin, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useAuthStore, useCartStore, useWishlistStore, useUIStore } from '@/store'

export function Header() {
  const { user, isAuthenticated } = useAuthStore()
  const { getItemCount } = useCartStore()
  const { items: wishlistItems } = useWishlistStore()
  const { isMobileMenuOpen, toggleMobileMenu } = useUIStore()

  const cartCount = getItemCount()
  const wishlistCount = wishlistItems.length

  return (
      <header className="sticky top-0 z-50 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 shadow-sm">

        {/* Top Bar */}
        <div className="bg-neutral-900 dark:bg-neutral-950 text-white py-2">
          <div className="container">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <MapPin className="h-3 w-3" />
                  <span>Free shipping on orders $50+</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link href="/track-order" className="hover:text-blue-400 transition-colors">
                  Track Order
                </Link>
                <Link href="/help" className="hover:text-blue-400 transition-colors">
                  Help
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="container py-4">
          <div className="flex items-center justify-between gap-4">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
                  TechStore
                </h1>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Electronics & More
                </p>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-2xl">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <Input
                    placeholder="Search for products, brands, and more..."
                    className="pl-10 pr-4 h-12 bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">

              {/* Mobile Search */}
              <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Wishlist */}
              <Link href="/wishlist">
                <Button variant="ghost" size="icon" className="relative">
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
              {isAuthenticated ? (
                  <Link href="/account">
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </Link>
              ) : (
                  <Link href="/login">
                    <Button size="sm" className="hidden sm:flex">
                      Sign In
                    </Button>
                  </Link>
              )}

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

        {/* Navigation */}
        <div className="border-t border-neutral-200 dark:border-neutral-800">
          <div className="container">
            <nav className="hidden lg:flex items-center gap-8 py-3">
              <Link
                  href="/deals"
                  className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
              >
                🔥 Deals
              </Link>
              <Link
                  href="/category/smartphones"
                  className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Smartphones
              </Link>
              <Link
                  href="/category/laptops"
                  className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Laptops
              </Link>
              <Link
                  href="/category/headphones"
                  className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Headphones
              </Link>
              <Link
                  href="/category/watches"
                  className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Smart Watches
              </Link>
              <Link
                  href="/category/cameras"
                  className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Cameras
              </Link>
              <Link
                  href="/category/gaming"
                  className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Gaming
              </Link>
              <Link
                  href="/category/accessories"
                  className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Accessories
              </Link>
            </nav>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <div className="container py-4">
                <div className="flex flex-col gap-3">
                  {/* Mobile Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                    <Input
                        placeholder="Search products..."
                        className="pl-10 bg-neutral-50 dark:bg-neutral-800"
                    />
                  </div>

                  <Link
                      href="/deals"
                      className="py-2 text-sm font-semibold text-red-600"
                      onClick={toggleMobileMenu}
                  >
                    🔥 Deals
                  </Link>
                  <Link
                      href="/category/smartphones"
                      className="py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300"
                      onClick={toggleMobileMenu}
                  >
                    Smartphones
                  </Link>
                  <Link
                      href="/category/laptops"
                      className="py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300"
                      onClick={toggleMobileMenu}
                  >
                    Laptops
                  </Link>
                  <Link
                      href="/category/headphones"
                      className="py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300"
                      onClick={toggleMobileMenu}
                  >
                    Headphones
                  </Link>
                  <Link
                      href="/category/accessories"
                      className="py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300"
                      onClick={toggleMobileMenu}
                  >
                    Accessories
                  </Link>

                  {!isAuthenticated && (
                      <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                        <Link href="/login" onClick={toggleMobileMenu}>
                          <Button className="w-full">Sign In</Button>
                        </Link>
                      </div>
                  )}
                </div>
              </div>
            </div>
        )}
      </header>
  )
}
