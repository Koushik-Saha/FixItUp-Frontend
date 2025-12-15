// app/api/auth/reset-password/route.ts
// Reset password endpoint

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const resetPasswordSchema = z.object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    access_token: z.string(),
    refresh_token: z.string(),
})

// POST /api/auth/reset-password - Reset user password
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Validate input
        const validation = resetPasswordSchema.safeParse(body)
        if (!validation.success) {
            return NextResponse.json(
                {
                    error: 'Validation failed',
                    errors: validation.error.flatten().fieldErrors,
                },
                { status: 400 }
            )
        }

        const { password, access_token, refresh_token } = validation.data

        const supabase = await createClient()

        // Set the session with the tokens from the email link
        const { error: sessionError } = await supabase.auth.setSession({
            access_token,
            refresh_token,
        })

        if (sessionError) {
            return NextResponse.json(
                { error: 'Invalid or expired reset link' },
                { status: 400 }
            )
        }

        // Update the password
        const { error } = await supabase.auth.updateUser({
            password: password,
        })

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            )
        }

        return NextResponse.json(
            {
                message: 'Password updated successfully',
            },
            { status: 200 }
        )

    } catch (error) {
        console.error('Reset password error:', error)
        return NextResponse.json(
            { error: 'Failed to reset password' },
            { status: 500 }
        )
    }
}