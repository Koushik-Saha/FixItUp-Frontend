import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const isPublished = searchParams.get("isPublished");

        const where: any = {};
        if (isPublished) where.isPublished = isPublished === "true";

        const pages = await prisma.page.findMany({
            where,
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ success: true, data: pages });
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
        const { title, slug, content, metaTitle, metaDescription, isPublished } = body;

        const page = await prisma.page.create({
            data: {
                title,
                slug,
                content,
                metaTitle,
                metaDescription,
                isPublished: isPublished ?? false,
            },
        });

        return NextResponse.json({ success: true, data: page }, { status: 201 });
    } catch (error: any) {
        if (error.code === "P2002") {
            return NextResponse.json(
                { success: false, message: "Page slug already exists." },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
