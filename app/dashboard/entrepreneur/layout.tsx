import type { Metadata } from 'next';
import EntrepreneurSidebar from '@/app/components/entrepreneur/Sidebar';

export const metadata: Metadata = {
  title: 'لوحة التحكم | رائد أعمال | مرفأ',
  description: 'لوحة تحكم رائد الأعمال - مرفأ',
};

export default function EntrepreneurLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex" dir="rtl" style={{ background: '#0a0f1e' }}>
      <EntrepreneurSidebar />
      <main className="flex-1 me-64 p-6" style={{ background: '#0a0f1e' }}>
        {children}
      </main>
    </div>
  );
}
