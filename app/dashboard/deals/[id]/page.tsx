'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface Message {
  id: string
  sender_id: string
  body: string
  created_at: string
}

interface Room {
  id: string
  entrepreneur_id: string
  investor_id: string
  status: string
  nda_acknowledged_by_investor: boolean
  nda_acknowledged_by_entrepreneur: boolean
  counterpart_name?: string
}

export default function DealRoomPage() {
  const router = useRouter()
  const params = useParams()
  const roomId = params.id as string
  const supabase = createClient()
  const [room, setRoom] = useState<Room | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [acknowledging, setAcknowledging] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const fetchMessages = useCallback(async () => {
    const { data } = await supabase
      .from('deal_room_messages')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true })

    if (data) setMessages(data)
  }, [supabase, roomId])

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push(`/login?redirect=/dashboard/deals/${roomId}`); return }
      setUserId(user.id)

      // Fetch room
      const { data: roomData } = await supabase
        .from('deal_rooms')
        .select('*')
        .eq('id', roomId)
        .single()

      if (!roomData) { router.push('/dashboard/deals'); return }
      setRoom(roomData)

      // Fetch counterpart name if room is active
      if (roomData.status === 'active') {
        const counterpartId = user.id === roomData.entrepreneur_id ? roomData.investor_id : roomData.entrepreneur_id
        const { data: cp } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', counterpartId)
          .maybeSingle()
        setRoom((prev) => prev ? { ...prev, counterpart_name: cp?.full_name || '' } : prev)
      }

      // Fetch messages
      await fetchMessages()

      setLoading(false)
    }
    init()
  }, [roomId, fetchMessages, router, supabase])

  // Poll every 10s
  useEffect(() => {
    if (!room || room.status !== 'active') return
    const interval = setInterval(fetchMessages, 10000)
    return () => clearInterval(interval)
  }, [room?.status, fetchMessages, room])

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleAcknowledge() {
    if (!room || !userId) return
    setAcknowledging(true)
    const field = userId === room.entrepreneur_id ? 'nda_acknowledged_by_entrepreneur' : 'nda_acknowledged_by_investor'
    const { data: updated } = await supabase
      .from('deal_rooms')
      .update({ [field]: true })
      .eq('id', roomId)
      .select('*')
      .single()

    if (updated) {
      // If both acknowledged, activate the room
      if (updated.nda_acknowledged_by_entrepreneur && updated.nda_acknowledged_by_investor && updated.status === 'pending') {
        const { data: activated } = await supabase
          .from('deal_rooms')
          .update({ status: 'active' })
          .eq('id', roomId)
          .select('*')
          .single()
        if (activated) setRoom(activated)
      } else {
        setRoom(updated)
      }
    }
    setAcknowledging(false)
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || !room || !userId) return
    setSending(true)
    const { data } = await supabase
      .from('deal_room_messages')
      .insert({ room_id: roomId, sender_id: userId, body: input.trim() })
      .select('*')
      .single()

    if (data) {
      setMessages((prev) => [...prev, data])
      setInput('')
    }
    setSending(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center" dir="rtl">
        <div className="text-[#8a9bb8]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          جاري التحميل...
        </div>
      </div>
    )
  }

  if (!room) return null

  const isEntrepreneur = userId === room.entrepreneur_id
  const needsAck = isEntrepreneur ? !room.nda_acknowledged_by_entrepreneur : !room.nda_acknowledged_by_investor
  const isActive = room.status === 'active'

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex flex-col" dir="rtl" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
      {/* Header */}
      <div className="bg-[#0d1628] border-b border-[#1a2540] p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/dashboard/deals" className="text-[#a0aec0] hover:text-white text-sm font-bold transition-colors">
            ← العودة
          </Link>
          <h2 className="text-white font-bold">
            {isActive && room.counterpart_name ? room.counterpart_name : isEntrepreneur ? 'مستثمر' : 'رائد أعمال'}
          </h2>
          <span
            className="px-3 py-1 rounded-full text-xs font-bold"
            style={{
              background: isActive ? '#c9a84c15' : '#e0b25215',
              color: isActive ? '#c9a84c' : '#e0b252',
              border: `1px solid ${isActive ? '#c9a84c33' : '#e0b25233'}`,
            }}
          >
            {isActive ? 'نشطة' : 'قيد الانتظار'}
          </span>
        </div>
      </div>

      {/* NDA Gate */}
      {needsAck && !isActive ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-[#0d1628] rounded-2xl p-8 max-w-md w-full border border-[#1a2540] text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-bold text-white mb-3">إقرار السرية</h3>
            <p className="text-sm text-[#a0aec0] leading-relaxed mb-6">
              بدخولك غرفة الصفقة، تقر بالحفاظ على سرية جميع المعلومات والمستندات المتبادلة داخلها، وعدم مشاركتها مع أي طرف ثالث.
            </p>
            <button
              onClick={handleAcknowledge}
              disabled={acknowledging}
              className="px-8 py-3 rounded-xl text-sm font-bold text-[#0a0f1e] bg-[#c9a84c] hover:bg-[#d4a843] transition-colors disabled:opacity-40"
            >
              {acknowledging ? 'جاري...' : 'أوافق وأدخل الغرفة'}
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 max-w-4xl mx-auto w-full space-y-4">
            {messages.length === 0 ? (
              <p className="text-center text-[#64748b] mt-20">لا توجد رسائل بعد — ابدأ المحادثة</p>
            ) : (
              messages.map((msg) => {
                const isOwn = msg.sender_id === userId
                return (
                  <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                        isOwn ? 'bg-[#c9a84c]/15 rounded-bl-sm' : 'bg-white/5 rounded-br-sm'
                      }`}
                    >
                      <p className="text-white text-sm leading-relaxed">{msg.body}</p>
                      <span className="text-xs text-[#64748b] mt-1 block">
                        {new Date(msg.created_at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="bg-[#0d1628] border-t border-[#1a2540] p-4">
            <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="اكتب رسالتك…"
                className="flex-1 px-4 py-3 rounded-xl border border-[#1a2540] bg-[#0a0f1e] text-white text-sm outline-none focus:border-[#c9a84c]/50 transition-colors placeholder:text-[#64748b]"
                style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                className="px-6 py-3 rounded-xl text-sm font-bold text-[#0a0f1e] bg-[#c9a84c] hover:bg-[#d4a843] transition-colors disabled:opacity-40 shrink-0"
              >
                {sending ? '...' : 'إرسال'}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  )
}
