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

export async function GET(request: NextRequest) {
    const corsHeaders = getCorsHeaders(request);

    try {
        const userRole = request.headers.get("x-user-role");
        if (userRole !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
        }

        const settings = await prisma.systemSetting.findMany();
        // Convert array to object
        const settingsMap = settings.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {} as Record<string, any>);

        return NextResponse.json({ data: settingsMap }, { headers: corsHeaders });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500, headers: corsHeaders });
    }
}

export async function POST(request: NextRequest) {
    const corsHeaders = getCorsHeaders(request);

    try {
        const userRole = request.headers.get("x-user-role");
        if (userRole !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
        }

        const body = await request.json();
        const updates = [];

        for (const [key, value] of Object.entries(body)) {
            updates.push(
                prisma.systemSetting.upsert({
                    where: { key },
                    update: { value: value as any },
                    create: { key, value: value as any }
                })
            );
        }

        await prisma.$transaction(updates);

        return NextResponse.json({ success: true }, { headers: corsHeaders });
    } catch (error) {
        return NextResponse.json({ error: "Failed to save settings" }, { status: 500, headers: corsHeaders });
    }
}
