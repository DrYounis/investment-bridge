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
    color: 'text-green-700 dark:text-green-400',
    bg: 'bg-green-100 dark:bg-green-900/40',
    icon: '✅',
  },
  running: {
    label: 'قيد التشغيل',
    color: 'text-blue-700 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-900/40',
    icon: '⏳',
  },
  error: {
    label: 'خطأ',
    color: 'text-red-700 dark:text-red-400',
    bg: 'bg-red-100 dark:bg-red-900/40',
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
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700 shadow-sm">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">الحالة</p>
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold ${config.color} ${config.bg}`}
        >
          {config.icon} {config.label}
        </span>
      </div>

      {/* Total articles */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700 shadow-sm">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">إجمالي المقالات</p>
        <p className="text-2xl font-bold text-saudi-blue dark:text-saudi-gold">
          {totalArticles.toLocaleString('ar-SA')}
        </p>
      </div>

      {/* Last run */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700 shadow-sm">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">آخر تشغيل</p>
        <p className="text-sm font-semibold text-saudi-dark dark:text-white">
          {lastRun
            ? new Date(lastRun).toLocaleString('ar-SA', { timeZone: 'Asia/Riyadh' })
            : '—'}
        </p>
      </div>

      {/* Configuration status */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700 shadow-sm">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">الإعدادات</p>
        <div className="flex flex-col gap-1 text-sm">
          <span className={apiKeyConfigured ? 'text-green-600' : 'text-red-500'}>
            {apiKeyConfigured ? '✅' : '❌'} Claude API
          </span>
          <span className={cronConfigured ? 'text-green-600' : 'text-yellow-500'}>
            {cronConfigured ? '✅' : '⚠️'} المجدول
          </span>
        </div>
      </div>
    </div>
  );
}
