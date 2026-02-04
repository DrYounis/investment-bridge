import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 font-sans relative overflow-hidden" dir="rtl">

      {/* Subtle Background Patterns */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-blue-100/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-100/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      {/* Navbar Minimal */}
      <nav className="absolute top-0 w-full p-6 flex justify-between items-center z-50">
        <div className="flex items-center gap-2">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Image
              src="/images/logo-marfa.png"
              alt="Marfa Logo"
              width={50}
              height={70}
              className="object-contain h-16 w-auto"
            />
          </Link>
        </div>
        <div className="flex gap-3">
          {user ? (
            <Link href="/dashboard/hub" className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold rounded-full hover:shadow-lg hover:shadow-blue-200 transition-all duration-300">
              لوحة التحكم
            </Link>
          ) : (
            <>
              <Link href="/register" className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold rounded-full hover:shadow-lg hover:shadow-blue-200 transition-all duration-300">
                تسجيل جديد
              </Link>
              <Link href="/login" className="px-5 py-2 bg-white/90 backdrop-blur text-sm font-bold text-slate-700 rounded-full hover:bg-white hover:shadow-md transition-all duration-300 border border-slate-200">
                دخول
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative min-h-screen flex flex-col pt-32 pb-16 px-4 max-w-7xl mx-auto">

        {/* Hero Section */}
        <div className="text-center mb-20 space-y-6 animate-fade-in-down">
          <div className="inline-block px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-blue-700 text-sm font-medium mb-4">
            🚀 منصة الاستثمار الذكي في المملكة
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 leading-tight">
            أين تقع في عالم
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 inline-block mt-2">
              الاستثمار؟
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            منصة مرفأ هي الجسر الذكي الذي يربط بين رأس المال الجريء والأفكار الاستثنائية
          </p>
        </div>

        {/* The Two Pathways - Enhanced Design */}
        <div className="grid md:grid-cols-2 gap-8 w-full max-w-6xl mx-auto mb-24">

          {/* Pathway 1: Entrepreneur */}
          <Link href="/marfa" className="group relative overflow-hidden rounded-3xl h-[480px] shadow-xl hover:shadow-2xl transition-all duration-500 bg-white border border-slate-100">

            {/* Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Floating Decorative Elements */}
            <div className="absolute top-8 right-8 w-20 h-20 bg-blue-100/50 rounded-2xl rotate-12 group-hover:rotate-45 transition-transform duration-700"></div>
            <div className="absolute bottom-12 left-8 w-16 h-16 bg-indigo-100/50 rounded-full group-hover:scale-150 transition-transform duration-700"></div>

            <div className="relative z-10 p-10 h-full flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg shadow-blue-200 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  💡
                </div>
                <h2 className="text-4xl font-bold text-slate-900 mb-4">لدي فكرة مشروع</h2>
                <p className="text-slate-600 text-lg leading-relaxed">
                  هل تبحث عن تمويل؟ أو تريد التأكد من جدوى فكرتك؟
                  <br />
                  <span className="text-blue-600 font-semibold">ابدأ رحلتك هنا لتحويل الفكرة إلى شركة ناشئة</span>
                </p>
              </div>

              <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 text-slate-700 rounded-xl font-bold group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
                <span>دخول رواد الأعمال</span>
                <svg className="w-5 h-5 transition-transform group-hover:-translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Pathway 2: Investor */}
          <Link href="/dashboard/investor" className="group relative overflow-hidden rounded-3xl h-[480px] shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700">

            {/* Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Floating Decorative Elements */}
            <div className="absolute top-8 left-8 w-20 h-20 bg-indigo-500/10 rounded-2xl -rotate-12 group-hover:-rotate-45 transition-transform duration-700"></div>
            <div className="absolute bottom-12 right-8 w-16 h-16 bg-violet-500/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>

            <div className="relative z-10 p-10 h-full flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg shadow-indigo-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  📈
                </div>
                <h2 className="text-4xl font-bold text-white mb-4">أنا مستثمر</h2>
                <p className="text-slate-300 text-lg leading-relaxed">
                  اكتشف فرصاً استثمارية مدروسة ومفلترة بعناية
                  <br />
                  <span className="text-indigo-400 font-semibold">لوحة تحكم ذكية لعرض العائد المتوقع وتحليل المخاطر</span>
                </p>
              </div>

              <div className="flex items-center gap-3 px-6 py-4 bg-slate-800/80 text-slate-200 rounded-xl font-bold group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-violet-600 group-hover:text-white transition-all duration-300 shadow-sm">
                <span>دخول المستثمرين</span>
                <svg className="w-5 h-5 transition-transform group-hover:-translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
            </div>
          </Link>

        </div>

        {/* Free Tool: SWOT Analysis - Enhanced */}
        <div className="max-w-6xl mx-auto w-full mb-20 animate-fade-in-up">
          <Link href="/marfa/assessment" className="block group relative">
            <div className="bg-white border-2 border-green-100 rounded-3xl p-8 md:p-10 shadow-lg hover:border-green-400 hover:shadow-xl hover:shadow-green-100/50 transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gradient-to-br from-green-500 to-emerald-600 text-white text-xs font-bold px-5 py-2 rounded-bl-2xl shadow-lg">
                <span className="mr-1">✨</span> مجاناً Free
              </div>

              {/* Background Pattern */}
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-500/5 rounded-full blur-3xl group-hover:bg-green-500/10 transition-colors"></div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-green-200">
                      🛡️
                    </div>
                    <h3 className="text-3xl font-bold text-slate-800">أداة تحليل الأفكار (SWOT)</h3>
                  </div>
                  <p className="text-slate-600 text-lg leading-relaxed">
                    هل فكرتك صلبة؟ استخدم أداتنا المجانية لفحص نقاط القوة والضعف قبل البدء
                  </p>
                </div>
                <div className="px-8 py-4 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 font-bold rounded-xl group-hover:from-green-500 group-hover:to-emerald-600 group-hover:text-white transition-all shadow-sm flex items-center gap-2">
                  <span>ابدأ التحليل المجاني</span>
                  <svg className="w-5 h-5 transition-transform group-hover:-translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Featured Service: Pitch Deck - Enhanced */}
        <div className="max-w-6xl mx-auto w-full mb-24 animate-fade-in-up">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold text-slate-800 mb-2">أدوات مميزة للنجاح</h3>
            <p className="text-slate-500">خدمات احترافية لتسريع رحلتك الاستثمارية</p>
          </div>

          <Link href="/services/pitch-deck" className="block group">
            <div className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 rounded-3xl p-[2px] shadow-2xl hover:shadow-fuchsia-300/50 transition-shadow duration-500">
              <div className="bg-white rounded-[calc(1.5rem-2px)] p-8 md:p-12 relative overflow-hidden">

                {/* Animated Background Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-100/50 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-fuchsia-100/50 to-transparent rounded-full blur-2xl group-hover:scale-125 transition-transform duration-1000"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="text-right flex-1">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-fuchsia-50 border border-fuchsia-100 text-fuchsia-700 rounded-full text-sm font-bold mb-4">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      خدمة متميزة
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                      صانع العروض الاستثمارية
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600"> .AI</span>
                    </h3>
                    <p className="text-slate-600 text-lg mb-6 max-w-xl leading-relaxed">
                      لا تملك الوقت لتصميم عرضك؟ دعنا نقوم بذلك نيابة عنك باستخدام أحدث تقنيات الذكاء الاصطناعي لتوليد محتوى احترافي ومقنع
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-slate-900">2,500</span>
                        <span className="text-sm text-slate-500 font-medium">SAR</span>
                      </div>
                      <div className="px-8 py-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-full font-bold group-hover:from-violet-600 group-hover:to-fuchsia-600 transition-all duration-300 shadow-lg flex items-center gap-2">
                        <span>اطلب الخدمة الآن</span>
                        <svg className="w-5 h-5 transition-transform group-hover:-translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Visual Icon */}
                  <div className="w-48 h-48 bg-gradient-to-br from-fuchsia-100 to-violet-100 rounded-3xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl">
                    <span className="text-8xl">📊</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Marfa Academy Link */}
        <div className="max-w-6xl mx-auto w-full mb-20 animate-fade-in-up">
          <Link href="/academy" className="block group relative">
            <div className="bg-white border-2 border-blue-100 rounded-3xl p-8 md:p-10 shadow-lg hover:border-blue-400 hover:shadow-xl hover:shadow-blue-100/50 transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gradient-to-br from-blue-500 to-teal-600 text-white text-xs font-bold px-5 py-2 rounded-bl-2xl shadow-lg">
                <span className="mr-1">🎓</span> أكاديمية
              </div>

              {/* Background Pattern */}
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors"></div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-600 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-blue-200">
                      🏛️
                    </div>
                    <h3 className="text-3xl font-bold text-slate-800">أكاديمية مرفأ للقيادة</h3>
                  </div>
                  <p className="text-slate-600 text-lg leading-relaxed">
                    نخرج من الإطار النظري إلى الواقع عبر دراسة حالات عالمية ومناقشتها بأسلوب الـ MBA التنفيذي
                  </p>
                </div>
                <div className="px-8 py-4 bg-gradient-to-r from-blue-50 to-teal-50 text-blue-700 font-bold rounded-xl group-hover:from-blue-600 group-hover:to-teal-600 group-hover:text-white transition-all shadow-sm flex items-center gap-2">
                  <span>تصفح الأكاديمية</span>
                  <svg className="w-5 h-5 transition-transform group-hover:-translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Footer */}


      </main>
    </div>
  );
}
