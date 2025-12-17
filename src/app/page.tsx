// app/page.tsx
// Dynamic Homepage - Server Component

import { HeroSection } from '@/components/homepage/hero-section'
import { CategoriesSection } from '@/components/homepage/categories-section'
import { FlashDealsSection } from '@/components/homepage/flash-deals-section'
import { NewArrivalsSection } from '@/components/homepage/new-arrivals-section'
import { FeaturesSection } from '@/components/homepage/features-section'

interface HomepageData {
  hero: {
    banners: Array<{
      id: string
      title: string
      subtitle: string
      imageUrl: string
      linkUrl: string
      buttonText: string
    }>
  }
  categories: Array<{
    id: string
    name: string
    slug: string
    imageUrl: string
    productCount: number
  }>
  flashDeals: Array<{
    id: string
    name: string
    slug: string
    imageUrl: string
    basePrice: number
    discountPercentage: number
    endsAt: string
  }>
  newArrivals: Array<{
    id: string
    name: string
    slug: string
    imageUrl: string
    basePrice: number
    isNew: boolean
  }>
}

async function getHomepageData(): Promise<HomepageData | null> {
  try {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/homepage`,
        {
          next: { revalidate: 300 }, // Revalidate every 5 minutes
        }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch homepage data')
    }

    const { data } = await response.json()
    return data
  } catch (error) {
    console.error('Homepage data fetch error:', error)
    return null
  }
}

export default async function HomePage() {
  const data = await getHomepageData()

  if (!data) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Unable to load homepage
            </h2>
            <p className="text-gray-600">Please try again later</p>
          </div>
        </div>
    )
  }

  return (
      <main>
        {/* Hero Carousel */}
        <HeroSection banners={data.hero.banners} />

        {/* Shop by Category */}
        <CategoriesSection categories={data.categories} />

        {/* Flash Deals */}
        {data.flashDeals.length > 0 && (
            <FlashDealsSection deals={data.flashDeals} />
        )}

        {/* New Arrivals */}
        {data.newArrivals.length > 0 && (
            <NewArrivalsSection products={data.newArrivals} />
        )}

        {/* Features */}
        <FeaturesSection />
      </main>
  )
}
