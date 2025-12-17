// src/app/page.tsx
// Dynamic Homepage - Fetches from API

import { CategoryIcons } from '@/components/homepage/category-icons'
import { FlashDeals } from '@/components/homepage/flash-deals'
import { TopBrands } from '@/components/homepage/top-brands'
import { StoreLocations } from '@/components/homepage/store-locations'
import { CtaSection } from '@/components/homepage/cta-section'
import { WhyShop } from '@/components/homepage/why-shop'
import { Newsletter } from '@/components/homepage/newsletter'
import {HeroBanner} from "@/components/homepage/hero-section";

async function getHomepageData() {
  try {
    const url = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/homepage`
    const res = await fetch(url, { next: { revalidate: 300 } })

    if (!res.ok) throw new Error('Failed to fetch')

    const { data } = await res.json()
    return data
  } catch (error) {
    console.error('Homepage error:', error)
    return null
  }
}

export default async function HomePage() {
  const data = await getHomepageData()

  if (!data) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">
              Unable to load homepage
            </h2>
            <p className="text-gray-400">Please try again later</p>
          </div>
        </div>
    )
  }

  console.log(data)

  return (
      <main className="bg-gray-950">
        <HeroBanner hero={data.hero} />
        <CategoryIcons categories={data.categories} />
        <FlashDeals deals={data.flashDeals} />
        <TopBrands brands={data.brands} />
        <StoreLocations stores={data.stores} />
        <CtaSection cta={data.cta} />
        <WhyShop features={data.features} />
        <Newsletter />
      </main>
  )
}
