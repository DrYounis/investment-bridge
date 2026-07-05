'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const QUALITATIVE: string[] = [
  '⭐ مرفأ — حيث تَرسو الطموحات',
  'مستثمرون من الرياض وحائل انضموا هذا الشهر',
  'انضم إلى مجتمع رواد الأعمال والمستثمرين',
  'منصتك للوصول إلى فرص استثمارية حقيقية',
  'لقاءات أسبوعية بين رواد الأعمال والمستثمرين',
];

export default function SocialProofTicker() {
  const supabase = createClient();
  const [messages, setMessages] = useState<string[]>([
    '⭐ مرفأ — حيث تَرسو الطموحات',
  ]);

  useEffect(() => {
    async function load() {
      try {
        const [ent, inv, mtg] = await Promise.allSettled([
          supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'entrepreneur'),
          supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'investor'),
          supabase.from('meetings').select('*', { count: 'exact', head: true }).gte('meeting_date', new Date(Date.now() - 7 * 86400000).toISOString()),
        ]);

        const e = ent.status === 'fulfilled' ? (ent.value.count || 0) : 0;
        const i = inv.status === 'fulfilled' ? (inv.value.count || 0) : 0;
        const m = mtg.status === 'fulfilled' ? (mtg.value.count || 0) : 0;

        const live: string[] = [];

        if (e > 0) {
          live.push(`🚀 انضم ${e} ${e === 1 ? 'رائد أعمال' : 'رائد أعمال'} هذا الأسبوع`);
        }
        if (i > 0) {
          live.push(`💼 ${i} ${i === 1 ? 'مستثمر نشط' : 'مستثمر نشط'} على المنصة`);
        }
        if (m > 0) {
          live.push(`🤝 ${m} ${m === 1 ? 'لقاء' : 'لقاء'} أُقيم هذا الأسبوع`);
        }

        // If no live data, show qualitative messages only
        if (live.length === 0) {
          setMessages(QUALITATIVE);
        } else {
          setMessages([...live, ...QUALITATIVE.slice(0, 1)]);
        }
      } catch {
        setMessages(QUALITATIVE);
      }
    }
    load();
  }, [supabase]);

  const items = [...messages, ...messages];

  return (
    <div
      className="overflow-hidden whitespace-nowrap py-3 border-t border-b border-[#1a2540]"
      style={{ background: '#0d1628' }}
      dir="rtl"
    >
      <div className="marfa-ticker inline-flex">
        {items.map((msg, i) => (
          <span
            key={i}
            className="inline-flex items-center text-sm mx-6"
            style={{ color: '#a0aec0', fontFamily: 'var(--font-tajawal), sans-serif' }}
          >
            {msg}
            {i < items.length - 1 && (
              <span className="mx-6" style={{ color: '#c9a84c' }}>·</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
