/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useState, useEffect } from 'react'
import { Search, MapPin, Navigation, ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'
import type { Store as PrismaStore } from '@prisma/client'

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

// Define Store interface based on usage and API
interface OperatingHours {
    open?: string;
    close?: string;
}

interface StoreHours {
    monday?: OperatingHours;
    tuesday?: OperatingHours;
    wednesday?: OperatingHours;
    thursday?: OperatingHours;
    friday?: OperatingHours;
    saturday?: OperatingHours;
    sunday?: OperatingHours;
}

interface Store {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    zip: string; // mapped
    distance: string; // mapped
    coordinates: { lat: number; lng: number }; // mapped
    operatingHours?: StoreHours;
    hours: {
        weekday: string;
        saturday: string;
        sunday: string;
    };
}

export default function StoreLocatorPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [expandedRegion, setExpandedRegion] = useState<number | null>(null)
    const [selectedStore, setSelectedStore] = useState<Store | null>(null)

    // Dynamic Data States
    const [stores, setStores] = useState<Store[]>([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(true)

    // Fetch stores

    // Helper to format time (09:00 -> 9:00 AM)
    const formatTime = (time: string | undefined) => {
        if (!time) return '';
        const [hours, minutes] = time.split(':');
        const h = parseInt(hours);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        return `${h12}:${minutes} ${ampm}`;
    };

    const formatHours = (hours: StoreHours | undefined) => {
        if (!hours) return {
            weekday: 'Mon-Fri: 9:00 AM - 7:00 PM',
            saturday: 'Saturday: 10:00 AM - 6:00 PM',
            sunday: 'Sunday: 11:00 AM - 5:00 PM',
        };

        // DB Format
        const mon = hours.monday || {};
        const sat = hours.saturday || {};
        const sun = hours.sunday || {};

        return {
            weekday: mon.open ? `Mon-Fri: ${formatTime(mon.open)} - ${formatTime(mon.close)}` : 'Mon-Fri: Closed',
            saturday: sat.open ? `Saturday: ${formatTime(sat.open)} - ${formatTime(sat.close)}` : 'Saturday: Closed',
            sunday: sun.open ? `Sunday: ${formatTime(sun.open)} - ${formatTime(sun.close)}` : 'Sunday: Closed',
        };
    };

    // Fetch stores
    useEffect(() => {
        const fetchStores = async () => {
            setLoading(true)
            try {
                const res = await fetch(`/api/stores?page=${page}&limit=10&query=${encodeURIComponent(searchQuery)}`)
                const data = await res.json()
                if (data.success) {
                    const mappedStores = data.data.map((s: PrismaStore): Store => ({
                        ...s,
                        zip: s.zipCode,
                        operatingHours: s.operatingHours as unknown as StoreHours,
                        distance: 'Calculating...',
                        coordinates: { lat: 34.0522, lng: -118.2437 }, // Mock coordinates for now
                        hours: formatHours(s.operatingHours as unknown as StoreHours)
                    }))
                    setStores(mappedStores)
                    setTotalPages(data.pagination.totalPages)

                    // Set selected store if none selected or not in list (optional)
                    if (mappedStores.length > 0 && !selectedStore) {
                        setSelectedStore(mappedStores[0])
                    }
                }
            } catch (error) {
                console.error("Failed to fetch stores", error)
            } finally {
                setLoading(false)
            }
        }

        const timeoutId = setTimeout(() => {
            fetchStores()
        }, 500)
        return () => clearTimeout(timeoutId)
    }, [page, searchQuery]) // Re-fetch on page or query change

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
                                    placeholder="Search location (e.g. Santa Barbara)"
                                    className="w-full px-4 py-3 pr-10 border-2 border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                                />
                                <button className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <Search className="h-5 w-5 text-neutral-400" />
                                </button>
                            </div>

                            {/* Info Text */}
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Near all stores will see whole range or if you&apos;re looking for a specific product, enter its name
                            </p>

                            {/* Store List */}
                            <div className="space-y-4">
                                {loading ? (
                                    <div className="text-center py-8 text-neutral-500">Loading stores...</div>
                                ) : stores.length === 0 ? (
                                    <div className="text-center py-8 text-neutral-500">No stores found.</div>
                                ) : (
                                    stores.map((store: Store) => (
                                        <button
                                            key={store.id}
                                            onClick={() => setSelectedStore(store)}
                                            className={`
                      w-full text-left p-4 rounded-lg border-2 transition-all
                      ${selectedStore?.id === store.id
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
                                    )))}
                            </div>

                            {/* Pagination */}
                            {!loading && totalPages > 1 && (
                                <div className="flex justify-center items-center gap-2 mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                                    <button
                                        disabled={page === 1}
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        className="px-3 py-1.5 border border-neutral-300 dark:border-neutral-600 rounded text-sm disabled:opacity-50 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                    >
                                        Prev
                                    </button>
                                    <span className="text-sm px-2 text-neutral-600 dark:text-neutral-400">
                                        Page {page} of {totalPages}
                                    </span>
                                    <button
                                        disabled={page >= totalPages}
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        className="px-3 py-1.5 border border-neutral-300 dark:border-neutral-600 rounded text-sm disabled:opacity-50 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Right Side - Map */}
                        <div className="h-[500px] bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden relative">
                            {selectedStore ? (
                                <iframe
                                    src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3304.8!2d${selectedStore.coordinates.lng}!3d${selectedStore.coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM!5e0!3m2!1sen!2sus!4v1234567890`}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-neutral-500">
                                    Select a store to view on map
                                </div>
                            )}
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
