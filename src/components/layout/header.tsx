'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Package,
  Heart,
  Settings,
  LogOut,
  Building2,
  FileText,
  BarChart3,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useAuthStore, useCartStore, useUIStore } from '@/store'

export function Header() {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()
  const { getItemCount } = useCartStore()
  const { isMobileMenuOpen, toggleMobileMenu, isSearchOpen, toggleSearch } = useUIStore()
  
  const [scrolled, setScrolled] = React.useState(false)
  const cartItemCount = getItemCount()

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigation = {
    guest: [
      { name: 'Shop', href: '/products' },
      { name: 'Device Finder', href: '/device-finder' },
      { name: 'Support', href: '/support' },
      { name: 'About', href: '/about' },
    ],
    retail: [
      { name: 'Shop', href: '/products' },
      { name: 'Device Finder', href: '/device-finder' },
      { name: 'Support', href: '/support' },
    ],
    business: [
      { name: 'Catalog', href: '/products' },
      { name: 'Bulk Order', href: '/bulk-order' },
      { name: 'Invoices', href: '/invoices' },
      { name: 'Support', href: '/support' },
    ],
  }

  const userMenu = {
    retail: [
      { name: 'My Orders', href: '/dashboard/orders', icon: Package },
      { name: 'Wishlist', href: '/dashboard/wishlist', icon: Heart },
      { name: 'Profile', href: '/dashboard/profile', icon: User },
      { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    ],
    business: [
      { name: 'Dashboard', href: '/business/dashboard', icon: BarChart3 },
      { name: 'Orders', href: '/business/orders', icon: Package },
      { name: 'Invoices', href: '/business/invoices', icon: FileText },
      { name: 'Team', href: '/business/team', icon: Users },
      { name: 'Settings', href: '/business/settings', icon: Settings },
    ],
  }

  const links = user
    ? navigation[user.role as keyof typeof navigation] || navigation.guest
    : navigation.guest

  const menu = user && user.role !== 'guest'
    ? userMenu[user.role as keyof typeof userMenu]
    : []

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 w-full border-b transition-all duration-300',
          scrolled
            ? 'border-neutral-200 bg-white/95 shadow-md backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-neutral-800 dark:bg-neutral-950/95'
            : 'border-transparent bg-white dark:bg-neutral-950'
        )}
      >
        <div className="container flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-retail">
                <span className="text-xl font-bold text-white">M</span>
              </div>
              <div className="hidden flex-col md:flex">
                <span className="text-lg font-bold text-neutral-900 dark:text-white">
                  Max Phone Repair
                </span>
                <span className="text-xs text-neutral-600 dark:text-neutral-400">
                  Quality Parts for Every Device
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-6 lg:flex">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-retail-primary',
                    pathname === link.href
                      ? 'text-retail-primary'
                      : 'text-neutral-700 dark:text-neutral-300'
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* User Badge */}
          {user && user.role !== 'guest' && (
            <div className="absolute left-1/2 top-full hidden -translate-x-1/2 lg:block">
              <Badge
                variant={user.role === 'retail' ? 'retail' : 'business'}
                className="shadow-sm"
              >
                {user.role === 'retail' ? 'Retail Customer' : 'Business Account'}
                {user.role === 'business' && ' • 35% OFF'}
              </Badge>
            </div>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSearch}
              className="hidden sm:flex"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge
                    variant={user?.role === 'business' ? 'business' : 'retail'}
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center p-0 text-xs"
                  >
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User Menu or Sign In */}
            {user ? (
              <UserDropdown user={user} menu={menu} logout={logout} />
            ) : (
              <div className="hidden items-center gap-2 md:flex">
                <Link href="/auth/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/auth/register">
                  <Button
                    variant="retail-primary"
                    className="whitespace-nowrap"
                  >
                    Register
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="lg:hidden"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Search Bar (Expandable) */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-neutral-200 dark:border-neutral-800"
            >
              <div className="container py-4">
                <Input
                  type="search"
                  placeholder="Search parts, SKUs, models..."
                  leftIcon={<Search className="h-4 w-4" />}
                  className="max-w-2xl"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 top-20 z-40 bg-white dark:bg-neutral-950 lg:hidden"
          >
            <nav className="container py-6">
              <div className="space-y-4">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={toggleMobileMenu}
                    className="block text-lg font-medium text-neutral-700 hover:text-retail-primary dark:text-neutral-300"
                  >
                    {link.name}
                  </Link>
                ))}
                {!user && (
                  <>
                    <hr className="border-neutral-200 dark:border-neutral-800" />
                    <Link href="/auth/login" onClick={toggleMobileMenu}>
                      <Button variant="ghost" className="w-full justify-start">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/register" onClick={toggleMobileMenu}>
                      <Button variant="retail-primary" className="w-full">
                        Register
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function UserDropdown({
  user,
  menu,
  logout,
}: {
  user: any
  menu: any[]
  logout: () => void
}) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="relative">
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-retail text-sm font-semibold text-white">
          {user.name
            .split(' ')
            .map((n: string) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)}
        </div>
        <span className="hidden md:block">{user.name.split(' ')[0]}</span>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-neutral-200 bg-white p-2 shadow-xl dark:border-neutral-800 dark:bg-neutral-950"
            >
              <div className="space-y-1">
                {menu.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-900"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                ))}
                <hr className="my-2 border-neutral-200 dark:border-neutral-800" />
                <button
                  onClick={() => {
                    logout()
                    setIsOpen(false)
                  }}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
