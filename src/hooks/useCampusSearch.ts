// ============================================================================
// useCampusSearch — intelligent local search over campus locations, with
// support for natural-language queries like "nearest cafeteria", "labs near me",
// "Pharmacy block", "hostel", "bus terminal".
// ============================================================================
import { useMemo, useState } from 'react';
import { campusLocations, type CampusLocation } from '../data/campusData';
import { distanceMeters, type LatLng } from '../utils/routing';

const NEAREST_HINTS = ['nearest', 'near me', 'closest', 'nearby'];

const CATEGORY_KEYWORDS: Record<string, CampusLocation['category']> = {
  cafeteria: 'food',
  food: 'food',
  canteen: 'food',
  eat: 'food',
  restaurant: 'food',
  coffee: 'food',
  cafe: 'food',
  nescafe: 'food',
  snack: 'food',
  lab: 'labs',
  labs: 'labs',
  laboratory: 'labs',
  robotics: 'labs',
  iot: 'labs',
  restroom: 'accessible',
  toilet: 'facilities',
  washroom: 'facilities',
  parking: 'parking',
  park: 'parking',
  bus: 'parking',
  fleet: 'parking',
  medical: 'medical',
  hospital: 'medical',
  clinic: 'medical',
  doctor: 'medical',
  ambulance: 'medical',
  pharmacy: 'academic',
  medicine: 'academic',
  accessible: 'accessible',
  wheelchair: 'accessible',
  ramp: 'accessible',
  skywalk: 'accessible',
  emergency: 'emergency',
  security: 'emergency',
  police: 'emergency',
  event: 'events',
  auditorium: 'events',
  sports: 'events',
  stadium: 'events',
  cricket: 'events',
  gym: 'events',
  academic: 'academic',
  school: 'academic',
  classroom: 'academic',
  library: 'academic',
  books: 'academic',
  engineering: 'academic',
  computing: 'academic',
  business: 'academic',
  mba: 'academic',
  btech: 'academic',
  hostel: 'facilities',
  admin: 'facilities',
  bank: 'facilities',
  atm: 'facilities',
  incubator: 'facilities',
  startup: 'facilities',
  agbi: 'facilities',
  cdc: 'facilities',
  placement: 'facilities',
};

export function useCampusSearch(userLocation: LatLng) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const isNearest = NEAREST_HINTS.some((hint) => q.includes(hint));
    let matchedCategory: CampusLocation['category'] | undefined;

    for (const [keyword, category] of Object.entries(CATEGORY_KEYWORDS)) {
      if (q.includes(keyword)) {
        matchedCategory = category;
        break;
      }
    }

    // Direct name/description matching
    const directMatches = campusLocations.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.shortName?.toLowerCase().includes(q) ||
        l.subCategory?.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.facilities.some((f) => f.toLowerCase().includes(q))
    );

    let candidates: CampusLocation[] = [...directMatches];

    if (matchedCategory) {
      const categoryMatches = campusLocations.filter((l) => l.category === matchedCategory);
      for (const catLoc of categoryMatches) {
        if (!candidates.some((c) => c.id === catLoc.id)) {
          candidates.push(catLoc);
        }
      }
    }

    const withDistance = candidates.map((loc) => ({
      location: loc,
      distance: distanceMeters(userLocation, { lat: loc.lat, lng: loc.lng }),
    }));

    withDistance.sort((a, b) => {
      // Prioritize exact/prefix name matches first
      const aNameMatch = a.location.name.toLowerCase().includes(q);
      const bNameMatch = b.location.name.toLowerCase().includes(q);
      if (aNameMatch && !bNameMatch) return -1;
      if (!aNameMatch && bNameMatch) return 1;
      return a.distance - b.distance;
    });

    if (isNearest) return withDistance.slice(0, 3);
    return withDistance.slice(0, 8);
  }, [query, userLocation]);

  return { query, setQuery, results };
}
