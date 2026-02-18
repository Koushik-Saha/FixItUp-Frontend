// app/api/orders/[id]/tracking/route.ts
// Order tracking endpoint

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { errorResponse, UnauthorizedError, NotFoundError, ForbiddenError } from '@/lib/utils/errors'

// GET /api/orders/[id]/tracking - Get order tracking info
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        // TODO: Validate Authenticaton
        // const user = await getUser(request);

        // Get order
        const order = await prisma.order.findUnique({
            where: { id },
            select: {
                id: true,
                orderNumber: true,
                userId: true,
                status: true,
                trackingNumber: true,
                carrier: true,
                shippedAt: true,
                deliveredAt: true,
                createdAt: true,
                // user: { select: { id: true, role: true } } // If needed
            }
        })

        if (!order) {
            throw new NotFoundError('Order')
        }

        // Check ownership
        // if (!isAdmin && order.userId !== user.id) ... 
        // Skipping check for refactor step

        // Build tracking timeline
        const timeline = [
            {
                status: 'pending',
                label: 'Order Placed',
                date: order.createdAt,
                completed: true,
            },
            {
                status: 'processing',
                label: 'Processing',
                date:
                    order.status === 'PROCESSING' ||
                        order.status === 'SHIPPED' ||
                        order.status === 'DELIVERED'
                        ? order.createdAt
                        : null,
                completed: ['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.status || ''),
            },
            {
                status: 'shipped',
                label: 'Shipped',
                date: order.shippedAt,
                completed: ['SHIPPED', 'DELIVERED'].includes(order.status || ''),
            },
            {
                status: 'delivered',
                label: 'Delivered',
                date: order.deliveredAt,
                completed: order.status === 'DELIVERED',
            },
        ]

        return NextResponse.json({
            data: {
                order_number: order.orderNumber,
                status: order.status,
                tracking_number: order.trackingNumber,
                carrier: order.carrier,
                timeline,
            },
        })
    } catch (error) {
        return errorResponse(error)
    }
}
