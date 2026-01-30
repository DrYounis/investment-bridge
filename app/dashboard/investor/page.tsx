"use client";

import { useEffect, useState } from 'react';
import Card from '../../components/ui/Card';
import InvestorWelcomeModal from '../../components/InvestorWelcomeModal';

export default function InvestorDashboard() {
    const [showWelcome, setShowWelcome] = useState(false);

    useEffect(() => {
        // Check if user has seen the welcome modal
        const hasSeenWelcome = localStorage.getItem('hasSeenInvestorWelcome');
        if (!hasSeenWelcome) {
            setShowWelcome(true);
        }
    }, []);

    const handleCloseWelcome = () => {
        setShowWelcome(false);
        localStorage.setItem('hasSeenInvestorWelcome', 'true');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <InvestorWelcomeModal isOpen={showWelcome} onClose={handleCloseWelcome} />

            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">لوحة تحكم المستثمر</h1>
                    <p className="text-gray-500">فرص استثمارية مهندسة خصيصاً لك</p>
                </div>
                <div className="flex gap-4">
                    <button className="p-2 bg-white rounded-full shadow-sm text-gray-600 hover:text-primary transition-colors">
                        🔔
                    </button>
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                        MA
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Stats / Algorithm Explain */}
                <div className="md:col-span-1 space-y-6">
                    <Card className="p-6 bg-slate-900 text-white border-none">
                        <h3 className="font-bold text-lg mb-4">كيف نقيم الفرص؟ ⚖️</h3>
                        <div className="space-y-4">
                            {[
                                { label: 'الجاهزية القانونية', val: '30%', desc: 'تراخيص واضحة' },
                                { label: 'نموذج الربح', val: '25%', desc: 'تدفقات نقدية' },
                                { label: 'قابلية التوسع', val: '20%', desc: 'نمو جغرافي' },
                                { label: 'وضوح الوصف', val: '15%', desc: 'نضج الفكرة' },
                                { label: 'الفريق', val: '10%', desc: 'القدرة على التنفيذ' },
                            ].map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center text-sm">
                                    <span className="text-gray-300">{item.label}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500 hidden xl:inline">{item.desc}</span>
                                        <span className="font-bold text-primary">{item.val}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h3 className="font-bold text-gray-900 mb-4">اهتماماتك</h3>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">سياحة</span>
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">تقنية</span>
                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">+ إضافة</span>
                        </div>
                    </Card>
                </div>

                {/* Opportunities Feed */}
                <div className="md:col-span-2 space-y-6">
                    <h2 className="font-bold text-xl text-gray-800">الفرص المتوافقة (Investor-Fit)</h2>

                    {/* Mock Opportunity Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-2xl">
                                    🏕️
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                                        مخيمات حائل البيئية
                                        <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full border border-amber-200">
                                            فرصة حائل الموعودة ⛰️
                                        </span>
                                    </h3>
                                    <p className="text-sm text-gray-500">سياحة • قيد التنفيذ</p>
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-black text-green-600">92%</div>
                                <div className="text-xs text-gray-400">مؤشر الجذب</div>
                            </div>
                        </div>

                        <p className="text-gray-600 text-sm leading-relaxed mb-6">
                            "مشروع سياحي بيئي يستغل تضاريس جبال أجا، يعتمد على الطاقة الشمسية بالكامل، مع عقود تشغيل مبدئية لفعاليات موسم الرياض..."
                        </p>

                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="bg-gray-50 p-3 rounded-lg text-center">
                                <div className="text-xs text-gray-400">العائد المتوقع</div>
                                <div className="font-bold text-slate-800">18%</div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg text-center">
                                <div className="text-xs text-gray-400">المبلغ المطلوب</div>
                                <div className="font-bold text-slate-800">500k</div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg text-center">
                                <div className="text-xs text-gray-400">فترة الاسترداد</div>
                                <div className="font-bold text-slate-800">3 سنوات</div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button className="flex-1 bg-slate-900 text-white py-3 rounded-xl hover:bg-slate-800 font-medium transition-colors">
                                طلب تفاصيل أكثر
                            </button>
                            <button className="w-12 h-12 flex items-center justify-center border-2 border-slate-100 rounded-xl hover:border-red-200 hover:text-red-500 transition-colors">
                                ♥
                            </button>
                        </div>
                    </div>

                    {/* Placeholder for no more data */}
                    <div className="text-center py-8 text-gray-400 text-sm">
                        جاري تحليل فرص جديدة...
                    </div>
                </div>
            </div>
        </div>
    );
}
