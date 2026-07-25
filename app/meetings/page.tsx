import MeetingsSchedule from '../components/marfa/MeetingsSchedule';
import InvestorMeetingForm from '../components/marfa/InvestorMeetingForm';
import AdvisorProfile from '../components/marfa/AdvisorProfile';
import RegistrationBanner from '../components/marfa/RegistrationBanner';

export const dynamic = 'force-dynamic';

export default async function MeetingsPage() {
    return (
        <div className="min-h-screen bg-[#faf8f2] relative overflow-hidden" dir="rtl">

            {/* Main Content */}
            <main className="relative min-h-screen flex flex-col pt-32 pb-16 px-4 max-w-7xl mx-auto">

                <div className="text-center mb-16 space-y-8 animate-fade-in-up relative">

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#faf8f2] border border-[#c9a84c]/30 text-[#c9a84c] text-sm font-bold mb-4">
                        📅 <span className="tracking-wide uppercase">لقاءات مرفأ</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-[#0a0f1e] tracking-tight leading-tight">
                        لقاءات <span className="text-[#c9a84c]">مرفأ</span>
                    </h1>
                    <p className="text-lg text-[#64748b] max-w-2xl mx-auto leading-relaxed">
                        تدرّب على عرض مشروعك أمام جمهور من روّاد الأعمال والمختصين واحصل على تغذية راجعة.
                        <br />
                        <span className="font-medium text-[#c9a84c]">تصفح الجدول</span> واحجز موعدك الآن.
                    </p>
                </div>

                <MeetingsSchedule />

                {/* Registration CTA */}
                <div className="max-w-md mx-auto my-16">
                  <RegistrationBanner variant="card" context="meetings" />
                </div>

                <InvestorMeetingForm />

                <AdvisorProfile variant="full" />

                {/* Portfolio Opportunities Teaser */}
                <section className="mt-24 mb-8">
                    <div className="text-center mb-10">
                        <span className="inline-block px-4 py-1 rounded-full bg-[#faf8f2] border border-[#c9a84c]/30 text-[#c9a84c] text-xs font-bold mb-3">🛠️ مشاريع بُنيت في مرفأ</span>
                        <h2 className="text-3xl font-black text-[#0a0f1e]">منتجات بناها فريقنا ومتدربونا</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { icon: '🎯', name: 'بصيرة', stage: 'منتج مُطلق ويعمل', teaser: 'في سوق المنافسات الحكومية، من يملك البيانات يملك الترسية. بصيرة تعرف الأسعار قبل أن تُعلن النتائج.' },
                            { icon: '📐', name: 'مقياس', stage: 'منتج مُطلق ويعمل', teaser: 'آلاف مصانع الألمنيوم في السعودية ما زالت تُسعّر بالورقة والقلم. مقياس يحوّل القياس إلى عرض سعر في دقائق.' },
                            { icon: '🏥', name: 'برو ميد إنشور', stage: 'يعمل ويخدم عملاء', teaser: 'كل مطالبة مرفوضة هي إيراد ضائع. برو ميد إنشور يحوّل خسائر المنشآت الطبية إلى أرباح — بخبرة سعودية متخصصة.' },
                        ].map((p) => (
                            <a key={p.name} href="/portfolio" className="group block bg-white rounded-2xl p-6 border border-[#c9a84c]/20 shadow-[0_8px_30px_rgba(10,15,30,0.06)] hover:border-[#c9a84c]/40 transition-all duration-300 hover:-translate-y-1">
                                <div className="flex items-start justify-between mb-4">
                                    <span className="text-3xl">{p.icon}</span>
                                    <span className="text-xs px-2 py-1 rounded-full bg-[#fdf9ef] text-[#c9a84c] font-bold border border-[#c9a84c]/20">{p.stage}</span>
                                </div>
                                <h3 className="text-lg font-bold text-[#0a0f1e] mb-2">{p.name}</h3>
                                <p className="text-sm text-[#4a5b78] leading-relaxed">{p.teaser}</p>
                                <span className="inline-block mt-4 text-sm font-bold text-[#c9a84c] group-hover:text-[#d4a843] transition-colors">اطلب التفاصيل الكاملة ←</span>
                            </a>
                        ))}
                    </div>
                    <div className="text-center mt-8">
                        <a href="/portfolio" className="inline-flex items-center gap-2 px-8 py-3 bg-[#c9a84c] text-white font-bold rounded-full hover:bg-[#d4a843] transition-colors text-sm">استكشف جميع المشاريع ←</a>
                    </div>
                </section>

            </main>
        </div>
    );
}
