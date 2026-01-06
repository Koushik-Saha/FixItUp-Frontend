// app/api/orders/track/route.ts
// Order Tracking API - Allow guests to track orders with order number + email

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { errorResponse } from '@/lib/utils/errors'

// POST /api/orders/track - Track order by order number and email
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
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
        const { data: order, error: orderError } = await (supabase
            .from('orders') as any)
            .select(`
                *,
                items:order_items(
                    id,
                    product_name,
                    product_sku,
                    product_image,
                    unit_price,
                    quantity,
                    subtotal
                )
            `)
            .eq('order_number', order_number.toUpperCase())
            .ilike('customer_email', email)
            .single()

        if (orderError || !order) {
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
                order_number: order.order_number,
                status: order.status,
                payment_status: order.payment_status,
                total_amount: order.total_amount,
                created_at: order.created_at,
                updated_at: order.updated_at,
                tracking_number: order.tracking_number,
                carrier: order.carrier,
                shipped_at: order.shipped_at,
                delivered_at: order.delivered_at,
                shipping_address: order.shipping_address,
                items: order.items,
                customer_name: order.customer_name,
            },
        })

    } catch (error) {
        console.error('Order tracking error:', error)
        return errorResponse(error)
    }
}
