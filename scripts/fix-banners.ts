
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log("Fixing Homepage Banners...")

    // Update all banners to use local images
    // We'll alternate between repair-banner and parts-banner or use specific ones based on title if possible

    const banners = await prisma.homepage_banners.findMany()

    for (const banner of banners) {
        let newImage = '/images/banners/repair-banner.png'

        if (banner.title.toLowerCase().includes('parts') || banner.title.toLowerCase().includes('sale') || banner.title.toLowerCase().includes('new')) {
            newImage = '/images/banners/parts-banner.png'
        }

        await prisma.homepage_banners.update({
            where: { id: banner.id },
            data: {
                image_url: newImage
            }
        })
        console.log(`Updated banner [${banner.title}] -> ${newImage}`)
    }

    console.log("Homepage Banners updated.")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
