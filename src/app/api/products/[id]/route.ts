// app/api/products/[id]/route.ts
// Products API - Get, Update, Delete single product

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
    errorResponse,
    NotFoundError,
    UnauthorizedError,
    ForbiddenError,
} from '@/utils/errors'
import {
    productSchema,
    validateData,
    formatValidationErrors,
} from '@/utils/validation'

// GET /api/products/[id] - Get single product
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient()

        // ✅ Next 15: resolve params
        const { id } = await params

        // Fetch product with category
        const { data: product, error } = await (supabase
            .from('products') as any)
            .select('*, category:categories(id, name, slug)')
            .eq('id', id)
            .single()

        if (error || !product) {
            throw new NotFoundError('Product')
        }

        // Check if product is active (unless user is admin)
        const {
            data: { user },
        } = await supabase.auth.getUser()
        let isAdmin = false

        if (user) {
            const { data: profile } = await (supabase
                .from('profiles') as any)
                .select('role')
                .eq('id', user.id)
                .single()

            isAdmin = profile?.role === 'admin'
        }

        if (!product.is_active && !isAdmin) {
            throw new NotFoundError('Product')
        }

        // Get user profile for pricing
        let userProfile: { role: string; wholesale_tier: string | null } | null =
            null

        if (user) {
            const { data: profile } = await (supabase
                .from('profiles') as any)
                .select('role, wholesale_tier')
                .eq('id', user.id)
                .single()

            userProfile = profile
        }

        // Calculate pricing
        let displayPrice: number = product.base_price
        let discountPercentage = 0

        if (userProfile?.role === 'wholesale') {
            switch (userProfile.wholesale_tier) {
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
            displayPrice = product.base_price * (1 - discountPercentage / 100)
        }

        // Get inventory across all stores
        const { data: inventory } = await (supabase
            .from('inventory') as any)
            .select('store_id, quantity, stores(name, city, state)')
            .eq('product_id', id)

        return NextResponse.json({
            data: {
                ...product,
                displayPrice: Number(displayPrice.toFixed(2)),
                discountPercentage,
                originalPrice: product.base_price,
                isWholesale: userProfile?.role === 'wholesale',
                inventory: inventory || [],
            },
        })
    } catch (error) {
        return errorResponse(error)
    }
}

// PUT /api/products/[id] - Update product (Admin only)
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient()

        // ✅ resolve params
        const { id } = await params

        // Check authentication and admin role
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser()
        if (authError || !user) {
            throw new UnauthorizedError()
        }

        const { data: profile } = await (supabase
            .from('profiles') as any)
            .select('role')
            .eq('id', user.id)
            .single()

        if (!profile || profile.role !== 'admin') {
            throw new ForbiddenError('Only admins can update products')
        }

        // Parse and validate request body
        const body = await request.json()
        const validation = validateData(productSchema.partial(), body)

        if (!validation.success) {
            return NextResponse.json(
                {
                    error: 'Validation failed',
                    errors: formatValidationErrors(validation.errors!),
                },
                { status: 400 }
            )
        }

        // Update product
        const { data: product, error: updateError } = await (supabase
            .from('products') as any)
            .update(validation.data)
            .eq('id', id)
            .select()
            .single()

        if (updateError || !product) {
            throw new NotFoundError('Product')
        }

        return NextResponse.json({ data: product })
    } catch (error) {
        return errorResponse(error)
    }
}

// DELETE /api/products/[id] - Delete product (Admin only)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient()

        // ✅ resolve params
        const { id } = await params

        // Check authentication and admin role
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser()
        if (authError || !user) {
            throw new UnauthorizedError()
        }

        const { data: profile } = await (supabase
            .from('profiles') as any)
            .select('role')
            .eq('id', user.id)
            .single()

        if (!profile || profile.role !== 'admin') {
            throw new ForbiddenError('Only admins can delete products')
        }

        // Soft delete (set is_active to false)
        const { error: deleteError } = await (supabase
            .from('products') as any)
            .update({ is_active: false })
            .eq('id', id)

        if (deleteError) {
            throw new NotFoundError('Product')
        }

        return NextResponse.json({ message: 'Product deleted successfully' })
    } catch (error) {
        return errorResponse(error)
    }
}
