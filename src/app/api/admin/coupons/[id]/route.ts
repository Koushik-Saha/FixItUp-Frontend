// app/api/admin/coupons/[id]/route.ts
// Admin Coupons API - Get, Update, Delete single coupon

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { errorResponse, UnauthorizedError } from '@/lib/utils/errors'
import { handleCorsPreflightRequest, getCorsHeaders } from '@/lib/cors'

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

// OPTIONS /api/admin/coupons/[id] - Handle preflight request
export async function OPTIONS(request: NextRequest) {
    return handleCorsPreflightRequest(request)
}

// GET /api/admin/coupons/[id] - Get single coupon
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const origin = request.headers.get('origin')
        const supabase = await createClient()
        const { id } = await params

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            throw new UnauthorizedError('Please login to access this resource')
        }

        // Check admin role
        await checkAdmin(supabase, user.id)

        // Get coupon
        const { data: coupon, error } = await (supabase
            .from('coupons') as any)
            .select('*')
            .eq('id', id)
            .single()

        if (error || !coupon) {
            return NextResponse.json(
                { error: 'Coupon not found' },
                { status: 404, headers: getCorsHeaders(origin) }
            )
        }

        // Get usage stats
        const { count: usageCount } = await (supabase
            .from('coupon_usage') as any)
            .select('*', { count: 'exact', head: true })
            .eq('coupon_id', id)

        return NextResponse.json({
            data: {
                ...coupon,
                usage_count: usageCount || 0,
            },
        }, {
            headers: getCorsHeaders(origin)
        })

    } catch (error) {
        const errorRes = errorResponse(error)
        const headers = new Headers(errorRes.headers)
        const origin = request.headers.get('origin')
        Object.entries(getCorsHeaders(origin)).forEach(([key, value]) => {
            headers.set(key, value)
        })
        return new NextResponse(errorRes.body, {
            status: errorRes.status,
            headers,
        })
    }
}

// PUT /api/admin/coupons/[id] - Update coupon
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const origin = request.headers.get('origin')
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

        // Check if coupon exists
        const { data: existingCoupon } = await (supabase
            .from('coupons') as any)
            .select('id')
            .eq('id', id)
            .single()

        if (!existingCoupon) {
            return NextResponse.json(
                { error: 'Coupon not found' },
                { status: 404, headers: getCorsHeaders(origin) }
            )
        }

        // If code is being updated, check for duplicates
        if (body.code) {
            const { data: duplicateCode } = await (supabase
                .from('coupons') as any)
                .select('id')
                .eq('code', body.code.toUpperCase())
                .neq('id', id)
                .single()

            if (duplicateCode) {
                return NextResponse.json(
                    { error: 'Another coupon with this code already exists' },
                    { status: 400, headers: getCorsHeaders(origin) }
                )
            }
        }

        // Prepare update data
        const updateData: any = { ...body }
        if (body.code) {
            updateData.code = body.code.toUpperCase()
        }
        updateData.updated_at = new Date().toISOString()

        // Update coupon
        const { data: coupon, error: updateError } = await (supabase
            .from('coupons') as any)
            .update(updateData)
            .eq('id', id)
            .select()
            .single()

        if (updateError) {
            console.error('Failed to update coupon:', updateError)
            throw new Error('Failed to update coupon')
        }

        return NextResponse.json({
            message: 'Coupon updated successfully',
            data: coupon,
        }, {
            headers: getCorsHeaders(origin)
        })

    } catch (error) {
        const errorRes = errorResponse(error)
        const headers = new Headers(errorRes.headers)
        const origin = request.headers.get('origin')
        Object.entries(getCorsHeaders(origin)).forEach(([key, value]) => {
            headers.set(key, value)
        })
        return new NextResponse(errorRes.body, {
            status: errorRes.status,
            headers,
        })
    }
}

// DELETE /api/admin/coupons/[id] - Delete coupon
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const origin = request.headers.get('origin')
        const supabase = await createClient()
        const { id } = await params

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            throw new UnauthorizedError('Please login to access this resource')
        }

        // Check admin role
        await checkAdmin(supabase, user.id)

        // Check if coupon exists
        const { data: existingCoupon } = await (supabase
            .from('coupons') as any)
            .select('id')
            .eq('id', id)
            .single()

        if (!existingCoupon) {
            return NextResponse.json(
                { error: 'Coupon not found' },
                { status: 404, headers: getCorsHeaders(origin) }
            )
        }

        // Check if coupon has been used
        const { count: usageCount } = await (supabase
            .from('coupon_usage') as any)
            .select('*', { count: 'exact', head: true })
            .eq('coupon_id', id)

        if (usageCount && usageCount > 0) {
            // If coupon has been used, just deactivate it instead of deleting
            const { error: updateError } = await (supabase
                .from('coupons') as any)
                .update({
                    is_active: false,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', id)

            if (updateError) {
                console.error('Failed to deactivate coupon:', updateError)
                throw new Error('Failed to deactivate coupon')
            }

            return NextResponse.json({
                success: true,
                message: 'Coupon has been deactivated (cannot delete used coupons)',
            }, {
                headers: getCorsHeaders(origin)
            })
        }

        // Delete coupon
        const { error: deleteError } = await (supabase
            .from('coupons') as any)
            .delete()
            .eq('id', id)

        if (deleteError) {
            console.error('Failed to delete coupon:', deleteError)
            throw new Error('Failed to delete coupon')
        }

        return NextResponse.json({
            success: true,
            message: 'Coupon deleted successfully',
        }, {
            headers: getCorsHeaders(origin)
        })

    } catch (error) {
        const errorRes = errorResponse(error)
        const headers = new Headers(errorRes.headers)
        const origin = request.headers.get('origin')
        Object.entries(getCorsHeaders(origin)).forEach(([key, value]) => {
            headers.set(key, value)
        })
        return new NextResponse(errorRes.body, {
            status: errorRes.status,
            headers,
        })
    }
}
