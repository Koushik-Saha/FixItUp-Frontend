import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const isActive = searchParams.get("isActive");

        const where: any = {};
        if (isActive) where.isActive = isActive === "true";

        const stores = await prisma.storeLocation.findMany({
            where,
            orderBy: { name: "asc" },
        });

        // Map location data cleanly
        return NextResponse.json({ success: true, data: stores });
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
        const { name, address, city, state, zip, phone, email, hours, latitude, longitude, isActive } = body;

        const store = await prisma.storeLocation.create({
            data: {
                name,
                address,
                city,
                state,
                zip,
                phone,
                email,
                hours,
                latitude: latitude ? parseFloat(latitude) : null,
                longitude: longitude ? parseFloat(longitude) : null,
                isActive: isActive ?? true,
            },
        });

        return NextResponse.json({ success: true, data: store }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
