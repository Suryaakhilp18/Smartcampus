# Aditya University SmartCampus — Homepage & "Explore Aditya University" Entry Flow (v5)

## Overview
This update introduces an authentic, modern **Aditya University Landing Homepage** that sits in front of the existing SmartCampus map experience. It mirrors the structure, section rhythm, and visual tone of `adityauniversity.in` (Navy `#0B2D6B` and Orange `#F5821F`), complete with rich dynamic interactions, scroll-triggered animations, and a seamless **"Explore Aditya University"** entry flow into the map.

---

## 1. Sections Built Top-to-Bottom

1. **Sticky & Dynamic Morphing Header:**
   - University logo and wordmark lockup.
   - Horizontal navigation links: *About*, *Schools*, *Why Aditya*, *Placements*, *Campus Map*, and *Contact* with smooth in-page scrolling.
   - Light/Dark theme toggle.
   - Prominent orange rounded primary CTA button: **"Explore Aditya University"**.
   - **Dynamic behavior:** On scroll (`> 40px`), the header shrinks slightly and transitions from transparent to a solid frosted glass panel with shadow (`glass-panel-strong`).

2. **Hero Section:**
   - Full-width deep navy gradient with animated abstract glowing orbs and radial dot grid overlay.
   - NAAC 'A++' status badge.
   - Original headline: *"Pioneering Innovation. Igniting Futures."*
   - Subheadline describing the 180-acre Surampalem smart campus.
   - Two CTA buttons:
     - **Primary:** *"Explore Aditya University Map"* (launches the map view with smooth fade transition).
     - **Secondary:** *"Discover Campus Highlights"* (smoothly scrolls down to the showcase sections).
   - Quick metrics counter bar (180+ Acres, 40.5 LPA Peak Placement, 58 POIs, 250+ Transit Fleet).

3. **Rankings & Accreditations Strip (`CountUpBadge.tsx`):**
   - 4 badge cards: *Top 101-150 Band (NIRF Engineering)*, *25+ Years Legacy*, *350+ Recruiters*, and *58 Verified Interactive Zones*.
   - **Interactive touch:** Numbers dynamically count up from 0 to target when scrolled into view using an `IntersectionObserver`.

4. **Schools Showcase (5 Multidisciplinary Schools):**
   - *School of Computing & AI* (Bill Gates Bhavan)
   - *School of Engineering & Technology* (K.L. Rao & Cotton Bhavans)
   - *School of Pharmacy* (ACOP & APC complexes)
   - *School of Business & Management* (Aditya Global Business School)
   - *School of Applied Sciences & Humanities*
   - Each card features custom icons, descriptions, hover elevation (`hover:-translate-y-1.5`), and direct *"View on Map"* deep-links.

5. **Why Aditya (Interactive Tabbed Showcase):**
   - 4 interactive tabs: *Technical Hub & Incubation*, *Centers of Excellence*, *Industry Immersion*, and *Global MOUs & Research*.
   - Smooth animated cross-fading tab panels displaying key achievements (15,000+ certified students, 100+ hackathons, Intel AI lab, Pearson VUE center).

6. **Placements Highlight & Recruiter Grid (`PlacementCarousel.tsx`):**
   - Auto-rotating metric slider (40.5 LPA Highest Package, 350+ Recruiters, 4,500+ Offers) that advances every 4.5s and pauses on mouse hover.
   - Manual previous / next arrows and slide progress dots.
   - Wordmark grid of verified campus recruiters: Amazon, Microsoft, Cisco, TCS, Infosys, Wipro, Capgemini, Tech Mahindra, Cognizant, DXC Technology, Hyundai Mobis, L&T Tech, Virtusa, Hexaware.

7. **Campus Facilities Grid (Interactive Bridge into Map):**
   - 6 zone bridge cards: *Academic Bhavans*, *Central Library & Archives*, *Hostels & Dining*, *Sports Stadium & Gym*, *Fleet Transit & Gates*, and *24/7 Medical & Security*.
   - **Dynamic tie-in:** Clicking any card directly launches the SmartCampus map view pre-filtered and focused on that specific location.

8. **Campus Life:**
   - 3 interactive highlight tiles: *VEDA & Colors Tech Fests*, *Clubs & Student Societies (30+ chapters)*, and *Multi-Faith Sacred Spaces* (individually mapped Hanuman Temple, Sai Baba Temple, Mosque, and Church).

9. **Testimonials Carousel (`TestimonialCarousel.tsx`):**
   - Auto-rotating student and alumni stories with 5-star ratings, quotes, student names, graduation classes, manual prev/next navigation, and hover pause.

10. **Rich University Footer:**
    - Real address: *Aditya Nagar, ADB Road, Surampalem, Kakinada District, Andhra Pradesh, India – 533437*.
    - Contact phone (+91 99498 76662) and admissions email.
    - Quick navigation links and official external portal links.
    - Explicit competition disclaimer clarifying that this is a student project demo.

---

## 2. Navigation Flow & Deep Linking

```
[ Homepage (/) ]  <=======================================>  [ SmartCampus Map (/map) ]
      |                                                                 |
      +---> "Explore Aditya University" CTA  -------------------------->+
      +---> Facilities Card (e.g. Central Library) -> Pre-filtered ----->+
      +<--- Header "← Home" button / Logo click <-----------------------+
```

- **Client-Side Hash Routing:** Uses `window.location.hash` (`#/` for Homepage and `#/map` for Map) with active `hashchange` listeners, ensuring browser back/forward buttons work naturally.
- **Lazy Script Loading:** Google Maps script loading is deferred until entering the map view (`useGoogleMaps(currentView === 'map')`), keeping initial homepage load ultra-fast.
- **Back to Home:** The map header includes a dedicated **"← Home"** button and logo click affordance to return to the homepage at any time.

---

## 3. Verification Summary

- **TypeScript Compilation:** `tsc -b && vite build` built in 3.55s with **0 errors**.
- **Responsive Layout:** Tested across desktop and mobile form factors; all cards, grids, and carousels collapse cleanly to single-column layouts on mobile screens.
- **Dark Mode Harmony:** The theme toggle in both the Homepage header and Map header seamlessly switches between modern light and sleek dark mode without breaking text contrast.
