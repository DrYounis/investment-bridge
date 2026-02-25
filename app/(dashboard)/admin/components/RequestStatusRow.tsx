'use client'

import { useState, useTransition } from 'react';
import { updateRequestStatus } from '@/app/actions/admin-requests';

export default function RequestStatusRow({ request }: { request: any }) {
    const [isPending, startTransition] = useTransition();
    const [currentStatus, setCurrentStatus] = useState(request.status);

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        setCurrentStatus(newStatus);

        startTransition(async () => {
            await updateRequestStatus(request.id, newStatus);
        });
    };

    const statusColors: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-800',
        under_review: 'bg-blue-100 text-blue-800',
        contacted: 'bg-[#d4af37]/20 text-[#b5952f]', // Gold tint
        closed: 'bg-green-100 text-green-800',
    };

    return (
        <tr className="border-b border-[#e5e0d8] hover:bg-slate-50 transition-colors">
            <td className="p-4 align-middle">
                <p className="font-medium text-[#0a192f]">
                    {request.profiles?.full_name || 'Unknown Investor'}
                </p>
                <p className="text-sm text-slate-500">{request.profiles?.email}</p>
            </td>
            <td className="p-4 align-middle">
                <a
                    href={request.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[#0a192f] hover:text-[#d4af37] transition-colors"
                >
                    {request.project_name.replace(/-/g, ' ')}
                </a>
            </td>
            <td className="p-4 align-middle text-sm text-slate-500">
                {new Date(request.requested_at).toLocaleDateString()}
            </td>
            <td className="p-4 align-middle">
                <div className="flex items-center gap-3">
                    <select
                        value={currentStatus}
                        onChange={handleStatusChange}
                        disabled={isPending}
                        className={`text-sm rounded-full px-3 py-1 border-0 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#0a192f] ${statusColors[currentStatus]} disabled:opacity-50`}
                    >
                        <option value="pending">Pending</option>
                        <option value="under_review">Under Review</option>
                        <option value="contacted">Contacted</option>
                        <option value="closed">Closed</option>
                    </select>
                    {isPending && <span className="text-xs text-slate-400">Saving...</span>}
                </div>
            </td>
        </tr>
    );
}
