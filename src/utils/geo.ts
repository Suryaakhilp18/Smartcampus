// ============================================================================
// Geo helpers for the Demo Map fallback — projects lat/lng onto a simple
// percentage-based coordinate space so markers can be positioned with plain
// CSS `left`/`top` when the real Google Map isn't loaded.
// ============================================================================
import { campusLocations, CAMPUS_CENTER } from '../data/campusData';

function computeBounds() {
  if (!campusLocations || campusLocations.length === 0) {
    return {
      north: CAMPUS_CENTER.lat + 0.0045,
      south: CAMPUS_CENTER.lat - 0.0045,
      east: CAMPUS_CENTER.lng + 0.0055,
      west: CAMPUS_CENTER.lng - 0.0035,
    };
  }
  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;

  campusLocations.forEach((loc) => {
    if (loc.lat < minLat) minLat = loc.lat;
    if (loc.lat > maxLat) maxLat = loc.lat;
    if (loc.lng < minLng) minLng = loc.lng;
    if (loc.lng > maxLng) maxLng = loc.lng;
  });

  const latMargin = Math.max((maxLat - minLat) * 0.08, 0.0006);
  const lngMargin = Math.max((maxLng - minLng) * 0.08, 0.0006);

  return {
    north: maxLat + latMargin,
    south: minLat - latMargin,
    east: maxLng + lngMargin,
    west: minLng - lngMargin,
  };
}

// Bounding box dynamically enclosing all real campus locations with margin
export const DEMO_BOUNDS = computeBounds();

export function toPercentPosition(lat: number, lng: number) {
  const x =
    ((lng - DEMO_BOUNDS.west) / (DEMO_BOUNDS.east - DEMO_BOUNDS.west)) * 100;
  const y =
    (1 - (lat - DEMO_BOUNDS.south) / (DEMO_BOUNDS.north - DEMO_BOUNDS.south)) *
    100;
  return { xPct: clamp(x, 2, 98), yPct: clamp(y, 2, 98) };
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}
