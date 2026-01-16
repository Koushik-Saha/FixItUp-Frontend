// Shared CORS utility for admin panel API access

import { NextRequest, NextResponse } from 'next/server'

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
    'https://fix-it-admin-pearl.vercel.app',
    'http://localhost:5001', // Local admin panel development
    'http://localhost:3001', // Alternative admin panel port
    'http://localhost:3000', // Local frontend development
]

/**
 * Get CORS headers for a given origin
 */
export function getCorsHeaders(origin: string | null): Record<string, string> {
    const headers: Record<string, string> = {}

    if (origin && ALLOWED_ORIGINS.includes(origin)) {
        headers['Access-Control-Allow-Origin'] = origin
        headers['Access-Control-Allow-Credentials'] = 'true'
        headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
        headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With'
    }

    return headers
}

/**
 * Handle OPTIONS preflight request
 */
export function handleCorsPreflightRequest(request: NextRequest): NextResponse {
    const origin = request.headers.get('origin')

    return new NextResponse(null, {
        status: 200,
        headers: {
            ...getCorsHeaders(origin),
            'Access-Control-Max-Age': '86400', // 24 hours
        },
    })
}

/**
 * Add CORS headers to an existing response
 */
export function addCorsHeaders(response: NextResponse, origin: string | null): NextResponse {
    const corsHeaders = getCorsHeaders(origin)

    Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
    })

    return response
}

/**
 * Create a JSON response with CORS headers
 */
export function corsJsonResponse(
    data: any,
    options: { status?: number; origin: string | null } = { status: 200, origin: null }
): NextResponse {
    return NextResponse.json(data, {
        status: options.status,
        headers: getCorsHeaders(options.origin),
    })
}
