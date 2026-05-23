'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, Building, Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { scheduleMeeting } from '../../actions/meetings';

export default function InvestorMeetingForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const result = await scheduleMeeting(formData);

        if (result.success) {
            setIsSuccess(true);
            (e.target as HTMLFormElement).reset();
        } else {
            setError(result.error || 'حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.');
        }
        setIsSubmitting(false);
    }

    return (
        <div className="relative mt-20" id="meeting-form">
            <AnimatePresence mode="wait">
                {!isSuccess ? (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-gold/20 bg-white/80 p-8 shadow-xl backdrop-blur-xl sm:p-12"
                    >
                        <div className="mb-8 text-center">
                            <h2 className="text-3xl font-black text-deep-navy">جدولة اجتماع مستثمر</h2>
                            <p className="mt-2 text-deep-navy/60">اترك بياناتك وسنتواصل معك لتنسيق الاجتماع</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-bold text-deep-navy/80">
                                        <User size={16} className="text-gold" />
                                        الاسم الكامل
                                    </label>
                                    <input
                                        required
                                        name="name"
                                        type="text"
                                        placeholder="مثلاً: محمد العتيبي"
                                        className="w-full rounded-xl border border-gold/20 bg-white p-3.5 text-deep-navy placeholder-deep-navy/40 outline-none transition focus:border-gold/50 focus:shadow-lg focus:shadow-gold/5"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-bold text-deep-navy/80">
                                        <Building size={16} className="text-gold" />
                                        الجهة / الشركة
                                    </label>
                                    <input
                                        required
                                        name="company"
                                        type="text"
                                        placeholder="مثلاً: صندوق استثماري"
                                        className="w-full rounded-xl border border-gold/20 bg-white p-3.5 text-deep-navy placeholder-deep-navy/40 outline-none transition focus:border-gold/50 focus:shadow-lg focus:shadow-gold/5"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-deep-navy/80">
                                    <Mail size={16} className="text-gold" />
                                    البريد الإلكتروني
                                </label>
                                <input
                                    required
                                    name="email"
                                    type="email"
                                    placeholder="your@email.com"
                                    className="w-full rounded-xl border border-gold/20 bg-white p-3.5 text-deep-navy placeholder-deep-navy/40 outline-none transition focus:border-gold/50 focus:shadow-lg focus:shadow-gold/5"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-deep-navy/80">
                                    <Calendar size={16} className="text-gold" />
                                    الوقت المفضل للاجتماع
                                </label>
                                <input
                                    required
                                    name="preferredTime"
                                    type="text"
                                    placeholder="مثلاً: الأسبوع القادم - الفترة المسائية"
                                    className="w-full rounded-xl border border-gold/20 bg-white p-3.5 text-deep-navy placeholder-deep-navy/40 outline-none transition focus:border-gold/50 focus:shadow-lg focus:shadow-gold/5"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-deep-navy/80">
                                    <MessageSquare size={16} className="text-gold" />
                                    رسالة إضافية أو مجالات الاهتمام
                                </label>
                                <textarea
                                    name="message"
                                    rows={4}
                                    placeholder="كيف يمكننا مساعدتك؟"
                                    className="w-full resize-none rounded-xl border border-gold/20 bg-white p-3.5 text-deep-navy placeholder-deep-navy/40 outline-none transition focus:border-gold/50 focus:shadow-lg focus:shadow-gold/5"
                                />
                            </div>

                            {error && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center text-sm font-bold text-red-500"
                                >
                                    {error}
                                </motion.p>
                            )}

                            <button
                                disabled={isSubmitting}
                                type="submit"
                                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-gold to-gold-dark px-8 py-4 text-lg font-black text-white shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full"
                                        />
                                        جاري الإرسال...
                                    </span>
                                ) : (
                                    <>
                                        <span>إرسال الطلب</span>
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
                        className="mx-auto max-w-xl rounded-3xl border border-gold/20 bg-gold/5 p-12 text-center"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gold/20 text-gold"
                        >
                            <CheckCircle2 size={40} />
                        </motion.div>
                        <h2 className="text-3xl font-black text-deep-navy">تم استلام طلبك!</h2>
                        <p className="mt-4 text-deep-navy/60">
                            شكراً لاهتمامك. تم إرسال بياناتك بنجاح وسنتواصل معك عبر البريد الإلكتروني في أقرب وقت ممكن.
                        </p>
                        <button
                            onClick={() => setIsSuccess(false)}
                            className="mt-8 text-sm font-bold text-gold underline decoration-gold/30 underline-offset-4 transition hover:text-gold-dark hover:decoration-gold-dark"
                        >
                            إرسال طلب آخر
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
