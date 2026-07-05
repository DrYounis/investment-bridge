'use client';

import Link from 'next/link';
import MVPBuilder from '../../../components/marfa/MVPBuilder';
import SubscriptionGuard from '../../../components/SubscriptionGuard';

export default function MVPPage() {
    return (
        <div className="min-h-screen bg-slate-50 pt-32" dir="rtl">
            {/* Breadcrumb / Local Nav */}
            <div className="max-w-7xl mx-auto px-6 mb-8">
                <Link href="/marfa/lab" className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-2">
                    <span>⬅</span> العودة للمختبر
                </Link>
            </div>

            <div className="max-w-4xl mx-auto px-4 mb-4 text-center">
                <div className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold mb-3">قاعدة 80/20</div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">ما هو الـ MVP الذي ستبدأ به؟</h1>
                <p className="text-gray-600">
                    لا تبنِ كل شيء دفعة واحدة. حدد المزايا الأهم والأقل تكلفة لإطلاق المشروع بأسرع وقت.
                </p>
            </div>

            <SubscriptionGuard featureName="بناء النموذج الأولي (MVP)" fallback={
                <div className="max-w-4xl mx-auto px-4 mt-8">
                    <div className="bg-slate-900 rounded-3xl p-12 text-center text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="text-6xl mb-6">🏗️</div>
                            <h2 className="text-3xl font-bold mb-4">منشئ الـ MVP (Exclusive)</h2>
                            <p className="text-slate-300 mb-8 max-w-lg mx-auto">
                                خطط لمزايا منتجك الأولية باستخدام قاعدة 80/20. هذه الأداة تساعدك على التركيز على ما يهم العميل فقط.
                            </p>
                            <Link href="/dashboard/entrepreneur" className="px-8 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-gray-100 transition mb-6 inline-block">
                                ترقية الحساب
                            </Link>
                            <p className="text-sm text-slate-400">
                                لست مستعداً للدفع؟{' '}
                                <Link href="/marfa/assessment" className="text-blue-300 hover:text-white underline transition">
                                    جرب أداة تحليل الفكرة (SWOT) مجاناً أولاً
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            }>
                <MVPBuilder />
            </SubscriptionGuard>
        </div>
    );
}
