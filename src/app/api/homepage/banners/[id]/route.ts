// app/api/homepage/banners/[id]/route.ts
// Update/delete specific banner

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { errorResponse, UnauthorizedError, ForbiddenError } from '@/lib/utils/errors'


// PUT /api/homepage/banners/[id] - Update banner
export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient()

        // Check admin
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            throw new UnauthorizedError()
        }

        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (profileError || !profile || (profile as any).role !== 'admin') {
            throw new ForbiddenError('Only admins can update banners')
        }

        const body = await request.json()

        const params = await context.params

        // Update banner
        const { data: banner, error } = await (supabase as any)
            .from('homepage_banners')
            .update(body)
            .eq('id', params.id)
            .select()
            .single()

        if (error) {
            throw new Error('Failed to update banner')
        }

        return NextResponse.json({
            message: 'Banner updated successfully',
            data: banner,
        })

    } catch (error) {
        return errorResponse(error)
    }
}

// DELETE /api/homepage/banners/[id] - Delete banner
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient()

        // Check admin
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            throw new UnauthorizedError()
        }

        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (profileError || !profile || (profile as any).role !== 'admin') {
            throw new ForbiddenError('Only admins can delete banners')
        }

        const params = await context.params

        // Delete banner
        const { error } = await (supabase as any)
            .from('homepage_banners')
            .delete()
            .eq('id', params.id)

        if (error) {
            throw new Error('Failed to delete banner')
        }

        return NextResponse.json({
            message: 'Banner deleted successfully',
        })

    } catch (error) {
        return errorResponse(error)
    }
}
