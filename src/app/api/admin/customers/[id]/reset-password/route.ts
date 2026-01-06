// app/api/admin/customers/[id]/reset-password/route.ts
// Admin Customers API - Reset customer password

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

// POST /api/admin/customers/[id]/reset-password - Send password reset email
export async function POST(
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

        // Get customer email
        const { data: { user: customer } } = await supabase.auth.admin.getUserById(id)

        if (!customer || !customer.email) {
            return NextResponse.json(
                { error: 'Customer not found or email not available' },
                { status: 404 }
            )
        }

        // Send password reset email
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(customer.email, {
            redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
        })

        if (resetError) {
            console.error('Failed to send password reset email:', resetError)
            throw new Error('Failed to send password reset email')
        }

        return NextResponse.json({
            success: true,
            message: `Password reset email sent to ${customer.email}`,
        })

    } catch (error) {
        return errorResponse(error)
    }
}
