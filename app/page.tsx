import Link from 'next/link';
import ShipHero from './components/ShipHero';
import AuthAwarePathway from './components/AuthAwarePathway';
import AuthAwareLinks from './components/AuthAwareLinks';
import PortfolioTeaser from './components/PortfolioTeaser';
import RegistrationBanner from './components/marfa/RegistrationBanner';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0f1e] relative overflow-hidden" dir="rtl">

      {/* Subtle Background Patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(201,168,76,0.03),transparent_70%)] pointer-events-none"></div>

      {/* Main Content */}
      <main className="relative min-h-screen flex flex-col pt-32 pb-16 px-4 max-w-7xl mx-auto">

        {/* Hero Section */}
        <div className="relative text-center mb-20 space-y-8 animate-fade-in-up" style={{
          background: 'linear-gradient(180deg, #0a0f1e 0%, #0d1628 65%, #0a0f1e 100%)',
          margin: '-8rem -2rem 5rem -2rem',
          padding: '8rem 2rem 6rem 2rem',
          borderRadius: '0 0 3rem 3rem',
        }}>
          <ShipHero />

          <div className="absolute -top-[50%] left-1/2 -translate-x-1/2 w-[60%] h-[60%] bg-[#c9a84c]/5 blur-[80px] rounded-full animate-pulse pointer-events-none transform-gpu" style={{ transform: 'translateZ(0)', zIndex: 0 }}></div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/20 text-[#c9a84c] text-sm font-bold mb-4 relative" style={{ zIndex: 1 }}>
            🚀 <span className="tracking-wide uppercase">ما الذي يجعل مرفأ مختلفاً؟</span>
          </div>

          <h1 className="text-[clamp(1.5rem,4vw,2.5rem)] md:text-7xl font-black tracking-tight leading-tight relative" style={{ zIndex: 1, marginTop: '3rem' }}>
            <span style={{ color: '#c9a84c', fontWeight: 900 }}>مرفأ — </span>
            <span style={{ color: '#ffffff', fontWeight: 900 }}>حيث تَرسو الطموحات.</span>
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

          <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-medium relative" style={{ color: '#a0aec0', lineHeight: 1.75, zIndex: 1 }}>
            لسنا مجرد منصة. نحن الوجهة التي يصل إليها{' '}
            <span style={{ color: '#c9a84c', fontWeight: 700 }}>كل مشروع استثنائي</span>{' '}
            يبدأ منها رحلته من فكرة إلى منتج — و
            <span style={{ color: '#c9a84c', fontWeight: 700 }}>يبني معه إرثاً</span>.
            <br />
            المساحة التي تتحول فيها الأفكار إلى منتجات حقيقية بالتدريب والأدوات الذكية.
          </p>

          <AuthAwareLinks />
        </div>

        {/* Entrepreneur Pathway */}
        <div className="w-full max-w-2xl mx-auto mb-24">
          <AuthAwarePathway
            label="لدي فكرة مشروع"
            subLabel="هل لديك فكرة وتريد تحويلها لمشروع؟ أو تريد التأكد من جدوى فكرتك؟ ابدأ رحلتك هنا لتحويل الفكرة إلى شركة ناشئة"
            icon="💡"
            protectedHref="/marfa"
            variant="light"
          />
        </div>

        {/* Registration campaign — converts anonymous visitors */}
        <div className="max-w-2xl mx-auto mb-24">
          <RegistrationBanner variant="hero" context="home" />
        </div>

        {/* Portfolio Teaser */}
        <PortfolioTeaser />

        {/* Elevator Speech Trainer */}
        <div className="max-w-6xl mx-auto w-full mb-24 animate-fade-in-up">
          <div className="relative overflow-hidden rounded-3xl bg-[#0d1628] border border-[#1a2540] shadow-xl">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03]">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] h-[500px] rounded-full border-[60px] border-[#c9a84c]"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[300px] h-[300px] rounded-full border-[30px] border-[#c9a84c]"></div>
            </div>

            <div className="relative z-10 p-8 md:p-12">
              <div className="flex flex-col lg:flex-row items-center gap-10">
                <div className="shrink-0">
                  <div className="relative w-48 h-48 md:w-56 md:h-56">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="54" fill="none" stroke="#1a2540" strokeWidth="8" />
                      <circle cx="60" cy="60" r="54" fill="none" stroke="url(#goldGradHome)" strokeWidth="8"
                        strokeDasharray="339.292" strokeDashoffset="0" strokeLinecap="round"
                        className="transition-all duration-1000" />
                      <defs>
                        <linearGradient id="goldGradHome" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#c9a84c" />
                          <stop offset="100%" stopColor="#d4a843" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-5xl md:text-6xl font-black text-white tabular-nums">20</span>
                      <span className="text-sm font-bold text-[#c9a84c] mt-1">ثانية</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 text-right">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#c9a84c]/10 border border-[#c9a84c]/20 text-[#c9a84c] rounded-full text-sm font-bold mb-4">
                    🎙️ <span className="uppercase tracking-widest">مجاني تماماً — Free</span>
                  </div>

                  <h3 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
                    خطاب المصعد في
                    <span className="text-[#c9a84c]"> 20 ثانية</span>
                  </h3>

                  <p className="text-[#a0aec0] text-lg mb-4 max-w-xl leading-relaxed">
                    تدرّب على تقديم نفسك أو مشروعك في 20 ثانية فقط. ذكاء اصطناعي يكتب خطابك، يوقّتك، ويقيّم أداءك — مجاناً.
                  </p>

                  <div className="flex flex-wrap gap-3 mb-6">
                    {[
                      { icon: '✨', text: 'توليد الخطاب بالذكاء الاصطناعي' },
                      { icon: '⏱️', text: 'مؤقت 20 ثانية للتدريب' },
                      { icon: '📊', text: 'تقييم فوري ونصائح تحسين' },
                      { icon: '📋', text: 'أمثلة جاهزة للممارسة' },
                    ].map((f, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0a0f1e] rounded-lg text-sm font-medium text-[#a0aec0] border border-[#1a2540]">
                        {f.icon} {f.text}
                      </span>
                    ))}
                  </div>

                  <a
                    href="/marfa/elevator-speech"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-[#c9a84c] text-[#0a0f1e] rounded-xl font-bold text-lg hover:bg-[#d4a843] transition-all duration-300 shadow-lg hover:shadow-[#c9a84c]/20 group"
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

        {/* Marfa 360° Advisor */}
        <div className="max-w-6xl mx-auto w-full mb-24 animate-fade-in-up">
          <div className="relative overflow-hidden rounded-3xl bg-[#0d1628] border border-[#1a2540] shadow-xl">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03]">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] h-[500px] rounded-full border-[60px] border-[#c9a84c]"></div>
            </div>
            <div className="relative z-10 p-8 md:p-12">
              <div className="flex flex-col lg:flex-row items-center gap-10">
                <div className="shrink-0">
                  <div className="relative w-48 h-48 md:w-56 md:h-56">
                    <svg className="w-full h-full" viewBox="0 0 120 120">
                      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
                        const col = ['#c9a84c','#d4a843','#d4a843','#c9a84c','#d4a843','#c9a84c'][i]
                        const start = (angle - 90) * Math.PI / 180
                        const end = (angle - 30) * Math.PI / 180
                        const r = 54, cx = 60, cy = 60
                        return (
                          <path
                            key={i}
                            d={`M${cx},${cy} L${cx + r * Math.cos(start)},${cy + r * Math.sin(start)} A${r},${r} 0 0,1 ${cx + r * Math.cos(end)},${cy + r * Math.sin(end)} Z`}
                            fill={col}
                            opacity="0.6"
                            stroke="#1a2540" strokeWidth="0.5"
                          />
                        )
                      })}
                      <circle cx="60" cy="60" r="22" fill="#0d1628" stroke="#c9a84c" strokeWidth="1.5" />
                      <text x="60" y="57" textAnchor="middle" fill="#c9a84c" fontSize="10" fontWeight="900">360°</text>
                      <text x="60" y="69" textAnchor="middle" fill="#a0aec0" fontSize="6">مستشار</text>
                    </svg>
                  </div>
                </div>

                <div className="flex-1 text-right">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#c9a84c]/10 border border-[#c9a84c]/20 text-[#c9a84c] rounded-full text-sm font-bold mb-4">
                    🧠 <span className="uppercase tracking-widest">مجاني — Free</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
                    Marfa 360°
                    <span className="text-[#c9a84c]"> مستشار استراتيجي</span>
                  </h3>
                  <p className="text-[#a0aec0] text-lg mb-4 max-w-xl leading-relaxed">
                    حلّل فكرة مشروعك من 6 زوايا استراتيجية. نموذج عمل تجاري احترافي + خطة تسويقية كاملة بالذكاء الاصطناعي — خلال دقائق.
                  </p>
                  <div className="flex flex-wrap gap-3 mb-6">
                    {[
                      { icon: '🔍', text: 'تحليل ٣٦٠° لفكرتك' },
                      { icon: '📋', text: 'نموذج العمل التجاري' },
                      { icon: '📈', text: 'خطة تسويقية متكاملة' },
                      { icon: '💾', text: 'حفظ التحليل في ملفك' },
                    ].map((f, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0a0f1e] rounded-lg text-sm font-medium text-[#a0aec0] border border-[#1a2540]">
                        {f.icon} {f.text}
                      </span>
                    ))}
                  </div>
                  <a
                    href="/advisor"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-[#c9a84c] text-[#0a0f1e] rounded-xl font-bold text-lg hover:bg-[#d4a843] transition-all duration-300 shadow-lg hover:shadow-[#c9a84c]/20 group"
                  >
                    <span>جرّب المستشار الآن</span>
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
            <h3 className="text-3xl font-bold text-white mb-2">أدوات متميزة للنجاح</h3>
            <p className="text-[#a0aec0]">خدمات احترافية لتسريع رحلتك الريادية</p>
          </div>

          <Link href="/services/pitch-deck" className="block group">
            <div className="bg-gradient-to-r from-[#c9a84c] via-[#d4a843] to-[#c9a84c] rounded-3xl p-[1.5px] shadow-2xl hover:shadow-[#c9a84c]/20 transition-all duration-500">
              <div className="bg-[#0d1628] rounded-[calc(1.5rem-2px)] p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#c9a84c]/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="text-right flex-1">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#c9a84c]/10 border border-[#c9a84c]/20 text-[#c9a84c] rounded-full text-sm font-bold mb-4">
                      ⭐️ <span className="uppercase tracking-widest">خدمة حصرية</span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black text-white mb-4">
                      صانع العروض الاستثمارية
                      <span className="text-[#c9a84c]"> .AI</span>
                    </h3>
                    <p className="text-[#a0aec0] text-lg mb-6 max-w-xl leading-relaxed">
                      لا تملك الوقت لتصميم عرضك؟ دعنا نقوم بذلك نيابة عنك باستخدام أحدث تقنيات الذكاء الاصطناعي لتوليد محتوى احترافي ومقنع
                    </p>
                    <div className="flex items-center gap-6">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-white">2,500</span>
                        <span className="text-sm text-[#a0aec0] font-bold uppercase">SAR</span>
                      </div>
                      <div className="px-8 py-3 bg-[#c9a84c] text-[#0a0f1e] rounded-full font-bold hover:bg-[#d4a843] transition-all duration-300 shadow-xl">
                        اطلب الخدمة الآن
                      </div>
                    </div>
                  </div>

                  <div className="w-48 h-48 bg-[#0a0f1e] rounded-3xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner border border-[#1a2540]">
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
