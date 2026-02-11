import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { errorResponse } from "@/lib/utils/errors";
import { Decimal } from "@prisma/client/runtime/library";

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
        const { searchParams } = new URL(request.url);
        const period = searchParams.get("period") || "month";

        const startDate = new Date();
        let groupBy: "hour" | "day" | "month" = "day";

        switch (period) {
            case "day": startDate.setDate(startDate.getDate() - 1); groupBy = "hour"; break;
            case "week": startDate.setDate(startDate.getDate() - 7); groupBy = "day"; break;
            case "month": startDate.setMonth(startDate.getMonth() - 1); groupBy = "day"; break;
            case "year": startDate.setFullYear(startDate.getFullYear() - 1); groupBy = "month"; break;
        }

        // Fetch Orders for Time Series
        const orders = await prisma.order.findMany({
            where: { createdAt: { gte: startDate } },
            select: { totalAmount: true, createdAt: true, status: true, isWholesale: true }
        });

        const timeSeries = groupDataByTime(orders, groupBy);

        // Top Products
        const topProductsRaw = await prisma.orderItem.groupBy({
            by: ['productName', 'productSku'],
            where: { createdAt: { gte: startDate } },
            _sum: { quantity: true, subtotal: true },
            orderBy: { _sum: { subtotal: 'desc' } },
            take: 10
        });

        const topProducts = topProductsRaw.map(p => ({
            name: p.productName,
            sku: p.productSku,
            quantity: p._sum.quantity || 0,
            revenue: Number(p._sum.subtotal || 0)
        }));

        // Category Breakdown (Aggregation via OrderItem -> Product -> Category)
        // Prisma groupBy doesn't support deep relation grouping easily.
        // We'll fetch order items with categories and aggregate in JS.
        const categoryItems = await prisma.orderItem.findMany({
            where: { createdAt: { gte: startDate } },
            select: {
                quantity: true,
                subtotal: true,
                product: {
                    select: {
                        category: { select: { name: true } }
                    }
                }
            }
        });

        const categoryMap: Record<string, { orders: number, revenue: number }> = {};
        categoryItems.forEach(item => {
            const cat = item.product?.category?.name || 'Uncategorized';
            if (!categoryMap[cat]) categoryMap[cat] = { orders: 0, revenue: 0 };
            categoryMap[cat].orders += item.quantity;
            categoryMap[cat].revenue += Number(item.subtotal);
        });

        const categoryBreakdown = Object.entries(categoryMap).map(([cat, data]) => ({
            category: cat,
            orders: data.orders,
            revenue: Number(data.revenue.toFixed(2))
        }));

        // Segments
        const retailOrders = orders.filter(o => !o.isWholesale);
        const wholesaleOrders = orders.filter(o => o.isWholesale);

        const segments = {
            retail: {
                orders: retailOrders.length,
                revenue: retailOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0)
            },
            wholesale: {
                orders: wholesaleOrders.length,
                revenue: wholesaleOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0)
            }
        };

        return NextResponse.json({
            data: {
                time_series: timeSeries,
                top_products: topProducts,
                category_breakdown: categoryBreakdown,
                customer_segments: {
                    retail: { ...segments.retail, percentage: orders.length ? (segments.retail.orders / orders.length * 100).toFixed(1) : 0 },
                    wholesale: { ...segments.wholesale, percentage: orders.length ? (segments.wholesale.orders / orders.length * 100).toFixed(1) : 0 }
                },
                period: {
                    type: period,
                    start: startDate.toISOString(),
                    end: new Date().toISOString()
                }
            }
        }, { headers: corsHeaders });

    } catch (error) {
        const res = errorResponse(error);
        Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
        return res;
    }
}


interface AnalyticsOrder {
    totalAmount: Decimal | number;
    createdAt: Date;
    status: string;
}

function groupDataByTime(orders: AnalyticsOrder[], groupBy: string) {
    const grouped: Record<string, { orders: number, revenue: number }> = {};
    orders.forEach(order => {
        const date = new Date(order.createdAt);
        let key = "";
        if (groupBy === 'hour') key = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:00`;
        else if (groupBy === 'day') key = `${date.getMonth() + 1}/${date.getDate()}`;
        else key = `${date.getFullYear()}-${date.getMonth() + 1}`;

        if (!grouped[key]) grouped[key] = { orders: 0, revenue: 0 };
        grouped[key].orders++;
        if (order.status !== 'CANCELLED') {
            grouped[key].revenue += Number(order.totalAmount);
        }
    });

    return Object.entries(grouped).map(([date, data]) => ({
        date,
        orders: data.orders,
        revenue: Number(data.revenue.toFixed(2))
    }));
}
