import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/jwt";
import * as z from "zod";

const wholesaleApplicationSchema = z.object({
    businessName: z.string().min(1, "Business name is required"),
    businessType: z.string().min(1, "Business type is required"),
    taxId: z.string().min(1, "Tax ID is required"),
    website: z.string().optional(),
    businessPhone: z.string().min(1, "Business phone is required"),
    businessEmail: z.string().email("Invalid email"),
    businessAddress: z.object({
        street1: z.string().min(1, "Street address is required"),
        street2: z.string().optional(),
        city: z.string().min(1, "City is required"),
        state: z.string().min(1, "State is required"),
        zipCode: z.string().min(1, "Zip code is required"),
        country: z.string().default("US"),
    }),
});

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const result = wholesaleApplicationSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: "Validation error", details: result.error.flatten() },
                { status: 400 }
            );
        }

        // Check if user already has a pending or approved application
        const existing = await prisma.wholesaleApplication.findFirst({
            where: {
                userId: session.id,
                status: {
                    in: ["PENDING", "APPROVED"]
                }
            }
        });

        if (existing) {
            return NextResponse.json(
                { error: "You already have a pending or approved application." },
                { status: 400 }
            );
        }

        const application = await prisma.wholesaleApplication.create({
            data: {
                userId: session.id,
                ...result.data,
                businessAddress: result.data.businessAddress as any, // Json type casting
                status: "PENDING",
            },
        });

        // Optionally update user status to indicate pending review if needed, 
        // but schema usually keeps user role as CUSTOMER until Approved.
        // We can check `wholesaleStatus` on User model.
        await prisma.user.update({
            where: { id: session.id },
            data: { wholesaleStatus: "PENDING" }
        });

        return NextResponse.json(application, { status: 201 });
    } catch (error) {
        console.error("Error submitting wholesale application:", error);
        return NextResponse.json(
            { error: "Failed to submit application" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const application = await prisma.wholesaleApplication.findFirst({
            where: { userId: session.id },
            orderBy: { createdAt: 'desc' } // Get latest
        });

        return NextResponse.json(application);
    } catch (error) {
        console.error("Error fetching application:", error);
        return NextResponse.json(
            { error: "Failed to fetch application" },
            { status: 500 }
        );
    }
}
