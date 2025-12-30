import { supabaseServer } from "@/lib/supabase/servers";

export type FlashDealsType = {
    title: string;
    subtitle: string;
    endsAt: string;     // not in DB, we generate it
    products: any[];    // you can type this later
};

export type HomepageData = {
    hero: any[];
    categories: any[];
    brands: { name: string }[];
    flashDeals: FlashDealsType;
};

export async function getHomepageData(): Promise<HomepageData | null> {
    try {
        // 1) HERO SLIDES: public.hero_slides
        const heroRes = await supabaseServer
            .from("hero_slides")
            .select("*")
            .eq("is_active", true)
            .order("sort_order", { ascending: true });

        // 2) CATEGORIES: public.categories
        const categoriesRes = await supabaseServer
            .from("categories")
            .select("*")
            .eq("is_active", true)
            .order("sort_order", { ascending: true });

        // 3) HOMEPAGE SETTINGS: public.homepage_settings (single row)
        const settingsRes = await supabaseServer
            .from("homepage_settings")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

        // 4) FLASH DEAL PRODUCTS: from public.products
        // (Your schema has no "flash_deal" flag, so we use featured products for that section.)
        const flashProductsRes = await supabaseServer
            .from("products")
            .select("*")
            .eq("is_active", true)
            .eq("is_featured", true)
            .order("created_at", { ascending: false })
            .limit(12);

        const firstError =
            heroRes.error ||
            categoriesRes.error ||
            settingsRes.error ||
            flashProductsRes.error;

        if (firstError) {
            console.error("Homepage query error:", firstError);
            return null;
        }

        const hero = heroRes.data ?? [];
        const categories = categoriesRes.data ?? [];
        const flashProducts = flashProductsRes.data ?? [];
        const settings = settingsRes.data ?? null;

        // BRANDS: derived from public.products.brand (no brands table in your dump)
        const brandNames = Array.from(
            new Set((flashProducts ?? []).map((p: any) => p?.brand).filter(Boolean))
        );
        const brands = brandNames.map((name) => ({ name }));

        // FLASH DEALS OBJECT: title/subtitle come from homepage_settings, endsAt generated
        const endsAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

        const flashDeals = {
            title: settings?.flash_deals_title ?? "Flash Deals",
            subtitle: settings?.flash_deals_subtitle ?? "Limited time offers",
            endsAt,
            products: flashProducts,
        };

        return { hero, categories, brands, flashDeals };
    } catch (e) {
        console.error("getHomepageData fatal:", e);
        return null;
    }
}
