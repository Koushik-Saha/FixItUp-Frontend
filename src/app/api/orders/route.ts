/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { errorResponse, UnauthorizedError, ValidationError } from '@/lib/utils/errors'
import { createOrderSchema, validateData } from '@/utils/validation'
import { Prisma } from '@prisma/client'

// Setup CORS headers helper (inline for now)
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
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
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
        const userRole = request.headers.get('x-user-role');

        if (!userId) {
            throw new UnauthorizedError('Please login to view orders');
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const status = searchParams.get('status');
        const from = (page - 1) * limit;

        const isAdmin = userRole === 'ADMIN';

        const where: Prisma.OrderWhereInput = {};

        if (!isAdmin) {
            where.userId = userId;
        }

        if (status) {
            // Map status string to Enum if needed, or if schema matches string it's fine.
            // Schema uses OrderStatus enum (PENDING, PROCESSING, etc)
            // Need to ensure status param matches enum casing or map it.
            // Using simple casting for now, verifying input is better practice.
            where.status = status.toUpperCase() as any;
        }

        const [orders, count] = await Promise.all([
            prisma.order.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: from,
                take: limit,
            }),
            prisma.order.count({ where })
        ]);

        return NextResponse.json({
            data: orders,
            pagination: {
                page,
                limit,
                total: count,
                totalPages: Math.ceil(count / limit),
            },
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
        const userId = request.headers.get('x-user-id');
        const isGuest = !userId;

        // Fetch User if logged in to get Wholesale status
        let user = null;
        if (userId) {
            user = await prisma.user.findUnique({ where: { id: userId } });
        }

        // Validate
        const validation = validateData(createOrderSchema, body);
        if (!validation.success || !validation.data) {
            throw new ValidationError('Validation failed');
        }

        const { items, shipping_address, billing_address, customer_notes, customer_email } = validation.data;
        const orderEmail = isGuest ? customer_email : user?.email;

        if (!orderEmail) {
            return NextResponse.json({ error: 'Customer email is required' }, { status: 400, headers: corsHeaders });
        }

        // Use transaction for atomic operations
        const result = await prisma.$transaction(async (tx) => {
            // 1. Fetch Products
            const productIds = items.map((item: any) => item.product_id);
            const products = await tx.product.findMany({
                where: { id: { in: productIds } }
            });

            if (products.length !== items.length) {
                throw new Error('One or more products not found');
            }

            // 2. Calculate Totals & Check Stock
            const orderItemsData = [];
            let subtotal = 0;

            for (const item of items) {
                const product = products.find(p => p.id === item.product_id)!;

                if (!product.isActive) {
                    throw new Error(`Product ${product.name} is not available`);
                }

                if (product.totalStock < item.quantity) {
                    throw new Error(`Insufficient stock for ${product.name}`);
                }

                // Calculate price
                let unitPrice = Number(product.basePrice);
                let discountPercentage = 0;

                // Wholesale Logic
                if (user?.role === 'WHOLESALE' && user.wholesaleTier) {
                    // Assuming tier1Discount is Decimal
                    if (user.wholesaleTier === 'TIER1') discountPercentage = Number(product.tier1Discount);
                    if (user.wholesaleTier === 'TIER2') discountPercentage = Number(product.tier2Discount);
                    if (user.wholesaleTier === 'TIER3') discountPercentage = Number(product.tier3Discount);

                    unitPrice = unitPrice * (1 - discountPercentage / 100);
                }

                const itemSubtotal = unitPrice * item.quantity;
                subtotal += itemSubtotal;

                // Decrement Stock
                await tx.product.update({
                    where: { id: product.id },
                    data: { totalStock: { decrement: item.quantity } }
                });

                orderItemsData.push({
                    productId: product.id,
                    productName: product.name,
                    productSku: product.sku,
                    productImage: product.thumbnail || product.images[0],
                    unitPrice: new Prisma.Decimal(unitPrice),
                    discountPercent: new Prisma.Decimal(discountPercentage),
                    quantity: item.quantity,
                    subtotal: new Prisma.Decimal(itemSubtotal)
                });
            }

            const taxRate = 0.07;
            const taxAmount = subtotal * taxRate;
            const shippingCost = subtotal >= 50 ? 0 : 9.99;
            const totalAmount = subtotal + taxAmount + shippingCost;

            // Generate Order Number
            const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

            // 3. Create Order
            const order = await tx.order.create({
                data: {
                    orderNumber,
                    userId: user?.id || null,
                    customerName: shipping_address.full_name,
                    customerEmail: orderEmail,
                    customerPhone: shipping_address.phone || user?.phone,
                    subtotal: new Prisma.Decimal(subtotal),
                    discountAmount: new Prisma.Decimal(0), // Calculate logic if needed
                    taxAmount: new Prisma.Decimal(taxAmount),
                    shippingCost: new Prisma.Decimal(shippingCost),
                    totalAmount: new Prisma.Decimal(totalAmount),
                    isWholesale: user?.role === 'WHOLESALE',
                    wholesaleTier: user?.wholesaleTier || null,
                    shippingAddress: shipping_address,
                    billingAddress: billing_address || shipping_address,
                    customerNotes: customer_notes,
                    status: 'PENDING',
                    paymentStatus: 'PENDING',
                    orderItems: {
                        create: orderItemsData
                    }
                }
            });

            // 4. Clear Cart
            if (user) {
                await tx.cartItem.deleteMany({
                    where: {
                        userId: user.id,
                        productId: { in: productIds }
                    }
                });
            }

            return order;
        });

        // Response
        return NextResponse.json({
            message: 'Order created successfully',
            data: {
                order_id: result.id,
                order_number: result.orderNumber,
                total_amount: result.totalAmount
            }
        }, { status: 201, headers: corsHeaders });

    } catch (error: any) {
        console.error("Create Order Error", error);
        // Clean error message for user
        const message = error.message || 'Failed to create order';
        return NextResponse.json(
            { error: message },
            { status: 400, headers: corsHeaders }
        );
    }
}
