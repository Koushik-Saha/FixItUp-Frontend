import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
    errorResponse,
    UnauthorizedError,
    ForbiddenError,
} from "@/lib/utils/errors";
import type { Database } from "@/types/database";
import { handleCorsPreflightRequest, getCorsHeaders } from '@/lib/cors';

type ProfileRoleRow = { role: string };

// ✔️ helper row types derived from Database
type Tables = Database["public"]["Tables"];
type OrderRow = Tables["orders"]["Row"];
type OrderItemRow = Tables["order_items"]["Row"];

type AnalyticsOrder = Pick<
    OrderRow,
    "id" | "total_amount" | "created_at" | "status" | "is_wholesale"
>;

type AnalyticsOrderItem = Pick<
    OrderItemRow,
    "product_name" | "product_sku" | "quantity" | "subtotal"
>;

type CategoryItem = {
    product_id: string;
    quantity: number;
    subtotal: number;
    products: { categories: { name: string | null } | null } | null;
};

// OPTIONS /api/admin/analytics - Handle preflight request
export async function OPTIONS(request: NextRequest) {
    return handleCorsPreflightRequest(request);
}

// GET /api/admin/analytics - Get analytics data
export async function GET(request: NextRequest) {
    try {
        const origin = request.headers.get('origin');
        const supabase = await createClient();

        // Get authenticated user
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();
        if (authError || !user) {
            throw new UnauthorizedError();
        }

        // Check if user is admin
        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single<ProfileRoleRow>();

        if (!profile || (profile as any).role !== "admin") {
            throw new ForbiddenError("Only admins can access analytics");
        }

        // Get parameters
        const { searchParams } = new URL(request.url);
        const period = searchParams.get("period") || "month"; // day, week, month, year
        const metric = searchParams.get("metric"); // revenue, orders, products (currently unused but kept)

        // Calculate date range
        let startDate = new Date();
        let groupBy: "hour" | "day" | "month" = "day";

        switch (period) {
            case "day":
                startDate.setDate(startDate.getDate() - 1);
                groupBy = "hour";
                break;
            case "week":
                startDate.setDate(startDate.getDate() - 7);
                groupBy = "day";
                break;
            case "month":
                startDate.setMonth(startDate.getMonth() - 1);
                groupBy = "day";
                break;
            case "year":
                startDate.setFullYear(startDate.getFullYear() - 1);
                groupBy = "month";
                break;
        }

        // Fetch sales data
        const { data: rawOrders, error: ordersError } = await supabase
            .from("orders")
            .select("id, total_amount, created_at, status, is_wholesale")
            .gte("created_at", startDate.toISOString())
            .order("created_at", { ascending: true });

        if (ordersError) {
            console.error("Failed to fetch orders:", ordersError);
            throw new Error("Failed to fetch analytics data");
        }

        const orders: AnalyticsOrder[] = (rawOrders ?? []) as AnalyticsOrder[];

        // Group data by time period
        const timeSeriesData = groupDataByTime(orders, groupBy);

        // Calculate top products
        const { data: rawTopProducts } = await supabase
            .from("order_items")
            .select("product_name, product_sku, quantity, subtotal")
            .gte("created_at", startDate.toISOString());

        const topProducts: AnalyticsOrderItem[] = (rawTopProducts ??
            []) as AnalyticsOrderItem[];

        const productSales = groupProductSales(topProducts);

        // Calculate category breakdown
        const { data: rawProductCategories } = await supabase
            .from("order_items")
            .select(
                `
        product_id,
        quantity,
        subtotal,
        products(category_id, categories(name))
      `
            )
            .gte("created_at", startDate.toISOString());

        const productCategories: CategoryItem[] = (rawProductCategories ??
            []) as CategoryItem[];

        const categoryBreakdown = groupByCategory(productCategories);

        // Customer segments
        const retailOrders = orders.filter((o) => !o.is_wholesale);
        const wholesaleOrders = orders.filter((o) => o.is_wholesale);

        const segments = {
            retail: {
                orders: retailOrders.length,
                revenue: retailOrders.reduce(
                    (sum, o) => sum + Number(o.total_amount),
                    0
                ),
            },
            wholesale: {
                orders: wholesaleOrders.length,
                revenue: wholesaleOrders.reduce(
                    (sum, o) => sum + Number(o.total_amount),
                    0
                ),
            },
        };

        return NextResponse.json({
            data: {
                time_series: timeSeriesData,
                top_products: productSales.slice(0, 10),
                category_breakdown: categoryBreakdown,
                customer_segments: {
                    retail: {
                        orders: segments.retail.orders,
                        revenue: Number(segments.retail.revenue.toFixed(2)),
                        percentage: orders.length
                            ? (
                                (segments.retail.orders / orders.length) *
                                100
                            ).toFixed(1)
                            : 0,
                    },
                    wholesale: {
                        orders: segments.wholesale.orders,
                        revenue: Number(segments.wholesale.revenue.toFixed(2)),
                        percentage: orders.length
                            ? (
                                (segments.wholesale.orders / orders.length) *
                                100
                            ).toFixed(1)
                            : 0,
                    },
                },
                period: {
                    type: period,
                    start: startDate.toISOString(),
                    end: new Date().toISOString(),
                },
            },
        }, {
            headers: getCorsHeaders(origin),
        });
    } catch (error) {
        const errorRes = errorResponse(error);
        const headers = new Headers(errorRes.headers);
        const origin = request.headers.get('origin');
        Object.entries(getCorsHeaders(origin)).forEach(([key, value]) => {
            headers.set(key, value);
        });
        return new NextResponse(errorRes.body, {
            status: errorRes.status,
            headers,
        });
    }
}

// Helper: Group orders by time
function groupDataByTime(
    orders: AnalyticsOrder[],
    groupBy: "hour" | "day" | "month"
) {
    const grouped: Record<string, { orders: number; revenue: number }> = {};

    orders.forEach((order) => {
        const date = new Date(((order as any)).created_at);
        let key: string;

        if (groupBy === "hour") {
            key = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:00`;
        } else if (groupBy === "day") {
            key = `${date.getMonth() + 1}/${date.getDate()}`;
        } else {
            key = `${date.getFullYear()}-${(date.getMonth() + 1)
                .toString()
                .padStart(2, "0")}`;
        }

        if (!grouped[key]) {
            grouped[key] = { orders: 0, revenue: 0 };
        }

        grouped[key].orders += 1;
        if (((order as any)).status !== "cancelled") {
            grouped[key].revenue += Number(((order as any)).total_amount);
        }
    });

    return Object.entries(grouped).map(([date, data]) => ({
        date,
        orders: data.orders,
        revenue: Number(data.revenue.toFixed(2)),
    }));
}

// Helper: Group product sales
function groupProductSales(items: AnalyticsOrderItem[]) {
    const grouped: Record<
        string,
        { name: string; quantity: number; revenue: number }
    > = {};

    items.forEach((item) => {
        const key = item.product_sku;

        if (!grouped[key]) {
            grouped[key] = {
                name: item.product_name,
                quantity: 0,
                revenue: 0,
            };
        }

        grouped[key].quantity += item.quantity;
        grouped[key].revenue += Number(item.subtotal);
    });

    return Object.entries(grouped)
        .map(([sku, data]) => ({
            sku,
            name: data.name,
            quantity: data.quantity,
            revenue: Number(data.revenue.toFixed(2)),
        }))
        .sort((a, b) => b.revenue - a.revenue);
}

// Helper: Group by category
function groupByCategory(items: CategoryItem[]) {
    const grouped: Record<string, { orders: number; revenue: number }> = {};

    items.forEach((item) => {
        const product = item.products;
        const category = product?.categories?.name || "Uncategorized";

        if (!grouped[category]) {
            grouped[category] = { orders: 0, revenue: 0 };
        }

        grouped[category].orders += item.quantity;
        grouped[category].revenue += Number(item.subtotal);
    });

    return Object.entries(grouped).map(([category, data]) => ({
        category,
        orders: data.orders,
        revenue: Number(data.revenue.toFixed(2)),
    }));
}
