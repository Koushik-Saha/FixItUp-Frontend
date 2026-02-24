import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const isActive = searchParams.get("isActive");
        const type = searchParams.get("type");
        const isPopular = searchParams.get("isPopular");

        const where: any = {};
        if (isActive) where.isActive = isActive === "true";
        if (type) where.type = type;
        if (isPopular) where.isPopular = isPopular === "true";

        const brands = await prisma.brand.findMany({
            where,
            orderBy: { sortOrder: "asc" },
        });

        return NextResponse.json({ success: true, data: brands });
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
        const { name, slug, logo, type, isPopular, isActive, sortOrder } = body;

        const brand = await prisma.brand.create({
            data: {
                name,
                slug,
                logo,
                type,
                isPopular: isPopular ?? false,
                isActive: isActive ?? true,
                sortOrder: sortOrder ?? 0,
            },
        });

        return NextResponse.json({ success: true, data: brand }, { status: 201 });
    } catch (error: any) {
        if (error.code === "P2002") {
            return NextResponse.json(
                { success: false, message: "Brand name or slug already exists." },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
