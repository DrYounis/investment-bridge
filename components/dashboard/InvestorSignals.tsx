'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

const SIGNAL_LABELS: Record<string, string> = {
  profile_view: '👀 مستثمر شاهد ملفك',
  deck_download: '📥 مستثمر حمّل عرضك التقديمي',
  interest: '⭐ مستثمر أبدى اهتماماً بمشروعك',
  sector_view: '🔎 مستثمر مهتم بقطاع {sector} تصفح مشاريع مشابهة',
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'الآن'
  if (mins < 60) return `منذ ${mins} دقيقة`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `منذ ${hours} ساعة`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'منذ يوم'
  if (days === 2) return 'منذ يومين'
  if (days <= 10) return `منذ ${days} أيام`
  return `منذ ${days} يوماً`
}

interface Signal {
  id: string
  signal_type: string
  sector: string | null
  created_at: string
}

export default function InvestorSignals() {
  const router = useRouter()
  const supabase = createClient()
  const [signals, setSignals] = useState<Signal[]>([])
  const [loading, setLoading] = useState(true)
  const [hasInterest, setHasInterest] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data } = await supabase
        .from('investor_signals')
        .select('id, signal_type, sector, created_at')
        .eq('entrepreneur_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)

      if (data) {
        setSignals(data)
        setHasInterest(data.some((s) => s.signal_type === 'interest'))
      }
      setLoading(false)
    }
    load()
  }, [supabase, router])

  function formatLabel(s: Signal): string {
    let label = SIGNAL_LABELS[s.signal_type] || '📌 إشارة جديدة'
    if (s.signal_type === 'sector_view' && s.sector) {
      label = label.replace('{sector}', s.sector)
    }
    return label
  }

  return (
    <div
      className="rounded-2xl p-6 border border-[#1a2540]"
      style={{ background: '#0d1628', fontFamily: 'var(--font-tajawal), sans-serif' }}
      dir="rtl"
    >
      <h3 className="text-lg font-bold text-white mb-5 text-right">📡 إشارات المستثمرين</h3>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="marfa-skeleton w-2.5 h-2.5 rounded-full mt-1" />
              <div className="flex-1 space-y-2">
                <div className="marfa-skeleton h-4 w-3/4 rounded" />
                <div className="marfa-skeleton h-3 w-1/4 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : signals.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-sm text-[#64748b] mb-4" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            لا توجد إشارات بعد — أكمل ملفك وارفع عرضك ليصل إلى المستثمرين
          </p>
          <Link
            href="/dashboard/profile"
            className="text-sm font-bold text-[#c9a84c] hover:underline"
            style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
          >
            أكمل ملفك ↗
          </Link>
        </div>
      ) : (
        <div>
          {hasInterest && (
            <div className="mb-4 p-3 rounded-xl bg-[#c9a84c]/10 border border-[#c9a84c]/20 text-center">
              <Link
                href="/dashboard/deals"
                className="text-sm font-bold text-[#c9a84c] hover:underline"
                style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
              >
                مستثمر مهتم بمشروعك! جهّز غرفة الصفقة 🤝
              </Link>
            </div>
          )}

          <div className="relative pr-6">
            <div className="absolute right-0 top-2 bottom-2 w-0.5 rounded-full" style={{ background: 'rgba(201,168,76,0.3)' }} />
            <div className="space-y-5">
              {signals.map((s) => (
                <div key={s.id} className="relative">
                  <div
                    className="absolute right-[-23px] top-1.5 w-2.5 h-2.5 rounded-full z-10"
                    style={{ background: '#c9a84c' }}
                  />
                  <p className="text-white text-sm" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                    {formatLabel(s)}
                  </p>
                  <span className="text-xs text-[#64748b] mt-1 block" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                    {timeAgo(s.created_at)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
