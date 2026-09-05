import { Sunrise, Sun, Sunset } from 'lucide-react';

export type PulsePeriod = 'morning' | 'afternoon' | 'evening';

interface Props {
  period: PulsePeriod;
  onChange: (p: PulsePeriod) => void;
}

const OPTIONS: { key: PulsePeriod; label: string; icon: typeof Sunrise; blurb: string }[] = [
  { key: 'morning', label: 'Morning', icon: Sunrise, blurb: 'Academic blocks emphasized' },
  { key: 'afternoon', label: 'Afternoon', icon: Sun, blurb: 'Cafeteria & study areas' },
  { key: 'evening', label: 'Evening', icon: Sunset, blurb: 'Parking, hostel & safety' },
];

export default function CampusPulse({ period, onChange }: Props) {
  return (
    <div className="glass-panel flex items-center gap-1 rounded-2xl p-1.5">
      {OPTIONS.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          title={OPTIONS.find((o) => o.key === key)?.blurb}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
            period === key
              ? 'bg-brand-600 text-white shadow-md'
              : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10'
          }`}
        >
          <Icon size={13} />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
