import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { errorResponse, UnauthorizedError } from '@/lib/utils/errors'
import { z } from 'zod'

const addToCartSchema = z.object({
    product_id: z.string().uuid(),
    quantity: z.number().int().positive().min(1).max(100),
})

const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5001",
    process.env.NEXT_PUBLIC_SITE_URL,
].filter(Boolean) as string[];

function getCorsHeaders(request: NextRequest) {
    const origin = request.headers.get("origin") || "";
    const allowOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0] || origin;
    return {
        "Access-Control-Allow-Origin": allowOrigin,
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, x-user-id, x-user-role",
        "Access-Control-Allow-Credentials": "true",
    };
}

export async function OPTIONS(request: NextRequest) {
    return new NextResponse(null, { status: 204, headers: getCorsHeaders(request) });
}

export async function GET(request: NextRequest) {
    const corsHeaders = getCorsHeaders(request);

    try {
        const userId = request.headers.get('x-user-id');

        // Guest: return empty (frontend handles localStorage)
        if (!userId) {
            return NextResponse.json({
                data: {
                    items: [],
                    summary: {
                        subtotal: 0,
                        total_items: 0,
                        total_savings: 0,
                        is_wholesale: false,
                        wholesale_tier: null,
                    },
                },
            }, { headers: corsHeaders });
        }

        // Auth User: Fetch Cart
        const cartItems = await prisma.cartItem.findMany({
            where: { userId },
            include: { product: true },
            orderBy: { createdAt: 'desc' }
        });

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true, wholesaleTier: true }
        });

        // Calculate Pricing
        const cartWithPricing = cartItems.map(item => {
            const product = item.product;
            if (!product) return null; // Should not happen due to integrity

            let unitPrice = Number(product.basePrice);
            let discountPercentage = 0;

            if (user?.role === 'WHOLESALE' && user.wholesaleTier) {
                if (user.wholesaleTier === 'TIER1') discountPercentage = Number(product.tier1Discount);
                else if (user.wholesaleTier === 'TIER2') discountPercentage = Number(product.tier2Discount);
                else if (user.wholesaleTier === 'TIER3') discountPercentage = Number(product.tier3Discount);

                unitPrice = unitPrice * (1 - discountPercentage / 100);
            }

            const subtotal = unitPrice * item.quantity;

            return {
                id: item.id,
                product_id: item.productId,
                quantity: item.quantity,
                product: {
                    id: product.id,
                    sku: product.sku,
                    name: product.name,
                    slug: product.slug,
                    brand: product.brand,
                    device_model: product.deviceModel,
                    image: product.thumbnail || product.images[0],
                    in_stock: (product.totalStock || 0) > 0,
                    available_quantity: product.totalStock || 0
                },
                pricing: {
                    unit_price: Number(unitPrice.toFixed(2)),
                    original_price: Number(product.basePrice),
                    discount_percentage: discountPercentage,
                    subtotal: Number(subtotal.toFixed(2))
                }
            };
        }).filter(Boolean);

        // Totals
        const subtotal = cartWithPricing.reduce((sum, item) => sum + (item?.pricing.subtotal || 0), 0);
        const totalItems = cartWithPricing.reduce((sum, item) => sum + (item?.quantity || 0), 0);
        const totalSavings = cartWithPricing.reduce((sum, item) => {
            const original = (item?.pricing.original_price || 0);
            const current = (item?.pricing.unit_price || 0);
            return sum + ((original - current) * (item?.quantity || 0));
        }, 0);

        return NextResponse.json({
            data: {
                items: cartWithPricing,
                summary: {
                    subtotal: Number(subtotal.toFixed(2)),
                    total_items: totalItems,
                    total_savings: Number(totalSavings.toFixed(2)),
                    is_wholesale: user?.role === 'WHOLESALE',
                    wholesale_tier: user?.wholesaleTier
                }
            }
        }, { headers: corsHeaders });

    } catch (error) {
        const res = errorResponse(error);
        Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
        return res;
    }
}

export async function POST(request: NextRequest) {
    const corsHeaders = getCorsHeaders(request);

    try {
        const body = await request.json();
        const validation = addToCartSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({
                error: 'Invalid request',
                details: validation.error.flatten().fieldErrors
            }, { status: 400, headers: corsHeaders });
        }

        const { product_id, quantity } = validation.data;
        const userId = request.headers.get('x-user-id');

        // Guest: Return success
        if (!userId) {
            return NextResponse.json({
                message: 'Item added to cart successfully',
                data: { guest: true, product_id, quantity }
            }, { status: 201, headers: corsHeaders });
        }

        // Auth User
        const product = await prisma.product.findUnique({
            where: { id: product_id }
        });

        if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404, headers: corsHeaders });
        if (!product.isActive) return NextResponse.json({ error: 'Product unavailable' }, { status: 400, headers: corsHeaders });
        if ((product.totalStock || 0) < quantity) return NextResponse.json({ error: 'Insufficient stock', available: product.totalStock || 0 }, { status: 400, headers: corsHeaders });

        // Upsert logic manually to check stock on specific item
        const existingItem = await prisma.cartItem.findFirst({
            where: { userId, productId: product_id }
        });

        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            if ((product.totalStock || 0) < newQuantity) {
                return NextResponse.json({
                    error: 'Cannot add more items. Max available reached.',
                    available: product.totalStock || 0,
                    current_in_cart: existingItem.quantity
                }, { status: 400, headers: corsHeaders });
            }

            const updated = await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: newQuantity }
            });
            return NextResponse.json({ message: 'Cart updated', data: updated }, { headers: corsHeaders });
        } else {
            const newItem = await prisma.cartItem.create({
                data: { userId, productId: product_id, quantity }
            });
            return NextResponse.json({ message: 'Item added to cart', data: newItem }, { status: 201, headers: corsHeaders });
        }

    } catch (error) {
        const res = errorResponse(error);
        Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
        return res;
    }
}
