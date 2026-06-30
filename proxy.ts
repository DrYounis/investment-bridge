import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from './lib/supabase/middleware'

// ── Auth gate for free services ────────────────────────────────────

function applyAuthGate(request: NextRequest): NextResponse | null {
  const path = request.nextUrl.pathname

  // Public admin paths: login and initial setup
  const publicAdminPaths = ['/admin/login', '/admin/setup']
  if (publicAdminPaths.some(p => path.startsWith(p))) return null

  const protectedPaths = ['/marfa', '/services/pitch-deck', '/meetings', '/advisor', '/dashboard', '/admin']
  if (!protectedPaths.some(p => path.startsWith(p))) return null

  const hasSession = request.cookies.getAll().some(
    c => c.name.startsWith('sb-') && c.name.endsWith('-auth-token')
  )
  if (hasSession) return null

  const url = request.nextUrl.clone()
  url.pathname = '/login'
  url.searchParams.set('redirect', request.nextUrl.pathname + request.nextUrl.search)
  return NextResponse.redirect(url)
}

// ── Security headers ───────────────────────────────────────────────

function applySecurityHeaders(response: NextResponse): void {
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(self), interest-cohort=()'
  )
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin')
  response.headers.set('Cross-Origin-Resource-Policy', 'same-origin')
}

// ── Main middleware ─────────────────────────────────────────────────

export default async function proxy(request: NextRequest) {
  // 1. Auth gate for protected paths
  const authGateResponse = applyAuthGate(request)
  if (authGateResponse) return authGateResponse

  // 2. Session management (handles Supabase cookie refresh, auth redirects)
  const response = await updateSession(request)

  // 3. Apply security headers
  applySecurityHeaders(response)

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|apple-icon\\.png|icon\\.png|opengraph-image\\.png|twitter-image\\.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
