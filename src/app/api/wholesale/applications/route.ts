import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { errorResponse, UnauthorizedError, ForbiddenError } from '@/lib/utils/errors'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
    try {
        const userId = request.headers.get('x-user-id');
        const userRole = request.headers.get('x-user-role');

        if (userRole !== 'ADMIN') throw new ForbiddenError('Only admins can view applications');

        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')
        const status = searchParams.get('status')
        const skip = (page - 1) * limit

        const where: Prisma.WholesaleApplicationWhereInput = {}
        if (status) {
            // Map status string to enum if needed, assuming match
            // Enum: PENDING, APPROVED, REJECTED
            where.status = status.toUpperCase() as any;
        }

        const [applications, count] = await Promise.all([
            prisma.wholesaleApplication.findMany({
                where,
                include: {
                    user: { select: { id: true, fullName: true, phone: true } }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.wholesaleApplication.count({ where })
        ]);

        return NextResponse.json({
            data: applications,
            pagination: {
                page,
                limit,
                total: count,
                totalPages: Math.ceil(count / limit)
            }
        })

    } catch (error) {
        return errorResponse(error)
    }
}
