// app/api/cart/route.ts
// Cart API - Get and Add to cart

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { errorResponse, UnauthorizedError } from '@/lib/utils/errors'
import { z } from 'zod'

// Validation schema
const addToCartSchema = z.object({
    product_id: z.string().uuid(),
    quantity: z.number().int().positive().min(1).max(100),
})

// GET /api/cart - Get user's cart
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            throw new UnauthorizedError('Please login to view cart')
        }

        // Get user's cart items with product details
        const { data: cartItems, error } = await supabase
            .from('cart_items')
            .select(`
        id,
        product_id,
        quantity,
        created_at,
        products (
          id,
          sku,
          name,
          slug,
          brand,
          device_model,
          base_price,
          wholesale_tier1_discount,
          wholesale_tier2_discount,
          wholesale_tier3_discount,
          images,
          thumbnail,
          total_stock,
          is_active
        )
      `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Failed to fetch cart:', error)
            throw new Error('Failed to fetch cart')
        }

        // Get user profile for pricing
        const { data: profile } = await (supabase
            .from('profiles') as any)
            .select('role, wholesale_tier')
            .eq('id', user.id)
            .single()

        // Calculate prices for each item
        const cartWithPricing = (cartItems as any[]).map((item: any) => {
            const product = item.products as any

            if (!product) {
                return null
            }

            let unitPrice = product.base_price
            let discountPercentage = 0

            // Apply wholesale discount
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

            const subtotal = unitPrice * item.quantity

            return {
                id: item.id,
                product_id: item.product_id,
                quantity: item.quantity,
                product: {
                    id: product.id,
                    sku: product.sku,
                    name: product.name,
                    slug: product.slug,
                    brand: product.brand,
                    device_model: product.device_model,
                    image: product.thumbnail || product.images?.[0],
                    in_stock: product.total_stock > 0,
                    available_quantity: product.total_stock,
                },
                pricing: {
                    unit_price: Number(unitPrice.toFixed(2)),
                    original_price: product.base_price,
                    discount_percentage: discountPercentage,
                    subtotal: Number(subtotal.toFixed(2)),
                },
            }
        }).filter(Boolean) // Remove null items (deleted products)

        // Calculate cart totals
        const subtotal = cartWithPricing.reduce((sum, item) => sum + (item?.pricing.subtotal || 0), 0)
        const totalItems = cartWithPricing.reduce((sum, item) => sum + (item?.quantity || 0), 0)
        const totalSavings = cartWithPricing.reduce((sum, item) => {
            const savings = ((item?.pricing.original_price || 0) - (item?.pricing.unit_price || 0)) * (item?.quantity || 0)
            return sum + savings
        }, 0)

        return NextResponse.json({
            data: {
                items: cartWithPricing,
                summary: {
                    subtotal: Number(subtotal.toFixed(2)),
                    total_items: totalItems,
                    total_savings: Number(totalSavings.toFixed(2)),
                    is_wholesale: ((profile as any))?.role === 'wholesale',
                    wholesale_tier: ((profile as any))?.wholesale_tier,
                },
            },
        })

    } catch (error) {
        return errorResponse(error)
    }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            throw new UnauthorizedError('Please login to add items to cart')
        }

        // Parse and validate request
        const body = await request.json()
        const validation = addToCartSchema.safeParse(body)

        if (!validation.success) {
            return NextResponse.json(
                {
                    error: 'Invalid request',
                    details: validation.error.flatten().fieldErrors,
                },
                { status: 400 }
            )
        }

        const { product_id, quantity } = validation.data

        // Check if product exists and is active
        const { data: product, error: productError } = await (supabase
            .from('products') as any)
            .select('id, name, total_stock, is_active')
            .eq('id', product_id)
            .single()

        if (productError || !product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            )
        }

        if (!product.is_active) {
            return NextResponse.json(
                { error: 'Product is not available' },
                { status: 400 }
            )
        }

        // Check stock availability
        if (product.total_stock < quantity) {
            return NextResponse.json(
                {
                    error: 'Insufficient stock',
                    available: product.total_stock,
                },
                { status: 400 }
            )
        }

        // Check if item already in cart
        const { data: existingItem } = await (supabase
            .from('cart_items') as any)
            .select('id, quantity')
            .eq('user_id', user.id)
            .eq('product_id', product_id)
            .single()

        if (existingItem) {
            // Update quantity
            const newQuantity = existingItem.quantity + quantity

            if (product.total_stock < newQuantity) {
                return NextResponse.json(
                    {
                        error: 'Cannot add more items. Maximum available quantity reached.',
                        available: product.total_stock,
                        current_in_cart: existingItem.quantity,
                    },
                    { status: 400 }
                )
            }

            const { data: updated, error: updateError } = await (supabase
                .from('cart_items') as any)
                .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
                .eq('id', existingItem.id)
                .select()
                .single()

            if (updateError) {
                console.error('Failed to update cart:', updateError)
                throw new Error('Failed to update cart')
            }

            return NextResponse.json({
                message: 'Cart updated successfully',
                data: updated,
            })
        }

        // Add new item to cart
        const { data: newItem, error: insertError } = await (supabase
            .from('cart_items') as any)
            .insert({
                user_id: user.id,
                product_id,
                quantity,
            })
            .select()
            .single()

        if (insertError) {
            console.error('Failed to add to cart:', insertError)
            throw new Error('Failed to add to cart')
        }

        return NextResponse.json(
            {
                message: 'Item added to cart successfully',
                data: newItem,
            },
            { status: 201 }
        )

    } catch (error) {
        return errorResponse(error)
    }
}
