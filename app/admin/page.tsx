import AdminDashboardClient from '../(dashboard)/admin/components/AdminDashboardClient';
import InvestorRequestsTable from '../(dashboard)/admin/components/InvestorRequestsTable';

export default function AdminPage() {
  return (
    <AdminDashboardClient>
      <div className="mt-8">
        <InvestorRequestsTable />
      </div>
    </AdminDashboardClient>
  );
}
