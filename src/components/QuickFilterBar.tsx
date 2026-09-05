import { Sunrise, Sun, Sunset, Utensils, GraduationCap, Cpu, Building2, ShieldAlert, Landmark, Sparkles } from 'lucide-react';
import type { CampusCategory } from '../data/campusData';
import type { PulsePeriod } from './CampusPulse';

interface Props {
  activeCategories: Set<CampusCategory>;
  onToggleCategory: (cat: CampusCategory) => void;
  onClearCategories: () => void;
  pulsePeriod: PulsePeriod;
  onSelectPulse: (period: PulsePeriod) => void;
}

const CATEGORY_PILLS: { key: CampusCategory; label: string; icon: typeof Utensils }[] = [
  { key: 'food', label: 'Food & Canteens', icon: Utensils },
  { key: 'academic', label: 'Academic Bhavans', icon: GraduationCap },
  { key: 'labs', label: 'Tech Hub & Labs', icon: Cpu },
  { key: 'facilities', label: 'Hostels & Central Library', icon: Building2 },
  { key: 'emergency', label: 'Medical & Emergency', icon: ShieldAlert },
  { key: 'events', label: 'Temples & Sports', icon: Landmark },
];

export default function QuickFilterBar({
  activeCategories,
  onToggleCategory,
  onClearCategories,
  pulsePeriod,
  onSelectPulse,
}: Props) {
  const isAllActive = activeCategories.size === 0 || activeCategories.size >= 8;

  return (
    <div className="pointer-events-auto flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-1 max-w-full">
      {/* All Places Reset Pill */}
      <button
        onClick={onClearCategories}
        className={`flex items-center gap-1.5 shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition-all active:scale-95 shadow-xs border ${
          isAllActive
            ? 'bg-brand-700 text-white border-transparent shadow-sm'
            : 'bg-white/90 dark:bg-campus-cardDark/90 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-brand-800/60 hover:bg-white dark:hover:bg-brand-900/40'
        }`}
      >
        <Sparkles size={13} className={isAllActive ? 'text-amber-300' : 'text-accent-500'} />
        <span>All 58 Places</span>
      </button>

      <div className="h-4 w-px bg-slate-300 dark:bg-brand-800/60 shrink-0 mx-0.5" />

      {/* Time-of-Day Campus Pulse Pills */}
      <button
        onClick={() => onSelectPulse('morning')}
        title="Morning Pulse: Academic blocks, Breakfast canteens & Bus transit"
        className={`flex items-center gap-1.5 shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition-all active:scale-95 shadow-xs border ${
          pulsePeriod === 'morning' && !isAllActive
            ? 'bg-amber-500 text-white border-transparent shadow-sm'
            : 'bg-white/90 dark:bg-campus-cardDark/90 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-brand-800/60 hover:bg-white dark:hover:bg-brand-900/40'
        }`}
      >
        <Sunrise size={13} className={pulsePeriod === 'morning' && !isAllActive ? 'text-white' : 'text-amber-500'} />
        <span>Morning</span>
      </button>

      <button
        onClick={() => onSelectPulse('afternoon')}
        title="Afternoon Pulse: Canteens, Tech Hub & Central Library"
        className={`flex items-center gap-1.5 shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition-all active:scale-95 shadow-xs border ${
          pulsePeriod === 'afternoon' && !isAllActive
            ? 'bg-amber-600 text-white border-transparent shadow-sm'
            : 'bg-white/90 dark:bg-campus-cardDark/90 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-brand-800/60 hover:bg-white dark:hover:bg-brand-900/40'
        }`}
      >
        <Sun size={13} className={pulsePeriod === 'afternoon' && !isAllActive ? 'text-white' : 'text-amber-500'} />
        <span>Afternoon</span>
      </button>

      <button
        onClick={() => onSelectPulse('evening')}
        title="Evening Pulse: Sports Stadium, Hostels, Canteens & Temples"
        className={`flex items-center gap-1.5 shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition-all active:scale-95 shadow-xs border ${
          pulsePeriod === 'evening' && !isAllActive
            ? 'bg-indigo-600 text-white border-transparent shadow-sm'
            : 'bg-white/90 dark:bg-campus-cardDark/90 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-brand-800/60 hover:bg-white dark:hover:bg-brand-900/40'
        }`}
      >
        <Sunset size={13} className={pulsePeriod === 'evening' && !isAllActive ? 'text-white' : 'text-indigo-400'} />
        <span>Evening</span>
      </button>

      <div className="h-4 w-px bg-slate-300 dark:bg-brand-800/60 shrink-0 mx-0.5" />

      {/* Category Pills */}
      {CATEGORY_PILLS.map(({ key, label, icon: Icon }) => {
        const isActive = activeCategories.has(key) && !isAllActive;
        return (
          <button
            key={key}
            onClick={() => onToggleCategory(key)}
            className={`flex items-center gap-1.5 shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition-all active:scale-95 shadow-xs border ${
              isActive
                ? 'bg-accent-500 text-white border-transparent shadow-sm'
                : 'bg-white/90 dark:bg-campus-cardDark/90 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-brand-800/60 hover:bg-white dark:hover:bg-brand-900/40'
            }`}
          >
            <Icon size={13} className={isActive ? 'text-white' : 'text-accent-500'} />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
