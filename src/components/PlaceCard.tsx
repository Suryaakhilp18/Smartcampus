import { useState } from 'react';
import {
  Star,
  MapPin,
  Clock,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Info,
  X,
  Accessibility,
  Phone,
  Navigation2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { getIcon } from '../utils/icons';
import { CATEGORY_META, type CampusLocation } from '../data/campusData';
import { formatDistance } from '../utils/routing';

interface Props {
  location: CampusLocation;
  distance: number;
  saved: boolean;
  onToggleSave: () => void;
  onNavigate: () => void;
  onClose: () => void;
  onShowDetails: () => void;
}

export default function PlaceCard({
  location,
  distance,
  saved,
  onToggleSave,
  onNavigate,
  onClose,
  onShowDetails,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const Icon = getIcon(location.icon);

  // Compact Minimized Pill (allows viewing map and buildings without losing place selection)
  if (minimized) {
    return (
      <div className="glass-panel-strong animate-scale-in flex items-center justify-between gap-2.5 rounded-2xl p-2.5 px-3.5 shadow-2xl border border-brand-500/40 w-full max-w-sm bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
        <button
          onClick={() => setMinimized(false)}
          className="flex items-center gap-2.5 min-w-0 flex-1 text-left group cursor-pointer"
          title="Click to expand place details"
        >
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-md border border-white/20"
            style={{ backgroundColor: location.color === '#0B2D6B' ? '#F5821F' : location.color }}
          >
            <Icon size={18} color="white" />
          </span>
          <div className="min-w-0 flex-1">
            <h4 className="truncate text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors">
              {location.name}
            </h4>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {formatDistance(distance)} away <span className="text-slate-400 dark:text-slate-500 font-normal hidden sm:inline">· Tap to expand</span>
            </p>
          </div>
        </button>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onNavigate}
            className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-brand-500 to-amber-500 px-3 py-1.5 text-xs font-bold text-white shadow-md transition-transform active:scale-95 hover:brightness-110"
            title="Navigate to destination"
          >
            <Navigation2 size={13} />
            <span>Go</span>
          </button>
          <button
            onClick={() => setMinimized(false)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
            title="Expand Card"
          >
            <ChevronUp size={15} />
          </button>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:text-red-500"
            title="Close Card"
          >
            <X size={15} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel-strong animate-scale-in relative w-full max-w-sm overflow-hidden rounded-2xl shadow-card border-brand-100/80 dark:border-brand-800/50">
      {/* Top action controls: Minimize + Close */}
      <div className="absolute right-3 top-3 z-10 flex items-center gap-1.5">
        <button
          onClick={() => setMinimized(true)}
          className="icon-btn h-7 w-7 rounded-lg bg-white/90 dark:bg-campus-cardDark/90 text-slate-500 hover:text-slate-900 dark:hover:text-white shadow-sm border border-slate-200/50 dark:border-white/10"
          aria-label="Minimize card"
          title="Minimize to see map clearly"
        >
          <ChevronDown size={14} />
        </button>
        <button
          onClick={onClose}
          className="icon-btn h-7 w-7 rounded-lg bg-white/90 dark:bg-campus-cardDark/90 text-slate-500 hover:text-slate-900 dark:hover:text-white shadow-sm border border-slate-200/50 dark:border-white/10"
          aria-label="Close"
          title="Close card"
        >
          <X size={14} />
        </button>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-700 to-brand-900 p-4 text-white">
        <div className="flex items-start gap-3">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-md border border-white/20"
            style={{ backgroundColor: location.color === '#0B2D6B' ? '#F5821F' : location.color }}
          >
            <Icon size={22} color="white" />
          </span>
          <div className="min-w-0 pr-6">
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-amber-300">
              {CATEGORY_META[location.category].label}
            </span>
            <h3 className="truncate text-base font-extrabold tracking-tight text-white font-heading">
              {location.name}
            </h3>
            <p className="truncate text-xs font-medium text-brand-100/90 mt-0.5">
              {location.subCategory ?? CATEGORY_META[location.category].label}
            </p>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="space-y-3.5 p-4 bg-white dark:bg-campus-cardDark">
        {/* Description snippet with progressive disclosure */}
        <p className={`text-xs leading-relaxed text-slate-600 dark:text-slate-300 ${expanded ? '' : 'line-clamp-2'}`}>
          {location.description}
        </p>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-brand-950/40 p-2.5 rounded-xl border border-slate-100 dark:border-brand-900/40">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin size={13} className="text-accent-500 shrink-0" />
            <span className="truncate">{formatDistance(distance)} away</span>
          </div>

          <div className="flex items-center gap-1.5 truncate">
            <Clock size={13} className="text-brand-500 shrink-0" />
            <span className="truncate">
              {location.hours.allDay ? '24 Hours' : `${location.hours.open} - ${location.hours.close}`}
            </span>
          </div>

          {location.rating && (
            <div className="flex items-center gap-1.5">
              <Star size={13} className="fill-amber-400 text-amber-400 shrink-0" />
              <span>
                <strong className="text-slate-800 dark:text-white">{location.rating.toFixed(1)}</strong>
                <span className="text-[11px] text-slate-400 ml-1">({location.reviews})</span>
              </span>
            </div>
          )}

          {location.bhavan && (
            <div className="flex items-center gap-1.5 truncate text-[11px] text-brand-700 dark:text-brand-300 font-semibold">
              <span className="truncate">📍 {location.bhavan}</span>
            </div>
          )}
        </div>

        {/* Progressive Disclosure Toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-between w-full py-1 text-xs font-bold text-accent-600 dark:text-accent-400 hover:underline"
        >
          <span>{expanded ? 'Hide extra details' : 'Show full details & facilities'}</span>
          <span className="text-[11px]">{expanded ? '▲' : '▼'}</span>
        </button>

        {/* Expanded Facilities & Accessibility Section */}
        {expanded && (
          <div className="space-y-2.5 pt-1 animate-fade-in border-t border-slate-100 dark:border-brand-900/40">
            {location.phone && (
              <div className="flex items-center gap-2 text-xs text-brand-700 dark:text-brand-300 font-medium">
                <Phone size={13} className="shrink-0 text-accent-500" />
                <a href={`tel:${location.phone}`} className="hover:underline font-mono">
                  {location.phone}
                </a>
              </div>
            )}

            {/* Accessibility Badges */}
            {(location.accessibility.wheelchairEntrance || location.accessibility.ramps || location.accessibility.elevator) && (
              <div className="flex flex-wrap items-center gap-1.5">
                {location.accessibility.wheelchairEntrance && (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                    <Accessibility size={12} />
                    Wheelchair Accessible
                  </span>
                )}
                {location.accessibility.elevator && (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/40 px-2 py-0.5 text-[11px] font-semibold text-sky-700 dark:text-sky-300">
                    Elevator Available
                  </span>
                )}
                {location.accessibility.tactilePaths && (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/40 px-2 py-0.5 text-[11px] font-semibold text-purple-700 dark:text-purple-300">
                    Tactile Signage
                  </span>
                )}
              </div>
            )}

            {/* Full Facilities Chips */}
            <div>
              <p className="mb-1 text-[10.5px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                All Available Facilities ({location.facilities.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {location.facilities.map((f) => (
                  <span
                    key={f}
                    className="rounded-lg bg-slate-100 dark:bg-brand-900/40 border border-slate-200/60 dark:border-brand-800/50 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:text-slate-300"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Highlights summary when not expanded */}
        {!expanded && (
          <div className="flex flex-wrap gap-1.5">
            {location.facilities.slice(0, 2).map((f) => (
              <span
                key={f}
                className="rounded-lg bg-slate-100 dark:bg-brand-900/40 border border-slate-200/60 dark:border-brand-800/50 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:text-slate-300"
              >
                {f}
              </span>
            ))}
            {location.facilities.length > 2 && (
              <span className="text-[11px] text-slate-400 self-center">
                +{location.facilities.length - 2} more
              </span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-brand-900/40">
          <button
            onClick={onNavigate}
            className="btn-primary flex-1 py-2.5 text-xs font-bold uppercase tracking-wider group"
          >
            <Navigation2 size={14} className="fill-white" />
            <span>Navigate</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={onToggleSave}
            className={`icon-btn h-10 w-10 rounded-xl border ${
              saved
                ? 'border-accent-500/40 bg-accent-50 text-accent-600 dark:bg-accent-500/20 dark:text-accent-400'
                : 'border-slate-200 dark:border-brand-800/60 text-slate-500 dark:text-slate-400'
            }`}
            title={saved ? 'Saved in favorites' : 'Save location'}
          >
            {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
          </button>

          <button
            onClick={onShowDetails}
            className="icon-btn h-10 w-10 rounded-xl border border-slate-200 dark:border-brand-800/60 text-slate-500 dark:text-slate-400 hover:text-brand-700 dark:hover:text-brand-300"
            title="Detailed Information"
          >
            <Info size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
