'use client'

import { MapPin, Phone, Clock, Mail, Navigation } from 'lucide-react'
import Link from 'next/link'

const STORE_LOCATIONS = [
    {
        id: 1,
        name: 'Santa Barbara Store',
        address: '110 S Hope Ave Suite H 123',
        city: 'Santa Barbara',
        state: 'CA',
        zip: '93105',
        phone: '(805) 555-0123',
        email: 'santabarbara@maxfitit.com',
        hours: {
            weekday: 'Mon-Fri: 9:00 AM - 7:00 PM',
            saturday: 'Saturday: 10:00 AM - 6:00 PM',
            sunday: 'Sunday: 11:00 AM - 5:00 PM'
        },
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=110+S+Hope+Ave+Suite+H+123+Santa+Barbara+CA+93105',
        image: '/images/stores/santa-barbara.jpg',
        featured: true
    },
    {
        id: 2,
        name: 'Los Angeles - Downtown',
        address: '725 S Broadway',
        city: 'Los Angeles',
        state: 'CA',
        zip: '90014',
        phone: '(213) 555-0124',
        email: 'losangeles@maxfitit.com',
        hours: {
            weekday: 'Mon-Fri: 9:00 AM - 8:00 PM',
            saturday: 'Saturday: 10:00 AM - 7:00 PM',
            sunday: 'Sunday: 11:00 AM - 6:00 PM'
        },
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=725+S+Broadway+Los+Angeles+CA+90014',
        image: '/images/stores/los-angeles.jpg'
    },
    {
        id: 3,
        name: 'San Francisco Store',
        address: '1455 Market Street Suite 210',
        city: 'San Francisco',
        state: 'CA',
        zip: '94103',
        phone: '(415) 555-0125',
        email: 'sanfrancisco@maxfitit.com',
        hours: {
            weekday: 'Mon-Fri: 9:00 AM - 7:00 PM',
            saturday: 'Saturday: 10:00 AM - 6:00 PM',
            sunday: 'Sunday: 11:00 AM - 5:00 PM'
        },
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=1455+Market+Street+San+Francisco+CA+94103',
        image: '/images/stores/san-francisco.jpg'
    },
    {
        id: 4,
        name: 'Las Vegas Store',
        address: '3200 Las Vegas Blvd S Suite 150',
        city: 'Las Vegas',
        state: 'NV',
        zip: '89109',
        phone: '(702) 555-0126',
        email: 'lasvegas@maxfitit.com',
        hours: {
            weekday: 'Mon-Fri: 10:00 AM - 9:00 PM',
            saturday: 'Saturday: 10:00 AM - 9:00 PM',
            sunday: 'Sunday: 11:00 AM - 7:00 PM'
        },
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=3200+Las+Vegas+Blvd+S+Las+Vegas+NV+89109',
        image: '/images/stores/las-vegas.jpg'
    },
    {
        id: 5,
        name: 'San Diego Store',
        address: '940 Broadway Suite 102',
        city: 'San Diego',
        state: 'CA',
        zip: '92101',
        phone: '(619) 555-0127',
        email: 'sandiego@maxfitit.com',
        hours: {
            weekday: 'Mon-Fri: 9:00 AM - 7:00 PM',
            saturday: 'Saturday: 10:00 AM - 6:00 PM',
            sunday: 'Sunday: 11:00 AM - 5:00 PM'
        },
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=940+Broadway+San+Diego+CA+92101',
        image: '/images/stores/san-diego.jpg'
    },
    {
        id: 6,
        name: 'Sacramento Store',
        address: '1689 Arden Way Suite 125',
        city: 'Sacramento',
        state: 'CA',
        zip: '95815',
        phone: '(916) 555-0128',
        email: 'sacramento@maxfitit.com',
        hours: {
            weekday: 'Mon-Fri: 9:00 AM - 7:00 PM',
            saturday: 'Saturday: 10:00 AM - 6:00 PM',
            sunday: 'Sunday: 11:00 AM - 5:00 PM'
        },
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=1689+Arden+Way+Sacramento+CA+95815',
        image: '/images/stores/sacramento.jpg'
    }
]

export function StoreLocations() {
    return (
        <section className="py-20 bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-950">
            <div className="container mx-auto px-4">

                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
                        Visit Our Stores
                    </h2>
                    <p className="text-lg text-neutral-600 dark:text-neutral-400">
                        We have 6 locations across California and Nevada to serve you. Visit us for professional phone repair, accessories, and wholesale services.
                    </p>
                </div>

                {/* Store Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {STORE_LOCATIONS.map((store) => (
                        <div
                            key={store.id}
                            className={`
                bg-white dark:bg-neutral-800 rounded-xl shadow-lg overflow-hidden 
                hover:shadow-2xl transition-all duration-300 hover:-translate-y-1
                ${store.featured ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}
              `}
                        >
                            {/* Store Image Placeholder */}
                            <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <MapPin className="h-16 w-16 text-white opacity-50" />
                                </div>
                                {store.featured && (
                                    <div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold">
                                        Flagship Store
                                    </div>
                                )}
                            </div>

                            {/* Store Info */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
                                    {store.name}
                                </h3>

                                {/* Address */}
                                <div className="flex items-start gap-3 mb-3">
                                    <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                    <div className="text-neutral-700 dark:text-neutral-300 text-sm">
                                        <p>{store.address}</p>
                                        <p>{store.city}, {store.state} {store.zip}</p>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="flex items-center gap-3 mb-3">
                                    <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                    <a
                                        href={`tel:${store.phone.replace(/[^0-9]/g, '')}`}
                                        className="text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors"
                                    >
                                        {store.phone}
                                    </a>
                                </div>

                                {/* Email */}
                                <div className="flex items-center gap-3 mb-4">
                                    <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                    <a
                                        href={`mailto:${store.email}`}
                                        className="text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors"
                                    >
                                        {store.email}
                                    </a>
                                </div>

                                {/* Hours */}
                                <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4 mb-4">
                                    <div className="flex items-start gap-3">
                                        <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                        <div className="text-sm text-neutral-700 dark:text-neutral-300">
                                            <p className="font-semibold mb-1">Store Hours:</p>
                                            <p>{store.hours.weekday}</p>
                                            <p>{store.hours.saturday}</p>
                                            <p>{store.hours.sunday}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Get Directions Button */}
                                <a
                                    href={store.mapUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
                                >
                                    <Navigation className="h-4 w-4" />
                                    Get Directions
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 lg:p-12 text-center text-white">
                    <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                        Can't Visit a Store? We Ship Nationwide!
                    </h3>
                    <p className="text-lg mb-6 text-blue-100">
                        Order online and get your phone parts and accessories delivered anywhere in the US.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link
                            href="/shop"
                            className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold transition-colors"
                        >
                            Shop Online
                        </Link>
                        <Link
                            href="/contact"
                            className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>

            </div>
        </section>
    )
}
