'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface DealRoom {
  id: string
  status: string
  created_at: string
  entrepreneur_id: string
  investor_id: string
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending: { label: 'قيد الانتظار', color: '#e0b252' },
  active: { label: 'نشطة', color: '#c9a84c' },
  closed: { label: 'مغلقة', color: '#64748b' },
}

export default function DealsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [rooms, setRooms] = useState<DealRoom[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login?redirect=/dashboard/deals'); return }
      setUserId(user.id)

      const { data } = await supabase
        .from('deal_rooms')
        .select('*')
        .or(`entrepreneur_id.eq.${user.id},investor_id.eq.${user.id}`)
        .order('created_at', { ascending: false })

      setRooms(data || [])
      setLoading(false)
    }
    init()
  }, [supabase, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center" dir="rtl">
        <div className="text-[#8a9bb8]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          جاري التحميل...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] p-4 md:p-8 pt-24 md:pt-32 max-w-5xl mx-auto" dir="rtl" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
      <Link
        href="/dashboard/hub"
        className="inline-flex items-center gap-2 text-[#a0aec0] hover:text-[#c9a84c] font-bold text-sm mb-8 transition-colors"
      >
        ← العودة إلى لوحة التحكم
      </Link>

      <h1 className="text-3xl font-black text-white mb-2">🤝 غرف الصفقات</h1>
      <p className="text-[#a0aec0] mb-8">إدارة محادثاتك مع المستثمرين</p>

      {rooms.length === 0 ? (
        <div className="bg-[#0d1628] rounded-2xl p-10 border border-[#1a2540] text-center">
          <p className="text-[#64748b] mb-4">لا توجد غرف صفقات بعد</p>
          <p className="text-sm text-[#64748b]">
            عندما يبدي مستثمر اهتماماً بمشروعك، ستظهر الغرفة هنا
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {rooms.map((room) => {
            const cfg = STATUS_CONFIG[room.status] || STATUS_CONFIG.pending
            const counterpart = userId === room.entrepreneur_id ? 'مستثمر' : 'رائد أعمال'
            return (
              <Link
                key={room.id}
                href={`/dashboard/deals/${room.id}`}
                className="block bg-[#0d1628] rounded-2xl p-6 border border-[#1a2540] hover:border-[#c9a84c]/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-bold">{counterpart}</p>
                    <p className="text-xs text-[#64748b] mt-1">
                      {new Date(room.created_at).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{ background: `${cfg.color}15`, color: cfg.color, border: `1px solid ${cfg.color}33` }}
                  >
                    {cfg.label}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
