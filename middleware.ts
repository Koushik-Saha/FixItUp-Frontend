// middleware.ts
// Middleware to refresh user session

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    // Add CORS headers for API routes to allow admin panel access
    const origin = request.headers.get('origin')
    const allowedOrigins = [
        'https://fix-it-admin-pearl.vercel.app',
        'http://localhost:5001', // Local admin panel development
        'http://localhost:3001', // Alternative admin panel port
        'http://localhost:3000', // Local frontend development
    ]

    // Handle preflight requests for API routes
    if (request.nextUrl.pathname.startsWith('/api/') && request.method === 'OPTIONS') {
        return new NextResponse(null, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': origin && allowedOrigins.includes(origin) ? origin : '',
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Max-Age': '86400',
            },
        })
    }

    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    // Get current user session - check Authorization header first (for cross-domain admin panel)
    const authHeader = request.headers.get('authorization')
    let user = null
    let error = null

    if (authHeader?.startsWith('Bearer ')) {
        // Extract token from Authorization header
        const token = authHeader.substring(7)
        const { data, error: authError } = await supabase.auth.getUser(token)
        user = data.user
        error = authError
    } else {
        // Fall back to cookie-based auth
        const { data, error: authError } = await supabase.auth.getUser()
        user = data.user
        error = authError
    }

    const pathname = request.nextUrl.pathname

    // Public routes that don't require authentication
    const publicPaths = [
        '/',
        '/about-us',
        '/contact-us',
        '/faq',
        '/privacy-policy',
        '/term-and-condition',
        '/stores',
        '/shop',
        '/category',
        '/products',
        '/cart',
        '/checkout',
        '/auth/login',
        '/auth/signup',
        '/auth/forgot-password',
        '/auth/reset-password',
        '/api/auth/login',
        '/api/auth/register',
        '/api/auth/forgot-password',
        '/api/auth/reset-password',
    ]

    // Protected routes - require authentication
    const protectedPaths = ['/dashboard', '/order-tracking', '/repairs', '/orders', '/wishlist', '/warranty-claims']
    const adminPaths = ['/admin']
    const authPaths = ['/auth/login', '/auth/signup']

    // Check if current path is public
    const isPublicPath = publicPaths.some(path =>
        pathname === path || pathname.startsWith(path + '/')
    )

    // Redirect to login if accessing protected routes without authentication
    if (protectedPaths.some(path => pathname.startsWith(path))) {
        if (!user) {
            const redirectUrl = new URL('/auth/login', request.url)
            redirectUrl.searchParams.set('from', pathname)
            return NextResponse.redirect(redirectUrl)
        }
    }

    // Admin routes - require admin role
    if (adminPaths.some(path => pathname.startsWith(path))) {
        if (!user) {
            const redirectUrl = new URL('/auth/login', request.url)
            redirectUrl.searchParams.set('from', pathname)
            return NextResponse.redirect(redirectUrl)
        }

        // Check if user is admin
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (!profile || (profile as any).role !== 'admin') {
            return NextResponse.redirect(new URL('/unauthorized', request.url))
        }
    }

    // Wholesale routes - require wholesale role
    if (pathname.startsWith('/wholesale') && !pathname.includes('/apply')) {
        if (!user) {
            const redirectUrl = new URL('/auth/login', request.url)
            redirectUrl.searchParams.set('from', pathname)
            return NextResponse.redirect(redirectUrl)
        }

        // Check if user is approved wholesale
        const { data: profile } = await supabase
            .from('profiles')
            .select('role, wholesale_status')
            .eq('id', user.id)
            .single()

        if ((profile as any)?.role !== 'wholesale' || (profile as any)?.wholesale_status !== 'approved') {
            return NextResponse.redirect(new URL('/wholesale/apply', request.url))
        }
    }

    // Redirect authenticated users away from auth pages
    if (authPaths.some(path => pathname.startsWith(path)) && user) {
        const from = request.nextUrl.searchParams.get('from')
        return NextResponse.redirect(new URL(from || '/dashboard', request.url))
    }

    // API routes - add user info to headers for server components
    if (pathname.startsWith('/api/')) {
        if (user) {
            response.headers.set('x-user-id', user.id)
            response.headers.set('x-user-email', user.email || '')
        }
    }

    // Add CORS headers to all responses for admin panel
    if (origin && allowedOrigins.includes(origin)) {
        response.headers.set('Access-Control-Allow-Origin', origin)
        response.headers.set('Access-Control-Allow-Credentials', 'true')
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
