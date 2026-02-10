"use client";

import React, { useEffect, useState } from 'react';
import {
    Activity,
    Users,
    Zap,
    TrendingUp,
    Clock,
    ArrowLeft,
    Trophy,
    Award,
    Calendar,
    BarChart3
} from 'lucide-react';
import Link from 'next/link';
import { getNikeRunStats, NikeRunStats } from '@/lib/services/nike-service';

export default function TechnicalReportsPage() {
    const [stats, setStats] = useState<NikeRunStats | null>(null);

    useEffect(() => {
        getNikeRunStats().then(setStats);
    }, []);

    if (!stats) {
        return (
            <div className="min-h-screen bg-[#FDFCF0] flex items-center justify-center" dir="rtl">
                <div className="text-deep-navy animate-pulse font-arabic">جاري تحميل البيانات...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFCF0] text-right font-arabic" dir="rtl">
            {/* Header */}
            <header className="bg-deep-navy py-8 px-6 text-white">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <Link href="/csr" className="inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors mb-4">
                            <ArrowLeft className="w-4 h-4 transform rotate-180" />
                            <span>العودة للخدمات</span>
                        </Link>
                        <h1 className="text-3xl font-black">تقارير الأثر التقنية</h1>
                        <p className="text-blue-200 mt-2">بيانات حية متصلة بـ Nike Run Club - ماراثون حائل 2026</p>
                    </div>
                    <div className="hidden md:block">
                        <div className="bg-white/10 p-4 rounded-2xl border border-white/20">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center p-2">
                                    <svg viewBox="0 0 24 24" fill="white" className="w-full h-full"><path d="M21 8.74c0 .35-.14.68-.4.92l-9.1 8.44c-.6.55-1.5.55-2.1 0L3.4 12.2c-.4-.37-.48-.95-.2-1.4l.65-1.07c.28-.46.88-.6 1.34-.33l4.8 2.8c.24.14.54.1.75-.1l7.8-7.5c.34-.33.87-.33 1.2 0l1.26 1.2c.26.24.4.57.4.94z" /></svg>
                                </div>
                                <div>
                                    <p className="text-xs opacity-60">النظام المتصل</p>
                                    <p className="font-bold">Nike Run API</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* Hero Stats */}
                <div className="grid md:grid-cols-4 gap-6 mb-12">
                    <ImpactStatCard
                        icon={<TrendingUp className="w-8 h-8" />}
                        label="إجمالي المسافة"
                        value={`${stats.totalDistance.toLocaleString()} كم`}
                        color="text-green-600"
                    />
                    <ImpactStatCard
                        icon={<Users className="w-8 h-8" />}
                        label="المشاركون النشطون"
                        value={`${stats.activeParticipants}`}
                        color="text-blue-600"
                    />
                    <ImpactStatCard
                        icon={<Zap className="w-8 h-8" />}
                        label="السعرات المحروقة"
                        value={`${stats.caloriesBurned.toLocaleString()}`}
                        color="text-orange-600"
                    />
                    <ImpactStatCard
                        icon={<Clock className="w-8 h-8" />}
                        label="متوسط الوتيرة"
                        value={`${stats.averagePace} /كم`}
                        color="text-purple-600"
                    />
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Weekly Progress */}
                    <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-deep-navy flex items-center gap-2">
                                <BarChart3 className="w-6 h-6 text-gold" />
                                التقدم الأسبوعي للمشاركين
                            </h2>
                            <span className="text-sm bg-slate-100 px-3 py-1 rounded-full text-slate-500">آخر 7 أيام</span>
                        </div>

                        <div className="h-64 flex items-end justify-between gap-4 mt-12">
                            {stats.weeklyProgress.map((day, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                    <div className="w-full relative">
                                        <div
                                            className="w-full bg-deep-navy/10 rounded-t-lg group-hover:bg-gold/40 transition-all duration-500"
                                            style={{ height: `${(day.distance / 2500) * 100}%` }}
                                        />
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-deep-navy text-white text-xs py-1 px-2 rounded">
                                            {day.distance}كم
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-slate-400">{day.day}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Spotlight & Hall of Fame */}
                    <div className="space-y-6">
                        {/* Top Performer */}
                        <div className="bg-gradient-to-br from-gold to-gold-dark rounded-3xl p-8 text-deep-navy shadow-lg relative overflow-hidden">
                            <Trophy className="absolute -bottom-4 -left-4 w-32 h-32 opacity-10 transform -rotate-12" />
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Award className="w-6 h-6" />
                                بطل الأسبوع
                            </h3>
                            <div className="relative z-10">
                                <p className="text-4xl font-black mb-1">{stats.topRunner.name}</p>
                                <p className="text-lg opacity-80 mb-6">أتم مسافة الماراثون كاملة ({stats.topRunner.distance} كم)</p>
                                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 inline-block">
                                    <p className="font-bold">تحدي حائل القادم</p>
                                </div>
                            </div>
                        </div>

                        {/* Demographics */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                            <h3 className="text-xl font-bold mb-6 text-deep-navy">الفئات العمرية</h3>
                            <div className="space-y-4">
                                {stats.demographics.map((item, i) => (
                                    <div key={i} className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-bold">{item.ageGroup}</span>
                                            <span className="text-slate-500">{item.percentage}%</span>
                                        </div>
                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-deep-navy rounded-full"
                                                style={{ width: `${item.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Automation Note */}
                <div className="mt-12 bg-blue-50 border border-blue-200 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shrink-0">
                        <Activity className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-blue-900 mb-2">كيف تعمل تقارير الأثر التقنية؟</h3>
                        <p className="text-blue-800 leading-relaxed">
                            يقوم نظامنا بربط تطبيقات اللياقة الخاصة بالمشاركين (Nike Run, Strava, Garmin) وحساب الأثر الإجمالي للفعالية.
                            تُستخدم هذه البيانات لإظهار حجم المشاركة والجهد المبذول للرعاة بطريقة تقنية دقيقة تزيد من مصداقية العمل المؤسسي.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}

function ImpactStatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
    return (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className={`${color} mb-4`}>{icon}</div>
            <p className="text-slate-500 text-sm font-bold mb-1">{label}</p>
            <p className="text-2xl font-black text-deep-navy">{value}</p>
        </div>
    );
}
