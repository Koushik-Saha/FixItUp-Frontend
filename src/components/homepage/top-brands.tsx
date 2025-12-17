// src/components/homepage/top-brands.tsx
export function TopBrands({ brands }: any) {
    return (
        <section className="py-16 bg-gray-950">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
          <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full">
            BRANDS
          </span>
                    <h2 className="text-2xl font-bold text-white">Top Brands</h2>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-8">
                    {brands.map((brand: any, i: number) => (
                        <div key={i} className="flex flex-col items-center group">
                            <div className="w-20 h-20 bg-gray-800 rounded-lg flex items-center justify-center text-4xl group-hover:bg-gray-700 transition">
                                {brand.logo}
                            </div>
                            <span className="text-sm text-gray-400 mt-2">{brand.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
