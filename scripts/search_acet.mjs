// scripts/search_acet.mjs
import https from 'https';

const API_KEY = process.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyDsftAEIWcQ-IPFnHq0ycitza1xGt-YMzw';

const queries = [
  "Aditya College of Engineering",
  "Aditya College of Engineering and Technology",
  "ACET Surampalem",
  "Visweswarayya bhavan",
  "Ramanujan bhavan",
  "Newton bhavan",
  "Sarojini bhavan",
  "Aditya University Main Entrance",
  "Arch Aditya",
  "Aditya Arch",
  "Aditya Gate Surampalem",
  "Amphitheatre",
  "Auditorium AEC",
  "Kalam Bhavan AEC",
  "Canteen ACET",
  "Girls Hostel AEC",
  "Boys Hostel AEC",
  "Hostel AEC Surampalem"
];

async function search(q) {
  const postData = JSON.stringify({
    textQuery: q,
    locationBias: {
      circle: {
        center: { latitude: 17.0895, longitude: 82.0680 },
        radius: 1200.0
      }
    }
  });

  return new Promise((resolve) => {
    const req = https.request({
      hostname: 'places.googleapis.com',
      port: 443,
      path: '/v1/places:searchText',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': 'places.displayName,places.location,places.formattedAddress',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          resolve({});
        }
      });
    });
    req.write(postData);
    req.end();
  });
}

async function run() {
  for (const q of queries) {
    const res = await search(q);
    if (res.places && res.places.length > 0) {
      for (const p of res.places.slice(0, 2)) {
        if (p.location.latitude > 17.07 && p.location.latitude < 17.11 && p.location.longitude > 82.05 && p.location.longitude < 82.09) {
          console.log(`[CAMPUS MATCH] "${q}" -> "${p.displayName?.text}" | lat: ${p.location.latitude}, lng: ${p.location.longitude} | ${p.formattedAddress}`);
        }
      }
    }
  }
}

run();
