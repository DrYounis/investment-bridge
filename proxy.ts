import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from './lib/supabase/middleware'

// ── Security headers ───────────────────────────────────────────────

function applySecurityHeaders(response: NextResponse): void {
  // COOP/CORP are set here (not in next.config.ts)
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin')
  response.headers.set('Cross-Origin-Resource-Policy', 'same-origin')
}

// ── Main middleware ─────────────────────────────────────────────────

export default async function proxy(request: NextRequest) {
  // 1. Session management runs FIRST — validates Supabase cookie, redirects unauth
  const response = await updateSession(request)

  // 2. Apply security headers
  applySecurityHeaders(response)

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|apple-icon\\.png|icon\\.png|opengraph-image\\.png|twitter-image\\.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
