import { X, Layers } from 'lucide-react';
import { CATEGORY_META, type CampusCategory } from '../data/campusData';

interface Props {
  activeLayers: Set<CampusCategory>;
  onToggleLayer: (c: CampusCategory) => void;
  showBuildings: boolean;
  onToggleBuildings: () => void;
  onClose: () => void;
}

const LAYERS = Object.keys(CATEGORY_META) as CampusCategory[];

export default function LayerControl({
  activeLayers,
  onToggleLayer,
  showBuildings,
  onToggleBuildings,
  onClose,
}: Props) {
  return (
    <div className="glass-panel-strong animate-scale-in w-72 rounded-2xl p-4 shadow-card border-brand-100/70 dark:border-brand-800/40">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-brand-600 dark:text-brand-400" />
          <h3 className="text-sm font-extrabold text-slate-800 dark:text-white font-heading">
            Map Layers & Overlays
          </h3>
        </div>
        <button
          onClick={onClose}
          className="icon-btn h-7 w-7 text-slate-400 hover:text-slate-700 dark:hover:text-white"
        >
          <X size={14} />
        </button>
      </div>

      <label className="mb-2 flex cursor-pointer items-center justify-between rounded-xl px-2.5 py-2 hover:bg-slate-100 dark:hover:bg-brand-900/30 transition-colors">
        <span className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
          <span className="h-3.5 w-3.5 rounded-md bg-accent-500 shadow-sm" />
          Building Footprints
        </span>
        <input
          type="checkbox"
          checked={showBuildings}
          onChange={onToggleBuildings}
          className="h-4 w-4 accent-accent-500 rounded cursor-pointer"
        />
      </label>

      <div className="h-px my-1.5 bg-slate-200/70 dark:bg-brand-900/40" />

      <div className="space-y-1">
        {LAYERS.map((cat) => {
          const meta = CATEGORY_META[cat];
          const checked = activeLayers.has(cat);
          return (
            <label
              key={cat}
              className="flex cursor-pointer items-center justify-between rounded-xl px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-brand-900/30 transition-colors"
            >
              <span className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span className="text-sm">{meta.emoji}</span>
                <span>{meta.label}</span>
              </span>
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggleLayer(cat)}
                className="h-4 w-4 rounded cursor-pointer"
                style={{ accentColor: meta.color }}
              />
            </label>
          );
        })}
      </div>

      <p className="mt-3 text-[10.5px] leading-relaxed text-slate-400 dark:text-slate-500">
        Filter categories to customize your campus view or isolate specific zones.
      </p>
    </div>
  );
}
