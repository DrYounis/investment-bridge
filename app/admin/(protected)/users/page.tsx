'use client';

import { useState, useEffect, useMemo } from 'react';

type UserType = 'all' | 'entrepreneur' | 'investor' | 'super_admin';
type SortMode = 'newest' | 'active' | 'lastVisit';

interface User {
  id: string;
  full_name: string;
  email: string;
  user_type: string;
  created_at: string;
  phone: string | null;
  approval_status: string | null;
  last_sign_in_at: string | null;
  last_visit: string | null;
  visit_count: number;
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

function formatArabicDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('ar-SA');
}

function formatWhatsAppLink(phone: string | null): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, '');
  if (!digits) return null;
  // Saudi: 05... → 966...
  if (digits.startsWith('0') && digits.length >= 9) {
    return `https://wa.me/966${digits.slice(1)}`;
  }
  return `https://wa.me/${digits}`;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<UserType>('all');
  const [sort, setSort] = useState<SortMode>('newest');

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
    // Sort
    if (sort === 'active') {
      list = [...list].sort((a, b) => (b.visit_count || 0) - (a.visit_count || 0));
    } else if (sort === 'lastVisit') {
      list = [...list].sort((a, b) => {
        const aDate = a.last_visit || a.created_at || '';
        const bDate = b.last_visit || b.created_at || '';
        return bDate.localeCompare(aDate);
      });
    }
    // 'newest' is default — already sorted by created_at desc from API
    return list;
  }, [users, search, filter, sort]);

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

  const SORT_TOGGLES: { key: SortMode; label: string }[] = [
    { key: 'newest', label: 'الأحدث تسجيلاً' },
    { key: 'active', label: 'الأكثر نشاطاً' },
    { key: 'lastVisit', label: 'آخر زيارة' },
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
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
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

      {/* Sort toggle */}
      <div className="flex gap-1 mb-6">
        {SORT_TOGGLES.map((t) => (
          <button
            key={t.key}
            onClick={() => setSort(t.key)}
            className="px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all"
            style={{
              background: sort === t.key ? '#1e2d4a' : '#060c18',
              color: sort === t.key ? '#c9a84c' : '#4a5a78',
              border: '1px solid #1e2d4a',
            }}
          >
            {t.label}
          </button>
        ))}
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
              <th className="py-3 px-4 text-xs font-bold text-[#4a5a78]">المستخدم</th>
              <th className="py-3 px-4 text-xs font-bold text-[#4a5a78]">الدور</th>
              <th className="py-3 px-4 text-xs font-bold text-[#4a5a78]">تاريخ التسجيل</th>
              <th className="py-3 px-4 text-xs font-bold text-[#4a5a78]">آخر زيارة</th>
              <th className="py-3 px-4 text-xs font-bold text-[#4a5a78]">تكرار الدخول</th>
              <th className="py-3 px-4 text-xs font-bold text-[#4a5a78]">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-[#4a5a78]">
                  لا يوجد مستخدمون
                </td>
              </tr>
            ) : (
              filtered.map((u) => {
                const waLink = formatWhatsAppLink(u.phone);
                return (
                  <tr
                    key={u.id}
                    className="border-b border-[#1e2d4a]/50 hover:bg-[#c9a84c]/5 transition-colors"
                  >
                    {/* المستخدم — name + email + investor badge */}
                    <td className="py-3 px-4">
                      <div className="text-sm text-white font-bold">{u.full_name || '—'}</div>
                      <div className="text-xs text-[#8a9bb8]" dir="ltr" style={{ textAlign: 'right' }}>
                        {u.email}
                      </div>
                      {u.user_type === 'investor' && u.approval_status && (
                        <span
                          className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                          style={{
                            background: `${STATUS_LABELS[u.approval_status]?.color || '#64748b'}20`,
                            color: STATUS_LABELS[u.approval_status]?.color || '#64748b',
                          }}
                        >
                          {STATUS_LABELS[u.approval_status]?.label || u.approval_status}
                        </span>
                      )}
                    </td>
                    {/* الدور */}
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
                    {/* تاريخ التسجيل */}
                    <td className="py-3 px-4 text-sm text-[#8a9bb8]">
                      {formatArabicDate(u.created_at)}
                    </td>
                    {/* آخر زيارة */}
                    <td className="py-3 px-4 text-sm text-[#8a9bb8]">
                      {formatArabicDate(u.last_visit)}
                    </td>
                    {/* تكرار الدخول */}
                    <td className="py-3 px-4">
                      {u.visit_count > 0 ? (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#1e2d4a] text-[#8a9bb8]">
                          {u.visit_count.toLocaleString('ar-SA')}x
                        </span>
                      ) : (
                        <span className="text-[#4a5a78] text-xs">—</span>
                      )}
                    </td>
                    {/* إجراءات */}
                    <td className="py-3 px-4">
                      {waLink ? (
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#25D366] hover:bg-[#1ebe5c] transition-colors"
                          title="واتساب"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                        </a>
                      ) : (
                        <span className="text-[#4a5a78] text-xs">—</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 ? (
          <p className="text-center text-[#4a5a78] py-16">لا يوجد مستخدمون</p>
        ) : (
          filtered.map((u) => {
            const waLink = formatWhatsAppLink(u.phone);
            return (
              <div
                key={u.id}
                className="bg-[#060c18] border border-[#1e2d4a] rounded-lg p-4 space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-white font-bold">{u.full_name || '—'}</span>
                    {u.user_type === 'investor' && u.approval_status && (
                      <span
                        className="inline-block mr-2 px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{
                          background: `${STATUS_LABELS[u.approval_status]?.color || '#64748b'}20`,
                          color: STATUS_LABELS[u.approval_status]?.color || '#64748b',
                        }}
                      >
                        {STATUS_LABELS[u.approval_status]?.label || u.approval_status}
                      </span>
                    )}
                  </div>
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
                  <span>آخر زيارة: {formatArabicDate(u.last_visit)}</span>
                  <span>
                    {u.visit_count > 0
                      ? `${u.visit_count.toLocaleString('ar-SA')}x`
                      : '—'}
                  </span>
                </div>
                {waLink && (
                  <div className="pt-1">
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs text-[#25D366] hover:text-[#1ebe5c]"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      واتساب
                    </a>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
