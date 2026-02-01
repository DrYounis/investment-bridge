'use client';

import React from 'react';
import Link from 'next/link';
import MVPBuilder from '../../../components/marfa/MVPBuilder';

export default function MVPPage() {
    return (
        <div className="min-h-screen bg-slate-50" dir="rtl">
            <nav className="bg-white border-b border-gray-100 px-6 py-4 mb-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="text-xl font-bold text-gray-800">هندسة المنتج الأولي <span className="text-blue-600">.</span></div>
                    <Link href="/marfa/lab" className="text-sm text-gray-500 hover:text-blue-600">
                        العودة للمختبر ⬅
                    </Link>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 mb-4 text-center">
                <div className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold mb-3">قاعدة 80/20</div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">ما هو الـ MVP الذي ستبدأ به؟</h1>
                <p className="text-gray-600">
                    لا تبنِ كل شيء دفعة واحدة. حدد المزايا الأهم والأقل تكلفة لإطلاق المشروع بأسرع وقت.
                </p>
            </div>

            <MVPBuilder />
        </div>
    );
}
