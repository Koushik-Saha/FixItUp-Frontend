'use client'

import { useState, useMemo, useEffect } from 'react'
import { Search, SlidersHorizontal, X, ChevronDown, Grid, List, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

// COMPREHENSIVE PRODUCT DATABASE
const ALL_PRODUCTS = [
    // iPhone 17 Pro Max Products
    { id: 1, name: 'OLED Assembly For iPhone 17 Pro Max (Genuine OEM)', category: 'apple', device: 'iPhone 17 Pro Max', type: 'Replacement Parts', subCategory: 'Screen', brand: 'Apple', price: 378.00, wholesalePrice: 248.00, image: '/products/iphone-17-pro-max-screen.jpg', sku: 'IP17PM-OLED-GEN', inventory: 'In Stock', inventoryCount: 45, rating: 4.9, reviews: 234, isNew: true, isBestSeller: true },
    { id: 2, name: 'OLED Assembly Compatible For iPhone 17 Pro Max (Aftermarket Pro)', category: 'apple', device: 'iPhone 17 Pro Max', type: 'Replacement Parts', subCategory: 'Screen', brand: 'XO7', price: 327.09, wholesalePrice: 215.00, image: '/products/iphone-17-pro-max-xo7.jpg', sku: 'IP17PM-OLED-XO7', inventory: 'In Stock', inventoryCount: 89, rating: 4.7, reviews: 156 },
    { id: 3, name: 'Replacement Battery For iPhone 17 Pro Max (Genuine OEM)', category: 'apple', device: 'iPhone 17 Pro Max', type: 'Replacement Parts', subCategory: 'Battery', brand: 'Apple', price: 74.85, wholesalePrice: 49.00, image: '/products/iphone-17-pro-max-battery.jpg', sku: 'IP17PM-BAT', inventory: 'In Stock', inventoryCount: 234, rating: 4.9, reviews: 445, isBestSeller: true },
    { id: 4, name: 'Back Glass Housing For iPhone 17 Pro Max (Genuine OEM)', category: 'apple', device: 'iPhone 17 Pro Max', type: 'Replacement Parts', subCategory: 'Housing', brand: 'Apple', price: 145.00, wholesalePrice: 95.00, image: '/products/iphone-17-pro-max-housing.jpg', sku: 'IP17PM-HOUS', inventory: 'In Stock', inventoryCount: 23, rating: 4.8, reviews: 89 },
    { id: 5, name: 'Rear Camera Assembly For iPhone 17 Pro Max (Genuine OEM)', category: 'apple', device: 'iPhone 17 Pro Max', type: 'Replacement Parts', subCategory: 'Camera', brand: 'Apple', price: 189.99, wholesalePrice: 125.00, image: '/products/iphone-17-pro-max-camera.jpg', sku: 'IP17PM-CAM', inventory: 'In Stock', inventoryCount: 67, rating: 4.9, reviews: 178 },
    { id: 6, name: 'Charging Port Flex Cable For iPhone 17 Pro Max', category: 'apple', device: 'iPhone 17 Pro Max', type: 'Replacement Parts', subCategory: 'Charging Port', brand: 'Apple', price: 45.99, wholesalePrice: 30.00, image: '/products/iphone-17-pro-max-port.jpg', sku: 'IP17PM-PORT', inventory: 'In Stock', inventoryCount: 145, rating: 4.7, reviews: 267 },
    { id: 7, name: 'Silicone Case For iPhone 17 Pro Max - MagSafe', category: 'apple', device: 'iPhone 17 Pro Max', type: 'Accessories', subCategory: 'Cases', brand: 'Apple', price: 49.99, wholesalePrice: 32.00, image: '/products/case-silicone-ip17pm.jpg', sku: 'ACC-CASE-IP17PM', inventory: 'In Stock', inventoryCount: 234, rating: 4.7, reviews: 456 },
    { id: 8, name: 'Tempered Glass Screen Protector For iPhone 17 Pro Max (2-Pack)', category: 'apple', device: 'iPhone 17 Pro Max', type: 'Accessories', subCategory: 'Screen Protectors', brand: 'Spigen', price: 14.99, wholesalePrice: 9.99, image: '/products/screen-protector-ip17pm.jpg', sku: 'ACC-SP-IP17PM', inventory: 'In Stock', inventoryCount: 567, rating: 4.6, reviews: 1234, isBestSeller: true },

    // iPhone 17 Pro Products
    { id: 9, name: 'OLED Display For iPhone 17 Pro (Genuine OEM)', category: 'apple', device: 'iPhone 17 Pro', type: 'Replacement Parts', subCategory: 'Screen', brand: 'Apple', price: 348.00, wholesalePrice: 228.00, image: '/products/iphone-17-pro-screen.jpg', sku: 'IP17P-OLED', inventory: 'In Stock', inventoryCount: 56, rating: 4.9, reviews: 189, isNew: true },
    { id: 10, name: 'Battery For iPhone 17 Pro (Genuine OEM)', category: 'apple', device: 'iPhone 17 Pro', type: 'Replacement Parts', subCategory: 'Battery', brand: 'Apple', price: 69.99, wholesalePrice: 45.99, image: '/products/iphone-17-pro-battery.jpg', sku: 'IP17P-BAT', inventory: 'In Stock', inventoryCount: 198, rating: 4.8, reviews: 356, isNew: true },

    // iPhone 16 Pro Max Products
    { id: 11, name: 'OLED Assembly For iPhone 16 Pro Max (Genuine OEM)', category: 'apple', device: 'iPhone 16 Pro Max', type: 'Replacement Parts', subCategory: 'Screen', brand: 'Apple', price: 328.00, wholesalePrice: 215.00, image: '/products/iphone-16-pro-max-screen.jpg', sku: 'IP16PM-OLED', inventory: 'In Stock', inventoryCount: 78, rating: 4.9, reviews: 445, isBestSeller: true },
    { id: 12, name: 'Battery For iPhone 16 Pro Max (Genuine OEM)', category: 'apple', device: 'iPhone 16 Pro Max', type: 'Replacement Parts', subCategory: 'Battery', brand: 'Apple', price: 69.99, wholesalePrice: 45.99, image: '/products/iphone-16-pro-max-battery.jpg', sku: 'IP16PM-BAT', inventory: 'In Stock', inventoryCount: 267, rating: 4.8, reviews: 678 },

    // Samsung Galaxy S25 Ultra Products
    { id: 13, name: 'AMOLED Display For Samsung Galaxy S25 Ultra (Genuine OEM)', category: 'samsung', device: 'Galaxy S25 Ultra', type: 'Replacement Parts', subCategory: 'Screen', brand: 'Samsung', price: 398.00, wholesalePrice: 261.00, image: '/products/s25-ultra-screen.jpg', sku: 'S25U-OLED', inventory: 'In Stock', inventoryCount: 34, rating: 4.9, reviews: 112, isNew: true, isBestSeller: true },
    { id: 14, name: 'Battery For Samsung Galaxy S25 Ultra (Genuine OEM)', category: 'samsung', device: 'Galaxy S25 Ultra', type: 'Replacement Parts', subCategory: 'Battery', brand: 'Samsung', price: 84.99, wholesalePrice: 55.99, image: '/products/s25-ultra-battery.jpg', sku: 'S25U-BAT', inventory: 'In Stock', inventoryCount: 123, rating: 4.8, reviews: 234, isNew: true },
    { id: 15, name: 'Back Glass Housing For Samsung Galaxy S25 Ultra', category: 'samsung', device: 'Galaxy S25 Ultra', type: 'Replacement Parts', subCategory: 'Housing', brand: 'Samsung', price: 145.00, wholesalePrice: 95.00, image: '/products/s25-ultra-housing.jpg', sku: 'S25U-HOUS', inventory: 'In Stock', inventoryCount: 45, rating: 4.7, reviews: 89, isNew: true },

    // Samsung Galaxy S24 Ultra Products
    { id: 16, name: 'AMOLED Display For Samsung Galaxy S24 Ultra (Genuine OEM)', category: 'samsung', device: 'Galaxy S24 Ultra', type: 'Replacement Parts', subCategory: 'Screen', brand: 'Samsung', price: 348.00, wholesalePrice: 228.00, image: '/products/s24-ultra-screen.jpg', sku: 'S24U-OLED', inventory: 'In Stock', inventoryCount: 56, rating: 4.9, reviews: 234, isBestSeller: true },
    { id: 17, name: 'Battery For Samsung Galaxy S24 Ultra (Genuine OEM)', category: 'samsung', device: 'Galaxy S24 Ultra', type: 'Replacement Parts', subCategory: 'Battery', brand: 'Samsung', price: 78.99, wholesalePrice: 51.99, image: '/products/s24-ultra-battery.jpg', sku: 'S24U-BAT', inventory: 'In Stock', inventoryCount: 189, rating: 4.8, reviews: 445 },

    // Google Pixel Products
    { id: 18, name: 'OLED Display For Google Pixel 9 Pro (Genuine OEM)', category: 'google', device: 'Pixel 9 Pro', type: 'Replacement Parts', subCategory: 'Screen', brand: 'Google', price: 278.00, wholesalePrice: 182.00, image: '/products/pixel-9-pro-screen.jpg', sku: 'P9P-OLED', inventory: 'In Stock', inventoryCount: 67, rating: 4.8, reviews: 178, isNew: true },
    { id: 19, name: 'Battery For Google Pixel 9 Pro (Genuine OEM)', category: 'google', device: 'Pixel 9 Pro', type: 'Replacement Parts', subCategory: 'Battery', brand: 'Google', price: 65.99, wholesalePrice: 43.99, image: '/products/pixel-9-pro-battery.jpg', sku: 'P9P-BAT', inventory: 'In Stock', inventoryCount: 123, rating: 4.7, reviews: 234, isNew: true },

    // Motorola Products
    { id: 20, name: 'LCD Display For Moto G Power (2024)', category: 'motorola', device: 'Moto G Power 2024', type: 'Replacement Parts', subCategory: 'Screen', brand: 'Motorola', price: 89.99, wholesalePrice: 59.99, image: '/products/moto-g-power-screen.jpg', sku: 'MGP24-LCD', inventory: 'In Stock', inventoryCount: 45, rating: 4.6, reviews: 89 },
    { id: 21, name: 'Battery For Moto G Power (2024)', category: 'motorola', device: 'Moto G Power 2024', type: 'Replacement Parts', subCategory: 'Battery', brand: 'Motorola', price: 39.99, wholesalePrice: 26.99, image: '/products/moto-g-power-battery.jpg', sku: 'MGP24-BAT', inventory: 'In Stock', inventoryCount: 123, rating: 4.7, reviews: 156 },

    // Tools & Accessories (Universal)
    { id: 22, name: 'Professional Phone Repair Tool Kit (86-Piece)', category: 'tools', device: 'Universal', type: 'Tools & Supplies', subCategory: 'Tool Kits', brand: 'iFixit', price: 89.99, wholesalePrice: 59.99, image: '/products/tool-kit-premium.jpg', sku: 'TK-PREM-86', inventory: 'In Stock', inventoryCount: 234, rating: 4.9, reviews: 1234, isBestSeller: true },
    { id: 23, name: 'LCD Opening Pliers - Anti-Static', category: 'tools', device: 'Universal', type: 'Tools & Supplies', subCategory: 'Hand Tools', brand: 'iFixit', price: 24.99, wholesalePrice: 16.99, image: '/products/opening-pliers.jpg', sku: 'TL-PLIERS', inventory: 'In Stock', inventoryCount: 456, rating: 4.8, reviews: 678 },
    { id: 24, name: 'Precision Screwdriver Set (32-Piece)', category: 'tools', device: 'Universal', type: 'Tools & Supplies', subCategory: 'Screwdrivers', brand: 'iFixit', price: 34.99, wholesalePrice: 23.99, image: '/products/screwdriver-set.jpg', sku: 'TL-SCREW-32', inventory: 'In Stock', inventoryCount: 345, rating: 4.9, reviews: 890, isBestSeller: true },
    { id: 25, name: 'USB-C to Lightning Cable (6ft) - MFi Certified', category: 'accessories', device: 'Universal', type: 'Accessories', subCategory: 'Cables', brand: 'Apple', price: 24.99, wholesalePrice: 16.99, image: '/products/usbc-lightning.jpg', sku: 'ACC-CABLE-MFI', inventory: 'In Stock', inventoryCount: 567, rating: 4.8, reviews: 1234, isBestSeller: true },
    { id: 26, name: 'USB-C to USB-C Cable (10ft) - Braided', category: 'accessories', device: 'Universal', type: 'Accessories', subCategory: 'Cables', brand: 'Anker', price: 19.99, wholesalePrice: 13.99, image: '/products/usbc-usbc.jpg', sku: 'ACC-CABLE-USBC', inventory: 'In Stock', inventoryCount: 678, rating: 4.7, reviews: 890 },
    { id: 27, name: '65W GaN USB-C Fast Charger - Dual Port', category: 'accessories', device: 'Universal', type: 'Accessories', subCategory: 'Chargers', brand: 'Anker', price: 45.99, wholesalePrice: 30.99, image: '/products/charger-65w.jpg', sku: 'ACC-CHRG-65W', inventory: 'In Stock', inventoryCount: 234, rating: 4.9, reviews: 678, isBestSeller: true },
]

const SORT_OPTIONS = [
    { value: 'popularity', label: 'Most Popular' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
    { value: 'rating', label: 'Highest Rated' }
]

export default function ShopPage() {
    const searchParams = useSearchParams()

    // Get URL parameters
    const categoryParam = searchParams?.get('category') || 'all'
    const deviceParam = searchParams?.get('device') || 'all'
    const typeParam = searchParams?.get('type') || 'all'
    const subCategoryParam = searchParams?.get('subCategory') || 'all'

    const [priceRange, setPriceRange] = useState([0, 500])
    const [sortBy, setSortBy] = useState('popularity')
    const [searchQuery, setSearchQuery] = useState('')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [showFilters, setShowFilters] = useState(true)
    const [userRole, setUserRole] = useState<'retail' | 'wholesale'>('retail')

    // Filter products based on URL params and local state
    const filteredProducts = useMemo(() => {
        let products = ALL_PRODUCTS

        // Category filter from URL
        if (categoryParam !== 'all') {
            products = products.filter(p => p.category === categoryParam)
        }

        // Device filter from URL
        if (deviceParam !== 'all') {
            products = products.filter(p => p.device === deviceParam)
        }

        // Type filter from URL
        if (typeParam !== 'all') {
            products = products.filter(p => p.type === typeParam)
        }

        // SubCategory filter from URL
        if (subCategoryParam !== 'all') {
            products = products.filter(p => p.subCategory === subCategoryParam)
        }

        // Search filter
        if (searchQuery) {
            products = products.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.device.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        // Price range filter
        products = products.filter(p => {
            const price = userRole === 'retail' ? p.price : p.wholesalePrice
            return price >= priceRange[0] && price <= priceRange[1]
        })

        return products
    }, [categoryParam, deviceParam, typeParam, subCategoryParam, searchQuery, priceRange, userRole])

    // Sort products
    const sortedProducts = useMemo(() => {
        const products = [...filteredProducts]

        switch (sortBy) {
            case 'price-low':
                return products.sort((a, b) => {
                    const priceA = userRole === 'retail' ? a.price : a.wholesalePrice
                    const priceB = userRole === 'retail' ? b.price : b.wholesalePrice
                    return priceA - priceB
                })
            case 'price-high':
                return products.sort((a, b) => {
                    const priceA = userRole === 'retail' ? a.price : a.wholesalePrice
                    const priceB = userRole === 'retail' ? b.price : b.wholesalePrice
                    return priceB - priceA
                })
            case 'newest':
                return products.sort((a, b) => (a.isNew ? -1 : 1))
            case 'rating':
                return products.sort((a, b) => b.rating - a.rating)
            default: // popularity
                return products.sort((a, b) => b.reviews - a.reviews)
        }
    }, [filteredProducts, sortBy, userRole])

    // Get dynamic filter options
    const availableDevices = useMemo(() => {
        const devices = [...new Set(filteredProducts.map(p => p.device))]
        return ['all', ...devices.sort()]
    }, [filteredProducts])

    const availableTypes = useMemo(() => {
        const types = [...new Set(filteredProducts.map(p => p.type))]
        return ['all', ...types.sort()]
    }, [filteredProducts])

    const availableBrands = useMemo(() => {
        const brands = [...new Set(filteredProducts.map(p => p.brand))]
        return ['all', ...brands.sort()]
    }, [filteredProducts])

    const clearFilters = () => {
        window.location.href = '/shop'
    }

    // Get page title based on filters
    const getPageTitle = () => {
        if (deviceParam !== 'all') return `${deviceParam} Products`
        if (typeParam !== 'all') return `${typeParam}`
        if (categoryParam !== 'all') return `${categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)} Products`
        return 'Shop All Products'
    }

    const hasActiveFilters = categoryParam !== 'all' || deviceParam !== 'all' || typeParam !== 'all' || subCategoryParam !== 'all'

    return (
        <div className="min-h-screen bg-white dark:bg-neutral-900">

            {/* Breadcrumbs */}
            <div className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                        <Link href="/" className="hover:text-neutral-900 dark:hover:text-white">Home</Link>
                        <span>/</span>
                        <Link href="/shop" className="hover:text-neutral-900 dark:hover:text-white">Shop</Link>
                        {categoryParam !== 'all' && (
                            <>
                                <span>/</span>
                                <span className="text-neutral-900 dark:text-white capitalize">{categoryParam}</span>
                            </>
                        )}
                        {deviceParam !== 'all' && (
                            <>
                                <span>/</span>
                                <span className="text-neutral-900 dark:text-white">{deviceParam}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Header */}
            <div className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">{getPageTitle()}</h1>
                    <p className="text-neutral-600 dark:text-neutral-400">
                        Professional phone repair parts, accessories, and tools
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-[280px_1fr] gap-8">

                    {/* Filters Sidebar */}
                    <aside className={`${showFilters ? 'block' : 'hidden lg:block'}`}>
                        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6 sticky top-4">

                            {/* Filter Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                                    <SlidersHorizontal className="h-5 w-5" />
                                    Filters
                                </h2>
                                {hasActiveFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                        Clear All
                                    </button>
                                )}
                            </div>

                            {/* Active Filters Display */}
                            {hasActiveFilters && (
                                <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <p className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-2">Active Filters:</p>
                                    <div className="space-y-1">
                                        {categoryParam !== 'all' && (
                                            <div className="text-xs text-blue-700 dark:text-blue-300">
                                                Category: <span className="font-semibold capitalize">{categoryParam}</span>
                                            </div>
                                        )}
                                        {deviceParam !== 'all' && (
                                            <div className="text-xs text-blue-700 dark:text-blue-300">
                                                Device: <span className="font-semibold">{deviceParam}</span>
                                            </div>
                                        )}
                                        {typeParam !== 'all' && (
                                            <div className="text-xs text-blue-700 dark:text-blue-300">
                                                Type: <span className="font-semibold">{typeParam}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Search */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                    Search
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search products..."
                                        className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                    Price Range
                                </label>
                                <div className="space-y-3">
                                    <input
                                        type="range"
                                        min="0"
                                        max="500"
                                        value={priceRange[1]}
                                        onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                                        className="w-full"
                                    />
                                    <div className="flex items-center justify-between text-sm text-neutral-600 dark:text-neutral-400">
                                        <span>${priceRange[0]}</span>
                                        <span>${priceRange[1]}</span>
                                    </div>
                                </div>
                            </div>

                            {/* User Role Toggle */}
                            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
                                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                    Pricing View
                                </label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setUserRole('retail')}
                                        className={`
                      flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                      ${userRole === 'retail'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                                        }
                    `}
                                    >
                                        Retail
                                    </button>
                                    <button
                                        onClick={() => setUserRole('wholesale')}
                                        className={`
                      flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                      ${userRole === 'wholesale'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                                        }
                    `}
                                    >
                                        Wholesale
                                    </button>
                                </div>
                            </div>

                        </div>
                    </aside>

                    {/* Products Area */}
                    <main>

                        {/* Toolbar */}
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">

                            {/* Results Count */}
                            <p className="text-neutral-600 dark:text-neutral-400">
                                <span className="font-semibold text-neutral-900 dark:text-white">{sortedProducts.length}</span> products found
                            </p>

                            {/* Sort & View Options */}
                            <div className="flex items-center gap-4">

                                {/* Sort */}
                                <div className="flex items-center gap-2">
                                    <label className="text-sm text-neutral-600 dark:text-neutral-400">Sort:</label>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm"
                                    >
                                        {SORT_OPTIONS.map(option => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* View Mode */}
                                <div className="flex items-center gap-1 border border-neutral-300 dark:border-neutral-600 rounded-lg p-1">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-neutral-600 dark:text-neutral-400'}`}
                                    >
                                        <Grid className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-neutral-600 dark:text-neutral-400'}`}
                                    >
                                        <List className="h-4 w-4" />
                                    </button>
                                </div>

                                {/* Mobile Filter Toggle */}
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="lg:hidden p-2 border border-neutral-300 dark:border-neutral-600 rounded-lg text-neutral-600 dark:text-neutral-400"
                                >
                                    <SlidersHorizontal className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Products Grid/List */}
                        <div className={`
              ${viewMode === 'grid'
                            ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                            : 'space-y-4'
                        }
            `}>
                            {sortedProducts.map(product => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    viewMode={viewMode}
                                    userRole={userRole}
                                />
                            ))}
                        </div>

                        {/* No Results */}
                        {sortedProducts.length === 0 && (
                            <div className="text-center py-16 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
                                <Search className="h-16 w-16 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">No products found</h3>
                                <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                                    No products match your current filters.
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}

                    </main>
                </div>
            </div>
        </div>
    )
}

// Product Card Component
function ProductCard({ product, viewMode, userRole }: any) {
    const price = userRole === 'retail' ? product.price : product.wholesalePrice
    const priceLabel = userRole === 'wholesale' ? ' (Wholesale)' : ''

    if (viewMode === 'list') {
        return (
            <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-4 hover:shadow-lg transition-shadow">
                <div className="flex gap-4">
                    {/* Image */}
                    <Link href={`/products/${product.id}`} className="flex-shrink-0">
                        <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg flex items-center justify-center">
                            <span className="text-4xl">{product.brand[0]}</span>
                        </div>
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1">
                                <Link href={`/products/${product.id}`}>
                                    <h3 className="font-semibold text-neutral-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 mb-1">
                                        {product.name}
                                    </h3>
                                </Link>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    SKU: {product.sku} | {product.brand} | {product.device}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                                    ${price.toFixed(2)}
                                    <span className="text-xs text-neutral-500">{priceLabel}</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mb-3">
                            {/* Rating */}
                            <div className="flex items-center gap-1">
                                <span className="text-yellow-500">★</span>
                                <span className="text-sm font-medium text-neutral-900 dark:text-white">{product.rating}</span>
                                <span className="text-sm text-neutral-500">({product.reviews})</span>
                            </div>

                            {/* Inventory */}
                            <span className={`text-sm font-medium ${
                                product.inventory === 'In Stock'
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-orange-600 dark:text-orange-400'
                            }`}>
                {product.inventory}
              </span>

                            {/* Badges */}
                            {product.isNew && (
                                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-bold">NEW</span>
                            )}
                            {product.isBestSeller && (
                                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded font-bold">BEST SELLER</span>
                            )}
                        </div>

                        <button className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                            <ShoppingCart className="h-4 w-4" />
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // Grid View
    return (
        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-xl transition-shadow group">
            {/* Image */}
            <Link href={`/products/${product.id}`} className="block relative aspect-square bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl">{product.brand[0]}</span>
                </div>
                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.isNew && (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-bold">NEW</span>
                    )}
                    {product.isBestSeller && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded font-bold">BEST SELLER</span>
                    )}
                </div>
            </Link>

            {/* Info */}
            <div className="p-4">
                <Link href={`/products/${product.id}`}>
                    <h3 className="font-semibold text-neutral-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 mb-1 line-clamp-2 min-h-[48px]">
                        {product.name}
                    </h3>
                </Link>

                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">
                    {product.brand} | {product.device}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm font-medium text-neutral-900 dark:text-white">{product.rating}</span>
                    <span className="text-xs text-neutral-500">({product.reviews})</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1 mb-2">
          <span className="text-2xl font-bold text-neutral-900 dark:text-white">
            ${price.toFixed(2)}
          </span>
                    {userRole === 'wholesale' && (
                        <span className="text-xs text-neutral-500">(Wholesale)</span>
                    )}
                </div>

                {/* Inventory */}
                <p className={`text-sm font-medium mb-3 ${
                    product.inventory === 'In Stock'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-orange-600 dark:text-orange-400'
                }`}>
                    {product.inventory}
                </p>

                {/* Add to Cart */}
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                </button>
            </div>
        </div>
    )
}
