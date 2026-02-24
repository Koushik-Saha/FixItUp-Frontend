import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const isActive = searchParams.get("isActive");
        const categoryId = searchParams.get("categoryId");
        const brandId = searchParams.get("brandId");

        const where: any = {};
        if (isActive) where.is_active = isActive === "true";
        if (categoryId) where.category_id = categoryId;
        if (brandId) where.brand_id = brandId;

        const models = await prisma.product_models.findMany({
            where,
            orderBy: { sort_order: "asc" },
            include: {
                categories: true,
                brand: true,
            }
        });

        // Remap to match Admin UI expectations (is_active -> isActive)
        const formatted = models.map(m => ({
            id: m.id,
            name: m.name,
            slug: m.slug,
            categoryId: m.category_id,
            categoryName: m.categories?.name,
            brandId: m.brand_id,
            brandName: m.brand?.name,
            sortOrder: m.sort_order,
            isNew: m.is_new,
            isActive: m.is_active,
            createdAt: m.created_at,
        }));

        return NextResponse.json({ success: true, data: formatted });
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
        const { name, slug, categoryId, brandId, isNew, isActive, sortOrder } = body;

        const model = await prisma.product_models.create({
            data: {
                name,
                slug,
                category_id: categoryId || null,
                brand_id: brandId || null,
                is_new: isNew ?? false,
                is_active: isActive ?? true,
                sort_order: sortOrder ?? 0,
            },
        });

        return NextResponse.json({ success: true, data: model }, { status: 201 });
    } catch (error: any) {
        if (error.code === "P2002") {
            return NextResponse.json(
                { success: false, message: "Model slug already exists." },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
