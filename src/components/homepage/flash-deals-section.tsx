// components/homepage/flash-deals-section.tsx
// Flash Deals Section with Countdown

'use client'

import { useState, useEffect } from 'react'
import { ProductCard } from '../ui/product-card'
import { Clock } from 'lucide-react'

interface Deal {
    id: string
    name: string
    slug: string
    imageUrl: string
    basePrice: number
    discountPercentage: number
    endsAt: string
}

interface FlashDealsSectionProps {
    deals: Deal[]
}

export function FlashDealsSection({ deals }: FlashDealsSectionProps) {
    const [timeLeft, setTimeLeft] = useState('')

    useEffect(() => {
        const calculateTimeLeft = () => {
            if (deals.length === 0) return ''

            const end = new Date(deals[0].endsAt).getTime()
            const now = new Date().getTime()
            const distance = end - now

            if (distance < 0) return 'Ended'

            const hours = Math.floor(distance / (1000 * 60 * 60))
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((distance % (1000 * 60)) / 1000)

            return `${hours}h ${minutes}m ${seconds}s`
        }

        setTimeLeft(calculateTimeLeft())

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft())
        }, 1000)

        return () => clearInterval(timer)
    }, [deals])

    return (
        <section className="py-16 bg-red-50">
            <div className="container mx-auto px-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-red-600 text-white text-sm font-bold rounded-full">
                🔥 FLASH DEALS
              </span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">Limited Time Offers</h2>
                        <p className="text-gray-600 mt-2">Don't miss out on these deals!</p>
                    </div>

                    {timeLeft && timeLeft !== 'Ended' && (
                        <div className="flex items-center gap-2 px-6 py-3 bg-white rounded-lg shadow-sm">
                            <Clock className="w-5 h-5 text-red-600" />
                            <div>
                                <p className="text-xs text-gray-500 uppercase">Ends in</p>
                                <p className="text-lg font-bold text-red-600">{timeLeft}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {deals.map((deal) => (
                        <ProductCard
                            key={deal.id}
                            product={{
                                ...deal,
                                displayPrice: deal.basePrice * (1 - deal.discountPercentage / 100),
                            }}
                            showDiscount
                            dealBadge="FLASH DEAL"
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}
