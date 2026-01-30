"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { createClient } from '../../../lib/supabase/client';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const supabase = createClient();

        try {
            // 1. Sign In
            const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (authError) throw authError;

            if (user) {
                // 2. Refresh session router
                router.refresh();

                // 3. Check User Type for Redirect
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('user_type')
                    .eq('id', user.id)
                    .single();

                if (profile?.user_type === 'investor') {
                    // Check approval status for investors
                    const { data: investorProfile } = await supabase
                        .from('investor_profiles')
                        .select('approval_status')
                        .eq('profile_id', user.id)
                        .single();

                    if (investorProfile?.approval_status === 'approved') {
                        router.push('/dashboard/investor');
                    } else if (investorProfile?.approval_status === 'pending') {
                        await supabase.auth.signOut();
                        setError('حسابك قيد المراجعة. سيتم إشعارك عند الموافقة.');
                    } else if (investorProfile?.approval_status === 'rejected') { // Handle rejected explicitly if needed
                        await supabase.auth.signOut();
                        setError('عذراً، لم يتم قبول طلبك.');
                    } else {
                        // Fallback case or if status is unexpected (though DB default is pending)
                        await supabase.auth.signOut();
                        setError('حالة الحساب غير معروفة. يرجى التواصل مع الدعم.');
                    }

                } else if (profile?.user_type === 'entrepreneur') {
                    // Temporarily redirect to investor dash or home until entrepreneur dashboard is ready
                    // Or keep it simple:
                    router.push('/dashboard/investor');
                } else {
                    router.push('/');
                }
            }
        } catch (err: any) {
            console.error(err);
            setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md animate-fade-in-up">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gradient mb-2">مرفأ</h1>
                    <p className="text-foreground/70">تسجيل الدخول</p>
                </div>

                <Card glass className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <Input
                            label="البريد الإلكتروني"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="example@email.com"
                            startIcon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            }
                        />

                        {/* Password */}
                        <Input
                            label="كلمة المرور"
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="أدخل كلمة المرور"
                            startIcon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            }
                        />

                        {/* Forgot Password */}
                        <div className="text-left">
                            <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                                نسيت كلمة المرور؟
                            </Link>
                        </div>

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
                        >
                            تسجيل الدخول
                        </Button>

                        {/* Register Link */}
                        <div className="text-center text-sm">
                            <span className="text-foreground/60">ليس لديك حساب؟ </span>
                            <Link href="/register" className="text-primary hover:underline font-medium">
                                إنشاء حساب جديد
                            </Link>
                        </div>
                    </form>
                </Card>

                {/* Back to Home */}
                <div className="text-center mt-6">
                    <Link href="/" className="text-foreground/60 hover:text-foreground transition-colors text-sm">
                        ← العودة للصفحة الرئيسية
                    </Link>
                </div>
            </div>
        </div>
    );
}
