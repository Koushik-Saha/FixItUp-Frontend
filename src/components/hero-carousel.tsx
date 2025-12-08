'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, ShoppingBag, Smartphone, Laptop, Headphones, Watch } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

// Carousel Slides Data
const HERO_SLIDES = [
    {
        id: 1,
        badge: 'New Arrivals',
        badgeColor: 'bg-yellow-500',
        title: 'Latest Tech at Unbeatable Prices',
        description: 'Shop the newest smartphones, laptops, and accessories from top brands. Free shipping on orders over $50!',
        ctaPrimary: { text: 'Shop Now', link: '/shop' },
        ctaSecondary: { text: 'View All Deals', link: '/deals' },
        image: '/images/phone_repair.jpg',
        gradient: 'from-blue-600 via-purple-600 to-pink-600',
        trustBadges: [
            { icon: '🚚', text: 'Free Shipping' },
            { icon: '🛡️', text: '2-Year Warranty' },
            { icon: '💳', text: 'Secure Payment' }
        ],
        discount: '-20% OFF'
    },
    {
        id: 2,
        badge: 'Smartphones',
        badgeColor: 'bg-blue-500',
        title: 'iPhone 15 Series Now Available',
        description: 'Get the latest iPhone 15 Pro Max with all accessories. Complete protection with cases, screen protectors, and chargers.',
        ctaPrimary: { text: 'Shop iPhones', link: '/phones/apple' },
        ctaSecondary: { text: 'View Accessories', link: '/phones/apple/iphone-15-pro-max' },
        image: '/images/phone_repair.jpg',
        gradient: 'from-cyan-600 via-blue-600 to-indigo-600',
        trustBadges: [
            { icon: '✅', text: 'Authentic Products' },
            { icon: '⚡', text: 'Same Day Shipping' },
            { icon: '💰', text: 'Best Price Guarantee' }
        ],
        discount: '-15% OFF'
    },
    {
        id: 3,
        badge: 'Laptops & Tablets',
        badgeColor: 'bg-purple-500',
        title: 'Powerful Laptops for Work & Play',
        description: 'Discover high-performance laptops from Dell, HP, Lenovo, and more. Perfect for work, gaming, or creative projects.',
        ctaPrimary: { text: 'Shop Laptops', link: '/laptops' },
        ctaSecondary: { text: 'View Tablets', link: '/tablets' },
        image: '/images/phone_repair.jpg',
        gradient: 'from-purple-600 via-pink-600 to-red-600',
        trustBadges: [
            { icon: '🎮', text: 'Gaming Ready' },
            { icon: '💻', text: 'Professional Grade' },
            { icon: '🔧', text: 'Free Setup' }
        ],
        discount: '-25% OFF'
    },
    {
        id: 4,
        badge: 'Audio & Accessories',
        badgeColor: 'bg-green-500',
        title: 'Premium Audio Experience',
        description: 'AirPods, headphones, and speakers from top brands. Crystal clear sound for music, calls, and gaming.',
        ctaPrimary: { text: 'Shop Audio', link: '/category/audio' },
        ctaSecondary: { text: 'View Deals', link: '/deals/audio' },
        image: '/images/phone_repair.jpg',
        gradient: 'from-green-600 via-emerald-600 to-teal-600',
        trustBadges: [
            { icon: '🎧', text: 'Studio Quality' },
            { icon: '🔋', text: 'Long Battery Life' },
            { icon: '🎵', text: 'Noise Canceling' }
        ],
        discount: '-30% OFF'
    },
    {
        id: 5,
        badge: 'Wholesale B2B & B2C',
        badgeColor: 'bg-orange-500',
        title: 'Bulk Orders & Wholesale Pricing',
        description: 'Special pricing for businesses, repair shops, and resellers. Get the best wholesale rates on all products.',
        ctaPrimary: { text: 'Contact Sales', link: '/wholesale' },
        ctaSecondary: { text: 'View Catalog', link: '/wholesale/catalog' },
        image: '/images/phone_repair.jpg',
        gradient: 'from-orange-600 via-red-600 to-pink-600',
        trustBadges: [
            { icon: '📦', text: 'Bulk Discounts' },
            { icon: '🤝', text: 'B2B Support' },
            { icon: '🚛', text: 'Free Shipping' }
        ],
        discount: 'Up to 40% OFF'
    }
]

export function HeroCarousel() {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)

    // Auto-play carousel
    useEffect(() => {
        if (!isAutoPlaying) return

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)
        }, 5000) // Change slide every 5 seconds

        return () => clearInterval(interval)
    }, [isAutoPlaying])

    const goToSlide = (index: number) => {
        setCurrentSlide(index)
        setIsAutoPlaying(false) // Pause auto-play when manually navigating
    }

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)
        setIsAutoPlaying(false)
    }

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
        setIsAutoPlaying(false)
    }

    const slide = HERO_SLIDES[currentSlide]

    return (
        <div className="relative overflow-hidden">

            {/* Carousel Container */}
            <div className="relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={slide.id}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.5 }}
                        className={`bg-gradient-to-r ${slide.gradient} py-12 md:py-16 lg:py-20`}
                    >
                        <div className="container">
                            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

                                {/* Left Column - Content */}
                                <motion.div
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    className="text-white"
                                >
                                    {/* Badge */}
                                    <div className="mb-6">
                    <span className={`inline-block ${slide.badgeColor} text-white px-4 py-2 rounded-full text-sm font-bold`}>
                      {slide.badge}
                    </span>
                                    </div>

                                    {/* Title */}
                                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                                        {slide.title}
                                    </h1>

                                    {/* Description */}
                                    <p className="text-lg sm:text-xl mb-8 text-white/90 leading-relaxed">
                                        {slide.description}
                                    </p>

                                    {/* CTA Buttons */}
                                    <div className="flex flex-wrap gap-4 mb-8">
                                        <Link href={slide.ctaPrimary.link}>
                                            <Button
                                                size="lg"
                                                className="bg-white text-neutral-900 hover:bg-neutral-100 font-bold px-8 py-6 text-lg"
                                            >
                                                {slide.ctaPrimary.text}
                                                <ShoppingBag className="ml-2 h-5 w-5" />
                                            </Button>
                                        </Link>
                                        <Link href={slide.ctaSecondary.link}>
                                            <Button
                                                size="lg"
                                                variant="outline"
                                                className="border-2 border-white text-white hover:bg-white hover:text-neutral-900 font-bold px-8 py-6 text-lg"
                                            >
                                                {slide.ctaSecondary.text}
                                            </Button>
                                        </Link>
                                    </div>

                                    {/* Trust Badges */}
                                    <div className="flex flex-wrap gap-6">
                                        {slide.trustBadges.map((badge, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <span className="text-2xl">{badge.icon}</span>
                                                <span className="text-sm font-medium">{badge.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* Right Column - Product Image */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                    className="relative hidden lg:block"
                                >
                                    <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border-2 border-white/20">
                                        {/* Fixed aspect ratio container */}
                                        <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl bg-white/5">
                                            <img
                                                src={slide.image}
                                                alt={slide.title}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>

                                        {/* Discount Badge */}
                                        <div className="absolute -top-4 -right-4 bg-red-500 text-white px-6 py-3 rounded-full font-bold text-xl shadow-2xl animate-pulse">
                                            {slide.discount}
                                        </div>
                                    </div>

                                    {/* Floating Animation */}
                                    <motion.div
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                        className="absolute inset-0 pointer-events-none"
                                    />
                                </motion.div>

                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all z-10 hidden lg:block"
                aria-label="Previous slide"
            >
                <ChevronLeft className="h-6 w-6" />
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all z-10 hidden lg:block"
                aria-label="Next slide"
            >
                <ChevronRight className="h-6 w-6" />
            </button>

            {/* Dots Navigation */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {HERO_SLIDES.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`transition-all ${
                            currentSlide === index
                                ? 'w-8 bg-white'
                                : 'w-2 bg-white/50 hover:bg-white/75'
                        } h-2 rounded-full`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
                <motion.div
                    key={currentSlide}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 5, ease: 'linear' }}
                    className="h-full bg-white"
                />
            </div>

        </div>
    )
}
