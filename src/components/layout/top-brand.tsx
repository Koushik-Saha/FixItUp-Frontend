'use client'

import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Heart, ShoppingCart, Star} from "lucide-react";

type BrandType = {
    logo: string
    name: string,
    products: string
}

type BrandProps = {
    topBrands: BrandType[]
}

export default function TopBrand({ topBrands }: BrandProps) {

    return (
        <section className="py-8 md:py-10 lg:py-12 bg-neutral-50 dark:bg-neutral-900/80">
            <div className="container px-4 mx-auto">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6 lg:mb-8 text-center">
                    Top Brands
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5 lg:gap-6">
                    {topBrands.map((brand, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            <Link href={`/brand/${brand.name.toLowerCase()}`}>
                                <Card className="group bg-white/90 dark:bg-neutral-900/90 border border-neutral-200/70 dark:border-neutral-800/70 hover:shadow-xl transition-all cursor-pointer hover:scale-105">
                                    <CardContent className="p-4 md:p-5 lg:p-6 text-center">
                                        <div className="text-3xl md:text-4xl lg:text-5xl mb-2 md:mb-3 group-hover:scale-110 transition-transform">
                                            {brand.logo}
                                        </div>
                                        <h3 className="font-bold text-sm md:text-base lg:text-lg mb-1">
                                            {brand.name}
                                        </h3>
                                        <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400">
                                            {brand.products}
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
