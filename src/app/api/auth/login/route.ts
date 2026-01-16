// app/api/auth/login/route.ts
// Login endpoint

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import {Database} from "@/types/database";

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})

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

// OPTIONS /api/auth/login - Handle preflight requests
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

// POST /api/auth/login - User login
export async function POST(request: NextRequest) {
    const origin = request.headers.get('origin')
    try {
        const body = await request.json()

        type Profile = Database['public']['Tables']['profiles']['Row']

        // Validate input
        const validation = loginSchema.safeParse(body)
        if (!validation.success) {
            return NextResponse.json(
                {
                    error: 'Validation failed',
                    errors: validation.error.flatten().fieldErrors,
                },
                { status: 400, headers: corsHeaders(origin) }
            )
        }

        const { email, password } = validation.data

        const supabase = await createClient()

        // Sign in with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 401, headers: corsHeaders(origin) }
            )
        }

        // Get user profile
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .maybeSingle<Profile>()

        // Transform response to match admin panel format
        return NextResponse.json({
            user: {
                id: data.user.id,
                email: data.user.email || '',
                name: profile?.full_name ?? '',
                role: profile?.role ?? 'customer',
                createdAt: data.user.created_at || new Date().toISOString(),
                lastLoginAt: data.user.last_sign_in_at || undefined,
                // Also include full profile for frontend use
                ...profile ?? {},
            },
            message: 'Login successful',
        }, { headers: corsHeaders(origin) })

    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json(
            { error: 'Login failed' },
            { status: 500, headers: corsHeaders(origin) }
        )
    }
}
