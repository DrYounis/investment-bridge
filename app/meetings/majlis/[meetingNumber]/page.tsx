import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { SCHEDULE_DATA, formatDate, getFridayDates } from '@/app/components/marfa/scheduleData';
import MajlisRoom from '@/app/components/marfa/MajlisRoom';

export default async function MajlisPage({ params }: { params: Promise<{ meetingNumber: string }> }) {
  const { meetingNumber: nStr } = await params;
  const n = parseInt(nStr, 10);
  if (isNaN(n) || n < 1 || n > 14) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirect=/meetings/majlis/${n}`);
  }

  const meeting = SCHEDULE_DATA[n - 1];
  const fridayDate = getFridayDates()[n - 1];
  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'مستخدم';

  return (
    <div className="min-h-screen bg-[#faf8f2]" dir="rtl">
      <main className="max-w-3xl mx-auto pt-28 pb-16 px-4">
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/30 text-[#c9a84c] text-xs font-bold mb-3">
            🏛️ المجلس
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

        <div className="bg-white rounded-2xl p-6 border border-[#c9a84c]/20 shadow-[0_8px_30px_rgba(10,15,30,0.04)]">
          <MajlisRoom meetingNumber={n} userId={user.id} displayName={displayName} />
        </div>
      </main>
    </div>
  );
}
