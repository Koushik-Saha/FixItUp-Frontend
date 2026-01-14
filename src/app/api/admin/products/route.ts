// app/api/admin/products/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { errorResponse, UnauthorizedError } from "@/lib/utils/errors";

// Put your frontend URL here (dev + prod)
const allowedOrigins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "http://localhost:5001",
    "http://127.0.0.1:5001",
    process.env.NEXT_PUBLIC_SITE_URL, // e.g. https://yourdomain.com
].filter(Boolean) as string[];

function getCorsHeaders(request: NextRequest) {
    const origin = request.headers.get("origin") || "";
    const allowOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0] || origin;

    return {
        "Access-Control-Allow-Origin": allowOrigin,
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, x-mock-auth",
        "Access-Control-Allow-Credentials": "true", // needed when using cookies/session
        "Vary": "Origin",
    };
}

// Preflight handler (THIS is what fixes browser CORS blocks)
export async function OPTIONS(request: NextRequest) {
    return new NextResponse(null, { status: 204, headers: getCorsHeaders(request) });
}

// Helper to check if user is admin
async function checkAdmin(supabase: any, userId: string) {
    const { data: profile } = await (supabase.from("profiles") as any)
        .select("role")
        .eq("id", userId)
        .single();

    if (!profile || profile.role !== "admin") {
        throw new UnauthorizedError("Admin access required");
    }
}

// GET /api/admin/products - List products with filters
export async function GET(request: NextRequest) {
    const corsHeaders = getCorsHeaders(request);

    try {
        const supabase = await createClient();
        const { searchParams } = new URL(request.url);

        // Development bypass for mock auth
        const isDevelopment = process.env.NODE_ENV === 'development';
        const mockAuthToken = request.headers.get('x-mock-auth');

        if (isDevelopment && mockAuthToken === 'mock-dev-token') {
            // Skip authentication in development with mock token
        } else {
            // Check authentication
            const {
                data: { user },
                error: authError,
            } = await supabase.auth.getUser();

            if (authError || !user) {
                throw new UnauthorizedError("Please login to access this resource");
            }

            // Check admin role
            await checkAdmin(supabase, user.id);
        }

        // Get query parameters
        const search = searchParams.get("search");
        const category = searchParams.get("category");
        const brand = searchParams.get("brand");
        const status = searchParams.get("status");
        const stock = searchParams.get("stock");
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "50", 10);

        // Build query
        let query = (supabase.from("products") as any).select(
            `
              *,
              categories(id, name, slug),
              product_models!fk_products_model_id (
                id,
                name
              )
            `,
            { count: "exact" }
        );

        if (search) {
            query = query.or(
                `name.ilike.%${search}%,sku.ilike.%${search}%,brand.ilike.%${search}%,device_model.ilike.%${search}%`
            );
        }

        if (category) query = query.eq("category_id", category);
        if (brand) query = query.eq("brand", brand);

        if (status === "active") query = query.eq("is_active", true);
        if (status === "inactive") query = query.eq("is_active", false);

        if (stock === "out-of-stock") query = query.eq("total_stock", 0);
        if (stock === "low-stock") query = query.gt("total_stock", 0).lte("total_stock", "low_stock_threshold");
        if (stock === "in-stock") query = query.gt("total_stock", 0);

        query = query.order("created_at", { ascending: false });

        const from = (page - 1) * limit;
        const to = from + limit - 1;
        query = query.range(from, to);

        const { data: products, error, count } = await query;

        if (error) {
            console.error("Failed to fetch products:", error);
            return NextResponse.json({ error: "Failed to fetch products" }, { status: 500, headers: corsHeaders });
        }

        return NextResponse.json(
            {
                data: products,
                pagination: {
                    page,
                    limit,
                    total: count || 0,
                    totalPages: Math.ceil((count || 0) / limit),
                },
            },
            { headers: corsHeaders }
        );
    } catch (err) {
        // Ensure CORS headers are included even on error
        const res = errorResponse(err);
        res.headers.set("Access-Control-Allow-Origin", corsHeaders["Access-Control-Allow-Origin"]);
        res.headers.set("Access-Control-Allow-Methods", corsHeaders["Access-Control-Allow-Methods"]);
        res.headers.set("Access-Control-Allow-Headers", corsHeaders["Access-Control-Allow-Headers"]);
        res.headers.set("Access-Control-Allow-Credentials", corsHeaders["Access-Control-Allow-Credentials"]);
        res.headers.set("Vary", corsHeaders["Vary"]);
        return res;
    }
}

// POST /api/admin/products - Create new product
export async function POST(request: NextRequest) {
    const corsHeaders = getCorsHeaders(request);

    try {
        const supabase = await createClient();
        const body = await request.json();

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            throw new UnauthorizedError("Please login to access this resource");
        }

        await checkAdmin(supabase, user.id);

        const {
            name,
            sku,
            slug,
            category_id,
            brand,
            device_model,
            product_type,
            base_price,
            cost_price,
            wholesale_tier1_discount,
            wholesale_tier2_discount,
            wholesale_tier3_discount,
            total_stock,
            low_stock_threshold,
            images,
            thumbnail,
            description,
            specifications,
            meta_title,
            meta_description,
            is_active,
            is_featured,
            is_new,
            is_bestseller,
        } = body;

        if (!name || !sku || !slug || !brand || base_price === undefined) {
            return NextResponse.json(
                { error: "Missing required fields: name, sku, slug, brand, base_price" },
                { status: 400, headers: corsHeaders }
            );
        }

        const { data: existingProduct } = await (supabase.from("products") as any)
            .select("id")
            .eq("sku", sku)
            .single();

        if (existingProduct) {
            return NextResponse.json(
                { error: "Product with this SKU already exists" },
                { status: 400, headers: corsHeaders }
            );
        }

        const { data: product, error: createError } = await (supabase.from("products") as any)
            .insert({
                name,
                sku,
                slug,
                category_id,
                brand,
                device_model,
                product_type,
                base_price,
                cost_price,
                wholesale_tier1_discount: wholesale_tier1_discount || 0,
                wholesale_tier2_discount: wholesale_tier2_discount || 0,
                wholesale_tier3_discount: wholesale_tier3_discount || 0,
                total_stock: total_stock || 0,
                low_stock_threshold: low_stock_threshold || 10,
                images: images || [],
                thumbnail,
                description,
                specifications,
                meta_title,
                meta_description,
                is_active: is_active !== false,
                is_featured: is_featured || false,
                is_new: is_new || false,
                is_bestseller: is_bestseller || false,
            })
            .select()
            .single();

        if (createError) {
            console.error("Failed to create product:", createError);
            return NextResponse.json({ error: "Failed to create product" }, { status: 500, headers: corsHeaders });
        }

        return NextResponse.json(
            { message: "Product created successfully", data: product },
            { status: 201, headers: corsHeaders }
        );
    } catch (err) {
        const res = errorResponse(err);
        res.headers.set("Access-Control-Allow-Origin", corsHeaders["Access-Control-Allow-Origin"]);
        res.headers.set("Access-Control-Allow-Methods", corsHeaders["Access-Control-Allow-Methods"]);
        res.headers.set("Access-Control-Allow-Headers", corsHeaders["Access-Control-Allow-Headers"]);
        res.headers.set("Access-Control-Allow-Credentials", corsHeaders["Access-Control-Allow-Credentials"]);
        res.headers.set("Vary", corsHeaders["Vary"]);
        return res;
    }
}
