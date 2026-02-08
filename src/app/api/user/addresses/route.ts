import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/jwt";
import * as z from "zod";

const addressSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    company: z.string().optional(),
    street1: z.string().min(1, "Street address is required"),
    street2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().min(1, "Zip code is required"),
    country: z.string().default("US"),
    phone: z.string().optional(),
    type: z.enum(["SHIPPING", "BILLING"]).default("SHIPPING"),
    isDefault: z.boolean().default(false),
});

export async function GET(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const addresses = await prisma.address.findMany({
            where: { userId: session.id },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(addresses);
    } catch (error) {
        console.error("Error fetching addresses:", error);
        return NextResponse.json(
            { error: "Failed to fetch addresses" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const result = addressSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: "Validation error", details: result.error.flatten() },
                { status: 400 }
            );
        }

        // If setting as default, unset other defaults of same type
        if (result.data.isDefault) {
            await prisma.address.updateMany({
                where: {
                    userId: session.id,
                    type: result.data.type,
                    isDefault: true,
                },
                data: { isDefault: false },
            });
        }

        const address = await prisma.address.create({
            data: {
                ...result.data,
                userId: session.id,
            },
        });

        return NextResponse.json(address, { status: 201 });
    } catch (error) {
        console.error("Error creating address:", error);
        return NextResponse.json(
            { error: "Failed to create address" },
            { status: 500 }
        );
    }
}
