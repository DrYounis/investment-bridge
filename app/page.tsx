import Link from 'next/link';
import Image from 'next/image';
import AuthAwareLinks from './components/AuthAwareLinks';
import ShipHero from './components/ShipHero';

export default async function Home() {
  return (
    <div className="min-h-screen bg-cream font-sans relative overflow-hidden" dir="rtl">

      {/* Subtle Background Patterns - Luxury Gold Dust Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.03),transparent_70%)] pointer-events-none"></div>

      {/* Main Content */}
      <main className="relative min-h-screen flex flex-col pt-32 pb-16 px-4 max-w-7xl mx-auto">

        {/* Hero Section — dark navy night sky backdrop for the ship scene */}
        <div className="relative text-center mb-20 space-y-8 animate-fade-in-up" style={{
          background: 'linear-gradient(180deg, #0A192F 0%, #0d1a35 65%, #0A192F 100%)',
          margin: '-8rem -2rem 5rem -2rem',
          padding: '8rem 2rem 6rem 2rem',
          borderRadius: '0 0 3rem 3rem',
        }}>
          {/* Ship Hero animated scene */}
          <ShipHero />

          {/* Animated Glow - Warm Gold */}
          <div className="absolute -top-[50%] left-1/2 -translate-x-1/2 w-[60%] h-[60%] bg-gold/5 blur-[120px] rounded-full animate-pulse pointer-events-none" style={{ zIndex: 0 }}></div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 text-gold text-sm font-bold mb-4 relative" style={{ zIndex: 1 }}>
            🚀 <span className="tracking-wide uppercase">ما الذي يجعل مرفأ مختلفاً؟</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight relative" style={{ zIndex: 1 }}>
            <span style={{ color: '#c9a84c', fontWeight: 900 }}>مرفأ — </span>
            <span style={{ color: '#f0ead6', fontWeight: 900 }}>حيث تَرسو الطموحات.</span>
          </h1>

          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            fontWeight: 700,
            color: '#c9a84c',
            fontSize: '1.15rem',
            marginTop: '2.5rem',
            marginBottom: '1.25rem',
            direction: 'ltr',
            textAlign: 'right',
            position: 'relative',
            zIndex: 1,
          }}>
            Where Ambitions Anchor.
          </p>

          <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-medium relative" style={{ color: '#8a9bb8', lineHeight: 1.75, zIndex: 1 }}>
            لسنا مجرد منصة. نحن الوجهة التي يصل إليها{' '}
            <span style={{ color: '#c9a84c', fontWeight: 700 }}>كل مشروع استثنائي</span>{' '}
            باحثاً عن شريك يؤمن بطموحاته — و
            <span style={{ color: '#c9a84c', fontWeight: 700 }}>يبني معه إرثاً</span>.
            <br />
            الجسر الذكي بين رأس المال الجريء والأفكار التي تُغيّر المشهد الاستثماري في المنطقة.
          </p>

          {/* Action Buttons */}
          <div className="relative" style={{ zIndex: 1 }}>
            <AuthAwareLinks />
          </div>
        </div>

        {/* The Two Pathways - Enhanced Design */}
        <div className="grid md:grid-cols-2 gap-8 w-full max-w-6xl mx-auto mb-24">

          {/* Pathway 1: Entrepreneur */}
          <Link href="/marfa" className="group relative overflow-hidden rounded-3xl h-[480px] shadow-xl hover:shadow-2xl transition-all duration-500 bg-white dark:bg-gray-900 border border-gold/10">
            {/* Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Floating Decorative Elements */}
            <div className="absolute top-8 right-8 w-20 h-20 bg-gold/5 rounded-2xl rotate-12 group-hover:rotate-45 transition-transform duration-700"></div>
            <div className="absolute bottom-12 left-8 w-16 h-16 bg-gold/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>

            <div className="relative z-10 p-10 h-full flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 bg-gradient-to-br from-gold to-gold-dark text-deep-navy rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg shadow-gold/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  💡
                </div>
                <h2 className="text-4xl font-bold text-deep-navy dark:text-white mb-4 font-luxury">لدي فكرة مشروع</h2>
                <p className="text-deep-navy/80 dark:text-white/80 text-lg leading-relaxed">
                  هل تبحث عن تمويل؟ أو تريد التأكد من جدوى فكرتك؟
                  <br />
                  <span className="text-gold-dark font-bold">ابدأ رحلتك هنا لتحويل الفكرة إلى شركة ناشئة</span>
                </p>
              </div>

              <div className="flex items-center gap-3 px-6 py-4 bg-gold/5 text-deep-navy dark:text-white rounded-xl font-bold group-hover:bg-deep-navy group-hover:text-gold dark:group-hover:bg-gold dark:group-hover:text-deep-navy transition-all duration-300 shadow-sm border border-gold/10">
                <span>دخول رواد الأعمال</span>
                <svg className="w-5 h-5 transition-transform group-hover:-translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Pathway 2: Investor */}
          <Link href="/dashboard/investor" className="group relative overflow-hidden rounded-3xl h-[480px] shadow-xl hover:shadow-2xl transition-all duration-500 bg-deep-navy border border-gold/20">
            {/* Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Floating Decorative Elements */}
            <div className="absolute top-8 left-8 w-20 h-20 bg-white/5 rounded-2xl -rotate-12 group-hover:-rotate-45 transition-transform duration-700"></div>
            <div className="absolute bottom-12 right-8 w-16 h-16 bg-gold/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>

            <div className="relative z-10 p-10 h-full flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 bg-gradient-to-br from-gold to-gold-dark text-deep-navy rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg shadow-gold/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  📈
                </div>
                <h2 className="text-4xl font-bold text-luxury-gold mb-4 font-luxury">أنا مستثمر</h2>
                <p className="text-gold-light/90 text-lg leading-relaxed">
                  اكتشف فرصاً استثمارية مدروسة ومفلترة بعناية
                  <br />
                  <span className="text-gold font-bold">لوحة تحكم ذكية لعرض العائد وتحليل المخاطر</span>
                </p>
              </div>

              <div className="flex items-center gap-3 px-6 py-4 bg-white/5 text-gold rounded-xl font-bold group-hover:bg-gold group-hover:text-deep-navy transition-all duration-300 shadow-sm border border-gold/20">
                <span>دخول المستثمرين</span>
                <svg className="w-5 h-5 transition-transform group-hover:-translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        {/* Elevator Speech Trainer — 20-Second Challenge */}
        <div className="max-w-6xl mx-auto w-full mb-24 animate-fade-in-up">
          <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-gray-900 border border-gold/10 shadow-xl">
            {/* Background animated timer rings */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03]">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border-[60px] border-deep-navy"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border-[30px] border-gold"></div>
            </div>

            <div className="relative z-10 p-8 md:p-12">
              <div className="flex flex-col lg:flex-row items-center gap-10">
                {/* Left: Visual Timer Display */}
                <div className="shrink-0">
                  <div className="relative w-48 h-48 md:w-56 md:h-56">
                    {/* Outer ring */}
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="54" fill="none" stroke="#f0f0ec" strokeWidth="8" />
                      <circle cx="60" cy="60" r="54" fill="none" stroke="url(#goldGradient)" strokeWidth="8"
                        strokeDasharray="339.292" strokeDashoffset="0" strokeLinecap="round"
                        className="transition-all duration-1000" />
                      <defs>
                        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#D4AF37" />
                          <stop offset="100%" stopColor="#B8941F" />
                        </linearGradient>
                      </defs>
                    </svg>
                    {/* Center text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-5xl md:text-6xl font-black text-deep-navy dark:text-white tabular-nums">20</span>
                      <span className="text-sm font-bold text-gold-dark mt-1">ثانية</span>
                    </div>
                  </div>
                </div>

                {/* Right: Content */}
                <div className="flex-1 text-right">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 border border-green-200 text-green-700 rounded-full text-sm font-bold mb-4">
                    🎙️ <span className="uppercase tracking-widest">مجاني تماماً — Free</span>
                  </div>

                  <h3 className="text-3xl md:text-4xl font-black text-deep-navy dark:text-white mb-4 leading-tight">
                    خطاب المصعد في
                    <span className="text-gold-dark"> 20 ثانية</span>
                  </h3>

                  <p className="text-deep-navy/70 dark:text-gray-300 text-lg mb-4 max-w-xl leading-relaxed">
                    تدرّب على تقديم نفسك أو مشروعك في 20 ثانية فقط. ذكاء اصطناعي يكتب خطابك، يوقّتك، ويقيّم أداءك — مجاناً.
                  </p>

                  {/* Mini feature bullets */}
                  <div className="flex flex-wrap gap-3 mb-6">
                    {[
                      { icon: '✨', text: 'توليد الخطاب بالذكاء الاصطناعي' },
                      { icon: '⏱️', text: 'مؤقت 20 ثانية للتدريب' },
                      { icon: '📊', text: 'تقييم فوري ونصائح تحسين' },
                      { icon: '📋', text: 'أمثلة جاهزة للممارسة' },
                    ].map((f, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cream dark:bg-gray-800 rounded-lg text-sm font-medium text-deep-navy/80 dark:text-gray-200 border border-gold/5">
                        {f.icon} {f.text}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <a
                    href="/marfa/elevator-speech.html"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-deep-navy to-[#1a2a4a] text-gold rounded-xl font-bold text-lg hover:from-gold hover:to-gold-dark hover:text-deep-navy transition-all duration-300 shadow-lg hover:shadow-gold/20 border border-gold/10 group"
                  >
                    <span>جرّبها الآن مجاناً</span>
                    <svg className="w-5 h-5 transition-transform group-hover:-translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Service: Pitch Deck */}
        <div className="max-w-6xl mx-auto w-full mb-24 animate-fade-in-up">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold text-deep-navy dark:text-white mb-2 font-luxury">أدوات متميزة للنجاح</h3>
            <p className="text-deep-navy/60 dark:text-gray-300">خدمات احترافية لتسريع رحلتك الاستثمارية</p>
          </div>

          <Link href="/services/pitch-deck" className="block group">
            <div className="bg-gradient-to-r from-gold via-gold-dark to-gold rounded-3xl p-[1.5px] shadow-2xl hover:shadow-gold/20 transition-all duration-500">
              <div className="bg-white dark:bg-gray-900 rounded-[calc(1.5rem-2px)] p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="text-right flex-1">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold/10 border border-gold/20 text-gold-dark rounded-full text-sm font-bold mb-4">
                      ⭐️ <span className="uppercase tracking-widest">خدمة حصرية</span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black text-deep-navy dark:text-white mb-4">
                      صانع العروض الاستثمارية
                      <span className="text-gold-dark"> .AI</span>
                    </h3>
                    <p className="text-deep-navy/80 dark:text-gray-300 text-lg mb-6 max-w-xl leading-relaxed">
                      لا تملك الوقت لتصميم عرضك؟ دعنا نقوم بذلك نيابة عنك باستخدام أحدث تقنيات الذكاء الاصطناعي لتوليد محتوى احترافي ومقنع
                    </p>
                    <div className="flex items-center gap-6">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-deep-navy dark:text-white">2,500</span>
                        <span className="text-sm text-deep-navy/50 dark:text-gray-400 font-bold uppercase">SAR</span>
                      </div>
                      <div className="px-8 py-3 bg-deep-navy text-gold rounded-full font-bold group-hover:bg-primary-dark transition-all duration-300 shadow-xl border border-gold/20">
                        اطلب الخدمة الآن
                      </div>
                    </div>
                  </div>

                  <div className="w-48 h-48 bg-cream dark:bg-gray-800 rounded-3xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner border border-gold/10">
                    <span className="text-8xl">📊</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

      </main>
    </div>
  );
}
