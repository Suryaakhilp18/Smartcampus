// ============================================================================
// CampusDirectoryModal — Searchable Directory & List View
// ----------------------------------------------------------------------------
// Provides a clean, grouped, alphabetical directory of all campus locations
// as an intuitive alternative to hunting on the map.
// ============================================================================
import { useState, useMemo } from 'react';
import { Search, X, MapPin, ChevronRight, Compass } from 'lucide-react';
import {
  campusLocations,
  CATEGORY_META,
  type CampusCategory,
  type CampusLocation,
} from '../data/campusData';
import { distanceMeters, formatDistance, type LatLng } from '../utils/routing';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (loc: CampusLocation) => void;
  userLocation: LatLng;
}

export default function CampusDirectoryModal({
  isOpen,
  onClose,
  onSelectLocation,
  userLocation,
}: Props) {
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CampusCategory | 'all'>('all');

  const categories = useMemo(() => {
    return Object.keys(CATEGORY_META) as CampusCategory[];
  }, []);

  const filteredLocations = useMemo(() => {
    const q = filterQuery.trim().toLowerCase();
    return campusLocations.filter((loc) => {
      const matchCat = selectedCategory === 'all' || loc.category === selectedCategory;
      if (!matchCat) return false;
      if (!q) return true;
      return (
        loc.name.toLowerCase().includes(q) ||
        (loc.shortName && loc.shortName.toLowerCase().includes(q)) ||
        (loc.bhavan && loc.bhavan.toLowerCase().includes(q)) ||
        (loc.subCategory && loc.subCategory.toLowerCase().includes(q)) ||
        loc.facilities.some((f) => f.toLowerCase().includes(q))
      );
    });
  }, [filterQuery, selectedCategory]);

  const groupedLocations = useMemo(() => {
    const map = new Map<CampusCategory, CampusLocation[]>();
    filteredLocations.forEach((loc) => {
      const list = map.get(loc.category) || [];
      list.push(loc);
      map.set(loc.category, list);
    });
    // Sort locations alphabetically within each category group
    map.forEach((list) => {
      list.sort((a, b) => a.name.localeCompare(b.name));
    });
    return map;
  }, [filteredLocations]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-6 animate-fade-in">
      <div className="glass-panel-strong flex flex-col w-full max-w-3xl max-h-[88vh] rounded-3xl shadow-2xl border border-brand-100/60 dark:border-brand-800/50 overflow-hidden bg-white/95 dark:bg-campus-dark/95">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-brand-900/50 bg-gradient-to-r from-brand-900 to-brand-800 text-white">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-500/20 text-accent-400 border border-accent-500/30">
              <Compass size={18} />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold tracking-tight font-heading">
                Campus Directory & Facility Index
              </h2>
              <p className="text-xs text-brand-100/80">
                {campusLocations.length} verified locations at Aditya University
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="icon-btn h-8 w-8 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
            aria-label="Close directory"
          >
            <X size={16} />
          </button>
        </div>

        {/* Search & Category Pills Filter Bar */}
        <div className="p-4 space-y-3 bg-slate-50/80 dark:bg-brand-950/40 border-b border-slate-200/50 dark:border-brand-900/40">
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search by building name, department, hostel, or lab..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-brand-800/60 bg-white dark:bg-campus-cardDark text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-500/50 shadow-sm"
              autoFocus
            />
            {filterQuery && (
              <button
                onClick={() => setFilterQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Category Chips Horizontal Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-brand-700 text-white shadow-sm dark:bg-accent-500 dark:text-slate-950'
                  : 'bg-white dark:bg-brand-900/40 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-brand-800/50 border border-slate-200/60 dark:border-brand-800/40'
              }`}
            >
              All ({campusLocations.length})
            </button>
            {categories.map((cat) => {
              const meta = CATEGORY_META[cat];
              const count = campusLocations.filter((l) => l.category === cat).length;
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    active
                      ? 'bg-brand-700 text-white shadow-sm dark:bg-accent-500 dark:text-slate-950'
                      : 'bg-white dark:bg-brand-900/40 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-brand-800/50 border border-slate-200/60 dark:border-brand-800/40'
                  }`}
                >
                  <span>{meta.emoji}</span>
                  <span>{meta.label}</span>
                  <span className="text-[10px] opacity-75 font-mono">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Results List Grouped by Category */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {groupedLocations.size === 0 ? (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400">
              <Compass size={32} className="mx-auto mb-2 opacity-40 text-accent-500" />
              <p className="text-sm font-semibold">No campus locations match "{filterQuery}"</p>
              <p className="text-xs text-slate-400 mt-1">
                Try searching for "Hostel", "Bhavan", "Canteen", "Temple", or "ATM"
              </p>
            </div>
          ) : (
            Array.from(groupedLocations.entries()).map(([cat, locs]) => {
              const meta = CATEGORY_META[cat];
              return (
                <div key={cat} className="space-y-2">
                  <div className="flex items-center gap-2 px-1">
                    <span className="text-sm">{meta.emoji}</span>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-heading">
                      {meta.label}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-mono">({locs.length})</span>
                    <div className="flex-1 h-px bg-slate-200 dark:bg-brand-900/40 ml-2" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {locs.map((loc) => {
                      const dist = distanceMeters(userLocation, loc);
                      return (
                        <div
                          key={loc.id}
                          onClick={() => {
                            onSelectLocation(loc);
                            onClose();
                          }}
                          className="group flex items-start justify-between gap-3 p-3 rounded-2xl border border-slate-200/70 dark:border-brand-900/40 bg-white hover:bg-brand-50/50 dark:bg-campus-cardDark hover:dark:bg-brand-900/30 transition-all cursor-pointer shadow-xs hover:shadow-md hover:border-accent-500/40"
                        >
                          <div className="flex items-start gap-3 min-w-0">
                            <span className="text-xl shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                              {loc.icon}
                            </span>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors truncate">
                                  {loc.name}
                                </h4>
                                {loc.tier === 1 && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-300 uppercase tracking-tight">
                                    Landmark
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                {loc.subCategory || meta.label}
                              </p>
                              <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400">
                                <span className="flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-300">
                                  <MapPin size={11} className="text-accent-500 shrink-0" />
                                  {formatDistance(dist)} away
                                </span>
                                <span>•</span>
                                <span>{loc.hours.allDay ? '24 Hours' : `${loc.hours.open} - ${loc.hours.close}`}</span>
                              </div>
                            </div>
                          </div>

                          <span className="p-1.5 rounded-xl text-slate-400 group-hover:text-accent-500 group-hover:bg-accent-50 dark:group-hover:bg-accent-500/10 transition-all shrink-0">
                            <ChevronRight size={15} />
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 border-t border-slate-100 dark:border-brand-900/50 bg-slate-50/50 dark:bg-campus-cardDark/50 flex items-center justify-between text-xs text-slate-500">
          <span>Click any location to view on campus map with live directions.</span>
          <button
            onClick={onClose}
            className="text-xs font-bold text-accent-600 dark:text-accent-400 hover:underline"
          >
            Back to Map
          </button>
        </div>
      </div>
    </div>
  );
}
