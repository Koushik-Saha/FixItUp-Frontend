
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding store data...')

    const storeData = {
        name: 'Max Phone Repair & Accessories',
        address: '110 S Hope Ave Ste. H123',
        city: 'Santa Barbara',
        state: 'CA',
        zipCode: '93105',
        phone: '(818) 402-4931',
        email: 'support@maxfitit.com', // Keeping existing email or using a placeholder if unknown
        isActive: true,
        operatingHours: {
            monday: { open: '10:00', close: '19:00' },
            tuesday: { open: '10:00', close: '19:00' },
            wednesday: { open: '10:00', close: '19:00' },
            thursday: { open: '10:00', close: '19:00' },
            friday: { open: '10:00', close: '19:00' },
            saturday: { open: '10:00', close: '19:00' },
            sunday: { open: '10:00', close: '19:00' }
        }
    }

    // Upsert the main store. We don't have a unique key other than ID, but we can try to find by name or just create it.
    // Since we want to restart/fix, let's find by name first.

    const existingStore = await prisma.store.findFirst({
        where: { name: storeData.name }
    })

    if (existingStore) {
        console.log('Updating existing store:', existingStore.name)
        await prisma.store.update({
            where: { id: existingStore.id },
            data: storeData
        })
    } else {
        // Check if we should delete old mock stores?
        // Let's delete the mock stores "Santa Barbara - Main Store", "Campbell Store", "San Francisco Store" if they exist in DB
        // But they might not exist in DB, they might be hardcoded in the frontend.
        // The previous frontend had them hardcoded.
        // So we just create this new store.
        console.log('Creating new store:', storeData.name)
        await prisma.store.create({
            data: storeData
        })
    }

    // Also clean up any mock stores if they were seeded previously with generic names
    try {
        await prisma.store.deleteMany({
            where: {
                name: {
                    in: ['Santa Barbara - Main Store', 'Campbell Store', 'San Francisco Store']
                }
            }
        })
        console.log('Cleaned up mock stores if they existed in DB.')
    } catch (e) {
        console.warn('Error cleaning up mock stores:', e)
    }

    console.log('Store seeding completed.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
