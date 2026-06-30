import Link from 'next/link';
import Image from 'next/image';
import MeetingsSchedule from '../components/marfa/MeetingsSchedule';
import InvestorMeetingForm from '../components/marfa/InvestorMeetingForm';

export const dynamic = 'force-dynamic';

export default async function MeetingsPage() {
    return (
        <div className="min-h-screen bg-[#0a0f1e] relative overflow-hidden" dir="rtl">

            {/* Subtle Background Patterns - Luxury Gold Dust Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(201,168,76,0.03),transparent_70%)] pointer-events-none"></div>

            {/* Main Content */}
            <main className="relative min-h-screen flex flex-col pt-32 pb-16 px-4 max-w-7xl mx-auto">

                <div className="text-center mb-16 space-y-8 animate-fade-in-up relative">
                    {/* Animated Glow - Warm Gold */}
                    <div className="absolute -top-[50%] left-1/2 -translate-x-1/2 w-[60%] h-[60%] bg-gold/5 blur-[120px] rounded-full animate-pulse pointer-events-none"></div>

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 text-gold text-sm font-bold mb-4">
                        📅 <span className="tracking-wide uppercase">لقاءات مرفأ</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-tight">
                        لقاءات <span className="text-[#c9a84c]">مرفأ</span>
                    </h1>
                    <p className="text-lg text-[#a0aec0] max-w-2xl mx-auto leading-relaxed">
                        منصة حصرية لربط رواد الأعمال بالمستثمرين من خلال لقاءات مجدولة ومنظمة.
                        <br />
                        <span className="font-medium text-[#c9a84c]">تصفح الجدول</span> واحجز موعدك الآن.
                    </p>
                </div>

                <MeetingsSchedule />

                <InvestorMeetingForm />



            </main>
        </div>
    );
}
