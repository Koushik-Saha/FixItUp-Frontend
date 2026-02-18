'use client'

import { useEffect, useMemo, useState, useRef } from 'react'
import { Search, X, Pin, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

// Types based on the API response
type PhoneModel = {
    id: string
    modelName: string
    modelSlug: string
    generatedSlug?: string
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

export function CategorySection() {
    // State
    const [brands, setBrands] = useState<BrandCategory[]>([])
    const [activeBrandId, setActiveBrandId] = useState<string | null>(null)
    const [activeSubcatId, setActiveSubcatId] = useState<string | null>(null)
    const [pinnedSubcatId, setPinnedSubcatId] = useState<string | null>(null) // New: Pinning
    const [hoveredModel, setHoveredModel] = useState<PhoneModel | null>(null) // New: Hover Detail
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    // UI State
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(false)

    // Fetch Data
    useEffect(() => {
        async function load() {
            try {
                setLoading(true)
                const res = await fetch('/api/categories/tree')
                if (!res.ok) throw new Error('Failed to fetch')
                const data = await res.json() as BrandCategory[]
                setBrands(data)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    // Scroll Controls
    const checkScrollButtons = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
            setCanScrollLeft(scrollLeft > 0)
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5)
        }
    }

    useEffect(() => {
        checkScrollButtons()
        window.addEventListener('resize', checkScrollButtons)
        return () => window.removeEventListener('resize', checkScrollButtons)
    }, [brands]) // Check when brands load

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const amount = 300
            scrollContainerRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' })
            setTimeout(checkScrollButtons, 100)
        }
    }

    // Interaction Handlers
    // Interaction Handlers (handleBrandClick removed as unused)

    const handleSubcatClick = (id: string) => {
        if (pinnedSubcatId === id) {
            // Unpin if clicked again? MobileSentrix usually just switches selection.
            // Let's keep it simple: Click sets the "active" view and pins it until another is clicked.
            // Actually, usually hover previews, click locks.
            setPinnedSubcatId(id)
            setActiveSubcatId(id)
        } else {
            setPinnedSubcatId(id)
            setActiveSubcatId(id)
        }
    }

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as HTMLElement
            if (!target.closest('[data-category-section]')) {
                setActiveBrandId(null)
            }
        }
        if (activeBrandId) {
            document.addEventListener('mousedown', handleClickOutside)
            return () => document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [activeBrandId])


    // Derived Data with Custom Processing for Apple/iPhone
    const activeBrand = useMemo(() => {
        const brand = brands.find(b => b.id === activeBrandId)
        if (!brand) return null

        // Clone data to avoid mutation
        const processed = { ...brand, children: [...brand.children] }


        // Helper to consolidate items by name pattern or prefix
        const consolidate = (
            brand: BrandCategory,
            key: string,
            label: string,
            filterFn: (c: SubCategory) => boolean,
            sortOthers: string[] = []
        ) => {
            const childrenCopy = [...brand.children]

            // 1. Identify Target subcategories and others
            const targets = childrenCopy.filter(filterFn)
            const others = childrenCopy.filter(c => !filterFn(c))

            if (targets.length === 0) return { ...brand, children: childrenCopy }

            // 2. Aggregate all models
            let allModels: PhoneModel[] = []
            targets.forEach(sub => {
                allModels.push(...sub.phoneModels)
            })

            // Deduplicate
            const seen = new Set()
            allModels = allModels.filter(m => {
                const dup = seen.has(m.id)
                seen.add(m.id)
                return !dup
            })

            // 3. Create consolidated category
            const consolidated = {
                id: `${key}-main-consolidated`,
                name: label,
                slug: key,
                phoneModels: allModels
            }

            // 4. Sort others
            if (sortOthers.length > 0) {
                others.sort((a, b) => {
                    const ia = sortOthers.findIndex(o => a.name.includes(o))
                    const ib = sortOthers.findIndex(o => b.name.includes(o))
                    if (ia !== -1 && ib !== -1) return ia - ib
                    if (ia !== -1) return -1
                    if (ib !== -1) return 1
                    return a.name.localeCompare(b.name)
                })
            } else {
                others.sort((a, b) => a.name.localeCompare(b.name))
            }

            // 5. Final List
            return {
                ...brand,
                children: [consolidated, ...others]
            }
        }

        // Apply Logic per Brand
        if (brand.name === 'Apple') {
            return consolidate(
                brand,
                'iphone',
                'iPhone',
                (c) => c.name.toLowerCase().startsWith('iphone'),
                ['iPad', 'Watch', 'Mac', 'AirPods']
            )
        }

        else if (brand.name === 'Samsung') {
            // Samsung Strategy: Consolidate "Series" mess
            // Logic: 
            // - "S Series": Includes "S Series", "S22", "S21", etc.
            // - "A Series": Includes "A Series", "A50", "A01" etc.
            // - "Note": Includes "Note"
            // - "Z": Includes "Z", "Fold", "Flip"

            // We need a multi-pass approach or just simple "Galaxy Phones" consolidation?
            // User requested "like Apple". Apple has "iPhone" (User clicks iPhone -> sees all).
            // So for Samsung, user should click "Galaxy Phones" -> sees all S, A, Note, Z models?
            // Or "S Series" -> sees all S models.
            // Given the screenshot showed "A01" separately, let's try broadly consolidating common patterns first.
            // Actually, if we just want "like Apple", let's consolidate ALL phones into "Samsung Phones"? 
            // But Tablets/Watches should be separate.

            // Let's try 3 main Buckets for Samsung:
            // 1. Galaxy Phones (S, A, Note, Z, J, M, etc.)
            // 2. Tablets (Tab)
            // 3. Wearables (Watch, Gear)

            const isTablet = (name: string) => name.toLowerCase().includes('tab')
            const isWearable = (name: string) => name.toLowerCase().includes('watch') || name.toLowerCase().includes('gear')
            const isPhone = (name: string) => !isTablet(name) && !isWearable(name)

            return consolidate(
                brand,
                'samsung-phones',
                'Galaxy Phones',
                (c) => isPhone(c.name),
                ['Tab', 'Watch', 'Gear']
            )
        }

        else if (brand.name === 'Google') {
            return consolidate(
                brand,
                'pixel',
                'Pixel Phones',
                (c) => c.name.toLowerCase().includes('pixel') && !c.name.toLowerCase().includes('watch') && !c.name.toLowerCase().includes('tablet') && !c.name.toLowerCase().includes('buds'),
                ['Tablet', 'Watch', 'Buds']
            )
        }

        else if (brand.name === 'Motorola') {
            return consolidate(
                brand,
                'moto',
                'Moto Phones',
                () => true, // Consolidate everything for Motorola usually
                []
            )
        }


        return processed
    }, [brands, activeBrandId])

    const currentSubcatId = pinnedSubcatId || activeSubcatId
    const activeSubcat = useMemo(() => activeBrand?.children.find(c => c.id === currentSubcatId), [activeBrand, currentSubcatId])

    // Helper: Sort Models by Generation and Tier
    const compareModels = (aName: string, bName: string) => {
        // Extract Generation Number (e.g. 16 from "iPhone 16 Pro")
        const getGen = (name: string) => {
            const match = name.match(/iPhone\s+(\d+)/i)
            return match ? parseInt(match[1]) : -1
        }

        const genA = getGen(aName)
        const genB = getGen(bName)

        // 1. Sort by Generation (Descending: 16 -> 15)
        if (genA !== genB) {
            // If one is numbered and other isn't (e.g. "iPhone X"), numbered usually comes first if > 8
            if (genA === -1 && genB !== -1) return genB > 8 ? 1 : -1
            if (genB === -1 && genA !== -1) return genA > 8 ? -1 : 1
            return genB - genA
        }

        // 2. If Same Generation, sort by Tier
        // Order: Pro Max > Pro > Plus > (Base) > Mini
        const getTierScore = (name: string) => {
            if (name.includes('Pro Max')) return 4
            if (name.includes('Pro')) return 3
            if (name.includes('Plus')) return 2
            if (name.includes('Mini')) return 0
            return 1 // Base model
        }

        const tierA = getTierScore(aName)
        const tierB = getTierScore(bName)

        if (tierA !== tierB) return tierB - tierA // Higher score first

        // 3. Fallback to name
        return aName.localeCompare(bName)
    }

    // Filtered Content (Search)
    const filteredModels = useMemo(() => {
        if (!activeSubcat) return []
        let models = activeSubcat.phoneModels
        const q = searchQuery.toLowerCase().trim()

        if (q) {
            models = models.filter(m => m.modelName.toLowerCase().includes(q))
        }

        // Apply Sorting for iPhone category specifically, or globally if desired
        // The user specifically asked for iPhone sorting, but good to apply generally
        return [...models].sort((a, b) => compareModels(a.modelName, b.modelName))
    }, [activeSubcat, searchQuery])

    // Split models into columns (3 columns)
    // We want the sort order to flow down column 1, then column 2... 
    // BUT the grid is rendered row-by-row in CSS grid usually or mapped col-by-col?
    // Current implementation maps columns: `col.map(model => ...)`
    // So if we push to cols[i%3], it fills row 1 (1,2,3), row 2 (4,5,6).
    // This reads Left-to-Right. The user might want Top-to-Bottom per column?
    // "like iPhone 16 Pro Max, iPhone 16 Pro, iPhone 16..." usually implies a list.
    // L-R flow is standard for web grids.
    const modelColumns = useMemo(() => {
        const cols: PhoneModel[][] = [[], [], []]
        filteredModels.forEach((model, i) => {
            cols[i % 3].push(model)
        })
        return cols
    }, [filteredModels])

    return (
        <div className="bg-white dark:bg-neutral-900 relative z-40" data-category-section>
            {/* Top Bar - Brand Scroll */}
            <div className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950">
                <div className="container mx-auto px-4">
                    <div className="relative group">
                        {/* Controls */}
                        {canScrollLeft && (
                            <button onClick={() => scroll('left')} className="absolute left-0 top-0 bottom-0 z-10 w-6 bg-gradient-to-r from-neutral-100 dark:from-neutral-950 via-neutral-100/80 to-transparent flex items-center justify-center">
                                <ChevronLeft className="h-3 w-3 text-black dark:text-white" />
                            </button>
                        )}
                        {canScrollRight && (
                            <button onClick={() => scroll('right')} className="absolute right-0 top-0 bottom-0 z-10 w-6 bg-gradient-to-l from-neutral-100 dark:from-neutral-950 via-neutral-100/80 to-transparent flex items-center justify-center">
                                <ChevronRight className="h-3 w-3 text-black dark:text-white" />
                            </button>
                        )}

                        <div
                            ref={scrollContainerRef}
                            onScroll={checkScrollButtons}
                            className="flex items-center gap-4 overflow-x-auto scrollbar-hide py-0"
                            style={{ scrollbarWidth: 'none' }}
                        >
                            {loading ? (
                                // Skeleton Loading
                                Array.from({ length: 8 }).map((_, i) => (
                                    <div key={i} className="h-6 w-16 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded my-1" />
                                ))
                            ) : (
                                <>
                                    {brands.map(brand => {
                                        const isActive = activeBrandId === brand.id
                                        const isNokia = brand.name.toLowerCase() === 'nokia'

                                        const brandButton = (
                                            <Link
                                                key={brand.id}
                                                href={`/shop?brand=${brand.slug}`}
                                                onMouseEnter={() => {
                                                    setActiveBrandId(brand.id);
                                                    const defaultChild = brand.children.find(c => ['iPhone', 'Galaxy Phones', 'Pixel Phones'].includes(c.name)) || brand.children[0];
                                                    setPinnedSubcatId(defaultChild?.id || null);
                                                    setActiveSubcatId(defaultChild?.id || null);
                                                }}
                                                className={`
                                                    relative py-2 px-4 whitespace-nowrap text-[13px] font-bold transition-all flex-shrink-0 flex items-center gap-1 uppercase tracking-wider
                                                    ${isActive
                                                        ? 'text-red-600 bg-white dark:bg-neutral-900 border-t-2 border-r border-l border-neutral-200 dark:border-neutral-800 border-b-white dark:border-b-neutral-900 -mb-[1px] z-10 rounded-t-md'
                                                        : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                                                    }
                                                `}
                                            >
                                                {brand.name} {isActive && <span className="text-[10px]">▼</span>}
                                            </Link>
                                        )

                                        if (isNokia) {
                                            return (
                                                <div key="injector" className="flex items-center gap-4">
                                                    {['Accessories', 'Tools & Supplies', 'Wholesale Apply', 'Wholesale Portal', 'Repair'].map(item => (
                                                        <Link
                                                            key={item}
                                                            href={`/${item.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                                                            onMouseEnter={() => setActiveBrandId(null)}
                                                            className="text-neutral-600 dark:text-neutral-400 text-[13px] font-bold hover:text-black dark:hover:text-white whitespace-nowrap py-2 px-1 uppercase tracking-wider"
                                                        >
                                                            {item}
                                                        </Link>
                                                    ))}
                                                    {brandButton}
                                                </div>
                                            )
                                        }

                                        return brandButton
                                    })}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mega Menu Dropdown */}
            {activeBrand && (
                <div
                    onMouseLeave={() => setActiveBrandId(null)}
                    className="absolute left-0 right-0 mx-auto max-w-[1400px] top-full mt-0 bg-white dark:bg-neutral-900 border-b border-x border-neutral-200 dark:border-neutral-800 shadow-xl rounded-b-md z-50 animate-in fade-in zoom-in-95 duration-100 origin-top"
                >
                    <div className="px-4">
                        <div className="flex h-[350px]">

                            {/* Left Sidebar: Subcategories (Vertical Tabs) */}
                            <div className="w-48 flex-shrink-0 border-r border-neutral-200 dark:border-neutral-800 flex flex-col gap-0.5 py-2 overflow-y-auto bg-neutral-50/50 dark:bg-neutral-900">
                                <div className="px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
                                    {activeBrand.name} Series
                                </div>
                                {activeBrand.children.map(sub => {
                                    const isPinned = pinnedSubcatId === sub.id
                                    return (
                                        <button
                                            key={sub.id}
                                            onClick={() => handleSubcatClick(sub.id)}
                                            className={`
                                            w-full text-left px-3 py-1.5 text-xs transition-all flex items-center justify-between group relative
                                            ${isPinned
                                                    ? 'bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-500 font-bold border-r-2 border-red-600'
                                                    : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                                                }
                                        `}
                                        >
                                            {isPinned && <Pin className="h-3 w-3 absolute left-1 top-1/2 -translate-y-1/2 text-red-600 opacity-50" />}
                                            <span className={isPinned ? 'pl-2' : ''}>{sub.name}</span>
                                            {isPinned && <X className="h-3 w-3 hover:text-red-800 cursor-pointer text-neutral-400" onClick={(e) => { e.stopPropagation(); setPinnedSubcatId(null); setActiveSubcatId(activeBrand.children[0].id); }} />}
                                        </button>
                                    )
                                })}
                            </div>

                            {/* Center: Model Grid */}
                            <div className="flex-1 px-6 py-4 overflow-y-auto">
                                <div className="flex items-center justify-between mb-4 sticky top-0 bg-white dark:bg-neutral-900 z-10 py-1 border-b border-neutral-100 dark:border-neutral-800">
                                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                                        {activeSubcat?.name} <span className="text-neutral-400 font-normal">Models</span>
                                    </h3>

                                    {/* Search */}
                                    <div className="relative w-48">
                                        <input
                                            type="text"
                                            placeholder="Search..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-2 pr-6 py-1 bg-neutral-100 dark:bg-neutral-800 rounded text-xs focus:outline-none focus:ring-1 focus:ring-red-500 transition-all border border-transparent focus:border-red-500"
                                        />
                                        <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-neutral-400" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-x-8 gap-y-1.5 pb-4">
                                    {modelColumns.map((col, i) => (
                                        <div key={i} className="space-y-1">
                                            {col.map(model => (
                                                <Link
                                                    key={model.id}
                                                    href={`/shop?device=${model.modelSlug || encodeURIComponent(model.modelName)}`}
                                                    onMouseEnter={() => setHoveredModel(model)}
                                                    onMouseLeave={() => setHoveredModel(null)}
                                                    className="group block flex items-center justify-between py-0.5"
                                                >
                                                    <span className="text-[12px] text-neutral-600 dark:text-neutral-300 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors truncate">
                                                        {model.modelName}
                                                    </span>
                                                    {/* New Tag simulation */}
                                                    {(model.modelName.includes('15') || model.modelName.includes('14')) && <span className="text-[9px] bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-1 rounded font-bold">NEW</span>}
                                                </Link>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Panel: Compatibility / Preview */}
                            <div className="w-56 border-l border-neutral-200 dark:border-neutral-800 pl-4 py-4 pr-4 hidden xl:block bg-neutral-50/30 dark:bg-neutral-900">
                                <h4 className="text-[10px] font-bold text-neutral-400 uppercase mb-3">Compatibility Check</h4>
                                {hoveredModel ? (
                                    <div className="animate-in fade-in duration-200">
                                        <h5 className="font-bold text-sm text-neutral-900 dark:text-white mb-1">{hoveredModel.modelName}</h5>
                                        <div className="flex flex-wrap gap-1 mb-3">
                                            {/* Simulated Series Numbers */}
                                            <span className="text-[9px] bg-white dark:bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-700 text-neutral-500 font-mono">A2633</span>
                                            <span className="text-[9px] bg-white dark:bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-700 text-neutral-500 font-mono">A2634</span>
                                        </div>
                                        <div className="text-[10px] text-neutral-500 space-y-1">
                                            <p>✅ LCD Screens</p>
                                            <p>✅ Batteries</p>
                                            <p>✅ Charging Ports</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center text-neutral-300 mt-8">
                                        <span className="text-4xl block mb-2 opacity-20">📱</span>
                                        <p className="text-xs">Hover over a model</p>
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
