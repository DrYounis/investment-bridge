'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import ContributorBadge from '@/app/components/ContributorBadge';

interface Message {
  id: string;
  meeting_number: number;
  user_id: string;
  display_name: string;
  body: string;
  created_at: string;
  contribution_tier?: string | null;
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

interface MajlisRoomProps {
  meetingNumber: number;
  userId: string;
  displayName: string;
  contributionTier?: string | null;
}

export default function MajlisRoom({ meetingNumber, userId, displayName, contributionTier }: MajlisRoomProps) {
  const supabase = createClient();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [likes, setLikes] = useState<Record<string, { count: number; liked: boolean }>>({});
  const bottomRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Load existing
  useEffect(() => {
    supabase
      .from('majlis_messages')
      .select('*')
      .eq('meeting_number', meetingNumber)
      .order('created_at', { ascending: true })
      .limit(200)
      .then(({ data }) => {
        if (data) setMessages(data);
        setLoading(false);
      });
  }, [meetingNumber, supabase]);

  // Load likes
  useEffect(() => {
    supabase
      .from('majlis_message_likes')
      .select('message_id, user_id')
      .eq('meeting_number', meetingNumber)
      .then(({ data }) => {
        if (!data) return;
        const map: Record<string, { count: number; liked: boolean }> = {};
        for (const row of data) {
          const mid = row.message_id;
          if (!map[mid]) map[mid] = { count: 0, liked: false };
          map[mid].count++;
          if (row.user_id === userId) map[mid].liked = true;
        }
        setLikes(map);
      });
  }, [meetingNumber, userId, supabase]);

  // Realtime
  useEffect(() => {
    const channel = supabase
      .channel(`majlis-${meetingNumber}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'majlis_messages', filter: `meeting_number=eq.${meetingNumber}` },
        (payload) => {
          const row = payload.new as Message;
          setMessages((prev) => {
            if (prev.some((m) => m.id === row.id)) return prev;
            return [...prev, row];
          });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel).catch(() => {}); };
  }, [meetingNumber, supabase]);

  // Realtime likes
  useEffect(() => {
    const channel = supabase
      .channel(`majlis-likes-${meetingNumber}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'majlis_message_likes', filter: `meeting_number=eq.${meetingNumber}` },
        (payload) => {
          const row = payload.new as { message_id: string; user_id: string };
          setLikes((prev) => {
            const cur = prev[row.message_id] || { count: 0, liked: false };
            return {
              ...prev,
              [row.message_id]: {
                count: cur.count + 1,
                liked: cur.liked || row.user_id === userId,
              },
            };
          });
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'majlis_message_likes', filter: `meeting_number=eq.${meetingNumber}` },
        (payload) => {
          const row = payload.old as { message_id: string; user_id: string };
          setLikes((prev) => {
            const cur = prev[row.message_id];
            if (!cur) return prev;
            return {
              ...prev,
              [row.message_id]: {
                count: Math.max(0, cur.count - 1),
                liked: row.user_id === userId ? false : cur.liked,
              },
            };
          });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel).catch(() => {}); };
  }, [meetingNumber, userId, supabase]);

  // Auto-scroll
  useEffect(() => {
    if (autoScroll) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, autoScroll]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    setAutoScroll(nearBottom);
  }, []);

  const send = async () => {
    const trimmed = body.trim();
    if (!trimmed || sending || trimmed.length > 2000) return;
    setSending(true);
    setError(null);

    const optimistic: Message = {
      id: `temp-${Date.now()}`,
      meeting_number: meetingNumber,
      user_id: userId,
      display_name: displayName,
      body: trimmed,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    setBody('');

    const { error: insertErr } = await supabase
      .from('majlis_messages')
      .insert({ meeting_number: meetingNumber, user_id: userId, display_name: displayName, body: trimmed, contribution_tier: contributionTier ?? null });

    if (insertErr) {
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      setError('تعذّر إرسال الرسالة — حاول مرة أخرى');
    }
    setSending(false);
  };

  const del = async (id: string) => {
    const prev = [...messages];
    setMessages((m) => m.filter((msg) => msg.id !== id));
    setDeleteConfirm(null);
    const { error: delErr } = await supabase.from('majlis_messages').delete().eq('id', id);
    if (delErr) {
      setMessages(prev);
      setError('تعذّر حذف الرسالة');
    }
  };

  const toggleLike = async (messageId: string) => {
    const cur = likes[messageId] || { count: 0, liked: false };

    // Optimistic update
    setLikes((prev) => ({
      ...prev,
      [messageId]: {
        count: cur.liked ? Math.max(0, cur.count - 1) : cur.count + 1,
        liked: !cur.liked,
      },
    }));

    if (cur.liked) {
      const { error: delErr } = await supabase
        .from('majlis_message_likes')
        .delete()
        .eq('message_id', messageId)
        .eq('user_id', userId);
      if (delErr) {
        setLikes((prev) => ({ ...prev, [messageId]: cur }));
      }
    } else {
      const { error: insErr } = await supabase
        .from('majlis_message_likes')
        .insert({ message_id: messageId, user_id: userId, meeting_number: meetingNumber });
      if (insErr) {
        setLikes((prev) => ({ ...prev, [messageId]: cur }));
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-3 animate-pulse" dir="rtl">
        {[1,2,3,4].map(i => <div key={i} className="h-12 bg-gray-100 rounded-xl" />)}
      </div>
    );
  }

  return (
    <div dir="rtl" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
      {/* Error */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm text-center">{error}</div>
      )}

      {/* Messages */}
      <div className="max-h-[60vh] overflow-y-auto mb-4 space-y-3" onScroll={handleScroll}>
        {messages.length === 0 ? (
          <p className="text-center text-[#64748b] py-16 text-lg">كن أول من يفتتح المجلس 🪑</p>
        ) : (
          messages.map((m) => {
            const isOwn = m.user_id === userId || m.id.startsWith('temp-');
            return (
              <div
                key={m.id}
                className={`rounded-2xl p-4 max-w-[85%] ${isOwn ? 'ms-auto border text-end' : 'me-auto text-start'}`}
                style={{
                  background: isOwn ? 'rgba(201,168,76,0.08)' : '#fff',
                  borderColor: isOwn ? 'rgba(201,168,76,0.3)' : 'rgba(201,168,76,0.15)',
                  borderWidth: 1,
                }}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-sm font-bold text-[#0a0f1e] inline-flex items-center gap-1.5">
                    {m.display_name}
                    <ContributorBadge tier={m.contribution_tier} size="sm" />
                  </span>
                  <span className="text-xs text-[#8a94a8]">{relativeTime(m.created_at)}</span>
                </div>
                <p className="text-sm text-[#4a5b78] whitespace-pre-wrap leading-relaxed">{m.body}</p>
                <div className="mt-2 flex items-center justify-between gap-2">
                  {/* Like button */}
                  <button
                    onClick={() => toggleLike(m.id)}
                    className={`inline-flex items-center gap-1 text-xs rounded-full px-2 py-1 transition ${
                      (likes[m.id]?.liked)
                        ? 'bg-red-50 text-red-500 border border-red-200'
                        : 'text-[#8a94a8] hover:text-red-400 hover:bg-red-50'
                    }`}
                  >
                    {(likes[m.id]?.liked) ? '❤️' : '🤍'}
                    {likes[m.id]?.count ? <span>{likes[m.id].count}</span> : null}
                  </button>

                  {/* Delete (own messages only) */}
                  {isOwn && m.id.length > 5 && (
                    <div className="text-start">
                      {deleteConfirm === m.id ? (
                        <span className="text-xs">
                          <button onClick={() => del(m.id)} className="text-red-500 font-bold mx-1">تأكيد الحذف</button>
                          <button onClick={() => setDeleteConfirm(null)} className="text-[#8a94a8] mx-1">إلغاء</button>
                        </span>
                      ) : (
                        <button onClick={() => setDeleteConfirm(m.id)} className="text-xs text-[#8a94a8] hover:text-red-400 transition">🗑️</button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-3 items-end">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
          }}
          placeholder="اكتب رسالتك..."
          rows={2}
          maxLength={2000}
          disabled={sending}
          className="flex-1 rounded-2xl border border-[#c9a84c]/20 px-4 py-3 text-sm text-[#0a0f1e] resize-none outline-none focus:border-[#c9a84c] disabled:opacity-50 placeholder:text-[#8a94a8]"
          style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
        />
        <div className="flex flex-col items-center gap-1">
          {body.length > 1800 && (
            <span className="text-xs text-[#8a94a8]">{2000 - body.length}</span>
          )}
          <button
            onClick={send}
            disabled={sending || !body.trim()}
            className="px-6 py-3 rounded-full bg-[#c9a84c] hover:bg-[#d4a843] text-white font-bold text-sm disabled:opacity-40 transition-all shrink-0"
          >
            إرسال
          </button>
        </div>
      </div>
    </div>
  );
}
