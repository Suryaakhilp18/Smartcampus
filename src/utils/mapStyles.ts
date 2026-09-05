// ============================================================================
// Custom Google Map styles for SmartCampus — Aditya University Navigator
// Strips generic Google Maps clutter and applies the university's signature
// deep navy palette (#0B2D6B, #0A2472) for water, clean roads, and campus grounds.
// ============================================================================

export const lightMapStyle: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#f8fafc' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#0B2D6B' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#ffffff' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },

  { featureType: 'administrative', elementType: 'geometry', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative.land_parcel', stylers: [{ visibility: 'off' }] },

  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#e2f0e8' }] },
  { featureType: 'poi.park', elementType: 'labels', stylers: [{ visibility: 'off' }] },

  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#cbd5e1' }] },
  { featureType: 'road', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#f1f5f9' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#cbd5e1' }] },
  { featureType: 'road.local', elementType: 'labels', stylers: [{ visibility: 'off' }] },

  { featureType: 'transit', stylers: [{ visibility: 'off' }] },

  // Water styled with Aditya University navy tint
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#d0e0f5' }] },
  { featureType: 'water', elementType: 'labels', stylers: [{ visibility: 'off' }] },
];

export const darkMapStyle: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#07101E' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#07101E' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },

  { featureType: 'administrative', elementType: 'geometry', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative.land_parcel', stylers: [{ visibility: 'off' }] },

  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#0b1d1a' }] },
  { featureType: 'poi.park', elementType: 'labels', stylers: [{ visibility: 'off' }] },

  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#0C1B33' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#172E54' }] },
  { featureType: 'road', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#0E2344' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#132B50' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#1D3B6A' }] },
  { featureType: 'road.local', elementType: 'labels', stylers: [{ visibility: 'off' }] },

  { featureType: 'transit', stylers: [{ visibility: 'off' }] },

  // Water styled with Aditya Deep Navy Alt
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0A2472' }] },
  { featureType: 'water', elementType: 'labels', stylers: [{ visibility: 'off' }] },
];

export const MAP_OPTIONS_BASE: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: false,
  clickableIcons: false,
  gestureHandling: 'greedy',
  minZoom: 14,
  maxZoom: 20,
};
