'use client';

import React from 'react';
import Link from 'next/link';
import FinancialCalculator from '../../../components/marfa/FinancialCalculator';
import SubscriptionGuard from '../../../components/SubscriptionGuard';

export default function FinancialPillarPage() {
    return (
        <div className="min-h-screen bg-slate-50" dir="rtl">
            <nav className="bg-white border-b border-gray-100 px-6 py-4 mb-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="text-xl font-bold text-gray-800">التدقيق المالي <span className="text-blue-600">.</span></div>
                    <Link href="/marfa/lab" className="text-sm text-gray-500 hover:text-blue-600">
                        العودة للمختبر ⬅
                    </Link>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">حاسبة الجدوى الذكية</h1>
                <p className="text-gray-600">
                    أدخل تقديراتك الأولية وسنقوم نحن بحساب مؤشرات الأداء الرئيسية (ROI, Break-even) للتأكد من ربحية المشروع.
                </p>
            </div>

            <SubscriptionGuard featureName="التدقيق المالي" fallback={
                <div className="max-w-4xl mx-auto px-4 mt-8">
                    <div className="bg-slate-900 rounded-3xl p-12 text-center text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="text-6xl mb-6">💰</div>
                            <h2 className="text-3xl font-bold mb-4">حاسبة الجدوى المالية (Pro Only)</h2>
                            <p className="text-slate-300 mb-8 max-w-lg mx-auto">
                                احصل على تحليل مالي دقيق لمشروعك، يشمل حساب العائد على الاستثمار (ROI) ونقطة التعادل، مع ميزة التصدير.
                            </p>
                            <Link href="/dashboard/entrepreneur" className="px-8 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-gray-100 transition">
                                ترقية الحساب
                            </Link>
                        </div>
                    </div>
                </div>
            }>
                <FinancialCalculator />
            </SubscriptionGuard>
        </div>
    );
}
