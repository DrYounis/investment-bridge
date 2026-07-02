import Link from 'next/link';
import Image from 'next/image';
import MeetingsSchedule from '../components/marfa/MeetingsSchedule';
import InvestorMeetingForm from '../components/marfa/InvestorMeetingForm';

export const dynamic = 'force-dynamic';

export default async function MeetingsPage() {
    return (
        <div className="min-h-screen bg-[#faf8f2] relative overflow-hidden" dir="rtl">

            {/* Main Content */}
            <main className="relative min-h-screen flex flex-col pt-32 pb-16 px-4 max-w-7xl mx-auto">

                <div className="text-center mb-16 space-y-8 animate-fade-in-up relative">

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#fdf9ef] border border-[#c9a84c]/30 text-[#c9a84c] text-sm font-bold mb-4">
                        📅 <span className="tracking-wide uppercase">لقاءات مرفأ</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-[#0a0f1e] tracking-tight leading-tight">
                        لقاءات <span className="text-[#c9a84c]">مرفأ</span>
                    </h1>
                    <p className="text-lg text-[#4a5b78] max-w-2xl mx-auto leading-relaxed">
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
