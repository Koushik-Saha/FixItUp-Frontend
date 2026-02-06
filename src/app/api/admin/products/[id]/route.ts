import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { errorResponse } from "@/lib/utils/errors";
import { Prisma } from "@prisma/client";

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

        // Check existence
        const existing = await prisma.product.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404, headers: corsHeaders });
        }

        // Check SKU dupes if changed
        if (body.sku && body.sku !== existing.sku) {
            const dupe = await prisma.product.findUnique({ where: { sku: body.sku } });
            if (dupe) {
                return NextResponse.json({ error: 'Duplicate SKU' }, { status: 400, headers: corsHeaders });
            }
        }

        // Map camelCase/snake_case mapping if needed.
        // Assuming body sends snake_case from old admin panel?
        // Admin panel sends logic defined in implementation. 
        // Based on previous file, it destructured snake_case variables.
        // So we need to map snake_case body to camelCase Prisma fields.

        const updateData: any = {};
        if (body.name) updateData.name = body.name;
        if (body.sku) updateData.sku = body.sku;
        if (body.slug) updateData.slug = body.slug;
        if (body.category_id) updateData.categoryId = body.category_id;
        if (body.brand) updateData.brand = body.brand;
        if (body.device_model) updateData.deviceModel = body.device_model;
        if (body.product_type) updateData.productType = body.product_type;
        if (body.base_price !== undefined) updateData.basePrice = body.base_price;
        if (body.cost_price !== undefined) updateData.costPrice = body.cost_price;

        if (body.wholesale_tier1_discount !== undefined) updateData.tier1Discount = body.wholesale_tier1_discount;
        if (body.wholesale_tier2_discount !== undefined) updateData.tier2Discount = body.wholesale_tier2_discount;
        if (body.wholesale_tier3_discount !== undefined) updateData.tier3Discount = body.wholesale_tier3_discount;

        if (body.total_stock !== undefined) updateData.totalStock = body.total_stock;
        if (body.low_stock_threshold !== undefined) updateData.lowStockThreshold = body.low_stock_threshold;

        if (body.images) updateData.images = body.images;
        if (body.thumbnail) updateData.thumbnail = body.thumbnail;
        if (body.description) updateData.description = body.description;
        if (body.specifications) updateData.specifications = body.specifications;

        if (body.meta_title) updateData.metaTitle = body.meta_title;
        if (body.meta_description) updateData.metaDescription = body.meta_description;

        if (body.is_active !== undefined) updateData.isActive = body.is_active;
        if (body.is_featured !== undefined) updateData.isFeatured = body.is_featured;
        if (body.is_new !== undefined) updateData.isNew = body.is_new;
        if (body.is_bestseller !== undefined) updateData.isBestseller = body.is_bestseller;

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
