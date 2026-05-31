'use client'

import { Suspense, useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Card from '../../components/ui/Card'
import OtpVerification from '../../components/ui/OtpVerification'
import { createClient } from '../../../lib/supabase/client'

const stepVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
}

function LoginForm() {
    const [step, setStep] = useState<'email' | 'otp' | 'success'>('email')
    const [email, setEmail] = useState('')
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
            setTimeout(() => router.push(redirectUrl), 1200)
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
                <AnimatePresence mode="wait">
                    {step === 'email' && (
                        <motion.div
                            key="email"
                            variants={stepVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                        >
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
                        </motion.div>
                    )}

                    {step === 'otp' && (
                        <motion.div
                            key="otp"
                            variants={stepVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                        >
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
                        </motion.div>
                    )}

                    {step === 'success' && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: 'spring', stiffness: 150, damping: 12 }}
                        >
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
                        </motion.div>
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
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                    <p className="text-foreground/40 text-sm">جاري التحميل...</p>
                </div>
            </div>
        }>
            <LoginForm />
        </Suspense>
    )
}
