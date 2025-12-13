import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { errorResponse, UnauthorizedError } from '@/lib/utils/errors'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-11-17.clover' as any,
})

// POST /api/payments/create-intent - Create payment intent for order
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            throw new UnauthorizedError('Please login to proceed with payment')
        }

        // Parse request
        const body = await request.json()
        const { order_id } = body

        if (!order_id) {
            return NextResponse.json(
                { error: 'order_id is required' },
                { status: 400 }
            )
        }

        // Get order details
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('*, order_items(*)')
            .eq('id', order_id)
            .eq('user_id', user.id)
            .single()

        if (orderError || !order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            )
        }

        // Check if order already has payment intent
        if ((order as any).payment_intent_id) {
            // Retrieve existing payment intent
            const existingIntent = await stripe.paymentIntents.retrieve((order as any).payment_intent_id)

            if (existingIntent.status === 'succeeded') {
                return NextResponse.json(
                    { error: 'Order already paid' },
                    { status: 400 }
                )
            }

            // Return existing intent if still active
            return NextResponse.json({
                data: {
                    client_secret: existingIntent.client_secret,
                    payment_intent_id: existingIntent.id,
                },
            })
        }

        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(((order as any)).total_amount * 100), // Convert to cents
            currency: 'usd',
            metadata: {
                order_id: ((order as any)).id,
                order_number: ((order as any)).order_number,
                user_id: user.id,
                customer_email: ((order as any)).customer_email,
            },
            automatic_payment_methods: {
                enabled: true,
            },
        })

        // Update order with payment intent ID
        await (supabase as any)
            .from('orders')
            .update({
                payment_intent_id: paymentIntent.id,
                payment_method: 'stripe',
            })
            .eq('id', order_id)

        return NextResponse.json({
            data: {
                client_secret: paymentIntent.client_secret,
                payment_intent_id: paymentIntent.id,
            },
        })

    } catch (error) {
        console.error('Payment intent creation error:', error)
        return errorResponse(error)
    }
}
