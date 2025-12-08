'use client'

import { useState } from 'react'
import { Search, MapPin, Navigation, ChevronDown, ChevronUp } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

// Store locations data
const STORES = [
    {
        id: 1,
        name: 'Santa Barbara Store',
        address: '110 S Hope Ave Suite H 123',
        city: 'Santa Barbara',
        state: 'CA',
        zip: '93105',
        distance: '0.5 mi away',
        coordinates: { lat: 34.4208, lng: -119.6982 },
        phone: '(805) 555-0123'
    },
    {
        id: 2,
        name: 'Sports Basement - Campbell',
        address: '1875 South Bascom Ave Suite 240',
        city: 'Campbell',
        state: 'CA',
        zip: '95008',
        distance: '252.83 mi away',
        coordinates: { lat: 37.2872, lng: -121.9316 },
        phone: '(408) 555-0124'
    },
    {
        id: 3,
        name: 'Therapy Stores',
        address: '2145 Market Street',
        city: 'San Francisco',
        state: 'CA',
        zip: '94114',
        distance: '251.49 mi away',
        coordinates: { lat: 37.7749, lng: -122.4194 },
        phone: '(415) 555-0125'
    }
]

// As Seen In logos
const AS_SEEN_IN = [
    { name: 'Apple', logo: '/logos/apple.svg' },
    { name: 'Best Buy', logo: '/logos/bestbuy.svg' },
    { name: 'Rushfaster', logo: '/logos/rushfaster.svg' },
    { name: 'Milligram', logo: '/logos/milligram.svg' },
    { name: 'JB HI-FI', logo: '/logos/jbhifi.svg' },
    { name: 'Boarding Gate', logo: '/logos/boardinggate.svg' },
    { name: 'Nordstrom', logo: '/logos/nordstrom.svg' },
    { name: 'Selfridges', logo: '/logos/selfridges.svg' },
    { name: 'Te Koop', logo: '/logos/tekoop.svg' },
    { name: 'The Iconic', logo: '/logos/theiconic.svg' }
]

// Featured retailers
const FEATURED_RETAILERS = [
    {
        name: 'Apple',
        location: 'WORLDWIDE',
        image: '/images/retailers/apple-store.jpg',
        link: '/retailers/apple'
    },
    {
        name: 'Boarding Gate',
        location: 'MALAYSIA',
        image: '/images/retailers/boarding-gate.jpg',
        link: '/retailers/boarding-gate'
    },
    {
        name: 'David Jones',
        location: 'AUSTRALIA',
        image: '/images/retailers/david-jones.jpg',
        link: '/retailers/david-jones'
    },
    {
        name: 'Milligram',
        location: 'AUSTRALIA',
        image: '/images/retailers/milligram.jpg',
        link: '/retailers/milligram'
    },
    {
        name: 'Suburban',
        location: 'HONG KONG',
        image: '/images/retailers/suburban.jpg',
        link: '/retailers/suburban'
    },
    {
        name: 'Te Koop',
        location: 'CANADA',
        image: '/images/retailers/tekoop.jpg',
        link: '/retailers/tekoop'
    }
]

// Regional partners
const REGIONAL_PARTNERS = [
    {
        region: 'Australia and New Zealand',
        partners: ['Apple Store', 'David Jones', 'Milligram', 'Te Koop', 'The Iconic', 'Rushfaster']
    },
    {
        region: 'The Americas',
        partners: ['Apple Store', 'Best Buy', 'Nordstrom', 'Bloomingdales', 'Neiman Marcus']
    },
    {
        region: 'Asia-Pacific (APAC)',
        partners: ['JB HI-FI', 'Boarding Gate', 'Suburban', 'Harvey Norman', 'Courts']
    },
    {
        region: 'Europe, the Middle East, and Africa (EMEA)',
        partners: ['Apple Store', 'Selfridges', 'Harrods', 'Liberty London', 'El Corte Inglés']
    }
]

export default function StoreLocatorPage() {
    const [searchQuery, setSearchQuery] = useState('CA, US')
    const [expandedRegion, setExpandedRegion] = useState<number | null>(null)
    const [selectedStore, setSelectedStore] = useState(STORES[0])

    const toggleRegion = (index: number) => {
        setExpandedRegion(expandedRegion === index ? null : index)
    }

    return (
        <div className="min-h-screen bg-white dark:bg-neutral-900">

            {/* Find In Store Section */}
            <section className="border-b border-neutral-200 dark:border-neutral-800">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6">
                        FIND IN STORE
                    </h1>

                    <div className="grid lg:grid-cols-[350px_1fr] gap-6">

                        {/* Left Sidebar - Search & Store List */}
                        <div className="space-y-4">

                            {/* Search Input */}
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search location..."
                                    className="w-full px-4 py-3 pr-10 border-2 border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                                />
                                <button className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <Search className="h-5 w-5 text-neutral-400" />
                                </button>
                            </div>

                            {/* Info Text */}
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Near all stores will see whole range or if you're looking for a specific product, enter its name
                            </p>

                            {/* Store List */}
                            <div className="space-y-4">
                                {STORES.map((store) => (
                                    <button
                                        key={store.id}
                                        onClick={() => setSelectedStore(store)}
                                        className={`
                      w-full text-left p-4 rounded-lg border-2 transition-all
                      ${selectedStore.id === store.id
                                            ? 'border-neutral-900 dark:border-white bg-neutral-50 dark:bg-neutral-800'
                                            : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600'
                                        }
                    `}
                                    >
                                        <div className="flex items-start gap-3">
                                            <MapPin className="h-5 w-5 text-neutral-900 dark:text-white flex-shrink-0 mt-1" />
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">
                                                    {store.name}
                                                </h3>
                                                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                                                    {store.distance}
                                                </p>
                                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                                    {store.address}<br />
                                                    {store.city}, {store.state} {store.zip}
                                                </p>
                                                <a
                                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${store.address} ${store.city} ${store.state} ${store.zip}`)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 mt-2"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Navigation className="h-3 w-3" />
                                                    Get directions
                                                </a>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right Side - Map */}
                        <div className="h-[500px] bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden">
                            <iframe
                                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3304.8!2d${selectedStore.coordinates.lng}!3d${selectedStore.coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM!5e0!3m2!1sen!2sus!4v1234567890`}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* As Seen In Section */}
            <section className="py-12 bg-neutral-50 dark:bg-neutral-800">
                <div className="container mx-auto px-4">
                    <h2 className="text-center text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-8 tracking-wider">
                        As seen in
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center">
                        {AS_SEEN_IN.map((brand, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-center h-12 grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100"
                            >
                                {/* Placeholder - Replace with actual logos */}
                                <div className="text-neutral-400 dark:text-neutral-500 font-semibold text-sm">
                                    {brand.name}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Luggage Launch Partners */}
            <section className="py-16 bg-white dark:bg-neutral-900">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-center text-neutral-900 dark:text-white mb-8">
                        Luggage launch partners
                    </h2>

                    <div className="max-w-3xl mx-auto space-y-4">
                        {REGIONAL_PARTNERS.map((regional, index) => (
                            <div
                                key={index}
                                className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden"
                            >
                                <button
                                    onClick={() => toggleRegion(index)}
                                    className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                                >
                  <span className="font-medium text-neutral-900 dark:text-white">
                    {regional.region}
                  </span>
                                    {expandedRegion === index ? (
                                        <ChevronUp className="h-5 w-5 text-neutral-500" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-neutral-500" />
                                    )}
                                </button>
                                {expandedRegion === index && (
                                    <div className="p-4 pt-0 border-t border-neutral-200 dark:border-neutral-700">
                                        <ul className="grid md:grid-cols-2 gap-2 mt-4">
                                            {regional.partners.map((partner, pIndex) => (
                                                <li
                                                    key={pIndex}
                                                    className="text-sm text-neutral-600 dark:text-neutral-400"
                                                >
                                                    • {partner}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Retailers */}
            <section className="py-16 bg-neutral-50 dark:bg-neutral-800">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-center text-neutral-900 dark:text-white mb-12">
                        Featured retailers
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {FEATURED_RETAILERS.map((retailer, index) => (
                            <Link
                                key={index}
                                href={retailer.link}
                                className="group bg-white dark:bg-neutral-900 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all"
                            >
                                {/* Image Placeholder */}
                                <div className="h-64 bg-gradient-to-br from-blue-400 to-purple-500 relative overflow-hidden">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-white text-6xl font-bold opacity-20">
                                            {retailer.name[0]}
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                </div>

                                {/* Info */}
                                <div className="p-6">
                                    <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-2 tracking-wider">
                                        {retailer.location}
                                    </p>
                                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                                        {retailer.name}
                                    </h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-16 bg-white dark:bg-neutral-900">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto text-center">
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                            Want subscriber-only deals? Special gifts? Early access?
                        </h2>
                        <form className="flex gap-2 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email to register"
                                className="flex-1 px-4 py-3 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg font-semibold hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors"
                            >
                                SIGN UP
                            </button>
                        </form>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-4">
                            We are signing you up for special updates and reminders. By opting in, you consent to receive recurring automated promotional emails.
                        </p>
                    </div>
                </div>
            </section>

            {/* Stockist CTA */}
            <section className="py-12 bg-neutral-50 dark:bg-neutral-800 text-center">
                <div className="container mx-auto px-4">
                    <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                        Interested in becoming a Max Fit IT stockist?{' '}
                        <Link href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                            Get in touch
                        </Link>
                    </p>
                </div>
            </section>

        </div>
    )
}
