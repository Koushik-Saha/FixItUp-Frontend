// app/api/wholesale/approve/[id]/route.ts
// Wholesale Applications API - Approve or Reject application

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { errorResponse, UnauthorizedError, ForbiddenError, NotFoundError } from '@/utils/errors'

// POST /api/wholesale/approve/[id] - Approve or reject application
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient()

        // ✅ Next 15: resolve params
        const { id } = await params

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            throw new UnauthorizedError()
        }

        // Check if user is admin
        const { data: profile } = await (supabase
            .from('profiles') as any)
            .select('role')
            .eq('id', user.id)
            .single()

        if (!profile || profile.role !== 'admin') {
            throw new ForbiddenError('Only admins can approve applications')
        }

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
        const { data: application, error: appError } = await (supabase
            .from('wholesale_applications') as any)
            .select('*, profiles!wholesale_applications_user_id_fkey(id)')
            .eq('id', id)
            .single()

        if (appError || !application) {
            throw new NotFoundError('Application')
        }

        if (application.status !== 'pending') {
            return NextResponse.json(
                { error: 'Application has already been reviewed' },
                { status: 400 }
            )
        }

        const applicantId = (application.profiles as any)?.id

        if (action === 'approve') {
            // Validate tier
            if (!tier || !['tier1', 'tier2', 'tier3'].includes(tier)) {
                return NextResponse.json(
                    { error: 'Valid tier is required for approval (tier1, tier2, or tier3)' },
                    { status: 400 }
                )
            }

            // Update application
            const { error: updateAppError } = await (supabase
                .from('wholesale_applications') as any)
                .update({
                    status: 'approved',
                    approved_tier: tier,
                    reviewed_by: user.id,
                    reviewed_at: new Date().toISOString(),
                    admin_notes,
                })
                .eq('id', id)

            if (updateAppError) {
                throw new Error('Failed to update application')
            }

            // Update user profile
            const { error: updateProfileError } = await (supabase
                .from('profiles') as any)
                .update({
                    role: 'wholesale',
                    wholesale_status: 'approved',
                    wholesale_tier: tier,
                })
                .eq('id', applicantId)

            if (updateProfileError) {
                throw new Error('Failed to update user profile')
            }

            // TODO: Send approval email with wholesale credentials

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

            // Update application
            const { error: updateAppError } = await (supabase
                .from('wholesale_applications') as any)
                .update({
                    status: 'rejected',
                    rejection_reason,
                    reviewed_by: user.id,
                    reviewed_at: new Date().toISOString(),
                    admin_notes,
                })
                .eq('id', id)

            if (updateAppError) {
                throw new Error('Failed to update application')
            }

            // Update user profile
            const { error: updateProfileError } = await (supabase
                .from('profiles') as any)
                .update({
                    wholesale_status: 'rejected',
                })
                .eq('id', applicantId)

            if (updateProfileError) {
                throw new Error('Failed to update user profile')
            }

            // TODO: Send rejection email with reason

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
