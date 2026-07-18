'use client';

// COMPLIANCE: disabled pending CMA permit — investment-interest flow is in scope of securities activities
// To re-enable, uncomment the component body and remove this early return.

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type Props = {
  projectId: string;
  projectName: string;
};

export default function InterestCTA({ projectId, projectName }: Props) {
  return null; // COMPLIANCE: disabled

  /* eslint-disable @typescript-eslint/no-unused-vars */
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'modal' | 'submitting' | 'done' | 'duplicate'>('idle');
  const [message, setMessage] = useState('');

  async function handleClick() {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/login?redirect=/portfolio');
      return;
    }
    setStatus('modal');
  }

  async function handleSubmit() {
    setStatus('submitting');
    try {
      const res = await fetch('/api/portfolio/interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portfolio_id: projectId, message: message.trim() || undefined }),
      });
      const data = await res.json();
      if (data.duplicate) {
        setStatus('duplicate');
      } else if (res.ok) {
        setStatus('done');
        setMessage('');
      }
    } catch {
      setStatus('idle');
    }
  }

  return (
    <>
      {status === 'idle' && (
        <button
          onClick={handleClick}
          className="inline-flex items-center gap-1 text-sm font-bold text-[#c9a84c] hover:text-[#d4a843] transition-colors"
          style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
        >
          اطلب التفاصيل الكاملة ←
        </button>
      )}

      {status === 'done' && (
        <span className="inline-flex items-center gap-1 text-sm font-bold text-[#c9a84c]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          ✓ تم استلام طلبك — سنتواصل معك قريباً
        </span>
      )}

      {status === 'duplicate' && (
        <span className="inline-flex items-center gap-1 text-sm font-bold text-[#c9a84c]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          ✓ طلبك مسجّل مسبقاً — سنتواصل معك قريباً
        </span>
      )}

      {/* Modal */}
      {status === 'modal' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setStatus('idle')}>
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <h3 className="text-lg font-bold text-[#0a0f1e] mb-2" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
              طلب تفاصيل — {projectName}
            </h3>
            <p className="text-sm text-[#64748b] mb-4" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
              اكتب رسالة اختيارية (حد أقصى ٥٠٠ حرف)
            </p>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, 500))}
              className="w-full border border-[#c9a84c]/20 rounded-xl p-3 text-sm text-[#0a0f1e] resize-none focus:outline-none focus:border-[#c9a84c] mb-4"
              rows={4}
              maxLength={500}
              style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
              placeholder="أنا مهتم بهذه الفرصة وأرغب في معرفة المزيد..."
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setStatus('idle')}
                className="px-4 py-2 text-sm font-bold text-[#64748b] hover:text-[#0a0f1e] transition-colors"
                style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
              >
                إلغاء
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-[#c9a84c] text-[#0a0f1e] text-sm font-bold rounded-xl hover:bg-[#d4a843] transition-colors"
                style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
              >
                إرسال الطلب
              </button>
            </div>
          </div>
        </div>
      )}

      {status === 'submitting' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="marfa-skeleton w-8 h-8 rounded-full" />
        </div>
      )}
    </>
  );
}
