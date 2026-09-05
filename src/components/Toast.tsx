import { useEffect } from 'react';
import { CheckCircle2, Info, TriangleAlert } from 'lucide-react';

export interface ToastMessage {
  id: number;
  text: string;
  kind?: 'success' | 'info' | 'warning';
}

interface Props {
  toasts: ToastMessage[];
  onDismiss: (id: number) => void;
}

const ICONS = { success: CheckCircle2, info: Info, warning: TriangleAlert };
const COLORS = {
  success: 'text-emerald-500',
  info: 'text-brand-500',
  warning: 'text-amber-500',
};

function ToastItem({ toast, onDismiss }: { toast: ToastMessage; onDismiss: (id: number) => void }) {
  const Icon = ICONS[toast.kind ?? 'info'];
  useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.id), 3200);
    return () => clearTimeout(t);
  }, [toast.id, onDismiss]);

  return (
    <div className="glass-panel-strong animate-fade-in flex items-center gap-2 rounded-xl px-3.5 py-2.5">
      <Icon size={15} className={COLORS[toast.kind ?? 'info']} />
      <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{toast.text}</span>
    </div>
  );
}

export default function Toast({ toasts, onDismiss }: Props) {
  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[60] flex flex-col gap-2">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
}
