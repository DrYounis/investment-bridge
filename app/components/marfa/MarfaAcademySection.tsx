"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

interface UserProfile {
    user_type: string;
    full_name: string;
}

interface InvestorProfile {
    approval_status: string;
}

const MarfaAcademySection = () => {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [approvalStatus, setApprovalStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Curriculum data - dates updated to start next Friday (Feb 7, 2026)
    const curriculum = [
        {
            id: 1,
            date: "7 فبراير",
            topic: "الاستراتيجية",
            case: "Airbnb: البداية من الصفر",
            icon: "♟️",
            status: "upcoming"
        },
        {
            id: 2,
            date: "21 فبراير",
            topic: "القيادة والثقافة",
            case: "Zappos: خدمة العملاء",
            icon: "🤝",
            status: "locked"
        },
        {
            id: 3,
            date: "7 مارس",
            topic: "المالية والاستثمار",
            case: "WeWork: درس في التقييم",
            icon: "💰",
            status: "locked"
        },
        {
            id: 4,
            date: "21 مارس",
            topic: "التسويق والنمو",
            case: "Liquid Death: التميز",
            icon: "🚀",
            status: "locked"
        },
    ];

    useEffect(() => {
        async function fetchUserData() {
            try {
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    setLoading(false);
                    return;
                }

                // Fetch user profile
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('user_type, full_name')
                    .eq('id', user.id)
                    .single();

                setUserProfile(profile);

                // If investor, fetch approval status
                if (profile?.user_type === 'investor') {
                    const { data: investorData } = await supabase
                        .from('investor_profiles')
                        .select('approval_status')
                        .eq('user_id', user.id)
                        .single();

                    setApprovalStatus(investorData?.approval_status || 'pending');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchUserData();
    }, []);

    // Determine user access level
    const isInvestor = userProfile?.user_type === 'investor';
    const isPendingInvestor = isInvestor && approvalStatus === 'pending';
    const isApprovedInvestor = isInvestor && approvalStatus === 'approved';
    const isEntrepreneur = userProfile?.user_type === 'entrepreneur';
    const hasFullAccess = isApprovedInvestor || isEntrepreneur;
    const isGuest = !userProfile;

    return (
        <section className="py-20 bg-slate-50 border-t border-slate-200" dir="rtl">
            <div className="max-w-6xl mx-auto px-6">

                {/* Status Bar - only for logged in investors */}
                {isInvestor && (
                    <div className="mb-8 flex justify-center">
                        {isPendingInvestor ? (
                            <span className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-sm">
                                ⏳ قيد المراجعة الإدارية
                            </span>
                        ) : isApprovedInvestor ? (
                            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                                🌟 PRO INVESTOR
                            </span>
                        ) : null}
                    </div>
                )}

                {/* Pending Investor Alert */}
                {isPendingInvestor && (
                    <div className="mb-8 bg-orange-50 border-2 border-orange-200 p-6 rounded-2xl flex items-start gap-4">
                        <span className="text-3xl">🕵️‍♂️</span>
                        <div>
                            <h4 className="font-bold text-orange-800 text-lg mb-2">حسابك قيد التحقق الأمني والمالي</h4>
                            <p className="text-sm text-orange-700 leading-relaxed">
                                نحرص في "مرفأ" على نخبة المجتمع الاستثماري. سيقوم فريق الإدارة بمراجعة طلبك خلال 24 ساعة.
                                حتى ذلك الحين، تظهر لك النسخة العامة من الأكاديمية.
                            </p>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="text-center mb-16">
                    <span className="text-blue-600 font-bold tracking-wide text-sm bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                        مجتمع المعرفة
                    </span>
                    <h2 className="text-4xl font-black text-slate-800 mt-4 mb-4">أكاديمية مرفأ <span className="text-teal-500">للقيادة</span></h2>
                    <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                        نخرج من الإطار النظري إلى الواقع عبر دراسة حالات عالمية (Case Studies) ومناقشتها وإسقاطها على سوق حائل، بأسلوب الـ MBA التنفيذي.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-10 items-start">

                    {/* Right Column: Next Event Card */}
                    <div className="lg:col-span-5 relative">
                        <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-10 rounded-full"></div>
                        <div className={`relative bg-white border-2 rounded-3xl p-8 shadow-xl overflow-hidden group transition-all ${isPendingInvestor ? 'border-slate-200 opacity-90' : 'border-blue-100 hover:border-blue-300'
                            }`}>

                            {/* Badge */}
                            <div className="absolute top-0 left-0 bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-br-2xl">
                                اللقاء القادم
                            </div>

                            <div className="text-center mt-6">
                                <div className={`w-20 h-20 bg-blue-50 rounded-2xl mx-auto flex items-center justify-center text-4xl mb-6 transition-transform duration-300 ${!isPendingInvestor && 'group-hover:scale-110'
                                    }`}>
                                    ♟️
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-2">الاستراتيجية وتحليل السوق</h3>
                                <p className="text-blue-600 font-medium text-sm mb-6">دراسة حالة: Airbnb vs. Hotels</p>

                                <div className="flex justify-center items-center gap-4 text-sm text-slate-500 mb-8">
                                    <span className="flex items-center gap-1">📅 الجمعة 7 فبراير</span>
                                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                    <span className="flex items-center gap-1">📍 حائل</span>
                                </div>

                                <div className="space-y-3">
                                    {isPendingInvestor ? (
                                        <button disabled className="w-full py-3 bg-slate-200 text-slate-400 rounded-xl font-bold cursor-not-allowed">
                                            بانتظار الموافقة للتسجيل 🔒
                                        </button>
                                    ) : isGuest ? (
                                        <Link href="/login">
                                            <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-200">
                                                تسجيل الدخول للحضور
                                            </button>
                                        </Link>
                                    ) : (
                                        <Link href="/register?type=entrepreneur">
                                            <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-200">
                                                تأكيد الحضور {isApprovedInvestor && '(VIP)'}
                                            </button>
                                        </Link>
                                    )}

                                    {hasFullAccess && (
                                        <a
                                            href="/marfa/airbnb-worksheet.html"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full py-3 bg-white text-slate-600 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition flex justify-center items-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                            تحميل ورقة العمل (PDF)
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Left Column: Curriculum Timeline */}
                    <div className="lg:col-span-7">
                        <h3 className="text-xl font-bold text-slate-800 mb-8 border-r-4 border-teal-500 pr-3 flex justify-between items-center">
                            <span>جدول الفصل الأول (فبراير - مارس)</span>
                            {!hasFullAccess && !loading && (
                                <span className="text-xs bg-slate-100 px-3 py-1 rounded-full text-slate-400 flex items-center gap-1">
                                    🔒 للمعتمدين فقط
                                </span>
                            )}
                        </h3>

                        {hasFullAccess ? (
                            // Full curriculum for approved investors and entrepreneurs
                            <div className="space-y-4">
                                {curriculum.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`flex items-center p-4 rounded-2xl border transition-all duration-300 ${item.status === 'upcoming'
                                                ? 'bg-white border-blue-200 shadow-md scale-[1.02]'
                                                : 'bg-white/50 border-slate-100 hover:bg-white hover:border-slate-200 opacity-80 hover:opacity-100'
                                            }`}
                                    >
                                        <div className={`flex-shrink-0 w-16 h-16 rounded-xl flex flex-col items-center justify-center text-sm font-bold ${item.status === 'upcoming' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                                            }`}>
                                            <span>{item.date.split(' ')[0]}</span>
                                            <span className="text-[10px] font-normal">{item.date.split(' ')[1]}</span>
                                        </div>

                                        <div className="mr-6 flex-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <h4 className={`font-bold ${item.status === 'upcoming' ? 'text-slate-900' : 'text-slate-600'}`}>
                                                    {item.topic}
                                                </h4>
                                                <span className="text-2xl">{item.icon}</span>
                                            </div>
                                            <p className="text-sm text-slate-500">
                                                <span className="font-semibold text-teal-600">دراسة حالة:</span> {item.case}
                                            </p>
                                        </div>

                                        <div className="mr-4 text-slate-300">
                                            {item.status === 'upcoming' ? (
                                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            // Blurred curriculum for pending/guest users
                            <div className="space-y-4">
                                {curriculum.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center p-4 rounded-2xl border bg-white/50 border-slate-100 opacity-60"
                                    >
                                        <div className="flex-shrink-0 w-16 h-16 rounded-xl flex flex-col items-center justify-center text-sm font-bold bg-slate-100 text-slate-400 blur-sm">
                                            <span>{item.date.split(' ')[0]}</span>
                                            <span className="text-[10px] font-normal">{item.date.split(' ')[1]}</span>
                                        </div>

                                        <div className="mr-6 flex-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <h4 className="font-bold text-slate-400 blur-md select-none">
                                                    ████████ ██████
                                                </h4>
                                                <span className="text-2xl blur-sm">{item.icon}</span>
                                            </div>
                                            <p className="text-sm text-slate-400 blur-sm select-none">
                                                دراسة حالة: ████████
                                            </p>
                                        </div>

                                        <div className="mr-4">
                                            <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                        </div>
                                    </div>
                                ))}

                                {/* Locked Message Overlay */}
                                <div className="mt-6 p-6 bg-slate-50 border-2 border-slate-200 rounded-2xl text-center">
                                    <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                                        🔒
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-700 mb-2">
                                        {isPendingInvestor ? 'المحتوى محجوب مؤقتاً' : 'محتوى حصري'}
                                    </h4>
                                    <p className="text-slate-500 text-sm max-w-md mx-auto">
                                        {isPendingInvestor
                                            ? 'لا يمكنك الاطلاع على الجدول الأكاديمي الكامل حتى يتم اعتماد عضويتك من قبل الإدارة.'
                                            : isGuest
                                                ? 'جدول اللقاءات القادمة متاح للأعضاء المسجلين فقط.'
                                                : 'جدول اللقاءات القادمة متاح فقط للمستثمرين المعتمدين.'}
                                    </p>
                                </div>
                            </div>
                        )}

                        {hasFullAccess && (
                            <div className="mt-8 p-4 bg-teal-50 border border-teal-100 rounded-xl flex items-start gap-3">
                                <span className="text-teal-600 text-xl">💡</span>
                                <p className="text-sm text-teal-800 leading-relaxed">
                                    <span className="font-bold">ملاحظة:</span> جميع اللقاءات تعقد يوم الجمعة بعد العصر. الحضور متاح فقط لأعضاء المنصة المسجلين (مستثمر أو صاحب فكرة معتمدة).
                                </p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default MarfaAcademySection;
