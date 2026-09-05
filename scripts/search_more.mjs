// scripts/search_more.mjs
import https from 'https';

const API_KEY = process.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyDsftAEIWcQ-IPFnHq0ycitza1xGt-YMzw';

const queries = [
  "Dr. A.P.J. Abdul Kalam",
  "Kalam",
  "Ratan Tata bhavan",
  "Auditorium, Aditya",
  "Amphitheatre, Aditya",
  "Hostel, Surampalem",
  "Boys Hostel",
  "Girls Hostel",
  "North Mess",
  "South Mess",
  "Medical, Aditya",
  "Dispensary, Aditya",
  "Hospital, Aditya",
  "Church",
  "Temple",
  "Aditya Main Entrance",
  "Main Gate",
  "Security Gate"
];

async function search(q) {
  const postData = JSON.stringify({
    textQuery: q,
    locationBias: {
      circle: {
        center: { latitude: 17.0900, longitude: 82.0680 },
        radius: 1000.0
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
        console.log(`"${q}" -> "${p.displayName?.text}" | ${p.location.latitude}, ${p.location.longitude} | ${p.formattedAddress}`);
      }
    }
  }
}

run();
