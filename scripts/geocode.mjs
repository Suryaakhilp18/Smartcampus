// scripts/geocode.mjs
import https from 'https';

const API_KEY = process.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyDsftAEIWcQ-IPFnHq0ycitza1xGt-YMzw';
const CAMPUS_LOCATION = '17.0902,82.0674'; // lat,lng
const RADIUS = 2500; // meters

const queries = [
  "Aditya University, Surampalem",
  "Aditya Bridge, Surampalem",
  "North Mess, Aditya University",
  "Mosque, Aditya University Surampalem",
  "Hanuman Temple, Aditya University Surampalem",
  "Technical Hub, Aditya University",
  "Aditya Polytechnic Colleges, Surampalem",
  "Aditya College of Pharmacy, Surampalem",
  "Cotton Bhavan, Aditya University",
  "Cotton Bhavan, Surampalem",
  "K.L. Rao Bhavan, Surampalem",
  "K L Rao Bhawan (AEC)",
  "Bill Gates Bhavan, Surampalem",
  "Bill Gates Bhavan, Aditya University",
  "Abdul Kalam Bhavan",
  "Kalam Bhavan, Aditya",
  "Kalam Bhavan, Surampalem",
  "A.P.J. Abdul Kalam, Aditya",
  "ADITYA UNIVERSITY CENTRAL LIBRARY",
  "Knowledge Resource Centre, Aditya University",
  "Ball Canteen, Aditya",
  "Ball Canteen, Surampalem",
  "Canteen, Aditya University Surampalem",
  "Amphitheatre, Aditya University",
  "Auditorium, Aditya University",
  "Boys Hostel, Aditya University Surampalem",
  "Girls Hostel, Aditya University Surampalem",
  "Sarojini Bhavan, Aditya",
  "Newton Bhavan, Aditya",
  "Ramanujan Bhavan, Aditya",
  "Canara Bank, Aditya University Surampalem",
  "Canara Bank ATM, Surampalem",
  "Aditya University Main Gate",
  "Aditya College Main Gate, ADB Road",
  "Aditya University Ground",
  "Kakinada Buses Ground",
  "Cricket Ground, Aditya University",
  "Sports Complex, Aditya University",
  "Basketball Court, Aditya University",
  "Gym, Aditya University Surampalem",
  "Health Centre, Aditya University",
  "Clinic, Aditya University Surampalem",
  "Church, Aditya University Surampalem",
  "Aditya Global Business School",
  "Aditya Pharmacy College"
];

async function searchPlaceNew(query) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      textQuery: query,
      locationBias: {
        circle: {
          center: { latitude: 17.0902, longitude: 82.0674 },
          radius: 2000.0
        }
      }
    });

    const options = {
      hostname: 'places.googleapis.com',
      port: 443,
      path: '/v1/places:searchText',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.location,places.id,places.types',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

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
  console.log('--- Starting Places API (New) Geocoding ---');
  const results = {};

  for (const q of queries) {
    try {
      const res = await searchPlaceNew(q);
      if (res.places && res.places.length > 0) {
        const p = res.places[0];
        console.log(`[FOUND] "${q}" => "${p.displayName?.text}" | lat: ${p.location.latitude}, lng: ${p.location.longitude} | ${p.formattedAddress}`);
        results[q] = {
          name: p.displayName?.text,
          lat: p.location.latitude,
          lng: p.location.longitude,
          address: p.formattedAddress,
          id: p.id
        };
      } else {
        console.log(`[NOT FOUND] "${q}" - res:`, JSON.stringify(res));
      }
    } catch (err) {
      console.error(`[ERROR] "${q}":`, err.message);
    }
  }
}

run();

