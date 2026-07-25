'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Card from '../../components/ui/Card'
import OtpVerification from '../../components/ui/OtpVerification'
import { createClient } from '../../../lib/supabase/client'

const VALUE_PROPS = [
  { emoji: '🏛️', text: 'انضم للمجلس الاستشاري — ١٤ لقاء تدريبي مع تقييم شهري من مستشارين معتمدين' },
  { emoji: '🛠️', text: 'أدوات ذكاء اصطناعي مجانية: مستشار 360°، خطاب المصعد، تحليل الفكرة' },
  { emoji: '📚', text: 'مركز معرفة بـ ٣٠٠ مصطلح تجاري + قاموس ثنائي اللغة + مقالات أصلية' },
  { emoji: '💼', text: 'تنبيهات وظيفية أسبوعية — تصلك أحدث الوظائف في السعودية' },
  { emoji: '📧', text: 'مصطلح الأسبوع على إيميلك كل اثنين — يحضّرك للقاء الجمعة' },
]

function LoginForm() {
    const [step, setStep] = useState<'email' | 'otp' | 'success'>('email')
    const [email, setEmail] = useState('')
    const redirectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [successMsg, setSuccessMsg] = useState('')
    const [fieldError, setFieldError] = useState('')
    const [redirectUrl, setRedirectUrl] = useState('/dashboard/hub')
    const [checkingSession, setCheckingSession] = useState(true)
    const emailRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    // ── Auto-redirect if already signed in ──
    useEffect(() => {
        const supabase = createClient()
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session && step === 'email') {
                const params = new URLSearchParams(window.location.search)
                const redirect = params.get('redirect') || '/dashboard/hub'
                window.location.replace(redirect)
            } else {
                setCheckingSession(false)
            }
        }).catch(() => setCheckingSession(false))
    }, [])

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
        if (step === 'email') emailRef.current?.focus()
    }, [step])

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setFieldError('')
        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setFieldError('يرجى إدخال بريد إلكتروني صحيح')
            return
        }
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

            setStep('success')
            // Android Chrome needs more time to persist httpOnly cookies before redirect
            const isAndroid = /android/i.test(navigator.userAgent)
            const delay = isAndroid ? 2000 : 800
            redirectTimeoutRef.current = setTimeout(() => { window.location.href = redirectUrl }, delay)
        } catch {
            setError('حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.')
            setIsLoading(false)
        }
    }

    const handleResend = async () => {
        if (!email || !email.includes('@') || email.length < 5) return;
        setError('')
        setSuccessMsg('')
        await fetch('/api/auth/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        })
    }

    return (
        <div dir="rtl" className="min-h-screen bg-background flex items-center justify-center p-4">
            {checkingSession ? (
                <div className="marfa-skeleton w-8 h-8 rounded-full" />
            ) : (
            <div className="w-full max-w-5xl">
                <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
                    
                {/* ── Value props sidebar (hidden on mobile) ── */}
                <div className="hidden lg:block lg:w-1/2 lg:sticky lg:top-8">
                    <div className="bg-card/50 rounded-3xl p-8 border border-border/20">
                        <div className="text-right mb-6">
                            <h2 className="text-2xl font-black text-foreground mb-2">ماذا تحصل عند تسجيل الدخول؟</h2>
                            <p className="text-sm text-foreground/50">كل هذا مجاني — بدون بطاقة ائتمان</p>
                        </div>
                        <div className="space-y-4">
                            {VALUE_PROPS.map((prop, i) => (
                                <div key={i} className="flex items-start gap-3 text-right">
                                    <span className="text-xl shrink-0 mt-0.5">{prop.emoji}</span>
                                    <span className="text-sm text-foreground/70 leading-relaxed">{prop.text}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 pt-6 border-t border-border/20">
                            <p className="text-xs text-foreground/40 text-center">أقل من دقيقة • بريدك الإلكتروني فقط</p>
                        </div>
                    </div>
                </div>

                {/* ── Form ── */}
                <div className="w-full lg:w-1/2 max-w-md mx-auto">
                {step === 'email' && (
                    <div>
                        <div className="text-center mb-8">
                            <div className="w-14 h-14 bg-gradient-to-br from-gold to-gold-dark rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg shadow-gold/20">
                                👋
                            </div>
                            <h2 className="text-2xl font-bold text-foreground mb-1">تسجيل الدخول</h2>
                            <p className="text-sm text-foreground/50">أدخل بريدك الإلكتروني للمتابعة</p>
                        </div>

                        {/* Mobile value props */}
                        <div className="lg:hidden mb-6 bg-card/50 rounded-2xl p-4 border border-border/20">
                            <div className="flex flex-wrap gap-3 justify-center">
                                {VALUE_PROPS.map((prop, i) => (
                                    <span key={i} className="text-sm">{prop.emoji}</span>
                                ))}
                            </div>
                            <p className="text-xs text-foreground/40 text-center mt-2">أدوات مجانية + مجلس استشاري + قاموس + وظائف</p>
                        </div>

                        <Card glass className="p-8">
                            <form onSubmit={handleSendOtp} className="space-y-6" noValidate>
                                <Input
                                    ref={emailRef}
                                    label="البريد الإلكتروني"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={e => { setEmail(e.target.value); setFieldError('') }}
                                    placeholder="example@email.com"
                                    error={fieldError}
                                    autoComplete="email"
                                />

                                {error && (
                                    <div className="bg-error/10 border border-error/30 text-error p-3 rounded-lg text-sm flex items-center gap-2">
                                        <span>⚠️</span> {error}
                                    </div>
                                )}

                                <Button type="submit" fullWidth size="lg" isLoading={isLoading} loadingText="جاري الإرسال...">
                                    إرسال رمز التحقق
                                </Button>

                                <p className="text-center text-sm">
                                    <span className="text-foreground/50">ليس لديك حساب؟ </span>
                                    <Link href="/register" className="text-info hover:underline font-medium">إنشاء حساب جديد</Link>
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
                            <h2 className="text-2xl font-bold text-foreground mb-1">تأكيد الدخول</h2>
                            <p className="text-sm text-foreground/50">أدخل الرمز المرسل إلى بريدك</p>
                        </div>

                        <Card glass className="p-8">
                            <OtpVerification
                                email={email}
                                onVerify={handleVerifyOtp}
                                onResend={handleResend}
                                onBack={() => { setStep('email'); setError(''); setSuccessMsg('') }}
                                isLoading={isLoading}
                                error={error}
                                successMsg={successMsg}
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
                            <h2 className="text-2xl font-bold text-foreground mb-2">تم التحقق بنجاح!</h2>
                            <p className="text-foreground/60 mb-6">أهلاً بعودتك</p>
                            <div className="flex items-center justify-center gap-2 text-sm text-foreground/40">
                                <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                                جاري تحويلك...
                            </div>
                        </Card>
                    </div>
                )}

                {step !== 'success' && (
                    <p className="text-center mt-6">
                        <Link href="/" className="text-sm text-foreground/50 hover:text-foreground transition-colors">← العودة للصفحة الرئيسية</Link>
                    </p>
                )}
                </div>{/* /form column */}
                </div>{/* /flex row */}
            </div>
            )}
        </div>
    )
}

export default function LoginPage() {
    return <LoginForm />
}
