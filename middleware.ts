import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyJWT } from '@/lib/jwt'

export async function middleware(request: NextRequest) {
    // Add CORS headers for API routes to allow admin panel access
    const origin = request.headers.get('origin')
    const allowedOrigins = [
        'https://fix-it-admin-pearl.vercel.app',
        'http://localhost:5001',
        'http://localhost:3001', // Admin Panel
        'http://localhost:3000', // Frontend
    ]

    // Handle preflight requests
    if (request.nextUrl.pathname.startsWith('/api/') && request.method === 'OPTIONS') {
        return new NextResponse(null, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': origin && allowedOrigins.includes(origin) ? origin : '',
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-user-id, x-user-email',
                'Access-Control-Max-Age': '86400',
            },
        })
    }

    let response = NextResponse.next()

    // Add CORS headers to responses
    if (origin && allowedOrigins.includes(origin)) {
        response.headers.set('Access-Control-Allow-Origin', origin)
        response.headers.set('Access-Control-Allow-Credentials', 'true')
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    }

    // 1. Verify User (Cookie or Header)
    const cookieToken = request.cookies.get('auth_token')?.value
    const authHeader = request.headers.get('authorization')
    let headerToken = null

    if (authHeader?.startsWith('Bearer ')) {
        headerToken = authHeader.substring(7)
    }

    const token = cookieToken || headerToken
    let user = null

    if (token) {
        user = await verifyJWT(token)
    }

    // 2. Route Protection Logic
    const pathname = request.nextUrl.pathname

    // Protected API Routes (Admin)
    if (pathname.startsWith('/api/admin')) {
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
    }

    // Protected API Routes (User) - e.g., Orders
    if (pathname.startsWith('/api/orders')) {
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
    }

    // Protected UI Routes
    const protectedPaths = ['/dashboard', '/order-tracking', '/repairs', '/orders', '/wishlist']
    const authPaths = ['/auth/login', '/auth/signup']

    if (protectedPaths.some(path => pathname.startsWith(path))) {
        if (!user) {
            const redirectUrl = new URL('/auth/login', request.url)
            redirectUrl.searchParams.set('from', pathname)
            return NextResponse.redirect(redirectUrl)
        }
    }

    // Redirect authenticated users away from auth pages
    if (authPaths.some(path => pathname.startsWith(path)) && user) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Pass user info to Server Components via Headers
    const requestHeaders = new Headers(request.headers)
    if (user) {
        requestHeaders.set('x-user-id', user.id)
        requestHeaders.set('x-user-email', user.email)
        requestHeaders.set('x-user-role', user.role)
    }

    // Return response with modified request headers
    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    })
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
