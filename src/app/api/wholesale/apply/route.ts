import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { errorResponse, UnauthorizedError, ConflictError } from '@/lib/utils/errors'
import { wholesaleApplicationSchema, validateData, formatValidationErrors } from '@/utils/validation'
// import { sendWholesaleApplicationEmail } from '@/lib/email' // Assuming this still works or needs refactor

export async function POST(request: NextRequest) {
    try {
        const userId = request.headers.get('x-user-id');
        if (!userId) throw new UnauthorizedError('Please login to apply');

        // Check existing application
        const existingApp = await prisma.wholesaleApplication.findFirst({
            where: {
                userId,
                status: { in: ['PENDING', 'APPROVED'] }
            }
        });

        if (existingApp) {
            if (existingApp.status === 'APPROVED') {
                throw new ConflictError('You already have an approved wholesale account');
            }
            if (existingApp.status === 'PENDING') {
                throw new ConflictError('You already have a pending application');
            }
        }

        const body = await request.json();
        const output = validateData(wholesaleApplicationSchema, body);

        if (!output.success) {
            return NextResponse.json({
                error: 'Validation failed',
                errors: formatValidationErrors(output.errors!)
            }, { status: 400 });
        }

        const data = output.data!;

        const application = await prisma.wholesaleApplication.create({
            data: {
                userId,
                businessName: data.business_name,
                businessType: data.business_type || 'Other',
                taxId: data.tax_id,
                website: data.website,
                businessPhone: data.business_phone,
                businessEmail: data.business_email,
                businessAddress: data.business_address,
                requestedTier: (data.requested_tier?.toUpperCase() as any) || 'TIER1',
                status: 'PENDING'
            }
        });

        // Email logic (kept as commented TODO or if import works)
        // await sendWholesaleApplicationEmail(application);

        return NextResponse.json({
            message: 'Application submitted successfully.',
            data: {
                application_id: application.id,
                status: application.status
            }
        }, { status: 201 });

    } catch (error) {
        return errorResponse(error);
    }
}
