"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    Target,
    Lightbulb,
    Settings,
    ShieldCheck,
    TrendingUp,
    Users,
    CheckCircle,
    ArrowRight,
    Phone,
    BarChart3,
    Heart,
    Presentation,
    Cpu
} from 'lucide-react';

export default function CSRPage() {
    return (
        <div className="min-h-screen bg-[#FDFCF0] text-right font-arabic" dir="rtl">

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gold/5 to-transparent pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1 space-y-8 animate-fade-in-up">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-deep-navy text-gold text-sm font-bold border border-gold/20">
                                <Settings className="w-4 h-4" />
                                <span>نظم الهندسة المبتكرة للتسويق</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-extrabold text-deep-navy leading-tight">
                                حيث تلتقي <span className="text-luxury-gold">الدقة الهندسية</span> <br />
                                بفن التسويق الخيري
                            </h1>
                            <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
                                نحن لا نقدم مجرد خدمات تسويقية تقليدية، بل نبني أنظمة متكاملة قائمة على الدقة، التخطيط المحكم، الحوكمة الرشيدة، وقياس الأثر الملموس.
                            </p>
                            <div className="flex flex-wrap gap-4 pt-4">
                                <Link
                                    href="https://wa.me/966555056545"
                                    className="px-8 py-4 bg-gradient-to-r from-gold to-gold-dark text-deep-navy font-black rounded-2xl shadow-lg hover:shadow-gold/20 transition-all transform hover:-translate-y-1 flex items-center gap-2"
                                >
                                    <Phone className="w-5 h-5" />
                                    ابدأ رحلة النجاح
                                </Link>
                                <Link
                                    href="#services"
                                    className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-bold hover:border-gold hover:bg-gold/5 transition-all"
                                >
                                    استكشف خدماتنا
                                </Link>
                            </div>
                        </div>
                        <div className="flex-1 relative">
                            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                                <div className="absolute inset-0 bg-blue-900/10 mix-blend-overlay" />
                                <div className="bg-deep-navy p-12 text-white aspect-[4/3] flex flex-col justify-center">
                                    <Cpu className="w-16 h-16 text-gold mb-6 opacity-80" />
                                    <h2 className="text-3xl font-bold mb-4">Engineering Success</h2>
                                    <p className="text-blue-200 text-lg">صفر مخاطرة مالية - Success Fee Model</p>
                                </div>
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold/10 rounded-full blur-3xl" />
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-deep-navy/5 rounded-full blur-3xl" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Intro & Stats */}
            <section className="py-20 bg-white shadow-sm border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-12 text-center">
                        <div className="space-y-2">
                            <h3 className="text-4xl font-black text-deep-navy">حائل</h3>
                            <p className="text-gray-500 font-bold">الموقع الرئيسي</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-4xl font-black text-gold">صفر</h3>
                            <p className="text-gray-500 font-bold">مخاطرة مالية للجمعيات</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-4xl font-black text-deep-navy">100%</h3>
                            <p className="text-gray-500 font-bold">دقة هندسية في التنفيذ</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision & Mission */}
            <section className="py-24 bg-gradient-to-br from-[#FDFCF0] to-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8 order-2 md:order-1">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-gold">
                                    <Target className="w-8 h-8" />
                                    <h2 className="text-3xl font-bold">رؤيتنا</h2>
                                </div>
                                <p className="text-xl text-gray-700 leading-relaxed border-r-4 border-gold pr-6">
                                    أن نكون الشريك الاستراتيجي الأول للقطاع الثالث في المملكة، من خلال تطبيق المنهجية الهندسية المبتكرة في التسويق الخيري، وتمكين المؤسسات غير الربحية من تحقيق الاستدامة المالية.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-deep-navy">
                                    <Heart className="w-8 h-8" />
                                    <h2 className="text-3xl font-bold">رسالتنا</h2>
                                </div>
                                <p className="text-xl text-gray-700 leading-relaxed border-r-4 border-deep-navy pr-6">
                                    بناء جسور الثقة بين الجمعيات الخيرية والرعاة الاستراتيجيين، من خلال تقديم حلول تسويقية هندسية مبتكرة تعتمد على الدقة في التخطيط والشفافية في التنفيذ.
                                </p>
                            </div>
                        </div>
                        <div className="order-1 md:order-2">
                            <div className="bg-deep-navy rounded-3xl p-10 text-white relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
                                <h3 className="text-2xl font-bold mb-6 text-gold">رؤية 2030</h3>
                                <p className="text-blue-100 leading-relaxed mb-8">
                                    في ظل رؤية المملكة الطموحة 2030، يبرز دور "القطاع الثالث" كشريك محوري في بناء مجتمع حيوي ومزدهر. نحن هنا لضمان استمرارية الأثر الاجتماعي وتحقيق الأهداف التنموية.
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="h-px bg-gold flex-1 opacity-30" />
                                    <span className="text-gold font-bold">تنمية مستدامة</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl font-extrabold text-deep-navy">خدماتنا التخصصية</h2>
                        <div className="w-24 h-1 bg-gold mx-auto" />
                        <p className="text-gray-500 max-w-xl mx-auto">
                            مجموعة متكاملة من الخدمات التسويقية المبتكرة والمصممة خصيصاً لتلبية احتياجات القطاع الثالث بكفاءة هندسية عالية.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <ServiceCard
                            icon={<Presentation className="w-8 h-8" />}
                            title="هندسة الحقائب الاستثمارية"
                            desc="نصمم حقائب رعاية احترافية تبرز القيمة المضافة للراعي والأثر الاجتماعي المتوقع بلغة الأعمال."
                        />
                        <ServiceCard
                            icon={<TrendingUp className="w-8 h-8" />}
                            title="استراتيجيات جلب الرعايات"
                            desc="نبني استراتيجيات شاملة لجذب المانحين الاستراتيجيين بناءً على دراسة عميقة للسوق المحلي."
                            link="/csr/sponsorship-strategies"
                        />
                        <ServiceCard
                            icon={<Users className="w-8 h-8" />}
                            title="إدارة علاقات المانحين"
                            desc="نطبق مبادئ CRM المتقدمة لبناء أنظمة متابعة منظمة للمانحين وتعزيز ولائهم طويل المدى."
                        />
                        <ServiceCard
                            icon={<BarChart3 className="w-8 h-8" />}
                            title="تقارير الأثر التقنية"
                            desc="نعد تقارير أثر احترافية مدعومة بالبيانات ومؤشرات الأداء القابلة للقياس لتعزيز ثقة المانحين."
                        />
                    </div>
                </div>
            </section>

            {/* Success Stories */}
            <section className="py-24 bg-deep-navy text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="mb-16">
                        <h2 className="text-4xl font-bold mb-4 border-r-8 border-gold pr-6">سجل إنجازاتنا</h2>
                        <p className="text-blue-200">نماذج من قصص نجاحنا المشتركة في منطقة حائل</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <CaseStudyCard
                            name="جمعية عزم"
                            focus="دعم مرضى التصلب المتعدد"
                            result="زيادة ملموسة في الرعايات الشهرية وتوقيع شراكات مع شركات كبرى."
                            image="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800"
                        />
                        <CaseStudyCard
                            name="مركز قدرات عزم"
                            focus="التأهيل الطبي لذوي الإعاقة"
                            result="استقطاب رعاة استراتيجيين وتوسيع نطاق الخدمات العلاجية المتقدمة."
                            image="/images/csr/azm-center-logo.png"
                        />
                        <CaseStudyCard
                            name="جمعية نشاط الرياضية"
                            focus="تنمية الرياضة المجتمعية"
                            result="توقيع شراكات مع علامات تجارية رياضية وتنظيم فعاليات أكثر احترافية."
                            image="/images/csr/nashat-logo.png"
                        />
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1 space-y-8">
                            <h2 className="text-4xl font-black text-deep-navy">لماذا تختارنا؟</h2>
                            <div className="space-y-6">
                                <FeatureItem
                                    title="الخبرة الميدانية العميقة في حائل"
                                    desc="نمتلك فهماً حقيقياً لديناميكيات المجتمع المحلي وعلاقات واسعة مع القطاع الخاص."
                                />
                                <FeatureItem
                                    title="الحلول الرقمية والتحليلية"
                                    desc="نعتمد على البيانات في كل مرحلة لضمان الشفافية وقياس العائد على الاستثمار."
                                />
                                <FeatureItem
                                    title="نموذج Success Fee"
                                    desc="الجمعية لا تدفع شيئاً إلا عند تحقيق النتائج الفعلية، صفر مخاطرة مالية."
                                />
                            </div>
                        </div>
                        <div className="order-1 lg:order-2 relative h-[400px] rounded-3xl overflow-hidden shadow-2xl">
                            <Image
                                src="https://images.unsplash.com/photo-1454165833767-027ff819934c?auto=format&fit=crop&q=80&w=1200"
                                alt="Professional Marketing Consultation"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-deep-navy/80 to-transparent flex items-end p-10">
                                <div className="bg-gold/20 backdrop-blur-md p-6 rounded-2xl border border-gold/30">
                                    <p className="text-white font-bold text-lg">"نحن لا نقدم نصيحة عابرة، بل نقدم خارطة طريق."</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Methodology */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-deep-navy mb-4">المنطق الهندسي في التسويق</h2>
                        <p className="text-gray-500">خمس خطوات مدروسة نحو النجاح المستدام</p>
                    </div>

                    <div className="grid md:grid-cols-5 gap-4">
                        <StepBox num="01" title="التحليل والدراسة" />
                        <StepBox num="02" title="التخطيط الاستراتيجي" />
                        <StepBox num="03" title="التنفيذ الدقيق" />
                        <StepBox num="04" title="القياس والتحسين" />
                        <StepBox num="05" title="التقارير الشفافة" />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-r from-deep-navy to-primary-dark text-white relative">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('/images/logo-marfa.png')] bg-center bg-no-repeat bg-contain" />
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-12">
                    <div className="space-y-4">
                        <h2 className="text-4xl md:text-5xl font-black">لنبدأ معاً رحلة التحول نحو الاستدامة</h2>
                        <p className="text-xl text-blue-200">
                            نموذجنا بسيط: نحن لا ننجح إلا بنجاحكم. صفر مخاطرة، شراكة حقيقية.
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row justify-center items-center gap-8 bg-white/5 p-8 rounded-3xl backdrop-blur-lg border border-white/10">
                        <div className="text-right">
                            <p className="text-gold font-bold mb-1">تواصل مباشرة مع:</p>
                            <h4 className="text-2xl font-bold">م. أحمد عبدالمعطي</h4>
                            <p className="text-blue-300">متخصص الوساطة التسويقية للقطاع الثالث</p>
                        </div>
                        <div className="h-20 w-px bg-white/20 hidden md:block" />
                        <a
                            href="tel:0555056545"
                            className="px-10 py-5 bg-gold text-deep-navy font-black rounded-2xl hover:bg-gold-light transition-all flex items-center gap-3 text-xl"
                        >
                            <Phone className="w-6 h-6" />
                            0555056545
                        </a>
                    </div>

                    <p className="text-sm opacity-60">"حيث تلتقي الدقة الهندسية بفن التسويق الخيري"</p>
                </div>
            </section>

        </div>
    );
}

function ServiceCard({ icon, title, desc, link }: any) {
    const content = (
        <>
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-deep-navy mb-6 group-hover:bg-gold group-hover:text-white transition-all">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-deep-navy mb-4">{title}</h3>
            <p className="text-gray-500 leading-relaxed text-sm">
                {desc}
            </p>
        </>
    );

    if (link) {
        return (
            <Link href={link} className="block p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-gold/30 hover:-translate-y-2 transition-all group cursor-pointer">
                {content}
            </Link>
        );
    }

    return (
        <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-gold/30 hover:-translate-y-2 transition-all group">
            {content}
        </div>
    );
}

function CaseStudyCard({ name, focus, result, image }: any) {
    return (
        <div className="bg-white/5 rounded-3xl overflow-hidden border border-white/10 hover:border-gold/50 transition-all hover:bg-white/[0.08] group">
            <div className="h-48 relative">
                <Image src={image} alt={name} fill className="object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-4 right-4 bg-gold text-deep-navy px-3 py-1 rounded-full text-xs font-bold">
                    {focus}
                </div>
            </div>
            <div className="p-8 space-y-4">
                <h3 className="text-2xl font-bold text-gold">{name}</h3>
                <p className="text-blue-100 leading-relaxed line-clamp-3">
                    {result}
                </p>
            </div>
        </div>
    );
}

function FeatureItem({ title, desc }: any) {
    return (
        <div className="flex gap-4">
            <div className="mt-1">
                <CheckCircle className="w-6 h-6 text-gold" />
            </div>
            <div>
                <h4 className="text-xl font-bold text-deep-navy mb-1">{title}</h4>
                <p className="text-gray-500">{desc}</p>
            </div>
        </div>
    );
}

function StepBox({ num, title }: any) {
    return (
        <div className="bg-white p-6 rounded-2xl text-center border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <span className="block text-gold font-black text-2xl mb-2">{num}</span>
            <h4 className="font-bold text-deep-navy text-sm">{title}</h4>
        </div>
    );
}
