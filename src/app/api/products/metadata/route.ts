import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        // Get all unique brands
        const brandsResult = await prisma.product.findMany({
            where: { isActive: true },
            select: { brand: true },
            distinct: ['brand']
        });
        const brands = brandsResult.map(b => b.brand).filter(Boolean).sort();

        // Get min/max price
        const priceResult = await prisma.product.aggregate({
            where: { isActive: true },
            _min: { basePrice: true },
            _max: { basePrice: true }
        });

        return NextResponse.json({
            brands,
            minPrice: Number(priceResult._min.basePrice) || 0,
            maxPrice: Number(priceResult._max.basePrice) || 1000
        });

    } catch (error) {
        console.error("Metadata API Error:", error);
        return NextResponse.json({ error: "Failed to fetch metadata" }, { status: 500 });
    }
}
