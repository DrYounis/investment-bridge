"use client";

import { useState } from 'react';
import Link from 'next/link';
import Button from '../../components/ui/Button';

interface Idea {
    id: number;
    sector: string;
    title: string;
    location: string;
    status: string;
}

export default function InvestorDashboard() {
    // حالة افتراضية لمحاكاة مستثمر (معتمد أو غير معتمد)
    const [isApproved, setIsApproved] = useState(false);

    // بيانات تجريبية للأفكار الواردة
    const ideas: Idea[] = [
        { id: 1, sector: 'السياحة', title: 'مخيم فندقي فاخر في جبة', location: 'حائل', status: 'جديد' },
        { id: 2, sector: 'الصحة', title: 'مركز تأهيل ذكي بمساعدة AI', location: 'الرياض', status: 'قيد التقييم' },
        { id: 3, sector: 'التقنية', title: 'منصة تعليمية للبرمجة', location: 'جدة', status: 'جديد' },
        { id: 4, sector: 'التجزئة', title: 'متجر إلكتروني للحرف اليدوية', location: 'الدمام', status: 'جديد' },
        { id: 5, sector: 'الزراعة', title: 'مزرعة عمودية ذكية', location: 'القصيم', status: 'قيد التقييم' },
        { id: 6, sector: 'المطاعم', title: 'سلسلة مطاعم صحية', location: 'الرياض', status: 'جديد' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6" dir="rtl">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-12">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">بوابة المستثمرين المعتمدين</h1>
                        <p className="text-gray-600">استعرض الفرص الاستثمارية الحصرية</p>
                    </div>
                    <Link href="/">
                        <Button variant="outline" size="sm">الرئيسية</Button>
                    </Link>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-4 mb-8">
                    <span className={`px-6 py-3 rounded-full text-sm font-bold shadow-md ${isApproved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {isApproved ? '✓ مستثمر معتمد' : '⏳ حساب قيد المراجعة'}
                    </span>
                    {!isApproved && (
                        <p className="text-sm text-gray-600">
                            يرجى انتظار الموافقة على حسابك لعرض التفاصيل الكاملة
                        </p>
                    )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <div className="text-3xl font-bold text-primary mb-2">{ideas.length}</div>
                        <div className="text-gray-600 text-sm">فرصة استثمارية متاحة</div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <div className="text-3xl font-bold text-secondary mb-2">0</div>
                        <div className="text-gray-600 text-sm">استثماراتك الحالية</div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <div className="text-3xl font-bold text-accent mb-2">0</div>
                        <div className="text-gray-600 text-sm">طلبات قيد المراجعة</div>
                    </div>
                </div>
            </div>

            {/* Ideas Grid */}
            <div className="max-w-7xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">الفرص الاستثمارية المتاحة</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ideas.map((idea) => (
                        <div key={idea.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden relative group hover:shadow-xl transition-shadow">

                            {/* طبقة الحماية - تظهر إذا لم يكن المستثمر معتمداً */}
                            {!isApproved && (
                                <div className="absolute inset-0 z-10 backdrop-blur-sm bg-white/70 flex flex-col items-center justify-center p-6 text-center">
                                    <div className="bg-white rounded-full p-4 shadow-lg mb-4">
                                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">محتوى مغلق</h3>
                                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                                        يجب أن يكون حسابك معتمداً لمشاهدة تفاصيل الفكرة والدراسة الأولية
                                    </p>
                                    <button
                                        onClick={() => setIsApproved(true)}
                                        className="px-6 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all"
                                    >
                                        طلب اعتماد الحساب
                                    </button>
                                </div>
                            )}

                            {/* محتوى الكارت */}
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1.5 rounded-lg">
                                        {idea.sector}
                                    </span>
                                    <span className="text-gray-400 text-xs font-medium">{idea.status}</span>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                                    {idea.title}
                                </h3>

                                <div className="flex items-center text-gray-500 text-sm mb-6">
                                    <svg className="w-4 h-4 ml-1.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                    {idea.location}
                                </div>

                                {/* Placeholder Lines */}
                                <div className="space-y-2.5 mb-6">
                                    <div className="h-2 bg-gray-100 rounded-full"></div>
                                    <div className="h-2 bg-gray-100 rounded-full w-5/6"></div>
                                    <div className="h-2 bg-gray-100 rounded-full w-4/6"></div>
                                </div>

                                <Button
                                    variant="primary"
                                    className="w-full"
                                    disabled={!isApproved}
                                >
                                    عرض التفاصيل الكاملة
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <footer className="max-w-7xl mx-auto mt-20 text-center text-gray-500 text-sm border-t border-gray-200 pt-8">
                <p className="mb-2">🔒 جميع الأفكار المعروضة محمية بموجب اتفاقيات عدم الإفصاح (NDA) الخاصة بالمنصة</p>
                <p className="text-xs text-gray-400">© 2026 Investment Bridge. All rights reserved.</p>
            </footer>
        </div>
    );
}
