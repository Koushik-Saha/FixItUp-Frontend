
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Base Parts Configuration
const PART_TYPES = [
    { name: 'Screen Replacement', category: 'Screen', image: '/images/products/screen.png', priceRange: { min: 49.99, max: 299.99 } },
    { name: 'Battery Replacement', category: 'Battery', image: '/images/products/battery.png', priceRange: { min: 29.99, max: 89.99 } },
    { name: 'Charging Port Flex', category: 'Charging Port', image: '/images/products/charging_port.png', priceRange: { min: 19.99, max: 49.99 } },
    { name: 'Rear Camera Module', category: 'Camera', image: '/images/products/camera.png', priceRange: { min: 39.99, max: 129.99 } },
    { name: 'Back Glass Panel', category: 'Back Glass', image: '/images/products/back_glass.png', priceRange: { min: 24.99, max: 59.99 } },
    { name: 'Repair Tool Kit', category: 'Tools', image: '/images/products/tools.png', priceRange: { min: 14.99, max: 39.99 } },
]

const PHONE_MODELS = [
    { brand: 'Apple', models: ['iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15', 'iPhone 14 Pro Max', 'iPhone 13'] },
    { brand: 'Samsung', models: ['Galaxy S24 Ultra', 'Galaxy S24', 'Galaxy S23 Ultra', 'Galaxy S23'] },
    { brand: 'Google', models: ['Pixel 8 Pro', 'Pixel 8', 'Pixel 7 Pro'] },
]

async function main() {
    console.log("Starting Real Product Seeding...")

    // 1. Clean up existing data (Products)
    console.log("Deleting existing products...")
    try {
        await prisma.inventory.deleteMany({})
        await prisma.cartItem.deleteMany({})
        await prisma.review.deleteMany({})
        await prisma.stockAlert.deleteMany({})
        await prisma.orderItem.deleteMany({})
        await prisma.product.deleteMany({})
        // Optional: Clean up product_models and categories if we want a fresh start, 
        // but let's keep it additive or upsert to avoid breaking other things if unsure.
        // But user asked to "delete all the product from database".
        console.log("Existing products deleted.")
    } catch (e) {
        console.error("Error clearing data:", e)
    }

    let productsCreated = 0

    for (const brandData of PHONE_MODELS) {
        // 1. Find or Create Brand as Category
        const brandSlug = brandData.brand.toLowerCase()
        const brandCategory = await prisma.category.upsert({
            where: { slug: brandSlug },
            update: {},
            create: {
                name: brandData.brand,
                slug: brandSlug,
                parentId: null,
                isActive: true,
                is_mega_menu: true, // Assuming top brands are mega menu items
                image_url: `/images/brands/${brandSlug}.png`
            }
        })

        for (const modelName of brandData.models) {
            // 2. Find or Create Product Model (e.g. iPhone 15 Pro Max)
            const modelSlug = modelName.toLowerCase().replace(/[^a-z0-9]+/g, '-')

            const productModel = await prisma.product_models.upsert({
                where: { slug: modelSlug },
                update: { category_id: brandCategory.id },
                create: {
                    name: modelName,
                    slug: modelSlug,
                    category_id: brandCategory.id,
                    is_active: true
                }
            })

            for (const part of PART_TYPES) {
                // 3. Create Product
                const price = Number((Math.random() * (part.priceRange.max - part.priceRange.min) + part.priceRange.min).toFixed(2))
                const productName = `${brandData.brand} ${modelName} ${part.name}`
                // Unique SKU
                const sku = `FIX-${brandData.brand.substring(0, 3).toUpperCase()}-${modelName.replace(/\D/g, '').substring(0, 4)}-${part.category.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 10000)}`
                const slug = `${productName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Math.floor(Math.random() * 1000)}`

                await prisma.product.create({
                    data: {
                        name: productName,
                        slug: slug,
                        description: `High quality ${part.name.toLowerCase()} for ${brandData.brand} ${modelName}. Restores full functionality. Tested for quality assurance.`,
                        basePrice: price, // Schema uses basePrice, not price
                        sku: sku,
                        brand: brandData.brand, // product.brand is a string
                        categoryId: brandCategory.id, // Link to Brand Category
                        model_id: productModel.id, // Link to Product Model
                        deviceModel: modelName,
                        productType: part.category,
                        images: [part.image], // Local image path
                        totalStock: Math.floor(Math.random() * 50) + 5,
                        isActive: true,
                        isFeatured: Math.random() > 0.8
                    }
                })
                productsCreated++
            }
        }
    }

    console.log(`Seeding Complete. Created ${productsCreated} products with local images.`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
