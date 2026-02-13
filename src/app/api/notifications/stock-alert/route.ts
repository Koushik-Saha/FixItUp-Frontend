// app/api/notifications/stock-alert/route.ts
// Subscribe to back-in-stock notifications

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { errorResponse } from '@/lib/utils/errors'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { product_id, email } = body

        if (!product_id || !email) {
            return NextResponse.json(
                { error: 'Product ID and email are required' },
                { status: 400 }
            )
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email address' },
                { status: 400 }
            )
        }

        // Check if product exists
        const product = await prisma.product.findUnique({
            where: { id: product_id }
        });

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            )
        }

        // Check if already subscribed
        const existing = await prisma.stockAlert.findFirst({
            where: {
                productId: product_id,
                userEmail: email.toLowerCase(),
                notifiedAt: null // Only check for active alerts
            }
        });

        if (existing) {
            return NextResponse.json({
                success: true,
                message: 'You are already subscribed to notifications for this product'
            })
        }

        // Create stock alert subscription
        await prisma.stockAlert.create({
            data: {
                productId: product_id, // Map snake_case input to camelCase model field if needed, but here variable is product_id
                userEmail: email.toLowerCase(),
                // notifiedAt default is null which means not notified
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Successfully subscribed to stock notifications'
        })

    } catch (error) {
        console.error('Stock alert API error:', error)
        return errorResponse(error);
    }
}
