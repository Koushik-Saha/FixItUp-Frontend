import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { errorResponse, UnauthorizedError, NotFoundError } from '@/lib/utils/errors'

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
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, x-user-id, x-user-role",
        "Access-Control-Allow-Credentials": "true",
    };
}

export async function OPTIONS(request: NextRequest) {
    return new NextResponse(null, { status: 204, headers: getCorsHeaders(request) });
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const corsHeaders = getCorsHeaders(request);

    try {
        const { id } = await params;

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                fullName: true,
                phone: true,
                role: true,
                wholesaleStatus: true,
                wholesaleTier: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'Customer not found' }, { status: 404, headers: corsHeaders });
        }

        // Stats
        const [orderStats, repairCount] = await Promise.all([
            prisma.order.aggregate({
                where: { userId: id },
                _count: { id: true },
                _sum: { totalAmount: true }
            }),
            prisma.repairTicket.count({ where: { customerId: id } })
        ]);

        return NextResponse.json({
            data: {
                ...user,
                stats: {
                    total_orders: orderStats._count.id,
                    total_spent: Number(orderStats._sum.totalAmount || 0),
                    total_repairs: repairCount
                }
            }
        }, { headers: corsHeaders });

    } catch (error) {
        const res = errorResponse(error);
        Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
        return res;
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const corsHeaders = getCorsHeaders(request);

    try {
        const { id } = await params;
        const userRole = request.headers.get('x-user-role');

        if (userRole !== 'ADMIN') {
            // throw new UnauthorizedError('Admin required');
        }

        const body = await request.json();
        const updateData: Prisma.UserUpdateInput = {};

        if (body.full_name) updateData.fullName = body.full_name;
        if (body.phone) updateData.phone = body.phone;
        if (body.role) updateData.role = body.role.toUpperCase() as any;
        if (body.wholesale_tier) updateData.wholesaleTier = body.wholesale_tier.toUpperCase() as any;
        if (body.wholesale_status) updateData.wholesaleStatus = body.wholesale_status.toUpperCase() as any;
        if (body.email) updateData.email = body.email;

        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json({
            message: 'Customer updated successfully',
            data: updatedUser
        }, { headers: corsHeaders });

    } catch (error) {
        const res = errorResponse(error);
        Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
        return res;
    }
}
