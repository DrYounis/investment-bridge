'use client';

import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { createClient } from '../../../lib/supabase/client';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/reset-password`,
            });

            if (error) throw error;

            setSuccess('✅ تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. يرجى التحقق من صندوق الوارد.');
            setEmail('');
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'حدث خطأ أثناء إرسال البريد. يرجى المحاولة مرة أخرى.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4" dir="rtl">
            <div className="w-full max-w-md animate-fade-in-up">
                <div className="text-center mb-8">
                    <Image
                        src="/images/logo-marfa.png"
                        alt="Marfa Logo"
                        width={120}
                        height={160}
                        className="mx-auto mb-4 h-32 w-auto object-contain"
                    />
                    <h2 className="text-2xl font-bold text-foreground mb-2">استعادة كلمة المرور</h2>
                    <p className="text-foreground/60 text-sm">
                        أدخل بريدك الإلكتروني وسنرسل لك رابط لإعادة تعيين كلمة المرور
                    </p>
                </div>

                <Card glass className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Input */}
                        <Input
                            label="البريد الإلكتروني"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@email.com"
                            startIcon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            }
                        />

                        {/* Success Message */}
                        {success && (
                            <div className="bg-green-50 border-2 border-green-500 text-green-800 px-4 py-4 rounded-xl text-sm font-bold text-center">
                                {success}
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="bg-error/10 border border-error text-error px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            fullWidth
                            size="lg"
                            isLoading={isLoading}
                            disabled={!email}
                        >
                            إرسال رابط الاستعادة
                        </Button>

                        {/* Back to Login */}
                        <div className="text-center">
                            <Link
                                href="/login"
                                className="text-sm text-primary hover:underline font-bold"
                            >
                                العودة إلى تسجيل الدخول
                            </Link>
                        </div>
                    </form>
                </Card>

                {/* Help Text */}
                <div className="mt-6 text-center text-xs text-foreground/50">
                    <p>لم تستلم البريد؟ تحقق من مجلد الرسائل غير المرغوب فيها (Spam)</p>
                </div>
            </div>
        </div>
    );
}
