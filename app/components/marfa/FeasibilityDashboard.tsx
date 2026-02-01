'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function FeasibilityDashboard() {
    const [readiness, setReadiness] = useState(25); // Initial score based on passing the validator
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);
    const [activeTab, setActiveTab] = useState<number | null>(null);

    const pillars = [
        {
            id: 1,
            title: "التدقيق المالي",
            subtitle: "Financial Deep Dive",
            icon: "💰",
            desc: "تحديد التكاليف التأسيسية والتشغيلية وحساب نقطة التعادل.",
            action: "بدء الحساب",
            link: "/marfa/lab/financial"
        },
        {
            id: 2,
            title: "هندسة المنتج الأولي",
            subtitle: "MVP Blueprint",
            icon: "🏗️",
            desc: "تحديد المزايا الأساسية (Core Features) للتنفيذ.",
            action: "رسم الخارطة",
            link: "/marfa/lab/mvp"
        },
        {
            id: 3,
            title: "استراتيجية الانطلاق",
            subtitle: "Go-to-Market",
            icon: "🚀",
            desc: "تحديد قنوات التسويق والوصول للعملاء في حائل والمملكة.",
            action: "بناء الخطة"
        },
        {
            id: 4,
            title: "ملف العرض الاستثماري",
            subtitle: "The Pitch Deck",
            icon: "📝",
            desc: "توليد الملف النهائي للعرض على المستثمرين.",
            action: "إنشاء الملف",
            link: "/executive-summary"
        }
    ];

    const handleComplete = (id: number) => {
        if (!completedSteps.includes(id)) {
            const newCompleted = [...completedSteps, id];
            setCompletedSteps(newCompleted);
            setReadiness(25 + (newCompleted.length * 18.75)); // Scale to 100%
        }
    };

    const isReady = completedSteps.length === 4;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8" dir="rtl">

            {/* Header & Gauge Section */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="md:col-span-2 space-y-4">
                    <div className="inline-block px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold mb-2">
                        المرحلة الثانية: مختبر الجدوى 🧪
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900">مرحباً بك في مسار التنفيذ</h1>
                    <p className="text-gray-600 text-lg leading-relaxed">
                        أنت الآن في المنطقة الآمنة لصقل مشروعك. أكمل المحطات الأربع لفتح بوابة المستثمرين.
                    </p>
                </div>

                {/* Readiness Gauge */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute top-0 w-full h-2 bg-gray-100"></div>
                    <svg className="w-40 h-20 overflow-visible mt-4">
                        {/* Background Arc */}
                        <path d="M 10 100 A 80 80 0 0 1 150 100" fill="none" stroke="#f3f4f6" strokeWidth="15" strokeLinecap="round" />
                        {/* Progress Arc */}
                        <path
                            d="M 10 100 A 80 80 0 0 1 150 100"
                            fill="none"
                            stroke={readiness === 100 ? "#10b981" : "#3b82f6"}
                            strokeWidth="15"
                            strokeLinecap="round"
                            strokeDasharray="220"
                            strokeDashoffset={220 - (220 * (readiness / 100))}
                            className="transition-all duration-1000 ease-out"
                        />
                    </svg>
                    <div className="text-center -mt-8">
                        <div className="text-3xl font-bold text-gray-900">{Math.round(readiness)}%</div>
                        <div className="text-xs text-gray-500">جاهزية الاستثمار</div>
                    </div>
                </div>
            </div>

            {/* The 4-Pillars Roadmap */}
            <div className="mb-16">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span>🏗️</span> خارطة طريق المشروع
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {pillars.map((pillar) => (
                        <motion.div
                            key={pillar.id}
                            whileHover={{ y: -5 }}
                            className={`bg-white rounded-2xl p-6 border-2 transition-all relative overflow-hidden group
                ${completedSteps.includes(pillar.id) ? 'border-green-500 shadow-green-100' : 'border-gray-100 shadow-sm'}
              `}
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 text-6xl pointer-events-none">
                                {pillar.icon}
                            </div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-10 h-10 bg-blue-50 text-xl flex items-center justify-center rounded-xl">
                                        {completedSteps.includes(pillar.id) ? '✅' : pillar.icon}
                                    </div>
                                    <span className="text-xs font-bold text-gray-400">محطة {pillar.id}</span>
                                </div>

                                <h3 className="font-bold text-gray-900 mb-1">{pillar.title}</h3>
                                <p className="text-xs text-blue-600 font-medium mb-3 uppercase tracking-wider">{pillar.subtitle}</p>
                                <p className="text-sm text-gray-500 mb-6 h-12 leading-relaxed">
                                    {pillar.desc}
                                </p>

                                {pillar.link ? (
                                    <Link
                                        href={pillar.link}
                                        onClick={() => handleComplete(pillar.id)}
                                        className={`w-full py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors
                      ${completedSteps.includes(pillar.id)
                                                ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                            }`}
                                    >
                                        {completedSteps.includes(pillar.id) ? 'تم الإنجاز' : pillar.action}
                                    </Link>
                                ) : (
                                    <button
                                        onClick={() => handleComplete(pillar.id)} // Simulating functionality
                                        className={`w-full py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors
                    ${completedSteps.includes(pillar.id)
                                                ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {completedSteps.includes(pillar.id) ? 'تم الإنجاز' : pillar.action}
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Tools & Mentorship Grid */}
            <div className="grid lg:grid-cols-3 gap-8 mb-16">

                {/* The Golden Button Section */}
                <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 h-full">
                        <div>
                            <h3 className="text-2xl font-bold mb-2">🚀 جاهز للإطلاق؟</h3>
                            <p className="text-slate-300 max-w-md">
                                بمجرد إكمال المحطات الأربع، سيتم فتح هذا الزر لإرسال ملفك المعتمد مباشرة إلى شبكة مستثمري "مرفأ".
                            </p>
                        </div>
                        <button
                            disabled={!isReady}
                            onClick={() => alert("تم إرسال طلبتك بنجاح! سيتم مراجعة الملف والتواصل معك خلال 48 ساعة.")}
                            className={`
                 px-8 py-5 rounded-2xl font-bold flex items-center gap-3 transition-all transform
                 ${isReady
                                    ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-amber-900 shadow-lg shadow-amber-500/20 hover:scale-105 cursor-pointer'
                                    : 'bg-slate-700 text-slate-500 cursor-not-allowed grayscale'
                                }
              `}
                        >
                            {isReady ? (
                                <>
                                    <span>✨ اطلب العرض على المستثمر</span>
                                </>
                            ) : (
                                <>
                                    <span>🔒 أكمل المتطلبات لفتح الزر</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mentorship Card */}
                <div className="bg-purple-50 rounded-3xl p-6 border border-purple-100 flex flex-col justify-center text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                        👨‍🏫
                    </div>
                    <h3 className="font-bold text-purple-900 mb-2">تحتاج مساعدة خبير؟</h3>
                    <p className="text-sm text-purple-700 mb-6">
                        تعثرت في إحدى الخطوات؟ احجز جلسة سريعة (15 دقيقة) مع مستشار لمراجعة أرقامك.
                    </p>
                    <button className="py-3 bg-white border border-purple-200 text-purple-700 rounded-xl font-bold hover:bg-purple-100 transition">
                        حجز جلسة استشارية
                    </button>
                </div>

            </div>

            {/* Toolkit Ticker */}
            <div className="border-t border-gray-200 pt-8">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">أدوات مساعدة (Toolkit)</h4>
                <div className="flex flex-wrap gap-4">
                    {['📄 نموذج دراسة جدوى', '📊 حاسبة تكاليف', '📑 عقود تأسيس', '🏙️ دليل حائل التجاري'].map((tool, i) => (
                        <span key={i} className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-white hover:border-gray-300 hover:shadow-sm cursor-pointer transition">
                            {tool}
                        </span>
                    ))}
                </div>
            </div>

        </div>
    );
}
