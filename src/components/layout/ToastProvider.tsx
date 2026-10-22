import React from 'react';
import { useNexusStore } from '../../store/useNexusStore';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export function ToastProvider() {
  const toasts = useNexusStore((s) => s.toasts);
  const removeToast = useNexusStore((s) => s.removeToast);

  if (toasts.length === 0) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-rose-400" />;
      default:
        return <Info className="w-4 h-4 text-cyan-400" />;
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-emerald-500/40 shadow-emerald-950/30';
      case 'warning':
        return 'border-amber-500/40 shadow-amber-950/30';
      case 'error':
        return 'border-rose-500/40 shadow-rose-950/30';
      default:
        return 'border-cyan-500/40 shadow-cyan-950/30';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-3.5 rounded-xl bg-slate-950/95 backdrop-blur-xl border ${getBorderColor(
            toast.type
          )} shadow-2xl flex items-start gap-3 animate-in slide-in-from-bottom-5 duration-200`}
        >
          <div className="mt-0.5 shrink-0">{getIcon(toast.type)}</div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold text-white tracking-wide">
              {toast.title}
            </h4>
            {toast.message && (
              <p className="text-xs text-slate-300 mt-0.5 leading-snug">
                {toast.message}
              </p>
            )}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 rounded-md text-slate-400 hover:text-white shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
