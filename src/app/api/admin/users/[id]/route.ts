import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { errorResponse } from "@/lib/utils/errors";

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
        "Access-Control-Allow-Methods": "GET,PATCH,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, x-user-id, x-user-role",
        "Access-Control-Allow-Credentials": "true",
        "Vary": "Origin",
    };
}

export async function OPTIONS(request: NextRequest) {
    return new NextResponse(null, { status: 204, headers: getCorsHeaders(request) });
}

async function checkAdmin(request: NextRequest) {
    const userRole = request.headers.get("x-user-role");
    if (userRole !== "ADMIN") {
        throw new Error("Unauthorized");
    }
}

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const corsHeaders = getCorsHeaders(request);

    // Unwrap params
    const params = await props.params;
    const { id } = params;

    try {
        await checkAdmin(request);

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                fullName: true,
                phone: true,
                role: true,
                isBlocked: true,
                createdAt: true,
                _count: {
                    select: { orders: true, repairTickets: true }
                }
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404, headers: corsHeaders });
        }

        return NextResponse.json({ data: user }, { headers: corsHeaders });
    } catch (err: any) {
        if (err.message === "Unauthorized") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
        }
        return errorResponse(err);
    }
}

export async function PATCH(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const corsHeaders = getCorsHeaders(request);
    // Unwrap params
    const params = await props.params;
    const { id } = params;

    try {
        await checkAdmin(request);
        const body = await request.json();

        // Validation (basic)
        if (!body.fullName || !body.email) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400, headers: corsHeaders });
        }

        const user = await prisma.user.update({
            where: { id },
            data: {
                fullName: body.fullName,
                email: body.email,
                phone: body.phone,
                role: body.role, // Be careful with this!
            },
        });

        return NextResponse.json({ data: user }, { headers: corsHeaders });
    } catch (err: any) {
        if (err.message === "Unauthorized") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
        }
        return errorResponse(err);
    }
}

export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const corsHeaders = getCorsHeaders(request);
    // Unwrap params
    const params = await props.params;
    const { id } = params;

    try {
        await checkAdmin(request);

        // Optional: Check if user can be deleted (e.g., has orders?)
        // For now, allow deletion (Prisma constraints might fail if not handled)

        await prisma.user.delete({
            where: { id },
        });

        return NextResponse.json({ success: true }, { headers: corsHeaders });
    } catch (err: any) {
        if (err.message === "Unauthorized") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
        }
        return errorResponse(err);
    }
}
