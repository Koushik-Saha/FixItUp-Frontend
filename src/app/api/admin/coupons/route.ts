// app/api/admin/coupons/route.ts
// Admin Coupons API - List and Create coupons

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

// OPTIONS /api/admin/coupons - Handle preflight request
export async function OPTIONS(request: NextRequest) {
    return handleCorsPreflightRequest(request)
}

// GET /api/admin/coupons - List coupons with filters
export async function GET(request: NextRequest) {
    try {
        const origin = request.headers.get('origin')
        const supabase = await createClient()
        const { searchParams } = new URL(request.url)

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            throw new UnauthorizedError('Please login to access this resource')
        }

        // Check admin role
        await checkAdmin(supabase, user.id)

        // Get query parameters
        const status = searchParams.get('status')
        const type = searchParams.get('type')
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '50')

        // Build query
        let query = (supabase
            .from('coupons') as any)
            .select('*', { count: 'exact' })

        // Apply type filter
        if (type) {
            query = query.eq('discount_type', type)
        }

        // Apply status filter
        const now = new Date().toISOString()
        if (status === 'active') {
            query = query
                .eq('is_active', true)
                .lte('start_date', now)
                .or(`end_date.is.null,end_date.gte.${now}`)
        } else if (status === 'inactive') {
            query = query.eq('is_active', false)
        } else if (status === 'expired') {
            query = query
                .eq('is_active', true)
                .lt('end_date', now)
        }

        // Apply sorting
        query = query.order('created_at', { ascending: false })

        // Apply pagination
        const from = (page - 1) * limit
        const to = from + limit - 1
        query = query.range(from, to)

        const { data: coupons, error, count } = await query

        if (error) {
            console.error('Failed to fetch coupons:', error)
            throw new Error('Failed to fetch coupons')
        }

        return NextResponse.json({
            data: coupons,
            pagination: {
                page,
                limit,
                total: count || 0,
                totalPages: Math.ceil((count || 0) / limit),
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

// POST /api/admin/coupons - Create new coupon
export async function POST(request: NextRequest) {
    try {
        const origin = request.headers.get('origin')
        const supabase = await createClient()
        const body = await request.json()

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            throw new UnauthorizedError('Please login to access this resource')
        }

        // Check admin role
        await checkAdmin(supabase, user.id)

        const {
            code,
            description,
            discount_type,
            discount_value,
            minimum_purchase,
            maximum_discount,
            max_uses,
            max_uses_per_user,
            applies_to,
            product_ids,
            category_ids,
            user_restrictions,
            start_date,
            end_date,
            is_active,
        } = body

        // Validate required fields
        if (!code || !discount_type || discount_value === undefined) {
            return NextResponse.json(
                { error: 'Missing required fields: code, discount_type, discount_value' },
                { status: 400, headers: getCorsHeaders(origin) }
            )
        }

        // Validate discount type
        if (!['percentage', 'fixed'].includes(discount_type)) {
            return NextResponse.json(
                { error: 'Discount type must be either "percentage" or "fixed"' },
                { status: 400, headers: getCorsHeaders(origin) }
            )
        }

        // Check if coupon code already exists
        const { data: existingCoupon } = await (supabase
            .from('coupons') as any)
            .select('id')
            .eq('code', code.toUpperCase())
            .single()

        if (existingCoupon) {
            return NextResponse.json(
                { error: 'Coupon code already exists' },
                { status: 400, headers: getCorsHeaders(origin) }
            )
        }

        // Create coupon
        const { data: coupon, error: createError } = await (supabase
            .from('coupons') as any)
            .insert({
                code: code.toUpperCase(),
                description,
                discount_type,
                discount_value,
                minimum_purchase: minimum_purchase || null,
                maximum_discount: maximum_discount || null,
                max_uses: max_uses || null,
                max_uses_per_user: max_uses_per_user || null,
                times_used: 0,
                applies_to: applies_to || 'all',
                product_ids: product_ids || [],
                category_ids: category_ids || [],
                user_restrictions: user_restrictions || 'all',
                start_date: start_date || new Date().toISOString(),
                end_date: end_date || null,
                is_active: is_active !== false,
            })
            .select()
            .single()

        if (createError) {
            console.error('Failed to create coupon:', createError)
            throw new Error('Failed to create coupon')
        }

        return NextResponse.json(
            {
                message: 'Coupon created successfully',
                data: coupon,
            },
            { status: 201, headers: getCorsHeaders(origin) }
        )

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
