'use client';

import React, { useState } from 'react';

interface AnalysisResult {
  executive_summary: string;
  market_size: string;
  historical_context: string;
  opportunity_score: number;
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  key_risks: string[];
  recommendations: string[];
  verdict: string;
  verdict_color: string;
}

const SECTORS = [
  'تقنية المعلومات',
  'السياحة والضيافة',
  'الصحة',
  'التعليم',
  'الزراعة',
  'التجارة الإلكترونية',
  'الطاقة المتجددة',
  'النقل والخدمات اللوجستية',
  'الخدمات المالية',
  'الإعلام والترفيه',
  'الصناعة',
  'عام / أخرى',
];

export default function IdeaAnalyzer({ role }: { role: 'investor' | 'entrepreneur' }) {
  const [sector, setSector] = useState('');
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');

  const analyze = async () => {
    if (!idea.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: idea.trim(), sector, role }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'فشل التحليل' }));
        throw new Error(err.error || `خطأ ${res.status}`);
      }

      const data: AnalysisResult = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء التحليل');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError('');
    setIdea('');
    setSector('');
  };

  const scoreColor = (score: number) => {
    if (score >= 8) return '#3ecf8e';
    if (score >= 5) return '#c9a84c';
    return '#f06060';
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Input card */}
      {!result && (
        <div className="rounded-2xl p-6 space-y-5" style={{ background: '#0d1428' }}>
          <div>
            <label className="text-sm font-bold mb-2 block" style={{ color: '#6b7a95' }}>
              القطاع
            </label>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="w-full p-3 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all appearance-none"
              style={{
                background: '#111932',
                border: '1px solid #1c2640',
                color: '#e8eaf0',
              }}
            >
              <option value="">اختر القطاع...</option>
              {SECTORS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-bold mb-2 block" style={{ color: '#6b7a95' }}>
              فكرة المشروع
            </label>
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="اكتب فكرتك بالتفصيل... كلما زادت التفاصيل كان التحليل أدق"
              rows={6}
              className="w-full p-4 rounded-xl resize-none text-sm placeholder:text-[#4a5a78] focus:outline-none focus:ring-2 transition-all"
              style={{
                background: '#111932',
                border: '1px solid #1c2640',
                color: '#e8eaf0',
              }}
            />
          </div>

          <button
            onClick={analyze}
            disabled={loading || !idea.trim()}
            className="w-full py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-40"
            style={{ background: '#c9a84c', color: '#0a0f1e' }}
          >
            {loading ? '🧠 جاري التحليل...' : '🔍 تحليل الفكرة'}
          </button>

          {error && (
            <p className="text-sm text-center" style={{ color: '#f06060' }}>
              {error}
            </p>
          )}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="rounded-2xl p-12 text-center space-y-4" style={{ background: '#0d1428' }}>
          <div className="text-5xl animate-bounce">🧠</div>
          <p className="text-sm" style={{ color: '#c9a84c' }}>
            جاري تحليل فكرتك بعمق... يرجى الانتظار
          </p>
          <div className="w-48 mx-auto h-1.5 rounded-full overflow-hidden" style={{ background: '#111932' }}>
            <div className="h-full rounded-full animate-pulse" style={{ width: '60%', background: '#c9a84c' }} />
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-5 animate-fade-in">
          {/* Verdict banner */}
          <div
            className="rounded-2xl p-6 text-center"
            style={{
              background: '#0d1428',
              borderRight: `4px solid ${result.verdict_color || '#3ecf8e'}`,
            }}
          >
            <div className="text-4xl mb-3">
              {result.opportunity_score >= 8 ? '🌟' : result.opportunity_score >= 5 ? '👍' : '⚠️'}
            </div>
            <p className="text-lg font-bold leading-relaxed" style={{ color: '#e8eaf0' }}>
              {result.verdict}
            </p>
            <div className="flex items-center justify-center gap-2 mt-3">
              <span className="text-xs" style={{ color: '#6b7a95' }}>
                تقييم الفرصة:
              </span>
              <span className="text-2xl font-black" style={{ color: scoreColor(result.opportunity_score) }}>
                {result.opportunity_score}/10
              </span>
            </div>
          </div>

          {/* SWOT Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(['strengths', 'weaknesses', 'opportunities', 'threats'] as const).map((key) => {
              const titles: Record<string, string> = {
                strengths: '💪 نقاط القوة',
                weaknesses: '🔻 نقاط الضعف',
                opportunities: '🚀 الفرص',
                threats: '⚠️ التهديدات',
              };
              return (
                <div
                  key={key}
                  className="rounded-xl p-4"
                  style={{ background: '#0d1428', border: '1px solid #1c2640' }}
                >
                  <h4 className="text-sm font-bold mb-3" style={{ color: '#c9a84c' }}>
                    {titles[key]}
                  </h4>
                  <ul className="space-y-2">
                    {result.swot[key].map((item: string, i: number) => (
                      <li key={i} className="text-sm flex gap-2" style={{ color: '#e8eaf0' }}>
                        <span style={{ color: '#6b7a95' }}>•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Risks */}
          <div className="rounded-xl p-5" style={{ background: '#0d1428', border: '1px solid #1c2640' }}>
            <h4 className="text-sm font-bold mb-3" style={{ color: '#f06060' }}>
              ⚡ المخاطر الرئيسية
            </h4>
            <ul className="space-y-2">
              {result.key_risks.map((risk: string, i: number) => (
                <li key={i} className="text-sm flex gap-2" style={{ color: '#e8eaf0' }}>
                  <span style={{ color: '#f06060' }}>•</span>
                  {risk}
                </li>
              ))}
            </ul>
          </div>

          {/* Recommendations */}
          <div className="rounded-xl p-5" style={{ background: '#0d1428', border: '1px solid #1c2640' }}>
            <h4 className="text-sm font-bold mb-3" style={{ color: '#3ecf8e' }}>
              💡 التوصيات
            </h4>
            <ul className="space-y-2">
              {result.recommendations.map((rec: string, i: number) => (
                <li key={i} className="text-sm flex gap-2" style={{ color: '#e8eaf0' }}>
                  <span style={{ color: '#3ecf8e' }}>•</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>

          {/* Reset button */}
          <button
            onClick={reset}
            className="w-full py-3 rounded-xl text-sm font-bold transition-all hover:brightness-110"
            style={{
              background: 'transparent',
              border: '1px solid #1c2640',
              color: '#6b7a95',
            }}
          >
            🔄 تحليل فكرة جديدة
          </button>
        </div>
      )}
    </div>
  );
}
