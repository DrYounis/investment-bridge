'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/browser';

interface ProductLine {
  id: string;
  name: string;
  tagline: string | null;
  sector: string | null;
  stage: string | null;
  description: string | null;
  expansion_capital: number | null;
  equity_or_profit_share: string | null;
  roi_multiple: number | null;
  timeline_months: number | null;
  pitch_deck_url: string | null;
  source_label: string | null;
  created_at: string;
}

export default function AdminProductLinesPage() {
  const [productLines, setProductLines] = useState<ProductLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      const { data, error: queryError } = await supabase
        .from('marfa_product_lines')
        .select('*')
        .order('created_at', { ascending: false });

      if (queryError) {
        setError(queryError.message);
      } else {
        setProductLines(data || []);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4" dir="rtl">
        <div className="h-8 bg-[#1a2540] rounded w-96" />
        <div className="h-4 bg-[#1a2540] rounded w-64" />
        <div className="h-48 bg-[#0d1628] rounded-2xl border border-[#1a2540] mt-6" />
      </div>
    );
  }

  if (error) {
    return (
      <div dir="rtl">
        <p className="text-red-400">خطأ في تحميل البيانات: {error}</p>
      </div>
    );
  }

  return (
    <div dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-400/10 border border-red-400/30 text-red-400 rounded-full text-xs font-bold mb-3">
          🔒 إداري فقط — غير معروض للمستثمرين
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">
          توسعات خطوط الإنتاج الداخلية
        </h1>
        <p className="text-[#8a9bb8]">
          Internal Product Line Expansions — Not Public Investor Listings.
          هذه الصفحة مخصصة للتخطيط الداخلي فقط ولا تظهر في سوق الفرص العام.
        </p>
      </div>

      {productLines.length === 0 ? (
        <div className="text-center py-16 text-[#64748b] bg-[#0d1628] rounded-2xl border border-[#1a2540]">
          <p className="text-lg">لا توجد توسعات داخلية مسجلة حالياً</p>
        </div>
      ) : (
        <div className="space-y-6">
          {productLines.map((pl) => (
            <div
              key={pl.id}
              className="bg-[#0d1628] border border-[#1a2540] rounded-2xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">{pl.name}</h2>
                  {pl.tagline && (
                    <p className="text-[#a0aec0] text-sm">{pl.tagline}</p>
                  )}
                </div>
                {pl.stage && (
                  <span className="px-3 py-1 bg-[#c9a84c]/15 text-[#c9a84c] rounded-full text-xs font-bold whitespace-nowrap">
                    {pl.stage}
                  </span>
                )}
              </div>

              {pl.description && (
                <p className="text-[#a0aec0] text-sm leading-relaxed mb-6">
                  {pl.description}
                </p>
              )}

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {pl.expansion_capital != null && (
                  <div className="bg-[#0a0f1e] p-4 rounded-xl border border-[#1a2540]">
                    <div className="text-xs text-[#64748b] mb-1">رأس مال التوسعة</div>
                    <div className="font-bold text-white text-lg">
                      {(pl.expansion_capital / 1000).toFixed(0)}K ر.س
                    </div>
                  </div>
                )}
                {pl.equity_or_profit_share && (
                  <div className="bg-[#0a0f1e] p-4 rounded-xl border border-[#1a2540]">
                    <div className="text-xs text-[#64748b] mb-1">الحصة / المشاركة</div>
                    <div className="font-bold text-[#c9a84c] text-sm">
                      {pl.equity_or_profit_share}
                    </div>
                  </div>
                )}
                {pl.roi_multiple != null && (
                  <div className="bg-[#0a0f1e] p-4 rounded-xl border border-[#1a2540]">
                    <div className="text-xs text-[#64748b] mb-1">ROI مضاعف</div>
                    <div className="font-bold text-green-400 text-lg">
                      {pl.roi_multiple}x
                    </div>
                  </div>
                )}
                {pl.timeline_months != null && (
                  <div className="bg-[#0a0f1e] p-4 rounded-xl border border-[#1a2540]">
                    <div className="text-xs text-[#64748b] mb-1">المدة المتوقعة</div>
                    <div className="font-bold text-white">
                      {pl.timeline_months} شهر
                    </div>
                  </div>
                )}
              </div>

              {/* Sector + Source */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {pl.sector && (
                  <span className="px-2 py-1 bg-[#1a2540] text-[#8a9bb8] rounded-md text-xs font-bold">
                    {pl.sector}
                  </span>
                )}
                {pl.source_label && (
                  <span className="px-2 py-1 bg-red-400/10 text-red-400 rounded-md text-xs font-bold">
                    {pl.source_label}
                  </span>
                )}
              </div>

              {/* Pitch Deck Link */}
              {pl.pitch_deck_url ? (
                <a
                  href={pl.pitch_deck_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#c9a84c] text-[#0a0f1e] rounded-xl font-bold text-sm hover:bg-[#d4a843] transition"
                >
                  📄 عرض Pitch Deck
                </a>
              ) : (
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a2540] text-[#64748b] rounded-xl text-sm">
                  📄 Pitch Deck غير متوفر بعد
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
