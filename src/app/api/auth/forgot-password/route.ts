// app/api/auth/forgot-password/route.ts
// Forgot password endpoint

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { sendPasswordResetEmail } from '@/lib/email'
import crypto from 'crypto'

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

        // Find user
        const user = await prisma.user.findUnique({
            where: { email }
        })

        // Always return success even if email not found (security best practice)
        if (!user) {
            return NextResponse.json(
                {
                    message: 'If an account exists with this email, we have sent a password reset link.',
                },
                { status: 200 }
            )
        }

        // Generate Reset Token
        const resetToken = crypto.randomUUID()
        const expiry = new Date()
        expiry.setHours(expiry.getHours() + 1) // 1 hour expiry

        // Save token to user
        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken,
                resetTokenExpiry: expiry
            }
        })

        // Send password reset email
        const emailResult = await sendPasswordResetEmail(email, resetToken)

        if (!emailResult.success) {
            throw new Error('Failed to send email')
        }

        return NextResponse.json(
            {
                message: 'If an account exists with this email, we have sent a password reset link.',
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