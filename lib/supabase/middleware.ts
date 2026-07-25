import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isSuperAdminEmail } from '@/lib/auth/adminEmails'

const PROTECTED_PATHS = ['/dashboard', '/admin', '/advisor', '/services/pitch-deck']

export async function updateSession(request: NextRequest) {
  try {
    // Skip Supabase entirely for public pages
    const publicPaths = ['/auth', '/api/auth', '/api/erasure', '/api/scrape', '/api/cron', '/api/health', '/admin/instructor', '/api/instructor']
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
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    const path = request.nextUrl.pathname
    const isProtectedPath = PROTECTED_PATHS.some(p => path.startsWith(p))

    if (!user && isProtectedPath) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirect', path)
      return NextResponse.redirect(url)
    }

    // Admin routes: redirect to /admin/login, except for login page
    if (!user && path.startsWith('/admin') && !path.startsWith('/admin/login')) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      url.searchParams.set('redirect', path)
      return NextResponse.redirect(url)
    }

    // Logged-in but not a super-admin: block /admin (except the login page)
    if (user && path.startsWith('/admin') && !path.startsWith('/admin/login')) {
      const envEmails = (process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL || '')
        .split(',').map(e => e.trim()).filter(Boolean)
      if (!isSuperAdminEmail(user.email, envEmails)) {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
      }
    }

    return supabaseResponse
  } catch (err) {
    console.error('MW_SUPABASE_FAIL', err instanceof Error ? err.message : err)

    const path = request.nextUrl.pathname
    const isProtectedPath = PROTECTED_PATHS.some(p => path.startsWith(p))

    if (isProtectedPath) {
      // Fail-closed: redirect to login, never grant access on error
      const url = request.nextUrl.clone()
      url.pathname = path.startsWith('/admin') ? '/admin/login' : '/login'
      url.searchParams.set('redirect', path)
      return NextResponse.redirect(url)
    }

    // Public paths: render as logged-out (site stays up)
    return NextResponse.next({ request })
  }
}
