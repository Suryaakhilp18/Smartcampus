import { useState } from 'react';
import {
  Sparkles,
  Compass,
  Sunrise,
  Sun,
  Sunset,
  Layers,
  Flame,
  ShieldAlert,
  Accessibility,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from 'lucide-react';
import { CATEGORY_META, type CampusCategory } from '../data/campusData';
import type { PulsePeriod } from './CampusPulse';

interface Props {
  activeCategories: Set<CampusCategory>;
  onToggleCategory: (cat: CampusCategory) => void;
  onShowAllLocations: () => void;
  pulsePeriod: PulsePeriod;
  onSelectPulse: (period: PulsePeriod) => void;
  onOpenLayers: () => void;
  onToggleHeatmap: () => void;
  showHeatmap: boolean;
  onToggleAccessibility: () => void;
  accessibilityMode: boolean;
  onOpenDirectory: () => void;
  onOpenAi: () => void;
  onOpenEmergency: () => void;
}

const CATEGORIES = Object.keys(CATEGORY_META) as CampusCategory[];

export default function LeftTaskbar({
  activeCategories,
  onToggleCategory,
  onShowAllLocations,
  pulsePeriod,
  onSelectPulse,
  onOpenLayers,
  onToggleHeatmap,
  showHeatmap,
  onToggleAccessibility,
  accessibilityMode,
  onOpenDirectory,
  onOpenAi,
  onOpenEmergency,
}: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const isAllSelected = activeCategories.size === 0 || activeCategories.size >= CATEGORIES.length;

  if (collapsed) {
    return (
      <aside className="glass-panel-strong pointer-events-auto flex flex-col items-center gap-2.5 rounded-2xl p-2 shadow-2xl border border-brand-200/80 dark:border-brand-800/60 bg-white/95 dark:bg-[#071326]/95 w-14 transition-all duration-200">
        <button
          onClick={() => setCollapsed(false)}
          className="icon-btn h-9 w-9 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 dark:bg-brand-900/60 dark:text-brand-300"
          title="Expand Vertical Taskbar"
        >
          <ChevronRight size={18} />
        </button>

        <div className="h-px w-8 bg-slate-200 dark:bg-brand-800/60" />

        <button
          onClick={onOpenAi}
          className="h-10 w-10 rounded-xl bg-gradient-to-tr from-accent-500 to-amber-500 text-white flex items-center justify-center shadow-cta hover:scale-105 active:scale-95 transition-all"
          title="Ask AI Campus Copilot"
        >
          <Sparkles size={18} className="animate-pulse" />
        </button>

        <button
          onClick={onShowAllLocations}
          className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all ${
            isAllSelected
              ? 'bg-brand-700 text-white shadow-sm'
              : 'bg-slate-100 text-slate-700 dark:bg-brand-900/50 dark:text-slate-200 hover:bg-brand-100'
          }`}
          title="Show All 58 Locations"
        >
          <Compass size={18} />
        </button>

        <button
          onClick={onOpenLayers}
          className="h-9 w-9 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-brand-900/40"
          title="Map Layers"
        >
          <Layers size={17} />
        </button>

        <button
          onClick={onToggleHeatmap}
          className={`h-9 w-9 rounded-xl flex items-center justify-center transition-all ${
            showHeatmap ? 'bg-red-500 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-brand-900/40'
          }`}
          title="Toggle Activity Heatmap"
        >
          <Flame size={17} />
        </button>

        <button
          onClick={onOpenEmergency}
          className="h-9 w-9 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-sm hover:scale-105"
          title="Emergency SOS"
        >
          <ShieldAlert size={17} />
        </button>
      </aside>
    );
  }

  return (
    <aside className="glass-panel-strong pointer-events-auto flex flex-col gap-3 rounded-3xl p-3.5 shadow-2xl border border-brand-200/80 dark:border-brand-800/60 bg-white/95 dark:bg-[#071326]/95 w-72 max-h-[calc(100vh-6rem)] overflow-y-auto transition-all duration-200">
      {/* Header & Collapse Control */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-brand-800/60">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-brand-700 flex items-center justify-center text-white">
            <Compass size={15} />
          </div>
          <div>
            <h2 className="text-xs font-black uppercase tracking-wider text-brand-900 dark:text-white font-heading">
              SmartCampus Taskbar
            </h2>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              58 Mapped POIs · Surampalem
            </p>
          </div>
        </div>

        <button
          onClick={() => setCollapsed(true)}
          className="icon-btn h-7 w-7 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
          title="Collapse Taskbar to Mini Dock"
        >
          <ChevronLeft size={16} />
        </button>
      </div>

      {/* Primary Actions: Ask AI & All 58 Locations */}
      <div className="space-y-1.5">
        <button
          onClick={onOpenAi}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-2xl bg-gradient-to-r from-accent-500 via-amber-500 to-accent-600 text-white text-xs font-extrabold shadow-cta hover:brightness-105 active:scale-98 transition-all"
        >
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-amber-200 animate-pulse" />
            <span>Ask Aditya AI Copilot</span>
          </div>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-md uppercase font-bold">
            Chat
          </span>
        </button>

        <button
          onClick={onShowAllLocations}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-bold transition-all border ${
            isAllSelected
              ? 'bg-brand-700 text-white border-transparent shadow-md'
              : 'bg-brand-50/80 hover:bg-brand-100/90 text-brand-800 dark:bg-brand-950/60 dark:text-brand-200 border-brand-200/60 dark:border-brand-800/50'
          }`}
        >
          <div className="flex items-center gap-2">
            <MapPin size={15} className={isAllSelected ? 'text-amber-300' : 'text-accent-500'} />
            <span>All 58 Campus Locations</span>
          </div>
          <span
            className={`text-[10.5px] px-2 py-0.5 rounded-full font-black ${
              isAllSelected ? 'bg-white/20 text-white' : 'bg-brand-200/60 dark:bg-brand-800/80 text-brand-800 dark:text-brand-200'
            }`}
          >
            58
          </span>
        </button>
      </div>

      {/* Time-of-Day Campus Pulse */}
      <div>
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1">
          Campus Pulse (Time of Day)
        </span>
        <div className="grid grid-cols-3 gap-1.5 mt-1">
          <button
            onClick={() => onSelectPulse('morning')}
            className={`flex flex-col items-center gap-1 rounded-xl p-2 text-center transition-all ${
              pulsePeriod === 'morning' && !isAllSelected
                ? 'bg-amber-500 text-white shadow-md font-bold'
                : 'bg-slate-100 dark:bg-brand-950/50 text-slate-600 dark:text-slate-300 hover:bg-slate-200 font-medium'
            }`}
          >
            <Sunrise size={15} className={pulsePeriod === 'morning' && !isAllSelected ? 'text-white' : 'text-amber-500'} />
            <span className="text-[10.5px]">Morning</span>
          </button>

          <button
            onClick={() => onSelectPulse('afternoon')}
            className={`flex flex-col items-center gap-1 rounded-xl p-2 text-center transition-all ${
              pulsePeriod === 'afternoon' && !isAllSelected
                ? 'bg-amber-600 text-white shadow-md font-bold'
                : 'bg-slate-100 dark:bg-brand-950/50 text-slate-600 dark:text-slate-300 hover:bg-slate-200 font-medium'
            }`}
          >
            <Sun size={15} className={pulsePeriod === 'afternoon' && !isAllSelected ? 'text-white' : 'text-amber-500'} />
            <span className="text-[10.5px]">Afternoon</span>
          </button>

          <button
            onClick={() => onSelectPulse('evening')}
            className={`flex flex-col items-center gap-1 rounded-xl p-2 text-center transition-all ${
              pulsePeriod === 'evening' && !isAllSelected
                ? 'bg-indigo-600 text-white shadow-md font-bold'
                : 'bg-slate-100 dark:bg-brand-950/50 text-slate-600 dark:text-slate-300 hover:bg-slate-200 font-medium'
            }`}
          >
            <Sunset size={15} className={pulsePeriod === 'evening' && !isAllSelected ? 'text-white' : 'text-indigo-400'} />
            <span className="text-[10.5px]">Evening</span>
          </button>
        </div>
      </div>

      {/* Category Filter List */}
      <div>
        <div className="flex items-center justify-between px-1 mb-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Categories & Zones
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">
            {activeCategories.size === 0 || isAllSelected ? 'All Active' : `${activeCategories.size} Filtered`}
          </span>
        </div>

        <div className="space-y-1">
          {CATEGORIES.map((cat) => {
            const meta = CATEGORY_META[cat];
            const active = activeCategories.has(cat) && !isAllSelected;
            return (
              <button
                key={cat}
                onClick={() => onToggleCategory(cat)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'border-transparent text-white shadow-md'
                    : 'border border-slate-200/70 bg-white/70 text-slate-700 hover:bg-white dark:border-brand-800/40 dark:bg-campus-cardDark/60 dark:text-slate-200 dark:hover:bg-brand-900/40'
                }`}
                style={active ? { backgroundColor: meta.color } : undefined}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm shrink-0">{meta.emoji}</span>
                  <span className="truncate">{meta.label}</span>
                </div>
                {active && <span className="h-2 w-2 rounded-full bg-white animate-pulse" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Map Tools Strip */}
      <div className="pt-2 border-t border-slate-200/80 dark:border-brand-800/60 space-y-1.5">
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={onOpenLayers}
            className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl border border-slate-200/70 bg-white/80 dark:bg-brand-950/60 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-white transition-colors"
          >
            <Layers size={14} className="text-brand-600 dark:text-brand-400" />
            <span>3D Layers</span>
          </button>

          <button
            onClick={onToggleHeatmap}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl border text-xs font-bold transition-colors ${
              showHeatmap
                ? 'bg-red-500 text-white border-transparent shadow-sm'
                : 'border-slate-200/70 bg-white/80 dark:bg-brand-950/60 text-slate-700 dark:text-slate-200 hover:bg-white'
            }`}
          >
            <Flame size={14} className={showHeatmap ? 'text-white' : 'text-amber-500'} />
            <span>Heatmap</span>
          </button>
        </div>

        <button
          onClick={onToggleAccessibility}
          className={`w-full flex items-center justify-center gap-2 py-2 px-2.5 rounded-xl border text-xs font-bold transition-all ${
            accessibilityMode
              ? 'bg-emerald-600 text-white border-transparent shadow-sm'
              : 'border-slate-200/70 bg-white/80 dark:bg-brand-950/60 text-slate-700 dark:text-slate-200 hover:bg-white'
          }`}
        >
          <Accessibility size={14} className={accessibilityMode ? 'text-white' : 'text-emerald-500'} />
          <span>{accessibilityMode ? 'Barrier-Free Paths: ON' : 'Accessibility Navigation'}</span>
        </button>

        <button
          onClick={onOpenDirectory}
          className="w-full flex items-center justify-center gap-2 py-2 px-2.5 rounded-xl border border-brand-200/80 dark:border-brand-800/60 bg-brand-50/80 hover:bg-brand-100 dark:bg-brand-900/40 text-brand-800 dark:text-brand-200 text-xs font-bold transition-colors"
        >
          <Compass size={14} className="text-accent-500" />
          <span>Directory Index (58 Places)</span>
        </button>

        <button
          onClick={onOpenEmergency}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-md transition-all active:scale-98"
        >
          <ShieldAlert size={15} />
          <span>24/7 Medical & Emergency SOS</span>
        </button>
      </div>
    </aside>
  );
}
