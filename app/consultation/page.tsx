import type { Metadata } from 'next';
import ConsultationForm from './ConsultationForm';

export const metadata: Metadata = {
  title: 'استشارة خاصة | مرفأ',
  description: 'جلسة استشارية خاصة — ٧٥ دقيقة: ٦٠ دقيقة استشارة + ١٥ دقيقة مجانية. السعر: ٢٠$ لأول مرة، ١٠٠$ للجلسات التالية.',
  openGraph: {
    title: 'استشارة خاصة | مرفأ',
    description: 'جلسة استشارية خاصة مع د. محمد يونس — حلل فكرتك، خطط لمشروعك، واحصل على توجيه مباشر.',
    url: 'https://www.marfa.sa/consultation',
  },
};

export default function ConsultationPage() {
  return (
    <main className="min-h-screen bg-[#faf8f2]" dir="rtl">
      {/* Hero */}
      <section className="bg-[#0a0f1e] pt-32 pb-20 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[60%] bg-[#c9a84c]/5 blur-[100px] rounded-full" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/20 text-[#c9a84c] text-sm font-bold mb-6">
            🎯 استشارة خاصة — One-on-One
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            استشارة خاصة —<br />
            <span className="text-[#c9a84c]">حلّل فكرتك وخطط لمشروعك</span>
          </h1>
          <p className="text-[#a0aec0] text-lg max-w-xl mx-auto leading-relaxed" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            جلسة مباشرة مع خبير ريادة الأعمال — ٧٥ دقيقة كاملة تشمل ١٥ دقيقة مجانية لتقييم فكرتك
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-4xl mx-auto px-4 -mt-10 relative z-20">
        <div className="grid md:grid-cols-2 gap-6">
          {/* First time */}
          <div className="bg-white rounded-3xl p-8 border-2 border-[#10b981]/30 shadow-[0_8px_30px_rgba(10,15,30,0.06)] relative overflow-hidden">
            <div className="absolute top-0 left-0 bg-[#10b981] text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl">
              ⭐ العرض الأفضل
            </div>
            <div className="text-center mt-4">
              <h3 className="text-xl font-black text-[#0a0f1e] mb-2" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                🎉 أول استشارة
              </h3>
              <p className="text-[#4a5b78] text-sm mb-4" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                للعملاء الجدد
              </p>

              {/* Duration visual */}
              <div className="flex items-center justify-center gap-1 mb-6">
                <div className="bg-[#10b981]/10 text-[#10b981] text-xs font-bold px-2 py-1 rounded-full">٦٠ د</div>
                <span className="text-[#8a94a8] text-xs">+</span>
                <div className="bg-[#c9a84c]/10 text-[#c9a84c] text-xs font-bold px-2 py-1 rounded-full">١٥ د مجاناً</div>
              </div>

              <div className="text-5xl font-black text-[#0a0f1e] mb-1">
                <span className="text-2xl">$</span>20
              </div>
              <p className="text-[#8a94a8] text-sm mb-6">لمدة ٧٥ دقيقة</p>

              <ul className="text-right space-y-2 mb-8" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                <li className="text-sm text-[#4a5b78] flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span> ٦٠ دقيقة استشارة متخصصة
                </li>
                <li className="text-sm text-[#4a5b78] flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span> ١٥ دقيقة إضافية مجانية
                </li>
                <li className="text-sm text-[#4a5b78] flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span> تقييم أولي للفكرة
                </li>
                <li className="text-sm text-[#4a5b78] flex items-start gap-2">
                  <span className="text-[#10b981]">✓</span> خطة عمل مبدئية
                </li>
              </ul>
            </div>
          </div>

          {/* Returning */}
          <div className="bg-white rounded-3xl p-8 border border-[#c9a84c]/20 shadow-[0_8px_30px_rgba(10,15,30,0.06)]">
            <div className="text-center">
              <h3 className="text-xl font-black text-[#0a0f1e] mb-2" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                🔁 استشارة متابعة
              </h3>
              <p className="text-[#4a5b78] text-sm mb-4" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                للعملاء الحاليين
              </p>

              <div className="flex items-center justify-center gap-1 mb-6">
                <div className="bg-[#c9a84c]/10 text-[#c9a84c] text-xs font-bold px-2 py-1 rounded-full">٧٥ د</div>
              </div>

              <div className="text-5xl font-black text-[#0a0f1e] mb-1">
                <span className="text-2xl">$</span>100
              </div>
              <p className="text-[#8a94a8] text-sm mb-6">لمدة ٧٥ دقيقة</p>

              <ul className="text-right space-y-2 mb-8" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                <li className="text-sm text-[#4a5b78] flex items-start gap-2">
                  <span className="text-[#c9a84c]">✓</span> ٧٥ دقيقة استشارة متخصصة
                </li>
                <li className="text-sm text-[#4a5b78] flex items-start gap-2">
                  <span className="text-[#c9a84c]">✓</span> متابعة تقدم المشروع
                </li>
                <li className="text-sm text-[#4a5b78] flex items-start gap-2">
                  <span className="text-[#c9a84c]">✓</span> مراجعة الاستراتيجية
                </li>
                <li className="text-sm text-[#4a5b78] flex items-start gap-2">
                  <span className="text-[#c9a84c]">✓</span> تحليل التحديات الحالية
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="max-w-2xl mx-auto px-4 py-16">
        <ConsultationForm />
      </section>

      {/* How it works */}
      <section className="max-w-3xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-black text-[#0a0f1e] text-center mb-10" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          كيف تعمل الاستشارة؟
        </h2>
        <div className="space-y-4">
          {[
            { step: '١', title: 'احجز موعدك', desc: 'املأ النموذج واختر الوقت المناسب — سنتواصل معك لتأكيد الموعد.' },
            { step: '٢', title: 'حوّل الرسوم', desc: 'بعد تأكيد الموعد، حوّل المبلغ إلى حساب مرفأ البنكي. التحويل يثبت الحجز.' },
            { step: '٣', title: 'احضر الجلسة', desc: 'الجلسة أونلاين — سنرسل لك رابط الاجتماع قبل الموعد. حضر فكرتك وأسئلتك.' },
            { step: '٤', title: 'استلم الخلاصة', desc: 'بعد الجلسة، نرسل لك ملخصاً مكتوباً بالنقاط الرئيسية وخطة العمل.' },
          ].map((s) => (
            <div key={s.step} className="flex items-start gap-4 bg-white rounded-2xl p-5 border border-[#c9a84c]/15 shadow-[0_4px_16px_rgba(10,15,30,0.03)]">
              <div className="w-10 h-10 rounded-full bg-[#c9a84c] text-[#0a0f1e] flex items-center justify-center font-black text-sm shrink-0">
                {s.step}
              </div>
              <div>
                <h3 className="text-[#0a0f1e] font-bold text-sm mb-1" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>{s.title}</h3>
                <p className="text-[#4a5b78] text-sm leading-relaxed" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bank details */}
      <section className="max-w-2xl mx-auto px-4 pb-20">
        <div className="bg-white rounded-3xl p-8 border border-[#c9a84c]/20 shadow-[0_8px_30px_rgba(10,15,30,0.06)] text-center">
          <h3 className="text-lg font-black text-[#0a0f1e] mb-2" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            🏦 معلومات التحويل البنكي
          </h3>
          <p className="text-sm text-[#4a5b78] mb-4" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            بعد تأكيد حجزك، حوّل المبلغ إلى:
          </p>
          <div className="inline-block text-right bg-[#faf8f2] rounded-2xl p-5 border border-[#c9a84c]/20">
            <p className="text-sm text-[#4a5b78]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>البنك: <strong className="text-[#0a0f1e]">Saudi Awwal Bank (SAB)</strong></p>
            <p className="text-sm text-[#4a5b78] mt-1" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>المستفيد: <strong className="text-[#0a0f1e]">Mohamad Younis</strong></p>
            <p className="text-sm text-[#4a5b78] mt-1" dir="ltr">IBAN: <strong className="text-[#0a0f1e]">SA4745000000163199380001</strong></p>
          </div>
        </div>
      </section>
    </main>
  );
}
