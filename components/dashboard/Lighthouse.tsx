'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import GlassCard from '@/components/ui/GlassCard';

// ── Beam 1: Tip of Day (verbatim from AiTipOfDay) ──────────────────────────

const FALLBACK_TIPS: string[] = [
  'ركّز على بناء نموذج أولي بسيط قبل البحث عن التمويل — المستثمر يريد رؤية شيء ملموس. تحدث مع 3 عملاء محتملين هذا الأسبوع.',
  'جهّز عرضك التقديمي بحيث يجيب على سؤالين فقط: ما المشكلة التي تحلها؟ ولماذا أنت الشخص المناسب لحلها؟',
  'معظم المستثمرين في السوق السعودي يفضلون رؤية أرقام واقعية حتى لو كانت صغيرة — الأرقام أبلغ من الأفكار.',
  'لا تنتظر الفكرة المثالية. ابدأ بما لديك، اختبره في السوق، وطوّره بناءً على ملاحظات العملاء الحقيقية.',
  'خصص وقتاً كل أسبوع للتواصل مع مستثمرين ورواد أعمال — العلاقات هي أكبر أصل في رحلة ريادة الأعمال.',
  'قبل أن تطلب تمويلاً، تأكد أن لديك إجابة واضحة عن: كيف ستحقق إيرادات؟ وكم ستحتاج من الوقت للوصول إلى نقطة التعادل؟',
  'السوق السعودي مليء بالفرص في قطاعات التقنية المالية، الصحة الرقمية، والخدمات اللوجستية — ابحث عن المشكلة قبل أن تبحث عن الحل.',
];

const PROMPT =
  'أنت مستشار أعمال خبير متخصص في ريادة الأعمال والاستثمار في السوق السعودي. اكتب نصيحة عملية واحدة مختصرة (3 جمل كحد أقصى) لرائد أعمال سعودي شاب يسعى للحصول على تمويل. النصيحة يجب أن تكون باللغة العربية الفصحى البسيطة، عملية، وقابلة للتطبيق فوراً.';

// ── Beam 2: Investor Signals (verbatim from InvestorSignals) ───────────────

const SIGNAL_LABELS: Record<string, string> = {
  profile_view: '👀 مستثمر شاهد ملفك',
  deck_download: '📥 مستثمر حمّل عرضك التقديمي',
  interest: '⭐ مستثمر أبدى اهتماماً بمشروعك',
  sector_view: '🔎 مستثمر مهتم بقطاع {sector} تصفح مشاريع مشابهة',
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'الآن';
  if (mins < 60) return `منذ ${mins} دقيقة`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `منذ ${hours} ساعة`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'منذ يوم';
  if (days === 2) return 'منذ يومين';
  if (days <= 10) return `منذ ${days} أيام`;
  return `منذ ${days} يوماً`;
}

// ── Beam 3: Meeting Countdown (verbatim from MeetingCountdown) ─────────────

function calcRemaining(target: Date): { days: number; hours: number; minutes: number; seconds: number; total: number } {
  const total = target.getTime() - Date.now();
  if (total <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  return {
    days: Math.floor(total / 86400000),
    hours: Math.floor((total % 86400000) / 3600000),
    minutes: Math.floor((total % 3600000) / 60000),
    seconds: Math.floor((total % 60000) / 1000),
    total,
  };
}

function CountBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-lg px-3 py-2 text-center min-w-[60px] border border-[#1a2540]" style={{ background: '#0a0f1e' }}>
      <div className="text-xl font-black text-[#c9a84c]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
        {String(value).padStart(2, '0')}
      </div>
      <div className="text-xs text-[#a0aec0] mt-0.5" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
        {label}
      </div>
    </div>
  );
}

// ── Beam definitions ───────────────────────────────────────────────────────

const BEAMS = [
  { key: 'tip', label: 'نصيحة اليوم', icon: '💡' },
  { key: 'signals', label: 'إشارات المستثمرين', icon: '📡' },
  { key: 'meeting', label: 'الجلسة القادمة', icon: '📅' },
];

// ── Lighthouse SVG ─────────────────────────────────────────────────────────

function LighthouseBeam({ active }: { active: number }) {
  return (
    <svg width="60" height="80" viewBox="0 0 60 80" className="shrink-0">
      {/* Tower */}
      <rect x="22" y="30" width="16" height="50" rx="2" fill="#1a2540" stroke="#c9a84c" strokeWidth="1" />
      <rect x="17" y="40" width="26" height="4" rx="1" fill="#c9a84c" />
      <rect x="17" y="52" width="26" height="4" rx="1" fill="#c9a84c" />
      <rect x="17" y="64" width="26" height="4" rx="1" fill="#c9a84c" />
      {/* Lantern room */}
      <rect x="18" y="20" width="24" height="12" rx="3" fill="#c9a84c" opacity="0.2" stroke="#c9a84c" strokeWidth="1" />
      <circle cx="30" cy="26" r="4" fill="#c9a84c" opacity="0.8" />
      {/* Dome */}
      <path d="M 18 20 Q 30 8 42 20" fill="#c9a84c" opacity="0.3" stroke="#c9a84c" strokeWidth="1" />
      {/* Beam */}
      <motion.line
        x1="30" y1="26" x2={12 + active * 18} y2="8"
        stroke="url(#beamGrad)" strokeWidth="3" strokeLinecap="round"
        animate={{ opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <defs>
        <linearGradient id="beamGrad" x1="30" y1="26" x2="10" y2="8">
          <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#c9a84c" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function Lighthouse() {
  const router = useRouter();
  const supabase = createClient();

  const [beam, setBeam] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // ── Beam 1: Tip ──
  const [tip, setTip] = useState<string | null>(null);
  const [tipLoading, setTipLoading] = useState(true);
  const lastTipRef = useRef('');

  function randomFallback(): string {
    const others = FALLBACK_TIPS.filter(t => t !== lastTipRef.current);
    const pool = others.length > 0 ? others : FALLBACK_TIPS;
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    lastTipRef.current = chosen;
    return chosen;
  }

  const fetchTip = useCallback(async () => {
    setTipLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      const res = await fetch('/api/claude', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: PROMPT }) });
      if (!res.ok) throw new Error('API error');
      const json = await res.json();
      const text = json.text || json.response || json.content || '';
      if (text && text.trim().length > 10) { lastTipRef.current = text; setTip(text); }
      else setTip(randomFallback());
    } catch { setTip(randomFallback()); }
    setTipLoading(false);
  }, [supabase, router]);

  useEffect(() => { fetchTip(); }, [fetchTip]);

  // ── Beam 2: Signals ──
  const [signals, setSignals] = useState<any[]>([]);
  const [signalsLoading, setSignalsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('investor_signals').select('id, signal_type, sector, created_at').eq('entrepreneur_id', user.id).order('created_at', { ascending: false }).limit(3);
      setSignals(data || []);
      setSignalsLoading(false);
    })();
  }, [supabase]);

  function formatLabel(s: any): string {
    let label = SIGNAL_LABELS[s.signal_type] || '📌 إشارة جديدة';
    if (s.signal_type === 'sector_view' && s.sector) label = label.replace('{sector}', s.sector);
    return label;
  }

  // ── Beam 3: Meeting ──
  const [meeting, setMeeting] = useState<any>(null);
  const [remaining, setRemaining] = useState<ReturnType<typeof calcRemaining> | null>(null);
  const [meetingLoading, setMeetingLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('meetings').select('*').eq('user_id', user.id).gt('meeting_date', new Date().toISOString()).order('meeting_date', { ascending: true }).limit(1);
      setMeeting(data?.[0] || null);
      setMeetingLoading(false);
    })();
  }, [supabase]);

  useEffect(() => {
    if (!meeting) return;
    const tick = () => setRemaining(calcRemaining(new Date(meeting.meeting_date)));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [meeting]);

  // ── Auto-rotate ──
  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(() => setBeam(b => (b + 1) % 3), 8000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [paused]);

  const beamLoading = beam === 0 ? tipLoading : beam === 1 ? signalsLoading : meetingLoading;

  return (
    <GlassCard
      className="relative overflow-hidden"
      dir="rtl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div className="flex items-start gap-4">
        {/* Lighthouse SVG */}
        <LighthouseBeam active={beam} />

        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            💡 المنارة
          </h2>

          {/* Tab dots */}
          <div className="flex items-center gap-2 mb-4">
            {BEAMS.map((b, i) => (
              <button
                key={b.key}
                onClick={() => setBeam(i)}
                className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all"
                style={{
                  background: beam === i ? '#c9a84c20' : 'transparent',
                  color: beam === i ? '#c9a84c' : '#4a5a78',
                  border: beam === i ? '1px solid #c9a84c40' : '1px solid transparent',
                  fontFamily: 'var(--font-tajawal), sans-serif',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: beam === i ? '#c9a84c' : '#1a2540' }} />
                {b.label}
              </button>
            ))}
          </div>

          {/* Beam content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={beam}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {/* Beam 1: Tip */}
              {beam === 0 && (
                <div>
                  {tipLoading ? (
                    <div className="space-y-2">
                      <div className="h-4 bg-[#1a2540] rounded w-3/4 animate-pulse" />
                      <div className="h-4 bg-[#1a2540] rounded w-full animate-pulse" />
                      <div className="h-4 bg-[#1a2540] rounded w-2/3 animate-pulse" />
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-[#a0aec0] leading-relaxed mb-3" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                        {tip}
                      </p>
                      <button onClick={fetchTip} disabled={tipLoading}
                        className="text-xs font-bold text-[#c9a84c] hover:underline" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                        🔄 تحديث النصيحة
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Beam 2: Signals */}
              {beam === 1 && (
                <div>
                  {signalsLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => <div key={i} className="h-4 bg-[#1a2540] rounded w-full animate-pulse" />)}
                    </div>
                  ) : signals.length === 0 ? (
                    <p className="text-sm text-[#64748b]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                      لا توجد إشارات بعد — أكمل ملفك وارفع عرضك ليصل إلى المستثمرين
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {signals.map(s => (
                        <div key={s.id} className="flex items-start gap-2">
                          <div className="w-2 h-2 rounded-full bg-[#c9a84c] mt-1.5 shrink-0" />
                          <div>
                            <p className="text-sm text-white" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>{formatLabel(s)}</p>
                            <span className="text-xs text-[#64748b]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>{timeAgo(s.created_at)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Beam 3: Meeting */}
              {beam === 2 && (
                <div>
                  {meetingLoading ? (
                    <div className="space-y-2">
                      <div className="h-4 bg-[#1a2540] rounded w-3/4 animate-pulse" />
                      <div className="flex gap-2">{[1,2,3,4].map(i => <div key={i} className="h-14 w-16 bg-[#1a2540] rounded animate-pulse" />)}</div>
                    </div>
                  ) : !meeting ? (
                    <div className="text-center">
                      <span className="text-3xl block mb-2">📅</span>
                      <p className="text-sm text-[#64748b]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>لا توجد لقاءات قادمة</p>
                    </div>
                  ) : remaining && remaining.total <= 0 ? (
                    <div className="text-center">
                      <p className="text-[#c9a84c] font-bold text-lg" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>اللقاء يجري الآن</p>
                      {meeting.meeting_url && (
                        <a href={meeting.meeting_url} target="_blank" rel="noopener noreferrer"
                          className="inline-block mt-3 px-6 py-3 bg-[#c9a84c] text-[#0a0f1e] font-bold rounded-lg hover:scale-105 transition-all"
                          style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>انضم الآن</a>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-white font-bold mb-3" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>{meeting?.title}</p>
                      {remaining && (
                        <div className="flex justify-center gap-2 flex-wrap">
                          <CountBox value={remaining.days} label="يوم" />
                          <CountBox value={remaining.hours} label="ساعة" />
                          <CountBox value={remaining.minutes} label="دقيقة" />
                          <CountBox value={remaining.seconds} label="ثانية" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </GlassCard>
  );
}
