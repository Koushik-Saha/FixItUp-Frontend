import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { errorResponse } from "@/lib/utils/errors";
import { Prisma } from "@prisma/client";

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

        const application = await prisma.wholesaleApplication.findUnique({
            where: { id },
            include: {
                user: {
                    select: { id: true, email: true, fullName: true, phone: true }
                }
            }
        });

        if (!application) {
            return NextResponse.json(
                { error: "Application not found" },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json({ data: application }, { headers: corsHeaders });

    } catch (err) {
        console.error("GET Application Error", err);
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
        const { status, approved_tier, rejection_reason } = body; // snake_case body
        const adminId = request.headers.get("x-user-id");

        if (!status) {
            return NextResponse.json(
                { error: "Status is required" },
                { status: 400, headers: corsHeaders }
            );
        }

        // Transaction to update application AND user role if approved
        const result = await prisma.$transaction(async (tx) => {
            const app = await tx.wholesaleApplication.update({
                where: { id },
                data: {
                    status,
                    approvedTier: approved_tier,
                    rejectionReason: rejection_reason,
                    reviewedBy: adminId,
                    reviewedAt: new Date()
                }
            });

            if (status === 'APPROVED') {
                await tx.user.update({
                    where: { id: app.userId },
                    data: {
                        role: 'WHOLESALE',
                        wholesaleStatus: 'APPROVED',
                        wholesaleTier: approved_tier || app.requestedTier
                    }
                });
            } else if (status === 'REJECTED') {
                await tx.user.update({
                    where: { id: app.userId },
                    data: {
                        wholesaleStatus: 'REJECTED'
                    }
                });
            }

            return app;
        });

        return NextResponse.json(
            { message: "Application updated", data: result },
            { headers: corsHeaders }
        );

    } catch (err) {
        console.error("Update Application Error", err);
        const res = errorResponse(err);
        Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
        return res;
    }
}
