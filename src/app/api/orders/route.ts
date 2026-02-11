import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { errorResponse, UnauthorizedError, ValidationError } from '@/lib/utils/errors'
import { z } from 'zod'
import { Prisma, OrderStatus } from '@prisma/client'

// Schema for creating an order
const createOrderSchema = z.object({
    shipping_address: z.object({
        full_name: z.string().min(1),
        address_line_1: z.string().min(1),
        address_line_2: z.string().optional(),
        city: z.string().min(1),
        state: z.string().min(1),
        postal_code: z.string().min(1),
        country: z.string().min(1),
        phone: z.string().optional(),
    }),
    billing_address: z.object({
        full_name: z.string().min(1),
        address_line_1: z.string().min(1),
        address_line_2: z.string().optional(),
        city: z.string().min(1),
        state: z.string().min(1),
        postal_code: z.string().min(1),
        country: z.string().min(1),
        phone: z.string().optional(),
    }).optional(),
    customer_notes: z.string().optional()
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
        "Access-Control-Allow-Methods": "POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, x-user-id, x-user-role",
        "Access-Control-Allow-Credentials": "true",
    };
}

export async function OPTIONS(request: NextRequest) {
    return new NextResponse(null, { status: 204, headers: getCorsHeaders(request) });
}

export async function GET(request: NextRequest) {
    const corsHeaders = getCorsHeaders(request);
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const status = searchParams.get('status');

    try {
        const userId = request.headers.get('x-user-id');
        const userRole = request.headers.get('x-user-role');
        if (!userId) throw new UnauthorizedError();

        const skip = (page - 1) * limit;
        const where: Prisma.OrderWhereInput = {};

        // Admin can see all, Users only see their own
        if (userRole !== 'ADMIN') {
            where.userId = userId;
        }

        if (status && status !== 'ALL') {
            where.status = status as OrderStatus;
        }

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: { orderItems: true }
            }),
            prisma.order.count({ where })
        ]);

        return NextResponse.json({
            data: orders,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
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
        const userId = request.headers.get('x-user-id');
        if (!userId) throw new UnauthorizedError('Must be logged in to place an order');

        const body = await request.json();
        const validation = createOrderSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({
                error: 'Invalid request',
                details: validation.error.flatten().fieldErrors
            }, { status: 400, headers: corsHeaders });
        }

        const { shipping_address, billing_address, customer_notes } = validation.data;

        // 1. Fetch Cart
        const cartItems = await prisma.cartItem.findMany({
            where: { userId },
            include: { product: true }
        });

        if (cartItems.length === 0) {
            return NextResponse.json({ error: 'Cart is empty' }, { status: 400, headers: corsHeaders });
        }

        // 2. Validate Stock & Pricing
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true, wholesaleTier: true, fullName: true, email: true, phone: true }
        });

        if (!user) throw new UnauthorizedError();

        let subtotal = 0;

        interface ProcessedItem {
            productId: string;
            productName: string;
            productSku: string;
            productImage: string;
            quantity: number;
            unitPrice: number;
            discountPercent: number;
            subtotal: number;
        }
        const processedItems: ProcessedItem[] = [];

        for (const item of cartItems) {
            const product = item.product;

            // Check active
            if (!product.isActive) {
                return NextResponse.json({
                    error: `Product ${product.name} is no longer available`,
                    code: 'PRODUCT_UNAVAILABLE'
                }, { status: 400, headers: corsHeaders });
            }

            // Check stock
            if (product.totalStock < item.quantity) {
                return NextResponse.json({
                    error: `Insufficient stock for ${product.name}`,
                    code: 'INSUFFICIENT_STOCK',
                    available: product.totalStock
                }, { status: 400, headers: corsHeaders });
            }

            // Calculate Unit Price (Wholesale Logic)
            let unitPrice = Number(product.basePrice);
            let discountPercentage = 0;

            if (user.role === 'WHOLESALE' && user.wholesaleTier) {
                if (user.wholesaleTier === 'TIER1') discountPercentage = Number(product.tier1Discount);
                else if (user.wholesaleTier === 'TIER2') discountPercentage = Number(product.tier2Discount);
                else if (user.wholesaleTier === 'TIER3') discountPercentage = Number(product.tier3Discount);

                unitPrice = unitPrice * (1 - discountPercentage / 100);
            }

            const itemSubtotal = unitPrice * item.quantity;
            subtotal += itemSubtotal;

            processedItems.push({
                productId: product.id,
                productName: product.name,
                productSku: product.sku,
                productImage: product.thumbnail || product.images[0],
                quantity: item.quantity,
                unitPrice,
                discountPercent: discountPercentage,
                subtotal: itemSubtotal
            });
        }

        // 3. Calculate Totals
        const taxRate = 0; // Implement tax calculation logic here
        const taxAmount = subtotal * taxRate;
        const shippingCost = subtotal > 100 ? 0 : 10; // Simple logic: Free shipping over $100
        const totalAmount = subtotal + taxAmount + shippingCost;

        // 4. Transaction: Create Order, Items, Update Stock, Clear Cart
        const order = await prisma.$transaction(async (tx) => {
            // Create Order
            const newOrder = await tx.order.create({
                data: {
                    userId,
                    orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`, // Simple generation
                    customerName: user.fullName || shipping_address.full_name,
                    customerEmail: user.email,
                    customerPhone: user.phone || shipping_address.phone,
                    status: 'PENDING',
                    paymentStatus: 'PENDING', // Payment integration later
                    subtotal,
                    taxAmount,
                    shippingCost,
                    totalAmount,
                    isWholesale: user.role === 'WHOLESALE',
                    wholesaleTier: user.wholesaleTier,
                    shippingAddress: shipping_address as unknown as Prisma.InputJsonValue,
                    billingAddress: (billing_address || shipping_address) as unknown as Prisma.InputJsonValue,
                    customerNotes: customer_notes,

                    // Create Items
                    orderItems: {
                        create: processedItems
                    }
                }
            });

            // Update Stock
            for (const item of processedItems) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        totalStock: { decrement: item.quantity }
                    }
                });
            }

            // Clear Cart
            await tx.cartItem.deleteMany({
                where: { userId }
            });

            return newOrder;
        });

        return NextResponse.json({
            message: 'Order placed successfully',
            data: {
                orderId: order.id,
                orderNumber: order.orderNumber,
                totalAmount: Number(order.totalAmount)
            }
        }, { status: 201, headers: corsHeaders });

    } catch (error) {
        const res = errorResponse(error);
        Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
        return res;
    }
}
