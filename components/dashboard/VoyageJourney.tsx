'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import GlassCard from '@/components/ui/GlassCard';
import PitchAuditCard from '@/components/dashboard/PitchAuditCard';

// ── Port definitions ──────────────────────────────────────────────────────

const PORTS = [
  {
    key: 'profile',
    label: 'ميناء الملف الشخصي',
    icon: '👤',
    href: '/dashboard/profile',
    why: 'الملف المكتمل أول خطوة لجذب اهتمام المستثمر المحترف',
  },
  {
    key: 'phone',
    label: 'ميناء التواصل',
    icon: '📞',
    href: '/dashboard/profile',
    why: 'رقم الجوال يفتح قناة مباشرة للتواصل السريع مع المستثمر',
  },
  {
    key: 'pitch',
    label: 'ميناء العرض التقديمي',
    icon: '📊',
    href: '/dashboard/entrepreneur/documents',
    why: 'العرض التقديمي هو بوابتك لإقناع المستثمر بجدوى مشروعك',
  },
  {
    key: 'meeting',
    label: 'ميناء اللقاءات',
    icon: '🤝',
    href: '/meetings',
    why: 'اللقاء المباشر يبني الثقة ويفتح آفاق التمويل والتعاون',
  },
  {
    key: 'investor',
    label: 'المنارة — جاهز للمستثمرين',
    icon: '🏛️',
    href: '/dashboard/deals',
    why: 'وصولك للمنارة يعني أن مشروعك أصبح جاهزاً لعرضه على المستثمرين',
  },
];

// ── Grade colors ───────────────────────────────────────────────────────────

const GRADE_COLORS: Record<string, string> = { A: '#c9a84c', B: '#8fbf6f', C: '#e0b252', D: '#c96a4c' };

// ── Confetti ────────────────────────────────────────────────────────────────

function ConfettiBurst({ onDone }: { onDone: () => void }) {
  const particles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * -20 - 10,
    color: i % 3 === 0 ? '#c9a84c' : i % 3 === 1 ? '#0a0f1e' : '#d4a843',
    size: Math.random() * 8 + 4,
    delay: Math.random() * 0.3,
    duration: Math.random() * 0.8 + 0.8,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: `${p.x}vw`, y: `${p.y}vh`, opacity: 1, rotate: 0, scale: 1 }}
          animate={{ y: '110vh', opacity: 0, rotate: Math.random() * 720 - 360, scale: 0.3 }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
          onAnimationComplete={p.id === 0 ? onDone : undefined}
          className="absolute rounded-sm"
          style={{ width: p.size, height: p.size * 0.6, background: p.color, left: 0, top: 0 }}
        />
      ))}
    </div>
  );
}

// ── Port SVG helpers ───────────────────────────────────────────────────────

function PortCircle({ done }: { done: boolean }) {
  if (done) {
    return (
      <svg width="36" height="36" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="16" fill="rgba(201,168,76,0.15)" stroke="#c9a84c" strokeWidth="2" />
        <polyline points="8,18 15,25 28,11" fill="none" stroke="#c9a84c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg width="36" height="36" viewBox="0 0 36 36">
      <circle cx="18" cy="18" r="16" fill="none" stroke="#1a2540" strokeWidth="2" />
    </svg>
  );
}

// ── Mini Gauge ─────────────────────────────────────────────────────────────

function MiniGauge({ score, grade }: { score: number; grade: string }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const percent = Math.min(100, Math.max(0, score || 0));
  const offset = circumference - (percent / 100) * circumference;
  const color = GRADE_COLORS[grade] || GRADE_COLORS.D;

  return (
    <svg width="70" height="70" viewBox="0 0 70 70" className="-rotate-90">
      <circle cx="35" cy="35" r={radius} fill="none" stroke="#1a2540" strokeWidth="5" />
      <circle cx="35" cy="35" r={radius} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
        strokeDasharray={circumference} strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1.2s ease-out' }} />
      <text x="35" y="32" textAnchor="middle" fill={color} fontSize="18" fontWeight="900"
        fontFamily="var(--font-tajawal), sans-serif" transform="rotate(90, 35, 35)">{grade}</text>
    </svg>
  );
}

// ── Ship ───────────────────────────────────────────────────────────────────

function Ship() {
  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      className="text-2xl"
    >
      🚢
    </motion.div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function VoyageJourney() {
  const router = useRouter();
  const supabase = createClient();

  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [expandedPort, setExpandedPort] = useState<string | null>(null);
  const [readiness, setReadiness] = useState<{ total_score: number; grade: string } | null>(null);
  const [confetti, setConfetti] = useState(false);
  const [userName, setUserName] = useState('');

  // ── Profile completion checks (verbatim from NextStepsChecklist) ──
  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      const uid = user.id;

      const result: Record<string, boolean> = {};

      try {
        const { data: profile } = await supabase.from('profiles').select('full_name,bio,avatar_url,phone').eq('id', uid).single();
        result.profile = !!(profile?.full_name && profile?.bio && profile?.avatar_url);
        result.phone = !!profile?.phone;
        setUserName(profile?.full_name || '');
      } catch { result.profile = false; result.phone = false; }

      try {
        const { count } = await supabase.from('pitch_decks').select('*', { count: 'exact', head: true }).eq('user_id', uid);
        result.pitch = (count || 0) > 0;
      } catch { result.pitch = false; }

      try {
        const { count } = await supabase.from('meetings').select('*', { count: 'exact', head: true }).eq('user_id', uid).eq('attended', true);
        result.meeting = (count || 0) > 0;
      } catch { result.meeting = false; }

      try {
        const { count } = await supabase.from('investor_interests').select('*', { count: 'exact', head: true }).eq('entrepreneur_id', uid);
        result.investor = (count || 0) > 0;
      } catch { result.investor = false; }

      // Check for newly completed ports (confetti trigger)
      const stored = localStorage.getItem('marfa_celebrated_ports');
      const celebrated: string[] = stored ? JSON.parse(stored) : [];
      const newlyDone = PORTS.filter(p => result[p.key] && !celebrated.includes(p.key));
      if (newlyDone.length > 0) {
        setConfetti(true);
        localStorage.setItem('marfa_celebrated_ports', JSON.stringify([...celebrated, ...newlyDone.map(p => p.key)]));
      }

      setChecked(result);
      setLoading(false);
    }
    load();
  }, [supabase, router]);

  // ── Readiness (verbatim from ReadinessScore) ──
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/readiness');
        if (res.ok) {
          const json = await res.json();
          if (json.total_score != null) setReadiness({ total_score: json.total_score, grade: json.grade || 'C' });
        }
      } catch {}
    })();
  }, []);

  const completed = PORTS.filter(p => checked[p.key]).length;
  const lastCompletedIdx = PORTS.map(p => checked[p.key]).lastIndexOf(true);

  if (loading) {
    return (
      <GlassCard className="animate-pulse" dir="rtl">
        <div className="h-6 bg-[#1a2540] rounded w-48 mb-6" />
        <div className="h-40 bg-[#1a2540] rounded" />
      </GlassCard>
    );
  }

  return (
    <GlassCard className="relative overflow-hidden" dir="rtl">
      {confetti && <ConfettiBurst onDone={() => setConfetti(false)} />}

      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            🚢 رحلة الإبحار
          </h2>
          {userName && (
            <p className="text-sm text-[#c9a84c] mt-0.5" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
              أهلاً بك في مرساك يا {userName} — حيث تَرسو طموحاتك
            </p>
          )}
          <p className="text-sm text-[#a0aec0]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            {completed} من {PORTS.length} موانئ مكتملة — من المرسى إلى المنارة
          </p>
        </div>
        {readiness && (
          <div className="flex items-center gap-2">
            <MiniGauge score={readiness.total_score} grade={readiness.grade} />
            <span className="text-xs text-[#a0aec0]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
              قوة الشراع
            </span>
          </div>
        )}
      </div>

      {/* Desktop — horizontal journey */}
      <div className="hidden md:flex items-start justify-between relative px-4 pt-4 pb-2">
        {/* Route line */}
        <div className="absolute top-[18px] right-[8%] left-[8%] h-0.5" style={{ background: 'linear-gradient(to left, #1a2540, #c9a84c, #1a2540)' }} />

        {/* Ship at last completed port */}
        {lastCompletedIdx >= 0 && (
          <div className="absolute transition-all duration-700" style={{ top: 4, right: `calc(${((lastCompletedIdx) / (PORTS.length - 1)) * 84}% + 4%)` }}>
            <Ship />
          </div>
        )}

        {PORTS.map((port, idx) => {
          const done = checked[port.key];
          const isExpanded = expandedPort === port.key;
          return (
            <div key={port.key} className="flex flex-col items-center gap-2 z-10" style={{ minWidth: 0 }}>
              <button
                onClick={() => setExpandedPort(isExpanded ? null : port.key)}
                className="flex flex-col items-center gap-1 hover:scale-105 transition-transform"
              >
                <PortCircle done={done} />
                <span className="text-lg">{port.icon}</span>
                <span className="text-xs font-bold text-center leading-tight max-w-[90px]" style={{
                  fontFamily: 'var(--font-tajawal), sans-serif',
                  color: done ? '#c9a84c' : '#64748b',
                }}>
                  {port.label}
                </span>
              </button>
              <p className="text-[10px] text-[#4a5a78] text-center leading-tight max-w-[90px] hidden lg:block" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                {port.why}
              </p>
            </div>
          );
        })}
      </div>

      {/* Mobile — vertical journey */}
      <div className="md:hidden space-y-0 relative pr-8">
        <div className="absolute right-[17px] top-4 bottom-4 w-0.5" style={{ background: 'linear-gradient(to bottom, #1a2540, #c9a84c, #1a2540)' }} />
        {PORTS.map((port, idx) => {
          const done = checked[port.key];
          const isExpanded = expandedPort === port.key;
          const isCurrent = idx === lastCompletedIdx;
          return (
            <div key={port.key} className="relative pb-4 last:pb-0">
              {isCurrent && (
                <div className="absolute right-[9px] top-0">
                  <Ship />
                </div>
              )}
              <button
                onClick={() => setExpandedPort(isExpanded ? null : port.key)}
                className="flex items-center gap-3 w-full text-right hover:scale-[1.02] transition-transform"
              >
                <div className="shrink-0 relative z-10">
                  <PortCircle done={done} />
                </div>
                <div className="min-w-0">
                  <span className="text-sm font-bold block" style={{
                    fontFamily: 'var(--font-tajawal), sans-serif',
                    color: done ? '#c9a84c' : '#64748b',
                  }}>
                    {port.icon} {port.label}
                  </span>
                  <p className="text-[10px] text-[#4a5a78] mt-0.5" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                    {port.why}
                  </p>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Collapsible panel — PitchAuditCard for Port 3 */}
      <AnimatePresence>
        {expandedPort === 'pitch' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mt-4 border-t border-[#1a2540] pt-4"
          >
            <PitchAuditCard />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsible panel — navigation for other ports */}
      <AnimatePresence>
        {expandedPort && expandedPort !== 'pitch' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mt-4 border-t border-[#1a2540] pt-4"
          >
            <p className="text-sm text-[#a0aec0] mb-3" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
              {PORTS.find(p => p.key === expandedPort)?.why}
            </p>
            <button
              onClick={() => router.push(PORTS.find(p => p.key === expandedPort)?.href || '/dashboard/profile')}
              className="px-4 py-2 rounded-lg text-sm font-bold bg-[#c9a84c] text-[#0a0f1e] hover:shadow-lg transition-all"
              style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
            >
              {checked[expandedPort] ? 'عرض التفاصيل' : 'ابدأ الآن'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}
