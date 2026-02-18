/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { HeroCarousel } from "@/components/hero-carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Star, Truck, Shield, RotateCcw, Smartphone } from "lucide-react";
import FlashDeals from "@/components/layout/flash-deals";
import DeviceFinder from "@/components/device-finder";
import RecentlyViewedProducts from "@/components/recently-viewed-products";
import { Newsletter } from "@/components/newsletter";
import { headers } from "next/headers";
import TopBrand from "@/components/layout/top-brand";
import { StoreLocations } from "@/components/store-locations";
import ShopByCategory from "@/components/layout/shop-by-category";
import { CTASection } from "@/components/layout/cta-section";
import ProductGrid from "@/components/product/product-grid";

export const dynamic = "force-dynamic";

async function getHomepageData() {
    try {
        const h = await headers();
        const host = h.get("host");
        const proto = h.get("x-forwarded-proto") ?? "https";

        if (!host) throw new Error("Missing host header");

        const url = `${proto}://${host}/api/homepage`;

        const res = await fetch(url, {
            next: { revalidate: 60 }, // Check for new deals every minute
        });

        if (!res.ok) {
            const text = await res.text().catch(() => "");
            throw new Error(`Homepage API failed: ${res.status} ${text}`);
        }

        const json = await res.json();
        return json.data ?? null;
    } catch (error) {
        console.error("Homepage error:", error);
        return null;
    }
}

export default async function HomePage() {
    const data = await getHomepageData();

    return (
        <section>
            {/* Hero Carousel */}
            <HeroCarousel slides={data?.hero || []} />

            {/* Device Finder */}
            <div className="container mx-auto px-4 py-8 md:py-12">
                <DeviceFinder />
            </div>

            {/* Shop By Category */}
            {data?.categories?.length ? (
                <ShopByCategory categories={data.categories} />
            ) : null}

            {/* Flash Deals (expects object) */}
            {data?.flashDeals ? <FlashDeals flashDeals={data.flashDeals} /> : null}

            {/* Recently Viewed Products */}
            <div className="container mx-auto px-4 py-8 md:py-12">
                <RecentlyViewedProducts limit={8} />
            </div>

            {/* New Arrivals */}
            {data?.newArrivals?.length ? (
                <ProductGrid
                    title="New Arrivals"
                    products={data.newArrivals}
                />
            ) : null}

            {/* Top Brands */}
            {data?.brands?.length ? <TopBrand topBrands={data.brands} /> : null}

            {/* CTA Section */}
            {data?.cta ? <CTASection cta={data.cta} /> : null}

            {/* Store Locations */}
            <StoreLocations stores={data?.stores || []} />

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
            <Newsletter />
        </section>
    );
}
