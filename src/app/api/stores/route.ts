
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { errorResponse } from '@/lib/utils/errors'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const offset = (page - 1) * limit
        const query = searchParams.get('query') || ''
        const city = searchParams.get('city') || ''

        const whereClause: Prisma.StoreWhereInput = { isActive: true }

        if (query) {
            whereClause.OR = [
                { name: { contains: query, mode: 'insensitive' } },
                { city: { contains: query, mode: 'insensitive' } },
                { zipCode: { contains: query, mode: 'insensitive' } }
            ]
        }

        if (city) {
            whereClause.city = { contains: city, mode: 'insensitive' }
        }

        const [stores, total] = await Promise.all([
            prisma.store.findMany({
                where: whereClause,
                take: limit,
                skip: offset,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    name: true,
                    address: true,
                    city: true,
                    state: true,
                    zipCode: true,
                    phone: true,
                    email: true,
                    operatingHours: true,
                    // isActive: true // No need to select if filtered
                }
            }),
            prisma.store.count({ where: whereClause })
        ])

        return NextResponse.json({
            success: true,
            data: stores,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        })

    } catch (error) {
        return errorResponse(error)
    }
}
