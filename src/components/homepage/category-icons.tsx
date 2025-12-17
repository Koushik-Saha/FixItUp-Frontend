// src/components/homepage/category-icons.tsx
import Link from 'next/link'

const colors: Record<string, string> = {
    red: 'bg-red-600', blue: 'bg-blue-600', orange: 'bg-orange-600',
    cyan: 'bg-cyan-600', purple: 'bg-purple-600', pink: 'bg-pink-600',
    green: 'bg-green-600', indigo: 'bg-indigo-600'
}

export function CategoryIcons({ categories }: any) {
    return (
        <section className="py-16 bg-gray-950">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-white text-center mb-12">
                    Shop by Category
                </h2>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-6 max-w-5xl mx-auto">
                    {categories.map((cat: any) => (
                        <Link key={cat.id} href={`/shop/${cat.slug}`} className="flex flex-col items-center group">
                            <div className={`w-16 h-16 ${colors[cat.color]} rounded-full flex items-center justify-center text-white text-2xl mb-2 group-hover:scale-110 transition`}>
                                {cat.icon}
                            </div>
                            <span className="text-sm text-white text-center group-hover:text-blue-400">
                {cat.name}
              </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
