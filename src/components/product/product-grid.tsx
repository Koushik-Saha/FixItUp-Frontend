import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Star } from "lucide-react";

// Flexible Product Type compatible with what API returns
type Product = {
    id: string
    name: string
    slug: string
    image: string
    price: number
    originalPrice?: number
    rating?: number
    reviews?: number
    isNew?: boolean
    discount?: number
    brand?: string
    deviceModel?: string
}

type ProductGridProps = {
    title?: string
    products: Product[]
}

export default function ProductGrid({ title, products }: ProductGridProps) {
    if (!products || products.length === 0) return null;

    return (
        <section className="py-8 md:py-10 lg:py-12 bg-white dark:bg-neutral-950">
            <div className="container px-4 mx-auto">
                {title && (
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 md:mb-8 text-center">
                        {title}
                    </h2>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <Link href={`/products/${product.id}`} key={product.id} className="group">
                            <Card className="h-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col">
                                <div className="relative aspect-square bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                    />

                                    {/* Badges */}
                                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                                        {product.isNew && (
                                            <Badge className="bg-blue-600 hover:bg-blue-700 text-white border-none shadow-sm">
                                                New
                                            </Badge>
                                        )}
                                        {product.discount && (
                                            <Badge className="bg-red-500 hover:bg-red-600 text-white border-none shadow-sm">
                                                -{Math.round(product.discount)}%
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Quick Action Button */}
                                    <button className="absolute top-3 right-3 bg-white/90 dark:bg-neutral-900/90 border border-neutral-200/50 dark:border-neutral-700/50 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/40 text-neutral-600 dark:text-neutral-400 hover:text-red-500 dark:hover:text-red-400 transition-colors shadow-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300">
                                        <Heart className="h-5 w-5" />
                                    </button>
                                </div>

                                <CardContent className="p-4 flex flex-col flex-grow">
                                    <div className="mb-2">
                                        <h3 className="font-semibold text-base md:text-lg text-neutral-900 dark:text-white line-clamp-2 min-h-[3.5rem] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {product.name}
                                        </h3>
                                    </div>

                                    {/* Rating */}
                                    {(product.rating || 0) > 0 && (
                                        <div className="flex items-center gap-1 mb-3">
                                            <div className="flex text-yellow-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`h-3.5 w-3.5 ${i < Math.floor(product.rating!) ? 'fill-current' : 'text-neutral-300 dark:text-neutral-600'}`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-xs text-neutral-500 dark:text-neutral-400 ml-1">
                                                ({product.reviews})
                                            </span>
                                        </div>
                                    )}

                                    <div className="mt-auto pt-3 border-t border-neutral-100 dark:border-neutral-800">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-xl font-bold text-neutral-900 dark:text-white">
                                                        ${product.price ? product.price.toFixed(2) : '0.00'}
                                                    </span>
                                                    {product.originalPrice && product.originalPrice > product.price && (
                                                        <span className="text-sm text-neutral-500 line-through decoration-neutral-400">
                                                            ${product.originalPrice.toFixed(2)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <Button className="w-full bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 dark:text-neutral-900 group-hover:shadow-md transition-all">
                                            <ShoppingCart className="mr-2 h-4 w-4" />
                                            Add to Cart
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
