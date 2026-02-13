import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { errorResponse } from "@/lib/utils/errors";
import { Prisma } from "@prisma/client";
import { productSchema, validateData, formatValidationErrors } from "@/utils/validation";

// ... Reuse CORS helper/constants from a shared lib probably, but for now inline to matching previous file style
const allowedOrigins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "http://localhost:5001",
    "http://127.0.0.1:5001",
    process.env.NEXT_PUBLIC_SITE_URL,
].filter(Boolean) as string[];

function getCorsHeaders(request: NextRequest) {
    const origin = request.headers.get("origin") || "";
    const allowOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0] || origin;

    return {
        "Access-Control-Allow-Origin": allowOrigin,
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, x-mock-auth, x-user-id, x-user-role",
        "Access-Control-Allow-Credentials": "true",
        "Vary": "Origin",
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
    const { id } = await params;

    try {
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                category: { select: { id: true, name: true, slug: true } }
            }
        });

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404, headers: corsHeaders });
        }

        return NextResponse.json({ data: product }, { headers: corsHeaders });

    } catch (err) {
        const res = errorResponse(err);
        Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
        return res;
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const corsHeaders = getCorsHeaders(request);
    const { id } = await params;

    try {
        const body = await request.json();

        // Validation
        const validation = validateData(productSchema.partial(), body);
        if (!validation.success || !validation.data) {
            return NextResponse.json({
                error: 'Validation failed',
                errors: formatValidationErrors(validation.errors!)
            }, { status: 400, headers: corsHeaders });
        }

        const data = validation.data;

        // Check existence
        const existing = await prisma.product.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404, headers: corsHeaders });
        }

        // Check SKU dupes if changed
        if (data.sku && data.sku !== existing.sku) {
            const dupe = await prisma.product.findUnique({ where: { sku: data.sku } });
            if (dupe) {
                return NextResponse.json({ error: 'Duplicate SKU' }, { status: 400, headers: corsHeaders });
            }
        }

        const updateData: Prisma.ProductUpdateInput = {};
        if (data.name) updateData.name = data.name;
        if (data.sku) updateData.sku = data.sku;
        if (data.slug) updateData.slug = data.slug;
        if (data.category_id) updateData.category = { connect: { id: data.category_id } };
        if (data.brand) updateData.brand = data.brand;
        if (data.device_model) updateData.deviceModel = data.device_model;
        if (data.product_type) updateData.productType = data.product_type;
        if (data.base_price !== undefined) updateData.basePrice = new Prisma.Decimal(data.base_price);
        if (data.cost_price !== undefined) updateData.costPrice = data.cost_price ? new Prisma.Decimal(data.cost_price) : null;

        if (data.wholesale_tier1_discount !== undefined) updateData.tier1Discount = data.wholesale_tier1_discount ? new Prisma.Decimal(data.wholesale_tier1_discount) : 0;
        if (data.wholesale_tier2_discount !== undefined) updateData.tier2Discount = data.wholesale_tier2_discount ? new Prisma.Decimal(data.wholesale_tier2_discount) : 0;
        if (data.wholesale_tier3_discount !== undefined) updateData.tier3Discount = data.wholesale_tier3_discount ? new Prisma.Decimal(data.wholesale_tier3_discount) : 0;

        if (data.total_stock !== undefined) updateData.totalStock = data.total_stock;
        if (data.low_stock_threshold !== undefined) updateData.lowStockThreshold = data.low_stock_threshold;

        if (data.images) updateData.images = data.images;
        if (data.thumbnail) updateData.thumbnail = data.thumbnail;
        if (data.description) updateData.description = data.description;
        if (data.specifications) updateData.specifications = data.specifications as Prisma.InputJsonValue;

        if (data.meta_title) updateData.metaTitle = data.meta_title;
        if (data.meta_description) updateData.metaDescription = data.meta_description;

        if (data.is_active !== undefined) updateData.isActive = data.is_active;
        if (data.is_featured !== undefined) updateData.isFeatured = data.is_featured;
        if (data.is_new !== undefined) updateData.isNew = data.is_new;
        if (data.is_bestseller !== undefined) updateData.isBestseller = data.is_bestseller;

        const product = await prisma.product.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json({
            message: 'Product updated successfully',
            data: product
        }, { headers: corsHeaders });

    } catch (err) {
        console.error("Update Product Error", err);
        const res = errorResponse(err);
        Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
        return res;
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const corsHeaders = getCorsHeaders(request);
    const { id } = await params;

    try {
        // Soft delete
        await prisma.product.update({
            where: { id },
            data: { isActive: false }
        });

        return NextResponse.json({
            success: true,
            message: 'Product deleted successfully'
        }, { headers: corsHeaders });

    } catch (err) {
        const res = errorResponse(err);
        Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
        return res;
    }
}
