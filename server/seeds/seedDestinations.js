/**
 * Pavilion India — Complete Destinations Seed File
 * Generated for all regions of India
 *
 * STRUCTURE:
 * - northHimachal.js         — HP: Shimla, Manali, Dharamshala, Spiti, Kullu, Dalhousie, Khajjiar
 * - northRajasthan.js        — Rajasthan: Jaipur, Jodhpur, Jaisalmer, Udaipur, Pushkar, Ranthambore, Mt Abu, Ajmer, Chittorgarh, Bikaner
 * - northUPDelhi.js          — UP/Delhi/Punjab: Taj Mahal, Varanasi, Agra Fort, Fatehpur Sikri, Mathura, Delhi, Amritsar, Wagah, Chandigarh
 * - northUttarakhand.js      — Uttarakhand: Rishikesh, Haridwar, Mussoorie, Nainital, Corbett, Dehradun, Auli, Valley of Flowers, Kedarnath, Badrinath, Chopta, Hemkund, Lansdowne
 * - northJKLadakh.js         — J&K/Ladakh: Leh, Pangong, Nubra, Zanskar, Srinagar, Gulmarg, Pahalgam, Sonamarg
 * - southKerala.js           — Kerala: Alleppey, Munnar, Wayanad, Thekkady, Kovalam, Varkala, Kochi, Kozhikode
 * - southKarnataka.js        — Karnataka: Hampi, Bangalore, Mysore, Coorg, Chikmagalur, Gokarna, Badami, Kudremukh
 * - southTamilNadu.js        — TN/AP: Madurai, Rameswaram, Kanyakumari, Ooty, Kodaikanal, Mahabalipuram, Pondicherry, Tirupati
 * - southGoaAP.js            — Goa/AP/Telangana: Goa Beaches, Old Goa, Dudhsagar, Hyderabad, Vizag, Araku, Warangal
 * - westMaharashtra.js       — Maharashtra: Mumbai, Aurangabad/Ajanta/Ellora, Lonavala, Mahabaleshwar, Nashik, Shirdi, Pune, Tarkarli
 * - westGujarat.js           — Gujarat: Rann of Kutch, Gir, Somnath, Dwarka, Statue of Unity, Ahmedabad, Palitana
 * - eastWBOdisha.js          — WB/Odisha: Darjeeling, Kolkata, Sundarbans, Puri, Konark, Chilika, Bhubaneswar
 * - eastBiharNortheast.js    — Bihar/NE: Bodh Gaya, Nalanda, Kaziranga, Shillong, Cherrapunji, Gangtok, Tawang, Ziro, Loktak, Majuli
 * - centralMPChhattisgarh.js — MP/CG: Khajuraho, Bandhavgarh, Kanha, Orchha, Ujjain, Pachmarhi, Chitrakot, Sanchi
 * - northeastExtra.js        — NE Extra: Dawki, Living Root Bridges, Mawlynnong, Hornbill Festival, Dzukou, Pelling, Lachung, Neermahal, Unakoti
 * - islands.js               — Islands: Havelock, Neil, Port Blair, Baratang, Lakshadweep Agatti, Minicoy
 * - remainingMixed.js        — Mixed: Gwalior, Mandu, Murudeshwar, Udupi, Pattadakal, Aihole, Shantiniketan, Digha, Netarhat, Nagarjunasagar, Srisailam, Horsley Hills
 */

import northHimachal from './northHimachal.js';
import northRajasthan from './northRajasthan.js';
import northUPDelhi from './northUPDelhi.js';
import northUttarakhand from './northUttarakhand.js';
import northJKLadakh from './northJKLadakh.js';
import southKerala from './southKerala.js';
import southKarnataka from './southKarnataka.js';
import southTamilNadu from './southTamilNadu.js';
import southGoaAP from './southGoaAP.js';
import westMaharashtra from './westMaharashtra.js';
import westGujarat from './westGujarat.js';
import eastWBOdisha from './eastWBOdisha.js';
import eastBiharNortheast from './eastBiharNortheast.js';
import centralMPChhattisgarh from './centralMPChhattisgarh.js';
import northeastExtra from './northeastExtra.js';
import islands from './islands.js';
import remainingMixed from './remainingMixed.js';

const destinations = [
  ...northHimachal,
  ...northRajasthan,
  ...northUPDelhi,
  ...northUttarakhand,
  ...northJKLadakh,
  ...southKerala,
  ...southKarnataka,
  ...southTamilNadu,
  ...southGoaAP,
  ...westMaharashtra,
  ...westGujarat,
  ...eastWBOdisha,
  ...eastBiharNortheast,
  ...centralMPChhattisgarh,
  ...northeastExtra,
  ...islands,
  ...remainingMixed,
];

// ── Stats ────────────────────────────────────────────────────────────────────
const byRegion = destinations.reduce((acc, d) => {
  acc[d.region] = (acc[d.region] || 0) + 1;
  return acc;
}, {});

const byState = destinations.reduce((acc, d) => {
  acc[d.state] = (acc[d.state] || 0) + 1;
  return acc;
}, {});

const featured = destinations.filter(d => d.isFeatured);
const popular  = destinations.filter(d => d.isPopular);

console.log(`✅ Pavilion India — Total destinations loaded: ${destinations.length}`);
console.log('📍 By region:', byRegion);
console.log(`⭐ Featured: ${featured.length} | 🔥 Popular: ${popular.length}`);

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Find a destination by its slug */
export function findBySlug(slug) {
  return destinations.find(d => d.slug === slug) || null;
}

/** Get all destinations for a state */
export function findByState(state) {
  return destinations.filter(d => d.state.toLowerCase().includes(state.toLowerCase()));
}

/** Get all destinations for a region */
export function findByRegion(region) {
  return destinations.filter(d => d.region.toLowerCase() === region.toLowerCase());
}

/** Get destinations by type */
export function findByType(type) {
  return destinations.filter(d => d.type.toLowerCase() === type.toLowerCase());
}

/** Get featured destinations */
export function getFeatured() {
  return destinations.filter(d => d.isFeatured);
}

/** Get popular destinations */
export function getPopular() {
  return destinations.filter(d => d.isPopular);
}

/** Search by tag */
export function findByTag(tag) {
  return destinations.filter(d => d.tags.includes(tag.toLowerCase()));
}

/** Get best destinations for a given month (by season match) */
export function bestForMonth(monthIndex) {
  const seasons = {
    0: 'Winter', 1: 'Winter', 2: 'Spring', 3: 'Spring',
    4: 'Summer', 5: 'Summer', 6: 'Monsoon', 7: 'Monsoon',
    8: 'Monsoon', 9: 'Post-Monsoon', 10: 'Post-Monsoon', 11: 'Winter',
  };
  const goodSeasons = {
    Winter: ['Winter', 'Post-Monsoon'],
    Spring: ['Spring', 'Winter'],
    Summer: ['Summer'],
    Monsoon: ['Monsoon'],
    'Post-Monsoon': ['Post-Monsoon', 'Winter'],
  };
  const currentSeason = seasons[monthIndex];
  return destinations.filter(d =>
    d.climate && d.climate[monthIndex] &&
    goodSeasons[currentSeason]?.includes(d.climate[monthIndex].season)
  );
}

export { destinations, byRegion, byState };
export default destinations;
