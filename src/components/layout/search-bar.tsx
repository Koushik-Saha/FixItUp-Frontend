// components/layout/search-bar.tsx
// Dynamic Search with Live Results

'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, Clock, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface SearchResult {
    id: string
    name: string
    slug: string
    imageUrl: string | null
    basePrice: number
    category: string
}

export function SearchBar() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<SearchResult[]>([])
    const [loading, setLoading] = useState(false)
    const [showResults, setShowResults] = useState(false)
    const [recentSearches, setRecentSearches] = useState<string[]>([])

    const searchRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    // Load recent searches from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('recentSearches')
        if (saved) {
            setRecentSearches(JSON.parse(saved))
        }
    }, [])

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Debounced search
    useEffect(() => {
        if (!query.trim()) {
            setResults([])
            return
        }

        const timer = setTimeout(async () => {
            await performSearch(query)
        }, 300)

        return () => clearTimeout(timer)
    }, [query])

    const performSearch = async (searchQuery: string) => {
        try {
            setLoading(true)
            const response = await fetch(
                `/api/products?search=${encodeURIComponent(searchQuery)}&limit=5`
            )
            const { data } = await response.json()
            setResults(data || [])
            setShowResults(true)
        } catch (error) {
            console.error('Search error:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (!query.trim()) return

        // Save to recent searches
        const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5)
        setRecentSearches(updated)
        localStorage.setItem('recentSearches', JSON.stringify(updated))

        // Navigate to search results
        router.push(`/search?q=${encodeURIComponent(query)}`)
        setShowResults(false)
    }

    const clearSearch = () => {
        setQuery('')
        setResults([])
        inputRef.current?.focus()
    }

    const clearRecentSearches = () => {
        setRecentSearches([])
        localStorage.removeItem('recentSearches')
    }

    return (
        <div ref={searchRef} className="relative w-full">
            {/* Search Input */}
            <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setShowResults(true)}
                    placeholder="Search for products..."
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {query && (
                    <button
                        type="button"
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                    >
                        <X className="w-4 h-4 text-gray-400" />
                    </button>
                )}
            </form>

            {/* Search Results Dropdown */}
            {showResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-lg shadow-xl max-h-96 overflow-y-auto z-50">
                    {/* Loading */}
                    {loading && (
                        <div className="p-4 text-center text-gray-500">
                            <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto" />
                        </div>
                    )}

                    {/* Results */}
                    {!loading && results.length > 0 && (
                        <div>
                            <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50">
                                Products
                            </div>
                            {results.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/products/${product.slug}`}
                                    className="flex items-center gap-3 p-3 hover:bg-gray-50 transition"
                                    onClick={() => setShowResults(false)}
                                >
                                    {product.imageUrl && (
                                        <Image
                                            src={product.imageUrl}
                                            alt={product.name}
                                            width={40}
                                            height={40}
                                            className="rounded"
                                        />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {product.name}
                                        </p>
                                        <p className="text-xs text-gray-500">{product.category}</p>
                                    </div>
                                    <p className="text-sm font-semibold text-gray-900">
                                        ${product.basePrice.toFixed(2)}
                                    </p>
                                </Link>
                            ))}
                            <Link
                                href={`/search?q=${encodeURIComponent(query)}`}
                                className="block px-4 py-3 text-sm text-center text-blue-600 hover:bg-blue-50 border-t"
                                onClick={() => setShowResults(false)}
                            >
                                View all results for "{query}"
                            </Link>
                        </div>
                    )}

                    {/* No Results */}
                    {!loading && query && results.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            <p className="font-medium">No products found</p>
                            <p className="text-sm mt-1">Try a different search term</p>
                        </div>
                    )}

                    {/* Recent Searches */}
                    {!query && recentSearches.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between px-4 py-2 bg-gray-50">
                                <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                                    <Clock className="w-4 h-4" />
                                    Recent Searches
                                </div>
                                <button
                                    onClick={clearRecentSearches}
                                    className="text-xs text-blue-600 hover:underline"
                                >
                                    Clear
                                </button>
                            </div>
                            {recentSearches.map((search, index) => (
                                <button
                                    key={index}
                                    onClick={() => setQuery(search)}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left hover:bg-gray-50 transition"
                                >
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    {search}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Popular Searches */}
                    {!query && recentSearches.length === 0 && (
                        <div>
                            <div className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50">
                                <TrendingUp className="w-4 h-4" />
                                Popular Searches
                            </div>
                            {['iPhone 17 Pro', 'Samsung Galaxy S24', 'iPad repair', 'Screen replacement'].map((term, index) => (
                                <button
                                    key={index}
                                    onClick={() => setQuery(term)}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left hover:bg-gray-50 transition"
                                >
                                    <TrendingUp className="w-4 h-4 text-gray-400" />
                                    {term}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
