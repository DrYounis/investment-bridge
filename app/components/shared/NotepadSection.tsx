'use client';

import React, { useState, useCallback } from 'react';

interface Note {
  id: string;
  text: string;
  timestamp: string;
}

export default function NotepadSection() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [draft, setDraft] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const saveNote = useCallback(() => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    const now = new Date().toLocaleString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    setNotes((prev) => [
      { id: crypto.randomUUID(), text: trimmed, timestamp: now },
      ...prev,
    ]);
    setDraft('');
  }, [draft]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      saveNote();
    }
  };

  const analyzeWithAI = async () => {
    const trimmed = draft.trim();
    if (!trimmed || aiLoading) return;
    setAiLoading(true);
    setAiError('');
    try {
      const res = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: `حلل الملاحظات التالية لرائد أعمال سعودي وقدم 3 توصيات عملية مختصرة بالعربية:\n${trimmed}` }],
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const aiText = data.content?.[0]?.text ?? data.text ?? data.response ?? data.content ?? '';
        if (aiText) {
          setDraft((prev) => prev + '\n\n🤖 تحليل الذكاء الاصطناعي:\n' + aiText);
        } else {
          setAiError('لم يتم الحصول على رد من المساعد — حاول مرة أخرى');
        }
      } else {
        setAiError('حدث خطأ — حاول مرة أخرى');
      }
    } catch {
      setAiError('تعذر الاتصال بالمساعد الذكي');
    }
    setAiLoading(false);
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Input area */}
      <div className="rounded-2xl p-5 space-y-4" style={{ background: '#0d1428' }}>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="اكتب ملاحظاتك هنا... (Ctrl+Enter للحفظ)"
          rows={4}
          className="w-full p-4 rounded-xl resize-none text-sm placeholder:text-[#4a5a78] focus:outline-none focus:ring-2 transition-all"
          style={{
            background: '#111932',
            border: '1px solid #1c2640',
            color: '#e8eaf0',
          }}
        />
        <div className="flex gap-3">
          <button
            onClick={saveNote}
            className="px-5 py-2 rounded-xl text-sm font-bold transition-all hover:brightness-110"
            style={{ background: '#c9a84c', color: '#0a0f1e' }}
          >
            💾 حفظ
          </button>
          <button
            onClick={analyzeWithAI}
            disabled={aiLoading || !draft.trim()}
            className="px-5 py-2 rounded-xl text-sm font-bold transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: 'transparent',
              border: '1px solid #c9a84c',
              color: '#c9a84c',
            }}
          >
            {aiLoading ? '⏳ جار التحليل...' : '🧠 اختبر مع الذكاء'}
          </button>
        </div>
        {aiError && (
          <p className="text-xs text-[#ef4444]">{aiError}</p>
        )}
      </div>

      {/* Saved notes list */}
      {notes.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold" style={{ color: '#6b7a95' }}>
            📋 الملاحظات المحفوظة
          </h3>
          {notes.map((note) => (
            <div
              key={note.id}
              className="rounded-xl p-4 transition-all"
              style={{
                background: '#0d1428',
                border: '1px solid #1c2640',
              }}
            >
              <p className="text-sm leading-relaxed" style={{ color: '#e8eaf0' }}>
                {note.text}
              </p>
              <span className="text-xs mt-2 block" style={{ color: '#6b7a95' }}>
                {note.timestamp}
              </span>
            </div>
          ))}
        </div>
      )}

      {notes.length === 0 && (
        <p className="text-xs text-center" style={{ color: '#6b7a95' }}>
          لا توجد ملاحظات بعد. ابدأ بكتابة أول ملاحظة!
        </p>
      )}
    </div>
  );
}
