'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { SCHEDULE_DATA } from '@/app/components/marfa/scheduleData';

interface QuizQuestion {
  id: string;
  meeting_number: number;
  question: string;
  updated_at: string;
}

interface QuizAnswer {
  id: string;
  meeting_number: number;
  user_id: string;
  display_name: string;
  answer: string;
  score: number | null;
  feedback: string | null;
  graded_at: string | null;
  created_at: string;
}

function relativeTime(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'الآن';
  const mins = Math.floor(diff / 60);
  if (mins < 60) return `قبل ${mins} دقيقة`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `قبل ${hours} ساعة`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'قبل يوم';
  if (days <= 10) return `قبل ${days} أيام`;
  return `قبل ${days} يوماً`;
}

function Stars({ score, onClick }: { score: number | null; onClick?: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1" style={{ direction: 'ltr' }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onClick?.(n)}
          disabled={!onClick}
          className={`text-lg transition ${onClick ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
        >
          {score !== null && n <= score ? '⭐' : '☆'}
        </button>
      ))}
    </div>
  );
}

export default function AdminMajlisPage() {
  const [questions, setQuestions] = useState<Record<number, QuizQuestion>>({});
  const [answers, setAnswers] = useState<Record<number, QuizAnswer[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedMeeting, setExpandedMeeting] = useState<number | null>(null);
  const [savingQuestion, setSavingQuestion] = useState<number | null>(null);
  const [questionText, setQuestionText] = useState<Record<number, string>>({});
  const [grading, setGrading] = useState<Record<string, { score: number | null; feedback: string; saving: boolean }>>({});

  const supabase = createClient();

  // Fetch all data
  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const qMap: Record<number, QuizQuestion> = {};
      const aMap: Record<number, QuizAnswer[]> = {};
      const qtMap: Record<number, string> = {};

      for (let n = 1; n <= 14; n++) {
        aMap[n] = [];

        const res = await fetch(`/api/admin/majlis-quiz?meeting=${n}`);
        if (!res.ok) continue;

        const json = await res.json();
        if (json.question) {
          qMap[n] = json.question;
          qtMap[n] = json.question.question;
        }
        if (json.answers) {
          aMap[n] = json.answers;
        }
      }

      setQuestions(qMap);
      setAnswers(aMap);
      setQuestionText(qtMap);
    } catch (err) {
      console.error('[admin-majlis] fetch', err);
      setError('تعذّر تحميل البيانات');
    }
    setLoading(false);
  }, []);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Realtime subscription for new answers
  useEffect(() => {
    const channel = supabase
      .channel('admin-majlis-answers')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'majlis_quiz_answers' },
        (payload) => {
          const row = payload.new as QuizAnswer;
          setAnswers((prev) => {
            const existing = prev[row.meeting_number] || [];
            if (existing.some((a) => a.id === row.id)) return prev;
            return { ...prev, [row.meeting_number]: [...existing, row] };
          });
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'majlis_quiz_answers' },
        (payload) => {
          const row = payload.new as QuizAnswer;
          setAnswers((prev) => {
            const existing = prev[row.meeting_number] || [];
            return {
              ...prev,
              [row.meeting_number]: existing.map((a) => (a.id === row.id ? row : a)),
            };
          });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel).catch(() => {}); };
  }, [supabase]);

  // Save question
  const saveQuestion = async (n: number) => {
    const text = (questionText[n] || '').trim();
    if (!text || text.length > 1000) return;

    setSavingQuestion(n);
    try {
      const res = await fetch('/api/admin/majlis-quiz', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meeting_number: n, question: text }),
      });
      if (res.ok) {
        setQuestions((prev) => ({
          ...prev,
          [n]: { ...prev[n], question: text, meeting_number: n, updated_at: new Date().toISOString(), id: prev[n]?.id || '' },
        }));
      }
    } catch (err) {
      console.error('[admin-majlis] save question', err);
    }
    setSavingQuestion(null);
  };

  // Grade answer
  const gradeAnswer = async (answerId: string) => {
    const g = grading[answerId];
    if (!g || g.score === null || g.saving) return;

    setGrading((prev) => ({ ...prev, [answerId]: { ...prev[answerId], saving: true } }));

    try {
      const body: Record<string, unknown> = { answer_id: answerId, score: g.score };
      if (g.feedback.trim()) body.feedback = g.feedback.trim();

      const res = await fetch('/api/admin/majlis-quiz', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        await fetchAll();
        setGrading((prev) => {
          const next = { ...prev };
          delete next[answerId];
          return next;
        });
      } else {
        setGrading((prev) => ({ ...prev, [answerId]: { ...prev[answerId], saving: false } }));
      }
    } catch (err) {
      console.error('[admin-majlis] grade', err);
      setGrading((prev) => ({ ...prev, [answerId]: { ...prev[answerId], saving: false } }));
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse" dir="rtl">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-20 bg-[#1a2540] rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div dir="rtl" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white mb-2">🏛️ إدارة المجلس الاستشاري</h1>
        <p className="text-[#8a9bb8] text-sm">أسئلة الحالات وإجابات رواد الأعمال — تقييم مباشر</p>
      </div>

      {error && (
        <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">{error}</div>
      )}

      <div className="space-y-3">
        {SCHEDULE_DATA.map((meeting, idx) => {
          const n = idx + 1;
          const q = questions[n];
          const ans = answers[n] || [];
          const pending = ans.filter((a) => !a.graded_at).length;
          const graded = ans.filter((a) => a.graded_at).length;
          const isExpanded = expandedMeeting === n;

          return (
            <div key={n} className="bg-[#0d1628] border border-[#1e2d4a] rounded-xl overflow-hidden">
              {/* Meeting row */}
              <button
                type="button"
                onClick={() => setExpandedMeeting(isExpanded ? null : n)}
                className="w-full p-4 flex items-center justify-between hover:bg-[#1a2540]/50 transition-colors text-start"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[#c9a84c] font-bold text-sm w-16">{meeting.encounter}</span>
                  <div>
                    <span className="text-white font-bold text-sm">{meeting.topic}</span>
                    <p className="text-[#4a5a78] text-xs">{meeting.case}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {q ? (
                    <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">لديها سؤال</span>
                  ) : (
                    <span className="text-xs px-2 py-1 rounded-full bg-[#1e2d4a] text-[#4a5a78]">بدون سؤال</span>
                  )}
                  {ans.length > 0 && (
                    <span className="text-xs px-2 py-1 rounded-full bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20">
                      {ans.length} إجابة ({pending} معلقة)
                    </span>
                  )}
                  <span className={`text-[#4a5a78] transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                </div>
              </button>

              {/* Expanded details */}
              {isExpanded && (
                <div className="border-t border-[#1e2d4a] p-4 space-y-4">
                  {/* Question editor */}
                  <div>
                    <label className="text-xs font-bold text-[#c9a84c] mb-2 block">سؤال الحالة:</label>
                    <textarea
                      value={questionText[n] || ''}
                      onChange={(e) => setQuestionText((prev) => ({ ...prev, [n]: e.target.value }))}
                      rows={2}
                      maxLength={1000}
                      className="w-full bg-[#060c18] border border-[#1e2d4a] rounded-lg px-3 py-2 text-sm text-white resize-none outline-none focus:border-[#c9a84c] placeholder:text-[#4a5a78]"
                      placeholder="اكتب سؤال الحالة لهذا اللقاء..."
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        type="button"
                        onClick={() => saveQuestion(n)}
                        disabled={savingQuestion === n || !(questionText[n] || '').trim()}
                        className="px-4 py-2 rounded-lg bg-[#c9a84c] hover:bg-[#d4a843] text-[#0a0f1e] font-bold text-xs disabled:opacity-40 transition"
                      >
                        {savingQuestion === n ? 'جاري الحفظ...' : 'حفظ السؤال'}
                      </button>
                    </div>
                  </div>

                  {/* Answers */}
                  {ans.length === 0 ? (
                    <p className="text-[#4a5a78] text-sm text-center py-4">لا توجد إجابات بعد</p>
                  ) : (
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-[#c9a84c] block">الإجابات ({ans.length}) — المعلقة: {pending} | المقيّمة: {graded}</label>
                      {ans.map((a) => {
                        const g = grading[a.id] || { score: a.score, feedback: a.feedback || '', saving: false };
                        const isGraded = a.graded_at !== null;

                        return (
                          <div key={a.id} className="bg-[#060c18] border border-[#1e2d4a] rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-bold text-white">{a.display_name}</span>
                              <span className="text-xs text-[#4a5a78]">{relativeTime(a.created_at)}</span>
                            </div>
                            <p className="text-sm text-[#8a9bb8] whitespace-pre-wrap leading-relaxed mb-3">{a.answer}</p>

                            {/* Grading */}
                            <div className="border-t border-[#1e2d4a] pt-3 space-y-2">
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-[#4a5a78]">التقييم:</span>
                                <Stars
                                  score={g.score}
                                  onClick={(v) =>
                                    setGrading((prev) => ({
                                      ...prev,
                                      [a.id]: { ...(prev[a.id] || { score: a.score, feedback: a.feedback || '', saving: false }), score: v },
                                    }))
                                  }
                                />
                                {isGraded && !grading[a.id] && (
                                  <span className="text-xs text-green-400">{a.score}/5</span>
                                )}
                              </div>

                              <textarea
                                value={g.feedback}
                                onChange={(e) =>
                                  setGrading((prev) => ({
                                    ...prev,
                                    [a.id]: { ...(prev[a.id] || { score: a.score, feedback: a.feedback || '', saving: false }), feedback: e.target.value },
                                  }))
                                }
                                placeholder="ملاحظات (اختياري)..."
                                rows={2}
                                maxLength={2000}
                                className="w-full bg-[#0d1628] border border-[#1e2d4a] rounded-lg px-3 py-2 text-sm text-white resize-none outline-none focus:border-[#c9a84c] placeholder:text-[#4a5a78]"
                              />

                              {g.score !== a.score || g.feedback !== (a.feedback || '') ? (
                                <div className="flex justify-end">
                                  <button
                                    type="button"
                                    onClick={() => gradeAnswer(a.id)}
                                    disabled={g.saving || g.score === null}
                                    className="px-4 py-2 rounded-lg bg-[#c9a84c] hover:bg-[#d4a843] text-[#0a0f1e] font-bold text-xs disabled:opacity-40 transition"
                                  >
                                    {g.saving ? 'جاري...' : isGraded ? 'تحديث التقييم' : 'اعتماد التقييم'}
                                  </button>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
