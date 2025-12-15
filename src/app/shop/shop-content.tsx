'use client'

import { useState, useEffect } from 'react'
import { Search, SlidersHorizontal, Grid, List, ShoppingCart, Loader2, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { getProducts, Product } from '@/lib/api/products'
import { addToCart } from '@/lib/api/cart'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

const SORT_OPTIONS = [
    { value: 'created_at', label: 'Most Recent' },
    { value: 'base_price', label: 'Price: Low to High', order: 'asc' },
    { value: 'base_price', label: 'Price: High to Low', order: 'desc' },
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
    const [totalProducts, setTotalProducts] = useState(0)
    const limit = 20

    // Load products
    const loadProducts = async () => {
        try {
            setLoading(true)
            setError(null)
            
            const params: any = {
                page: currentPage,
                limit,
                sort: sortBy,
                order: sortOrder,
            }
            
            if (searchQuery) params.search = searchQuery
            if (selectedCategory) params.category = selectedCategory
            if (selectedBrand) params.brand = selectedBrand
            
            const response = await getProducts(params)
            
            // Filter by price range on client side (since API doesn't support this directly)
            const filteredProducts = response.data.filter(product => {
                const price = product.displayPrice || product.base_price
                return price >= priceRange[0] && price <= priceRange[1]
            })
            
            setProducts(filteredProducts)
            setTotalProducts(response.pagination.total)
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

    // Load products on mount and when filters change
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
        setPriceRange([0, 1000])
        setCurrentPage(1)
        router.push('/shop')
    }

    // Get unique categories and brands from products
    const categories = [...new Set(products.map(p => p.category?.name).filter(Boolean))]
    const brands = [...new Set(products.map(p => p.brand).filter(Boolean))]
    
    const hasActiveFilters = searchQuery || selectedCategory || selectedBrand || priceRange[0] > 0 || priceRange[1] < 1000

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
                                        min="0"
                                        max="1000"
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
                        </div>
                    </aside>

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

// Product Card Component
interface ProductCardProps {
    product: Product
    viewMode: 'grid' | 'list'
    onAddToCart: (productId: string) => void
    isLoading: boolean
    user: any
}

function ProductCard({ product, viewMode, onAddToCart, isLoading, user }: ProductCardProps) {
    const price = product.displayPrice || product.base_price
    const originalPrice = product.originalPrice || product.base_price
    const discountPercentage = product.discountPercentage || 0
    const isWholesale = product.isWholesale || false

    if (viewMode === 'list') {
        return (
            <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-4 hover:shadow-lg transition-shadow">
                <div className="flex gap-4">
                    {/* Image */}
                    <Link href={`/products/${product.id}`} className="flex-shrink-0">
                        <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg flex items-center justify-center overflow-hidden">
                            {product.thumbnail ? (
                                <Image
                                    src={product.thumbnail}
                                    alt={product.name}
                                    width={128}
                                    height={128}
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <span className="text-4xl">{product.brand?.[0] || 'P'}</span>
                            )}
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
                                    SKU: {product.sku} | {product.brand} | {product.device_model}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                                    ${price.toFixed(2)}
                                    {isWholesale && (
                                        <span className="text-xs text-green-600"> (Wholesale)</span>
                                    )}
                                </p>
                                {discountPercentage > 0 && (
                                    <p className="text-sm text-neutral-500 line-through">
                                        ${originalPrice.toFixed(2)}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mb-3">
                            {/* Stock */}
                            <span className={`text-sm font-medium ${
                                product.total_stock > 0
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-red-600 dark:text-red-400'
                            }`}>
                                {product.total_stock > 0 ? `${product.total_stock} in stock` : 'Out of stock'}
                            </span>

                            {/* Badges */}
                            {product.is_new && (
                                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-bold">NEW</span>
                            )}
                            {product.is_featured && (
                                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded font-bold">FEATURED</span>
                            )}
                        </div>

                        <Button 
                            onClick={() => onAddToCart(product.id)}
                            disabled={isLoading || product.total_stock <= 0 || !user}
                            className="w-full md:w-auto"
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <ShoppingCart className="h-4 w-4 mr-2" />
                            )}
                            {!user ? 'Login to Purchase' : 'Add to Cart'}
                        </Button>
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
                {product.thumbnail ? (
                    <Image
                        src={product.thumbnail}
                        alt={product.name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl">{product.brand?.[0] || 'P'}</span>
                    </div>
                )}
                
                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.is_new && (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-bold">NEW</span>
                    )}
                    {product.is_featured && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded font-bold">FEATURED</span>
                    )}
                    {discountPercentage > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">
                            -{Math.round(discountPercentage)}%
                        </span>
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
                    {product.brand} | {product.device_model}
                </p>

                {/* Price */}
                <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-2xl font-bold text-neutral-900 dark:text-white">
                        ${price.toFixed(2)}
                    </span>
                    {isWholesale && (
                        <span className="text-xs text-green-600">(Wholesale)</span>
                    )}
                </div>

                {discountPercentage > 0 && (
                    <p className="text-sm text-neutral-500 line-through mb-2">
                        ${originalPrice.toFixed(2)}
                    </p>
                )}

                {/* Stock */}
                <p className={`text-sm font-medium mb-3 ${
                    product.total_stock > 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                }`}>
                    {product.total_stock > 0 ? `${product.total_stock} in stock` : 'Out of stock'}
                </p>

                {/* Add to Cart */}
                <Button 
                    onClick={() => onAddToCart(product.id)}
                    disabled={isLoading || product.total_stock <= 0 || !user}
                    className="w-full"
                >
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                        <ShoppingCart className="h-4 w-4 mr-2" />
                    )}
                    {!user ? 'Login to Purchase' : 'Add to Cart'}
                </Button>
            </div>
        </div>
    )
}