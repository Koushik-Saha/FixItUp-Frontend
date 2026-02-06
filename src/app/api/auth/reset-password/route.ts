// app/api/auth/reset-password/route.ts
// Reset password endpoint

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

const resetPasswordSchema = z.object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    token: z.string().min(1, 'Token is required'),
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

        const { password, token } = validation.data

        // Find user by token and verify expiry
        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: {
                    gt: new Date() // Expiry must be in the future
                }
            }
        })

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid or expired reset token' },
                { status: 400 }
            )
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Update password and clear token
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null
            }
        })

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