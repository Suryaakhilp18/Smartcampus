// scripts/bhavan_search.mjs
import https from 'https';

const API_KEY = process.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyDsftAEIWcQ-IPFnHq0ycitza1xGt-YMzw';

async function searchNearby(lat, lng) {
  const postData = JSON.stringify({
    locationRestriction: {
      circle: {
        center: { latitude: lat, longitude: lng },
        radius: 200.0
      }
    }
  });

  return new Promise((resolve) => {
    const req = https.request({
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
  console.log('Searching around (17.0908, 82.0665)...');
  const res1 = await searchNearby(17.0908, 82.0665);
  for (const p of res1.places || []) {
    console.log(`- "${p.displayName?.text}" | ${p.location.latitude}, ${p.location.longitude} | ${p.formattedAddress}`);
  }

  console.log('\nSearching around (17.0920, 82.0665)...');
  const res2 = await searchNearby(17.0920, 82.0665);
  for (const p of res2.places || []) {
    console.log(`- "${p.displayName?.text}" | ${p.location.latitude}, ${p.location.longitude} | ${p.formattedAddress}`);
  }
}

run();
