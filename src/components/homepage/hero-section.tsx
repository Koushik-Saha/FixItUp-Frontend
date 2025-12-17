// src/components/homepage/hero-banner.tsx
'use client'
import Link from 'next/link'
import Image from 'next/image'

export function HeroBanner({ hero }: any) {
    return (
        <section className="relative bg-gradient-to-r from-indigo-600 via-blue-600 to-blue-500 overflow-hidden">
            <div className="container mx-auto px-4 py-16">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                    <div className="text-white space-y-6">
                        <div className="inline-block px-3 py-1 bg-red-600 rounded-full text-xs font-bold">
                            {hero.badge}
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                            {hero.title}
                        </h1>
                        <p className="text-lg text-blue-100">
                            {hero.subtitle}
                        </p>
                        <div className="flex gap-4">
                            {hero.buttons.map((btn: any, i: number) => (
                                <Link
                                    key={i}
                                    href={btn.link}
                                    className={`px-6 py-3 rounded-lg font-semibold ${
                                        btn.variant === 'primary'
                                            ? 'bg-red-600 hover:bg-red-700'
                                            : 'bg-white text-blue-600 hover:bg-gray-100'
                                    }`}
                                >
                                    {btn.text}
                                </Link>
                            ))}
                        </div>
                        <div className="flex gap-6 text-sm">
                            {hero.features.map((f: string, i: number) => (
                                <div key={i} className="flex items-center gap-2">
                                    <span>✓</span> <span>{f}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative h-80">
                        <Image src={hero.image} alt={hero.title} fill className="object-contain" />
                    </div>
                </div>
            </div>
        </section>
    )
}
