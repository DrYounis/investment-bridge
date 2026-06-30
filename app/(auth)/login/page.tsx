'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Card from '../../components/ui/Card'
import OtpVerification from '../../components/ui/OtpVerification'
import { createClient } from '../../../lib/supabase/client'

function LoginForm() {
    const [step, setStep] = useState<'email' | 'otp' | 'success'>('email')
    const [email, setEmail] = useState('')
    const redirectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current)
        }
    }, [])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [successMsg, setSuccessMsg] = useState('')
    const [fieldError, setFieldError] = useState('')
    const [redirectUrl, setRedirectUrl] = useState('/dashboard/hub')
    const emailRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

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
            redirectTimeoutRef.current = setTimeout(() => router.push(redirectUrl), 1200)
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
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <AnimatePresence mode="wait">
                    {step === 'email' && (
                        <div key="email">
                            <div className="text-center mb-8">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                                    className="w-14 h-14 bg-gradient-to-br from-gold to-gold-dark rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg shadow-gold/20"
                                >
                                    👋
                                </motion.div>
                                <h2 className="text-2xl font-bold text-foreground mb-1">تسجيل الدخول</h2>
                                <p className="text-sm text-foreground/50">أدخل بريدك الإلكتروني للمتابعة</p>
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

                                    <AnimatePresence>
                                        {error && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                className="bg-error/10 border border-error/30 text-error p-3 rounded-lg text-sm flex items-center gap-2"
                                            >
                                                <span>⚠️</span> {error}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

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
                        <div key="otp">
                            <div className="text-center mb-6">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                                    className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg shadow-blue-500/20"
                                >
                                    🔐
                                </motion.div>
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
                        <div key="success">
                            <Card glass className="p-10 text-center">
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                                    className="w-20 h-20 bg-success/15 rounded-full flex items-center justify-center text-4xl mx-auto mb-6"
                                >
                                    ✅
                                </motion.div>
                                <h2 className="text-2xl font-bold text-foreground mb-2">تم التحقق بنجاح!</h2>
                                <p className="text-foreground/60 mb-6">أهلاً بعودتك</p>
                                <div className="flex items-center justify-center gap-2 text-sm text-foreground/40">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                        className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full"
                                    />
                                    جاري تحويلك...
                                </div>
                            </Card>
                        </div>
                    )}
                </AnimatePresence>

                {step !== 'success' && (
                    <p className="text-center mt-6">
                        <Link href="/" className="text-sm text-foreground/50 hover:text-foreground transition-colors">← العودة للصفحة الرئيسية</Link>
                    </p>
                )}
            </div>
        </div>
    )
}

export default function LoginPage() {
    return <LoginForm />
}
