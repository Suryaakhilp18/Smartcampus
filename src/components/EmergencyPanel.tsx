import { ShieldAlert, X, HeartPulse, Radio, DoorOpen, Phone, Navigation2, Ambulance } from 'lucide-react';
import { campusLocations, type CampusLocation } from '../data/campusData';
import { distanceMeters, formatDistance, type LatLng } from '../utils/routing';

interface Props {
  userLocation: LatLng;
  onClose: () => void;
  onNavigateTo: (loc: CampusLocation) => void;
}

const EMERGENCY_META: Record<
  string,
  { label: string; icon: any }
> = {
  medical: { label: '24/7 Medical Centre & Ambulance', icon: HeartPulse },
  security: { label: 'Campus Security HQ', icon: Radio },
  exit: { label: 'Primary Evacuation / Exit', icon: DoorOpen },
  'help-desk': { label: 'Admin Help Desk', icon: Phone },
};

export default function EmergencyPanel({ userLocation, onClose, onNavigateTo }: Props) {
  const points: { type: string; l: CampusLocation; d: number }[] = [];
  for (const type of ['medical', 'security', 'exit', 'help-desk'] as const) {
    const loc = campusLocations
      .filter((l) => l.emergencyType === type)
      .map((l) => ({ l, d: distanceMeters(userLocation, l) }))
      .sort((a, b) => a.d - b.d)[0];
    if (loc) points.push({ type, ...loc });
  }

  const medical = points.find((p) => p.type === 'medical');

  return (
    <div className="animate-scale-in w-full max-w-sm overflow-hidden rounded-2xl border-2 border-red-500/50 bg-white shadow-2xl backdrop-blur-xl dark:bg-campus-cardDark">
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-red-600 to-rose-700 px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          <ShieldAlert size={20} className="animate-pulse" />
          <div>
            <h3 className="text-sm font-extrabold tracking-wide uppercase font-heading">
              Campus Emergency Mode
            </h3>
            <p className="text-[10px] text-red-100 font-medium">Aditya 24/7 Quick Response Grid</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="icon-btn h-7 w-7 text-white/90 hover:bg-white/20"
          aria-label="Close"
        >
          <X size={15} />
        </button>
      </div>

      {/* Hotline Notice */}
      <div className="bg-red-50 dark:bg-red-950/40 px-4 py-2 border-b border-red-100 dark:border-red-900/40 flex items-center justify-between text-xs font-semibold text-red-800 dark:text-red-300">
        <span className="flex items-center gap-1.5">
          <Ambulance size={14} className="text-red-600" />
          Campus Ambulance: +91-9989776661
        </span>
        <span className="text-[10px] uppercase font-bold bg-red-200 dark:bg-red-900/60 px-1.5 py-0.5 rounded">
          Ext 108
        </span>
      </div>

      <div className="space-y-2 p-4">
        <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Nearest Emergency Points
        </p>

        {points.map(({ type, l, d }) => {
          const meta = EMERGENCY_META[type];
          const Icon = meta.icon;
          return (
            <button
              key={type}
              onClick={() => onNavigateTo(l)}
              className="flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-colors border border-slate-100 dark:border-brand-900/30 hover:border-red-200 hover:bg-red-50/50 dark:hover:bg-red-950/30"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 shadow-sm">
                <Icon size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[10.5px] font-bold uppercase tracking-wide text-red-500">
                  {meta.label}
                </span>
                <span className="block truncate text-xs font-bold text-slate-800 dark:text-slate-100">
                  {l.name}
                </span>
                <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  {formatDistance(d)} away · {l.hours.allDay ? '24/7' : l.hours.open}
                </span>
              </span>
            </button>
          );
        })}

        {medical && (
          <button
            onClick={() => onNavigateTo(medical.l)}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 px-3 py-3 text-xs font-extrabold uppercase tracking-wider text-white shadow-md shadow-red-600/30 transition-all active:scale-95"
          >
            <Navigation2 size={15} className="fill-white" />
            Navigate to 24/7 Medical Centre
          </button>
        )}
      </div>
    </div>
  );
}
