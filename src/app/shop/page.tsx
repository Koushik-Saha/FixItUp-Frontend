'use client'

import { useState } from 'react'
import { Search, SlidersHorizontal, X, ChevronDown, Grid, List, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

// Sample product data
const PRODUCTS = [
    {
        id: 1,
        name: 'iPhone 15 Pro Max OLED Display',
        category: 'parts',
        brand: 'Apple',
        device: 'iPhone 15 Pro Max',
        price: 89.99,
        wholesalePrice: 59.99,
        image: '/images/products/iphone-15-display.jpg',
        inventory: 'In Stock',
        inventoryCount: 50,
        rating: 4.8,
        reviews: 124,
        sku: 'IP15PM-OLED-01',
        isNew: true
    },
    {
        id: 2,
        name: 'Samsung S24 Ultra Screen Assembly',
        category: 'parts',
        brand: 'Samsung',
        device: 'Galaxy S24 Ultra',
        price: 129.99,
        wholesalePrice: 89.99,
        image: '/images/products/s24-display.jpg',
        inventory: 'In Stock',
        inventoryCount: 35,
        rating: 4.9,
        reviews: 98,
        sku: 'S24U-SCR-01'
    },
    {
        id: 3,
        name: 'Premium Phone Repair Tool Kit',
        category: 'tools',
        brand: 'iFixit',
        device: 'Universal',
        price: 49.99,
        wholesalePrice: 34.99,
        image: '/images/products/tool-kit.jpg',
        inventory: 'In Stock',
        inventoryCount: 100,
        rating: 4.7,
        reviews: 256,
        sku: 'TK-PREM-01',
        isBestSeller: true
    },
    {
        id: 4,
        name: 'iPhone Lightning Cable 6ft',
        category: 'accessories',
        brand: 'Apple',
        device: 'iPhone',
        price: 19.99,
        wholesalePrice: 12.99,
        image: '/images/products/lightning-cable.jpg',
        inventory: 'In Stock',
        inventoryCount: 200,
        rating: 4.5,
        reviews: 432,
        sku: 'ACC-LTN-6FT'
    },
    {
        id: 5,
        name: 'Google Pixel 9 Battery',
        category: 'parts',
        brand: 'Google',
        device: 'Pixel 9',
        price: 39.99,
        wholesalePrice: 24.99,
        image: '/images/products/pixel-9-battery.jpg',
        inventory: 'Low Stock',
        inventoryCount: 8,
        rating: 4.6,
        reviews: 67,
        sku: 'P9-BAT-01'
    },
    {
        id: 6,
        name: 'Motorola Edge 60 LCD Screen',
        category: 'parts',
        brand: 'Motorola',
        device: 'Moto Edge 60',
        price: 74.99,
        wholesalePrice: 49.99,
        image: '/images/products/moto-edge-lcd.jpg',
        inventory: 'In Stock',
        inventoryCount: 25,
        rating: 4.4,
        reviews: 34,
        sku: 'ME60-LCD-01'
    },
    {
        id: 7,
        name: 'iPhone 14 Pro Camera Replacement',
        category: 'parts',
        brand: 'Apple',
        device: 'iPhone 14 Pro',
        price: 69.99,
        wholesalePrice: 44.99,
        image: '/images/products/iphone-14-camera.jpg',
        inventory: 'In Stock',
        inventoryCount: 42,
        rating: 4.8,
        reviews: 156,
        sku: 'IP14P-CAM-01'
    },
    {
        id: 8,
        name: 'USB-C Fast Charging Cable',
        category: 'accessories',
        brand: 'Universal',
        device: 'Universal',
        price: 14.99,
        wholesalePrice: 8.99,
        image: '/images/products/usbc-cable.jpg',
        inventory: 'In Stock',
        inventoryCount: 300,
        rating: 4.6,
        reviews: 892,
        sku: 'ACC-USBC-3FT',
        isBestSeller: true
    }
]

const CATEGORIES = [
    { value: 'all', label: 'All Products' },
    { value: 'parts', label: 'Replacement Parts' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'tools', label: 'Repair Tools' }
]

const BRANDS = ['All Brands', 'Apple', 'Samsung', 'Google', 'Motorola', 'iFixit', 'Universal']

const DEVICES = ['All Devices', 'iPhone 15 Pro Max', 'iPhone 14 Pro', 'Galaxy S24 Ultra', 'Pixel 9', 'Moto Edge 60', 'Universal']

const SORT_OPTIONS = [
    { value: 'popularity', label: 'Most Popular' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
    { value: 'rating', label: 'Highest Rated' }
]

export default function ShopPage() {
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [selectedBrand, setSelectedBrand] = useState('All Brands')
    const [selectedDevice, setSelectedDevice] = useState('All Devices')
    const [priceRange, setPriceRange] = useState([0, 200])
    const [sortBy, setSortBy] = useState('popularity')
    const [searchQuery, setSearchQuery] = useState('')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [showFilters, setShowFilters] = useState(true)
    const [userRole, setUserRole] = useState<'retail' | 'wholesale'>('retail') // Demo: toggle for testing

    // Filter products
    const filteredProducts = PRODUCTS.filter(product => {
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
        const matchesBrand = selectedBrand === 'All Brands' || product.brand === selectedBrand
        const matchesDevice = selectedDevice === 'All Devices' || product.device === selectedDevice
        const matchesPrice = userRole === 'retail'
            ? product.price >= priceRange[0] && product.price <= priceRange[1]
            : product.wholesalePrice >= priceRange[0] && product.wholesalePrice <= priceRange[1]
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchQuery.toLowerCase())

        return matchesCategory && matchesBrand && matchesDevice && matchesPrice && matchesSearch
    })

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        const priceA = userRole === 'retail' ? a.price : a.wholesalePrice
        const priceB = userRole === 'retail' ? b.price : b.wholesalePrice

        switch (sortBy) {
            case 'price-low':
                return priceA - priceB
            case 'price-high':
                return priceB - priceA
            case 'newest':
                return a.isNew ? -1 : 1
            case 'rating':
                return b.rating - a.rating
            default: // popularity
                return b.reviews - a.reviews
        }
    })

    const clearFilters = () => {
        setSelectedCategory('all')
        setSelectedBrand('All Brands')
        setSelectedDevice('All Devices')
        setPriceRange([0, 200])
        setSearchQuery('')
    }

    return (
        <div className="min-h-screen bg-white dark:bg-neutral-900">

            {/* Header */}
            <div className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">Shop All Products</h1>
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
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    Clear All
                                </button>
                            </div>

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

                            {/* Category Filter */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                    Category
                                </label>
                                <div className="space-y-2">
                                    {CATEGORIES.map(category => (
                                        <button
                                            key={category.value}
                                            onClick={() => setSelectedCategory(category.value)}
                                            className={`
                        w-full text-left px-3 py-2 rounded-lg transition-colors
                        ${selectedCategory === category.value
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                                            }
                      `}
                                        >
                                            {category.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Brand Filter */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                    Brand
                                </label>
                                <select
                                    value={selectedBrand}
                                    onChange={(e) => setSelectedBrand(e.target.value)}
                                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                                >
                                    {BRANDS.map(brand => (
                                        <option key={brand} value={brand}>{brand}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Device Filter */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                    Device Model
                                </label>
                                <select
                                    value={selectedDevice}
                                    onChange={(e) => setSelectedDevice(e.target.value)}
                                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                                >
                                    {DEVICES.map(device => (
                                        <option key={device} value={device}>{device}</option>
                                    ))}
                                </select>
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
                                        max="200"
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

                            {/* User Role Toggle (Demo) */}
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
                            <div className="text-center py-16">
                                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                                    No products found matching your filters.
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
    const priceLabel = userRole === 'retail' ? '' : ' (Wholesale)'

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
                    <h3 className="font-semibold text-neutral-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 mb-1 line-clamp-2">
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
