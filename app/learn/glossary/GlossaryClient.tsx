'use client';

import { useState, useMemo } from 'react';
import type { GlossaryTerm } from '@/lib/learn/glossary';

interface Props {
  terms: GlossaryTerm[];
  batches: { number: number; label: string; from: number; to: number }[];
}

export default function GlossaryClient({ terms, batches }: Props) {
  const [search, setSearch] = useState('');
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [expanded, setExpanded] = useState<Set<number>>(() => {
    // Expand only first batch by default
    const s = new Set<number>();
    if (batches.length > 0) s.add(batches[0].number);
    return s;
  });
  const [selectedBatch, setSelectedBatch] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return terms;
    const q = search.trim().toLowerCase();
    return terms.filter(
      (t) =>
        t.english_term.toLowerCase().includes(q) ||
        t.arabic_term.includes(q) ||
        t.english_def.toLowerCase().includes(q) ||
        t.arabic_def.includes(q)
    );
  }, [terms, search]);

  const grouped = useMemo(() => {
    const map = new Map<number, GlossaryTerm[]>();
    for (const t of filtered) {
      const arr = map.get(t.batch_number) || [];
      arr.push(t);
      map.set(t.batch_number, arr);
    }
    return map;
  }, [filtered]);

  const toggleBatch = (n: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });
  };

  const scrollToBatch = (n: number) => {
    setSelectedBatch(n);
    setExpanded((prev) => new Set([...prev, n]));
    setTimeout(() => {
      document.getElementById(`batch-${n}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const batchNumbers = Array.from(grouped.keys()).sort((a, b) => a - b);

  return (
    <main className="min-h-screen bg-[#faf8f2]" dir="rtl" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
      {/* Hero */}
      <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8 text-center">
        <h1
          className="text-4xl md:text-5xl font-black mb-4"
          style={{
            background: 'linear-gradient(135deg, #d4b366, #b8933a)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          قاموس المصطلحات التجارية
        </h1>
        <p className="text-[#4a5b78] max-w-2xl mx-auto text-lg">
          ٣٠٠ مصطلح تجاري واستثماري — ثنائي اللغة (عربي / English)
        </p>
      </div>

      {/* Controls */}
      <div className="px-4 sm:px-6 lg:px-8 pb-6">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث عن مصطلح... (عربي أو English)"
            className="flex-1 bg-white border border-[#c9a84c]/30 rounded-xl px-5 py-3 text-sm text-[#0a0f1e] placeholder:text-[#8a94a8] outline-none focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/20 transition-all shadow-[0_4px_20px_rgba(10,15,30,0.03)]"
          />

          {/* Language toggle */}
          <button
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="px-5 py-3 rounded-xl text-sm font-bold border transition-all bg-white border-[#c9a84c]/30 text-[#c9a84c] hover:bg-[#fdf9ef] whitespace-nowrap"
          >
            {lang === 'en' ? '🇬🇧 English First' : '🇸🇦 العربي أولاً'}
          </button>
        </div>

        {/* Batch nav — anchor chips */}
        {!search.trim() && (
          <div className="max-w-3xl mx-auto mt-4 flex flex-wrap gap-1.5">
            {batches.map((b) => (
              <button
                key={b.number}
                onClick={() => scrollToBatch(b.number)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  selectedBatch === b.number
                    ? 'bg-[#c9a84c] text-white'
                    : expanded.has(b.number)
                    ? 'bg-[#fdf9ef] border border-[#c9a84c]/40 text-[#c9a84c]'
                    : 'bg-white border border-[#c9a84c]/15 text-[#8a94a8] hover:border-[#c9a84c]/40'
                }`}
              >
                {b.number}
              </button>
            ))}
          </div>
        )}

        {/* Results count */}
        {search.trim() && (
          <p className="max-w-3xl mx-auto mt-3 text-sm text-[#8a94a8]">
            {filtered.length} من ٣٠٠ نتيجة
          </p>
        )}
      </div>

      {/* Batch sections */}
      <div className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-3xl mx-auto space-y-6">
          {batchNumbers.length === 0 ? (
            <p className="text-center text-[#8a94a8] py-16">لا توجد نتائج</p>
          ) : (
            batchNumbers.map((bn) => {
              const batchTerms = grouped.get(bn) || [];
              const batch = batches.find((b) => b.number === bn);
              const label = batch?.label || `المجموعة ${bn}`;
              const isOpen = expanded.has(bn);

              return (
                <section
                  key={bn}
                  id={`batch-${bn}`}
                  className="bg-white rounded-3xl border border-[#c9a84c]/20 shadow-[0_8px_30px_rgba(10,15,30,0.04)] overflow-hidden"
                >
                  {/* Batch header */}
                  <button
                    onClick={() => toggleBatch(bn)}
                    className="w-full flex items-center justify-between px-6 py-4 text-right hover:bg-[#fdf9ef] transition-colors"
                  >
                    <div>
                      <h2 className="text-[#0a0f1e] font-bold text-lg">
                        المجموعة {bn}
                      </h2>
                      <p className="text-sm text-[#8a94a8]">{label}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[#8a94a8]">{batchTerms.length} مصطلحات</span>
                      <span
                        className="text-[#c9a84c] transition-transform duration-200"
                        style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      >
                        ▼
                      </span>
                    </div>
                  </button>

                  {/* Term cards */}
                  {isOpen && (
                    <div className="divide-y divide-[#c9a84c]/10">
                      {batchTerms.map((term) => (
                        <TermCard key={term.term_number} term={term} lang={lang} />
                      ))}
                    </div>
                  )}
                </section>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}

function TermCard({ term, lang }: { term: GlossaryTerm; lang: 'en' | 'ar' }) {
  const [showEn, setShowEn] = useState(lang === 'en');
  const [showAr, setShowAr] = useState(lang === 'ar');

  return (
    <div className="px-6 py-5">
      {/* Term header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className="text-[#0a0f1e] font-black text-base" dir="ltr" style={{ textAlign: 'right' }}>
            {term.english_term}
          </p>
          <p className="text-[#c9a84c] font-bold text-base mt-0.5">{term.arabic_term}</p>
        </div>
        <span className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#fdf9ef] text-[#c9a84c] border border-[#c9a84c]/30">
          {term.term_number}
        </span>
      </div>

      {/* Toggle buttons */}
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => setShowEn(!showEn)}
          className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
            showEn
              ? 'bg-[#0a0f1e] text-white'
              : 'bg-[#faf8f2] text-[#8a94a8] border border-[#c9a84c]/15'
          }`}
        >
          🇬🇧 English
        </button>
        <button
          onClick={() => setShowAr(!showAr)}
          className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
            showAr
              ? 'bg-[#c9a84c] text-white'
              : 'bg-[#faf8f2] text-[#8a94a8] border border-[#c9a84c]/15'
          }`}
        >
          🇸🇦 العربية
        </button>
      </div>

      {/* Definitions */}
      <div className="space-y-2">
        {showEn && (
          <p className="text-sm text-[#4a5b78] leading-relaxed" dir="ltr" style={{ textAlign: 'right' }}>
            {term.english_def}
          </p>
        )}
        {showAr && (
          <p className="text-sm text-[#4a5b78] leading-relaxed">{term.arabic_def}</p>
        )}
      </div>
    </div>
  );
}
