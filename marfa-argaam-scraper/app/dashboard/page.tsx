'use client';

import { useState, useEffect, useCallback } from 'react';
import ArticleCard from '@/components/ArticleCard';
import ScraperStatus from '@/components/ScraperStatus';

interface ScrapeResultItem {
  success: boolean;
  filename?: string;
  filepath?: string;
  title?: string;
  original_title?: string;
  source_url?: string;
  error?: string;
}

interface ScrapeResponse {
  success: boolean;
  total_scraped: number;
  processed: number;
  saved: number;
  failed: number;
  results: ScrapeResultItem[];
  message?: string;
}

interface StatusResponse {
  status: string;
  total_articles: number;
  content_dir: string;
  latest_files: {
    filename: string;
    created: string;
    title: string;
    original_title: string;
    source_url: string;
  }[];
  api_key_configured: boolean;
  cron_secret_configured: boolean;
}

export default function DashboardPage() {
  const [maxArticles, setMaxArticles] = useState(5);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [results, setResults] = useState<ScrapeResultItem[] | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [jobStatus, setJobStatus] = useState<'ready' | 'running' | 'error'>('ready');
  const [lastRun, setLastRun] = useState<string | undefined>();

  // Fetch status on mount and after scraping
  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/scrape/argaam');
      const data: StatusResponse = await res.json();
      setStatus(data);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Poll during scraping
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      fetchStatus();
    }, 5000);
    return () => clearInterval(interval);
  }, [loading, fetchStatus]);

  const handleScrape = async () => {
    setLoading(true);
    setJobStatus('running');
    setError('');
    setMessage('');
    setResults(null);

    try {
      const res = await fetch('/api/scrape/argaam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maxArticles }),
      });

      const data: ScrapeResponse = await res.json();

      if (!res.ok) {
        throw new Error(String((data as unknown as { error?: string }).error || 'Unknown error'));
      }

      setResults(data.results);
      setJobStatus('ready');
      setLastRun(new Date().toISOString());

      if (data.message) {
        setMessage(data.message);
      } else {
        setMessage(
          `✅ تم الانتهاء: ${data.saved} مقالة محفوظة، ${data.failed} فشل`
        );
      }

      await fetchStatus();
    } catch (err) {
      setJobStatus('error');
      setError(String(err));
      console.error('Scrape error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (filename: string) => {
    try {
      const res = await fetch(`/content/news/argaam/${filename}`);
      if (!res.ok) throw new Error('File not found');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError('تعذر تحميل الملف');
    }
  };

  return (
    <main className="min-h-screen p-4 sm:p-6 lg:p-8" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 text-center sm:text-right">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-saudi-blue dark:text-saudi-gold mb-2">
            🚀 Argaam News Scraper
          </h1>
          <p className="text-lg text-saudi-dark dark:text-gray-300">
            مجمع الأخبار المالية السعودية — marfa.sa
          </p>
        </header>

        {/* Status cards */}
        <section className="mb-8">
          <ScraperStatus
            status={jobStatus}
            lastRun={lastRun}
            totalArticles={status?.total_articles || 0}
            apiKeyConfigured={status?.api_key_configured || false}
            cronConfigured={status?.cron_secret_configured || false}
          />
        </section>

        {/* Control Panel */}
        <section className="mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm">
            <h2 className="text-xl font-bold text-saudi-dark dark:text-white mb-4">
              🎛️ لوحة التحكم
            </h2>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <label
                  htmlFor="maxArticles"
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap"
                >
                  عدد المقالات:
                </label>
                <select
                  id="maxArticles"
                  value={maxArticles}
                  onChange={(e) => setMaxArticles(Number(e.target.value))}
                  disabled={loading}
                  className="px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600
                             bg-white dark:bg-slate-700 text-saudi-dark dark:text-white
                             focus:ring-2 focus:ring-saudi-gold focus:border-saudi-gold
                             disabled:opacity-50"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleScrape}
                disabled={loading}
                className="px-8 py-3 bg-saudi-blue hover:bg-saudi-dark text-white
                           rounded-lg font-bold text-lg transition-colors
                           disabled:opacity-50 disabled:cursor-not-allowed
                           shadow-lg hover:shadow-xl
                           flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    جاري التجريف...
                  </>
                ) : (
                  '🔄 بدء التجريف'
                )}
              </button>
            </div>

            {/* Progress during scraping */}
            {loading && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-700 dark:text-blue-300 text-sm">
                ⏳ جاري تجريف الأخبار وتلخيصها... قد يستغرق ذلك دقيقة أو دقيقتين.
              </div>
            )}

            {/* Success / error messages */}
            {message && (
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/30 rounded-lg text-green-700 dark:text-green-300 text-sm">
                {message}
              </div>
            )}
            {error && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/30 rounded-lg text-red-700 dark:text-red-300 text-sm">
                ❌ {error}
              </div>
            )}
          </div>
        </section>

        {/* Results (after scraping) */}
        {results && results.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-saudi-dark dark:text-white mb-4">
              📋 نتائج التجريف
            </h2>

            {/* Table view */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 shadow-sm">
                <thead>
                  <tr className="bg-saudi-dark text-white text-sm">
                    <th className="p-3 text-right">الحالة</th>
                    <th className="p-3 text-right">عنوان المقال</th>
                    <th className="p-3 text-right">المصدر</th>
                    <th className="p-3 text-right">الملف</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr
                      key={i}
                      className="border-t border-gray-200 dark:border-slate-700 hover:bg-saudi-cream/50 dark:hover:bg-slate-700/50"
                    >
                      <td className="p-3">
                        {r.success ? (
                          <span className="text-green-600">✅</span>
                        ) : (
                          <span className="text-red-500">❌</span>
                        )}
                      </td>
                      <td className="p-3 text-sm max-w-xs truncate">
                        {r.title || r.original_title || r.error || '—'}
                      </td>
                      <td className="p-3 text-sm">
                        {r.source_url ? (
                          <a
                            href={r.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-saudi-blue hover:underline"
                          >
                            رابط المصدر
                          </a>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="p-3 text-sm text-gray-500">
                        {r.filename ? (
                          <button
                            onClick={() => handleDownload(r.filename!)}
                            className="text-saudi-blue hover:underline text-xs"
                          >
                            {r.filename.length > 40
                              ? r.filename.slice(0, 37) + '...'
                              : r.filename}
                          </button>
                        ) : (
                          '—'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Card view (mobile) */}
            <div className="md:hidden grid gap-4">
              {results.map((r, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-xl border ${
                    r.success
                      ? 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/20'
                      : 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/20'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span>{r.success ? '✅' : '❌'}</span>
                    <span className="text-sm font-bold">
                      {r.title || r.original_title || 'خطأ'}
                    </span>
                  </div>
                  {r.error && (
                    <p className="text-xs text-red-500 mt-1">{r.error}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* File Browser */}
        <section>
          <h2 className="text-xl font-bold text-saudi-dark dark:text-white mb-4">
            📂 الملفات المحفوظة
          </h2>

          {status && status.latest_files && status.latest_files.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {status.latest_files.map((file) => (
                <ArticleCard
                  key={file.filename}
                  filename={file.filename}
                  title={file.title}
                  originalTitle={file.original_title}
                  sourceUrl={file.source_url}
                  date={file.created.slice(0, 10)}
                  onDownload={handleDownload}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-8 text-center border border-gray-200 dark:border-slate-700">
              <p className="text-gray-400 dark:text-gray-500 text-lg">
                📭 لا توجد مقالات محفوظة بعد
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                اضغط على &quot;بدء التجريف&quot; لجمع الأخبار
              </p>
            </div>
          )}

          {status && status.total_articles > 10 && (
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-4 text-center">
              عرض آخر 10 ملفات من أصل {status.total_articles.toLocaleString('ar-SA')} ملف
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
