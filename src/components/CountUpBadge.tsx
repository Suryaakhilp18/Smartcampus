import { useEffect, useRef, useState } from 'react';

interface CountUpBadgeProps {
  end: number;
  prefix?: string;
  suffix?: string;
  label: string;
  sublabel?: string;
  duration?: number;
}

export default function CountUpBadge({
  end,
  prefix = '',
  suffix = '',
  label,
  sublabel,
  duration = 1800,
}: CountUpBadgeProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          const startTime = performance.now();
          const step = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(easedProgress * end));

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setCount(end);
            }
          };

          requestAnimationFrame(step);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return (
    <div
      ref={ref}
      className="glass-panel group relative overflow-hidden rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover border border-slate-200/80 dark:border-brand-800/50 bg-white/80 dark:bg-campus-cardDark/80"
    >
      <div className="absolute top-0 right-0 h-16 w-16 -mr-4 -mt-4 rounded-full bg-accent-500/10 transition-transform duration-500 group-hover:scale-150" />
      <div className="relative z-10 flex flex-col items-center sm:items-start text-center sm:text-left">
        <div className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-700 dark:text-brand-300">
          <span className="text-accent-500 mr-0.5">{prefix}</span>
          <span>{count}</span>
          <span className="text-accent-500 ml-0.5">{suffix}</span>
        </div>
        <p className="mt-1.5 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 font-heading">
          {label}
        </p>
        {sublabel && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
            {sublabel}
          </p>
        )}
      </div>
    </div>
  );
}
