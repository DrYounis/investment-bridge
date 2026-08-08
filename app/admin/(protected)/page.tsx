import AdminDashboardClient from '@/app/(dashboard)/admin/components/AdminDashboardClient';
import InvestorRequestsTable from '@/app/(dashboard)/admin/components/InvestorRequestsTable';

export default function AdminPage() {
  return (
    <AdminDashboardClient>
      <div className="mt-8">
        <InvestorRequestsTable />
      </div>
    </AdminDashboardClient>
  );
}
