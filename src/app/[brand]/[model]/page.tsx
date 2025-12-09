'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronRight, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Apple Products organized by category
const APPLE_PRODUCTS = {
    'iPhone': {
        icon: '📱',
        color: 'bg-gradient-to-br from-blue-500 to-blue-700',
        models: [
            { name: 'iPhone 17 Pro Max', new: true, productCount: 456 },
            { name: 'iPhone 17 Pro', new: true, productCount: 423 },
            { name: 'iPhone 16 Pro Max', productCount: 892, new: false },
            { name: 'iPhone 16 Pro', productCount: 834, new: false },
            { name: 'iPhone 16 Plus', productCount: 678, new: false },
            { name: 'iPhone 16', productCount: 567, new: false },
            { name: 'iPhone 15 Pro Max', productCount: 1234, new: false },
            { name: 'iPhone 15 Pro', productCount: 1156, new: false },
            { name: 'iPhone 15 Plus', productCount: 892, new: false },
            { name: 'iPhone 15', productCount: 834, new: false },
            { name: 'iPhone 14 Pro Max', productCount: 678, new: false },
            { name: 'iPhone 14 Pro', productCount: 567, new: false },
        ]
    },
    'iPad': {
        icon: '📱',
        color: 'bg-gradient-to-br from-purple-500 to-purple-700',
        models: [
            { name: 'iPad Pro 13"', new: true, productCount: 234 },
            { name: 'iPad Pro 11"', new: true, productCount: 198 },
            { name: 'iPad Air', productCount: 345, new: false },
            { name: 'iPad Mini', productCount: 287, new: false },
            { name: 'iPad 10th Gen', productCount: 423, new: false },
        ]
    },
    'MacBook': {
        icon: '💻',
        color: 'bg-gradient-to-br from-gray-700 to-gray-900',
        models: [
            { name: 'MacBook Pro 16"', new: true, productCount: 156 },
            { name: 'MacBook Pro 14"', new: true, productCount: 134 },
            { name: 'MacBook Air 15"', productCount: 178, new: false },
            { name: 'MacBook Air 13"', productCount: 289, new: false },
        ]
    },
    'Apple Watch': {
        icon: '⌚',
        color: 'bg-gradient-to-br from-red-500 to-pink-600',
        models: [
            { name: 'Apple Watch Ultra 2', new: true, productCount: 89 },
            { name: 'Apple Watch Series 10', new: true, productCount: 123 },
            { name: 'Apple Watch SE', productCount: 167, new: false },
        ]
    },
    'AirPods': {
        icon: '🎧',
        color: 'bg-gradient-to-br from-green-500 to-emerald-600',
        models: [
            { name: 'AirPods Pro 2', new: true, productCount: 234 },
            { name: 'AirPods Max', productCount: 98, new: false },
            { name: 'AirPods 3rd Gen', productCount: 178, new: false },
            { name: 'AirPods 2nd Gen', productCount: 145, new: false },
        ]
    },
    'Accessories': {
        icon: '🔌',
        color: 'bg-gradient-to-br from-orange-500 to-red-500',
        models: [
            { name: 'MagSafe Chargers', productCount: 456, new: false },
            { name: 'Apple Pencil', productCount: 234, new: false },
            { name: 'Magic Keyboard', productCount: 178, new: false },
            { name: 'Apple Cases', productCount: 892, new: false },
            { name: 'Lightning Cables', productCount: 567, new: false },
            { name: 'USB-C Cables', productCount: 423, new: false },
        ]
    }
}

export default function AppleCategoryPage() {
    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">

            {/* Header */}
            <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                <div className="container px-4 py-6 md:py-8">
                    <Link href="/">
                        <Button variant="ghost" size="sm" className="mb-4">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Home
                        </Button>
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-gray-800 to-gray-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-4xl md:text-5xl">🍎</span>
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold dark:text-white">Apple Products</h1>
                            <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                                Choose your device to see available parts and accessories
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="container px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                    {Object.entries(APPLE_PRODUCTS).map(([category, data], categoryIndex) => (
                        <motion.div
                            key={category}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: categoryIndex * 0.1 }}
                        >
                            <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                                <div className={`${data.color} p-4 md:p-6`}>
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl md:text-4xl">{data.icon}</span>
                                        <h2 className="text-2xl md:text-3xl font-bold text-white">{category}</h2>
                                    </div>
                                </div>

                                <CardContent className="p-4 md:p-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {data.models.map((model, index) => (
                                            <Link
                                                key={index}
                                                href={`/shop?category=apple&device=${encodeURIComponent(model.name)}`}
                                                className="group"
                                            >
                                                <div className="flex items-center justify-between p-3 md:p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors border border-transparent hover:border-blue-500">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm md:text-base dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {model.name}
                              </span>
                                                            {model.new && (
                                                                <Badge className="bg-blue-600 text-white text-xs px-2 py-0.5">NEW</Badge>
                                                            )}
                                                        </div>
                                                        <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400">
                                                            {model.productCount} products
                                                        </p>
                                                    </div>
                                                    <ChevronRight className="h-5 w-5 text-neutral-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* View All Apple Products */}
                <div className="mt-8 text-center">
                    <Link href="/shop?category=apple">
                        <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                            View All Apple Products
                            <ChevronRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
