"use client";

import React from 'react';
import Card from '../ui/Card';

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
    return (
        <div className="space-y-12">
            {/* Intro / Philosophy */}
            <div className="text-center space-y-4 max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                    منهج دراسة الحالة - The Case Study Method
                </h2>
                <p className="text-foreground/80 leading-relaxed text-lg">
                    تحويل اللقاءات إلى دراسات حالة هو الأسلوب المتبع في الجامعات العريقة، وهو الأنسب لبيئة "مرفأ" لتعزيز تبادل الخبرات.
                    في كل لقاء، سنناقش مشروعاً واقعياً وتحديات حقيقية.
                </p>
            </div>

            {/* Steps Cards */}
            <div className="grid md:grid-cols-4 gap-4">
                {METHOD_STEPS.map((item, idx) => (
                    <Card key={idx} glass className="p-6 relative overflow-hidden group hover:bg-white/5 transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl text-primary">
                            {idx + 1}
                        </div>
                        <h3 className="font-bold text-lg mb-2 text-primary">{item.step.split(':')[0]}</h3>
                        <p className="text-sm text-foreground/70">{item.description}</p>
                    </Card>
                ))}
            </div>

            {/* Schedule Table */}
            <Card glass className="overflow-hidden">
                <div className="p-6 border-b border-white/10">
                    <h3 className="text-xl font-bold">جدول لقاءات مرفأ (3 أشهر)</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-white/5 text-primary">
                            <tr>
                                <th className="p-4 whitespace-nowrap">اللقاء</th>
                                <th className="p-4 whitespace-nowrap">موضوع الـ MBA</th>
                                <th className="p-4 whitespace-nowrap">دراسة الحالة (The Case)</th>
                                <th className="p-4 min-w-[300px]">التحدي الذي سنناقشه</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {SCHEDULE_DATA.map((row, idx) => (
                                <tr key={idx} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-medium text-foreground/80">{row.encounter}</td>
                                    <td className="p-4 text-accent font-bold">{row.topic}</td>
                                    <td className="p-4 font-semibold">{row.case}</td>
                                    <td className="p-4 text-sm text-foreground/70 leading-relaxed">{row.challenge}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
