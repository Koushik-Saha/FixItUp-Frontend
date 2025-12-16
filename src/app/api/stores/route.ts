import { NextResponse } from "next/server";
import {createClient} from "@/lib/supabase/client";

export async function GET() {
    try {
        const supabase = createClient();

        const { data, error } = await supabase
            .from("stores")
            .select(
                `
        id,
        name,
        slug,
        address_line1,
        city,
        state,
        zip,
        phone,
        hours,
        is_flagship,
        latitude,
        longitude
      `
            )
            .order("id", { ascending: true });

        if (error) throw error;

        return NextResponse.json({ data });
    } catch (err: any) {
        console.error("[GET /api/stores]", err);
        return NextResponse.json(
            { error: err.message ?? "Failed to load stores" },
            { status: 500 }
        );
    }
}
