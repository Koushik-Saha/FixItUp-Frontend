// app/api/payments/webhook/route.ts
// Handle Stripe webhooks

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'
import { sendPaymentSuccessEmail, sendPaymentFailedEmail, sendRefundConfirmationEmail } from '@/lib/email'

function getStripe() {
    return new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2024-11-20.acacia' as any,
    })
}

// POST /api/payments/webhook - Handle Stripe events
export async function POST(request: NextRequest) {
    try {
        const stripe = getStripe()
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!
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
                const { data: updatedOrder } = await (supabase as any)
                    .from('orders')
                    .update({
                        payment_status: 'paid',
                        status: 'processing',
                    })
                    .eq('payment_intent_id', paymentIntent.id)
                    .select(`
                        *,
                        items:order_items(*)
                    `)
                    .single()

                console.log('Payment succeeded:', paymentIntent.id)

                // Send order confirmation email
                if (updatedOrder) {
                    await sendPaymentSuccessEmail(updatedOrder).catch(err =>
                        console.error('Failed to send order confirmation email:', err)
                    )
                }

                break
            }

            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent

                // Update order status
                const { data: failedOrder } = await (supabase as any)
                    .from('orders')
                    .update({
                        payment_status: 'failed',
                    })
                    .eq('payment_intent_id', paymentIntent.id)
                    .select()
                    .single()

                console.log('Payment failed:', paymentIntent.id)

                // Send payment failure email
                if (failedOrder) {
                    await sendPaymentFailedEmail(failedOrder).catch(err =>
                        console.error('Failed to send payment failure email:', err)
                    )
                }

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
                const { data: refundedOrder } = await (supabase as any)
                    .from('orders')
                    .update({
                        payment_status: 'refunded',
                        status: 'refunded',
                    })
                    .eq('payment_intent_id', paymentIntentId)
                    .select()
                    .single()

                console.log('Charge refunded:', paymentIntentId)

                // Send refund confirmation email
                if (refundedOrder) {
                    const refundAmount = charge.amount_refunded / 100 // Convert from cents
                    await sendRefundConfirmationEmail(refundedOrder, refundAmount).catch(err =>
                        console.error('Failed to send refund confirmation email:', err)
                    )
                }

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
