'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronRight, Search } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'

// Example: Apple iPhone Models
const APPLE_IPHONE_MODELS = [
    // iPhone 15 Series
    { id: 'iphone-15-pro-max', name: 'iPhone 15 Pro Max', year: 2023, image: 'https://images.unsplash.com/photo-1696446702883-69bf4a342753?w=300', productCount: 234, popular: true },
    { id: 'iphone-15-pro', name: 'iPhone 15 Pro', year: 2023, image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300', productCount: 198, popular: true },
    { id: 'iphone-15-plus', name: 'iPhone 15 Plus', year: 2023, image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300', productCount: 176, popular: true },
    { id: 'iphone-15', name: 'iPhone 15', year: 2023, image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300', productCount: 156, popular: true },

    // iPhone 14 Series
    { id: 'iphone-14-pro-max', name: 'iPhone 14 Pro Max', year: 2022, image: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=300', productCount: 312, popular: true },
    { id: 'iphone-14-pro', name: 'iPhone 14 Pro', year: 2022, image: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=300', productCount: 289, popular: true },
    { id: 'iphone-14-plus', name: 'iPhone 14 Plus', year: 2022, image: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=300', productCount: 245, popular: false },
    { id: 'iphone-14', name: 'iPhone 14', year: 2022, image: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=300', productCount: 267, popular: false },

    // iPhone 13 Series
    { id: 'iphone-13-pro-max', name: 'iPhone 13 Pro Max', year: 2021, image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=300', productCount: 389, popular: false },
    { id: 'iphone-13-pro', name: 'iPhone 13 Pro', year: 2021, image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=300', productCount: 342, popular: false },
    { id: 'iphone-13-mini', name: 'iPhone 13 Mini', year: 2021, image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=300', productCount: 198, popular: false },
    { id: 'iphone-13', name: 'iPhone 13', year: 2021, image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=300', productCount: 301, popular: false },

    // iPhone 12 Series
    { id: 'iphone-12-pro-max', name: 'iPhone 12 Pro Max', year: 2020, image: 'https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?w=300', productCount: 267, popular: false },
    { id: 'iphone-12-pro', name: 'iPhone 12 Pro', year: 2020, image: 'https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?w=300', productCount: 234, popular: false },
    { id: 'iphone-12-mini', name: 'iPhone 12 Mini', year: 2020, image: 'https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?w=300', productCount: 176, popular: false },
    { id: 'iphone-12', name: 'iPhone 12', year: 2020, image: 'https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?w=300', productCount: 289, popular: false },

    // iPhone 11 Series
    { id: 'iphone-11-pro-max', name: 'iPhone 11 Pro Max', year: 2019, image: 'https://images.unsplash.com/photo-1574755393849-623942496936?w=300', productCount: 198, popular: false },
    { id: 'iphone-11-pro', name: 'iPhone 11 Pro', year: 2019, image: 'https://images.unsplash.com/photo-1574755393849-623942496936?w=300', productCount: 176, popular: false },
    { id: 'iphone-11', name: 'iPhone 11', year: 2019, image: 'https://images.unsplash.com/photo-1574755393849-623942496936?w=300', productCount: 234, popular: false },

    // Older Models
    { id: 'iphone-xr', name: 'iPhone XR', year: 2018, image: 'https://images.unsplash.com/photo-1574755393849-623942496936?w=300', productCount: 156, popular: false },
    { id: 'iphone-xs-max', name: 'iPhone XS Max', year: 2018, image: 'https://images.unsplash.com/photo-1574755393849-623942496936?w=300', productCount: 134, popular: false },
    { id: 'iphone-xs', name: 'iPhone XS', year: 2018, image: 'https://images.unsplash.com/photo-1574755393849-623942496936?w=300', productCount: 123, popular: false },
    { id: 'iphone-x', name: 'iPhone X', year: 2017, image: 'https://images.unsplash.com/photo-1574755393849-623942496936?w=300', productCount: 167, popular: false },
    { id: 'iphone-8-plus', name: 'iPhone 8 Plus', year: 2017, image: 'https://images.unsplash.com/photo-1574755393849-623942496936?w=300', productCount: 145, popular: false },
    { id: 'iphone-8', name: 'iPhone 8', year: 2017, image: 'https://images.unsplash.com/photo-1574755393849-623942496936?w=300', productCount: 156, popular: false },
    { id: 'iphone-7-plus', name: 'iPhone 7 Plus', year: 2016, image: 'https://images.unsplash.com/photo-1574755393849-623942496936?w=300', productCount: 98, popular: false },
    { id: 'iphone-7', name: 'iPhone 7', year: 2016, image: 'https://images.unsplash.com/photo-1574755393849-623942496936?w=300', productCount: 112, popular: false },
    { id: 'iphone-se-2022', name: 'iPhone SE (2022)', year: 2022, image: 'https://images.unsplash.com/photo-1574755393849-623942496936?w=300', productCount: 89, popular: false },
    { id: 'iphone-se-2020', name: 'iPhone SE (2020)', year: 2020, image: 'https://images.unsplash.com/photo-1574755393849-623942496936?w=300', productCount: 67, popular: false },
]

export default function BrandModelsPage() {
    const [searchQuery, setSearchQuery] = useState('')

    const filteredModels = APPLE_IPHONE_MODELS.filter(model =>
        model.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const popularModels = filteredModels.filter(m => m.popular)
    const otherModels = filteredModels.filter(m => !m.popular)

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">

            {/* Breadcrumb */}
            <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                <div className="container py-4">
                    <div className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-neutral-600 dark:text-neutral-400 hover:text-blue-600">
                            Home
                        </Link>
                        <ChevronRight className="h-4 w-4 text-neutral-400" />
                        <Link href="/phones" className="text-neutral-600 dark:text-neutral-400 hover:text-blue-600">
                            Phones
                        </Link>
                        <ChevronRight className="h-4 w-4 text-neutral-400" />
                        <span className="font-semibold text-neutral-900 dark:text-white">Apple</span>
                    </div>
                </div>
            </div>

            <div className="container py-8">

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="text-6xl">🍎</div>
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white">
                                Apple iPhone Models
                            </h1>
                            <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                                Select your iPhone model to view parts & accessories
                            </p>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                        <Input
                            placeholder="Search iPhone models..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Popular Models */}
                {popularModels.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold mb-6 dark:text-white">
                            🔥 Popular Models
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                            {popularModels.map((model, index) => (
                                <motion.div
                                    key={model.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <Link href={`/phones/apple/${model.id}`}>
                                        <Card className="group hover:shadow-xl transition-all cursor-pointer overflow-hidden">
                                            <div className="relative aspect-square bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 p-6">
                                                <img
                                                    src={model.image}
                                                    alt={model.name}
                                                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                                                />
                                                <Badge className="absolute top-2 right-2 bg-blue-600">
                                                    New
                                                </Badge>
                                            </div>
                                            <CardContent className="p-4">
                                                <h3 className="font-semibold text-lg mb-1 dark:text-white">
                                                    {model.name}
                                                </h3>
                                                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                                                    {model.year}
                                                </p>
                                                <p className="text-sm font-medium text-blue-600">
                                                    {model.productCount} products available
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* All Other Models */}
                {otherModels.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6 dark:text-white">
                            All iPhone Models
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                            {otherModels.map((model, index) => (
                                <motion.div
                                    key={model.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.03 }}
                                >
                                    <Link href={`/phones/apple/${model.id}`}>
                                        <Card className="group hover:shadow-lg transition-all cursor-pointer">
                                            <CardContent className="p-4">
                                                <div className="aspect-square bg-neutral-100 dark:bg-neutral-800 rounded-lg mb-3 p-4">
                                                    <img
                                                        src={model.image}
                                                        alt={model.name}
                                                        className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                                                    />
                                                </div>
                                                <h3 className="font-semibold text-sm mb-1 dark:text-white">
                                                    {model.name}
                                                </h3>
                                                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                                    {model.productCount} products
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {filteredModels.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                            No models found matching "{searchQuery}"
                        </p>
                    </div>
                )}

            </div>
        </div>
    )
}
