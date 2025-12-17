// src/components/homepage/why-shop.tsx
export function WhyShop({ features }: any) {
    return (
        <section className="py-16 bg-gray-950">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-white text-center mb-12">
                    Why Shop With Us
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((f: any, i: number) => (
                        <div key={i} className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                                {f.icon}
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                            <p className="text-gray-400 text-sm">{f.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
