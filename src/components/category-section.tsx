'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, X, Pin } from 'lucide-react'

// Compatibility data
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

// Apple Watch data
const APPLE_WATCH_DATA = {
    columns: [
        {
            title: 'Watch',
            items: [
                { name: 'Series Ultra (3rd Gen) (49MM)', link: '/apple/watch/ultra-3-49mm', new: true },
                { name: 'Series 10 (46MM)', link: '/apple/watch/series-10-46mm' },
                { name: 'Series 10 (42MM)', link: '/apple/watch/series-10-42mm' },
                { name: 'Series 9 (45MM)', link: '/apple/watch/series-9-45mm' },
                { name: 'Series 9 (41MM)', link: '/apple/watch/series-9-41mm' },
                { name: 'Series Ultra (2nd Gen) (49MM)', link: '/apple/watch/ultra-2-49mm' },
                { name: 'Series Ultra (1st Gen) (49MM)', link: '/apple/watch/ultra-1-49mm' },
            ],
            viewAll: '/apple/watch/all'
        },
        {
            title: '',
            items: [
                { name: 'Series SE (1st Gen) (40MM)', link: '/apple/watch/se-1-40mm' },
                { name: 'Series 5 (44MM)', link: '/apple/watch/series-5-44mm' },
                { name: 'Series 5 (40MM)', link: '/apple/watch/series-5-40mm' },
                { name: 'Series 4 (44MM)', link: '/apple/watch/series-4-44mm' },
                { name: 'Series 4 (40MM)', link: '/apple/watch/series-4-40mm' },
                { name: 'Series 3 (42MM)', link: '/apple/watch/series-3-42mm' },
                { name: 'Series 3 (38MM)', link: '/apple/watch/series-3-38mm' },
            ]
        },
        {
            title: '',
            items: [
                { name: 'Series 8 (45MM)', link: '/apple/watch/series-8-45mm' },
                { name: 'Series 8 (41MM)', link: '/apple/watch/series-8-41mm' },
                { name: 'Series SE (2nd Gen) (44MM)', link: '/apple/watch/se-2-44mm' },
                { name: 'Series 2 (42MM)', link: '/apple/watch/series-2-42mm' },
                { name: 'Series 2 (38MM)', link: '/apple/watch/series-2-38mm' },
                { name: 'Series 1 (42MM)', link: '/apple/watch/series-1-42mm' },
            ]
        }
    ]
}

// Apple iPad data
const APPLE_IPAD_DATA = {
    columns: [
        {
            title: 'iPad',
            items: [
                { name: 'iPad Pro 13" 8th Gen (2025)', link: '/apple/ipad/pro-13-8gen', new: true },
                { name: 'iPad Pro 11" 8th Gen (2025)', link: '/apple/ipad/pro-11-8gen', new: true },
                { name: 'iPad Pro 13" 7th Gen (2024)', link: '/apple/ipad/pro-13-7gen' },
                { name: 'iPad Pro 12.9" 6th Gen (2022)', link: '/apple/ipad/pro-12-6gen' },
                { name: 'iPad Pro 12.9" 5th Gen (2021)', link: '/apple/ipad/pro-12-5gen' },
                { name: 'iPad Pro 12.9" 4th Gen (2020)', link: '/apple/ipad/pro-12-4gen' },
            ],
            viewAll: '/apple/ipad/all'
        },
        {
            title: '',
            items: [
                { name: 'iPad Pro 12.9" 3rd Gen (2018)', link: '/apple/ipad/pro-12-3gen' },
                { name: 'iPad Pro 12.9" 2nd Gen (2017)', link: '/apple/ipad/pro-12-2gen' },
                { name: 'iPad Pro 12.9" 1st Gen (2015)', link: '/apple/ipad/pro-12-1gen' },
                { name: 'iPad Air 6th Gen (2024)', link: '/apple/ipad/air-6gen' },
                { name: 'iPad Air 5th Gen (2022)', link: '/apple/ipad/air-5gen' },
                { name: 'iPad Air 4th Gen (2020)', link: '/apple/ipad/air-4gen' },
            ]
        },
        {
            title: '',
            items: [
                { name: 'iPad 11th Gen (2025)', link: '/apple/ipad/ipad-11gen', new: true },
                { name: 'iPad 10th Gen (2022)', link: '/apple/ipad/ipad-10gen' },
                { name: 'iPad 9th Gen (2021)', link: '/apple/ipad/ipad-9gen' },
                { name: 'iPad Mini 7th Gen (2024)', link: '/apple/ipad/mini-7gen' },
                { name: 'iPad Mini 6th Gen (2021)', link: '/apple/ipad/mini-6gen' },
                { name: 'iPad Mini 5th Gen (2019)', link: '/apple/ipad/mini-5gen' },
            ]
        }
    ]
}

// Apple iPhone data
const APPLE_IPHONE_DATA = {
    columns: [
        {
            title: 'iPhone',
            items: [
                { name: 'All iPhone LCDs', link: '/apple/iphone/all-lcds' },
                { name: 'iPhone Air', link: '/apple/iphone/iphone-air', new: true },
                { name: 'iPhone 17 Pro Max', link: '/apple/iphone/17-pro-max', new: true },
                { name: 'iPhone 17 Pro', link: '/apple/iphone/17-pro', new: true },
                { name: 'iPhone 17', link: '/apple/iphone/17', new: true },
                { name: 'iPhone 16e', link: '/apple/iphone/16e' },
                { name: 'iPhone 16 Pro Max', link: '/apple/iphone/16-pro-max' },
                { name: 'iPhone 16 Pro', link: '/apple/iphone/16-pro' },
            ],
            viewAll: '/apple/iphone/all'
        },
        {
            title: '',
            items: [
                { name: 'iPhone 14 Plus', link: '/apple/iphone/14-plus' },
                { name: 'iPhone 14', link: '/apple/iphone/14' },
                { name: 'iPhone 13 Pro Max', link: '/apple/iphone/13-pro-max' },
                { name: 'iPhone 13 Pro', link: '/apple/iphone/13-pro' },
                { name: 'iPhone 13', link: '/apple/iphone/13' },
                { name: 'iPhone 13 Mini', link: '/apple/iphone/13-mini' },
                { name: 'iPhone SE (2022)', link: '/apple/iphone/se-2022' },
                { name: 'iPhone 12 Pro Max', link: '/apple/iphone/12-pro-max' },
            ]
        },
        {
            title: '',
            items: [
                { name: 'iPhone XR', link: '/apple/iphone/xr' },
                { name: 'iPhone X', link: '/apple/iphone/x' },
                { name: 'iPhone SE (2020)', link: '/apple/iphone/se-2020' },
                { name: 'iPhone 8 Plus', link: '/apple/iphone/8-plus' },
                { name: 'iPhone 8', link: '/apple/iphone/8' },
                { name: 'iPhone 7 Plus', link: '/apple/iphone/7-plus' },
                { name: 'iPhone 7', link: '/apple/iphone/7' },
                { name: 'iPhone 6S Plus', link: '/apple/iphone/6s-plus' },
            ]
        }
    ]
}

// Apple iPod data
const APPLE_IPOD_DATA = {
    columns: [
        {
            title: 'iPod',
            items: [
                { name: 'iPod Touch 7', link: '/apple/ipod/touch-7' },
                { name: 'iPod Touch 6', link: '/apple/ipod/touch-6' },
                { name: 'iPod Touch 5', link: '/apple/ipod/touch-5' },
                { name: 'iPod Touch 4', link: '/apple/ipod/touch-4' },
                { name: 'iPod Nano 7', link: '/apple/ipod/nano-7' },
            ],
            viewAll: '/apple/ipod/all'
        },
        {
            title: '',
            items: [
                { name: 'iPod Classic', link: '/apple/ipod/classic' },
                { name: 'iPod Shuffle', link: '/apple/ipod/shuffle' },
                { name: 'iPod Mini', link: '/apple/ipod/mini' },
            ]
        },
        {
            title: '',
            items: []
        }
    ]
}

// Apple AirPods data
const APPLE_AIRPODS_DATA = {
    columns: [
        {
            title: 'AirPods',
            items: [
                { name: 'AirPods Pro 1st Gen (2019)', link: '/apple/airpods/pro-1gen' },
                { name: 'AirPods Pro 2nd Gen (2022)', link: '/apple/airpods/pro-2gen' },
                { name: 'AirPods 3rd Gen (2021)', link: '/apple/airpods/3gen' },
                { name: 'AirPods 2nd Gen (2019)', link: '/apple/airpods/2gen' },
                { name: 'AirPods 1st Gen (2016)', link: '/apple/airpods/1gen' },
                { name: 'AirPods Max 1st Gen (2020)', link: '/apple/airpods/max-1gen' },
            ],
            viewAll: '/apple/airpods/all'
        },
        {
            title: '',
            items: []
        },
        {
            title: '',
            items: []
        }
    ]
}

// Map subcategories to their data
const APPLE_SUBCATEGORY_DATA: {[key: string]: any} = {
    'iPhone': APPLE_IPHONE_DATA,
    'iPad': APPLE_IPAD_DATA,
    'Watch': APPLE_WATCH_DATA,
    'iPod': APPLE_IPOD_DATA,
    'AirPods': APPLE_AIRPODS_DATA,
    // Default data for others
    'iMac': { columns: [{ title: 'iMac', items: [{ name: 'iMac 24" M4 (2024)', link: '/apple/imac/24-m4', new: true }], viewAll: '/apple/imac/all' }, { title: '', items: [] }, { title: '', items: [] }] },
    'Mac Mini': { columns: [{ title: 'Mac Mini', items: [{ name: 'Mac Mini M4 (2024)', link: '/apple/mac-mini/m4', new: true }], viewAll: '/apple/mac-mini/all' }, { title: '', items: [] }, { title: '', items: [] }] },
    'Mac Pro': { columns: [{ title: 'Mac Pro', items: [{ name: 'Mac Pro M2 Ultra (2023)', link: '/apple/mac-pro/m2-ultra' }], viewAll: '/apple/mac-pro/all' }, { title: '', items: [] }, { title: '', items: [] }] },
    'MacBook Pro': { columns: [{ title: 'MacBook Pro', items: [{ name: 'MacBook Pro 14" M4 (2024)', link: '/apple/macbook-pro/14-m4', new: true }], viewAll: '/apple/macbook-pro/all' }, { title: '', items: [] }, { title: '', items: [] }] },
    'MacBook Air': { columns: [{ title: 'MacBook Air', items: [{ name: 'MacBook Air 15" M3 (2024)', link: '/apple/macbook-air/15-m3' }], viewAll: '/apple/macbook-air/all' }, { title: '', items: [] }, { title: '', items: [] }] },
    'MacBook': { columns: [{ title: 'MacBook', items: [{ name: 'MacBook 12" (2017)', link: '/apple/macbook/12-2017' }], viewAll: '/apple/macbook/all' }, { title: '', items: [] }, { title: '', items: [] }] },
    'Mac Studio': { columns: [{ title: 'Mac Studio', items: [{ name: 'Mac Studio M2 Max (2023)', link: '/apple/mac-studio/m2-max' }], viewAll: '/apple/mac-studio/all' }, { title: '', items: [] }, { title: '', items: [] }] },
    'Studio Display': { columns: [{ title: 'Studio Display', items: [{ name: 'Studio Display 27" (2022)', link: '/apple/studio-display/27' }], viewAll: '/apple/studio-display/all' }, { title: '', items: [] }, { title: '', items: [] }] },
    'Apollo SSDs': { columns: [{ title: 'Apollo SSDs', items: [{ name: 'Apollo SSD 1TB', link: '/apple/apollo-ssd/1tb' }], viewAll: '/apple/apollo-ssd/all' }, { title: '', items: [] }, { title: '', items: [] }] },
}

const SAMSUNG_DATA = {
    subcategories: ['S Series', 'Note Series', 'A Series', 'Z Series'],
    'S Series': {
        columns: [
            {
                title: 'S Series',
                items: [
                    { name: 'Galaxy S25 Ultra', link: '/samsung/s-series/s25-ultra' },
                    { name: 'Galaxy S25 Plus', link: '/samsung/s-series/s25-plus' },
                    { name: 'Galaxy S25', link: '/samsung/s-series/s25' },
                ],
                viewAll: '/samsung/s-series/all'
            },
            { title: '', items: [] },
            { title: '', items: [] }
        ]
    }
}

const BRANDS_DATA: any = {
    Apple: {
        subcategories: ['iPhone', 'iPad', 'Watch', 'iPod', 'AirPods', 'iMac', 'Mac Mini', 'Mac Pro', 'MacBook Pro', 'MacBook Air', 'MacBook', 'Mac Studio', 'Studio Display', 'Apollo SSDs'],
    },
    Samsung: SAMSUNG_DATA,
    Motorola: { subcategories: ['Moto G Series', 'Razr Series'] },
    Google: { subcategories: ['Pixel', 'Pixelbook'] }
}

export function CategorySection() {
    const [hoveredBrand, setHoveredBrand] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [pinnedSubcategory, setPinnedSubcategory] = useState<{[key: string]: string | null}>({})
    const [activeSubcategory, setActiveSubcategory] = useState<{[key: string]: string}>({
        'Apple': 'iPhone',
        'Samsung': 'S Series',
        'Motorola': 'Moto G Series',
        'Google': 'Pixel'
    })
    const [hoveredModel, setHoveredModel] = useState<string | null>(null)

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

    // Get current data based on active subcategory
    const getCurrentData = () => {
        if (!hoveredBrand || !['Apple', 'Samsung', 'Motorola', 'Google'].includes(hoveredBrand)) {
            return null
        }

        const currentSubcat = activeSubcategory[hoveredBrand]

        if (hoveredBrand === 'Apple') {
            return APPLE_SUBCATEGORY_DATA[currentSubcat] || APPLE_IPHONE_DATA
        }

        if (hoveredBrand === 'Samsung') {
            return SAMSUNG_DATA['S Series']
        }

        return null
    }

    const currentData = getCurrentData()

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
                        <Link href="/shop">
                            <span className="text-neutral-600 dark:text-neutral-400 relative py-3 px-1 text-sm font-medium">Shop</span>
                        </Link>
                        <Link href="/wholesale/apply">
                            <span className="text-neutral-600 dark:text-neutral-400 relative py-3 px-1 text-sm font-medium">Wholesale Apply</span>
                        </Link>
                        <Link href="/wholesale">
                            <span className=" text-neutral-600 dark:text-neutral-400relative py-3 px-1 text-sm font-medium">Wholesale Portal</span>
                        </Link>
                        <Link href="/repairs">
                            <span className=" text-neutral-600 dark:text-neutral-400 relative py-3 px-1 text-sm font-medium">Repair</span>
                        </Link>
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

                    {/* Main Content */}
                    <div className="container mx-auto px-4 py-4">
                        <div className="grid grid-cols-[200px_1fr_260px] gap-5">

                            {/* Left Sidebar */}
                            <div className="space-y-2">
                                {/* Pinned Section */}
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

                                {/* All Subcategories */}
                                <div className="space-y-0.5">
                                    {BRANDS_DATA[hoveredBrand].subcategories.map((subcat: string) => {
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
                                </div>
                            </div>

                            {/* Middle Content Area */}
                            <div className="grid grid-cols-3 gap-4">
                                {currentData && currentData.columns.map((column: any, index: number) => (
                                    <div key={index}>
                                        {column.title && (
                                            <h3 className="text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 px-3 py-1 mb-2 rounded">
                                                {column.title}
                                            </h3>
                                        )}
                                        <ul className="space-y-0.5">
                                            {column.items.map((item: any) => (
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
