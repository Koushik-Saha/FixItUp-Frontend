// src/components/homepage/cta-section.tsx
import Link from 'next/link'

export function CtaSection({ cta }: any) {
    return (
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold text-white mb-4">
                    {cta.title}
                </h2>
                <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                    {cta.subtitle}
                </p>
                <div className="flex justify-center gap-4">
                    {cta.buttons.map((btn: any, i: number) => (
                        <Link
                            key={i}
                            href={btn.link}
                            className={`px-6 py-3 rounded-lg font-semibold ${
                                btn.variant === 'primary'
                                    ? 'bg-white text-blue-600 hover:bg-gray-100'
                                    : 'bg-transparent border-2 border-white text-white hover:bg-white/10'
                            }`}
                        >
                            {btn.text}
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
