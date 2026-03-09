import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  version: string
  checks: {
    supabase: {
      status: 'ok' | 'error'
      responseTime?: number
      error?: string
    }
    environment: {
      status: 'ok' | 'error'
      missingVars: string[]
    }
  }
  uptime: number
}

export async function GET() {
  const startTime = Date.now()
  const startTimeHighRes = process.hrtime.bigint()
  
  const checks: HealthStatus['checks'] = {
    supabase: { status: 'ok' },
    environment: { status: 'ok', missingVars: [] }
  }

  // Check required environment variables
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'STRAVA_CLIENT_ID',
    'RESEND_API_KEY'
  ]

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  )

  if (missingVars.length > 0) {
    checks.environment.status = 'error'
    checks.environment.missingVars = missingVars
  }

  // Check Supabase connection
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('profiles').select('id').limit(1)
    
    const supabaseResponseTime = Number(process.hrtime.bigint() - startTimeHighRes) / 1_000_000
    
    if (error) {
      checks.supabase.status = 'error'
      checks.supabase.error = error.message
    } else {
      checks.supabase.responseTime = Math.round(supabaseResponseTime)
    }
  } catch (error) {
    checks.supabase.status = 'error'
    checks.supabase.error = error instanceof Error ? error.message : 'Unknown error'
  }

  // Determine overall health status
  let status: HealthStatus['status'] = 'healthy'
  if (checks.supabase.status === 'error' || checks.environment.status === 'error') {
    status = 'degraded'
  }

  const healthData: HealthStatus = {
    status,
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '0.1.0',
    checks,
    uptime: process.uptime()
  }

  return NextResponse.json(healthData, {
    status: status === 'healthy' ? 200 : 503,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  })
}
