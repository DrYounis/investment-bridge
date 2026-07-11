'use client';

import { useEffect, useState } from 'react';

type PortfolioRow = {
  id: string; slug: string; name_ar: string; name_en: string; icon: string;
  sector_ar: string; stage_ar: string; is_featured: boolean; is_active: boolean;
  display_order: number; teaser_ar: string;
};

type InterestRow = {
  id: string; portfolio_id: string; investor_email: string; message: string | null;
  status: string; created_at: string; project_name: string;
};

export default function AdminPortfolioPage() {
  const [tab, setTab] = useState<'projects' | 'interests'>('projects');
  const [projects, setProjects] = useState<PortfolioRow[]>([]);
  const [interests, setInterests] = useState<InterestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCount, setNewCount] = useState(0);

  useEffect(() => { if (tab === 'projects') loadProjects(); else loadInterests(); }, [tab]);

  async function loadProjects() {
    setLoading(true);
    const res = await fetch('/api/admin/portfolio/list');
    if (res.ok) {
      const json = await res.json();
      setProjects((json.projects || []) as PortfolioRow[]);
    }
    setLoading(false);
  }

  async function loadInterests() {
    setLoading(true);
    const res = await fetch('/api/admin/portfolio-interests');
    if (res.ok) {
      const json = await res.json();
      setInterests(json.interests || []);
      setNewCount((json.interests || []).filter((i: any) => i.status === 'new').length);
    }
    setLoading(false);
  }

  async function toggleField(id: string, field: 'is_active' | 'is_featured', value: boolean) {
    await fetch('/api/admin/portfolio/list', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, updates: { [field]: value } }),
    });
    loadProjects();
  }

  function copyToken(id: string) {
    fetch(`/api/admin/portfolio?id=${id}`).then(r => r.json()).then(d => {
      if (d.url) navigator.clipboard.writeText(d.url);
    });
  }

  async function regenToken(id: string) {
    const res = await fetch('/api/admin/portfolio', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (data.url) navigator.clipboard.writeText(data.url);
    loadProjects();
  }

  async function updateStatus(id: string, status: string) {
    await fetch('/api/admin/portfolio-interests', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    loadInterests();
  }

  return (
    <div className="p-6" dir="rtl" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
      <h1 className="text-2xl font-bold text-[#c9a84c] mb-6">محفظة المشاريع</h1>
      <div className="flex gap-4 mb-6 border-b border-[#1a2540] pb-2">
        <button onClick={() => setTab('projects')} className={`px-4 py-2 rounded-t-lg font-bold text-sm ${tab === 'projects' ? 'bg-[#c9a84c]/10 text-[#c9a84c]' : 'text-[#64748b] hover:text-white'}`}>المشاريع</button>
        <button onClick={() => setTab('interests')} className={`px-4 py-2 rounded-t-lg font-bold text-sm ${tab === 'interests' ? 'bg-[#c9a84c]/10 text-[#c9a84c]' : 'text-[#64748b] hover:text-white'}`}>
          طلبات الاهتمام {newCount > 0 && <span className="ml-1 px-2 py-0.5 rounded-full bg-[#c9a84c] text-[#0a0f1e] text-xs">{newCount}</span>}
        </button>
      </div>
      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="marfa-skeleton h-12 w-full rounded" />)}</div>
      ) : tab === 'projects' ? (
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead><tr className="border-b border-[#1a2540] text-[#64748b] text-xs">
              <th className="p-2">#</th><th className="p-2">الاسم</th><th className="p-2">القطاع</th><th className="p-2">مميز</th><th className="p-2">نشط</th><th className="p-2">الرابط السري</th>
            </tr></thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} className="border-b border-[#1a2540]/50 hover:bg-white/5">
                  <td className="p-2 text-[#64748b]">{p.display_order}</td>
                  <td className="p-2 text-white font-bold">{p.icon} {p.name_ar}</td>
                  <td className="p-2 text-[#a0aec0] text-xs">{p.sector_ar}</td>
                  <td className="p-2"><input type="checkbox" checked={p.is_featured} onChange={() => toggleField(p.id, 'is_featured', !p.is_featured)} /></td>
                  <td className="p-2"><input type="checkbox" checked={p.is_active} onChange={() => toggleField(p.id, 'is_active', !p.is_active)} /></td>
                  <td className="p-2">
                    <div className="flex gap-1">
                      <button onClick={() => copyToken(p.id)} className="px-2 py-1 text-xs bg-[#c9a84c]/10 text-[#c9a84c] rounded hover:bg-[#c9a84c]/20">🔗 نسخ</button>
                      <button onClick={() => regenToken(p.id)} className="px-2 py-1 text-xs bg-[#ef4444]/10 text-[#ef4444] rounded hover:bg-[#ef4444]/20">🔄</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead><tr className="border-b border-[#1a2540] text-[#64748b] text-xs">
              <th className="p-2">المستثمر</th><th className="p-2">المشروع</th><th className="p-2">الرسالة</th><th className="p-2">التاريخ</th><th className="p-2">الحالة</th>
            </tr></thead>
            <tbody>
              {interests.map((r) => (
                <tr key={r.id} className="border-b border-[#1a2540]/50 hover:bg-white/5">
                  <td className="p-2 text-white">{r.investor_email}</td>
                  <td className="p-2 text-[#c9a84c] font-bold">{r.project_name || r.portfolio_id}</td>
                  <td className="p-2 text-[#a0aec0] text-xs max-w-[200px] truncate">{r.message || '—'}</td>
                  <td className="p-2 text-[#a0aec0] text-xs">{new Date(r.created_at).toLocaleDateString('ar-SA')}</td>
                  <td className="p-2">
                    <select value={r.status} onChange={(e) => updateStatus(r.id, e.target.value)} className="bg-[#0d1628] border border-[#1a2540] rounded px-2 py-1 text-xs text-white">
                      <option value="new">جديد</option><option value="contacted">تم التواصل</option><option value="closed">مغلق</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
