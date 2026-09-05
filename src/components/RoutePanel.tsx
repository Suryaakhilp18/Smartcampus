import { useState } from 'react';
import { Footprints, Bike, Car, X, Clock, Route as RouteIcon, TriangleAlert, Accessibility, ChevronDown, ChevronUp, Navigation } from 'lucide-react';
import type { CampusLocation } from '../data/campusData';
import { buildRouteOptions, formatDistance, type RouteProfile, type TravelMode, type LatLng } from '../utils/routing';

interface Props {
  destination: CampusLocation;
  origin: LatLng;
  onClose: () => void;
  onSelectRoute: (profile: RouteProfile, mode: TravelMode) => void;
  activeProfile: RouteProfile | null;
  accessibilityMode: boolean;
  minimized?: boolean;
  onToggleMinimize?: () => void;
}

const MODES: { key: TravelMode; label: string; icon: typeof Footprints }[] = [
  { key: 'WALKING', label: 'Walk', icon: Footprints },
  { key: 'BICYCLING', label: 'Bike', icon: Bike },
  { key: 'DRIVING', label: 'Drive', icon: Car },
];

const PROFILE_STYLE: Record<RouteProfile, string> = {
  fastest: 'from-emerald-500 to-emerald-600',
  accessible: 'from-sky-500 to-sky-600',
  scenic: 'from-violet-500 to-violet-600',
};

export default function RoutePanel({
  destination,
  origin,
  onClose,
  onSelectRoute,
  activeProfile,
  accessibilityMode,
  minimized: controlledMinimized,
  onToggleMinimize: controlledToggleMinimize,
}: Props) {
  const [internalMinimized, setInternalMinimized] = useState(false);
  const [mode, setMode] = useState<TravelMode>('WALKING');
  
  const isMinimized = controlledMinimized !== undefined ? controlledMinimized : internalMinimized;
  const toggleMinimize = controlledToggleMinimize || (() => setInternalMinimized((v) => !v));

  const routes = buildRouteOptions(origin, destination, mode);
  const currentRoute = routes.find((r) => r.profile === activeProfile) || routes[0];
  const CurrentModeIcon = MODES.find((m) => m.key === mode)?.icon || Footprints;

  // Minimized Compact HUD View (Takes up minimal space, revealing full map & route)
  if (isMinimized) {
    return (
      <div className="glass-panel-strong animate-scale-in flex items-center justify-between gap-2.5 rounded-2xl p-2.5 px-3.5 shadow-2xl border border-brand-500/40 w-full max-w-sm bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
        <button
          onClick={toggleMinimize}
          className="flex items-center gap-2.5 min-w-0 flex-1 text-left group cursor-pointer"
          title="Click to view detailed route options & turn directions"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-amber-500 text-white shadow-md group-hover:scale-105 transition-transform">
            <CurrentModeIcon size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="truncate text-xs font-bold text-slate-800 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                {destination.name}
              </p>
            </div>
            <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
              <span>{currentRoute.durationMinutes} min</span>
              <span className="text-slate-300 dark:text-slate-600">·</span>
              <span>{formatDistance(currentRoute.distanceMeters)}</span>
              <span className="text-slate-400 dark:text-slate-500 font-normal ml-0.5 hidden sm:inline">(Tap to expand)</span>
            </p>
          </div>
        </button>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={toggleMinimize}
            className="flex items-center gap-1 rounded-xl bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/40 dark:hover:bg-brand-900/60 text-brand-600 dark:text-brand-400 px-2.5 py-1.5 text-xs font-bold transition-all shadow-sm border border-brand-200/50 dark:border-brand-700/30 active:scale-95"
            title="Expand route options"
          >
            <ChevronUp size={14} />
            <span className="hidden xs:inline">Options</span>
          </button>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            title="End navigation"
          >
            <X size={15} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel-strong animate-scale-in w-full max-w-sm rounded-2xl p-4 shadow-2xl border border-slate-200/80 dark:border-white/10">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
            Navigate to
          </p>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">{destination.name}</h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={toggleMinimize}
            className="flex items-center gap-1 rounded-lg bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-600 dark:text-slate-300 px-2 py-1 text-xs font-semibold transition-colors"
            title="Minimize to see full route on map"
          >
            <ChevronDown size={14} />
            <span>Minimize</span>
          </button>
          <button
            onClick={onClose}
            className="icon-btn h-7 w-7 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
            title="End navigation"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Mode selector */}
      <div className="mb-3 flex gap-1.5 rounded-xl bg-slate-100 p-1 dark:bg-white/5">
        {MODES.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setMode(key)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-bold transition-all ${
              mode === key
                ? 'bg-white text-brand-600 shadow dark:bg-slate-800 dark:text-brand-400'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {routes.map((r) => {
          const isActive = activeProfile === r.profile;
          const recommended = accessibilityMode ? r.profile === 'accessible' : r.profile === 'fastest';
          return (
            <button
              key={r.profile}
              onClick={() => onSelectRoute(r.profile, mode)}
              className={`w-full overflow-hidden rounded-xl border p-3 text-left transition-all active:scale-[0.98] ${
                isActive
                  ? 'border-transparent shadow-md'
                  : 'border-slate-200/70 hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5'
              }`}
            >
              <div
                className={
                  isActive
                    ? `-m-3 mb-2 rounded-t-xl bg-gradient-to-r p-3 pb-2 text-white ${PROFILE_STYLE[r.profile]}`
                    : ''
                }
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-extrabold tracking-wide">
                    <RouteIcon size={13} />
                    {r.label}
                    {recommended && (
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                          isActive ? 'bg-white/25' : 'bg-brand-100 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400'
                        }`}
                      >
                        Suggested
                      </span>
                    )}
                  </span>
                  {r.accessible && (
                    <Accessibility size={13} className={isActive ? 'text-white' : 'text-sky-500'} />
                  )}
                </div>
                <div
                  className={`mt-1 flex items-center gap-3 text-xs font-semibold ${
                    isActive ? 'text-white/90' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {r.durationMinutes} min
                  </span>
                  <span>{formatDistance(r.distanceMeters)}</span>
                  <span>
                    {r.stops} stop{r.stops === 1 ? '' : 's'}
                  </span>
                </div>
              </div>
              {r.warning && (
                <p className="flex items-start gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                  <TriangleAlert size={12} className="mt-0.5 shrink-0" />
                  {r.warning}
                </p>
              )}
            </button>
          );
        })}
      </div>

      {/* Direct CTA to minimize and reveal the full unobstructed route on the map */}
      <button
        onClick={toggleMinimize}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-amber-500 hover:from-brand-700 hover:to-amber-600 py-2.5 text-xs font-bold text-white shadow-md transition-all active:scale-[0.98] cursor-pointer"
      >
        <Navigation size={14} />
        <span>View Route on Map (Minimize)</span>
      </button>
    </div>
  );
}
