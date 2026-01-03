// middleware.ts
// Middleware to refresh user session

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
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

    // Get current user session
    const { data: { user }, error } = await supabase.auth.getUser()

    // Protected routes - require authentication
    // Note: cart and checkout now allow guest access
    const protectedPaths = ['/dashboard', '/order-tracking', '/repairs']
    const adminPaths = ['/admin']
    const authPaths = ['/auth/login', '/auth/signup']
    const pathname = request.nextUrl.pathname

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

    // Wholesale routes
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
    if (pathname.startsWith('/api/') && user) {
        response.headers.set('x-user-id', user.id)
        response.headers.set('x-user-email', user.email || '')
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
