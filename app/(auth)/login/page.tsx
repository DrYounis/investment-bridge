"use client";

import Image from 'next/image';
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
                let { data: profile, error: profileFetchError } = await supabase
                    .from('profiles')
                    .select('user_type')
                    .eq('id', user.id)
                    .maybeSingle();

                // RECOVERY: If profile is missing (common if email verification prevented initial creation), create it now
                if (!profile) {
                    console.log("Profile missing, attempting lazy creation...");
                    const metadata = user.user_metadata || {};
                    const userType = metadata.user_type || 'investor';

                    const { error: insertError } = await supabase.from('profiles').insert({
                        id: user.id,
                        email: user.email,
                        full_name: metadata.full_name || '',
                        user_type: userType
                    });

                    if (!insertError) {
                        // Create sub-profile
                        if (userType === 'investor') {
                            await supabase.from('investor_profiles').insert({
                                profile_id: user.id,
                                approval_status: 'pending'
                            });
                        } else {
                            await supabase.from('entrepreneur_profiles').insert({
                                profile_id: user.id
                            });
                        }
                        profile = { user_type: userType };
                    } else {
                        console.error("Lazy profile creation failed:", insertError);
                    }
                }

                if (profile?.user_type === 'investor') {
                    // Check approval status BEFORE signing in
                    const { data: investorProfile } = await supabase
                        .from('investor_profiles')
                        .select('approval_status')
                        .eq('profile_id', user.id)
                        .maybeSingle();

                    if (investorProfile?.approval_status === 'approved') {
                        router.push('/dashboard/investor');
                    } else if (investorProfile?.approval_status === 'pending') {
                        // Sign out immediately and show clear message
                        await supabase.auth.signOut();
                        setError('⏳ حسابك قيد المراجعة الإدارية. سيتم إرسال بريد إلكتروني فور الموافقة. عادة تستغرق المراجعة أقل من 24 ساعة.');
                        setIsLoading(false);
                        return; // Don't proceed
                    } else if (investorProfile?.approval_status === 'rejected') {
                        await supabase.auth.signOut();
                        setError('عذراً، لم يتم قبول طلبك. يرجى التواصل مع الإدارة للمزيد من المعلومات.');
                        setIsLoading(false);
                        return;
                    } else {
                        // If no investor profile found (rare), let them in or recreate
                        router.push('/dashboard/investor');
                    }

                } else if (profile?.user_type === 'entrepreneur') {
                    router.push('/dashboard/entrepreneur');
                } else {
                    router.push('/');
                }
            }
        } catch (err: any) {
            console.error(err);
            let errorMessage = err.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة';

            // Translate generic Supabase errors to helpful Arabic messages
            if (errorMessage.includes('Invalid login credentials')) {
                errorMessage = 'البريد الإلكتروني أو كلمة المرور غير صحيحة، أو لم يتم تفعيل الحساب بعد. يرجى التحقق من بريدك الإلكتروني.';
            } else if (errorMessage.includes('Email not confirmed')) {
                errorMessage = 'لم يتم تفعيل الحساب بعد. يرجى التحقق من بريدك الإلكتروني لتأكيد التسجيل.';
            }

            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md animate-fade-in-up">
                <div className="text-center mb-8">
                    <Image
                        src="/images/logo-marfa.png"
                        alt="Marfa Logo"
                        width={120}
                        height={160}
                        className="mx-auto mb-4 h-32 w-auto object-contain"
                    />
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
