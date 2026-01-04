// app/api/orders/reorder/route.ts
// Quick reorder - Add all items from a previous order to cart

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            )
        }

        // Parse request body
        const body = await request.json()
        const { order_id } = body

        if (!order_id) {
            return NextResponse.json(
                { error: 'Order ID is required' },
                { status: 400 }
            )
        }

        // Verify order belongs to user
        const { data: order, error: orderError } = await (supabase
            .from('orders') as any)
            .select('id, user_id')
            .eq('id', order_id)
            .single()

        if (orderError || !order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            )
        }

        if (order.user_id !== user.id) {
            return NextResponse.json(
                { error: 'Unauthorized to reorder this order' },
                { status: 403 }
            )
        }

        // Get order items
        const { data: orderItems, error: itemsError } = await (supabase
            .from('order_items') as any)
            .select('product_id, quantity')
            .eq('order_id', order_id)

        if (itemsError || !orderItems || orderItems.length === 0) {
            return NextResponse.json(
                { error: 'No items found in order' },
                { status: 404 }
            )
        }

        // Get product IDs
        const productIds = orderItems.map((item: any) => item.product_id)

        // Verify products still exist and are active
        const { data: products, error: productsError } = await (supabase
            .from('products') as any)
            .select('id, name, total_stock, is_active')
            .in('id', productIds)

        if (productsError) {
            return NextResponse.json(
                { error: 'Failed to verify products' },
                { status: 500 }
            )
        }

        // Check which products are available
        const availableProducts = new Map<string, any>(
            products
                .filter((p: any) => p.is_active && p.total_stock > 0)
                .map((p: any) => [p.id, p])
        )

        const unavailableProducts: any[] = []
        const itemsToAdd: any[] = []

        orderItems.forEach((item: any) => {
            const product = availableProducts.get(item.product_id) as any

            if (!product) {
                const originalProduct = products.find((p: any) => p.id === item.product_id)
                unavailableProducts.push({
                    product_id: item.product_id,
                    name: originalProduct?.name || 'Unknown Product',
                    reason: originalProduct?.is_active === false
                        ? 'Product no longer available'
                        : 'Out of stock'
                })
            } else {
                // Limit quantity to available stock
                const quantity = Math.min(item.quantity, product.total_stock)
                itemsToAdd.push({
                    product_id: item.product_id,
                    quantity
                })
            }
        })

        // Add available items to cart
        let addedCount = 0
        const errors: any[] = []

        for (const item of itemsToAdd) {
            try {
                // Check if item already in cart
                const { data: existingItem } = await (supabase
                    .from('cart_items') as any)
                    .select('id, quantity')
                    .eq('user_id', user.id)
                    .eq('product_id', item.product_id)
                    .single()

                if (existingItem) {
                    // Update quantity
                    const product = availableProducts.get(item.product_id)
                    const newQuantity = Math.min(
                        existingItem.quantity + item.quantity,
                        product.total_stock
                    )

                    await (supabase
                        .from('cart_items') as any)
                        .update({
                            quantity: newQuantity,
                            updated_at: new Date().toISOString()
                        })
                        .eq('id', existingItem.id)

                    addedCount++
                } else {
                    // Add new item
                    const { error } = await (supabase
                        .from('cart_items') as any)
                        .insert({
                            user_id: user.id,
                            product_id: item.product_id,
                            quantity: item.quantity
                        })

                    if (!error) {
                        addedCount++
                    } else {
                        errors.push({
                            product_id: item.product_id,
                            error: error.message
                        })
                    }
                }
            } catch (err) {
                errors.push({
                    product_id: item.product_id,
                    error: 'Failed to add to cart'
                })
            }
        }

        return NextResponse.json({
            success: true,
            message: `Successfully added ${addedCount} item(s) to cart`,
            data: {
                added_count: addedCount,
                total_items: orderItems.length,
                unavailable_products: unavailableProducts,
                errors: errors.length > 0 ? errors : undefined
            }
        })

    } catch (error) {
        console.error('Reorder API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
