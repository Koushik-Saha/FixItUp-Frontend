// app/api/auth/logout/route.ts
// Logout endpoint

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/auth/logout - User logout
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()

        // Sign out from Supabase
        const { error } = await supabase.auth.signOut()

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            )
        }

        return NextResponse.json({
            message: 'Logout successful',
        })

    } catch (error) {
        console.error('Logout error:', error)
        return NextResponse.json(
            { error: 'Logout failed' },
            { status: 500 }
        )
    }
}

// GET /api/auth/logout - Alternative for link-based logout
export async function GET(request: NextRequest) {
    return POST(request)
}
