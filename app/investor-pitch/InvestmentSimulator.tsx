'use client';

import { useMemo, useState, useEffect } from 'react';
import { motion, useSpring, useTransform, animate } from 'framer-motion';
import { Sparkles, Trophy, Rocket, ShieldCheck, Target, TrendingUp } from 'lucide-react';

const MAX_STAKE_PERCENT = 12.5;

// Adjust this baseline valuation anytime you want to tune the deal model.
const BASELINE_VALUATION_SAR = 12000000;
const MIN_INVESTMENT_SAR = 50000;
const MAX_INVESTMENT_SAR = 5000000;
const STEP_SAR = 25000;

function formatCurrency(value: number) {
    return new Intl.NumberFormat('en-SA', {
        style: 'currency',
        currency: 'SAR',
        maximumFractionDigits: 0,
    }).format(value);
}

// Helper to animated number values
function AnimatedNumber({ value, isCurrency = false, isPercentage = false }: { value: number, isCurrency?: boolean, isPercentage?: boolean }) {
    const springValue = useSpring(value, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        springValue.set(value);
    }, [value, springValue]);

    const displayValue = useTransform(springValue, (current) => {
        if (isCurrency) return formatCurrency(current);
        if (isPercentage) return `${current.toFixed(2)}%`;
        return current.toLocaleString('en-SA');
    });

    return <motion.span>{displayValue}</motion.span>;
}

export default function InvestmentSimulator() {
    const [investment, setInvestment] = useState(500000);

    const { stakePercent, impliedPostMoney, progressPercent, currentStage } = useMemo(() => {
        const rawStake = (investment / BASELINE_VALUATION_SAR) * 100;
        const cappedStake = Math.min(rawStake, MAX_STAKE_PERCENT);
        const postMoney = BASELINE_VALUATION_SAR + investment;
        const progress = ((investment - MIN_INVESTMENT_SAR) / (MAX_INVESTMENT_SAR - MIN_INVESTMENT_SAR)) * 100;

        // Determine Gamified Stage
        let stage = {
            name: 'Angel Explorer',
            icon: Sparkles,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/20',
            glow: 'shadow-amber-500/20'
        };

        if (investment >= 500000) {
            stage = { name: 'Seed Partner', icon: Target, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', glow: 'shadow-emerald-500/20' };
        }
        if (investment >= 1500000) {
            stage = { name: 'Growth Catalyst', icon: Rocket, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', glow: 'shadow-blue-500/20' };
        }
        if (investment >= 3500000) {
            stage = { name: 'Strategic Lead', icon: Trophy, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20', glow: 'shadow-purple-500/20' };
        }

        return {
            stakePercent: cappedStake,
            impliedPostMoney: postMoney,
            progressPercent: progress,
            currentStage: stage
        };
    }, [investment]);

    const Icon = currentStage.icon;

    return (
        <motion.section
            id="simulator"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`relative overflow-hidden rounded-3xl border border-slate-700 bg-slate-900/60 p-6 sm:p-10 shadow-2xl transition-all duration-700 ${currentStage.glow}`}
        >
            {/* Dynamic Background Glow Based on Stage */}
            <div className={`absolute -right-20 -top-20 h-64 w-64 rounded-full blur-3xl transition-colors duration-700 ${currentStage.bg}`} />
            <div className={`absolute -bottom-20 -left-20 h-64 w-64 rounded-full blur-3xl transition-colors duration-700 ${currentStage.bg}`} />

            <div className="relative z-10 flex flex-wrap items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Investment Simulator</p>
                        <motion.div
                            key={currentStage.name}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${currentStage.bg} ${currentStage.color} ${currentStage.border} border`}
                        >
                            <Icon className="h-3 w-3" />
                            {currentStage.name}
                        </motion.div>
                    </div>
                    <h3 className="mt-3 text-2xl sm:text-3xl font-black text-white">Structure The Deal In Real Time</h3>
                </div>
                <div className={`rounded-2xl border ${currentStage.border} ${currentStage.bg} px-5 py-4 text-right backdrop-blur-sm transition-colors duration-500`}>
                    <p className={`text-xs font-bold uppercase tracking-wide ${currentStage.color}`}>Investor Stake</p>
                    <p className={`text-4xl font-black ${currentStage.color} drop-shadow-sm`}>
                        <AnimatedNumber value={stakePercent} isPercentage={true} />
                    </p>
                    <div className="mt-1 flex items-center justify-end gap-1 text-xs opacity-70">
                        <ShieldCheck className={`h-3 w-3 ${currentStage.color}`} />
                        <span className={currentStage.color}>Hard cap: {MAX_STAKE_PERCENT}%</span>
                    </div>
                </div>
            </div>

            <div className="relative z-10 mt-10 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-medium text-slate-300">Select Allocation Size</p>
                    <p className="text-2xl font-bold text-white tracking-tight">
                        <AnimatedNumber value={investment} isCurrency={true} />
                    </p>
                </div>

                <div className="relative py-4">
                    <input
                        type="range"
                        min={MIN_INVESTMENT_SAR}
                        max={MAX_INVESTMENT_SAR}
                        step={STEP_SAR}
                        value={investment}
                        onChange={(event) => setInvestment(Number(event.target.value))}
                        className="absolute z-20 h-full w-full cursor-pointer appearance-none opacity-0"
                        aria-label="Investment amount in SAR"
                    />
                    {/* Custom visually enhanced track */}
                    <div className="h-4 w-full overflow-hidden rounded-full bg-slate-800 shadow-inner">
                        <motion.div
                            layout
                            className={`h-full bg-gradient-to-r from-slate-700 to-current ${currentStage.color}`}
                            style={{ width: `${progressPercent}%` }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                    </div>
                    {/* Custom glowing thumb */}
                    <motion.div
                        className={`pointer-events-none absolute top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border-4 border-slate-900 bg-current shadow-lg ${currentStage.color} ${currentStage.glow}`}
                        style={{ left: `calc(${progressPercent}% - 16px)` }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        <div className="h-1.5 w-1.5 rounded-full bg-slate-900" />
                    </motion.div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 pt-4">
                    <Stat label="Baseline Valuation" value={BASELINE_VALUATION_SAR} isCurrency />
                    <Stat label="Implied Post-Money" value={impliedPostMoney} isCurrency active />
                    <Stat
                        label="Upside Potential"
                        value="High"
                        isString
                        icon={<TrendingUp className="h-4 w-4 text-emerald-400" />}
                    />
                </div>
            </div>
        </motion.section >
    );
}

function Stat({ label, value, isCurrency, active, isString, icon }: { label: string; value: number | string; isCurrency?: boolean; active?: boolean, isString?: boolean, icon?: React.ReactNode }) {
    return (
        <div className={`relative overflow-hidden rounded-2xl border p-5 transition-colors duration-300 ${active ? 'border-slate-700 bg-slate-800/80 shadow-inner' : 'border-slate-800/60 bg-slate-900/40'}`}>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
            <div className="mt-2 flex items-center gap-2">
                {icon && icon}
                <p className={`text-lg font-bold ${active ? 'text-white' : 'text-slate-200'}`}>
                    {isString ? value : <AnimatedNumber value={value as number} isCurrency={isCurrency} />}
                </p>
            </div>
        </div>
    );
}
