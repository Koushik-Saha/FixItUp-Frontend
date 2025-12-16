// src/app/api/homepage/route.ts
// UPDATED - Get complete homepage data matching database schema

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
        const { data: banners } = await (supabase as any)
            .from('homepage_banners')
            .select('*')
            .eq('is_active', true)
            .order('sort_order', { ascending: true })

        // Format banners for frontend
        const formattedBanners = (banners || []).map((banner: any) => ({
            id: banner.id,
            title: banner.title,
            subtitle: banner.subtitle || '',
            imageUrl: banner.image_url,
            linkUrl: banner.link_url || '#',
            buttonText: banner.button_text || 'Shop Now',
        }))

        // 2. Get Categories with product counts and image
        const { data: rawCategories } = await (supabase as any)
            .from('categories')
            .select(`
                id,
                name,
                slug,
                description,
                image_url,
                icon
            `)
            .eq('is_active', true)
            .is('parent_id', null)
            .order('sort_order', { ascending: true })
            .limit(8)

        // Get product counts for each category
        const categoriesWithCount = await Promise.all(
            (rawCategories || []).map(async (cat:any) => {
                const { count } = await supabase
                    .from('products')
                    .select('*', { count: 'exact', head: true })
                    .eq('category_id', cat.id)
                    .eq('is_active', true)

                return {
                    id: cat.id,
                    name: cat.name,
                    slug: cat.slug,
                    imageUrl: cat.image_url || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
                    productCount: count || 0,
                }
            })
        )

        // 3. Get Flash Deals (featured products with discounts)
        const { data: flashDealsRaw } = await (supabase as any)
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
                thumbnail,
                images,
                is_featured,
                created_at
            `)
            .eq('is_active', true)
            .eq('is_featured', true)
            .order('created_at', { ascending: false })
            .limit(8)

        // Calculate pricing and format for flash deals
        const flashDeals = (flashDealsRaw || []).map((product : any) => {
            let displayPrice = product.base_price
            let discountPercentage = 0

            if (userRole === 'wholesale') {
                switch (wholesaleTier) {
                    case 'tier1':
                        discountPercentage = product.wholesale_tier1_discount || 8
                        break
                    case 'tier2':
                        discountPercentage = product.wholesale_tier2_discount || 17
                        break
                    case 'tier3':
                        discountPercentage = product.wholesale_tier3_discount || 25
                        break
                }
                displayPrice = product.base_price * (1 - discountPercentage / 100)
            } else {
                // For non-wholesale, show tier1 discount as flash deal
                discountPercentage = product.wholesale_tier1_discount || 10
                displayPrice = product.base_price * (1 - discountPercentage / 100)
            }

            // Use thumbnail or first image
            const imageUrl = product.thumbnail || (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500'

            return {
                id: product.id,
                name: product.name,
                slug: product.slug,
                imageUrl: imageUrl,
                basePrice: Number(product.base_price),
                discountPercentage: Number(discountPercentage),
                endsAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
            }
        })

        // 4. Get New Arrivals (most recent products with is_new flag)
        const { data: newArrivalsRaw } = await (supabase as any)
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
                thumbnail,
                images,
                is_new,
                created_at
            `)
            .eq('is_active', true)
            .or('is_new.eq.true')
            .order('created_at', { ascending: false })
            .limit(10)

        // Calculate pricing for new arrivals
        const newArrivals = (newArrivalsRaw || []).map((product: any) => {
            let displayPrice = product.base_price
            let discountPercentage = 0

            if (userRole === 'wholesale') {
                switch (wholesaleTier) {
                    case 'tier1':
                        discountPercentage = product.wholesale_tier1_discount || 8
                        break
                    case 'tier2':
                        discountPercentage = product.wholesale_tier2_discount || 17
                        break
                    case 'tier3':
                        discountPercentage = product.wholesale_tier3_discount || 25
                        break
                }
                displayPrice = product.base_price * (1 - discountPercentage / 100)
            }

            const imageUrl = product.thumbnail || (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500'

            return {
                id: product.id,
                name: product.name,
                slug: product.slug,
                imageUrl: imageUrl,
                basePrice: Number(product.base_price),
                isNew: product.is_new || true,
            }
        })

        // 5. Get Homepage Settings (with defaults if not exists)
        const { data: settings } = await supabase
            .from('homepage_settings')
            .select('*')
            .limit(1)
            .single()

        // Return formatted data matching frontend expectations
        return NextResponse.json({
            data: {
                hero: {
                    banners: formattedBanners,
                },
                categories: categoriesWithCount,
                flashDeals: flashDeals,
                newArrivals: newArrivals,
            },
        })

    } catch (error) {
        console.error('Homepage fetch error:', error)
        return errorResponse(error)
    }
}
