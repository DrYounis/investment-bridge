'use client';

import Link from 'next/link';
import BroadcastComposer from '@/components/admin/BroadcastComposer';
import BroadcastHistory from '@/components/admin/BroadcastHistory';

export default function AdminUpdatesPage() {
  return (
    <div className="min-h-screen px-6 py-10 max-w-3xl mx-auto" style={{ background: '#0a0f1e' }} dir="rtl">
      {/* Back link */}
      <Link
        href="/admin"
        className="inline-flex items-center gap-1 text-sm text-[#64748b] hover:text-[#c9a84c] transition-colors mb-8"
        style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 5 12 12 19" />
        </svg>
        لوحة الإدارة
      </Link>

      {/* Composer */}
      <BroadcastComposer />

      {/* Divider */}
      <div className="my-10 border-t border-[#1a2540]" />

      {/* History */}
      <BroadcastHistory />
    </div>
  );
}
