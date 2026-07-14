'use client';

import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  prevTotalViews: number;
  prevUniqueVisitors: number;
  daily: { date: string; views: number; visitors: number }[];
  topPages: { path: string; views: number }[];
  topReferrers: { referrer: string; views: number }[];
  countries: { country: string; views: number }[];
  devices: { device: string; views: number }[];
  _range?: string;
}

function pctChange(current: number, previous: number): string {
  if (!previous) return current > 0 ? '+100' : '0';
  return ((current - previous) / previous * 100).toFixed(0);
}

export default function AnalyticsDashboard() {
  const [range, setRange] = useState<'7d' | '30d'>('7d');
  const [raw, setRaw] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/admin/analytics?range=${range}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((d) => {
        if (d.error) { setError(d.error); return; }
        setError(null);
        setRaw({ ...d, _range: range });
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err.message);
      });
    return () => controller.abort();
  }, [range]);

  const isLoading = !raw || raw._range !== range;
  const data = raw;

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse" dir="rtl">
        <div className="h-8 bg-[#1a2540] rounded w-48" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-24 bg-[#0d1628] rounded-xl border border-[#1a2540]" />)}
        </div>
        <div className="h-64 bg-[#0d1628] rounded-xl border border-[#1a2540]" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div dir="rtl" className="text-center py-16 text-red-400">
        {error || 'فشل تحميل البيانات'}
      </div>
    );
  }

  const viewChange = pctChange(data.totalViews, data.prevTotalViews);
  const visitorChange = pctChange(data.uniqueVisitors, data.prevUniqueVisitors);
  const viewChangeNum = parseInt(viewChange);
  const visitorChangeNum = parseInt(visitorChange);

  const maxBar = Math.max(...data.topPages.map(p => p.views), 1);

  return (
    <div dir="rtl" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
      {/* Range toggle */}
      <div className="flex gap-2 mb-6">
        {[
          { key: '7d' as const, label: '٧ أيام' },
          { key: '30d' as const, label: '٣٠ يوم' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setRange(t.key)}
            className="px-4 py-2 rounded-lg text-sm font-bold transition-all"
            style={{
              background: range === t.key ? '#c9a84c' : '#060c18',
              color: range === t.key ? '#0a0f1e' : '#8a9bb8',
              border: range === t.key ? '1px solid #c9a84c' : '1px solid #1e2d4a',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'المشاهدات', value: data.totalViews.toLocaleString(), change: viewChangeNum },
          { label: 'الزوار الفريدون', value: data.uniqueVisitors.toLocaleString(), change: visitorChangeNum },
        ].map((s) => (
          <div key={s.label} className="bg-[#060c18] border border-[#1e2d4a] rounded-lg p-4">
            <p className="text-xs text-[#4a5a78] mb-1">{s.label}</p>
            <p className="text-2xl font-black text-white">{s.value}</p>
            <p className="text-xs mt-1" style={{ color: s.change >= 0 ? '#10b981' : '#ef4444' }}>
              {s.change >= 0 ? '↑' : '↓'} {Math.abs(s.change)}%
            </p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-[#060c18] border border-[#1e2d4a] rounded-lg p-4 mb-6">
        <h3 className="text-sm font-bold text-[#8a9bb8] mb-4">المشاهدات اليومية</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={data.daily}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4a" />
            <XAxis dataKey="date" stroke="#4a5a78" tick={{ fontSize: 10 }} tickFormatter={(d: string) => d.slice(5)} />
            <YAxis stroke="#4a5a78" tick={{ fontSize: 10 }} />
            <Tooltip contentStyle={{ background: '#0d1628', border: '1px solid #1e2d4a', borderRadius: 8, color: '#fff' }} />
            <Area type="monotone" dataKey="views" stroke="#c9a84c" fill="#c9a84c" fillOpacity={0.15} />
            <Area type="monotone" dataKey="visitors" stroke="#d4a843" fill="#d4a843" fillOpacity={0.08} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Detail grids */}
      <div className="grid md:grid-cols-2 gap-6">
        {[
          { title: 'أهم الصفحات', items: data.topPages, key: 'path' as const, empty: 'لا توجد بيانات' },
          { title: 'مصادر الزيارات', items: data.topReferrers, key: 'referrer' as const, empty: 'لا توجد بيانات' },
          { title: 'الدول', items: data.countries, key: 'country' as const, empty: 'لا توجد بيانات' },
          { title: 'الأجهزة', items: data.devices, key: 'device' as const, empty: 'لا توجد بيانات' },
        ].map((section) => (
          <div key={section.title} className="bg-[#060c18] border border-[#1e2d4a] rounded-lg p-4">
            <h3 className="text-sm font-bold text-[#8a9bb8] mb-3">{section.title}</h3>
            {section.items.length === 0 ? (
              <p className="text-sm text-[#4a5a78]">{section.empty}</p>
            ) : (
              <div className="space-y-2">
                {section.items.map((item: Record<string, unknown>, i: number) => {
                  const label = String(item[section.key] || '');
                  const views = Number(item.views || 0);
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-xs text-[#8a9bb8] truncate flex-1 min-w-0" dir={section.key === 'referrer' ? 'ltr' : undefined}>
                        {label}
                      </span>
                      <span className="text-xs text-[#c9a84c] font-bold shrink-0">{views.toLocaleString()}</span>
                      <div className="w-16 h-1.5 rounded-full bg-[#1e2d4a] shrink-0 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(views / maxBar) * 100}%`, background: '#c9a84c' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
