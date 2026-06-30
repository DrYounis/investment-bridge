'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase/browser';

interface Opportunity {
  id: string;
  title: string;
  tagline: string | null;
  sector: string | null;
  stage: string | null;
  summary: string | null;
  target_amount: number | null;
  raised_amount: number | null;
  equity_offered: number | null;
  roi_percentage: number | null;
  payback_period: string | null;
  is_platform_originated: boolean;
  source_label: string | null;
  pitch_deck_url: string | null;
  location: string | null;
}

const InvestorDashboard = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState({ sector: 'All' });
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [selectedDeal, setSelectedDeal] = useState<Opportunity | null>(null);
  const [activeTab, setActiveTab] = useState<'marketplace' | 'profile'>('marketplace');

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      const { data, error: queryError } = await supabase
        .from('investment_opportunities')
        .select('*')
        .or('status.eq.published,is_platform_originated.eq.true')
        .order('created_at', { ascending: false });

      if (queryError) {
        setError(queryError.message);
      } else {
        setOpportunities(data || []);
      }
      setLoading(false);
    })();
  }, []);

  const organicDeals = useMemo(
    () => opportunities.filter((o) => !o.is_platform_originated),
    [opportunities],
  );

  const platformDeals = useMemo(
    () => opportunities.filter((o) => o.is_platform_originated),
    [opportunities],
  );

  const sectors = useMemo(() => {
    const set = new Set(opportunities.map((o) => o.sector).filter(Boolean) as string[]);
    return ['All', ...Array.from(set)];
  }, [opportunities]);

  const filteredDeals = useMemo(() => {
    let deals = organicDeals;
    if (filter.sector !== 'All') {
      deals = deals.filter((d) => d.sector === filter.sector);
    }
    return deals;
  }, [organicDeals, filter]);

  const toggleWatchlist = useCallback((id: string) => {
    setWatchlist((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id],
    );
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center" dir="rtl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[#1a2540] rounded w-64 mx-auto" />
          <div className="h-4 bg-[#1a2540] rounded w-96 mx-auto" />
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-[#0d1628] rounded-2xl border border-[#1a2540]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center" dir="rtl">
        <p className="text-red-400">خطأ في تحميل الفرص: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" dir="rtl">
      {/* Dashboard Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-[#0d1628] p-1 rounded-full border border-[#1a2540] shadow-sm flex">
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
              activeTab === 'marketplace'
                ? 'bg-[#c9a84c] text-[#0a0f1e] shadow-md'
                : 'text-[#a0aec0] hover:bg-[#1a2540]'
            }`}
          >
            سوق الفرص 📊
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-[#c9a84c] text-[#0a0f1e] shadow-md'
                : 'text-[#a0aec0] hover:bg-[#1a2540]'
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
              <div className="inline-block px-3 py-1 bg-[#c9a84c]/15 text-[#c9a84c] rounded-full text-xs font-bold mb-2">
                لوحة المستثمر المعتمد 💎
              </div>
              <h1 className="text-3xl font-bold text-white">سوق الفرص الواعدة</h1>
              <p className="text-[#a0aec0]">
                جميع الفرص المعروضة هنا تجاوزت &quot;مختبر الجدوى&quot; وحصلت على تصنيف ائتماني من مرفأ.
              </p>
            </div>
            <div className="text-left">
              <div className="text-sm text-[#64748b]">محفظتك الافتراضية</div>
              <div className="text-2xl font-bold text-[#c9a84c]">{watchlist.length} فرص محفوظة 🔖</div>
            </div>
          </div>

          {/* Sector Filter */}
          <div className="bg-[#0d1628] p-6 rounded-2xl border border-[#1a2540] shadow-sm mb-12 flex flex-wrap gap-6 items-center">
            <div className="flex items-center gap-2 text-[#a0aec0] font-bold">
              <span>🔍 فلترة:</span>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-[#64748b]">القطاع:</label>
              <select
                className="bg-[#1a2540] border border-[#1a2540] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#c9a84c]"
                value={filter.sector}
                onChange={(e) => setFilter({ sector: e.target.value })}
              >
                {sectors.map((s) => (
                  <option key={s} value={s}>
                    {s === 'All' ? 'الكل' : s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Organic Deals Grid */}
          {filteredDeals.length > 0 && (
            <div className="mb-16">
              <h2 className="text-xl font-bold text-white mb-6 border-r-4 border-[#c9a84c] pr-3">
                فرص استثمارية من رواد الأعمال
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredDeals.map((deal) => (
                  <OpportunityCard
                    key={deal.id}
                    deal={deal}
                    isInWatchlist={watchlist.includes(deal.id)}
                    onToggleWatchlist={() => toggleWatchlist(deal.id)}
                    onViewDetails={() => setSelectedDeal(deal)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Marfa Studio Ventures Section */}
          {platformDeals.length > 0 && (
            <div className="mb-16">
              <div className="bg-[#c9a84c]/10 border border-[#c9a84c]/30 rounded-2xl p-6 mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🏛️</span>
                  <h2 className="text-xl font-bold text-[#c9a84c]">
                    Marfa Studio Ventures — فرص من مشغل المنصة
                  </h2>
                </div>
                <p className="text-[#a0aec0] text-sm pr-10">
                  هذه الفرص مصدرها مشغل منصة مرفأ (Marfa Studio) وليست من رواد أعمال مستقلين.
                  تم تقييمها داخلياً وعرضها للمستثمرين المعتمدين.
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {platformDeals.map((deal) => (
                  <OpportunityCard
                    key={deal.id}
                    deal={deal}
                    isPlatform={true}
                    isInWatchlist={watchlist.includes(deal.id)}
                    onToggleWatchlist={() => toggleWatchlist(deal.id)}
                    onViewDetails={() => setSelectedDeal(deal)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {filteredDeals.length === 0 && platformDeals.length === 0 && (
            <div className="text-center py-16 text-[#64748b]">
              <p className="text-lg">لا توجد فرص متاحة حالياً</p>
            </div>
          )}

          {/* Detail Modal */}
          <AnimatePresence>
            {selectedDeal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
                onClick={() => setSelectedDeal(null)}
              >
                <div
                  className="bg-[#0d1628] border border-[#1a2540] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setSelectedDeal(null)}
                    className="absolute top-4 left-4 text-[#64748b] hover:text-red-400 text-lg"
                  >
                    ✕ إغلاق
                  </button>

                  <div className="border-b border-[#1a2540] pb-6 mb-6">
                    {selectedDeal.is_platform_originated && (
                      <span className="inline-block px-3 py-1 bg-[#c9a84c]/15 text-[#c9a84c] rounded-full text-xs font-bold mb-3">
                        🏛️ Marfa Studio
                      </span>
                    )}
                    <h2 className="text-3xl font-extrabold text-white mb-2">
                      {selectedDeal.title}
                    </h2>
                    {selectedDeal.tagline && (
                      <p className="text-[#a0aec0] mb-3">{selectedDeal.tagline}</p>
                    )}
                    <div className="flex gap-4 text-sm text-[#64748b]">
                      {selectedDeal.sector && <span>🏭 {selectedDeal.sector}</span>}
                      {selectedDeal.location && <span>📍 {selectedDeal.location}</span>}
                      {selectedDeal.stage && <span>📌 {selectedDeal.stage}</span>}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div>
                      <h4 className="font-bold text-white mb-2 border-r-4 border-[#c9a84c] pr-3">
                        ملخص الفرصة
                      </h4>
                      <p className="text-sm text-[#a0aec0] leading-relaxed">
                        {selectedDeal.summary || 'لا يوجد ملخص متاح.'}
                      </p>
                    </div>

                    <div className="bg-[#0a0f1e] p-6 rounded-2xl border border-[#1a2540]">
                      <h4 className="font-bold text-white mb-4 text-center">الأرقام الرئيسية 💰</h4>
                      <div className="space-y-4">
                        {selectedDeal.target_amount != null && (
                          <div className="flex justify-between items-center bg-[#0d1628] p-3 rounded-lg">
                            <span className="text-sm text-[#64748b]">رأس المال المطلوب</span>
                            <span className="font-bold text-white">
                              {(selectedDeal.target_amount / 1000).toFixed(0)}K ر.س
                            </span>
                          </div>
                        )}
                        {selectedDeal.equity_offered != null && (
                          <div className="flex justify-between items-center bg-[#0d1628] p-3 rounded-lg">
                            <span className="text-sm text-[#64748b]">الحصة المعروضة</span>
                            <span className="font-bold text-[#c9a84c]">
                              {selectedDeal.equity_offered}%
                            </span>
                          </div>
                        )}
                        {selectedDeal.roi_percentage != null && (
                          <div className="flex justify-between items-center bg-[#0d1628] p-3 rounded-lg">
                            <span className="text-sm text-[#64748b]">العائد المتوقع (ROI)</span>
                            <span className="font-bold text-green-400">
                              {selectedDeal.roi_percentage}% سنوياً
                            </span>
                          </div>
                        )}
                        {selectedDeal.payback_period && (
                          <div className="flex justify-between items-center bg-[#0d1628] p-3 rounded-lg">
                            <span className="text-sm text-[#64748b]">فترة الاسترداد</span>
                            <span className="font-bold text-white">{selectedDeal.payback_period}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {selectedDeal.source_label && (
                    <p className="text-xs text-[#64748b] mb-4 text-center">
                      {selectedDeal.source_label}
                    </p>
                  )}

                  <div className="flex gap-3">
                    {selectedDeal.pitch_deck_url ? (
                      <a
                        href={selectedDeal.pitch_deck_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-4 bg-[#c9a84c] text-[#0a0f1e] rounded-xl font-bold text-sm hover:bg-[#d4a843] transition text-center"
                      >
                        📄 عرض البطاقة التعريفية (Pitch Deck)
                      </a>
                    ) : (
                      <button
                        disabled
                        className="flex-1 py-4 bg-[#1a2540] text-[#64748b] rounded-xl font-bold text-sm cursor-not-allowed"
                      >
                        📄 Pitch Deck غير متوفر بعد
                      </button>
                    )}
                    <button className="flex-1 py-4 bg-[#1a2540] border border-[#1a2540] text-white rounded-xl font-bold text-sm hover:bg-[#1e2d4a] transition">
                      📞 طلب تواصل
                    </button>
                  </div>
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

// ── Opportunity Card ──────────────────────────────────────────────────

interface OpportunityCardProps {
  deal: Opportunity;
  isPlatform?: boolean;
  isInWatchlist: boolean;
  onToggleWatchlist: () => void;
  onViewDetails: () => void;
}

const OpportunityCard = React.memo(
  ({ deal, isPlatform, isInWatchlist, onToggleWatchlist, onViewDetails }: OpportunityCardProps) => {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-[#0d1628] rounded-2xl border shadow-lg overflow-hidden flex flex-col group transition-all ${
          isPlatform
            ? 'border-[#c9a84c]/40 hover:border-[#c9a84c] ring-1 ring-[#c9a84c]/20'
            : 'border-[#1a2540] hover:border-[#c9a84c]/30'
        }`}
      >
        {/* Card Header */}
        <div className="p-6 pb-4 relative">
          <button
            onClick={onToggleWatchlist}
            className="absolute top-4 left-4 text-[#64748b] hover:text-[#c9a84c] transition text-lg"
          >
            {isInWatchlist ? '⭐' : '☆'}
          </button>

          {/* Platform badge */}
          {isPlatform && (
            <div className="mb-3">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#c9a84c]/15 border border-[#c9a84c]/40 text-[#c9a84c] rounded-full text-[10px] font-bold">
                🏛️ Marfa Studio
              </span>
            </div>
          )}

          {deal.stage && (
            <div className="flex gap-2 mb-3">
              <span className="px-2 py-1 bg-[#1a2540] text-[#a0aec0] rounded-md text-[10px] font-bold">
                {deal.stage}
              </span>
              {deal.sector && (
                <span className="px-2 py-1 bg-[#1a2540] text-[#a0aec0] rounded-md text-[10px] font-bold">
                  {deal.sector}
                </span>
              )}
            </div>
          )}

          <h3 className="text-xl font-bold text-white mb-1">{deal.title}</h3>
          {deal.tagline && (
            <p className="text-xs text-[#64748b] mb-4 line-clamp-2">{deal.tagline}</p>
          )}
          {deal.summary && (
            <p className="text-[#a0aec0] text-sm leading-relaxed mb-4 line-clamp-3">
              {deal.summary}
            </p>
          )}
        </div>

        {/* Key Numbers */}
        <div className="px-6 py-4 bg-[#0a0f1e] border-y border-[#1a2540] grid grid-cols-2 gap-4">
          {deal.target_amount != null && (
            <div>
              <div className="text-xs text-[#64748b] mb-1">التمويل المطلوب</div>
              <div className="font-bold text-white text-lg">
                {(deal.target_amount / 1000).toFixed(0)}K{' '}
                <span className="text-xs text-[#64748b]">ريال</span>
              </div>
            </div>
          )}
          {deal.equity_offered != null && (
            <div>
              <div className="text-xs text-[#64748b] mb-1">الحصة</div>
              <div className="font-bold text-[#c9a84c] text-lg">
                {deal.equity_offered}% 📈
              </div>
            </div>
          )}
          {deal.roi_percentage != null && (
            <div>
              <div className="text-xs text-[#64748b] mb-1">ROI (سنوي)</div>
              <div className="font-bold text-green-400 text-lg">
                {deal.roi_percentage}%
              </div>
            </div>
          )}
          {deal.payback_period && (
            <div>
              <div className="text-xs text-[#64748b] mb-1">الاسترداد</div>
              <div className="font-bold text-white text-sm">{deal.payback_period}</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 mt-auto">
          {deal.source_label && (
            <p className="text-[10px] text-[#4a5a78] mb-4 text-center">{deal.source_label}</p>
          )}

          <div className="flex gap-3">
            <button
              onClick={onViewDetails}
              className="flex-1 py-3 bg-[#1a2540] border border-[#1a2540] text-white rounded-xl font-bold text-sm hover:bg-[#1e2d4a] transition"
            >
              📄 التفاصيل
            </button>
            {deal.pitch_deck_url ? (
              <a
                href={deal.pitch_deck_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 bg-[#c9a84c] text-[#0a0f1e] rounded-xl font-bold text-sm hover:bg-[#d4a843] transition text-center"
              >
                📄 Pitch Deck
              </a>
            ) : (
              <button
                disabled
                className="flex-1 py-3 bg-[#1a2540] text-[#64748b] rounded-xl font-bold text-sm cursor-not-allowed"
              >
                Pitch Deck قريباً
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  },
);

// ── Investor Profile Tab ──────────────────────────────────────────────

function InvestorProfileSettings() {
  return (
    <div className="bg-[#0d1628] rounded-2xl p-8 border border-[#1a2540] shadow-sm max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8 border-b border-[#1a2540] pb-6">
        <div className="w-20 h-20 bg-[#c9a84c]/20 rounded-full flex items-center justify-center text-4xl">
          👤
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">ملفي الاستثماري</h2>
          <p className="text-[#64748b] text-sm">إدارة تفضيلاتك الاستثمارية وبيانات التواصل</p>
        </div>
        <div className="mr-auto">
          <span className="px-3 py-1 bg-green-400/15 text-green-400 rounded-full text-xs font-bold">
            معتمد ✅
          </span>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-[#a0aec0] mb-2">الاسم الكامل</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-[#1a2540] border border-[#1a2540] text-white rounded-xl focus:border-[#c9a84c] outline-none"
              placeholder="الاسم"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#a0aec0] mb-2">البريد الإلكتروني</label>
            <input
              type="email"
              className="w-full px-4 py-3 bg-[#1a2540] border border-[#1a2540] text-[#64748b] rounded-xl outline-none"
              disabled
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-[#a0aec0] mb-2">نبذة عني</label>
          <textarea
            className="w-full px-4 py-3 bg-[#1a2540] border border-[#1a2540] text-white rounded-xl focus:border-[#c9a84c] outline-none h-24"
            placeholder="اكتب نبذة مختصرة عن اهتماماتك..."
          />
        </div>

        <div className="border-t border-[#1a2540] pt-6">
          <h3 className="text-lg font-bold text-white mb-4">تفضيلات الاستثمار</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-[#a0aec0] mb-2">القطاعات المفضلة</label>
              <div className="flex flex-wrap gap-2">
                {['تقنية', 'عقار', 'زراعة'].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-[#c9a84c]/15 text-[#c9a84c] rounded-lg text-sm font-bold cursor-pointer hover:bg-[#c9a84c]/25"
                  >
                    {tag} ✕
                  </span>
                ))}
                <button className="px-3 py-1 border border-dashed border-[#1a2540] rounded-lg text-sm text-[#64748b] hover:border-[#c9a84c] hover:text-[#c9a84c]">
                  + إضافة
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-[#a0aec0] mb-2">متوسط حجم التذكرة</label>
              <select className="w-full px-4 py-3 bg-[#1a2540] border border-[#1a2540] text-white rounded-xl outline-none">
                <option>100k - 500k ريال</option>
                <option>500k - 1M ريال</option>
                <option>1M+ ريال</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button className="px-8 py-3 bg-[#c9a84c] text-[#0a0f1e] rounded-xl font-bold shadow-lg hover:bg-[#d4a843] transition">
            حفظ التغييرات
          </button>
        </div>
      </div>
    </div>
  );
}
