'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, Clock, TrendingUp, X, ArrowRight, Package } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useDebounce } from '@/hooks/useDebounce'

interface SearchSuggestion {
    id: string
    name: string
    brand: string
    deviceModel: string
    sku: string
    thumbnail: string | null
    price: number
    wholesalePrice: number
    stock: number
    productType: string
}

interface SearchResults {
    suggestions: SearchSuggestion[]
    brands: string[]
    models: { model: string; brand: string }[]
    query: string
}

const RECENT_SEARCHES_KEY = 'recent_searches'
const MAX_RECENT_SEARCHES = 5

export default function SmartSearch() {
    const router = useRouter()
    const [query, setQuery] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const [results, setResults] = useState<SearchResults | null>(null)
    const [loading, setLoading] = useState(false)
    const [recentSearches, setRecentSearches] = useState<string[]>([])
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const searchRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const debouncedQuery = useDebounce(query, 300)

    // Load recent searches from localStorage
    useEffect(() => {
        const stored = localStorage.getItem(RECENT_SEARCHES_KEY)
        if (stored) {
            try {
                setRecentSearches(JSON.parse(stored))
            } catch (e) {
                console.error('Failed to parse recent searches:', e)
            }
        }
    }, [])

    // Fetch search suggestions
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (debouncedQuery.trim().length < 2) {
                setResults(null)
                return
            }

            setLoading(true)
            try {
                const res = await fetch(
                    `/api/search/autocomplete?q=${encodeURIComponent(debouncedQuery)}&limit=8`
                )
                const json = await res.json()

                if (json.success) {
                    setResults(json.data)
                    setSelectedIndex(-1)
                }
            } catch (error) {
                console.error('Search error:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchSuggestions()
    }, [debouncedQuery])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const saveRecentSearch = useCallback((searchQuery: string) => {
        const trimmed = searchQuery.trim()
        if (!trimmed) return

        const updated = [
            trimmed,
            ...recentSearches.filter(s => s.toLowerCase() !== trimmed.toLowerCase())
        ].slice(0, MAX_RECENT_SEARCHES)

        setRecentSearches(updated)
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
    }, [recentSearches])

    const handleSearch = useCallback((searchQuery: string) => {
        if (!searchQuery.trim()) return

        saveRecentSearch(searchQuery)
        setIsOpen(false)
        setQuery('')
        router.push(`/shop?search=${encodeURIComponent(searchQuery)}`)
    }, [router, saveRecentSearch])

    const handleKeyDown = (e: React.KeyboardEvent) => {
        const totalItems = (results?.suggestions.length || 0) + (results?.brands.length || 0) + (results?.models.length || 0)

        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setSelectedIndex(prev => (prev < totalItems - 1 ? prev + 1 : prev))
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1))
        } else if (e.key === 'Enter') {
            e.preventDefault()
            if (selectedIndex === -1) {
                handleSearch(query)
            } else if (results) {
                // Navigate to selected item
                const allItems = [
                    ...results.suggestions.map(s => ({ type: 'product', id: s.id })),
                    ...results.brands.map(b => ({ type: 'brand', value: b })),
                    ...results.models.map(m => ({ type: 'model', value: m.model, brand: m.brand }))
                ]
                const selected = allItems[selectedIndex]

                if (selected.type === 'product' && 'id' in selected) {
                    router.push(`/products/${(selected as any).id}`)
                    setIsOpen(false)
                } else if (selected.type === 'brand' && 'value' in selected) {
                    router.push(`/shop?brand=${encodeURIComponent((selected as any).value)}`)
                    setIsOpen(false)
                } else if (selected.type === 'model' && 'value' in selected && 'brand' in selected) {
                    router.push(`/shop?brand=${encodeURIComponent((selected as any).brand)}&device=${encodeURIComponent((selected as any).value)}`)
                    setIsOpen(false)
                }
            }
        } else if (e.key === 'Escape') {
            setIsOpen(false)
            inputRef.current?.blur()
        }
    }

    const clearRecentSearches = () => {
        setRecentSearches([])
        localStorage.removeItem(RECENT_SEARCHES_KEY)
    }

    const hasResults = results && (results.suggestions.length > 0 || results.brands.length > 0 || results.models.length > 0)

    return (
        <div ref={searchRef} className="relative w-full max-w-2xl">
            {/* Search Input */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value)
                        setIsOpen(true)
                    }}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search for products, brands, or models..."
                    className="w-full pl-12 pr-12 py-3 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {query && (
                    <button
                        onClick={() => {
                            setQuery('')
                            setResults(null)
                            inputRef.current?.focus()
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-xl max-h-[500px] overflow-y-auto z-50">
                    {loading && (
                        <div className="p-8 text-center text-neutral-500">
                            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
                            <p className="mt-2 text-sm">Searching...</p>
                        </div>
                    )}

                    {!loading && !query && recentSearches.length > 0 && (
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    Recent Searches
                                </h3>
                                <button
                                    onClick={clearRecentSearches}
                                    className="text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                                >
                                    Clear
                                </button>
                            </div>
                            <div className="space-y-1">
                                {recentSearches.map((search, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSearch(search)}
                                        className="w-full text-left px-3 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 text-sm text-neutral-700 dark:text-neutral-300 flex items-center gap-2"
                                    >
                                        <Clock className="h-4 w-4 text-neutral-400" />
                                        {search}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {!loading && query && !hasResults && (
                        <div className="p-8 text-center text-neutral-500">
                            <Package className="h-12 w-12 mx-auto mb-3 text-neutral-400" />
                            <p className="text-sm">No results found for "{query}"</p>
                            <p className="text-xs mt-1">Try different keywords or check spelling</p>
                        </div>
                    )}

                    {!loading && hasResults && (
                        <div className="p-2">
                            {/* Product Suggestions */}
                            {results!.suggestions.length > 0 && (
                                <div className="mb-4">
                                    <h3 className="px-3 py-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                                        Products
                                    </h3>
                                    <div className="space-y-1">
                                        {results!.suggestions.map((product, index) => (
                                            <Link
                                                key={product.id}
                                                href={`/products/${product.id}`}
                                                onClick={() => setIsOpen(false)}
                                                className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors ${
                                                    selectedIndex === index ? 'bg-neutral-100 dark:bg-neutral-700' : ''
                                                }`}
                                            >
                                                <div className="flex-shrink-0 w-12 h-12 bg-neutral-100 dark:bg-neutral-700 rounded-md overflow-hidden">
                                                    {product.thumbnail ? (
                                                        <Image
                                                            src={product.thumbnail}
                                                            alt={product.name}
                                                            width={48}
                                                            height={48}
                                                            className="object-cover w-full h-full"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-lg">
                                                            📱
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                                                        {product.name}
                                                    </p>
                                                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                                        {product.brand} • {product.deviceModel}
                                                    </p>
                                                </div>
                                                <div className="flex-shrink-0 text-right">
                                                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                                                        ${product.price.toFixed(2)}
                                                    </p>
                                                    {product.stock === 0 && (
                                                        <p className="text-xs text-red-600 dark:text-red-400">Out of stock</p>
                                                    )}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Brand Suggestions */}
                            {results!.brands.length > 0 && (
                                <div className="mb-4">
                                    <h3 className="px-3 py-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                                        Brands
                                    </h3>
                                    <div className="space-y-1">
                                        {results!.brands.map((brand, index) => {
                                            const itemIndex = results!.suggestions.length + index
                                            return (
                                                <Link
                                                    key={brand}
                                                    href={`/shop?brand=${encodeURIComponent(brand)}`}
                                                    onClick={() => setIsOpen(false)}
                                                    className={`flex items-center justify-between px-3 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors ${
                                                        selectedIndex === itemIndex ? 'bg-neutral-100 dark:bg-neutral-700' : ''
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <TrendingUp className="h-4 w-4 text-neutral-400" />
                                                        <span className="text-sm text-neutral-700 dark:text-neutral-300">
                                                            {brand}
                                                        </span>
                                                    </div>
                                                    <ArrowRight className="h-4 w-4 text-neutral-400" />
                                                </Link>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Model Suggestions */}
                            {results!.models.length > 0 && (
                                <div>
                                    <h3 className="px-3 py-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                                        Device Models
                                    </h3>
                                    <div className="space-y-1">
                                        {results!.models.map((modelObj, index) => {
                                            const itemIndex = results!.suggestions.length + results!.brands.length + index
                                            return (
                                                <Link
                                                    key={`${modelObj.brand}-${modelObj.model}`}
                                                    href={`/shop?brand=${encodeURIComponent(modelObj.brand)}&device=${encodeURIComponent(modelObj.model)}`}
                                                    onClick={() => setIsOpen(false)}
                                                    className={`flex items-center justify-between px-3 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors ${
                                                        selectedIndex === itemIndex ? 'bg-neutral-100 dark:bg-neutral-700' : ''
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Package className="h-4 w-4 text-neutral-400" />
                                                        <div>
                                                            <span className="text-sm text-neutral-700 dark:text-neutral-300">
                                                                {modelObj.model}
                                                            </span>
                                                            <span className="text-xs text-neutral-500 dark:text-neutral-400 ml-2">
                                                                ({modelObj.brand})
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <ArrowRight className="h-4 w-4 text-neutral-400" />
                                                </Link>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* View All Results */}
                            <div className="mt-4 pt-2 border-t border-neutral-200 dark:border-neutral-700">
                                <button
                                    onClick={() => handleSearch(query)}
                                    className="w-full px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md flex items-center justify-center gap-2"
                                >
                                    View all results for "{query}"
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
