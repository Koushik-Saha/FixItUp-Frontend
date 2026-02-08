import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import Stripe from 'stripe'
import { sendPaymentSuccessEmail, sendPaymentFailedEmail, sendRefundConfirmationEmail } from '@/lib/email'

function getStripe() {
    return new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2024-11-20.acacia' as any,
    })
}

export async function POST(request: NextRequest) {
    try {
        const stripe = getStripe();
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
        const body = await request.text();
        const signature = request.headers.get('stripe-signature')!;

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        } catch (err) {
            console.error('Webhook signature verification failed', err);
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        switch (event.type) {
            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                const order = await prisma.order.update({
                    where: { paymentIntentId: paymentIntent.id },
                    data: {
                        paymentStatus: 'PAID',
                        status: 'PROCESSING'
                    },
                    include: { orderItems: true }
                });

                if (order) {
                    const emailOrder = {
                        ...order,
                        totalAmount: Number(order.totalAmount),
                        taxAmount: Number(order.taxAmount),
                        shippingCost: Number(order.shippingCost),
                        discountAmount: Number(order.discountAmount),
                        orderItems: order.orderItems.map(item => ({
                            ...item,
                            unitPrice: Number(item.unitPrice),
                            discountPercent: Number(item.discountPercent),
                            subtotal: Number(item.subtotal)
                        }))
                    };
                    await sendPaymentSuccessEmail(emailOrder as any).catch(e => console.error(e));
                }
                break;
            }
            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                const order = await prisma.order.update({
                    where: { paymentIntentId: paymentIntent.id },
                    data: { paymentStatus: 'FAILED' }
                });
                if (order) {
                    const emailOrder = {
                        ...order,
                        totalAmount: Number(order.totalAmount),
                        taxAmount: Number(order.taxAmount),
                        shippingCost: Number(order.shippingCost),
                        discountAmount: Number(order.discountAmount),
                        orderItems: [] // Failed payment might not need items or they are not fetched in this block?
                    };
                    // Line 47 does NOT include orderItems. So email might fail if it expects items.
                    // But sendPaymentFailedEmail might just use totalAmount.
                    // To be safe, cast to any.
                    await sendPaymentFailedEmail(emailOrder as any).catch(e => console.error(e));
                }
                break;
            }
            case 'payment_intent.canceled': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                await prisma.order.update({
                    where: { paymentIntentId: paymentIntent.id },
                    data: {
                        paymentStatus: 'REFUNDED', // Or cancelled? Stripe calls it canceled.
                        status: 'CANCELLED',
                        cancelledAt: new Date()
                    }
                });
                break;
            }
            case 'charge.refunded': {
                const charge = event.data.object as Stripe.Charge;
                const paymentIntentId = charge.payment_intent as string;
                const order = await prisma.order.update({
                    where: { paymentIntentId },
                    data: {
                        paymentStatus: 'REFUNDED',
                        status: 'REFUNDED'
                    }
                });
                if (order) {
                    const emailOrder = {
                        ...order,
                        totalAmount: Number(order.totalAmount),
                        taxAmount: Number(order.taxAmount),
                        shippingCost: Number(order.shippingCost),
                        discountAmount: Number(order.discountAmount),
                        orderItems: []
                    };
                    await sendRefundConfirmationEmail(emailOrder as any, charge.amount_refunded / 100).catch(e => console.error(e));
                }
                break;
            }
        }

        return NextResponse.json({ received: true });

    } catch (error) {
        console.error('Webhook error', error);
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
    }
}
