import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
    errorResponse,
    UnauthorizedError,
    ForbiddenError,
} from "@/lib/utils/errors";
import type { Database } from "@/types/database";

// --- DB row helpers ---
type Tables = Database["public"]["Tables"];

type ProfileRow = Tables["profiles"]["Row"];
type OrderRow = Tables["orders"]["Row"];
type ProductRow = Tables["products"]["Row"];
type RepairTicketRow = Tables["repair_tickets"]["Row"];
type WholesaleApplicationRow = Tables["wholesale_applications"]["Row"];

type DashboardOrder = Pick<OrderRow, "id" | "status">;
type RevenueOrder = Pick<OrderRow, "total_amount" | "status">;
type DashboardProduct = Pick<ProductRow, "id" | "is_active">;
type DashboardRepair = Pick<RepairTicketRow, "id" | "status">;
type DashboardWholesale = Pick<WholesaleApplicationRow, "id" | "status">;
type LowStockProduct = Pick<
    ProductRow,
    "id" | "name" | "sku" | "total_stock" | "low_stock_threshold"
>;

// GET /api/admin/dashboard - Get dashboard overview stats
export async function GET(request: NextRequest) {
    try {
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
            .single<Pick<ProfileRow, "role">>();

        if (!profile || (profile as any).role !== "admin") {
            throw new ForbiddenError("Only admins can access dashboard");
        }

        // Get date range from query params (default: last 30 days)
        const { searchParams } = new URL(request.url);
        const days = parseInt(searchParams.get("days") || "30", 10);
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Fetch all stats in parallel
        const [
            ordersResult,
            revenueResult,
            productsResult,
            repairsResult,
            wholesaleResult,
            recentOrdersResult,
            lowStockResult,
        ] = await Promise.all([
            // Total orders
            supabase
                .from("orders")
                .select("id, status", { count: "exact", head: false })
                .gte("created_at", startDate.toISOString()),

            // Revenue
            supabase
                .from("orders")
                .select("total_amount, status")
                .eq("payment_status", "paid")
                .gte("created_at", startDate.toISOString()),

            // Products
            supabase
                .from("products")
                .select("id, is_active", { count: "exact", head: false }),

            // Repair tickets
            supabase
                .from("repair_tickets")
                .select("id, status", { count: "exact", head: false })
                .gte("created_at", startDate.toISOString()),

            // Wholesale applications
            supabase
                .from("wholesale_applications")
                .select("id, status", { count: "exact", head: false }),

            // Recent orders
            supabase
                .from("orders")
                .select(
                    "id, order_number, customer_name, total_amount, status, created_at"
                )
                .order("created_at", { ascending: false })
                .limit(5),

            // Low stock products (simple threshold, adjust as needed)
            supabase
                .from("products")
                .select("id, name, sku, total_stock, low_stock_threshold")
                .lte("total_stock", 5) // TODO: use a DB function or view if you want per-product thresholds
                .limit(10),
        ]);

        // Typed data arrays
        const orders: DashboardOrder[] =
            (ordersResult.data ?? []) as DashboardOrder[];
        const paidOrders: RevenueOrder[] =
            (revenueResult.data ?? []) as RevenueOrder[];
        const products: DashboardProduct[] =
            (productsResult.data ?? []) as DashboardProduct[];
        const repairs: DashboardRepair[] =
            (repairsResult.data ?? []) as DashboardRepair[];
        const wholesale: DashboardWholesale[] =
            (wholesaleResult.data ?? []) as DashboardWholesale[];
        const lowStock: LowStockProduct[] =
            (lowStockResult.data ?? []) as LowStockProduct[];

        // Process orders stats
        const orderStats = {
            total: orders.length,
            pending: orders.filter((o) => o.status === "pending").length,
            processing: orders.filter((o) => o.status === "processing").length,
            shipped: orders.filter((o) => o.status === "shipped").length,
            delivered: orders.filter((o) => o.status === "delivered").length,
            cancelled: orders.filter((o) => o.status === "cancelled").length,
        };

        // Process revenue
        const revenue = {
            total: paidOrders.reduce(
                (sum, o) => sum + Number(o.total_amount),
                0
            ),
            orders: paidOrders.length,
            average:
                paidOrders.length > 0
                    ? paidOrders.reduce(
                    (sum, o) => sum + Number(o.total_amount),
                    0
                ) / paidOrders.length
                    : 0,
        };

        // Process products
        const productStats = {
            total: products.length,
            active: products.filter((p) => p.is_active).length,
            inactive: products.filter((p) => !p.is_active).length,
        };

        // Process repair tickets
        const repairStats = {
            total: repairs.length,
            submitted: repairs.filter((r) => r.status === "submitted").length,
            in_progress: repairs.filter((r) => r.status === "in_progress").length,
            completed: repairs.filter((r) => r.status === "completed").length,
        };

        // Process wholesale applications
        const wholesaleStats = {
            total: wholesale.length,
            pending: wholesale.filter((w) => w.status === "pending").length,
            approved: wholesale.filter((w) => w.status === "approved").length,
            rejected: wholesale.filter((w) => w.status === "rejected").length,
        };

        return NextResponse.json({
            data: {
                overview: {
                    orders: orderStats,
                    revenue: {
                        total: Number(revenue.total.toFixed(2)),
                        orders: revenue.orders,
                        average: Number(revenue.average.toFixed(2)),
                    },
                    products: productStats,
                    repairs: repairStats,
                    wholesale: wholesaleStats,
                },
                recent_orders: recentOrdersResult.data || [],
                low_stock: lowStock,
                period: {
                    days,
                    start_date: startDate.toISOString(),
                    end_date: new Date().toISOString(),
                },
            },
        });
    } catch (error) {
        return errorResponse(error);
    }
}
