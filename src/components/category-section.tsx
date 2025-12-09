'use client'

import { useState } from 'react'
import { Search, X, Pin } from 'lucide-react'
import Link from 'next/link'

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

// Apple Watch data - UPDATED WITH SHOP LINKS
const APPLE_WATCH_DATA = {
    columns: [
        {
            title: 'Watch',
            items: [
                { name: 'Series Ultra (3rd Gen) (49MM)', link: '/shop?category=apple&device=Apple+Watch+Ultra+3', new: true },
                { name: 'Series 10 (46MM)', link: '/shop?category=apple&device=Apple+Watch+Series+10' },
                { name: 'Series 10 (42MM)', link: '/shop?category=apple&device=Apple+Watch+Series+10' },
                { name: 'Series 9 (45MM)', link: '/shop?category=apple&device=Apple+Watch+Series+9' },
                { name: 'Series 9 (41MM)', link: '/shop?category=apple&device=Apple+Watch+Series+9' },
                { name: 'Series Ultra (2nd Gen) (49MM)', link: '/shop?category=apple&device=Apple+Watch+Ultra+2' },
                { name: 'Series Ultra (1st Gen) (49MM)', link: '/shop?category=apple&device=Apple+Watch+Ultra' },
            ],
            viewAll: '/shop?category=apple&type=Watch'
        },
        {
            title: '',
            items: [
                { name: 'Series SE (1st Gen) (40MM)', link: '/shop?category=apple&device=Apple+Watch+SE' },
                { name: 'Series 5 (44MM)', link: '/shop?category=apple&device=Apple+Watch+Series+5' },
                { name: 'Series 5 (40MM)', link: '/shop?category=apple&device=Apple+Watch+Series+5' },
                { name: 'Series 4 (44MM)', link: '/shop?category=apple&device=Apple+Watch+Series+4' },
                { name: 'Series 4 (40MM)', link: '/shop?category=apple&device=Apple+Watch+Series+4' },
                { name: 'Series 3 (42MM)', link: '/shop?category=apple&device=Apple+Watch+Series+3' },
                { name: 'Series 3 (38MM)', link: '/shop?category=apple&device=Apple+Watch+Series+3' },
            ]
        },
        {
            title: '',
            items: [
                { name: 'Series 8 (45MM)', link: '/shop?category=apple&device=Apple+Watch+Series+8' },
                { name: 'Series 8 (41MM)', link: '/shop?category=apple&device=Apple+Watch+Series+8' },
                { name: 'Series SE (2nd Gen) (44MM)', link: '/shop?category=apple&device=Apple+Watch+SE+2' },
                { name: 'Series 2 (42MM)', link: '/shop?category=apple&device=Apple+Watch+Series+2' },
                { name: 'Series 2 (38MM)', link: '/shop?category=apple&device=Apple+Watch+Series+2' },
                { name: 'Series 1 (42MM)', link: '/shop?category=apple&device=Apple+Watch+Series+1' },
            ]
        }
    ]
}

// Apple iPad data - UPDATED WITH SHOP LINKS
const APPLE_IPAD_DATA = {
    columns: [
        {
            title: 'iPad',
            items: [
                { name: 'iPad Pro 13" 8th Gen (2025)', link: '/shop?category=apple&device=iPad+Pro+13+8th+Gen', new: true },
                { name: 'iPad Pro 11" 8th Gen (2025)', link: '/shop?category=apple&device=iPad+Pro+11+8th+Gen', new: true },
                { name: 'iPad Pro 13" 7th Gen (2024)', link: '/shop?category=apple&device=iPad+Pro+13+7th+Gen' },
                { name: 'iPad Pro 12.9" 6th Gen (2022)', link: '/shop?category=apple&device=iPad+Pro+12.9+6th+Gen' },
                { name: 'iPad Pro 12.9" 5th Gen (2021)', link: '/shop?category=apple&device=iPad+Pro+12.9+5th+Gen' },
                { name: 'iPad Pro 12.9" 4th Gen (2020)', link: '/shop?category=apple&device=iPad+Pro+12.9+4th+Gen' },
            ],
            viewAll: '/shop?category=apple&type=iPad'
        },
        {
            title: '',
            items: [
                { name: 'iPad Pro 12.9" 3rd Gen (2018)', link: '/shop?category=apple&device=iPad+Pro+12.9+3rd+Gen' },
                { name: 'iPad Pro 12.9" 2nd Gen (2017)', link: '/shop?category=apple&device=iPad+Pro+12.9+2nd+Gen' },
                { name: 'iPad Pro 12.9" 1st Gen (2015)', link: '/shop?category=apple&device=iPad+Pro+12.9+1st+Gen' },
                { name: 'iPad Air 6th Gen (2024)', link: '/shop?category=apple&device=iPad+Air+6th+Gen' },
                { name: 'iPad Air 5th Gen (2022)', link: '/shop?category=apple&device=iPad+Air+5th+Gen' },
                { name: 'iPad Air 4th Gen (2020)', link: '/shop?category=apple&device=iPad+Air+4th+Gen' },
            ]
        },
        {
            title: '',
            items: [
                { name: 'iPad 11th Gen (2025)', link: '/shop?category=apple&device=iPad+11th+Gen', new: true },
                { name: 'iPad 10th Gen (2022)', link: '/shop?category=apple&device=iPad+10th+Gen' },
                { name: 'iPad 9th Gen (2021)', link: '/shop?category=apple&device=iPad+9th+Gen' },
                { name: 'iPad Mini 7th Gen (2024)', link: '/shop?category=apple&device=iPad+Mini+7th+Gen' },
                { name: 'iPad Mini 6th Gen (2021)', link: '/shop?category=apple&device=iPad+Mini+6th+Gen' },
                { name: 'iPad Mini 5th Gen (2019)', link: '/shop?category=apple&device=iPad+Mini+5th+Gen' },
            ]
        }
    ]
}

// Apple iPhone data - UPDATED WITH SHOP LINKS
const APPLE_IPHONE_DATA = {
    columns: [
        {
            title: 'iPhone',
            items: [
                { name: 'All iPhone LCDs', link: '/shop?category=apple&type=Replacement+Parts&subCategory=LCD' },
                { name: 'iPhone Air', link: '/shop?category=apple&device=iPhone+Air', new: true },
                { name: 'iPhone 17 Pro Max', link: '/shop?category=apple&device=iPhone+17+Pro+Max', new: true },
                { name: 'iPhone 17 Pro', link: '/shop?category=apple&device=iPhone+17+Pro', new: true },
                { name: 'iPhone 17', link: '/shop?category=apple&device=iPhone+17', new: true },
                { name: 'iPhone 16e', link: '/shop?category=apple&device=iPhone+16e' },
                { name: 'iPhone 16 Pro Max', link: '/shop?category=apple&device=iPhone+16+Pro+Max' },
                { name: 'iPhone 16 Pro', link: '/shop?category=apple&device=iPhone+16+Pro' },
            ],
            viewAll: '/shop?category=apple&type=iPhone'
        },
        {
            title: '',
            items: [
                { name: 'iPhone 14 Plus', link: '/shop?category=apple&device=iPhone+14+Plus' },
                { name: 'iPhone 14', link: '/shop?category=apple&device=iPhone+14' },
                { name: 'iPhone 13 Pro Max', link: '/shop?category=apple&device=iPhone+13+Pro+Max' },
                { name: 'iPhone 13 Pro', link: '/shop?category=apple&device=iPhone+13+Pro' },
                { name: 'iPhone 13', link: '/shop?category=apple&device=iPhone+13' },
                { name: 'iPhone 13 Mini', link: '/shop?category=apple&device=iPhone+13+Mini' },
                { name: 'iPhone SE (2022)', link: '/shop?category=apple&device=iPhone+SE+2022' },
                { name: 'iPhone 12 Pro Max', link: '/shop?category=apple&device=iPhone+12+Pro+Max' },
            ]
        },
        {
            title: '',
            items: [
                { name: 'iPhone XR', link: '/shop?category=apple&device=iPhone+XR' },
                { name: 'iPhone X', link: '/shop?category=apple&device=iPhone+X' },
                { name: 'iPhone SE (2020)', link: '/shop?category=apple&device=iPhone+SE+2020' },
                { name: 'iPhone 8 Plus', link: '/shop?category=apple&device=iPhone+8+Plus' },
                { name: 'iPhone 8', link: '/shop?category=apple&device=iPhone+8' },
                { name: 'iPhone 7 Plus', link: '/shop?category=apple&device=iPhone+7+Plus' },
                { name: 'iPhone 7', link: '/shop?category=apple&device=iPhone+7' },
                { name: 'iPhone 6S Plus', link: '/shop?category=apple&device=iPhone+6S+Plus' },
            ]
        }
    ]
}

// Apple iPod data - UPDATED WITH SHOP LINKS
const APPLE_IPOD_DATA = {
    columns: [
        {
            title: 'iPod',
            items: [
                { name: 'iPod Touch 7', link: '/shop?category=apple&device=iPod+Touch+7' },
                { name: 'iPod Touch 6', link: '/shop?category=apple&device=iPod+Touch+6' },
                { name: 'iPod Touch 5', link: '/shop?category=apple&device=iPod+Touch+5' },
                { name: 'iPod Touch 4', link: '/shop?category=apple&device=iPod+Touch+4' },
                { name: 'iPod Nano 7', link: '/shop?category=apple&device=iPod+Nano+7' },
            ],
            viewAll: '/shop?category=apple&type=iPod'
        },
        {
            title: '',
            items: [
                { name: 'iPod Classic', link: '/shop?category=apple&device=iPod+Classic' },
                { name: 'iPod Shuffle', link: '/shop?category=apple&device=iPod+Shuffle' },
                { name: 'iPod Mini', link: '/shop?category=apple&device=iPod+Mini' },
            ]
        },
        {
            title: '',
            items: []
        }
    ]
}

// Apple AirPods data - UPDATED WITH SHOP LINKS
const APPLE_AIRPODS_DATA = {
    columns: [
        {
            title: 'AirPods',
            items: [
                { name: 'AirPods Pro 1st Gen (2019)', link: '/shop?category=apple&device=AirPods+Pro+1st+Gen' },
                { name: 'AirPods Pro 2nd Gen (2022)', link: '/shop?category=apple&device=AirPods+Pro+2nd+Gen' },
                { name: 'AirPods 3rd Gen (2021)', link: '/shop?category=apple&device=AirPods+3rd+Gen' },
                { name: 'AirPods 2nd Gen (2019)', link: '/shop?category=apple&device=AirPods+2nd+Gen' },
                { name: 'AirPods 1st Gen (2016)', link: '/shop?category=apple&device=AirPods+1st+Gen' },
                { name: 'AirPods Max 1st Gen (2020)', link: '/shop?category=apple&device=AirPods+Max' },
            ],
            viewAll: '/shop?category=apple&type=AirPods'
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
    'iMac': { columns: [{ title: 'iMac', items: [{ name: 'iMac 24" M4 (2024)', link: '/shop?category=apple&device=iMac+24+M4', new: true }], viewAll: '/shop?category=apple&type=iMac' }, { title: '', items: [] }, { title: '', items: [] }] },
    'Mac Mini': { columns: [{ title: 'Mac Mini', items: [{ name: 'Mac Mini M4 (2024)', link: '/shop?category=apple&device=Mac+Mini+M4', new: true }], viewAll: '/shop?category=apple&type=Mac+Mini' }, { title: '', items: [] }, { title: '', items: [] }] },
    'Mac Pro': { columns: [{ title: 'Mac Pro', items: [{ name: 'Mac Pro M2 Ultra (2023)', link: '/shop?category=apple&device=Mac+Pro+M2+Ultra' }], viewAll: '/shop?category=apple&type=Mac+Pro' }, { title: '', items: [] }, { title: '', items: [] }] },
    'MacBook Pro': { columns: [{ title: 'MacBook Pro', items: [{ name: 'MacBook Pro 14" M4 (2024)', link: '/shop?category=apple&device=MacBook+Pro+14+M4', new: true }], viewAll: '/shop?category=apple&type=MacBook+Pro' }, { title: '', items: [] }, { title: '', items: [] }] },
    'MacBook Air': { columns: [{ title: 'MacBook Air', items: [{ name: 'MacBook Air 15" M3 (2024)', link: '/shop?category=apple&device=MacBook+Air+15+M3' }], viewAll: '/shop?category=apple&type=MacBook+Air' }, { title: '', items: [] }, { title: '', items: [] }] },
    'MacBook': { columns: [{ title: 'MacBook', items: [{ name: 'MacBook 12" (2017)', link: '/shop?category=apple&device=MacBook+12' }], viewAll: '/shop?category=apple&type=MacBook' }, { title: '', items: [] }, { title: '', items: [] }] },
    'Mac Studio': { columns: [{ title: 'Mac Studio', items: [{ name: 'Mac Studio M2 Max (2023)', link: '/shop?category=apple&device=Mac+Studio+M2+Max' }], viewAll: '/shop?category=apple&type=Mac+Studio' }, { title: '', items: [] }, { title: '', items: [] }] },
    'Studio Display': { columns: [{ title: 'Studio Display', items: [{ name: 'Studio Display 27" (2022)', link: '/shop?category=apple&device=Studio+Display+27' }], viewAll: '/shop?category=apple&type=Studio+Display' }, { title: '', items: [] }, { title: '', items: [] }] },
    'Apollo SSDs': { columns: [{ title: 'Apollo SSDs', items: [{ name: 'Apollo SSD 1TB', link: '/shop?category=apple&device=Apollo+SSD+1TB' }], viewAll: '/shop?category=apple&type=Apollo+SSDs' }, { title: '', items: [] }, { title: '', items: [] }] },
}

// Samsung data - UPDATED WITH SHOP LINKS
const SAMSUNG_DATA = {
    subcategories: ['S Series', 'Note Series', 'A Series', 'Z Series'],
    'S Series': {
        columns: [
            {
                title: 'S Series',
                items: [
                    { name: 'Galaxy S25 Ultra', link: '/shop?category=samsung&device=Galaxy+S25+Ultra', new: true },
                    { name: 'Galaxy S25 Plus', link: '/shop?category=samsung&device=Galaxy+S25+Plus', new: true },
                    { name: 'Galaxy S25', link: '/shop?category=samsung&device=Galaxy+S25', new: true },
                    { name: 'Galaxy S24 Ultra', link: '/shop?category=samsung&device=Galaxy+S24+Ultra' },
                    { name: 'Galaxy S24 Plus', link: '/shop?category=samsung&device=Galaxy+S24+Plus' },
                    { name: 'Galaxy S24', link: '/shop?category=samsung&device=Galaxy+S24' },
                ],
                viewAll: '/shop?category=samsung&type=S+Series'
            },
            { title: '', items: [] },
            { title: '', items: [] }
        ]
    },
    'Note Series': {
        columns: [
            {
                title: 'Note Series',
                items: [
                    { name: 'Galaxy Note 20 Ultra', link: '/shop?category=samsung&device=Galaxy+Note+20+Ultra' },
                    { name: 'Galaxy Note 20', link: '/shop?category=samsung&device=Galaxy+Note+20' },
                    { name: 'Galaxy Note 10 Plus', link: '/shop?category=samsung&device=Galaxy+Note+10+Plus' },
                ],
                viewAll: '/shop?category=samsung&type=Note+Series'
            },
            { title: '', items: [] },
            { title: '', items: [] }
        ]
    },
    'A Series': {
        columns: [
            {
                title: 'A Series',
                items: [
                    { name: 'Galaxy A54', link: '/shop?category=samsung&device=Galaxy+A54' },
                    { name: 'Galaxy A34', link: '/shop?category=samsung&device=Galaxy+A34' },
                    { name: 'Galaxy A14', link: '/shop?category=samsung&device=Galaxy+A14' },
                ],
                viewAll: '/shop?category=samsung&type=A+Series'
            },
            { title: '', items: [] },
            { title: '', items: [] }
        ]
    },
    'Z Series': {
        columns: [
            {
                title: 'Z Series',
                items: [
                    { name: 'Galaxy Z Fold 6', link: '/shop?category=samsung&device=Galaxy+Z+Fold+6', new: true },
                    { name: 'Galaxy Z Flip 6', link: '/shop?category=samsung&device=Galaxy+Z+Flip+6', new: true },
                    { name: 'Galaxy Z Fold 5', link: '/shop?category=samsung&device=Galaxy+Z+Fold+5' },
                    { name: 'Galaxy Z Flip 5', link: '/shop?category=samsung&device=Galaxy+Z+Flip+5' },
                ],
                viewAll: '/shop?category=samsung&type=Z+Series'
            },
            { title: '', items: [] },
            { title: '', items: [] }
        ]
    }
}

// Motorola & Google data - UPDATED WITH SHOP LINKS
const MOTOROLA_DATA = {
    subcategories: ['Moto G Series', 'Razr Series', 'Edge Series'],
    'Moto G Series': {
        columns: [
            {
                title: 'Moto G Series',
                items: [
                    { name: 'Moto G Power (2024)', link: '/shop?category=motorola&device=Moto+G+Power+2024' },
                    { name: 'Moto G Stylus (2024)', link: '/shop?category=motorola&device=Moto+G+Stylus+2024' },
                ],
                viewAll: '/shop?category=motorola&type=Moto+G'
            },
            { title: '', items: [] },
            { title: '', items: [] }
        ]
    },
    'Razr Series': {
        columns: [
            {
                title: 'Razr Series',
                items: [
                    { name: 'Razr+ (2024)', link: '/shop?category=motorola&device=Razr+Plus+2024', new: true },
                    { name: 'Razr (2024)', link: '/shop?category=motorola&device=Razr+2024' },
                ],
                viewAll: '/shop?category=motorola&type=Razr'
            },
            { title: '', items: [] },
            { title: '', items: [] }
        ]
    },
    'Edge Series': {
        columns: [
            {
                title: 'Edge Series',
                items: [
                    { name: 'Edge 50 Pro', link: '/shop?category=motorola&device=Moto+Edge+50+Pro' },
                    { name: 'Edge 40', link: '/shop?category=motorola&device=Moto+Edge+40' },
                ],
                viewAll: '/shop?category=motorola&type=Edge'
            },
            { title: '', items: [] },
            { title: '', items: [] }
        ]
    }
}

const GOOGLE_DATA = {
    subcategories: ['Pixel', 'Pixelbook'],
    'Pixel': {
        columns: [
            {
                title: 'Pixel',
                items: [
                    { name: 'Pixel 9 Pro XL', link: '/shop?category=google&device=Pixel+9+Pro+XL', new: true },
                    { name: 'Pixel 9 Pro', link: '/shop?category=google&device=Pixel+9+Pro', new: true },
                    { name: 'Pixel 9', link: '/shop?category=google&device=Pixel+9', new: true },
                    { name: 'Pixel 8 Pro', link: '/shop?category=google&device=Pixel+8+Pro' },
                    { name: 'Pixel 8', link: '/shop?category=google&device=Pixel+8' },
                ],
                viewAll: '/shop?category=google&type=Pixel'
            },
            { title: '', items: [] },
            { title: '', items: [] }
        ]
    },
    'Pixelbook': {
        columns: [
            {
                title: 'Pixelbook',
                items: [
                    { name: 'Pixelbook Go', link: '/shop?category=google&device=Pixelbook+Go' },
                ],
                viewAll: '/shop?category=google&type=Pixelbook'
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
    Motorola: MOTOROLA_DATA,
    Google: GOOGLE_DATA
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
            return SAMSUNG_DATA[currentSubcat as keyof typeof SAMSUNG_DATA] || SAMSUNG_DATA['S Series']
        }

        if (hoveredBrand === 'Motorola') {
            return MOTOROLA_DATA[currentSubcat as keyof typeof MOTOROLA_DATA] || MOTOROLA_DATA['Moto G Series']
        }

        if (hoveredBrand === 'Google') {
            return GOOGLE_DATA[currentSubcat as keyof typeof GOOGLE_DATA] || GOOGLE_DATA['Pixel']
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
                            <span className="text-neutral-600 dark:text-neutral-400 relative py-3 px-1 text-sm font-medium hover:text-black dark:hover:text-white">Shop</span>
                        </Link>
                        <Link href="/wholesale/apply">
                            <span className="text-neutral-600 dark:text-neutral-400 relative py-3 px-1 text-sm font-medium hover:text-black dark:hover:text-white">Wholesale Apply</span>
                        </Link>
                        <Link href="/wholesale">
                            <span className="text-neutral-600 dark:text-neutral-400 relative py-3 px-1 text-sm font-medium hover:text-black dark:hover:text-white">Wholesale Portal</span>
                        </Link>
                        <Link href="/repairs">
                            <span className="text-neutral-600 dark:text-neutral-400 relative py-3 px-1 text-sm font-medium hover:text-black dark:hover:text-white">Repair</span>
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
