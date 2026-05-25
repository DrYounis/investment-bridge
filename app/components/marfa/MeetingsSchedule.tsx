"use client";

import React, { useMemo } from 'react';
import Card from '../ui/Card';

function getNextMonthSchedule() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-indexed

    // Start from next month
    let startYear = year;
    let startMonth = month + 1;
    if (startMonth > 11) {
        startMonth = 0;
        startYear = year + 1;
    }

    // First Thursday of next month
    const firstDay = new Date(startYear, startMonth, 1);
    const dayOfWeek = firstDay.getDay(); // 0=Sun, 4=Thu
    let daysUntilThursday = (4 - dayOfWeek + 7) % 7;
    if (daysUntilThursday === 0) daysUntilThursday = 7; // If 1st is Thursday, use it
    const firstThursday = new Date(startYear, startMonth, 1 + daysUntilThursday);

    // Generate 7 bi-weekly dates (every 2 weeks on Thursday)
    const dates: Date[] = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(firstThursday);
        d.setDate(d.getDate() + i * 14);
        dates.push(d);
    }
    return dates;
}

function formatDate(date: Date): string {
    const months = [
        'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

const SCHEDULE_DATA = [
    {
        encounter: "اللقاء 1",
        topic: "الاستراتيجية",
        case: "حالة \"Airbnb\" في البدايات",
        challenge: "كيف تقنع المستثمر بفكرة \"تأجير خيام أو غرف\" بينما يوجد فنادق؟ (إسقاط على سياحة حائل)."
    },
    {
        encounter: "اللقاء 2",
        topic: "القيادة",
        case: "حالة \"Zappos\" في خدمة العملاء",
        challenge: "هل يمكن بناء ثقافة مؤسسية تجعل الموظف يضحي من أجل العميل؟ وكيف نطبق ذلك في مشاريعنا؟"
    },
    {
        encounter: "اللقاء 3",
        topic: "المالية",
        case: "حالة \"WeWork\" (الفشل المالي)",
        challenge: "كيف تحولت شركة بمليارات الدولارات إلى الإفلاس؟ فهم الفرق بين \"النمو\" و\"الربحية\"."
    },
    {
        encounter: "اللقاء 4",
        topic: "التسويق",
        case: "حالة \"Liquid Death\" (تسويق المياه)",
        challenge: "كيف تبيع منتجاً عادياً جداً (ماء) ببراند عبقري؟ درس في التميز البصري."
    },
    {
        encounter: "اللقاء 5",
        topic: "العمليات",
        case: "حالة \"Amazon Logistics\"",
        challenge: "كيف تدار العمليات لتقليل الهدر؟ (مناقشة تطبيقها في توريد الأغذية والمشروبات لسلسلة مقاهي)."
    },
    {
        encounter: "اللقاء 6",
        topic: "التفاوض",
        case: "حالة \"Shark Tank\" (نماذج حقيقية)",
        challenge: "تحليل صفقات حقيقية: لماذا رفض المستثمر فكرة عبقرية؟ ولماذا قبل فكرة بسيطة؟"
    },
    {
        encounter: "اللقاء 7",
        topic: "حوكمة الشركات",
        case: "حالة Saudi German Health (تداول: 4009)",
        challenge: "إدانة 11 عضو مجلس إدارة ولجنة مراجعة بتضخيم إيرادات بـ 358 مليون ريال رغم علمهم بعدم إمكانية تحصيلها. غرامات 18 مليون ريال فقط (5%). هل العقوبات رادعة؟ وماذا يعني هذا لمصداقية السوق المالي السعودي؟"
    }
];

const METHOD_STEPS = [
    {
        step: "1. عرض الحالة (15 دقيقة)",
        description: "عرض القصة، الأرقام، والظروف المحيطة بها."
    },
    {
        step: "2. العصف الذهني (30 دقيقة)",
        description: "\"لو كنت مكان المدير، ماذا ستفعل؟\" (هنا يبدأ الاشتباك الفكري بين أصحاب الأفكار والمستثمرين)."
    },
    {
        step: "3. تطبيق المحاكاة (30 دقيقة)",
        description: "إسقاط الحالة على مشاريع الحضور. (مثلاً: كيف نطبق استراتيجية أمازون في توصيل طلبات Bakery في حائل؟)."
    },
    {
        step: "4. الخلاصة (15 دقيقة)",
        description: "استخراج 3 دروس مستفادة قابلة للتنفيذ فوراً."
    }
];

export default function MeetingsSchedule() {
    const scheduleDates = useMemo(() => getNextMonthSchedule(), []);

    return (
        <div className="space-y-12">
            {/* Intro / Philosophy */}
            <div className="text-center space-y-4 max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gold to-gold-dark">
                    منهج دراسة الحالة - The Case Study Method
                </h2>
                <p className="text-deep-navy/70 leading-relaxed text-lg">
                    تحويل اللقاءات إلى دراسات حالة هو الأسلوب المتبع في الجامعات العريقة، وهو الأنسب لبيئة "مرفأ" لتعزيز تبادل الخبرات.
                    في كل لقاء، سنناقش مشروعاً واقعياً وتحديات حقيقية.
                </p>
            </div>

            {/* Steps Cards */}
            <div className="grid md:grid-cols-4 gap-4">
                {METHOD_STEPS.map((item, idx) => (
                    <Card key={idx} className="p-6 relative overflow-hidden group bg-white/70 border border-gold/10 transition-colors hover:bg-white/90">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.04] font-black text-6xl text-gold">
                            {idx + 1}
                        </div>
                        <h3 className="font-bold text-lg mb-2 text-gold-dark">{item.step.split(':')[0]}</h3>
                        <p className="text-sm text-deep-navy/60">{item.description}</p>
                    </Card>
                ))}
            </div>

            {/* Schedule Table */}
            <Card className="overflow-hidden bg-white/70 border border-gold/10">
                <div className="p-6 border-b border-gold/10">
                    <h3 className="text-xl font-bold text-deep-navy">جدول لقاءات مرفأ (3 أشهر)</h3>
                    <p className="text-sm text-deep-navy/50 mt-1">
                        تبدأ من {formatDate(scheduleDates[0])} | كل يوم خميس (مرة كل أسبوعين)
                    </p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-gold/10 text-gold-dark">
                            <tr>
                                <th className="p-4 whitespace-nowrap">اللقاء</th>
                                <th className="p-4 whitespace-nowrap">التاريخ</th>
                                <th className="p-4 whitespace-nowrap">موضوع الـ MBA</th>
                                <th className="p-4 whitespace-nowrap">دراسة الحالة (The Case)</th>
                                <th className="p-4 min-w-[300px]">التحدي الذي سنناقشه</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gold/10">
                            {SCHEDULE_DATA.map((row, idx) => (
                                <tr key={idx} className="hover:bg-gold/5 transition-colors">
                                    <td className="p-4 font-medium text-deep-navy/70">{row.encounter}</td>
                                    <td className="p-4 text-gold-dark font-bold whitespace-nowrap" dir="ltr">
                                        {formatDate(scheduleDates[idx])}
                                    </td>
                                    <td className="p-4 text-gold font-bold">{row.topic}</td>
                                    <td className="p-4 font-semibold text-deep-navy/80">{row.case}</td>
                                    <td className="p-4 text-sm text-deep-navy/60 leading-relaxed">{row.challenge}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
