import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { errorResponse } from "@/lib/utils/errors";

// Helper for CORS
function getCorsHeaders(request: NextRequest) {
    const origin = request.headers.get("origin") || "";
    // Allow any origin for now or strict list
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

// GET /api/admin/hero-slides
export async function GET(request: NextRequest) {
    const corsHeaders = getCorsHeaders(request);

    try {
        // Auth Check
        const userRole = request.headers.get("x-user-role");
        if (userRole !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
        }

        const slides = await prisma.heroSlide.findMany({
            orderBy: { sortOrder: 'asc' }
        });

        return NextResponse.json({ data: slides }, { headers: corsHeaders });
    } catch (err) {
        console.error("GET Hero Slides Error", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500, headers: corsHeaders });
    }
}

// POST /api/admin/hero-slides
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

        if (!title || !image) {
            return NextResponse.json({ error: "Missing required fields (title, image)" }, { status: 400, headers: corsHeaders });
        }

        const slide = await prisma.heroSlide.create({
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
                sortOrder: sortOrder || 0,
                isActive: isActive !== false
            }
        });

        return NextResponse.json({ message: "Slide created", data: slide }, { status: 201, headers: corsHeaders });

    } catch (err) {
        console.error("Create Hero Slide Error", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500, headers: corsHeaders });
    }
}
