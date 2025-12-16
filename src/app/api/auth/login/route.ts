// app/api/auth/login/route.ts
// Login endpoint

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})

// POST /api/auth/login - User login
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Validate input
        const validation = loginSchema.safeParse(body)
        if (!validation.success) {
            return NextResponse.json(
                {
                    error: 'Validation failed',
                    errors: validation.error.flatten().fieldErrors,
                },
                { status: 400 }
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
                { status: 401 }
            )
        }

        // Get user profile
        const { data: profile } = await supabase
            .from('profiles')
            .select('id, full_name, phone, role, wholesale_tier, wholesale_status')
            .eq('id', data.user.id)
            .maybeSingle()

        return NextResponse.json({
            message: 'Login successful',
            data: {
                user: {
                    id: data.user.id,
                    email: data.user.email,
                    ...profile ?? {},
                },
                session: {
                    access_token: data.session?.access_token,
                    refresh_token: data.session?.refresh_token,
                    expires_at: data.session?.expires_at,
                },
            },
        })

    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json(
            { error: 'Login failed' },
            { status: 500 }
        )
    }
}
