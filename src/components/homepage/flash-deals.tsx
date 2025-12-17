// src/components/homepage/flash-deals.tsx
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export function FlashDeals({ deals }: any) {
    const [time, setTime] = useState('')

    useEffect(() => {
        const timer = setInterval(() => {
            const end = new Date(deals.endsAt).getTime()
            const now = Date.now()
            const diff = end - now
            if (diff < 0) return setTime('Ended')
            const h = Math.floor(diff / 3600000)
            const m = Math.floor((diff % 3600000) / 60000)
            const s = Math.floor((diff % 60000) / 1000)
            setTime(`${h.toString().padStart(2, '0')} : ${m.toString().padStart(2, '0')} : ${s.toString().padStart(2, '0')}`)
        }, 1000)
        return () => clearInterval(timer)
    }, [deals.endsAt])

    return (
        <section className="py-16 bg-gray-900">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full">
              FLASH DEAL
            </span>
                        <h2 className="text-2xl font-bold text-white">{deals.title}</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-white text-sm">Ends In:</span>
                        <div className="px-4 py-2 bg-gray-800 rounded-lg">
                            <span className="text-red-500 font-mono font-bold">{time}</span>
                        </div>
                        <Link href="/deals" className="text-blue-400 hover:text-blue-300 font-semibold">
                            See All →
                        </Link>
                    </div>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {deals.products.map((p: any) => (
                        <div key={p.id} className="bg-gray-800 rounded-lg overflow-hidden group hover:ring-2 hover:ring-blue-500">
                            <div className="relative">
                <span className="absolute top-2 left-2 px-2 py-1 bg-red-600 text-white text-xs font-bold rounded z-10">
                  SALE
                </span>
                                <span className="absolute top-2 right-2 px-2 py-1 bg-cyan-500 text-white text-xs font-bold rounded z-10">
                  -{p.discount}%
                </span>
                                <Link href={`/products/${p.slug}`}>
                                    <div className="relative h-48 bg-cyan-400">
                                        <Image src={p.image} alt={p.name} fill className="object-contain p-4" />
                                    </div>
                                </Link>
                            </div>
                            <div className="p-4">
                                <Link href={`/products/${p.slug}`}>
                                    <h3 className="text-white font-semibold mb-2 line-clamp-2 hover:text-blue-400">
                                        {p.name}
                                    </h3>
                                </Link>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className={`w-4 h-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                            </svg>
                                        ))}
                                    </div>
                                    <span className="text-gray-400 text-sm">({p.reviews})</span>
                                </div>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-2xl font-bold text-white">${p.price}</span>
                                    <span className="text-sm text-gray-500 line-through">${p.originalPrice}</span>
                                </div>
                                <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
