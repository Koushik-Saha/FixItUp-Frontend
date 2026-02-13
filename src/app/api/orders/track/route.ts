// app/api/orders/track/route.ts
// Order Tracking API - Allow guests to track orders with order number + email

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { errorResponse } from '@/lib/utils/errors'

// POST /api/orders/track - Track order by order number and email
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { order_number, email } = body

        // Validate inputs
        if (!order_number || !email) {
            return NextResponse.json(
                { error: 'Order number and email are required' },
                { status: 400 }
            )
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            )
        }

        // Query order by order number and email (case-insensitive)
        const order = await prisma.order.findFirst({
            where: {
                orderNumber: order_number.toUpperCase(),
                customerEmail: {
                    equals: email,
                    mode: 'insensitive'
                }
            },
            include: {
                orderItems: true
                // Note: Prisma schema has camelCase fields
            }
        })

        if (!order) {
            return NextResponse.json(
                {
                    error: 'Order not found or email does not match our records',
                    code: 'ORDER_NOT_FOUND'
                },
                { status: 404 }
            )
        }

        // Return order details (excluding sensitive information)
        return NextResponse.json({
            data: {
                order_number: order.orderNumber,
                status: order.status,
                payment_status: order.paymentStatus,
                total_amount: order.totalAmount,
                created_at: order.createdAt,
                updated_at: order.updatedAt,
                tracking_number: order.trackingNumber,
                carrier: order.carrier,
                shipped_at: order.shippedAt,
                delivered_at: order.deliveredAt,
                shipping_address: order.shippingAddress,
                items: order.orderItems.map(item => ({
                    id: item.id,
                    product_name: item.productName,
                    product_sku: item.productSku,
                    product_image: item.productImage,
                    unit_price: item.unitPrice,
                    quantity: item.quantity,
                    subtotal: item.subtotal
                })),
                customer_name: order.customerName,
            },
        })

    } catch (error) {
        console.error('Order tracking error:', error)
        return errorResponse(error)
    }
}
