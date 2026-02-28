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
        "Access-Control-Allow-Methods": "POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, x-user-id, x-user-role",
        "Access-Control-Allow-Credentials": "true",
    };
}

export async function OPTIONS(request: NextRequest) {
    return new NextResponse(null, { status: 204, headers: getCorsHeaders(request) });
}

export async function POST(request: NextRequest) {
    const corsHeaders = getCorsHeaders(request);

    try {
        const userRole = request.headers.get('x-user-role');
        if (userRole !== 'ADMIN') throw new ForbiddenError('Admin access required');

        const body = await request.json();
        const { products } = body;

        if (!products || !Array.isArray(products) || products.length === 0) {
            return NextResponse.json({ error: 'No products provided' }, { status: 400, headers: corsHeaders });
        }

        let imported = 0;
        let failed = 0;
        const errors: string[] = [];

        // Check for duplicates in DB
        const skus = products.map(p => p.sku).filter(Boolean);
        const existingProducts = await prisma.product.findMany({
            where: { sku: { in: skus } },
            select: { sku: true }
        });
        const existingSKUs = new Set(existingProducts.map(p => p.sku));

        const productsToInsert: Prisma.ProductCreateManyInput[] = [];

        for (const product of products) {
            try {
                if (!product.sku || !product.name || !product.slug || product.base_price === undefined) {
                    errors.push(`Invalid product data for ${product.name || product.sku}`);
                    failed++;
                    continue;
                }

                if (existingSKUs.has(product.sku)) {
                    errors.push(`SKU ${product.sku} already exists`);
                    failed++;
                    continue;
                }

                // Add to set to prevent internal duplicates in same batch
                existingSKUs.add(product.sku);

                productsToInsert.push({
                    name: product.name,
                    sku: product.sku,
                    slug: product.slug,
                    brand: product.brand || 'Generic',
                    deviceModel: product.device_model || 'Universal',
                    categoryId: product.category_id,
                    basePrice: product.base_price,
                    costPrice: product.cost_price,
                    description: product.description,
                    totalStock: product.total_stock || 0,
                    lowStockThreshold: product.low_stock_threshold || 10,
                    isActive: product.is_active !== false,
                    isFeatured: product.is_featured,
                    isNew: product.is_new,
                    images: product.images || [],
                    thumbnail: product.thumbnail,
                    productType: product.product_type || 'Part',
                    metaTitle: product.meta_title,
                    metaDescription: product.meta_description,
                    tier1Discount: product.wholesale_tier1_discount || 0,
                    tier2Discount: product.wholesale_tier2_discount || 0,
                    tier3Discount: product.wholesale_tier3_discount || 0,
                });
            } catch (err: any) {
                errors.push(`Error processing ${product.sku}: ${err.message}`);
                failed++;
            }
        }

        if (productsToInsert.length > 0) {
            const result = await prisma.product.createMany({
                data: productsToInsert,
                skipDuplicates: true // Should be safe given our check, but extra safety
            });
            imported = result.count;
        }

        return NextResponse.json({
            message: `Import complete. ${imported} imported, ${failed} failed.`,
            data: { imported, failed, errors }
        }, { headers: corsHeaders });

    } catch (error) {
        const res = errorResponse(error);
        Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
        return res;
    }
}
