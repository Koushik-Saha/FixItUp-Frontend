import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding ...')

    // 1. Clean up existing data (optional, or just upsert)
    // await prisma.heroSlide.deleteMany()
    // await prisma.product.deleteMany()
    // await prisma.category.deleteMany()

    // 2. Hero Slides
    const hero1 = await prisma.heroSlide.create({
        data: {
            title: "Expert Phone Repair",
            description: "Fast, reliable repairs for iPhone, Samsung, and Google Pixel. Most repairs done in under 30 minutes.",
            image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=1200",
            badge: "Trusted Service",
            badgeColor: "bg-blue-600",
            gradient: "from-blue-900 to-slate-900",
            // ctaPrimary: { text: "Book Repair", link: "/repair" },
            // ctaSecondary: { text: "View Pricing", link: "/repair/pricing" },
            // trustBadges: [
            //     { icon: "🛡️", text: "Lifetime Warranty" },
            //     { icon: "⚡", text: "Same Day Service" }
            // ],
            sortOrder: 1,
            isActive: true
        }
    })

    const hero2 = await prisma.heroSlide.create({
        data: {
            title: "Premium Parts Store",
            description: "Upgrade your device with high-quality parts. Wholesale pricing available for businesses.",
            image: "https://images.unsplash.com/photo-1598327773204-6e82f5b66d79?w=1200",
            badge: "New Arrivals",
            badgeColor: "bg-green-600",
            gradient: "from-green-900 to-emerald-900",
            // ctaPrimary: { text: "Shop Parts", link: "/shop" },
            // ctaSecondary: { text: "Wholesale", link: "/wholesale/apply" },
            discount: "10% OFF",
            sortOrder: 2,
            isActive: true
        }
    })

    // 3. Categories
    const screens = await prisma.category.create({
        data: {
            name: "Screens",
            slug: "screens",
            icon: "📱",
            description: "Replacement screens for all major brands"
        }
    })

    const batteries = await prisma.category.create({
        data: {
            name: "Batteries",
            slug: "batteries",
            icon: "🔋",
            description: "High capacity replacement batteries"
        }
    })

    const chargingPorts = await prisma.category.create({
        data: {
            name: "Charging Ports",
            slug: "charging-ports",
            icon: "⚡",
            description: "Fix charging issues fast"
        }
    })

    // 4. Products
    await prisma.product.create({
        data: {
            name: "iPhone 13 Pro Max OLED Screen",
            sku: "SCR-IP13PM-OLED",
            slug: "iphone-13-pro-max-oled-screen",
            brand: "Apple",
            deviceModel: "iPhone 13 Pro Max",
            productType: "Screen",
            basePrice: 129.99,
            categoryId: screens.id,
            description: "High quality OLED replacement screen for iPhone 13 Pro Max.",
            isActive: true,
            isFeatured: true, // Flash Deal
            isNew: true,
            thumbnail: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500",
            images: ["https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500"],
            tier1Discount: 15,
            totalStock: 50
        }
    })

    await prisma.product.create({
        data: {
            name: "Samsung Galaxy S22 Battery",
            sku: "BAT-S22-OEM",
            slug: "samsung-galaxy-s22-battery",
            brand: "Samsung",
            deviceModel: "Galaxy S22",
            productType: "Battery",
            basePrice: 39.99,
            categoryId: batteries.id,
            description: "Original OEM battery for Samsung Galaxy S22.",
            isActive: true,
            isFeatured: false,
            isNew: true, // New Arrival
            thumbnail: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=500",
            images: ["https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=500"],
            tier1Discount: 10,
            totalStock: 100
        }
    })

    // 5. Stores
    await prisma.store.create({
        data: {
            name: "Max Phone Repair - Downtown",
            address: "123 Main St",
            city: "New York",
            state: "NY",
            zipCode: "10001",
            phone: "(212) 555-0123",
            email: "downtown@maxphonerepair.com",
            operatingHours: {
                "Mon-Fri": "9:00 AM - 7:00 PM",
                "Sat": "10:00 AM - 6:00 PM",
                "Sun": "Closed"
            },
            isActive: true
        }
    })

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
