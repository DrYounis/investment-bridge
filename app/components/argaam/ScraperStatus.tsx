'use client';

interface ScraperStatusProps {
  status: 'ready' | 'running' | 'error';
  lastRun?: string;
  totalArticles?: number;
  apiKeyConfigured?: boolean;
  cronConfigured?: boolean;
}

const statusConfig: Record<
  string,
  { label: string; color: string; bg: string; icon: string }
> = {
  ready: {
    label: 'جاهز',
    color: 'text-emerald-300',
    bg: 'bg-emerald-500/10',
    icon: '✅',
  },
  running: {
    label: 'قيد التشغيل',
    color: 'text-blue-300',
    bg: 'bg-blue-500/10',
    icon: '⏳',
  },
  error: {
    label: 'خطأ',
    color: 'text-red-300',
    bg: 'bg-red-500/10',
    icon: '❌',
  },
};

export default function ScraperStatus({
  status = 'ready',
  lastRun,
  totalArticles = 0,
  apiKeyConfigured = false,
  cronConfigured = false,
}: ScraperStatusProps) {
  const config = statusConfig[status] || statusConfig.ready;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" dir="rtl">
      {/* Status badge */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
        <p className="text-xs text-slate-400 mb-2">الحالة</p>
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ${config.color} ${config.bg}`}
        >
          {config.icon} {config.label}
        </span>
      </div>

      {/* Total articles */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
        <p className="text-xs text-slate-400 mb-2">إجمالي المقالات</p>
        <p className="text-2xl font-bold text-gold">
          {totalArticles.toLocaleString('ar-SA')}
        </p>
      </div>

      {/* Last run */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
        <p className="text-xs text-slate-400 mb-2">آخر تشغيل</p>
        <p className="text-sm font-semibold text-slate-200">
          {lastRun
            ? new Date(lastRun).toLocaleString('ar-SA', { timeZone: 'Asia/Riyadh' })
            : '—'}
        </p>
      </div>

      {/* Configuration status */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
        <p className="text-xs text-slate-400 mb-2">الإعدادات</p>
        <div className="flex flex-col gap-1 text-sm">
          <span className={apiKeyConfigured ? 'text-emerald-300' : 'text-red-400'}>
            {apiKeyConfigured ? '✅' : '❌'} Claude API
          </span>
          <span className={cronConfigured ? 'text-emerald-300' : 'text-amber-400'}>
            {cronConfigured ? '✅' : '⚠️'} المجدول
          </span>
        </div>
      </div>
    </div>
  );
}
