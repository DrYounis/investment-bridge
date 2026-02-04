import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function MarfaLandingPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 text-right" dir="rtl">
            {/* Navbar Placeholder */}
            <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
                <div className="text-2xl font-bold text-blue-900">مرفأ <span className="text-blue-500">.</span></div>
                <div className="flex gap-4 items-center">
                    <Link href="/" className="text-gray-600 hover:text-blue-600 font-medium transition">الرئيسية</Link>
                    {user ? (
                        <Link href="/dashboard/hub" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm">
                            لوحة التحكم
                        </Link>
                    ) : (
                        <Link href="/login" className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium text-sm">
                            دخول
                        </Link>
                    )}
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">

                {/* Hero Section */}
                <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
                    <div className="order-2 md:order-1 space-y-8 animate-fade-in-up">
                        <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold tracking-wide">
                            حاضنة الأفكار الذكية
                        </div>
                        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight">
                            في <span className="text-blue-600">مرفأ</span>.. <br />
                            فكرتك لا تموت، بل تُصقل.
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed">
                            الجسر الآمن الذي ينقل فكرتك من مجرد "خاطرة" إلى "مشروع استثماري" متكامل مبني على الأرقام وحقائق السوق، وليس الأحلام فقط.
                        </p>
                        <div className="flex gap-4 pt-4">
                            <Link href="/executive-summary" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-1">
                                ابدأ رحلة التنقيح
                            </Link>
                            <button className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-bold hover:border-blue-200 hover:bg-blue-50 transition-all">
                                كيف نعمـل؟
                            </button>
                        </div>
                    </div>

                    {/* Visual abstract representation */}
                    <div className="order-1 md:order-2 relative">
                        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
                        <div className="relative bg-white/60 backdrop-blur-xl border border-white/50 p-8 rounded-3xl shadow-2xl">
                            <div className="space-y-6">
                                <StepCard
                                    num="01"
                                    title="الفلترة والتحليل"
                                    desc="فحص جدوى الفكرة تقنياً وتجارياً باستخدام بيانات السوق الحقيقية."
                                    icon={<FilterIcon />}
                                    color="bg-blue-100 text-blue-600"
                                />
                                <StepCard
                                    num="02"
                                    title="المختبر والتوجيه"
                                    desc="تعديل المسار (Pivot) أو الانتقال لدراسة الجدوى التفصيلية."
                                    icon={<CompassIcon />}
                                    color="bg-purple-100 text-purple-600"
                                />
                                <StepCard
                                    num="03"
                                    title="بطاقة المستثمر"
                                    desc="توليد ملف استثماري احترافي جاهز للتمويل."
                                    icon={<FileCheckIcon />}
                                    color="bg-green-100 text-green-600"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Value Proposition Section */}
                <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                    <h2 className="text-3xl font-bold text-slate-900">لماذا تبدأ من مرفأ؟</h2>
                    <p className="text-gray-500">نحن لا نقدم نصيحة عابرة، بل نقدم خارطة طريق.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-24 cursor-default">
                    <ValueCard
                        title="حماية الموارد"
                        desc="اكتشف جدوى المشروع قبل إنفاق ريال واحد. الفشل المبكر أفضل من الخسارة المتأخرة."
                        emoji="🛡️"
                    />
                    <ValueCard
                        title="قرارات مبنية على بيانات"
                        desc="تحليلاتنا تعتمد على أرقام السوق والمنافسين، مما يزيل عامل التخمين من معادلتك."
                        emoji="📊"
                    />
                    <ValueCard
                        title="ثقة المستثمرين"
                        desc="المشاريع القادمة عبر 'مرفأ' تحظى بموثوقية أعلى لأنها مرت بفلتر التدقيق الصارم."
                        emoji="🤝"
                    />
                </div>

                {/* Sample Dashboard Teaser */}
                <div className="bg-slate-900 rounded-3xl p-8 md:p-16 text-white text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl font-bold mb-6">جاهز لاختبار فكرتك؟</h2>
                        <p className="text-slate-300 mb-8 text-lg">
                            أدخل "مختبر دراسة الجدوى" الآن واحصل على تقرير فوري (SWOT) يوضح نقاط القوة والضعف في مشروعك.
                        </p>
                        <div className="flex flex-col md:flex-row justify-center gap-4">
                            <Link href="/marfa/assessment" className="inline-block px-10 py-5 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-bold shadow-lg shadow-green-900/20 transition-all font-xl">
                                إبدأ التحليل المجاني (Free) 🚀
                            </Link>
                        </div>
                        <p className="mt-4 text-xs text-slate-400 opacity-60">* لا يتطلب اشتراك مدفوع لهذه المرحلة</p>
                    </div>
                </div>

            </main>
        </div>
    );
}

function StepCard({ num, title, desc, icon, color }: any) {
    return (
        <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white transition duration-300">
            <div className={`p-3 rounded-lg ${color} shrink-0`}>
                {icon}
            </div>
            <div>
                <div className="text-xs font-bold text-gray-400 mb-1">المرحلة {num}</div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

function ValueCard({ title, desc, emoji }: any) {
    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition duration-300">
            <div className="text-4xl mb-4">{emoji}</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-gray-500 leading-relaxed text-sm">{desc}</p>
        </div>
    );
}

// Icons
const FilterIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
);

const CompassIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
);

const FileCheckIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
