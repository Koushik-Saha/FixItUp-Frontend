import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Helper for CORS
function getCorsHeaders(request: NextRequest) {
    const origin = request.headers.get("origin") || "";
    return {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, x-mock-auth, x-user-id, x-user-role",
        "Access-Control-Allow-Credentials": "true",
    };
}

export async function OPTIONS(request: NextRequest) {
    return new NextResponse(null, { status: 204, headers: getCorsHeaders(request) });
}

// GET /api/admin/categories
export async function GET(request: NextRequest) {
    const corsHeaders = getCorsHeaders(request);

    try {
        // Auth Check
        const userRole = request.headers.get("x-user-role");
        if (userRole !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
        }

        const categories = await prisma.category.findMany({
            orderBy: { displayOrder: 'asc' },
            include: {
                _count: {
                    select: { products: true }
                }
            }
        });

        return NextResponse.json({ data: categories }, { headers: corsHeaders });
    } catch (err) {
        console.error("GET Categories Error", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500, headers: corsHeaders });
    }
}

// POST /api/admin/categories
export async function POST(request: NextRequest) {
    const corsHeaders = getCorsHeaders(request);

    try {
        // Auth Check
        const userRole = request.headers.get("x-user-role");
        if (userRole !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
        }

        const body = await request.json();
        const {
            name,
            slug,
            description,
            icon,
            displayOrder,
            isActive
        } = body;

        if (!name || !slug) {
            return NextResponse.json({ error: "Missing required fields (name, slug)" }, { status: 400, headers: corsHeaders });
        }

        // Check Duplicate Slug
        const existing = await prisma.category.findUnique({ where: { slug } });
        if (existing) {
            return NextResponse.json({ error: "Slug already exists" }, { status: 400, headers: corsHeaders });
        }

        const category = await prisma.category.create({
            data: {
                name,
                slug,
                description,
                icon,
                displayOrder: displayOrder || 0,
                isActive: isActive !== false
            }
        });

        return NextResponse.json({ message: "Category created", data: category }, { status: 201, headers: corsHeaders });

    } catch (err) {
        console.error("Create Category Error", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500, headers: corsHeaders });
    }
}
