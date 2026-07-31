import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isSuperAdminEmail } from '@/lib/auth/adminEmails';
import { SCHEDULE_DATA, formatDate, getFridayDates, TOTAL_MEETINGS } from '@/app/components/marfa/scheduleData';
import MajlisRoom from '@/app/components/marfa/MajlisRoom';
import MajlisQuiz from '@/app/components/marfa/MajlisQuiz';
import AdvisorProfile from '@/app/components/marfa/AdvisorProfile';

export default async function MajlisPage({ params }: { params: Promise<{ meetingNumber: string }> }) {
  const { meetingNumber: nStr } = await params;
  const n = parseInt(nStr, 10);
  if (isNaN(n) || n < 1 || n > TOTAL_MEETINGS) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirect=/meetings/majlis/${n}`);
  }

  const isAdvisor = isSuperAdminEmail(user.email);
  const meeting = SCHEDULE_DATA[n - 1];
  const fridayDate = getFridayDates()[n - 1];
  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'مستخدم';

  return (
    <div className="min-h-screen bg-[#faf8f2]" dir="rtl">
      <main className="max-w-3xl mx-auto pt-28 pb-16 px-4">
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/30 text-[#c9a84c] text-xs font-bold mb-3">
            🏛️ المجلس الاستشاري
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-[#0a0f1e] mb-2" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            {meeting.encounter}: {meeting.topic}
          </h1>
          <p className="text-[#64748b] text-lg" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            {meeting.case}
          </p>
          <p className="text-sm text-[#8a94a8] mt-1" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            {formatDate(fridayDate)}
          </p>
        </div>

        <div className="mb-6">
          <AdvisorProfile variant="compact" />
        </div>

        {/* Quiz Section */}
        <div className="bg-white rounded-2xl p-6 border border-[#c9a84c]/20 shadow-[0_8px_30px_rgba(10,15,30,0.04)] mb-6">
          <h2 className="text-lg font-bold text-[#0a0f1e] mb-4" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            سؤال الحالة
          </h2>
          <MajlisQuiz meetingNumber={n} userId={user.id} displayName={displayName} isAdvisor={isAdvisor} />
        </div>

        {/* Chat Section */}
        <div className="bg-white rounded-2xl p-6 border border-[#c9a84c]/20 shadow-[0_8px_30px_rgba(10,15,30,0.04)]">
          <h2 className="text-lg font-bold text-[#0a0f1e] mb-4" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            نقاش المجلس
          </h2>
          <MajlisRoom meetingNumber={n} userId={user.id} displayName={displayName} />
        </div>
      </main>
    </div>
  );
}
