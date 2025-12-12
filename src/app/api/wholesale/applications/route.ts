// app/api/wholesale/applications/route.ts
// Wholesale Applications API - List applications (Admin only)

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { errorResponse, UnauthorizedError, ForbiddenError } from '@/utils/errors'

// GET /api/wholesale/applications - List all applications (Admin only)
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { searchParams } = new URL(request.url)

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            throw new UnauthorizedError()
        }

        // Check if user is admin
        const { data: profile } = await (supabase
            .from('profiles') as any)
            .select('role')
            .eq('id', user.id)
            .single()

        if (!profile || profile.role !== 'admin') {
            throw new ForbiddenError('Only admins can view applications')
        }

        // Get query parameters
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')
        const status = searchParams.get('status')

        // Calculate pagination
        const from = (page - 1) * limit
        const to = from + limit - 1

        // Build query
        let query = (supabase
            .from('wholesale_applications') as any)
            .select(`
        *,
        applicant:profiles!wholesale_applications_user_id_fkey(id, full_name, phone)
      `, { count: 'exact' })

        // Apply status filter
        if (status) {
            query = query.eq('status', status)
        }

        // Apply sorting and pagination
        query = query
            .order('created_at', { ascending: false })
            .range(from, to)

        const { data: applications, error, count } = await query

        if (error) {
            console.error('Failed to fetch applications:', error)
            throw new Error('Failed to fetch applications')
        }

        return NextResponse.json({
            data: applications,
            pagination: {
                page,
                limit,
                total: count || 0,
                totalPages: Math.ceil((count || 0) / limit),
            },
        })

    } catch (error) {
        return errorResponse(error)
    }
}
