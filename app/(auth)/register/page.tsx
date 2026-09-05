'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Card from '../../components/ui/Card'
import OtpVerification from '../../components/ui/OtpVerification'
import { createClient } from '../../../lib/supabase/client'
import { trackEvent } from '../../../lib/tracking'

function RegisterForm() {
    const [step, setStep] = useState<'form' | 'otp' | 'success'>('form')
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
    const [redirectUrl, setRedirectUrl] = useState('/dashboard/hub')
    const nameRef = useRef<HTMLInputElement>(null)
    const redirectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const router = useRouter()

    useEffect(() => {
        return () => {
            if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current)
        }
    }, [])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search)
            setRedirectUrl(params.get('redirect') || '/dashboard/hub')
        }
    }, [])

    useEffect(() => {
        if (step === 'form') nameRef.current?.focus()
    }, [step])

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {}
        if (!fullName.trim()) errors.name = 'الاسم مطلوب'
        else if (fullName.trim().length < 3) errors.name = 'الاسم قصير جداً'
        if (!email.trim()) errors.email = 'البريد الإلكتروني مطلوب'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'بريد إلكتروني غير صحيح'
        if (!phone.trim()) errors.phone = 'رقم الجوال مطلوب'
        else if (!/^0\d{9}$/.test(phone.replace(/\D/g, ''))) errors.phone = 'رقم جوال غير صحيح (يجب أن يبدأ بـ 05)'
        setFieldErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setFieldErrors({})
        if (!validateForm()) return
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
                    phone: phone.replace(/\D/g, ''),
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
            setStep('success')
            let signupSurface = 'direct'
            try { signupSurface = sessionStorage.getItem('marfa_signup_surface') || 'direct' } catch { /* ignore */ }
            trackEvent('signup_complete', { surface: signupSurface })
            const isAndroid = /android/i.test(navigator.userAgent)
            const delay = isAndroid ? 2000 : 800
            redirectTimeoutRef.current = setTimeout(() => { window.location.href = redirectUrl }, delay)
        } catch {
            setError('حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.')
        }
        setIsLoading(false)
    }

    const handleResend = async () => {
        if (!email || !email.includes('@') || email.length < 5) return;
        setError('')
        await fetch('/api/auth/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        })
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4" dir="rtl">
            <div className="w-full max-w-md">
                {step === 'form' && (
                    <div>
                        <div className="text-center mb-8">
                            <div className="w-14 h-14 bg-gradient-to-br from-gold to-gold-dark rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg shadow-gold/20">
                                🚀
                            </div>
                            <h2 className="text-2xl font-bold text-foreground mb-1">إنشاء حساب جديد</h2>
                            <p className="text-sm text-foreground/50">ابدأ رحلتك في مجتمع مرفأ الاستثماري</p>
                        </div>

                        <Card glass className="p-8">
                            <form onSubmit={handleSendOtp} className="space-y-4" noValidate>
                                <Input
                                    ref={nameRef}
                                    label="الاسم الكامل"
                                    required
                                    value={fullName}
                                    onChange={e => { setFullName(e.target.value); setFieldErrors(p => ({ ...p, name: '' })) }}
                                    placeholder="الاسم الكامل"
                                    error={fieldErrors.name}
                                />
                                <Input
                                    label="البريد الإلكتروني"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={e => { setEmail(e.target.value); setFieldErrors(p => ({ ...p, email: '' })) }}
                                    placeholder="example@email.com"
                                    error={fieldErrors.email}
                                />
                                <Input
                                    label="رقم الجوال"
                                    type="tel"
                                    required
                                    value={phone}
                                    onChange={e => { setPhone(e.target.value); setFieldErrors(p => ({ ...p, phone: '' })) }}
                                    placeholder="05xxxxxxxx"
                                    error={fieldErrors.phone}
                                />
                                <label className="flex items-start gap-2 text-sm cursor-pointer">
                                    <input type="checkbox" required className="mt-1 accent-gold" />
                                    <span>أوافق على <Link href="/privacy" className="text-info hover:underline">سياسة الخصوصية</Link></span>
                                </label>

                                <label className="flex items-start gap-2 text-sm cursor-pointer">
                                    <input type="checkbox" required className="mt-1 accent-gold" />
                                    <span>
                                        أوافق على <Link href="/nda" className="text-info hover:underline">سياسة عدم الإفصاح</Link> (اتفاقية متبادلة موقّعة من الطرفين)
                                        <span className="block text-xs text-foreground/50 mt-1">ملاحظة: ما يُناقش في اللقاءات والجلسات العامة غير مشمول بسياسة عدم الإفصاح</span>
                                    </span>
                                </label>

                                {error && (
                                    <div className="bg-error/10 border border-error/30 text-error p-3 rounded-lg text-sm flex items-center gap-2">
                                        <span>⚠️</span> {error}
                                    </div>
                                )}

                                <Button type="submit" fullWidth size="lg" isLoading={isLoading} loadingText="جاري إرسال رمز التحقق...">
                                    متابعة
                                </Button>

                                <p className="text-center text-sm">
                                    <span className="text-foreground/50">لديك حساب؟ </span>
                                    <Link href="/login" className="text-info hover:underline font-medium">تسجيل الدخول</Link>
                                </p>
                            </form>
                        </Card>
                    </div>
                )}

                {step === 'otp' && (
                    <div>
                        <div className="text-center mb-6">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg shadow-blue-500/20">
                                🔐
                            </div>
                            <h2 className="text-2xl font-bold text-foreground mb-1">تأكيد الحساب</h2>
                            <p className="text-sm text-foreground/50">أدخل الرمز المرسل إلى بريدك</p>
                        </div>

                        <Card glass className="p-8">
                            <OtpVerification
                                email={email}
                                onVerify={handleVerifyOtp}
                                onResend={handleResend}
                                onBack={() => { setStep('form'); setError('') }}
                                isLoading={isLoading}
                                error={error}
                                successMsg=""
                            />
                        </Card>
                    </div>
                )}

                {step === 'success' && (
                    <div>
                        <Card glass className="p-10 text-center">
                            <div className="w-20 h-20 bg-success/15 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                                ✅
                            </div>
                            <h2 className="text-2xl font-bold text-foreground mb-2">تم التسجيل بنجاح!</h2>
                            <p className="text-foreground/60 mb-6">مرحباً بك في منصة مرفأ الاستثمارية</p>
                            <div className="flex items-center justify-center gap-2 text-sm text-foreground/40">
                                <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                                جاري تحويلك إلى لوحة التحكم...
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    )
}

export default function RegisterPage() {
    return <RegisterForm />
}
