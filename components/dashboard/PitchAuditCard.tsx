'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface AuditResult {
  strengths: string[]
  gaps: string[]
  investor_questions: string[]
}

export default function PitchAuditCard() {
  const router = useRouter()
  const supabase = createClient()
  const [pitchText, setPitchText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AuditResult | null>(null)
  const [error, setError] = useState('')
  const [remaining, setRemaining] = useState(3)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ strengths: true, gaps: true, questions: true })

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/login')
    })
  }, [router, supabase.auth])

  async function handleAudit() {
    if (!pitchText.trim()) return
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/pitch-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pitch_text: pitchText }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'حدث خطأ')
        if (res.status === 429) setRemaining(0)
      } else {
        setResult(data.audit)
        setRemaining((prev) => Math.max(0, prev - 1))
      }
    } catch {
      setError('حدث خطأ في الاتصال')
    }
    setLoading(false)
  }

  function toggleSection(key: string) {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div
      className="rounded-2xl p-6 border border-[#1a2540]"
      style={{ background: '#0d1628', fontFamily: 'var(--font-tajawal), sans-serif' }}
      dir="rtl"
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">🤖</span>
        <h3 className="text-lg font-bold text-white">المدقق الذكي</h3>
      </div>
      <p className="text-sm text-[#64748b] mb-5">احصل على تقييم فوري لعرضك بالذكاء الاصطناعي</p>

      <textarea
        value={pitchText}
        onChange={(e) => { setPitchText(e.target.value); setError('') }}
        placeholder="الصق نص عرضك التقديمي هنا أو اكتب وصف مشروعك…"
        rows={5}
        className="w-full p-4 rounded-xl border border-[#c9a84c]/20 bg-white/5 text-white text-sm resize-none outline-none focus:border-[#c9a84c]/50 transition-colors placeholder:text-[#64748b]"
        style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
        dir="rtl"
      />

      {error && (
        <div className="mt-3 p-3 rounded-lg bg-[#ef4444]/10 border border-[#ef4444]/20 text-[#ef4444] text-sm">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3 mt-3">
        <button
          onClick={handleAudit}
          disabled={loading || !pitchText.trim() || remaining === 0}
          className="px-6 py-2.5 rounded-xl text-sm font-bold text-[#0a0f1e] bg-[#c9a84c] hover:bg-[#d4a843] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 border-2 border-[#0a0f1e]/30 border-t-[#0a0f1e] rounded-full animate-spin" />
              جاري التحليل…
            </span>
          ) : (
            'شغّل التدقيق'
          )}
        </button>
        <span className="text-xs text-[#64748b]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          المحاولات المتبقية اليوم: {remaining} من ٣
        </span>
      </div>

      {result && (
        <div className="mt-5 space-y-3">
          {/* Strengths */}
          <div className="rounded-xl border border-[#10b981]/20 overflow-hidden">
            <button
              onClick={() => toggleSection('strengths')}
              className="w-full flex items-center justify-between px-4 py-3 bg-[#10b981]/5 hover:bg-[#10b981]/10 transition-colors"
            >
              <span className="text-sm font-bold text-[#10b981]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                ✅ نقاط القوة
              </span>
              <span className="text-[#10b981] text-xs">{openSections.strengths ? '▲' : '▼'}</span>
            </button>
            {openSections.strengths && (
              <ul className="px-4 py-3 space-y-2">
                {result.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-[#a0aec0] pr-3" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                    • {s}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Gaps */}
          <div className="rounded-xl border border-[#f59e0b]/20 overflow-hidden">
            <button
              onClick={() => toggleSection('gaps')}
              className="w-full flex items-center justify-between px-4 py-3 bg-[#f59e0b]/5 hover:bg-[#f59e0b]/10 transition-colors"
            >
              <span className="text-sm font-bold text-[#f59e0b]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                ⚠️ الثغرات
              </span>
              <span className="text-[#f59e0b] text-xs">{openSections.gaps ? '▲' : '▼'}</span>
            </button>
            {openSections.gaps && (
              <ul className="px-4 py-3 space-y-2">
                {result.gaps.map((g, i) => (
                  <li key={i} className="text-sm text-[#a0aec0] pr-3" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                    • {g}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Investor Questions */}
          <div className="rounded-xl border border-[#c9a84c]/20 overflow-hidden">
            <button
              onClick={() => toggleSection('questions')}
              className="w-full flex items-center justify-between px-4 py-3 bg-[#c9a84c]/5 hover:bg-[#c9a84c]/10 transition-colors"
            >
              <span className="text-sm font-bold text-[#c9a84c]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                ❓ أسئلة المستثمرين المتوقعة
              </span>
              <span className="text-[#c9a84c] text-xs">{openSections.questions ? '▲' : '▼'}</span>
            </button>
            {openSections.questions && (
              <ul className="px-4 py-3 space-y-2">
                {result.investor_questions.map((q, i) => (
                  <li key={i} className="text-sm text-[#a0aec0] pr-3" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                    • {q}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <p className="text-xs text-[#c9a84c] text-center mt-2" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            تم تحديث مؤشر جاهزيتك تلقائياً ✨
          </p>
        </div>
      )}
    </div>
  )
}
