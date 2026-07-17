'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

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

interface MajlisQuizProps {
  meetingNumber: number;
  userId: string;
  displayName: string;
  isAdvisor: boolean;
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
  if (days === 2) return 'قبل يومين';
  if (days <= 10) return `قبل ${days} أيام`;
  return `قبل ${days} يوماً`;
}

function Stars({ score, onSelect, disabled }: { score: number | null; onSelect?: (v: number) => void; disabled?: boolean }) {
  return (
    <div className="flex items-center gap-1" style={{ direction: 'ltr' }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={disabled || !onSelect}
          onClick={() => onSelect?.(n)}
          className={`text-xl transition ${onSelect && !disabled ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
          aria-label={`${n} نجمة`}
        >
          {score !== null && n <= score ? '⭐' : '☆'}
        </button>
      ))}
    </div>
  );
}

export default function MajlisQuiz({ meetingNumber, userId, displayName, isAdvisor }: MajlisQuizProps) {
  // ── Student state ──
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [myAnswer, setMyAnswer] = useState<QuizAnswer | null>(null);
  const [loading, setLoading] = useState(!isAdvisor);
  const [answerText, setAnswerText] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Advisor state ──
  const [advisorAnswers, setAdvisorAnswers] = useState<QuizAnswer[]>([]);
  const [advisorQuestionText, setAdvisorQuestionText] = useState('');
  const [advisorSavingQuestion, setAdvisorSavingQuestion] = useState(false);
  const [advisorQuestionError, setAdvisorQuestionError] = useState<string | null>(null);
  const [gradingMap, setGradingMap] = useState<Record<string, { score: number | null; feedback: string; saving: boolean; error: string | null }>>({});

  const supabase = createClient();

  // ── Student: fetch question + own answer ──
  useEffect(() => {
    if (isAdvisor) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      const { data: qData, error: qErr } = await supabase
        .from('majlis_quiz_questions')
        .select('*')
        .eq('meeting_number', meetingNumber)
        .maybeSingle();

      if (qErr) {
        if (!cancelled) {
          setError('تعذّر تحميل السؤال');
          setLoading(false);
        }
        return;
      }

      if (!qData) {
        if (!cancelled) {
          setQuestion(null);
          setLoading(false);
        }
        return;
      }

      const { data: aData, error: aErr } = await supabase
        .from('majlis_quiz_answers')
        .select('*')
        .eq('meeting_number', meetingNumber)
        .eq('user_id', userId)
        .maybeSingle();

      if (!cancelled) {
        if (aErr) {
          setError('تعذّر تحميل إجابتك');
        }
        setQuestion(qData as QuizQuestion);
        setMyAnswer((aData as QuizAnswer) || null);
        if (aData && !(aData as QuizAnswer).graded_at) {
          setAnswerText((aData as QuizAnswer).answer);
        }
        setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [meetingNumber, userId, isAdvisor, supabase]);

  // ── Advisor: fetch question + all answers ──
  const fetchAdvisorData = async () => {
    setError(null);
    try {
      const res = await fetch(`/api/admin/majlis-quiz?meeting=${meetingNumber}`);
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'تعذّر تحميل البيانات');
        return;
      }
      if (json.question) {
        setQuestion(json.question as QuizQuestion);
        setAdvisorQuestionText((json.question as QuizQuestion).question);
      } else {
        setQuestion(null);
        setAdvisorQuestionText('');
      }
      const ans = (json.answers || []) as QuizAnswer[];
      setAdvisorAnswers(ans);

      const map: Record<string, { score: number | null; feedback: string; saving: boolean; error: string | null }> = {};
      for (const a of ans) {
        map[a.id] = {
          score: a.score,
          feedback: a.feedback || '',
          saving: false,
          error: null,
        };
      }
      setGradingMap(map);
    } catch (err) {
      console.error('[majlis-quiz] advisor fetch', err);
      setError('تعذّر تحميل البيانات');
    }
  };

  /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
  useEffect(() => {
    if (!isAdvisor) return;
    void fetchAdvisorData();
  }, [isAdvisor, meetingNumber]);
  /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

  // ── Student: submit answer ──
  const submitAnswer = async () => {
    const trimmed = answerText.trim();
    if (!trimmed || saving || trimmed.length > 3000) return;
    setSaving(true);
    setError(null);

    const optimistic: QuizAnswer = {
      id: `temp-${Date.now()}`,
      meeting_number: meetingNumber,
      user_id: userId,
      display_name: displayName,
      answer: trimmed,
      score: null,
      feedback: null,
      graded_at: null,
      created_at: new Date().toISOString(),
    };
    setMyAnswer(optimistic);

    const { data, error: insertErr } = await supabase
      .from('majlis_quiz_answers')
      .insert({ meeting_number: meetingNumber, user_id: userId, display_name: displayName, answer: trimmed })
      .select('*')
      .single();

    if (insertErr) {
      setMyAnswer(null);
      setError('تعذّر إرسال الإجابة — حاول مرة أخرى');
    } else if (data) {
      setMyAnswer(data as QuizAnswer);
      // Fire-and-forget: notify advisor + super admins
      fetch('/api/majlis-quiz/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetingNumber, displayName, answer: trimmed }),
      }).catch(() => {});
    }
    setSaving(false);
  };

  // ── Student: edit answer ──
  const editAnswer = async () => {
    const trimmed = answerText.trim();
    if (!trimmed || saving || !myAnswer || trimmed.length > 3000) return;
    setSaving(true);
    setError(null);

    const prev = myAnswer;
    setMyAnswer({ ...myAnswer, answer: trimmed, created_at: new Date().toISOString() });

    const { data, error: updateErr } = await supabase
      .from('majlis_quiz_answers')
      .update({ answer: trimmed, updated_at: new Date().toISOString() })
      .eq('id', myAnswer.id)
      .select('*')
      .single();

    if (updateErr) {
      setMyAnswer(prev);
      setError('تعذّر تعديل الإجابة — حاول مرة أخرى');
    } else if (data) {
      setMyAnswer(data as QuizAnswer);
    }
    setSaving(false);
  };

  // ── Advisor: save question ──
  const saveQuestion = async () => {
    const trimmed = advisorQuestionText.trim();
    if (!trimmed || advisorSavingQuestion || trimmed.length > 1000) return;

    setAdvisorSavingQuestion(true);
    setAdvisorQuestionError(null);

    try {
      const res = await fetch('/api/admin/majlis-quiz', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meeting_number: meetingNumber, question: trimmed }),
      });
      const json = await res.json();
      if (!res.ok) {
        setAdvisorQuestionError(json.error || 'تعذّر حفظ السؤال');
      } else {
        await fetchAdvisorData();
      }
    } catch (err) {
      console.error('[majlis-quiz] save question', err);
      setAdvisorQuestionError('تعذّر حفظ السؤال');
    }
    setAdvisorSavingQuestion(false);
  };

  // ── Advisor: grade answer ──
  const gradeAnswer = async (answerId: string) => {
    const g = gradingMap[answerId];
    if (!g || g.score === null || g.saving) return;
    const feedback = g.feedback.trim();

    setGradingMap((prev) => ({
      ...prev,
      [answerId]: { ...prev[answerId], saving: true, error: null },
    }));

    try {
      const body: Record<string, unknown> = { answer_id: answerId, score: g.score };
      if (feedback) body.feedback = feedback;

      const res = await fetch('/api/admin/majlis-quiz', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) {
        setGradingMap((prev) => ({
          ...prev,
          [answerId]: { ...prev[answerId], saving: false, error: json.error || 'تعذّر اعتماد التقييم' },
        }));
      } else {
        await fetchAdvisorData();
      }
    } catch (err) {
      console.error('[majlis-quiz] grade', err);
      setGradingMap((prev) => ({
        ...prev,
        [answerId]: { ...prev[answerId], saving: false, error: 'تعذّر اعتماد التقييم' },
      }));
    }
  };

  // ── Loading ──
  if (loading) {
    return (
      <div className="space-y-3 animate-pulse">
        <div className="h-6 bg-gray-100 rounded-xl w-2/3" />
        <div className="h-20 bg-gray-100 rounded-xl" />
      </div>
    );
  }

  // ── No question ──
  if (!question && !isAdvisor) return null;

  // ═══════════════════════════════════════════
  // ADVISOR MODE
  // ═══════════════════════════════════════════
  if (isAdvisor) {
    return (
      <div style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
        {/* Error */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm text-center">{error}</div>
        )}

        {/* Question editor */}
        <div className="bg-white rounded-2xl p-5 border border-[#c9a84c]/20 mb-6">
          <h3 className="text-sm font-bold text-[#0a0f1e] mb-3">سؤال الحالة</h3>
          {advisorQuestionError && (
            <div className="mb-3 p-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs text-center">{advisorQuestionError}</div>
          )}
          <textarea
            value={advisorQuestionText}
            onChange={(e) => setAdvisorQuestionText(e.target.value)}
            placeholder="اكتب سؤال الحالة هنا..."
            rows={3}
            maxLength={1000}
            disabled={advisorSavingQuestion}
            className="w-full rounded-2xl border border-[#c9a84c]/20 px-4 py-3 text-sm text-[#0a0f1e] resize-none outline-none focus:border-[#c9a84c] disabled:opacity-50 placeholder:text-[#8a94a8]"
            style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-[#8a94a8]">{advisorQuestionText.length}/1000</span>
            <button
              type="button"
              onClick={saveQuestion}
              disabled={advisorSavingQuestion || !advisorQuestionText.trim()}
              className="px-5 py-2 rounded-full bg-[#c9a84c] hover:bg-[#d4a843] text-white font-bold text-sm disabled:opacity-40 transition-all"
            >
              {advisorSavingQuestion ? 'جاري الحفظ...' : 'حفظ السؤال'}
            </button>
          </div>
        </div>

        {/* Answers list */}
        {advisorAnswers.length === 0 ? (
          <p className="text-center text-[#64748b] py-8">لا توجد إجابات بعد</p>
        ) : (
          <div className="space-y-4">
            {advisorAnswers.map((a) => {
              const g = gradingMap[a.id];
              const isGraded = a.graded_at !== null;
              return (
                <div key={a.id} className="bg-white rounded-2xl p-5 border border-[#c9a84c]/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-[#0a0f1e]">{a.display_name}</span>
                    <span className="text-xs text-[#8a94a8]">{relativeTime(a.created_at)}</span>
                  </div>
                  <p className="text-sm text-[#4a5b78] whitespace-pre-wrap leading-relaxed mb-4">{a.answer}</p>

                  {/* Grading controls */}
                  <div className="border-t border-[#c9a84c]/10 pt-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-[#8a94a8]">التقييم:</span>
                      <Stars
                        score={g?.score ?? null}
                        onSelect={(v) =>
                          setGradingMap((prev) => ({
                            ...prev,
                            [a.id]: { ...prev[a.id], score: v },
                          }))
                        }
                      />
                    </div>

                    <textarea
                      value={g?.feedback ?? ''}
                      onChange={(e) =>
                        setGradingMap((prev) => ({
                          ...prev,
                          [a.id]: { ...prev[a.id], feedback: e.target.value },
                        }))
                      }
                      placeholder="ملاحظات المستشار (اختياري)..."
                      rows={2}
                      maxLength={2000}
                      disabled={g?.saving}
                      className="w-full rounded-xl border border-[#c9a84c]/20 px-4 py-2 text-sm text-[#0a0f1e] resize-none outline-none focus:border-[#c9a84c] disabled:opacity-50 placeholder:text-[#8a94a8]"
                      style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
                    />

                    {g?.error && (
                      <div className="p-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs text-center">{g.error}</div>
                    )}

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => gradeAnswer(a.id)}
                        disabled={g?.saving || g?.score === null}
                        className="px-5 py-2 rounded-full bg-[#c9a84c] hover:bg-[#d4a843] text-white font-bold text-sm disabled:opacity-40 transition-all"
                      >
                        {g?.saving ? 'جاري الاعتماد...' : isGraded ? 'تحديث التقييم' : 'اعتماد التقييم'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ═══════════════════════════════════════════
  // STUDENT MODE
  // ═══════════════════════════════════════════
  const isGraded = myAnswer?.graded_at !== null;
  const hasSubmitted = myAnswer !== null && !myAnswer.id.startsWith('temp-');

  return (
    <div style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
      {/* Error */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm text-center">{error}</div>
      )}

      {/* Question card */}
      <div className="bg-white rounded-2xl p-5 border border-[#c9a84c]/20 mb-4">
        <p className="text-sm text-[#4a5b78] leading-relaxed">{question!.question}</p>
      </div>

      {/* State: not answered */}
      {!hasSubmitted && (
        <div>
          <textarea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            placeholder="اكتب إجابتك هنا..."
            rows={4}
            maxLength={3000}
            disabled={saving}
            className="w-full rounded-2xl border border-[#c9a84c]/20 px-4 py-3 text-sm text-[#0a0f1e] resize-none outline-none focus:border-[#c9a84c] disabled:opacity-50 placeholder:text-[#8a94a8]"
            style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-[#8a94a8]">{answerText.length}/3000</span>
            <button
              type="button"
              onClick={submitAnswer}
              disabled={saving || !answerText.trim()}
              className="px-6 py-2 rounded-full bg-[#c9a84c] hover:bg-[#d4a843] text-white font-bold text-sm disabled:opacity-40 transition-all"
            >
              {saving ? 'جاري الإرسال...' : 'أرسل إجابتك'}
            </button>
          </div>
        </div>
      )}

      {/* State: answered, not graded */}
      {hasSubmitted && !isGraded && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-block px-3 py-1 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/30 text-[#c9a84c] text-xs font-bold">
              بانتظار تقييم المستشار
            </span>
          </div>

          <textarea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            rows={4}
            maxLength={3000}
            disabled={saving}
            className="w-full rounded-2xl border border-[#c9a84c]/20 px-4 py-3 text-sm text-[#0a0f1e] resize-none outline-none focus:border-[#c9a84c] disabled:opacity-50 placeholder:text-[#8a94a8]"
            style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-[#8a94a8]">{answerText.length}/3000</span>
            <button
              type="button"
              onClick={editAnswer}
              disabled={saving || !answerText.trim() || answerText.trim() === myAnswer?.answer}
              className="px-6 py-2 rounded-full bg-[#c9a84c] hover:bg-[#d4a843] text-white font-bold text-sm disabled:opacity-40 transition-all"
            >
              {saving ? 'جاري الحفظ...' : 'تعديل الإجابة'}
            </button>
          </div>
        </div>
      )}

      {/* State: graded */}
      {hasSubmitted && isGraded && (
        <div>
          <div className="bg-white rounded-2xl p-5 border border-[#c9a84c]/20 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Stars score={myAnswer!.score} />
              <span className="text-sm font-bold text-[#c9a84c]">{myAnswer!.score}/5</span>
            </div>
            <p className="text-sm text-[#4a5b78] whitespace-pre-wrap leading-relaxed">{myAnswer!.answer}</p>
            <p className="text-xs text-[#8a94a8] mt-3">تم تقييم الإجابة — لا يمكن تعديلها بعد التقييم</p>
          </div>

          {myAnswer!.feedback && (
            <div className="bg-[#fdf9ef] rounded-2xl p-5 border border-[#c9a84c]/30">
              <h4 className="text-sm font-bold text-[#c9a84c] mb-2">رد المستشار</h4>
              <p className="text-sm text-[#4a5b78] whitespace-pre-wrap leading-relaxed">{myAnswer!.feedback}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
