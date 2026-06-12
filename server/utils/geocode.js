import AppError from './AppError.js';

/**
 * Fallback coordinate lookup for all 15 pre-seeded Indian destinations.
 * Used when no Google API key is configured.
 */
const COORDS_LOOKUP = {
  // ── 15 Pre-seeded Destinations ─────────────────────────────────
  'taj mahal, agra':        { lat: 27.1751, lng: 78.0421 },
  'taj mahal':              { lat: 27.1751, lng: 78.0421 },
  'agra':                   { lat: 27.1751, lng: 78.0421 },
  'goa beaches':            { lat: 15.2993, lng: 74.1240 },
  'goa':                    { lat: 15.2993, lng: 74.1240 },
  'kerala backwaters':      { lat: 9.4981,  lng: 76.3388 },
  'alleppey':               { lat: 9.4981,  lng: 76.3388 },
  'jaipur, rajasthan':      { lat: 26.9124, lng: 75.7873 },
  'jaipur':                 { lat: 26.9124, lng: 75.7873 },
  'leh ladakh':             { lat: 34.1526, lng: 77.5771 },
  'ladakh':                 { lat: 34.1526, lng: 77.5771 },
  'leh':                    { lat: 34.1526, lng: 77.5771 },
  'varanasi':               { lat: 25.3176, lng: 83.0068 },
  'andaman islands':        { lat: 11.7401, lng: 92.6586 },
  'port blair':             { lat: 11.6234, lng: 92.7265 },
  'manali':                 { lat: 32.2396, lng: 77.1887 },
  'udaipur':                { lat: 24.5854, lng: 73.7125 },
  'darjeeling':             { lat: 27.0360, lng: 88.2627 },
  'rishikesh':              { lat: 30.0869, lng: 78.2676 },
  'hampi':                  { lat: 15.3350, lng: 76.4600 },
  'jaisalmer':              { lat: 26.9157, lng: 70.9083 },
  'munnar':                 { lat: 10.0889, lng: 77.0595 },
  'kaziranga':              { lat: 26.5775, lng: 93.1711 },

  // ── Additional Indian Destinations ─────────────────────────────
  'amritsar':               { lat: 31.6340, lng: 74.8723 },
  'golden temple':          { lat: 31.6200, lng: 74.8765 },
  'shimla':                 { lat: 31.1048, lng: 77.1734 },
  'nainital':               { lat: 29.3919, lng: 79.4542 },
  'mussoorie':              { lat: 30.4598, lng: 78.0644 },
  'mathura':                { lat: 27.4924, lng: 77.6737 },
  'jim corbett':            { lat: 29.5300, lng: 78.7747 },
  'coorg':                  { lat: 12.3375, lng: 75.8069 },
  'mysore':                 { lat: 12.2958, lng: 76.6394 },
  'ooty':                   { lat: 11.4102, lng: 76.6950 },
  'pondicherry':            { lat: 11.9416, lng: 79.8083 },
  'mahabalipuram':          { lat: 12.6269, lng: 80.1927 },
  'ajanta caves':           { lat: 20.5519, lng: 75.7033 },
  'ellora caves':           { lat: 20.0258, lng: 75.1780 },
  'rann of kutch':          { lat: 23.7337, lng: 69.8597 },
  'jodhpur':                { lat: 26.2389, lng: 73.0243 },
  'mount abu':              { lat: 24.5926, lng: 72.7156 },
  'sundarbans':             { lat: 21.9497, lng: 89.1833 },
  'konark':                 { lat: 19.8876, lng: 86.0945 },
  'puri':                   { lat: 19.8135, lng: 85.8312 },
  'gangtok':                { lat: 27.3389, lng: 88.6065 },
  'tawang':                 { lat: 27.5860, lng: 91.8687 },
  'cherrapunji':            { lat: 25.2697, lng: 91.7195 },
  'ziro valley':            { lat: 27.5370, lng: 93.8310 },
  'khajuraho':              { lat: 24.8318, lng: 79.9199 },
  'sanchi':                 { lat: 23.4793, lng: 77.7398 },
  'orchha':                 { lat: 25.3519, lng: 78.6407 },
  'havelock island':        { lat: 11.9716, lng: 93.0000 },
  'neil island':            { lat: 11.8316, lng: 93.0486 },
  'lakshadweep':            { lat: 10.5667, lng: 72.6417 },
  'meenakshi temple':       { lat: 9.9195,  lng: 78.1193 },
  'madurai':                { lat: 9.9252,  lng: 78.1198 },
  'kalimpong':              { lat: 27.0594, lng: 88.4695 },
  'majuli island':          { lat: 26.9500, lng: 94.1667 },
  'bandhavgarh':            { lat: 23.7230, lng: 80.9650 },
  'kanha':                  { lat: 22.3358, lng: 80.6115 },
  'pench':                  { lat: 21.7800, lng: 79.3000 },

  // ── Major Indian Cities ────────────────────────────────────────
  'delhi':                  { lat: 28.6139, lng: 77.2090 },
  'new delhi':              { lat: 28.6139, lng: 77.2090 },
  'mumbai':                 { lat: 19.0760, lng: 72.8777 },
  'kolkata':                { lat: 22.5726, lng: 88.3639 },
  'chennai':                { lat: 13.0827, lng: 80.2707 },
  'bangalore':              { lat: 12.9716, lng: 77.5946 },
  'bengaluru':              { lat: 12.9716, lng: 77.5946 },
  'hyderabad':              { lat: 17.3850, lng: 78.4867 },
  'pune':                   { lat: 18.5204, lng: 73.8567 },
  'ahmedabad':              { lat: 23.0225, lng: 72.5714 },
  'lucknow':                { lat: 26.8467, lng: 80.9462 },
  'chandigarh':             { lat: 30.7333, lng: 76.7794 },
  'bhopal':                 { lat: 23.2599, lng: 77.4126 },
  'thiruvananthapuram':     { lat: 8.5241,  lng: 76.9366 },
  'kochi':                  { lat: 9.9312,  lng: 76.2673 },
};

/**
 * Convert an address string into { lat, lng } coordinates.
 * Uses Google Geocoding API if GOOGLE_API_KEY is set, otherwise falls back
 * to the built-in lookup table.
 *
 * @param {string} address - The address/place name to geocode
 * @returns {Promise<{lat: number, lng: number}>}
 */
export async function getCoordsForAddress(address) {
  if (!address) {
    throw AppError.badRequest('Address is required for geocoding.');
  }

  const normalised = address.trim().toLowerCase();

  // ── Try Google Geocoding API first ──────────────────────────────
  const apiKey = process.env.GOOGLE_API_KEY;

  if (apiKey) {
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        console.log(`[Geocode] Google API → ${address} → (${lat}, ${lng})`);
        return { lat, lng };
      }

      if (data.status === 'ZERO_RESULTS') {
        console.warn(`[Geocode] Google returned no results for "${address}", trying fallback...`);
      } else {
        console.warn(`[Geocode] Google API error: ${data.status} — trying fallback...`);
      }
    } catch (err) {
      console.warn(`[Geocode] Google API request failed: ${err.message} — trying fallback...`);
    }
  }

  // ── Fallback: built-in lookup table ────────────────────────────
  const coords = COORDS_LOOKUP[normalised];
  if (coords) {
    console.log(`[Geocode] Fallback → ${address} → (${coords.lat}, ${coords.lng})`);
    return coords;
  }

  // Try partial matching
  for (const [key, value] of Object.entries(COORDS_LOOKUP)) {
    if (normalised.includes(key) || key.includes(normalised)) {
      console.log(`[Geocode] Partial match → ${address} ≈ ${key} → (${value.lat}, ${value.lng})`);
      return value;
    }
  }

  // Try matching individual segments (e.g. "Amritsar, Punjab, India" → try "amritsar", "punjab", "india")
  const segments = normalised.split(/[,\s]+/).map(s => s.trim()).filter(Boolean);
  for (const segment of segments) {
    if (COORDS_LOOKUP[segment]) {
      console.log(`[Geocode] Segment match → ${address} (${segment}) → (${COORDS_LOOKUP[segment].lat}, ${COORDS_LOOKUP[segment].lng})`);
      return COORDS_LOOKUP[segment];
    }
  }

  throw AppError.badRequest(
    `Could not geocode address "${address}". Please provide a valid Indian location, or set GOOGLE_API_KEY in .env for worldwide geocoding.`
  );
}

export default getCoordsForAddress;
