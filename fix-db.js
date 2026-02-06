
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


async function main() {
    try {
        const constraints = [
            'fk_cart_items_user_id',
            'coupon_usage_user_id_fkey',
            'orders_user_id_fkey',
            'reviews_user_id_fkey',
            'wishlists_user_id_fkey',
            'repair_tickets_customer_id_fkey',
            'wholesale_applications_user_id_fkey',
            'order_status_history_changed_by_fkey',
            'fk_orders_user_id',
            'fk_repair_tickets_customer_id'
        ];

        for (const constraint of constraints) {
            console.log(`Attempting to drop ${constraint}...`)
            // We need to know the table for each, or try to find it. 
            // Simpler: Try on the likely table.
            // cart_items, coupon_usage, orders, reviews, wishlists, repair_tickets, wholesale_applications
        }

        // Explicit drops
        await prisma.$executeRawUnsafe(`ALTER TABLE "cart_items" DROP CONSTRAINT IF EXISTS "fk_cart_items_user_id";`)
        await prisma.$executeRawUnsafe(`ALTER TABLE "coupon_usage" DROP CONSTRAINT IF EXISTS "coupon_usage_user_id_fkey";`)
        await prisma.$executeRawUnsafe(`ALTER TABLE "orders" DROP CONSTRAINT IF EXISTS "orders_user_id_fkey";`)
        await prisma.$executeRawUnsafe(`ALTER TABLE "orders" DROP CONSTRAINT IF EXISTS "fk_orders_user_id";`)
        await prisma.$executeRawUnsafe(`ALTER TABLE "reviews" DROP CONSTRAINT IF EXISTS "reviews_user_id_fkey";`)
        await prisma.$executeRawUnsafe(`ALTER TABLE "wishlists" DROP CONSTRAINT IF EXISTS "wishlists_user_id_fkey";`)
        await prisma.$executeRawUnsafe(`ALTER TABLE "order_status_history" DROP CONSTRAINT IF EXISTS "order_status_history_changed_by_fkey";`)
        await prisma.$executeRawUnsafe(`ALTER TABLE "repair_tickets" DROP CONSTRAINT IF EXISTS "fk_repair_tickets_customer_id";`)

        console.log('Successfully dropped (or checked) constraints.')
    } catch (e) {
        console.error('Error:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
