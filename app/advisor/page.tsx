'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

// ── Types ───────────────────────────────────────────────────────────

type Stage = 0 | 1 | 2 | 3 | 4
type Phase = '💡 فكرة فقط' | '🌱 بداية وتنفيذ' | '🚀 نمو وتوسع' | '🔄 إعادة توجيه'
interface AngleResult { angle: string; content: string; color: string }
interface CanvasData { partners: string; activities: string; value_prop: string; relations: string; segments: string; resources: string; channels: string; costs: string; revenues: string }
interface PlanChannel { name: string; priority: string; tactic: string }
interface PlanPhase { phase: string; focus: string }
interface MarketingPlan { positioning: string; channels: PlanChannel[]; message_primary: string; message_secondary: string; phases: PlanPhase[]; kpis: string[] }

const ANGLES = [
  { id: 'value', name: 'القيمة المقدمة', color: '#c9a84c' },
  { id: 'customer', name: 'العميل المستهدف', color: '#5dcaa5' },
  { id: 'revenue', name: 'نموذج الإيرادات', color: '#8777dd' },
  { id: 'ops', name: 'العمليات الأساسية', color: '#d85a30' },
  { id: 'marketing', name: 'قنوات الوصول', color: '#378add' },
  { id: 'advantage', name: 'الميزة التنافسية', color: '#63992e' },
]

const PHASES: Phase[] = ['💡 فكرة فقط', '🌱 بداية وتنفيذ', '🚀 نمو وتوسع', '🔄 إعادة توجيه']

const CANVAS_KEYS: (keyof CanvasData)[] = ['partners', 'activities', 'value_prop', 'relations', 'segments', 'resources', 'channels', 'costs', 'revenues']
const CANVAS_LABELS: Record<keyof CanvasData, string> = {
  partners: 'الشركاء الرئيسيون', activities: 'الأنشطة الأساسية', value_prop: 'عرض القيمة',
  relations: 'علاقات العملاء', segments: 'شرائح العملاء', resources: 'الموارد الرئيسية',
  channels: 'قنوات التوزيع', costs: 'هيكل التكاليف', revenues: 'مصادر الإيرادات',
}

export default function AdvisorPage() {
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  const [stage, setStage] = useState<Stage>(0)
  const [idea, setIdea] = useState('')
  const [phase, setPhase] = useState<Phase | null>(null)
  const [angles, setAngles] = useState<AngleResult[]>([])
  const [activeAngle, setActiveAngle] = useState(0)
  const [canvas, setCanvas] = useState<CanvasData | null>(null)
  const [plan, setPlan] = useState<MarketingPlan | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const supabase = createClient()

  // ── Auth check on mount ──
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null)
      setAuthLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  // ── Logout handler ──
  async function handleLogout() {
    await supabase.auth.signOut()
    setUser(null)
    setStage(0)
    setIdea('')
    setPhase(null)
    setAngles([])
    setCanvas(null)
    setPlan(null)
  }

  // ── AI call helper ──
  async function callClaude(prompt: string): Promise<string> {
    const res = await fetch('/api/claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] }),
    })
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    const data = await res.json()
    return data.content?.[0]?.text ?? data.content ?? ''
  }

  // ── Stage 0 → Stage 1 ──
  function handleStart() {
    if (!idea.trim() || idea.trim().length < 10) return
    if (!phase) return
    setStage(1)
    runAngles()
  }

  // ── Stage 1: 360 wheel ──
  async function runAngles() {
    setLoading(true)
    setError('')
    const results: AngleResult[] = []
    for (let i = 0; i < ANGLES.length; i++) {
      setActiveAngle(i)
      const a = ANGLES[i]
      try {
        const prompt = `أنت مستشار أعمال استراتيجي متخصص في السوق السعودي.
المشروع: ${idea} — المرحلة: ${phase}
قيّم من زاوية "${a.name}" فقط.
اكتب 3-4 جمل عربية: الواقع الحالي، أهم فرصة، أهم تحدٍّ. بدون عناوين.`
        const text = await callClaude(prompt)
        results.push({ angle: a.id, content: text, color: a.color })
      } catch {
        results.push({ angle: a.id, content: 'تعذر التحليل — يرجى المحاولة مرة أخرى.', color: a.color })
      }
    }
    setAngles(results)
    setLoading(false)
    setStage(2)
  }

  // ── Stage 2: Canvas ──
  async function runCanvas() {
    setLoading(true)
    setError('')
    try {
      const prompt = `أنت مستشار أعمال. مشروع: ${idea} — المرحلة: ${phase}.
حلل نموذج العمل التجاري من جميع الجوانب. أعد JSON فقط:
{
  "partners": "2-3 جمل عربية",
  "activities": "2-3 جمل عربية",
  "value_prop": "2-3 جمل عربية",
  "relations": "2-3 جمل عربية",
  "segments": "2-3 جمل عربية",
  "resources": "2-3 جمل عربية",
  "channels": "2-3 جمل عربية",
  "costs": "2-3 جمل عربية",
  "revenues": "2-3 جمل عربية"
}`
      const text = await callClaude(prompt)
      const json = JSON.parse(text.replace(/```json|```/g, '').trim())
      setCanvas(json as CanvasData)
      setStage(3)
    } catch (e) {
      setError('فشل تحليل نموذج العمل. حاول مرة أخرى.')
    }
    setLoading(false)
  }

  // ── Stage 3: Marketing Plan ──
  async function runPlan() {
    setLoading(true)
    setError('')
    try {
      const prompt = `أنت مستشار تسويقي متخصص في السوق السعودي.
المشروع: ${idea} — المرحلة: ${phase}.
ضع خطة تسويقية كاملة. أعد JSON فقط:
{
  "positioning": "جملتان عن التموضع",
  "channels": [
    {"name": "اسم القناة", "priority": "أولوية قصوى|عالية|متوسطة", "tactic": "التكتيك"}
  ],
  "message_primary": "الرسالة التسويقية الأساسية",
  "message_secondary": "الرسالة الثانوية",
  "phases": [
    {"phase": "اسم المرحلة", "focus": "التركيز"}
  ],
  "kpis": ["مؤشر1", "مؤشر2", "مؤشر3"]
}
أعد 4 قنوات، 3 مراحل، 3 مؤشرات.`
      const text = await callClaude(prompt)
      const json = JSON.parse(text.replace(/```json|```/g, '').trim())
      setPlan(json as MarketingPlan)
      setStage(4)
    } catch (e) {
      setError('فشل تحليل الخطة التسويقية. حاول مرة أخرى.')
    }
    setLoading(false)
  }

  // ── Save to Supabase ──
  const saveToSupabase = useCallback(async () => {
    if (!user || !idea || !phase) return
    try {
      await supabase.from('advisor_sessions').insert({
        user_id: user.id,
        idea,
        phase,
        analyses: angles.length ? angles : undefined,
        canvas_data: canvas ?? undefined,
        plan_data: plan ?? undefined,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 4000)
    } catch { /* silent */ }
  }, [user, idea, phase, angles, canvas, plan])

  useEffect(() => {
    if (stage === 4 && plan) saveToSupabase()
  }, [stage, plan, saveToSupabase])

  function handleReset() {
    setStage(0)
    setIdea('')
    setPhase(null)
    setAngles([])
    setCanvas(null)
    setPlan(null)
    setError('')
  }

  // ── Loading state ──
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0f1e' }}>
        <div className="w-8 h-8 border-2 border-transparent border-t-[#c9a84c] rounded-full animate-spin" />
      </div>
    )
  }

  // ── Auth Gate ──
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 font-[Tajawal]" dir="rtl" style={{ background: '#0a0f1e' }}>
        <div className="w-full max-w-[420px] p-8 rounded-2xl border text-center" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(201,168,76,0.2)' }}>
          <div className="text-4xl mb-4">🔐</div>
          <h1 className="text-xl font-bold mb-2" style={{ color: '#f0ece3' }}>تسجيل الدخول مطلوب</h1>
          <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
            سجّل الدخول أو أنشئ حساباً للوصول إلى المستشار الذكي وحفظ تحليلك
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/login?redirect=/advisor"
              className="block w-full py-3 rounded-xl font-bold text-sm text-center transition"
              style={{ background: '#c9a84c', color: '#0a0f1e' }}
            >
              تسجيل الدخول
            </Link>
            <Link
              href="/register?redirect=/advisor"
              className="block w-full py-3 rounded-xl font-bold text-sm text-center transition"
              style={{ background: 'rgba(201,168,76,0.1)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.3)' }}
            >
              إنشاء حساب جديد
            </Link>
          </div>
          <div className="mt-4">
            <Link href="/" className="text-xs underline" style={{ color: 'rgba(255,255,255,0.4)' }}>العودة للصفحة الرئيسية</Link>
          </div>
        </div>
      </div>
    )
  }

  // ── Advisor ──
  return (
    <div className="min-h-screen font-[Tajawal]" dir="rtl" style={{ background: '#0a0f1e', color: '#f0ece3' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold" style={{ color: '#c9a84c' }}>Marfa 360°</span>
          <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(201,168,76,0.1)', color: '#c9a84c' }}>مستشار استراتيجي</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{user.email}</span>
          <button onClick={handleLogout} className="text-xs px-3 py-1.5 rounded-lg transition" style={{ color: 'rgba(255,255,255,0.6)', border: '0.5px solid rgba(255,255,255,0.1)' }}>
            خروج
          </button>
        </div>
      </header>

      {/* Stepper */}
      <div className="flex border-b" style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
        {['مشروعك', 'التحليل ٣٦٠°', 'نموذج العمل', 'الخطة التسويقية'].map((label, i) => (
          <div
            key={i}
            className="flex-1 text-center py-3 text-sm font-bold transition border-b-2"
            style={{
              color: stage > i ? 'rgba(201,168,76,0.5)' : stage === i ? '#c9a84c' : 'rgba(255,255,255,0.2)',
              borderBottomColor: stage === i ? '#c9a84c' : 'transparent',
            }}
          >
            {stage > i ? '✓ ' : ''}{label}
          </div>
        ))}
      </div>

      <div className="max-w-5xl mx-auto p-6">
        {/* Saved toast */}
        {saved && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl text-sm font-bold shadow-lg" style={{ background: '#10b981', color: '#fff' }}>
            ✓ تم حفظ تحليلك
          </div>
        )}

        {/* Loading overlay */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-2 border-transparent border-t-[#c9a84c] rounded-full animate-spin" />
          </div>
        )}

        {/* ── Stage 0: Project Input ── */}
        {!loading && stage === 0 && (
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-center" style={{ color: '#c9a84c' }}>مرحباً — لنبدأ بتحليل مشروعك</h2>
            <textarea
              value={idea}
              onChange={e => setIdea(e.target.value)}
              placeholder="اكتب فكرة مشروعك هنا... (10 أحرف على الأقل)"
              className="w-full p-4 rounded-xl text-sm outline-none h-32 resize-none"
              style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(201,168,76,0.3)', color: '#f0ece3' }}
            />
            <p className="text-xs" style={{ color: idea.trim().length < 10 ? '#ef4444' : 'rgba(255,255,255,0.3)' }}>
              {idea.trim().length} / 10
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {PHASES.map(p => (
                <button
                  key={p}
                  onClick={() => setPhase(p)}
                  className="px-4 py-2 rounded-full text-sm font-bold transition"
                  style={{
                    background: phase === p ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.04)',
                    color: phase === p ? '#c9a84c' : 'rgba(255,255,255,0.6)',
                    border: `0.5px solid ${phase === p ? 'rgba(201,168,76,0.5)' : 'rgba(255,255,255,0.06)'}`,
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              onClick={handleStart}
              disabled={idea.trim().length < 10 || !phase}
              className="w-full py-4 rounded-2xl font-bold text-lg transition disabled:opacity-30 hover:brightness-110"
              style={{ background: '#c9a84c', color: '#0a0f1e' }}
            >
              ابدأ التحليل ٣٦٠°
            </button>
          </div>
        )}

        {/* ── Stage 1: 360° Wheel ── */}
        {!loading && stage >= 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-center" style={{ color: '#c9a84c' }}>التحليل ٣٦٠°</h2>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Wheel SVG */}
              <div className="shrink-0 mx-auto">
                <svg width="260" height="260" viewBox="0 0 260 260">
                  {ANGLES.map((a, i) => {
                    const startAngle = (i * 60 - 90) * Math.PI / 180
                    const endAngle = ((i + 1) * 60 - 90) * Math.PI / 180
                    const cx = 130, cy = 130, r = 110
                    const x1 = cx + r * Math.cos(startAngle)
                    const y1 = cy + r * Math.sin(startAngle)
                    const x2 = cx + r * Math.cos(endAngle)
                    const y2 = cy + r * Math.sin(endAngle)
                    const largeArc = 0
                    const done = angles.length > i
                    const isActive = activeAngle === i && !done
                    const opacity = done ? 1 : isActive ? 0.7 : 0.25
                    return (
                      <path
                        key={a.id}
                        d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc},1 ${x2},${y2} Z`}
                        fill={a.color}
                        opacity={opacity}
                        stroke="#0a0f1e"
                        strokeWidth="2"
                      />
                    )
                  })}
                  <circle cx="130" cy="130" r="40" fill="#0a0f1e" stroke="rgba(201,168,76,0.3)" strokeWidth="1" />
                  <text x="130" y="125" textAnchor="middle" fill="#c9a84c" fontSize="18" fontWeight="bold">360°</text>
                  <text x="130" y="147" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10">تحليل</text>
                </svg>
              </div>

              {/* Angle Cards */}
              <div className="flex-1 space-y-3">
                {ANGLES.map((a, i) => (
                  <div
                    key={a.id}
                    className="p-4 rounded-xl text-sm transition"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: activeAngle === i ? '1px solid rgba(201,168,76,0.5)' : '0.5px solid rgba(255,255,255,0.06)',
                      opacity: angles.length > i ? 1 : activeAngle === i ? 0.9 : 0.4,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-3 h-3 rounded-full" style={{ background: a.color }} />
                      <span className="font-bold" style={{ color: '#f0ece3' }}>{a.name}</span>
                      {angles.length > i && <span style={{ color: '#10b981' }}>✓</span>}
                    </div>
                    {angles.length > i && (
                      <p className="mt-2 leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>{angles[i].content}</p>
                    )}
                    {activeAngle === i && angles.length <= i && (
                      <p className="mt-2" style={{ color: 'rgba(255,255,255,0.3)' }}>جاري التحليل...</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {stage === 1 && angles.length === ANGLES.length && (
              <button onClick={runCanvas} className="w-full py-4 rounded-2xl font-bold text-lg transition hover:brightness-110" style={{ background: '#c9a84c', color: '#0a0f1e' }}>
                التالي: نموذج العمل التجاري
              </button>
            )}
          </div>
        )}

        {/* ── Stage 2: Canvas CTA ── */}
        {!loading && stage === 2 && (
          <div className="flex items-center justify-center py-20">
            <button onClick={runCanvas} className="px-8 py-4 rounded-2xl font-bold text-lg transition hover:brightness-110" style={{ background: '#c9a84c', color: '#0a0f1e' }}>
              تحليل نموذج العمل التجاري
            </button>
          </div>
        )}
        {stage >= 2 && canvas && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-center" style={{ color: '#c9a84c' }}>نموذج العمل التجاري</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {CANVAS_KEYS.map(key => (
                <div
                  key={key}
                  className="p-4 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(201,168,76,0.2)' }}
                >
                  <h3 className="text-sm font-bold mb-2" style={{ color: '#c9a84c' }}>{CANVAS_LABELS[key]}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>{canvas[key]}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {error && stage >= 2 && !canvas && (
          <p className="text-center text-sm py-4" style={{ color: '#ef4444' }}>{error}</p>
        )}

        {/* ── Stage 3: Marketing Plan CTA ── */}
        {!loading && stage === 3 && (
          <div className="flex items-center justify-center py-20">
            <button onClick={runPlan} className="px-8 py-4 rounded-2xl font-bold text-lg transition hover:brightness-110" style={{ background: '#c9a84c', color: '#0a0f1e' }}>
              تحليل الخطة التسويقية
            </button>
          </div>
        )}
        {stage >= 3 && plan && (
          <div className="space-y-8">
            <h2 className="text-xl font-bold text-center" style={{ color: '#c9a84c' }}>الخطة التسويقية</h2>

            {/* Positioning */}
            <div className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(201,168,76,0.2)' }}>
              <h3 className="text-sm font-bold mb-2" style={{ color: '#c9a84c' }}>التموضع</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>{plan.positioning}</p>
            </div>

            {/* Messages */}
            <div className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(201,168,76,0.2)' }}>
              <h3 className="text-sm font-bold mb-2" style={{ color: '#c9a84c' }}>الرسائل التسويقية</h3>
              <p className="text-sm font-bold mb-1" style={{ color: '#f0ece3' }}>{plan.message_primary}</p>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{plan.message_secondary}</p>
            </div>

            {/* Channels */}
            <div className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(201,168,76,0.2)' }}>
              <h3 className="text-sm font-bold mb-3" style={{ color: '#c9a84c' }}>القنوات التسويقية</h3>
              <div className="space-y-3">
                {plan.channels.map((ch, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs px-2 py-0.5 rounded font-bold" style={{
                      background: ch.priority === 'أولوية قصوى' ? 'rgba(201,168,76,0.15)' : ch.priority === 'عالية' ? 'rgba(55,138,221,0.1)' : 'rgba(255,255,255,0.05)',
                      color: ch.priority === 'أولوية قصوى' ? '#c9a84c' : ch.priority === 'عالية' ? '#378add' : 'rgba(255,255,255,0.5)',
                    }}>
                      {ch.priority}
                    </span>
                    <span className="text-sm font-bold" style={{ color: '#f0ece3' }}>{ch.name}</span>
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{ch.tactic}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Roadmap */}
            <div className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(201,168,76,0.2)' }}>
              <h3 className="text-sm font-bold mb-3" style={{ color: '#c9a84c' }}>خارطة الطريق</h3>
              <div className="space-y-2">
                {plan.phases.map((p, i) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <span className="font-bold" style={{ color: '#c9a84c' }}>{p.phase}:</span>
                    <span style={{ color: 'rgba(255,255,255,0.7)' }}>{p.focus}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* KPIs */}
            <div className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(201,168,76,0.2)' }}>
              <h3 className="text-sm font-bold mb-2" style={{ color: '#c9a84c' }}>مؤشرات النجاح</h3>
              <div className="flex flex-wrap gap-2">
                {plan.kpis.map((kpi, i) => (
                  <span key={i} className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                    {kpi}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Error — shown outside data blocks */}
        {error && stage >= 3 && !plan && (
          <p className="text-center text-sm py-4" style={{ color: '#ef4444' }}>{error}</p>
        )}

        {/* Reset — always visible at stage 1+ */}
        {stage >= 1 && (
          <div className="text-center pt-4">
            <button
              onClick={handleReset}
              className="px-8 py-3 rounded-xl text-sm font-bold transition"
              style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.6)', border: '0.5px solid rgba(255,255,255,0.1)' }}
            >
              بدء من جديد
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
