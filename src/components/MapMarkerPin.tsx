import { getIcon } from '../utils/icons';
import type { CampusLocation } from '../data/campusData';

interface Props {
  location: CampusLocation;
  selected?: boolean;
  onClick?: () => void;
  pulse?: boolean;
  style?: React.CSSProperties;
  size?: 'sm' | 'md' | 'lg';
}

const SIZES = {
  sm: { box: 30, icon: 14 },
  md: { box: 38, icon: 17 },
  lg: { box: 46, icon: 20 },
};

export default function MapMarkerPin({
  location,
  selected,
  onClick,
  pulse,
  style,
  size = 'md',
}: Props) {
  const Icon = getIcon(location.icon);
  const dims = SIZES[size];

  return (
    <button
      type="button"
      onClick={onClick}
      style={style}
      className={`group relative flex items-center justify-center transition-transform duration-200 ease-out ${
        selected ? 'z-30 scale-110' : 'z-10 hover:scale-110 hover:z-20'
      }`}
      aria-label={location.name}
    >
      {pulse && (
        <span
          className="absolute rounded-full animate-pulse-ring"
          style={{
            width: dims.box,
            height: dims.box,
            backgroundColor: location.color,
          }}
        />
      )}
      <span
        className={`relative flex items-center justify-center rounded-full border-[2.5px] border-white dark:border-slate-900 shadow-lg transition-all ${
          selected ? 'ring-4 ring-white/70 dark:ring-white/20' : ''
        }`}
        style={{
          width: dims.box,
          height: dims.box,
          backgroundColor: location.color,
        }}
      >
        <Icon size={dims.icon} color="white" strokeWidth={2.4} />
      </span>
      <span
        className="pointer-events-none absolute -bottom-1 left-1/2 -translate-x-1/2 translate-y-full whitespace-nowrap rounded-md bg-slate-900/90 px-2 py-0.5 text-[11px] font-medium text-white opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100 dark:bg-white/90 dark:text-slate-900"
      >
        {location.shortName ?? location.name}
      </span>
    </button>
  );
}
