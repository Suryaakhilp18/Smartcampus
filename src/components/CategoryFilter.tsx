import { CATEGORY_META, type CampusCategory } from '../data/campusData';

interface Props {
  activeCategories: Set<CampusCategory>;
  onToggleCategory: (c: CampusCategory) => void;
}

const CATEGORIES = Object.keys(CATEGORY_META) as CampusCategory[];

export default function CategoryFilter({ activeCategories, onToggleCategory }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      {CATEGORIES.map((cat) => {
        const meta = CATEGORY_META[cat];
        const active = activeCategories.has(cat);
        return (
          <button
            key={cat}
            onClick={() => onToggleCategory(cat)}
            className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 text-left text-xs font-semibold transition-all duration-150 active:scale-98 ${
              active
                ? 'border-transparent text-white shadow-md'
                : 'border-slate-200/80 bg-white/70 text-slate-700 hover:bg-white dark:border-brand-800/50 dark:bg-campus-cardDark/70 dark:text-slate-200 dark:hover:bg-brand-900/40'
            }`}
            style={active ? { backgroundColor: meta.color } : undefined}
          >
            <span className="text-base shrink-0">{meta.emoji}</span>
            <span className="flex-1 font-medium">{meta.label}</span>
          </button>
        );
      })}
    </div>
  );
}
