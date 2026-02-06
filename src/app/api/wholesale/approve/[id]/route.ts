// app/api/wholesale/approve/[id]/route.ts
// Wholesale Applications API - Approve or Reject application

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { errorResponse, UnauthorizedError, ForbiddenError, NotFoundError } from '@/lib/utils/errors'
import { sendWholesaleApprovalEmail, sendWholesaleRejectionEmail } from '@/lib/email'
import { WholesaleStatus, WholesaleTier, Role } from '@prisma/client'

// POST /api/wholesale/approve/[id] - Approve or reject application
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        // TODO: Auth Check

        // Mock Admin Check
        // await checkAdmin(userId)

        // Parse request body
        const body = await request.json()
        const { action, tier, rejection_reason, admin_notes } = body

        if (!action || !['approve', 'reject'].includes(action)) {
            return NextResponse.json(
                { error: 'Invalid action. Must be "approve" or "reject"' },
                { status: 400 }
            )
        }

        // Get application
        const application = await prisma.wholesaleApplication.findUnique({
            where: { id },
            include: { user: true }
        })

        if (!application) {
            throw new NotFoundError('Application')
        }

        if (application.status !== 'PENDING') {
            return NextResponse.json(
                { error: 'Application has already been reviewed' },
                { status: 400 }
            )
        }

        const applicantId = application.userId
        // Assuming we have reviewer ID from auth context. 
        // For now, using a placeholder or skipping field if not critical.
        const reviewerId = 'SYSTEM' // Or specific admin ID

        if (action === 'approve') {
            // Validate tier
            if (!tier || !['tier1', 'tier2', 'tier3'].includes(tier)) {
                return NextResponse.json(
                    { error: 'Valid tier is required for approval (tier1, tier2, or tier3)' },
                    { status: 400 }
                )
            }

            const approvedTier = tier.toUpperCase() as WholesaleTier

            // Transaction: Update application and user
            await prisma.$transaction([
                prisma.wholesaleApplication.update({
                    where: { id },
                    data: {
                        status: 'APPROVED',
                        approvedTier: approvedTier,
                        reviewedBy: reviewerId,
                        reviewedAt: new Date(),
                        adminNotes: admin_notes,
                    }
                }),
                prisma.user.update({
                    where: { id: applicantId },
                    data: {
                        role: 'WHOLESALE',
                        wholesaleStatus: 'APPROVED',
                        wholesaleTier: approvedTier
                    }
                })
            ])

            // Send approval email
            // Casting application to any to match expected type if needed, or updating email util signature
            // Assuming email util expects similar shape or we might need to adjust it
            await sendWholesaleApprovalEmail({
                ...application,
                // Map Prisma fields to expected shape if necessary
                business_name: application.businessName,
                business_email: application.businessEmail
            } as any).catch(err =>
                console.error('Failed to send wholesale approval email:', err)
            )

            return NextResponse.json({
                message: 'Application approved successfully',
                data: {
                    application_id: id,
                    status: 'approved',
                    tier,
                },
            })

        } else {
            // Reject
            if (!rejection_reason) {
                return NextResponse.json(
                    { error: 'Rejection reason is required' },
                    { status: 400 }
                )
            }

            // Transaction
            await prisma.$transaction([
                prisma.wholesaleApplication.update({
                    where: { id },
                    data: {
                        status: 'REJECTED',
                        rejectionReason: rejection_reason,
                        reviewedBy: reviewerId,
                        reviewedAt: new Date(),
                        adminNotes: admin_notes,
                    }
                }),
                prisma.user.update({
                    where: { id: applicantId },
                    data: {
                        wholesaleStatus: 'REJECTED',
                    }
                })
            ])

            // Send rejection email
            await sendWholesaleRejectionEmail({
                ...application,
                business_name: application.businessName,
                business_email: application.businessEmail
            } as any, rejection_reason).catch(err =>
                console.error('Failed to send wholesale rejection email:', err)
            )

            return NextResponse.json({
                message: 'Application rejected',
                data: {
                    application_id: id,
                    status: 'rejected',
                },
            })
        }

    } catch (error) {
        return errorResponse(error)
    }
}
