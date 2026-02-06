import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { errorResponse, UnauthorizedError, ForbiddenError } from '@/lib/utils/errors'
import { z } from 'zod'

const bannerSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    subtitle: z.string().optional(), // Description in model
    image_url: z.string().url('Invalid image URL'), // Image in model
    link_url: z.string().url('Invalid link URL').optional(),
    button_text: z.string().optional(),
    text_color: z.string().default('#FFFFFF'),
    is_active: z.boolean().default(true),
    sort_order: z.number().default(0),
    // Map these to model fields
})

const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5001",
    process.env.NEXT_PUBLIC_SITE_URL,
].filter(Boolean) as string[];

function getCorsHeaders(request: NextRequest) {
    const origin = request.headers.get("origin") || "";
    const allowOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0] || origin;
    return {
        "Access-Control-Allow-Origin": allowOrigin,
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, x-user-id, x-user-role",
        "Access-Control-Allow-Credentials": "true",
    };
}

export async function OPTIONS(request: NextRequest) {
    return new NextResponse(null, { status: 204, headers: getCorsHeaders(request) });
}

export async function GET(request: NextRequest) {
    const corsHeaders = getCorsHeaders(request);

    try {
        const userRole = request.headers.get('x-user-role');
        if (userRole !== 'ADMIN') throw new ForbiddenError('Admin access required');

        const banners = await prisma.heroSlide.findMany({
            orderBy: { sortOrder: 'asc' }
        });

        return NextResponse.json({ data: banners }, { headers: corsHeaders });

    } catch (error) {
        const res = errorResponse(error);
        Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
        return res;
    }
}

export async function POST(request: NextRequest) {
    const corsHeaders = getCorsHeaders(request);

    try {
        const userRole = request.headers.get('x-user-role');
        if (userRole !== 'ADMIN') throw new ForbiddenError('Admin access required');

        const body = await request.json();
        const validation = bannerSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({
                error: 'Validation failed',
                errors: validation.error.flatten().fieldErrors
            }, { status: 400, headers: corsHeaders });
        }

        const data = validation.data;

        // Map simplified frontend fields to complex HeroSlide model
        // Frontend sends simple banner, Backend expects HeroSlide?
        // Let's adapt as best as possible.
        const slide = await prisma.heroSlide.create({
            data: {
                title: data.title,
                description: data.subtitle,
                image: data.image_url,
                ctaPrimary: data.link_url ? { text: data.button_text || 'Learn More', link: data.link_url } : undefined,
                isActive: data.is_active,
                sortOrder: data.sort_order,
                // Defaults
                badge: "Featured",
                badgeColor: "bg-blue-600",
                gradient: "from-blue-600 to-purple-600"
            }
        });

        return NextResponse.json({
            message: 'Banner created successfully',
            data: slide
        }, { status: 201, headers: corsHeaders });

    } catch (error) {
        const res = errorResponse(error);
        Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
        return res;
    }
}
