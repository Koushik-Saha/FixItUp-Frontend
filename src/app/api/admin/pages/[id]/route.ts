import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const page = await prisma.page.findUnique({
            where: { id: resolvedParams.id },
        });

        if (!page) {
            return NextResponse.json({ success: false, message: "Page not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: page });
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

        // Pass direct JSON mapping from body to prisma schema fields
        const page = await prisma.page.update({
            where: { id: resolvedParams.id },
            data: body,
        });

        return NextResponse.json({ success: true, data: page });
    } catch (error: any) {
        if (error.code === "P2025") {
            return NextResponse.json(
                { success: false, message: "Page not found" },
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
        await prisma.page.delete({
            where: { id: resolvedParams.id },
        });

        return NextResponse.json({ success: true, message: "Page deleted successfully." });
    } catch (error: any) {
        if (error.code === "P2025") {
            return NextResponse.json({ success: false, message: "Page not found" }, { status: 404 });
        }
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
