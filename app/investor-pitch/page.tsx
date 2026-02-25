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

function inferBusinessValue(description: string) {
    const text = description.toLowerCase();

    if (text.includes('ai') || text.includes('ml') || text.includes('agent') || text.includes('model')) {
        return 'Productizes AI workflows into scalable revenue opportunities.';
    }
    if (text.includes('dashboard') || text.includes('analytics') || text.includes('data')) {
        return 'Turns raw data into executive-grade decisions and recurring insights services.';
    }
    if (text.includes('automation') || text.includes('pipeline') || text.includes('api')) {
        return 'Reduces operational costs through automation and integration efficiency.';
    }
    if (text.includes('fintech') || text.includes('invest') || text.includes('finance')) {
        return 'Expands access to capital and financial execution for growth-stage ventures.';
    }

    return 'Converts technical IP into investable digital assets and monetizable products.';
}

function toServiceCard(repo: PortfolioRepo): ServiceCardModel {
    const language = repo.language || 'Multi-stack';
    const normalizedTitle = repo.name.replace(/[-_]/g, ' ').replace(/\s+/g, ' ').trim();
    const purpose = repo.description?.trim() || 'Repository focused on practical product delivery.';
    const techStack = [language, 'GitHub', 'Cloud-native delivery'].join(' • ');

    return {
        title: normalizedTitle,
        techStack,
        purpose,
        businessValue: inferBusinessValue(purpose),
    };
}

const fallbackServices: ServiceCardModel[] = [
    {
        title: 'AI Pitch Deck Generator',
        techStack: 'Next.js • TypeScript • AI content workflows',
        purpose: 'Transforms founder project notes into investor-grade decks with financial and market narratives.',
        businessValue: 'Accelerates fundraising readiness and shortens time-to-first investor meeting.',
    },
    {
        title: 'Marfa Assessment Engine',
        techStack: 'Next.js • Logic Engine • Supabase',
        purpose: 'Scores startup readiness through structured idea analysis and market/tech/team factors.',
        businessValue: 'Improves investment screening quality and reduces early-stage risk.',
    },
    {
        title: 'Marfa Lab Financial Modeling',
        techStack: 'TypeScript • Scenario calculators • Supabase',
        purpose: 'Builds feasibility and financial model assumptions for founders before institutional pitching.',
        businessValue: 'Produces cleaner valuation narratives and stronger term-sheet conversations.',
    },
    {
        title: 'Technical Reports & Integrations',
        techStack: 'API Integrations • Strava Service • Automated reporting',
        purpose: 'Generates live technical reports and metrics from connected systems.',
        businessValue: 'Adds measurable proof-of-execution that supports investor confidence.',
    },
];

export default async function InvestorPitchPage() {
    const repos = await fetchFounderPortfolio();
    const repoCards = repos.slice(0, 6).map(toServiceCard);
    const cards = repoCards.length ? repoCards : fallbackServices;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_15%,rgba(30,64,175,0.35),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.2),transparent_38%),linear-gradient(180deg,#020617_0%,#0f172a_55%,#111827_100%)]" />

            <main className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
                <motion.section
                    variants={containerVariant}
                    initial="hidden"
                    animate="show"
                    className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/50 p-8 shadow-2xl shadow-blue-950/30 sm:p-14"
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

                    <motion.p variants={itemVariant} className="relative z-10 text-xs font-semibold uppercase tracking-[0.24em] text-blue-300">Marfa.sa Investor Room</motion.p>
                    <motion.h1 variants={itemVariant} className="relative z-10 mt-5 max-w-3xl text-4xl font-black leading-tight text-white sm:text-6xl">
                        Build the Future with Marfa.sa
                    </motion.h1>
                    <motion.p variants={itemVariant} className="relative z-10 mt-6 max-w-2xl text-base text-slate-300 sm:text-lg">
                        A gamified investment interface that translates technical execution into structured, defensible upside.
                        Explore active assets, simulate stake allocation, and move directly into term-sheet discussion.
                    </motion.p>
                    <motion.div variants={itemVariant} className="relative z-10 mt-8 flex flex-wrap gap-3">
                        <a href="#assets" className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:bg-slate-200 shadow-lg shadow-white/10">
                            Explore Assets
                        </a>
                        <a href="#simulator" className="rounded-xl border border-slate-600 bg-slate-800/70 px-5 py-3 text-sm font-bold text-slate-100 transition hover:border-slate-400 hover:bg-slate-800">
                            Simulate Investment
                        </a>
                    </motion.div>
                </motion.section>

                <section id="assets" className="mt-14 sm:mt-18">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="mb-8 flex flex-wrap items-end justify-between gap-4"
                    >
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Asset Cards</p>
                            <h2 className="mt-2 text-3xl font-black text-white">Dryounis Service Portfolio</h2>
                        </div>
                        <p className="max-w-2xl text-sm text-slate-400">
                            Cards are generated from the DrYounis GitHub portfolio feed when available, with local service documentation fallback.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={containerVariant}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-50px" }}
                        className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
                    >
                        {cards.map((card) => (
                            <motion.article
                                variants={itemVariant}
                                key={card.title}
                                className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:bg-slate-800/80 hover:shadow-xl hover:shadow-emerald-900/20"
                            >
                                <div className="mb-5 flex items-center justify-between gap-3">
                                    <h3 className="text-lg font-extrabold capitalize text-white">{card.title}</h3>
                                    <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-slate-300">
                                        Asset
                                    </span>
                                </div>

                                <div className="space-y-4 text-sm">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Tech Stack</p>
                                        <p className="mt-1 text-slate-200">{card.techStack}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Core Purpose</p>
                                        <p className="mt-1 text-slate-300">{card.purpose}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-400">Business Value</p>
                                        <p className="mt-1 text-emerald-100">{card.businessValue}</p>
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
                    className="relative overflow-hidden mt-16 rounded-3xl border border-slate-700 bg-gradient-to-br from-slate-900 to-slate-800 p-8 sm:p-10 shadow-2xl"
                >
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                    <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
                        <div className="max-w-2xl">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">Finalize Terms</p>
                            <h3 className="mt-2 text-3xl font-black text-white">Move To Secure Term-Sheet Discussion</h3>
                            <p className="mt-3 text-slate-300">
                                Continue through Marfa&apos;s authenticated scheduling flow to validate allocation details and close next-step actions.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Link href="/meetings" className="rounded-xl shadow-lg shadow-emerald-500/20 bg-emerald-500 px-6 py-3 text-sm font-black text-slate-950 transition hover:bg-emerald-400 hover:scale-105 active:scale-95">
                                Schedule Investor Meeting
                            </Link>
                            <Link href="/dashboard/investor" className="rounded-xl border border-slate-600 bg-slate-800/80 px-6 py-3 text-sm font-black text-slate-100 transition hover:border-slate-400 hover:bg-slate-700 hover:scale-105 active:scale-95">
                                Open Investor Dashboard
                            </Link>
                        </div>
                    </div>
                </motion.section>
            </main>
        </div>
    );
}
