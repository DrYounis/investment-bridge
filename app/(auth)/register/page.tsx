"use client";

import { useState } from 'react';
import Link from 'next/link';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        userType: 'investor' as 'investor' | 'opportunity_provider',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

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

        // TODO: Implement actual registration logic with Supabase
        setTimeout(() => {
            setIsLoading(false);
            // Redirect to questionnaire
            window.location.href = '/questionnaire';
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md animate-fade-in-up">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gradient mb-2">Investment Bridge</h1>
                    <p className="text-foreground/70">إنشاء حساب جديد</p>
                </div>

                <Card glass className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* User Type Selection */}
                        <div>
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
                                    onClick={() => setFormData({ ...formData, userType: 'opportunity_provider' })}
                                    className={`p-4 rounded-lg border-2 transition-all ${formData.userType === 'opportunity_provider'
                                            ? 'border-primary bg-primary/10 text-primary'
                                            : 'border-gray-300 hover:border-primary/50'
                                        }`}
                                >
                                    <div className="text-2xl mb-2">🚀</div>
                                    <div className="font-bold">مقدم فرصة</div>
                                    <div className="text-xs text-foreground/60">أعرض فرصة استثمارية</div>
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
