/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'

// Types matching Prisma Model
type HeroSlide = {
    id: string
    badge: string | null
    badgeColor: string | null
    title: string
    description: string | null
    ctaPrimary: any // JSON
    ctaSecondary: any // JSON
    image: string
    gradient: string | null
    trustBadges: any // JSON
    discount: string | null
}

type HeroCarouselProps = {
    slides: HeroSlide[]
}

export function HeroCarousel({ slides }: HeroCarouselProps) {
    const [currentSlideIndex, setCurrentSlide] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)

    // Auto-play carousel
    useEffect(() => {
        if (!isAutoPlaying || slides.length === 0) return

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [isAutoPlaying, slides.length])

    const goToSlide = (index: number) => {
        setCurrentSlide(index)
        setIsAutoPlaying(false)
    }

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
        setIsAutoPlaying(false)
    }

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
        setIsAutoPlaying(false)
    }


    if (slides.length === 0) return null

    const slide = slides[currentSlideIndex]

    // Safety check for JSON fields (they might come as null from DB)
    const ctaPrimary = slide.ctaPrimary as { text: string, link: string }
    const ctaSecondary = slide.ctaSecondary as { text: string, link: string }
    const trustBadges = (slide.trustBadges as { icon: string, text: string }[]) || []

    return (
        <div className="relative overflow-hidden">
            <div className="relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={slide.id}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.5 }}
                        className={`bg-gradient-to-r ${slide.gradient || 'from-blue-600 to-purple-600'} py-12 md:py-16 lg:py-20`}
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
                                    {slide.badge && (
                                        <div className="mb-6">
                                            <span className={`inline-block ${slide.badgeColor || 'bg-blue-500'} text-white px-4 py-2 rounded-full text-sm font-bold`}>
                                                {slide.badge}
                                            </span>
                                        </div>
                                    )}

                                    {/* Title */}
                                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                                        {slide.title}
                                    </h1>

                                    {/* Description */}
                                    {slide.description && (
                                        <p className="text-lg sm:text-xl mb-8 text-white/90 leading-relaxed">
                                            {slide.description}
                                        </p>
                                    )}

                                    {/* CTA Buttons */}
                                    <div className="flex flex-wrap gap-4 mb-8">
                                        {ctaPrimary && ctaPrimary.text && (
                                            <Link href={ctaPrimary.link || '#'}>
                                                <Button
                                                    size="lg"
                                                    className="bg-white text-neutral-900 hover:bg-neutral-100 font-bold px-8 py-6 text-lg"
                                                >
                                                    {ctaPrimary.text}
                                                    <ShoppingBag className="ml-2 h-5 w-5" />
                                                </Button>
                                            </Link>
                                        )}
                                        {ctaSecondary && ctaSecondary.text && (
                                            <Link href={ctaSecondary.link || '#'}>
                                                <Button
                                                    size="lg"
                                                    variant="outline"
                                                    className="border-2 border-white text-white hover:bg-white hover:text-neutral-900 font-bold px-8 py-6 text-lg"
                                                >
                                                    {ctaSecondary.text}
                                                </Button>
                                            </Link>
                                        )}
                                    </div>

                                    {/* Trust Badges */}
                                    {trustBadges.length > 0 && (
                                        <div className="flex flex-wrap gap-6">
                                            {trustBadges.map((badge, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <span className="text-2xl">{badge.icon}</span>
                                                    <span className="text-sm font-medium">{badge.text}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
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
                                            <Image
                                                src={slide.image}
                                                alt={slide.title}
                                                fill
                                                className="object-contain"
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                                priority
                                            />
                                        </div>

                                        {/* Discount Badge */}
                                        {slide.discount && (
                                            <div className="absolute -top-4 -right-4 bg-red-500 text-white px-6 py-3 rounded-full font-bold text-xl shadow-2xl animate-pulse">
                                                {slide.discount}
                                            </div>
                                        )}
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
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`transition-all ${currentSlideIndex === index
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
                    key={currentSlideIndex}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 5, ease: 'linear' }}
                    className="h-full bg-white"
                />
            </div>

        </div>
    )
}

