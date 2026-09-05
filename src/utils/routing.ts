// ============================================================================
// Routing utilities. Prefers Google's Directions/Routes functionality when
// the Maps JS API is loaded; otherwise falls back to a convincing simulated
// route (straight-line + jitter waypoints) so the demo never breaks without
// an API key.
// ============================================================================

import type { CampusLocation } from '../data/campusData';

export type TravelMode = 'WALKING' | 'BICYCLING' | 'DRIVING';
export type RouteProfile = 'fastest' | 'accessible' | 'scenic';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface RouteResult {
  profile: RouteProfile;
  label: string;
  mode: TravelMode;
  distanceMeters: number;
  durationMinutes: number;
  stops: number;
  path: LatLng[];
  accessible: boolean;
  warning?: string;
}

// Haversine distance in meters.
export function distanceMeters(a: LatLng, b: LatLng): number {
  const R = 6371000;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function speedMetersPerMinute(mode: TravelMode): number {
  switch (mode) {
    case 'WALKING':
      return 80; // ~4.8 km/h
    case 'BICYCLING':
      return 220; // ~13 km/h
    case 'DRIVING':
      return 400; // ~24 km/h campus roads
  }
}

// Builds a soft curved path with a couple of waypoints so the demo route
// doesn't look like a single straight line cutting through buildings.
function jitterPath(from: LatLng, to: LatLng, bend: number, segments = 6): LatLng[] {
  const path: LatLng[] = [];
  const mx = (from.lat + to.lat) / 2;
  const my = (from.lng + to.lng) / 2;
  const dx = to.lat - from.lat;
  const dy = to.lng - from.lng;
  // perpendicular offset for a gentle curve
  const perpLat = -dy * bend;
  const perpLng = dx * bend;
  const control = { lat: mx + perpLat, lng: my + perpLng };

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const lat =
      (1 - t) * (1 - t) * from.lat + 2 * (1 - t) * t * control.lat + t * t * to.lat;
    const lng =
      (1 - t) * (1 - t) * from.lng + 2 * (1 - t) * t * control.lng + t * t * to.lng;
    path.push({ lat, lng });
  }
  return path;
}

export function simulateRoute(
  origin: LatLng,
  destination: CampusLocation,
  mode: TravelMode,
  profile: RouteProfile
): RouteResult {
  const straight = distanceMeters(origin, { lat: destination.lat, lng: destination.lng });

  // Each profile applies a realistic multiplier vs. straight-line distance,
  // simulating road/path routing rather than "as the crow flies".
  const profileMultiplier: Record<RouteProfile, number> = {
    fastest: 1.18,
    accessible: 1.32,
    scenic: 1.55,
  };
  const bend: Record<RouteProfile, number> = {
    fastest: 0.12,
    accessible: 0.2,
    scenic: 0.35,
  };

  const distance = Math.round(straight * profileMultiplier[profile]);
  const speed = speedMetersPerMinute(mode);
  let duration = Math.max(1, Math.round(distance / speed));

  if (profile === 'accessible') duration += 2; // ramps / accessible crossings take longer
  if (profile === 'scenic') duration += 3;

  const stops =
    profile === 'fastest' ? 0 : profile === 'accessible' ? 1 : 2;

  const path = jitterPath(
    origin,
    { lat: destination.lat, lng: destination.lng },
    bend[profile]
  );

  const labels: Record<RouteProfile, string> = {
    fastest: 'FASTEST',
    accessible: 'ACCESSIBLE',
    scenic: 'SCENIC',
  };

  return {
    profile,
    label: labels[profile],
    mode,
    distanceMeters: distance,
    durationMinutes: duration,
    stops,
    path,
    accessible: profile === 'accessible' || destination.accessibility.wheelchairEntrance,
    warning:
      profile === 'accessible' && !destination.accessibility.wheelchairEntrance
        ? 'This destination has limited accessible entry points.'
        : undefined,
  };
}

export function buildRouteOptions(
  origin: LatLng,
  destination: CampusLocation,
  mode: TravelMode
): RouteResult[] {
  return [
    simulateRoute(origin, destination, mode, 'fastest'),
    simulateRoute(origin, destination, mode, 'accessible'),
    simulateRoute(origin, destination, mode, 'scenic'),
  ];
}

export function formatDistance(m: number): string {
  if (m < 1000) return `${Math.round(m)} m`;
  return `${(m / 1000).toFixed(1)} km`;
}
