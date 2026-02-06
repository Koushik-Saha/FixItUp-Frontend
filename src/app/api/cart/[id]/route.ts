import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { errorResponse, UnauthorizedError, NotFoundError } from '@/lib/utils/errors'
import { z } from 'zod'

const updateCartSchema = z.object({
    quantity: z.number().int().positive().min(1).max(100),
})

const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5001",
    process.env.NEXT_PUBLIC_SITE_URL,
].filter(Boolean) as string[];

function getCorsHeaders(request: NextRequest) {
    const origin = request.headers.get("origin") || "";
    const allowOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0] || origin;
    return {
        "Access-Control-Allow-Origin": allowOrigin,
        "Access-Control-Allow-Methods": "PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, x-user-id, x-user-role",
        "Access-Control-Allow-Credentials": "true",
    };
}

export async function OPTIONS(request: NextRequest) {
    return new NextResponse(null, { status: 204, headers: getCorsHeaders(request) });
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const corsHeaders = getCorsHeaders(request);

    try {
        const { id } = await params;
        const userId = request.headers.get('x-user-id');
        if (!userId) throw new UnauthorizedError();

        const body = await request.json();
        const validation = updateCartSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({
                error: 'Invalid request'
            }, { status: 400, headers: corsHeaders });
        }

        const { quantity } = validation.data;

        // Fetch item to verify ownership and product stock
        const item = await prisma.cartItem.findUnique({
            where: { id },
            include: { product: true }
        });

        if (!item || item.userId !== userId) throw new NotFoundError('Cart item');

        const product = item.product;
        if (!product.isActive) {
            return NextResponse.json({ error: 'Product no longer available' }, { status: 400, headers: corsHeaders });
        }
        if (product.totalStock < quantity) {
            return NextResponse.json({ error: 'Insufficient stock', available: product.totalStock }, { status: 400, headers: corsHeaders });
        }

        const updated = await prisma.cartItem.update({
            where: { id },
            data: { quantity }
        });

        return NextResponse.json({ message: 'Cart updated', data: updated }, { headers: corsHeaders });

    } catch (error) {
        const res = errorResponse(error);
        Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
        return res;
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const corsHeaders = getCorsHeaders(request);

    try {
        const { id } = await params;
        const userId = request.headers.get('x-user-id');
        if (!userId) throw new UnauthorizedError();

        // Verify owner before delete? Standard practice.
        const item = await prisma.cartItem.findUnique({ where: { id } });
        if (!item || item.userId !== userId) throw new NotFoundError('Cart item');

        await prisma.cartItem.delete({ where: { id } });

        return NextResponse.json({ message: 'Item removed' }, { headers: corsHeaders });

    } catch (error) {
        const res = errorResponse(error);
        Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
        return res;
    }
}
