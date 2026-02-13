import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { errorResponse, UnauthorizedError, ForbiddenError, ValidationError } from '@/lib/utils/errors'
import { productSchema, validateData, formatValidationErrors } from '@/utils/validation'
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
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
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

        // Params
        const category = searchParams.get('category');
        const brand = searchParams.get('brand');
        const device = searchParams.get('device');
        const search = searchParams.get('search');
        const featured = searchParams.get('featured');
        const isNew = searchParams.get('new');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const sortBy = searchParams.get('sort') || 'createdAt';
        const sortOrder = searchParams.get('order') === 'asc' ? 'asc' : 'desc';
        const skip = (page - 1) * limit;
        const minPrice = parseFloat(searchParams.get('minPrice') || '0');
        const maxPrice = parseFloat(searchParams.get('maxPrice') || '1000000');

        const where: Prisma.ProductWhereInput = {
            isActive: true,
            basePrice: {
                gte: minPrice,
                lte: maxPrice
            }
        };

        if (category) {
            // Find category by slug first
            const cat = await prisma.category.findUnique({
                where: { slug: category },
                select: { id: true }
            });
            if (cat) where.categoryId = cat.id;
        }

        if (brand) where.brand = { contains: brand, mode: 'insensitive' };
        if (device) where.deviceModel = { contains: device, mode: 'insensitive' };

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { sku: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (featured === 'true') where.isFeatured = true;
        if (isNew === 'true') where.isNew = true;

        // Pricing Context
        const userId = request.headers.get('x-user-id');
        let userRole = null;
        let wholesaleTier = null;

        if (userId) {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { role: true, wholesaleTier: true }
            });
            if (user) {
                userRole = user.role;
                wholesaleTier = user.wholesaleTier;
            }
        }

        const [products, count] = await Promise.all([
            prisma.product.findMany({
                where,
                include: {
                    category: { select: { id: true, name: true, slug: true } }
                },
                orderBy: { [sortBy === 'created_at' ? 'createdAt' : sortBy]: sortOrder },
                skip,
                take: limit
            }),
            prisma.product.count({ where })
        ]);

        // Calculate Pricing
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
                discountPercentage,
                originalPrice: Number(product.basePrice),
                isWholesale: userRole === 'WHOLESALE'
            };
        });

        return NextResponse.json({
            data: productsWithPricing,
            pagination: {
                page,
                limit,
                total: count,
                totalPages: Math.ceil(count / limit),
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
        if (userRole !== 'ADMIN') {
            throw new ForbiddenError('Only admins can create products');
        }

        const body = await request.json();
        const output = validateData(productSchema, body);

        if (!output.success || !output.data) {
            return NextResponse.json({
                error: 'Validation failed',
                errors: formatValidationErrors(output.errors!)
            }, { status: 400, headers: corsHeaders });
        }

        const data = output.data;

        const product = await prisma.product.create({
            data: {
                name: data.name,
                sku: data.sku,
                slug: data.slug || data.name.toLowerCase().replace(/ /g, '-'), // Basic slug fallback
                description: data.description,
                brand: data.brand,
                deviceModel: data.device_model,
                productType: data.product_type,
                categoryId: data.category_id ?? null,
                basePrice: data.base_price,
                costPrice: data.cost_price ?? null,
                tier1Discount: data.wholesale_tier1_discount ?? 0,
                tier2Discount: data.wholesale_tier2_discount ?? 0,
                tier3Discount: data.wholesale_tier3_discount ?? 0,
                totalStock: data.total_stock ?? 0,
                lowStockThreshold: data.low_stock_threshold ?? 10,
                images: data.images,
                thumbnail: data.thumbnail,
                specifications: data.specifications || Prisma.JsonNull,
                isActive: data.is_active,
                isFeatured: data.is_featured,
                isNew: data.is_new
            }
        });

        return NextResponse.json({ data: product }, { status: 201, headers: corsHeaders });

    } catch (error) {
        const res = errorResponse(error);
        Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
        return res;
    }
}
