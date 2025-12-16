// components/homepage/categories-section.tsx
// Dynamic Categories Grid

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

interface Category {
    id: string
    name: string
    slug: string
    imageUrl: string
    productCount: number
}

interface CategoriesSectionProps {
    categories: Category[]
}

export function CategoriesSection({ categories }: CategoriesSectionProps) {
    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
                        <p className="text-gray-600 mt-2">Find what you're looking for</p>
                    </div>
                    <Link
                        href="/shop"
                        className="hidden sm:flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all"
                    >
                        View All
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/shop/${category.slug}`}
                            className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
                        >
                            <div className="relative aspect-square overflow-hidden">
                                <Image
                                    src={category.imageUrl}
                                    alt={category.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition duration-300"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition">
                                    {category.name}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    {category.productCount} products
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Mobile View All Button */}
                <Link
                    href="/shop"
                    className="sm:hidden flex items-center justify-center gap-2 mt-8 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                >
                    View All Categories
                    <ArrowRight className="w-5 h-5" />
                </Link>
            </div>
        </section>
    )
}
