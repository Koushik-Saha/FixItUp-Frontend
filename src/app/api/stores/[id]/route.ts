import { NextResponse } from "next/server";
import {createClient} from "@/lib/supabase/client";

export async function GET(
    _req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = createClient();

        const { data, error } = await supabase
            .from("stores")
            .select("*")
            .eq("id", params.id)
            .single();

        if (error) {
            console.error(error);
            return NextResponse.json({ error: "Store not found" }, { status: 404 });
        }

        return NextResponse.json({ data });
    } catch (err: any) {
        console.error("[GET /api/stores/:id]", err);
        return NextResponse.json(
            { error: err.message ?? "Failed to load store" },
            { status: 500 }
        );
    }
}
