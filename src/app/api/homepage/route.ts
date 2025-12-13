// app/api/homepage/route.ts
// Get complete homepage data

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { errorResponse } from '@/lib/utils/errors'

// GET /api/homepage - Get all homepage sections
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()

        // Check if user is wholesale for pricing
        const { data: { user } } = await supabase.auth.getUser()
        let userRole = null
        let wholesaleTier = null

        if (user) {
            const { data: profile } = await (supabase as any)
                .from('profiles')
                .select('role, wholesale_tier')
                .eq('id', user.id)
                .single()

            userRole = profile?.role
            wholesaleTier = profile?.wholesale_tier
        }

        // 1. Get Hero/Carousel Banners
        const { data: banners } = await supabase
            .from('homepage_banners')
            .select('*')
            .eq('is_active', true)
            .order('sort_order', { ascending: true })

        // 2. Get Categories with product counts
        const { data: categories } = await supabase
            .from('categories')
            .select(`
        id,
        name,
        slug,
        description,
        image_url,
        icon,
        products(count)
      `)
            .eq('is_active', true)
            .order('name', { ascending: true })

        const categoriesWithCount = categories?.map(cat => ({
            ...(cat as any),
            product_count: (cat as any).products?.[0]?.count || 0,
        }))

        // 3. Get Flash Deals (featured products)
        const { data: flashDeals } = await (supabase as any)
            .from('products')
            .select(`
        id,
        name,
        slug,
        sku,
        description,
        base_price,
        wholesale_tier1_discount,
        wholesale_tier2_discount,
        wholesale_tier3_discount,
        image_url,
        is_featured,
        categories(id, name, slug)
      `)
            .eq('is_active', true)
            .eq('is_featured', true)
            .order('created_at', { ascending: false })
            .limit(8)

        // Calculate pricing for flash deals
        const flashDealsWithPricing = flashDeals?.map((product: any) => {
            let displayPrice = product.base_price
            let discountPercentage = 0

            if (userRole === 'wholesale') {
                switch (wholesaleTier) {
                    case 'tier1':
                        discountPercentage = product.wholesale_tier1_discount
                        break
                    case 'tier2':
                        discountPercentage = product.wholesale_tier2_discount
                        break
                    case 'tier3':
                        discountPercentage = product.wholesale_tier3_discount
                        break
                }
                displayPrice = product.base_price * (1 - discountPercentage / 100)
            }

            return {
                ...product,
                displayPrice: Number(displayPrice.toFixed(2)),
                originalPrice: product.base_price,
                discountPercentage,
                isWholesale: userRole === 'wholesale',
            }
        })

        // 4. Get New Arrivals
        const { data: newArrivals } = await supabase
            .from('products')
            .select(`
        id,
        name,
        slug,
        sku,
        base_price,
        wholesale_tier1_discount,
        wholesale_tier2_discount,
        wholesale_tier3_discount,
        image_url,
        categories(id, name, slug)
      `)
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(4)

        // Calculate pricing for new arrivals
        const newArrivalsWithPricing = newArrivals?.map((product: any) => {
            let displayPrice = product.base_price
            let discountPercentage = 0

            if (userRole === 'wholesale') {
                switch (wholesaleTier) {
                    case 'tier1':
                        discountPercentage = product.wholesale_tier1_discount
                        break
                    case 'tier2':
                        discountPercentage = product.wholesale_tier2_discount
                        break
                    case 'tier3':
                        discountPercentage = product.wholesale_tier3_discount
                        break
                }
                displayPrice = product.base_price * (1 - discountPercentage / 100)
            }

            return {
                ...product,
                displayPrice: Number(displayPrice.toFixed(2)),
                originalPrice: product.base_price,
                discountPercentage,
                isWholesale: userRole === 'wholesale',
            }
        })

        // 5. Get Homepage Settings
        const { data: settings } = await supabase
            .from('homepage_settings')
            .select('*')
            .single()

        return NextResponse.json({
            data: {
                hero: {
                    banners: banners || [],
                    autoplay: (settings as any)?.hero_autoplay ?? true,
                    interval: (settings as any)?.hero_interval ?? 5000,
                },
                categories: categoriesWithCount || [],
                flashDeals: {
                    title: (settings as any)?.flash_deals_title || 'Flash Deals',
                    subtitle: (settings as any)?.flash_deals_subtitle || 'Limited time offers',
                    products: flashDealsWithPricing || [],
                },
                newArrivals: {
                    title: (settings as any)?.new_arrivals_title || 'New Arrivals',
                    subtitle: (settings as any)?.new_arrivals_subtitle || 'Just landed',
                    products: newArrivalsWithPricing || [],
                },
                features: [
                    {
                        icon: 'Truck',
                        title: 'Free Shipping',
                        description: 'On orders over $50',
                    },
                    {
                        icon: 'Shield',
                        title: '90-Day Warranty',
                        description: 'Quality guaranteed',
                    },
                    {
                        icon: 'Clock',
                        title: 'Fast Turnaround',
                        description: 'Same-day repairs available',
                    },
                    {
                        icon: 'Award',
                        title: 'Expert Service',
                        description: 'Certified technicians',
                    },
                ],
            },
        })

    } catch (error) {
        console.error('Homepage fetch error:', error)
        return errorResponse(error)
    }
}
