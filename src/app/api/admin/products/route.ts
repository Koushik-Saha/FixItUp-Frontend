import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { errorResponse, UnauthorizedError } from "@/lib/utils/errors";
import { Prisma } from "@prisma/client";
import { productSchema, validateData, formatValidationErrors } from "@/utils/validation";

// Put your frontend URL here (dev + prod)
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

// GET /api/admin/products
export async function GET(request: NextRequest) {
    const corsHeaders = getCorsHeaders(request);

    try {
        // Auth Check (Defense in Depth)
        const userRole = request.headers.get("x-user-role");
        if (userRole !== "ADMIN") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401, headers: corsHeaders }
            );
        }

        // Search Params
        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search");
        const category = searchParams.get("category");
        const brand = searchParams.get("brand");
        const status = searchParams.get("status");
        const stock = searchParams.get("stock");
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "50", 10);
        const skip = (page - 1) * limit;

        // Build Filter
        const where: Prisma.ProductWhereInput = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { sku: { contains: search, mode: 'insensitive' } },
                { brand: { contains: search, mode: 'insensitive' } },
                { deviceModel: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (category) where.categoryId = category;
        if (brand) where.brand = brand;

        if (status === "active") where.isActive = true;
        if (status === "inactive") where.isActive = false;

        if (stock === "out-of-stock") where.totalStock = 0;
        else if (stock === "in-stock") where.totalStock = { gt: 0 };
        else if (stock === "low-stock") {
            // Prisma doesn't support field comparison in where naturally easily without raw query or advanced filtering
            // For now, simplify to < 10 or just fetch all and filter? 
            // Better: use raw query if absolutely needed, but for now let's use a fixed threshold or logic.
            // Actually, we store 'lowStockThreshold' as a field. 
            // Standard prisma: where: { totalStock: { lte: 10 } } is easiest approximation if dynamic field comparison is hard.
            where.totalStock = { lte: 10, gt: 0 };
        }

        const [products, count] = await Promise.all([
            prisma.product.findMany({
                where,
                include: {
                    category: {
                        select: { id: true, name: true, slug: true }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.product.count({ where }),
        ]);

        return NextResponse.json(
            {
                data: products,
                pagination: {
                    page,
                    limit,
                    total: count,
                    totalPages: Math.ceil(count / limit),
                },
            },
            { headers: corsHeaders }
        );

    } catch (err) {
        console.error("GET Products Error", err);
        const res = errorResponse(err);
        // Copy CORS headers
        Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
        return res;
    }
}

// POST /api/admin/products
export async function POST(request: NextRequest) {
    const corsHeaders = getCorsHeaders(request);

    try {
        const body = await request.json();

        // Validation
        // Validation
        const validation = validateData(productSchema, body);

        if (!validation.success || !validation.data) {
            return NextResponse.json({
                error: 'Validation failed',
                errors: formatValidationErrors(validation.errors!)
            }, { status: 400, headers: corsHeaders });
        }

        const data = validation.data;

        // Check Duplicate SKU
        const existing = await prisma.product.findUnique({ where: { sku: data.sku } });
        if (existing) {
            return NextResponse.json(
                { error: "Product with this SKU already exists" },
                { status: 400, headers: corsHeaders }
            );
        }

        const product = await prisma.product.create({
            data: {
                name: data.name,
                sku: data.sku,
                slug: data.slug,
                categoryId: data.category_id || null, // Handle optional UUID
                brand: data.brand,
                deviceModel: data.device_model,
                productType: data.product_type,
                basePrice: new Prisma.Decimal(data.base_price),
                costPrice: data.cost_price ? new Prisma.Decimal(data.cost_price) : undefined,
                tier1Discount: data.wholesale_tier1_discount ? new Prisma.Decimal(data.wholesale_tier1_discount) : 0,
                tier2Discount: data.wholesale_tier2_discount ? new Prisma.Decimal(data.wholesale_tier2_discount) : 0,
                tier3Discount: data.wholesale_tier3_discount ? new Prisma.Decimal(data.wholesale_tier3_discount) : 0,
                totalStock: data.total_stock || 0,
                lowStockThreshold: data.low_stock_threshold || 10,
                images: data.images || [],
                thumbnail: data.thumbnail,
                description: data.description,
                specifications: (data.specifications as Prisma.InputJsonValue) || Prisma.JsonNull,
                metaTitle: data.meta_title,
                metaDescription: data.meta_description,
                isActive: data.is_active !== false,
                isFeatured: data.is_featured || false,
                isNew: data.is_new || false,
                isBestseller: data.is_bestseller || false,
            }
        });

        return NextResponse.json(
            { message: "Product created successfully", data: product },
            { status: 201, headers: corsHeaders }
        );

    } catch (err) {
        console.error("Create Product Error", err);
        const res = errorResponse(err);
        Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
        return res;
    }
}
