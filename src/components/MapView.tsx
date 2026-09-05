// ============================================================================
// MapView — top-level map wrapper. Chooses between the real Google Map
// (GoogleMapCanvas) and the custom fallback (DemoMapCanvas) based on
// whether the Maps JS API loaded successfully, and contains a safety
// ErrorBoundary to ensure the user never sees a broken/white screen.
// ============================================================================
import React, { Component, type ReactNode } from 'react';
import { Sparkles } from 'lucide-react';
import type { MapsLoadStatus } from '../hooks/useGoogleMaps';
import GoogleMapCanvas from './GoogleMapCanvas';
import DemoMapCanvas from './DemoMapCanvas';
import type { CampusLocation } from '../data/campusData';
import type { RouteResult } from '../utils/routing';

interface Props {
  status: MapsLoadStatus;
  locations: CampusLocation[];
  selectedId: string | null;
  onSelect: (loc: CampusLocation) => void;
  theme: 'light' | 'dark';
  showHeatmap: boolean;
  showBuildings: boolean;
  userLocation: { lat: number; lng: number };
  route: RouteResult | null;
  emergencyIds?: string[];
}

interface ErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class MapErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.warn('Map ErrorBoundary caught error, falling back to DemoMapCanvas:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export default function MapView(props: Props) {
  const { status } = props;

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="relative h-full w-full overflow-hidden bg-slate-100 dark:bg-campus-darkSurface">
        <div className="skeleton absolute inset-0 opacity-60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <Sparkles className="h-8 w-8 animate-pulse text-accent-500" />
          <p className="text-sm font-semibold text-brand-900 dark:text-brand-200 font-heading">
            Loading Aditya University SmartCampus…
          </p>
        </div>
      </div>
    );
  }

  const isDemo = status === 'no-key' || status === 'error';

  return (
    <div className="relative h-full w-full">
      {isDemo ? (
        <DemoMapCanvas {...props} />
      ) : (
        <MapErrorBoundary fallback={<DemoMapCanvas {...props} />}>
          <GoogleMapCanvas {...props} />
        </MapErrorBoundary>
      )}
    </div>
  );
}
