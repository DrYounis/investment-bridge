'use client';

interface StatCardProps {
  label: string;
  value: string;
  subtitle: string;
  accentColor: 'gold' | 'blue' | 'orange' | 'green' | 'muted';
}

const colorMap = {
  gold:   { border: '#c9a84c', text: '#c9a84c', glow: 'rgba(201,168,76,0.15)' },
  blue:   { border: '#5e9ef0', text: '#5e9ef0', glow: 'rgba(94,158,240,0.15)' },
  orange: { border: '#f0a050', text: '#f0a050', glow: 'rgba(240,160,80,0.15)' },
  green:  { border: '#3ecf8e', text: '#3ecf8e', glow: 'rgba(62,207,142,0.15)' },
  muted:  { border: '#6b7a95', text: '#6b7a95', glow: 'rgba(107,122,149,0.10)' },
};

export default function StatCard({ label, value, subtitle, accentColor }: StatCardProps) {
  const c = colorMap[accentColor];

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-1 transition-all duration-300 hover:scale-[1.02]"
      style={{
        background: '#0d1428',
        borderTop: `2px solid ${c.border}`,
        boxShadow: `0 4px 24px ${c.glow}`,
      }}
    >
      <span className="text-xs font-semibold" style={{ color: '#6b7a95' }}>
        {label}
      </span>
      <span className="text-2xl font-black tracking-tight" style={{ color: c.text }}>
        {value}
      </span>
      <span className="text-xs" style={{ color: '#6b7a95' }}>
        {subtitle}
      </span>
    </div>
  );
}
