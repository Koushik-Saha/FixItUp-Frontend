// app/api/homepage/banners/route.ts
// Manage homepage banners/carousel

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { errorResponse, UnauthorizedError, ForbiddenError } from '@/lib/utils/errors'
import { z } from 'zod'

const bannerSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    subtitle: z.string().optional(),
    image_url: z.string().url('Invalid image URL'),
    link_url: z.string().url('Invalid link URL').optional(),
    button_text: z.string().optional(),
    text_color: z.string().default('#FFFFFF'),
    is_active: z.boolean().default(true),
    sort_order: z.number().default(0),
})

// GET /api/homepage/banners - Get all banners (admin only)
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()

        // Check admin
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            throw new UnauthorizedError()
        }

        const { data: profile } = await (supabase as any)
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (!profile || (profile as any).role !== 'admin') {
            throw new ForbiddenError('Only admins can manage banners')
        }

        // Get all banners
        const { data: banners, error } = await (supabase as any)
            .from('homepage_banners')
            .select('*')
            .order('sort_order', { ascending: true })

        if (error) {
            throw new Error('Failed to fetch banners')
        }

        return NextResponse.json({
            data: banners,
        })

    } catch (error) {
        return errorResponse(error)
    }
}

// POST /api/homepage/banners - Create banner (admin only)
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()

        // Check admin
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            throw new UnauthorizedError()
        }

        const { data: profile } = await (supabase as any)
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (!profile || (profile as any).role !== 'admin') {
            throw new ForbiddenError('Only admins can create banners')
        }

        const body = await request.json()

        // Validate
        const validation = bannerSchema.safeParse(body)
        if (!validation.success) {
            return NextResponse.json(
                {
                    error: 'Validation failed',
                    errors: validation.error.flatten().fieldErrors,
                },
                { status: 400 }
            )
        }

        const bannerData = validation.data

        // Create banner
        const { data: banner, error } = await (supabase as any)
            .from('homepage_banners')
            .insert(bannerData)
            .select()
            .single()

        if (error) {
            throw new Error('Failed to create banner')
        }

        return NextResponse.json(
            {
                message: 'Banner created successfully',
                data: banner,
            },
            { status: 201 }
        )

    } catch (error) {
        return errorResponse(error)
    }
}
