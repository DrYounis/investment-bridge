'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from './Button'
import Input from './Input'

interface OtpVerificationProps {
    email: string
    onVerify: (code: string) => Promise<void>
    onResend: () => Promise<void>
    onBack: () => void
    isLoading: boolean
    error: string
    successMsg: string
}

export default function OtpVerification({
    email,
    onVerify,
    onResend,
    onBack,
    isLoading,
    error,
    successMsg,
}: OtpVerificationProps) {
    const [otp, setOtp] = useState('')
    const [countdown, setCountdown] = useState(600)
    const [resendCooldown, setResendCooldown] = useState(0)
    const [resending, setResending] = useState(false)
    const [shake, setShake] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const submittingRef = useRef(false)

    useEffect(() => {
        inputRef.current?.focus()
    }, [])

    // Countdown timer
    useEffect(() => {
        if (countdown <= 0) return
        const timer = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1000)
        return () => clearInterval(timer)
    }, [countdown])

    // Resend cooldown
    useEffect(() => {
        if (resendCooldown <= 0) return
        const timer = setInterval(() => setResendCooldown(c => Math.max(0, c - 1)), 1000)
        return () => clearInterval(timer)
    }, [resendCooldown])

    // Shake on error
    useEffect(() => {
        if (error) {
            setShake(true)
            const t = setTimeout(() => setShake(false), 500)
            return () => clearTimeout(t)
        }
    }, [error])

    // Auto-submit when 6 digits entered
    useEffect(() => {
        if (otp.length === 6 && !isLoading && !submittingRef.current) {
            submittingRef.current = true
            const timer = setTimeout(() => {
                onVerify(otp).finally(() => { submittingRef.current = false })
            }, 300)
            return () => clearTimeout(timer)
        }
    }, [otp, isLoading, onVerify])

    const handleResend = useCallback(async () => {
        if (resendCooldown > 0) return
        setResending(true)
        try {
            await onResend()
            setCountdown(600)
            setResendCooldown(60)
            setOtp('')
            inputRef.current?.focus()
        } catch {
            // handled by parent
        }
        setResending(false)
    }, [resendCooldown, onResend])

    const formatTime = (seconds: number): string => {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return `${m}:${s.toString().padStart(2, '0')}`
    }

    const countdownExpired = countdown <= 0

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, '').slice(0, 6)
        setOtp(val)
    }

    return (
        <form
            onSubmit={e => { e.preventDefault(); if (otp.length === 6) onVerify(otp) }}
            className="space-y-6"
        >
            <div>
                <p className="text-sm text-foreground/50 mb-1">تم إرسال رمز التحقق إلى</p>
                <p className="font-bold text-foreground mb-2">{email}</p>
                {!countdownExpired && (
                    <p className="text-xs text-foreground/40 flex items-center gap-1">
                        <motion.span
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                        >
                            ⏱
                        </motion.span>
                        تنتهي صلاحية الرمز خلال{' '}
                        <span className="font-mono text-foreground/60 tabular-nums">{formatTime(countdown)}</span>
                    </p>
                )}
                {countdownExpired && (
                    <p className="text-xs text-error font-medium">انتهت صلاحية الرمز. يرجى طلب رمز جديد.</p>
                )}
            </div>

            <motion.div
                animate={shake ? { x: [0, -8, 8, -8, 8, 0] } : {}}
                transition={{ duration: 0.4 }}
            >
                <Input
                    ref={inputRef}
                    label="رمز التحقق"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    required
                    value={otp}
                    onChange={handleInputChange}
                    placeholder="000000"
                    maxLength={6}
                />
            </motion.div>

            {/* OTP digit indicators */}
            <div className="flex justify-center gap-2 dir-ltr">
                {Array.from({ length: 6 }).map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            scale: i < otp.length ? [1, 1.15, 1] : 1,
                            borderColor: i < otp.length ? 'var(--gold)' : 'var(--gray-300)',
                            backgroundColor: i < otp.length ? 'rgba(212,175,55,0.08)' : 'transparent',
                        }}
                        transition={{ duration: 0.2 }}
                        className="w-10 h-12 border-2 rounded-lg flex items-center justify-center text-lg font-bold text-foreground"
                    >
                        {otp[i] || ''}
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {successMsg && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="bg-success/10 border border-success/30 text-success p-3 rounded-lg text-sm font-medium text-center"
                    >
                        {successMsg}
                    </motion.div>
                )}
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

            <Button
                type="submit"
                fullWidth
                size="lg"
                isLoading={isLoading}
                loadingText="جاري التحقق..."
                disabled={otp.length !== 6 || countdownExpired || isLoading}
            >
                تحقق
            </Button>

            <div className="text-center space-y-2">
                <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendCooldown > 0 || resending}
                    className={`text-sm transition-colors ${
                        resendCooldown > 0 || resending
                            ? 'text-foreground/25 cursor-not-allowed'
                            : 'text-info hover:text-info/80 font-medium'
                    }`}
                >
                    {resending
                        ? 'جاري الإرسال...'
                        : resendCooldown > 0
                            ? `إعادة الإرسال بعد ${resendCooldown} ثانية`
                            : 'إعادة إرسال الرمز'}
                </button>
                <br />
                <button
                    type="button"
                    onClick={onBack}
                    className="text-sm text-foreground/50 hover:text-foreground transition-colors"
                >
                    ← تغيير البريد الإلكتروني
                </button>
            </div>
        </form>
    )
}
