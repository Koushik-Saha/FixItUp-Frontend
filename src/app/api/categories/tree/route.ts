
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            where: {
                parentId: null,
                isActive: true,
            },
            orderBy: {
                displayOrder: 'asc',
            },
            include: {
                children: {
                    where: {
                        isActive: true,
                    },
                    orderBy: {
                        name: 'asc', // Or displayOrder if you want strict control
                    },
                    include: {
                        phoneModels: {
                            where: {
                                isActive: true,
                            },
                            orderBy: {
                                modelName: 'asc',
                            },
                        },
                    },
                },
            },
        })

        return NextResponse.json(categories)
    } catch (error) {
        console.error('Error fetching category tree:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
