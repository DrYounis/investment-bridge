'use client';

import Link from 'next/link';

const TEMPLATES = [
  { id: 'investor-series-a', name: 'جولة استثمارية Series A', cat: 'Investor', icon: '📊', color: 'from-[#0f2040] to-[#0a1530]' },
  { id: 'seed-pitch', name: 'شريحة الفكرة Seed', cat: 'Startup', icon: '🚀', color: 'from-[#1a0f30] to-[#0f0a25]' },
  { id: 'marketing-campaign', name: 'حملة تسويقية', cat: 'Marketing', icon: '📣', color: 'from-[#0f2518] to-[#081510]' },
  { id: 'b2b-sales', name: 'عرض مبيعات B2B', cat: 'Sales', icon: '💼', color: 'from-[#301010] to-[#200a0a]' },
  { id: 'agency-deck', name: 'عرض الوكالة الإبداعية', cat: 'Agency', icon: '🏢', color: 'from-[#0a1828] to-[#06101c]' },
  { id: 'quarterly-report', name: 'تقرير أداء ربع سنوي', cat: 'Investor', icon: '📉', color: 'from-[#1a0f30] to-[#0f0a25]' },
  { id: 'tech-project', name: 'عرض المشروع التقني', cat: 'Startup', icon: '💡', color: 'from-[#301010] to-[#200a0a]' },
  { id: 'gtm-strategy', name: 'استراتيجية الوصول للسوق', cat: 'Marketing', icon: '🎯', color: 'from-[#0f2040] to-[#0a1530]' },
];

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white font-arabic" dir="rtl">
      <nav className="sticky top-0 z-50 bg-[#0a0f1e]/90 backdrop-blur-xl border-b border-[#1e2d4a] px-6 h-16 flex items-center justify-between">
        <Link href="/services/pitch-deck" className="text-xl font-bold text-[#c9a84c]">مرفأ <span className="text-[#8a9bb8] font-light text-sm">Templates</span></Link>
        <Link href="/services/pitch-deck/create" className="px-4 py-2 bg-[#c9a84c] text-[#0a0f1e] rounded-lg text-sm font-bold">
          ابدأ الآن
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 bg-[#c9a84c]/10 border border-[#c9a84c]/25 text-[#c9a84c] rounded-full text-xs font-bold mb-4">+20 قالب</span>
          <h1 className="text-3xl md:text-4xl font-black mb-3">مكتبة القوالب الاحترافية</h1>
          <p className="text-[#8a9bb8] max-w-lg mx-auto">استلهمنا تصاميمنا من أفضل الشركات العالمية. قوالب جاهزة تغطي جميع احتياجات العرض الاستثماري.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TEMPLATES.map(t => (
            <div key={t.id} className="bg-[#111827] border border-[#1e2d4a] rounded-xl overflow-hidden hover:border-[#c9a84c]/40 transition-all hover:-translate-y-1 cursor-pointer">
              <div className={`h-32 bg-gradient-to-br ${t.color} flex items-center justify-center text-4xl relative`}>
                {t.icon}
                <span className="absolute top-2 left-2 bg-[#c9a84c]/20 border border-[#c9a84c]/30 text-[#c9a84c] text-xs px-2 py-0.5 rounded">PRO</span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-sm mb-1">{t.name}</h3>
                <span className="text-xs text-[#4a5a78]">{t.cat}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/services/pitch-deck/create" className="inline-flex items-center gap-2 text-[#c9a84c] font-bold hover:underline">
            ابدأ التصميم الآن ←
          </Link>
        </div>
      </div>
    </div>
  );
}
