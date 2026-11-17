import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'info' | 'error';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev.slice(-3), { id, message, type }]);
    setTimeout(() => {
      dismiss(id);
    }, 5000);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts.length > 0 && (
        <div
          className="fixed bottom-20 xl:bottom-6 left-4 right-4 sm:left-auto sm:right-6 z-50 flex flex-col gap-2.5 max-w-md pointer-events-none"
          role="status"
          aria-live="polite"
        >
          {toasts.map((toast) => {
            const palette =
              toast.type === 'success'
                ? 'bg-emerald-950/95 border-emerald-500/50 text-emerald-100'
                : toast.type === 'warning' || toast.type === 'error'
                ? 'bg-amber-950/95 border-amber-500/50 text-amber-100'
                : 'bg-[#0B132B]/95 border-[#D4AF37]/50 text-[#F8FAFC]';

            return (
              <div
                key={toast.id}
                className={`pointer-events-auto flex items-start gap-3 px-4 py-3.5 rounded-2xl border shadow-2xl backdrop-blur-md transition-all duration-300 ${palette}`}
              >
                {toast.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : toast.type === 'warning' || toast.type === 'error' ? (
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                ) : (
                  <Info className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                )}
                <p className="text-xs sm:text-sm font-bold leading-relaxed flex-1 whitespace-pre-line">
                  {toast.message}
                </p>
                <button
                  type="button"
                  onClick={() => dismiss(toast.id)}
                  className="p-1 rounded-lg hover:bg-white/10 text-current opacity-75 hover:opacity-100 transition-opacity cursor-pointer shrink-0"
                  aria-label="إغلاق الإشعار"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      showToast: () => {},
    };
  }
  return ctx;
};
