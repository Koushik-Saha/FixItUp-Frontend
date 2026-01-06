// app/api/admin/customers/[id]/block/route.ts
// Admin Customers API - Block/Unblock customer

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

// POST /api/admin/customers/[id]/block - Block or unblock customer
export async function POST(
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

        const { blocked } = body

        if (typeof blocked !== 'boolean') {
            return NextResponse.json(
                { error: 'Blocked status must be a boolean' },
                { status: 400 }
            )
        }

        // Check if customer exists
        const { data: existingCustomer } = await (supabase
            .from('profiles') as any)
            .select('id, role')
            .eq('id', id)
            .single()

        if (!existingCustomer) {
            return NextResponse.json(
                { error: 'Customer not found' },
                { status: 404 }
            )
        }

        // Don't allow blocking admins
        if (existingCustomer.role === 'admin') {
            return NextResponse.json(
                { error: 'Cannot block admin users' },
                { status: 400 }
            )
        }

        // Block/unblock user in auth.users
        try {
            if (blocked) {
                await supabase.auth.admin.updateUserById(id, {
                    ban_duration: '876000h', // ~100 years
                })
            } else {
                await supabase.auth.admin.updateUserById(id, {
                    ban_duration: 'none',
                })
            }
        } catch (err: any) {
            console.error('Failed to block/unblock user:', err)
            throw new Error(`Failed to ${blocked ? 'block' : 'unblock'} user`)
        }

        return NextResponse.json({
            success: true,
            message: `Customer ${blocked ? 'blocked' : 'unblocked'} successfully`,
        })

    } catch (error) {
        return errorResponse(error)
    }
}
