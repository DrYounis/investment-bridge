"use client";

import Link from 'next/link';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function VerificationSuccessPage() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4" dir="rtl">
            <div className="w-full max-w-md animate-fade-in-up">
                <div className="text-center mb-8">
                    <Link href="/" className="text-2xl font-bold text-gold">
                        Marfa<span className="text-foreground">.sa</span>
                    </Link>
                    <p className="text-foreground/70 mt-2">تأكيد البريد الإلكتروني</p>
                </div>

                <Card glass className="p-8 text-center">
                    <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <h2 className="text-xl font-bold text-foreground mb-4">
                        ✅ تم تأكيد البريد الإلكتروني بنجاح
                    </h2>

                    <p className="text-foreground/60 mb-6 leading-relaxed">
                        تم تفعيل حسابك بنجاح. يمكنك الآن تسجيل الدخول
                        والبدء في استخدام جميع ميزات المنصة.
                    </p>

                    <div className="space-y-4">
                        <Link href="/login">
                            <Button fullWidth size="lg">
                                تسجيل الدخول الآن
                            </Button>
                        </Link>

                        <Link href="/" className="block">
                            <Button fullWidth variant="outline" size="lg">
                                العودة للصفحة الرئيسية
                            </Button>
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
}
