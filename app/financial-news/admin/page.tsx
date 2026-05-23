'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import ArticleCard from '@/app/components/financial-news/ArticleCard';
import ScraperStatus from '@/app/components/financial-news/ScraperStatus';

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

export default function AdminNewsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(undefined);
  const [maxArticles, setMaxArticles] = useState(5);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [results, setResults] = useState<ScrapeResultItem[] | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [jobStatus, setJobStatus] = useState<'ready' | 'running' | 'error'>('ready');
  const [lastRun, setLastRun] = useState<string | undefined>();

  // Auth check with timeout
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/login');
        return;
      }
      setUser(data.user);
    });
    timeout = setTimeout(() => {
      setError('تعذر الاتصال بالخادم. حاول مرة أخرى.');
      setUser(null);
    }, 8000);
    return () => clearTimeout(timeout);
  }, [router]);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/scrape/financial-news');
      const data: StatusResponse = await res.json();
      setStatus(data);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    if (user) fetchStatus();
  }, [user, fetchStatus]);

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => fetchStatus(), 5000);
    return () => clearInterval(interval);
  }, [loading, fetchStatus]);

  const handleScrape = async () => {
    setLoading(true);
    setJobStatus('running');
    setError('');
    setMessage('');
    setResults(null);

    try {
      const res = await fetch('/api/scrape/financial-news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maxArticles }),
      });

      const data: ScrapeResponse = await res.json();

      if (!res.ok) {
        throw new Error(
          String((data as unknown as { error?: string }).error || 'Unknown error')
        );
      }

      setResults(data.results);
      setJobStatus('ready');
      setLastRun(new Date().toISOString());

      if (data.message) {
        setMessage(data.message);
      } else {
        setMessage(`✅ تم الانتهاء: ${data.saved} مقالة محفوظة، ${data.failed} فشل`);
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
      const res = await fetch(`/content/news/financial-news/${filename}`);
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

  if (user === undefined) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="animate-spin h-8 w-8 border-2 border-gold border-t-transparent rounded-full" />
        <p className="text-slate-400 text-sm">جاري التحقق من الصلاحية...</p>
      </div>
    );
  }

  if (user === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-400 text-lg">❌ {error || 'تعذر الاتصال'}</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-gold/20 text-gold rounded-xl">
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-10 text-center">
          <div className="inline-block px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full text-xs font-bold mb-4">
            🛠️ لوحة الإدارة
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gold mb-3">
            📰 إدارة الأخبار المالية
          </h1>
          <div className="flex items-center justify-center gap-4 text-sm text-slate-400">
            <Link href="/financial-news" className="text-gold hover:underline">
              ← عرض الصفحة العامة
            </Link>
          </div>
        </header>

        {/* Status cards */}
        <section className="mb-10">
          <ScraperStatus
            status={jobStatus}
            lastRun={lastRun}
            totalArticles={status?.total_articles || 0}
            apiKeyConfigured={status?.api_key_configured || false}
            cronConfigured={status?.cron_secret_configured || false}
          />
        </section>

        {/* Control Panel */}
        <section className="mb-10">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-slate-100 mb-4">🎛️ لوحة التحكم</h2>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <label
                  htmlFor="maxArticles"
                  className="text-sm font-medium text-slate-300 whitespace-nowrap"
                >
                  عدد المقالات:
                </label>
                <select
                  id="maxArticles"
                  value={maxArticles}
                  onChange={(e) => setMaxArticles(Number(e.target.value))}
                  disabled={loading}
                  className="px-3 py-2 rounded-xl border border-white/10
                             bg-white/10 text-slate-100
                             focus:ring-2 focus:ring-gold focus:border-gold
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
                className="px-8 py-3 bg-gradient-to-r from-gold to-amber-400 text-deep-navy
                           rounded-xl font-bold text-lg transition-all
                           disabled:opacity-50 disabled:cursor-not-allowed
                           hover:shadow-lg hover:shadow-gold/20
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

            {loading && (
              <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-300 text-sm">
                ⏳ جاري تجريف الأخبار وتلخيصها... قد يستغرق ذلك دقيقة أو دقيقتين.
              </div>
            )}

            {message && (
              <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-300 text-sm">
                {message}
              </div>
            )}
            {error && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-sm">
                ❌ {error}
              </div>
            )}
          </div>
        </section>

        {/* Results Table */}
        {results && results.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-100 mb-4">📋 نتائج التجريف</h2>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full bg-white/5 rounded-2xl overflow-hidden border border-white/10">
                <thead>
                  <tr className="bg-deep-navy text-slate-200 text-sm">
                    <th className="p-4 text-right">الحالة</th>
                    <th className="p-4 text-right">عنوان المقال</th>
                    <th className="p-4 text-right">المصدر</th>
                    <th className="p-4 text-right">الملف</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr
                      key={i}
                      className="border-t border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4">
                        {r.success ? (
                          <span className="text-emerald-400">✅</span>
                        ) : (
                          <span className="text-red-400">❌</span>
                        )}
                      </td>
                      <td className="p-4 text-sm text-slate-300 max-w-xs truncate">
                        {r.title || r.original_title || r.error || '—'}
                      </td>
                      <td className="p-4 text-sm">
                        {r.source_url ? (
                          <a
                            href={r.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gold hover:underline"
                          >
                            رابط المصدر
                          </a>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="p-4 text-sm text-slate-400">
                        {r.filename ? (
                          <button
                            onClick={() => handleDownload(r.filename!)}
                            className="text-gold hover:underline text-xs"
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

            {/* Mobile cards */}
            <div className="md:hidden grid gap-4">
              {results.map((r, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-2xl border ${
                    r.success
                      ? 'border-emerald-500/20 bg-emerald-500/5'
                      : 'border-red-500/20 bg-red-500/5'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span>{r.success ? '✅' : '❌'}</span>
                    <span className="text-sm font-bold text-slate-200">
                      {r.title || r.original_title || 'خطأ'}
                    </span>
                  </div>
                  {r.error && (
                    <p className="text-xs text-red-400 mt-1">{r.error}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Saved Files Browser */}
        <section>
          <h2 className="text-xl font-bold text-slate-100 mb-4">📂 الملفات المحفوظة</h2>

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
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-12 text-center border border-white/10">
              <p className="text-slate-400 text-lg">📭 لا توجد مقالات محفوظة بعد</p>
              <p className="text-slate-500 text-sm mt-2">
                اضغط على &quot;بدء التجريف&quot; لجمع الأخبار
              </p>
            </div>
          )}

          {status && status.total_articles > 10 && (
            <p className="text-sm text-slate-500 mt-4 text-center">
              عرض آخر 10 ملفات من أصل {status.total_articles.toLocaleString('ar-SA')} ملف
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
