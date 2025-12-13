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
    phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, 'Invalid phone format. Use (555) 123-4567').optional(),
})

// POST /api/auth/register - User registration
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Validate input
        const validation = registerSchema.safeParse(body)
        if (!validation.success) {
            return NextResponse.json(
                {
                    error: 'Validation failed',
                    errors: validation.error.flatten().fieldErrors,
                },
                { status: 400 }
            )
        }

        const { email, password, full_name, phone } = validation.data

        const supabase = await createClient()

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
                { status: 400 }
            )
        }

        if (!data.user) {
            return NextResponse.json(
                { error: 'Registration failed' },
                { status: 400 }
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

        return NextResponse.json(
            {
                message: 'Registration successful. Please check your email to verify your account.',
                data: {
                    user: {
                        id: data.user.id,
                        email: data.user.email,
                        full_name,
                        phone,
                    },
                },
            },
            { status: 201 }
        )

    } catch (error) {
        console.error('Registration error:', error)
        return NextResponse.json(
            { error: 'Registration failed' },
            { status: 500 }
        )
    }
}
