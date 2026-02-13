
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding header data...')

    // 1. Apple
    const apple = await prisma.category.upsert({
        where: { slug: 'apple' },
        update: {},
        create: { name: 'Apple', slug: 'apple', displayOrder: 1 },
    })

    const appleLines = [
        {
            name: 'iPhone', slug: 'iphone', models: [
                'iPhone 17 Pro Max', 'iPhone 17 Pro', 'iPhone 17', 'iPhone 16e',
                'iPhone 16 Pro Max', 'iPhone 16 Pro', 'iPhone 16 Plus', 'iPhone 16',
                'iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15 Plus', 'iPhone 15',
                'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14 Plus', 'iPhone 14',
                'iPhone 13 Pro Max', 'iPhone 13 Pro', 'iPhone 13', 'iPhone 13 Mini',
                'iPhone 12 Pro Max', 'iPhone 12 Pro', 'iPhone 12', 'iPhone 12 Mini',
                'iPhone 11 Pro Max', 'iPhone 11 Pro', 'iPhone 11',
                'iPhone XS Max', 'iPhone XS', 'iPhone XR', 'iPhone X',
                'iPhone 8 Plus', 'iPhone 8', 'iPhone 7 Plus', 'iPhone 7',
                'iPhone 6S Plus', 'iPhone 6S', 'iPhone 6 Plus', 'iPhone 6',
                'iPhone SE (2022)', 'iPhone SE (2020)'
            ]
        },
        { name: 'iPad', slug: 'ipad', models: ['iPad Pro 12.9"', 'iPad Pro 11"', 'iPad Air', 'iPad', 'iPad Mini'] },
        { name: 'Watch', slug: 'watch', models: ['Apple Watch Ultra 2', 'Apple Watch Series 9', 'Apple Watch SE', 'Apple Watch Ultra'] },
        { name: 'iPod', slug: 'ipod', models: [] },
        { name: 'AirPods', slug: 'airpods', models: ['AirPods Pro (2nd Gen)', 'AirPods (3rd Gen)', 'AirPods Max'] },
        { name: 'MacBook Pro', slug: 'macbook-pro', models: ['MacBook Pro 16" (M3)', 'MacBook Pro 14" (M3)', 'MacBook Pro 13" (M2)'] },
        { name: 'MacBook Air', slug: 'macbook-air', models: ['MacBook Air 15" (M2)', 'MacBook Air 13" (M2)', 'MacBook Air (M1)'] },
        { name: 'iMac', slug: 'imac', models: [] },
        { name: 'Mac Mini', slug: 'mac-mini', models: [] },
        { name: 'Mac Pro', slug: 'mac-pro', models: [] },
    ]

    for (const line of appleLines) {
        const cat = await prisma.category.upsert({
            where: { slug: line.slug }, // Try to find by slug first
            update: { parentId: apple.id }, // Ensure parent is correct in update
            create: {
                name: line.name,
                slug: line.slug,
                parentId: apple.id,
            },
        })

        // Upsert models
        for (const modelName of line.models) {
            const modelSlug = modelName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            await prisma.phoneModel.create({
                data: {
                    modelName: modelName,
                    modelSlug: modelSlug,
                    categoryId: cat.id
                }
            }).catch(() => { }) // Ignore duplicates if any, or better, verify existence first. using create for simplicity in this run, assuming cleanup or fresh state often better.
            // Actually let's do a safe upsert logic:
            /*
            await prisma.phoneModel.upsert({
                where: { id: ... }, // PhoneModel doesn't have a unique constraint on name/slug combo easily without custom index. 
                // Let's delete existing for this category to be clean?
            })
            */
        }
    }

    // 2. Samsung
    const samsung = await prisma.category.upsert({
        where: { slug: 'samsung' },
        update: {},
        create: { name: 'Samsung', slug: 'samsung', displayOrder: 2 },
    })

    const samsungLines = [
        {
            name: 'S Series', slug: 's-series', models: [
                'Galaxy S26 Ultra', 'Galaxy S26 Plus', 'Galaxy S26',
                'Galaxy S25 Ultra', 'Galaxy S25 Plus', 'Galaxy S25', 'Galaxy S25 FE',
                'Galaxy S24 Ultra', 'Galaxy S24 Plus', 'Galaxy S24', 'Galaxy S24 FE',
                'Galaxy S23 Ultra', 'Galaxy S23 Plus', 'Galaxy S23', 'Galaxy S23 FE',
                'Galaxy S22 Ultra', 'Galaxy S22 Plus', 'Galaxy S22',
                'Galaxy S21 Ultra', 'Galaxy S21 Plus', 'Galaxy S21', 'Galaxy S21 FE',
                'Galaxy S20 Ultra', 'Galaxy S20 Plus', 'Galaxy S20', 'Galaxy S20 FE',
            ]
        },
        { name: 'Note Series', slug: 'note-series', models: ['Galaxy Note 20 Ultra', 'Galaxy Note 20', 'Galaxy Note 10 Plus', 'Galaxy Note 10'] },
        { name: 'Z Series', slug: 'z-series', models: ['Galaxy Z Fold 6', 'Galaxy Z Flip 6', 'Galaxy Z Fold 5', 'Galaxy Z Flip 5'] },
        { name: 'A Series', slug: 'a-series', models: ['Galaxy A55', 'Galaxy A54', 'Galaxy A53', 'Galaxy A35', 'Galaxy A34'] },
        { name: 'Tab Series', slug: 'tab-series', models: [] },
    ]

    for (const line of samsungLines) {
        const cat = await prisma.category.upsert({
            where: { slug: line.slug },
            update: { parentId: samsung.id },
            create: { name: line.name, slug: line.slug, parentId: samsung.id }
        })

        for (const modelName of line.models) {
            const modelSlug = modelName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            await prisma.phoneModel.create({
                data: {
                    modelName: modelName,
                    modelSlug: modelSlug,
                    categoryId: cat.id
                }
            }).catch(() => { })
        }
    }

    // 3. Google
    const google = await prisma.category.upsert({
        where: { slug: 'google' },
        update: {},
        create: { name: 'Google', slug: 'google', displayOrder: 3 },
    })

    const googleLines = [
        {
            name: 'Pixel', slug: 'pixel', models: [
                'Pixel 10 Pro XL', 'Pixel 10 Pro', 'Pixel 10',
                'Pixel 9 Pro XL', 'Pixel 9 Pro Fold', 'Pixel 9 Pro', 'Pixel 9', 'Pixel 9a',
                'Pixel 8 Pro', 'Pixel 8', 'Pixel 8a',
                'Pixel 7 Pro', 'Pixel 7', 'Pixel 7a',
                'Pixel 6 Pro', 'Pixel 6', 'Pixel 6a'
            ]
        },
        { name: 'Pixel Tablet', slug: 'pixel-tablet', models: ['Pixel Tablet'] },
        { name: 'Watch', slug: 'google-watch', models: ['Pixel Watch 3', 'Pixel Watch 2'] },
    ]

    for (const line of googleLines) {
        const cat = await prisma.category.upsert({
            where: { slug: line.slug },
            update: { parentId: google.id },
            create: { name: line.name, slug: line.slug, parentId: google.id }
        })
        for (const modelName of line.models) {
            const modelSlug = modelName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            await prisma.phoneModel.create({
                data: {
                    modelName: modelName,
                    modelSlug: modelSlug,
                    categoryId: cat.id
                }
            }).catch(() => { })
        }
    }

    // 4. Motorola
    const motorola = await prisma.category.upsert({
        where: { slug: 'motorola' },
        update: {},
        create: { name: 'Motorola', slug: 'motorola', displayOrder: 4 },
    })

    const motoLines = [
        { name: 'Moto G Series', slug: 'moto-g', models: ['G Power 5G (2024)', 'G Stylus 5G (2024)', 'G Play (2024)'] },
        { name: 'Razr Series', slug: 'razr-series', models: ['Razr+ (2024)', 'Razr (2024)', 'Razr+ (2023)'] },
        { name: 'Edge Series', slug: 'edge-series', models: ['Edge+ (2023)', 'Edge (2023)'] },
    ]

    for (const line of motoLines) {
        const cat = await prisma.category.upsert({
            where: { slug: line.slug },
            update: { parentId: motorola.id },
            create: { name: line.name, slug: line.slug, parentId: motorola.id }
        })
        for (const modelName of line.models) {
            const modelSlug = modelName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            await prisma.phoneModel.create({
                data: {
                    modelName: modelName,
                    modelSlug: modelSlug,
                    categoryId: cat.id
                }
            }).catch(() => { })
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
