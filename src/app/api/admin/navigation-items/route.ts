import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const isActive = searchParams.get("isActive");

        const where: any = {};
        if (isActive) where.isActive = isActive === "true";

        const items = await prisma.navigationItem.findMany({
            where,
            orderBy: { sortOrder: "asc" },
            include: {
                parent: true,
                categories: true,
            }
        });

        // Structure into hierarchy for the mega menu frontend/admin
        return NextResponse.json({ success: true, data: items });
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
        const { title, url, parentId, type, categoryId, icon, sortOrder, isActive } = body;

        const item = await prisma.navigationItem.create({
            data: {
                title,
                url,
                parentId: parentId || null,
                type: type || "link",
                categoryId: categoryId || null,
                icon,
                sortOrder: sortOrder ?? 0,
                isActive: isActive ?? true,
            },
        });

        return NextResponse.json({ success: true, data: item }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
