import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const section = await prisma.homepageSection.findUnique({
            where: { id: resolvedParams.id },
        });

        if (!section) {
            return NextResponse.json({ success: false, message: "Homepage Section not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: section });
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

        if (body.sortOrder !== undefined) body.sortOrder = parseInt(body.sortOrder);

        const section = await prisma.homepageSection.update({
            where: { id: resolvedParams.id },
            data: body,
        });

        return NextResponse.json({ success: true, data: section });
    } catch (error: any) {
        if (error.code === "P2025") {
            return NextResponse.json(
                { success: false, message: "Homepage Section not found" },
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
        await prisma.homepageSection.delete({
            where: { id: resolvedParams.id },
        });

        return NextResponse.json({ success: true, message: "Homepage Section deleted successfully." });
    } catch (error: any) {
        if (error.code === "P2025") {
            return NextResponse.json({ success: false, message: "Homepage Section not found" }, { status: 404 });
        }
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
