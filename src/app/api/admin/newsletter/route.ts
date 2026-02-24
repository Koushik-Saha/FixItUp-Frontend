import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const isActive = searchParams.get("isActive");

        const where: any = {};
        if (isActive) where.isActive = isActive === "true";

        const subscribers = await prisma.newsletterSubscriber.findMany({
            where,
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ success: true, data: subscribers });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
