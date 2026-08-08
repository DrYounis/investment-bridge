import AdminDashboardClient from '@/app/(dashboard)/admin/components/AdminDashboardClient';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';

export default function AdminAnalyticsPage() {
  return (
    <AdminDashboardClient>
      <AnalyticsDashboard />
    </AdminDashboardClient>
  );
}
