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

// PUT /api/admin/hero-slides/[id]
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const corsHeaders = getCorsHeaders(request);
    const { id } = await params;

    try {
        // Auth Check
        const userRole = request.headers.get("x-user-role");
        if (userRole !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
        }

        const body = await request.json();
        const {
            title,
            description,
            image,
            badge,
            badgeColor,
            gradient,
            ctaPrimary,
            ctaSecondary,
            trustBadges,
            discount,
            sortOrder,
            isActive
        } = body;

        const slide = await prisma.heroSlide.update({
            where: { id },
            data: {
                title,
                description,
                image,
                badge,
                badgeColor,
                gradient,
                ctaPrimary: ctaPrimary ?? undefined,
                ctaSecondary: ctaSecondary ?? undefined,
                trustBadges: trustBadges ?? undefined,
                discount,
                sortOrder,
                isActive
            }
        });

        return NextResponse.json({ message: "Slide updated", data: slide }, { headers: corsHeaders });

    } catch (err) {
        console.error("Update Hero Slide Error", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500, headers: corsHeaders });
    }
}

// DELETE /api/admin/hero-slides/[id]
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

        await prisma.heroSlide.delete({
            where: { id }
        });

        return NextResponse.json({ message: "Slide deleted" }, { headers: corsHeaders });

    } catch (err) {
        console.error("Delete Hero Slide Error", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500, headers: corsHeaders });
    }
}
