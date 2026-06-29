'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

// ── Types ────────────────────────────────────────────────────────────────────

type ToastType = 'success' | 'error' | 'warning' | 'info';

type Toast = {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
  exiting?: boolean;
};

// ── Context ──────────────────────────────────────────────────────────────────

type ToastContextValue = {
  showToast: (message: string, type: ToastType, duration?: number) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
};

// ── Icons ────────────────────────────────────────────────────────────────────

const icons: Record<ToastType, React.ReactNode> = {
  success: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  error: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warning: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  info: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const borderColor: Record<ToastType, string> = {
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#c9a84c',
};

// ── Provider ─────────────────────────────────────────────────────────────────

const MAX_TOASTS = 4;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const removeToast = useCallback((id: string) => {
    // Start exit animation
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));

    // Remove from state after animation
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      const timer = timersRef.current.get(id);
      if (timer) {
        clearTimeout(timer);
        timersRef.current.delete(id);
      }
    }, 250);
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType, duration = 4000) => {
      const id = Date.now().toString() + Math.random().toString(36).slice(2, 6);

      setToasts((prev) => {
        const next = [...prev, { id, message, type, duration }];
        // Remove oldest if over limit
        if (next.length > MAX_TOASTS) {
          const oldest = next.shift();
          if (oldest) removeToast(oldest.id);
        }
        return next;
      });

      // Auto-remove
      const timer = setTimeout(() => removeToast(id), duration);
      timersRef.current.set(id, timer);
    },
    [removeToast]
  );

  // Cleanup timers on unmount
  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast stack */}
      <div
        className="fixed z-[9999] flex flex-col gap-3"
        style={{
          bottom: 24,
          right: 24,
          maxWidth: 360,
          direction: 'rtl',
        }}
      >
        <style>{`
          @keyframes toastIn {
            from { transform: translateX(110%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes toastOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(110%); opacity: 0; }
          }
          .toast-enter { animation: toastIn 0.3s ease-out forwards; }
          .toast-exit { animation: toastOut 0.25s ease-in forwards; }
        `}</style>

        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-xl px-5 py-4 flex items-start gap-3 text-right ${toast.exiting ? 'toast-exit' : 'toast-enter'}`}
            style={{
              background: '#0d1628',
              borderRight: `4px solid ${borderColor[toast.type]}`,
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              direction: 'rtl',
              fontFamily: 'var(--font-tajawal), sans-serif',
            }}
          >
            {/* Icon */}
            <span className="flex-shrink-0 mt-0.5">{icons[toast.type]}</span>

            {/* Message */}
            <p className="flex-1 text-sm text-white leading-relaxed text-right">
              {toast.message}
            </p>

            {/* Close button */}
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 mr-auto p-0.5 rounded hover:bg-white/5 transition-colors"
              aria-label="إغلاق"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#64748b"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// ── Usage examples ────────────────────────────────────────────────────────────
//
// In any component:
//   const { showToast } = useToast()
//
//   // Success
//   showToast('تم الحفظ بنجاح', 'success')
//
//   // Error
//   showToast('حدث خطأ، يرجى المحاولة مجدداً', 'error')
//
//   // Warning
//   showToast('تحقق من بياناتك قبل الإرسال', 'warning')
//
//   // Info with custom duration (6 seconds)
//   showToast('سيتم إرسال الإشعار إلى جميع المستخدمين', 'info', 6000)
