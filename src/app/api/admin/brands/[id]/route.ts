import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const brand = await prisma.brand.findUnique({
            where: { id: resolvedParams.id },
        });

        if (!brand) {
            return NextResponse.json({ success: false, message: "Brand not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: brand });
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

        const brand = await prisma.brand.update({
            where: { id: resolvedParams.id },
            data: body,
        });

        return NextResponse.json({ success: true, data: brand });
    } catch (error: any) {
        if (error.code === "P2025") {
            return NextResponse.json(
                { success: false, message: "Brand not found" },
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
        await prisma.brand.delete({
            where: { id: resolvedParams.id },
        });

        return NextResponse.json({ success: true, message: "Brand deleted successfully." });
    } catch (error: any) {
        if (error.code === "P2025") {
            return NextResponse.json({ success: false, message: "Brand not found" }, { status: 404 });
        }
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
