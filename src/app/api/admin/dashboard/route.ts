import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { errorResponse } from "@/lib/utils/errors";

const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5001",
    process.env.NEXT_PUBLIC_SITE_URL,
].filter(Boolean) as string[];

function getCorsHeaders(request: NextRequest) {
    const origin = request.headers.get("origin") || "";
    const allowOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0] || origin;
    return {
        "Access-Control-Allow-Origin": allowOrigin,
        "Access-Control-Allow-Methods": "GET,OPTIONS",
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
        // Strict Auth Check (Defense in Depth)
        const userRole = request.headers.get("x-user-role");
        if (userRole !== "ADMIN") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401, headers: corsHeaders }
            );
        }

        const { searchParams } = new URL(request.url);
        const days = parseInt(searchParams.get("days") || "30", 10);
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const [
            orders,
            revenueStats,
            productStats,
            repairStats,
            wholesaleStats,
            recentOrders,
            lowStock
        ] = await Promise.all([
            // Orders Overview
            prisma.order.groupBy({
                by: ['status'],
                where: { createdAt: { gte: startDate } },
                _count: { id: true }
            }),

            // Revenue
            prisma.order.aggregate({
                where: {
                    status: { not: 'CANCELLED' }, // Assuming only completed/paid counts? Or check paymentStatus
                    paymentStatus: 'PAID',
                    createdAt: { gte: startDate }
                },
                _sum: { totalAmount: true },
                _count: { id: true }
            }),

            // Products
            prisma.product.groupBy({
                by: ['isActive'],
                _count: { id: true }
            }),

            // Repairs
            prisma.repairTicket.groupBy({
                by: ['status'],
                where: { createdAt: { gte: startDate } },
                _count: { id: true }
            }),

            // Wholesale
            prisma.wholesaleApplication.groupBy({
                by: ['status'],
                _count: { id: true }
            }),

            // Recent Orders
            prisma.order.findMany({
                orderBy: { createdAt: 'desc' },
                take: 5,
                select: {
                    id: true,
                    orderNumber: true,
                    customerName: true,
                    totalAmount: true,
                    status: true,
                    createdAt: true
                }
            }),

            // Low Stock
            prisma.product.findMany({
                where: {
                    // Simple check: active and stock <= threshold (or fixed 10)
                    isActive: true,
                    totalStock: { lte: 10 }
                },
                take: 10,
                select: {
                    id: true, name: true, sku: true, totalStock: true, lowStockThreshold: true
                }
            })
        ]);

        // Process data
        const totalOrders = orders.reduce((sum, g) => sum + g._count.id, 0);
        const revenue = Number(revenueStats._sum.totalAmount || 0);

        // Orders Breakdown
        const orderCounts: Record<string, number> = {};
        orders.forEach(g => { orderCounts[g.status.toLowerCase()] = g._count.id });

        const data = {
            overview: {
                orders: {
                    total: totalOrders,
                    pending: orderCounts.pending || 0,
                    processing: orderCounts.processing || 0,
                    shipped: orderCounts.shipped || 0,
                    delivered: orderCounts.delivered || 0,
                    cancelled: orderCounts.cancelled || 0,
                },
                revenue: {
                    total: revenue,
                    orders: revenueStats._count.id,
                    average: revenueStats._count.id ? revenue / revenueStats._count.id : 0
                },
                products: {
                    total: productStats.reduce((sum, g) => sum + g._count.id, 0),
                    active: productStats.find(g => g.isActive)?._count.id || 0,
                    inactive: productStats.find(g => !g.isActive)?._count.id || 0,
                },
                repairs: {
                    total: repairStats.reduce((sum, g) => sum + g._count.id, 0),
                    submitted: repairStats.find(g => g.status === 'SUBMITTED')?._count.id || 0,
                    in_progress: repairStats.find(g => g.status === 'IN_PROGRESS')?._count.id || 0,
                    completed: repairStats.find(g => g.status === 'COMPLETED')?._count.id || 0,
                },
                wholesale: {
                    total: wholesaleStats.reduce((sum, g) => sum + g._count.id, 0),
                    pending: wholesaleStats.find(g => g.status === 'PENDING')?._count.id || 0,
                    approved: wholesaleStats.find(g => g.status === 'APPROVED')?._count.id || 0,
                    rejected: wholesaleStats.find(g => g.status === 'REJECTED')?._count.id || 0,
                }
            },
            recent_orders: recentOrders.map(o => ({
                id: o.id,
                order_number: o.orderNumber,
                customer_name: o.customerName,
                total_amount: o.totalAmount,
                status: o.status,
                created_at: o.createdAt
            })),
            low_stock: lowStock.map(p => ({
                id: p.id,
                name: p.name,
                sku: p.sku,
                total_stock: p.totalStock,
                low_stock_threshold: p.lowStockThreshold
            })),
            period: {
                days,
                start_date: startDate.toISOString(),
                end_date: new Date().toISOString()
            }
        };

        return NextResponse.json({ data }, { headers: corsHeaders });

    } catch (error) {
        console.error("Dashboard Error", error);
        const res = errorResponse(error);
        Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
        return res;
    }
}
