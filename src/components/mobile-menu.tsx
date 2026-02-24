'use client'

import { useState, useEffect } from 'react'
import { X, ChevronRight, Search } from 'lucide-react'
import Link from 'next/link'

type PhoneModel = {
    id: string
    modelName: string
    modelSlug: string
}

type SubCategory = {
    id: string
    name: string
    slug: string
    phoneModels: PhoneModel[]
}

type BrandCategory = {
    id: string
    name: string
    slug: string
    children: SubCategory[]
}

export function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false)
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
    const [brands, setBrands] = useState<BrandCategory[]>([])

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch('/api/categories/tree')
                if (!res.ok) throw new Error('Failed to fetch')
                const data = await res.json() as BrandCategory[]
                setBrands(data)
            } catch (error) {
                console.error(error)
            }
        }
        load()
    }, [])

    return (
        <>
            {/* Hamburger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="lg:hidden p-2"
                aria-label="Open menu"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                        onClick={() => setIsOpen(false)}
                    />

                    <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-neutral-900 z-50 overflow-y-auto lg:hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
                            <h2 className="text-xl font-bold dark:text-white">Menu</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Search */}
                        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    className="w-full pl-10 pr-4 py-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-4">

                            {/* Shop */}
                            <Link
                                href="/shop"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-between py-3 px-4 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                            >
                                <span className="text-lg font-medium dark:text-white">🛍️ Shop</span>
                                <ChevronRight className="h-5 w-5 text-neutral-400" />
                            </Link>

                            {/* Categories */}
                            {brands.map((brand) => (
                                <div key={brand.id}>
                                    <button
                                        onClick={() => setExpandedCategory(expandedCategory === brand.id ? null : brand.id)}
                                        className="w-full flex items-center justify-between py-3 px-4 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                                    >
                                        <span className="text-lg font-medium dark:text-white">📱 {brand.name}</span>
                                        <ChevronRight className={`h-5 w-5 text-neutral-400 transition-transform ${expandedCategory === brand.id ? 'rotate-90' : ''}`} />
                                    </button>

                                    {expandedCategory === brand.id && (
                                        <div className="ml-4 space-y-1 mb-2">
                                            {brand.children.map((sub) => (
                                                <Link
                                                    key={sub.id}
                                                    href={`/shop?brand=${brand.slug}&category=${sub.slug}`}
                                                    onClick={() => setIsOpen(false)}
                                                    className="block py-2 px-4 text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                                                >
                                                    {sub.name}
                                                </Link>
                                            ))}
                                            <Link
                                                href={`/shop?brand=${brand.slug}`}
                                                onClick={() => setIsOpen(false)}
                                                className="block py-2 px-4 text-blue-600 dark:text-blue-400 font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                                            >
                                                View All {brand.name}
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Wholesale Apply */}
                            <Link
                                href="/wholesale/apply"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-between py-3 px-4 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                            >
                                <span className="text-lg font-medium dark:text-white">💼 Wholesale Apply</span>
                                <ChevronRight className="h-5 w-5 text-neutral-400" />
                            </Link>

                            {/* Wholesale Portal */}
                            <Link
                                href="/wholesale"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-between py-3 px-4 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                            >
                                <span className="text-lg font-medium dark:text-white">🏢 Wholesale Portal</span>
                                <ChevronRight className="h-5 w-5 text-neutral-400" />
                            </Link>

                            {/* Repair */}
                            <Link
                                href="/repairs"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-between py-3 px-4 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                            >
                                <span className="text-lg font-medium dark:text-white">🔧 Repair</span>
                                <ChevronRight className="h-5 w-5 text-neutral-400" />
                            </Link>

                            {/* Deals */}
                            <Link
                                href="/deals"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-between py-3 px-4 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                            >
                                <span className="text-lg font-medium text-red-600 dark:text-red-400">🔥 Deals & Offers</span>
                                <ChevronRight className="h-5 w-5 text-neutral-400" />
                            </Link>

                            {/* Divider */}
                            <div className="my-4 border-t border-neutral-200 dark:border-neutral-800" />

                            {/* About Us */}
                            <Link
                                href="/about"
                                onClick={() => setIsOpen(false)}
                                className="block py-3 px-4 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                            >
                                About Us
                            </Link>

                            {/* Contact */}
                            <Link
                                href="/contact"
                                onClick={() => setIsOpen(false)}
                                className="block py-3 px-4 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                            >
                                Contact Us
                            </Link>

                            {/* Store Locator */}
                            <Link
                                href="/stores"
                                onClick={() => setIsOpen(false)}
                                className="block py-3 px-4 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                            >
                                Find In-Store
                            </Link>

                            {/* Sign In Button */}
                            <button className="w-full mt-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-semibold hover:opacity-90 transition-opacity">
                                Sign In
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}
