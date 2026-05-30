'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Card from '../../components/ui/Card'
import OtpVerification from '../../components/ui/OtpVerification'
import { createClient } from '../../../lib/supabase/client'

function RegisterForm() {
    const [step, setStep] = useState<'form' | 'otp'>('form')
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [successMsg, setSuccessMsg] = useState('')

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)
        try {
            const res = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })
            const data = await res.json()
            if (!res.ok) {
                setError(data.error || 'فشل في إرسال الرمز')
                setIsLoading(false)
                return
            }
            setStep('otp')
        } catch {
            setError('حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.')
        }
        setIsLoading(false)
    }

    const handleVerifyOtp = async (code: string) => {
        setError('')
        setIsLoading(true)
        try {
            const res = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    code,
                    full_name: fullName,
                    user_type: 'entrepreneur',
                    phone,
                }),
            })
            const data = await res.json()
            if (!res.ok) {
                setError(data.error || 'رمز التحقق غير صحيح')
                setIsLoading(false)
                return
            }

            if (data.access_token) {
                const supabase = createClient()
                await supabase.auth.setSession({
                    access_token: data.access_token,
                    refresh_token: data.refresh_token,
                })
            }

            localStorage.removeItem('investmentAnswers')
            localStorage.removeItem('questionnaireCompleted')
            localStorage.removeItem('userType')
            setSuccessMsg('✅ تم التسجيل بنجاح! مرحباً بك في مرفأ.')
            setTimeout(() => { window.location.href = '/dashboard/hub' }, 2000)
        } catch {
            setError('حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.')
        }
        setIsLoading(false)
    }

    const handleResend = async () => {
        setError('')
        await fetch('/api/auth/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        })
    }

    if (step === 'form') return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4" dir="rtl">
            <div className="w-full max-w-md">
                <p className="text-center text-foreground/70 mb-8">إنشاء حساب جديد</p>
                <Card glass className="p-8">
                    <form onSubmit={handleSendOtp} className="space-y-4">
                        <Input label="الاسم الكامل" required value={fullName} onChange={e => setFullName(e.target.value)} placeholder="الاسم الكامل" />
                        <Input label="البريد الإلكتروني" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="example@email.com" />
                        <Input label="رقم الجوال" type="tel" required value={phone} onChange={e => setPhone(e.target.value)} placeholder="05xxxxxxxx" />
                        <label className="flex items-start gap-2 text-sm"><input type="checkbox" required className="mt-1" /> أوافق على <Link href="/privacy" className="text-blue-600 underline">سياسة الخصوصية</Link></label>
                        {error && <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded text-sm">{error}</div>}
                        <Button type="submit" fullWidth size="lg" isLoading={isLoading}>متابعة</Button>
                        <p className="text-center text-sm"><span className="text-foreground/60">لديك حساب؟ </span><Link href="/login" className="text-blue-600 hover:underline">تسجيل الدخول</Link></p>
                    </form>
                </Card>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4" dir="rtl">
            <div className="w-full max-w-md">
                <p className="text-center text-foreground/70 mb-6">تأكيد الحساب</p>
                <Card glass className="p-8">
                    <OtpVerification
                        email={email}
                        onVerify={handleVerifyOtp}
                        onResend={handleResend}
                        onBack={() => { setStep('form'); setError('') }}
                        isLoading={isLoading}
                        error={error}
                        successMsg={successMsg}
                    />
                </Card>
            </div>
        </div>
    )
}

export default function RegisterPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><p>Loading...</p></div>}>
            <RegisterForm />
        </Suspense>
    )
}
