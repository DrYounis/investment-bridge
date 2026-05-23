'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Lightbulb,
    User,
    Building,
    Mail,
    Target,
    Globe,
    Send,
    CheckCircle2,
    Sparkles,
    AlertTriangle,
    TrendingUp,
    Users,
} from 'lucide-react';
import { submitIdea } from '../../actions/marfa-ideas';

const validationCriteria = [
    {
        icon: <AlertTriangle className="w-5 h-5" />,
        label: 'Problem Validation',
        desc: 'Does this idea solve a real, painful problem?',
    },
    {
        icon: <TrendingUp className="w-5 h-5" />,
        label: 'Market Potential',
        desc: 'Is there a sizable addressable market?',
    },
    {
        icon: <Users className="w-5 h-5" />,
        label: 'Target Audience',
        desc: 'Who exactly will pay for this solution?',
    },
];

export default function IdeaValidator() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const result = await submitIdea(formData);

        if (result.success) {
            setIsSuccess(true);
            (e.target as HTMLFormElement).reset();
        } else {
            setError(result.error || 'Something went wrong. Please try again.');
        }
        setIsSubmitting(false);
    }

    return (
        <section className="relative" id="idea-validator">
            <AnimatePresence mode="wait">
                {!isSuccess ? (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl sm:p-12"
                    >
                        {/* Header */}
                        <div className="mb-10 text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-500/20"
                            >
                                <Lightbulb className="h-8 w-8 text-amber-400" />
                            </motion.div>
                            <h2 className="text-3xl font-black text-white">
                                Validate Your{' '}
                                <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                                    Idea
                                </span>
                            </h2>
                            <p className="mt-2 text-slate-400">
                                Submit your startup idea for initial validation by our team of experts and investors.
                            </p>
                        </div>

                        {/* Validation Criteria Pills */}
                        <div className="mb-8 flex flex-wrap justify-center gap-3">
                            {validationCriteria.map((criterion, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + idx * 0.1 }}
                                    className="group relative"
                                >
                                    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:border-amber-500/30 hover:bg-white/10">
                                        <span className="text-amber-400/80">{criterion.icon}</span>
                                        <span className="font-medium">{criterion.label}</span>
                                    </div>
                                    <div className="pointer-events-none absolute -bottom-8 left-1/2 z-10 w-48 -translate-x-1/2 rounded-lg bg-slate-800 px-3 py-2 text-center text-xs text-slate-300 opacity-0 shadow-lg transition group-hover:opacity-100">
                                        {criterion.desc}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Row: Name + Company */}
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-300">
                                        <User size={16} className="text-amber-400" />
                                        Full Name
                                    </label>
                                    <input
                                        required
                                        name="name"
                                        type="text"
                                        placeholder="e.g. Ahmed Al-Otaibi"
                                        className="w-full rounded-xl border border-white/10 bg-white/10 p-3.5 text-white placeholder-slate-500 outline-none transition focus:border-amber-500/50 focus:bg-white/15"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-300">
                                        <Building size={16} className="text-amber-400" />
                                        Company / Organization
                                    </label>
                                    <input
                                        required
                                        name="company"
                                        type="text"
                                        placeholder="e.g. Tech Ventures"
                                        className="w-full rounded-xl border border-white/10 bg-white/10 p-3.5 text-white placeholder-slate-500 outline-none transition focus:border-amber-500/50 focus:bg-white/15"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-300">
                                    <Mail size={16} className="text-amber-400" />
                                    Email Address
                                </label>
                                <input
                                    required
                                    name="email"
                                    type="email"
                                    placeholder="your@email.com"
                                    className="w-full rounded-xl border border-white/10 bg-white/10 p-3.5 text-white placeholder-slate-500 outline-none transition focus:border-amber-500/50 focus:bg-white/15"
                                />
                            </div>

                            {/* Idea Title */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-300">
                                    <Sparkles size={16} className="text-amber-400" />
                                    Idea Title
                                </label>
                                <input
                                    required
                                    name="ideaTitle"
                                    type="text"
                                    placeholder="e.g. AI-Powered Farm Management Platform"
                                    className="w-full rounded-xl border border-white/10 bg-white/10 p-3.5 text-white placeholder-slate-500 outline-none transition focus:border-amber-500/50 focus:bg-white/15"
                                />
                            </div>

                            {/* Idea Description */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-300">
                                    <Lightbulb size={16} className="text-amber-400" />
                                    Describe Your Idea
                                </label>
                                <textarea
                                    required
                                    name="ideaDescription"
                                    rows={4}
                                    placeholder="What is your idea? How does it work? What makes it unique?"
                                    className="w-full resize-none rounded-xl border border-white/10 bg-white/10 p-3.5 text-white placeholder-slate-500 outline-none transition focus:border-amber-500/50 focus:bg-white/15"
                                />
                            </div>

                            {/* Row: Problem Solved + Target Market */}
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-300">
                                        <AlertTriangle size={16} className="text-amber-400" />
                                        Problem It Solves
                                    </label>
                                    <textarea
                                        name="problemSolved"
                                        rows={3}
                                        placeholder="What specific problem does this solve? Who experiences it?"
                                        className="w-full resize-none rounded-xl border border-white/10 bg-white/10 p-3.5 text-white placeholder-slate-500 outline-none transition focus:border-amber-500/50 focus:bg-white/15"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-300">
                                        <Globe size={16} className="text-amber-400" />
                                        Target Market
                                    </label>
                                    <textarea
                                        name="targetMarket"
                                        rows={3}
                                        placeholder="Who are your target customers? B2B or B2C? Geographic focus?"
                                        className="w-full resize-none rounded-xl border border-white/10 bg-white/10 p-3.5 text-white placeholder-slate-500 outline-none transition focus:border-amber-500/50 focus:bg-white/15"
                                    />
                                </div>
                            </div>

                            {error && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center text-sm font-bold text-red-400"
                                >
                                    {error}
                                </motion.p>
                            )}

                            <button
                                disabled={isSubmitting}
                                type="submit"
                                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 px-8 py-4 text-lg font-black text-white shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                            className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white"
                                        />
                                        Submitting...
                                    </span>
                                ) : (
                                    <>
                                        <span>Submit Idea for Validation</span>
                                        <Send size={20} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                ) : (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mx-auto max-w-xl rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-12 text-center backdrop-blur-xl"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500"
                        >
                            <CheckCircle2 size={40} />
                        </motion.div>
                        <h2 className="text-3xl font-black text-white">Idea Received! 🚀</h2>
                        <p className="mt-4 text-emerald-100/80">
                            Thank you for submitting your idea. Our team will review it and get back to you
                            within 48 hours with initial feedback and validation insights.
                        </p>
                        <button
                            onClick={() => setIsSuccess(false)}
                            className="mt-8 text-sm font-bold text-slate-400 underline decoration-slate-400/30 underline-offset-4 transition hover:text-white hover:decoration-white"
                        >
                            Submit Another Idea
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
