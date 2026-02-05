import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-cream font-sans relative overflow-hidden" dir="rtl">

      {/* Subtle Background Patterns - Luxury Gold Dust Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.03),transparent_70%)] pointer-events-none"></div>

      {/* Main Content */}
      <main className="relative min-h-screen flex flex-col pt-32 pb-16 px-4 max-w-7xl mx-auto">

        {/* Hero Section */}
        <div className="text-center mb-20 space-y-8 animate-fade-in-up relative">
          {/* Animated Glow - Warm Gold */}
          <div className="absolute -top-[50%] left-1/2 -translate-x-1/2 w-[60%] h-[60%] bg-gold/5 blur-[120px] rounded-full animate-pulse pointer-events-none"></div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 text-gold text-sm font-bold mb-4">
            🚀 <span className="tracking-wide uppercase">منصة الاستثمار الذكي في المملكة</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-deep-navy tracking-tight leading-tight">
            أين تقع في عالم
            <br />
            <span className="text-luxury-gold inline-block mt-2">الاستثمار؟</span>
          </h1>

          <p className="text-lg md:text-xl text-deep-navy/70 max-w-2xl mx-auto leading-relaxed font-medium">
            منصة مرفأ هي الجسر الذكي الذي يربط بين رأس المال الجريء، والأفكار الاستثنائية
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-12">
            <Link href="/register?type=investor"
              className="px-10 py-5 bg-deep-navy text-gold text-lg font-black rounded-2xl hover:bg-primary-dark hover:scale-105 hover:shadow-2xl hover:shadow-gold/20 transition-all duration-300 border border-gold/30">
              أنا مستثمر
            </Link>
            <Link href="/register?type=entrepreneur"
              className="px-10 py-5 bg-white text-deep-navy border-2 border-gold/50 text-lg font-black rounded-2xl hover:bg-gold/5 hover:scale-105 hover:shadow-xl transition-all duration-300">
              لدي فكرة مشروع
            </Link>
          </div>
        </div>

        {/* The Two Pathways - Enhanced Design */}
        <div className="grid md:grid-cols-2 gap-8 w-full max-w-6xl mx-auto mb-24">

          {/* Pathway 1: Entrepreneur */}
          <Link href="/marfa" className="group relative overflow-hidden rounded-3xl h-[480px] shadow-xl hover:shadow-2xl transition-all duration-500 bg-white border border-gold/10">
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
                <h2 className="text-4xl font-bold text-deep-navy mb-4 font-luxury">لدي فكرة مشروع</h2>
                <p className="text-deep-navy/80 text-lg leading-relaxed">
                  هل تبحث عن تمويل؟ أو تريد التأكد من جدوى فكرتك؟
                  <br />
                  <span className="text-gold-dark font-bold">ابدأ رحلتك هنا لتحويل الفكرة إلى شركة ناشئة</span>
                </p>
              </div>

              <div className="flex items-center gap-3 px-6 py-4 bg-gold/5 text-deep-navy rounded-xl font-bold group-hover:bg-deep-navy group-hover:text-gold transition-all duration-300 shadow-sm border border-gold/10">
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

        {/* Featured Service: Pitch Deck */}
        <div className="max-w-6xl mx-auto w-full mb-24 animate-fade-in-up">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold text-deep-navy mb-2 font-luxury">أدوات متميزة للنجاح</h3>
            <p className="text-deep-navy/60">خدمات احترافية لتسريع رحلتك الاستثمارية</p>
          </div>

          <Link href="/services/pitch-deck" className="block group">
            <div className="bg-gradient-to-r from-gold via-gold-dark to-gold rounded-3xl p-[1.5px] shadow-2xl hover:shadow-gold/20 transition-all duration-500">
              <div className="bg-white rounded-[calc(1.5rem-2px)] p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="text-right flex-1">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold/10 border border-gold/20 text-gold-dark rounded-full text-sm font-bold mb-4">
                      ⭐️ <span className="uppercase tracking-widest">خدمة حصرية</span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black text-deep-navy mb-4">
                      صانع العروض الاستثمارية
                      <span className="text-gold-dark"> .AI</span>
                    </h3>
                    <p className="text-deep-navy/80 text-lg mb-6 max-w-xl leading-relaxed">
                      لا تملك الوقت لتصميم عرضك؟ دعنا نقوم بذلك نيابة عنك باستخدام أحدث تقنيات الذكاء الاصطناعي لتوليد محتوى احترافي ومقنع
                    </p>
                    <div className="flex items-center gap-6">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-deep-navy">2,500</span>
                        <span className="text-sm text-deep-navy/50 font-bold uppercase">SAR</span>
                      </div>
                      <div className="px-8 py-3 bg-deep-navy text-gold rounded-full font-bold group-hover:bg-primary-dark transition-all duration-300 shadow-xl border border-gold/20">
                        اطلب الخدمة الآن
                      </div>
                    </div>
                  </div>

                  <div className="w-48 h-48 bg-cream rounded-3xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner border border-gold/10">
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
