import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'الصيادين — Al-Sayyadeen Venture Collective | مرفأ',
  description: 'الصيادين — مجتمع بناء المشاريع من مرفأ. استشارات لا نهائية، تطوير بالذكاء الاصطناعي، ونموذج Marfa SAFE-Air للتمويل الموحد.',
  openGraph: {
    title: 'الصيادين — Al-Sayyadeen Venture Collective | مرفأ',
    description: 'مجتمع الصيادين من مرفأ: نصطاد الفرص، نبني المشاريع، ونطلقها للسوق السعودي',
    url: 'https://www.marfa.sa/hunters',
  },
};

const DIMENSIONS = [
  { label: 'الهوية', old: 'The Family', new_: 'الصيادين (Al-Sayyadeen)', desc: 'حاضنة سلبية → مجموعة صيد نشطة' },
  { label: 'النموذج التشغيلي', old: 'مساحات فعلية بتكلفة عالية', new_: 'مركز ذكاء اصطناعي عن بُعد', desc: 'بصمة خفيفة، رافعة تقنية عالية' },
  { label: 'الدعم التقني', old: 'خصومات شركاء ونصائح', new_: 'تطوير بالذكاء الاصطناعي و Low-Code', desc: 'بناء MVPs بالوكلاء الأذكياء' },
  { label: 'التمويل', old: 'BSA-Air (سندات قابلة للتحويل)', new_: 'Marfa SAFE-Air', desc: 'قالب تمويل موحد ومخصص للسعودية' },
  { label: 'التعليم', old: 'Koudetat (دورات عامة)', new_: 'Marfa Koudetat', desc: 'كتيّب تنفيذي سعودي للهاكرز والبناة' },
];

export default function HuntersPage() {
  return (
    <main className="min-h-screen bg-[#faf8f2]" dir="rtl">
      {/* Hero */}
      <section className="bg-[#0a0f1e] pt-32 pb-20 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[60%] bg-[#c9a84c]/5 blur-[100px] rounded-full" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/20 text-[#c9a84c] text-sm font-bold mb-6">
            🎯 Al-Sayyadeen
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-4 leading-tight" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            الصيادين
          </h1>
          <p className="text-2xl md:text-3xl font-bold text-[#c9a84c] mb-6" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            Venture Collective
          </p>
          <p className="text-[#a0aec0] text-lg max-w-xl mx-auto leading-relaxed" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            "حاضنة" سلبية. "Family" منغلقة. <strong className="text-white">الصيادين</strong> — مجموعة من البناة والمطورين والمستثمرين
            يصطادون فرص السوق بنشاط، يبنونها، ويطلقونها.
          </p>
        </div>
      </section>

      {/* Philosophy */}
      <section className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl p-8 md:p-10 border border-[#c9a84c]/20 shadow-[0_8px_30px_rgba(10,15,30,0.06)]">
          <div className="text-5xl mb-4">🎯</div>
          <h2 className="text-2xl font-black text-[#0a0f1e] mb-4" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            لماذا الصيادين؟
          </h2>
          <p className="text-[#4a5b78] leading-relaxed mb-4">
            الحاضنات تُدفئ البيض. العائلات تحمي نفسها. <strong className="text-[#0a0f1e]">الصيادون يخرجون للصيد.</strong>
          </p>
          <p className="text-[#4a5b78] leading-relaxed">
            مجموعة نخبوية من المؤسسين والمطورين والمستثمرين السعوديين — لا ننتظر الفرص، نصطادها.
            لا نكتفي بالتدريب، نبني ونطلق. معاً، بهدف واحد: الاستحواذ على أسواق
            الرؤية 2030 قبل أن يستيقظ المنافسون.
          </p>
        </div>
      </section>

      {/* The Upgrade */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <h2 className="text-3xl font-black text-[#0a0f1e] text-center mb-10" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          بدأنا من حيث انتهى الآخرون
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[#0a0f1e] text-white">
                <th className="p-3 text-right rounded-tr-xl">البعد</th>
                <th className="p-3 text-right">النموذج التقليدي</th>
                <th className="p-3 text-right">التطور</th>
                <th className="p-3 text-right text-[#c9a84c] rounded-tl-xl">الصيادين (الترقية)</th>
              </tr>
            </thead>
            <tbody>
              {DIMENSIONS.map((d, i) => (
                <tr key={i} className={`border-b border-[#c9a84c]/10 ${i % 2 === 0 ? 'bg-white' : 'bg-[#faf8f2]'}`}>
                  <td className="p-3 font-bold text-[#0a0f1e]">{d.label}</td>
                  <td className="p-3 text-[#64748b] line-through">{d.old}</td>
                  <td className="p-3 text-[#4a5b78]">{d.new_}</td>
                  <td className="p-3 text-[#c9a84c] font-bold">{d.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* SAFE-Air */}
      <section className="max-w-3xl mx-auto px-4 pb-16">
        <div className="bg-[#0a0f1e] rounded-3xl p-8 md:p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[60%] bg-[#c9a84c]/5 blur-[80px] rounded-full" />
          <div className="relative z-10">
            <h2 className="text-2xl font-black text-white mb-4" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
              Marfa SAFE-Air
            </h2>
            <p className="text-[#a0aec0] leading-relaxed mb-6">
              اتفاقية تمويل موحدة ومبسطة — مستوحاة من فلسفة Oussama Ammar في تبسيط
              الاستثمار التأسيسي. لا مفاوضات قانونية معقدة. لا رسوم محاماة تلتهم رأس المال.
              قالب واحد، موقع خلال دقائق.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {['3% حصة مقابل الانضمام', 'قالب موحد — لا مفاوضات', 'متوافق مع نظام الشركات السعودي'].map((f, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-sm text-white font-bold">{f}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <h2 className="text-3xl font-black text-[#0a0f1e] text-center mb-10" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          ماذا يحصل الصياد؟
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { icon: '♾️', title: 'استشارات لا نهائية', desc: '١٠ ساعات أسبوعياً مع فريق مرفأ' },
            { icon: '🤖', title: 'تطوير بالذكاء الاصطناعي', desc: 'بناء MVP بالوكلاء الأذكياء — وفر ٧٠٪ من تكلفة التطوير' },
            { icon: '📜', title: 'Marfa SAFE-Air', desc: 'اتفاقية تمويل موحدة — وقع في دقائق' },
            { icon: '🎯', title: 'شبكة الصيادين', desc: 'وصول لمستثمرين ومؤسسين في مجموعة النخبة' },
            { icon: '📚', title: 'Marfa Koudetat', desc: 'كتيّب تنفيذي — من الـ Hook للإطلاق' },
            { icon: '🚀', title: 'إطلاق للسوق', desc: 'ندفع مشروعك للسوق السعودي فوراً' },
          ].map((p, i) => (
            <div key={i} className="flex items-start gap-4 bg-white rounded-xl p-5 border border-[#c9a84c]/10">
              <span className="text-2xl">{p.icon}</span>
              <div>
                <p className="text-sm text-[#0a0f1e] font-bold mb-1" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>{p.title}</p>
                <p className="text-xs text-[#8a94a8]">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-4 pb-20 text-center">
        <div className="bg-white rounded-3xl p-8 md:p-10 border border-[#c9a84c]/20 shadow-[0_8px_30px_rgba(10,15,30,0.06)]">
          <div className="text-5xl mb-4">🎯</div>
          <h2 className="text-2xl font-black text-[#0a0f1e] mb-3" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            انضم إلى الصيادين
          </h2>
          <p className="text-[#4a5b78] text-sm mb-8">
            المقاعد محدودة. المجموعة نخبوية. نبحث عن مؤسسين مستعدين للصيد، ليس فقط للتدريب.
          </p>
          <a
            href="/consultation"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#c9a84c] text-[#0a0f1e] font-bold text-lg rounded-2xl hover:bg-[#d4a843] transition-colors shadow-lg shadow-[#c9a84c]/20"
          >
            🎯 قدّم طلب الانضمام ←
          </a>
        </div>
      </section>
    </main>
  );
}
