// ============================================================================
// OnboardingCoachmark — First-Run Guidance for New Campus Visitors
// ----------------------------------------------------------------------------
// Dismissible onboarding card that guides new users on searching, using the
// directory, and exploring the campus without confusion.
// ============================================================================
import { useState, useEffect } from 'react';
import { Sparkles, Search, Compass, Layers, X, ArrowRight } from 'lucide-react';

interface Props {
  onOpenDirectory: () => void;
}

export default function OnboardingCoachmark({ onOpenDirectory }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('smartcampus_onboarded_v4');
    if (!seen) {
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  function handleDismiss() {
    setVisible(false);
    localStorage.setItem('smartcampus_onboarded_v4', 'true');
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[92vw] max-w-xl animate-slide-up">
      <div className="glass-panel-strong relative overflow-hidden rounded-3xl p-4 sm:p-5 shadow-2xl border border-brand-200/80 dark:border-brand-700/60 bg-white/95 dark:bg-campus-dark/95 backdrop-blur-md">
        
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="icon-btn absolute right-3 top-3 h-7 w-7 rounded-lg bg-slate-100 dark:bg-brand-900 text-slate-500 hover:text-slate-900 dark:hover:text-white"
          aria-label="Dismiss guide"
        >
          <X size={14} />
        </button>

        <div className="flex items-start gap-3.5 pr-6">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-accent-500 to-amber-400 text-white shadow-md">
            <Sparkles size={20} />
          </span>

          <div className="space-y-1.5 min-w-0">
            <h3 className="text-sm sm:text-base font-extrabold tracking-tight text-brand-900 dark:text-white font-heading">
              Welcome to Aditya University SmartCampus!
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Explore 58 verified campus Bhavans, canteens, hostels, and labs. Here is how to navigate smoothly:
            </p>
          </div>
        </div>

        {/* 3 Quick Tips Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3.5 pt-3 border-t border-slate-100 dark:border-brand-900/50">
          <div className="flex items-start gap-2 p-2 rounded-xl bg-brand-50/60 dark:bg-brand-950/40 border border-brand-100/50 dark:border-brand-900/40">
            <Search size={14} className="text-accent-500 mt-0.5 shrink-0" />
            <div className="text-[11px] leading-tight text-slate-700 dark:text-slate-300">
              <strong className="block text-slate-900 dark:text-white font-semibold mb-0.5">Quick Search</strong>
              Find any Bhavan, hostel, or lab instantly.
            </div>
          </div>

          <div className="flex items-start gap-2 p-2 rounded-xl bg-brand-50/60 dark:bg-brand-950/40 border border-brand-100/50 dark:border-brand-900/40">
            <Compass size={14} className="text-brand-600 dark:text-brand-400 mt-0.5 shrink-0" />
            <div className="text-[11px] leading-tight text-slate-700 dark:text-slate-300">
              <strong className="block text-slate-900 dark:text-white font-semibold mb-0.5">List Directory</strong>
              Browse all 58 locations grouped by category.
            </div>
          </div>

          <div className="flex items-start gap-2 p-2 rounded-xl bg-brand-50/60 dark:bg-brand-950/40 border border-brand-100/50 dark:border-brand-900/40">
            <Layers size={14} className="text-emerald-500 mt-0.5 shrink-0" />
            <div className="text-[11px] leading-tight text-slate-700 dark:text-slate-300">
              <strong className="block text-slate-900 dark:text-white font-semibold mb-0.5">Zoom Density</strong>
              Zoom in to reveal specific labs and ATMs.
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-3.5 pt-2">
          <button
            onClick={() => {
              handleDismiss();
              onOpenDirectory();
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-600 dark:text-accent-400 hover:text-accent-700"
          >
            <span>Open Directory Index</span>
            <ArrowRight size={13} />
          </button>

          <button
            onClick={handleDismiss}
            className="btn-primary py-1.5 px-4 text-xs font-extrabold rounded-xl shadow-sm"
          >
            Got It, Explore Map
          </button>
        </div>
      </div>
    </div>
  );
}
