import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans" dir="rtl">

      {/* Navbar Minimal */}
      <nav className="absolute top-0 w-full p-6 flex justify-between items-center z-50">
        <div className="text-2xl font-black text-slate-800 tracking-tight">مرفأ <span className="text-blue-600">.</span></div>
        <div className="flex gap-4">
          <Link href="/login" className="px-6 py-2 bg-white/80 backdrop-blur text-sm font-bold text-slate-700 rounded-full hover:bg-white transition shadow-sm">
            دخول
          </Link>
        </div>
      </nav>

      {/* Main Split Screen Hero */}
      <main className="relative min-h-screen flex flex-col pt-24 pb-12 px-4 max-w-7xl mx-auto">

        <div className="text-center mb-16 space-y-4 animate-fade-in-down">
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-4">
            أين تقع في عالم <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">الاستثمار؟</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            منصة مرفأ هي الجسر الذكي الذي يربط بين رأس المال الجريء والأفكار الاستثنائية.
          </p>
        </div>

        {/* The Two Pathways */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-12 w-full max-w-6xl mx-auto mb-20">

          {/* Pathway 1: Entrepreneur / Idea */}
          <Link href="/marfa" className="group relative overflow-hidden rounded-3xl h-[500px] shadow-2xl transition-all duration-500 hover:shadow-blue-200/50 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-white"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="relative z-10 p-10 h-full flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  💡
                </div>
                <h2 className="text-4xl font-bold text-slate-900 mb-4">لدي فكرة مشروع</h2>
                <p className="text-gray-500 text-lg leading-relaxed group-hover:text-gray-700 transition-colors">
                  هل تبحث عن تمويل؟ أو تريد التأكد من جدوى فكرتك؟ <br />
                  ابدأ رحلتك هنا لتحويل الفكرة إلى شركة ناشئة.
                </p>
              </div>

              <div className="w-full py-4 bg-slate-100 text-slate-600 text-center rounded-xl font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
                دخول ريادي الأعمال ⬅
              </div>
            </div>
            {/* Decorative Pattern */}
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors"></div>
          </Link>

          {/* Pathway 2: Investor */}
          {/* Assuming dashboard/investor is the route, or a specific landing page */}
          <Link href="/dashboard/investor" className="group relative overflow-hidden rounded-3xl h-[500px] shadow-2xl transition-all duration-500 hover:shadow-indigo-200/50 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-slate-900"></div>

            <div className="relative z-10 p-10 h-full flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 bg-slate-800 text-indigo-400 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-300">
                  📈
                </div>
                <h2 className="text-4xl font-bold text-white mb-4">أنا مستثمر</h2>
                <p className="text-slate-400 text-lg leading-relaxed group-hover:text-slate-300 transition-colors">
                  اكتشف فرصاً استثمارية مدروسة ومفلترة بعناية.<br />
                  لوحة تحكم ذكية لعرض العائد المتوقع وتحليل المخاطر.
                </p>
              </div>

              <div className="w-full py-4 bg-slate-800 text-slate-300 text-center rounded-xl font-bold group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                دخول المستثمرين ⬅
              </div>
            </div>
            {/* Decorative Pattern */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
          </Link>

        </div>

        {/* Free Tool: SWOT Analysis */}
        <div className="max-w-6xl mx-auto w-full mb-12 animate-fade-in-up delay-100">
          <Link href="/marfa/assessment" className="block group">
            <div className="bg-white border-2 border-green-100 rounded-3xl p-8 md:p-10 shadow-lg hover:border-green-400 hover:shadow-green-100 transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-4 py-1 rounded-bl-xl">مجاناً Free</div>
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">🛡️</span>
                    <h3 className="text-2xl font-bold text-slate-800">أداة تحليل الأفكار (SWOT)</h3>
                  </div>
                  <p className="text-gray-500 text-lg">
                    هل فكرتك صلبة؟ استخدم أداتنا المجانية لفحص نقاط القوة والضعف قبل البدء.
                  </p>
                </div>
                <div className="px-8 py-3 bg-green-50 text-green-700 font-bold rounded-xl group-hover:bg-green-500 group-hover:text-white transition-colors">
                  ابدأ التحليل المجاني ⬅
                </div>
              </div>
              {/* Decor */}
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-green-50 rounded-full blur-2xl group-hover:bg-green-100 transition-colors"></div>
            </div>
          </Link>
        </div>

        {/* Featured Service: Pitch Deck */}
        <div className="max-w-6xl mx-auto w-full mb-20 animate-fade-in-up delay-200">
          <h3 className="text-2xl font-bold text-center text-slate-800 mb-8">أدوات مميزة للنجاح</h3>

          <Link href="/services/pitch-deck" className="block group">
            <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-3xl p-1 shadow-2xl hover:shadow-fuchsia-300 transition-shadow duration-300">
              <div className="bg-white rounded-[22px] p-8 md:p-12 relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="text-right flex-1">
                    <div className="inline-block px-3 py-1 bg-fuchsia-100 text-fuchsia-700 rounded-full text-xs font-bold mb-4">
                      Productivity Tool
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                      صانع العروض الاستثمارية <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600">.AI</span>
                    </h3>
                    <p className="text-gray-500 text-lg mb-6 max-w-xl">
                      لا تملك الوقت لتصميم عرضك؟ دعنا نقوم بذلك نيابة عنك باستخدام أحدث تقنيات الذكاء الاصطناعي لتوليد محتوى احترافي ومقنع.
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-slate-900">2500 SAR</span>
                      <span className="px-6 py-2 bg-slate-900 text-white rounded-full font-bold group-hover:bg-fuchsia-600 transition-colors">
                        اطلب الخدمة الآن
                      </span>
                    </div>
                  </div>

                  {/* Visual Icon/Abstract */}
                  <div className="w-48 h-48 bg-fuchsia-50 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                    <span className="text-7xl">📊</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Footer Minimal */}
        <footer className="text-center text-gray-400 text-sm py-8 border-t border-gray-200">
          © 2026 Marfa Investment Bridge. All rights reserved.
        </footer>

      </main>
    </div>
  );
}
