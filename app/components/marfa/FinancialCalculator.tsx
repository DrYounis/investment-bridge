'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';

interface FinancialMetrics {
    totalStartupCost: number;
    monthlyFixedCost: number;
    monthlyRevenue: number;
    monthlyNetProfit: number;
    breakEvenUnits: number;
    roi: number;
    paybackMonths: number;
    stressTest: {
        survived: boolean;
        message: string;
        metricsAfterStress: any;
    };
}

const FinancialCalculator = () => {
    const [activeTab, setActiveTab] = useState<'inputs' | 'results'>('inputs');

    // --- Inputs State ---
    // Startup Costs
    const [startupCosts, setStartupCosts] = useState({
        rent: 0,
        decor: 0,
        equipment: 0,
        licenses: 0,
        marketing: 0,
        other: 0
    });

    // Monthly Operating Costs (Fixed)
    const [monthlyCosts, setMonthlyCosts] = useState({
        salaries: 0,
        utilities: 0,
        rentMonthly: 0, // Amortized or actual monthly payment
        marketingMonthly: 0,
        otherMonthly: 0
    });

    // Unit Economics
    const [unitEconomics, setUnitEconomics] = useState({
        salePrice: 0,
        costPerUnit: 0, // COGS
        dailyVolume: 0,
        workingDays: 26
    });

    const [metrics, setMetrics] = useState<FinancialMetrics | null>(null);

    const calculate = () => {
        // 1. Totals
        const totalStartup = Object.values(startupCosts).reduce((a, b) => a + Number(b), 0);
        const totalMonthlyFixed = Object.values(monthlyCosts).reduce((a, b) => a + Number(b), 0);

        // 2. Unit Economics
        const marginPerUnit = unitEconomics.salePrice - unitEconomics.costPerUnit;
        const monthlyUnits = unitEconomics.dailyVolume * unitEconomics.workingDays;

        // 3. Revenue & Profit
        const monthlyRevenue = monthlyUnits * unitEconomics.salePrice;
        const totalCOGS = monthlyUnits * unitEconomics.costPerUnit;
        const monthlyNetProfit = monthlyRevenue - totalCOGS - totalMonthlyFixed;

        // 4. Break-even (Fixed Costs / Margin per Unit)
        const breakEvenUnits = marginPerUnit > 0 ? Math.ceil(totalMonthlyFixed / marginPerUnit) : 0;

        // 5. ROI (Annual Profit / Total Investment) * 100
        const annualProfit = monthlyNetProfit * 12;
        const roi = totalStartup > 0 ? (annualProfit / totalStartup) * 100 : 0;

        // 6. Payback Period (Total Investment / Monthly Profit)
        const paybackMonths = monthlyNetProfit > 0 ? Math.ceil(totalStartup / monthlyNetProfit) : 999;

        // 7. Stress Test (Scenario: Sales drop 20%)
        const stressedVolume = unitEconomics.dailyVolume * 0.8;
        const stressedRevenue = (stressedVolume * unitEconomics.workingDays) * unitEconomics.salePrice;
        const stressedCOGS = (stressedVolume * unitEconomics.workingDays) * unitEconomics.costPerUnit;
        const stressedProfit = stressedRevenue - stressedCOGS - totalMonthlyFixed;

        let stressMsg = "";
        if (stressedProfit > 0) {
            stressMsg = "✅ مشروعك قوي ويتحمل تقلبات السوق (حتى لو انخفضت المبيعات 20% ستظل رابحاً).";
        } else {
            stressMsg = "⚠️ مشروعك حساس للمخاطر. انخفاض المبيعات بنسبة 20% قد يدخلك في الخسارة. حاول تقليل التكاليف الثابتة.";
        }

        setMetrics({
            totalStartupCost: totalStartup,
            monthlyFixedCost: totalMonthlyFixed,
            monthlyRevenue,
            monthlyNetProfit,
            breakEvenUnits,
            roi,
            paybackMonths,
            stressTest: {
                survived: stressedProfit > 0,
                message: stressMsg,
                metricsAfterStress: { stressedProfit }
            }
        });

        setActiveTab('results');
    };

    const InputRow = ({ label, val, setter, field }: any) => (
        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <label className="text-gray-600 text-sm font-medium">{label}</label>
            <div className="flex items-center gap-2">
                <input
                    type="number"
                    value={val[field] || ''}
                    onChange={(e) => setter({ ...val, [field]: Number(e.target.value) })}
                    className="w-24 text-start bg-transparent outline-none font-bold text-gray-800"
                    placeholder="0"
                />
                <span className="text-gray-400 text-xs">ر.س</span>
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8" dir="rtl">

            {/* Tabs */}
            <div className="flex justify-center mb-8">
                <div className="bg-gray-100 p-1 rounded-2xl flex">
                    <button
                        onClick={() => setActiveTab('inputs')}
                        className={`px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'inputs' ? 'bg-white shadow-md text-blue-900' : 'text-gray-500'}`}
                    >
                        1. إدخال الأرقام
                    </button>
                    <button
                        onClick={() => metrics && setActiveTab('results')}
                        disabled={!metrics}
                        className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${activeTab === 'results' ? 'bg-white shadow-md text-green-700' : 'text-gray-400'}`}
                    >
                        2. نتائج التحليل
                        {metrics && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>}
                    </button>
                </div>
            </div>

            {activeTab === 'inputs' ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-2 gap-8">

                    {/* Startup Costs Card */}
                    <div className="bg-white p-6 rounded-3xl border border-blue-100 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="bg-blue-100 p-2 rounded-lg">🚀</span> تكاليف التأسيس (مرة واحدة)
                        </h3>
                        <div className="space-y-3">
                            <InputRow label="تجهيز المكان والديكور" val={startupCosts} setter={setStartupCosts} field="decor" />
                            <InputRow label="المعدات والأجهزة" val={startupCosts} setter={setStartupCosts} field="equipment" />
                            <InputRow label="رسوم حكومية وتراخيص" val={startupCosts} setter={setStartupCosts} field="licenses" />
                            <InputRow label="تسويق الانطلاق" val={startupCosts} setter={setStartupCosts} field="marketing" />
                            <InputRow label="أخرى (احتياطي)" val={startupCosts} setter={setStartupCosts} field="other" />
                        </div>
                        <div className="mt-4 pt-4 border-t flex justify-between font-bold text-blue-900">
                            <span>إجمالي رأس المال المطلوب:</span>
                            <span>{Object.values(startupCosts).reduce((a, b) => a + Number(b), 0).toLocaleString()} ر.س</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Monthly Operation */}
                        <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="bg-purple-100 p-2 rounded-lg">🗓️</span> المصاريف الشهرية التشغيلية
                            </h3>
                            <div className="space-y-3">
                                <InputRow label="إيجار شهري" val={monthlyCosts} setter={setMonthlyCosts} field="rentMonthly" />
                                <InputRow label="رواتب الموظفين" val={monthlyCosts} setter={setMonthlyCosts} field="salaries" />
                                <InputRow label="فواتير وخدمات" val={monthlyCosts} setter={setMonthlyCosts} field="utilities" />
                                <InputRow label="تسويق شهري" val={monthlyCosts} setter={setMonthlyCosts} field="marketingMonthly" />
                            </div>
                        </div>

                        {/* Sales Assumptions */}
                        <div className="bg-white p-6 rounded-3xl border border-green-100 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="bg-green-100 p-2 rounded-lg">📦</span> الافتراضات البيعية (للمنتج الواحد)
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center bg-green-50/50 p-3 rounded-lg border border-green-100">
                                    <label className="text-gray-700 text-sm font-medium">سعر بيع المنتج</label>
                                    <input type="number" value={unitEconomics.salePrice || ''} onChange={e => setUnitEconomics({ ...unitEconomics, salePrice: Number(e.target.value) })} className="w-20 text-start bg-transparent font-bold outline-none" placeholder="0" />
                                </div>
                                <div className="flex justify-between items-center bg-red-50/50 p-3 rounded-lg border border-red-100">
                                    <label className="text-gray-700 text-sm font-medium">تكلفة المنتج عليك (COGS)</label>
                                    <input type="number" value={unitEconomics.costPerUnit || ''} onChange={e => setUnitEconomics({ ...unitEconomics, costPerUnit: Number(e.target.value) })} className="w-20 text-start bg-transparent font-bold outline-none" placeholder="0" />
                                </div>
                                <div className="flex justify-between items-center bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                                    <label className="text-gray-700 text-sm font-medium">عدد المبيعات المتوقعة (يومياً)</label>
                                    <input type="number" value={unitEconomics.dailyVolume || ''} onChange={e => setUnitEconomics({ ...unitEconomics, dailyVolume: Number(e.target.value) })} className="w-20 text-start bg-transparent font-bold outline-none" placeholder="0" />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={calculate}
                            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition shadow-lg transform hover:-translate-y-1"
                        >
                            💡 احسب جدوى مشروعي
                        </button>
                    </div>
                </motion.div>
            ) : metrics && ( // RESULTS VIEW
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">

                    {/* Top Cards Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <MetricCard
                            title="رأس المال المطلوب"
                            value={metrics.totalStartupCost.toLocaleString()}
                            unit="ريال"
                            icon="💰"
                            bg="bg-blue-50"
                        />
                        <MetricCard
                            title="صافي الربح الشهري"
                            value={metrics.monthlyNetProfit.toLocaleString()}
                            unit="ريال"
                            icon={metrics.monthlyNetProfit > 0 ? "📈" : "📉"}
                            bg={metrics.monthlyNetProfit > 0 ? "bg-green-50" : "bg-red-50"}
                            textColor={metrics.monthlyNetProfit > 0 ? "text-green-700" : "text-red-700"}
                        />
                        <MetricCard
                            title="العائد السنوي (ROI)"
                            value={metrics.roi.toFixed(1)}
                            unit="%"
                            icon="🔄"
                            bg="bg-purple-50"
                        />
                        <MetricCard
                            title="استرداد رأس المال"
                            value={metrics.paybackMonths < 900 ? metrics.paybackMonths : "∞"}
                            unit="شهر"
                            icon="⏳"
                            bg="bg-amber-50"
                        />
                    </div>

                    {/* Break Even Visualization */}
                    <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-lg relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition"></div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">نقطة التعادل (Break-even Point)</h3>
                        <p className="text-gray-500 mb-6">لكي تغطي مصاريفك الشهرية ({metrics.monthlyFixedCost.toLocaleString()} ريال) دون ربح أو خسارة، تحتاج إلى:</p>

                        <div className="flex items-center gap-6">
                            <div className="text-5xl font-extrabold text-blue-600">
                                {metrics.breakEvenUnits} <span className="text-lg font-normal text-gray-400">عميل / منتج شهرياً</span>
                            </div>
                            <div className="h-12 w-px bg-gray-200"></div>
                            <div className="text-start">
                                <div className="text-sm text-gray-500">معدل يومي:</div>
                                <div className="font-bold text-gray-800">{Math.ceil(metrics.breakEvenUnits / unitEconomics.workingDays)} عميل</div>
                            </div>
                        </div>

                        <div className="mt-6 w-full bg-gray-100 h-4 rounded-full overflow-hidden flex">
                            <div className="bg-gray-400 h-full flex items-center justify-center text-[10px] text-white" style={{ width: '40%' }}>التكاليف</div>
                            <div className="bg-green-500 h-full flex items-center justify-center text-[10px] text-white animate-pulse" style={{ width: '60%' }}>منطقة الربح تبدأ هنا</div>
                        </div>
                    </div>

                    {/* Stress Test */}
                    <div className={`p-6 rounded-3xl border-2 ${metrics.stressTest.survived ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <div className="flex items-start gap-4">
                            <div className="text-4xl">{metrics.stressTest.survived ? '🛡️' : '⚠️'}</div>
                            <div>
                                <h4 className={`font-bold text-lg mb-1 ${metrics.stressTest.survived ? 'text-green-800' : 'text-red-800'}`}>اختبار الضغط (Stress Test)</h4>
                                <p className={`text-sm leading-relaxed ${metrics.stressTest.survived ? 'text-green-700' : 'text-red-700'}`}>
                                    {metrics.stressTest.message}
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setActiveTab('inputs')}
                        className="w-full text-center text-gray-400 hover:text-gray-600 text-sm mt-4"
                    >
                        🔄 تعديل الأرقام
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default React.memo(FinancialCalculator);

interface MetricCardProps {
    title: string;
    value: string | number;
    unit: string;
    icon: string;
    bg: string;
    textColor?: string;
}

const MetricCard = React.memo(({ title, value, unit, icon, bg, textColor = "text-gray-900" }: MetricCardProps) => {
    return (
        <div className={`${bg} p-4 rounded-2xl`}>
            <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-gray-500 font-bold">{title}</span>
                <span className="text-xl">{icon}</span>
            </div>
            <div className={`text-2xl font-bold ${textColor}`}>
                {value} <span className="text-xs font-normal text-gray-500">{unit}</span>
            </div>
        </div>
    );
});
