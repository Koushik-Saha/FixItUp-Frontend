import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const item = await prisma.navigationItem.findUnique({
            where: { id: resolvedParams.id },
            include: {
                parent: true,
                categories: true,
            }
        });

        if (!item) {
            return NextResponse.json({ success: false, message: "Item not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: item });
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

        // Convert empty string relations to null
        if (body.parentId === "") body.parentId = null;
        if (body.categoryId === "") body.categoryId = null;

        const item = await prisma.navigationItem.update({
            where: { id: resolvedParams.id },
            data: body,
        });

        return NextResponse.json({ success: true, data: item });
    } catch (error: any) {
        if (error.code === "P2025") {
            return NextResponse.json(
                { success: false, message: "Item not found" },
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
        await prisma.navigationItem.delete({
            where: { id: resolvedParams.id },
        });

        return NextResponse.json({ success: true, message: "Item deleted successfully." });
    } catch (error: any) {
        if (error.code === "P2025") {
            return NextResponse.json({ success: false, message: "Item not found" }, { status: 404 });
        }
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
