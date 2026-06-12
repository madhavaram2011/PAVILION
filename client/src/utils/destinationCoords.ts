/**
 * Pre-built coordinate lookup for all 15 Indian destinations + extras.
 * Used by the MapModal to display destinations on Google Maps.
 */

export interface DestinationCoord {
  lat: number
  lng: number
  address: string
  zoom?: number
}

export const DESTINATION_COORDS: Record<string, DestinationCoord> = {
  // ── 15 Pre-seeded Destinations ─────────────────────────────────
  'Taj Mahal, Agra':       { lat: 27.1751, lng: 78.0421, address: 'Taj Mahal, Agra, Uttar Pradesh, India', zoom: 16 },
  'Taj Mahal':             { lat: 27.1751, lng: 78.0421, address: 'Taj Mahal, Agra, Uttar Pradesh, India', zoom: 16 },
  'Goa Beaches':           { lat: 15.2993, lng: 74.1240, address: 'Goa, India', zoom: 11 },
  'Goa':                   { lat: 15.2993, lng: 74.1240, address: 'Goa, India', zoom: 11 },
  'Kerala Backwaters':     { lat: 9.4981,  lng: 76.3388, address: 'Alleppey, Kerala, India', zoom: 13 },
  'Alleppey':              { lat: 9.4981,  lng: 76.3388, address: 'Alleppey, Kerala, India', zoom: 13 },
  'Jaipur, Rajasthan':     { lat: 26.9124, lng: 75.7873, address: 'Jaipur, Rajasthan, India', zoom: 13 },
  'Jaipur':                { lat: 26.9124, lng: 75.7873, address: 'Jaipur, Rajasthan, India', zoom: 13 },
  'Leh Ladakh':            { lat: 34.1526, lng: 77.5771, address: 'Leh, Ladakh, India', zoom: 12 },
  'Ladakh':                { lat: 34.1526, lng: 77.5771, address: 'Leh, Ladakh, India', zoom: 12 },
  'Varanasi':              { lat: 25.3176, lng: 83.0068, address: 'Varanasi, Uttar Pradesh, India', zoom: 14 },
  'Andaman Islands':       { lat: 11.7401, lng: 92.6586, address: 'Port Blair, Andaman and Nicobar Islands, India', zoom: 10 },
  'Havelock Island':       { lat: 11.9716, lng: 93.0000, address: 'Havelock Island, Andaman, India', zoom: 13 },
  'Manali':                { lat: 32.2396, lng: 77.1887, address: 'Manali, Himachal Pradesh, India', zoom: 13 },
  'Udaipur':               { lat: 24.5854, lng: 73.7125, address: 'Udaipur, Rajasthan, India', zoom: 14 },
  'Darjeeling':            { lat: 27.0360, lng: 88.2627, address: 'Darjeeling, West Bengal, India', zoom: 14 },
  'Rishikesh':             { lat: 30.0869, lng: 78.2676, address: 'Rishikesh, Uttarakhand, India', zoom: 14 },
  'Hampi':                 { lat: 15.3350, lng: 76.4600, address: 'Hampi, Karnataka, India', zoom: 14 },
  'Jaisalmer':             { lat: 26.9157, lng: 70.9083, address: 'Jaisalmer, Rajasthan, India', zoom: 13 },
  'Munnar':                { lat: 10.0889, lng: 77.0595, address: 'Munnar, Kerala, India', zoom: 13 },
  'Kaziranga':             { lat: 26.5775, lng: 93.1711, address: 'Kaziranga National Park, Assam, India', zoom: 12 },

  // ── Additional destinations from DestinationsPage ──────────────
  'Jim Corbett':           { lat: 29.5300, lng: 78.7747, address: 'Jim Corbett National Park, Uttarakhand, India', zoom: 12 },
  'Shimla':                { lat: 31.1048, lng: 77.1734, address: 'Shimla, Himachal Pradesh, India', zoom: 14 },
  'Amritsar':              { lat: 31.6340, lng: 74.8723, address: 'Golden Temple, Amritsar, Punjab, India', zoom: 15 },
  'Agra':                  { lat: 27.1767, lng: 78.0081, address: 'Agra, Uttar Pradesh, India', zoom: 13 },
  'Nainital':              { lat: 29.3919, lng: 79.4542, address: 'Nainital, Uttarakhand, India', zoom: 14 },
  'Mathura':               { lat: 27.4924, lng: 77.6737, address: 'Mathura, Uttar Pradesh, India', zoom: 14 },
  'Mussoorie':             { lat: 30.4598, lng: 78.0644, address: 'Mussoorie, Uttarakhand, India', zoom: 14 },
  'Meenakshi Temple':      { lat: 9.9195,  lng: 78.1193, address: 'Meenakshi Temple, Madurai, Tamil Nadu, India', zoom: 17 },
  'Coorg':                 { lat: 12.3375, lng: 75.8069, address: 'Coorg, Karnataka, India', zoom: 12 },
  'Mysore':                { lat: 12.2958, lng: 76.6394, address: 'Mysore, Karnataka, India', zoom: 13 },
  'Ooty':                  { lat: 11.4102, lng: 76.6950, address: 'Ooty, Tamil Nadu, India', zoom: 13 },
  'Pondicherry':           { lat: 11.9416, lng: 79.8083, address: 'Pondicherry, India', zoom: 14 },
  'Mahabalipuram':         { lat: 12.6269, lng: 80.1927, address: 'Mahabalipuram, Tamil Nadu, India', zoom: 15 },
  'Ajanta Caves':          { lat: 20.5519, lng: 75.7033, address: 'Ajanta Caves, Maharashtra, India', zoom: 15 },
  'Rann of Kutch':         { lat: 23.7337, lng: 69.8597, address: 'Rann of Kutch, Gujarat, India', zoom: 10 },
  'Mumbai':                { lat: 19.0760, lng: 72.8777, address: 'Mumbai, Maharashtra, India', zoom: 12 },
  'Ellora Caves':          { lat: 20.0258, lng: 75.1780, address: 'Ellora Caves, Maharashtra, India', zoom: 15 },
  'Jodhpur':               { lat: 26.2389, lng: 73.0243, address: 'Jodhpur, Rajasthan, India', zoom: 13 },
  'Mount Abu':             { lat: 24.5926, lng: 72.7156, address: 'Mount Abu, Rajasthan, India', zoom: 13 },
  'Sundarbans':            { lat: 21.9497, lng: 89.1833, address: 'Sundarbans, West Bengal, India', zoom: 10 },
  'Konark':                { lat: 19.8876, lng: 86.0945, address: 'Konark Sun Temple, Odisha, India', zoom: 16 },
  'Puri':                  { lat: 19.8135, lng: 85.8312, address: 'Puri, Odisha, India', zoom: 14 },
  'Kolkata':               { lat: 22.5726, lng: 88.3639, address: 'Kolkata, West Bengal, India', zoom: 12 },
  'Gangtok':               { lat: 27.3389, lng: 88.6065, address: 'Gangtok, Sikkim, India', zoom: 14 },
  'Kalimpong':             { lat: 27.0594, lng: 88.4695, address: 'Kalimpong, West Bengal, India', zoom: 14 },
  'Tawang':                { lat: 27.5860, lng: 91.8687, address: 'Tawang, Arunachal Pradesh, India', zoom: 13 },
  'Cherrapunji':           { lat: 25.2697, lng: 91.7195, address: 'Cherrapunji, Meghalaya, India', zoom: 13 },
  'Ziro Valley':           { lat: 27.5370, lng: 93.8310, address: 'Ziro Valley, Arunachal Pradesh, India', zoom: 12 },
  'Majuli Island':         { lat: 26.9500, lng: 94.1667, address: 'Majuli Island, Assam, India', zoom: 12 },
  'Dzukou Valley':         { lat: 25.5590, lng: 94.0940, address: 'Dzukou Valley, Nagaland, India', zoom: 13 },
  'Khajuraho':             { lat: 24.8318, lng: 79.9199, address: 'Khajuraho, Madhya Pradesh, India', zoom: 15 },
  'Bandhavgarh':           { lat: 23.7230, lng: 80.9650, address: 'Bandhavgarh National Park, Madhya Pradesh, India', zoom: 12 },
  'Kanha':                 { lat: 22.3358, lng: 80.6115, address: 'Kanha National Park, Madhya Pradesh, India', zoom: 11 },
  'Sanchi':                { lat: 23.4793, lng: 77.7398, address: 'Sanchi, Madhya Pradesh, India', zoom: 15 },
  'Pench':                 { lat: 21.7800, lng: 79.3000, address: 'Pench National Park, Madhya Pradesh, India', zoom: 11 },
  'Orchha':                { lat: 25.3519, lng: 78.6407, address: 'Orchha, Madhya Pradesh, India', zoom: 14 },
  'Neil Island':           { lat: 11.8316, lng: 93.0486, address: 'Neil Island, Andaman, India', zoom: 14 },
  'Lakshadweep':           { lat: 10.5667, lng: 72.6417, address: 'Lakshadweep, India', zoom: 10 },
  'Radhanagar Beach':      { lat: 11.9818, lng: 92.9515, address: 'Radhanagar Beach, Havelock, Andaman, India', zoom: 15 },
  'Ross Island':           { lat: 11.6781, lng: 92.7546, address: 'Ross Island, Andaman, India', zoom: 16 },
}

/**
 * Look up coordinates for a destination name.
 * Uses fuzzy matching if exact match not found.
 */
export function getDestinationCoords(name: string): DestinationCoord | null {
  // Direct match
  if (DESTINATION_COORDS[name]) return DESTINATION_COORDS[name]

  // Case-insensitive match
  const lower = name.toLowerCase()
  for (const [key, value] of Object.entries(DESTINATION_COORDS)) {
    if (key.toLowerCase() === lower) return value
  }

  // Partial match
  for (const [key, value] of Object.entries(DESTINATION_COORDS)) {
    if (key.toLowerCase().includes(lower) || lower.includes(key.toLowerCase())) {
      return value
    }
  }

  return null
}
