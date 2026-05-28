'use client';

import React from 'react';
import ProgressBar from '@/app/components/shared/ProgressBar';

interface Milestone {
  name: string;
  percent: number;
  color: string;
  done: boolean;
}

const milestones: Milestone[] = [
  { name: 'إطلاق MVP', percent: 100, color: '#3ecf8e', done: true },
  { name: '١٠٠ مستخدم تجريبي', percent: 68, color: '#5e9ef0', done: false },
  { name: 'إيرادات ١٠٠,٠٠٠ ر.س', percent: 45, color: '#c9a84c', done: false },
  { name: 'التحضير لجولة A', percent: 30, color: '#f0a050', done: false },
  { name: 'توسع ٣ مدن خليجية', percent: 10, color: '#5e9ef0', done: false },
];

export default function MilestoneTracker() {
  return (
    <div className="rounded-2xl p-5 space-y-5" style={{ background: '#0d1428' }}>
      <h3 className="text-sm font-bold" style={{ color: '#e8eaf0' }}>
        🎯 تتبع المؤشرات
      </h3>
      <div className="space-y-4">
        {milestones.map((m) => (
          <div key={m.name} className="space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold" style={{ color: '#e8eaf0' }}>
                {m.name}
              </span>
              <span
                className="text-xs font-bold"
                style={{ color: m.color }}
              >
                {m.percent}%{m.done ? ' ✓' : ''}
              </span>
            </div>
            <ProgressBar percent={m.percent} color={m.color} height={8} />
          </div>
        ))}
      </div>
    </div>
  );
}
