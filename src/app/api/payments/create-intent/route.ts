import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { errorResponse, UnauthorizedError, NotFoundError } from '@/lib/utils/errors'
import Stripe from 'stripe'

function getStripe() {
    return new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2025-11-17.clover' as any, // Cast to any to avoid strict type checks if library defs are strict
        typescript: true,
    })
}

export async function POST(request: NextRequest) {
    try {
        const userId = request.headers.get('x-user-id');
        if (!userId) throw new UnauthorizedError('Please login to proceed');

        const body = await request.json();
        const { order_id } = body;

        if (!order_id) return NextResponse.json({ error: 'order_id required' }, { status: 400 });

        const order = await prisma.order.findUnique({
            where: { id: order_id },
            include: { orderItems: true }
        });

        if (!order || order.userId !== userId) throw new NotFoundError('Order');

        // Check existing intent
        const stripe = getStripe();
        if (order.paymentIntentId) {
            try {
                const existing = await stripe.paymentIntents.retrieve(order.paymentIntentId);
                if (existing.status === 'succeeded') {
                    return NextResponse.json({ error: 'Order already paid' }, { status: 400 });
                }
                // If existing intent is canceled or requires different handling, maybe create new?
                // For now, return existing if it's usable.
                if (existing.status !== 'canceled') {
                    return NextResponse.json({
                        data: {
                            client_secret: existing.client_secret,
                            payment_intent_id: existing.id
                        }
                    });
                }
            } catch (err) {
                console.warn('Failed to retrieve existing payment intent, creating new one', err);
                // If retrieval fails (e.g. invalid ID), fall through to create new
            }
        }

        // Create new intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(Number(order.totalAmount) * 100),
            currency: 'usd',
            metadata: {
                order_id: order.id,
                order_number: order.orderNumber,
                user_id: userId,
                customer_email: order.customerEmail || ''
            },
            automatic_payment_methods: { enabled: true }
        });

        await prisma.order.update({
            where: { id: order_id },
            data: {
                paymentIntentId: paymentIntent.id,
                paymentMethod: 'stripe'
            }
        });

        return NextResponse.json({
            data: {
                client_secret: paymentIntent.client_secret,
                payment_intent_id: paymentIntent.id
            }
        });

    } catch (error) {
        console.error('Payment intent creation failed:', error);
        return errorResponse(error);
    }
}
