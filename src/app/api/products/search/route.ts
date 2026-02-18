import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { errorResponse } from '@/lib/utils/errors'
import { Prisma } from '@prisma/client'

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
        "Access-Control-Allow-Methods": "GET,OPTIONS",
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
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q') || searchParams.get('query') || '';
        const category = searchParams.get('category');
        const brand = searchParams.get('brand');
        const minPrice = searchParams.get('min_price');
        const maxPrice = searchParams.get('max_price');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const skip = (page - 1) * limit;

        const where: Prisma.ProductWhereInput = {
            isActive: true
        };

        if (query) {
            where.OR = [
                { name: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
                { sku: { contains: query, mode: 'insensitive' } }
            ];
        }

        if (category) {
            const cat = await prisma.category.findUnique({ where: { slug: category } });
            if (cat) where.categoryId = cat.id;
        }

        if (brand) where.brand = { contains: brand, mode: 'insensitive' };

        if (minPrice || maxPrice) {
            where.basePrice = {};
            if (minPrice) where.basePrice.gte = parseFloat(minPrice);
            if (maxPrice) where.basePrice.lte = parseFloat(maxPrice);
        }

        // Pricing Context
        const userId = request.headers.get('x-user-id');
        let userRole = null;
        let wholesaleTier = null;
        if (userId) {
            const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true, wholesaleTier: true } });
            if (user) { userRole = user.role; wholesaleTier = user.wholesaleTier; }
        }

        const [products, count] = await Promise.all([
            prisma.product.findMany({
                where,
                include: { category: true },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.product.count({ where })
        ]);

        const productsWithPricing = products.map(product => {
            let displayPrice = Number(product.basePrice);
            let discountPercentage = 0;

            if (userRole === 'WHOLESALE' && wholesaleTier) {
                if (wholesaleTier === 'TIER1') discountPercentage = Number(product.tier1Discount);
                else if (wholesaleTier === 'TIER2') discountPercentage = Number(product.tier2Discount);
                else if (wholesaleTier === 'TIER3') discountPercentage = Number(product.tier3Discount);
                displayPrice = displayPrice * (1 - discountPercentage / 100);
            }

            return {
                ...product,
                displayPrice: Number(displayPrice.toFixed(2)),
                originalPrice: Number(product.basePrice),
                discountPercentage,
                isWholesale: userRole === 'WHOLESALE'
            };
        });

        return NextResponse.json({
            data: productsWithPricing,
            pagination: {
                page, limit, total: count, totalPages: Math.ceil(count / limit)
            },
            search: {
                query,
                filters: { category, brand, min_price: minPrice, max_price: maxPrice },
                results: count
            }
        }, { headers: corsHeaders });

    } catch (error) {
        const res = errorResponse(error);
        Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
        return res;
    }
}
