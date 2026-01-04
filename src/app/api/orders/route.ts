// app/api/orders/route.ts
// Orders API - List and Create orders

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { errorResponse, UnauthorizedError, ValidationError } from '@/lib/utils/errors'
import { createOrderSchema, validateData, formatValidationErrors } from '@/utils/validation'

// GET /api/orders - List user's orders
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { searchParams } = new URL(request.url)

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            throw new UnauthorizedError('Please login to view orders')
        }

        // Get query parameters
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const status = searchParams.get('status')

        // Calculate pagination
        const from = (page - 1) * limit
        const to = from + limit - 1

        // Check if user is admin
        const { data: profile } = await (supabase
            .from('profiles') as any)
            .select('role')
            .eq('id', user.id)
            .single()

        const isAdmin = ((profile as any))?.role === 'admin'

        // Build query
        let query = (supabase
            .from('orders') as any)
            .select('*', { count: 'exact' })

        // Admins see all orders, users see only their own
        if (!isAdmin) {
            query = query.eq('user_id', user.id)
        }

        // Apply status filter
        if (status) {
            query = query.eq('status', status)
        }

        // Apply sorting and pagination
        query = query
            .order('created_at', { ascending: false })
            .range(from, to)

        const { data: orders, error, count } = await query

        if (error) {
            console.error('Failed to fetch orders:', error)
            throw new Error('Failed to fetch orders')
        }

        return NextResponse.json({
            data: orders,
            pagination: {
                page,
                limit,
                total: count || 0,
                totalPages: Math.ceil((count || 0) / limit),
            },
        })

    } catch (error) {
        return errorResponse(error)
    }
}

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()

        // Parse request body first
        const body = await request.json()

        // Get authenticated user (optional for guest checkout)
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        const isGuest = !user || authError

        // Guest checkout requires reCAPTCHA verification
        if (isGuest) {
            const recaptchaToken = body.recaptcha_token

            if (!recaptchaToken) {
                return NextResponse.json(
                    { error: 'reCAPTCHA verification required for guest checkout' },
                    { status: 400 }
                )
            }

            // Verify reCAPTCHA token
            const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY
            if (!recaptchaSecret) {
                console.error('RECAPTCHA_SECRET_KEY not configured')
                return NextResponse.json(
                    { error: 'Server configuration error' },
                    { status: 500 }
                )
            }

            const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `secret=${recaptchaSecret}&response=${recaptchaToken}`,
            })

            const recaptchaResult = await recaptchaResponse.json()

            if (!recaptchaResult.success) {
                return NextResponse.json(
                    { error: 'reCAPTCHA verification failed. Please try again.' },
                    { status: 400 }
                )
            }
        }

        // Get user profile (for authenticated users)
        let profile = null
        if (user) {
            const { data } = await (supabase
                .from('profiles') as any)
                .select('role, wholesale_tier, full_name, phone')
                .eq('id', user.id)
                .single()
            profile = data
        }

        // Validate request
        const validation = validateData(createOrderSchema, body)

        if (!validation.success || !validation.data) {
            throw new ValidationError(
                'Validation failed'
            )
        }

        const { items, shipping_address, billing_address, customer_notes, customer_email } = validation.data

        // Determine customer email
        const orderEmail = isGuest
            ? customer_email
            : user!.email!

        if (!orderEmail) {
            return NextResponse.json(
                { error: 'Customer email is required' },
                { status: 400 }
            )
        }

        // Fetch all products in order
        const productIds = items.map(item => item.product_id)
        const { data: products, error: productsError } = await (supabase
            .from('products') as any)
            .select('id, sku, name, slug, base_price, wholesale_tier1_discount, wholesale_tier2_discount, wholesale_tier3_discount, images, thumbnail, total_stock, is_active')
            .in('id', productIds)

        if (productsError || !products || products.length !== items.length) {
            return NextResponse.json(
                { error: 'One or more products not found' },
                { status: 400 }
            )
        }

        // Check stock and calculate pricing
        const orderItems = []
        let subtotal = 0

        for (const item of items) {
            const product = products.find((p: any) => p.id === item.product_id)

            if (!product) {
                return NextResponse.json(
                    { error: `Product ${item.product_id} not found` },
                    { status: 400 }
                )
            }

            if (!product.is_active) {
                return NextResponse.json(
                    { error: `Product ${product.name} is not available` },
                    { status: 400 }
                )
            }

            if (product.total_stock < item.quantity) {
                return NextResponse.json(
                    {
                        error: `Insufficient stock for ${product.name}`,
                        available: product.total_stock,
                        requested: item.quantity,
                    },
                    { status: 400 }
                )
            }

            // Calculate price with wholesale discount
            let unitPrice = product.base_price
            let discountPercentage = 0

            if (((profile as any))?.role === 'wholesale') {
                switch (profile.wholesale_tier) {
                    case 'tier1':
                        discountPercentage = product.wholesale_tier1_discount
                        break
                    case 'tier2':
                        discountPercentage = product.wholesale_tier2_discount
                        break
                    case 'tier3':
                        discountPercentage = product.wholesale_tier3_discount
                        break
                }
                unitPrice = product.base_price * (1 - discountPercentage / 100)
            }

            const itemSubtotal = unitPrice * item.quantity
            subtotal += itemSubtotal

            orderItems.push({
                product_id: product.id,
                product_name: product.name,
                product_sku: product.sku,
                product_image: product.thumbnail || product.images?.[0],
                unit_price: Number(unitPrice.toFixed(2)),
                discount_percentage: discountPercentage,
                quantity: item.quantity,
                subtotal: Number(itemSubtotal.toFixed(2)),
            })
        }

        // Calculate totals
        const discountAmount = orderItems.reduce((sum, item) => {
            const originalPrice = products.find((p: any) => p.id === item.product_id)?.base_price || 0
            return sum + ((originalPrice - item.unit_price) * item.quantity)
        }, 0)

        // Simple tax calculation (7% - adjust based on your needs)
        const taxRate = 0.07
        const taxAmount = subtotal * taxRate

        // Shipping cost (free over $50, otherwise $9.99)
        const shippingCost = subtotal >= 50 ? 0 : 9.99

        const totalAmount = subtotal + taxAmount + shippingCost

        // Generate order number
        const { data: orderNumberData } = await (supabase as any).rpc('generate_order_number')
        const orderNumber = orderNumberData || `ORD-${Date.now()}`

        // Create order
        const { data: order, error: orderError } = await (supabase
            .from('orders') as any)
            .insert({
                order_number: orderNumber,
                user_id: user?.id || null,
                customer_name: shipping_address.full_name,
                customer_email: orderEmail,
                customer_phone: shipping_address.phone || ((profile as any))?.phone,
                subtotal: Number(subtotal.toFixed(2)),
                discount_amount: Number(discountAmount.toFixed(2)),
                tax_amount: Number(taxAmount.toFixed(2)),
                shipping_cost: shippingCost,
                total_amount: Number(totalAmount.toFixed(2)),
                is_wholesale: ((profile as any))?.role === 'wholesale',
                wholesale_tier: ((profile as any))?.wholesale_tier,
                is_guest: isGuest,
                shipping_address,
                billing_address: billing_address || shipping_address,
                customer_notes,
                status: 'pending',
                payment_status: 'pending',
            })
            .select()
            .single()

        if (orderError) {
            console.error('Failed to create order:', orderError)
            throw new Error('Failed to create order')
        }

        // Create order items
        const orderItemsWithOrderId = orderItems.map(item => ({
            ...item,
            order_id: order.id,
        }))

        const { error: itemsError } = await (supabase
            .from('order_items') as any)
            .insert(orderItemsWithOrderId)

        if (itemsError) {
            console.error('Failed to create order items:', itemsError)
            // Rollback order
            await ((supabase as any).from('orders') as any).delete().eq('id', order.id)
            throw new Error('Failed to create order items')
        }

        // Clear cart items for this order (only for authenticated users)
        if (user) {
            await (supabase
                .from('cart_items') as any)
                .delete()
                .eq('user_id', user.id)
                .in('product_id', productIds)
        }

        // TODO: In production, integrate with payment processor (Stripe)
        // const paymentIntent = await stripe.paymentIntents.create({...})

        return NextResponse.json(
            {
                message: 'Order created successfully',
                data: {
                    order_id: order.id,
                    order_number: order.order_number,
                    total_amount: order.total_amount,
                    // In production, return payment client_secret here
                    // client_secret: paymentIntent.client_secret,
                },
            },
            { status: 201 }
        )

    } catch (error) {
        return errorResponse(error)
    }
}
