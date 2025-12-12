// src/app/api/cart/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { errorResponse, UnauthorizedError, NotFoundError } from "@/utils/errors";
import { z } from "zod";
import type { Database } from "@/types/database";

const updateCartSchema = z.object({
    quantity: z.number().int().positive().min(1).max(100),
});

// --- DB helper types ---
type Tables = Database["public"]["Tables"];
type CartItemRow = Tables["cart_items"]["Row"];
type ProductRow = Tables["products"]["Row"];
type CartItemUpdate = Tables["cart_items"]["Update"];

// cart_items joined to products (for stock & active checks)
type CartItemWithProduct = CartItemRow & {
    products: Pick<ProductRow, "total_stock" | "is_active"> | null;
};

// PUT /api/cart/[id] - Update cart item quantity
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient();
        const { id } = await params;

        // Get authenticated user
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();
        if (authError || !user) {
            throw new UnauthorizedError();
        }

        // Parse and validate request
        const body = await request.json();
        const validation = updateCartSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    error: "Invalid request",
                    details: validation.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const { quantity } = validation.data;

        // Get cart item and verify ownership
        const { data: cartItem, error: fetchError } = await supabase
            .from("cart_items")
            .select(
                "id, product_id, quantity, products(total_stock, is_active)"
            )
            .eq("id", id)
            .eq("user_id", user.id)
            .single<CartItemWithProduct>(); // 👈 typed row

        if (fetchError || !cartItem) {
            throw new NotFoundError("Cart item");
        }

        const product = cartItem.products;

        // Check if product is still active
        if (!product || !product.is_active) {
            return NextResponse.json(
                { error: "Product is no longer available" },
                { status: 400 }
            );
        }

        // Check stock
        if (product.total_stock < quantity) {
            return NextResponse.json(
                {
                    error: "Insufficient stock",
                    available: product.total_stock,
                },
                { status: 400 }
            );
        }

        // Build typed update payload
        const updates: CartItemUpdate = {
            quantity,
            updated_at: new Date().toISOString(),
        };

        // Update quantity
        // @ts-ignore - Supabase typing bug for update payload
        const { data: updated, error: updateError } = await (supabase
            .from("cart_items") as any)
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (updateError) {
            console.error("Failed to update cart:", updateError);
            throw new Error("Failed to update cart item");
        }

        return NextResponse.json({
            message: "Cart item updated successfully",
            data: updated,
        });
    } catch (error) {
        return errorResponse(error);
    }
}

// DELETE /api/cart/[id] - Remove item from cart
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient();
        const { id } = await params;

        // Get authenticated user
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();
        if (authError || !user) {
            throw new UnauthorizedError();
        }

        // Delete cart item (verify ownership with eq)
        const { error: deleteError } = await supabase
            .from("cart_items")
            .delete()
            .eq("id", id)
            .eq("user_id", user.id);

        if (deleteError) {
            throw new NotFoundError("Cart item");
        }

        return NextResponse.json({
            message: "Item removed from cart successfully",
        });
    } catch (error) {
        return errorResponse(error);
    }
}
