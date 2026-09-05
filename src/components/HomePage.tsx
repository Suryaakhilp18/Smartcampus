import { useState, useEffect } from 'react';
import {
  Compass,
  ArrowRight,
  GraduationCap,
  Cpu,
  Briefcase,
  FlaskConical,
  BookOpen,
  Globe2,
  Building2,
  Sparkles,
  Utensils,
  Dumbbell,
  Bus,
  ShieldCheck,
  Moon,
  Sun,
  ChevronRight,
  ExternalLink,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';
import CountUpBadge from './CountUpBadge';
import PlacementCarousel from './PlacementCarousel';
import TestimonialCarousel from './TestimonialCarousel';
import type { CampusCategory } from '../data/campusData';

interface HomePageProps {
  onExploreCampus: (category?: CampusCategory, targetLocationId?: string) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export default function HomePage({ onExploreCampus, theme, onToggleTheme }: HomePageProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeWhyTab, setActiveWhyTab] = useState<'coe' | 'industry' | 'thub' | 'mous'>('thub');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-campus-darkSurface dark:text-slate-100 transition-colors duration-300 selection:bg-accent-500 selection:text-white">
      {/* ========================================================================= */}
      {/* 1. STICKY / FIXED DYNAMIC HEADER */}
      {/* ========================================================================= */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'glass-panel-strong shadow-md py-2.5 sm:py-3 border-b border-slate-200/80 dark:border-brand-800/80 bg-white/95 dark:bg-[#07101E]/95'
            : 'bg-gradient-to-b from-black/40 via-black/15 to-transparent py-4 sm:py-5'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo Lockup */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2.5 text-left group"
            >
              <img
                src="/aditya-logo.svg"
                alt="Aditya University Logo"
                className="h-8 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105"
              />
              <div className="flex flex-col leading-none">
                <span className={`font-heading text-sm sm:text-base font-extrabold tracking-tight transition-colors ${
                  scrolled ? 'text-brand-900 dark:text-white' : 'text-white'
                }`}>
                  Aditya University
                </span>
                <span className="text-[10px] sm:text-[11px] font-semibold text-accent-400 mt-0.5 tracking-wide">
                  Surampalem, ADB Road
                </span>
              </div>
            </button>
          </div>

          {/* Nav Links (Desktop) */}
          <nav className={`hidden lg:flex items-center gap-6 text-xs font-bold uppercase tracking-wider font-heading transition-colors ${
            scrolled ? 'text-slate-700 dark:text-slate-200' : 'text-white/90'
          }`}>
            <button
              onClick={() => scrollToSection('about')}
              className="transition-colors hover:text-accent-400"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('schools')}
              className="transition-colors hover:text-accent-400"
            >
              Schools
            </button>
            <button
              onClick={() => scrollToSection('why-us')}
              className="transition-colors hover:text-accent-400"
            >
              Why Aditya
            </button>
            <button
              onClick={() => scrollToSection('placements')}
              className="transition-colors hover:text-accent-400"
            >
              Placements
            </button>
            <button
              onClick={() => scrollToSection('facilities')}
              className="transition-colors hover:text-accent-400"
            >
              Campus Map
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="transition-colors hover:text-accent-400"
            >
              Contact
            </button>
          </nav>

          {/* Right Controls: Theme + Primary Explore CTA */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={onToggleTheme}
              aria-label="Toggle dark/light theme"
              className={`icon-btn h-9 w-9 rounded-xl border transition-colors ${
                scrolled
                  ? 'border-slate-200/80 dark:border-brand-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-brand-900/40'
                  : 'border-white/30 text-white hover:bg-white/15'
              }`}
            >
              {theme === 'dark' ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} />}
            </button>

            <button
              onClick={() => onExploreCampus()}
              className="btn-accent flex items-center gap-2 rounded-2xl px-3.5 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold shadow-cta transition-transform active:scale-95"
            >
              <Compass size={16} className="animate-spin-slow" />
              <span className="font-heading tracking-wide">Explore Aditya University</span>
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#051329] via-[#0B2D6B] to-[#0A2454] pt-24 sm:pt-28 pb-16 text-white">
        {/* Background Glow Blobs */}
        <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-accent-500/20 blur-3xl animate-pulse" />
        <div className="pointer-events-none absolute top-1/3 -left-32 h-80 w-80 rounded-full bg-brand-400/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 right-1/4 h-72 w-72 rounded-full bg-accent-600/15 blur-3xl" />

        {/* Decorative Grid Overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-4 py-1.5 border border-white/20 text-xs font-bold uppercase tracking-wider text-accent-300 shadow-sm animate-fade-in">
            <Sparkles size={14} className="text-accent-400" />
            <span>NAAC 'A++' Accredited · Autonomous State Private University</span>
          </div>

          {/* Main Headline */}
          <h1 className="mt-6 font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-white">
            Pioneering Innovation.{' '}
            <span className="bg-gradient-to-r from-accent-400 via-amber-300 to-accent-500 bg-clip-text text-transparent">
              Igniting Futures.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-6 max-w-2xl text-sm sm:text-base md:text-lg text-brand-100/90 leading-relaxed font-normal">
            Experience the 180-acre smart campus of Aditya University, Surampalem. Discover world-class engineering blocks, cutting-edge Technical Hub incubation, multi-faith spaces, and student life designed for global excellence.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
            <button
              onClick={() => onExploreCampus()}
              className="btn-accent w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-2xl px-6 py-3.5 text-sm sm:text-base font-bold shadow-cta transition-transform active:scale-95"
            >
              <Compass size={18} className="animate-spin-slow" />
              <span>Explore Aditya University Map</span>
              <ArrowRight size={17} />
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm sm:text-base font-bold text-white bg-white/10 hover:bg-white/20 active:scale-95 transition-all border border-white/20 backdrop-blur-md"
            >
              <span>Discover Campus Highlights</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. RANKINGS & ACCREDITATIONS STRIP */}
      {/* ========================================================================= */}
      <section id="about" className="relative -mt-10 sm:-mt-12 z-20 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-2 sm:p-3 rounded-3xl bg-white/70 dark:bg-[#071326]/85 backdrop-blur-xl border border-slate-200/80 dark:border-brand-800/60 shadow-xl">
          <div className="flex flex-col items-center justify-center p-3 sm:p-4 text-center">
            <div className="font-heading text-2xl sm:text-3xl font-black text-brand-900 dark:text-white">
              151-200
            </div>
            <div className="mt-1 text-xs sm:text-sm font-bold text-accent-600 dark:text-accent-400">
              NIRF Ranking Band
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              NBA Tier-1 Accredited
            </div>
          </div>
          <CountUpBadge
            end={180}
            suffix="+"
            label="Acres Campus"
            sublabel="Surampalem Green Campus"
          />
          <div className="flex flex-col items-center justify-center p-3 sm:p-4 text-center">
            <div className="font-heading text-2xl sm:text-3xl font-black text-brand-900 dark:text-white">
              ₹1.06 CR
            </div>
            <div className="mt-1 text-xs sm:text-sm font-bold text-accent-600 dark:text-accent-400">
              Peak Package
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Fabrantic Global Placement
            </div>
          </div>
          <CountUpBadge
            end={50}
            suffix="+"
            label="Verified Zones"
            sublabel="Real-time Mapped POIs"
          />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SCHOOLS SHOWCASE */}
      {/* ========================================================================= */}
      <section id="schools" className="py-16 sm:py-24 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-accent-600 dark:text-accent-400">
            Academic Excellence
          </span>
          <h2 className="mt-2 font-heading text-2xl sm:text-4xl font-extrabold text-brand-900 dark:text-white">
            Multidisciplinary Schools of Study
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Engineered with industry-tailored curricula, advanced labs in Bill Gates & Cotton Bhavans, and world-class faculty.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* School 1 */}
          <div className="glass-panel group relative flex flex-col justify-between rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-brand-800/60 bg-white/80 dark:bg-campus-cardDark/80 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1.5">
            <div>
              <div className="h-12 w-12 rounded-2xl bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-300 flex items-center justify-center transition-transform group-hover:scale-110">
                <Cpu size={24} />
              </div>
              <h3 className="mt-5 font-heading text-lg font-bold text-brand-900 dark:text-white">
                School of Computing & AI
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Cutting-edge specializations in AI, Machine Learning, Cyber Security, Data Science, and Cloud Computing housed inside Bill Gates Bhavan.
              </p>
            </div>
            <button
              onClick={() => onExploreCampus('academic', 'bill-gates-bhavan')}
              className="mt-6 inline-flex items-center gap-1 text-xs font-bold text-accent-600 dark:text-accent-400 group-hover:gap-2 transition-all"
            >
              <span>View Bill Gates Bhavan on Map</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* School 2 */}
          <div className="glass-panel group relative flex flex-col justify-between rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-brand-800/60 bg-white/80 dark:bg-campus-cardDark/80 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1.5">
            <div>
              <div className="h-12 w-12 rounded-2xl bg-accent-500/10 dark:bg-accent-500/20 text-accent-600 dark:text-accent-400 flex items-center justify-center transition-transform group-hover:scale-110">
                <GraduationCap size={24} />
              </div>
              <h3 className="mt-5 font-heading text-lg font-bold text-brand-900 dark:text-white">
                School of Engineering & Technology
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Civil, Mechanical, Electrical, Electronics, and Petroleum Engineering with full-scale outdoor simulation models at K.L. Rao & Cotton Bhavans.
              </p>
            </div>
            <button
              onClick={() => onExploreCampus('academic', 'kl-rao-bhavan')}
              className="mt-6 inline-flex items-center gap-1 text-xs font-bold text-accent-600 dark:text-accent-400 group-hover:gap-2 transition-all"
            >
              <span>View K.L. Rao Bhavan on Map</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* School 3 */}
          <div className="glass-panel group relative flex flex-col justify-between rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-brand-800/60 bg-white/80 dark:bg-campus-cardDark/80 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1.5">
            <div>
              <div className="h-12 w-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center transition-transform group-hover:scale-110">
                <FlaskConical size={24} />
              </div>
              <h3 className="mt-5 font-heading text-lg font-bold text-brand-900 dark:text-white">
                School of Pharmacy
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                PCI-recognized Pharmacy programs (B.Pharm, M.Pharm, Pharm.D) conducting breakthrough drug formulations across ACOP & APC complexes.
              </p>
            </div>
            <button
              onClick={() => onExploreCampus('academic', 'aditya-pharmacy')}
              className="mt-6 inline-flex items-center gap-1 text-xs font-bold text-accent-600 dark:text-accent-400 group-hover:gap-2 transition-all"
            >
              <span>View Pharmacy Complex on Map</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* School 4 */}
          <div className="glass-panel group relative flex flex-col justify-between rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-brand-800/60 bg-white/80 dark:bg-campus-cardDark/80 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1.5">
            <div>
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center transition-transform group-hover:scale-110">
                <Briefcase size={24} />
              </div>
              <h3 className="mt-5 font-heading text-lg font-bold text-brand-900 dark:text-white">
                School of Business & Management
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Aditya Global Business School delivering high-impact MBA and executive management degrees focused on fintech, analytics, and leadership.
              </p>
            </div>
            <button
              onClick={() => onExploreCampus('academic', 'aditya-business-school')}
              className="mt-6 inline-flex items-center gap-1 text-xs font-bold text-accent-600 dark:text-accent-400 group-hover:gap-2 transition-all"
            >
              <span>View Business School on Map</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* School 5 */}
          <div className="glass-panel group relative flex flex-col justify-between rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-brand-800/60 bg-white/80 dark:bg-campus-cardDark/80 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1.5 sm:col-span-2 lg:col-span-1">
            <div>
              <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center transition-transform group-hover:scale-110">
                <BookOpen size={24} />
              </div>
              <h3 className="mt-5 font-heading text-lg font-bold text-brand-900 dark:text-white">
                School of Applied Sciences & Humanities
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Rigorous foundations in Mathematics, Applied Physics, Chemistry, and Foreign Languages powering fundamental engineering research.
              </p>
            </div>
            <button
              onClick={() => onExploreCampus('academic', 'cotton-bhavan')}
              className="mt-6 inline-flex items-center gap-1 text-xs font-bold text-accent-600 dark:text-accent-400 group-hover:gap-2 transition-all"
            >
              <span>View Science Labs on Map</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. WHY ADITYA (INTERACTIVE TABBED SECTION) */}
      {/* ========================================================================= */}
      <section id="why-us" className="py-16 bg-slate-100/70 dark:bg-[#071324] transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-accent-600 dark:text-accent-400">
              The Aditya Advantage
            </span>
            <h2 className="mt-2 font-heading text-2xl sm:text-4xl font-extrabold text-brand-900 dark:text-white">
              Why Leaders Choose Aditya University
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Experience dynamic industry integration through practical immersion and state-of-the-art infrastructure.
            </p>
          </div>

          {/* Interactive Tabs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setActiveWhyTab('thub')}
              className={`rounded-2xl px-5 py-2.5 text-xs sm:text-sm font-bold transition-all duration-300 ${
                activeWhyTab === 'thub'
                  ? 'bg-accent-500 text-white shadow-cta'
                  : 'glass-panel text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-brand-900/50'
              }`}
            >
              Technical Hub & Incubation
            </button>
            <button
              onClick={() => setActiveWhyTab('coe')}
              className={`rounded-2xl px-5 py-2.5 text-xs sm:text-sm font-bold transition-all duration-300 ${
                activeWhyTab === 'coe'
                  ? 'bg-accent-500 text-white shadow-cta'
                  : 'glass-panel text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-brand-900/50'
              }`}
            >
              Centers of Excellence
            </button>
            <button
              onClick={() => setActiveWhyTab('industry')}
              className={`rounded-2xl px-5 py-2.5 text-xs sm:text-sm font-bold transition-all duration-300 ${
                activeWhyTab === 'industry'
                  ? 'bg-accent-500 text-white shadow-cta'
                  : 'glass-panel text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-brand-900/50'
              }`}
            >
              Industry Immersion
            </button>
            <button
              onClick={() => setActiveWhyTab('mous')}
              className={`rounded-2xl px-5 py-2.5 text-xs sm:text-sm font-bold transition-all duration-300 ${
                activeWhyTab === 'mous'
                  ? 'bg-accent-500 text-white shadow-cta'
                  : 'glass-panel text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-brand-900/50'
              }`}
            >
              Global MOUs & Research
            </button>
          </div>

          {/* Tab Content Display */}
          <div className="mt-8 transition-opacity duration-300 animate-fade-in">
            {activeWhyTab === 'thub' && (
              <div className="glass-panel grid grid-cols-1 md:grid-cols-2 gap-8 items-center rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-brand-800/60 bg-white/90 dark:bg-campus-cardDark/90 shadow-xl">
                <div>
                  <span className="rounded-full bg-accent-500/15 px-3 py-1 text-xs font-bold text-accent-600 dark:text-accent-400">
                    Flagship Innovation Hub
                  </span>
                  <h3 className="mt-4 font-heading text-xl sm:text-3xl font-extrabold text-brand-900 dark:text-white">
                    Technical Hub (T-Hub)
                  </h3>
                  <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    A first-of-its-kind student technical incubation centre located directly on campus. Over 15,000+ students certified in high-demand technologies, deploying live software and hardware systems for industry clients.
                  </p>
                  <ul className="mt-4 space-y-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-accent-500" />
                      AWS, Microsoft Azure, and Red Hat Certified Training
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-accent-500" />
                      Student-run start-ups and product incubation labs
                    </li>
                  </ul>
                  <button
                    onClick={() => onExploreCampus('labs', 'technical-hub')}
                    className="mt-6 btn-accent inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold shadow-cta"
                  >
                    <span>View Technical Hub on Map</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
                <div className="rounded-2xl border border-brand-200/60 dark:border-brand-800/60 bg-gradient-to-br from-brand-900 to-brand-950 p-6 text-white">
                  <h4 className="font-heading text-base font-bold text-accent-400">
                    T-Hub Highlights
                  </h4>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-xl bg-white/10">
                      <p className="text-2xl font-black font-heading text-white">100+</p>
                      <p className="text-[11px] text-brand-200">Hackathon Wins</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/10">
                      <p className="text-2xl font-black font-heading text-accent-400">15,000+</p>
                      <p className="text-[11px] text-brand-200">Certifications</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/10">
                      <p className="text-2xl font-black font-heading text-white">25+</p>
                      <p className="text-[11px] text-brand-200">Corporate Mentors</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/10">
                      <p className="text-2xl font-black font-heading text-accent-400">12+</p>
                      <p className="text-[11px] text-brand-200">Patents Filed</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeWhyTab === 'coe' && (
              <div className="glass-panel grid grid-cols-1 md:grid-cols-2 gap-8 items-center rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-brand-800/60 bg-white/90 dark:bg-campus-cardDark/90 shadow-xl">
                <div>
                  <span className="rounded-full bg-accent-500/15 px-3 py-1 text-xs font-bold text-accent-600 dark:text-accent-400">
                    Advanced Research Facilities
                  </span>
                  <h3 className="mt-4 font-heading text-xl sm:text-3xl font-extrabold text-brand-900 dark:text-white">
                    State-of-the-Art Centers of Excellence
                  </h3>
                  <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Collaborative labs powered by industry giants including the Intel Intelligent Systems Lab, Dassault Systèmes 3D Experience Lab, and Siemens Automation suites.
                  </p>
                  <button
                    onClick={() => onExploreCampus('labs', 'intel-lab')}
                    className="mt-6 btn-accent inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold shadow-cta"
                  >
                    <span>View Intel AI Lab on Map</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
                <div className="rounded-2xl border border-slate-200 dark:border-brand-800 bg-slate-50 dark:bg-brand-950 p-6">
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-xl border border-slate-200 dark:border-brand-800 bg-white dark:bg-brand-900/60">
                      <h5 className="text-xs font-bold text-brand-700 dark:text-brand-300 font-heading">
                        Intel Intelligent Systems Lab (Bill Gates Bhavan)
                      </h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Edge computing, computer vision, and deep learning hardware.</p>
                    </div>
                    <div className="p-3.5 rounded-xl border border-slate-200 dark:border-brand-800 bg-white dark:bg-brand-900/60">
                      <h5 className="text-xs font-bold text-brand-700 dark:text-brand-300 font-heading">
                        Petroleum & Reservoir Engineering Lab
                      </h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Drilling fluid testing, reservoir rock properties, core sampling.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeWhyTab === 'industry' && (
              <div className="glass-panel grid grid-cols-1 md:grid-cols-2 gap-8 items-center rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-brand-800/60 bg-white/90 dark:bg-campus-cardDark/90 shadow-xl">
                <div>
                  <span className="rounded-full bg-accent-500/15 px-3 py-1 text-xs font-bold text-accent-600 dark:text-accent-400">
                    Day-One Readiness
                  </span>
                  <h3 className="mt-4 font-heading text-xl sm:text-3xl font-extrabold text-brand-900 dark:text-white">
                    Industry Immersion Curriculum
                  </h3>
                  <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Mandatory industry internships, corporate hackathons, and guest masterclasses by Silicon Valley and Indian tech leaders ensure students graduate job-ready.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-brand-900 text-white flex flex-col justify-center">
                  <p className="text-base font-bold font-heading text-accent-400">Pearson VUE Authorised Center</p>
                  <p className="mt-2 text-xs text-brand-200 leading-relaxed">
                    Students take international certification exams on campus across AWS, Cisco, Oracle, and Google Cloud credentials.
                  </p>
                </div>
              </div>
            )}

            {activeWhyTab === 'mous' && (
              <div className="glass-panel grid grid-cols-1 md:grid-cols-2 gap-8 items-center rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-brand-800/60 bg-white/90 dark:bg-campus-cardDark/90 shadow-xl">
                <div>
                  <span className="rounded-full bg-accent-500/15 px-3 py-1 text-xs font-bold text-accent-600 dark:text-accent-400">
                    International Horizons
                  </span>
                  <h3 className="mt-4 font-heading text-xl sm:text-3xl font-extrabold text-brand-900 dark:text-white">
                    Global MOUs & Exchange
                  </h3>
                  <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Active academic linkages with prestigious universities across the USA, UK, Germany, and Japan for dual-degree pathways, research exchanges, and international conferences.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-accent-600 text-white">
                  <Globe2 size={32} className="mb-3" />
                  <h4 className="font-heading font-bold text-base">Global Exposure</h4>
                  <p className="mt-2 text-xs leading-relaxed text-white/90">
                    Foreign language certifications in German, French, and Japanese offered right on campus through the Centre for Foreign Languages.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. PLACEMENTS HIGHLIGHT */}
      {/* ========================================================================= */}
      <section id="placements" className="py-16 sm:py-24 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-accent-600 dark:text-accent-400">
            Proven Career Outcomes
          </span>
          <h2 className="mt-2 font-heading text-2xl sm:text-4xl font-extrabold text-brand-900 dark:text-white">
            Placements & Corporate Leadership
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Consistently leading premier campus placement records in Andhra Pradesh with Fortune 500 multinationals.
          </p>
        </div>

        <PlacementCarousel />
      </section>

      {/* ========================================================================= */}
      {/* 7. CAMPUS FACILITIES GRID (BRIDGE INTO MAP) */}
      {/* ========================================================================= */}
      <section id="facilities" className="py-16 sm:py-24 bg-brand-900 text-white relative overflow-hidden">
        <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-accent-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-brand-500/20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block rounded-full bg-accent-500/20 border border-accent-500/30 px-3 py-1 text-xs font-bold text-accent-300 uppercase tracking-wider">
              Interactive 58-Location Map
            </span>
            <h2 className="mt-4 font-heading text-2xl sm:text-4xl font-extrabold text-white">
              Explore Our 180-Acre Campus
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-brand-200 max-w-xl mx-auto">
              Click any campus facility card to jump straight into the live SmartCampus map, pre-filtered and focused on that zone.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Card 1 */}
            <div
              onClick={() => onExploreCampus('academic', 'bill-gates-bhavan')}
              className="group cursor-pointer rounded-3xl border border-white/15 bg-white/10 backdrop-blur-md p-6 transition-all duration-300 hover:border-accent-400 hover:bg-white/15 hover:-translate-y-1.5 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-2xl bg-accent-500/20 text-accent-400 flex items-center justify-center">
                  <Building2 size={24} />
                </div>
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-200">
                  Academic
                </span>
              </div>
              <h3 className="mt-5 font-heading text-lg font-bold text-white group-hover:text-accent-300 transition-colors">
                Academic Bhavans
              </h3>
              <p className="mt-2 text-xs text-brand-200 leading-relaxed">
                Bill Gates, K.L. Rao, Cotton, and Abdul Kalam Bhavans housing cutting-edge smart classrooms.
              </p>
              <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-accent-400 group-hover:gap-2.5 transition-all">
                <span>Explore on Map</span>
                <ArrowRight size={14} />
              </div>
            </div>

            {/* Card 2 */}
            <div
              onClick={() => onExploreCampus('facilities', 'central-library')}
              className="group cursor-pointer rounded-3xl border border-white/15 bg-white/10 backdrop-blur-md p-6 transition-all duration-300 hover:border-accent-400 hover:bg-white/15 hover:-translate-y-1.5 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-2xl bg-accent-500/20 text-accent-400 flex items-center justify-center">
                  <BookOpen size={24} />
                </div>
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-200">
                  Facilities
                </span>
              </div>
              <h3 className="mt-5 font-heading text-lg font-bold text-white group-hover:text-accent-300 transition-colors">
                Central Library & Archives
              </h3>
              <p className="mt-2 text-xs text-brand-200 leading-relaxed">
                Knowledge Resource Centre with 100,000+ volumes, IEEE digital access, and air-conditioned night reading halls.
              </p>
              <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-accent-400 group-hover:gap-2.5 transition-all">
                <span>Explore on Map</span>
                <ArrowRight size={14} />
              </div>
            </div>

            {/* Card 3 */}
            <div
              onClick={() => onExploreCampus('facilities', 'girls-hostel')}
              className="group cursor-pointer rounded-3xl border border-white/15 bg-white/10 backdrop-blur-md p-6 transition-all duration-300 hover:border-accent-400 hover:bg-white/15 hover:-translate-y-1.5 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-2xl bg-accent-500/20 text-accent-400 flex items-center justify-center">
                  <Utensils size={24} />
                </div>
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-200">
                  Residential & Dining
                </span>
              </div>
              <h3 className="mt-5 font-heading text-lg font-bold text-white group-hover:text-accent-300 transition-colors">
                Residential & Dining
              </h3>
              <p className="mt-2 text-xs text-brand-200 leading-relaxed">
                Sarojini Bhavan (Girls Complex), Faculty Residential Quarters, Central Ball Canteen, and North Mess.
              </p>
              <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-accent-400 group-hover:gap-2.5 transition-all">
                <span>Explore on Map</span>
                <ArrowRight size={14} />
              </div>
            </div>

            {/* Card 4 */}
            <div
              onClick={() => onExploreCampus('facilities', 'sports-stadium')}
              className="group cursor-pointer rounded-3xl border border-white/15 bg-white/10 backdrop-blur-md p-6 transition-all duration-300 hover:border-accent-400 hover:bg-white/15 hover:-translate-y-1.5 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-2xl bg-accent-500/20 text-accent-400 flex items-center justify-center">
                  <Dumbbell size={24} />
                </div>
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-200">
                  Sports
                </span>
              </div>
              <h3 className="mt-5 font-heading text-lg font-bold text-white group-hover:text-accent-300 transition-colors">
                Sports Stadium & Gym
              </h3>
              <p className="mt-2 text-xs text-brand-200 leading-relaxed">
                Full-size cricket ground, 400m athletics track, floodlit basketball courts, volleyball, and indoor games arena.
              </p>
              <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-accent-400 group-hover:gap-2.5 transition-all">
                <span>Explore on Map</span>
                <ArrowRight size={14} />
              </div>
            </div>

            {/* Card 5 */}
            <div
              onClick={() => onExploreCampus('parking', 'bus-terminal')}
              className="group cursor-pointer rounded-3xl border border-white/15 bg-white/10 backdrop-blur-md p-6 transition-all duration-300 hover:border-accent-400 hover:bg-white/15 hover:-translate-y-1.5 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-2xl bg-accent-500/20 text-accent-400 flex items-center justify-center">
                  <Bus size={24} />
                </div>
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-200">
                  Transit
                </span>
              </div>
              <h3 className="mt-5 font-heading text-lg font-bold text-white group-hover:text-accent-300 transition-colors">
                Fleet Transit & Gates
              </h3>
              <p className="mt-2 text-xs text-brand-200 leading-relaxed">
                250+ university bus network connecting Kakinada, Rajahmundry, Peddapuram, and eco buggy shuttle stops.
              </p>
              <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-accent-400 group-hover:gap-2.5 transition-all">
                <span>Explore on Map</span>
                <ArrowRight size={14} />
              </div>
            </div>

            {/* Card 6 */}
            <div
              onClick={() => onExploreCampus('medical', 'medical-centre')}
              className="group cursor-pointer rounded-3xl border border-white/15 bg-white/10 backdrop-blur-md p-6 transition-all duration-300 hover:border-accent-400 hover:bg-white/15 hover:-translate-y-1.5 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-2xl bg-accent-500/20 text-accent-400 flex items-center justify-center">
                  <ShieldCheck size={24} />
                </div>
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-200">
                  Support
                </span>
              </div>
              <h3 className="mt-5 font-heading text-lg font-bold text-white group-hover:text-accent-300 transition-colors">
                24/7 Medical & Security
              </h3>
              <p className="mt-2 text-xs text-brand-200 leading-relaxed">
                Resident physicians, on-call ambulance station, Canara Bank branch & ATMs, and round-the-clock emergency support.
              </p>
              <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-accent-400 group-hover:gap-2.5 transition-all">
                <span>Explore on Map</span>
                <ArrowRight size={14} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. CAMPUS LIFE */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-accent-600 dark:text-accent-400">
            Vibrant Community
          </span>
          <h2 className="mt-2 font-heading text-2xl sm:text-4xl font-extrabold text-brand-900 dark:text-white">
            Life on the Surampalem Campus
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            From premier national symposiums to active student clubs and multi-faith unity.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel group relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-brand-800 bg-white/80 dark:bg-campus-cardDark/80 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
            <span className="inline-block rounded-full bg-accent-500/10 text-accent-600 dark:text-accent-400 text-xs font-bold px-3 py-1">
              VEDA & Colors
            </span>
            <h3 className="mt-4 font-heading text-xl font-bold text-brand-900 dark:text-white">
              Cultural & Tech Fests
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              VEDA brings together over 10,000+ students from across India for national project competitions, robotics battles, and live musical showcases in the 3,000-seat amphitheatre.
            </p>
          </div>

          <div className="glass-panel group relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-brand-800 bg-white/80 dark:bg-campus-cardDark/80 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
            <span className="inline-block rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-300 text-xs font-bold px-3 py-1">
              30+ Active Chapters
            </span>
            <h3 className="mt-4 font-heading text-xl font-bold text-brand-900 dark:text-white">
              Clubs & Societies
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Coding clubs, IEEE student branch, Photography club, Rotaract social outreach, and Entrepreneurship cell giving students limitless avenues to lead.
            </p>
          </div>

          <div className="glass-panel group relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-brand-800 bg-white/80 dark:bg-campus-cardDark/80 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
            <span className="inline-block rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-3 py-1">
              Harmony & Inclusivity
            </span>
            <h3 className="mt-4 font-heading text-xl font-bold text-brand-900 dark:text-white">
              Multi-Faith Sacred Spaces
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Distinct individual prayer places reflecting communal harmony: Sri Hanuman Temple, Sai Baba Temple, Campus Mosque (Masjid), and Campus Fellowship Chapel.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. TESTIMONIALS CAROUSEL */}
      {/* ========================================================================= */}
      <section className="py-16 bg-slate-100/70 dark:bg-[#071324] transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-accent-600 dark:text-accent-400">
              Student Voices
            </span>
            <h2 className="mt-2 font-heading text-2xl sm:text-4xl font-extrabold text-brand-900 dark:text-white">
              Stories from Aditya Achievers
            </h2>
          </div>

          <TestimonialCarousel />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. COMPREHENSIVE FOOTER */}
      {/* ========================================================================= */}
      <footer id="contact" className="bg-[#040C1A] text-slate-300 pt-16 pb-12 border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
            {/* Col 1: University Info */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3">
                <img
                  src="/aditya-logo.svg"
                  alt="Aditya University Logo"
                  className="h-10 w-auto object-contain"
                />
                <div className="flex flex-col">
                  <span className="font-heading text-lg font-extrabold text-white">
                    Aditya University
                  </span>
                  <span className="text-xs text-accent-400 font-semibold">
                    State Private University · Surampalem
                  </span>
                </div>
              </div>

              <div className="mt-4 text-xs text-slate-400 leading-relaxed max-w-md">
                <p className="flex items-start gap-2">
                  <MapPin size={16} className="text-accent-400 shrink-0 mt-0.5" />
                  <span>
                    Aditya Nagar, ADB Road, Surampalem, Kakinada District, Andhra Pradesh, India – 533437
                  </span>
                </p>
                <p className="mt-2 flex items-center gap-2">
                  <Phone size={15} className="text-accent-400 shrink-0" />
                  <span>+91 9989 776661</span>
                </p>
                <p className="mt-1 flex items-center gap-2">
                  <Mail size={15} className="text-accent-400 shrink-0" />
                  <span>info@adityauniversity.in</span>
                </p>
              </div>
            </div>

            {/* Col 2: Navigation */}
            <div>
              <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-white">
                Quick Navigation
              </h4>
              <ul className="mt-4 space-y-2 text-xs text-slate-400">
                <li>
                  <button onClick={() => onExploreCampus()} className="hover:text-accent-400 transition-colors">
                    Interactive Campus Map
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('schools')} className="hover:text-accent-400 transition-colors">
                    Schools of Study
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('why-us')} className="hover:text-accent-400 transition-colors">
                    Technical Hub Incubation
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('placements')} className="hover:text-accent-400 transition-colors">
                    Placement Cell & Recruiters
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Portal Links */}
            <div>
              <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-white">
                Official Links
              </h4>
              <ul className="mt-4 space-y-2 text-xs text-slate-400">
                <li>
                  <a
                    href="https://adityauniversity.in"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 hover:text-accent-400 transition-colors"
                  >
                    <span>Main University Portal</span>
                    <ExternalLink size={12} />
                  </a>
                </li>
                <li>
                  <a
                    href="https://technicalhub.io"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 hover:text-accent-400 transition-colors"
                  >
                    <span>Technical Hub Portal</span>
                    <ExternalLink size={12} />
                  </a>
                </li>
                <li>
                  <span className="text-slate-500">Student Grievance & Anti-Ragging</span>
                </li>
                <li>
                  <span className="text-slate-500">NIRF Disclosures</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright & Project Disclaimer */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs text-slate-500">
            <p>
              © {new Date().getFullYear()} Aditya University SmartCampus Initiative.
            </p>
            <p className="max-w-md text-[11px] text-slate-400/80">
              * Notice: This is a student competition project inspired by Aditya University, showcasing high-fidelity geocoded navigation and digital accessibility.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
