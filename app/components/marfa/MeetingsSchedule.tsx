"use client";

import React, { useMemo } from 'react';
import Link from 'next/link';
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

function getThisFridayIndex(): number {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0=Sun ... 5=Friday
    const friday = new Date(now);
    // Compute the upcoming Friday (today if it is Friday)
    const daysFromFriday = (5 - dayOfWeek + 7) % 7;
    friday.setDate(friday.getDate() + daysFromFriday);

    const baseFriday = new Date(2026, 5, 19); // June 19, 2026
    const diffMs = friday.getTime() - baseFriday.getTime();
    const diffWeeks = Math.round(diffMs / (7 * 24 * 60 * 60 * 1000));
    return diffWeeks; // 0 = meeting 1, 1 = meeting 2, etc.
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
    const thisFridayIdx = useMemo(() => getThisFridayIndex(), []);

    return (
        <div className="space-y-12">
            {/* Intro / Philosophy */}
            <div className="text-center space-y-4 max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold text-[#c9a84c]">
                    منهج دراسة الحالة - The Case Study Method
                </h2>
                <p className="text-[#64748b] leading-relaxed text-lg">
                    تحويل اللقاءات إلى دراسات حالة هو الأسلوب المتبع في الجامعات العريقة، وهو الأنسب لبيئة "مرفأ" لتعزيز تبادل الخبرات.
                    في كل لقاء، سنناقش مشروعاً واقعياً وتحديات حقيقية.
                </p>
            </div>

            {/* Steps Cards */}
            <div className="grid md:grid-cols-4 gap-4">
                {METHOD_STEPS.map((item, idx) => (
                    <Card key={idx} className="p-6 relative overflow-hidden group bg-white border border-[#c9a84c]/20 rounded-3xl shadow-[0_8px_30px_rgba(10,15,30,0.06)] hover:border-[#c9a84c]/40 transition-all duration-300">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.04] font-black text-6xl text-[#c9a84c]">
                            {idx + 1}
                        </div>
                        <h3 className="font-bold text-lg mb-2 text-[#c9a84c]">{item.step.split(':')[0]}</h3>
                        <p className="text-sm text-[#64748b]">{item.description}</p>
                    </Card>
                ))}
            </div>

            {/* Schedule Table */}
            <Card className="overflow-hidden bg-white border border-[#c9a84c]/20 rounded-3xl shadow-[0_8px_30px_rgba(10,15,30,0.06)]">
                <div className="p-6 border-b border-[#c9a84c]/10">
                    <h3 className="text-xl font-bold text-[#0a0f1e]">جدول لقاءات مرفأ (6 أشهر)</h3>
                    <p className="text-sm text-[#64748b] mt-1">
                        تبدأ من {formatDate(scheduleDates[0])} | كل يوم جمعة (أسبوعياً)
                    </p>
                </div>
                <div className="overflow-x-auto hidden md:block">
                    <table className="w-full text-right">
                        <thead className="bg-[#faf8f2] text-[#c9a84c]">
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
                        <tbody className="divide-y divide-[#c9a84c]/10">
                            {SCHEDULE_DATA.map((row, idx) => (
                                <tr key={idx} className="hover:bg-[#c9a84c]/5 transition-colors">
                                    <td className="p-4 font-medium text-[#64748b]">{row.encounter}</td>
                                    <td className="p-4 text-[#c9a84c] font-bold whitespace-nowrap" dir="ltr">
                                        {formatDate(scheduleDates[idx])}
                                    </td>
                                    <td className="p-4 text-[#c9a84c] font-bold">{row.topic}</td>
                                    <td className="p-4 font-semibold text-[#0a0f1e]">{row.case}</td>
                                    <td className="p-4 text-sm text-[#64748b] leading-relaxed">{row.challenge}</td>
                                    <td className="p-4">
                                        {idx <= thisFridayIdx ? (
                                            <a
                                                href={row.pdf}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 px-3 py-2 bg-[#faf8f2] border border-[#c9a84c]/30 rounded-lg text-[#c9a84c] text-sm font-bold hover:bg-[#c9a84c]/10 transition-colors"
                                            >
                                                📄 PDF
                                            </a>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-3 py-2 bg-[#f5f5f5] border border-[#c9a84c]/10 rounded-lg text-[#64748b] text-sm">
                                                🔒 قريباً
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        {idx <= thisFridayIdx ? (
                                            <a
                                                href={row.arPdf}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 px-3 py-2 bg-[#faf8f2] border border-[#c9a84c]/30 rounded-lg text-[#c9a84c] text-sm font-bold hover:bg-[#c9a84c]/10 transition-colors"
                                            >
                                                📄 عربي
                                            </a>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-3 py-2 bg-[#f5f5f5] border border-[#c9a84c]/10 rounded-lg text-[#64748b] text-sm">
                                                🔒 قريباً
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <Link
                                            href={`/meetings/majlis/${idx + 1}`}
                                            className="inline-flex items-center gap-1 px-3 py-2 bg-[#c9a84c]/10 border border-[#c9a84c]/30 rounded-lg text-[#c9a84c] text-sm font-bold hover:bg-[#c9a84c]/20 transition-colors"
                                        >
                                            🏛️ المجلس الاستشاري
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ── Mobile: stacked cards ── */}
                <div className="md:hidden divide-y divide-[#c9a84c]/10">
                    {SCHEDULE_DATA.map((row, idx) => (
                        <div key={idx} className="p-5 space-y-3">
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-bold text-[#64748b] bg-[#faf8f2] border border-[#c9a84c]/20 rounded-full px-3 py-1">
                                    {row.encounter}
                                </span>
                                <span className="text-sm text-[#c9a84c] font-bold whitespace-nowrap" dir="ltr">
                                    {formatDate(scheduleDates[idx])}
                                </span>
                            </div>
                            <div>
                                <span className="text-xs font-bold text-[#c9a84c]">{row.topic}</span>
                                <h4 className="font-bold text-[#0a0f1e] mt-1 leading-snug">{row.case}</h4>
                            </div>
                            <p className="text-sm text-[#64748b] leading-relaxed">{row.challenge}</p>
                            {idx <= thisFridayIdx ? (
                                <div className="flex gap-3 pt-1">
                                    <a
                                        href={row.pdf}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-3 bg-[#faf8f2] border border-[#c9a84c]/30 rounded-xl text-[#c9a84c] text-sm font-bold active:bg-[#c9a84c]/10 transition-colors"
                                    >
                                        📄 PDF
                                    </a>
                                    <a
                                        href={row.arPdf}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-3 bg-[#faf8f2] border border-[#c9a84c]/30 rounded-xl text-[#c9a84c] text-sm font-bold active:bg-[#c9a84c]/10 transition-colors"
                                    >
                                        📄 عربي
                                    </a>
                                    <Link
                                        href={`/meetings/majlis/${idx + 1}`}
                                        className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-3 bg-[#c9a84c]/10 border border-[#c9a84c]/30 rounded-xl text-[#c9a84c] text-sm font-bold active:bg-[#c9a84c]/20 transition-colors"
                                    >
                                        🏛️ المجلس الاستشاري
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex pt-1">
                                    <span className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-3 bg-[#f5f5f5] border border-[#c9a84c]/10 rounded-xl text-[#64748b] text-sm">
                                        🔒 قريباً
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
