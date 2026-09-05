import { Flame } from 'lucide-react';

interface Props {
  visible: boolean;
}

export default function ActivityHeatmap({ visible }: Props) {
  if (!visible) return null;
  return (
    <div className="glass-panel animate-fade-in flex items-center gap-3 rounded-2xl px-3.5 py-2.5">
      <Flame size={15} className="text-red-500" />
      <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Campus Activity
      </span>
      <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Low
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Medium
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500" /> High
        </span>
      </div>
    </div>
  );
}
