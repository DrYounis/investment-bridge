import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { computeAndUpsertReadiness } from '@/lib/readiness'

const MAX_PITCH_LENGTH = 8000
const MAX_AUDITS_PER_DAY = 3

function stripFences(text: string): string {
  let t = text.trim()
  if (t.startsWith('```json')) t = t.slice(7)
  else if (t.startsWith('```')) t = t.slice(3)
  if (t.endsWith('```')) t = t.slice(0, -3)
  return t.trim()
}

export async function POST(req: NextRequest) {
  try {
    // Auth check
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول' }, { status: 401 })
    }

    // Parse body
    let body: { pitch_text?: string }
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'طلب غير صالح' }, { status: 400 })
    }

    const pitchText = body.pitch_text?.trim()
    if (!pitchText) {
      return NextResponse.json({ error: 'يرجى إدخال نص العرض' }, { status: 400 })
    }
    if (pitchText.length > MAX_PITCH_LENGTH) {
      return NextResponse.json({ error: `النص طويل جداً — الحد الأقصى ${MAX_PITCH_LENGTH} حرف` }, { status: 400 })
    }

    // Rate limit: max 3 per day
    const svc = createServiceClient()
    const today = new Date().toISOString().split('T')[0]
    const { count } = await svc
      .from('pitch_audits')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', today)
    if (count && count >= MAX_AUDITS_PER_DAY) {
      return NextResponse.json({ error: 'لقد استخدمت الحد اليومي للمدقق الذكي (٣ مرات). حاول غداً' }, { status: 429 })
    }

    // Call Claude
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'الخدمة غير متاحة حالياً' }, { status: 503 })
    }

    const systemPrompt = `You are an investment analyst for Marfa (marfa.sa), a Saudi platform connecting entrepreneurs with investors, aligned with Vision 2030. Analyze the following pitch text written by a Saudi entrepreneur. Respond ONLY with valid JSON, no markdown fences, no preamble. All string values must be in Arabic. Schema:
{
  "strengths": [3-5 strings — نقاط القوة],
  "gaps": [3-5 strings — الثغرات وما ينقص العرض],
  "investor_questions": [4-6 strings — أسئلة يطرحها المستثمر السعودي عادة على هذا العرض],
  "suggested_scores": { "team": 0-25, "financials": 0-25, "pitch": 0-25, "traction": 0-25 }
}
Be specific to the actual content. Reference Saudi/Gulf market context where relevant.`

    let auditResult
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1500,
          messages: [
            { role: 'user', content: `${systemPrompt}\n\nPitch text:\n"""${pitchText}"""` },
          ],
        }),
      })

      if (!res.ok) {
        return NextResponse.json({ error: 'حدث خطأ في التحليل. حاول مرة أخرى' }, { status: 502 })
      }

      const data = await res.json()
      const raw = data.content?.[0]?.text || ''
      auditResult = JSON.parse(stripFences(raw))
    } catch {
      return NextResponse.json({ error: 'حدث خطأ أثناء تحليل العرض. حاول مرة أخرى' }, { status: 500 })
    }

    // Save audit
    const { data: savedAudit } = await svc
      .from('pitch_audits')
      .insert({
        user_id: user.id,
        pitch_text: pitchText,
        strengths: auditResult.strengths || [],
        gaps: auditResult.gaps || [],
        investor_questions: auditResult.investor_questions || [],
        suggested_scores: auditResult.suggested_scores || {},
      })
      .select('id')
      .single()

    // Update readiness with the audit link
    if (savedAudit) {
      await svc
        .from('readiness_scores')
        .upsert({ user_id: user.id, last_ai_audit_id: savedAudit.id }, { onConflict: 'user_id' })
    }

    // Recompute readiness
    const readiness = await computeAndUpsertReadiness(user.id)

    return NextResponse.json({ audit: auditResult, readiness })
  } catch {
    return NextResponse.json({ error: 'حدث خطأ غير متوقع' }, { status: 500 })
  }
}
