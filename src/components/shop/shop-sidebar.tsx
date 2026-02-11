'use client'

import { SlidersHorizontal, Search } from 'lucide-react'

interface ShopSidebarProps {
    showFilters: boolean
    categories: string[]
    brands: string[]
    searchQuery: string
    setSearchQuery: (val: string) => void
    selectedCategory: string
    setSelectedCategory: (val: string) => void
    selectedBrand: string
    setSelectedBrand: (val: string) => void
    priceRange: number[]
    setPriceRange: (val: number[]) => void
    minPrice: number
    maxPrice: number
    hasActiveFilters: boolean
    clearFilters: () => void
}

export function ShopSidebar({
    showFilters,
    categories,
    brands,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedBrand,
    setSelectedBrand,
    priceRange,
    setPriceRange,
    minPrice,
    maxPrice,
    hasActiveFilters,
    clearFilters
}: ShopSidebarProps) {
    return (
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
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                    >
                        <option value="">All Categories</option>
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
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
                        <option value="">All Brands</option>
                        {brands.map(brand => (
                            <option key={brand} value={brand}>{brand}</option>
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
                            min={minPrice}
                            max={maxPrice}
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([minPrice, parseInt(e.target.value)])}
                            className="w-full"
                        />
                        <div className="flex items-center justify-between text-sm text-neutral-600 dark:text-neutral-400">
                            <span>${priceRange[0]}</span>
                            <span>${priceRange[1]}</span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    )
}
