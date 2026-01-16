// app/api/auth/register/route.ts
// Registration endpoint

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import {Database} from "@/types/database";


type Tables = Database['public']['Tables']
type ProfileInsert = Tables['profiles']['Insert']


const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    full_name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().regex(/^(?:\+1\s?)?(?:\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}$/, 'Invalid US phone number').optional(),
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

// OPTIONS /api/auth/register - Handle preflight requests
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

// POST /api/auth/register - User registration
export async function POST(request: NextRequest) {
    const origin = request.headers.get('origin')
    try {
        const body = await request.json()

        debugger

        // Validate input
        const validation = registerSchema.safeParse(body)
        if (!validation.success) {
            return NextResponse.json(
                {
                    error: 'Validation failed',
                    errors: validation.error.flatten().fieldErrors,
                },
                { status: 400, headers: corsHeaders(origin) }
            )
        }

        const { email, password, full_name, phone } = validation.data

        const supabase = await createClient()

        // Check if we're in development mode
        const isDevelopment = process.env.NODE_ENV === 'development'

        console.log(`🔧 Registration mode: ${isDevelopment ? 'DEVELOPMENT (no email verification)' : 'PRODUCTION (email verification required)'}`)

        // Sign up with Supabase
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name,
                    phone,
                },
            },
        })

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 400, headers: corsHeaders(origin) }
            )
        }

        if (!data.user) {
            return NextResponse.json(
                { error: 'Registration failed' },
                { status: 400, headers: corsHeaders(origin) }
            )
        }

        const profilePayload: ProfileInsert = {
            id: data.user.id,
            full_name,
            phone: phone ?? null,
            role: 'customer',
            wholesale_status: null,
            wholesale_tier: null,
        }


        const { error: profileError } = await (supabase as any)
            .from('profiles')
            .upsert(profilePayload)

        if (profileError) {
            console.error('Profile creation error:', profileError)
        }

        // Different messages for dev vs production
        const message = isDevelopment
            ? '✅ Registration successful! You can now log in immediately (dev mode - email verification skipped).'
            : '📧 Registration successful! Please check your email to verify your account before logging in.'

        console.log(`📝 User registered: ${email} (${isDevelopment ? 'auto-confirmed' : 'needs email verification'})`)

        // Transform response to match admin panel format
        return NextResponse.json(
            {
                user: {
                    id: data.user.id,
                    email: data.user.email || '',
                    name: full_name,
                    role: 'customer',
                    createdAt: data.user.created_at || new Date().toISOString(),
                    lastLoginAt: undefined,
                    // Also include full profile for frontend use
                    full_name,
                    phone,
                },
                message: message,
            },
            { status: 201, headers: corsHeaders(origin) }
        )

    } catch (error) {
        console.error('Registration error:', error)
        return NextResponse.json(
            { error: 'Registration failed' },
            { status: 500, headers: corsHeaders(origin) }
        )
    }
}
