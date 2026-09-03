'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { isSuperAdminEmail } from '@/lib/auth/adminEmails';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const NAV_ITEMS = [
  { href: '/admin', icon: '📊', label: 'لوحة التحكم' },
  { href: '/admin/users', icon: '👥', label: 'المستخدمون' },
  { href: '/admin/investors', icon: '💼', label: 'المستثمرون' },
];
const ADMIN_ITEMS = [
  { href: '/admin/meetings', icon: '📅', label: 'الاجتماعات' },
  { href: '/admin/majlis', icon: '🏛️', label: 'المجلس الاستشاري' },
  { href: '/admin/monthly', icon: '📊', label: 'التقييم الشهري' },
  { href: '/admin/projects', icon: '🚀', label: 'المشاريع' },
  { href: '/admin/product-lines', icon: '🏭', label: 'خطوط الإنتاج' },
];

type AdminUser = {
  full_name?: string | null;
  user_type?: string | null;
};

export default function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();

  const isPublicAdminPage = pathname === '/admin/login' || pathname === '/admin/instructor';

  useEffect(() => {
    // Skip auth check on login & instructor pages (instructor is self-protected via API)
    if (isPublicAdminPage) {
      return;
    }

    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const authUser = session?.user;
      if (!authUser?.email) { router.replace('/admin/login'); setLoading(false); return; }

      const envEmail = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL;
      if (!isSuperAdminEmail(authUser.email, envEmail ? [envEmail] : [])) { router.replace('/admin/login'); setLoading(false); return; }

      const { data: profile } = await supabase
        .from('profiles')
        .select('user_type, full_name')
        .eq('id', authUser.id)
        .maybeSingle();

      setUser({ ...authUser, ...profile });
      setLoading(false);
    })();
  }, [pathname, isPublicAdminPage]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  if (loading && !isPublicAdminPage) {
    return <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center"><p className="text-[#8a9bb8]">جاري التحميل...</p></div>;
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex font-arabic" dir="rtl">
      {/* Sidebar */}
      <aside className="hidden lg:block w-64 bg-[#060c18] border-e border-[#1e2d4a] flex flex-col shrink-0">
        <div className="p-5 border-b border-[#1e2d4a]">
          <Link href="/" className="text-xl font-bold text-[#c9a84c]">مرفأ</Link>
          <p className="text-xs text-[#4a5a78] mt-1">لوحة الإدارة</p>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <p className="px-3 py-2 text-xs font-bold text-[#4a5a78] uppercase tracking-wider">الرئيسية</p>
          {NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                pathname === item.href
                  ? 'bg-[#c9a84c]/15 text-[#c9a84c] font-bold'
                  : 'text-[#8a9bb8] hover:bg-[#c9a84c]/5 hover:text-white'
              }`}
            >
              <span>{item.icon}</span> {item.label}
            </Link>
          ))}

          <p className="px-3 py-2 text-xs font-bold text-[#4a5a78] uppercase tracking-wider mt-4">الإدارة</p>
          {ADMIN_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                pathname === item.href
                  ? 'bg-[#c9a84c]/15 text-[#c9a84c] font-bold'
                  : 'text-[#8a9bb8] hover:bg-[#c9a84c]/5 hover:text-white'
              }`}
            >
              <span>{item.icon}</span> {item.label}
            </Link>
          ))}
        </nav>

        {/* User info */}
        <div className="p-4 border-t border-[#1e2d4a]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-[#c9a84c]/20 flex items-center justify-center text-[#c9a84c] font-bold text-sm">
              {user?.full_name?.charAt(0) || 'م'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{user?.full_name || 'مدير'}</p>
              <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${
                user?.user_type === 'super_admin' ? 'bg-[#c9a84c]/20 text-[#c9a84c]' : 'bg-blue-500/20 text-blue-400'
              }`}>
                {user?.user_type === 'super_admin' ? 'مدير عام' : 'مدير'}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-2 text-sm text-[#8a9bb8] hover:text-red-400 border border-[#1e2d4a] rounded-lg hover:border-red-400/20 transition-all"
          >
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 border-b border-[#1e2d4a] flex items-center justify-between px-6 bg-[#0a0f1e]/80 backdrop-blur sticky top-0 z-40">
          <button className="lg:hidden p-2 text-[#8a9bb8]" onClick={() => {}} aria-label="القائمة">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
          </button>
          <h1 className="text-lg font-bold text-white">
            {NAV_ITEMS.concat(ADMIN_ITEMS).find(i => i.href === pathname)?.label || 'لوحة التحكم'}
          </h1>
        </header>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
