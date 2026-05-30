'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Card from '../../components/ui/Card'
import OtpVerification from '../../components/ui/OtpVerification'
import { createClient } from '../../../lib/supabase/client'

function LoginForm() {
    const [step, setStep] = useState<'email' | 'otp'>('email')
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [successMsg, setSuccessMsg] = useState('')
    const router = useRouter()
    const searchParams = useSearchParams()

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
            setSuccessMsg('تم إرسال رمز التحقق إلى بريدك الإلكتروني')
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
                body: JSON.stringify({ email, code }),
            })
            const data = await res.json()
            if (!res.ok) {
                setError(data.error || 'رمز التحقق غير صحيح')
                setIsLoading(false)
                return
            }

            const supabase = createClient()
            await supabase.auth.setSession({
                access_token: data.access_token,
                refresh_token: data.refresh_token,
            })

            const redirect = searchParams.get('redirect') || '/dashboard/hub'
            router.push(redirect)
        } catch {
            setError('حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.')
            setIsLoading(false)
        }
    }

    const handleResend = async () => {
        setError('')
        setSuccessMsg('')
        await fetch('/api/auth/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        })
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <p className="text-center text-foreground/70 mb-8">تسجيل الدخول</p>
                <Card glass className="p-8">
                    {step === 'email' ? (
                        <form onSubmit={handleSendOtp} className="space-y-6">
                            <Input
                                label="البريد الإلكتروني"
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="example@email.com"
                            />
                            {error && <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded text-sm">{error}</div>}
                            <Button type="submit" fullWidth size="lg" isLoading={isLoading}>إرسال رمز التحقق</Button>
                            <p className="text-center text-sm"><span className="text-foreground/60">ليس لديك حساب؟ </span><Link href="/register" className="text-blue-600 hover:underline">إنشاء حساب جديد</Link></p>
                        </form>
                    ) : (
                        <OtpVerification
                            email={email}
                            onVerify={handleVerifyOtp}
                            onResend={handleResend}
                            onBack={() => { setStep('email'); setError(''); setSuccessMsg('') }}
                            isLoading={isLoading}
                            error={error}
                            successMsg={successMsg}
                        />
                    )}
                </Card>
                <p className="text-center mt-6"><Link href="/" className="text-sm text-foreground/60 hover:text-foreground">← العودة للصفحة الرئيسية</Link></p>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><p>Loading...</p></div>}>
            <LoginForm />
        </Suspense>
    )
}
