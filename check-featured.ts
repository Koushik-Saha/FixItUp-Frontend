
import prisma from './src/lib/prisma'

async function check() {
    const count = await prisma.product.count({
        where: { isFeatured: true, isActive: true }
    })
    console.log('Featured Products:', count)

    const total = await prisma.product.count()
    console.log('Total Products:', total)
}

check()
