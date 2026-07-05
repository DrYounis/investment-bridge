'use client';

interface ProgressBarProps {
  percent: number;
  color: string;
  height?: number;
}

export default function ProgressBar({ percent, color, height = 6 }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, percent));

  return (
    <div
      className="w-full rounded-full overflow-hidden"
      style={{ background: '#111932', height }}
    >
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{
          width: `${clamped}%`,
          backgroundColor: color,
        }}
      />
    </div>
  );
}
