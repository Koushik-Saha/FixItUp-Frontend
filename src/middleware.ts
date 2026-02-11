import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyJWT, JWTPayload } from '@/lib/jwt'

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('auth_token')?.value
    let userPayload: JWTPayload | null = null

    if (token) {
        try {
            userPayload = await verifyJWT(token)
        } catch (error) {
            // Token invalid or expired
        }
    }

    // 1. Check if route is protected (Admin)
    if (request.nextUrl.pathname.startsWith('/admin')) {
        if (!userPayload) {
            return NextResponse.redirect(new URL('/auth/login', request.url))
        }

        if (userPayload.role !== 'admin') {
            return NextResponse.redirect(new URL('/unauthorized', request.url))
        }
    }

    // 2. Check if route is protected (User Dashboard)
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
        if (!userPayload) {
            return NextResponse.redirect(new URL('/auth/login', request.url))
        }
    }

    // 3. Inject User Info into Headers (for API routes and Server Components)
    const requestHeaders = new Headers(request.headers)
    if (userPayload) {
        requestHeaders.set('x-user-id', userPayload.id as string)
        requestHeaders.set('x-user-role', userPayload.role as string)
    }

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    })
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/dashboard/:path*',
        '/api/:path*'
    ],
}
