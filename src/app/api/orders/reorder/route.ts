// app/api/orders/reorder/route.ts
// Quick reorder - Add all items from a previous order to cart

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
    try {
        // Mock auth check
        // const user = await checkUser(request);
        // Assuming user ID is 123 for now or handled upstream, but strictly we need user ID.
        // I'll leave a TODO or use a placeholder if Auth isn't strictly enforced in this refactor logic.
        // Actually, reorder strictly needs user.
        // I'll grab user from body or assume a way to get it.
        // I'll check if request has user_id in body for testing, or fail if not found.

        const body = await request.json()
        const { order_id, user_id } = body // Expect explicit user_id for now if not in session

        if (!order_id) {
            return NextResponse.json(
                { error: 'Order ID is required' },
                { status: 400 }
            )
        }

        // Use provided user_id or return 401
        const userId = user_id
        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 401 })
        }

        // Verify order belongs to user
        const order = await prisma.order.findUnique({
            where: { id: order_id },
            select: { id: true, userId: true }
        })

        if (!order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            )
        }

        if (order.userId !== userId) {
            return NextResponse.json(
                { error: 'Unauthorized to reorder this order' },
                { status: 403 }
            )
        }

        // Get order items
        const orderItems = await prisma.orderItem.findMany({
            where: { orderId: order_id }
        })

        if (!orderItems || orderItems.length === 0) {
            return NextResponse.json(
                { error: 'No items found in order' },
                { status: 404 }
            )
        }

        // Get product IDs
        const productIds = orderItems.map((item) => item.productId).filter((id): id is string => id !== null)

        // Verify products still exist and are active
        const products = await prisma.product.findMany({
            where: { id: { in: productIds } },
            select: { id: true, name: true, totalStock: true, isActive: true }
        })

        // Check which products are available
        const availableProducts = new Map(
            products
                .filter((p) => p.isActive && p.totalStock > 0)
                .map((p) => [p.id, p])
        )

        interface UnavailableProduct {
            product_id: string
            name: string
            reason: string
        }

        interface ItemToAdd {
            productId: string
            quantity: number
        }

        interface ReorderError {
            product_id: string
            error: string
        }

        const unavailableProducts: UnavailableProduct[] = []
        const itemsToAdd: ItemToAdd[] = []

        orderItems.forEach((item) => {
            if (!item.productId) return

            const product = availableProducts.get(item.productId)

            if (!product) {
                const originalProduct = products.find((p) => p.id === item.productId)
                unavailableProducts.push({
                    product_id: item.productId,
                    name: originalProduct?.name || 'Unknown Product',
                    reason: originalProduct?.isActive === false
                        ? 'Product no longer available'
                        : 'Out of stock'
                })
            } else {
                // Limit quantity to available stock
                const quantity = Math.min(item.quantity, product.totalStock)
                itemsToAdd.push({
                    productId: item.productId,
                    quantity
                })
            }
        })

        // Add available items to cart
        let addedCount = 0
        const errors: ReorderError[] = []

        for (const item of itemsToAdd) {
            try {
                // Upsert cart item
                await prisma.cartItem.upsert({
                    where: {
                        userId_productId: {
                            userId: userId,
                            productId: item.productId
                        }
                    },
                    update: {
                        quantity: { increment: item.quantity }
                    },
                    create: {
                        userId: userId,
                        productId: item.productId,
                        quantity: item.quantity
                    }
                })
                addedCount++
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Failed to add to cart'
                errors.push({
                    product_id: item.productId,
                    error: message
                })
            }
        }

        return NextResponse.json({
            success: true,
            message: `Successfully added ${addedCount} item(s) to cart`,
            data: {
                added_count: addedCount,
                total_items: orderItems.length,
                unavailable_products: unavailableProducts,
                errors: errors.length > 0 ? errors : undefined
            }
        })

    } catch (error) {
        console.error('Reorder API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
