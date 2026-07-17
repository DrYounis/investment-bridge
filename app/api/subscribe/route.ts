import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

// Simple rate-limit: track IPs in memory (resets on cold start — acceptable for a public sub endpoint)
const ipWindow = new Map<string, number>()

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const now = Date.now()

    // Rate limit: max 3 subscriptions per IP per hour
    const windowKey = `${ip}:${Math.floor(now / 3600000)}`
    const count = ipWindow.get(windowKey) || 0
    if (count >= 3) {
      return NextResponse.json({ error: 'عدد المحاولات كبير جداً، حاول لاحقاً' }, { status: 429 })
    }
    ipWindow.set(windowKey, count + 1)

    const { email } = await request.json()

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'البريد الإلكتروني مطلوب' }, { status: 400 })
    }

    // Basic email validation — reject obviously fake addresses
    const normalized = email.trim().toLowerCase()
    if (normalized.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      return NextResponse.json({ error: 'صيغة البريد الإلكتروني غير صالحة' }, { status: 400 })
    }

    const supabase = createServiceClient()
    const { error } = await supabase
      .from('meeting_subscribers')
      .upsert(
        { email: normalized, source: 'elevator_speech' },
        { onConflict: 'email' }
      )

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ success: true })
      }
      console.error('SUBSCRIBE_ERROR', error.message)
      return NextResponse.json({ error: 'حدث خطأ، حاول لاحقاً' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'حدث خطأ غير متوقع' }, { status: 500 })
  }
}
