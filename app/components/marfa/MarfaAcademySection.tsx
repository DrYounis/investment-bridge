"use client";

import React from 'react';
import Link from 'next/link';

const MarfaAcademySection = () => {
    // بيانات المنهج الدراسي
    const curriculum = [
        {
            id: 1,
            date: "6 مارس",
            topic: "الاستراتيجية",
            case: "Airbnb: البداية من الصفر",
            icon: "♟️",
            status: "upcoming"
        },
        {
            id: 2,
            date: "20 مارس",
            topic: "القيادة والثقافة",
            case: "Zappos: خدمة العملاء",
            icon: "🤝",
            status: "locked"
        },
        {
            id: 3,
            date: "3 أبريل",
            topic: "المالية والاستثمار",
            case: "WeWork: درس في التقييم",
            icon: "💰",
            status: "locked"
        },
        {
            id: 4,
            date: "17 أبريل",
            topic: "التسويق والنمو",
            case: "Liquid Death: التميز",
            icon: "🚀",
            status: "locked"
        },
    ];

    return (
        <section className="py-20 bg-slate-50 border-t border-slate-200" dir="rtl">
            <div className="max-w-6xl mx-auto px-6">

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

                    {/* Right Column: The Next Event Card (Focus) */}
                    <div className="lg:col-span-5 relative">
                        <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-10 rounded-full"></div>
                        <div className="relative bg-white border-2 border-blue-100 rounded-3xl p-8 shadow-xl overflow-hidden group hover:border-blue-300 transition-all">

                            {/* Badge */}
                            <div className="absolute top-0 left-0 bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-br-2xl">
                                اللقاء القادم
                            </div>

                            <div className="text-center mt-6">
                                <div className="w-20 h-20 bg-blue-50 rounded-2xl mx-auto flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
                                    ♟️
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-2">الاستراتيجية وتحليل السوق</h3>
                                <p className="text-blue-600 font-medium text-sm mb-6">دراسة حالة: Airbnb vs. Hotels</p>

                                <div className="flex justify-center items-center gap-4 text-sm text-slate-500 mb-8">
                                    <span className="flex items-center gap-1">📅 الجمعة 6 مارس</span>
                                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                    <span className="flex items-center gap-1">📍 حائل</span>
                                </div>

                                <div className="space-y-3">
                                    <Link href="/register?type=entrepreneur">
                                        <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-200">
                                            تأكيد الحضور
                                        </button>
                                    </Link>
                                    <a
                                        href="/marfa/airbnb-worksheet.html"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-3 bg-white text-slate-600 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition flex justify-center items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                        تحميل ورقة العمل (PDF)
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Left Column: The Curriculum Timeline */}
                    <div className="lg:col-span-7">
                        <h3 className="text-xl font-bold text-slate-800 mb-8 border-r-4 border-teal-500 pr-3">جدول الفصل الأول (مارس - مايو)</h3>

                        <div className="space-y-4">
                            {curriculum.map((item, index) => (
                                <div
                                    key={item.id}
                                    className={`flex items-center p-4 rounded-2xl border transition-all duration-300 ${item.status === 'upcoming'
                                            ? 'bg-white border-blue-200 shadow-md scale-[1.02]'
                                            : 'bg-white/50 border-slate-100 hover:bg-white hover:border-slate-200 opacity-80 hover:opacity-100'
                                        }`}
                                >
                                    {/* Date Box */}
                                    <div className={`flex-shrink-0 w-16 h-16 rounded-xl flex flex-col items-center justify-center text-sm font-bold ${item.status === 'upcoming' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                        <span>{item.date.split(' ')[0]}</span>
                                        <span className="text-[10px] font-normal">{item.date.split(' ')[1]}</span>
                                    </div>

                                    {/* Content */}
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

                                    {/* Arrow/Lock Icon */}
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

                        <div className="mt-8 p-4 bg-teal-50 border border-teal-100 rounded-xl flex items-start gap-3">
                            <span className="text-teal-600 text-xl">💡</span>
                            <p className="text-sm text-teal-800 leading-relaxed">
                                <span className="font-bold">ملاحظة:</span> جميع اللقاءات تعقد يوم الجمعة بعد العصر. الحضور متاح فقط لأعضاء المنصة المسجلين (مستثمر أو صاحب فكرة معتمدة).
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default MarfaAcademySection;
