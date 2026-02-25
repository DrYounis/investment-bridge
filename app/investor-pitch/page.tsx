import Link from 'next/link';
import InvestmentSimulator from './InvestmentSimulator';
import { fetchFounderPortfolio, type PortfolioRepo } from '@/lib/github-portfolio';
import * as motion from 'framer-motion/client';
import { type Variants } from 'framer-motion';

// Animation Variants
const containerVariant: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
};

const itemVariant: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};
type ServiceCardModel = {
    title: string;
    techStack: string;
    businessValue: string;
    purpose: string;
};

const vcPitches: ServiceCardModel[] = [
    {
        title: 'WiqayaGen (وقاية-جين)',
        techStack: 'AI • HealthTech • Insurance',
        purpose: 'المشكلة السوقية: تكلفة الرعاية الصحية المتأخرة تستنزف ميزانيات شركات التأمين الصحي بمليارات الريالات سنوياً بسبب غياب التنبؤ المبكر.',
        businessValue: 'محرك الأرباح: نموذج B2B SaaS؛ نحقق الربح عبر اشتراكات شهرية مقابل نسبة من الوفرات المالية. القابلية للتوسع: فكرة مليارية تتماشى مع رؤية 2030 لتقليل تكاليف التأمين.',
    },
    {
        title: 'Celebrate-Hub (منصة احتفال)',
        techStack: 'Marketplace • Event-Tech • Fintech',
        purpose: 'المشكلة السوقية: سوق الفعاليات بالغ الضخامة ولكنه شديد التشتت، مما يرفع تكلفة البحث ويعيق سرعة إتمام الصفقات التجارية.',
        businessValue: 'محرك الأرباح: عمولات فورية من كل عملية حجز واشتراكات تميز لمزودي الخدمة. القابلية للتوسع: احتكار التحويلات المالية في قطاع الترفيه السعودي المنفجر.',
    },
    {
        title: 'Volunteer Management System',
        techStack: 'ESG Compliance • Corporate • GovTech',
        purpose: 'المشكلة السوقية: تفتقر الشركات الكبرى والجهات الحكومية لأدوات رقمية موثوقة لقياس وإثبات أثرها الاجتماعي (ESG Compliance).',
        businessValue: 'محرك الأرباح: رسوم ترخيص مؤسسي واشتراكات تقارير الامتثال الآلية. القابلية للتوسع: أداة امتثال تشريعية إجبارية للإدراج في السوق المالي والمناقصات.',
    },
    {
        title: 'sra (سرا)',
        techStack: 'FinTech • Cybersecurity • Trust',
        purpose: 'المشكلة السوقية: الاحتيال الرقمي وانعدام الموثوقية في قطاع المدفوعات يكلف المؤسسات خسائر فادحة ويدمر السمعة.',
        businessValue: 'محرك الأرباح: رسوم على كل عملية توثيق أمنية واحتمالية اشتراك حماية. القابلية للتوسع: بنية تحتية أمنية تمثل عصب قطاع التقنية المالية السعودي.',
    },
    {
        title: 'CareLoopHealthProject',
        techStack: 'Patient Retention • HealthTech • SaaS',
        purpose: 'المشكلة السوقية: التسرب العالي للمرضى بعد الزيارة الأولى يكلف العيادات الخاصة خسائر ضخمة في الإيرادات اليومية.',
        businessValue: 'محرك الأرباح: اشتراكات تقنية لرفع معدلات الاحتفاظ بالمرضى وجدولة الزيارات. القابلية للتوسع: رفع القيمة المكتسبة للمريض (LTV) لقطاع الرعاية الخاصة.',
    },
    {
        title: 'turathna-hub (منصة تراثنا)',
        techStack: 'Tourism • Cultural Heritage • Monetization',
        purpose: 'المشكلة السوقية: الأصول التراثية السعودية غير مستغلة تِجارياً بشكل شامل لتحويل تجربة السائح إلى إيراد مادي سلس.',
        businessValue: 'محرك الأرباح: عمولات حجوزات تجارب حصرية ورعاية فعاليات ونسب مبيعات. القابلية للتوسع: ربط مباشر بالإنفاق السيادي لقطاع السياحة الواعد.',
    },
];

export default async function InvestorPitchPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100" dir="rtl">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_15%,rgba(30,64,175,0.35),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.2),transparent_38%),linear-gradient(180deg,#020617_0%,#0f172a_55%,#111827_100%)]" />

            <main className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
                <motion.section
                    variants={containerVariant}
                    initial="hidden"
                    animate="show"
                    className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/50 p-8 shadow-2xl shadow-blue-950/30 sm:p-14 text-right"
                >
                    <motion.div
                        animate={{ opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -right-12 -top-16 h-56 w-56 rounded-full bg-blue-500/25 blur-3xl"
                    />
                    <motion.div
                        animate={{ opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute -left-16 bottom-0 h-52 w-52 rounded-full bg-emerald-400/20 blur-3xl"
                    />

                    <motion.p variants={itemVariant} className="relative z-10 text-xs font-semibold uppercase tracking-[0.24em] text-blue-300">غرفة المستثمرين | Marfa.sa</motion.p>
                    <motion.h1 variants={itemVariant} className="relative z-10 mt-5 max-w-3xl text-4xl font-black leading-tight text-white sm:text-6xl text-right">
                        ابنِ المستقبل مع مرفأ
                    </motion.h1>
                    <motion.p variants={itemVariant} className="relative z-10 mt-6 max-w-2xl text-base text-slate-300 sm:text-lg text-right">
                        عرض استثماري مكثف للمشاريع، مُصاغ بلغة الأعمال لتحقيق أقصى عائد على الاستثمار وتوليد الأرباح وفق رؤية السعودية 2030.
                    </motion.p>
                    <motion.div variants={itemVariant} className="relative z-10 mt-8 flex flex-wrap gap-3 justify-start">
                        <a href="#assets" className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:bg-slate-200 shadow-lg shadow-white/10">
                            استكشاف المشاريع
                        </a>
                        <a href="#simulator" className="rounded-xl border border-slate-600 bg-slate-800/70 px-5 py-3 text-sm font-bold text-slate-100 transition hover:border-slate-400 hover:bg-slate-800">
                            محاكاة الاستثمار
                        </a>
                    </motion.div>
                </motion.section>

                <section id="assets" className="mt-14 sm:mt-18 text-right">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="mb-8 flex flex-wrap items-end justify-between gap-4"
                    >
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">بطاقات الأصول</p>
                            <h2 className="mt-2 text-3xl font-black text-white">محفظة الخدمات الاستثمارية</h2>
                        </div>
                        <p className="max-w-2xl text-sm text-slate-400">
                            مشاريع مختارة بعناية للتركيز على القيمة السوقية والنمو السريع.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={containerVariant}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-50px" }}
                        className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
                    >
                        {vcPitches.map((card) => (
                            <motion.article
                                variants={itemVariant}
                                key={card.title}
                                className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:bg-slate-800/80 hover:shadow-xl hover:shadow-emerald-900/20 text-right"
                            >
                                <div className="mb-5 flex items-center justify-between gap-3">
                                    <h3 className="text-lg font-extrabold text-white">{card.title}</h3>
                                    <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-slate-300">
                                        Asset
                                    </span>
                                </div>

                                <div className="space-y-4 text-sm">
                                    <div className="text-right">
                                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">الميزة التقنية</p>
                                        <p className="mt-1 text-slate-200">{card.techStack}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">المشكلة السوقية</p>
                                        <p className="mt-1 text-slate-300 leading-relaxed">{card.purpose}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-400">القيمة التجارية</p>
                                        <p className="mt-1 text-emerald-100 leading-relaxed">{card.businessValue}</p>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </motion.div>
                </section>

                <div className="mt-16">
                    <InvestmentSimulator />
                </div>

                <motion.section
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ type: "spring", bounce: 0.4 }}
                    className="relative overflow-hidden mt-16 rounded-3xl border border-slate-700 bg-gradient-to-br from-slate-900 to-slate-800 p-8 sm:p-10 shadow-2xl text-right"
                >
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                    <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
                        <div className="max-w-2xl text-right">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">الخطوات النهائية</p>
                            <h3 className="mt-2 text-3xl font-black text-white">انتقل إلى مناقشة بنود الاستثمار</h3>
                            <p className="mt-3 text-slate-300">
                                استكمل العملية عبر جدولة اجتماع لمناقشة التفاصيل اللوجستية وإغلاق جولة الاستثمار.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Link href="/meetings" className="rounded-xl shadow-lg shadow-emerald-500/20 bg-emerald-500 px-6 py-3 text-sm font-black text-slate-950 transition hover:bg-emerald-400 hover:scale-105 active:scale-95">
                                جدولة اجتماع مستثمر
                            </Link>
                            <Link href="/dashboard/investor" className="rounded-xl border border-slate-600 bg-slate-800/80 px-6 py-3 text-sm font-black text-slate-100 transition hover:border-slate-400 hover:bg-slate-700 hover:scale-105 active:scale-95">
                                افتح لوحة المستثمر
                            </Link>
                        </div>
                    </div>
                </motion.section>
            </main>
        </div>
    );
}
