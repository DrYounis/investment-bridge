'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function AuthAwareLinks() {
  const [user, setUser] = useState<boolean | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUser(!!data.user)
    })
  }, [])

  if (user) {
    return (
      <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-12">
        <Link
          href="/dashboard/hub"
          className="px-10 py-5 bg-deep-navy text-gold text-lg font-black rounded-2xl hover:bg-primary-dark hover:scale-105 hover:shadow-2xl hover:shadow-gold/20 transition-all duration-300 border border-gold/30"
        >
          لوحة التحكم
        </Link>
        <Link
          href="/marfa"
          className="px-10 py-5 bg-transparent text-white border-2 border-gold/50 text-lg font-black rounded-2xl hover:bg-gold/5 hover:scale-105 hover:shadow-xl transition-all duration-300"
        >
          مختبر مرفأ
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-12">
      <Link
        href="/login"
        className="px-10 py-5 bg-deep-navy text-gold text-lg font-black rounded-2xl hover:bg-primary-dark hover:scale-105 hover:shadow-2xl hover:shadow-gold/20 transition-all duration-300 border border-gold/30"
      >
        تسجيل الدخول
      </Link>
      <Link
        href="/register"
        className="px-10 py-5 bg-transparent text-white border-2 border-gold/50 text-lg font-black rounded-2xl hover:bg-gold/5 hover:scale-105 hover:shadow-xl transition-all duration-300"
      >
        إنشاء حساب
      </Link>
    </div>
  )
}
