import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'استوديو مرفأ — طوّر مشروعك مع فريق تقني | مرفأ',
  description: 'فريق تطوير تقني متكامل لمشروعك الناشئ — ٣٠٠٠ ريال شهرياً. نوظّف، ندير، نضمن الجودة. أنت تركّز على الرؤية.',
  openGraph: {
    title: 'استوديو مرفأ — طوّر مشروعك مع فريق تقني | مرفأ',
    description: 'فريق تطوير متكامل لمشروعك الناشئ بثلث التكلفة المحلية',
    url: 'https://www.marfa.sa/studio',
  },
};

const PERKS = [
  { icon: '👥', title: 'فريق تطوير مخصص', desc: '2-3 مطورين متفرغين لمشروعك' },
  { icon: '📅', title: 'إدارة أسبوعية', desc: 'سباقات تطوير وتقارير تقدم بالعربية' },
  { icon: '✅', title: 'ضمان جودة', desc: 'اختبار ومراجعة لكل شحنة كود' },
  { icon: '🚀', title: 'نشر وتشغيل', desc: 'نطلق مشروعك على السيرفرات' },
  { icon: '🔄', title: 'تعديلات مفتوحة', desc: 'عدّل واضف مميزات بدون حدود' },
  { icon: '📚', title: 'توثيق كامل', desc: 'كود موثّق بالعربية والإنجليزية' },
  { icon: '📞', title: 'دعم فني مستمر', desc: 'متواجدون للرد على استفساراتك' },
  { icon: '🔒', title: 'سرية تامة', desc: 'اتفاقية عدم إفصاح قبل البدء' },
];

export default function StudioPage() {
  return (
    <main className="min-h-screen bg-[#faf8f2]" dir="rtl">
      {/* Hero */}
      <section className="bg-[#0a0f1e] pt-32 pb-20 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[60%] bg-[#c9a84c]/5 blur-[100px] rounded-full" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/20 text-[#c9a84c] text-sm font-bold mb-6">
            🛠️ استوديو مرفأ — مدعوم بالذكاء الاصطناعي
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            ابني مشروعك<br />
            <span className="text-[#c9a84c]">بقوة الذكاء الاصطناعي</span>
          </h1>
          <p className="text-[#a0aec0] text-lg max-w-xl mx-auto leading-relaxed" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            نستخدم الوكلاء الأذكياء (Claude, Copilot, Gemini) لبناء MVP مشروعك بسرعة وبتكلفة أقل بـ ٧٠٪ من السوق. ادفع نقداً — أو انضم للصيادين وادفع حصة 1-2%.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#a0aec0] text-xs">🤖 Claude / Copilot</span>
            <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#a0aec0] text-xs">⚡ Low-Code MVPs</span>
            <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#a0aec0] text-xs">🌏 فريق QA عالمي</span>
            <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#a0aec0] text-xs">🎯 حصة 1-2%</span>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-black text-[#0a0f1e] text-center mb-12" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          كيف نعمل؟
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { step: '١', icon: '📋', title: 'جلسة اكتشاف', desc: 'نجلس معك لتحديد متطلبات المشروع — الميزات، التقنيات، الجدول الزمني. الجلسة الأولى مجانية.' },
            { step: '٢', icon: '🔧', title: 'بناء الفريق', desc: 'نختار من شبكتنا أفضل المطورين المناسبين لمشروعك — نوظّف وندير عنك كل شيء.' },
            { step: '٣', icon: '🚀', title: 'إطلاق وتشغيل', desc: 'نعمل في سباقات أسبوعية مع تقارير تقدم. تتابع منتجك ينمو أسبوعاً بأسبوع.' },
          ].map(c => (
            <div key={c.step} className="bg-white rounded-2xl p-6 border border-[#c9a84c]/10 text-center hover:border-[#c9a84c]/30 transition-all shadow-[0_4px_20px_rgba(10,15,30,0.03)]">
              <div className="text-3xl mb-3">{c.icon}</div>
              <div className="w-8 h-8 rounded-full bg-[#c9a84c] text-[#0a0f1e] font-black text-sm flex items-center justify-center mx-auto mb-3">{c.step}</div>
              <h3 className="text-lg font-bold text-[#0a0f1e] mb-2" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>{c.title}</h3>
              <p className="text-sm text-[#4a5b78] leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing comparison */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="bg-[#0a0f1e] rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[60%] bg-[#c9a84c]/5 blur-[80px] rounded-full" />
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-6" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
              فريق تقني كامل — <span className="text-[#c9a84c]">بثلث التكلفة</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
              <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
                <p className="text-[#64748b] text-xs mb-1">التوظيف المحلي</p>
                <p className="text-2xl font-black text-white">15,000+ ﷼</p>
                <p className="text-[#64748b] text-xs mt-1">راتب مطور واحد شهرياً</p>
              </div>
              <div className="bg-[#c9a84c]/10 border border-[#c9a84c]/30 rounded-xl p-5 text-center">
                <p className="text-[#c9a84c] text-xs mb-1">استوديو مرفأ</p>
                <p className="text-2xl font-black text-[#c9a84c]">3,000 ﷼</p>
                <p className="text-[#c9a84c]/80 text-xs mt-1">فريق تطوير كامل شهرياً</p>
              </div>
            </div>
            <p className="text-[#a0aec0] text-sm max-w-lg mx-auto leading-relaxed">
              نفس الجودة — لأننا ندير التوظيف والمشروع والجودة نيابة عنك. أنت تحصل على منتج نهائي، مش على فاتورة رواتب.
            </p>
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <h2 className="text-3xl font-black text-[#0a0f1e] text-center mb-10" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          ماذا تحصل؟
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {PERKS.map((p, i) => (
            <div key={i} className="flex items-center gap-3 bg-white rounded-xl p-4 border border-[#c9a84c]/10 shadow-[0_2px_10px_rgba(10,15,30,0.02)]">
              <span className="text-xl">{p.icon}</span>
              <div>
                <p className="text-sm text-[#0a0f1e] font-bold" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>{p.title}</p>
                <p className="text-xs text-[#8a94a8]">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-4 pb-20 text-center">
        <div className="bg-white rounded-3xl p-8 md:p-10 border border-[#c9a84c]/20 shadow-[0_8px_30px_rgba(10,15,30,0.06)]">
          <h2 className="text-2xl font-black text-[#0a0f1e] mb-3" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            ابدأ مشروعك اليوم
          </h2>
          <p className="text-[#4a5b78] text-sm mb-8" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            ادفع ٣٠٠٠ ريال شهرياً — أو انضم للصيادين وادفع حصة 1-2% فقط
          </p>
          <div className="flex flex-col md:flex-row gap-3 justify-center">
            <a
              href="/consultation"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#c9a84c] text-[#0a0f1e] font-bold text-lg rounded-2xl hover:bg-[#d4a843] transition-colors shadow-lg shadow-[#c9a84c]/20"
            >
              💳 ادفع نقداً ←
            </a>
            <a
              href="/hunters"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0a0f1e] text-[#c9a84c] font-bold text-lg rounded-2xl hover:bg-[#1a2540] transition-colors border border-[#c9a84c]/30"
            >
              🎯 انضم للصيادين (حصة) ←
            </a>
          </div>
          <p className="text-xs text-[#8a94a8] mt-4" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            الجلسة الأولى مجانية — نناقش فكرتك ونحدد خطة التطوير
          </p>
        </div>
      </section>
    </main>
  );
}
