import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const store = await prisma.storeLocation.findUnique({
            where: { id: resolvedParams.id },
        });

        if (!store) {
            return NextResponse.json({ success: false, message: "Store Location not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: store });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const body = await req.json();

        // Parse lat/lng if provided
        if (body.latitude) body.latitude = parseFloat(body.latitude);
        if (body.longitude) body.longitude = parseFloat(body.longitude);

        const store = await prisma.storeLocation.update({
            where: { id: resolvedParams.id },
            data: body,
        });

        return NextResponse.json({ success: true, data: store });
    } catch (error: any) {
        if (error.code === "P2025") {
            return NextResponse.json(
                { success: false, message: "Store Location not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        await prisma.storeLocation.delete({
            where: { id: resolvedParams.id },
        });

        return NextResponse.json({ success: true, message: "Store Location deleted successfully." });
    } catch (error: any) {
        if (error.code === "P2025") {
            return NextResponse.json({ success: false, message: "Store Location not found" }, { status: 404 });
        }
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
