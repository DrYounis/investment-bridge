'use client';

import React from 'react';

interface Investor {
  name: string;
  status: string;
  statusColor: string;
  amount: string;
}

const investors: Investor[] = [
  { name: 'صندوق رؤية للتقنية', status: 'تقييم مستمر', statusColor: '#f0a050', amount: '٢٠٠ ألف' },
  { name: 'أحمد الزهراني - ملاك', status: 'تفاوض نشط', statusColor: '#5e9ef0', amount: '١٠٠ ألف' },
  { name: 'وادي مسرعة الأعمال', status: 'ملتزم ✓', statusColor: '#3ecf8e', amount: '١٥٠ ألف' },
  { name: 'مجموعة رأس المال', status: 'مراجعة أولية', statusColor: '#6b7a95', amount: '٥٠٠ ألف' },
];

export default function InvestorPipeline() {
  return (
    <div className="rounded-2xl p-5 space-y-4" style={{ background: '#0d1428' }}>
      <h3 className="text-sm font-bold" style={{ color: '#e8eaf0' }}>
        👥 مسار المستثمرين
      </h3>
      <div className="space-y-3">
        {investors.map((inv) => (
          <div
            key={inv.name}
            className="rounded-xl p-4 transition-all hover:brightness-110"
            style={{ background: '#111932', border: '1px solid #1c2640' }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-bold" style={{ color: '#e8eaf0' }}>
                {inv.name}
              </span>
              <span className="text-sm font-black" style={{ color: '#c9a84c' }}>
                {inv.amount}
              </span>
            </div>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{
                color: inv.statusColor,
                background: `${inv.statusColor}15`,
              }}
            >
              {inv.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
