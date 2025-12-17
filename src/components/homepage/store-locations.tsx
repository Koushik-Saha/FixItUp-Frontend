// src/components/homepage/store-locations.tsx
import Link from 'next/link'

export function StoreLocations({ stores }: any) {
    return (
        <section className="py-16 bg-gray-900">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-white mb-4">Visit Our Stores</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        We have 6 locations across California and Nevada to serve you. Walk in for free phone repair quotes, or book online today!
                    </p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stores.map((store: any) => (
                        <div key={store.id} className="relative bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg p-6 overflow-hidden">
              <span className="absolute top-4 right-4 px-2 py-1 bg-yellow-400 text-black text-xs font-bold rounded">
                {store.badge}
              </span>
                            <div className="mb-4">
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{store.name}</h3>
                            </div>
                            <div className="space-y-2 text-white/90 text-sm mb-4">
                                <p>📍 {store.address}</p>
                                <p>{store.city}</p>
                                <p>📞 {store.phone}</p>
                            </div>
                            <div className="space-y-1 text-white/80 text-xs mb-4">
                                <p><strong>Store Hours:</strong></p>
                                <p>{store.hours.weekday}</p>
                                <p>{store.hours.saturday}</p>
                                <p>{store.hours.sunday}</p>
                            </div>
                            <Link
                                href={`/stores/${store.id}`}
                                className="block w-full py-2 bg-white hover:bg-gray-100 text-center text-indigo-600 font-semibold rounded-lg transition"
                            >
                                Get Directions
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
