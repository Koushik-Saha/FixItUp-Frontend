'use client'

import { useEffect, useMemo, useState, useRef } from 'react'
import { Search, X, Pin, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

// Keep this (optional)
const COMPATIBILITY_DATA: {[key: string]: string[]} = {
    'iPhone Air': ['A3520', 'A3258', 'A3519', 'A3521'],
    'iPhone 17 Pro Max': ['A3520', 'A3258', 'A3519', 'A3521'],
    'iPhone 17 Pro': ['A3520', 'A3258', 'A3519', 'A3521'],
    'iPhone 17': ['A3520', 'A3258', 'A3519'],
    'iPhone 13 Pro': ['A2638', 'A2483', 'A2636', 'A2639', 'A2640'],
    'Series Ultra (3rd Gen) (49MM)': ['A2858', 'A2859', 'A2860'],
    'Series 10 (46MM)': ['A3365', 'A3366'],
    'Series 9 (45MM)': ['A2848', 'A2849'],
    'iPad Pro 13" 8th Gen (2025)': ['A3089', 'A3090'],
    'Galaxy S25 Ultra': ['SM-S928B', 'SM-S928U'],
}

type ColumnItem = { name: string; link: string; new?: boolean }
type Column = { title: string; items: ColumnItem[]; viewAll?: string }
type SubcatData = { columns: Column[] }

type BrandData = {
    subcategories: string[]
    bySubcategory: Record<string, SubcatData>
}

type ApiResponse = {
    success: boolean
    data?: Record<string, BrandData>
    error?: string
}

export function CategorySection() {
    const [activeBrand, setActiveBrand] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [pinnedSubcategory, setPinnedSubcategory] = useState<{[key: string]: string | null}>({})
    const [activeSubcategory, setActiveSubcategory] = useState<{[key: string]: string}>({
        Apple: 'iPhone',
        Samsung: 'S Series',
        Motorola: 'Moto G Series',
        Google: 'Pixel',
    })
    const [hoveredModel, setHoveredModel] = useState<string | null>(null)

    // Scroll controls
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(false)

    // Backend data
    const [brandsData, setBrandsData] = useState<Record<string, BrandData>>({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let cancelled = false
        async function load() {
            try {
                setLoading(true)
                const res = await fetch('/api/nav/phone-models', { cache: 'no-store' })
                const json = (await res.json()) as ApiResponse
                if (!cancelled) {
                    setBrandsData(json.success && json.data ? json.data : {})
                }
            } catch (e) {
                if (!cancelled) setBrandsData({})
            } finally {
                if (!cancelled) setLoading(false)
            }
        }
        load()
        return () => { cancelled = true }
    }, [])

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as HTMLElement
            if (!target.closest('[data-category-section]')) {
                setActiveBrand(null)
            }
        }

        if (activeBrand) {
            document.addEventListener('mousedown', handleClickOutside)
            return () => document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [activeBrand])

    // Check scroll position
    const checkScrollButtons = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
            setCanScrollLeft(scrollLeft > 0)
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
        }
    }

    useEffect(() => {
        checkScrollButtons()
        window.addEventListener('resize', checkScrollButtons)
        return () => window.removeEventListener('resize', checkScrollButtons)
    }, [])

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 300
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            })
            setTimeout(checkScrollButtons, 100)
        }
    }

    const brands = ['Apple', 'Samsung', 'Motorola', 'Google', 'Other Parts', 'Game Console', 'Accessories', 'Tools & Supplies']

    const handleBrandClick = (brand: string) => {
        if (['Apple', 'Samsung', 'Motorola', 'Google'].includes(brand)) {
            setActiveBrand(activeBrand === brand ? null : brand)
            setSearchQuery('')
        }
    }

    const togglePinSubcategory = (brand: string, subcat: string) => {
        setPinnedSubcategory(prev => ({
            ...prev,
            [brand]: prev[brand] === subcat ? null : subcat
        }))
        handleSubcategoryChange(brand, subcat)
    }

    const handleSubcategoryChange = (brand: string, subcat: string) => {
        setActiveSubcategory(prev => ({
            ...prev,
            [brand]: subcat
        }))
    }

    const currentData: SubcatData | null = useMemo(() => {
        if (!activeBrand) return null
        if (!['Apple', 'Samsung', 'Motorola', 'Google'].includes(activeBrand)) return null

        const brandBlock = brandsData[activeBrand]
        if (!brandBlock) return null

        const currentSubcat = activeSubcategory[activeBrand]
        return brandBlock.bySubcategory[currentSubcat] || null
    }, [activeBrand, brandsData, activeSubcategory])

    const filteredData: SubcatData | null = useMemo(() => {
        if (!currentData) return null
        const q = searchQuery.trim().toLowerCase()
        if (!q) return currentData

        return {
            columns: currentData.columns.map(col => ({
                ...col,
                items: col.items.filter(it => it.name.toLowerCase().includes(q))
            }))
        }
    }, [currentData, searchQuery])

    return (
        <div className="bg-white dark:bg-neutral-900 relative" data-category-section>
            {/* Brand Tabs with Horizontal Scroll */}
            <div className="border-b border-neutral-200 dark:border-neutral-800">
                <div className="container mx-auto px-4">
                    <div className="relative group">
                        {/* Left Scroll Button */}
                        {canScrollLeft && (
                            <button
                                onClick={() => scroll('left')}
                                className="absolute left-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-r from-white dark:from-neutral-900 to-transparent flex items-center justify-start pl-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <div className="bg-white dark:bg-neutral-800 rounded-full p-1.5 shadow-lg border border-neutral-200 dark:border-neutral-700">
                                    <ChevronLeft className="h-4 w-4 text-neutral-700 dark:text-neutral-300" />
                                </div>
                            </button>
                        )}

                        {/* Scrollable Categories */}
                        <div
                            ref={scrollContainerRef}
                            onScroll={checkScrollButtons}
                            className="flex items-center gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {brands.map(brand => {
                                const isActive = activeBrand === brand
                                const hasDropdown = ['Apple', 'Samsung', 'Motorola', 'Google'].includes(brand)

                                return (
                                    <button
                                        key={brand}
                                        onClick={() => handleBrandClick(brand)}
                                        className={`
                                            relative py-3 px-1 whitespace-nowrap text-sm font-medium transition-all border-b-2 flex-shrink-0
                                            ${isActive
                                                ? 'text-red-600 dark:text-red-500 border-red-600 dark:border-red-500'
                                                : 'text-neutral-600 dark:text-neutral-400 border-transparent hover:text-black dark:hover:text-white hover:border-neutral-300 dark:hover:border-neutral-600'
                                            }
                                        `}
                                    >
                                        {brand}
                                        {hasDropdown && (
                                            <span className={`ml-1 inline-block transition-transform ${isActive ? 'rotate-180' : ''}`}>
                                                ▼
                                            </span>
                                        )}
                                    </button>
                                )
                            })}

                            <Link href="/shop" className="flex-shrink-0">
                                <span className="text-neutral-600 dark:text-neutral-400 relative py-3 px-1 text-sm font-medium hover:text-black dark:hover:text-white whitespace-nowrap">
                                    Shop
                                </span>
                            </Link>
                            <Link href="/wholesale/apply" className="flex-shrink-0">
                                <span className="text-neutral-600 dark:text-neutral-400 relative py-3 px-1 text-sm font-medium hover:text-black dark:hover:text-white whitespace-nowrap">
                                    Wholesale Apply
                                </span>
                            </Link>
                            <Link href="/wholesale" className="flex-shrink-0">
                                <span className="text-neutral-600 dark:text-neutral-400 relative py-3 px-1 text-sm font-medium hover:text-black dark:hover:text-white whitespace-nowrap">
                                    Wholesale Portal
                                </span>
                            </Link>
                            <Link href="/repairs" className="flex-shrink-0">
                                <span className="text-neutral-600 dark:text-neutral-400 relative py-3 px-1 text-sm font-medium hover:text-black dark:hover:text-white whitespace-nowrap">
                                    Repair
                                </span>
                            </Link>
                        </div>

                        {/* Right Scroll Button */}
                        {canScrollRight && (
                            <button
                                onClick={() => scroll('right')}
                                className="absolute right-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-l from-white dark:from-neutral-900 to-transparent flex items-center justify-end pr-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <div className="bg-white dark:bg-neutral-800 rounded-full p-1.5 shadow-lg border border-neutral-200 dark:border-neutral-700">
                                    <ChevronRight className="h-4 w-4 text-neutral-700 dark:text-neutral-300" />
                                </div>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Dropdown Content - Only shows on CLICK */}
            {activeBrand && ['Apple', 'Samsung', 'Motorola', 'Google'].includes(activeBrand) && (
                <div className="absolute left-0 right-0 top-full border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm shadow-2xl">
                    <div className="container mx-auto px-4">
                        {/* Compact dropdown with max width */}
                        <div className="max-w-6xl mx-auto">
                            {/* Close Button - Compact */}
                            <div className="flex items-center justify-between pt-2 pb-2">
                                <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                                    {activeBrand} Products
                                </h2>
                                <button
                                    onClick={() => setActiveBrand(null)}
                                    className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
                                >
                                    <X className="h-4 w-4 text-neutral-500" />
                                </button>
                            </div>

                            {/* Search Bar - Compact */}
                            <div className="border-b border-neutral-200 dark:border-neutral-800 pb-2">
                                <div className="max-w-sm">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                                        <input
                                            type="text"
                                            placeholder="What are you looking for?"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-9 pr-8 py-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
                                        />
                                        {searchQuery && (
                                            <button
                                                onClick={() => setSearchQuery('')}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Content Area - Much Smaller and Compact */}
                            <div className="max-h-[320px] overflow-y-auto py-3">
                                <div className="grid grid-cols-[180px_1fr_220px] gap-4">

                                {/* Left Sidebar - Compact */}
                                <div className="space-y-1">
                                    <h3 className="text-[9px] font-semibold text-neutral-400 dark:text-neutral-500 mb-2 uppercase tracking-wide">
                                        {activeBrand} Parts
                                    </h3>

                                    {pinnedSubcategory[activeBrand] && (
                                        <div className="mb-2">
                                            <button
                                                onClick={() => togglePinSubcategory(activeBrand, pinnedSubcategory[activeBrand]!)}
                                                className="w-full flex items-center gap-1.5 px-2 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded text-xs hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                            >
                                                <Pin className="h-2.5 w-2.5 fill-red-500 flex-shrink-0" />
                                                <span className="flex-1 text-left font-medium">{pinnedSubcategory[activeBrand]}</span>
                                                <X className="h-2.5 w-2.5 opacity-60 hover:opacity-100" />
                                            </button>
                                        </div>
                                    )}

                                    <div className="space-y-0.5">
                                        {(brandsData[activeBrand]?.subcategories || []).map((subcat) => {
                                            const isPinned = pinnedSubcategory[activeBrand] === subcat
                                            if (isPinned) return null
                                            const isActive = activeSubcategory[activeBrand] === subcat

                                            return (
                                                <div key={subcat}>
                                                    <button
                                                        onClick={() => togglePinSubcategory(activeBrand, subcat)}
                                                        className={`
                                                            w-full text-left px-2 py-1.5 rounded text-xs transition-colors flex items-center justify-between group
                                                            ${isActive
                                                                ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium'
                                                                : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                                                            }
                                                        `}
                                                    >
                                                        <span>{subcat}</span>
                                                        <Pin className={`h-2.5 w-2.5 ${isActive ? 'opacity-50' : 'opacity-0 group-hover:opacity-100'} transition-opacity`} />
                                                    </button>
                                                </div>
                                            )
                                        })}

                                        {loading && (
                                            <div className="text-[10px] text-neutral-400 px-2 py-1">Loading...</div>
                                        )}
                                    </div>
                                </div>

                                {/* Middle Content Area - Compact */}
                                <div className="grid grid-cols-3 gap-3">
                                    {filteredData?.columns?.map((column, index) => (
                                        <div key={index}>
                                            {column.title && (
                                                <h3 className="text-[10px] font-semibold bg-neutral-100 dark:bg-neutral-800 px-2 py-1 mb-1.5 rounded">
                                                    {column.title}
                                                </h3>
                                            )}
                                            <ul className="space-y-0.5">
                                                {column.items.map((item) => (
                                                    <li
                                                        key={item.name}
                                                        onMouseEnter={() => setHoveredModel(item.name)}
                                                        onMouseLeave={() => setHoveredModel(null)}
                                                    >
                                                        <Link
                                                            href={item.link}
                                                            className={`
                                                                flex items-center gap-1.5 py-1 px-1.5 rounded text-xs transition-all
                                                                ${hoveredModel === item.name
                                                                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                                                                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                                                                }
                                                            `}
                                                        >
                                                            <span className="text-[11px]">{item.name}</span>
                                                            {item.new && (
                                                                <span className="bg-green-500 text-white text-[8px] px-1 py-0.5 rounded font-bold uppercase">
                                                                    new
                                                                </span>
                                                            )}
                                                        </Link>
                                                    </li>
                                                ))}
                                                {column.viewAll && (
                                                    <li className="pt-0.5">
                                                        <Link
                                                            href={column.viewAll}
                                                            className="block py-0.5 px-1.5 text-[10px] font-semibold text-black dark:text-white underline hover:no-underline"
                                                        >
                                                            View all →
                                                        </Link>
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    ))}
                                </div>

                                {/* Right Side - Compatibility - Compact */}
                                <div className="border-l border-neutral-200 dark:border-neutral-700 pl-3">
                                    {hoveredModel && COMPATIBILITY_DATA[hoveredModel] ? (
                                        <div>
                                            <h3 className="text-[10px] font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                                Compatibility:
                                            </h3>
                                            <div className="space-y-1">
                                                {COMPATIBILITY_DATA[hoveredModel].map(model => (
                                                    <div
                                                        key={model}
                                                        className="px-2 py-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-[10px] text-neutral-700 dark:text-neutral-300 font-mono"
                                                    >
                                                        {model}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-[10px] text-neutral-400 dark:text-neutral-500 italic">
                                            Hover over a model
                                        </div>
                                    )}
                                </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add CSS to hide scrollbar */}
            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    )
}
