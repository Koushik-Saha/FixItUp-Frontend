// components/layout/header.tsx
// Dynamic Header with Categories, Search, Cart

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react'
import { DynamicNavigation } from './navigation'
import { SearchBar } from './search-bar'

interface HeaderProps {
  cartItemCount?: number
}

export function Header({ cartItemCount = 0 }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Handle scroll for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
      <header
          className={`sticky top-0 z-50 bg-white transition-shadow ${
              isScrolled ? 'shadow-md' : ''
          }`}
      >
        {/* Top Bar */}
        <div className="bg-blue-600 text-white text-sm">
          <div className="container mx-auto px-4 py-2 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span>📞 (800) 123-4567</span>
              <span>📧 support@maxfixit.com</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/wholesale/apply" className="hover:underline">
                Wholesale Program
              </Link>
              <Link href="/repairs" className="hover:underline">
                Repair Services
              </Link>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">MF</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Max Fix IT</h1>
                <p className="text-xs text-gray-500">Phone Repair Experts</p>
              </div>
            </Link>

            {/* Desktop Search */}
            <div className="hidden md:block flex-1 max-w-2xl mx-8">
              <SearchBar />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Mobile Search Toggle */}
              <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Cart */}
              <Link
                  href="/cart"
                  className="relative p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
                )}
              </Link>

              {/* User Menu */}
              <Link
                  href="/account"
                  className="hidden sm:flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <User className="w-6 h-6" />
                <span className="text-sm">Account</span>
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                {isMobileMenuOpen ? (
                    <X className="w-6 h-6" />
                ) : (
                    <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {isSearchOpen && (
              <div className="md:hidden pb-4">
                <SearchBar />
              </div>
          )}
        </div>

        {/* Navigation */}
        <DynamicNavigation />

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
            <div className="md:hidden border-t">
              <div className="container mx-auto px-4 py-4">
                <nav className="space-y-2">
                  <Link
                      href="/shop"
                      className="block py-2 hover:text-blue-600 transition"
                      onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Shop All
                  </Link>
                  <Link
                      href="/wholesale/apply"
                      className="block py-2 hover:text-blue-600 transition"
                      onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Wholesale Program
                  </Link>
                  <Link
                      href="/repairs"
                      className="block py-2 hover:text-blue-600 transition"
                      onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Repair Services
                  </Link>
                  <Link
                      href="/account"
                      className="block py-2 hover:text-blue-600 transition"
                      onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Account
                  </Link>
                </nav>
              </div>
            </div>
        )}
      </header>
  )
}
