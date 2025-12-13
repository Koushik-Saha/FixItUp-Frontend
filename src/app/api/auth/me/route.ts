// app/api/auth/me/route.ts
// Get current user info

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { errorResponse, UnauthorizedError } from '@/lib/utils/errors'

// GET /api/auth/me - Get current user
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            throw new UnauthorizedError('Not authenticated')
        }

        // Get profile
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

        if (profileError) {
            console.error('Profile fetch error:', profileError)
        }

        return NextResponse.json({
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    ...profile ?? {},
                },
            },
        })

    } catch (error) {
        return errorResponse(error)
    }
}
