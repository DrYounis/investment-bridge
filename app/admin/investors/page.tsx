'use client';

import { useState, useEffect, useMemo } from 'react';

interface Investor {
  profile_id: string;
  full_name: string;
  email: string;
  approval_status: string;
  company: string;
  phone: string;
  created_at: string;
}

const STATUS: Record<string, { label: string; color: string }> = {
  pending: { label: 'قيد المراجعة', color: '#c9a84c' },
  approved: { label: 'معتمد', color: '#10b981' },
  rejected: { label: 'مرفوض', color: '#ef4444' },
};

export default function AdminInvestorsPage() {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchInvestors = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/investors');
      const data = await res.json();
      if (!res.ok) { setError(data.error || data.errors?.[0] || 'Error'); setLoading(false); return; }
      setInvestors(data.investors || []);
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed'); }
    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchInvestors(); }, []);

  const updateStatus = async (profile_id: string, status: string) => {
    setUpdating(profile_id);
    const prev = [...investors];
    setInvestors(prev => prev.map(i => i.profile_id === profile_id ? { ...i, approval_status: status } : i));
    try {
      const res = await fetch('/api/admin/investors', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile_id, approval_status: status }),
      });
      if (!res.ok) { setError((await res.json()).error || 'Failed'); setInvestors(prev); }
    } catch { setError('Failed'); setInvestors(prev); }
    setUpdating(null);
  };

  const filtered = useMemo(() => {
    let list = investors;
    if (filter !== 'all') list = list.filter(i => i.approval_status === filter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(i => (i.full_name || '').toLowerCase().includes(q) || (i.email || '').toLowerCase().includes(q));
    }
    return list;
  }, [investors, search, filter]);

  const stats = { all: investors.length, pending: investors.filter(i => i.approval_status === 'pending').length, approved: investors.filter(i => i.approval_status === 'approved').length, rejected: investors.filter(i => i.approval_status === 'rejected').length };

  if (loading) return <div className="animate-pulse space-y-4" dir="rtl"><div className="h-8 bg-[#1a2540] rounded w-72" /><div className="h-4 bg-[#1a2540] rounded w-48" /><div className="h-64 bg-[#0d1628] rounded-2xl border border-[#1a2540] mt-6" /></div>;
  if (error && investors.length === 0) return <div dir="rtl" className="text-center py-16"><p className="text-red-400 text-lg font-bold mb-2">خطأ</p><p className="text-[#8a9bb8]">{error}</p></div>;

  const TABS: { key: typeof filter; label: string; count: number }[] = [
    { key: 'all', label: 'الكل', count: stats.all },
    { key: 'pending', label: 'قيد المراجعة', count: stats.pending },
    { key: 'approved', label: 'معتمدون', count: stats.approved },
    { key: 'rejected', label: 'مرفوضون', count: stats.rejected },
  ];

  return (
    <div dir="rtl" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-white">المستثمرون</h1>
        <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-[#c9a84c]/15 text-[#c9a84c]">{stats.all}</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {TABS.map(s => (
          <div key={s.key} className="bg-[#060c18] border border-[#1e2d4a] rounded-lg p-3 cursor-pointer" onClick={() => setFilter(s.key)} style={{ borderColor: filter === s.key ? STATUS[s.key]?.color || '#c9a84c' : undefined }}>
            <p className="text-[10px] text-[#4a5a78] mb-0.5">{s.label}</p>
            <p className="text-xl font-black" style={{ color: STATUS[s.key]?.color || '#8a9bb8' }}>{s.count}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث بالاسم أو البريد..." className="flex-1 bg-[#060c18] border border-[#1e2d4a] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-[#4a5a78] outline-none focus:border-[#c9a84c]" />
        <div className="flex gap-1 flex-wrap">{TABS.map(t => (<button key={t.key} onClick={() => setFilter(t.key)} className="px-3 py-2 rounded-lg text-xs font-bold" style={{ background: filter === t.key ? '#c9a84c' : '#060c18', color: filter === t.key ? '#0a0f1e' : '#8a9bb8', border: filter === t.key ? '1px solid #c9a84c' : '1px solid #1e2d4a' }}>{t.label}</button>))}</div>
      </div>

      {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse"><thead><tr className="border-b border-[#1e2d4a] text-right"><th className="py-3 px-4 text-xs font-bold text-[#4a5a78]">الاسم</th><th className="py-3 px-4 text-xs font-bold text-[#4a5a78]">البريد</th><th className="py-3 px-4 text-xs font-bold text-[#4a5a78]">الحالة</th><th className="py-3 px-4 text-xs font-bold text-[#4a5a78]">تاريخ التسجيل</th><th className="py-3 px-4 text-xs font-bold text-[#4a5a78]">إجراءات</th></tr></thead>
        <tbody>{filtered.length === 0 ? <tr><td colSpan={5} className="py-16 text-center text-[#4a5a78]">لا يوجد مستثمرون</td></tr> : filtered.map(i => (
          <tr key={i.profile_id} className="border-b border-[#1e2d4a]/50 hover:bg-[#c9a84c]/5">
            <td className="py-3 px-4 text-sm text-white">{i.full_name || '—'} {i.company ? <span className="text-[10px] text-[#4a5a78] block">{i.company}</span> : null}</td>
            <td className="py-3 px-4 text-sm text-[#8a9bb8]" dir="ltr" style={{ textAlign: 'right' }}>{i.email}</td>
            <td className="py-3 px-4"><span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold" style={{ background: `${STATUS[i.approval_status]?.color || '#64748b'}20`, color: STATUS[i.approval_status]?.color }}>{STATUS[i.approval_status]?.label || i.approval_status}</span></td>
            <td className="py-3 px-4 text-sm text-[#8a9bb8]">{i.created_at ? new Date(i.created_at).toLocaleDateString('ar-SA') : '—'}</td>
            <td className="py-3 px-4">
              {i.approval_status === 'pending' ? <div className="flex gap-2">{['approved','rejected'].map(s => (<button key={s} onClick={() => updateStatus(i.profile_id, s)} disabled={updating === i.profile_id} className="px-3 py-1.5 rounded-lg text-xs font-bold disabled:opacity-50" style={{ background: s === 'approved' ? '#10b98120' : '#ef444420', color: s === 'approved' ? '#10b981' : '#ef4444' }}>{updating === i.profile_id ? '...' : s === 'approved' ? 'اعتماد' : 'رفض'}</button>))}</div> : <span className="text-xs text-[#4a5a78]">—</span>}
            </td>
          </tr>
        ))}</tbody></table>
      </div>

      <div className="md:hidden space-y-3">{filtered.length === 0 ? <p className="text-center text-[#4a5a78] py-16">لا يوجد مستثمرون</p> : filtered.map(i => (
        <div key={i.profile_id} className="bg-[#060c18] border border-[#1e2d4a] rounded-lg p-4 space-y-2">
          <div className="flex justify-between"><span className="text-white font-bold">{i.full_name || '—'}</span><span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: `${STATUS[i.approval_status]?.color || '#64748b'}20`, color: STATUS[i.approval_status]?.color }}>{STATUS[i.approval_status]?.label}</span></div>
          <p className="text-sm text-[#8a9bb8]" dir="ltr" style={{ textAlign: 'right' }}>{i.email}</p>
          {i.approval_status === 'pending' && <div className="flex gap-2">{['approved','rejected'].map(s => (<button key={s} onClick={() => updateStatus(i.profile_id, s)} disabled={updating === i.profile_id} className="flex-1 px-3 py-2 rounded-lg text-xs font-bold disabled:opacity-50" style={{ background: s === 'approved' ? '#10b98120' : '#ef444420', color: s === 'approved' ? '#10b981' : '#ef4444' }}>{updating === i.profile_id ? '...' : s === 'approved' ? 'اعتماد' : 'رفض'}</button>))}</div>}
        </div>
      ))}</div>
    </div>
  );
}
