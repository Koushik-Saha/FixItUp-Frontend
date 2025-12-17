// src/app/api/homepage/route.ts
// FIXED: TypeScript errors resolved

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()

        // Hero section
        const hero = {
            badge: 'NEW ARRIVAL',
            title: 'iPhone 15 Series Now Available',
            subtitle: 'Get the latest iPhone 15 with advanced AI, exceptional display and unbeatable performance.',
            image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800',
            buttons: [
                { text: 'Shop Now', link: '/shop/apple/iphone', variant: 'primary' as const },
                { text: 'View Accessories', link: '/shop/accessories', variant: 'secondary' as const }
            ],
            features: ['180-Day Warranty', 'Same Day Repair', 'Free Shipping On $50+']
        }

        // Categories - 8 icons
        const { data: categoriesData } = await supabase
            .from('categories')
            .select('id, name, slug, icon')
            .is('parent_id', null)
            .eq('is_active', true)
            .order('sort_order', { ascending: true })
            .limit(8)

        const categories = (categoriesData || []).map((cat: any, index: number) => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            icon: cat.icon || cat.name.charAt(0),
            color: ['red', 'blue', 'orange', 'cyan', 'purple', 'pink', 'green', 'indigo'][index % 8]
        }))

        // Flash Deals - Featured products
        const { data: flashProducts } = await supabase
            .from('products')
            .select('id, name, slug, thumbnail, images, base_price, wholesale_tier1_discount')
            .eq('is_active', true)
            .eq('is_featured', true)
            .order('created_at', { ascending: false })
            .limit(8)

        const flashDealsProducts = (flashProducts || []).map((product: any) => {
            const discount = product.wholesale_tier1_discount || 10
            const discountedPrice = product.base_price * (1 - discount / 100)
            const imageUrl = product.thumbnail || (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'

            return {
                id: product.id,
                name: product.name,
                slug: product.slug,
                image: imageUrl,
                price: Number(discountedPrice.toFixed(2)),
                originalPrice: Number(product.base_price),
                discount: Number(discount),
                rating: 4.5,
                reviews: Math.floor(Math.random() * 400) + 100
            }
        })

        const flashDeals = {
            title: 'Flash Deals',
            subtitle: 'Limited Time Offers',
            endsAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            products: flashDealsProducts
        }

        // New Arrivals
        const { data: newProducts } = await supabase
            .from('products')
            .select('id, name, slug, thumbnail, images, base_price')
            .eq('is_active', true)
            .eq('is_new', true)
            .order('created_at', { ascending: false })
            .limit(10)

        const newArrivals = (newProducts || []).map((product: any) => {
            const imageUrl = product.thumbnail || (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'

            return {
                id: product.id,
                name: product.name,
                slug: product.slug,
                image: imageUrl,
                price: Number(product.base_price),
                isNew: true
            }
        })

        // Brands (static)
        const brands = [
            { name: 'Apple', logo: '🍎' },
            { name: 'Samsung', logo: '📱' },
            { name: 'Sony', logo: 'S' },
            { name: 'Dell', logo: 'D' },
            { name: 'Canon', logo: '📷' },
            { name: 'Microsoft', logo: 'M' }
        ]

        // Stores - FIXED: zip_code instead of zip, operating_hours JSONB
        const { data: storesData } = await supabase
            .from('stores')
            .select('id, name, address, city, state, zip_code, phone, email, operating_hours')
            .eq('is_active', true)
            .limit(6)

        const stores = (storesData || []).map((store: any) => {
            // Parse operating_hours JSONB
            const hours = store.operating_hours || {}
            const weekdayHours = hours.monday ? `${hours.monday.open} - ${hours.monday.close}` : '10:00 AM - 8:00 PM'
            const saturdayHours = hours.saturday ? `${hours.saturday.open} - ${hours.saturday.close}` : '10:00 AM - 6:00 PM'
            const sundayHours = hours.sunday ? `${hours.sunday.open} - ${hours.sunday.close}` : '11:00 AM - 5:00 PM'

            return {
                id: store.id,
                name: store.name,
                badge: 'POPULAR',
                address: store.address,
                city: `${store.city}, ${store.state} ${store.zip_code}`,
                phone: store.phone,
                email: store.email || '',
                hours: {
                    weekday: `Mon-Fri: ${weekdayHours}`,
                    saturday: `Saturday: ${saturdayHours}`,
                    sunday: `Sunday: ${sundayHours}`
                }
            }
        })

        // Features
        const features = [
            { icon: '🚚', title: 'Free Shipping', description: 'On all orders over $50' },
            { icon: '🛡️', title: '180 Day Warranty', description: 'On all repairs & parts' },
            { icon: '⭐', title: 'Top Quality', description: 'OEM & premium parts only' },
            { icon: '💰', title: 'Best Price', description: 'Guaranteed lowest prices' }
        ]

        // CTA
        const cta = {
            title: "Can't Visit a Store? We Ship Nationwide!",
            subtitle: 'Order online and get your phone parts delivered anywhere in the US.',
            buttons: [
                { text: 'Shop Online', link: '/shop', variant: 'primary' as const },
                { text: 'Contact Us', link: '/contact', variant: 'secondary' as const }
            ]
        }

        return NextResponse.json({
            success: true,
            data: {
                hero,
                categories,
                flashDeals,
                newArrivals,
                brands,
                stores,
                features,
                cta
            }
        })

    } catch (error) {
        console.error('Homepage API error:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to load homepage data',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}
