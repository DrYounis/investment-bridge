'use client';

import { useState, useEffect, useMemo } from 'react';

type UserType = 'all' | 'entrepreneur' | 'investor' | 'super_admin';

interface User {
  id: string;
  full_name: string;
  email: string;
  user_type: string;
  created_at: string;
  approval_status: string | null;
}

const TYPE_LABELS: Record<string, string> = {
  entrepreneur: 'رائد أعمال',
  investor: 'مستثمر',
  super_admin: 'مدير',
  admin: 'مدير',
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: 'قيد المراجعة', color: '#c9a84c' },
  approved: { label: 'معتمد', color: '#10b981' },
  rejected: { label: 'مرفوض', color: '#ef4444' },
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<UserType>('all');

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/admin/users');
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || data.errors?.[0] || 'Unknown error');
        } else {
          setUsers(data.users || []);
          if (data.errors?.length) setError(data.errors[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch');
      }
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    let list = users;
    if (filter !== 'all') list = list.filter((u) => u.user_type === filter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (u) =>
          (u.full_name || '').toLowerCase().includes(q) ||
          (u.email || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [users, search, filter]);

  const stats = useMemo(() => {
    const total = users.length;
    const entrepreneurs = users.filter((u) => u.user_type === 'entrepreneur').length;
    const investors = users.filter((u) => u.user_type === 'investor').length;
    return { total, entrepreneurs, investors };
  }, [users]);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="animate-pulse space-y-4" dir="rtl">
        <div className="h-8 bg-[#1a2540] rounded w-72" />
        <div className="h-4 bg-[#1a2540] rounded w-48" />
        <div className="h-64 bg-[#0d1628] rounded-2xl border border-[#1a2540] mt-6" />
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (error && users.length === 0) {
    return (
      <div dir="rtl" className="text-center py-16">
        <p className="text-red-400 text-lg font-bold mb-2">خطأ في تحميل البيانات</p>
        <p className="text-[#8a9bb8]">{error}</p>
      </div>
    );
  }

  // ── Page ─────────────────────────────────────────────────────────────────
  const FILTER_TABS: { key: UserType; label: string }[] = [
    { key: 'all', label: 'الكل' },
    { key: 'entrepreneur', label: 'رواد الأعمال' },
    { key: 'investor', label: 'المستثمرون' },
    { key: 'super_admin', label: 'مدراء' },
  ];

  return (
    <div dir="rtl" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-white">المستخدمون</h1>
        <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-[#c9a84c]/15 text-[#c9a84c]">
          {users.length}
        </span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'إجمالي المستخدمين', value: stats.total, color: '#c9a84c' },
          { label: 'رواد الأعمال', value: stats.entrepreneurs, color: '#8a9bb8' },
          { label: 'المستثمرون', value: stats.investors, color: '#60a5fa' },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-[#060c18] border border-[#1e2d4a] rounded-lg p-4"
          >
            <p className="text-xs text-[#4a5a78] mb-1">{s.label}</p>
            <p className="text-2xl font-black" style={{ color: s.color }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Search + filter row */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="بحث بالاسم أو البريد..."
          className="flex-1 bg-[#060c18] border border-[#1e2d4a] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-[#4a5a78] outline-none focus:border-[#c9a84c] transition-colors"
        />
        <div className="flex gap-1 flex-wrap">
          {FILTER_TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className="px-4 py-2 rounded-lg text-xs font-bold transition-all"
              style={{
                background: filter === t.key ? '#c9a84c' : '#060c18',
                color: filter === t.key ? '#0a0f1e' : '#8a9bb8',
                border:
                  filter === t.key
                    ? '1px solid #c9a84c'
                    : '1px solid #1e2d4a',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error banner (non-fatal) */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Table (desktop) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#1e2d4a] text-right">
              <th className="py-3 px-4 text-xs font-bold text-[#4a5a78]">الاسم</th>
              <th className="py-3 px-4 text-xs font-bold text-[#4a5a78]">البريد الإلكتروني</th>
              <th className="py-3 px-4 text-xs font-bold text-[#4a5a78]">النوع</th>
              <th className="py-3 px-4 text-xs font-bold text-[#4a5a78]">حالة الاعتماد</th>
              <th className="py-3 px-4 text-xs font-bold text-[#4a5a78]">تاريخ التسجيل</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-16 text-center text-[#4a5a78]">
                  لا يوجد مستخدمون
                </td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-[#1e2d4a]/50 hover:bg-[#c9a84c]/5 transition-colors"
                >
                  <td className="py-3 px-4 text-sm text-white">{u.full_name || '—'}</td>
                  <td className="py-3 px-4 text-sm text-[#8a9bb8]" dir="ltr" style={{ textAlign: 'right' }}>
                    {u.email}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold"
                      style={{
                        background:
                          u.user_type === 'super_admin'
                            ? '#c9a84c20'
                            : u.user_type === 'investor'
                            ? '#60a5fa20'
                            : '#8a9bb820',
                        color:
                          u.user_type === 'super_admin'
                            ? '#c9a84c'
                            : u.user_type === 'investor'
                            ? '#60a5fa'
                            : '#8a9bb8',
                      }}
                    >
                      {TYPE_LABELS[u.user_type] || u.user_type}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {u.user_type === 'investor' && u.approval_status ? (
                      <span
                        className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold"
                        style={{
                          background: `${STATUS_LABELS[u.approval_status]?.color || '#64748b'}20`,
                          color: STATUS_LABELS[u.approval_status]?.color || '#64748b',
                        }}
                      >
                        {STATUS_LABELS[u.approval_status]?.label || u.approval_status}
                      </span>
                    ) : (
                      <span className="text-[#4a5a78] text-xs">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm text-[#8a9bb8]">
                    {u.created_at
                      ? new Date(u.created_at).toLocaleDateString('ar-SA')
                      : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 ? (
          <p className="text-center text-[#4a5a78] py-16">لا يوجد مستخدمون</p>
        ) : (
          filtered.map((u) => (
            <div
              key={u.id}
              className="bg-[#060c18] border border-[#1e2d4a] rounded-lg p-4 space-y-2"
            >
              <div className="flex justify-between items-start">
                <span className="text-white font-bold">{u.full_name || '—'}</span>
                <span
                  className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold"
                  style={{
                    background:
                      u.user_type === 'super_admin'
                        ? '#c9a84c20'
                        : u.user_type === 'investor'
                        ? '#60a5fa20'
                        : '#8a9bb820',
                    color:
                      u.user_type === 'super_admin'
                        ? '#c9a84c'
                        : u.user_type === 'investor'
                        ? '#60a5fa'
                        : '#8a9bb8',
                  }}
                >
                  {TYPE_LABELS[u.user_type] || u.user_type}
                </span>
              </div>
              <p className="text-sm text-[#8a9bb8]" dir="ltr" style={{ textAlign: 'right' }}>
                {u.email}
              </p>
              <div className="flex justify-between text-xs text-[#4a5a78]">
                <span>
                  {u.user_type === 'investor' && u.approval_status
                    ? STATUS_LABELS[u.approval_status]?.label || u.approval_status
                    : '—'}
                </span>
                <span>
                  {u.created_at
                    ? new Date(u.created_at).toLocaleDateString('ar-SA')
                    : '—'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
