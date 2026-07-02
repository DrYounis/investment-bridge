"use client";

import React, { useMemo } from 'react';
import Card from '../ui/Card';

function getWeeklyFridaySchedule() {
    const baseFriday = new Date(2026, 5, 19); // June 19, 2026 — weekly Fridays

    const dates: Date[] = [];
    for (let i = 0; i < 14; i++) {
        const d = new Date(baseFriday);
        d.setDate(d.getDate() + i * 7); // weekly
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
        challenge: "كيف تقنع المستثمر بفكرة \"تأجير خيام أو غرف\" بينما يوجد فنادق؟ (إسقاط على سياحة حائل).",
        pdf: "/case-studies/Airbnb_Strategy_Case_Study.pdf",
        arPdf: "/case-studies/Airbnb_Strategy_Arabic_Case_Study.pdf",
    },
    {
        encounter: "اللقاء 2",
        topic: "القيادة",
        case: "حالة \"Zappos\" في خدمة العملاء",
        challenge: "هل يمكن بناء ثقافة مؤسسية تجعل الموظف يضحي من أجل العميل؟ وكيف نطبق ذلك في مشاريعنا؟",
        pdf: "/case-studies/Zappos_Leadership_Case_Study.pdf",
        arPdf: "/case-studies/Zappos_Leadership_Arabic_Case_Study.pdf",
    },
    {
        encounter: "اللقاء 3",
        topic: "المالية",
        case: "حالة \"WeWork\" (الفشل المالي)",
        challenge: "كيف تحولت شركة بمليارات الدولارات إلى الإفلاس؟ فهم الفرق بين \"النمو\" و\"الربحية\".",
        pdf: "/case-studies/WeWork_Finance_Case_Study.pdf",
        arPdf: "/case-studies/WeWork_Finance_Arabic_Case_Study.pdf",
    },
    {
        encounter: "اللقاء 4",
        topic: "التسويق",
        case: "حالة \"Liquid Death\" (تسويق المياه)",
        challenge: "كيف تبيع منتجاً عادياً جداً (ماء) ببراند عبقري؟ درس في التميز البصري.",
        pdf: "/case-studies/Liquid_Death_Marketing_Case_Study.pdf",
        arPdf: "/case-studies/Liquid_Death_Marketing_Arabic_Case_Study.pdf",
    },
    {
        encounter: "اللقاء 5",
        topic: "العمليات",
        case: "حالة \"Amazon Logistics\"",
        challenge: "كيف تدار العمليات لتقليل الهدر؟ (مناقشة تطبيقها في توريد الأغذية والمشروبات لسلسلة مقاهي).",
        pdf: "/case-studies/Amazon_Operations_Case_Study.pdf",
        arPdf: "/case-studies/Amazon_Operations_Arabic_Case_Study.pdf",
    },
    {
        encounter: "اللقاء 6",
        topic: "التفاوض",
        case: "حالة \"Shark Tank\" (نماذج حقيقية)",
        challenge: "تحليل صفقات حقيقية: لماذا رفض المستثمر فكرة عبقرية؟ ولماذا قبل فكرة بسيطة؟",
        pdf: "/case-studies/SharkTank_Negotiation_Case_Study.pdf",
        arPdf: "/case-studies/SharkTank_Negotiation_Arabic_Case_Study.pdf",
    },
    {
        encounter: "اللقاء 7",
        topic: "حوكمة الشركات",
        case: "حالة Saudi German Health (تداول: 4009)",
        challenge: "إدانة 11 عضو مجلس إدارة ولجنة مراجعة بتضخيم إيرادات بـ 358 مليون ريال رغم علمهم بعدم إمكانية تحصيلها. غرامات 18 مليون ريال فقط (5%). هل العقوبات رادعة؟ وماذا يعني هذا لمصداقية السوق المالي السعودي؟",
        pdf: "/case-studies/Saudi_German_Health_Case_Study.pdf",
        arPdf: "/case-studies/Saudi_German_Health_Arabic_Case_Study.pdf",
    },
    {
        encounter: "اللقاء 8",
        topic: "الابتكار",
        case: "حالة \"Netflix\" (من تأجير DVD إلى الستريمنج)",
        challenge: "كيف تُقدم على تدمير نموذج عملك الناجح حالياً لتبني نموذجاً جديداً، قبل أن يفعلها منافس؟ (إسقاط على التحول الرقمي في القطاعات التقليدية بحائل).",
        pdf: "/case-studies/Netflix_Innovation_Case_Study.pdf",
        arPdf: "/case-studies/Netflix_Innovation_Arabic_Case_Study.pdf",
    },
    {
        encounter: "اللقاء 9",
        topic: "الموارد البشرية",
        case: "حالة \"Google – Project Aristotle\"",
        challenge: "ما الذي يصنع فريقاً عالي الأداء فعلاً؟ الأمان النفسي مقابل \"تجميع النجوم\". كيف نبني فرقاً صغيرة فعّالة في مشاريع ناشئة محدودة الموارد؟",
        pdf: "/case-studies/Google_Aristotle_HR_Case_Study.pdf",
        arPdf: "/case-studies/Google_Aristotle_HR_Arabic_Case_Study.pdf",
    },
    {
        encounter: "اللقاء 10",
        topic: "إدارة المخاطر",
        case: "حالة \"Theranos\" (انهيار الثقة الاستثمارية)",
        challenge: "كيف يكتشف المستثمر علامات الخطر مبكراً قبل ضخ رأس المال؟ ودرس في أهمية الشفافية والحوكمة لرائد الأعمال نفسه.",
        pdf: "/case-studies/Theranos_Risk_Case_Study.pdf",
        arPdf: "/case-studies/Theranos_Risk_Arabic_Case_Study.pdf",
    },
    {
        encounter: "اللقاء 11",
        topic: "التوسع الدولي",
        case: "حالة \"IKEA\" في دخول أسواق جديدة",
        challenge: "كيف توازن الشركة بين \"المعيار العالمي\" و\"التكيف المحلي\"؟ إسقاط على التوسع من حائل إلى أسواق خليجية أخرى.",
        pdf: "/case-studies/IKEA_Expansion_Case_Study.pdf",
        arPdf: "/case-studies/IKEA_Expansion_Arabic_Case_Study.pdf",
    },
    {
        encounter: "اللقاء 12",
        topic: "إدارة الأزمات",
        case: "حالة \"Johnson & Johnson\" (أزمة تايلينول 1982)",
        challenge: "كيف تدار أزمة ثقة المستهلك بشفافية تحفظ سمعة العلامة التجارية بدلاً من تدميرها؟ خطة تواصل الأزمات لمشروع ناشئ.",
        pdf: "/case-studies/JnJ_Crisis_Case_Study.pdf",
        arPdf: "/case-studies/JnJ_Crisis_Arabic_Case_Study.pdf",
    },
    {
        encounter: "اللقاء 13",
        topic: "الاستدامة والمسؤولية",
        case: "حالة \"Patagonia\" (الأرض هي المساهم الوحيد)",
        challenge: "هل يمكن أن يتوافق الربح مع القيم؟ وكيف تُبنى نماذج أعمال مستدامة تتماشى مع رؤية 2030 دون التضحية بالجدوى المالية؟",
        pdf: "/case-studies/Patagonia_Sustainability_Case_Study.pdf",
        arPdf: "/case-studies/Patagonia_Sustainability_Arabic_Case_Study.pdf",
    },
    {
        encounter: "اللقاء 14",
        topic: "دراسة الجدوى",
        case: "حالة \"Quibi\" (فشل رغم مليار دولار تمويل)",
        challenge: "لماذا يفشل مشروع ضخم التمويل وبفريق نجوم؟ درس في التحقق من حاجة السوق الفعلية قبل بناء المنتج.",
        pdf: "/case-studies/Quibi_Feasibility_Case_Study.pdf",
        arPdf: "/case-studies/Quibi_Feasibility_Arabic_Case_Study.pdf",
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
    const scheduleDates = useMemo(() => getWeeklyFridaySchedule(), []);

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
                    <h3 className="text-xl font-bold text-deep-navy">جدول لقاءات مرفأ (6 أشهر)</h3>
                    <p className="text-sm text-deep-navy/50 mt-1">
                        تبدأ من {formatDate(scheduleDates[0])} | كل يوم جمعة (أسبوعياً)
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
                                <th className="p-4 whitespace-nowrap">ملف PDF</th>
                                <th className="p-4 whitespace-nowrap">النسخة العربية</th>
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
                                    <td className="p-4">
                                        <a
                                            href={row.pdf}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 px-3 py-2 bg-gold/10 border border-gold/20 rounded-lg text-gold-dark text-sm font-bold hover:bg-gold/20 transition-colors"
                                        >
                                            📄 PDF
                                        </a>
                                    </td>
                                    <td className="p-4">
                                        <a
                                            href={row.arPdf}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 px-3 py-2 bg-gold/10 border border-gold/20 rounded-lg text-gold-dark text-sm font-bold hover:bg-gold/20 transition-colors"
                                        >
                                            📄 عربي
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
