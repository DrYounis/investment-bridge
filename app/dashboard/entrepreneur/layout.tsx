import { requireRole } from '@/lib/auth/requireRole';
import type { Metadata } from 'next';
import EntrepreneurSidebar from '@/app/components/entrepreneur/Sidebar';

export const metadata: Metadata = {
  title: 'لوحة التحكم | رائد أعمال | مرفأ',
  description: 'لوحة تحكم رائد الأعمال - مرفأ',
};

export default async function EntrepreneurLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(['entrepreneur']);

  return (
    <div className="min-h-screen flex" dir="rtl" style={{ background: '#0a0f1e' }}>
      <div className="hidden lg:block">
        <EntrepreneurSidebar />
      </div>
      <main className="flex-1 lg:me-64 p-4 md:p-6" style={{ background: '#0a0f1e' }}>
        {children}
      </main>
    </div>
  );
}
