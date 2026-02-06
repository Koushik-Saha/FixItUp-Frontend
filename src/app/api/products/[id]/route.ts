import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
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

        // Map frontend fields (snake_case) to Prisma (camelCase) if validation uses snake_case output
        // Assuming validateData returns object with same keys as schema (snake_case likely)
        // Prisma uses camelCase cols. 
        // Let's assume `data` contains snake_case keys from schema, need mapping.

        const updateData: any = {};
        if (data.name) updateData.name = data.name;
        if (data.sku) updateData.sku = data.sku;
        if (data.slug) updateData.slug = data.slug;
        if (data.description) updateData.description = data.description;
        if (data.brand) updateData.brand = data.brand;
        if (data.device_model) updateData.deviceModel = data.device_model;
        if (data.category_id) updateData.categoryId = data.category_id;
        if (data.base_price) updateData.basePrice = data.base_price;
        if (data.cost_price) updateData.costPrice = data.cost_price;
        if (data.total_stock) updateData.totalStock = data.total_stock;
        if (data.is_active !== undefined) updateData.isActive = data.is_active;
        if (data.is_featured !== undefined) updateData.isFeatured = data.is_featured;
        if (data.is_new !== undefined) updateData.isNew = data.is_new;
        if (data.images) updateData.images = data.images;
        if (data.thumbnail) updateData.thumbnail = data.thumbnail;
        if (data.specifications) updateData.specifications = data.specifications;
        // Wholesale discounts
        if (data.wholesale_tier1_discount) updateData.tier1Discount = data.wholesale_tier1_discount;
        if (data.wholesale_tier2_discount) updateData.tier2Discount = data.wholesale_tier2_discount;
        if (data.wholesale_tier3_discount) updateData.tier3Discount = data.wholesale_tier3_discount;


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
