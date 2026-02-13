'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Mail } from 'lucide-react'

type CTAButton = {
    text: string
    link: string
    variant: 'primary' | 'secondary'
}

type CTAData = {
    title: string
    subtitle: string
    buttons: CTAButton[]
}

type CTASectionProps = {
    cta: CTAData
}

export function CTASection({ cta }: CTASectionProps) {
    if (!cta) return null

    return (
        <section className="py-16 md:py-24 bg-neutral-900 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10 text-center">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                    {cta.title}
                </h2>
                <p className="text-lg md:text-xl text-neutral-300 mb-10 max-w-2xl mx-auto">
                    {cta.subtitle}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    {cta.buttons.map((btn, index) => (
                        <Link key={index} href={btn.link}>
                            <Button
                                size="lg"
                                variant={btn.variant === 'primary' ? 'default' : 'outline'}
                                className={`
                                    h-12 px-8 text-lg
                                    ${btn.variant === 'primary'
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                        : 'border-white text-white hover:bg-white hover:text-neutral-900'}
                                `}
                            >
                                {btn.text}
                                {btn.variant === 'primary' && <ArrowRight className="ml-2 h-5 w-5" />}
                                {btn.variant === 'secondary' && <Mail className="ml-2 h-5 w-5" />}
                            </Button>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
