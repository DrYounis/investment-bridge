'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Data for "Filtered" Opportunities
const deals = [
    {
        id: 1,
        name: "منتجع أجا البيئي",
        sector: "Tourism",
        location: "حائل",
        brief: "مخيم فاخر يعمل بالطاقة الشمسية بالكامل، يقدم تجربة فلكية ليلية.",
        fundingNeeded: 350000,
        roi: 22,
        paybackMonths: 18,
        marfaScore: { market: 9, tech: 8, team: 7 },
        tags: ["جاهز للتنفيذ", "مخاطرة منخفضة"]
    },
    {
        id: 2,
        name: "تطبيق (عافية) للرعاية المنزلية",
        sector: "HealthTech",
        location: "الرياض",
        brief: "منصة تربط الممرضين المرخصين بكبار السن لتقديم رعاية منزلية بالساعة.",
        fundingNeeded: 1200000,
        roi: 35,
        paybackMonths: 24,
        marfaScore: { market: 10, tech: 9, team: 8 },
        tags: ["نمو عالي", "MVP جاهز"]
    },
    {
        id: 3,
        name: "مصنع تمور ذكي",
        sector: "Agriculture",
        location: "القصيم",
        brief: "خط إنتاج مؤتمت لفرز وتغليف التمور باستخدام الذكاء الاصطناعي.",
        fundingNeeded: 2500000,
        roi: 18,
        paybackMonths: 36,
        marfaScore: { market: 7, tech: 10, team: 9 },
        tags: ["أصول ثابتة", "B2B"]
    }
];

interface Deal {
    id: number;
    name: string;
    sector: string;
    location: string;
    brief: string;
    fundingNeeded: number;
    roi: number;
    paybackMonths: number;
    marfaScore: { market: number; tech: number; team: number };
    tags: string[];
}

const InvestorDashboard = () => {
    const [filter, setFilter] = useState({ minROI: 0, maxFunding: 5000000, sector: 'All' });
    const [watchlist, setWatchlist] = useState<number[]>([]);
    const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

    const filteredDeals = deals.filter(deal =>
        (filter.sector === 'All' || deal.sector === filter.sector) &&
        deal.roi >= filter.minROI &&
        deal.fundingNeeded <= filter.maxFunding
    );

    const toggleWatchlist = (id: number) => {
        if (watchlist.includes(id)) {
            setWatchlist(watchlist.filter(w => w !== id));
        } else {
            setWatchlist([...watchlist, id]);
        }
    };

    const [activeTab, setActiveTab] = useState<'marketplace' | 'profile'>('marketplace');

    return (
        <div className="max-w-7xl mx-auto px-4 py-8" dir="rtl">

            {/* Dashboard Tabs */}
            <div className="flex justify-center mb-8">
                <div className="bg-white p-1 rounded-full border border-gray-200 shadow-sm flex">
                    <button
                        onClick={() => setActiveTab('marketplace')}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'marketplace' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
                            }`}
                    >
                        سوق الفرص 📊
                    </button>
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'profile' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
                            }`}
                    >
                        ملفي الاستثماري 👤
                    </button>
                </div>
            </div>

            {activeTab === 'profile' ? (
                <InvestorProfileSettings />
            ) : (
                <>

                    {/* Header */}
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold mb-2">
                                لوحة المستثمر المعتمد 💎
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900">سوق الفرص الواعدة (Deal Flow)</h1>
                            <p className="text-gray-500">
                                جميع الفرص المعروضة هنا تجاوزت "مختبر الجدوى" وحصلت على تصنيف ائتماني من مرفأ.
                            </p>
                        </div>
                        <div className="text-left">
                            <div className="text-sm text-gray-400">محفظتك الافتراضية</div>
                            <div className="text-2xl font-bold text-blue-900">{watchlist.length} فرص محفوظة 🔖</div>
                        </div>
                    </div>

                    {/* Smart Filters */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-12 flex flex-wrap gap-6 items-center">
                        <div className="flex items-center gap-2 text-gray-700 font-bold">
                            <span>🔍 فلترة ذكية:</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-500">القطاع:</label>
                            <select
                                className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                                onChange={(e) => setFilter({ ...filter, sector: e.target.value })}
                            >
                                <option value="All">الكل</option>
                                <option value="Tourism">سياحة وضيافة</option>
                                <option value="HealthTech">تقنية صحية</option>
                                <option value="Agriculture">زراعة وصناعة</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-500">الحد الأقصى للتمويل:</label>
                            <select
                                className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                                onChange={(e) => setFilter({ ...filter, maxFunding: Number(e.target.value) })}
                            >
                                <option value="5000000">5 مليون (مفتوح)</option>
                                <option value="500000">أقل من 500 ألف</option>
                                <option value="1000000">أقل من مليون</option>
                            </select>
                        </div>

                        <div className="flex-1 text-left">
                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                                يتم تحديث الفرص يومياً بناءً على مخرجات "المختبر"
                            </span>
                        </div>
                    </div>

                    {/* Deals Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredDeals.map((deal) => (
                            <motion.div
                                key={deal.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white rounded-3xl border border-gray-200 shadow-lg overflow-hidden flex flex-col group hover:border-blue-300 transition-all"
                            >
                                {/* Card Header & Brief */}
                                <div className="p-6 pb-4 bg-gradient-to-br from-white to-slate-50 relative">
                                    <button
                                        onClick={() => toggleWatchlist(deal.id)}
                                        className="absolute top-4 left-4 text-gray-300 hover:text-amber-400 transition"
                                    >
                                        {watchlist.includes(deal.id) ? '⭐' : '☆'}
                                    </button>

                                    <div className="flex gap-2 mb-3">
                                        {deal.tags.map(tag => (
                                            <span key={tag} className="px-2 py-1 bg-gray-200 text-gray-600 rounded-md text-[10px] font-bold">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{deal.name}</h3>
                                    <div className="text-xs text-gray-500 flex items-center gap-1 mb-4">
                                        <span>📍 {deal.location}</span>
                                        <span>•</span>
                                        <span>{deal.sector}</span>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed mb-4 h-16 overflow-hidden">
                                        {deal.brief}
                                    </p>
                                </div>

                                {/* Vital Signs (The Numbers) */}
                                <div className="px-6 py-4 bg-blue-50/50 border-y border-gray-100 grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-xs text-gray-400 mb-1">التمويل المطلوب</div>
                                        <div className="font-bold text-blue-900 text-lg">{(deal.fundingNeeded / 1000).toFixed(0)}K <span className="text-xs">ريال</span></div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-400 mb-1">ROI (سنوي)</div>
                                        <div className="font-bold text-green-600 text-lg">{deal.roi}% 📈</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-400 mb-1">الاسترداد</div>
                                        <div className="font-bold text-gray-800 text-sm">{deal.paybackMonths} شهر</div>
                                    </div>
                                </div>

                                {/* Marfa Score & Action */}
                                <div className="p-6 mt-auto">
                                    <div className="mb-6 space-y-2">
                                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                                            <span>مؤشر ثقة مرفأ</span>
                                            <span className="font-bold text-blue-600">8.6/10</span>
                                        </div>
                                        <MarfaScoreBar label="السوق" score={deal.marfaScore.market} />
                                        <MarfaScoreBar label="التقنية" score={deal.marfaScore.tech} />
                                        <MarfaScoreBar label="الفريق" score={deal.marfaScore.team} />
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setSelectedDeal(deal)}
                                            className="flex-1 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition"
                                        >
                                            📄 التقرير (PDF)
                                        </button>
                                        <button className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition">
                                            📞 طلب تواصل
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Teaser Modal (Investment One-Pager) */}
                    <AnimatePresence>
                        {selectedDeal && (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                                onClick={() => setSelectedDeal(null)}
                            >
                                <div
                                    className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 relative"
                                    onClick={e => e.stopPropagation()}
                                >
                                    <button onClick={() => setSelectedDeal(null)} className="absolute top-4 left-4 text-gray-400 hover:text-red-500">✕ إغلاق</button>

                                    {/* The Teaser Header */}
                                    <div className="border-b pb-6 mb-6">
                                        <span className="text-blue-600 font-bold tracking-widest text-xs uppercase mb-2 block">ملخص فرصة استثمارية</span>
                                        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{selectedDeal.name}</h2>
                                        <div className="flex gap-4 text-sm text-gray-500">
                                            <span>🏭 {selectedDeal.sector}</span>
                                            <span>📍 {selectedDeal.location}</span>
                                        </div>
                                    </div>

                                    {/* The Summary Grid */}
                                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                                        <div>
                                            <h4 className="font-bold text-gray-900 mb-2 border-r-4 border-blue-500 pr-3">المشكلة</h4>
                                            <p className="text-sm text-gray-600 leading-relaxed mb-4">
                                                هناك فجوة كبيرة في السوق المحلي لـ {selectedDeal.sector} حيث يعاني العملاء من نقص الخدمات المتخصصة، مما يؤدي إلى ضياع فرص اقتصادية تقدر بـ 50 مليون ريال سنوياً.
                                            </p>

                                            <h4 className="font-bold text-gray-900 mb-2 border-r-4 border-green-500 pr-3">الحل المقترح</h4>
                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                {selectedDeal.brief} الحل يعتمد على تقنيات حديثة لتقليل التكلفة التشغيلية بنسبة 30% مقارنة بالمنافسين التقليديين.
                                            </p>
                                        </div>

                                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                            <h4 className="font-bold text-gray-900 mb-4 text-center">الأرقام الذهبية 💰</h4>
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm">
                                                    <span className="text-sm text-gray-500">رأس المال المطلوب</span>
                                                    <span className="font-bold text-blue-900">{selectedDeal.fundingNeeded.toLocaleString()} ر.س</span>
                                                </div>
                                                <div className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm">
                                                    <span className="text-sm text-gray-500">العائد المتوقع (ROI)</span>
                                                    <span className="font-bold text-green-600">{selectedDeal.roi}% سنوياً</span>
                                                </div>
                                                <div className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm">
                                                    <span className="text-sm text-gray-500">فترة الاسترداد</span>
                                                    <span className="font-bold text-gray-800">{selectedDeal.paybackMonths} شهر</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Marfa Logic Score Chart */}
                                    <div className="mb-8">
                                        <h4 className="font-bold text-gray-900 mb-4">تقييم منطق مرفأ (Logic Score)</h4>
                                        <div className="flex items-end gap-4 h-32 border-b border-gray-200 pb-2 px-8">
                                            <div className="flex-1 bg-blue-100 rounded-t-lg relative group h-full flex items-end">
                                                <div style={{ height: `${selectedDeal.marfaScore.market * 10}%` }} className="w-full bg-blue-500 rounded-t-lg transition-all relative">
                                                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 font-bold text-xs">{selectedDeal.marfaScore.market}</span>
                                                </div>
                                                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-500 font-bold whitespace-nowrap">السوق</span>
                                            </div>
                                            <div className="flex-1 bg-purple-100 rounded-t-lg relative group h-full flex items-end">
                                                <div style={{ height: `${selectedDeal.marfaScore.tech * 10}%` }} className="w-full bg-purple-500 rounded-t-lg transition-all relative">
                                                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 font-bold text-xs">{selectedDeal.marfaScore.tech}</span>
                                                </div>
                                                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-500 font-bold whitespace-nowrap">التقنية</span>
                                            </div>
                                            <div className="flex-1 bg-green-100 rounded-t-lg relative group h-full flex items-end">
                                                <div style={{ height: `${selectedDeal.marfaScore.team * 10}%` }} className="w-full bg-green-500 rounded-t-lg transition-all relative">
                                                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 font-bold text-xs">{selectedDeal.marfaScore.team}</span>
                                                </div>
                                                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-500 font-bold whitespace-nowrap">الفريق</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black shadow-lg transition">
                                        📥 تحميل الملف الكامل (PDF)
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}
        </div>
    );
};

export default React.memo(InvestorDashboard);

function InvestorProfileSettings() {
    return (
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-4xl">
                    👤
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">ملفي الاستثماري</h2>
                    <p className="text-gray-500 text-sm">إدارة تفضيلاتك الاستثمارية وبيانات التواصل</p>
                </div>
                <div className="mr-auto">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">معتمد ✅</span>
                </div>
            </div>

            <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">الاسم الكامل</label>
                        <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 outline-none" placeholder="الاسم" defaultValue="د. يونس" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">البريد الإلكتروني</label>
                        <input type="email" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 outline-none" defaultValue="investor@example.com" disabled />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">نبذة عني</label>
                    <textarea className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 outline-none h-24" placeholder="اكتب نبذة مختصرة عن اهتماماتك..."></textarea>
                </div>

                <div className="border-t border-gray-100 pt-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">تفضيلات الاستثمار</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">القطاعات المفضلة</label>
                            <div className="flex flex-wrap gap-2">
                                {['تقنية', 'عقار', 'زراعة'].map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold cursor-pointer hover:bg-blue-100">{tag} ✕</span>
                                ))}
                                <button className="px-3 py-1 border border-dashed border-gray-300 rounded-lg text-sm text-gray-400 hover:border-blue-400 hover:text-blue-500">+ إضافة</button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">متوسط حجم التذكرة</label>
                            <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none">
                                <option>100k - 500k ريال</option>
                                <option>500k - 1M ريال</option>
                                <option>1M+ ريال</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition">
                        حفظ التغييرات
                    </button>
                </div>
            </div>
        </div>
    )
}

interface MarfaScoreBarProps {
    label: string;
    score: number;
}

const MarfaScoreBar = React.memo(({ label, score }: MarfaScoreBarProps) => {
    return (
        <div className="flex items-center gap-2 text-xs">
            <span className="w-12 text-gray-400">{label}</span>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full ${score >= 8 ? 'bg-green-500' : score >= 6 ? 'bg-amber-400' : 'bg-red-400'}`}
                    style={{ width: `${score * 10}%` }}
                ></div>
            </div>
            <span className="font-bold text-gray-600">{score}</span>
        </div>
    );
});
