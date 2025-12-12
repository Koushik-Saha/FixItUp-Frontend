// app/api/orders/[id]/tracking/route.ts
// Order tracking endpoint

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { errorResponse, UnauthorizedError, NotFoundError, ForbiddenError } from '@/utils/errors'

// GET /api/orders/[id]/tracking - Get order tracking info
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient()

        // ✅ resolve params in Next 15
        const { id } = await params

        // Get authenticated user
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser()
        if (authError || !user) {
            throw new UnauthorizedError()
        }

        // Get order
        const { data: order, error: orderError } = await (supabase
            .from('orders') as any)
            .select(
                'id, order_number, user_id, status, tracking_number, carrier, shipped_at, delivered_at, created_at'
            )
            .eq('id', id) // 👈 use resolved id
            .single()

        if (orderError || !order) {
            throw new NotFoundError('Order')
        }

        // Check ownership
        const { data: profile } = await (supabase
            .from('profiles') as any)
            .select('role')
            .eq('id', user.id)
            .single()

        const isAdmin = profile?.role === 'admin'

        if (!isAdmin && order.user_id !== user.id) {
            throw new ForbiddenError('You do not have access to this order')
        }

        // Build tracking timeline
        const timeline = [
            {
                status: 'pending',
                label: 'Order Placed',
                date: order.created_at,
                completed: true,
            },
            {
                status: 'processing',
                label: 'Processing',
                date:
                    order.status === 'processing' ||
                    order.status === 'shipped' ||
                    order.status === 'delivered'
                        ? order.created_at
                        : null,
                completed: ['processing', 'shipped', 'delivered'].includes(order.status),
            },
            {
                status: 'shipped',
                label: 'Shipped',
                date: order.shipped_at,
                completed: ['shipped', 'delivered'].includes(order.status),
            },
            {
                status: 'delivered',
                label: 'Delivered',
                date: order.delivered_at,
                completed: order.status === 'delivered',
            },
        ]

        return NextResponse.json({
            data: {
                order_number: order.order_number,
                status: order.status,
                tracking_number: order.tracking_number,
                carrier: order.carrier,
                timeline,
                // tracking_url: order.carrier === 'UPS' ? `https://ups.com/track/${order.tracking_number}` : null,
            },
        })
    } catch (error) {
        return errorResponse(error)
    }
}
