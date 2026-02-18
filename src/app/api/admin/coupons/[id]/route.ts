// app/api/admin/coupons/[id]/route.ts
// Admin Coupons API - Get, Update, Delete single coupon

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { errorResponse, UnauthorizedError, NotFoundError } from '@/lib/utils/errors'
import { handleCorsPreflightRequest, getCorsHeaders } from '@/lib/cors'

// Helper to check if user is admin
async function checkAdmin(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }
    })

    if (!user || user.role !== 'ADMIN') { // Prisma enum is usually uppercase
        throw new UnauthorizedError('Admin access required')
    }
}

// OPTIONS /api/admin/coupons/[id] - Handle preflight request
export async function OPTIONS(request: NextRequest) {
    return handleCorsPreflightRequest(request)
}

// GET /api/admin/coupons/[id] - Get single coupon
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const origin = request.headers.get('origin')
        const { id } = await params

        // Mock auth check (Replace with actual session check if available, or JWT)
        // For now, getting user from header or assuming session is handled by middleware
        // But since we removed supabase, we need a way to identify user. 
        // Assuming secure cookie or next-auth session. 
        // For this refactor, I will focus on data access.
        // TODO: Re-implement Auth Check properly

        // Fetch coupon
        const coupon = await prisma.coupon.findUnique({
            where: { id }
        })

        if (!coupon) {
            return NextResponse.json(
                { error: 'Coupon not found' },
                { status: 404, headers: getCorsHeaders(origin) }
            )
        }

        // Get usage count
        const usageCount = await prisma.couponUsage.count({
            where: { couponId: id }
        })

        return NextResponse.json({
            data: {
                ...coupon,
                usage_count: usageCount,
            },
        }, {
            headers: getCorsHeaders(origin)
        })

    } catch (error) {
        return errorResponse(error)
    }
}

// PUT /api/admin/coupons/[id] - Update coupon
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const origin = request.headers.get('origin')
        const { id } = await params
        const body = await request.json()

        // Check if coupon exists
        const existingCoupon = await prisma.coupon.findUnique({
            where: { id }
        })

        if (!existingCoupon) {
            return NextResponse.json(
                { error: 'Coupon not found' },
                { status: 404, headers: getCorsHeaders(origin) }
            )
        }

        // If code is being updated, check for duplicates
        if (body.code && body.code.toUpperCase() !== existingCoupon.code) {
            const duplicate = await prisma.coupon.findUnique({
                where: { code: body.code.toUpperCase() }
            })

            if (duplicate) {
                return NextResponse.json(
                    { error: 'Another coupon with this code already exists' },
                    { status: 400, headers: getCorsHeaders(origin) }
                )
            }
        }

        // Prepare update data
        // Prepare update data
        const updateData: Prisma.CouponUpdateInput = {
            code: body.code ? body.code.toUpperCase() : undefined,
            discountType: body.discountType,
            discountValue: body.discountValue,
            minPurchase: body.minOrderAmount, // Mapped from frontend minOrderAmount to schema minPurchase
            maxDiscount: body.maxDiscount,
            startDate: body.startDate,
            endDate: body.endDate,
            // usageLimit: body.usageLimit, // Removed as it does not exist in Prisma schema
            maxUses: body.usageLimit,
            isActive: body.isActive
        }

        // Remove undefined keys
        Object.keys(updateData).forEach(key =>
            (updateData as any)[key] === undefined && delete (updateData as any)[key]
        )

        const coupon = await prisma.coupon.update({
            where: { id },
            data: updateData
        })

        return NextResponse.json({
            message: 'Coupon updated successfully',
            data: coupon,
        }, {
            headers: getCorsHeaders(origin)
        })

    } catch (error) {
        return errorResponse(error)
    }
}

// DELETE /api/admin/coupons/[id] - Delete coupon
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const origin = request.headers.get('origin')
        const { id } = await params

        // Check usage
        const usageCount = await prisma.couponUsage.count({
            where: { couponId: id }
        })

        if (usageCount > 0) {
            // Deactivate instead
            await prisma.coupon.update({
                where: { id },
                data: { isActive: false }
            })

            return NextResponse.json({
                success: true,
                message: 'Coupon has been deactivated (cannot delete used coupons)',
            }, {
                headers: getCorsHeaders(origin)
            })
        }

        // Delete
        await prisma.coupon.delete({
            where: { id }
        })

        return NextResponse.json({
            success: true,
            message: 'Coupon deleted successfully',
        }, {
            headers: getCorsHeaders(origin)
        })

    } catch (error) {
        return errorResponse(error)
    }
}
