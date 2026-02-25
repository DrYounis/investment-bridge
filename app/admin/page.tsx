import InvestorRequestsTable from '../(dashboard)/admin/components/InvestorRequestsTable';
import AdminDashboardClient from '../(dashboard)/admin/components/AdminDashboardClient';

export default async function AdminDashboard() {
    return (
        <AdminDashboardClient>
            <div className="mt-8">
                <InvestorRequestsTable />
            </div>
        </AdminDashboardClient>
    );
}
