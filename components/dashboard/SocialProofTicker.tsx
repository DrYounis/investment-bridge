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

function arPlural(n: number, forms: { one: string; two: string; few: string; many: string }): string {
  if (n === 1) return forms.one;
  if (n === 2) return forms.two;
  if (n >= 3 && n <= 10) return `${n} ${forms.few}`;
  return `${n} ${forms.many}`;
}

export default function SocialProofTicker() {
  const supabase = createClient();
  const [messages, setMessages] = useState<string[]>([
    '⭐ مرفأ — حيث تَرسو الطموحات',
  ]);

  useEffect(() => {
    async function load() {
      try {
        const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
        const [ent, inv, mtg] = await Promise.allSettled([
          supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'entrepreneur').gte('created_at', weekAgo),
          supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'investor'),
          supabase.from('meetings').select('*', { count: 'exact', head: true }).gte('meeting_date', weekAgo),
        ]);

        const e = ent.status === 'fulfilled' ? (ent.value.count || 0) : 0;
        const i = inv.status === 'fulfilled' ? (inv.value.count || 0) : 0;
        const m = mtg.status === 'fulfilled' ? (mtg.value.count || 0) : 0;

        const live: string[] = [];

        if (e > 0) {
          live.push(`🚀 ${arPlural(e, { one: 'انضم رائد أعمال واحد هذا الأسبوع', two: 'انضم رائدا أعمال هذا الأسبوع', few: 'روّاد أعمال انضموا هذا الأسبوع', many: 'رائد أعمال انضموا هذا الأسبوع' })}`);
        }
        if (i > 0) {
          live.push(`💼 ${arPlural(i, { one: 'مستثمر واحد نشط على المنصة', two: 'مستثمران نشطان على المنصة', few: 'مستثمرين نشطين على المنصة', many: 'مستثمر نشط على المنصة' })}`);
        }
        if (m > 0) {
          live.push(`🤝 ${arPlural(m, { one: 'أُقيم لقاء واحد هذا الأسبوع', two: 'أُقيم لقاءان هذا الأسبوع', few: 'لقاءات أُقيمت هذا الأسبوع', many: 'لقاءً أُقيم هذا الأسبوع' })}`);
        }

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
