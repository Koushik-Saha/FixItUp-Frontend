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

// PUT /api/admin/stores/[id]
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
            address,
            city,
            state,
            zipCode,
            phone,
            email,
            operatingHours,
            isActive
        } = body;

        const store = await prisma.store.update({
            where: { id },
            data: {
                name,
                address,
                city,
                state,
                zipCode,
                phone,
                email,
                operatingHours: operatingHours ?? undefined,
                isActive
            }
        });

        return NextResponse.json({ message: "Store updated", data: store }, { headers: corsHeaders });

    } catch (err) {
        console.error("Update Store Error", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500, headers: corsHeaders });
    }
}

// DELETE /api/admin/stores/[id]
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

        // Optional checks for inventory or repair tickets linked to store could be added here

        await prisma.store.delete({
            where: { id }
        });

        return NextResponse.json({ message: "Store deleted" }, { headers: corsHeaders });

    } catch (err) {
        console.error("Delete Store Error", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500, headers: corsHeaders });
    }
}
