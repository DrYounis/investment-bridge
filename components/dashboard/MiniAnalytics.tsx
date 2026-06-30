'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import GlassCard from '@/components/ui/GlassCard';
import Skeleton from '@/components/ui/Skeleton';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const dayNames = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

function last7Days(): { day: string; count: number }[] {
  const result = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    result.push({ day: d.toISOString().split('T')[0], count: 0 });
  }
  return result;
}

export default function MiniAnalytics() {
  const router = useRouter();
  const supabase = createClient();
  const [stats, setStats] = useState({ views: 0, downloads: 0, interests: 0 });
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const uid = user.id;

      const results = await Promise.allSettled([
        supabase.from('profile_views').select('*', { count: 'exact', head: true }).eq('viewed_user_id', uid),
        supabase.from('pitch_downloads').select('*', { count: 'exact', head: true }).eq('owner_id', uid),
        supabase.from('investor_interests').select('*', { count: 'exact', head: true }).eq('entrepreneur_id', uid),
        supabase.from('profile_views').select('created_at').eq('viewed_user_id', uid).gte('created_at', new Date(Date.now() - 7 * 86400000).toISOString()),
      ]);

      setStats({
        views: results[0].status === 'fulfilled' ? (results[0].value.count || 0) : 0,
        downloads: results[1].status === 'fulfilled' ? (results[1].value.count || 0) : 0,
        interests: results[2].status === 'fulfilled' ? (results[2].value.count || 0) : 0,
      });

      // Build chart data
      const days = last7Days();
      if (results[3].status === 'fulfilled' && results[3].value.data) {
        for (const row of results[3].value.data) {
          const d = row.created_at.split('T')[0];
          const found = days.find((x) => x.day === d);
          if (found) found.count++;
        }
      }
      setChartData(days.map((d) => {
        const date = new Date(d.day + 'T00:00:00');
        return { name: dayNames[date.getDay()], value: d.count };
      }));

      setLoading(false);
    }
    load();
  }, [supabase, router]);

  return (
    <GlassCard className="marfa-card-hover" dir="rtl">
      <h3 className="text-lg font-bold text-white mb-5 text-right" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
        إحصائياتك
      </h3>

      {loading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton height="32px" width="60%" />
                <Skeleton height="14px" width="80%" />
              </div>
            ))}
          </div>
          <Skeleton height="160px" />
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              { label: 'مشاهدات الملف', value: stats.views },
              { label: 'تحميلات العرض', value: stats.downloads },
              { label: 'اهتمام المستثمرين', value: stats.interests },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl p-4 text-right border border-[#1a2540]"
                style={{ background: '#0d1628' }}
              >
                <div className="text-3xl font-bold text-[#c9a84c]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                  {s.value}
                </div>
                <div className="text-sm text-[#a0aec0] mt-1" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                  {s.label}
                </div>
                <span className="text-xs mt-1 block" style={{ color: s.value > 0 ? '#10b981' : '#64748b' }}>
                  {s.value > 0 ? '↑ نشط' : '—'}
                </span>
              </div>
            ))}
          </div>

          {/* Chart */}
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="name"
                tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'var(--font-tajawal)' }}
                axisLine={{ stroke: '#1a2540' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{ background: '#0d1628', border: '1px solid #1a2540', borderRadius: 8, color: '#fff', fontFamily: 'var(--font-tajawal)' }}
              />
              <Bar dataKey="value" fill="#c9a84c" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </GlassCard>
  );
}
