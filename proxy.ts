import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from './lib/supabase/middleware'
import { RateLimiterMemory, RateLimiterRes } from 'rate-limiter-flexible'
import { verifyCsrfToken, logSecurityEvent } from './lib/security'

// ── Rate limiter configuration ─────────────────────────────────────

const RATE_LIMIT_ENABLED = process.env.RATE_LIMIT_ENABLED !== 'false'

const apiRateLimiter = new RateLimiterMemory({
  points: 10,
  duration: 60,
  blockDuration: 60,
})

const authRateLimiter = new RateLimiterMemory({
  points: 5,        // 5 attempts
  duration: 900,    // per 15 minutes
  blockDuration: 900,
})

const formRateLimiter = new RateLimiterMemory({
  points: 3,
  duration: 60,
  blockDuration: 120,
})

const strictApiRateLimiter = new RateLimiterMemory({
  points: 30,       // 30 requests
  duration: 60,     // per minute
  blockDuration: 60,
})

// ── Client identification ──────────────────────────────────────────

function getClientId(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown'
  return `ip:${ip}`
}

function getClientIP(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  return forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown'
}

// ── Rate limiting ──────────────────────────────────────────────────

async function applyRateLimit(request: NextRequest): Promise<NextResponse | null> {
  if (!RATE_LIMIT_ENABLED) return null

  const clientId = getClientId(request)
  const path = request.nextUrl.pathname

  let limiter: RateLimiterMemory
  let points: number

  if (path.startsWith('/api/auth') || path.startsWith('/login') || path.startsWith('/register')) {
    limiter = authRateLimiter
    points = 5
  } else if (path.startsWith('/api/meetings') || path.startsWith('/meetings')) {
    limiter = formRateLimiter
    points = 3
  } else if (path.startsWith('/api')) {
    limiter = apiRateLimiter
    points = 10
  } else if (path.startsWith('/marfa')) {
    return null
  } else {
    return null
  }

  try {
    await limiter.consume(clientId)
    return null
  } catch (error) {
    if (error instanceof RateLimiterRes) {
      const retryAfter = error.msBeforeNext || 60000

      // Log rate limit breach
      logSecurityEvent({
        type: 'rate_limit.exceeded',
        ip: getClientIP(request),
        path,
        method: request.method,
        timestamp: new Date().toISOString(),
        details: { retryAfter },
      })

      return NextResponse.json(
        { error: 'Too Many Requests', message: 'Rate limit exceeded. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil(retryAfter / 1000)),
            'X-RateLimit-Limit': String(points),
            'X-RateLimit-Remaining': String(error.remainingPoints),
            'X-RateLimit-Reset': String(new Date(Date.now() + error.msBeforeNext).getTime()),
          },
        }
      )
    }
    throw error
  }
}

// ── CSRF protection ────────────────────────────────────────────────

function applyCsrfProtection(request: NextRequest): NextResponse | null {
  const method = request.method.toUpperCase()
  const stateChangingMethods = ['POST', 'PUT', 'PATCH', 'DELETE']

  if (!stateChangingMethods.includes(method)) return null

  // API routes that use Bearer token auth (cron, service-to-service) skip CSRF
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    // Bearer-authenticated requests have their own auth — CSRF not needed
    return null
  }

  // Skip CSRF for public API endpoints that don't have a browser session
  const path = request.nextUrl.pathname
  const csrfExemptPaths = ['/api/cron', '/api/health', '/api/scrape', '/api/claude']
  if (csrfExemptPaths.some(p => path.startsWith(p))) return null

  if (!verifyCsrfToken(request)) {
    logSecurityEvent({
      type: 'csrf.failed',
      ip: getClientIP(request),
      path,
      method,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(
      { error: 'Invalid or missing CSRF token' },
      { status: 403 }
    )
  }

  return null
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
  // 1. Rate limiting
  const rateLimitResponse = await applyRateLimit(request)
  if (rateLimitResponse) return rateLimitResponse

  // 2. CSRF protection on state-changing methods
  const csrfResponse = applyCsrfProtection(request)
  if (csrfResponse) return csrfResponse

  // 3. Session management
  const response = await updateSession(request)

  // 4. Apply security headers
  applySecurityHeaders(response)

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|apple-icon\\.png|icon\\.png|opengraph-image\\.png|twitter-image\\.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
