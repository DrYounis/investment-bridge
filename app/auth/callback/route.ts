
import { createClient } from '../../../lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/'

    // Check if Supabase returned an error directly in the URL
    const error = searchParams.get('error')
    const error_description = searchParams.get('error_description')

    if (error) {
        return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${error}&error_description=${error_description}`)
    }

    if (code) {
        const supabase = await createClient()
        const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
        if (!sessionError) {
            const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
            const isLocalEnv = process.env.NODE_ENV === 'development'
            if (isLocalEnv) {
                // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
                return NextResponse.redirect(`${origin}${next}`)
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${next}`)
            } else {
                return NextResponse.redirect(`${origin}${next}`)
            }
        } else {
            console.error('Auth Session Error:', sessionError)
            return NextResponse.redirect(`${origin}/auth/auth-code-error?error=auth_error&error_description=${encodeURIComponent(sessionError.message)}`)
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=auth_error&error_description=No code provided`)
}
