'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ValidationPulseProps {
    initialScore: number;
    breakdown: {
        market: number;
        tech: number;
        revenue: number;
        team: number;
        innovation: number;
    };
    feedback: string[];
}

export default function ValidationPulse({ initialScore, breakdown, feedback }: ValidationPulseProps) {
    const [adjustedScore, setAdjustedScore] = useState(initialScore);
    const [costReduction, setCostReduction] = useState(0); // 0% to 30%

    // What-if Logic: If cost reduces, score improves
    useEffect(() => {
        // Simple simulation: Every 5% reduction adds 2 points to score
        const bonus = Math.round(costReduction / 5) * 2;
        setAdjustedScore(Math.min(100, initialScore + bonus));
    }, [costReduction, initialScore]);

    const isPassing = adjustedScore >= 60;

    // Radar Chart helper
    const getRadarPath = (vals: number[]) => {
        // 5 points polygon
        // Simple calculation for 5 axes
        return "50,0 100,38 82,100 18,100 0,38"; // Placeholder for perfect pentagon
        // A real implementation would calculate x,y based on values. 
        // For this prototype, we'll simplify visual representation using bars or a static SVG with scaling.
    };

    return (
        <div className="bg-slate-50 min-h-screen p-4 md:p-8" dir="rtl">

            {/* 1. Hero Result */}
            <div className="max-w-4xl mx-auto mb-12 text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-block"
                >
                    {isPassing ? (
                        <div className="bg-green-100 p-6 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6 shadow-green-200 shadow-xl border-4 border-white">
                            <div className="text-6xl">⚓</div>
                        </div>
                    ) : (
                        <div className="bg-amber-100 p-6 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6 shadow-amber-200 shadow-xl border-4 border-white">
                            <div className="text-6xl">🚧</div>
                        </div>
                    )}
                </motion.div>

                <h1 className="text-4xl font-black text-gray-900 mb-2">
                    {isPassing ? "الإبحار الأخضر (Ready)" : "منطقة الصيانة (Needs Refinement)"}
                </h1>
                <p className="text-xl text-gray-500 max-w-lg mx-auto">
                    {isPassing
                        ? "فكرتك جاهزة للإقلاع! الأرقام تبدو مبشرة للبدء في رحلة الاستثمار."
                        : "فكرة رائعة، لكنها تحتاج لبعض 'الصقل' لتلمع أمام المستثمرين."}
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">

                {/* 2. Radar & Metrics */}
                <motion.div
                    initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                    className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 flex flex-col justify-center items-center"
                >
                    <div className="w-full mb-6 flex justify-between items-center px-4">
                        <h3 className="font-bold text-gray-700">رادار الجدوى 📡</h3>
                        <div className="text-3xl font-black text-blue-600">{adjustedScore}/100</div>
                    </div>

                    {/* Simplified Radar Visual (Stacked Bars for clarity/robustness) */}
                    <div className="w-full space-y-5">
                        <RadarBar label="جاذبية السوق" value={breakdown.market} color="bg-blue-500" />
                        <RadarBar label="القابلية التقنية" value={breakdown.tech} color="bg-purple-500" />
                        <RadarBar label="نموذج العائد" value={breakdown.revenue} color="bg-green-500" />
                        <RadarBar label="تميز الفريق" value={breakdown.team} color="bg-orange-500" />
                        <RadarBar label="الابتكار" value={breakdown.innovation} color="bg-pink-500" />
                    </div>
                </motion.div>

                {/* 3. Helper Cards & Simulator */}
                <div className="space-y-6">

                    {/* Insight Card */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-500"
                    >
                        <h4 className="font-bold text-gray-800 mb-2">💡 بطاقة الفرص</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            بناءً على موقعك في "حائل"، قطاع {breakdown.market > 70 ? 'السياحة البيئية' : 'هذا القطاع'} يشهد نمواً بنسبة 15% سنوياً بدعم من "رؤية 2030". استغل هذه الموجة!
                        </p>
                    </motion.div>

                    {/* Challenge Card */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
                        className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-amber-500"
                    >
                        <h4 className="font-bold text-gray-800 mb-2">⚠️ نقطة الانتباه</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {feedback[0] || "المنافسة السعرية قد تكون التحدي الأكبر. ركز على القيمة المضافة بدلاً من حرق الأسعار."}
                        </p>
                    </motion.div>

                    {/* What-if Simulator */}
                    <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold">✨ محرك "ماذا لو؟"</h4>
                            <span className="text-xs bg-white/20 px-2 py-1 rounded">Simulation</span>
                        </div>

                        <p className="text-sm text-slate-300 mb-6">
                            ماذا لو استطعت تقليل التكاليف التشغيلية؟ كيف ستتأثر الجدوى؟
                        </p>

                        <input
                            type="range" min="0" max="30" step="5"
                            value={costReduction}
                            onChange={(e) => setCostReduction(Number(e.target.value))}
                            className="w-full accent-green-400 mb-2 cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-slate-400 font-mono">
                            <span>الوضع الحالي</span>
                            <span>ضغط مصاريف -15%</span>
                            <span>ضغط -30%</span>
                        </div>

                        {costReduction > 0 && (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 text-sm font-bold text-center"
                            >
                                النتيجة تحسنت بـ +{Math.round(costReduction / 5) * 2} نقطة! 🚀
                            </motion.div>
                        )}
                    </div>

                </div>
            </div>

            {/* 5. Final CTA */}
            <div className="text-center mt-12 pb-12">
                <button
                    onClick={() => window.location.href = isPassing ? '/marfa/lab' : '#refine'}
                    className={`text-lg font-bold py-4 px-12 rounded-2xl shadow-xl transition transform hover:scale-105
                    ${isPassing
                            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'
                            : 'bg-white text-gray-800 border-2 border-gray-200 hover:border-gray-800'
                        }`}
                >
                    {isPassing ? "انتقل لمختبر الجدوى (بناء الملف) ⬅" : "تعديل المعطيات لإعادة الفحص ↻"}
                </button>
            </div>

        </div>
    );
}

const RadarBar = ({ label, value, color }: any) => (
    <div className="flex items-center gap-4">
        <span className="w-24 text-sm font-bold text-gray-500 text-right">{label}</span>
        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
                initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 1, ease: 'easeOut' }}
                className={`h-full rounded-full ${color}`}
            ></motion.div>
        </div>
        <span className="w-8 text-sm font-bold text-gray-800">{value}</span>
    </div>
);
