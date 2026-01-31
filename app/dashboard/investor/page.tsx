"use client";

import { useEffect, useState } from 'react';
import Card from '../../components/ui/Card';
import SharkTankDeal from '../../components/investor/SharkTankDeal';
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

                    {/* Shark Tank Style Deal Flow */}
                    <div className="space-y-6">
                        <SharkTankDeal
                            id="deal-101"
                            title="مخيمات حائل البيئية"
                            sector="سياحة"
                            teaser_summary="فرصة في قطاع السياحة البيئية في منطقة حائل تتميز بموقع استراتيجي (جبال أجا) وعقود تشغيلية مضمونة. العائد المتوقع مرتفع وفترة الاسترداد قصيرة."
                            full_details="مشروع منتجع بيئي متكامل في قلب جبال أجا، يعتمد على الطاقة المتجددة بنسبة 100%. يتضمن 40 وحدة فندقية فاخرة (Glamping). لدينا اتفاقيات موقعة مع موسم الرياض لتشغيل فعاليات شتوية. الأرض مملوكة بصك إلكتروني جاهز للإفراغ. التقييم المالي تم بواسطة شركة (Big 4)."
                            match_score={92}
                            metrics={{
                                roi: "18%",
                                amount: "500k",
                                payback: "3 سنوات"
                            }}
                        />

                        <SharkTankDeal
                            id="deal-102"
                            title="تطبيق صحتي الذكي"
                            sector="تقنية صحية"
                            teaser_summary="منصة تعتمد على الذكاء الاصطناعي للتشخيص الأولي وربط المرضى بالأطباء المختصين عن بعد. نموذج عمل SaaS قابل للتوسع عالمياً."
                            full_details="التطبيق يستخدم خوارزميات NLP لتحليل أعراض المريض وتوجيهه للتخصص الدقيق. تم اختباره على 5000 مريض بنسبة دقة 89%. الفريق يضم أطباء استشاريين ومطورين سابقين في Google. نبحث عن تمويل للتوسع في السوق الخليجي."
                            match_score={88}
                            metrics={{
                                roi: "25%",
                                amount: "1.2M",
                                payback: "2.5 سنة"
                            }}
                        />
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
