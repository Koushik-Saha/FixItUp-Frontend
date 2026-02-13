
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const PART_TYPES = [
    { name: 'OLED Screen Replacement', type: 'Screen', price: 120.00 },
    { name: 'High Capacity Battery', type: 'Battery', price: 50.00 },
    { name: 'Charging Port Assembly', type: 'Charging Port', price: 35.00 },
    { name: 'Rear Camera Module', type: 'Camera', price: 80.00 },
    { name: 'Front Camera Flex', type: 'Camera', price: 45.00 },
    { name: 'Back Glass Panel', type: 'Housing', price: 40.00 },
]

async function main() {
    console.log('Starting to seed missing parts...')

    // 1. Fetch all phone models with their brand (Category)
    const models = await prisma.phoneModel.findMany({
        include: {
            category: true
        }
    })

    console.log(`Found ${models.length} phone models.`)

    for (const model of models) {
        const brandName = model.category.name
        const modelName = model.modelName

        // 2. Check if parts exist for this model
        // The query logic mirrors the API: deviceModel contains modelName
        const existingParts = await prisma.product.count({
            where: {
                brand: { equals: brandName, mode: 'insensitive' },
                deviceModel: { contains: modelName, mode: 'insensitive' }
            }
        })

        if (existingParts > 0) {
            console.log(`[SKIP] ${brandName} ${modelName} already has ${existingParts} parts.`)
            continue
        }

        console.log(`[SEED] Creating parts for ${brandName} ${modelName}...`)

        // 3. Create parts
        for (const part of PART_TYPES) {
            const productName = `${brandName} ${modelName} ${part.name}`
            const baseSlug = productName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
            const uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`

            const sku = `PART-${brandName.substring(0, 3).toUpperCase()}-${modelName.replace(/[^a-zA-Z0-9]/g, '').substring(0, 5).toUpperCase()}-${part.type.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 1000)}`

            try {
                await prisma.product.create({
                    data: {
                        name: productName,
                        slug: uniqueSlug,
                        sku: sku,
                        brand: brandName,
                        deviceModel: modelName,
                        productType: part.type,
                        description: `High quality ${part.name} for ${brandName} ${modelName}.`,
                        basePrice: part.price,
                        totalStock: 50,
                        isActive: true,
                        categoryId: model.categoryId, // Link to brand category
                        // model_id field removed to avoid FK constraint error
                        images: [],                   // No images for now
                    }
                })
            } catch (e) {
                console.error(`Failed to create ${productName}:`, e)
            }
        }
    }

    console.log('Seeding completed.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
