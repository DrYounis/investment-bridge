import type { Metadata } from 'next';
import ConsultationForm from './ConsultationForm';
import EquitySuccessBanner from './EquitySuccessBanner';

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

      {/* About the Consultant */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl p-8 md:p-10 border border-[#c9a84c]/20 shadow-[0_8px_30px_rgba(10,15,30,0.06)]">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-[#c9a84c] to-[#d4a843] rounded-full flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg shadow-[#c9a84c]/20">
              ⚙️
            </div>
            <h2 className="text-2xl font-black text-[#0a0f1e] mb-1" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
              م. أحمد يونس
            </h2>
            <p className="text-[#c9a84c] text-sm font-bold" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
              المدير التقني — مستشار تقني وهندسي
            </p>
          </div>

          <div className="space-y-4 text-right" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            <p className="text-[#4a5b78] leading-relaxed">
              أنا لا أبيع كلام. <strong className="text-[#0a0f1e]">أنا مهندس برمجيات أبني منتجات حقيقية.</strong> في مرفأ، بنيتُ ثلاث منصات تعمل اليوم في السوق السعودي — بصيرة (تحليل المنافسات الحكومية بالذكاء الاصطناعي)، مقياس (تسعير مصانع الألمنيوم)، وبرو ميد إنشور (إدارة المطالبات الطبية).
            </p>

            <p className="text-[#4a5b78] leading-relaxed">
              كل أسبوع، أدير البنية التقنية لـ <strong className="text-[#0a0f1e]">المجلس الاستشاري</strong> — ١٤ لقاء تدريبي. وأدرّس دورة <strong className="text-[#0a0f1e]">Vibe Coding بالعربي</strong> لتعليم رواد الأعمال كيف يبنون منتجاتهم بأنفسهم بدون فريق تقني.
            </p>

            <p className="text-[#4a5b78] leading-relaxed">
              <strong className="text-[#0a0f1e]">الفرق بين اللي يبني واللي ينتظر ليس الميزانية.</strong> الفرق هو: هل تعرف كيف تبني MVP بتكلفة صفر؟ هل تعرف متى تحتاج مبرمج ومتى تقدر تسويها بنفسك؟
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-3 mt-8">
            {[
              { num: '٣', label: 'منتجات مبنية من الصفر' },
              { num: '١٠', label: 'دروس Vibe Coding' },
              { num: '٧٥', label: 'دقيقة معك — وجهاً لوجه' },
            ].map((s) => (
              <div key={s.label} className="text-center bg-[#faf8f2] rounded-xl p-4">
                <p className="text-2xl font-black text-[#c9a84c]">{s.num}</p>
                <p className="text-xs text-[#4a5b78] mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-[#4a5b78] mt-8 leading-relaxed" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            الاستشارة ليست محاضرة. <strong className="text-[#0a0f1e]">هي ساعة تفكير تقني وهندسي على مشروعك أنت.</strong>
            <br />نجيب على السؤال الحقيقي: كيف تبني منتجك غداً؟
          </p>
        </div>
      </section>

      {/* Booking Form */}
      <section className="max-w-2xl mx-auto px-4 py-16">
        <EquitySuccessBanner />
        <ConsultationForm />
      </section>

      {/* How it works */}
      <section className="max-w-3xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-black text-[#0a0f1e] text-center mb-10" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          كيف تعمل الاستشارة؟
        </h2>
        <div className="space-y-4">
          {[
            { step: '١', title: 'احجز استشارتك', desc: 'املأ اسمك وإيميلك وجوالك — واختر نوع الاستشارة (أول مرة أو متابعة).' },
            { step: '٢', title: 'اختر موعدك', desc: 'المواعيد المتاحة تظهر مباشرة — ساعتين فقط يومياً. أيام العمل: ٧-٩ م، الويكند: ٥-٧ م.' },
            { step: '٣', title: 'أكد الحجز وادفع', desc: 'بعد اختيار الموعد، تتواصل مع د. محمد مباشرة عبر واتساب لإتمام الدفع وتأكيد الحجز.' },
            { step: '٤', title: 'احضر الجلسة', desc: 'الجلسة أونلاين — سيتم إرسال رابط الاجتماع. حضر فكرتك وأسئلتك.' },
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

      {/* Direct contact */}
      <section className="max-w-2xl mx-auto px-4 pb-20">
        <div className="bg-white rounded-3xl p-8 border border-[#c9a84c]/20 shadow-[0_8px_30px_rgba(10,15,30,0.06)] text-center">
          <h3 className="text-lg font-black text-[#0a0f1e] mb-2" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            💬 تواصل مباشر
          </h3>
          <p className="text-sm text-[#4a5b78] mb-4" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            للاستفسارات قبل الحجز — م. أحمد يونس:
          </p>
          <a
            href="https://wa.me/966555056545"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#25D366] text-white font-bold text-sm hover:bg-[#1ebe5d] transition-colors shadow-lg shadow-[#25D366]/20"
            style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
          >
            💬 واتساب: 055 505 6545
          </a>
          <p className="text-xs text-[#8a94a8] mt-4" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            أو إيميل: cto@marfa.sa
          </p>
        </div>
      </section>
    </main>
  );
}
