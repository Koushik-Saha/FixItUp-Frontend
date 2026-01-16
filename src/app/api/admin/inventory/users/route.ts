import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
    errorResponse,
    UnauthorizedError,
    ForbiddenError,
} from "@/lib/utils/errors";
import type { Database } from "@/types/database";
import { handleCorsPreflightRequest, getCorsHeaders } from '@/lib/cors';

type Tables = Database["public"]["Tables"];
type ProfileRow = Tables["profiles"]["Row"]; // <-- strongly typed user

// OPTIONS /api/admin/inventory/users - Handle preflight request
export async function OPTIONS(request: NextRequest) {
    return handleCorsPreflightRequest(request);
}

// GET /api/admin/users - List all users
export async function GET(request: NextRequest) {
    try {
        const origin = request.headers.get('origin');
        const supabase = await createClient();

        // Auth
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();
        if (authError || !user) throw new UnauthorizedError();

        // Admin check
        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single<Pick<ProfileRow, "role">>();

        if (!profile || (profile as any).role !== "admin") {
            throw new ForbiddenError("Only admins can access user management");
        }

        // Query params
        const { searchParams } = new URL(request.url);
        const role = searchParams.get("role");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "50");

        const from = (page - 1) * limit;
        const to = from + limit - 1;

        // Build query
        let query = supabase
            .from("profiles")
            .select("*", { count: "exact" }) as any;

        if (role) query = query.eq("role", role);

        query = query.order("created_at", { ascending: false }).range(from, to);

        // ⬅ FIXED — typed result
        const {
            data: users,
            error,
            count,
        }: { data: ProfileRow[] | null; error: any; count: number | null } =
            await query;

        if (error) {
            console.error("Failed to fetch users:", error);
            throw new Error("Failed to fetch users");
        }

        // Stats query — also typed
        const { data: allUsers } = (await supabase
            .from("profiles")
            .select("role")) as { data: Pick<ProfileRow, "role">[] | null };

        const stats = {
            total: allUsers?.length ?? 0,
            customers: allUsers?.filter((u) => u.role === "customer").length ?? 0,
            wholesale: allUsers?.filter((u) => u.role === "wholesale").length ?? 0,
            admins: allUsers?.filter((u) => u.role === "admin").length ?? 0,
        };

        return NextResponse.json({
            data: users ?? [],
            stats,
            pagination: {
                page,
                limit,
                total: count ?? 0,
                totalPages: Math.ceil((count ?? 0) / limit),
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
