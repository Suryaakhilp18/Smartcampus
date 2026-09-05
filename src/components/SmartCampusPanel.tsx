import { Sparkles, X, GraduationCap, UtensilsCrossed, BookOpen, ParkingCircle, ShieldAlert, ArrowRight } from 'lucide-react';
import { campusLocations, type CampusLocation } from '../data/campusData';
import { distanceMeters, formatDistance, type LatLng } from '../utils/routing';

interface Props {
  userLocation: LatLng;
  onClose: () => void;
  onSelectLocation: (loc: CampusLocation) => void;
  pulsePeriod: 'morning' | 'afternoon' | 'evening';
}

function nearest(category: CampusLocation['category'], userLocation: LatLng) {
  const candidates = campusLocations
    .filter((l) => l.category === category)
    .map((l) => ({ l, d: distanceMeters(userLocation, l) }))
    .sort((a, b) => a.d - b.d);
  return candidates[0];
}

const NEXT_CLASS_BY_PERIOD: Record<
  string,
  { subject: string; time: string; room: string; locId: string }
> = {
  morning: {
    subject: 'AI & Machine Learning (CSE)',
    time: '09:40 AM',
    room: 'Bill Gates Bhavan · Seminar Hall 2',
    locId: 'bill-gates-bhavan',
  },
  afternoon: {
    subject: 'CAD/CAM Structural Simulation',
    time: '02:15 PM',
    room: 'K.L. Rao Bhavan · Mechanical CAD Lab',
    locId: 'kl-rao-bhavan',
  },
  evening: {
    subject: 'Competitive Coding Practice',
    time: '04:30 PM',
    room: 'Technical Hub · Hackathon Arena',
    locId: 'technical-hub',
  },
};

export default function SmartCampusPanel({
  userLocation,
  onClose,
  onSelectLocation,
  pulsePeriod,
}: Props) {
  const food = nearest('food', userLocation);
  const parking = nearest('parking', userLocation);
  const library = campusLocations.find(
    (l) => l.id === 'central-library' || l.id === 'knowledge-resource-centre'
  );
  const emergency = nearest('emergency', userLocation) ?? nearest('medical', userLocation);
  const nextClass = NEXT_CLASS_BY_PERIOD[pulsePeriod];
  const classLocation = campusLocations.find((l) => l.id === nextClass.locId);

  const items = [
    {
      icon: GraduationCap,
      color: '#0B2D6B',
      title: 'Your next lecture',
      subtitle: `${nextClass.subject} · ${nextClass.time}`,
      detail: nextClass.room,
      loc: classLocation,
    },
    {
      icon: UtensilsCrossed,
      color: '#F5821F',
      title: 'Nearest dining',
      subtitle: food?.l.name ?? 'Bill Gates Food Court',
      detail: food ? `${formatDistance(food.d)} away · Open now` : 'Open now',
      loc: food?.l,
    },
    {
      icon: BookOpen,
      color: '#0B2D6B',
      title: 'Quiet study zone',
      subtitle: library?.name ?? 'Knowledge Resource Centre',
      detail: 'Digital library · Air-conditioned silent desks',
      loc: library,
    },
    {
      icon: ParkingCircle,
      color: '#0EA5E9',
      title: 'Bus depot & Parking',
      subtitle: parking?.l.name ?? 'Bus Terminal Hub',
      detail: parking ? `${formatDistance(parking.d)} away · 250+ bus fleet active` : 'Active',
      loc: parking?.l,
    },
    {
      icon: ShieldAlert,
      color: '#EF4444',
      title: 'Nearest medical / emergency',
      subtitle: emergency?.l.name ?? 'Aditya 24/7 Medical Centre',
      detail: emergency ? `${formatDistance(emergency.d)} away · 24/7 Doctor & Ambulance` : '24/7 On Duty',
      loc: emergency?.l,
    },
  ];

  return (
    <div className="glass-panel-strong animate-scale-in w-full max-w-sm rounded-2xl p-4 shadow-card border-brand-100/70 dark:border-brand-800/40">
      <div className="mb-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand-700 to-accent-500 text-white shadow-md">
            <Sparkles size={16} />
          </span>
          <div>
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-white font-heading">
              Smart Campus Pulse
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-wider text-accent-600 dark:text-accent-400">
              {pulsePeriod} Schedule
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="icon-btn h-7 w-7 text-slate-400 hover:text-slate-700 dark:hover:text-white"
        >
          <X size={14} />
        </button>
      </div>
      <p className="mb-3 text-xs font-medium text-slate-500 dark:text-slate-400">
        Live recommendations tuned to your location & schedule:
      </p>

      <div className="space-y-1.5">
        {items.map((item) => (
          <button
            key={item.title}
            onClick={() => item.loc && onSelectLocation(item.loc)}
            disabled={!item.loc}
            className="group flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-all hover:bg-slate-100 dark:hover:bg-brand-900/30 border border-transparent hover:border-slate-200/60 dark:hover:border-brand-800/40"
          >
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-sm text-white transition-transform group-hover:scale-105"
              style={{ backgroundColor: item.color }}
            >
              <item.icon size={17} />
            </span>
            <div className="min-w-0 flex-1">
              <span className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {item.title}
              </span>
              <span className="block truncate text-xs font-bold text-slate-800 dark:text-white">
                {item.subtitle}
              </span>
              <span className="block truncate text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {item.detail}
              </span>
            </div>
            <ArrowRight
              size={14}
              className="shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-accent-500"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
