// app/api/admin/customers/route.ts
// Admin Customers API - List customers

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

// OPTIONS /api/admin/customers - Handle CORS preflight
export async function OPTIONS(request: NextRequest) {
    return handleCorsPreflightRequest(request)
}

// GET /api/admin/customers - List customers with filters
export async function GET(request: NextRequest) {
    const origin = request.headers.get('origin')
    try {
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
        const search = searchParams.get('search')
        const role = searchParams.get('role')
        const wholesaleStatus = searchParams.get('wholesaleStatus')
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '50')

        // Build query - join profiles with auth.users to get email
        let query = (supabase
            .from('profiles') as any)
            .select('*', { count: 'exact' })

        // Apply search filter (name, phone - email requires auth.users join)
        if (search) {
            query = query.or(`full_name.ilike.%${search}%,phone.ilike.%${search}%`)
        }

        // Apply role filter
        if (role) {
            query = query.eq('role', role)
        }

        // Apply wholesale status filter
        if (wholesaleStatus) {
            query = query.eq('wholesale_status', wholesaleStatus)
        }

        // Apply sorting
        query = query.order('created_at', { ascending: false })

        // Apply pagination
        const from = (page - 1) * limit
        const to = from + limit - 1
        query = query.range(from, to)

        const { data: profiles, error, count } = await query

        if (error) {
            console.error('Failed to fetch customers:', error)
            throw new Error('Failed to fetch customers')
        }

        // Enrich with email from auth.users
        const enrichedProfiles = await Promise.all(
            (profiles || []).map(async (profile: any) => {
                try {
                    const { data: { user: authUser } } = await supabase.auth.admin.getUserById(profile.id)
                    return {
                        ...profile,
                        email: authUser?.email || null,
                    }
                } catch (err) {
                    return {
                        ...profile,
                        email: null,
                    }
                }
            })
        )

        return NextResponse.json({
            data: enrichedProfiles,
            pagination: {
                page,
                limit,
                total: count || 0,
                totalPages: Math.ceil((count || 0) / limit),
            },
        }, { headers: getCorsHeaders(origin) })

    } catch (error) {
        const errorRes = errorResponse(error)
        const headers = new Headers(errorRes.headers)
        Object.entries(getCorsHeaders(origin)).forEach(([key, value]) => {
            headers.set(key, value)
        })
        return new NextResponse(errorRes.body, {
            status: errorRes.status,
            headers,
        })
    }
}
