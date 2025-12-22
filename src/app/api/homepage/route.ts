// src/app/api/homepage/route.ts
// FIXED: TypeScript errors resolved

import {NextRequest, NextResponse} from 'next/server'
import {createClient} from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()

        // Hero section
        const hero = [
            {
                id: 1,
                badge: 'New Arrivals',
                badgeColor: 'bg-yellow-500',
                title: 'Latest Tech at Unbeatable Prices',
                description: 'Shop the newest smartphones, laptops, and accessories from top brands. Free shipping on orders over $50!',
                ctaPrimary: {text: 'Shop Now', link: '/shop'},
                ctaSecondary: {text: 'View All Deals', link: '/deals'},
                image: '/images/phone_repair.jpg',
                gradient: 'from-blue-600 via-purple-600 to-pink-600',
                trustBadges: [
                    {icon: '🚚', text: 'Free Shipping'},
                    {icon: '🛡️', text: '2-Year Warranty'},
                    {icon: '💳', text: 'Secure Payment'}
                ],
                discount: '-20% OFF'
            },
            {
                id: 2,
                badge: 'Smartphones',
                badgeColor: 'bg-blue-500',
                title: 'iPhone 15 Series Now Available',
                description: 'Get the latest iPhone 15 Pro Max with all accessories. Complete protection with cases, screen protectors, and chargers.',
                ctaPrimary: {text: 'Shop iPhones', link: '/phones/apple'},
                ctaSecondary: {text: 'View Accessories', link: '/phones/apple/iphone-15-pro-max'},
                image: '/images/phone_repair.jpg',
                gradient: 'from-cyan-600 via-blue-600 to-indigo-600',
                trustBadges: [
                    {icon: '✅', text: 'Authentic Products'},
                    {icon: '⚡', text: 'Same Day Shipping'},
                    {icon: '💰', text: 'Best Price Guarantee'}
                ],
                discount: '-15% OFF'
            },
            {
                id: 3,
                badge: 'Laptops & Tablets',
                badgeColor: 'bg-purple-500',
                title: 'Powerful Laptops for Work & Play',
                description: 'Discover high-performance laptops from Dell, HP, Lenovo, and more. Perfect for work, gaming, or creative projects.',
                ctaPrimary: {text: 'Shop Laptops', link: '/laptops'},
                ctaSecondary: {text: 'View Tablets', link: '/tablets'},
                image: '/images/phone_repair.jpg',
                gradient: 'from-purple-600 via-pink-600 to-red-600',
                trustBadges: [
                    {icon: '🎮', text: 'Gaming Ready'},
                    {icon: '💻', text: 'Professional Grade'},
                    {icon: '🔧', text: 'Free Setup'}
                ],
                discount: '-25% OFF'
            },
            {
                id: 4,
                badge: 'Audio & Accessories',
                badgeColor: 'bg-green-500',
                title: 'Premium Audio Experience',
                description: 'AirPods, headphones, and speakers from top brands. Crystal clear sound for music, calls, and gaming.',
                ctaPrimary: {text: 'Shop Audio', link: '/category/audio'},
                ctaSecondary: {text: 'View Deals', link: '/deals/audio'},
                image: '/images/phone_repair.jpg',
                gradient: 'from-green-600 via-emerald-600 to-teal-600',
                trustBadges: [
                    {icon: '🎧', text: 'Studio Quality'},
                    {icon: '🔋', text: 'Long Battery Life'},
                    {icon: '🎵', text: 'Noise Canceling'}
                ],
                discount: '-30% OFF'
            },
            {
                id: 5,
                badge: 'Wholesale B2B & B2C',
                badgeColor: 'bg-orange-500',
                title: 'Bulk Orders & Wholesale Pricing',
                description: 'Special pricing for businesses, repair shops, and resellers. Get the best wholesale rates on all products.',
                ctaPrimary: {text: 'Contact Sales', link: '/wholesale'},
                ctaSecondary: {text: 'View Catalog', link: '/wholesale/catalog'},
                image: '/images/phone_repair.jpg',
                gradient: 'from-orange-600 via-red-600 to-pink-600',
                trustBadges: [
                    {icon: '📦', text: 'Bulk Discounts'},
                    {icon: '🤝', text: 'B2B Support'},
                    {icon: '🚛', text: 'Free Shipping'}
                ],
                discount: 'Up to 40% OFF'
            }
        ]

        // Hero Slides
        const {data: heroSlides, error} = await supabase
            .from('hero_slides')
            .select(`
                    id,
                    badge,
                    badge_color,
                    title,
                    description,
                    cta_primary,
                    cta_secondary,
                    image,
                    gradient,
                    trust_badges,
                    discount
                  `)
            .order('sort_order', {ascending: true})
            .limit(10)

        if (error) {
            console.error('Hero slides error:', error)
        }

        // Categories - 8 icons
        const {data: categoriesData} = await supabase
            .from('categories')
            .select('id, name, slug, icon')
            .is('parent_id', null)
            .eq('is_active', true)
            .order('sort_order', {ascending: true})
            .limit(8)

        const categories = (categoriesData || []).map((cat: any, index: number) => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            icon: cat.icon || cat.name.charAt(0),
            color: ['red', 'blue', 'orange', 'cyan', 'purple', 'pink', 'green', 'indigo'][index % 8]
        }))

        // Flash Deals - Featured products
        const {data: flashProducts} = await supabase
            .from('products')
            .select('id, name, slug, thumbnail, images, base_price, wholesale_tier1_discount')
            .eq('is_active', true)
            .eq('is_featured', true)
            .order('created_at', {ascending: false})
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
        const {data: newProducts} = await supabase
            .from('products')
            .select('id, name, slug, thumbnail, images, base_price')
            .eq('is_active', true)
            .eq('is_new', true)
            .order('created_at', {ascending: false})
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
            {name: 'Apple', logo: '🍎'},
            {name: 'Samsung', logo: '📱'},
            {name: 'Sony', logo: 'S'},
            {name: 'Dell', logo: 'D'},
            {name: 'Canon', logo: '📷'},
            {name: 'Microsoft', logo: 'M'}
        ]

        // Stores - FIXED: zip_code instead of zip, operating_hours JSONB
        const {data: storesData} = await supabase
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
            {icon: '🚚', title: 'Free Shipping', description: 'On all orders over $50'},
            {icon: '🛡️', title: '180 Day Warranty', description: 'On all repairs & parts'},
            {icon: '⭐', title: 'Top Quality', description: 'OEM & premium parts only'},
            {icon: '💰', title: 'Best Price', description: 'Guaranteed lowest prices'}
        ]

        // CTA
        const cta = {
            title: "Can't Visit a Store? We Ship Nationwide!",
            subtitle: 'Order online and get your phone parts delivered anywhere in the US.',
            buttons: [
                {text: 'Shop Online', link: '/shop', variant: 'primary' as const},
                {text: 'Contact Us', link: '/contact', variant: 'secondary' as const}
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
                cta,
                heroSlides,
                heroError: error
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
            {status: 500}
        )
    }
}
