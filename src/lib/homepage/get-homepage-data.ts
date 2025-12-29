import { supabaseServer } from "@/lib/supabase/servers";

export type HomepageData = {
    hero: any[];
    categories: any[];
    flashDeals: any;
    brands: any[];
};

export async function getHomepageData(): Promise<HomepageData | null> {
    try {
        // Run queries in parallel (fast)
        const [heroRes, categoriesRes, flashDealsRes, brandsRes] = await Promise.all([
            supabaseServer.from("hero").select("*").order("id", { ascending: true }),
            supabaseServer.from("categories").select("*").order("id", { ascending: true }),
            supabaseServer.from("flash_deals").select("*").order("id", { ascending: true }),
            supabaseServer.from("brands").select("*").order("id", { ascending: true }),
        ]);

        // If any query errors, throw a useful message
        const firstError =
            heroRes.error || categoriesRes.error || flashDealsRes.error || brandsRes.error;

        if (firstError) {
            console.error("Supabase homepage query error:", firstError);
            return null;
        }

        return {
            hero: heroRes.data ?? [],
            categories: categoriesRes.data ?? [],
            flashDeals: flashDealsRes.data ?? '',
            brands: brandsRes.data ?? [],
        };
    } catch (err) {
        console.error("getHomepageData() error:", err);
        return null;
    }
}
