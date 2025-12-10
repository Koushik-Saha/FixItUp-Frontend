// app/api/admin/users/route.ts
// Admin User Management

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { errorResponse, UnauthorizedError, ForbiddenError } from '@/utils/errors'

// GET /api/admin/users - List all users
export async function GET(request: NextRequest) {
    try {
        const supabase = createClient()

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

        if (!profile || profile.role !== 'admin') {
            throw new ForbiddenError('Only admins can access user management')
        }

        const { searchParams } = new URL(request.url)
        const role = searchParams.get('role')
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '50')

        const from = (page - 1) * limit
        const to = from + limit - 1

        // Build query
        let query = supabase
            .from('profiles')
            .select('*', { count: 'exact' })

        if (role) {
            query = query.eq('role', role)
        }

        query = query
            .order('created_at', { ascending: false })
            .range(from, to)

        const { data: users, error, count } = await query

        if (error) {
            console.error('Failed to fetch users:', error)
            throw new Error('Failed to fetch users')
        }

        // Calculate stats
        const { data: allUsers } = await supabase
            .from('profiles')
            .select('role')

        const stats = {
            total: allUsers?.length || 0,
            customers: allUsers?.filter(u => u.role === 'customer').length || 0,
            wholesale: allUsers?.filter(u => u.role === 'wholesale').length || 0,
            admins: allUsers?.filter(u => u.role === 'admin').length || 0,
        }

        return NextResponse.json({
            data: users,
            stats,
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
