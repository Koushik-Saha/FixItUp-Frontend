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

// PUT /api/admin/categories/[id]
export async function PUT(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const corsHeaders = getCorsHeaders(request);
    const { id } = await props.params;

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

        const category = await prisma.category.update({
            where: { id },
            data: {
                name,
                slug,
                description,
                icon,
                displayOrder,
                isActive
            }
        });

        return NextResponse.json({ message: "Category updated", data: category }, { headers: corsHeaders });

    } catch (err) {
        console.error("Update Category Error", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500, headers: corsHeaders });
    }
}

// DELETE /api/admin/categories/[id]
export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const corsHeaders = getCorsHeaders(request);
    const { id } = await props.params;

    try {
        // Auth Check
        const userRole = request.headers.get("x-user-role");
        if (userRole !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
        }

        // Optional: Check if products exist in category before delete
        const productsCount = await prisma.product.count({ where: { categoryId: id } });
        if (productsCount > 0) {
            return NextResponse.json({ error: `Cannot delete: Category has ${productsCount} products. Move them first.` }, { status: 400, headers: corsHeaders });
        }

        await prisma.category.delete({
            where: { id }
        });

        return NextResponse.json({ message: "Category deleted" }, { headers: corsHeaders });

    } catch (err) {
        console.error("Delete Category Error", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500, headers: corsHeaders });
    }
}
