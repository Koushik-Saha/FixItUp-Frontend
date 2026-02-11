import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { errorResponse, NotFoundError, ForbiddenError, ValidationError } from '@/lib/utils/errors'
import { productSchema, validateData, formatValidationErrors } from '@/utils/validation'

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
        "Access-Control-Allow-Methods": "GET,PUT,DELETE,OPTIONS",
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
        const userId = request.headers.get('x-user-id');
        const userRole = request.headers.get('x-user-role'); // Passed from middleware

        const product = await prisma.product.findUnique({
            where: { id },
            include: { category: true }
        });

        if (!product) throw new NotFoundError('Product');

        // Check if active (admins can see inactive)
        const isAdmin = userRole === 'ADMIN';
        if (!product.isActive && !isAdmin) {
            throw new NotFoundError('Product');
        }

        // Pricing
        let wholesaleTier = null;
        if (userId) {
            const user = await prisma.user.findUnique({ where: { id: userId }, select: { wholesaleTier: true } });
            wholesaleTier = user?.wholesaleTier;
        }

        let displayPrice = Number(product.basePrice);
        let discountPercentage = 0;

        if (userRole === 'WHOLESALE' && wholesaleTier) {
            if (wholesaleTier === 'TIER1') discountPercentage = Number(product.tier1Discount);
            else if (wholesaleTier === 'TIER2') discountPercentage = Number(product.tier2Discount);
            else if (wholesaleTier === 'TIER3') discountPercentage = Number(product.tier3Discount);
            displayPrice = displayPrice * (1 - discountPercentage / 100);
        }

        // Inventory (Assuming Inventory model exists or using totalStock from Product)
        // Schema shows Inventory model linked to Store and Product.
        const inventory = await prisma.inventory.findMany({
            where: { productId: id },
            include: { store: true }
        });

        return NextResponse.json({
            data: {
                ...product,
                displayPrice: Number(displayPrice.toFixed(2)),
                discountPercentage,
                originalPrice: Number(product.basePrice),
                isWholesale: userRole === 'WHOLESALE',
                inventory: inventory || []
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
            throw new ForbiddenError('Only admins can update products');
        }

        const body = await request.json();
        const output = validateData(productSchema.partial(), body);

        if (!output.success) {
            return NextResponse.json({
                error: 'Validation failed',
                errors: formatValidationErrors(output.errors!)
            }, { status: 400, headers: corsHeaders });
        }

        const data = output.data!;

        const updateData: Prisma.ProductUpdateInput = {};
        if (data.name !== undefined) updateData.name = data.name;
        if (data.sku !== undefined) updateData.sku = data.sku;
        if (data.slug !== undefined) updateData.slug = data.slug;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.brand !== undefined) updateData.brand = data.brand;
        if (data.device_model !== undefined) updateData.deviceModel = data.device_model;
        if (data.category_id !== undefined) {
            updateData.category = { connect: { id: data.category_id } };
        }
        if (data.base_price !== undefined) updateData.basePrice = new Prisma.Decimal(data.base_price);
        if (data.cost_price !== undefined) updateData.costPrice = new Prisma.Decimal(data.cost_price);
        if (data.total_stock !== undefined) updateData.totalStock = data.total_stock;
        if (data.is_active !== undefined) updateData.isActive = data.is_active;
        if (data.is_featured !== undefined) updateData.isFeatured = data.is_featured;
        if (data.is_new !== undefined) updateData.isNew = data.is_new;
        if (data.images !== undefined) updateData.images = data.images;
        if (data.thumbnail !== undefined) updateData.thumbnail = data.thumbnail;
        if (data.specifications !== undefined) updateData.specifications = data.specifications as Prisma.InputJsonValue;
        // Wholesale discounts
        if (data.wholesale_tier1_discount !== undefined) updateData.tier1Discount = new Prisma.Decimal(data.wholesale_tier1_discount);
        if (data.wholesale_tier2_discount !== undefined) updateData.tier2Discount = new Prisma.Decimal(data.wholesale_tier2_discount);
        if (data.wholesale_tier3_discount !== undefined) updateData.tier3Discount = new Prisma.Decimal(data.wholesale_tier3_discount);


        const product = await prisma.product.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json({ data: product }, { headers: corsHeaders });

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
        const userRole = request.headers.get('x-user-role');

        if (userRole !== 'ADMIN') {
            throw new ForbiddenError('Only admins can delete products');
        }

        // Soft Delete
        await prisma.product.update({
            where: { id },
            data: { isActive: false }
        });

        return NextResponse.json({ message: 'Product deleted successfully' }, { headers: corsHeaders });

    } catch (error) {
        const res = errorResponse(error);
        Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
        return res;
    }
}
