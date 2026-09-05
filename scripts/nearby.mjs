// scripts/nearby.mjs
import https from 'https';

const API_KEY = process.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyDsftAEIWcQ-IPFnHq0ycitza1xGt-YMzw';

async function searchNearby() {
  const postData = JSON.stringify({
    locationRestriction: {
      circle: {
        center: { latitude: 17.0920, longitude: 82.0680 },
        radius: 600.0
      }
    }
  });

  const options = {
    hostname: 'places.googleapis.com',
    port: 443,
    path: '/v1/places:searchNearby',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask': 'places.displayName,places.location,places.types,places.formattedAddress',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function run() {
  console.log('--- Places API (New) Nearby Search ---');
  const res = await searchNearby();
  if (res.places) {
    console.log(`Found ${res.places.length} places:`);
    for (const p of res.places) {
      console.log(`- "${p.displayName?.text}" | ${p.location.latitude}, ${p.location.longitude} | ${p.types?.join(', ')}`);
    }
  } else {
    console.log('No places or error:', JSON.stringify(res));
  }
}

run();
