// app/api/admin/customers/[id]/reset-password/route.ts
// Admin Customers API - Reset customer password

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { errorResponse, UnauthorizedError } from '@/lib/utils/errors'
import { handleCorsPreflightRequest, getCorsHeaders } from '@/lib/cors'
import { sendPasswordResetEmail } from '@/lib/email'
import crypto from 'crypto'

// Helper to check if user is admin
async function checkAdmin(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }
    })

    if (!user || user.role !== 'ADMIN') {
        throw new UnauthorizedError('Admin access required')
    }
}

// OPTIONS /api/admin/customers/[id]/reset-password - Handle preflight request
export async function OPTIONS(request: NextRequest) {
    return handleCorsPreflightRequest(request)
}

// POST /api/admin/customers/[id]/reset-password - Send password reset email
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const origin = request.headers.get('origin')
        const { id } = await params

        // TODO: Validate Authentication (similar to other routes)

        // Get customer
        const customer = await prisma.user.findUnique({
            where: { id }
        })

        if (!customer) {
            return NextResponse.json(
                { error: 'Customer not found' },
                { status: 404, headers: getCorsHeaders(origin) }
            )
        }

        if (!customer.email) {
            return NextResponse.json(
                { error: 'Customer has no email address' },
                { status: 400, headers: getCorsHeaders(origin) }
            )
        }

        // Generate Reset Token
        const resetToken = crypto.randomUUID()
        const expiry = new Date()
        expiry.setHours(expiry.getHours() + 1) // 1 hour expiry

        // Save token to user
        await prisma.user.update({
            where: { id: customer.id },
            data: {
                resetToken,
                resetTokenExpiry: expiry
            }
        })

        // Send password reset email
        const emailResult = await sendPasswordResetEmail(customer.email, resetToken)

        if (!emailResult.success) {
            throw new Error('Failed to send password reset email')
        }

        return NextResponse.json({
            success: true,
            message: `Password reset email sent to ${customer.email}`,
        }, {
            headers: getCorsHeaders(origin)
        })

    } catch (error) {
        return errorResponse(error)
    }
}
