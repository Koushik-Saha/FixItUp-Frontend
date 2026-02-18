import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type PhoneModelRow = {
    id: string;
    modelName: string;
    modelSlug: string;
    releaseYear: number | null;
    categoryId: string;
};

type CategoryRow = {
    id: string
    name: string
    slug: string
    parentId: string | null
    isActive: boolean
    displayOrder: number | 0 // mapped from display_order
}

function toShopLink(categorySlug: string, modelName: string) {
    // Use 'brand' parameter instead of 'category' since these are brand names
    const device = encodeURIComponent(modelName);
    return `/shop?brand=${encodeURIComponent(categorySlug)}&device=${device}`;
}

/**
 * Simple rule to infer "series" / subcategory from model_name.
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
    try {
        // 1) Load brand categories (top-level)
        const brandSlugs = ["apple", "samsung", "motorola", "google"];

        const brandCategories = await prisma.category.findMany({
            where: {
                slug: { in: brandSlugs },
                isActive: true
            },
            select: {
                id: true,
                name: true,
                slug: true,
                icon: true, // Fetch icon
                isActive: true,
                displayOrder: true
            }
        });

        const brandById = new Map<string, any>();
        brandCategories.forEach(c => brandById.set(c.id, c));

        // 2) Load phone models for those brands
        const models = await prisma.phoneModel.findMany({
            where: {
                categoryId: { in: Array.from(brandById.keys()) },
                isActive: true
            },
            select: {
                id: true,
                modelName: true,
                modelSlug: true,
                releaseYear: true,
                categoryId: true
            },
            orderBy: [
                { releaseYear: 'desc' },
                { modelName: 'asc' }
            ]
        });

        // 3) Group -> brand -> subcategory -> items
        const grouped: Record<
            string,
            {
                id: string;
                slug: string;
                icon: string | null;
                subcategories: string[];
                bySubcategory: Record<
                    string,
                    {
                        columns: Array<{ title: string; items: Array<{ name: string; link: string; new?: boolean }>; viewAll?: string }>;
                    }
                >;
            }
        > = {};

        for (const bc of brandCategories) {
            grouped[bc.name] = {
                id: bc.id,
                slug: bc.slug,
                icon: bc.icon,
                subcategories: [],
                bySubcategory: {}
            };
        }

        for (const row of models) {
            const brand = brandById.get(row.categoryId);
            if (!brand) continue;

            const brandName = brand.name;
            const brandSlug = brand.slug;

            const subcat = inferSubcategory(brandSlug, row.modelName);
            if (!grouped[brandName]) {
                grouped[brandName] = {
                    id: brand.id,
                    slug: brandSlug,
                    icon: (brand as any).icon || null, // Cast to any if type is not inferred correctly, or check schema
                    subcategories: [],
                    bySubcategory: {}
                };
            }

            if (!grouped[brandName].subcategories.includes(subcat)) {
                grouped[brandName].subcategories.push(subcat);
            }

            if (!grouped[brandName].bySubcategory[subcat]) {
                grouped[brandName].bySubcategory[subcat] = {
                    columns: [
                        { title: subcat, items: [], viewAll: `/shop?brand=${brandSlug}&type=${encodeURIComponent(subcat)}` },
                        { title: "", items: [] },
                        { title: "", items: [] },
                    ],
                };
            }

            const isNew = row.releaseYear != null && row.releaseYear >= 2024;

            // spread items into 3 columns (simple round-robin)
            const cols = grouped[brandName].bySubcategory[subcat].columns;
            const allCount = cols[0].items.length + cols[1].items.length + cols[2].items.length;
            const colIndex = allCount % 3;

            cols[colIndex].items.push({
                name: row.modelName,
                link: toShopLink(brandSlug, row.modelName),
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

    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

