'use client';

import Link from 'next/link';

export default function PitchDeckServicePage() {
    return (
        <div className="min-h-screen bg-slate-50 text-right" dir="rtl">
            {/* Smart Navbar */}
            <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto border-b border-gray-200 bg-white/50 backdrop-blur-md sticky top-0 z-50">
                <div className="text-2xl font-bold text-slate-900">مرفأ <span className="text-blue-600">.</span></div>
                <Link href="/" className="text-slate-600 hover:text-blue-600 font-medium transition">الرئيسية</Link>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-16">

                {/* Main Hero: The Offer */}
                <div className="grid md:grid-cols-2 gap-12 items-center mb-20 animate-fade-in-up">
                    <div className="space-y-6">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold border border-blue-200">
                            باقة رواد الأعمال 💼
                        </span>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
                            مصمم العروض الاستثمارية <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                AI Pitch Deck Generator
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed font-light">
                            خدمة احترافية لتحويل مسودة مشروعك إلى عرض استثماري متكامل. نستخدم تقنيات الذكاء الاصطناعي لدمج البيانات المالية، تحليل السوق، وهوية مشروعك في ملف واحد يتبع معايير صناديق الاستثمار الجريء.
                        </p>

                        <ul className="space-y-3 text-gray-600 text-sm">
                            <li className="flex items-center gap-2"><span className="text-green-500">✓</span> هيكلة القصة (Storytelling) ومسار الإقناع.</li>
                            <li className="flex items-center gap-2"><span className="text-green-500">✓</span> تصاميم بصرية ذكية وجداول بيانية تلقائية.</li>
                            <li className="flex items-center gap-2"><span className="text-green-500">✓</span> إعادة صياغة النصوص لتكون أكثر اختصاراً وتأثيراً.</li>
                        </ul>

                        <div className="flex items-center gap-4 pt-6">
                            <Link
                                href="/services/pitch-deck/create"
                                className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold shadow-xl hover:bg-slate-800 transition-all flex items-center gap-4 group"
                            >
                                <span>ابدأ التصميم الآن (تجريبي)</span>
                                <span className="bg-white/20 px-3 py-1 rounded text-sm text-yellow-300 font-mono">مجاني لفترة محدودة</span>
                            </Link>
                        </div>
                    </div>

                    {/* Visual Benchmark Representation */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-indigo-500 blur-[80px] opacity-20 pointer-events-none"></div>

                        {/* The "Deck" Preview */}
                        <div className="relative bg-white border border-gray-100 p-2 rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-500">
                            <div className="aspect-[16/9] bg-slate-100 rounded-xl overflow-hidden relative group cursor-pointer">
                                {/* Fake Slides Carousel look */}
                                <div className="absolute top-0 bottom-0 left-0 w-16 bg-white border-r border-gray-100 flex flex-col gap-2 p-2 z-20">
                                    <div className="w-full aspect-video bg-blue-100 rounded border border-blue-200"></div>
                                    <div className="w-full aspect-video bg-gray-100 rounded"></div>
                                    <div className="w-full aspect-video bg-gray-100 rounded"></div>
                                </div>

                                {/* Main Slide Area */}
                                <div className="absolute inset-y-0 left-16 right-0 bg-white p-8 flex flex-col justify-center items-center">
                                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl mb-6 shadow-lg shadow-blue-200">
                                        📊
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Market Growth</h3>
                                    <div className="flex items-end gap-2 h-20 mt-4">
                                        <div className="w-8 bg-blue-100 h-10 rounded-t"></div>
                                        <div className="w-8 bg-blue-300 h-16 rounded-t"></div>
                                        <div className="w-8 bg-blue-600 h-full rounded-t"></div>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-4">Auto-generated Chart</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Grid - Benchmarked from top tools */}
                <section className="mb-24">
                    <h2 className="text-2xl font-bold text-center text-slate-900 mb-12">مميزات الخدمة الأساسية</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <ServiceFeature
                            icon="⚡"
                            title="توليد المحتوى الذكي"
                            desc="لا داعي للكتابة من الصفر. أدخل رؤوس الأقلام، وسيقوم النظام بصياغة النصوص التسويقية، ووصف المشكلة والحل بلغة استثمارية رصينة."
                        />
                        <ServiceFeature
                            icon="🎨"
                            title="هوية بصرية مرنة"
                            desc="قوالب جاهزة تتكيف مع ألوان شعارك تلقائياً. المظهر النهائي يبدو وكأنه صمم يدوياً بواسطة وكالة إعلانية."
                        />
                        <ServiceFeature
                            icon="📈"
                            title="تصوير البيانات (Visualization)"
                            desc="يحول الأرقام الجافة (Excel) إلى رسوم بيانية ومخططات نمو جذابة وسهلة القراءة للمستثمر."
                        />
                        <ServiceFeature
                            icon="📑"
                            title="تحليل المستندات"
                            desc="أرفق ملف المشروع (Word/PDF) وسنقوم باستخراج النقاط الجوهرية (Highlights) ووضعها في الشرائح المناسبة."
                        />
                        <ServiceFeature
                            icon="🔄"
                            title="تصدير متعدد الصيغ"
                            desc="احصل على الملف بصيغة PPTX قابلة للتعديل، أو PDF جاهز للإرسال عبر البريد الإلكتروني."
                        />
                        <ServiceFeature
                            icon="👥"
                            title="جاهز للعرض (Present Mode)"
                            desc="نرفق لك ملاحظات المتحدث (Speaker Notes) لكل شريحة لمساعدتك في تقديم العرض بثقة."
                        />
                    </div>
                </section>

            </main>
        </div>
    );
}

function ServiceFeature({ icon, title, desc }: { icon: string, title: string, desc: string }) {
    return (
        <div className="p-6 bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all">
            <div className="text-3xl mb-4 bg-gray-50 w-14 h-14 flex items-center justify-center rounded-full">{icon}</div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed font-light">{desc}</p>
        </div>
    )
}
