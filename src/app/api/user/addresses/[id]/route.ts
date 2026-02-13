import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/jwt";
import * as z from "zod";

const addressUpdateSchema = z.object({
    fullName: z.string().min(1).optional(),
    company: z.string().optional(),
    street1: z.string().min(1).optional(),
    street2: z.string().optional(),
    city: z.string().min(1).optional(),
    state: z.string().min(1).optional(),
    zipCode: z.string().min(1).optional(),
    country: z.string().optional(),
    phone: z.string().optional(),
    type: z.enum(["SHIPPING", "BILLING"]).optional(),
    isDefault: z.boolean().optional(),
});

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();
        const result = addressUpdateSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: "Validation error", details: result.error.flatten() },
                { status: 400 }
            );
        }

        // Check ownership
        const existing = await prisma.address.findUnique({
            where: { id },
        });

        if (!existing || existing.userId !== session.id) {
            return NextResponse.json(
                { error: "Address not found" },
                { status: 404 }
            );
        }

        // Handle default toggle
        if (result.data.isDefault) {
            await prisma.address.updateMany({
                where: {
                    userId: session.id,
                    type: result.data.type || existing.type,
                    id: { not: id },
                    isDefault: true,
                },
                data: { isDefault: false },
            });
        }

        const updated = await prisma.address.update({
            where: { id },
            data: result.data,
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Error updating address:", error);
        return NextResponse.json(
            { error: "Failed to update address" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        // Check ownership
        const existing = await prisma.address.findUnique({
            where: { id },
        });

        if (!existing || existing.userId !== session.id) {
            return NextResponse.json(
                { error: "Address not found" },
                { status: 404 }
            );
        }

        await prisma.address.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting address:", error);
        return NextResponse.json(
            { error: "Failed to delete address" },
            { status: 500 }
        );
    }
}
