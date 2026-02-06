import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { errorResponse } from '@/lib/utils/errors'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const type = searchParams.get('type')
        const parentId = searchParams.get('parentId')

        const where: any = {
            isActive: true
        }

        if (type) {
            where.type = type
        }

        if (parentId) {
            where.parentId = parentId
        } else if (type === 'footer_section') {
            // If fetching footer sections, we want top-level
            where.parentId = null
        }

        const items = await prisma.navigationItem.findMany({
            where,
            include: {
                children: {
                    where: { isActive: true },
                    orderBy: { sortOrder: 'asc' }
                }
            },
            orderBy: { sortOrder: 'asc' }
        })

        return NextResponse.json(items)
    } catch (error) {
        return errorResponse(error)
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Basic validation - in a real app use Zod
        if (!body.title || !body.type) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        const item = await prisma.navigationItem.create({
            data: {
                title: body.title,
                url: body.url || '#',
                type: body.type,
                parentId: body.parentId,
                sortOrder: body.sortOrder || 0,
                isActive: true
            }
        })

        return NextResponse.json(item)
    } catch (error) {
        return errorResponse(error)
    }
}
