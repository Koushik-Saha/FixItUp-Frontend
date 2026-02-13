import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { errorResponse, ForbiddenError, NotFoundError } from '@/lib/utils/errors'
import Stripe from 'stripe'

function getStripe() {
    return new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2024-11-20.acacia' as any,
    })
}

export async function POST(request: NextRequest) {
    try {
        const userRole = request.headers.get('x-user-role');
        const userId = request.headers.get('x-user-id');
        if (userRole !== 'ADMIN') throw new ForbiddenError('Admin access required');

        const body = await request.json();
        const { order_id, amount, reason } = body;

        if (!order_id) return NextResponse.json({ error: 'order_id required' }, { status: 400 });

        const order = await prisma.order.findUnique({ where: { id: order_id } });
        if (!order) throw new NotFoundError('Order');
        if (!order.paymentIntentId) return NextResponse.json({ error: 'No payment info' }, { status: 400 });
        if (order.paymentStatus !== 'PAID') return NextResponse.json({ error: 'Order not paid' }, { status: 400 });

        const stripe = getStripe();
        const refundAmount = amount ? Math.round(amount * 100) : undefined;

        const refund = await stripe.refunds.create({
            payment_intent: order.paymentIntentId,
            amount: refundAmount,
            reason: reason || 'requested_by_customer',
            metadata: {
                order_id: order.id,
                order_number: order.orderNumber,
                refunded_by: userId || 'admin'
            }
        });

        const isPartial = refundAmount && refundAmount < Number(order.totalAmount) * 100;

        await prisma.order.update({
            where: { id: order_id },
            data: {
                paymentStatus: isPartial ? 'PAID' : 'REFUNDED', // Or custom status for partial? Default Schema only has REFUNDED.
                status: isPartial ? order.status : 'REFUNDED',
                adminNotes: `Refund processed: ${refund.id}. Reason: ${reason}`
            }
        });

        return NextResponse.json({
            message: 'Refund successful',
            data: {
                refund_id: refund.id,
                amount: refund.amount / 100,
                status: refund.status
            }
        });

    } catch (error) {
        return errorResponse(error);
    }
}
