'use client'

import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { motion } from 'framer-motion'

// Categories constant removed (passed via props)

type CategoryType = {
    id: string
    name: string
    icon: string
    color: string
    count: string
}

type ShopByCategoryProps = {
    categories: CategoryType[]
}


export default function ShopByCategory({ categories }: ShopByCategoryProps) {

    return (
        <section className="py-8 md:py-10 lg:py-12 bg-neutral-50 dark:bg-neutral-900/80">
            <div className="container px-4 mx-auto">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6 lg:mb-8 text-center">
                    Shop by Category
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            <Link href={`/category/${category.id}`}>
                                <Card className="group bg-white/90 dark:bg-neutral-900/90 border border-neutral-200/70 dark:border-neutral-800/70 shadow-sm hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1 md:hover:-translate-y-2">
                                    <CardContent className="p-3 md:p-4 text-center">
                                        <div
                                            className={`${category.color} w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-2 md:mb-3 group-hover:scale-110 transition-transform`}
                                        >
                                            <span className="text-2xl">{category.icon}</span>
                                        </div>
                                        <h3 className="font-semibold text-xs md:text-sm mb-1 line-clamp-2">
                                            {category.name}
                                        </h3>
                                        <p className="text-[10px] md:text-xs text-neutral-600 dark:text-neutral-400">
                                            {category.count}
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
