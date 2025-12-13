// app/api/inventory/[storeId]/route.ts
// Get inventory for specific store

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { errorResponse, UnauthorizedError, ForbiddenError } from '@/lib/utils/errors'

// GET /api/inventory/[storeId] - Get inventory for specific store
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ storeId: string }> }
) {
    try {
        const supabase = await createClient()
        const params = await context.params

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            throw new UnauthorizedError()
        }

        // Check if user is admin
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (!profile || (profile as any).role !== 'admin') {
            throw new ForbiddenError('Only admins can access inventory')
        }

        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status') // low_stock, out_of_stock, all

        // Get inventory for specific store
        const { data: inventory, error } = await supabase
            .from('inventory')
            .select(`
        id,
        quantity,
        reserved_quantity,
        last_restocked_at,
        product_id,
        store_id,
        products(id, name, sku, base_price, low_stock_threshold, is_active),
        stores(id, name, city, state)
      `)
            .eq('store_id', params.storeId)

        if (error) {
            console.error('Failed to fetch inventory:', error)
            throw new Error('Failed to fetch inventory')
        }

        // Filter by status
        let filteredInventory = inventory || []

        if (status === 'low_stock') {
            filteredInventory = filteredInventory.filter(item => {
                const product = (item as any).products as any
                return (item as any).quantity > 0 && (item as any).quantity <= (product?.low_stock_threshold || 10)
            })
        } else if (status === 'out_of_stock') {
            filteredInventory = filteredInventory.filter(item => (item as any).quantity === 0)
        }

        // Calculate stats
        const totalItems = filteredInventory.length
        const lowStockItems = filteredInventory.filter(item => {
            const product = (item as any).products as any
            return (item as any).quantity > 0 && (item as any).quantity <= (product?.low_stock_threshold || 10)
        }).length
        const outOfStockItems = filteredInventory.filter(item => (item as any).quantity === 0).length
        const totalValue = filteredInventory.reduce((sum, item) => {
            const product = (item as any).products as any
            return sum + ((item as any).quantity * (product?.base_price || 0))
        }, 0)

        // Get store info
        const { data: store } = await supabase
            .from('stores')
            .select('*')
            .eq('id', params.storeId)
            .single()

        return NextResponse.json({
            data: {
                store,
                inventory: filteredInventory,
                stats: {
                    total_items: totalItems,
                    low_stock: lowStockItems,
                    out_of_stock: outOfStockItems,
                    total_value: Number(totalValue.toFixed(2)),
                },
            },
        })

    } catch (error) {
        return errorResponse(error)
    }
}

// PUT /api/inventory/[storeId] - Update inventory for store
export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ storeId: string }> }
) {
    try {
        const supabase = await createClient()
        const params = await context.params

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            throw new UnauthorizedError()
        }

        // Check if user is admin
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (!profile || (profile as any).role !== 'admin') {
            throw new ForbiddenError('Only admins can update inventory')
        }

        const body = await request.json()
        const { product_id, quantity, action } = body

        if (!product_id) {
            return NextResponse.json(
                { error: 'product_id is required' },
                { status: 400 }
            )
        }

        // Get current inventory
        const { data: currentInventory, error: fetchError } = await supabase
            .from('inventory')
            .select('quantity')
            .eq('product_id', product_id)
            .eq('store_id', params.storeId)
            .single()

        if (fetchError || !currentInventory) {
            return NextResponse.json(
                { error: 'Inventory not found for this store' },
                { status: 404 }
            )
        }

        let newQuantity = quantity

        if (action === 'add') {
            newQuantity = (currentInventory as any).quantity + quantity
        } else if (action === 'subtract') {
            newQuantity = Math.max(0, (currentInventory as any).quantity - quantity)
        }

        // Update inventory
        const { data: updated, error: updateError } = await (supabase as any)
            .from('inventory')
            .update({
                quantity: newQuantity,
                last_restocked_at: action === 'add' ? new Date().toISOString() : undefined,
            })
            .eq('product_id', product_id)
            .eq('store_id', params.storeId)
            .select()
            .single()

        if (updateError) {
            throw new Error('Failed to update inventory')
        }

        return NextResponse.json({
            message: 'Inventory updated successfully',
            data: updated,
        })

    } catch (error) {
        return errorResponse(error)
    }
}
