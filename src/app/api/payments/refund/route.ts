// app/api/payments/refund/route.ts
// Process refunds (Admin only)

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { errorResponse, UnauthorizedError, ForbiddenError } from '@/lib/utils/errors'
import Stripe from 'stripe'

function getStripe() {
    return new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2024-11-20.acacia' as any,
    })
}

// POST /api/payments/refund - Process refund
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            throw new UnauthorizedError()
        }

        // Check if user is admin
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (!profile || (profile as any).role !== 'admin') {
            throw new ForbiddenError('Only admins can process refunds')
        }

        // Parse request
        const body = await request.json()
        const { order_id, amount, reason } = body

        if (!order_id) {
            return NextResponse.json(
                { error: 'order_id is required' },
                { status: 400 }
            )
        }

        // Get order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('*')
            .eq('id', order_id)
            .single()

        if (orderError || !order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            )
        }

        if (!((order as any)).payment_intent_id) {
            return NextResponse.json(
                { error: 'No payment found for this order' },
                { status: 400 }
            )
        }

        if (((order as any)).payment_status !== 'paid') {
            return NextResponse.json(
                { error: 'Order is not paid' },
                { status: 400 }
            )
        }

        const stripe = getStripe()

        // Process refund
        const refundAmount = amount ? Math.round(amount * 100) : undefined

        const refund = await stripe.refunds.create({
            payment_intent: ((order as any)).payment_intent_id,
            amount: refundAmount, // undefined = full refund
            reason: reason || 'requested_by_customer',
            metadata: {
                order_id: ((order as any)).id,
                order_number: ((order as any)).order_number,
                refunded_by: user.id,
            },
        })

        // Update order
        const isPartialRefund = refundAmount && refundAmount < ((order as any)).total_amount * 100

        await (supabase as any)
            .from('orders')
            .update({
                payment_status: isPartialRefund ? 'partially_refunded' : 'refunded',
                status: isPartialRefund ? ((order as any)).status : 'refunded',
                admin_notes: `Refund processed: ${refund.id}. Reason: ${reason || 'Customer request'}`,
            })
            .eq('id', order_id)

        // TODO: Send refund confirmation email

        return NextResponse.json({
            message: 'Refund processed successfully',
            data: {
                refund_id: refund.id,
                amount: refund.amount / 100,
                status: refund.status,
            },
        })

    } catch (error) {
        console.error('Refund error:', error)
        return errorResponse(error)
    }
}
