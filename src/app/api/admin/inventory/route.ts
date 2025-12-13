// app/api/admin/inventory/route.ts
// Admin Inventory Management

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
    errorResponse,
    UnauthorizedError,
    ForbiddenError,
} from "@/lib/utils/errors";
import type { Database } from "@/types/database";

// --- DB helper types ---
type Tables = Database["public"]["Tables"];

type ProfileRow = Tables["profiles"]["Row"];
type InventoryRow = Tables["inventory"]["Row"];
type ProductRow = Tables["products"]["Row"];
type StoreRow = Tables["stores"]["Row"];
type InventoryUpdate = Tables["inventory"]["Update"];

type InventoryWithRelations = InventoryRow & {
    products: Pick<
        ProductRow,
        "id" | "name" | "sku" | "base_price" | "low_stock_threshold" | "is_active"
    > | null;
    stores: Pick<StoreRow, "id" | "name" | "city" | "state"> | null;
};

type InventoryQuantityRow = Pick<InventoryRow, "quantity">;

// GET /api/admin/inventory - Get inventory overview
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
            throw new ForbiddenError("Only admins can access inventory");
        }

        const { searchParams } = new URL(request.url);
        const storeId = searchParams.get("store_id");
        const status = searchParams.get("status"); // low_stock, out_of_stock, all

        // Build query
        let query = supabase
            .from("inventory")
            .select(
                `
        id,
        quantity,
        reserved_quantity,
        last_restocked_at,
        product_id,
        store_id,
        products(id, name, sku, base_price, low_stock_threshold, is_active),
        stores(id, name, city, state)
      `
            );

        if (storeId) {
            query = query.eq("store_id", storeId);
        }

        const { data: rawInventory, error } = await query;

        if (error) {
            console.error("Failed to fetch inventory:", error);
            throw new Error("Failed to fetch inventory");
        }

        const inventory: InventoryWithRelations[] = (rawInventory ??
            []) as InventoryWithRelations[];

        // Filter by status
        let filteredInventory = inventory;

        if (status === "low_stock") {
            filteredInventory = filteredInventory.filter((item) => {
                const product = item.products;
                return (
                    item.quantity > 0 &&
                    item.quantity <= (product?.low_stock_threshold ?? 10)
                );
            });
        } else if (status === "out_of_stock") {
            filteredInventory = filteredInventory.filter(
                (item) => item.quantity === 0
            );
        }

        // Calculate stats
        const totalItems = filteredInventory.length;

        const lowStockItems = filteredInventory.filter((item) => {
            const product = item.products;
            return (
                item.quantity > 0 &&
                item.quantity <= (product?.low_stock_threshold ?? 10)
            );
        }).length;

        const outOfStockItems = filteredInventory.filter(
            (item) => item.quantity === 0
        ).length;

        const totalValue = filteredInventory.reduce((sum, item) => {
            const product = item.products;
            return sum + item.quantity * (product?.base_price ?? 0);
        }, 0);

        return NextResponse.json({
            data: {
                inventory: filteredInventory,
                stats: {
                    total_items: totalItems,
                    low_stock: lowStockItems,
                    out_of_stock: outOfStockItems,
                    total_value: Number(totalValue.toFixed(2)),
                },
            },
        });
    } catch (error) {
        return errorResponse(error);
    }
}

// PUT /api/admin/inventory - Update inventory
export async function PUT(request: NextRequest) {
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
            throw new ForbiddenError("Only admins can update inventory");
        }

        const body = await request.json();
        const { inventory_id, quantity, action } = body;

        if (!inventory_id) {
            return NextResponse.json(
                { error: "inventory_id is required" },
                { status: 400 }
            );
        }

        // Get current inventory
        const { data: currentInventory, error: fetchError } = await supabase
            .from("inventory")
            .select("quantity")
            .eq("id", inventory_id)
            .single<InventoryQuantityRow>();

        if (fetchError || !currentInventory) {
            return NextResponse.json(
                { error: "Inventory not found" },
                { status: 404 }
            );
        }

        let newQuantity: number = quantity;

        if (action === "add") {
            newQuantity = currentInventory.quantity + quantity;
        } else if (action === "subtract") {
            newQuantity = Math.max(0, currentInventory.quantity - quantity);
        }

        const updatePayload = {
            quantity: newQuantity,
            ...(action === "add" && { last_restocked_at: new Date().toISOString() }),
            updated_at: new Date().toISOString(),
        };

        // Update inventory
        // @ts-ignore - Supabase inventory table type seems broken, using type assertion
        const { data: updated, error: updateError } = await (supabase
            .from("inventory") as any)
            .update(updatePayload)
            .eq("id", inventory_id)
            .select()
            .single();

        if (updateError) {
            throw new Error("Failed to update inventory");
        }

        return NextResponse.json({
            message: "Inventory updated successfully",
            data: updated,
        });
    } catch (error) {
        return errorResponse(error);
    }
}
