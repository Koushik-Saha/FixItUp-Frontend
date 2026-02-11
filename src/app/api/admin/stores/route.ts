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

// GET /api/admin/stores
export async function GET(request: NextRequest) {
    const corsHeaders = getCorsHeaders(request);

    try {
        // Auth Check
        const userRole = request.headers.get("x-user-role");
        if (userRole !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
        }

        const stores = await prisma.store.findMany({
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ data: stores }, { headers: corsHeaders });
    } catch (err) {
        console.error("GET Stores Error", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500, headers: corsHeaders });
    }
}

// POST /api/admin/stores
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
            address,
            city,
            state,
            zipCode,
            phone,
            email,
            operatingHours,
            isActive
        } = body;

        if (!name || !address || !city || !state || !zipCode || !phone) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400, headers: corsHeaders });
        }

        const store = await prisma.store.create({
            data: {
                name,
                address,
                city,
                state,
                zipCode,
                phone,
                email,
                operatingHours: operatingHours ?? undefined,
                isActive: isActive !== false
            }
        });

        return NextResponse.json({ message: "Store created", data: store }, { status: 201, headers: corsHeaders });

    } catch (err) {
        console.error("Create Store Error", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500, headers: corsHeaders });
    }
}
