'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const GRADE_COLORS: Record<string, string> = { A: '#c9a84c', B: '#8fbf6f', C: '#e0b252', D: '#c96a4c' }

interface ScoreData {
  total_score: number
  grade: string
  team_score: number
  financials_score: number
  pitch_score: number
  traction_score: number
}

function RingGauge({ percent, grade }: { percent: number; grade: string }) {
  const radius = 44
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percent / 100) * circumference
  const color = GRADE_COLORS[grade] || GRADE_COLORS.D

  return (
    <svg width="110" height="110" viewBox="0 0 110 110" className="-rotate-90">
      <circle cx="55" cy="55" r={radius} fill="none" stroke="#1a2540" strokeWidth="7" />
      <circle
        cx="55" cy="55" r={radius}
        fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"
        strokeDasharray={circumference} strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
      />
      <text
        x="55" y="52" textAnchor="middle" fill={color}
        fontSize="28" fontWeight="900"
        fontFamily="var(--font-tajawal), sans-serif"
        transform="rotate(90, 55, 55)"
      >
        {grade}
      </text>
    </svg>
  )
}

function BarRow({ label, score }: { label: string; score: number }) {
  const pct = Math.round((score / 25) * 100)
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-[#a0aec0] w-28 shrink-0 text-right" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
        {label}
      </span>
      <div className="flex-1 h-2.5 rounded-full bg-[#1a2540] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${Math.max(4, pct)}%`, background: '#c9a84c' }}
        />
      </div>
      <span className="text-xs text-[#64748b] w-8 text-left tabular-nums" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
        {score}/25
      </span>
    </div>
  )
}

export default function ReadinessScore() {
  const router = useRouter()
  const supabase = createClient()
  const [data, setData] = useState<ScoreData | null>(null)
  const [loading, setLoading] = useState(true)
  const [recomputing, setRecomputing] = useState(false)
  const [error, setError] = useState('')
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    let ignore = false
    ;(async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { router.push('/login'); return }
        if (!ignore) setAuthChecked(true)
        const res = await fetch('/api/readiness')
        if (res.ok && !ignore) {
          const json = await res.json()
          setData(json)
        } else if (!res.ok && !ignore) {
          setError('تعذر تحميل مؤشر الجاهزية')
        }
      } catch {
        if (!ignore) setError('حدث خطأ في الاتصال')
      }
      if (!ignore) setLoading(false)
    })()
    return () => { ignore = true }
  }, [router, supabase.auth])

  async function handleRecompute() {
    setRecomputing(true)
    setError('')
    try {
      const res = await fetch('/api/readiness', { method: 'POST' })
      if (res.ok) {
        const json = await res.json()
        setData(json)
      } else {
        setError('فشل إعادة الاحتساب — حاول مرة أخرى')
      }
    } catch {
      setError('حدث خطأ في الاتصال')
    }
    setRecomputing(false)
  }

  function ctaLabel(): string {
    if (!data) return ''
    const scores = [
      { key: 'financials', label: 'أضف توقعاتك المالية لرفع تقييمك ↗', score: data.financials_score },
      { key: 'pitch', label: 'ارفع عرضك التقديمي وشغّل المدقق الذكي ↗', score: data.pitch_score },
      { key: 'team', label: 'أكمل ملفك الشخصي لرفع تقييمك ↗', score: data.team_score },
      { key: 'traction', label: 'تفاعل المستثمرين يرفع هذا المؤشر تلقائياً', score: data.traction_score },
    ]
    scores.sort((a, b) => a.score - b.score)
    return scores[0].label
  }

  return (
    <div
      className="rounded-2xl p-6 border border-[#1a2540]"
      style={{ background: '#0d1628', fontFamily: 'var(--font-tajawal), sans-serif' }}
      dir="rtl"
    >
      <h3 className="text-lg font-bold text-white mb-5 text-right">
        مؤشر الجاهزية الاستثمارية
      </h3>

      {loading || !authChecked ? (
        <div className="flex flex-col items-center gap-4">
          <div className="marfa-skeleton w-[110px] h-[110px] rounded-full" />
          <div className="space-y-2 w-full">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="marfa-skeleton h-5 w-full rounded" />
            ))}
          </div>
        </div>
      ) : data ? (
        <div className="flex flex-col items-center gap-5">
          <RingGauge percent={data.total_score} grade={data.grade} />

          <div className="w-full space-y-3">
            <BarRow label="الفريق والملف الشخصي" score={data.team_score} />
            <BarRow label="النموذج المالي" score={data.financials_score} />
            <BarRow label="العرض التقديمي" score={data.pitch_score} />
            <BarRow label="الجاذبية السوقية" score={data.traction_score} />
          </div>

          <p className="text-xs text-[#c9a84c] text-center leading-relaxed" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            {ctaLabel()}
          </p>

          <button
            onClick={handleRecompute}
            disabled={recomputing}
            className="px-5 py-2 rounded-xl text-sm font-bold border border-[#c9a84c]/40 text-[#c9a84c] hover:bg-[#c9a84c]/10 transition-colors disabled:opacity-40"
            style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
          >
            {recomputing ? (
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 border-2 border-[#c9a84c]/30 border-t-[#c9a84c] rounded-full animate-spin" />
                جاري الاحتساب...
              </span>
            ) : (
              'إعادة احتساب'
            )}
          </button>
        </div>
      ) : error ? (
        <div className="text-center py-6 space-y-3">
          <p className="text-sm text-[#ef4444]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>{error}</p>
          <button
            onClick={handleRecompute}
            disabled={recomputing}
            className="px-5 py-2 rounded-xl text-sm font-bold border border-[#c9a84c]/40 text-[#c9a84c] hover:bg-[#c9a84c]/10 transition-colors disabled:opacity-40"
            style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
          >
            {recomputing ? 'جارٍ المحاولة...' : 'حاول مرة أخرى'}
          </button>
        </div>
      ) : null}
    </div>
  )
}
