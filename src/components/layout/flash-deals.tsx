'use client'

import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Heart, ShoppingCart, Star} from "lucide-react";

// Flash Deals Products
const featuredDeals = [
    {
        id: 1,
        name: 'iPhone 15 Pro Max',
        image:
            'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800&h=800&fit=crop&q=80',
        originalPrice: 1199,
        salePrice: 1099,
        discount: 8,
        rating: 4.9,
        reviews: 5421,
        badge: 'Hot Deal',
        badgeColor: 'bg-red-500',
    },
    {
        id: 2,
        name: 'AirPods Pro 2nd Gen',
        image:
            'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800&h=800&fit=crop&q=80',
        originalPrice: 249,
        salePrice: 199,
        discount: 20,
        rating: 4.8,
        reviews: 3247,
        badge: 'Best Seller',
        badgeColor: 'bg-blue-500',
    },
    {
        id: 3,
        name: 'Samsung Galaxy Watch 6',
        image:
            'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800&h=800&fit=crop&q=80',
        originalPrice: 399,
        salePrice: 279,
        discount: 30,
        rating: 4.7,
        reviews: 1892,
        badge: 'Limited',
        badgeColor: 'bg-orange-500',
    },
    {
        id: 4,
        name: 'Sony WH-1000XM5',
        image:
            'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800&h=800&fit=crop&q=80',
        originalPrice: 399,
        salePrice: 299,
        discount: 25,
        rating: 4.9,
        reviews: 4123,
        badge: 'Top Rated',
        badgeColor: 'bg-green-500',
    },
]

type ProductType = {
    discount:number
    id:string
    image:string
    name:string
    originalPrice:number
    price: number
    rating: number
    reviews: number
    slug: string,
    salePrice: number,
    badgeColor: string,
    badge: string
}

type FlashDealsType ={
    endsAt:string
    products: ProductType[]
    subtitle: string
    title: string
}

type FlashDealsProps = {
    flashDeals: FlashDealsType
}


export default function FlashDeals({ flashDeals }: FlashDealsProps) {

    return (
        <section className="py-8 md:py-10 lg:py-12 bg-white dark:bg-neutral-950">
        <div className="container px-4 mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 lg:mb-8 gap-3 md:gap-4">
                <div>
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">
                        ⚡ Flash Deals
                    </h2>
                    <p className="text-xs md:text-sm lg:text-base text-neutral-600 dark:text-neutral-400 mt-1">
                        Limited time offers
                    </p>
                </div>
                <Link href="/deals">
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-xs md:text-sm h-8 md:h-9 lg:h-10 border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/80"
                    >
                        View All
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
                {(flashDeals?.products || []).map((product, index) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                        <Card className="group bg-white/95 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm hover:shadow-2xl transition-all overflow-hidden">
                            <div className="relative aspect-square bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                <Badge
                                    className={`absolute top-2 left-2 md:top-3 md:left-3 ${product.badgeColor} text-white text-xs px-2 py-0.5`}
                                >
                                    {product.badge}
                                </Badge>
                                <button className="absolute top-2 right-2 md:top-3 md:right-3 bg-white/90 dark:bg-neutral-900/90 border border-neutral-200/70 dark:border-neutral-700/70 p-1.5 md:p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/40 transition-colors">
                                    <Heart className="h-4 w-4 md:h-5 md:w-5 text-neutral-600 dark:text-neutral-300" />
                                </button>
                                <Badge className="absolute bottom-2 right-2 md:bottom-3 md:right-3 bg-red-500 text-white text-sm md:text-lg font-bold px-2 py-1 md:px-3">
                                    -{product.discount}%
                                </Badge>
                            </div>
                            <CardContent className="p-3 md:p-4">
                                <h3 className="font-semibold text-sm md:text-base lg:text-lg mb-2 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                                    {product.name}
                                </h3>
                                <div className="flex items-center gap-1.5 md:gap-2 mb-2 md:mb-3">
                                    <div className="flex items-center gap-1">
                                        <Star className="h-3 w-3 md:h-4 md:w-4 fill-yellow-400 text-yellow-400" />
                                        <span className="text-xs md:text-sm font-semibold">
                          {product.rating}
                        </span>
                                    </div>
                                    <span className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400">
                        ({product.reviews.toLocaleString()})
                      </span>
                                </div>
                                <div className="flex items-baseline gap-2 mb-2 md:mb-3 lg:mb-4">
                      <span className="text-lg md:text-xl lg:text-2xl font-bold text-blue-600 dark:text-blue-400">
                        ${product.salePrice}
                      </span>
                                    <span className="text-xs md:text-sm text-neutral-500 line-through">
                        ${product.originalPrice}
                      </span>
                                </div>
                                <p className="text-xs md:text-sm text-green-600 dark:text-green-400 font-medium mb-3 md:mb-4">
                                    Save ${product.originalPrice - product.salePrice}
                                </p>
                                <Button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 h-8 md:h-9 lg:h-10 text-xs md:text-sm">
                                    <ShoppingCart className="mr-1.5 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                                    Add to Cart
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
    )
}
