'use client'

import { useState } from 'react'
import Link from 'next/link'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Card from '../../components/ui/Card'
import { createClient } from '../../../lib/supabase/client'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)
        try {
            const url = process.env.NEXT_PUBLIC_SUPABASE_URL
            const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
            const res = await fetch(`${url}/auth/v1/token?grant_type=password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', apikey: key! },
                body: JSON.stringify({ email, password }),
            })
            const data = await res.json()
            if (!res.ok || data.error || !data.access_token) {
                const msg = data.msg || data.error_description || 'Login failed'
                setError(msg.includes('Invalid') ? 'بريد إلكتروني أو كلمة مرور غير صحيحة' : msg)
                setIsLoading(false)
                return
            }
            const supabase = createClient()
            await supabase.auth.setSession({ access_token: data.access_token, refresh_token: data.refresh_token })
            window.location.href = '/dashboard/hub'
        } catch (err) {
            setError('حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.')
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <p className="text-center text-foreground/70 mb-8">تسجيل الدخول</p>
                <Card glass className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input label="البريد الإلكتروني" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="example@email.com" />
                        <Input label="كلمة المرور" type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="كلمة المرور" />
                        {error && <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded text-sm">{error}</div>}
                        <Button type="submit" fullWidth size="lg" isLoading={isLoading}>تسجيل الدخول</Button>
                        <p className="text-center text-sm"><span className="text-foreground/60">ليس لديك حساب؟ </span><Link href="/register" className="text-blue-600 hover:underline">إنشاء حساب جديد</Link></p>
                    </form>
                </Card>
                <p className="text-center mt-6"><Link href="/" className="text-sm text-foreground/60 hover:text-foreground">← العودة للصفحة الرئيسية</Link></p>
            </div>
        </div>
    )
}
