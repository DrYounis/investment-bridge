"use client";

import React from 'react';
import {
    Calendar,
    MapPin,
    Users,
    Eye,
    Clock,
    TrendingUp,
    Award,
    Check,
    Phone,
    Mail,
    Star,
    Trophy,
    Heart
} from 'lucide-react';

export default function HailMarathon2026Page() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FDFCF0] to-white text-right font-arabic" dir="rtl">

            {/* Header Warning */}
            <div className="bg-deep-navy text-white py-3 px-6 text-center">
                <p className="text-sm">
                    <span className="text-gold font-bold">⚠️ وثيقة سرية</span> - هذا المستند مخصص للرعاة المحتملين فقط
                </p>
            </div>

            {/* Hero Section */}
            <section className="py-16 bg-gradient-to-r from-deep-navy via-primary-dark to-deep-navy text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-5" />
                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/20 text-gold text-sm font-bold border border-gold/30 mb-4">
                            <Trophy className="w-4 h-4" />
                            <span>فرصة استثمارية حصرية</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black mb-4">برنامج رعاية ماراثون حائل 2026</h1>
                        <p className="text-xl text-blue-200 mb-2">بتنظيم: جمعية نشاط الرياضية</p>
                        <p className="text-2xl text-gold font-bold">فرصة استثمارية فريدة للوصول إلى 800+ مشارك نشط</p>
                    </div>

                    {/* Event Stats */}
                    <div className="grid md:grid-cols-5 gap-6 bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                        <StatCard icon={<Calendar />} title="التاريخ المتوقع" value="مارس 2026" />
                        <StatCard icon={<MapPin />} title="المكان" value="منطقة حائل التاريخية" />
                        <StatCard icon={<Users />} title="المشاركون" value="800+ عداء" />
                        <StatCard icon={<Eye />} title="الجمهور" value="3000+ زائر" />
                        <StatCard icon={<Clock />} title="مدة الحملة" value="3 أشهر" />
                    </div>
                </div>
            </section>

            {/* Market Analysis */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-12">
                        <h2 className="text-4xl font-bold text-deep-navy mb-4">الخطوة الأولى: تحليل السوق المحلي في حائل</h2>
                        <p className="text-gray-600 text-lg">قمنا بدراسة شاملة للسوق المحلي لتحديد القطاعات الأكثر توافقاً مع الحدث الرياضي</p>
                    </div>

                    <div className="overflow-x-auto bg-slate-50 rounded-3xl p-8 border border-slate-200">
                        <table className="w-full text-right">
                            <thead>
                                <tr className="border-b-2 border-slate-300">
                                    <th className="pb-4 pr-4 text-deep-navy font-black">القطاع</th>
                                    <th className="pb-4 pr-4 text-deep-navy font-black">أمثلة من السوق المحلي</th>
                                    <th className="pb-4 pr-4 text-deep-navy font-black text-center">مدى التوافق</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                <MarketRow
                                    sector="القطاع الصحي والطبي"
                                    examples="مستشفيات خاصة، صيدليات كبرى، مراكز علاج طبيعي، عيادات تغذية رياضية"
                                    rating={5}
                                    label="عالي جداً"
                                />
                                <MarketRow
                                    sector="الأغذية والمشروبات الصحية"
                                    examples="شركات المياه، مشروبات الطاقة، المكملات الغذائية، المطاعم الصحية"
                                    rating={5}
                                    label="عالي جداً"
                                />
                                <MarketRow
                                    sector="الملابس والمعدات الرياضية"
                                    examples="محلات الأحذية الرياضية، ملابس رياضية، معدات اللياقة"
                                    rating={5}
                                    label="عالي جداً"
                                />
                                <MarketRow
                                    sector="البنوك والتأمين"
                                    examples="البنوك المحلية (برامج المسؤولية الاجتماعية)، شركات التأمين الصحي"
                                    rating={4}
                                    label="عالي"
                                />
                                <MarketRow
                                    sector="قطاع السياحة والضيافة"
                                    examples="فنادق حائل، منتجعات سياحية، شركات النقل، وكالات السفر"
                                    rating={4}
                                    label="عالي"
                                />
                                <MarketRow
                                    sector="التقنية والاتصالات"
                                    examples="شركات الاتصالات، تطبيقات اللياقة، أجهزة قابلة للارتداء (Wearables)"
                                    rating={3}
                                    label="متوسط-عالي"
                                />
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Sponsorship Tiers */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-12 text-center">
                        <h2 className="text-4xl font-bold text-deep-navy mb-4">الخطوة الثانية: برنامج الرعاية المتدرج</h2>
                        <p className="text-gray-600 text-lg">برنامج رعاية متدرج يناسب مختلف أحجام الشركات والميزانيات</p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8 mb-12">
                        {/* Gold Tier */}
                        <TierCard
                            tier="gold"
                            icon={<Trophy className="w-12 h-12" />}
                            title="الراعي الذهبي"
                            subtitle="حصري - راعي واحد فقط"
                            price="150,000 - 200,000 ريال"
                            features={[
                                { name: "الشعار على قميص المتسابقين", value: "شعار كبير في الأمام" },
                                { name: "اللافتات والإعلانات", value: "10 لافتات في مواقع استراتيجية" },
                                { name: "التغطية الإعلامية", value: "ذكر حصري في جميع المواد التسويقية" },
                                { name: "البوث في الحدث", value: "بوث 6×6 متر في موقع مميز" },
                                { name: "منصة العرض", value: "كلمة تعريفية على المنصة (5 دقائق)" },
                                { name: "وسائل التواصل الاجتماعي", value: "15 منشور مدفوع + إشارة يومية" },
                                { name: "العينات/الهدايا", value: "توزيع منتجاتك على جميع المشاركين (800+)" },
                                { name: "الحقيبة الرياضية", value: "شعارك على الحقيبة الرسمية للماراثون" },
                                { name: "تقرير ما بعد الحدث", value: "تقرير تفصيلي عن الأثر والوصول" }
                            ]}
                            targetSectors="البنوك الكبرى، شركات الاتصالات، شركات الطاقة"
                        />

                        {/* Silver Tier */}
                        <TierCard
                            tier="silver"
                            icon={<Award className="w-12 h-12" />}
                            title="الراعي الفضي"
                            subtitle="2-3 رعاة"
                            price="75,000 - 100,000 ريال"
                            features={[
                                { name: "الشعار على قميص المتسابقين", value: "شعار متوسط على الكتف" },
                                { name: "اللافتات والإعلانات", value: "5 لافتات في مواقع جيدة" },
                                { name: "التغطية الإعلامية", value: "ذكر في المواد التسويقية الرئيسية" },
                                { name: "البوث في الحدث", value: "بوث 4×4 متر" },
                                { name: "وسائل التواصل الاجتماعي", value: "8 منشورات مدفوعة" },
                                { name: "العينات/الهدايا", value: "توزيع منتجاتك على 400 مشارك" },
                                { name: "الحقيبة الرياضية", value: "ملصق شعارك داخل الحقيبة" },
                                { name: "تقرير ما بعد الحدث", value: "تقرير مختصر عن الأثر" }
                            ]}
                            targetSectors="القطاع الصحي، الأغذية الصحية، الملابس الرياضية"
                        />

                        {/* Bronze Tier */}
                        <TierCard
                            tier="bronze"
                            icon={<Star className="w-12 h-12" />}
                            title="الراعي البرونزي"
                            subtitle="5-7 رعاة"
                            price="30,000 - 50,000 ريال"
                            features={[
                                { name: "الشعار على قميص المتسابقين", value: "شعار صغير على الظهر" },
                                { name: "اللافتات والإعلانات", value: "2-3 لافتات" },
                                { name: "التغطية الإعلامية", value: "ذكر في المنشورات" },
                                { name: "البوث في الحدث", value: "طاولة عرض 2×2 متر" },
                                { name: "وسائل التواصل الاجتماعي", value: "4 منشورات" },
                                { name: "العينات/الهدايا", value: "توزيع على 200 مشارك" },
                                { name: "الشهادة التقديرية", value: "شهادة شكر رسمية من الجمعية" }
                            ]}
                            targetSectors="الشركات الصغيرة والمتوسطة، المحلات المحلية"
                        />
                    </div>
                </div>
            </section>

            {/* Specialized Sponsorships */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-12">
                        <h2 className="text-4xl font-bold text-deep-navy mb-4">رعايات متخصصة (Niche Sponsorships)</h2>
                        <p className="text-gray-600 text-lg">فرص رعاية متخصصة تناسب قطاعات محددة</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <SpecializedCard title="راعي المياه الرسمي" benefits="توفير المياه لجميع المشاركين، شعار على محطات المياه، ذكر حصري" sector="شركات المياه" />
                        <SpecializedCard title="راعي الوجبات" benefits="توفير وجبات صحية، بوث طعام، عينات مجانية" sector="المطاعم الصحية" />
                        <SpecializedCard title="راعي الإسعافات الطبية" benefits="وحدة طبية متنقلة، شعار على سيارات الإسعاف، طاقم طبي" sector="المستشفيات/العيادات" />
                        <SpecializedCard title="راعي الميداليات والجوائز" benefits="شعار على الميداليات، ذكر في حفل التتويج" sector="المجوهرات/الشركات الكبرى" />
                        <SpecializedCard title="راعي نقطة البداية/النهاية" benefits="لافتات ضخمة، شعار على البوابة الرئيسية" sector="أي قطاع" />
                        <SpecializedCard title="راعي التوقيت الإلكتروني" benefits="شعار على شاشات العرض، ذكر في النتائج" sector="شركات التقنية" />
                        <SpecializedCard title="راعي حقيبة العداء" benefits="شعار على الحقيبة، منتجاتك بالداخل" sector="الملابس/المعدات الرياضية" />
                    </div>
                </div>
            </section>

            {/* Value Proposition */}
            <section className="py-20 bg-gradient-to-br from-deep-navy to-primary-dark text-white">
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="text-4xl font-bold mb-12 text-center">القيمة المضافة للراعي: لماذا ماراثون حائل 2026؟</h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <ValueCard
                            icon={<Users className="w-8 h-8" />}
                            title="الوصول لجمهور مستهدف"
                            desc="800+ عداء نشط + 3000 زائر = جمهور عالي الجودة مهتم بالصحة واللياقة"
                        />
                        <ValueCard
                            icon={<TrendingUp className="w-8 h-8" />}
                            title="التغطية الإعلامية"
                            desc="تغطية محلية وإقليمية في الصحف، التلفزيون، ومنصات التواصل الاجتماعي"
                        />
                        <ValueCard
                            icon={<Heart className="w-8 h-8" />}
                            title="بناء صورة إيجابية"
                            desc="الارتباط بالرياضة والصحة يعزز قيم علامتك التجارية"
                        />
                        <ValueCard
                            icon={<Eye className="w-8 h-8" />}
                            title="الانتشار الرقمي"
                            desc="أكثر من 50,000 مشاهدة متوقعة على وسائل التواصل الاجتماعي"
                        />
                        <ValueCard
                            icon={<Mail className="w-8 h-8" />}
                            title="قاعدة بيانات تسويقية"
                            desc="الوصول لبيانات المشاركين (بموافقتهم) لحملات تسويقية مستقبلية"
                        />
                        <ValueCard
                            icon={<Award className="w-8 h-8" />}
                            title="المسؤولية الاجتماعية"
                            desc="دعم الرياضة والصحة في المجتمع المحلي"
                        />
                    </div>
                </div>
            </section>

            {/* Case Study */}
            <section className="py-20 bg-gold/5">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="bg-white rounded-3xl p-12 shadow-xl border border-gold/20">
                        <h2 className="text-3xl font-bold text-deep-navy mb-6 flex items-center gap-3">
                            <Trophy className="w-8 h-8 text-gold" />
                            دراسة حالة: نجاحات سابقة
                        </h2>
                        <p className="text-gray-700 text-lg mb-6">
                            في فعالية الهايكنج الأخيرة التي نظمتها جمعية نشاط بمشاركة 400 متسابق، حققنا:
                        </p>
                        <div className="grid md:grid-cols-2 gap-6">
                            <CaseStudyPoint text="جذب 5 رعاة استراتيجيين من قطاعات مختلفة" />
                            <CaseStudyPoint text="تغطية إعلامية وصلت لأكثر من 80,000 شخص" />
                            <CaseStudyPoint text="رضا 100% من الرعاة وطلبهم للمشاركة في الفعاليات القادمة" />
                            <CaseStudyPoint text="بناء علاقات طويلة المدى أدت لرعايات مستمرة" />
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gradient-to-r from-deep-navy via-primary-dark to-deep-navy text-white">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-5xl font-black mb-6">كن جزءاً من أكبر حدث رياضي في حائل 2026</h2>
                    <p className="text-xl text-blue-200 mb-12">للاستفسار عن فرص الرعاية والحجز المبكر</p>

                    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-10 border border-white/20">
                        <div className="mb-6">
                            <p className="text-gold font-bold text-lg mb-2">م. أحمد عبدالمعطي</p>
                            <p className="text-blue-200">نظم الهندسة المبتكرة للتسويق</p>
                        </div>
                        <a
                            href="tel:0555056545"
                            className="inline-flex items-center gap-3 px-12 py-5 bg-gold text-deep-navy font-black rounded-2xl hover:bg-gold-light transition-all text-xl mb-4"
                        >
                            <Phone className="w-6 h-6" />
                            0555056545
                        </a>
                        <p className="text-sm text-blue-300 mt-6">نموذج Success Fee - صفر مخاطرة مالية</p>
                    </div>
                </div>
            </section>

        </div>
    );
}

function StatCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
    return (
        <div className="text-center">
            <div className="text-gold mb-2 flex justify-center">{icon}</div>
            <div className="text-sm text-blue-200 mb-1">{title}</div>
            <div className="font-bold text-lg">{value}</div>
        </div>
    );
}

function MarketRow({ sector, examples, rating, label }: { sector: string; examples: string; rating: number; label: string }) {
    return (
        <tr className="hover:bg-blue-50/50 transition-colors">
            <td className="py-4 pr-4 font-bold text-deep-navy">{sector}</td>
            <td className="py-4 pr-4 text-gray-600 text-sm">{examples}</td>
            <td className="py-4 pr-4">
                <div className="flex flex-col items-center gap-1">
                    <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-5 h-5 ${i < rating ? 'text-gold fill-gold' : 'text-gray-300'}`}
                            />
                        ))}
                    </div>
                    <span className="text-xs font-bold text-gray-600">{label}</span>
                </div>
            </td>
        </tr>
    );
}

function TierCard({ tier, icon, title, subtitle, price, features, targetSectors }: any) {
    const bgColor = tier === 'gold' ? 'from-yellow-50 to-yellow-100' : tier === 'silver' ? 'from-gray-50 to-gray-100' : 'from-orange-50 to-orange-100';
    const borderColor = tier === 'gold' ? 'border-yellow-400' : tier === 'silver' ? 'border-gray-400' : 'border-orange-400';
    const iconColor = tier === 'gold' ? 'text-yellow-600' : tier === 'silver' ? 'text-gray-600' : 'text-orange-600';

    return (
        <div className={`bg-gradient-to-br ${bgColor} rounded-3xl p-8 border-2 ${borderColor} shadow-lg hover:shadow-xl transition-all`}>
            <div className={`${iconColor} mb-4`}>{icon}</div>
            <h3 className="text-2xl font-black text-deep-navy mb-1">{title}</h3>
            <p className="text-sm text-gray-600 mb-4">{subtitle}</p>
            <div className="text-3xl font-black text-deep-navy mb-6">{price}</div>

            <div className="space-y-3 mb-6">
                {features.map((feature: any, idx: number) => (
                    <div key={idx} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <div className="font-bold text-sm text-deep-navy">{feature.name}</div>
                            <div className="text-xs text-gray-600">{feature.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="pt-4 border-t border-gray-300">
                <p className="text-xs font-bold text-gray-600 mb-1">القطاعات المستهدفة:</p>
                <p className="text-xs text-gray-600">{targetSectors}</p>
            </div>
        </div>
    );
}

function SpecializedCard({ title, benefits, sector }: { title: string; benefits: string; sector: string }) {
    return (
        <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl border border-blue-200 hover:shadow-lg transition-all">
            <h4 className="text-lg font-bold text-deep-navy mb-2">{title}</h4>
            <p className="text-sm text-gray-600 mb-3">{benefits}</p>
            <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-500">القطاع المستهدف:</span>
                <span className="text-blue-600 font-bold">{sector}</span>
            </div>
        </div>
    );
}

function ValueCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
    return (
        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all">
            <div className="text-gold mb-4">{icon}</div>
            <h4 className="text-lg font-bold mb-2">{title}</h4>
            <p className="text-blue-200 text-sm leading-relaxed">{desc}</p>
        </div>
    );
}

function CaseStudyPoint({ text }: { text: string }) {
    return (
        <div className="flex items-start gap-3">
            <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
            <p className="text-gray-700">{text}</p>
        </div>
    );
}
