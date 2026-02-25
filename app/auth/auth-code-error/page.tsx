"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Suspense } from 'react';

function AuthCodeErrorContent() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4" dir="rtl">
            <div className="w-full max-w-md animate-fade-in-up">
                <div className="text-center mb-8">
                    <p className="text-foreground/70">خطأ في التوثيق</p>
                </div>

                <Card glass className="p-8 text-center">
                    <div className="bg-red-100 text-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>

                    <h2 className="text-xl font-bold text-foreground mb-4">
                        حدث خطأ أثناء التحقق
                    </h2>

                    <p className="text-foreground/60 mb-6">
                        {errorDescription || 'الرابط الذي استخدمته غير صالح أو منتهي الصلاحية.'}
                    </p>

                    <div className="space-y-4">
                        <Link href="/login">
                            <Button fullWidth size="lg">
                                العودة لتسجيل الدخول
                            </Button>
                        </Link>

                        <div className="text-sm text-foreground/50">
                            اذا استمرت المشكلة، يرجى التواصل مع الدعم الفني
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default function AuthCodeErrorPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-foreground/60">جاري التحميل...</p>
                </div>
            </div>
        }>
            <AuthCodeErrorContent />
        </Suspense>
    );
}
