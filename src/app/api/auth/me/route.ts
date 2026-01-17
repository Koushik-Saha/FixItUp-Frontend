// app/api/auth/me/route.ts
// Get current user info

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { errorResponse, UnauthorizedError } from '@/lib/utils/errors'
import {Database} from "@/types/database";

// Helper function to add CORS headers
function corsHeaders(origin: string | null) {
    const allowedOrigins = [
        'https://fix-it-admin-pearl.vercel.app',
        'http://localhost:5001',
        'http://localhost:3001',
        'http://localhost:3000',
    ]

    const headers: Record<string, string> = {}
    if (origin && allowedOrigins.includes(origin)) {
        headers['Access-Control-Allow-Origin'] = origin
        headers['Access-Control-Allow-Credentials'] = 'true'
        headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
        headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    }
    return headers
}

// OPTIONS /api/auth/me - Handle preflight requests
export async function OPTIONS(request: NextRequest) {
    const origin = request.headers.get('origin')
    return new NextResponse(null, {
        status: 200,
        headers: {
            ...corsHeaders(origin),
            'Access-Control-Max-Age': '86400',
        },
    })
}

// GET /api/auth/me - Get current user
export async function GET(request: NextRequest) {
    const origin = request.headers.get('origin')
    try {
        const supabase = await createClient()

        type Profile = Database['public']['Tables']['profiles']['Row']

        // Check for Authorization header (for cross-domain admin panel)
        const authHeader = request.headers.get('authorization')
        let user = null
        let authError = null

        if (authHeader?.startsWith('Bearer ')) {
            // Extract token from Authorization header
            const token = authHeader.substring(7)
            const { data, error } = await supabase.auth.getUser(token)
            user = data.user
            authError = error
        } else {
            // Fall back to cookie-based auth
            const { data, error } = await supabase.auth.getUser()
            user = data.user
            authError = error
        }

        if (authError || !user) {
            throw new UnauthorizedError('Not authenticated')
        }

        // Get profile
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single<Profile>()

        if (profileError) {
            console.error('Profile fetch error:', profileError)
        }

        // Transform response to match admin panel format
        return NextResponse.json({
            id: user.id,
            email: user.email || '',
            name: profile?.full_name ?? '',
            role: profile?.role ?? 'customer',
            createdAt: user.created_at || new Date().toISOString(),
            lastLoginAt: user.last_sign_in_at || undefined,
            // Also include full profile for frontend use
            ...profile ?? {},
        }, { headers: corsHeaders(origin) })

    } catch (error) {
        const errorRes = errorResponse(error)
        // Add CORS headers to error response
        const headers = new Headers(errorRes.headers)
        Object.entries(corsHeaders(origin)).forEach(([key, value]) => {
            headers.set(key, value)
        })
        return new NextResponse(errorRes.body, {
            status: errorRes.status,
            headers,
        })
    }
}
