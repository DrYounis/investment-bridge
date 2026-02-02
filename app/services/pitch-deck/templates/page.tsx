'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import SubscriptionGuard from '../../../components/SubscriptionGuard';

// Mock Data for Templates
const TEMPLATES = [
    { id: 1, title: 'Investor Pitch Deck Basic', category: 'Investor', color: 'bg-blue-500' },
    { id: 2, title: 'Series A Funding Deck', category: 'Investor', color: 'bg-indigo-600' },
    { id: 3, title: 'Seed Round Minimalist', category: 'Investor', color: 'bg-slate-800' },
    { id: 4, title: 'SaaS Sales Deck', category: 'Sales', color: 'bg-green-500' },
    { id: 5, title: 'Enterprise B2B Proposal', category: 'Sales', color: 'bg-sky-600' },
    { id: 6, title: 'Product Launch Keynote', category: 'Marketing', color: 'bg-orange-500' },
    { id: 7, title: 'Brand Strategy Kit', category: 'Marketing', color: 'bg-rose-500' },
    { id: 8, title: 'Agency Portfolio', category: 'Agency', color: 'bg-purple-600' },
    { id: 9, title: 'Creative Director Folio', category: 'Agency', color: 'bg-fuchsia-500' },
    { id: 10, title: 'Monthly Report Deck', category: 'Business', color: 'bg-gray-600' },
    { id: 11, title: 'Quarterly Business Review', category: 'Business', color: 'bg-slate-700' },
    { id: 12, title: 'Team All-Hands Meeting', category: 'Internal', color: 'bg-yellow-500' },
    { id: 13, title: 'New Hire Onboarding', category: 'Internal', color: 'bg-teal-500' },
    { id: 14, title: 'Partnership Proposal', category: 'Partnership', color: 'bg-cyan-600' },
    { id: 15, title: 'Event Sponsorship Deck', category: 'Partnership', color: 'bg-pink-600' },
    { id: 16, title: 'Web3 / Crypto Pitch', category: 'Investor', color: 'bg-violet-600' },
    { id: 17, title: 'Medical / HealthTech', category: 'Investor', color: 'bg-emerald-500' },
    { id: 18, title: 'EduTech Classroom', category: 'Education', color: 'bg-amber-400' },
    { id: 19, title: 'Thesis Defense', category: 'Education', color: 'bg-zinc-600' },
    { id: 20, title: 'Non-Profit Grant Request', category: 'Non-Profit', color: 'bg-lime-600' },
    { id: 21, title: 'Real Estate Portfolio', category: 'Sales', color: 'bg-stone-600' },
    { id: 22, title: 'App Demo Showcase', category: 'Product', color: 'bg-blue-400' },
];

const CATEGORIES = ['All', 'Investor', 'Sales', 'Marketing', 'Agency', 'Business', 'Internal'];

export default function TemplatesGalleryPage() {
    const [filter, setFilter] = useState('All');

    const filteredTemplates = filter === 'All'
        ? TEMPLATES
        : TEMPLATES.filter(t => t.category === filter);

    return (
        <div className="min-h-screen bg-slate-50" dir="rtl">
            <nav className="bg-white border-b border-gray-100 px-6 py-4 mb-8 sticky top-0 z-40 bg-white/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="text-xl font-bold text-gray-800">مكتبة القوالب <span className="text-blue-600">Pro</span></div>
                    <Link href="/services/pitch-deck" className="text-sm text-gray-500 hover:text-blue-600">
                        العودة للرئيسية ⬅
                    </Link>
                </div>
            </nav>

            <SubscriptionGuard featureName="مكتبة القوالب الاحترافية" fallback={
                <div className="max-w-4xl mx-auto px-4 mt-20 text-center">
                    <div className="bg-slate-900 rounded-3xl p-16 text-center text-white relative overflow-hidden shadow-2xl">
                        <div className="relative z-10">
                            <div className="text-6xl mb-6">🎨</div>
                            <h2 className="text-4xl font-bold mb-6">مكتبة +20 قالب احترافي (Pro)</h2>
                            <p className="text-slate-300 mb-10 text-xl max-w-2xl mx-auto leading-relaxed">
                                احصل على وصول فوري لأكثر من 20 قالب مصمم بعناية فائقة لتغطية جميع احتياجاتك:
                                عروض استثمارية، مبيعات، تقارير، والمزيد.
                            </p>
                            <div className="flex justify-center gap-4">
                                <Link href="/dashboard/entrepreneur" className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold hover:scale-105 transition shadow-lg shadow-blue-500/30">
                                    ترقية الحساب الآن
                                </Link>
                                <Link href="/services/pitch-deck" className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition">
                                    تصفح باقي المميزات
                                </Link>
                            </div>
                        </div>

                        {/* Decorative Background */}
                        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20"></div>
                        <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-500 rounded-full blur-[100px] opacity-20"></div>
                    </div>
                </div>
            }>
                <div className="max-w-7xl mx-auto px-6 pb-20">

                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-black text-slate-900 mb-4">اختر القالب المناسب لقصتك</h1>
                        <p className="text-xl text-gray-500">أكثر من 20 قالب جاهز للاستخدام، مصممة بواسطة خبراء الاستثمار.</p>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap justify-center gap-2 mb-12">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${filter === cat
                                        ? 'bg-slate-900 text-white shadow-lg scale-105'
                                        : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
                                    }`}
                            >
                                {cat === 'All' ? 'الكل' : cat}
                            </button>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredTemplates.map((template) => (
                            <motion.div
                                key={template.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="group cursor-pointer"
                            >
                                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:-translate-y-2">
                                    {/* Thumbnail Placeholder */}
                                    <div className={`aspect-[16/9] ${template.color} relative flex items-center justify-center overflow-hidden`}>
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition"></div>
                                        <span className="text-6xl opacity-50 select-none">📊</span>

                                        {/* Overlay Button */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 bg-black/20 backdrop-blur-sm">
                                            <button className="px-6 py-2 bg-white text-slate-900 rounded-lg font-bold shadow-lg transform scale-90 group-hover:scale-100 transition">
                                                استخدام القالب
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition">{template.title}</h3>
                                            <span className="text-xs font-bold px-2 py-1 bg-gray-100 text-gray-500 rounded">{template.category}</span>
                                        </div>
                                        <p className="text-sm text-gray-400">15 شريحة • متوافق مع PowerPoint</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </SubscriptionGuard>
        </div>
    );
}
