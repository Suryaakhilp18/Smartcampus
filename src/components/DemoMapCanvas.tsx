// ============================================================================
// DemoMapCanvas — a beautiful, fully custom fallback "map" rendered with
// plain CSS/SVG, used whenever no Google Maps API key is configured (or the
// key fails to load). It mirrors the exact same interactions as the real Google
// Map (markers, buildings, routes, heatmap, pulse).
// ============================================================================
import { useMemo, useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import type { CampusLocation } from '../data/campusData';
import { toPercentPosition } from '../utils/geo';
import MapMarkerPin from './MapMarkerPin';
import type { RouteResult } from '../utils/routing';

interface Props {
  locations: CampusLocation[];
  selectedId: string | null;
  onSelect: (loc: CampusLocation) => void;
  theme: 'light' | 'dark';
  showHeatmap: boolean;
  showBuildings: boolean;
  userLocation: { lat: number; lng: number };
  route: RouteResult | null;
  emergencyIds?: string[];
}

const ACTIVITY_COLOR: Record<string, string> = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#10b981',
};

const ACTIVITY_RADIUS: Record<string, number> = {
  high: 10,
  medium: 7,
  low: 5,
};

export default function DemoMapCanvas({
  locations,
  selectedId,
  onSelect,
  theme,
  showHeatmap,
  showBuildings,
  userLocation,
  route,
  emergencyIds = [],
}: Props) {
  const [zoomLevel, setZoomLevel] = useState<1 | 2 | 3>(1);

  const visibleLocations = useMemo(() => {
    // If 25 or fewer locations are filtered, always show all of them.
    if (locations.length <= 25) return locations;
    return locations.filter((loc) => {
      if (selectedId === loc.id || emergencyIds.includes(loc.id)) return true;
      if (zoomLevel === 1) return (loc.tier ?? 2) <= 2;
      return true;
    });
  }, [locations, selectedId, emergencyIds, zoomLevel]);

  const buildings = useMemo(
    () => locations.filter((l) => l.isBuilding && l.footprint),
    [locations]
  );

  const userPos = toPercentPosition(userLocation.lat, userLocation.lng);

  const routePoints = route
    ? route.path.map((p) => toPercentPosition(p.lat, p.lng))
    : null;
  const routePathStr = routePoints
    ? routePoints.map((p) => `${p.xPct},${p.yPct}`).join(' ')
    : '';

  return (
    <div
      className={`relative h-full w-full overflow-hidden select-none ${
        theme === 'dark' ? 'bg-[#07101E]' : 'bg-[#F5F5F5]'
      }`}
    >
      {/* Decorative campus grid and pathways */}
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        <defs>
          <pattern id="campus-grid" width="8%" height="8%" patternUnits="userSpaceOnUse">
            <path
              d="M 0 0 L 0 100 M 0 0 L 100 0"
              fill="none"
              stroke={theme === 'dark' ? '#0C1B33' : '#E2E8F0'}
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#campus-grid)" />

        {/* Central Quad Lawn */}
        <rect
          x="32%"
          y="35%"
          width="36%"
          height="28%"
          rx="16"
          fill={theme === 'dark' ? '#0A241F' : '#E2F0E8'}
          stroke={theme === 'dark' ? '#133E33' : '#C4E2D0'}
          strokeWidth="1.5"
        />

        {/* Main Campus Avenues (ADB Road Corridor & Internal Links) */}
        {[20, 50, 78].map((y) => (
          <line
            key={`h-${y}`}
            x1="0"
            y1={`${y}%`}
            x2="100%"
            y2={`${y}%`}
            stroke={theme === 'dark' ? '#0E2344' : '#FFFFFF'}
            strokeWidth="12"
            strokeLinecap="round"
          />
        ))}
        {[24, 52, 78].map((x) => (
          <line
            key={`v-${x}`}
            x1={`${x}%`}
            y1="0"
            x2={`${x}%`}
            y2="100%"
            stroke={theme === 'dark' ? '#0E2344' : '#FFFFFF'}
            strokeWidth="12"
            strokeLinecap="round"
          />
        ))}

        {/* Diagonal Skywalk Corridor */}
        <line
          x1="24%"
          y1="50%"
          x2="52%"
          y2="20%"
          stroke={theme === 'dark' ? '#172E54' : '#F1F5F9'}
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* Sports Stadium Ground Oval */}
        <ellipse
          cx="82%"
          cy="75%"
          rx="12%"
          ry="10%"
          fill={theme === 'dark' ? '#132B20' : '#D1EAD9'}
          stroke={theme === 'dark' ? '#1C4030' : '#B8DEC4'}
          strokeWidth="2"
        />

        {/* Route path with signature Aditya Orange */}
        {routePathStr && (
          <>
            <polyline
              points={routePathStr}
              fill="none"
              stroke="#0B2D6B"
              strokeWidth="7"
              strokeLinecap="round"
              strokeOpacity="0.4"
            />
            <polyline
              points={routePathStr}
              fill="none"
              stroke="#F5821F"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray="8 6"
              className="animate-pulse"
            />
          </>
        )}

        {/* Heatmap circles */}
        {showHeatmap &&
          locations
            .filter((l) => l.activityLevel)
            .map((l) => {
              const p = toPercentPosition(l.lat, l.lng);
              const level = l.activityLevel!;
              return (
                <circle
                  key={`heat-${l.id}`}
                  cx={`${p.xPct}%`}
                  cy={`${p.yPct}%`}
                  r={`${ACTIVITY_RADIUS[level]}%`}
                  fill={ACTIVITY_COLOR[level]}
                  opacity={0.22}
                />
              );
            })}

        {/* Emergency highlight rings */}
        {emergencyIds.map((id) => {
          const loc = locations.find((l) => l.id === id);
          if (!loc) return null;
          const p = toPercentPosition(loc.lat, loc.lng);
          return (
            <circle
              key={`em-${id}`}
              cx={`${p.xPct}%`}
              cy={`${p.yPct}%`}
              r="5%"
              fill="#EF4444"
              fillOpacity="0.15"
              stroke="#EF4444"
              strokeWidth="2.5"
              strokeDasharray="4 3"
              className="animate-pulse"
            />
          );
        })}
      </svg>

      {/* Campus Background Watermark */}
      <div className="pointer-events-none absolute bottom-4 left-6 select-none opacity-20 dark:opacity-25">
        <p className="text-xl sm:text-2xl font-black uppercase tracking-wider text-brand-900 dark:text-brand-300 font-heading">
          Aditya University
        </p>
        <p className="text-xs font-semibold text-brand-700 dark:text-brand-400">
          Surampalem, ADB Road · SmartCampus View
        </p>
      </div>

      {/* Building footprints */}
      {showBuildings &&
        buildings.map((b) => {
          const pts = b.footprint!.map((p) => toPercentPosition(p.lat, p.lng));
          const minX = Math.min(...pts.map((p) => p.xPct));
          const maxX = Math.max(...pts.map((p) => p.xPct));
          const minY = Math.min(...pts.map((p) => p.yPct));
          const maxY = Math.max(...pts.map((p) => p.yPct));
          return (
            <div
              key={b.id}
              className="absolute rounded-xl border transition-all duration-300"
              style={{
                left: `${minX}%`,
                top: `${minY}%`,
                width: `${maxX - minX}%`,
                height: `${maxY - minY}%`,
                backgroundColor: `${b.color === '#0B2D6B' ? '#0B2D6B' : b.color}15`,
                borderColor: `${b.color === '#0B2D6B' ? '#F5821F' : b.color}45`,
              }}
            >
              <div className="absolute inset-x-1 bottom-1 text-[9px] font-bold text-brand-800/80 dark:text-brand-200/80 truncate px-1">
                {b.shortName ?? b.name}
              </div>
            </div>
          );
        })}

      {/* User location with radar ping */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 z-30"
        style={{ left: `${userPos.xPct}%`, top: `${userPos.yPct}%` }}
      >
        <div className="relative flex h-5 w-5 items-center justify-center">
          <span className="absolute h-6 w-6 animate-ping rounded-full bg-accent-500/40" />
          <span className="relative h-3.5 w-3.5 rounded-full border-2 border-white bg-accent-500 shadow-md" />
        </div>
      </div>

      {/* Markers (zoom-density tier filtered) */}
      {visibleLocations.map((loc) => {
        const p = toPercentPosition(loc.lat, loc.lng);
        return (
          <div
            key={loc.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
            style={{ left: `${p.xPct}%`, top: `${p.yPct}%` }}
          >
            <MapMarkerPin
              location={loc}
              selected={selectedId === loc.id}
              pulse={emergencyIds.includes(loc.id)}
              onClick={() => onSelect(loc)}
            />
          </div>
        );
      })}

      {/* Floating Demo Mode Zoom & Density Controls */}
      <div className="absolute bottom-6 right-6 z-30 flex flex-col items-end gap-2">
        <div className="glass-panel flex items-center rounded-xl p-1 shadow-card border border-white/40 dark:border-white/10 text-[11px] font-semibold text-slate-700 dark:text-slate-200">
          <button
            onClick={() => setZoomLevel((z) => (Math.min(3, z + 1) as 1 | 2 | 3))}
            disabled={zoomLevel === 3}
            className="p-1.5 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700/50 disabled:opacity-30 disabled:hover:bg-transparent"
            title="Zoom In (Show more details)"
            aria-label="Zoom In"
          >
            <Plus size={14} />
          </button>
          <span className="px-2 font-mono text-[10px] text-accent-600 dark:text-accent-400 font-bold">
            {zoomLevel === 1 ? '1x Landmark' : zoomLevel === 2 ? '2x Standard' : '3x Detailed'}
          </span>
          <button
            onClick={() => setZoomLevel((z) => (Math.max(1, z - 1) as 1 | 2 | 3))}
            disabled={zoomLevel === 1}
            className="p-1.5 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700/50 disabled:opacity-30 disabled:hover:bg-transparent"
            title="Zoom Out (Declutter)"
            aria-label="Zoom Out"
          >
            <Minus size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
