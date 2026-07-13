'use client';

import { useState, useEffect, useMemo } from 'react';

interface Project {
  id: string; slug: string; name_ar: string; name_en: string; icon: string;
  sector_ar: string; stage_ar: string; teaser_ar: string;
  is_featured: boolean; is_active: boolean; display_order: number;
  is_platform_originated: boolean;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Project>>({});
  const [saving, setSaving] = useState(false);

  const fetchProjects = async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/admin/projects');
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Error'); setLoading(false); return; }
      setProjects(data.projects || []);
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed'); }
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const patchProject = async (id: string, updates: Partial<Project>, revert?: Project[]) => {
    if (revert) setProjects(revert);
    setSaving(true);
    try {
      const res = await fetch('/api/admin/projects', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, updates }) });
      if (!res.ok) { setError((await res.json()).error || 'Failed'); if (revert) setProjects(revert); }
    } catch { setError('Failed'); if (revert) setProjects(revert); }
    setSaving(false);
  };

  const toggle = (id: string, field: 'is_active' | 'is_featured', current: boolean) => {
    const prev = [...projects];
    setProjects(prev => prev.map(p => p.id === id ? { ...p, [field]: !current } : p));
    patchProject(id, { [field]: !current }, prev);
  };

  const saveOrder = (id: string, display_order: number) => {
    patchProject(id, { display_order });
  };

  const openEdit = (p: Project) => {
    setExpanded(p.id);
    setEditForm({ name_ar: p.name_ar, sector_ar: p.sector_ar, stage_ar: p.stage_ar, teaser_ar: p.teaser_ar });
  };

  const saveEdit = async (id: string) => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/projects', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, updates: editForm }) });
      if (!res.ok) { setError((await res.json()).error || 'Failed'); setSaving(false); return; }
      setProjects(prev => prev.map(p => p.id === id ? { ...p, ...editForm } : p));
      setExpanded(null);
    } catch { setError('Failed'); }
    setSaving(false);
  };

  const active = projects.filter(p => p.is_active).length;
  const inactive = projects.length - active;

  if (loading) return <div className="animate-pulse space-y-4" dir="rtl"><div className="h-8 bg-[#1a2540] rounded w-72" /><div className="h-4 bg-[#1a2540] rounded w-48" /><div className="h-64 bg-[#0d1628] rounded-2xl border border-[#1a2540] mt-6" /></div>;
  if (error && projects.length === 0) return <div dir="rtl" className="text-center py-16"><p className="text-red-400 text-lg font-bold mb-2">خطأ</p><p className="text-[#8a9bb8]">{error}</p></div>;

  return (
    <div dir="rtl" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-white">المشاريع</h1>
        <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-[#c9a84c]/15 text-[#c9a84c]">{projects.length}</span>
      </div>

      <div className="flex gap-3 mb-6 text-sm">
        <span className="text-[#8a9bb8]"><span className="text-[#10b981] font-bold">{active}</span> نشط</span>
        <span className="text-[#8a9bb8]"><span className="text-[#64748b] font-bold">{inactive}</span> غير نشط</span>
      </div>

      {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

      <div className="space-y-2">
        {projects.filter(p => p.is_active).map(p => (
          <div key={p.id} className="bg-[#060c18] border border-[#1e2d4a] rounded-lg overflow-hidden">
            {/* Row */}
            <div className="flex items-center gap-3 p-4 flex-wrap">
              <span className="text-lg">{p.icon || '📦'}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-white text-sm">{p.name_ar}</span>
                  {p.is_platform_originated && <span className="text-[10px] font-bold bg-[#c9a84c]/15 text-[#c9a84c] px-2 py-0.5 rounded-full">من إنتاج مرفأ</span>}
                </div>
                <p className="text-xs text-[#8a9bb8]">{p.sector_ar} · {p.stage_ar}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <label className="flex items-center gap-1 text-xs text-[#8a9bb8] cursor-pointer"><input type="checkbox" checked={p.is_featured} onChange={() => toggle(p.id, 'is_featured', p.is_featured)} className="accent-[#c9a84c]" /> مميز</label>
                <label className="flex items-center gap-1 text-xs text-[#8a9bb8] cursor-pointer"><input type="checkbox" checked={p.is_active} onChange={() => toggle(p.id, 'is_active', p.is_active)} className="accent-[#c9a84c]" /> نشط</label>
                <input type="number" defaultValue={p.display_order} onBlur={e => { const v = parseInt(e.target.value); if (!isNaN(v) && v !== p.display_order) saveOrder(p.id, v); }} className="w-16 bg-[#0a0f1e] border border-[#1e2d4a] rounded px-2 py-1 text-xs text-white text-center" />
                <button onClick={() => expanded === p.id ? setExpanded(null) : openEdit(p)} className="text-xs font-bold text-[#c9a84c] hover:underline">تعديل</button>
              </div>
            </div>

            {/* Expandable edit row */}
            {expanded === p.id && (
              <div className="border-t border-[#1e2d4a] p-4 space-y-3 bg-[#0a0f1e]">
                {(['name_ar','sector_ar','stage_ar','teaser_ar'] as const).map(f => (
                  <div key={f}>
                    <label className="block text-xs text-[#4a5a78] mb-1">{f === 'name_ar' ? 'الاسم' : f === 'sector_ar' ? 'القطاع' : f === 'stage_ar' ? 'المرحلة' : 'الوصف'}</label>
                    {f === 'teaser_ar' ? <textarea value={editForm[f] || ''} onChange={e => setEditForm({ ...editForm, [f]: e.target.value })} rows={2} className="w-full bg-[#060c18] border border-[#1e2d4a] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#c9a84c]" /> : <input value={editForm[f] || ''} onChange={e => setEditForm({ ...editForm, [f]: e.target.value })} className="w-full bg-[#060c18] border border-[#1e2d4a] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#c9a84c]" />}
                  </div>
                ))}
                <div className="flex gap-2">
                  <button onClick={() => saveEdit(p.id)} disabled={saving} className="px-4 py-2 rounded-lg text-xs font-bold bg-[#c9a84c] text-[#0a0f1e] disabled:opacity-50">{saving ? '...' : 'حفظ'}</button>
                  <button onClick={() => setExpanded(null)} className="px-4 py-2 rounded-lg text-xs font-bold bg-[#1e2d4a] text-[#8a9bb8]">إلغاء</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Inactive projects — collapsed */}
      {inactive > 0 && (
        <details className="mt-6">
          <summary className="cursor-pointer text-sm text-[#8a9bb8] hover:text-white mb-3">مشاريع غير نشطة ({inactive})</summary>
          <div className="space-y-2">
            {projects.filter(p => !p.is_active).map(p => (
              <div key={p.id} className="bg-[#060c18] border border-[#1e2d4a] rounded-lg p-3 flex items-center gap-3 opacity-60">
                <span className="text-lg">{p.icon || '📦'}</span>
                <span className="text-sm text-white">{p.name_ar}</span>
                <span className="text-xs text-[#4a5a78]">{p.sector_ar}</span>
                <label className="flex items-center gap-1 text-xs text-[#8a9bb8] cursor-pointer mr-auto"><input type="checkbox" checked={false} onChange={() => toggle(p.id, 'is_active', false)} className="accent-[#c9a84c]" /> تفعيل</label>
              </div>
            ))}
          </div>
        </details>
      )}

      {projects.length === 0 && <p className="text-center text-[#4a5a78] py-16">لا توجد مشاريع</p>}
    </div>
  );
}
