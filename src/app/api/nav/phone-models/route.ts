import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type PhoneModelRow = {
    id: string;
    model_name: string;
    model_slug: string;
    release_year: number | null;
    category_id: string;
};

type CategoryRow = {
    id: string
    name: string
    slug: string
    parent_id: string | null
    is_active: boolean
    sort_order: number | null
}

function toShopLink(categorySlug: string, modelName: string) {
    // keep your existing query structure
    const device = encodeURIComponent(modelName);
    return `/shop?category=${encodeURIComponent(categorySlug)}&device=${device}`;
}

/**
 * Simple rule to infer "series" / subcategory from model_name.
 * You can improve this later by adding a "series" column in DB.
 */
function inferSubcategory(brandSlug: string, modelName: string): string {
    const name = modelName.toLowerCase();

    if (brandSlug === "apple") {
        if (name.includes("iphone")) return "iPhone";
        if (name.includes("ipad")) return "iPad";
        if (name.includes("watch")) return "Watch";
        if (name.includes("airpods")) return "AirPods";
        if (name.includes("ipod")) return "iPod";
        if (name.includes("macbook pro")) return "MacBook Pro";
        if (name.includes("macbook air")) return "MacBook Air";
        if (name.includes("macbook")) return "MacBook";
        if (name.includes("imac")) return "iMac";
        if (name.includes("mac mini")) return "Mac Mini";
        if (name.includes("mac pro")) return "Mac Pro";
        if (name.includes("mac studio")) return "Mac Studio";
        if (name.includes("studio display")) return "Studio Display";
        return "Other";
    }

    if (brandSlug === "samsung") {
        if (name.includes("galaxy s")) return "S Series";
        if (name.includes("note")) return "Note Series";
        if (name.includes("galaxy a")) return "A Series";
        if (name.includes("fold") || name.includes("flip") || name.includes("galaxy z")) return "Z Series";
        return "Other";
    }

    if (brandSlug === "motorola") {
        if (name.includes("moto g")) return "Moto G Series";
        if (name.includes("razr")) return "Razr Series";
        if (name.includes("edge")) return "Edge Series";
        return "Other";
    }

    if (brandSlug === "google") {
        if (name.includes("pixelbook")) return "Pixelbook";
        if (name.includes("pixel") || name.includes("nexus")) return "Pixel";
        return "Other";
    }

    return "Other";
}

export async function GET() {
    const supabase = await createClient();

    const { data: ping, error: pingErr } = await supabase
        .from('categories')
        .select('id')
        .limit(1)

    // 1) Load brand categories (top-level)
    // You already have these slugs in your UI
    const brandSlugs = ["apple", "samsung", "motorola", "google"];

    const { data: brandCategories, error: catErr } = await supabase
        .from("categories")
        .select('id,name,slug,parent_id,is_active,sort_order')
        .in('slug', ['apple', 'samsung', 'motorola', 'google'])
        .eq('is_active', true)

    if (catErr) {
        return NextResponse.json({ success: false, error: catErr.message }, { status: 500 });
    }

    const brandById = new Map<string, CategoryRow>();
    (brandCategories || []).forEach((c: any) => brandById.set(c.id, c));

    // 2) Load phone models for those brands
    const { data: models, error: modelErr } = await supabase
        .from("phone_models")
        .select("id, model_name, model_slug, release_year, category_id")
        .in("category_id", Array.from(brandById.keys()))
        .eq("is_active", true)
        .order("release_year", { ascending: false })
        .order("model_name", { ascending: true });

    if (modelErr) {
        return NextResponse.json({ success: false, error: modelErr.message }, { status: 500 });
    }

    // 3) Group -> brand -> subcategory -> items
    const grouped: Record<
        string,
        {
            subcategories: string[];
            bySubcategory: Record<
                string,
                {
                    columns: Array<{ title: string; items: Array<{ name: string; link: string; new?: boolean }> ; viewAll?: string }>;
                }
            >;
        }
    > = {};

    const brandCategoriesData: CategoryRow[] = (brandCategories ?? []) as CategoryRow[]

    for (const bc of brandCategoriesData) {
        grouped[bc.name] = { subcategories: [], bySubcategory: {} };
    }

    for (const row of (models || []) as PhoneModelRow[]) {
        const brand = brandById.get(row.category_id);
        if (!brand) continue;

        const brandName = brand.name;     // "Apple"
        const brandSlug = brand.slug;     // "apple"

        const subcat = inferSubcategory(brandSlug, row.model_name);
        if (!grouped[brandName]) grouped[brandName] = { subcategories: [], bySubcategory: {} };

        if (!grouped[brandName].subcategories.includes(subcat)) {
            grouped[brandName].subcategories.push(subcat);
        }

        if (!grouped[brandName].bySubcategory[subcat]) {
            grouped[brandName].bySubcategory[subcat] = {
                columns: [
                    { title: subcat, items: [], viewAll: `/shop?category=${brandSlug}&type=${encodeURIComponent(subcat)}` },
                    { title: "", items: [] },
                    { title: "", items: [] },
                ],
            };
        }

        const isNew = row.release_year != null && row.release_year >= 2024;

        // spread items into 3 columns (simple round-robin)
        const cols = grouped[brandName].bySubcategory[subcat].columns;
        const allCount = cols[0].items.length + cols[1].items.length + cols[2].items.length;
        const colIndex = allCount % 3;

        cols[colIndex].items.push({
            name: row.model_name,
            link: toShopLink(brandSlug, row.model_name),
            ...(isNew ? { new: true } : {}),
        });
    }

    // Optional: sort subcategories in a nice order
    const preferredOrder: Record<string, string[]> = {
        Apple: ["iPhone", "iPad", "Watch", "AirPods", "iPod", "MacBook Pro", "MacBook Air", "MacBook", "iMac", "Mac Mini", "Mac Pro", "Mac Studio", "Studio Display", "Other"],
        Samsung: ["S Series", "Note Series", "A Series", "Z Series", "Other"],
        Motorola: ["Moto G Series", "Razr Series", "Edge Series", "Other"],
        Google: ["Pixel", "Pixelbook", "Other"],
    };

    for (const brandName of Object.keys(grouped)) {
        const pref = preferredOrder[brandName];
        if (pref) {
            grouped[brandName].subcategories.sort((a, b) => pref.indexOf(a) - pref.indexOf(b));
        } else {
            grouped[brandName].subcategories.sort();
        }
    }

    return NextResponse.json({ success: true, data: grouped });
}

