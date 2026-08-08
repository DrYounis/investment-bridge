import { requireRole } from '@/lib/auth/requireRole';
import AdminShell from './AdminShell';

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  await requireRole(); // Any authenticated user — AdminShell does super-admin email check

  return <AdminShell>{children}</AdminShell>;
}
