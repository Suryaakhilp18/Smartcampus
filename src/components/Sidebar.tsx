import { Compass, Sparkles, Flame, Layers, ShieldAlert, Accessibility } from 'lucide-react';
import CategoryFilter from './CategoryFilter';
import type { CampusCategory } from '../data/campusData';

interface Props {
  activeCategories: Set<CampusCategory>;
  onToggleCategory: (c: CampusCategory) => void;
  onOpenSmartCampus: () => void;
  onOpenLayers: () => void;
  onToggleHeatmap: () => void;
  showHeatmap: boolean;
  onOpenEmergency: () => void;
  onToggleAccessibility?: () => void;
  accessibilityMode?: boolean;
  onOpenDirectory?: () => void;
  onOpenAi?: () => void;
  onClose?: () => void;
  className?: string;
}

export default function Sidebar({
  activeCategories,
  onToggleCategory,
  onOpenSmartCampus,
  onOpenLayers,
  onToggleHeatmap,
  showHeatmap,
  onOpenEmergency,
  onToggleAccessibility,
  accessibilityMode,
  onOpenDirectory,
  onOpenAi,
  onClose,
  className = '',
}: Props) {
  return (
    <aside
      className={`glass-panel-strong pointer-events-auto flex w-80 flex-col gap-3.5 rounded-3xl p-4 shadow-2xl border-brand-100/80 dark:border-brand-800/60 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Compass size={17} className="text-accent-500" />
          <h2 className="text-sm font-extrabold tracking-tight text-brand-900 dark:text-white font-heading">
            Campus Zones & Tools
          </h2>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold bg-brand-50 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300 px-2 py-0.5 rounded-full border border-brand-200/50 dark:border-brand-800/40">
            9 Zones
          </span>
          {onClose && (
            <button
              onClick={onClose}
              className="icon-btn h-7 w-7 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              title="Close Panel (Full Map View)"
            >
              <span className="text-sm font-bold">✕</span>
            </button>
          )}
        </div>
      </div>

      <CategoryFilter activeCategories={activeCategories} onToggleCategory={onToggleCategory} />

      {/* Directory Quick Access */}
      {onOpenDirectory && (
        <button
          onClick={onOpenDirectory}
          className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl border border-brand-200/80 dark:border-brand-800/60 bg-brand-50/70 dark:bg-brand-900/30 text-brand-800 dark:text-brand-200 hover:bg-brand-100/70 dark:hover:bg-brand-800/50 text-xs font-bold transition-all shadow-2xs"
        >
          <Compass size={14} className="text-accent-500" />
          <span>Full Campus Directory (58)</span>
        </button>
      )}

      {/* AI Campus Copilot Button */}
      {onOpenAi && (
        <button
          onClick={() => onOpenAi()}
          className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-accent-500/15 via-amber-500/20 to-accent-500/15 hover:from-accent-500/25 hover:to-amber-500/30 text-accent-700 dark:text-accent-300 border border-accent-500/30 text-xs font-bold transition-all shadow-2xs"
        >
          <Sparkles size={14} className="text-accent-500 animate-pulse" />
          <span>Ask Aditya AI Copilot</span>
        </button>
      )}

      <div className="h-px bg-slate-200/70 dark:bg-brand-900/40" />

      {/* Primary Smart Campus Button */}
      <button
        onClick={onOpenSmartCampus}
        className="btn-primary w-full py-2.5 text-xs uppercase tracking-wider font-extrabold shadow-cta"
      >
        <Sparkles size={16} className="fill-white" />
        <span>Smart Campus Pulse</span>
      </button>

      {/* Grid of tools */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onOpenLayers}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200/70 bg-white/70 px-2.5 py-2 text-xs font-bold text-slate-700 transition-all hover:bg-white dark:border-brand-800/50 dark:bg-campus-cardDark/60 dark:text-slate-300 dark:hover:bg-brand-900/40"
        >
          <Layers size={14} className="text-brand-600 dark:text-brand-400" />
          <span>Layers</span>
        </button>

        <button
          onClick={onToggleHeatmap}
          className={`flex items-center justify-center gap-1.5 rounded-xl border px-2.5 py-2 text-xs font-bold transition-all ${
            showHeatmap
              ? 'border-transparent bg-red-500 text-white shadow-md'
              : 'border-slate-200/70 bg-white/70 text-slate-700 hover:bg-white dark:border-brand-800/50 dark:bg-campus-cardDark/60 dark:text-slate-300 dark:hover:bg-brand-900/40'
          }`}
        >
          <Flame size={14} className={showHeatmap ? 'text-white' : 'text-amber-500'} />
          <span>Activity</span>
        </button>
      </div>

      {onToggleAccessibility && (
        <button
          onClick={onToggleAccessibility}
          className={`flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition-all ${
            accessibilityMode
              ? 'border-transparent bg-emerald-600 text-white shadow-md'
              : 'border-slate-200/70 bg-white/70 text-slate-700 hover:bg-white dark:border-brand-800/50 dark:bg-campus-cardDark/60 dark:text-slate-300 dark:hover:bg-brand-900/40'
          }`}
        >
          <Accessibility size={15} className={accessibilityMode ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'} />
          <span>{accessibilityMode ? 'Accessible Mode: ON' : 'Accessibility Mode'}</span>
        </button>
      )}

      {/* Emergency Mode Button */}
      <button
        onClick={onOpenEmergency}
        className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50/80 px-3 py-2 text-xs font-bold text-red-600 transition-all hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-900/30"
      >
        <ShieldAlert size={15} />
        <span>24/7 Emergency Mode</span>
      </button>
    </aside>
  );
}
