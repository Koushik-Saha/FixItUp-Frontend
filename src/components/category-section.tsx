'use client'

import { useEffect, useMemo, useState } from 'react'
import { Search, X, Pin } from 'lucide-react'
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
    const [hoveredBrand, setHoveredBrand] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [pinnedSubcategory, setPinnedSubcategory] = useState<{[key: string]: string | null}>({})
    const [activeSubcategory, setActiveSubcategory] = useState<{[key: string]: string}>({
        Apple: 'iPhone',
        Samsung: 'S Series',
        Motorola: 'Moto G Series',
        Google: 'Pixel',
    })
    const [hoveredModel, setHoveredModel] = useState<string | null>(null)

    // ✅ NEW: backend data
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

    const brands = ['Apple', 'Samsung', 'Motorola', 'Google', 'Other Parts', 'Game Console', 'Accessories', 'Tools & Supplies']

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

    // ✅ NEW: get current subcategory data from backend
    const currentData: SubcatData | null = useMemo(() => {
        if (!hoveredBrand) return null
        if (!['Apple', 'Samsung', 'Motorola', 'Google'].includes(hoveredBrand)) return null

        const brandBlock = brandsData[hoveredBrand]
        if (!brandBlock) return null

        const currentSubcat = activeSubcategory[hoveredBrand]
        return brandBlock.bySubcategory[currentSubcat] || null
    }, [hoveredBrand, brandsData, activeSubcategory])

    // ✅ Optional: filter items by search query
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
        <div className="bg-white dark:bg-neutral-900">
            {/* Brand Tabs */}
            <div className="border-b border-neutral-200 dark:border-neutral-800">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-6 overflow-x-auto">
                        {brands.map(brand => (
                            <button
                                key={brand}
                                onMouseEnter={() => setHoveredBrand(brand)}
                                className={`
                  relative py-3 px-1 whitespace-nowrap text-sm font-medium transition-colors border-b-2
                  ${hoveredBrand === brand
                                    ? 'text-red-600 border-red-600'
                                    : 'text-neutral-600 dark:text-neutral-400 border-transparent hover:text-black dark:hover:text-white'
                                }
                `}
                            >
                                {brand}
                            </button>
                        ))}
                        <Link href="/shop"><span className="text-neutral-600 dark:text-neutral-400 relative py-3 px-1 text-sm font-medium hover:text-black dark:hover:text-white">Shop</span></Link>
                        <Link href="/wholesale/apply"><span className="text-neutral-600 dark:text-neutral-400 relative py-3 px-1 text-sm font-medium hover:text-black dark:hover:text-white">Wholesale Apply</span></Link>
                        <Link href="/wholesale"><span className="text-neutral-600 dark:text-neutral-400 relative py-3 px-1 text-sm font-medium hover:text-black dark:hover:text-white">Wholesale Portal</span></Link>
                        <Link href="/repairs"><span className="text-neutral-600 dark:text-neutral-400 relative py-3 px-1 text-sm font-medium hover:text-black dark:hover:text-white">Repair</span></Link>
                    </div>
                </div>
            </div>

            {/* Dropdown Content */}
            {hoveredBrand && ['Apple', 'Samsung', 'Motorola', 'Google'].includes(hoveredBrand) && (
                <div
                    className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 max-h-[500px] overflow-y-auto"
                    onMouseEnter={() => setHoveredBrand(hoveredBrand)}
                    onMouseLeave={() => {
                        setHoveredBrand(null)
                        setHoveredModel(null)
                    }}
                >
                    {/* Search Bar */}
                    <div className="border-b border-neutral-200 dark:border-neutral-800 py-3">
                        <div className="container mx-auto px-4">
                            <div className="max-w-md">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                    <input
                                        type="text"
                                        placeholder="What are you looking for?"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-9 pr-8 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
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
                    </div>

                    <div className="container mx-auto px-4 py-4">
                        <div className="grid grid-cols-[200px_1fr_260px] gap-5">

                            {/* Left Sidebar */}
                            <div className="space-y-2">
                                {pinnedSubcategory[hoveredBrand] && (
                                    <div className="mb-3">
                                        <h3 className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 mb-2 uppercase tracking-wide">
                                            Genuine {hoveredBrand} Parts
                                        </h3>
                                        <button
                                            onClick={() => togglePinSubcategory(hoveredBrand, pinnedSubcategory[hoveredBrand]!)}
                                            className="w-full flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                        >
                                            <Pin className="h-3 w-3 fill-red-500 flex-shrink-0" />
                                            <span className="flex-1 text-left text-sm font-medium">{pinnedSubcategory[hoveredBrand]}</span>
                                            <X className="h-3 w-3 opacity-60 hover:opacity-100" />
                                        </button>
                                    </div>
                                )}

                                <div className="space-y-0.5">
                                    {(brandsData[hoveredBrand]?.subcategories || []).map((subcat) => {
                                        const isPinned = pinnedSubcategory[hoveredBrand] === subcat
                                        if (isPinned) return null
                                        const isActive = activeSubcategory[hoveredBrand] === subcat

                                        return (
                                            <div key={subcat}>
                                                <button
                                                    onClick={() => togglePinSubcategory(hoveredBrand, subcat)}
                                                    className={`
                            w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between group
                            ${isActive
                                                        ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium'
                                                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                                                    }
                          `}
                                                >
                                                    <span>{subcat}</span>
                                                    <Pin className={`h-3 w-3 ${isActive ? 'opacity-50' : 'opacity-0 group-hover:opacity-100'} transition-opacity`} />
                                                </button>
                                            </div>
                                        )
                                    })}

                                    {loading && (
                                        <div className="text-xs text-neutral-400 px-3 py-2">Loading models...</div>
                                    )}
                                </div>
                            </div>

                            {/* Middle Content Area */}
                            <div className="grid grid-cols-3 gap-4">
                                {filteredData?.columns?.map((column, index) => (
                                    <div key={index}>
                                        {column.title && (
                                            <h3 className="text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 px-3 py-1 mb-2 rounded">
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
                              flex items-center gap-2 py-1 px-2 rounded text-sm transition-all
                              ${hoveredModel === item.name
                                                            ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                                                            : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                                                        }
                            `}
                                                    >
                                                        <span className="text-xs">{item.name}</span>
                                                        {item.new && (
                                                            <span className="bg-green-500 text-white text-[9px] px-1 py-0.5 rounded font-bold">
                                new
                              </span>
                                                        )}
                                                    </Link>
                                                </li>
                                            ))}
                                            {column.viewAll && (
                                                <li>
                                                    <Link
                                                        href={column.viewAll}
                                                        className="block py-1 px-2 text-xs font-semibold text-black dark:text-white underline hover:no-underline"
                                                    >
                                                        View all models
                                                    </Link>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                ))}
                            </div>

                            {/* Right Side - Compatibility */}
                            <div className="border-l border-neutral-200 dark:border-neutral-700 pl-4">
                                {hoveredModel && COMPATIBILITY_DATA[hoveredModel] ? (
                                    <div>
                                        <h3 className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                            Compatibility:
                                        </h3>
                                        <div className="space-y-1.5">
                                            {COMPATIBILITY_DATA[hoveredModel].map(model => (
                                                <div
                                                    key={model}
                                                    className="px-2 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs text-neutral-700 dark:text-neutral-300 font-mono"
                                                >
                                                    {model}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-xs text-neutral-400 dark:text-neutral-500">
                                        Hover over a model to see compatibility
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
