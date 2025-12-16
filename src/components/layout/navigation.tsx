// components/layout/navigation.tsx
// Dynamic Navigation with Mega Menu

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { MegaMenu } from '../ui/mega-menu'

interface Category {
    id: string
    name: string
    slug: string
    url: string
    isMegaMenu: boolean
    subcategories?: Subcategory[]
}

interface Subcategory {
    id: string
    name: string
    slug: string
    icon: string
    models?: Model[]
}

interface Model {
    id: string
    name: string
    slug: string
    isNew: boolean
}

interface NavigationData {
    categories: Category[]
    customItems: Array<{ name: string; url: string }>
}

export function DynamicNavigation() {
    const [navData, setNavData] = useState<NavigationData | null>(null)
    const [loading, setLoading] = useState(true)
    const [activeCategory, setActiveCategory] = useState<string | null>(null)

    useEffect(() => {
        fetchNavigation()
    }, [])

    const fetchNavigation = async () => {
        try {
            const response = await fetch('/api/navigation')
            const { data } = await response.json()
            setNavData(data)
        } catch (error) {
            console.error('Failed to fetch navigation:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <nav className="border-t border-b">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-8 h-12 overflow-x-auto">
                        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                    </div>
                </div>
            </nav>
        )
    }

    return (
        <nav className="border-t border-b relative">
            <div className="container mx-auto px-4">
                <div className="flex items-center gap-8 h-12 overflow-x-auto scrollbar-hide">
                    {/* Categories */}
                    {navData?.categories.map((category) => (
                        <div
                            key={category.id}
                            className="relative"
                            onMouseEnter={() => category.isMegaMenu && setActiveCategory(category.id)}
                            onMouseLeave={() => setActiveCategory(null)}
                        >
                            <Link
                                href={category.url}
                                className="flex items-center gap-1 text-sm font-medium hover:text-blue-600 transition whitespace-nowrap"
                            >
                                {category.name}
                                {category.isMegaMenu && (
                                    <ChevronDown className="w-4 h-4" />
                                )}
                            </Link>

                            {/* Mega Menu */}
                            {category.isMegaMenu && activeCategory === category.id && (
                                <MegaMenu
                                    category={category}
                                    onClose={() => setActiveCategory(null)}
                                />
                            )}
                        </div>
                    ))}

                    {/* Custom Items */}
                    {navData?.customItems.map((item, index) => (
                        <Link
                            key={index}
                            href={item.url}
                            className="text-sm font-medium hover:text-blue-600 transition whitespace-nowrap"
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    )
}
