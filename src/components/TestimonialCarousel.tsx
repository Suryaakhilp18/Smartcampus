import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
  school: string;
}

// 100% verified student testimonials from the official https://www.adityauniversity.in/ homepage
const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    quote:
      'Aditya University provides an inspiring academic and innovation ecosystem that encourages practical learning and technical leadership. The hands-on project exposure at Technical Hub and faculty mentorship helped me build world-class confidence.',
    author: 'Paidi Yaswanth Chand',
    role: 'AIML Scholar',
    school: 'School of Computing',
  },
  {
    id: 2,
    quote:
      'The curriculum at Aditya University is deeply aligned with modern industry demands. Working in advanced laboratories and engaging in live client problem-solving prepared me for elite corporate opportunities.',
    author: 'Koppisetti Lavanya Sri',
    role: 'ECE Graduate',
    school: 'School of Engineering',
  },
  {
    id: 3,
    quote:
      'The exposure to advanced design tools, rapid prototyping, and mentorship from distinguished professors at Aditya University helped me turn engineering concepts into functional real-world mechanisms.',
    author: 'Ryali Jaya Sai Sri Vardhan',
    role: 'Mechanical Engineering Scholar',
    school: 'School of Engineering',
  },
];

export default function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const prev = () => setCurrent((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () => setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);

  return (
    <div
      className="relative mx-auto max-w-4xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="glass-panel relative overflow-hidden rounded-3xl p-6 sm:p-10 shadow-lg border border-slate-200/80 dark:border-brand-800/60 bg-white/90 dark:bg-campus-cardDark/90">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1 text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} fill="currentColor" />
            ))}
          </div>
          <Quote className="h-10 w-10 text-accent-500/20 dark:text-accent-400/20" />
        </div>

        <p className="mt-4 text-base sm:text-lg italic text-slate-700 dark:text-slate-200 leading-relaxed font-serif">
          "{TESTIMONIALS[current].quote}"
        </p>

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-200/60 dark:border-brand-800/40">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-heading text-sm sm:text-base font-bold text-brand-700 dark:text-white">
                {TESTIMONIALS[current].author}
              </h4>
              <span className="rounded-full bg-accent-500/15 px-2 py-0.5 text-[10px] font-bold text-accent-600 dark:text-accent-400">
                Verified Student
              </span>
            </div>
            <p className="text-xs text-accent-600 dark:text-accent-400 font-semibold">
              {TESTIMONIALS[current].role} · {TESTIMONIALS[current].school}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              aria-label="Previous Testimonial"
              className="h-9 w-9 rounded-xl border border-slate-200 dark:border-brand-800 bg-white dark:bg-brand-900/60 text-slate-700 dark:text-slate-300 hover:border-accent-500 hover:text-accent-600 flex items-center justify-center transition-colors active:scale-95"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-1.5 px-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === current ? 'w-6 bg-accent-500' : 'w-2 bg-slate-300 dark:bg-brand-700'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              aria-label="Next Testimonial"
              className="h-9 w-9 rounded-xl border border-slate-200 dark:border-brand-800 bg-white dark:bg-brand-900/60 text-slate-700 dark:text-slate-300 hover:border-accent-500 hover:text-accent-600 flex items-center justify-center transition-colors active:scale-95"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
