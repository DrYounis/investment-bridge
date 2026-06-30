import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    // Skip Supabase entirely for public pages
    const publicPaths = ['/login', '/register', '/auth', '/api/auth', '/api/erasure', '/', '/marfa', '/financial-news', '/argaam-news', '/api/scrape', '/api/cron', '/api/health']
    const isPublicPath = publicPaths.some(p => request.nextUrl.pathname === p || request.nextUrl.pathname.startsWith(p + '/'))

    if (isPublicPath) {
        return NextResponse.next({ request })
    }

    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return request.cookies.getAll() },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({ request })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        // Enforce httpOnly, Secure, SameSite=Strict on all session cookies
                        supabaseResponse.cookies.set(name, value, {
                            ...options,
                            httpOnly: true,
                            secure: true,
                            sameSite: 'strict',
                        })
                    )
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (!user && (request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/meetings'))) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        url.searchParams.set('redirect', request.nextUrl.pathname)
        return NextResponse.redirect(url)
    }

    // Admin routes: redirect to /admin/login, except for login and setup pages
    if (!user && request.nextUrl.pathname.startsWith('/admin') &&
        !request.nextUrl.pathname.startsWith('/admin/login') &&
        !request.nextUrl.pathname.startsWith('/admin/setup')) {
        const url = request.nextUrl.clone()
        url.pathname = '/admin/login'
        url.searchParams.set('redirect', request.nextUrl.pathname)
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}
