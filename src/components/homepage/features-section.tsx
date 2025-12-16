// components/homepage/features-section.tsx
// Features/Benefits Section

import { Truck, Shield, CreditCard, Headphones } from 'lucide-react'

const features = [
    {
        icon: Truck,
        title: 'Free Shipping',
        description: 'On orders over $50',
    },
    {
        icon: Shield,
        title: 'Warranty Guarantee',
        description: '180-day warranty on all products',
    },
    {
        icon: CreditCard,
        title: 'Secure Payment',
        description: 'Multiple payment options',
    },
    {
        icon: Headphones,
        title: '24/7 Support',
        description: 'Dedicated customer service',
    },
]

export function FeaturesSection() {
    return (
        <section className="py-16 bg-gray-900 text-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon
                        return (
                            <div
                                key={index}
                                className="flex flex-col items-center text-center p-6"
                            >
                                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                                    <Icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                                <p className="text-gray-400 text-sm">{feature.description}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
