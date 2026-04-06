import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const counterRef = useRef(0);

  const pushToast = useCallback((input) => {
    const id = String(++counterRef.current);
    const toast = {
      id,
      type: input?.type || 'info',
      message: input?.message || '',
      durationMs: Number(input?.durationMs || 2200),
    };

    if (!toast.message) return;

    setToasts((prev) => [...prev, toast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, toast.durationMs);
  }, []);

  const value = useMemo(() => ({ pushToast }), [pushToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-20 z-[9999] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2">
        {toasts.map((t) => {
          const base =
            'rounded-2xl border px-4 py-3 text-sm shadow-lg backdrop-blur bg-white/90';
          const variants = {
            success: 'border-emerald-200 text-emerald-800',
            error: 'border-rose-200 text-rose-800',
            info: 'border-blue-200 text-blue-800',
            warning: 'border-amber-200 text-amber-900',
          };
          const cls = `${base} ${variants[t.type] || variants.info}`;
          return (
            <div key={t.id} className={cls}>
              {t.message}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return { pushToast: () => {} };
  }
  return ctx;
}

