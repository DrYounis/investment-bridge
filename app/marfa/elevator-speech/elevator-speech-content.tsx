'use client'

import { useState } from 'react'

export default function ElevatorSpeechContent({ headHtml, bodyHtml }: { headHtml: string; bodyHtml: string }) {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [subscribed, setSubscribed] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('elevator_speech_subscribed') === 'true'
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !email.includes('@')) {
      setError('يرجى إدخال بريد إلكتروني صحيح')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'حدث خطأ، حاول مرة أخرى')
        setSubmitting(false)
        return
      }

      localStorage.setItem('elevator_speech_subscribed', 'true')
      setSubscribed(true)
    } catch {
      setError('حدث خطأ في الاتصال، حاول مرة أخرى')
    }
    setSubmitting(false)
  }

  if (!subscribed) {
    return (
      <div
        style={{
          fontFamily: "'Tajawal', sans-serif",
          minHeight: '100vh',
          background: '#0a0f1e',
          backgroundImage: 'radial-gradient(ellipse at 20% 30%, rgba(201,168,76,0.05) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(59,130,246,0.04) 0%, transparent 50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          direction: 'rtl',
          padding: '1.5rem',
        }}
      >
        <div
          style={{
            background: '#111827',
            border: '1px solid rgba(201,168,76,0.25)',
            borderRadius: '20px',
            padding: '2.5rem 2rem',
            maxWidth: '440px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 0 40px rgba(201,168,76,0.08)',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '1rem' }}>🎙️</div>
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              color: '#ffffff',
              marginBottom: '0.5rem',
              lineHeight: 1.4,
            }}
          >
            خطاب المصعد في{' '}
            <span style={{ color: '#c9a84c' }}>20 ثانية</span>
          </h2>
          <p
            style={{
              fontSize: '0.9rem',
              color: 'rgba(255,255,255,0.6)',
              marginBottom: '1.75rem',
              lineHeight: 1.7,
            }}
          >
            أدخل بريدك الإلكتروني للدخول إلى أداة التدريب المجانية
          </p>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError('') }}
              placeholder="example@email.com"
              required
              dir="ltr"
              style={{
                background: '#1a2235',
                border: error ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                color: '#ffffff',
                padding: '14px 16px',
                fontSize: '16px',
                fontFamily: "'Tajawal', sans-serif",
                width: '100%',
                textAlign: 'left',
                marginBottom: error ? '0.5rem' : '1rem',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(201,168,76,0.6)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = error ? '#ef4444' : 'rgba(255,255,255,0.1)'
              }}
            />

            {error && (
              <p style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: '0.75rem', textAlign: 'right' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              style={{
                background: submitting
                  ? 'rgba(201,168,76,0.5)'
                  : 'linear-gradient(135deg, #c9a84c 0%, #a07830 100%)',
                color: '#0a0f1e',
                border: 'none',
                padding: '15px 36px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 800,
                fontFamily: "'Tajawal', sans-serif",
                cursor: submitting ? 'not-allowed' : 'pointer',
                width: '100%',
                transition: 'all 0.25s',
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? 'جاري الدخول...' : 'دخول'}
            </button>
          </form>

          <p
            style={{
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.35)',
              marginTop: '1.25rem',
              lineHeight: 1.6,
            }}
          >
            لن نشارك بريدك مع أي طرف. ستستخدم فقط لإرسال تحديثات المنصة.
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: headHtml }} />
      <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: bodyHtml }} />
    </>
  )
}
