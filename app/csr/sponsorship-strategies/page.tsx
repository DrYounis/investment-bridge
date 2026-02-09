"use client";

import React from 'react';
import Link from 'next/link';
import {
    TrendingUp,
    Target,
    Users,
    BarChart3,
    CheckCircle,
    ArrowRight,
    Phone,
    Search,
    FileText,
    Handshake,
    Clock,
    Database,
    Mail,
    LineChart
} from 'lucide-react';

export default function SponsorshipStrategiesPage() {
    return (
        <div className="min-h-screen bg-[#FDFCF0] text-right font-arabic" dir="rtl">

            {/* Hero Section */}
            <section className="relative pt-32 pb-16 bg-gradient-to-br from-deep-navy to-primary-dark text-white overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-5" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="max-w-4xl">
                        <Link href="/csr" className="inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors mb-6">
                            <ArrowRight className="w-4 h-4" />
                            <span>العودة إلى الخدمات</span>
                        </Link>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 text-gold text-sm font-bold border border-gold/20 mb-6">
                            <TrendingUp className="w-4 h-4" />
                            <span>خدمة متخصصة</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
                            استراتيجيات جلب الرعايات
                        </h1>
                        <p className="text-2xl text-blue-200 mb-8 leading-relaxed">
                            نبني استراتيجيات شاملة لجذب المانحين الاستراتيجيين بناءً على دراسة عميقة للسوق المحلي
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <a
                                href="https://wa.me/966555056545"
                                className="px-8 py-4 bg-gold text-deep-navy font-black rounded-2xl hover:bg-gold-light transition-all flex items-center gap-2"
                            >
                                <Phone className="w-5 h-5" />
                                استشارة مجانية
                            </a>
                            <a
                                href="#overview"
                                className="px-8 py-4 bg-white/10 border-2 border-white/20 text-white rounded-2xl font-bold hover:bg-white/20 transition-all"
                            >
                                اكتشف المزيد
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Overview Section */}
            <section id="overview" className="py-24 bg-white">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="mb-12">
                        <h2 className="text-4xl font-bold text-deep-navy mb-4">نظرة عامة</h2>
                        <div className="w-24 h-1 bg-gold" />
                    </div>
                    <div className="prose prose-lg max-w-none text-right" dir="rtl">
                        <p className="text-xl text-gray-700 leading-relaxed mb-6">
                            في عالم القطاع الثالث، لا يكفي أن تمتلك الجمعية رسالة نبيلة وأثراً اجتماعياً حقيقياً - بل يجب أن تصل هذه الرسالة إلى <span className="font-bold text-deep-navy">المانحين المناسبين</span> في <span className="font-bold text-deep-navy">الوقت المناسب</span> وبالطريقة المناسبة.
                        </p>
                        <p className="text-xl text-gray-700 leading-relaxed">
                            نحن في <span className="text-gold font-bold">نظم الهندسة المبتكرة للتسويق</span> نطبق منهجية علمية دقيقة لجذب الرعايات، تجمع بين فهم السوق المحلي، تحليل البيانات، وبناء علاقات استراتيجية طويلة المدى.
                        </p>
                    </div>
                </div>
            </section>

            {/* Methodology Title */}
            <section className="py-16 bg-slate-50">
                <div className="max-w-5xl mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold text-deep-navy mb-4">المراحل الأساسية لاستراتيجية جلب الرعايات</h2>
                    <p className="text-gray-600">منهجية علمية متكاملة في ثلاث مراحل رئيسية</p>
                </div>
            </section>

            {/* Phase 1: Research & Analysis */}
            <section className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        <div>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center">
                                    <Search className="w-8 h-8 text-gold" />
                                </div>
                                <div>
                                    <span className="block text-gold font-black text-lg">المرحلة الأولى</span>
                                    <h3 className="text-3xl font-bold text-deep-navy">البحث والتحليل العميق</h3>
                                </div>
                            </div>
                            <p className="text-gray-600 text-lg mb-8">
                                نبدأ بدراسة شاملة للسوق المحلي والمانحين المحتملين لضمان استهداف دقيق وفعّال
                            </p>
                        </div>
                        <div className="space-y-6">
                            <AnalysisCard
                                title="تحليل السوق المحلي"
                                desc="دراسة شاملة للقطاع الخاص في منطقة حائل: الشركات الكبرى، المؤسسات الناشئة، القطاعات الاقتصادية النشطة، وتوجهات السوق"
                            />
                            <AnalysisCard
                                title="رسم خريطة المانحين"
                                desc="تحديد المانحين المحتملين وتصنيفهم حسب القطاع، الحجم، تاريخ المسؤولية الاجتماعية، والتوافق مع رسالة الجمعية"
                            />
                            <AnalysisCard
                                title="تحليل المنافسين"
                                desc="دراسة كيفية جذب الجمعيات الأخرى للرعايات، تحديد الفرص غير المستغلة، والميزة التنافسية للجمعية"
                            />
                            <AnalysisCard
                                title="فهم احتياجات الجمعية"
                                desc="تحديد الأهداف المالية، البرامج التي تحتاج رعاية، الجداول الزمنية، والفرص الاستثمارية المتاحة"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Phase 2: Strategy Building */}
            <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="mb-12">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-deep-navy rounded-2xl flex items-center justify-center">
                                <Target className="w-8 h-8 text-gold" />
                            </div>
                            <div>
                                <span className="block text-gold font-black text-lg">المرحلة الثانية</span>
                                <h3 className="text-3xl font-bold text-deep-navy">بناء الاستراتيجية المخصصة</h3>
                            </div>
                        </div>
                        <p className="text-gray-600 text-lg">
                            بناءً على التحليل العميق، نصمم استراتيجية مخصصة تشمل:
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <StrategyCard
                            icon={<Users className="w-6 h-6" />}
                            title="تحديد الشرائح المستهدفة"
                            desc="اختيار القطاعات والشركات الأكثر توافقاً مع رسالة الجمعية وأهدافها"
                        />
                        <StrategyCard
                            icon={<FileText className="w-6 h-6" />}
                            title="بناء عروض القيمة"
                            desc="صياغة رسائل مخصصة لكل شريحة توضح القيمة المضافة للراعي والأثر الاجتماعي المتوقع"
                        />
                        <StrategyCard
                            icon={<BarChart3 className="w-6 h-6" />}
                            title="تصميم الحقائب الاستثمارية"
                            desc="إعداد مستندات احترافية تعرض فرص الرعاية، مستويات الدعم، والعوائد (التسويقية والاجتماعية)"
                        />
                        <StrategyCard
                            icon={<Mail className="w-6 h-6" />}
                            title="وضع خطة التواصل"
                            desc="تحديد قنوات التواصل المناسبة، الجداول الزمنية، ومسارات المتابعة"
                        />
                        <StrategyCard
                            icon={<LineChart className="w-6 h-6" />}
                            title="تحديد مؤشرات الأداء"
                            desc="وضع معايير قابلة للقياس (KPIs) لتقييم نجاح الاستراتيجية وتحسينها"
                        />
                    </div>
                </div>
            </section>

            {/* Phase 3: Implementation */}
            <section className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="mb-12">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center">
                                <Handshake className="w-8 h-8 text-gold" />
                            </div>
                            <div>
                                <span className="block text-gold font-black text-lg">المرحلة الثالثة</span>
                                <h3 className="text-3xl font-bold text-deep-navy">التنفيذ الاحترافي والمتابعة</h3>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-5 gap-4">
                        <ExecutionStep num="01" title="التواصل الأولي" desc="التواصل مع المانحين المحتملين عبر القنوات المناسبة" />
                        <ExecutionStep num="02" title="تقديم العروض" desc="عرض الحقائب الاستثمارية والفرص بطريقة احترافية" />
                        <ExecutionStep num="03" title="التفاوض" desc="التفاوض على شروط الرعاية والالتزامات المتبادلة" />
                        <ExecutionStep num="04" title="إبرام الاتفاقيات" desc="صياغة اتفاقيات واضحة تحمي حقوق الطرفين" />
                        <ExecutionStep num="05" title="المتابعة المستمرة" desc="متابعة دورية وتقديم تقارير الأثر" />
                    </div>
                </div>
            </section>

            {/* Tools & Technologies */}
            <section className="py-20 bg-deep-navy text-white">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="mb-12 text-center">
                        <h2 className="text-4xl font-bold mb-4">الأدوات والتقنيات المتقدمة</h2>
                        <p className="text-blue-200 max-w-2xl mx-auto">
                            نستخدم مجموعة من الأدوات والتقنيات الحديثة لضمان أعلى مستويات الكفاءة
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <ToolCard icon={<Database className="w-8 h-8" />} title="CRM المانحين" desc="نظام إدارة علاقات متكامل لتتبع المانحين وسجل التواصل" />
                        <ToolCard icon={<BarChart3 className="w-8 h-8" />} title="تحليل البيانات" desc="أدوات تحليلية لفهم سلوك المانحين وتوقع الفرص" />
                        <ToolCard icon={<TrendingUp className="w-8 h-8" />} title="التسويق الرقمي" desc="حملات مستهدفة عبر منصات التواصل الاجتماعي" />
                        <ToolCard icon={<LineChart className="w-8 h-8" />} title="قياس الأداء" desc="لوحات تحكم لمتابعة التقدم وقياس النتائج فوراً" />
                    </div>
                </div>
            </section>

            {/* Expected Results */}
            <section className="py-20 bg-gradient-to-br from-gold/5 to-white">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="mb-12 text-center">
                        <h2 className="text-4xl font-bold text-deep-navy mb-4">النتائج المتوقعة</h2>
                        <div className="w-24 h-1 bg-gold mx-auto" />
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <ResultCard text="زيادة ملموسة في عدد الرعاة والمانحين الاستراتيجيين" />
                        <ResultCard text="تنويع مصادر التمويل وتقليل الاعتماد على مصدر واحد" />
                        <ResultCard text="بناء علاقات طويلة المدى مع الرعاة (ليس رعاية لمرة واحدة)" />
                        <ResultCard text="تحسين صورة الجمعية في المجتمع المحلي والقطاع الخاص" />
                        <ResultCard text="تحقيق الاستدامة المالية وضمان استمرارية البرامج والمشاريع" />
                        <ResultCard text="الحصول على بيانات قيمة عن سوق الرعايات للتحسين المستمر" />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-r from-deep-navy to-primary-dark text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-5" />
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <div className="bg-gold/10 backdrop-blur-sm border border-gold/20 rounded-3xl p-12">
                        <h2 className="text-4xl font-black mb-6">
                            نحن لا نجلب الرعايات فقط - بل نبني شراكات استراتيجية مستدامة
                        </h2>
                        <p className="text-xl text-blue-200 mb-8">
                            ابدأ اليوم في بناء استراتيجية متكاملة لجذب الرعاة والمانحين الاستراتيجيين
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="tel:0555056545"
                                className="px-10 py-5 bg-gold text-deep-navy font-black rounded-2xl hover:bg-gold-light transition-all flex items-center justify-center gap-3 text-xl"
                            >
                                <Phone className="w-6 h-6" />
                                0555056545
                            </a>
                            <Link
                                href="/csr"
                                className="px-10 py-5 bg-white/10 border-2 border-white/20 text-white rounded-2xl font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-3"
                            >
                                عودة للخدمات
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                        <p className="text-sm text-blue-300 mt-8">م. أحمد عبدالمعطي - متخصص الوساطة التسويقية للقطاع الثالث</p>
                    </div>
                </div>
            </section>

        </div>
    );
}

function AnalysisCard({ title, desc }: { title: string; desc: string }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-gold/30 hover:shadow-lg transition-all">
            <h4 className="text-lg font-bold text-deep-navy mb-2">{title}</h4>
            <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
        </div>
    );
}

function StrategyCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
            <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center text-gold mb-4 group-hover:bg-gold group-hover:text-white transition-all">
                {icon}
            </div>
            <h4 className="text-lg font-bold text-deep-navy mb-2">{title}</h4>
            <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
        </div>
    );
}

function ExecutionStep({ num, title, desc }: { num: string; title: string; desc: string }) {
    return (
        <div className="bg-slate-50 p-6 rounded-2xl text-center hover:bg-white hover:shadow-md transition-all border border-slate-100">
            <span className="block text-gold font-black text-3xl mb-3">{num}</span>
            <h4 className="font-bold text-deep-navy mb-2 text-sm">{title}</h4>
            <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
        </div>
    );
}

function ToolCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
    return (
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 hover:border-gold/30 transition-all">
            <div className="text-gold mb-4">{icon}</div>
            <h4 className="text-lg font-bold mb-2">{title}</h4>
            <p className="text-blue-200 text-sm leading-relaxed">{desc}</p>
        </div>
    );
}

function ResultCard({ text }: { text: string }) {
    return (
        <div className="flex gap-3 items-start bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-gold/30 transition-all">
            <CheckCircle className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
            <p className="text-gray-700 leading-relaxed">{text}</p>
        </div>
    );
}
