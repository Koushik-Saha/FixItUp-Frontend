import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { errorResponse } from '@/lib/utils/errors'

export async function GET(request: NextRequest) {
    try {
        const [
            heroSlides,
            categories,
            flashProducts,
            newProducts,
            phoneModels,
            stores
        ] = await Promise.all([
            // 1. Hero Slides
            prisma.heroSlide.findMany({
                where: { isActive: true },
                orderBy: { sortOrder: 'asc' },
                take: 10
            }),

            // 2. Categories
            prisma.category.findMany({
                where: { isActive: true },
                orderBy: { displayOrder: 'asc' },
                take: 8
            }),

            // 3. Flash Deals (Featured)
            prisma.product.findMany({
                where: { isActive: true, isFeatured: true },
                orderBy: { updatedAt: 'desc' }, // Updated recently = likely a new deal
                take: 8,
                select: {
                    id: true, name: true, slug: true, thumbnail: true, images: true, basePrice: true, tier1Discount: true
                }
            }),

            // 4. New Arrivals
            prisma.product.findMany({
                where: { isActive: true, isNew: true },
                orderBy: { createdAt: 'desc' },
                take: 10,
                select: {
                    id: true, name: true, slug: true, thumbnail: true, images: true, basePrice: true
                }
            }),

            // 5. Phone Models (Grouped by Category/Brand)
            prisma.phoneModel.findMany({
                where: { isActive: true },
                include: { category: true },
                orderBy: { releaseYear: 'desc' }
            }),

            // 6. Stores
            prisma.store.findMany({
                where: { isActive: true },
                take: 6,
                select: {
                    id: true,
                    name: true,
                    address: true,
                    city: true,
                    state: true,
                    zipCode: true,
                    phone: true,
                    email: true,
                    operatingHours: true,
                    isActive: true
                }
            })
        ]);

        // Fallback Mock Data if DB is empty (Development Mode / Initial Setup)
        const mockHeroSlides = heroSlides.length > 0 ? heroSlides : [
            {
                id: 'mock-1',
                title: 'Expert Phone Repair',
                description: 'Fast, reliable repairs for iPhone, Samsung, and Google Pixel.',
                image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=1200',
                badge: 'Trusted Service',
                badgeColor: 'bg-blue-600',
                gradient: 'from-blue-900 to-slate-900',
                ctaPrimary: { text: "Book Repair", link: "/repair" },
                ctaSecondary: { text: "View Pricing", link: "/repair/pricing" },
                trustBadges: [
                    { icon: "🛡️", text: "Lifetime Warranty" },
                    { icon: "⚡", text: "Same Day Service" }
                ],
                isActive: true,
                sortOrder: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
                discount: null
            },
            {
                id: 'mock-2',
                title: 'Premium Parts Store',
                description: 'Upgrade your device with high-quality parts.',
                image: 'https://images.unsplash.com/photo-1598327773204-6e82f5b66d79?w=1200',
                badge: 'New Arrivals',
                badgeColor: 'bg-green-600',
                gradient: 'from-green-900 to-emerald-900',
                ctaPrimary: { text: "Shop Parts", link: "/shop" },
                ctaSecondary: { text: "Wholesale", link: "/wholesale/apply" },
                discount: "10% OFF",
                isActive: true,
                sortOrder: 2,
                trustBadges: [] as any,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        const mockNewProducts = newProducts.length > 0 ? newProducts : [
            {
                id: 'mock-p1',
                name: 'iPhone 13 Pro Max Screen',
                slug: 'iphone-13-screen',
                basePrice: 129.99 as any,
                thumbnail: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500',
                images: [],
                isActive: true,
                isNew: true
            },
            {
                id: 'mock-p2',
                name: 'Samsung S22 Battery',
                slug: 's22-battery',
                basePrice: 39.99 as any,
                thumbnail: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=500',
                images: [],
                isActive: true,
                isNew: true
            },
            {
                id: 'mock-p3',
                name: 'USB-C Charging Port',
                slug: 'usb-c-port',
                basePrice: 19.99 as any,
                thumbnail: 'https://images.unsplash.com/photo-1618414902340-2b4742468725?w=500',
                images: [],
                isActive: true,
                isNew: true
            },
            {
                id: 'mock-p4',
                name: 'Pixel 6 Screen Kit',
                slug: 'pixel-6-screen',
                basePrice: 149.99 as any,
                thumbnail: 'https://images.unsplash.com/photo-1592434134753-a70baf7979d5?w=500',
                images: [],
                isActive: true,
                isNew: true
            }
        ];

        // Transform Data

        // Categories Fallback
        const mockCategories = categories.length > 0 ? categories : [
            { id: 'cat-1', name: 'Screens', slug: 'screens', icon: '📱', description: 'Replacement Screens' },
            { id: 'cat-2', name: 'Batteries', slug: 'batteries', icon: '🔋', description: 'High Capacity Batteries' },
            { id: 'cat-3', name: 'Charging Ports', slug: 'charging', icon: '⚡', description: 'Fix Charging Issues' },
            { id: 'cat-4', name: 'Cameras', slug: 'cameras', icon: '📸', description: 'Crystal Clear Photos' },
        ];

        const finalCategories = mockCategories;

        // Categories Colors
        const colors = ["red", "blue", "orange", "cyan", "purple", "pink", "green", "indigo"];
        const formattedCategories = finalCategories.map((cat, i) => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            icon: cat.icon || cat.name?.charAt(0) || "•",
            color: colors[i % colors.length],
            count: "Top Quality" // Static count for mock/fallback
        }));

        // Stores Fallback
        const finalStores = stores.length > 0 ? stores : [
            {
                id: 'store-1',
                name: 'Max Phone Repair - Downtown',
                address: '123 Main St',
                city: 'New York',
                state: 'NY',
                zipCode: '10001',
                phone: '(212) 555-0123',
                email: 'downtown@maxphonerepair.com',
                operatingHours: { "Mon-Fri": "9AM-7PM", "Sat": "10AM-6PM", "Sun": "Closed" },
                isActive: true
            }
        ];

        // Flash Deals
        const formattedFlashDeals = flashProducts.map(p => {
            const discount = Number(p.tier1Discount || 10);
            const basePrice = Number(p.basePrice);
            const discountedPrice = basePrice * (1 - discount / 100);
            return {
                id: p.id,
                name: p.name,
                slug: p.slug,
                image: p.thumbnail || p.images[0] || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
                price: Number(discountedPrice.toFixed(2)),
                originalPrice: basePrice,
                discount,
                badge: "Save " + Math.round(discount) + "%",
                badgeColor: "bg-red-500",
                rating: 4.5,
                reviews: 150
            };
        });

        // Hero Slides
        // Use mock data if available
        const finalHeroSlides = mockHeroSlides;

        // New Arrivals
        const formattedNewArrivals = mockNewProducts.map(p => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            image: p.thumbnail || p.images[0] || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
            price: Number(p.basePrice),
            isNew: true
        }));

        // Phone Models grouped by Brand (Category Slug)
        const phoneModelsByBrand = phoneModels.reduce((acc: any, model) => {
            const brandSlug = model.category.slug;
            if (!acc[brandSlug]) {
                acc[brandSlug] = {
                    brand: model.category.name,
                    slug: brandSlug,
                    models: []
                };
            }
            acc[brandSlug].models.push({
                id: model.id,
                name: model.modelName,
                slug: model.modelSlug,
                releaseYear: model.releaseYear
            });
            return acc;
        }, {});

        // Hero Slides (Map snake_case/json to frontend expectations if needed, but Prisma result is camelCase)
        // Frontend likely expects camelCase if I updated it, or I need to map.
        // The original API code mapped snake_case to camelCase manually.
        // Prisma gives camelCase. So I should be good passing it directly OR map if frontend expects specific structure not matching model.
        // Original: ctaPrimary: s.cta_primary
        // Model: ctaPrimary
        // So direct map is fine.

        // Static Data
        const hero = [/* ... same static demo if needed, or replace with DB slides entirely */];
        // 7. Top Brands (Dynamic)
        // We filter for specific popular brands to populate this section, or sorted by some metric
        const topBrandSlugs = ['apple', 'samsung', 'google', 'motorola', 'sony', 'oneplus'];
        const dbBrands = await prisma.category.findMany({
            where: {
                slug: { in: topBrandSlugs },
                isActive: true
            },
            select: { name: true, slug: true, icon: true }
        });

        // Static Emoji Map for Fallback (since DB icons are currently null)
        const brandEco: Record<string, string> = {
            'Apple': '🍎',
            'Samsung': '📱',
            'Google': 'G',
            'Motorola': 'M', // Motorola doesn't have a perfect emoji, using char or generic
            'Sony': 'S',
            'OnePlus': '1+',
        }

        const brands = dbBrands.map(b => ({
            name: b.name,
            logo: b.icon || brandEco[b.name] || '📱',
            products: "View All" // Could count products later
        }));

        // Fill if empty (Fallback)
        if (brands.length === 0) {
            brands.push(
                { name: "Apple", logo: "🍎", products: "View All" },
                { name: "Samsung", logo: "📱", products: "View All" }
            )
        }
        const features = [
            { icon: "🚚", title: "Free Shipping", description: "On all orders over $50" },
            { icon: "🛡️", title: "180 Day Warranty", description: "On all repairs & parts" },
            { icon: "⭐", title: "Top Quality", description: "OEM & premium parts only" },
            { icon: "💰", title: "Best Price", description: "Guaranteed lowest prices" },
        ];
        const cta = {
            title: "Can't Visit a Store? We Ship Nationwide!",
            subtitle: "Order online and get your phone parts delivered anywhere in the US.",
            buttons: [
                { text: "Shop Online", link: "/shop", variant: "primary" },
                { text: "Contact Us", link: "/contact", variant: "secondary" },
            ],
        };

        return NextResponse.json({
            success: true,
            data: {
                hero: finalHeroSlides, // Replacing static hero with DB slides if frontend handles array
                heroSlides: finalHeroSlides,
                categories: formattedCategories,
                flashDeals: {
                    title: "Flash Deals",
                    subtitle: "Limited Time Offers",
                    endsAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                    products: formattedFlashDeals
                },
                newArrivals: formattedNewArrivals,
                brands,
                stores: finalStores.map(s => ({
                    id: s.id,
                    name: s.name,
                    badge: "POPULAR",
                    address: s.address,
                    city: `${s.city}, ${s.state} ${s.zipCode}`,
                    phone: s.phone,
                    email: s.email,
                    hours: s.operatingHours
                })),
                features,
                cta,
                phoneModels: phoneModelsByBrand
            }
        });

    } catch (error) {
        console.error("Homepage API Error", error);
        return errorResponse(error);
    }
}
