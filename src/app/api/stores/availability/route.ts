import { NextResponse } from "next/server";
import {createClient} from "@/lib/supabase/client";

export async function GET(req: Request) {
    try {
        const supabase = createClient();
        const { searchParams } = new URL(req.url);
        const productId = searchParams.get("productId");

        if (!productId) {
            return NextResponse.json(
                { error: "productId is required" },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from("inventory_items")
            .select(
                `
        id,
        available_quantity,
        store:stores (
          id,
          name,
          slug,
          city,
          state,
          address_line1,
          phone,
          hours,
          is_flagship
        )
      `
            )
            .eq("product_id", productId)
            .gt("available_quantity", 0)
            .order("available_quantity", { ascending: false });

        if (error) throw error;

        return NextResponse.json({ data });
    } catch (err: any) {
        console.error("[GET /api/stores/availability]", err);
        return NextResponse.json(
            { error: err.message ?? "Failed to load availability" },
            { status: 500 }
        );
    }
}
