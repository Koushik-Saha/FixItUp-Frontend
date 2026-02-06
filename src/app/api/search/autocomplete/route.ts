import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');
        const limit = parseInt(searchParams.get('limit') || '8');

        if (!query || query.trim().length < 2) {
            return NextResponse.json({ success: true, data: { suggestions: [] } });
        }

        const products = await prisma.product.findMany({
            where: {
                isActive: true,
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { brand: { contains: query, mode: 'insensitive' } },
                    { deviceModel: { contains: query, mode: 'insensitive' } },
                    { sku: { contains: query, mode: 'insensitive' } }
                ]
            },
            take: limit,
            select: {
                id: true, name: true, brand: true, deviceModel: true, sku: true, thumbnail: true, basePrice: true, totalStock: true, productType: true
            }
        });

        // Search Brands (Distinct)
        // Prisma distinct not ideal for partial search on string field unless valid query.
        // We'll extract from products response or do a separate findMany group by.
        // Actually, just searching products by brand and taking unique is simpler for autocomplete.

        const brands = await prisma.product.findMany({
            where: { isActive: true, brand: { contains: query, mode: 'insensitive' } },
            distinct: ['brand'],
            take: 5,
            select: { brand: true }
        });

        // Search Models (Distinct)
        const models = await prisma.product.findMany({
            where: { isActive: true, deviceModel: { contains: query, mode: 'insensitive' } },
            distinct: ['deviceModel'],
            take: 5,
            select: { deviceModel: true, brand: true }
        });

        const suggestions = products.map(p => ({
            id: p.id,
            name: p.name,
            brand: p.brand,
            deviceModel: p.deviceModel,
            sku: p.sku,
            thumbnail: p.thumbnail,
            price: Number(p.basePrice),
            stock: p.totalStock,
            productType: p.productType
        }));

        const uniqueBrands = brands.map(b => b.brand);
        const uniqueModels = models.map(m => ({ model: m.deviceModel, brand: m.brand }));

        return NextResponse.json({
            success: true,
            data: {
                suggestions,
                brands: uniqueBrands,
                models: uniqueModels,
                query: query.trim()
            }
        });

    } catch (error) {
        console.error("Autocomplete Error", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
