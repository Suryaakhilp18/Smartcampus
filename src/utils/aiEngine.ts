import { campusLocations, type CampusCategory, type CampusLocation } from '../data/campusData';
import { distanceMeters, formatDistance, type LatLng } from './routing';

export interface AiAction {
  type: 'select' | 'route' | 'filter';
  targetLocation?: CampusLocation;
  category?: CampusCategory;
  label?: string;
}

export interface AiResponse {
  answer: string;
  recommendedLocations: { location: CampusLocation; distance: number }[];
  action?: AiAction;
}

// System prompt context for Gemini API
const SYSTEM_CAMPUS_CONTEXT = `You are Aditya University SmartCampus AI Copilot, an intelligent campus navigator for the 180-acre Surampalem ADB Road campus of Aditya University, Andhra Pradesh.
You guide students, visitors, parents, and faculty with precise, polite, and helpful information.
The campus has 58 verified buildings and facilities including:
- Academic Bhavans: Bill Gates Bhavan (CSE/IT), K.L. Rao Bhavan (Civil/Mech), Cotton Bhavan (EEE/ECE), Ratan Tata Bhavan (Management), Dr. A.P.J. Abdul Kalam Bhavan, Aditya College of Pharmacy (ACOP), Aditya Polytechnic Colleges, Aditya Global Business School.
- Labs & Innovation: Technical Hub (T-Hub flagship tech incubator), Intel Intelligent Systems Lab, EDC Lab, Petroleum & Reservoir Lab, Robotics Lab.
- Dining: Ball Canteen (Central Food Court), North Mess, Girls Hostel Canteen (Eat & Play), South Campus Green Canteen, Polytechnic Quick Bites, Juice Junction.
- Hostels: Newton Bhavan (Boys 1), B-Block (Boys 2), Ramanujan Wing (Boys 3), Sarojini Bhavan (Girls Hostel Complex).
- Sacred Multi-Faith: Sri Hanuman Temple, Sri Sai Baba Temple, Sri Saraswathi Devi Temple, Campus Mosque (Masjid), Campus Fellowship Chapel (Church).
- Sports: University Sports Stadium (Cricket & 400m Track), Basketball Courts, Volleyball & Kabaddi, Campus Gym, Indoor Arena (TT & Chess).
- Services: Central Library (Knowledge Resource Centre), Canara Bank & ATM, Indicash ATM, 24/7 Medical Centre & Ambulance, 250+ Bus Terminal.

Always give concise, encouraging responses and recommend specific campus facilities by exact name.`;

/**
 * Intelligent Local Semantic Parser
 * Grounded on the 58 campus locations and user GPS coordinates.
 */
function queryLocalEngine(prompt: string, userLocation: LatLng): AiResponse {
  const q = prompt.toLowerCase().trim();

  // 1. Food / Canteen / Dining
  if (q.includes('food') || q.includes('eat') || q.includes('canteen') || q.includes('lunch') || q.includes('dinner') || q.includes('coffee') || q.includes('juice') || q.includes('snack') || q.includes('mess') || q.includes('breakfast')) {
    const dining = campusLocations
      .filter((l) => l.category === 'food')
      .map((l) => ({ location: l, distance: distanceMeters(userLocation, l) }))
      .sort((a, b) => a.distance - b.distance);

    const nearest = dining[0];
    return {
      answer: `Here are the best dining options nearby on campus! The closest spot to your current location is **${nearest.location.name}** (${formatDistance(nearest.distance)} away). For hearty student meals, **Ball Canteen** and **North Mess** offer full buffet and à la carte counters, while **Juice Junction** has fresh juices and quick snacks.`,
      recommendedLocations: dining.slice(0, 3),
      action: {
        type: 'select',
        targetLocation: nearest.location,
        label: `View ${nearest.location.name} on Map`,
      },
    };
  }

  // 2. Study / Library / Silent zone
  if (q.includes('study') || q.includes('library') || q.includes('book') || q.includes('read') || q.includes('quiet') || q.includes('archives')) {
    const libraries = campusLocations
      .filter((l) => l.name.toLowerCase().includes('library') || l.category === 'facilities' && l.name.includes('Central'))
      .map((l) => ({ location: l, distance: distanceMeters(userLocation, l) }))
      .sort((a, b) => a.distance - b.distance);

    const centralLib = campusLocations.find((l) => l.id === 'central-library') || libraries[0]?.location;
    const dist = centralLib ? distanceMeters(userLocation, centralLib) : 100;

    return {
      answer: `For quiet study and research, head to the **Central Library (Knowledge Resource Centre)**, located ${formatDistance(dist)} away. It features 100,000+ volumes, IEEE digital journal terminals, air-conditioned silent reading floors, and high-speed Wi-Fi. For late night exam sessions, the **Hostel Night Study Library** is also open.`,
      recommendedLocations: [
        { location: centralLib!, distance: dist },
        ...libraries.filter((l) => l.location.id !== centralLib?.id).slice(0, 2),
      ],
      action: {
        type: 'route',
        targetLocation: centralLib,
        label: `Navigate to Central Library`,
      },
    };
  }

  // 3. Technical Hub / Incubation / Coding
  if (q.includes('technical hub') || q.includes('t-hub') || q.includes('coding') || q.includes('hackathon') || q.includes('incubation') || q.includes('startup') || q.includes('certif')) {
    const thub = campusLocations.find((l) => l.id === 'technical-hub')!;
    const dist = distanceMeters(userLocation, thub);

    return {
      answer: `**Technical Hub (T-Hub)** is Aditya University’s flagship student tech incubator and skill development centre, located ${formatDistance(dist)} from you. It hosts live corporate development projects, AWS/Azure certification training, IoT hardware racks, and the 24-hour Hackathon Arena.`,
      recommendedLocations: [{ location: thub, distance: dist }],
      action: {
        type: 'route',
        targetLocation: thub,
        label: `Navigate to Technical Hub`,
      },
    };
  }

  // 4. Laboratories / Intel / Circuits / Research
  if (q.includes('lab') || q.includes('intel') || q.includes('gpu') || q.includes('hardware') || q.includes('electronics') || q.includes('robotics') || q.includes('petroleum')) {
    const labs = campusLocations
      .filter((l) => l.category === 'labs')
      .map((l) => ({ location: l, distance: distanceMeters(userLocation, l) }))
      .sort((a, b) => a.distance - b.distance);

    return {
      answer: `The campus hosts several advanced research labs! For AI and deep learning, visit the **Intel Intelligent Systems Lab** (Bill Gates Bhavan). For electronics and circuit design, check the **EDC Lab** (Cotton Bhavan), and for energy studies, the **Petroleum & Reservoir Lab** is equipped with core testing rigs.`,
      recommendedLocations: labs.slice(0, 4),
      action: {
        type: 'filter',
        category: 'labs',
        label: `Show All Labs on Map`,
      },
    };
  }

  // 5. Worship / Temple / Mosque / Church / Spiritual
  if (q.includes('temple') || q.includes('mosque') || q.includes('church') || q.includes('prayer') || q.includes('pooja') || q.includes('hanuman') || q.includes('masjid') || q.includes('chapel') || q.includes('sai baba')) {
    const worship = campusLocations
      .filter((l) => ['hanuman-temple', 'sai-baba-temple', 'saraswathi-temple', 'campus-mosque', 'campus-church'].includes(l.id))
      .map((l) => ({ location: l, distance: distanceMeters(userLocation, l) }))
      .sort((a, b) => a.distance - b.distance);

    return {
      answer: `Aditya University proudly provides distinct sacred spaces for multi-faith prayer and reflection:
- **Sri Hanuman Temple:** Near South campus green lane.
- **Campus Mosque (Masjid):** Near the serene North quad.
- **Campus Fellowship Chapel (Church):** Dedicated fellowship hall.
- **Sri Sai Baba & Saraswathi Temples:** Calm prayer sanctums for students.`,
      recommendedLocations: worship,
      action: {
        type: 'select',
        targetLocation: worship[0]?.location,
        label: `View ${worship[0]?.location.name}`,
      },
    };
  }

  // 6. Hostels / Accommodation
  if (q.includes('hostel') || q.includes('room') || q.includes('stay') || q.includes('newton') || q.includes('sarojini') || q.includes('b-block') || q.includes('dorm') || q.includes('girls hostel') || q.includes('boys hostel')) {
    const hostels = campusLocations
      .filter((l) => l.name.toLowerCase().includes('hostel') || l.id.startsWith('boys-hostel') || l.id.startsWith('girls-hostel'))
      .map((l) => ({ location: l, distance: distanceMeters(userLocation, l) }))
      .sort((a, b) => a.distance - b.distance);

    return {
      answer: `Residential accommodation on campus includes:
- **Newton Bhavan (Boys' Hostel 1):** Main residential block in North campus.
- **Boys' Hostel 2 (B-Block) & Ramanujan Wing:** Modern multi-story wings.
- **Sarojini Bhavan (Girls' Hostel Complex):** Secure gated compound with private fitness gym and Eat & Play Canteen.`,
      recommendedLocations: hostels,
      action: {
        type: 'select',
        targetLocation: hostels[0]?.location,
        label: `View ${hostels[0]?.location.name}`,
      },
    };
  }

  // 7. Sports / Gym / Fitness / Stadium
  if (q.includes('sports') || q.includes('cricket') || q.includes('ground') || q.includes('gym') || q.includes('fitness') || q.includes('basketball') || q.includes('kabaddi') || q.includes('volleyball') || q.includes('track')) {
    const sports = campusLocations
      .filter((l) => l.name.toLowerCase().includes('stadium') || l.name.toLowerCase().includes('gym') || l.name.toLowerCase().includes('court') || l.name.toLowerCase().includes('sports'))
      .map((l) => ({ location: l, distance: distanceMeters(userLocation, l) }))
      .sort((a, b) => a.distance - b.distance);

    const stadium = campusLocations.find((l) => l.id === 'sports-stadium') || sports[0]?.location;
    return {
      answer: `For sports and athletic training, Aditya University offers a full-size **University Sports Stadium** with a 400m running track and cricket pitch, outdoor floodlit **Basketball & Volleyball Courts**, and an indoor **Gymnasium & Fitness Centre**.`,
      recommendedLocations: sports.slice(0, 3),
      action: {
        type: 'route',
        targetLocation: stadium,
        label: `Navigate to Sports Stadium`,
      },
    };
  }

  // 8. Emergency / Medical / Doctor / Ambulance
  if (q.includes('medical') || q.includes('emergency') || q.includes('doctor') || q.includes('hospital') || q.includes('ambulance') || q.includes('hurt') || q.includes('help') || q.includes('sick')) {
    const med = campusLocations.find((l) => l.id === 'medical-centre')!;
    const dist = distanceMeters(userLocation, med);

    return {
      answer: `🚨 **Immediate Emergency Support:**
The **24/7 Campus Medical Centre & Ambulance Station** is located ${formatDistance(dist)} away, adjacent to the Administration Lane. Resident medical officers, emergency pharmacy supplies, and patient observation beds are on standby around the clock. Contact emergency dispatch: **+91 99498 76662**.`,
      recommendedLocations: [{ location: med, distance: dist }],
      action: {
        type: 'route',
        targetLocation: med,
        label: `Emergency Route to Medical Centre`,
      },
    };
  }

  // 9. ATM / Bank / Money
  if (q.includes('atm') || q.includes('bank') || q.includes('cash') || q.includes('money') || q.includes('canara')) {
    const atms = campusLocations
      .filter((l) => l.id === 'canara-bank-atm' || l.id === 'indicash-atm')
      .map((l) => ({ location: l, distance: distanceMeters(userLocation, l) }))
      .sort((a, b) => a.distance - b.distance);

    const nearestAtm = atms[0]?.location;
    return {
      answer: `There are two 24/7 cash points on campus:
1. **Canara Bank Branch & ATM:** Near K.L. Rao Bhavan (${formatDistance(atms[0]?.distance ?? 80)} away).
2. **Indicash ATM:** Inside the Gallery / Auditorium complex.`,
      recommendedLocations: atms,
      action: {
        type: 'select',
        targetLocation: nearestAtm,
        label: `View ${nearestAtm?.name}`,
      },
    };
  }

  // 10. Transit / Bus / Parking / Gates
  if (q.includes('bus') || q.includes('parking') || q.includes('transit') || q.includes('gate') || q.includes('car') || q.includes('bike') || q.includes('transport')) {
    const transit = campusLocations
      .filter((l) => l.category === 'parking' || l.id === 'main-gate')
      .map((l) => ({ location: l, distance: distanceMeters(userLocation, l) }))
      .sort((a, b) => a.distance - b.distance);

    return {
      answer: `The campus features an organized transit network with over 250+ university buses:
- **Central Bus Terminal:** Regional boarding for Rajahmundry & coastal routes.
- **Kakinada Bus Ground:** Direct fleet parking for Kakinada & Samalkota routes.
- **Main Campus Parking:** Secure covered parking near the ADB Road Entrance Gate.`,
      recommendedLocations: transit.slice(0, 3),
      action: {
        type: 'filter',
        category: 'parking',
        label: `Show Parking & Transit on Map`,
      },
    };
  }

  // 11. Accessibility / Wheelchair / Ramps
  if (q.includes('accessible') || q.includes('wheelchair') || q.includes('ramp') || q.includes('elevator') || q.includes('lift') || q.includes('disability')) {
    const accLoc = campusLocations.find((l) => l.id === 'disabled-access-hub')!;
    const dist = distanceMeters(userLocation, accLoc);

    return {
      answer: `Aditya University is designed with barrier-free physical access:
- All major Bhavans (Bill Gates, K.L. Rao, Cotton) are equipped with ground floor ramps and automatic passenger elevators.
- The **Student Accessibility Services Hub** (${formatDistance(dist)} away) provides electric buggy dispatch and mobility assistance.`,
      recommendedLocations: [{ location: accLoc, distance: dist }],
      action: {
        type: 'select',
        targetLocation: accLoc,
        label: `View Accessibility Hub`,
      },
    };
  }

  // Default: General fuzzy search across all 58 locations
  const matches = campusLocations
    .map((l) => {
      let score = 0;
      const words = q.split(/\s+/);
      for (const w of words) {
        if (w.length < 3) continue;
        if (l.name.toLowerCase().includes(w)) score += 5;
        if (l.description.toLowerCase().includes(w)) score += 2;
        if (l.facilities.some((f) => f.toLowerCase().includes(w))) score += 3;
      }
      return { location: l, score, distance: distanceMeters(userLocation, l) };
    })
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score || a.distance - b.distance);

  if (matches.length > 0) {
    const top = matches[0];
    return {
      answer: `I found **${top.location.name}** (${formatDistance(top.distance)} away), which matches your query. ${top.location.description}`,
      recommendedLocations: matches.slice(0, 3).map((m) => ({ location: m.location, distance: m.distance })),
      action: {
        type: 'select',
        targetLocation: top.location,
        label: `View ${top.location.name} on Map`,
      },
    };
  }

  // Fallback helpful guidance
  return {
    answer: `Welcome to Aditya University SmartCampus! You can ask me to locate specific academic Bhavans, find the nearest canteen, discover research labs at Technical Hub, view multi-faith prayer places, or get walking directions across our 180-acre campus. What would you like to explore?`,
    recommendedLocations: [
      { location: campusLocations.find((l) => l.id === 'bill-gates-bhavan')!, distance: distanceMeters(userLocation, campusLocations.find((l) => l.id === 'bill-gates-bhavan')!) },
      { location: campusLocations.find((l) => l.id === 'technical-hub')!, distance: distanceMeters(userLocation, campusLocations.find((l) => l.id === 'technical-hub')!) },
      { location: campusLocations.find((l) => l.id === 'central-library')!, distance: distanceMeters(userLocation, campusLocations.find((l) => l.id === 'central-library')!) },
    ],
  };
}

/**
 * Main query dispatcher.
 * Uses Google Gemini API if VITE_GEMINI_API_KEY is available,
 * otherwise runs the instant local semantic engine.
 */
export async function askCampusAi(prompt: string, userLocation: LatLng): Promise<AiResponse> {
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

  // Run local engine first for instant intent resolution & matching locations
  const localResult = queryLocalEngine(prompt, userLocation);

  // If Gemini API Key is configured, enhance the conversational answer via Gemini
  if (geminiKey && geminiKey !== 'YOUR_GEMINI_API_KEY' && geminiKey.trim() !== '') {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  { text: `${SYSTEM_CAMPUS_CONTEXT}\n\nUser Question: "${prompt}"\nUser Current Location GPS: Lat ${userLocation.lat.toFixed(5)}, Lng ${userLocation.lng.toFixed(5)}.\nProvide a helpful 2-4 sentence answer. Mention exact building names.` },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 250,
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (generatedText && generatedText.trim().length > 0) {
          return {
            answer: generatedText.trim(),
            recommendedLocations: localResult.recommendedLocations,
            action: localResult.action,
          };
        }
      }
    } catch (err) {
      console.warn('Gemini API call failed, using intelligent local engine:', err);
    }
  }

  // Return intelligent local result
  return localResult;
}
