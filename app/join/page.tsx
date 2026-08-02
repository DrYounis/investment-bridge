import type { Metadata } from 'next';
import Link from 'next/link';
import RegistrationBanner from '@/app/components/marfa/RegistrationBanner';
import StickyJoinCTA from '@/app/components/marfa/StickyJoinCTA';

export const metadata: Metadata = {
  title: 'انضم إلى مرفأ | مجتمع رواد الأعمال السعودي',
  description: 'انضم إلى مرفأ مجاناً — أدوات ذكاء اصطناعي لتحليل فكرتك، لقاءات تدريبية أسبوعية، مجلس استشاري، تقييمات شهرية، فرص وظيفية، ومركز معرفة بـ ٣٠٠ مصطلح.',
  openGraph: {
    title: 'انضم إلى مرفأ | مجتمع رواد الأعمال السعودي',
    description: 'أدوات ذكاء اصطناعي مجانية، لقاءات تدريبية، مجلس استشاري — كل ما يحتاجه رائد الأعمال السعودي في مكان واحد.',
    url: 'https://www.marfa.sa/join',
  },
};

const STATS = [
  { value: '٣٠٠', label: 'مصطلح تجاري في القاموس' },
  { value: '١٤', label: 'لقاء تدريبي في البرنامج' },
  { value: '٥', label: 'أدوات ذكاء اصطناعي مجانية' },
];

const BENEFITS = [
  {
    emoji: '🛠️',
    title: 'أدوات ذكاء اصطناعي مجانية',
    desc: 'مستشار 360° يحلل فكرتك من 6 زوايا، خطاب مصعد في 20 ثانية، صانع عروض استثمارية — كله مجاني.',
  },
  {
    emoji: '🏛️',
    title: 'المجلس الاستشاري',
    desc: '١٤ لقاء تدريبي أسبوعي — كل لقاء يناقش حالة دراسية من الواقع (Airbnb, Netflix, Shark Tank...) مع سؤال تقييمي من مستشار معتمد.',
  },
  {
    emoji: '📊',
    title: 'تقييم شهري من المستشارين',
    desc: 'أداؤك في المجلس يُقيّم شهرياً من قبل مستشارين معتمدين — تقدمك يُقاس ويرصد عبر لوحة تحكم خاصة بك.',
  },
  {
    emoji: '📚',
    title: 'مركز المعرفة',
    desc: 'موسوعة عربية شاملة في ريادة الأعمال والاستثمار — ٣٠٠ مصطلح، مقالات أصلية، وقاموس ثنائي اللغة.',
  },
  {
    emoji: '💼',
    title: 'فرص وظيفية محدّثة',
    desc: 'وظائف من كبرى المنصات في السعودية — تصلك تحديثات أسبوعية وتنبيهات على إيميلك.',
  },
  {
    emoji: '📧',
    title: 'مصطلح الأسبوع',
    desc: 'كل اثنين يصلك مصطلح تجاري مع شرح ومثال من الواقع — يحضّرك للقاء الجمعة القادم.',
  },
];

const PORTFOLIO = [
  { icon: '🎯', name: 'بصيرة', desc: 'منصة ذكاء اصطناعي لتحليل المنافسات الحكومية والتنبؤ بنتائجها قبل الإعلان.' },
  { icon: '📐', name: 'مقياس', desc: 'أداة تحول القياسات الهندسية إلى عروض أسعار تلقائياً لمصانع الألمنيوم.' },
  { icon: '🏥', name: 'برو ميد إنشور', desc: 'نظام ذكي لإدارة المطالبات الطبية وتحويل الرفض إلى أرباح للمنشآت الصحية.' },
];

export default function JoinPage() {
  return (
    <main className="min-h-screen bg-[#faf8f2]" dir="rtl">
      {/* ── Hero ── */}
      <section className="bg-[#0a0f1e] pt-32 pb-20 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[60%] bg-[#c9a84c]/5 blur-[100px] rounded-full" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/20 text-[#c9a84c] text-sm font-bold mb-6">
            🚀 مجتمع رواد الأعمال السعودي
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            حوّل فكرتك إلى مشروع —<br />
            <span className="text-[#c9a84c]">مجاناً</span> في مرفأ
          </h1>
          <p className="text-[#a0aec0] text-lg max-w-xl mx-auto mb-8 leading-relaxed" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            أدوات ذكاء اصطناعي، مجلس استشاري، تقييمات شهرية، ومجتمع من رواد الأعمال — كل ما تحتاجه في مكان واحد
          </p>
          <Link
            href="/register"
            className="inline-block px-10 py-4 rounded-full bg-gradient-to-r from-[#c9a84c] to-[#d4a843] text-[#0a0f1e] font-bold text-lg hover:shadow-xl hover:shadow-[#c9a84c]/30 transition-all duration-300"
            style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
          >
            ابدأ الآن — مجاناً ←
          </Link>
          <p className="text-[#64748b] text-sm mt-4" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            أقل من دقيقة • بدون بطاقة ائتمان • بريدك الإلكتروني فقط
          </p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="max-w-4xl mx-auto px-4 -mt-10 relative z-20">
        <div className="grid grid-cols-3 gap-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 text-center border border-[#c9a84c]/20 shadow-[0_8px_30px_rgba(10,15,30,0.06)]">
              <p className="text-3xl font-black text-[#c9a84c]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>{s.value}</p>
              <p className="text-xs text-[#4a5b78] mt-1" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-black text-[#0a0f1e] text-center mb-12" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          ماذا تحصل عند انضمامك؟
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {BENEFITS.map((b) => (
            <div key={b.title} className="bg-white rounded-2xl p-6 border border-[#c9a84c]/15 shadow-[0_4px_20px_rgba(10,15,30,0.04)] hover:shadow-[0_8px_30px_rgba(10,15,30,0.08)] hover:border-[#c9a84c]/30 transition-all">
              <span className="text-2xl">{b.emoji}</span>
              <h3 className="text-[#0a0f1e] font-bold mt-3 mb-2" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>{b.title}</h3>
              <p className="text-sm text-[#4a5b78] leading-relaxed" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Social proof: Portfolio ── */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <h2 className="text-3xl font-black text-[#0a0f1e] text-center mb-4" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          مشاريع بناها فريقنا ومتدربونا
        </h2>
        <p className="text-[#4a5b78] text-center mb-10 text-sm" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          أدوات حقيقية تم بناؤها داخل مرفأ وتعمل اليوم في السوق السعودي
        </p>
        <div className="grid md:grid-cols-3 gap-5">
          {PORTFOLIO.map((p) => (
            <div key={p.name} className="bg-white rounded-2xl p-6 border border-[#c9a84c]/20 shadow-[0_4px_20px_rgba(10,15,30,0.04)]">
              <span className="text-3xl">{p.icon}</span>
              <h3 className="text-[#0a0f1e] font-bold mt-3 mb-2" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>{p.name}</h3>
              <p className="text-sm text-[#4a5b78] leading-relaxed" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>{p.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/portfolio" className="text-sm font-bold text-[#c9a84c] hover:text-[#d4a843] transition-colors" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            استكشف جميع المشاريع ←
          </Link>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="max-w-2xl mx-auto px-4 pb-24">
        <RegistrationBanner variant="hero" context="home" />
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-3xl mx-auto px-4 pb-24">
        <h2 className="text-2xl font-black text-[#0a0f1e] text-center mb-8" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          أسئلة شائعة
        </h2>
        <div className="space-y-3">
          {[
            { q: 'هل التسجيل في مرفأ مجاني؟', a: 'نعم — التسجيل مجاني بالكامل. كل الأدوات الأساسية مجانية: مستشار 360°، خطاب المصعد، المجلس الاستشاري، ومركز المعرفة.' },
            { q: 'ماذا أحتاج للتسجيل؟', a: 'بريدك الإلكتروني ورقم جوالك فقط. لا تحتاج بطاقة ائتمان أو أي مستندات.' },
            { q: 'كيف يعمل المجلس الاستشاري؟', a: 'كل جمعة لقاء تدريبي يناقش حالة دراسية من الواقع. بعد اللقاء، تجيب على سؤال الحالة — ويقيّمك المستشار بدرجة من ٥. تقييمك الشهري يظهر في لوحة التحكم.' },
            { q: 'هل يمكنني استخدام الأدوات بدون تسجيل؟', a: 'بعض الأدوات تتطلب تسجيل الدخول لحفظ تقدمك وتحليلاتك. المجلس الاستشاري والتقييمات الشهرية تتطلب حساباً.' },
            { q: 'من المستشارون في المجلس؟', a: 'المجلس الاستشاري يرأسه د. ريمي أرباوي — مستشار معتمد في ريادة الأعمال وتقييم المشاريع.' },
          ].map((faq, i) => (
            <details key={i} className="bg-white rounded-2xl border border-[#c9a84c]/15 shadow-[0_4px_20px_rgba(10,15,30,0.04)] group">
              <summary className="p-5 cursor-pointer text-[#0a0f1e] font-bold text-sm list-none flex items-center justify-between" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                {faq.q}
                <span className="text-[#c9a84c] text-lg transition-transform group-open:rotate-180">▾</span>
              </summary>
              <p className="px-5 pb-5 text-sm text-[#4a5b78] leading-relaxed" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      <StickyJoinCTA />
    </main>
  );
}
