import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'تواصل معنا | مرفأ',
  description: 'تواصل مع فريق مرفأ — البريد الإلكتروني للمنصة، الرئيس التنفيذي، والمستشار الأول.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#faf8f2]" dir="rtl">
      <main className="max-w-3xl mx-auto pt-32 pb-16 px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 rounded-full bg-[#faf8f2] border border-[#c9a84c]/30 text-[#c9a84c] text-xs font-bold mb-3">
            📬 تواصل معنا
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-[#0a0f1e]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            تواصل مع <span className="text-[#c9a84c]">مرفأ</span>
          </h1>
          <p className="text-[#64748b] mt-2 text-lg" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            فريق مرفأ جاهز للرد على استفساراتك
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Platform */}
          <div className="bg-white rounded-2xl p-6 border border-[#c9a84c]/20 shadow-[0_8px_30px_rgba(10,15,30,0.04)] text-center">
            <div className="text-4xl mb-4">⚓</div>
            <h3 className="font-bold text-[#0a0f1e] text-lg mb-2" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
              المنصة
            </h3>
            <p className="text-sm text-[#4a5b78] mb-4" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
              للاستفسارات العامة والدعم الفني
            </p>
            <a
              href="mailto:info@marfa.sa"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#fdf9ef] border border-[#c9a84c]/30 rounded-full text-[#c9a84c] text-sm font-bold hover:bg-[#c9a84c]/10 transition"
            >
              ✉️ info@marfa.sa
            </a>
          </div>

          {/* CEO */}
          <div className="bg-white rounded-2xl p-6 border border-[#c9a84c]/20 shadow-[0_8px_30px_rgba(10,15,30,0.04)] text-center">
            <div className="text-4xl mb-4">👨‍💼</div>
            <h3 className="font-bold text-[#0a0f1e] text-lg mb-2" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
              الرئيس التنفيذي
            </h3>
            <p className="text-sm text-[#4a5b78] mb-1" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
              د. محمد يونس
            </p>
            <p className="text-xs text-[#8a94a8] mb-4" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
              Dr Mohamad Younis
            </p>
            <a
              href="mailto:ceo@marfa.sa"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#fdf9ef] border border-[#c9a84c]/30 rounded-full text-[#c9a84c] text-sm font-bold hover:bg-[#c9a84c]/10 transition"
            >
              ✉️ ceo@marfa.sa
            </a>
          </div>

          {/* Advisor */}
          <div className="bg-white rounded-2xl p-6 border border-[#c9a84c]/20 shadow-[0_8px_30px_rgba(10,15,30,0.04)] text-center">
            <div className="text-4xl mb-4">🏛️</div>
            <h3 className="font-bold text-[#0a0f1e] text-lg mb-2" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
              المستشار الأول
            </h3>
            <p className="text-sm text-[#4a5b78] mb-1" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
              د. ريمي أرباوي
            </p>
            <p className="text-xs text-[#8a94a8] mb-4" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
              Dr Remy Arbaoui
            </p>
            <a
              href="mailto:remy.arbaoui@marfa.sa"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#fdf9ef] border border-[#c9a84c]/30 rounded-full text-[#c9a84c] text-sm font-bold hover:bg-[#c9a84c]/10 transition"
            >
              ✉️ remy.arbaoui@marfa.sa
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
