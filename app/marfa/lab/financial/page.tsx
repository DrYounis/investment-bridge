'use client';

import React from 'react';
import Link from 'next/link';
import FinancialCalculator from '../../../components/marfa/FinancialCalculator';

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

            <FinancialCalculator />
        </div>
    );
}
