import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { errorResponse, ForbiddenError } from '@/lib/utils/errors'
import { Prisma } from '@prisma/client'

const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5001",
    process.env.NEXT_PUBLIC_SITE_URL,
].filter(Boolean) as string[];

function getCorsHeaders(request: NextRequest) {
    const origin = request.headers.get("origin") || "";
    const allowOrigin = origin || "*";
    return {
        "Access-Control-Allow-Origin": allowOrigin,
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, x-user-id, x-user-role",
        "Access-Control-Allow-Credentials": "true",
    };
}

export async function OPTIONS(request: NextRequest) {
    return new NextResponse(null, { status: 204, headers: getCorsHeaders(request) });
}

export async function GET(request: NextRequest) {
    const corsHeaders = getCorsHeaders(request);

    try {
        const userRole = request.headers.get('x-user-role');
        if (userRole !== 'ADMIN') throw new ForbiddenError('Admin access required');

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const type = searchParams.get('type');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const skip = (page - 1) * limit;

        const where: Prisma.CouponWhereInput = {};

        if (type) where.discountType = type;

        const now = new Date();
        if (status === 'active') {
            where.isActive = true;
            where.startDate = { lte: now };
            where.OR = [
                { endDate: null },
                { endDate: { gte: now } }
            ];
        } else if (status === 'inactive') {
            where.isActive = false;
        } else if (status === 'expired') {
            where.isActive = true;
            where.endDate = { lt: now };
        }

        const [coupons, count] = await Promise.all([
            prisma.coupon.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.coupon.count({ where })
        ]);

        return NextResponse.json({
            data: coupons,
            pagination: {
                page, limit, total: count, totalPages: Math.ceil(count / limit)
            }
        }, { headers: corsHeaders });

    } catch (error) {
        const res = errorResponse(error);
        Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
        return res;
    }
}

export async function POST(request: NextRequest) {
    const corsHeaders = getCorsHeaders(request);

    try {
        const userRole = request.headers.get('x-user-role');
        if (userRole !== 'ADMIN') throw new ForbiddenError('Admin access required');

        const body = await request.json();

        // Basic validation manually or use Zod schema if available
        const {
            code, description, discount_type, discount_value,
            minimum_purchase, maximum_discount, max_uses, max_uses_per_user,
            applies_to, product_ids, category_ids, user_restrictions,
            start_date, end_date, is_active
        } = body;

        if (!code || !discount_type || discount_value === undefined) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400, headers: corsHeaders });
        }

        const existing = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
        if (existing) return NextResponse.json({ error: 'Code exists' }, { status: 400, headers: corsHeaders });

        const coupon = await prisma.coupon.create({
            data: {
                code: code.toUpperCase(),
                description,
                discountType: discount_type,
                discountValue: discount_value,
                minPurchase: minimum_purchase,
                maxDiscount: maximum_discount,
                maxUses: max_uses,
                maxUsesPerUser: max_uses_per_user,
                appliesTo: applies_to || 'all',
                productIds: product_ids || [],
                categoryIds: category_ids || [],
                userRestrictions: user_restrictions || 'all',
                startDate: start_date ? new Date(start_date) : new Date(),
                endDate: end_date ? new Date(end_date) : null,
                isActive: is_active !== false
            }
        });

        return NextResponse.json({
            message: 'Coupon created',
            data: coupon
        }, { status: 201, headers: corsHeaders });

    } catch (error) {
        const res = errorResponse(error);
        Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
        return res;
    }
}
