// app/api/auth/forgot-password/route.ts
// Forgot password endpoint

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
})

// POST /api/auth/forgot-password - Send password reset email
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Validate input
        const validation = forgotPasswordSchema.safeParse(body)
        if (!validation.success) {
            return NextResponse.json(
                {
                    error: 'Validation failed',
                    errors: validation.error.flatten().fieldErrors,
                },
                { status: 400 }
            )
        }

        const { email } = validation.data

        const supabase = await createClient()

        // Send password reset email
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
        })

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            )
        }

        return NextResponse.json(
            {
                message: 'Password reset email sent. Please check your inbox.',
            },
            { status: 200 }
        )

    } catch (error) {
        console.error('Forgot password error:', error)
        return NextResponse.json(
            { error: 'Failed to send password reset email' },
            { status: 500 }
        )
    }
}