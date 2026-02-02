'use client';

import React from 'react';
import Link from 'next/link';
import InvestorDashboard from '../../components/marfa/InvestorDashboard';

export default function InvestorPage() {
    return (
        <div className="min-h-screen bg-slate-50 relative" dir="rtl">
            <nav className="bg-white border-b border-gray-100 px-6 py-4 mb-4 z-40 relative">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="text-xl font-bold text-gray-800">مرفأ <span className="text-blue-600">.</span> <span className="text-gray-400 font-normal">| المستثمرين</span></div>
                    <Link href="/marfa" className="text-sm text-gray-500 hover:text-blue-600">
                        العودة للرئيسية ⬅
                    </Link>
                </div>
            </nav>

            <InvestorDashboard />
        </div>
    );
}
