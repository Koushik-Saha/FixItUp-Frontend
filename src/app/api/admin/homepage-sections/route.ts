import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const isActive = searchParams.get("isActive");

        const where: any = {};
        if (isActive) where.isActive = isActive === "true";

        const sections = await prisma.homepageSection.findMany({
            where,
            orderBy: { sortOrder: "asc" },
        });

        return NextResponse.json({ success: true, data: sections });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { sectionId, name, isActive, sortOrder, config } = body;

        if (!sectionId || !name) {
            return NextResponse.json(
                { success: false, message: "Section ID and Name are required" },
                { status: 400 }
            );
        }

        const section = await prisma.homepageSection.create({
            data: {
                sectionId,
                name,
                isActive: isActive ?? true,
                sortOrder: sortOrder ? parseInt(sortOrder) : 0,
                config: config || undefined,
            },
        });

        return NextResponse.json({ success: true, data: section }, { status: 201 });
    } catch (error: any) {
        if (error.code === "P2002") {
            return NextResponse.json(
                { success: false, message: "A section with this ID already exists." },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
