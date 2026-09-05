import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Building2, GraduationCap } from 'lucide-react';

interface PlacementSlide {
  id: number;
  highlight: string;
  metric: string;
  student?: string;
  company?: string;
  subtext: string;
  badge: string;
}

// 100% verified placement data directly from the official https://www.adityauniversity.in/ website (2025-2026 Academic Year)
const SLIDES: PlacementSlide[] = [
  {
    id: 1,
    badge: 'Highest Global Package · 2025-2026',
    metric: '₹1.06 CR',
    student: 'M. Akhilesh & G. Rajesh',
    company: 'Fabrantic',
    highlight: 'Record International Package of ₹1.06 Crore at Fabrantic',
    subtext: 'Consecutive high-tier international recruitments highlighting Aditya University engineering talent on global stages.',
  },
  {
    id: 2,
    badge: 'Premier Automotive Tech Offer',
    metric: '₹39.60 LPA',
    student: 'D. Veera Venkata Durga Bhan Raju',
    company: 'Toyota',
    highlight: 'Recruited by Toyota with ₹39.60 LPA Super Dream Offer',
    subtext: 'Specialized systems design and robotics training unlocking elite core automotive engineering careers.',
  },
  {
    id: 3,
    badge: 'High-Tech Engineering Roles',
    metric: '₹31.62 LPA',
    student: 'Y. Ramya & N Sai Raghavendra Nithin',
    company: 'Zacros',
    highlight: 'Dual Placements at Zacros with ₹31.62 LPA Each',
    subtext: 'Rigorous technical bootcamps and competitive programming fostering day-one industry job readiness.',
  },
  {
    id: 4,
    badge: 'International Tech Career',
    metric: '₹29.87 LPA',
    student: 'P. Srinivas & S. Roshin Roja',
    company: 'Afrex',
    highlight: 'Global Career Placements at Afrex with ₹29.87 LPA',
    subtext: 'Connecting student innovation with international enterprises across Japan and global markets.',
  },
];

// Verified student highlights from the official Aditya University homepage
const STUDENT_CARDS = [
  { name: 'M. Akhilesh', package: '₹1.06 CR', company: 'Fabrantic' },
  { name: 'G. Rajesh', package: '₹1.06 CR', company: 'Fabrantic' },
  { name: 'D. V. V. D. Bhan Raju', package: '₹39.60 LPA', company: 'Toyota' },
  { name: 'Y. Ramya', package: '₹31.62 LPA', company: 'Zacros' },
  { name: 'N. S. R. Nithin', package: '₹31.62 LPA', company: 'Zacros' },
  { name: 'P. Srinivas', package: '₹29.87 LPA', company: 'Afrex' },
  { name: 'S. Roshin Roja', package: '₹29.87 LPA', company: 'Afrex' },
  { name: 'A. Pujitha', package: '₹27.81 LPA', company: 'Shinse' },
  { name: 'Charlton Shallock', package: '₹27.79 LPA', company: 'Tiger Machine' },
  { name: 'G. Dhruvith', package: '₹26.31 LPA', company: 'Nagano' },
  { name: 'P. Renuka', package: '₹19.17 LPA', company: 'Amazon' },
  { name: 'K. Sumanth', package: '₹18.10 LPA', company: 'Amazon' },
];

// Official Top Recruiters featured on https://www.adityauniversity.in/
const OFFICIAL_RECRUITERS = [
  'Capgemini',
  'Accenture',
  'Autodesk',
  'Toyota Connect',
  'Walmart',
  'Hitachi',
  'Larsen & Toubro',
  'Adtech',
  'Daiseki',
  'Darwin',
  'Ihara',
  'Increff',
  'Sansyu',
  'Zopsmart',
];

export default function PlacementCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  };

  return (
    <div className="w-full">
      {/* Featured Metric Slider */}
      <div
        className="relative overflow-hidden rounded-3xl border border-brand-200/60 dark:border-brand-800/60 bg-gradient-to-br from-brand-900 via-brand-800 to-brand-950 p-6 sm:p-10 text-white shadow-xl"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent-500/15 blur-3xl" />
        <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-500/20 px-3 py-1 text-xs font-bold text-accent-300 uppercase tracking-wider border border-accent-500/30">
              {SLIDES[current].badge}
            </span>
            <div className="mt-3 text-4xl sm:text-6xl font-black font-heading tracking-tight text-white">
              {SLIDES[current].metric}
            </div>
            {SLIDES[current].student && (
              <div className="mt-1 flex items-center justify-center md:justify-start gap-2 text-sm text-accent-300 font-semibold">
                <GraduationCap size={16} />
                <span>{SLIDES[current].student}</span>
                <span className="text-white/40">·</span>
                <span>{SLIDES[current].company}</span>
              </div>
            )}
            <h3 className="mt-2 text-lg sm:text-xl font-bold text-brand-100 font-heading">
              {SLIDES[current].highlight}
            </h3>
            <p className="mt-2 max-w-xl text-xs sm:text-sm text-brand-200/80 leading-relaxed">
              {SLIDES[current].subtext}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={prevSlide}
              aria-label="Previous Slide"
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center transition-all border border-white/20 text-white"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-1.5 px-2">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === current ? 'w-8 bg-accent-500' : 'w-2.5 bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={nextSlide}
              aria-label="Next Slide"
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center transition-all border border-white/20 text-white"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Top Student Placement Highlights */}
      <div className="mt-8">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          Official 2025-2026 Student Placement Honors
        </p>
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {STUDENT_CARDS.map((st, i) => (
            <div
              key={i}
              className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-campus-cardDark p-3.5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-accent-400/80 hover:shadow-md"
            >
              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate">
                {st.name}
              </div>
              <div className="mt-1 font-heading text-sm font-black text-accent-600 dark:text-accent-400">
                {st.package}
              </div>
              <div className="mt-1 inline-flex items-center gap-1 rounded-md bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 text-[10px] font-semibold text-brand-700 dark:text-brand-300 border border-brand-200/50 dark:border-brand-800/50 truncate max-w-full">
                <Building2 size={10} className="shrink-0" />
                <span className="truncate">{st.company}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recruiter Wordmark Grid */}
      <div className="mt-8">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          Official Top Recruiting Partners (Aditya University)
        </p>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {OFFICIAL_RECRUITERS.map((company) => (
            <div
              key={company}
              className="glass-panel flex h-14 items-center justify-center rounded-xl p-2.5 text-center text-xs font-bold text-slate-700 dark:text-slate-200 shadow-sm transition-all duration-300 hover:border-accent-500/50 hover:bg-white dark:hover:bg-brand-900/60 hover:-translate-y-0.5"
            >
              <span className="font-heading tracking-tight">{company}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
