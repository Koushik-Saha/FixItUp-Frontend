// app/api/admin/customers/[id]/block/route.ts
// Admin Customers API - Block/Unblock customer

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { errorResponse, UnauthorizedError } from '@/lib/utils/errors'
import { handleCorsPreflightRequest, getCorsHeaders } from '@/lib/cors'

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

// OPTIONS /api/admin/customers/[id]/block - Handle preflight request
export async function OPTIONS(request: NextRequest) {
    return handleCorsPreflightRequest(request)
}

// POST /api/admin/customers/[id]/block - Block or unblock customer
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const origin = request.headers.get('origin')
        const { id } = await params
        const body = await request.json()

        // TODO: Validate Authentication properly
        // For now, assuming authenticated context or placeholder logic would be here
        // In real app, get userId from session/token

        // Mock Admin Check (Skipping for now due to removed auth context, 
        // but normally would retrieve current user here)
        // await checkAdmin(currentUserId) 

        const { blocked } = body

        if (typeof blocked !== 'boolean') {
            return NextResponse.json(
                { error: 'Blocked status must be a boolean' },
                { status: 400, headers: getCorsHeaders(origin) }
            )
        }

        // Check if customer exists
        const existingCustomer = await prisma.user.findUnique({
            where: { id },
            select: { id: true, role: true }
        })

        if (!existingCustomer) {
            return NextResponse.json(
                { error: 'Customer not found' },
                { status: 404, headers: getCorsHeaders(origin) }
            )
        }

        // Don't allow blocking admins
        if (existingCustomer.role === 'ADMIN') {
            return NextResponse.json(
                { error: 'Cannot block admin users' },
                { status: 400, headers: getCorsHeaders(origin) }
            )
        }

        // Block/unblock user
        await prisma.user.update({
            where: { id },
            data: { isBlocked: blocked }
        })

        return NextResponse.json({
            success: true,
            message: `Customer ${blocked ? 'blocked' : 'unblocked'} successfully`,
        }, {
            headers: getCorsHeaders(origin)
        })

    } catch (error) {
        return errorResponse(error)
    }
}
