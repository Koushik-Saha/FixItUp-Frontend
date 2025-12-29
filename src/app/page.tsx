import { HeroCarousel } from '@/components/hero-carousel'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Payment } from '@/components/layout/payment'
import { StoreLocations } from '@/components/store-locations'
import ShopByCategory from "@/components/layout/shop-by-category";
import TopBrand from "@/components/layout/top-brand";
import FlashDeals from "@/components/layout/flash-deals";

export const dynamic = 'force-dynamic'


async function getHomepageData() {
    try {
        const res = await fetch('/api/homepage', { next: { revalidate: 300 } })

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

    console.log("homepagedata", data)

    return (
        <section>
            {/* Hero Carousel */}
            <HeroCarousel />

            {/* Shop By Category */}
            {
                data && data?.categories && <ShopByCategory categories={data?.categories ?? []} />
            }

            {/* Flash Deals */}
            {
                data && data?.flashDeals && <FlashDeals flashDeals={data?.flashDeals ?? []}/>
            }

            {/* Top Brands */}
            {
                data && data?.brands && <TopBrand  topBrands={data?.brands ?? []}/>
            }

            {/* Store Locations */}
            <StoreLocations />

            {/* Why Shop With Us */}
            <section className="py-8 md:py-10 lg:py-12 bg-white dark:bg-neutral-950">
                <div className="container px-4 mx-auto">
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6 lg:mb-8 text-center">
                        Why Shop With Us
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
                        <Card className="text-center bg-white/95 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 hover:shadow-lg transition-shadow">
                            <CardContent className="p-4 md:p-5 lg:p-6">
                                <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 text-2xl md:text-3xl">
                                    🚚
                                </div>
                                <h3 className="font-bold text-sm md:text-base lg:text-lg mb-2">
                                    Free Shipping
                                </h3>
                                <p className="text-neutral-600 dark:text-neutral-400 text-xs md:text-sm">
                                    On all orders over $50
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center bg-white/95 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 hover:shadow-lg transition-shadow">
                            <CardContent className="p-4 md:p-5 lg:p-6">
                                <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 text-2xl md:text-3xl">
                                    🛡️
                                </div>
                                <h3 className="font-bold text-sm md:text-base lg:text-lg mb-2">
                                    Secure Payment
                                </h3>
                                <p className="text-neutral-600 dark:text-neutral-400 text-xs md:text-sm">
                                    100% secure
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center bg-white/95 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 hover:shadow-lg transition-shadow">
                            <CardContent className="p-4 md:p-5 lg:p-6">
                                <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 text-2xl md:text-3xl">
                                    ⭐
                                </div>
                                <h3 className="font-bold text-sm md:text-base lg:text-lg mb-2">
                                    Top Quality
                                </h3>
                                <p className="text-neutral-600 dark:text-neutral-400 text-xs md:text-sm">
                                    Authentic products
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center bg-white/95 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 hover:shadow-lg transition-shadow">
                            <CardContent className="p-4 md:p-5 lg:p-6">
                                <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 text-2xl md:text-3xl">
                                    💰
                                </div>
                                <h3 className="font-bold text-sm md:text-base lg:text-lg mb-2">
                                    Best Prices
                                </h3>
                                <p className="text-neutral-600 dark:text-neutral-400 text-xs md:text-sm">
                                    Unbeatable deals
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="py-8 md:py-10 lg:py-12 bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="container px-4 mx-auto">
                    <div className="text-center text-white max-w-2xl mx-auto">
                        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4">
                            Get Exclusive Deals
                        </h2>
                        <p className="text-sm md:text-base lg:text-lg mb-4 md:mb-6 opacity-90">
                            Subscribe and get 10% off your first order
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-2.5 md:py-3 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-white text-sm md:text-base"
                            />
                            <Button
                                size="lg"
                                className="bg-white text-blue-600 hover:bg-neutral-100 font-bold h-10 md:h-12 text-sm md:text-base"
                            >
                                Subscribe
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <Payment />
        </section>
    )
}
