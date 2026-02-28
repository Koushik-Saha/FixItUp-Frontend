import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { errorResponse, ForbiddenError } from '@/lib/utils/errors'

const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5001",
    process.env.NEXT_PUBLIC_SITE_URL,
].filter(Boolean) as string[];

function getCorsHeaders(request: NextRequest) {
    const origin = request.headers.get("origin") || "";
    const allowOrigin = origin || "*";
    return {
        "Access-Control-Allow-Origin": allowOrigin,
        "Access-Control-Allow-Methods": "GET,PUT,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, x-user-id, x-user-role",
        "Access-Control-Allow-Credentials": "true",
    };
}

export async function OPTIONS(request: NextRequest) {
    return new NextResponse(null, { status: 204, headers: getCorsHeaders(request) });
}

export async function GET(request: NextRequest) {
    const corsHeaders = getCorsHeaders(request);

    try {
        const userRole = request.headers.get('x-user-role');
        if (userRole !== 'ADMIN') throw new ForbiddenError('Admin access required');

        const { searchParams } = new URL(request.url);
        const storeId = searchParams.get('store_id');
        const status = searchParams.get('status');

        const where: Prisma.InventoryWhereInput = {};
        if (storeId) where.storeId = storeId;

        // Fetch all relevant inventory (filtering by status requires calculation usually on product threshold)
        // Prisma allows filtering by related fields? 
        // e.g. quantity <= product.lowStockThreshold?
        // No, Prisma can't compare two fields in 'where' clause directly without raw query.
        // We will fetch and filter in memory as logic is complex or use raw query.
        // Given inventory size might be large, Raw Query is better, OR fetch and filter if pagination not strict.
        // For now, let's fetch related data and filter in memory as per original Implementation.

        const rawInventory = await prisma.inventory.findMany({
            where,
            include: {
                product: { select: { id: true, name: true, sku: true, basePrice: true, lowStockThreshold: true, isActive: true } },
                store: { select: { id: true, name: true, city: true, state: true } }
            }
        });

        let filteredInventory = rawInventory;

        if (status === 'low_stock') {
            filteredInventory = rawInventory.filter(item =>
                (item.quantity || 0) > 0 && (item.quantity || 0) <= (item.product.lowStockThreshold || 10)
            );
        } else if (status === 'out_of_stock') {
            filteredInventory = rawInventory.filter(item => (item.quantity || 0) === 0);
        }

        const totalItems = filteredInventory.length;
        const lowStockItems = filteredInventory.filter(item => (item.quantity || 0) > 0 && (item.quantity || 0) <= (item.product.lowStockThreshold || 10)).length;
        const outOfStockItems = filteredInventory.filter(item => (item.quantity || 0) === 0).length;
        const totalValue = filteredInventory.reduce((sum, item) => sum + ((item.quantity || 0) * Number(item.product.basePrice)), 0);

        return NextResponse.json({
            data: {
                inventory: filteredInventory,
                stats: {
                    total_items: totalItems,
                    low_stock: lowStockItems,
                    out_of_stock: outOfStockItems,
                    total_value: Number(totalValue.toFixed(2))
                }
            }
        }, { headers: corsHeaders });

    } catch (error) {
        const res = errorResponse(error);
        Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
        return res;
    }
}

export async function PUT(request: NextRequest) {
    const corsHeaders = getCorsHeaders(request);

    try {
        const userRole = request.headers.get('x-user-role');
        if (userRole !== 'ADMIN') throw new ForbiddenError('Admin access required');

        const body = await request.json();
        const { inventory_id, quantity, action } = body;

        if (!inventory_id) return NextResponse.json({ error: 'Missing inventory_id' }, { status: 400, headers: corsHeaders });

        const current = await prisma.inventory.findUnique({ where: { id: inventory_id } });
        if (!current) return NextResponse.json({ error: 'Not found' }, { status: 404, headers: corsHeaders });

        let newQuantity = current.quantity || 0;
        if (action === 'add') newQuantity += (quantity || 0);
        else if (action === 'subtract') newQuantity = Math.max(0, newQuantity - (quantity || 0));
        else newQuantity = quantity; // set directly if no action?

        const updated = await prisma.inventory.update({
            where: { id: inventory_id },
            data: {
                quantity: newQuantity,
                lastRestockedAt: action === 'add' ? new Date() : current.lastRestockedAt
            }
        });

        return NextResponse.json({
            message: 'Inventory updated',
            data: updated
        }, { headers: corsHeaders });

    } catch (error) {
        const res = errorResponse(error);
        Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
        return res;
    }
}
