// components/homepage/new-arrivals-section.tsx
// New Arrivals Section

import { ProductCard } from '../ui/product-card'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface Product {
    id: string
    name: string
    slug: string
    imageUrl: string
    basePrice: number
    isNew: boolean
}

interface NewArrivalsSectionProps {
    products: Product[]
}

export function NewArrivalsSection({ products }: NewArrivalsSectionProps) {
    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-full">
                ✨ NEW
              </span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">New Arrivals</h2>
                        <p className="text-gray-600 mt-2">Check out our latest products</p>
                    </div>

                    <Link
                        href="/shop/new-arrivals"
                        className="hidden sm:flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all"
                    >
                        View All
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={{
                                ...product,
                                displayPrice: product.basePrice,
                            }}
                            showNewBadge
                        />
                    ))}
                </div>

                {/* Mobile View All Button */}
                <Link
                    href="/shop/new-arrivals"
                    className="sm:hidden flex items-center justify-center gap-2 mt-8 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                >
                    View All New Arrivals
                    <ArrowRight className="w-5 h-5" />
                </Link>
            </div>
        </section>
    )
}
