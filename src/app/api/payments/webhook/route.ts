// app/api/payments/webhook/route.ts
// Handle Stripe webhooks

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-11-17.clover',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

// POST /api/payments/webhook - Handle Stripe events
export async function POST(request: NextRequest) {
    try {
        const body = await request.text()
        const signature = request.headers.get('stripe-signature')!

        let event: Stripe.Event

        try {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
        } catch (err) {
            console.error('Webhook signature verification failed:', err)
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 400 }
            )
        }

        const supabase = await createClient()

        // Handle different event types
        switch (event.type) {
            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent

                // Update order status
                await (supabase as any)
                    .from('orders')
                    .update({
                        payment_status: 'paid',
                        status: 'processing',
                    })
                    .eq('payment_intent_id', paymentIntent.id)

                console.log('Payment succeeded:', paymentIntent.id)

                // TODO: Send order confirmation email

                break
            }

            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent

                // Update order status
                await (supabase as any)
                    .from('orders')
                    .update({
                        payment_status: 'failed',
                    })
                    .eq('payment_intent_id', paymentIntent.id)

                console.log('Payment failed:', paymentIntent.id)

                // TODO: Send payment failure email

                break
            }

            case 'payment_intent.canceled': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent

                // Update order status
                await (supabase as any)
                    .from('orders')
                    .update({
                        payment_status: 'cancelled',
                        status: 'cancelled',
                        cancelled_at: new Date().toISOString(),
                    })
                    .eq('payment_intent_id', paymentIntent.id)

                console.log('Payment canceled:', paymentIntent.id)

                break
            }

            case 'charge.refunded': {
                const charge = event.data.object as Stripe.Charge
                const paymentIntentId = charge.payment_intent as string

                // Update order status
                await (supabase as any)
                    .from('orders')
                    .update({
                        payment_status: 'refunded',
                        status: 'refunded',
                    })
                    .eq('payment_intent_id', paymentIntentId)

                console.log('Charge refunded:', paymentIntentId)

                // TODO: Send refund confirmation email

                break
            }

            default:
                console.log('Unhandled event type:', event.type)
        }

        return NextResponse.json({ received: true })

    } catch (error) {
        console.error('Webhook error:', error)
        return NextResponse.json(
            { error: 'Webhook handler failed' },
            { status: 500 }
        )
    }
}
