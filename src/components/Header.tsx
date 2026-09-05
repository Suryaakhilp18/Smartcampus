import { LocateFixed, Moon, Sun, Presentation, Compass, ArrowLeft, Sparkles } from 'lucide-react';
import SearchBar from './SearchBar';
import type { CampusLocation } from '../data/campusData';

interface Props {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onLocateMe: () => void;
  query: string;
  onQueryChange: (q: string) => void;
  results: { location: CampusLocation; distance: number }[];
  onSelectResult: (loc: CampusLocation) => void;
  isDemoMode: boolean;
  onTogglePresentation?: () => void;
  onOpenDirectory?: () => void;
  onNavigateHome?: () => void;
  onOpenAi?: () => void;
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export default function Header({
  theme,
  onToggleTheme,
  onLocateMe,
  query,
  onQueryChange,
  results,
  onSelectResult,
  isDemoMode,
  onTogglePresentation,
  onOpenDirectory,
  onNavigateHome,
  onOpenAi,
  sidebarOpen,
  onToggleSidebar,
}: Props) {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-40 flex items-center justify-between gap-2 p-2 sm:gap-3 sm:p-3">
      {/* Brand Lockup + Home Affordance */}
      <div className="glass-panel pointer-events-auto flex shrink-0 items-center gap-2 rounded-2xl px-2.5 py-1.5 sm:px-3 sm:py-2 transition-all shadow-card border-brand-100/60 dark:border-brand-800/40">
        {onNavigateHome && (
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-accent-500 dark:hover:text-accent-400 py-1 px-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Return to Aditya University Homepage"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Home</span>
          </button>
        )}

        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 group"
          title="Aditya University Home"
        >
          <img
            src="/aditya-logo.svg"
            alt="Aditya University Logo"
            className="h-7 sm:h-8 w-auto object-contain transition-transform group-hover:scale-105"
          />
        </button>

        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-bold text-xs transition-all shadow-xs border ${
              sidebarOpen
                ? 'bg-accent-500 text-white border-transparent shadow-cta'
                : 'bg-brand-50 hover:bg-brand-100/80 text-brand-800 dark:bg-brand-900/60 dark:text-brand-200 border-brand-200/60 dark:border-brand-800/40'
            }`}
            title={sidebarOpen ? 'Close Campus Zones' : 'Open Campus Zones & Filters'}
          >
            <Compass size={14} className={sidebarOpen ? 'text-white' : 'text-accent-500'} />
            <span className="hidden sm:inline">Zones</span>
          </button>
        )}

        {isDemoMode && (
          <span className="ml-1 hidden md:inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700 dark:text-amber-300">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            Demo Mode
          </span>
        )}
      </div>

      {/* Central Search Bar */}
      <div className="pointer-events-auto flex-1 max-w-xl">
        <SearchBar
          query={query}
          onQueryChange={onQueryChange}
          results={results}
          onSelectResult={onSelectResult}
          onAskAi={onOpenAi}
        />
      </div>

      {/* Right Controls */}
      <div className="glass-panel pointer-events-auto flex shrink-0 items-center gap-1 sm:gap-1.5 rounded-2xl p-1.5 shadow-card border-brand-100/60 dark:border-brand-800/40">
        <button
          onClick={onLocateMe}
          className="icon-btn h-8 sm:h-9 w-8 sm:w-9 text-brand-700 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-900/50"
          title="Locate my position on campus"
        >
          <LocateFixed size={17} />
        </button>

        {onOpenDirectory && (
          <button
            onClick={onOpenDirectory}
            className="flex items-center gap-1.5 px-2.5 h-8 sm:h-9 rounded-xl font-bold text-xs bg-brand-50 hover:bg-brand-100/80 text-brand-700 dark:bg-brand-900/60 dark:text-brand-300 dark:hover:bg-brand-800 transition-all border border-brand-200/50 dark:border-brand-800/40 shadow-2xs"
            title="Open Complete Campus Directory List (58 Places)"
          >
            <Compass size={15} className="text-accent-500" />
            <span className="hidden md:inline">Directory</span>
          </button>
        )}

        {onOpenAi && (
          <button
            onClick={() => onOpenAi()}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 h-8 sm:h-9 rounded-xl font-extrabold text-xs bg-gradient-to-r from-accent-500 to-amber-500 hover:from-accent-600 hover:to-amber-600 text-white transition-all shadow-cta"
            title="Ask Aditya AI Campus Copilot"
          >
            <Sparkles size={14} className="text-amber-200 animate-pulse" />
            <span className="font-heading">Ask AI</span>
          </button>
        )}

        {onTogglePresentation && (
          <button
            onClick={onTogglePresentation}
            className="icon-btn h-8 sm:h-9 w-8 sm:w-9 text-accent-600 dark:text-accent-400 hover:bg-accent-50 dark:hover:bg-accent-500/10"
            title="Presentation / Tour Mode"
          >
            <Presentation size={17} />
          </button>
        )}

        <button
          onClick={onToggleTheme}
          className="icon-btn h-8 sm:h-9 w-8 sm:w-9 text-brand-700 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-900/50"
          title="Toggle Light / Dark theme"
        >
          {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
        </button>
      </div>
    </header>
  );
}
