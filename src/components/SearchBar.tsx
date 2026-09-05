import { Search, X, Sparkles, ArrowRight } from 'lucide-react';
import { getIcon } from '../utils/icons';
import { CATEGORY_META, type CampusLocation } from '../data/campusData';
import { formatDistance } from '../utils/routing';

interface Props {
  query: string;
  onQueryChange: (q: string) => void;
  results: { location: CampusLocation; distance: number }[];
  onSelectResult: (loc: CampusLocation) => void;
  onAskAi?: (query: string) => void;
}

export default function SearchBar({ query, onQueryChange, results, onSelectResult, onAskAi }: Props) {
  const showPanel = query.trim().length > 0;

  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div className="glass-panel flex items-center gap-2 rounded-2xl px-4 py-2.5">
        <Search size={17} className="shrink-0 text-slate-400" />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search buildings, classrooms, labs, food..."
          className="w-full bg-transparent text-sm font-medium text-slate-700 placeholder:text-slate-400 outline-none dark:text-slate-100 dark:placeholder:text-slate-500"
        />
        {query && (
          <button
            onClick={() => onQueryChange('')}
            className="icon-btn h-6 w-6 shrink-0 text-slate-400"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {showPanel && (
        <div className="glass-panel-strong animate-scale-in absolute left-0 right-0 top-[calc(100%+8px)] max-h-[60vh] overflow-y-auto rounded-2xl p-2">
          {onAskAi && (
            <button
              onClick={() => onAskAi(query)}
              className="flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 mb-1.5 bg-gradient-to-r from-accent-500/10 via-amber-500/15 to-accent-500/10 hover:from-accent-500/20 hover:to-amber-500/25 border border-accent-500/30 text-accent-700 dark:text-accent-300 text-xs font-bold transition-all text-left"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Sparkles size={15} className="text-accent-500 shrink-0 animate-pulse" />
                <span className="truncate">Ask Campus AI about "{query}"</span>
              </div>
              <ArrowRight size={14} className="text-accent-500 shrink-0" />
            </button>
          )}
          {results.length === 0 ? (
            <div className="p-4 text-center text-sm text-slate-400">
              No matches. Try “nearest cafeteria” or “labs near me”.
            </div>
          ) : (
            results.map(({ location, distance }) => {
              const Icon = getIcon(location.icon);
              return (
                <button
                  key={location.id}
                  onClick={() => onSelectResult(location)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-slate-100 dark:hover:bg-white/5"
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: location.color }}
                  >
                    <Icon size={16} color="white" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-slate-800 dark:text-white">
                      {location.name}
                    </span>
                    <span className="block truncate text-xs text-slate-400">
                      {CATEGORY_META[location.category].label} · {formatDistance(distance)} away
                    </span>
                  </span>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
