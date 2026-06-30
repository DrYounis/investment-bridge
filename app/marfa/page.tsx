import React from 'react';
import Link from 'next/link';
import IdeaValidator from '../components/marfa/IdeaValidator';
import MeetingScheduler from '../components/marfa/MeetingScheduler';

export default async function MarfaLandingPage() {
    return (
        <div className="min-h-screen bg-[#0a0f1e] text-right pt-32" dir="rtl">
            <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">

                {/* Hero Section */}
                <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
                    <div className="order-2 md:order-1 space-y-8 animate-fade-in-up">
                        <div className="inline-block px-4 py-2 bg-[#c9a84c]/10 text-[#c9a84c] rounded-full text-sm font-bold tracking-wide border border-[#c9a84c]/20">
                            حاضنة الأفكار الذكية
                        </div>
                        <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight">
                            في <span className="text-[#c9a84c]">مرفأ</span>.. <br />
                            فكرتك لا تموت، بل تُصقل.
                        </h1>
                        <p className="text-xl text-[#a0aec0] leading-relaxed">
                            الجسر الآمن الذي ينقل فكرتك من مجرد "خاطرة" إلى "مشروع استثماري" متكامل مبني على الأرقام وحقائق السوق، وليس الأحلام فقط.
                        </p>
                        <div className="flex gap-4 pt-4">
                            <Link href="/executive-summary" className="px-8 py-4 bg-[#c9a84c] hover:bg-[#d4a843] text-[#0a0f1e] rounded-2xl font-bold shadow-lg transition-all hover:-translate-y-1">
                                ابدأ رحلة التنقيح
                            </Link>
                            <button className="px-8 py-4 bg-[#0d1628] border-2 border-[#1a2540] text-[#a0aec0] rounded-2xl font-bold hover:border-[#c9a84c]/40 hover:bg-[#c9a84c]/5 transition-all">
                                كيف نعمـل؟
                            </button>
                        </div>
                    </div>

                    {/* Visual abstract representation */}
                    <div className="order-1 md:order-2 relative">
                        <div className="absolute top-0 right-0 w-72 h-72 bg-[#c9a84c]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                        <div className="absolute top-0 -left-4 w-72 h-72 bg-[#c9a84c]/15 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-[#c9a84c]/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
                        <div className="relative bg-[#0d1628]/70 backdrop-blur-xl border border-[#c9a84c]/20 p-8 rounded-3xl shadow-2xl">
                            <div className="space-y-6">
                                <StepCard
                                    num="01"
                                    title="الفلترة والتحليل"
                                    desc="فحص جدوى الفكرة تقنياً وتجارياً باستخدام بيانات السوق الحقيقية."
                                    icon={<FilterIcon />}
                                    color="bg-[#c9a84c]/15 text-[#c9a84c]"
                                />
                                <StepCard
                                    num="02"
                                    title="المختبر والتوجيه"
                                    desc="تعديل المسار (Pivot) أو الانتقال لدراسة الجدوى التفصيلية."
                                    icon={<CompassIcon />}
                                    color="bg-[#c9a84c]/15 text-[#c9a84c]"
                                />
                                <StepCard
                                    num="03"
                                    title="بطاقة المستثمر"
                                    desc="توليد ملف استثماري احترافي جاهز للتمويل."
                                    icon={<FileCheckIcon />}
                                    color="bg-[#c9a84c]/15 text-[#c9a84c]"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Value Proposition Section */}
                <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                    <h2 className="text-3xl font-bold text-white">لماذا تبدأ من مرفأ؟</h2>
                    <p className="text-[#a0aec0]">نحن لا نقدم نصيحة عابرة، بل نقدم خارطة طريق.</p>
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
                <div className="bg-[#0d1628] rounded-3xl p-8 md:p-16 text-white text-center relative overflow-hidden mb-24 border border-[#1a2540]">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl font-bold mb-6">جاهز لاختبار فكرتك؟</h2>
                        <p className="text-[#a0aec0] mb-8 text-lg">
                            أدخل "مختبر دراسة الجدوى" الآن واحصل على تقرير فوري (SWOT) يوضح نقاط القوة والضعف في مشروعك.
                        </p>
                        <div className="flex flex-col md:flex-row justify-center gap-4">
                            <Link href="/marfa/assessment" className="inline-block px-10 py-5 bg-[#c9a84c] hover:bg-[#d4a843] text-[#0a0f1e] rounded-2xl font-bold shadow-lg transition-all text-xl">
                                إبدأ التحليل المجاني 🚀
                            </Link>
                        </div>
                        <p className="mt-4 text-xs text-[#64748b]">* لا يتطلب اشتراك مدفوع لهذه المرحلة</p>
                    </div>
                </div>

                {/* Idea Validator Section */}
                <div className="mb-24">
                    <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
                        <h2 className="text-3xl font-bold text-white">
                            قدّم فكرتك{' '}
                            <span className="text-[#c9a84c]">للتحليل</span>
                        </h2>
                        <p className="text-[#a0aec0]">
                            احصل على تقييم خبير لفكرة مشروعك. فريقنا يقيّم الإمكانات السوقية، الجدوى التقنية، وجاهزية الاستثمار.
                        </p>
                    </div>
                    <IdeaValidator />
                </div>

                {/* Meeting Scheduler Section */}
                <div className="mb-24">
                    <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
                        <h2 className="text-3xl font-bold text-white">
                            احجز{' '}
                            <span className="text-[#c9a84c]">اجتماعاً</span> مع فريقنا
                        </h2>
                        <p className="text-[#a0aec0]">
                            جدولة جلسة فردية لمناقشة مشروعك، احتياجات التمويل، أو فرص الشراكة مع فريق الاستثمار.
                        </p>
                    </div>
                    <MeetingScheduler />
                </div>

            </main>
        </div>
    );
}

function StepCard({ num, title, desc, icon, color }: any) {
    return (
        <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-[#c9a84c]/5 transition duration-300">
            <div className={`p-3 rounded-lg ${color} shrink-0`}>
                {icon}
            </div>
            <div>
                <div className="text-xs font-bold text-[#64748b] mb-1">المرحلة {num}</div>
                <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
                <p className="text-sm text-[#a0aec0] leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

function ValueCard({ title, desc, emoji }: any) {
    return (
        <div className="bg-[#0d1628] p-8 rounded-2xl shadow-sm border border-[#1a2540] hover:shadow-xl hover:-translate-y-1 hover:border-[#c9a84c]/30 transition duration-300">
            <div className="text-4xl mb-4">{emoji}</div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-[#a0aec0] leading-relaxed text-sm">{desc}</p>
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
