"use client";

import Image from 'next/image';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { createClient } from '../../../lib/supabase/client';

function RegisterForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        userType: 'investor' as 'investor' | 'entrepreneur', // Updated to match DB enums
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [questionnaireData, setQuestionnaireData] = useState<any>(null);

    // Initialize Supabase client
    const supabase = createClient();

    const searchParams = useSearchParams();

    // Load questionnaire data from localStorage on mount and check query params
    useEffect(() => {
        const storedAnswers = localStorage.getItem('investmentAnswers');
        const userType = localStorage.getItem('userType');
        const typeParam = searchParams.get('type');

        // Priority 1: Query Param
        if (typeParam === 'investor' || typeParam === 'entrepreneur') {
            setFormData(prev => ({ ...prev, userType: typeParam as any }));
        }
        // Priority 2: LocalStorage
        else if (userType && (userType === 'investor' || userType === 'entrepreneur')) {
            setFormData(prev => ({ ...prev, userType: userType as any }));
        }

        if (storedAnswers) {
            try {
                const parsedAnswers = JSON.parse(storedAnswers);
                setQuestionnaireData(parsedAnswers);
            } catch (e) {
                console.error("Error parsing questionnaire data", e);
            }
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('كلمات المرور غير متطابقة');
            return;
        }

        if (formData.password.length < 8) {
            setError('يجب أن تكون كلمة المرور 8 أحرف على الأقل');
            return;
        }

        setIsLoading(true);

        try {
            // 1. Sign up user
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                        user_type: formData.userType,
                    },
                },
            });

            if (authError) throw authError;

            if (authData.user) {
                const userId = authData.user.id;

                // 2. Create Profile Entry (if not handled by trigger, but here explicit is safer)
                // Note: Triggers are great, but manual insertion allows error handling in UI
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert({
                        id: userId,
                        email: formData.email,
                        full_name: formData.fullName,
                        phone: formData.phone,
                        user_type: formData.userType,
                    });

                if (profileError) {
                    console.error("Profile creation error:", profileError);
                    // Continue anyway as auth succeeded, might be a duplicate key if trigger exists
                }

                // 3. Create Specific Profile (Investor or Entrepreneur)
                if (formData.userType === 'investor') {
                    await supabase.from('investor_profiles').insert({
                        profile_id: userId,
                        approval_status: 'pending', // Default pending
                        // Map questionnaire data if available
                        experience_level: questionnaireData?.['1'], // Assuming Q1 is experience
                        investment_amount: questionnaireData?.['2'],
                        risk_tolerance: questionnaireData?.['3'],
                        investment_duration: questionnaireData?.['4'],
                        preferred_sectors: questionnaireData?.['5'] ? JSON.stringify(questionnaireData['5']) : null,
                        expected_return: questionnaireData?.['6'],
                    });
                } else {
                    await supabase.from('entrepreneur_profiles').insert({
                        profile_id: userId,
                        sector: questionnaireData?.['sector'] || null,
                    });
                }

                // 4. Save Questionnaire Responses
                if (questionnaireData) {
                    await supabase.from('questionnaire_responses').insert({
                        profile_id: userId,
                        user_type: formData.userType,
                        sector: questionnaireData?.['sector'] || null,
                        responses: questionnaireData,
                        project_summary: questionnaireData?.['summary'] || null,
                    });

                    // Clear localStorage
                    localStorage.removeItem('investmentAnswers');
                    localStorage.removeItem('questionnaireCompleted');
                    localStorage.removeItem('userType');
                }

                // 5. Redirect
                const dashboardPath = formData.userType === 'investor'
                    ? '/dashboard/investor'
                    : '/dashboard/entrepreneur';

                router.push(dashboardPath);
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.');
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
                    <p className="text-foreground/70">إنشاء حساب جديد</p>
                </div>

                <Card glass className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* User Type Selection */}
                        {/* User Type Selection - HIDDEN based on user request */}
                        <div className="hidden">
                            <label className="block text-sm font-medium text-foreground mb-3">
                                نوع الحساب <span className="text-error">*</span>
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, userType: 'investor' })}
                                    className={`p-4 rounded-lg border-2 transition-all ${formData.userType === 'investor'
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-gray-300 hover:border-primary/50'
                                        }`}
                                >
                                    <div className="text-2xl mb-2">💼</div>
                                    <div className="font-bold">مستثمر</div>
                                    <div className="text-xs text-foreground/60">أبحث عن فرص استثمارية</div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, userType: 'entrepreneur' })}
                                    className={`p-4 rounded-lg border-2 transition-all ${formData.userType === 'entrepreneur'
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-gray-300 hover:border-primary/50'
                                        }`}
                                >
                                    <div className="text-2xl mb-2">💡</div>
                                    <div className="font-bold">صاحب فكرة</div>
                                    <div className="text-xs text-foreground/60">أبحث عن تمويل لمشروعي</div>
                                </button>
                            </div>
                        </div>

                        {/* Full Name */}
                        <Input
                            label="الاسم الكامل"
                            type="text"
                            required
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            placeholder="أدخل اسمك الكامل"
                            startIcon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            }
                        />

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

                        {/* Phone */}
                        <Input
                            label="رقم الجوال"
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="05xxxxxxxx"
                            startIcon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
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
                            placeholder="8 أحرف على الأقل"
                            helperText="يجب أن تحتوي على 8 أحرف على الأقل"
                            startIcon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            }
                        />

                        {/* Confirm Password */}
                        <Input
                            label="تأكيد كلمة المرور"
                            type="password"
                            required
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            placeholder="أعد إدخال كلمة المرور"
                            error={formData.confirmPassword && formData.password !== formData.confirmPassword ? 'كلمات المرور غير متطابقة' : ''}
                            startIcon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            }
                        />

                        {/* Privacy Policy Checkbox - Added per user request */}
                        <div className="flex items-start gap-3">
                            <div className="flex h-6 items-center">
                                <input
                                    id="privacy"
                                    name="privacy"
                                    type="checkbox"
                                    required
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                            </div>
                            <div className="text-sm leading-6">
                                <label htmlFor="privacy" className="font-medium text-gray-900">
                                    أوافق على{' '}
                                    <Link href="/privacy" target="_blank" className="text-primary hover:underline font-bold">
                                        سياسة الخصوصية وشروط الاستخدام
                                    </Link>
                                </label>
                                <p className="text-gray-500 text-xs mt-1">
                                    تتضمن الموافقة على نظام الأسئلة المتشعبة واتفاقية عدم الإفصاح (NDA).
                                </p>
                            </div>
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
                            إنشاء حساب
                        </Button>

                        {/* Login Link */}
                        <div className="text-center text-sm">
                            <span className="text-foreground/60">لديك حساب بالفعل؟ </span>
                            <Link href="/login" className="text-primary hover:underline font-medium">
                                تسجيل الدخول
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

export default function RegisterPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-foreground/60">جاري التحميل...</p>
                </div>
            </div>
        }>
            <RegisterForm />
        </Suspense>
    );
}
