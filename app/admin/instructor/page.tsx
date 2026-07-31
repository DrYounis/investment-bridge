'use client';

import { useState, useEffect, useCallback } from 'react';

// ── Hardcoded schedule data (mirrors MeetingsSchedule.tsx — immutable) ─────
const SCHEDULE = [
  { num: '01', encounter: 'اللقاء 1', topic: 'الاستراتيجية', case: 'Airbnb', file: 'Instructor_Guide_01_strategy.pdf' },
  { num: '02', encounter: 'اللقاء 2', topic: 'القيادة', case: 'Zappos', file: 'Instructor_Guide_02_leadership.pdf' },
  { num: '03', encounter: 'اللقاء 3', topic: 'المالية', case: 'WeWork', file: 'Instructor_Guide_03_finance.pdf' },
  { num: '04', encounter: 'اللقاء 4', topic: 'التسويق', case: 'Liquid Death', file: 'Instructor_Guide_04_marketing.pdf' },
  { num: '05', encounter: 'اللقاء 5', topic: 'العمليات', case: 'Amazon Logistics', file: 'Instructor_Guide_05_operations.pdf' },
  { num: '06', encounter: 'اللقاء 6', topic: 'التفاوض', case: 'Shark Tank', file: 'Instructor_Guide_06_negotiation.pdf' },
  { num: '07', encounter: 'اللقاء 7', topic: 'حوكمة الشركات', case: 'Saudi German Health', file: 'Instructor_Guide_07_governance.pdf' },
  { num: '08', encounter: 'اللقاء 8', topic: 'تآكل الهوامش', case: 'Nice One', file: 'Instructor_Guide_08_margins.pdf' },
  { num: '09', encounter: 'اللقاء 9', topic: 'الابتكار', case: 'Netflix', file: 'Instructor_Guide_09_innovation.pdf' },
  { num: '10', encounter: 'اللقاء 10', topic: 'الاندماج والاستحواذ', case: 'Elm', file: 'Instructor_Guide_10_mergers.pdf' },
  { num: '11', encounter: 'اللقاء 11', topic: 'الموارد البشرية', case: 'Google Project Aristotle', file: 'Instructor_Guide_11_hr.pdf' },
  { num: '12', encounter: 'اللقاء 12', topic: 'اقتصاديات التأمين', case: 'Tawuniya', file: 'Instructor_Guide_12_insurance.pdf' },
  { num: '13', encounter: 'اللقاء 13', topic: 'إدارة المخاطر', case: 'Theranos', file: 'Instructor_Guide_13_risk.pdf' },
  { num: '14', encounter: 'اللقاء 14', topic: 'التوسع الدولي', case: 'IKEA', file: 'Instructor_Guide_14_expansion.pdf' },
  { num: '15', encounter: 'اللقاء 15', topic: 'إدارة الأزمات', case: 'Johnson & Johnson', file: 'Instructor_Guide_15_crisis.pdf' },
  { num: '16', encounter: 'اللقاء 16', topic: 'الاستدامة والمسؤولية', case: 'Patagonia', file: 'Instructor_Guide_16_sustainability.pdf' },
  { num: '17', encounter: 'اللقاء 17', topic: 'دراسة الجدوى', case: 'Quibi', file: 'Instructor_Guide_17_feasibility.pdf' },
];

interface FileInfo {
  name: string;
  size: number;
  updated_at: string;
}

export default function InstructorPage() {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);

  const fetchFiles = useCallback(async () => {
    try {
      const res = await fetch('/api/instructor/guides');
      if (res.status === 401 || res.status === 403) {
        window.location.href = '/admin/login';
        return;
      }
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setFiles(data.files || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const openGuide = async (filename: string) => {
    setLoadingSlug(filename);
    try {
      const res = await fetch(`/api/instructor/guides/${encodeURIComponent(filename)}`);
      if (!res.ok) throw new Error('Failed to get signed URL');
      const { url } = await res.json();
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoadingSlug(null);
    }
  };

  const uploadedNames = new Set(files.map((f) => f.name));

  return (
    <div
      className="min-h-screen bg-[#0a0f1e] text-[#a0aec0] p-6 md:p-10"
      dir="rtl"
      style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
    >
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-black text-[#c9a84c] mb-2">أدلّة المدرّب</h1>
        <p className="text-[#64748b] mb-10">
          مراجع تعليمية خاصة بمدرب البرنامج — ١٧ دليلاً لمرافقة دراسات الحالة الأسبوعية
        </p>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {new Array(3).fill(null).map((_, i) => (
              <div key={i} className="animate-pulse bg-[#0d1628] rounded-2xl h-24 border border-[#1a2540]" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {SCHEDULE.map((entry) => {
              const isUploaded = uploadedNames.has(entry.file);
              const isLoading = loadingSlug === entry.file;

              return (
                <div
                  key={entry.num}
                  className={`flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl border transition-colors ${
                    isUploaded
                      ? 'bg-[#0d1628] border-[#1a2540]'
                      : 'bg-[#0d1628]/50 border-[#1a2540]/50 opacity-60'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-bold text-[#c9a84c] bg-[#c9a84c]/10 px-2 py-0.5 rounded-full">
                        {entry.encounter}
                      </span>
                      <span className="text-xs text-[#64748b]">{entry.topic}</span>
                    </div>
                    <h3 className="font-bold text-white text-lg leading-snug">{entry.case}</h3>
                  </div>

                  {isUploaded ? (
                    <button
                      onClick={() => openGuide(entry.file)}
                      disabled={isLoading}
                      className="shrink-0 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#c9a84c] to-[#d4a843] text-[#0a0f1e] font-bold text-sm hover:shadow-lg hover:shadow-[#c9a84c]/25 disabled:opacity-50 transition-all"
                    >
                      {isLoading ? 'جاري التحميل...' : 'دليل المدرّب'}
                    </button>
                  ) : (
                    <span className="shrink-0 px-5 py-2.5 rounded-xl bg-[#1a2540] border border-[#1a2540] text-[#64748b] text-sm font-bold cursor-default">
                      قيد الإعداد
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
