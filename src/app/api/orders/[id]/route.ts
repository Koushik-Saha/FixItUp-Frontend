// app/api/orders/[id]/route.ts
// Orders API - Get single order details

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { errorResponse, UnauthorizedError, NotFoundError, ForbiddenError } from '@/utils/errors'

// GET /api/orders/[id] - Get order details
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient()

        // ✅ await params in Next 15
        const { id } = await params

        // Get authenticated user
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser()
        if (authError || !user) {
            throw new UnauthorizedError()
        }

        // Get order with items
        const { data: order, error: orderError } = await (supabase
            .from('orders') as any)
            .select(`
        *,
        order_items (
          id,
          product_id,
          product_name,
          product_sku,
          product_image,
          unit_price,
          discount_percentage,
          quantity,
          subtotal
        )
      `)
            .eq('id', id) // 👈 use resolved id
            .single()

        if (orderError || !order) {
            throw new NotFoundError('Order')
        }

        // Check if user is admin
        const { data: profile } = await (supabase
            .from('profiles') as any)
            .select('role')
            .eq('id', user.id)
            .single()

        const isAdmin = profile?.role === 'admin'

        // Check ownership (unless admin)
        if (!isAdmin && order.user_id !== user.id) {
            throw new ForbiddenError('You do not have access to this order')
        }

        return NextResponse.json({
            data: order,
        })
    } catch (error) {
        return errorResponse(error)
    }
}

// PUT /api/orders/[id] - Update order status (Admin only)
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient()

        // ✅ await params
        const { id } = await params

        // Get authenticated user
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser()
        if (authError || !user) {
            throw new UnauthorizedError()
        }

        // Check if user is admin
        const { data: profile } = await (supabase
            .from('profiles') as any)
            .select('role')
            .eq('id', user.id)
            .single()

        if (!profile || profile.role !== 'admin') {
            throw new ForbiddenError('Only admins can update orders')
        }

        // Parse request body
        const body = await request.json()
        const allowedUpdates = [
            'status',
            'payment_status',
            'tracking_number',
            'carrier',
            'admin_notes',
        ]

        // Filter to only allowed fields
        const updates: any = {}
        for (const key of allowedUpdates) {
            if (body[key] !== undefined) {
                updates[key] = body[key]
            }
        }

        // Set timestamps based on status
        if (body.status === 'shipped' && !updates.shipped_at) {
            updates.shipped_at = new Date().toISOString()
        }
        if (body.status === 'delivered' && !updates.delivered_at) {
            updates.delivered_at = new Date().toISOString()
        }
        if (body.status === 'cancelled' && !updates.cancelled_at) {
            updates.cancelled_at = new Date().toISOString()
        }

        // Update order
        const { data: updatedOrder, error: updateError } = await (supabase
            .from('orders') as any)
            .update(updates)
            .eq('id', id) // 👈 use resolved id
            .select()
            .single()

        if (updateError || !updatedOrder) {
            throw new NotFoundError('Order')
        }

        // TODO: Send email notification to customer about status update

        return NextResponse.json({
            message: 'Order updated successfully',
            data: updatedOrder,
        })
    } catch (error) {
        return errorResponse(error)
    }
}
