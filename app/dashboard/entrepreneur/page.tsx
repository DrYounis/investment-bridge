'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function EntrepreneurDashboard() {
    const [activeTab, setActiveTab] = useState<'overview' | 'profile'>('overview');

    // Calculate attraction score based on profile completeness
    const [profileCompleteness] = useState({
        basicInfo: true,  // Name, email (always complete after signup)
        businessDescription: false,
        marketResearch: false,
        financialProjections: false,
    });

    const calculateAttractionScore = () => {
        const weights = {
            basicInfo: 20,
            businessDescription: 20,
            marketResearch: 30,
            financialProjections: 30,
        };

        let score = 0;
        if (profileCompleteness.basicInfo) score += weights.basicInfo;
        if (profileCompleteness.businessDescription) score += weights.businessDescription;
        if (profileCompleteness.marketResearch) score += weights.marketResearch;
        if (profileCompleteness.financialProjections) score += weights.financialProjections;

        return score;
    };

    const attractionScore = calculateAttractionScore();

    return (
        <div className="min-h-screen bg-slate-50" dir="rtl">
            <nav className="bg-white border-b border-gray-100 px-6 py-4 mb-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="text-xl font-bold text-gray-800">مرفأ <span className="text-blue-600">.</span> <span className="text-gray-400 font-normal">| رواد الأعمال</span></div>
                    <Link href="/" className="text-sm text-gray-500 hover:text-blue-600">
                        تسجيل خروج ⬅
                    </Link>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 py-8">

                {/* Tabs */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white p-1 rounded-full border border-gray-200 shadow-sm flex">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'overview' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            لوحة التحكم 📊
                        </button>
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'profile' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            ملفي الشخصي 👤
                        </button>
                    </div>
                </div>

                {activeTab === 'overview' ? (
                    <EntrepreneurOverview attractionScore={attractionScore} profileCompleteness={profileCompleteness} />
                ) : (
                    <EntrepreneurProfile />
                )}

            </div>
        </div>
    );
}

function EntrepreneurOverview({ attractionScore, profileCompleteness }: { attractionScore: number, profileCompleteness: any }) {
    // Determine next action tip
    const getNextActionTip = () => {
        if (!profileCompleteness.businessDescription) {
            return 'أكمل وصف المشروع لرفع النسبة إلى 40%';
        } else if (!profileCompleteness.marketResearch) {
            return 'أضف دراسة السوق لرفع النسبة إلى 70%';
        } else if (!profileCompleteness.financialProjections) {
            return 'أضف التوقعات المالية للوصول إلى 100%!';
        }
        return 'بروفايلك مكتمل! الآن يمكن للمستثمرين رؤية مشروعك';
    };

    return (
        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Attraction Score + Project Status */}
            <div className="lg:col-span-2 space-y-6">

                {/* Gamification Meter - NEW */}
                <div className="bg-gradient-to-br from-teal-500 to-blue-600 p-8 rounded-3xl text-white shadow-xl">
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <h3 className="font-bold text-white/90 text-sm mb-1">مؤشر جذب المستثمرين</h3>
                            <p className="text-white/70 text-xs">كلما زادت النسبة, زادت فرص التمويل</p>
                        </div>
                        <span className="text-5xl font-black">{attractionScore}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-5 overflow-hidden backdrop-blur mb-4">
                        <div
                            className="bg-white h-full rounded-full transition-all duration-1000 shadow-lg"
                            style={{ width: `${attractionScore}%` }}
                        ></div>
                    </div>
                    <div className="flex items-start gap-2 bg-white/10 backdrop-blur p-3 rounded-xl">
                        <span className="text-yellow-300 text-xl">💡</span>
                        <p className="text-sm text-white/90">
                            <span className="font-bold">نصيحة:</span> {getNextActionTip()}
                        </p>
                    </div>
                </div>

                {/* Status Card */}
                <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">حالة المشروع الحالي</h2>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center text-3xl">
                            🧪
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">مشروع: منصة تمور</h3>
                            <p className="text-sm text-gray-500">آخر تحديث: قبل ساعتين</p>
                        </div>
                        <div className="mr-auto">
                            <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">قيد المختبر</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>اكتمال الدراسة</span>
                                <span className="font-bold text-blue-600">65%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600 w-[65%]"></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <Link href="/marfa/lab/financial" className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-300 hover:bg-blue-50 transition text-center group">
                                <div className="text-2xl mb-2 group-hover:scale-110 transition">💰</div>
                                <div className="text-sm font-bold text-gray-700">التدقيق المالي</div>
                            </Link>
                            <Link href="/marfa/lab/mvp" className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-300 hover:bg-blue-50 transition text-center group">
                                <div className="text-2xl mb-2 group-hover:scale-110 transition">🏗️</div>
                                <div className="text-sm font-bold text-gray-700">النموذج الأولي</div>
                            </Link>
                        </div>

                        <Link href="/marfa/lab" className="block w-full py-3 bg-blue-600 text-white text-center rounded-xl font-bold font-sm mt-4 hover:bg-blue-700">
                            متابعة العمل في المختبر ⬅
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right Column: Sidebar */}
            <div className="space-y-6">
                <div className="bg-gradient-to-br from-indigo-900 to-slate-800 rounded-3xl p-8 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="font-bold text-xl mb-2">خدمة Pitch Deck Pro ✨</h3>
                        <p className="text-slate-300 text-sm mb-6">احصل على عرض استثماري احترافي مصمم بالذكاء الاصطناعي لزيادة فرص قبولك.</p>
                        <Link href="/services/pitch-deck" className="inline-block px-4 py-2 bg-white text-slate-900 rounded-lg text-sm font-bold hover:bg-indigo-50">
                            عرض التفاصيل
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-gray-200">
                    <h3 className="font-bold text-gray-800 mb-4">التنبيهات</h3>
                    <div className="space-y-3">
                        <div className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg">
                            <div className="text-green-500 mt-1">●</div>
                            <div>
                                <p className="text-sm font-bold text-gray-700">تم تسجيل حسابك بنجاح</p>
                                <p className="text-xs text-gray-500">أهلاً بك في رحلة ريادة الأعمال مع مرفأ.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function EntrepreneurProfile() {
    return (
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
                <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center text-4xl">
                    💡
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">ملف رائد الأعمال</h2>
                    <p className="text-gray-500 text-sm">بياناتك الشخصية وسجل مشاريعك</p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">الاسم الكامل</label>
                        <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 outline-none" defaultValue="رائد أعمال" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">البريد الإلكتروني</label>
                        <input type="email" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 outline-none" defaultValue="founder@example.com" disabled />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">نبذة مهنية (Bio)</label>
                    <textarea className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 outline-none h-24" placeholder="تحدث عن خبراتك السابقة..."></textarea>
                </div>

                <div className="flex justify-end pt-4">
                    <button className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition">
                        حفظ التغييرات
                    </button>
                </div>
            </div>
        </div>
    )
}
