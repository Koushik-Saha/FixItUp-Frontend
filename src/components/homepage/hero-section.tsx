// components/homepage/hero-section.tsx
// Dynamic Hero Carousel

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Banner {
    id: string
    title: string
    subtitle: string
    imageUrl: string
    linkUrl: string
    buttonText: string
}

interface HeroSectionProps {
    banners: Banner[]
}

export function HeroSection({ banners }: HeroSectionProps) {
    const [currentSlide, setCurrentSlide] = useState(0)

    // Auto-advance slides
    useEffect(() => {
        if (banners.length <= 1) return

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % banners.length)
        }, 5000)

        return () => clearInterval(timer)
    }, [banners.length])

    const goToPrevious = () => {
        setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
    }

    const goToNext = () => {
        setCurrentSlide((prev) => (prev + 1) % banners.length)
    }

    if (banners.length === 0) return null

    return (
        <section className="relative bg-gray-900 overflow-hidden">
            <div className="relative h-[400px] md:h-[500px] lg:h-[600px]">
                {banners.map((banner, index) => (
                    <div
                        key={banner.id}
                        className={`absolute inset-0 transition-opacity duration-500 ${
                            index === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        {/* Background Image */}
                        <div className="absolute inset-0">
                            <Image
                                src={banner.imageUrl}
                                alt={banner.title}
                                fill
                                className="object-cover"
                                priority={index === 0}
                            />
                            <div className="absolute inset-0 bg-black/40" />
                        </div>

                        {/* Content */}
                        <div className="relative h-full flex items-center">
                            <div className="container mx-auto px-4">
                                <div className="max-w-2xl">
                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                                        {banner.title}
                                    </h1>
                                    <p className="text-lg md:text-xl text-gray-200 mb-8">
                                        {banner.subtitle}
                                    </p>
                                    <Link
                                        href={banner.linkUrl}
                                        className="inline-block px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                                    >
                                        {banner.buttonText}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Navigation Arrows */}
                {banners.length > 1 && (
                    <>
                        <button
                            onClick={goToPrevious}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition"
                            aria-label="Previous slide"
                        >
                            <ChevronLeft className="w-6 h-6 text-white" />
                        </button>
                        <button
                            onClick={goToNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition"
                            aria-label="Next slide"
                        >
                            <ChevronRight className="w-6 h-6 text-white" />
                        </button>
                    </>
                )}

                {/* Dots Indicator */}
                {banners.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {banners.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-2 h-2 rounded-full transition ${
                                    index === currentSlide
                                        ? 'bg-white w-8'
                                        : 'bg-white/50 hover:bg-white/75'
                                }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
