// src/app/api/homepage/route.ts

import {NextRequest, NextResponse} from "next/server";
import {createClient} from "@/lib/supabase/server";

export async function GET(_request: NextRequest) {
    try {
        const supabase = await createClient();

        // ======================
        // 1) HERO (static demo)
        // ======================
        const hero = [
            {
                id: 1,
                badge: "New Arrivals",
                badgeColor: "bg-yellow-500",
                title: "Latest Tech at Unbeatable Prices",
                description:
                    "Shop the newest smartphones, laptops, and accessories from top brands. Free shipping on orders over $50!",
                ctaPrimary: {text: "Shop Now", link: "/shop"},
                ctaSecondary: {text: "View All Deals", link: "/deals"},
                image: "/images/phone_repair.jpg",
                gradient: "from-blue-600 via-purple-600 to-pink-600",
                trustBadges: [
                    {icon: "🚚", text: "Free Shipping"},
                    {icon: "🛡️", text: "2-Year Warranty"},
                    {icon: "💳", text: "Secure Payment"},
                ],
                discount: "-20% OFF",
            },
            {
                id: 2,
                badge: "Smartphones",
                badgeColor: "bg-blue-500",
                title: "iPhone 15 Series Now Available",
                description:
                    "Get the latest iPhone 15 Pro Max with all accessories. Complete protection with cases, screen protectors, and chargers.",
                ctaPrimary: {text: "Shop iPhones", link: "/phones/apple"},
                ctaSecondary: {
                    text: "View Accessories",
                    link: "/phones/apple/iphone-15-pro-max",
                },
                image: "/images/phone_repair.jpg",
                gradient: "from-cyan-600 via-blue-600 to-indigo-600",
                trustBadges: [
                    {icon: "✅", text: "Authentic Products"},
                    {icon: "⚡", text: "Same Day Shipping"},
                    {icon: "💰", text: "Best Price Guarantee"},
                ],
                discount: "-15% OFF",
            },
            {
                id: 3,
                badge: "Laptops & Tablets",
                badgeColor: "bg-purple-500",
                title: "Powerful Laptops for Work & Play",
                description:
                    "Discover high-performance laptops from Dell, HP, Lenovo, and more. Perfect for work, gaming, or creative projects.",
                ctaPrimary: {text: "Shop Laptops", link: "/laptops"},
                ctaSecondary: {text: "View Tablets", link: "/tablets"},
                image: "/images/phone_repair.jpg",
                gradient: "from-purple-600 via-pink-600 to-red-600",
                trustBadges: [
                    {icon: "🎮", text: "Gaming Ready"},
                    {icon: "💻", text: "Professional Grade"},
                    {icon: "🔧", text: "Free Setup"},
                ],
                discount: "-25% OFF",
            },
            {
                id: 4,
                badge: "Audio & Accessories",
                badgeColor: "bg-green-500",
                title: "Premium Audio Experience",
                description:
                    "AirPods, headphones, and speakers from top brands. Crystal clear sound for music, calls, and gaming.",
                ctaPrimary: {text: "Shop Audio", link: "/category/audio"},
                ctaSecondary: {text: "View Deals", link: "/deals/audio"},
                image: "/images/phone_repair.jpg",
                gradient: "from-green-600 via-emerald-600 to-teal-600",
                trustBadges: [
                    {icon: "🎧", text: "Studio Quality"},
                    {icon: "🔋", text: "Long Battery Life"},
                    {icon: "🎵", text: "Noise Canceling"},
                ],
                discount: "-30% OFF",
            },
            {
                id: 5,
                badge: "Wholesale B2B & B2C",
                badgeColor: "bg-orange-500",
                title: "Bulk Orders & Wholesale Pricing",
                description:
                    "Special pricing for businesses, repair shops, and resellers. Get the best wholesale rates on all products.",
                ctaPrimary: {text: "Contact Sales", link: "/wholesale"},
                ctaSecondary: {text: "View Catalog", link: "/wholesale/catalog"},
                image: "/images/phone_repair.jpg",
                gradient: "from-orange-600 via-red-600 to-pink-600",
                trustBadges: [
                    {icon: "📦", text: "Bulk Discounts"},
                    {icon: "🤝", text: "B2B Support"},
                    {icon: "🚛", text: "Free Shipping"},
                ],
                discount: "Up to 40% OFF",
            },
        ];

        // ======================
        // 2) HERO SLIDES (DB)
        // ======================
        const {
            data: heroSlidesDb,
            error: heroSlidesError,
        } = await supabase
            .from("hero_slides")
            .select(
                `
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
        discount,
        sort_order,
        is_active
      `
            )
            .eq("is_active", true)
            .order("sort_order", {ascending: true})
            .limit(10);

        const heroSlides =
            (heroSlidesDb || []).map((s: any) => ({
                id: s.id,
                badge: s.badge,
                badgeColor: s.badge_color,
                title: s.title,
                description: s.description,
                ctaPrimary: s.cta_primary,
                ctaSecondary: s.cta_secondary,
                image: s.image,
                gradient: s.gradient,
                trustBadges: s.trust_badges,
                discount: s.discount,
            })) || [];

        // ======================
// PHONE MODELS (by brand)
// ======================
        const {data: phoneModelsData, error: phoneModelsError} = await supabase
            .from("phone_models")
            .select(`
                    id,
                    model_name,
                    model_slug,
                    release_year,
                    category:categories (
                      id,
                      name,
                      slug
                    )
                  `)
            .eq("is_active", true)
            .order("release_year", {ascending: false});

        if (phoneModelsError) {
            console.error("Phone models error:", phoneModelsError);
        }

        console.log("phoneModels rows:", phoneModelsData?.length, phoneModelsError);


        const phoneModelsByBrand = (phoneModelsData || []).reduce(
            (acc: any, model: any) => {
                const brandSlug = model.category.slug;

                if (!acc[brandSlug]) {
                    acc[brandSlug] = {
                        brand: model.category.name,
                        slug: brandSlug,
                        models: [],
                    };
                }

                acc[brandSlug].models.push({
                    id: model.id,
                    name: model.model_name,
                    slug: model.model_slug,
                    releaseYear: model.release_year,
                });

                return acc;
            },
            {}
        );



        // ======================
        // 3) CATEGORIES
        // ======================
        const {data: categoriesData, error: categoriesError} = await supabase
            .from("categories")
            .select("id, name, slug, icon, sort_order")
            .is("parent_id", null)
            .eq("is_active", true)
            .order("sort_order", {ascending: true})
            .limit(8);

        const colors = [
            "red",
            "blue",
            "orange",
            "cyan",
            "purple",
            "pink",
            "green",
            "indigo",
        ];

        const categories = (categoriesData || []).map((cat: any, index: number) => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            icon: cat.icon || cat.name?.charAt(0) || "•",
            color: colors[index % colors.length],
        }));

        // ======================
        // 4) FLASH DEALS
        // ======================
        const {data: flashProducts, error: flashError} = await supabase
            .from("products")
            .select("id, name, slug, thumbnail, images, base_price, wholesale_tier1_discount")
            .eq("is_active", true)
            .eq("is_featured", true)
            .order("created_at", {ascending: false})
            .limit(8);

        const flashDealsProducts = (flashProducts || []).map((product: any) => {
            const discount = Number(product.wholesale_tier1_discount ?? 10);
            const basePrice = Number(product.base_price ?? 0);
            const discountedPrice = basePrice * (1 - discount / 100);

            const imageUrl =
                product.thumbnail ||
                (Array.isArray(product.images) ? product.images[0] : null) ||
                "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400";

            return {
                id: product.id,
                name: product.name,
                slug: product.slug,
                image: imageUrl,
                price: Number(discountedPrice.toFixed(2)),
                originalPrice: basePrice,
                discount,
                rating: 4.5, // demo
                reviews: Math.floor(Math.random() * 400) + 100, // demo
            };
        });

        const flashDeals = {
            title: "Flash Deals",
            subtitle: "Limited Time Offers",
            endsAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            products: flashDealsProducts,
        };

        // ======================
        // 5) NEW ARRIVALS
        // ======================
        const {data: newProducts, error: newError} = await supabase
            .from("products")
            .select("id, name, slug, thumbnail, images, base_price")
            .eq("is_active", true)
            .eq("is_new", true)
            .order("created_at", {ascending: false})
            .limit(10);

        const newArrivals = (newProducts || []).map((product: any) => {
            const imageUrl =
                product.thumbnail ||
                (Array.isArray(product.images) ? product.images[0] : null) ||
                "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400";

            return {
                id: product.id,
                name: product.name,
                slug: product.slug,
                image: imageUrl,
                price: Number(product.base_price ?? 0),
                isNew: true,
            };
        });

        // ======================
        // 6) BRANDS (static)
        // ======================
        const brands = [
            {name: "Apple", logo: "🍎"},
            {name: "Samsung", logo: "📱"},
            {name: "Sony", logo: "S"},
            {name: "Dell", logo: "D"},
            {name: "Canon", logo: "📷"},
            {name: "Microsoft", logo: "M"},
        ];

        // ======================
        // 7) STORES
        // ======================
        const {data: storesData, error: storesError} = await supabase
            .from("stores")
            .select("id, name, address, city, state, zip_code, phone, email, operating_hours")
            .eq("is_active", true)
            .limit(6);

        const stores = (storesData || []).map((store: any) => {
            const hours = store.operating_hours || {};

            // If your JSON is like {"monday":{"open":"09:00","close":"19:00"}}
            const mon = hours.monday ? `${hours.monday.open} - ${hours.monday.close}` : "09:00 - 19:00";
            const sat = hours.saturday ? `${hours.saturday.open} - ${hours.saturday.close}` : "10:00 - 18:00";
            const sun = hours.sunday ? `${hours.sunday.open} - ${hours.sunday.close}` : "11:00 - 17:00";

            return {
                id: store.id,
                name: store.name,
                badge: "POPULAR",
                address: store.address,
                city: `${store.city}, ${store.state} ${store.zip_code}`,
                phone: store.phone,
                email: store.email || "",
                hours: {
                    weekday: `Mon-Fri: ${mon}`,
                    saturday: `Saturday: ${sat}`,
                    sunday: `Sunday: ${sun}`,
                },
            };
        });

        // ======================
        // 8) FEATURES + CTA
        // ======================
        const features = [
            {icon: "🚚", title: "Free Shipping", description: "On all orders over $50"},
            {icon: "🛡️", title: "180 Day Warranty", description: "On all repairs & parts"},
            {icon: "⭐", title: "Top Quality", description: "OEM & premium parts only"},
            {icon: "💰", title: "Best Price", description: "Guaranteed lowest prices"},
        ];

        const cta = {
            title: "Can't Visit a Store? We Ship Nationwide!",
            subtitle: "Order online and get your phone parts delivered anywhere in the US.",
            buttons: [
                {text: "Shop Online", link: "/shop", variant: "primary" as const},
                {text: "Contact Us", link: "/contact", variant: "secondary" as const},
            ],
        };

        // ======================
        // RETURN
        // ======================
        return NextResponse.json({
            success: true,
            data: {
                hero,
                heroSlides,
                categories,
                flashDeals,
                newArrivals,
                brands,
                stores,
                features,
                cta,
                phoneModels: phoneModelsByBrand,

            },
            errors: {
                heroSlidesError: heroSlidesError?.message ?? null,
                categoriesError: categoriesError?.message ?? null,
                flashError: flashError?.message ?? null,
                newError: newError?.message ?? null,
                storesError: storesError?.message ?? null,
            },
        });
    } catch (err) {
        console.error("Homepage API error:", err);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to load homepage data",
                message: err instanceof Error ? err.message : "Unknown error",
            },
            {status: 500}
        );
    }
}
