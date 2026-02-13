// app/api/homepage/banners/[id]/route.ts
// Update/delete specific banner

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { errorResponse, UnauthorizedError, ForbiddenError, NotFoundError } from '@/lib/utils/errors'

// PUT /api/homepage/banners/[id] - Update banner
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        // Check admin (Mock or via session)
        // TODO: Auth check needed
        // const user = await checkAdmin(request); 

        const body = await request.json()

        // Update banner (HeroSlide)
        const banner = await prisma.heroSlide.update({
            where: { id },
            data: body
        })

        return NextResponse.json({
            message: 'Banner updated successfully',
            data: banner,
        })

    } catch (error) {
        return errorResponse(error)
    }
}

// DELETE /api/homepage/banners/[id] - Delete banner
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        // Check admin
        // const user = await checkAdmin(request);

        // Delete banner
        await prisma.heroSlide.delete({
            where: { id }
        })

        return NextResponse.json({
            message: 'Banner deleted successfully',
        })

    } catch (error) {
        return errorResponse(error)
    }
}
