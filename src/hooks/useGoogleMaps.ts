// ============================================================================
// useGoogleMaps — loads the Google Maps JavaScript API script safely and robustly.
// Reports status ('idle' | 'loading' | 'ready' | 'no-key' | 'error') so the app
// displays the real Google Map or falls back to Demo Mode when offline / no key.
// ============================================================================
import { useEffect, useState } from 'react';

export type MapsLoadStatus = 'idle' | 'loading' | 'ready' | 'no-key' | 'error';

const SCRIPT_ID = 'smartcampus-google-maps-script';
let loadPromise: Promise<void> | null = null;

async function checkGoogleMapsReady(): Promise<boolean> {
  if (typeof window.google?.maps?.Map === 'function') {
    if (typeof window.google?.maps?.importLibrary === 'function') {
      try {
        await Promise.allSettled([
          window.google.maps.importLibrary('maps'),
          window.google.maps.importLibrary('marker'),
          window.google.maps.importLibrary('places'),
          window.google.maps.importLibrary('geometry'),
        ]);
      } catch {
        // ignore
      }
    }
    return true;
  }
  return false;
}

function loadGoogleMapsScript(apiKey: string): Promise<void> {
  if (typeof window.google?.maps?.Map === 'function') {
    return Promise.resolve();
  }

  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = new Promise((resolve, reject) => {
    // Check if already loaded
    checkGoogleMapsReady().then((ready) => {
      if (ready) {
        resolve();
        return;
      }

      // Check existing script tag
      const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
      if (existing) {
        let attempts = 0;
        const interval = setInterval(async () => {
          attempts++;
          if (await checkGoogleMapsReady()) {
            clearInterval(interval);
            resolve();
          } else if (attempts > 30) {
            clearInterval(interval);
            // If existing script is stuck, remove and retry fresh
            existing.remove();
            loadPromise = null;
            loadGoogleMapsScript(apiKey).then(resolve).catch(reject);
          }
        }, 100);
        return;
      }

      const script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry&v=weekly`;
      script.async = true;
      script.defer = true;

      script.onload = async () => {
        try {
          if (await checkGoogleMapsReady()) {
            resolve();
          } else {
            // Give a short grace period for global google object
            setTimeout(async () => {
              if (await checkGoogleMapsReady()) {
                resolve();
              } else {
                reject(new Error('google.maps.Map not defined after script load'));
              }
            }, 200);
          }
        } catch (err) {
          reject(err);
        }
      };

      script.onerror = (err) => {
        loadPromise = null;
        reject(err || new Error('script-error'));
      };

      document.head.appendChild(script);
    });
  });

  return loadPromise;
}

export function useGoogleMaps(enabled: boolean = true) {
  const [status, setStatus] = useState<MapsLoadStatus>(() => {
    if (typeof window !== 'undefined' && typeof window.google?.maps?.Map === 'function') {
      return 'ready';
    }
    return 'idle';
  });

  useEffect(() => {
    if (!enabled) return;

    if (typeof window.google?.maps?.Map === 'function') {
      setStatus('ready');
      return;
    }

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

    if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY_HERE' || apiKey.trim() === '') {
      console.warn('Google Maps API key not found in .env. Running in Demo Mode.');
      setStatus('no-key');
      return;
    }

    setStatus('loading');

    let mounted = true;
    loadGoogleMapsScript(apiKey)
      .then(() => {
        if (mounted) setStatus('ready');
      })
      .catch((err) => {
        console.warn('Failed to load Google Maps script, falling back to Demo Mode:', err);
        if (mounted) setStatus('error');
      });

    return () => {
      mounted = false;
    };
  }, [enabled]);

  return {
    status,
    isLoaded: status === 'ready',
    isDemoMode: status === 'no-key' || status === 'error',
  };
}
