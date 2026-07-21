import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { getAllTerms } from '@/lib/learn/glossary';
import GlossaryClient from './GlossaryClient';

export const metadata: Metadata = {
  title: 'قاموس المصطلحات التجارية | مرفأ',
  description:
    '٣٠٠ مصطلح تجاري واستثماري ثنائي اللغة (عربي / English) — قاموس مرفأ الشامل لرواد الأعمال والمستثمرين السعوديين.',
  openGraph: {
    title: 'قاموس المصطلحات التجارية | مرفأ',
    description: '٣٠٠ مصطلح تجاري واستثماري ثنائي اللغة — قاموس مرفأ الشامل.',
    url: 'https://www.marfa.sa/learn/glossary',
  },
};

export default async function GlossaryPage() {
  const supabase = await createClient();
  const terms = await getAllTerms(supabase);

  // Derive batch info from terms
  const batchMap = new Map<number, { label: string; from: number; to: number }>();
  for (const t of terms) {
    if (!batchMap.has(t.batch_number)) {
      batchMap.set(t.batch_number, {
        label: t.batch_label,
        from: t.term_number,
        to: t.term_number,
      });
    } else {
      const b = batchMap.get(t.batch_number)!;
      if (t.term_number < b.from) b.from = t.term_number;
      if (t.term_number > b.to) b.to = t.term_number;
    }
  }
  const batches = Array.from(batchMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([number, info]) => ({
      number,
      label: info.label,
      from: info.from,
      to: info.to,
    }));

  if (terms.length === 0) {
    return (
      <main className="min-h-screen bg-[#faf8f2] pt-24 pb-16 px-4 text-center" dir="rtl">
        <p className="text-[#8a94a8] text-lg">لم يتم تحميل القاموس بعد. يرجى تشغيل سكربت الاستيراد أولاً.</p>
      </main>
    );
  }

  return <GlossaryClient terms={terms} batches={batches} />;
}
