// components/ui/mega-menu.tsx
// Mega Menu Component

'use client'

import Link from 'next/link'
import { ChevronRight, Smartphone, Tablet, Watch, Headphones } from 'lucide-react'

interface Model {
    id: string
    name: string
    slug: string
    isNew: boolean
}

interface Subcategory {
    id: string
    name: string
    slug: string
    icon: string
    models?: Model[]
}

interface Category {
    name: string
    slug: string
    url: string
    subcategories?: Subcategory[]
}

interface MegaMenuProps {
    category: Category
    onClose: () => void
}

const iconMap: Record<string, any> = {
    Smartphone,
    Tablet,
    Watch,
    Headphones,
}

export function MegaMenu({ category, onClose }: MegaMenuProps) {
    return (
        <div className="absolute left-0 right-0 top-full bg-white border-t shadow-xl z-40">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-4 gap-8">
                    {category.subcategories?.map((subcategory) => {
                        const Icon = iconMap[subcategory.icon] || Smartphone

                        return (
                            <div key={subcategory.id}>
                                <Link
                                    href={`/shop/${category.slug}/${subcategory.slug}`}
                                    className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3 hover:text-blue-600 transition"
                                    onClick={onClose}
                                >
                                    <Icon className="w-5 h-5" />
                                    {subcategory.name}
                                </Link>

                                {/* Models */}
                                {subcategory.models && (
                                    <ul className="space-y-2">
                                        {subcategory.models.map((model) => (
                                            <li key={model.id}>
                                                <Link
                                                    href={`/shop/${category.slug}/${subcategory.slug}/${model.slug}`}
                                                    className="flex items-center justify-between text-sm text-gray-600 hover:text-blue-600 transition group"
                                                    onClick={onClose}
                                                >
                          <span className="flex items-center gap-2">
                            {model.name}
                              {model.isNew && (
                                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded">
                                NEW
                              </span>
                              )}
                          </span>
                                                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
                                                </Link>
                                            </li>
                                        ))}

                                        {/* View All Link */}
                                        <li className="pt-2">
                                            <Link
                                                href={`/shop/${category.slug}/${subcategory.slug}`}
                                                className="text-sm text-blue-600 hover:underline font-medium"
                                                onClick={onClose}
                                            >
                                                View all {subcategory.name} →
                                            </Link>
                                        </li>
                                    </ul>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
