import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { errorResponse } from "@/lib/utils/errors";
import { Prisma } from "@prisma/client";

// CORS Helper
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
    const allowOrigin = origin || "*";
    return {
        "Access-Control-Allow-Origin": allowOrigin,
        "Access-Control-Allow-Methods": "GET,PUT,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, x-user-id, x-user-role",
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
        const userRole = request.headers.get("x-user-role");
        if (userRole !== "ADMIN") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401, headers: corsHeaders }
            );
        }

        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                user: {
                    select: { email: true, fullName: true, phone: true }
                },
                orderItems: {
                    include: {
                        product: {
                            select: { name: true, sku: true, thumbnail: true }
                        }
                    }
                }
            }
        });

        if (!order) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json({ data: order }, { headers: corsHeaders });

    } catch (err) {
        console.error("GET Order Error", err);
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
        const userRole = request.headers.get("x-user-role");
        if (userRole !== "ADMIN") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401, headers: corsHeaders }
            );
        }

        const body = await request.json();
        const { status } = body;

        if (!status) {
            return NextResponse.json(
                { error: "Status is required" },
                { status: 400, headers: corsHeaders }
            );
        }

        const order = await prisma.order.update({
            where: { id },
            data: { status }
        });

        return NextResponse.json(
            { message: "Order updated", data: order },
            { headers: corsHeaders }
        );

    } catch (err) {
        console.error("Update Order Error", err);
        const res = errorResponse(err);
        Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
        return res;
    }
}
