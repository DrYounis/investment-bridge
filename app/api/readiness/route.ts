import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { computeReadiness, computeAndUpsertReadiness } from '@/lib/readiness'
import { createServiceClient } from '@/lib/supabase/service'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول' }, { status: 401 })
    }

    // Try to return existing score
    const svc = createServiceClient()
    const { data: existing } = await svc
      .from('readiness_scores')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (existing) {
      return NextResponse.json(existing)
    }

    // Compute if missing
    const result = await computeAndUpsertReadiness(user.id)
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'حدث خطأ غير متوقع' }, { status: 500 })
  }
}

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول' }, { status: 401 })
    }

    const result = await computeAndUpsertReadiness(user.id)
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'حدث خطأ غير متوقع' }, { status: 500 })
  }
}
