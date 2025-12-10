// app/api/wholesale/apply/route.ts
// Wholesale Applications API - Apply for wholesale account

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { errorResponse, UnauthorizedError, ConflictError } from '@/utils/errors'
import { wholesaleApplicationSchema, validateData, formatValidationErrors } from '@/utils/validation'

// POST /api/wholesale/apply - Submit wholesale application
export async function POST(request: NextRequest) {
    try {
        const supabase = createClient()

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            throw new UnauthorizedError('Please login to apply for wholesale account')
        }

        // Check if user already has pending or approved application
        const { data: existingApp } = await supabase
            .from('wholesale_applications')
            .select('id, status')
            .eq('user_id', user.id)
            .in('status', ['pending', 'approved'])
            .single()

        if (existingApp) {
            if (existingApp.status === 'approved') {
                throw new ConflictError('You already have an approved wholesale account')
            }
            if (existingApp.status === 'pending') {
                throw new ConflictError('You already have a pending application')
            }
        }

        // Parse and validate request
        const body = await request.json()
        const validation = validateData(wholesaleApplicationSchema, body)

        if (!validation.success) {
            return NextResponse.json(
                {
                    error: 'Validation failed',
                    errors: formatValidationErrors(validation.errors!),
                },
                { status: 400 }
            )
        }

        const applicationData = validation.data!

        // Create application
        const { data: application, error: createError } = await supabase
            .from('wholesale_applications')
            .insert({
                user_id: user.id,
                business_name: applicationData.business_name,
                business_type: applicationData.business_type,
                tax_id: applicationData.tax_id,
                website: applicationData.website,
                business_phone: applicationData.business_phone,
                business_email: applicationData.business_email,
                business_address: applicationData.business_address,
                requested_tier: applicationData.requested_tier || 'tier1',
                status: 'pending',
            })
            .select()
            .single()

        if (createError) {
            console.error('Failed to create application:', createError)
            throw new Error('Failed to submit application')
        }

        // TODO: Send confirmation email to applicant
        // TODO: Send notification to admin for review

        return NextResponse.json(
            {
                message: 'Application submitted successfully. We will review it within 2-3 business days.',
                data: {
                    application_id: application.id,
                    status: application.status,
                },
            },
            { status: 201 }
        )

    } catch (error) {
        return errorResponse(error)
    }
}
