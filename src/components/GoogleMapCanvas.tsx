// ============================================================================
// GoogleMapCanvas — renders the real Google Map using the Maps JavaScript
// API, with Advanced Markers, building footprint polygons, custom university
// route polyline, and activity heatmap circles.
// ============================================================================
import { useEffect, useRef, useState } from 'react';
import { CAMPUS_CENTER, CAMPUS_ZOOM, CATEGORY_META, type CampusLocation } from '../data/campusData';
import { MAP_OPTIONS_BASE, lightMapStyle, darkMapStyle } from '../utils/mapStyles';
import type { RouteResult } from '../utils/routing';

interface Props {
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

const ACTIVITY_COLOR: Record<string, string> = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#10b981',
};
const ACTIVITY_RADIUS: Record<string, number> = { high: 55, medium: 40, low: 28 };

function buildMarkerContent(
  loc: CampusLocation,
  selected: boolean,
  isEmergency: boolean,
  onSelect: (loc: CampusLocation) => void
): HTMLDivElement {
  const el = document.createElement('div');
  const size = selected ? 42 : (isEmergency ? 38 : 32);
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.borderRadius = '50%';
  el.style.background = isEmergency ? '#EF4444' : (loc.color === '#0B2D6B' ? (selected ? '#F5821F' : '#0B2D6B') : loc.color);
  el.style.border = selected ? '3px solid #FFFFFF' : (isEmergency ? '3px solid #FCA5A5' : '2px solid white');
  el.style.boxShadow = selected
    ? '0 0 0 4px rgba(245, 130, 31, 0.6), 0 8px 20px rgba(0,0,0,0.4)'
    : isEmergency
    ? '0 0 0 4px rgba(239, 68, 68, 0.6), 0 8px 20px rgba(0,0,0,0.4)'
    : '0 2px 8px rgba(0,0,0,0.25)';
  el.style.display = 'flex';
  el.style.alignItems = 'center';
  el.style.justifyContent = 'center';
  el.style.fontSize = `${size * 0.48}px`;
  el.style.cursor = 'pointer';
  el.style.transition = 'all 180ms ease-out';
  el.style.transform = selected ? 'scale(1.2) translateY(-3px)' : (isEmergency ? 'scale(1.1)' : 'scale(1)');
  el.title = loc.name;
  el.textContent = loc.icon || CATEGORY_META[loc.category].emoji;

  el.addEventListener('mouseenter', () => {
    el.style.transform = 'scale(1.25) translateY(-3px)';
    el.style.boxShadow = '0 6px 16px rgba(245, 130, 31, 0.45)';
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = selected ? 'scale(1.2) translateY(-3px)' : (isEmergency ? 'scale(1.1)' : 'scale(1)');
    el.style.boxShadow = selected
      ? '0 0 0 4px rgba(245, 130, 31, 0.6), 0 8px 20px rgba(0,0,0,0.4)'
      : isEmergency
      ? '0 0 0 4px rgba(239, 68, 68, 0.6), 0 8px 20px rgba(0,0,0,0.4)'
      : '0 2px 8px rgba(0,0,0,0.25)';
  });

  el.addEventListener('click', (e) => {
    e.stopPropagation();
    onSelect(loc);
  });

  return el;
}

export default function GoogleMapCanvas({
  locations,
  selectedId,
  onSelect,
  theme,
  showHeatmap,
  showBuildings,
  userLocation,
  route,
  emergencyIds, 
}: Props) {
  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, google.maps.marker.AdvancedMarkerElement>>(new Map());
  const polygonsRef = useRef<google.maps.Polygon[]>([]);
  const circlesRef = useRef<google.maps.Circle[]>([]);
  const routeLineRef = useRef<google.maps.Polyline | null>(null);
  const userMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);

  const [, setCurrentZoom] = useState<number>(CAMPUS_ZOOM);

  // Initialize map with retry in case Google Maps SDK loads just after component mount
  useEffect(() => {
    if (mapRef.current) return;

    const initMap = () => {
      if (!mapDivRef.current || mapRef.current) return false;
      if (typeof window.google?.maps?.Map !== 'function') return false;

      const isDark = theme === 'dark';
      try {
        const mapInstance = new google.maps.Map(mapDivRef.current, {
          ...MAP_OPTIONS_BASE,
          center: CAMPUS_CENTER,
          zoom: CAMPUS_ZOOM,
          mapId: 'DEMO_MAP_ID',
          internalUsageAttributionIds: ['gmp_git_agentskills_v1'] as any,
          styles: isDark ? darkMapStyle : lightMapStyle,
        });

        if ((window.google?.maps as any)?.ColorScheme) {
          (mapInstance as any).setOptions({
            colorScheme: isDark
              ? (window.google.maps as any).ColorScheme.DARK
              : (window.google.maps as any).ColorScheme.LIGHT,
          });
        }

        mapRef.current = mapInstance;

        mapInstance.addListener('zoom_changed', () => {
          const z = mapInstance.getZoom();
          if (typeof z === 'number') {
            setCurrentZoom(z);
          }
        });

        return true;
      } catch (err) {
        console.warn('Could not initialize Google Maps instance:', err);
        return false;
      }
    };

    if (!initMap()) {
      const interval = setInterval(() => {
        if (initMap()) {
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [theme]);

  // Smoothly update Google Maps color scheme / styles on theme change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const isDark = theme === 'dark';

    try {
      if ((window.google?.maps as any)?.ColorScheme) {
        (map as any).setOptions({
          colorScheme: isDark
            ? (window.google.maps as any).ColorScheme.DARK
            : (window.google.maps as any).ColorScheme.LIGHT,
        });
      }
    } catch {
      // ignore
    }

    try {
      map.setOptions({
        styles: isDark ? darkMapStyle : lightMapStyle,
      });
    } catch {
      // ignore
    }
  }, [theme]);

  // Markers: All locations render reliably with custom icons and direct click selection
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (typeof window.google?.maps?.marker?.AdvancedMarkerElement !== 'function') return;

    const activeIds = new Set(locations.map((l) => l.id));

    // Remove any markers no longer in current locations list
    markersRef.current.forEach((marker, id) => {
      if (!activeIds.has(id)) {
        marker.map = null;
        markersRef.current.delete(id);
      }
    });

    locations.forEach((loc) => {
      const existing = markersRef.current.get(loc.id);
      const selected = selectedId === loc.id;
      const isEmergency = (emergencyIds ?? []).includes(loc.id);

      if (existing) {
        existing.content = buildMarkerContent(loc, selected, isEmergency, onSelect);
        existing.zIndex = selected || isEmergency ? 999 : undefined;
        return;
      }

      try {
        const marker = new google.maps.marker.AdvancedMarkerElement({
          map,
          position: { lat: loc.lat, lng: loc.lng },
          content: buildMarkerContent(loc, selected, isEmergency, onSelect),
          title: loc.name,
          zIndex: selected || isEmergency ? 999 : undefined,
        });

        marker.addListener('click', () => onSelect(loc));
        marker.addListener('gmp-click', () => onSelect(loc));

        if (marker.element) {
          marker.element.addEventListener('click', (e: Event) => {
            e.stopPropagation();
            onSelect(loc);
          });
        }

        markersRef.current.set(loc.id, marker);
      } catch (err) {
        console.warn(`Could not create AdvancedMarkerElement for ${loc.id}:`, err);
      }
    });
  }, [locations, selectedId, emergencyIds, onSelect]);

  // Pan to selected location smoothly
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedId || route) return;
    const loc = locations.find((l) => l.id === selectedId);
    if (loc) {
      map.panTo({ lat: loc.lat, lng: loc.lng });
      const currentZoomVal = map.getZoom();
      if (currentZoomVal && currentZoomVal < 17) {
        map.setZoom(17);
      }
    }
  }, [selectedId, locations, route]);

  // Building footprints
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    polygonsRef.current.forEach((p) => p.setMap(null));
    polygonsRef.current = [];
    if (!showBuildings) return;

    locations
      .filter((l) => l.isBuilding && l.footprint)
      .forEach((b) => {
        try {
          const poly = new google.maps.Polygon({
            paths: b.footprint,
            strokeColor: b.color === '#0B2D6B' ? '#F5821F' : b.color,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: b.color,
            fillOpacity: 0.18,
            map,
          });
          polygonsRef.current.push(poly);
        } catch (err) {
          console.warn('Could not draw polygon:', err);
        }
      });
  }, [locations, showBuildings]);

  // Heatmap circles
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    circlesRef.current.forEach((c) => c.setMap(null));
    circlesRef.current = [];
    if (!showHeatmap) return;

    locations.forEach((loc) => {
      const level = loc.activityLevel || 'low';
      try {
        const circle = new google.maps.Circle({
          strokeColor: ACTIVITY_COLOR[level],
          strokeOpacity: 0.7,
          strokeWeight: 1.5,
          fillColor: ACTIVITY_COLOR[level],
          fillOpacity: 0.28,
          map,
          center: { lat: loc.lat, lng: loc.lng },
          radius: ACTIVITY_RADIUS[level],
        });
        circlesRef.current.push(circle);
      } catch (err) {
        console.warn('Could not create heatmap circle:', err);
      }
    });
  }, [locations, showHeatmap]);

  // Render polyline for route
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (routeLineRef.current) {
      routeLineRef.current.setMap(null);
      routeLineRef.current = null;
    }

    if (!route || route.path.length === 0) return;

    try {
      const polyline = new google.maps.Polyline({
        path: route.path,
        geodesic: true,
        strokeColor: '#F5821F',
        strokeOpacity: 0.95,
        strokeWeight: 5,
        map,
      });
      routeLineRef.current = polyline;

      // Fit map to show full route smoothly
      const bounds = new google.maps.LatLngBounds();
      route.path.forEach((p) => bounds.extend(p));
      map.fitBounds(bounds, { top: 70, bottom: 90, left: 70, right: 70 });
    } catch (err) {
      console.warn('Could not render route polyline:', err);
    }
  }, [route]);

  // User current location marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (typeof window.google?.maps?.marker?.AdvancedMarkerElement !== 'function') return;

    if (!userMarkerRef.current) {
      const el = document.createElement('div');
      el.className = 'user-pin-element';
      el.style.width = '18px';
      el.style.height = '18px';
      el.style.borderRadius = '50%';
      el.style.background = '#2563EB';
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 0 0 6px rgba(37, 99, 235, 0.3), 0 3px 8px rgba(0,0,0,0.3)';

      try {
        userMarkerRef.current = new google.maps.marker.AdvancedMarkerElement({
          map,
          position: userLocation,
          content: el,
          title: 'Your Location (Simulated)',
          zIndex: 1000,
        });
      } catch (err) {
        console.warn('Could not create user marker:', err);
      }
    } else {
      userMarkerRef.current.position = userLocation;
    }
  }, [userLocation]);

  return (
    <div
      ref={mapDivRef}
      id="smartcampus-google-map-canvas"
      className="relative h-full w-full select-none"
      style={{ minHeight: '100%' }}
    />
  );
}



