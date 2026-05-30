'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
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
    const [countdown, setCountdown] = useState(600) // 10 minutes in seconds
    const [resendCooldown, setResendCooldown] = useState(0)
    const [resending, setResending] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    // Auto-focus input on mount
    useEffect(() => {
        inputRef.current?.focus()
    }, [])

    // Countdown timer
    useEffect(() => {
        if (countdown <= 0) return
        const timer = setInterval(() => {
            setCountdown(c => Math.max(0, c - 1))
        }, 1000)
        return () => clearInterval(timer)
    }, [countdown])

    // Resend cooldown
    useEffect(() => {
        if (resendCooldown <= 0) return
        const timer = setInterval(() => {
            setResendCooldown(c => Math.max(0, c - 1))
        }, 1000)
        return () => clearInterval(timer)
    }, [resendCooldown])

    const handleResend = useCallback(async () => {
        if (resendCooldown > 0) return
        setResending(true)
        try {
            await onResend()
            setCountdown(600) // reset countdown
            setResendCooldown(60) // 60s cooldown before next resend
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

    return (
        <form onSubmit={e => { e.preventDefault(); if (otp.length === 6) onVerify(otp) }} className="space-y-6">
            <div>
                <p className="text-sm text-foreground/60 mb-1">تم إرسال رمز التحقق إلى</p>
                <p className="font-bold text-foreground mb-2">{email}</p>
                {!countdownExpired && (
                    <p className="text-xs text-foreground/40">
                        ⏱ تنتهي صلاحية الرمز خلال <span className="font-mono text-foreground/60">{formatTime(countdown)}</span>
                    </p>
                )}
                {countdownExpired && (
                    <p className="text-xs text-error">انتهت صلاحية الرمز. يرجى طلب رمز جديد.</p>
                )}
            </div>

            <Input
                ref={inputRef}
                label="رمز التحقق"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
            />

            {successMsg && (
                <div className="bg-green-100 border border-green-400 text-green-700 p-3 rounded text-sm font-bold text-center">
                    {successMsg}
                </div>
            )}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded text-sm">
                    {error}
                </div>
            )}

            <Button
                type="submit"
                fullWidth
                size="lg"
                isLoading={isLoading}
                disabled={otp.length !== 6 || countdownExpired}
            >
                تحقق
            </Button>

            <div className="text-center space-y-2">
                <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendCooldown > 0 || resending}
                    className={`text-sm ${resendCooldown > 0 ? 'text-foreground/30 cursor-not-allowed' : 'text-blue-600 hover:underline'}`}
                >
                    {resending
                        ? 'جاري الإرسال...'
                        : resendCooldown > 0
                            ? `إعادة الإرسال بعد ${resendCooldown} ثانية`
                            : 'إعادة إرسال الرمز'}
                </button>
                <br />
                <button type="button" onClick={onBack} className="text-sm text-foreground/60 hover:text-foreground">
                    ← تغيير البريد الإلكتروني
                </button>
            </div>
        </form>
    )
}
