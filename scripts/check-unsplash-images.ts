
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log("Checking for Unsplash images...")

    const heroSlides = await prisma.heroSlide.findMany({
        where: {
            OR: [
                { image: { contains: 'unsplash' } },
                { image: { contains: 'http' } } // Check for external URLs generally if needed
            ]
        }
    })
    console.log(`Found ${heroSlides.length} HeroSlides with external/Unsplash images.`)
    heroSlides.forEach(s => console.log(`- HeroSlide [${s.title}]: ${s.image}`))

    const banners = await prisma.homepage_banners.findMany({
        where: {
            OR: [
                { image_url: { contains: 'unsplash' } },
                { image_url: { contains: 'http' } }
            ]
        }
    })
    console.log(`Found ${banners.length} HomepageBanners with external/Unsplash images.`)
    banners.forEach(b => console.log(`- Banner [${b.title}]: ${b.image_url}`))

    const categories = await prisma.category.findMany({
        where: {
            OR: [
                // { image_url: { contains: 'unsplash' } }, // Check schema if image_url exists
                // Schema has image_url String?
                { image_url: { contains: 'unsplash' } },
                { image_url: { contains: 'http' } }
            ]
        }
    })

    console.log(`Found ${categories.length} Categories with external/Unsplash images.`)
    categories.forEach(c => console.log(`- Category [${c.name}]: ${c.image_url}`))
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
