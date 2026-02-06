import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { errorResponse, UnauthorizedError, NotFoundError, ForbiddenError } from '@/lib/utils/errors'
import { sendOrderStatusUpdateEmail } from '@/lib/email'

// Reuse CORS logic ideally
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5001",
    process.env.NEXT_PUBLIC_SITE_URL,
].filter(Boolean) as string[];

function getCorsHeaders(request: NextRequest) {
    // Basic CORS for errors/responses
    return {
        "Access-Control-Allow-Origin": "*", // Simplify for now or use dynamic
        "Access-Control-Allow-Methods": "GET,PUT,OPTIONS",
    };
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const userId = request.headers.get('x-user-id');
        const userRole = request.headers.get('x-user-role');

        if (!userId) throw new UnauthorizedError();

        const order = await prisma.order.findUnique({
            where: { id },
            include: { orderItems: true }
        });

        if (!order) throw new NotFoundError('Order');

        // Check Access
        const isAdmin = userRole === 'ADMIN';
        if (!isAdmin && order.userId !== userId) {
            throw new ForbiddenError('Access denied');
        }

        return NextResponse.json({ data: order });

    } catch (error) {
        return errorResponse(error);
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const userRole = request.headers.get('x-user-role');

        if (userRole !== 'ADMIN') {
            throw new ForbiddenError('Admin access required');
        }

        const body = await request.json();

        // Allowed field mapping
        const updateData: any = {};
        if (body.status) updateData.status = body.status.toUpperCase(); // Ensure Enum match?
        if (body.payment_status) updateData.paymentStatus = body.payment_status.toUpperCase();
        if (body.tracking_number) updateData.trackingNumber = body.tracking_number;
        if (body.carrier) updateData.carrier = body.carrier;
        if (body.admin_notes) updateData.adminNotes = body.admin_notes;

        // Timestamps
        const now = new Date();
        if (body.status === 'shipped') updateData.shippedAt = now;
        if (body.status === 'delivered') updateData.deliveredAt = now;
        if (body.status === 'cancelled') updateData.cancelledAt = now;

        const updatedOrder = await prisma.order.update({
            where: { id },
            data: updateData
        });

        // Email Notification
        // Note: sendOrderStatusUpdateEmail likely expects specific shape.
        try {
            if (body.status) {
                await sendOrderStatusUpdateEmail(updatedOrder as any, body.status);
            }
        } catch (e) {
            console.error('Email failed', e);
        }

        return NextResponse.json({
            message: 'Order updated successfully',
            data: updatedOrder
        });

    } catch (error) {
        return errorResponse(error);
    }
}
