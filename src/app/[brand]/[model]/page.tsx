'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

// Product types available for each model
const PRODUCT_TYPES = [
    { id: 'cases', name: 'Cases & Covers', icon: '📱', count: 234, color: 'from-blue-500 to-blue-600', popular: true },
    { id: 'screens', name: 'LCD Screens', icon: '📺', count: 45, color: 'from-purple-500 to-purple-600', popular: true },
    { id: 'batteries', name: 'Batteries', icon: '🔋', count: 12, color: 'from-green-500 to-green-600', popular: true },
    { id: 'chargers', name: 'Chargers & Cables', icon: '🔌', count: 67, color: 'from-orange-500 to-orange-600', popular: true },
    { id: 'cameras', name: 'Camera Parts', icon: '📷', count: 8, color: 'from-red-500 to-red-600', popular: false },
    { id: 'speakers', name: 'Speakers & Audio', icon: '🔊', count: 6, color: 'from-pink-500 to-pink-600', popular: false },
    { id: 'microphones', name: 'Microphones', icon: '🎤', count: 4, color: 'from-indigo-500 to-indigo-600', popular: false },
    { id: 'charging-ports', name: 'Charging Ports', icon: '🔌', count: 15, color: 'from-cyan-500 to-cyan-600', popular: false },
    { id: 'buttons', name: 'Buttons & Switches', icon: '🔘', count: 12, color: 'from-teal-500 to-teal-600', popular: false },
    { id: 'flex-cables', name: 'Flex Cables', icon: '📡', count: 23, color: 'from-amber-500 to-amber-600', popular: false },
    { id: 'housings', name: 'Back Housings', icon: '🏠', count: 18, color: 'from-lime-500 to-lime-600', popular: false },
    { id: 'sim-trays', name: 'SIM Trays', icon: '💳', count: 9, color: 'from-emerald-500 to-emerald-600', popular: false },
    { id: 'antennas', name: 'Antennas & WiFi', icon: '📡', count: 7, color: 'from-sky-500 to-sky-600', popular: false },
    { id: 'home-buttons', name: 'Home Buttons', icon: '⏺️', count: 11, color: 'from-violet-500 to-violet-600', popular: false },
    { id: 'sensors', name: 'Proximity Sensors', icon: '👁️', count: 5, color: 'from-fuchsia-500 to-fuchsia-600', popular: false },
    { id: 'vibrators', name: 'Vibrator Motors', icon: '📳', count: 3, color: 'from-rose-500 to-rose-600', popular: false },
    { id: 'tools', name: 'Repair Tool Kits', icon: '🛠️', count: 34, color: 'from-slate-500 to-slate-600', popular: true },
    { id: 'adhesive', name: 'Adhesive & Tape', icon: '📏', count: 15, color: 'from-zinc-500 to-zinc-600', popular: false },
]

export default function ModelProductTypesPage() {
    const popularTypes = PRODUCT_TYPES.filter(t => t.popular)
    const otherTypes = PRODUCT_TYPES.filter(t => !t.popular)

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">

            {/* Breadcrumb */}
            <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                <div className="container py-4">
                    <div className="flex items-center gap-2 text-sm flex-wrap">
                        <Link href="/" className="text-neutral-600 dark:text-neutral-400 hover:text-blue-600">
                            Home
                        </Link>
                        <ChevronRight className="h-4 w-4 text-neutral-400" />
                        <Link href="/phones" className="text-neutral-600 dark:text-neutral-400 hover:text-blue-600">
                            Phones
                        </Link>
                        <ChevronRight className="h-4 w-4 text-neutral-400" />
                        <Link href="/phones/apple" className="text-neutral-600 dark:text-neutral-400 hover:text-blue-600">
                            Apple
                        </Link>
                        <ChevronRight className="h-4 w-4 text-neutral-400" />
                        <span className="font-semibold text-neutral-900 dark:text-white">iPhone 15 Pro Max</span>
                    </div>
                </div>
            </div>

            <div className="container py-8">

                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
                        {/* Product Image */}
                        <div className="w-32 h-32 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 rounded-2xl p-4 flex items-center justify-center">
                            <img
                                src="https://images.unsplash.com/photo-1696446702883-69bf4a342753?w=300"
                                alt="iPhone 15 Pro Max"
                                className="w-full h-full object-contain"
                            />
                        </div>

                        <div className="flex-1">
                            <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                                🍎 Apple
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-2">
                                iPhone 15 Pro Max
                            </h1>
                            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                                Select the type of part or accessory you need
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full font-medium">
                  2023 Model
                </span>
                                <span className="text-neutral-600 dark:text-neutral-400">
                  456 products available
                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Popular Categories */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 dark:text-white flex items-center gap-2">
                        🔥 Popular Categories
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {popularTypes.map((type, index) => (
                            <motion.div
                                key={type.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <Link href={`/phones/apple/iphone-15-pro-max/${type.id}`}>
                                    <Card className="group hover:shadow-2xl transition-all cursor-pointer overflow-hidden h-full">
                                        <div className={`bg-gradient-to-br ${type.color} p-6 text-center`}>
                                            <div className="text-5xl mb-2 group-hover:scale-110 transition-transform">
                                                {type.icon}
                                            </div>
                                        </div>
                                        <CardContent className="p-4">
                                            <h3 className="font-bold text-lg mb-1 dark:text-white group-hover:text-blue-600 transition-colors">
                                                {type.name}
                                            </h3>
                                            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                                {type.count} products →
                                            </p>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* All Categories */}
                <div>
                    <h2 className="text-2xl font-bold mb-6 dark:text-white">
                        All Parts & Accessories
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {otherTypes.map((type, index) => (
                            <motion.div
                                key={type.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.02 }}
                            >
                                <Link href={`/phones/apple/iphone-15-pro-max/${type.id}`}>
                                    <Card className="group hover:shadow-lg transition-all cursor-pointer h-full">
                                        <CardContent className="p-4 text-center">
                                            <div className={`bg-gradient-to-br ${type.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 text-3xl group-hover:scale-110 transition-transform`}>
                                                {type.icon}
                                            </div>
                                            <h3 className="font-semibold text-sm mb-1 dark:text-white line-clamp-2">
                                                {type.name}
                                            </h3>
                                            <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                                {type.count}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Info Section */}
                <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                    <h3 className="font-bold text-lg mb-2 dark:text-white">
                        💡 Need Help Finding the Right Part?
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                        Our parts are 100% compatible with iPhone 15 Pro Max. All screens and batteries come with installation tools and adhesive.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Link href="/repair-guides">
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                📖 View Repair Guides
                            </button>
                        </Link>
                        <Link href="/contact">
                            <button className="px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors dark:text-white">
                                💬 Contact Support
                            </button>
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    )
}
