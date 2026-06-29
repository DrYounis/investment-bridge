'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AuthAwareLinks() {
  const [user, setUser] = useState<boolean | null>(null)

  useEffect(() => {
    try {
      const supabase = createClient()
      supabase.auth.getUser().then(({ data }) => {
        setUser(!!data.user)
      }).catch(() => {
        setUser(false)
      })
    } catch {
      setUser(false)
    }
  }, [])

  if (user === null) {
    // Loading — show skeleton
    return (
      <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-12" style={{ zIndex: 10 }}>
        <div className="px-10 py-5 bg-white/5 rounded-2xl animate-pulse h-16 w-40" />
        <div className="px-10 py-5 bg-white/5 rounded-2xl animate-pulse h-16 w-40" />
      </div>
    )
  }

  if (user) {
    return (
      <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-12" style={{ zIndex: 10 }}>
        <a
          href="/dashboard/hub"
          className="px-10 py-5 bg-deep-navy text-gold text-lg font-black rounded-2xl hover:bg-primary-dark hover:scale-105 hover:shadow-2xl hover:shadow-gold/20 transition-all duration-300 border border-gold/30 inline-block"
        >
          لوحة التحكم
        </a>
        <a
          href="/marfa"
          className="px-10 py-5 bg-transparent text-white border-2 border-gold/50 text-lg font-black rounded-2xl hover:bg-gold/5 hover:scale-105 hover:shadow-xl transition-all duration-300 inline-block"
        >
          مختبر مرفأ
        </a>
      </div>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-12" style={{ zIndex: 10 }}>
      <a
        href="/login"
        className="px-10 py-5 bg-deep-navy text-gold text-lg font-black rounded-2xl hover:bg-primary-dark hover:scale-105 hover:shadow-2xl hover:shadow-gold/20 transition-all duration-300 border border-gold/30 inline-block"
      >
        تسجيل الدخول
      </a>
      <a
        href="/register"
        className="px-10 py-5 bg-transparent text-white border-2 border-gold/50 text-lg font-black rounded-2xl hover:bg-gold/5 hover:scale-105 hover:shadow-xl transition-all duration-300 inline-block"
      >
        إنشاء حساب
      </a>
    </div>
  )
}
