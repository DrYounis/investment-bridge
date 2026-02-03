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
        commercialRegister: '', // New field for investors
        userType: '' as '' | 'investor' | 'entrepreneur', // Empty until selected
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(''); // New success message state
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
        // If no type is set yet, user will see role selection screen

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
            // Prepare metadata for the trigger to handle profile creation securely
            const metadata: any = {
                full_name: formData.fullName,
                user_type: formData.userType,
                role: formData.userType,
                phone: formData.phone,
            };

            if (formData.userType === 'investor') {
                metadata.commercial_register = formData.commercialRegister || null;
                if (questionnaireData) {
                    metadata.experience_level = questionnaireData['1'];
                    metadata.investment_amount = questionnaireData['2'];
                    metadata.risk_tolerance = questionnaireData['3'];
                    metadata.investment_duration = questionnaireData['4'];
                    metadata.preferred_sectors = questionnaireData['5'];
                    metadata.expected_return = questionnaireData['6'];
                }
            } else {
                if (questionnaireData) {
                    metadata.sector = questionnaireData['sector'] || null;
                }
            }

            if (questionnaireData) {
                metadata.questionnaire_responses = questionnaireData;
                metadata.project_summary = questionnaireData['summary'] || null;
            }

            // 1. Sign up user (Trigger handles DB insertion)
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: metadata,
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (authError) throw authError;

            if (authData.user) {
                console.log("✅ User created successfully:", authData.user.id);

                // Clear localStorage
                localStorage.removeItem('investmentAnswers');
                localStorage.removeItem('questionnaireCompleted');
                localStorage.removeItem('userType');

                // Success message handling below...

                // 5. Show success message then redirect
                const dashboardPath = formData.userType === 'investor'
                    ? '/dashboard/investor'
                    : '/dashboard/entrepreneur';

                const successMessage = formData.userType === 'investor'
                    ? '✅ تم التسجيل بنجاح! حسابك قيد المراجعة الإدارية. سيتم إرسال بريد إلكتروني فور الموافقة.'
                    : '✅ تم التسجيل بنجاح! مرحباً بك في مجتمع مرفأ لرواد الأعمال.';

                setSuccess(successMessage);

                // Redirect after 3 seconds to show success message
                setTimeout(() => {
                    router.push(dashboardPath);
                }, 3000);
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.');
        } finally {
            setIsLoading(false);
        }
    };

    // Role Selection Screen - shown first if no userType selected
    if (!formData.userType) {
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
                        <h2 className="text-2xl font-bold text-foreground mb-2">اختر نوع الحساب</h2>
                        <p className="text-foreground/60 text-sm">ابدأ رحلتك في مجتمع مرفأ الاستثماري</p>
                    </div>

                    <div className="space-y-4">
                        {/* Investor Card */}
                        <button
                            onClick={() => setFormData({ ...formData, userType: 'investor' })}
                            className="w-full p-6 bg-white border-2 border-slate-100 rounded-2xl flex items-center gap-4 hover:border-blue-500 hover:bg-blue-50 transition-all group text-right shadow-sm"
                        >
                            <div className="bg-blue-100 text-blue-600 p-4 rounded-xl text-3xl group-hover:scale-110 transition-transform">
                                💰
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-800 text-lg mb-1">أنا مستثمر</h3>
                                <p className="text-xs text-slate-500">أبحث عن فرص واعدة في حائل والمملكة</p>
                            </div>
                            <div className="text-slate-300 group-hover:text-blue-500 transition">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </button>

                        {/* Entrepreneur Card */}
                        <button
                            onClick={() => setFormData({ ...formData, userType: 'entrepreneur' })}
                            className="w-full p-6 bg-white border-2 border-slate-100 rounded-2xl flex items-center gap-4 hover:border-teal-500 hover:bg-teal-50 transition-all group text-right shadow-sm"
                        >
                            <div className="bg-teal-100 text-teal-600 p-4 rounded-xl text-3xl group-hover:scale-110 transition-transform">
                                💡
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-800 text-lg mb-1">لدي فكرة مشروع</h3>
                                <p className="text-xs text-slate-500">أبحث عن تمويل وشراكات ذكية</p>
                            </div>
                            <div className="text-slate-300 group-hover:text-teal-500 transition">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </button>

                        {/* Back to Login */}
                        <div className="text-center mt-6">
                            <Link href="/login" className="text-sm text-slate-400 hover:text-blue-600 transition">
                                لديك حساب بالفعل؟ تسجيل الدخول
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <button
                            onClick={() => setFormData({ ...formData, userType: '', email: '', fullName: '', phone: '', password: '', confirmPassword: '', commercialRegister: '' })}
                            className="text-slate-400 hover:text-blue-600 transition"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <p className="text-foreground/70">
                            {formData.userType === 'investor' ? 'تسجيل مستثمر' : 'تسجيل رائد أعمال'}
                        </p>
                    </div>
                </div>

                <Card glass className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">

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

                        {/* Commercial Register - Only for Investors */}
                        {formData.userType === 'investor' && (
                            <Input
                                label="رقم السجل التجاري (اختياري)"
                                type="text"
                                value={formData.commercialRegister}
                                onChange={(e) => setFormData({ ...formData, commercialRegister: e.target.value })}
                                placeholder="700xxxxxxx"
                                helperText="إضافة السجل التجاري يساعد في تسريع عملية الاعتماد"
                                startIcon={
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                }
                            />
                        )}

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

                        {/* Success Message */}
                        {success && (
                            <div className="bg-green-50 border-2 border-green-500 text-green-800 px-4 py-4 rounded-xl text-sm font-bold text-center animate-fade-in">
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
