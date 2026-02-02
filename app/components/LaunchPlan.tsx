
"use client";

import React, { useState, useEffect } from 'react';

const LaunchPlan = () => {
    const [timeLeft, setTimeLeft] = useState<{ days: number, hours: number, minutes: number }>({ days: 0, hours: 0, minutes: 0 });
    const [progress, setProgress] = useState(100); // يبدأ بـ 100% أخضر

    // تحديد موعد الإطلاق: 1 مارس 2026
    const launchDate = new Date("March 1, 2026 00:00:00").getTime();

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = launchDate - now;

            // حساب الوقت المتبقي
            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            });

            // حساب النسبة المئوية للشريط (افتراضاً أننا بدأنا قبل 30 يوم من مارس)
            const totalDays = 30;
            const daysLeft = distance / (1000 * 60 * 60 * 24);
            // Ensure progress is between 0 and 100
            const calculatedProgress = Math.max(0, Math.min(100, (daysLeft / totalDays) * 100));
            setProgress(calculatedProgress);

        }, 1000);
        return () => clearInterval(timer);
    }, [launchDate]);

    // دالة لتحديد لون الشريط بناءً على النسبة
    const getProgressColor = () => {
        if (progress > 60) return 'bg-green-500';
        if (progress > 30) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="max-w-5xl mx-auto p-8 bg-white rounded-3xl shadow-xl mt-10 text-right animate-fade-in-up" dir="rtl">
            <h2 className="text-3xl font-black text-slate-800 mb-6 text-center">خطة العمل نحو الإطلاق الكبير</h2>

            {/* الساعة التنازلية */}
            <div className="flex justify-center gap-6 mb-10">
                {[
                    { label: 'يوم', value: timeLeft.days },
                    { label: 'ساعة', value: timeLeft.hours },
                    { label: 'دقيقة', value: timeLeft.minutes }
                ].map(unit => (
                    <div key={unit.label} className="bg-slate-900 text-white p-4 rounded-2xl w-24 text-center shadow-lg transform hover:scale-105 transition-transform">
                        <span className="text-3xl font-bold block">{unit.value === undefined ? '-' : unit.value}</span>
                        <span className="text-xs text-slate-400">{unit.label}</span>
                    </div>
                ))}
            </div>

            {/* شريط الحالة التفاعلي (ينقص ويتحول للأحمر) */}
            <div className="mb-12">
                <div className="flex justify-between mb-2 text-sm font-bold">
                    <span className="text-red-600 animate-pulse">موعد الإطلاق: 1 مارس</span>
                    <span className="text-slate-500">الوقت المتبقي</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden border border-gray-200">
                    <div
                        className={`h-full transition-all duration-1000 ${getProgressColor()} shadow-[0_0_10px_rgba(0,0,0,0.1)]`}
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            {/* خطوات خطة العمل الأربعة */}
            <div className="grid md:grid-cols-2 gap-8">
                <StepCard
                    week="الأسبوع الأول"
                    title="بناء النواة والتحقق"
                    tasks={["إطلاق نسخة الـ Beta لـ 5 مستثمرين مختارين.", "فحص نظام الحماية NDA للأفكار.", "تجهيز أول 20 فكرة مهندسة في قطاع السياحة."]}
                />
                <StepCard
                    week="الأسبوع الثاني"
                    title="حملة الاستقطاب الذكي"
                    tasks={["استهداف شركات الاستثمار في حائل والرياض.", "عقد ويبينار مغلق لشرح خوارزمية التصفية للمستثمرين.", "تفعيل نظام الـ Gamification للمبتكرين."]}
                />
                <StepCard
                    week="الأسبوع الثالث"
                    title="التوسع والاعتماد"
                    tasks={["فتح باب التسجيل الرسمي للمستثمرين.", "مراجعة واعتماد أول 10 مستثمرين بيدك (Admin).", "بدء الربط المبدئي بين الأفكار الأعلى تقييماً والمستثمرين."]}
                />
                <StepCard
                    week="الأسبوع الرابع"
                    title="العد التنازلي النهائي"
                    tasks={["إطلاق حملة تسويقية 'الفرصة الكبرى'.", "تجهيز تقرير PDF لأفضل 5 فرص سياحية وصحية.", "تفعيل ساعة الصفر لبداية شهر مارس."]}
                />
            </div>
        </div>
    );
};

interface StepCardProps {
    week: string;
    title: string;
    tasks: string[];
}

const StepCard: React.FC<StepCardProps> = ({ week, title, tasks }) => (
    <div className="p-6 border-2 border-slate-50 rounded-2xl hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md bg-slate-50/50 group">
        <span className="text-blue-600 font-bold text-sm underline decoration-blue-300 underline-offset-4">{week}</span>
        <h3 className="text-xl font-bold text-slate-800 mt-2 mb-4 group-hover:text-blue-700 transition-colors">{title}</h3>
        <ul className="text-sm text-slate-600 space-y-2">
            {tasks.map((task, i) => <li key={i} className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                {task}
            </li>)}
        </ul>
    </div>
);

export default LaunchPlan;
