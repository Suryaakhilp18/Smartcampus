import {
  Presentation,
  X,
  Search,
  MapPinned,
  Navigation2,
  Accessibility,
  Flame,
  ShieldAlert,
  Sunrise,
  School,
} from 'lucide-react';

interface Props {
  onExit: () => void;
}

const STEPS = [
  { icon: School, label: '5 Real Schools', desc: 'Engg, Computing, Business, Sciences, Pharmacy' },
  { icon: Search, label: 'Smart Search', desc: '"nearest cafeteria", "pharmacy block", "labs near me"' },
  { icon: MapPinned, label: 'Advanced Markers', desc: 'Custom university vector pins & building footprints' },
  { icon: Navigation2, label: 'Campus Routing', desc: 'Fastest, Step-free Accessible & Scenic modes' },
  { icon: Accessibility, label: 'Accessibility Mode', desc: 'Highlights ramps, elevators & tactile signage' },
  { icon: Flame, label: 'Activity Heatmap', desc: 'Simulates high density in Library & Bill Gates Food Court' },
  { icon: ShieldAlert, label: '24/7 Emergency', desc: '1-click route to Medical Centre & Ambulance dispatch' },
  { icon: Sunrise, label: 'Campus Pulse', desc: 'Morning, Afternoon & Evening schedule adaptation' },
];

export default function PresentationMode({ onExit }: Props) {
  return (
    <div className="glass-panel-strong animate-scale-in fixed bottom-5 left-1/2 z-50 w-[min(94vw,620px)] -translate-x-1/2 rounded-2xl p-4 shadow-glass-lg border border-brand-200/80 dark:border-brand-800/60">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-700 to-accent-500 text-white shadow-md">
            <Presentation size={18} />
          </span>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white font-heading">
                SmartCampus · Aditya University
              </p>
              <span className="rounded bg-accent-500/20 px-1.5 py-0.2 text-[9px] font-bold text-accent-600 dark:text-accent-400 uppercase">
                Demo Deck
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Purpose-built navigation layered on Google Maps Platform
            </p>
          </div>
        </div>
        <button
          onClick={onExit}
          className="chip bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-brand-900/50 dark:hover:bg-brand-900 dark:text-slate-300 transition-colors"
        >
          <X size={13} />
          <span>Exit Tour</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {STEPS.map((s) => (
          <div
            key={s.label}
            className="flex flex-col items-start gap-1 rounded-xl bg-slate-50/80 dark:bg-brand-950/50 p-2.5 border border-slate-100 dark:border-brand-900/40 transition-colors hover:border-accent-500/30"
          >
            <s.icon size={15} className="text-accent-500" />
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-100">{s.label}</span>
            <span className="text-[10px] leading-snug text-slate-500 dark:text-slate-400">{s.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
