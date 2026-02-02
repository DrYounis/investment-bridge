"use client";

import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Link from 'next/link';

export default function LiveCaseStudy() {
    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
                <div>
                    <span className="inline-block px-3 py-1 bg-error/10 text-error rounded-full text-sm font-bold mb-2 animate-pulse">
                        ● بث مباشر الآن
                    </span>
                    <h2 className="text-3xl font-black text-white">
                        ورقة عمل: حالة Airbnb الاستراتيجية
                    </h2>
                    <p className="text-foreground/60 mt-1">
                        أكاديمية مرفأ - اللقاء الأول (6 مارس 2026)
                    </p>
                </div>

                <a
                    href="/marfa/airbnb-worksheet.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-bold transition-all hover:scale-105 shadow-lg hover:shadow-xl"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    تحميل ورقة العمل PDF
                </a>
            </div>

            <Card glass className="p-8 border-t-4 border-t-primary">
                {/* 1. The Story */}
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                        <span className="bg-primary/20 p-1 rounded">1</span>
                        ملخص الحالة (The Story)
                    </h3>
                    <p className="text-foreground/80 leading-relaxed">
                        في عام 2008، لم يمتلك مؤسسو Airbnb المال لدفع إيجار شقتهم، فقاموا بتأجير "مراتب هوائية" في غرفتهم للضيوف.
                        واجهوا رفضاً من <strong>7 مستثمرين كبار</strong>، وكان الجميع يسأل: "من المجنون الذي سيسكن في بيت غريب؟".
                        اليوم، الشركة تساوي مليارات الدولارات دون أن تمتلك فندقاً واحداً.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    {/* 2. Discussion Points */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-accent mb-4 flex items-center gap-2">
                            <span className="bg-accent/20 p-1 rounded">2</span>
                            محاور النقاش
                        </h3>
                        <ul className="space-y-3 text-foreground/80 list-disc list-inside">
                            <li>
                                <strong className="text-white">ثقة الغريب:</strong> كيف استطاعت المنصة كسر حاجز الخوف وبناء "نظام ثقة"؟
                            </li>
                            <li>
                                <strong className="text-white">الأصول غير المستغلة:</strong> استغلال الغرف الفارغة بدل بناء فنادق.
                                <br />
                                <span className="text-sm text-primary/80 mt-1 block pr-5">
                                    (سؤال للجمهور: ما هي الأصول غير المستغلة في حائل الآن؟)
                                </span>
                            </li>
                            <li>
                                <strong className="text-white">المرونة (Pivot):</strong> التحول من بيع "حبوب الإفطار" إلى أكبر منصة سياحية.
                            </li>
                        </ul>
                    </div>

                    {/* 3. The Local Challenge */}
                    <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <span className="bg-white/20 p-1 rounded">3</span>
                            تمرين "مرفأ" التطبيقي
                        </h3>
                        <div className="mb-4">
                            <p className="font-medium text-primary italic">
                                &quot;السيناريو: أنت تمتلك مخيماً في نفود حائل، وتريد تحويله إلى وجهة سياحية عالمية&quot;
                            </p>
                        </div>
                        <ul className="space-y-2 text-sm text-foreground/70">
                            <li>• ما هي الميزة التنافسية التي ستقدمها؟</li>
                            <li>• كيف ستقيس مخاطر دخول الغرباء؟</li>
                            <li>• كيف ستصمم تجربة عميل لا تُنسى؟</li>
                        </ul>
                    </div>
                </div>

                {/* 4. Lessons & CTA */}
                <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl p-8 text-center space-y-6">
                    <h3 className="text-2xl font-bold text-white">الدروس المستفادة</h3>
                    <div className="flex flex-col md:flex-row justify-center gap-8 text-right md:text-center">
                        <div>
                            <span className="block font-bold text-primary mb-1">للمستثمر</span>
                            <p className="text-sm">لا تنظر لحجم الأصول، انظر لحجم "التشغيل والذكاء الرقمي".</p>
                        </div>
                        <div className="w-px bg-white/10 hidden md:block"></div>
                        <div>
                            <span className="block font-bold text-accent mb-1">للمبتكر</span>
                            <p className="text-sm">إذا رفضك المستثمرون، فربما العيب ليس في فكرتك، بل في اختيار المستثمر.</p>
                        </div>
                    </div>

                    <div className="pt-4">
                        <Link href="/register?type=entrepreneur">
                            <Button size="lg" className="animate-bounce-slow">
                                سجل فكرتك الاستثمارية الآن
                            </Button>
                        </Link>
                        <p className="text-xs text-foreground/50 mt-2">
                            * سيتم تسجيلك كـ "صاحب فكرة" تلقائياً
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
