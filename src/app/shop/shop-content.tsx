/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useState, useEffect } from 'react'
import { Grid, List, Loader2, AlertCircle, SlidersHorizontal, Search } from 'lucide-react' // Keeping Search/Sliders for empty state if needed
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { getProducts, Product, GetProductsParams } from '@/lib/api/products'
import { addToCart } from '@/lib/api/cart'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

// Imports
import { ProductCard } from '@/components/shop/product-card'
import { ShopSidebar } from '@/components/shop/shop-sidebar'

const SORT_OPTIONS = [
    { value: 'created_at', label: 'Most Recent' },
    { value: 'basePrice', label: 'Price: Low to High', order: 'asc' },
    { value: 'basePrice', label: 'Price: High to Low', order: 'desc' },
    { value: 'name', label: 'Name: A to Z', order: 'asc' }
]

export default function ShopContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { user } = useAuth()

    // State
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [cartLoading, setCartLoading] = useState<string | null>(null)
    const [addToCartMessage, setAddToCartMessage] = useState<string | null>(null)

    // Metadata State (for filters)
    const [categories, setCategories] = useState<string[]>([])
    const [brands, setBrands] = useState<string[]>([])
    const [globalMinPrice, setGlobalMinPrice] = useState(0)
    const [globalMaxPrice, setGlobalMaxPrice] = useState(1000)

    // Filter states
    const [searchQuery, setSearchQuery] = useState(searchParams?.get('search') || '')
    const [selectedCategory, setSelectedCategory] = useState(searchParams?.get('category') || '')
    const [selectedBrand, setSelectedBrand] = useState(searchParams?.get('brand') || '')
    const [priceRange, setPriceRange] = useState([0, 1000])
    const [sortBy, setSortBy] = useState('created_at')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [showFilters, setShowFilters] = useState(false)

    // Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const limit = 20

    // Load Metadata (Brands, Price Range) & Categories
    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                // 1. Fetch Categories
                const catRes = await fetch('/api/categories')
                const catJson = await catRes.json()
                if (catJson.data) {
                    setCategories(catJson.data.map((c: { name: string }) => c.name))
                }

                // 2. Fetch Product Metadata
                const metaRes = await fetch('/api/products/metadata')
                const metaJson = await metaRes.json()
                if (metaJson.brands) {
                    setBrands(metaJson.brands)
                    setGlobalMinPrice(metaJson.minPrice)
                    setGlobalMaxPrice(metaJson.maxPrice)
                    // Only update max price if it hasn't been touched by user
                    if (priceRange[1] === 1000) {
                        setPriceRange([metaJson.minPrice, metaJson.maxPrice])
                    }
                }
            } catch (err) {
                console.error("Failed to load shop metadata", err)
            }
        }
        fetchMetadata()
    }, [])

    // Load products
    const loadProducts = async () => {
        try {
            setLoading(true)
            setError(null)

            const params: Record<string, string | number> = {
                page: currentPage,
                limit,
                sort: sortBy,
                order: sortOrder,
                minPrice: priceRange[0],
                maxPrice: priceRange[1],
            }

            if (searchQuery) params.search = searchQuery
            if (selectedCategory) params.category = selectedCategory
            if (selectedBrand) params.brand = selectedBrand
            // Add device filter
            const deviceParam = searchParams?.get('device')
            if (deviceParam) params.device = deviceParam

            const response = await getProducts(params)

            setProducts(response.data)
            setTotalPages(response.pagination.totalPages)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load products')
        } finally {
            setLoading(false)
        }
    }

    // Handle add to cart
    const handleAddToCart = async (productId: string) => {
        if (!user) {
            router.push('/auth/login')
            return
        }

        try {
            setCartLoading(productId)
            await addToCart(productId, 1)
            setAddToCartMessage('Item added to cart successfully!')
            setTimeout(() => setAddToCartMessage(null), 3000)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add item to cart')
        } finally {
            setCartLoading(null)
        }
    }

    // Load products when filters change
    useEffect(() => {
        loadProducts()
    }, [currentPage, sortBy, sortOrder, searchQuery, selectedCategory, selectedBrand, priceRange])

    // Handle sort change
    const handleSortChange = (value: string) => {
        const option = SORT_OPTIONS.find(opt =>
            value === `${opt.value}-${opt.order || 'desc'}`
        )
        if (option) {
            setSortBy(option.value)
            setSortOrder((option.order as 'asc' | 'desc') || 'desc')
            setCurrentPage(1)
        }
    }

    // Clear all filters
    const clearFilters = () => {
        setSearchQuery('')
        setSelectedCategory('')
        setSelectedBrand('')
        setPriceRange([globalMinPrice, globalMaxPrice])
        setCurrentPage(1)
        router.push('/shop')
    }

    const hasActiveFilters = searchQuery || selectedCategory || selectedBrand || priceRange[0] > globalMinPrice || priceRange[1] < globalMaxPrice

    if (loading && products.length === 0) {
        return (
            <div className="min-h-screen bg-white dark:bg-neutral-900 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                    <p className="text-neutral-600 dark:text-neutral-400">Loading products...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white dark:bg-neutral-900 flex items-center justify-center p-4">
                <Alert className="max-w-md">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        {error}
                        <Button
                            onClick={loadProducts}
                            variant="outline"
                            size="sm"
                            className="mt-2 w-full"
                        >
                            Try Again
                        </Button>
                    </AlertDescription>
                </Alert>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white dark:bg-neutral-900">
            {/* Success Message */}
            {addToCartMessage && (
                <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
                    {addToCartMessage}
                </div>
            )}

            {/* Breadcrumbs */}
            <div className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                        <Link href="/" className="hover:text-neutral-900 dark:hover:text-white">Home</Link>
                        <span>/</span>
                        <Link href="/shop" className="hover:text-neutral-900 dark:hover:text-white">Shop</Link>
                        {selectedCategory && (
                            <>
                                <span>/</span>
                                <span className="text-neutral-900 dark:text-white">{selectedCategory}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Header */}
            <div className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                        {selectedCategory || 'Shop All Products'}
                    </h1>
                    <p className="text-neutral-600 dark:text-neutral-400">
                        Professional phone repair parts, accessories, and tools
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-[280px_1fr] gap-8">

                    {/* Filters Sidebar */}
                    <ShopSidebar
                        showFilters={showFilters}
                        categories={categories}
                        brands={brands}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        selectedBrand={selectedBrand}
                        setSelectedBrand={setSelectedBrand}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                        minPrice={globalMinPrice}
                        maxPrice={globalMaxPrice}
                        hasActiveFilters={!!hasActiveFilters}
                        clearFilters={clearFilters}
                    />

                    {/* Products Area */}
                    <main>
                        {/* Toolbar */}
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                            {/* Results Count */}
                            <p className="text-neutral-600 dark:text-neutral-400">
                                <span className="font-semibold text-neutral-900 dark:text-white">{products.length}</span> products found
                            </p>

                            {/* Sort & View Options */}
                            <div className="flex items-center gap-4">
                                {/* Sort */}
                                <div className="flex items-center gap-2">
                                    <label className="text-sm text-neutral-600 dark:text-neutral-400">Sort:</label>
                                    <select
                                        value={`${sortBy}-${sortOrder}`}
                                        onChange={(e) => handleSortChange(e.target.value)}
                                        className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm"
                                    >
                                        {SORT_OPTIONS.map(option => (
                                            <option
                                                key={`${option.value}-${option.order || 'desc'}`}
                                                value={`${option.value}-${option.order || 'desc'}`}
                                            >
                                                {option.label}
                                            </option>
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
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
                                        <div className="aspect-square bg-neutral-200 dark:bg-neutral-700 animate-pulse"></div>
                                        <div className="p-4 space-y-2">
                                            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
                                            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 animate-pulse"></div>
                                            <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2 animate-pulse"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={`
                                ${viewMode === 'grid'
                                    ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                                    : 'space-y-4'
                                }
                            `}>
                                {products.map(product => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        viewMode={viewMode}
                                        onAddToCart={handleAddToCart}
                                        isLoading={cartLoading === product.id}
                                        user={user}
                                    />
                                ))}
                            </div>
                        )}

                        {/* No Results */}
                        {!loading && products.length === 0 && (
                            <div className="text-center py-16 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
                                <Search className="h-16 w-16 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">No products found</h3>
                                <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                                    No products match your current filters.
                                </p>
                                <Button onClick={clearFilters}>
                                    Clear Filters
                                </Button>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-8">
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage <= 1}
                                    >
                                        Previous
                                    </Button>

                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i
                                        if (page > totalPages) return null

                                        return (
                                            <Button
                                                key={page}
                                                variant={page === currentPage ? "default" : "outline"}
                                                onClick={() => setCurrentPage(page)}
                                                className="w-10"
                                            >
                                                {page}
                                            </Button>
                                        )
                                    })}

                                    <Button
                                        variant="outline"
                                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage >= totalPages}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    )
}
