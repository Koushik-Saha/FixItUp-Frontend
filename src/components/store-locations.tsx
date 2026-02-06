'use client'

import { MapPin, Phone, Clock, Mail, Navigation } from 'lucide-react'
import Link from 'next/link'

// Static data removed

interface StoreTime {
    weekday: string
    saturday: string
    sunday: string
}

interface Store {
    id: number | string
    name: string
    address: string
    city: string
    state: string
    zipCode: string
    phone: string
    email: string
    operatingHours: StoreTime
    isActive: boolean
    featured?: boolean
    image?: string
    mapUrl?: string
}

interface StoreLocationsProps {
    stores: any[] // Using any to be flexible with DB type for now, or use mapped type
}

export function StoreLocations({ stores = [] }: StoreLocationsProps) {
    const formatTime = (time: string) => {
        if (!time) return '';
        const [hours, minutes] = time.split(':');
        const h = parseInt(hours);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        return `${h12}:${minutes} ${ampm}`;
    };

    const formatHours = (hours: any) => {
        if (!hours) return {
            weekday: 'Mon-Fri: 9:00 AM - 7:00 PM',
            saturday: 'Saturday: 10:00 AM - 6:00 PM',
            sunday: 'Sunday: 11:00 AM - 5:00 PM',
        };

        // If it's already the legacy format (fallback or static)
        if (hours.weekday) return hours;

        // DB Format: { monday: { open: '09:00', close: '19:00' }, ... }
        const mon = hours.monday || {};
        const sat = hours.saturday || {};
        const sun = hours.sunday || {};

        return {
            weekday: mon.open ? `Mon-Fri: ${formatTime(mon.open)} - ${formatTime(mon.close)}` : 'Mon-Fri: Closed',
            saturday: sat.open ? `Saturday: ${formatTime(sat.open)} - ${formatTime(sat.close)}` : 'Saturday: Closed',
            sunday: sun.open ? `Sunday: ${formatTime(sun.open)} - ${formatTime(sun.close)}` : 'Sunday: Closed',
        };
    };

    const displayStores = stores.map(s => ({
        ...s,
        mapUrl: s.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${s.address} ${s.city} ${s.state} ${s.zipCode}`)}`,
        hours: formatHours(s.operatingHours),
        zip: s.zipCode, // map zipCode to zip
    }));

    return (
        <section className="py-20 bg-neutral-50 dark:bg-neutral-950">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
                        Visit Our Stores
                    </h2>
                    <p className="text-lg text-neutral-600 dark:text-neutral-400">
                        We have {displayStores.length}+ locations across California and Nevada to serve you. Visit
                        us for professional phone repair, accessories, and wholesale
                        services.
                    </p>
                </div>

                {/* Store Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {displayStores.map((store) => (
                        <div
                            key={store.id}
                            className={`bg-white/95 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${store.featured ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''
                                }`}
                        >
                            {/* Store Image Placeholder */}
                            <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 relative">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <MapPin className="h-16 w-16 text-white/80" />
                                </div>
                                {store.featured && (
                                    <div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold shadow">
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
                                        <p>
                                            {store.city}, {store.state} {store.zip}
                                        </p>
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
                                        className="text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors break-all"
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
                                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors"
                                >
                                    <Navigation className="h-4 w-4" />
                                    Get Directions
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 lg:p-12 text-center text-white shadow-lg">
                    <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                        Can&apos;t Visit a Store? We Ship Nationwide!
                    </h3>
                    <p className="text-lg mb-6 text-blue-100">
                        Order online and get your phone parts and accessories delivered
                        anywhere in the US.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link
                            href="/shop"
                            className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold transition-colors"
                        >
                            Shop Online
                        </Link>
                        <Link
                            href="/stores"
                            className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                        >
                            View All Stores
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
