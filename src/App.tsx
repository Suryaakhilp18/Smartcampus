import { useEffect, useMemo, useState, useCallback } from 'react';
import { Sparkles, Layers, Flame, ShieldAlert, X, Accessibility, Compass } from 'lucide-react';
import Header from './components/Header';
import MapView from './components/MapView';
import PlaceCard from './components/PlaceCard';
import LayerControl from './components/LayerControl';
import RoutePanel from './components/RoutePanel';
import SmartCampusPanel from './components/SmartCampusPanel';
import EmergencyPanel from './components/EmergencyPanel';
import AccessibilityPanel from './components/AccessibilityPanel';
import { type PulsePeriod } from './components/CampusPulse';
import LeftTaskbar from './components/LeftTaskbar';
import PresentationMode from './components/PresentationMode';
import Toast, { type ToastMessage } from './components/Toast';
import CategoryFilter from './components/CategoryFilter';
import CampusDirectoryModal from './components/CampusDirectoryModal';
import OnboardingCoachmark from './components/OnboardingCoachmark';
import HomePage from './components/HomePage';
import CampusAiModal from './components/CampusAiModal';
import { useGoogleMaps } from './hooks/useGoogleMaps';
import { useCampusSearch } from './hooks/useCampusSearch';
import {
  campusLocations,
  CATEGORY_META,
  DEMO_USER_LOCATION,
  type CampusCategory,
  type CampusLocation,
} from './data/campusData';
import { distanceMeters, simulateRoute, type LatLng, type RouteProfile, type RouteResult, type TravelMode } from './utils/routing';

const ALL_CATEGORIES = new Set(Object.keys(CATEGORY_META) as CampusCategory[]);

type PanelKind = 'none' | 'layers' | 'smart-campus' | 'emergency' | 'accessibility';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'map'>(() => {
    if (typeof window !== 'undefined' && window.location.hash.startsWith('#/map')) {
      return 'map';
    }
    return 'home';
  });

  const { status, isDemoMode } = useGoogleMaps(currentView === 'map');

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('smartcampus_theme');
      if (saved === 'light' || saved === 'dark') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'dark';
    }
  });

  const [activeLayers, setActiveLayers] = useState<Set<CampusCategory>>(() => new Set(ALL_CATEGORIES));
  const [showBuildings, setShowBuildings] = useState(false);
  const [activeCategories, setActiveCategories] = useState<Set<CampusCategory>>(
    () => new Set<CampusCategory>()
  );
  const [userLocation, setUserLocation] = useState<LatLng>(DEMO_USER_LOCATION);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [panel, setPanel] = useState<PanelKind>('none');
  const [routingFor, setRoutingFor] = useState<CampusLocation | null>(null);
  const [activeRoute, setActiveRoute] = useState<RouteResult | null>(null);
  const [routeMinimized, setRouteMinimized] = useState(false);
  const [accessibilityMode, setAccessibilityMode] = useState(false);
  const [pulsePeriod, setPulsePeriod] = useState<PulsePeriod>('morning');
  const [presenting, setPresenting] = useState(false);
  const [taskbarOpen, setTaskbarOpen] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [directoryOpen, setDirectoryOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiInitialPrompt, setAiInitialPrompt] = useState('');

  const { query, setQuery, results } = useCampusSearch(userLocation);

  const pushToast = useCallback((text: string, kind?: ToastMessage['kind']) => {
    setToasts((prev) => [...prev, { id: Date.now() + Math.random(), text, kind }]);
  }, []);
  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleOpenAi = useCallback((prompt?: unknown) => {
    const textPrompt = typeof prompt === 'string' ? prompt : '';
    setAiInitialPrompt(textPrompt);
    setAiModalOpen(true);
  }, []);

  useEffect(() => {
    const isDark = theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
    try {
      localStorage.setItem('smartcampus_theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash.startsWith('#/map')) {
        setCurrentView('map');
      } else {
        setCurrentView('home');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleExploreCampus = useCallback((category?: CampusCategory, targetLocationId?: string) => {
    if (category) {
      setActiveCategories(new Set([category]));
    }
    if (targetLocationId) {
      setSelectedId(targetLocationId);
    }
    window.location.hash = '#/map';
    setCurrentView('map');
    pushToast('Welcome to Aditya University SmartCampus Map.', 'info');
  }, [pushToast]);

  const handleNavigateHome = useCallback(() => {
    window.location.hash = '';
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (currentView !== 'map') return;
    if (isDemoMode) {
      const t = setTimeout(() => pushToast('Running in Demo Mode — interactive offline campus map active.', 'info'), 600);
      return () => clearTimeout(t);
    } else if (status === 'ready') {
      const t = setTimeout(() => pushToast('Google Maps API connected with Advanced Markers.', 'success'), 600);
      return () => clearTimeout(t);
    }
  }, [currentView, isDemoMode, status, pushToast]);

  const visibleLocations = useMemo(() => {
    const isAll = activeCategories.size === 0 || activeCategories.size >= ALL_CATEGORIES.size;
    if (isAll) return campusLocations;
    return campusLocations.filter(
      (l) =>
        activeCategories.has(l.category) ||
        selectedId === l.id ||
        routingFor?.id === l.id
    );
  }, [activeCategories, selectedId, routingFor]);

  const emergencyIds = panel === 'emergency' ? campusLocations.filter((l) => l.emergencyType).map((l) => l.id) : [];

  const selectedLocation = campusLocations.find((l) => l.id === selectedId) ?? null;
  const selectedDistance = selectedLocation ? distanceMeters(userLocation, selectedLocation) : 0;

  function handleSelectLocation(loc: CampusLocation) {
    setSelectedId(loc.id);
    setPanel('none');
    setRoutingFor(null);
    setActiveRoute(null);
    setQuery('');
    setMobileSheetOpen(false);
  }

  function handleToggleCategory(cat: CampusCategory) {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  function handleToggleLayer(cat: CampusCategory) {
    setActiveLayers((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  function handleLocateMe() {
    if (!navigator.geolocation) {
      pushToast('Geolocation unavailable — centered on Aditya University demo location.', 'warning');
      setUserLocation(DEMO_USER_LOCATION);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        pushToast('Location updated.', 'success');
      },
      () => {
        pushToast('Location permission denied — centered on Aditya University demo location.', 'warning');
        setUserLocation(DEMO_USER_LOCATION);
      },
      { timeout: 5000 }
    );
  }

  function handleToggleSave(id: string) {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        pushToast('Removed from saved places.', 'info');
      } else {
        next.add(id);
        pushToast('Saved to campus favorites.', 'success');
      }
      return next;
    });
  }

  function handleNavigate(loc: CampusLocation) {
    setRoutingFor(loc);
    setSelectedId(loc.id);
    setPanel('none');
    const defaultProfile = accessibilityMode ? 'accessible' : 'fastest';
    const route = simulateRoute(userLocation, loc, 'WALKING', defaultProfile);
    setActiveRoute(route);
    setRouteMinimized(true);
    pushToast(`Navigating to ${loc.name} (${route.durationMinutes} min) · Panel minimized for clear map view`, 'success');
  }

  const handleAiRouteToLocation = useCallback((loc: CampusLocation) => {
    setSelectedId(loc.id);
    setRoutingFor(loc);
    setPanel('none');
    const route = simulateRoute(userLocation, loc, 'WALKING', 'fastest');
    setActiveRoute(route);
    setRouteMinimized(true);
    pushToast(`Route to ${loc.name} (${route.durationMinutes} min)`, 'success');
  }, [userLocation, pushToast]);

  function handleSelectRoute(profile: RouteProfile, mode: TravelMode) {
    if (!routingFor) return;
    const route = simulateRoute(userLocation, routingFor, mode, profile);
    setActiveRoute(route);
    setRouteMinimized(true);
    pushToast(`Route set: ${route.label} (${mode.toLowerCase()}) · ${route.durationMinutes} min`, 'success');
  }

  function closeRouting() {
    setRoutingFor(null);
    setActiveRoute(null);
    setRouteMinimized(false);
  }

  const handlePulseChange = useCallback((period: PulsePeriod) => {
    setPulsePeriod(period);
    if (period === 'morning') {
      setActiveCategories(new Set<CampusCategory>(['academic', 'food', 'facilities']));
      pushToast('🌅 Morning Active: Academic Bhavans, Breakfast Canteens & Transit Terminal', 'info');
    } else if (period === 'afternoon') {
      setActiveCategories(new Set<CampusCategory>(['food', 'labs', 'facilities']));
      pushToast('☀️ Afternoon Active: Canteens, Technical Hub & Central Library', 'info');
    } else if (period === 'evening') {
      setActiveCategories(new Set<CampusCategory>(['facilities', 'events', 'food']));
      pushToast('🌙 Evening Active: Sports Stadium, Student Hostels, Canteens & Temples', 'info');
    }
  }, [pushToast]);

  const handleShowAllLocations = useCallback(() => {
    setActiveCategories(new Set<CampusCategory>(ALL_CATEGORIES));
    setActiveLayers(new Set<CampusCategory>(ALL_CATEGORIES));
    pushToast('Showing all 58 campus locations', 'success');
  }, [pushToast]);

  function togglePanel(kind: PanelKind) {
    setPanel((prev) => (prev === kind ? 'none' : kind));
    if (kind !== 'none') {
      setSelectedId(null);
      setRoutingFor(null);
    }
  }

  if (currentView === 'home') {
    return (
      <div className="relative min-h-screen w-full transition-colors duration-300">
        <HomePage
          onExploreCampus={handleExploreCampus}
          theme={theme}
          onToggleTheme={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
        />
        <Toast toasts={toasts} onDismiss={dismissToast} />
      </div>
    );
  }

  return (
    <div className={`relative h-screen w-screen overflow-hidden ${theme === 'dark' ? 'bg-[#07101E]' : 'bg-[#F5F5F5]'} transition-colors duration-300`}>
      {/* Dynamic Map Canvas */}
      <MapView
        status={status}
        locations={visibleLocations}
        selectedId={selectedId}
        onSelect={handleSelectLocation}
        theme={theme}
        showHeatmap={showHeatmap}
        showBuildings={showBuildings}
        userLocation={userLocation}
        route={activeRoute}
        emergencyIds={emergencyIds}
      />

      {/* Top Floating App Header */}
      <Header
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
        onLocateMe={handleLocateMe}
        query={query}
        onQueryChange={setQuery}
        results={results}
        onSelectResult={handleSelectLocation}
        isDemoMode={isDemoMode}
        onTogglePresentation={() => setPresenting((p) => !p)}
        onOpenDirectory={() => setDirectoryOpen(true)}
        onNavigateHome={handleNavigateHome}
        onOpenAi={handleOpenAi}
        sidebarOpen={taskbarOpen}
        onToggleSidebar={() => setTaskbarOpen((v) => !v)}
      />

      {/* Vertical Left Taskbar (Docked on Left Side) */}
      {taskbarOpen && (
        <div className="pointer-events-none absolute left-3 top-16 z-30 hidden md:block animate-fade-in">
          <LeftTaskbar
            activeCategories={activeCategories}
            onToggleCategory={handleToggleCategory}
            onShowAllLocations={handleShowAllLocations}
            pulsePeriod={pulsePeriod}
            onSelectPulse={handlePulseChange}
            onOpenLayers={() => togglePanel('layers')}
            onToggleHeatmap={() => setShowHeatmap((v) => !v)}
            showHeatmap={showHeatmap}
            onToggleAccessibility={() => {
              setAccessibilityMode((v) => !v);
              togglePanel('accessibility');
            }}
            accessibilityMode={accessibilityMode}
            onOpenDirectory={() => setDirectoryOpen(true)}
            onOpenAi={handleOpenAi}
            onOpenEmergency={() => togglePanel('emergency')}
          />
        </div>
      )}

      {/* Mobile Floating Controls */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex flex-col items-center gap-2 p-3 lg:hidden">
        {!mobileSheetOpen && (
          <div className="pointer-events-auto flex w-full max-w-md items-center justify-between gap-2">
            <button
              onClick={() => setMobileSheetOpen(true)}
              className="glass-panel flex flex-1 items-center justify-center gap-2 rounded-2xl px-3 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-card"
            >
              Explore Zones
            </button>
            <button
              onClick={() => setDirectoryOpen(true)}
              className="glass-panel flex items-center justify-center gap-1.5 rounded-2xl px-3 py-2.5 text-xs font-bold text-brand-700 dark:text-brand-300 shadow-card border border-brand-200/50 dark:border-brand-800/40"
              title="Open Directory List"
            >
              <Compass size={15} className="text-accent-500" />
              <span>List</span>
            </button>
            <button
              onClick={() => handleOpenAi()}
              className="glass-panel flex items-center justify-center gap-1.5 rounded-2xl px-3 py-2.5 text-xs font-bold text-accent-700 dark:text-accent-300 shadow-card border border-accent-500/30"
              title="Ask Campus AI Copilot"
            >
              <Sparkles size={15} className="text-accent-500 animate-pulse" />
              <span>AI</span>
            </button>
            <button
              onClick={() => togglePanel('smart-campus')}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-accent-500 text-white shadow-cta transition-transform active:scale-95"
              aria-label="Smart Campus"
            >
              <Sparkles size={17} />
            </button>
            <button
              onClick={() => togglePanel('emergency')}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-red-600 text-white shadow-md transition-transform active:scale-95"
              aria-label="Emergency Mode"
            >
              <ShieldAlert size={17} />
            </button>
          </div>
        )}
        {mobileSheetOpen && (
          <div className="glass-panel-strong animate-fade-in pointer-events-auto w-full max-w-md rounded-2xl p-4 shadow-glass-lg">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white font-heading">
                Explore Aditya Campus
              </h2>
              <button onClick={() => setMobileSheetOpen(false)} className="icon-btn h-7 w-7 text-slate-400">
                <X size={14} />
              </button>
            </div>
            <button
              onClick={() => {
                setMobileSheetOpen(false);
                setDirectoryOpen(true);
              }}
              className="w-full mb-3 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-brand-200/80 dark:border-brand-800/60 bg-brand-50/70 dark:bg-brand-900/30 text-brand-800 dark:text-brand-200 text-xs font-bold"
            >
              <Compass size={15} className="text-accent-500" />
              <span>Browse Full Directory Index (58 Places)</span>
            </button>
            <CategoryFilter activeCategories={activeCategories} onToggleCategory={handleToggleCategory} />
            <div className="mt-3 grid grid-cols-3 gap-1.5">
              <button
                onClick={() => togglePanel('layers')}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200/70 bg-white/50 px-2 py-2 text-xs font-semibold text-slate-700 dark:border-brand-800/40 dark:bg-campus-cardDark/60 dark:text-slate-200"
              >
                <Layers size={14} />
                Layers
              </button>
              <button
                onClick={() => setShowHeatmap((v) => !v)}
                className={`flex items-center justify-center gap-1.5 rounded-xl border px-2 py-2 text-xs font-semibold ${
                  showHeatmap
                    ? 'border-transparent bg-red-500 text-white'
                    : 'border-slate-200/70 bg-white/50 text-slate-700 dark:border-brand-800/40 dark:bg-campus-cardDark/60 dark:text-slate-200'
                }`}
              >
                <Flame size={14} />
                Activity
              </button>
              <button
                onClick={() => {
                  setAccessibilityMode((v) => !v);
                  togglePanel('accessibility');
                }}
                className={`flex items-center justify-center gap-1.5 rounded-xl border px-2 py-2 text-xs font-semibold ${
                  accessibilityMode
                    ? 'border-transparent bg-emerald-600 text-white'
                    : 'border-slate-200/70 bg-white/50 text-slate-700 dark:border-brand-800/40 dark:bg-campus-cardDark/60 dark:text-slate-200'
                }`}
              >
                <Accessibility size={14} />
                Access
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom-Left Clean Floating Utility Buttons (Google Maps style) */}
      <div className="pointer-events-none absolute bottom-6 left-6 z-30 hidden lg:flex items-center gap-2">
        <button
          onClick={() => togglePanel('layers')}
          className="pointer-events-auto glass-panel-strong flex items-center gap-2 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-card hover:scale-105 active:scale-95 transition-all border border-slate-200/80 dark:border-brand-800/60"
          title="Toggle 3D Buildings & Layers"
        >
          <Layers size={15} className="text-brand-600 dark:text-brand-400" />
          <span>Layers</span>
        </button>
        <button
          onClick={() => togglePanel('emergency')}
          className="pointer-events-auto flex items-center gap-2 rounded-2xl bg-red-600 hover:bg-red-700 px-3.5 py-2.5 text-xs font-bold text-white shadow-md hover:scale-105 active:scale-95 transition-all"
          title="24/7 Campus Emergency & Medical SOS"
        >
          <ShieldAlert size={15} />
          <span>Emergency SOS</span>
        </button>
      </div>

      {/* Center-Bottom Floating Panels (Desktop) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-5 z-30 hidden justify-center px-4 lg:flex">
        <div className="pointer-events-auto flex flex-col items-center gap-3">
          {panel === 'layers' && (
            <LayerControl
              activeLayers={activeLayers}
              onToggleLayer={handleToggleLayer}
              showBuildings={showBuildings}
              onToggleBuildings={() => setShowBuildings((v) => !v)}
              onClose={() => setPanel('none')}
            />
          )}
          {panel === 'smart-campus' && (
            <SmartCampusPanel
              userLocation={userLocation}
              onClose={() => setPanel('none')}
              onSelectLocation={handleSelectLocation}
              pulsePeriod={pulsePeriod}
            />
          )}
          {panel === 'emergency' && (
            <EmergencyPanel
              userLocation={userLocation}
              onClose={() => setPanel('none')}
              onNavigateTo={handleNavigate}
            />
          )}
          {panel === 'accessibility' && (
            <AccessibilityPanel
              enabled={accessibilityMode}
              onToggle={() => setAccessibilityMode((v) => !v)}
              onClose={() => setPanel('none')}
            />
          )}

          {routingFor && (
            <RoutePanel
              destination={routingFor}
              origin={userLocation}
              onClose={closeRouting}
              onSelectRoute={handleSelectRoute}
              activeProfile={activeRoute?.profile ?? null}
              accessibilityMode={accessibilityMode}
              minimized={routeMinimized}
              onToggleMinimize={() => setRouteMinimized((v) => !v)}
            />
          )}

          {selectedLocation && !routingFor && (
            <PlaceCard
              location={selectedLocation}
              distance={selectedDistance}
              saved={savedIds.has(selectedLocation.id)}
              onToggleSave={() => handleToggleSave(selectedLocation.id)}
              onNavigate={() => handleNavigate(selectedLocation)}
              onClose={() => setSelectedId(null)}
              onShowDetails={() => pushToast(selectedLocation.description, 'info')}
            />
          )}
        </div>
      </div>

      {/* Mobile Bottom Sheet for selection/routing/panels */}
      <div className="pointer-events-none absolute inset-x-0 bottom-16 z-40 flex justify-center px-3 lg:hidden">
        <div className="pointer-events-auto w-full max-w-md">
          {panel === 'layers' && (
            <LayerControl
              activeLayers={activeLayers}
              onToggleLayer={handleToggleLayer}
              showBuildings={showBuildings}
              onToggleBuildings={() => setShowBuildings((v) => !v)}
              onClose={() => setPanel('none')}
            />
          )}
          {panel === 'smart-campus' && (
            <SmartCampusPanel
              userLocation={userLocation}
              onClose={() => setPanel('none')}
              onSelectLocation={handleSelectLocation}
              pulsePeriod={pulsePeriod}
            />
          )}
          {panel === 'emergency' && (
            <EmergencyPanel
              userLocation={userLocation}
              onClose={() => setPanel('none')}
              onNavigateTo={handleNavigate}
            />
          )}
          {panel === 'accessibility' && (
            <AccessibilityPanel
              enabled={accessibilityMode}
              onToggle={() => setAccessibilityMode((v) => !v)}
              onClose={() => setPanel('none')}
            />
          )}
          {routingFor && (
            <RoutePanel
              destination={routingFor}
              origin={userLocation}
              onClose={closeRouting}
              onSelectRoute={handleSelectRoute}
              activeProfile={activeRoute?.profile ?? null}
              accessibilityMode={accessibilityMode}
              minimized={routeMinimized}
              onToggleMinimize={() => setRouteMinimized((v) => !v)}
            />
          )}
          {selectedLocation && !routingFor && panel === 'none' && (
            <PlaceCard
              location={selectedLocation}
              distance={selectedDistance}
              saved={savedIds.has(selectedLocation.id)}
              onToggleSave={() => handleToggleSave(selectedLocation.id)}
              onNavigate={() => handleNavigate(selectedLocation)}
              onClose={() => setSelectedId(null)}
              onShowDetails={() => pushToast(selectedLocation.description, 'info')}
            />
          )}
        </div>
      </div>

      {/* Presentation Tour Deck */}
      {presenting && <PresentationMode onExit={() => setPresenting(false)} />}

      {/* Searchable Campus Directory Modal (All 58 Locations) */}
      <CampusDirectoryModal
        isOpen={directoryOpen}
        onClose={() => setDirectoryOpen(false)}
        onSelectLocation={handleSelectLocation}
        userLocation={userLocation}
      />

      {/* AI Campus Copilot Modal */}
      <CampusAiModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        userLocation={userLocation}
        onSelectLocation={handleSelectLocation}
        onRouteToLocation={handleAiRouteToLocation}
        onFilterCategory={handleToggleCategory}
        initialPrompt={aiInitialPrompt}
      />

      {/* First-Run Visitor Guidance */}
      <OnboardingCoachmark onOpenDirectory={() => setDirectoryOpen(true)} />

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
