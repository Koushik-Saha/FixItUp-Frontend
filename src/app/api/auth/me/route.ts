import { NextResponse } from "next/server";
import { getSession } from "@/lib/jwt";
import prisma from "@/lib/prisma";

// GET /api/auth/me - Get current user profile
export async function GET() {
    try {
        const session = await getSession();
        console.log("Session Check:", session ? "Valid" : "Null");

        if (!session) {
            console.log("Session invalid, returning 401");
            return NextResponse.json({ user: null }, { status: 401 });
        }

        console.log("Session valid for UserID:", session.id);
        const user = await prisma.user.findUnique({
            where: { id: session.id },
            select: {
                id: true,
                email: true,
                fullName: true,
                phone: true,
                role: true,
                wholesaleStatus: true,
                wholesaleTier: true,
                createdAt: true,
            }
        });

        if (!user) {
            return NextResponse.json({ user: null }, { status: 404 });
        }

        // Map Prisma camelCase to expected response format if necessary
        // The auth-client expects camelCase for new implementation, but
        // confirming alignment with `src/types/auth.ts` or `auth-client.ts` usage.
        // Looking at auth-client.ts, it expects snake_case for legacy compat OR camelCase if we update it.
        // We are updating auth-client.ts too, so let's stick to camelCase API response
        // but map to what the frontend expects.

        // Actually, the legacy `getCurrentUser` returned snake_case for some fields (full_name, wholesale_status).
        // I will map them to match the User interface in `auth-client.ts` and `types/auth.ts`.

        const responseUser = {
            id: user.id,
            email: user.email,
            full_name: user.fullName,
            phone: user.phone || undefined,
            role: user.role.toLowerCase(), // Prisma enum is uppercase
            wholesale_status: user.wholesaleStatus?.toLowerCase(),
            wholesale_tier: user.wholesaleTier?.toLowerCase()
        };

        return NextResponse.json({ user: responseUser });

    } catch (error) {
        console.error("Profile fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
    }
}

// PUT /api/auth/me - Update user profile
export async function PUT(request: Request) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { full_name, phone } = body;

        // Validation
        if (!full_name) {
            return NextResponse.json({ error: "Full name is required" }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: session.id },
            data: {
                fullName: full_name,
                phone: phone || null,
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                phone: true,
                role: true,
                wholesaleStatus: true,
                wholesaleTier: true,
            }
        });

        const responseUser = {
            id: updatedUser.id,
            email: updatedUser.email,
            full_name: updatedUser.fullName,
            phone: updatedUser.phone || undefined,
            role: updatedUser.role.toLowerCase(),
            wholesale_status: updatedUser.wholesaleStatus?.toLowerCase(),
            wholesale_tier: updatedUser.wholesaleTier?.toLowerCase()
        };

        return NextResponse.json({ user: responseUser });

    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}
