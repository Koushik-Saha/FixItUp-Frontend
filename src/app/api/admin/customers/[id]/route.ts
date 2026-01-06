// app/api/admin/customers/[id]/route.ts
// Admin Customers API - Get and Update single customer

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

// GET /api/admin/customers/[id] - Get single customer profile
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

        // Get customer profile
        const { data: profile, error } = await (supabase
            .from('profiles') as any)
            .select('*')
            .eq('id', id)
            .single()

        if (error || !profile) {
            return NextResponse.json(
                { error: 'Customer not found' },
                { status: 404 }
            )
        }

        // Get email from auth.users
        try {
            const { data: { user: authUser } } = await supabase.auth.admin.getUserById(id)
            profile.email = authUser?.email || null
        } catch (err) {
            profile.email = null
        }

        // Get customer statistics
        const [ordersResult, repairsResult] = await Promise.all([
            (supabase.from('orders') as any).select('id, total_amount', { count: 'exact' }).eq('user_id', id),
            (supabase.from('repair_tickets') as any).select('id', { count: 'exact' }).eq('customer_id', id),
        ])

        const totalSpent = ordersResult.data?.reduce((sum: number, order: any) => sum + (order.total_amount || 0), 0) || 0

        return NextResponse.json({
            data: {
                ...profile,
                stats: {
                    total_orders: ordersResult.count || 0,
                    total_spent: totalSpent,
                    total_repairs: repairsResult.count || 0,
                },
            },
        })

    } catch (error) {
        return errorResponse(error)
    }
}

// PUT /api/admin/customers/[id] - Update customer
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

        // Check if customer exists
        const { data: existingCustomer } = await (supabase
            .from('profiles') as any)
            .select('id')
            .eq('id', id)
            .single()

        if (!existingCustomer) {
            return NextResponse.json(
                { error: 'Customer not found' },
                { status: 404 }
            )
        }

        // Prepare update data
        const updateData: any = {}

        if (body.full_name !== undefined) updateData.full_name = body.full_name
        if (body.phone !== undefined) updateData.phone = body.phone
        if (body.role !== undefined) updateData.role = body.role
        if (body.wholesale_tier !== undefined) updateData.wholesale_tier = body.wholesale_tier
        if (body.wholesale_status !== undefined) updateData.wholesale_status = body.wholesale_status

        updateData.updated_at = new Date().toISOString()

        // Update profile
        const { data: updatedProfile, error: updateError } = await (supabase
            .from('profiles') as any)
            .update(updateData)
            .eq('id', id)
            .select()
            .single()

        if (updateError) {
            console.error('Failed to update customer:', updateError)
            throw new Error('Failed to update customer')
        }

        // Update email in auth.users if provided
        if (body.email) {
            try {
                await supabase.auth.admin.updateUserById(id, {
                    email: body.email,
                })
            } catch (err) {
                console.error('Failed to update email:', err)
                // Continue even if email update fails
            }
        }

        return NextResponse.json({
            message: 'Customer updated successfully',
            data: updatedProfile,
        })

    } catch (error) {
        return errorResponse(error)
    }
}
