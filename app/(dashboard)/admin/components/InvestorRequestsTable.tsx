import { getInvestorRequests } from '@/app/actions/admin-requests';
import RequestStatusRow from './RequestStatusRow';

export default async function InvestorRequestsTable() {
    const requests = await getInvestorRequests();

    if (!requests || requests.length === 0) {
        return (
            <div className="bg-[#fdfbf7] border border-[#e5e0d8] rounded-xl p-8 text-center">
                <p className="text-slate-600">No investor requests have been made yet.</p>
            </div>
        );
    }

    return (
        <div className="bg-[#fdfbf7] border border-[#e5e0d8] rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#e5e0d8] bg-white">
                <h2 className="text-xl font-serif text-[#0a192f]">Inbound Investor Interests</h2>
                <p className="text-sm text-slate-600 mt-1">Manage requests for your GitHub repository assets.</p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-600 border-b border-[#e5e0d8]">
                        <tr>
                            <th className="p-4 font-medium">Investor</th>
                            <th className="p-4 font-medium">Requested Asset (Repo)</th>
                            <th className="p-4 font-medium">Date</th>
                            <th className="p-4 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {requests.map((request) => (
                            <RequestStatusRow key={request.id} request={request} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
