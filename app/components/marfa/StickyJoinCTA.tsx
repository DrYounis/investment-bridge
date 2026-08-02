'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function StickyJoinCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setVisible(window.scrollY > 400);
      }, 80);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(timeout);
    };
  }, []);

  if (dismissed) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="bg-[#0a0f1e]/95 backdrop-blur-md border-t border-[#c9a84c]/30 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <button
            onClick={() => setDismissed(true)}
            className="shrink-0 w-7 h-7 rounded-full bg-white/10 text-[#a0aec0] hover:bg-white/20 hover:text-white transition-colors flex items-center justify-center text-sm"
            aria-label="إغلاق"
          >
            ✕
          </button>
          <p className="text-[#a0aec0] text-sm hidden sm:block" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            أدوات ذكاء اصطناعي مجانية — مجلس استشاري — تقييمات شهرية
          </p>
          <Link
            href="/register"
            data-cta-location="sticky_bar"
            className="shrink-0 inline-block px-6 py-2 rounded-full bg-gradient-to-r from-[#c9a84c] to-[#d4a843] text-[#0a0f1e] font-bold text-sm hover:shadow-lg hover:shadow-[#c9a84c]/25 transition-all duration-300"
            style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
          >
            ابدأ الآن — مجاناً ←
          </Link>
        </div>
      </div>
    </div>
  );
}
