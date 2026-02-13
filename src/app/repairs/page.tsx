/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-html-link-for-pages */
'use client'

import { useState } from 'react'
import {
    Smartphone, Battery, Cable, Camera, ShieldCheck, Zap,
    Clock, CheckCircle, Star, ArrowRight, Wrench
} from 'lucide-react'
import Link from 'next/link'

const REPAIR_SERVICES = [
    {
        id: 'screen',
        name: 'Screen Repair',
        icon: Smartphone,
        description: 'Cracked, shattered, or unresponsive screens repaired with OEM-quality parts',
        time: '30-60 minutes',
        warranty: '12 months',
        price: 'From $59',
        features: [
            'OEM-quality displays',
            'True Tone preserved',
            'Same-day service available',
            'Free screen protector'
        ],
        brands: ['Apple', 'Samsung', 'Google', 'LG', 'Motorola', 'OnePlus']
    },
    {
        id: 'battery',
        name: 'Battery Replacement',
        icon: Battery,
        description: 'Restore your device\'s battery life with genuine replacement batteries',
        time: '20-45 minutes',
        warranty: '12 months',
        price: 'From $49',
        features: [
            'Genuine batteries',
            'Health certification',
            'Quick turnaround',
            'Diagnostic included'
        ],
        brands: ['Apple', 'Samsung', 'Google', 'LG', 'Motorola']
    },
    {
        id: 'charging-port',
        name: 'Charging Port Repair',
        icon: Cable,
        description: 'Fix charging issues, loose connections, and port damage',
        time: '45-90 minutes',
        warranty: '6 months',
        price: 'From $39',
        features: [
            'Fast charging compatible',
            'Clean & sanitize',
            'Connection testing',
            'Cable check included'
        ],
        brands: ['Apple', 'Samsung', 'Google', 'LG', 'Motorola', 'OnePlus']
    },
    {
        id: 'camera',
        name: 'Camera Repair',
        icon: Camera,
        description: 'Restore camera functionality for front and back cameras',
        time: '60-90 minutes',
        warranty: '6 months',
        price: 'From $69',
        features: [
            'Front & rear cameras',
            'Focus calibration',
            'Quality testing',
            'Flash repair included'
        ],
        brands: ['Apple', 'Samsung', 'Google', 'LG', 'Motorola']
    },
    {
        id: 'back-glass',
        name: 'Back Glass Replacement',
        icon: ShieldCheck,
        description: 'Replace cracked or damaged back glass with precision installation',
        time: '90-120 minutes',
        warranty: '6 months',
        price: 'From $79',
        features: [
            'Color-matched glass',
            'Wireless charging compatible',
            'Frame restoration',
            'Water seal repair'
        ],
        brands: ['Apple', 'Samsung', 'Google']
    },
    {
        id: 'diagnostics',
        name: 'Diagnostic Service',
        icon: Zap,
        description: 'Complete device diagnostic to identify all issues',
        time: '15-30 minutes',
        warranty: 'N/A',
        price: 'FREE with repair',
        features: [
            'Full system check',
            'Battery health test',
            'Screen test',
            'Camera & speaker test'
        ],
        brands: ['All Brands']
    }
]

const TESTIMONIALS = [
    {
        name: 'Sarah Johnson',
        location: 'Santa Barbara, CA',
        rating: 5,
        service: 'Screen Repair',
        review: 'Super fast service! My iPhone screen was replaced in 45 minutes and looks brand new. The technician was very professional and explained everything.'
    },
    {
        name: 'Michael Chen',
        location: 'Los Angeles, CA',
        rating: 5,
        service: 'Battery Replacement',
        review: 'My phone was dying by noon every day. After the battery replacement, it lasts the whole day again. Excellent service and fair pricing!'
    },
    {
        name: 'Emily Rodriguez',
        location: 'San Diego, CA',
        rating: 5,
        service: 'Charging Port',
        review: 'They fixed my charging port same day. No more wiggling the cable to get it to charge. Very happy with the quick turnaround!'
    }
]

export default function RepairServicesPage() {
    const [selectedService, setSelectedService] = useState<string | null>(null)

    return (
        <div className="min-h-screen bg-white dark:bg-neutral-900">

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Professional Phone Repair Services
                        </h1>
                        <p className="text-xl text-blue-100 mb-8">
                            Fast, reliable repairs with certified technicians and OEM-quality parts
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                href="/book-repair"
                                className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold flex items-center gap-2"
                            >
                                Book a Repair
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                            <Link
                                href="/repair-price-checker"
                                className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-semibold"
                            >
                                Check Repair Price
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trust Indicators */}
            <div className="border-b border-neutral-200 dark:border-neutral-700">
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">10,000+</div>
                            <p className="text-neutral-600 dark:text-neutral-400">Repairs Completed</p>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">4.9/5</div>
                            <p className="text-neutral-600 dark:text-neutral-400">Customer Rating</p>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">Same Day</div>
                            <p className="text-neutral-600 dark:text-neutral-400">Most Repairs</p>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">12 Months</div>
                            <p className="text-neutral-600 dark:text-neutral-400">Warranty</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Services Grid */}
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
                        Our Repair Services
                    </h2>
                    <p className="text-lg text-neutral-600 dark:text-neutral-400">
                        Professional repairs for all major smartphone brands
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {REPAIR_SERVICES.map(service => {
                        const Icon = service.icon
                        return (
                            <div
                                key={service.id}
                                className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6 hover:shadow-xl transition-shadow cursor-pointer"
                                onClick={() => setSelectedService(service.id === selectedService ? null : service.id)}
                            >
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                        <Icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-1">
                                            {service.name}
                                        </h3>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                            {service.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                                    <div>
                                        <Clock className="h-4 w-4 text-neutral-400 mx-auto mb-1" />
                                        <p className="text-xs text-neutral-600 dark:text-neutral-400">{service.time}</p>
                                    </div>
                                    <div>
                                        <ShieldCheck className="h-4 w-4 text-neutral-400 mx-auto mb-1" />
                                        <p className="text-xs text-neutral-600 dark:text-neutral-400">{service.warranty}</p>
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{service.price}</p>
                                    </div>
                                </div>

                                {selectedService === service.id && (
                                    <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4 mt-4">
                                        <h4 className="font-semibold text-neutral-900 dark:text-white mb-3">Included:</h4>
                                        <ul className="space-y-2 mb-4">
                                            {service.features.map((feature, index) => (
                                                <li key={index} className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                                                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="mb-4">
                                            <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">Supported Brands:</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {service.brands.map(brand => (
                                                    <span key={brand} className="px-3 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded text-sm">
                                                        {brand}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <Link
                                            href={`/book-repair?service=${service.id}`}
                                            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-center flex items-center justify-center gap-2"
                                        >
                                            Book This Repair
                                            <ArrowRight className="h-5 w-5" />
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* CTA Section */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-8 text-center">
                    <Wrench className="h-16 w-16 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                        Not Sure What's Wrong?
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-2xl mx-auto">
                        Use our price checker to select your device and issue, or book a free diagnostic to identify the problem.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/repair-price-checker"
                            className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                        >
                            Check Repair Price
                        </Link>
                        <Link
                            href="/book-repair?service=diagnostics"
                            className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors font-semibold"
                        >
                            Book Free Diagnostic
                        </Link>
                    </div>
                </div>
            </div>

            {/* Why Choose Us */}
            <div className="bg-neutral-50 dark:bg-neutral-800 py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-neutral-900 dark:text-white text-center mb-12">
                        Why Choose Max Fit IT?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                                Certified Technicians
                            </h3>
                            <p className="text-neutral-600 dark:text-neutral-400">
                                All repairs performed by factory-trained and certified professionals
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ShieldCheck className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                                Quality Parts
                            </h3>
                            <p className="text-neutral-600 dark:text-neutral-400">
                                OEM-quality parts with up to 12-month warranty on all repairs
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Clock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                                Fast Service
                            </h3>
                            <p className="text-neutral-600 dark:text-neutral-400">
                                Most repairs completed same-day, while you wait or shop nearby
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Testimonials */}
            <div className="container mx-auto px-4 py-16">
                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white text-center mb-12">
                    What Our Customers Say
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {TESTIMONIALS.map((testimonial, index) => (
                        <div key={index} className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
                            <div className="flex gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                                ))}
                            </div>
                            <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                                "{testimonial.review}"
                            </p>
                            <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
                                <p className="font-semibold text-neutral-900 dark:text-white">{testimonial.name}</p>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    {testimonial.location} • {testimonial.service}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Final CTA */}
            <div className="bg-blue-600 dark:bg-blue-700 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Ready to Fix Your Device?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Book your repair now and get your device back to perfect condition
                    </p>
                    <Link
                        href="/book-repair"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold text-lg"
                    >
                        Book a Repair Now
                        <ArrowRight className="h-6 w-6" />
                    </Link>
                </div>
            </div>
        </div>
    )
}
