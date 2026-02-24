import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const model = await prisma.product_models.findUnique({
            where: { id: resolvedParams.id },
            include: {
                categories: true,
                brand: true,
            }
        });

        if (!model) {
            return NextResponse.json({ success: false, message: "Model not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: model });
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

        // Convert incoming camelCase payload to snake_case db fields
        const data: any = {};
        if (body.name !== undefined) data.name = body.name;
        if (body.slug !== undefined) data.slug = body.slug;
        if (body.categoryId !== undefined) data.category_id = body.categoryId;
        if (body.brandId !== undefined) data.brand_id = body.brandId;
        if (body.isNew !== undefined) data.is_new = body.isNew;
        if (body.isActive !== undefined) data.is_active = body.isActive;
        if (body.sortOrder !== undefined) data.sort_order = body.sortOrder;

        const model = await prisma.product_models.update({
            where: { id: resolvedParams.id },
            data,
        });

        return NextResponse.json({ success: true, data: model });
    } catch (error: any) {
        if (error.code === "P2025") {
            return NextResponse.json(
                { success: false, message: "Model not found" },
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
        await prisma.product_models.delete({
            where: { id: resolvedParams.id },
        });

        return NextResponse.json({ success: true, message: "Model deleted successfully." });
    } catch (error: any) {
        if (error.code === "P2025") {
            return NextResponse.json({ success: false, message: "Model not found" }, { status: 404 });
        }
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
