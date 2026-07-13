'use client';

import { useState, useEffect } from 'react';
import { TOPICS, CATEGORIES } from '@/lib/learn/taxonomy';

interface Article {
  id: string; slug: string; title_ar: string; category: string; summary_ar: string;
  content_ar: string; reading_minutes: number; status: string; created_at: string; updated_at: string;
}

export default function AdminLearnPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'draft' | 'published'>('all');

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/admin/learn');
      const data = await res.json();
      if (!res.ok) { setError(data.error); setLoading(false); return; }
      setArticles(data.articles || []);
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed'); }
    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchArticles(); }, []);

  const toggleStatus = async (article: Article) => {
    const newStatus = article.status === 'published' ? 'draft' : 'published';
    const prev = [...articles];
    setArticles(prev => prev.map(a => a.id === article.id ? { ...a, status: newStatus } : a));
    try {
      const res = await fetch('/api/admin/learn', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: article.id, updates: { status: newStatus } }),
      });
      if (!res.ok) { setArticles(prev); setError((await res.json()).error); }
    } catch { setArticles(prev); }
  };

  const deleteArticle = async (id: string) => {
    const prev = [...articles];
    setArticles(prev => prev.filter(a => a.id !== id));
    try {
      const res = await fetch('/api/admin/learn', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
      if (!res.ok) { setArticles(prev); setError((await res.json()).error); }
    } catch { setArticles(prev); }
  };

  const generateArticle = async (slug: string) => {
    setGenerating(slug);
    try {
      const res = await fetch('/api/admin/learn-generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error); setGenerating(null); return; }
      await fetchArticles();
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed'); }
    setGenerating(null);
  };

  const existingSlugs = new Set(articles.map(a => a.slug));
  const filtered = articles.filter(a => filter === 'all' || a.status === filter);

  if (loading) return <div className="animate-pulse space-y-4" dir="rtl"><div className="h-8 bg-[#1a2540] rounded w-72" /><div className="h-64 bg-[#0d1628] rounded-2xl border border-[#1a2540]" /></div>;

  return (
    <div dir="rtl" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
      <h1 className="text-2xl font-bold text-white mb-6">مركز المعرفة — الإدارة</h1>

      {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[{ key: 'all', label: 'الكل' }, { key: 'draft', label: 'مسودة' }, { key: 'published', label: 'منشور' }].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key as typeof filter)} className="px-3 py-1.5 rounded-lg text-xs font-bold"
            style={{ background: filter === f.key ? '#c9a84c' : '#060c18', color: filter === f.key ? '#0a0f1e' : '#8a9bb8', border: filter === f.key ? '1px solid #c9a84c' : '1px solid #1e2d4a' }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Topics to generate */}
      <details className="mb-6">
        <summary className="text-sm text-[#8a9bb8] cursor-pointer hover:text-white mb-3">توليد المقالات ({TOPICS.filter(t => !existingSlugs.has(t.slug)).length} مقالاً غير منشأ)</summary>
        <div className="space-y-2 mt-2 max-h-64 overflow-y-auto">
          {TOPICS.filter(t => !existingSlugs.has(t.slug)).map(t => (
            <div key={t.slug} className="flex items-center justify-between bg-[#060c18] border border-[#1e2d4a] rounded-lg px-4 py-2">
              <div>
                <span className="text-sm text-white">{t.title_ar}</span>
                <span className="text-xs text-[#4a5a78] mr-3">{CATEGORIES.find(c => c.slug === t.category)?.label}</span>
              </div>
              <button onClick={() => generateArticle(t.slug)} disabled={generating === t.slug}
                className="px-3 py-1 rounded text-xs font-bold bg-[#c9a84c]/20 text-[#c9a84c] disabled:opacity-50 border border-[#c9a84c]/30">
                {generating === t.slug ? '⏳ جاري التوليد...' : '🤖 توليد'}
              </button>
            </div>
          ))}
        </div>
      </details>

      {/* Published table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse"><thead><tr className="border-b border-[#1e2d4a] text-right">
          <th className="py-3 px-3 text-xs font-bold text-[#4a5a78]">العنوان</th><th className="py-3 px-3 text-xs font-bold text-[#4a5a78]">الفئة</th><th className="py-3 px-3 text-xs font-bold text-[#4a5a78]">الحالة</th><th className="py-3 px-3 text-xs font-bold text-[#4a5a78]">القراءة</th><th className="py-3 px-3 text-xs font-bold text-[#4a5a78]">التاريخ</th><th className="py-3 px-3 text-xs font-bold text-[#4a5a78]">إجراءات</th>
        </tr></thead>
        <tbody>
          {filtered.length === 0 ? <tr><td colSpan={6} className="py-16 text-center text-[#4a5a78]">لا توجد مقالات</td></tr> :
          filtered.map(a => (
            <tr key={a.id} className="border-b border-[#1e2d4a]/50">
              <td className="py-3 px-3 text-sm text-white">
                {a.title_ar}
                {!a.content_ar && <span className="text-[10px] text-[#4a5a78] block">بدون محتوى</span>}
              </td>
              <td className="py-3 px-3 text-xs text-[#8a9bb8]">{CATEGORIES.find(c => c.slug === a.category)?.label}</td>
              <td className="py-3 px-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: a.status === 'published' ? '#10b98120' : '#c9a84c20', color: a.status === 'published' ? '#10b981' : '#c9a84c' }}>{a.status === 'published' ? 'منشور' : 'مسودة'}</span></td>
              <td className="py-3 px-3 text-xs text-[#8a9bb8]">{a.reading_minutes} د</td>
              <td className="py-3 px-3 text-xs text-[#8a9bb8]">{a.created_at ? new Date(a.created_at).toLocaleDateString('ar-SA') : '—'}</td>
              <td className="py-3 px-3">
                <div className="flex gap-1">
                  <button onClick={() => toggleStatus(a)} className="px-2 py-1 rounded text-[10px] font-bold"
                    style={{ background: a.status === 'published' ? '#c9a84c20' : '#10b98120', color: a.status === 'published' ? '#c9a84c' : '#10b981' }}>
                    {a.status === 'published' ? 'إلغاء النشر' : 'نشر'}
                  </button>
                  {!a.content_ar && <button onClick={() => generateArticle(a.slug)} disabled={generating === a.slug}
                    className="px-2 py-1 rounded text-[10px] font-bold bg-[#c9a84c]/20 text-[#c9a84c] disabled:opacity-50">🤖</button>}
                  <button onClick={() => { if (confirm('حذف؟')) deleteArticle(a.id); }}
                    className="px-2 py-1 rounded text-[10px] font-bold bg-red-500/10 text-red-400">حذف</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody></table>
      </div>
    </div>
  );
}
