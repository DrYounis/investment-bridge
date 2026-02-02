'use client';

import React from 'react';
import Link from 'next/link';
import FeasibilityDashboard from '../../components/marfa/FeasibilityDashboard';

export default function LabPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <nav className="bg-white border-b border-gray-100 px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="text-xl font-bold text-blue-900">مرفأ <span className="text-gray-400 font-normal">| المختبر</span></div>
                    <div className="flex gap-4 text-sm">
                        <Link href="/marfa" className="text-gray-500 hover:text-blue-600">الرئيسية</Link>
                        <span className="text-gray-300">|</span>
                        <span className="text-blue-600 font-bold">لوحة التحكم</span>
                    </div>
                </div>
            </nav>
            <FeasibilityDashboard />
        </div>
    );
}
