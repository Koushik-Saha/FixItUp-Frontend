// app/api/admin/products/[id]/route.ts
// Admin Products API - Get, Update, Delete single product

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { errorResponse, UnauthorizedError } from '@/lib/utils/errors'

// Helper to check if user is admin
async function checkAdmin(supabase: any, userId: string) {
    const { data: profile } = await (supabase
        .from('profiles') as any)
        .select('role')
        .eq('id', userId)
        .single()

    if (!profile || profile.role !== 'admin') {
        throw new UnauthorizedError('Admin access required')
    }
}

// GET /api/admin/products/[id] - Get single product
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient()
        const { id } = await params

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            throw new UnauthorizedError('Please login to access this resource')
        }

        // Check admin role
        await checkAdmin(supabase, user.id)

        // Get product
        const { data: product, error } = await (supabase
            .from('products') as any)
            .select('*, categories(id, name, slug)')
            .eq('id', id)
            .single()

        if (error || !product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({ data: product })

    } catch (error) {
        return errorResponse(error)
    }
}

// PUT /api/admin/products/[id] - Update product
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient()
        const { id } = await params
        const body = await request.json()

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            throw new UnauthorizedError('Please login to access this resource')
        }

        // Check admin role
        await checkAdmin(supabase, user.id)

        // Check if product exists
        const { data: existingProduct } = await (supabase
            .from('products') as any)
            .select('id')
            .eq('id', id)
            .single()

        if (!existingProduct) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            )
        }

        // If SKU is being updated, check for duplicates
        if (body.sku) {
            const { data: duplicateSKU } = await (supabase
                .from('products') as any)
                .select('id')
                .eq('sku', body.sku)
                .neq('id', id)
                .single()

            if (duplicateSKU) {
                return NextResponse.json(
                    { error: 'Another product with this SKU already exists' },
                    { status: 400 }
                )
            }
        }

        // Update product
        const { data: product, error: updateError } = await (supabase
            .from('products') as any)
            .update({
                ...body,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single()

        if (updateError) {
            console.error('Failed to update product:', updateError)
            throw new Error('Failed to update product')
        }

        return NextResponse.json({
            message: 'Product updated successfully',
            data: product,
        })

    } catch (error) {
        return errorResponse(error)
    }
}

// DELETE /api/admin/products/[id] - Delete product
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient()
        const { id } = await params

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            throw new UnauthorizedError('Please login to access this resource')
        }

        // Check admin role
        await checkAdmin(supabase, user.id)

        // Check if product exists
        const { data: existingProduct } = await (supabase
            .from('products') as any)
            .select('id')
            .eq('id', id)
            .single()

        if (!existingProduct) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            )
        }

        // Instead of deleting, we'll mark as inactive (soft delete)
        // This preserves order history and prevents broken references
        const { error: updateError } = await (supabase
            .from('products') as any)
            .update({
                is_active: false,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)

        if (updateError) {
            console.error('Failed to delete product:', updateError)
            throw new Error('Failed to delete product')
        }

        return NextResponse.json({
            success: true,
            message: 'Product deleted successfully',
        })

    } catch (error) {
        return errorResponse(error)
    }
}
