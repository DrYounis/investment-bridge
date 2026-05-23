'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    User,
    Building,
    Mail,
    MessageSquare,
    Send,
    CheckCircle2,
    Clock,
} from 'lucide-react';
import { submitMeetingRequest } from '../../actions/marfa-meetings';

export default function MeetingScheduler() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const result = await submitMeetingRequest(formData);

        if (result.success) {
            setIsSuccess(true);
            (e.target as HTMLFormElement).reset();
        } else {
            setError(result.error || 'Something went wrong. Please try again.');
        }
        setIsSubmitting(false);
    }

    return (
        <section className="relative" id="meeting-scheduler">
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
                                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400/20 to-indigo-500/20"
                            >
                                <Calendar className="h-8 w-8 text-blue-400" />
                            </motion.div>
                            <h2 className="text-3xl font-black text-white">
                                Schedule a{' '}
                                <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                                    Meeting
                                </span>
                            </h2>
                            <p className="mt-2 text-slate-400">
                                Book a one-on-one session with our investment team to discuss your project.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Row: Name + Company */}
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-300">
                                        <User size={16} className="text-blue-400" />
                                        Full Name
                                    </label>
                                    <input
                                        required
                                        name="name"
                                        type="text"
                                        placeholder="e.g. Ahmed Al-Otaibi"
                                        className="w-full rounded-xl border border-white/10 bg-white/10 p-3.5 text-white placeholder-slate-500 outline-none transition focus:border-blue-500/50 focus:bg-white/15"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-300">
                                        <Building size={16} className="text-blue-400" />
                                        Company / Organization
                                    </label>
                                    <input
                                        required
                                        name="company"
                                        type="text"
                                        placeholder="e.g. Investment Fund"
                                        className="w-full rounded-xl border border-white/10 bg-white/10 p-3.5 text-white placeholder-slate-500 outline-none transition focus:border-blue-500/50 focus:bg-white/15"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-300">
                                    <Mail size={16} className="text-blue-400" />
                                    Email Address
                                </label>
                                <input
                                    required
                                    name="email"
                                    type="email"
                                    placeholder="your@email.com"
                                    className="w-full rounded-xl border border-white/10 bg-white/10 p-3.5 text-white placeholder-slate-500 outline-none transition focus:border-blue-500/50 focus:bg-white/15"
                                />
                            </div>

                            {/* Row: Preferred Date + Time */}
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-300">
                                        <Calendar size={16} className="text-blue-400" />
                                        Preferred Date
                                    </label>
                                    <input
                                        required
                                        name="preferredDate"
                                        type="date"
                                        className="w-full rounded-xl border border-white/10 bg-white/10 p-3.5 text-white outline-none transition focus:border-blue-500/50 focus:bg-white/15 [color-scheme:dark]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-300">
                                        <Clock size={16} className="text-blue-400" />
                                        Preferred Time
                                    </label>
                                    <input
                                        required
                                        name="preferredTime"
                                        type="time"
                                        className="w-full rounded-xl border border-white/10 bg-white/10 p-3.5 text-white outline-none transition focus:border-blue-500/50 focus:bg-white/15 [color-scheme:dark]"
                                    />
                                </div>
                            </div>

                            {/* Message */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-300">
                                    <MessageSquare size={16} className="text-blue-400" />
                                    Additional Message
                                </label>
                                <textarea
                                    name="message"
                                    rows={4}
                                    placeholder="Tell us about your project, funding needs, or any questions you have..."
                                    className="w-full resize-none rounded-xl border border-white/10 bg-white/10 p-3.5 text-white placeholder-slate-500 outline-none transition focus:border-blue-500/50 focus:bg-white/15"
                                />
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
                                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-4 text-lg font-black text-white shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
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
                                        <span>Schedule Meeting</span>
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
                        <h2 className="text-3xl font-black text-white">Meeting Request Sent! 🎉</h2>
                        <p className="mt-4 text-emerald-100/80">
                            Thank you for your interest. We&apos;ve received your meeting request and will
                            confirm the schedule via email within 24 hours.
                        </p>
                        <button
                            onClick={() => setIsSuccess(false)}
                            className="mt-8 text-sm font-bold text-slate-400 underline decoration-slate-400/30 underline-offset-4 transition hover:text-white hover:decoration-white"
                        >
                            Schedule Another Meeting
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
