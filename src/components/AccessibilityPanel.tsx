import { Accessibility, X, CheckCircle2 } from 'lucide-react';

interface Props {
  enabled: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export default function AccessibilityPanel({ enabled, onToggle, onClose }: Props) {
  return (
    <div className="glass-panel-strong animate-scale-in w-full max-w-sm rounded-2xl p-4 shadow-card border-emerald-200/60 dark:border-emerald-800/40">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 shadow-sm">
            <Accessibility size={18} />
          </span>
          <div>
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-white font-heading">
              Universal Campus Access
            </h3>
            <p className="text-[10.5px] font-semibold text-emerald-600 dark:text-emerald-400">
              Barrier-Free Campus Navigation
            </p>
          </div>
        </div>
        <button onClick={onClose} className="icon-btn h-7 w-7 text-slate-400 hover:text-slate-700 dark:hover:text-white">
          <X size={14} />
        </button>
      </div>

      <p className="mb-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
        Prioritizes step-free paths, campus skywalks, tactile ground paving, elevators, and 1:12 slope wheelchair ramps across all academic blocks.
      </p>

      <div className="mb-3.5 space-y-1.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 p-2.5 text-[11px] font-medium text-emerald-900 dark:text-emerald-200 border border-emerald-200/50 dark:border-emerald-800/30">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Automatic elevators in Library, Engineering & Admin</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Tactile guidance paths along central pathways</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Simulates routes avoiding steps and steep curbs</span>
        </div>
      </div>

      <button
        onClick={onToggle}
        className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
          enabled
            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-brand-900/40 dark:text-slate-200'
        }`}
      >
        <span>{enabled ? 'Accessibility Mode: ENABLED' : 'Enable Barrier-Free Mode'}</span>
        <span
          className={`relative h-5 w-9 rounded-full transition-colors ${
            enabled ? 'bg-white/30' : 'bg-slate-300 dark:bg-white/20'
          }`}
        >
          <span
            className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
              enabled ? 'translate-x-4' : 'translate-x-0.5'
            }`}
          />
        </span>
      </button>
    </div>
  );
}
