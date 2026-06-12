/**
 * In-memory Places data store — seeded with 15 Indian destinations.
 * Each place has coordinates for map integration.
 */

let nextId = 16;
const generateId = () => `p${nextId++}`;

const PLACES = [
  {
    id: 'p1',
    title: 'Taj Mahal, Agra',
    description: 'The crown jewel of India — an ivory-white marble mausoleum on the banks of the Yamuna. A UNESCO World Heritage Site and one of the Seven Wonders of the World.',
    address: 'Taj Mahal, Agra, Uttar Pradesh, India',
    location: { lat: 27.1751, lng: 78.0421 },
    country: 'India',
    continent: 'North India',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&q=80',
    rating: 4.9,
    category: ['cultural', 'city'],
    creator: 'u1',
  },
  {
    id: 'p2',
    title: 'Goa Beaches',
    description: "India's smallest state packs the biggest punch — golden beaches, Portuguese heritage churches, vibrant nightlife, spice plantations and seafood shacks.",
    address: 'Goa, India',
    location: { lat: 15.2993, lng: 74.1240 },
    country: 'India',
    continent: 'West India',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=80',
    rating: 4.7,
    category: ['beach', 'adventure'],
    creator: 'u1',
  },
  {
    id: 'p3',
    title: 'Kerala Backwaters',
    description: "God's Own Country — a network of tranquil lagoons, canals and lakes fringed by swaying palms. Drift through on a traditional houseboat.",
    address: 'Alleppey, Kerala, India',
    location: { lat: 9.4981, lng: 76.3388 },
    country: 'India',
    continent: 'South India',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=80',
    rating: 4.8,
    category: ['cultural', 'beach'],
    creator: 'u1',
  },
  {
    id: 'p4',
    title: 'Jaipur, Rajasthan',
    description: "The Pink City — a vibrant tapestry of majestic forts, ornate palaces, bustling bazaars and Rajasthani hospitality.",
    address: 'Jaipur, Rajasthan, India',
    location: { lat: 26.9124, lng: 75.7873 },
    country: 'India',
    continent: 'North India',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1200&q=80',
    rating: 4.8,
    category: ['cultural', 'city'],
    creator: 'u1',
  },
  {
    id: 'p5',
    title: 'Leh Ladakh',
    description: 'The rooftop of India — a high-altitude desert of turquoise lakes, ancient Buddhist monasteries, dramatic mountain passes.',
    address: 'Leh, Ladakh, India',
    location: { lat: 34.1526, lng: 77.5771 },
    country: 'India',
    continent: 'North India',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&q=80',
    rating: 4.9,
    category: ['mountain', 'adventure'],
    creator: 'u2',
  },
  {
    id: 'p6',
    title: 'Varanasi',
    description: 'The oldest living city in the world — where life and death coexist on the ghats of the sacred Ganges.',
    address: 'Varanasi, Uttar Pradesh, India',
    location: { lat: 25.3176, lng: 83.0068 },
    country: 'India',
    continent: 'North India',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1200&q=80',
    rating: 4.7,
    category: ['cultural', 'city'],
    creator: 'u2',
  },
  {
    id: 'p7',
    title: 'Andaman Islands',
    description: 'Crystal-clear turquoise waters, pristine white sand beaches, world-class coral reefs and dense tropical rainforests.',
    address: 'Port Blair, Andaman and Nicobar Islands, India',
    location: { lat: 11.7401, lng: 92.6586 },
    country: 'India',
    continent: 'Islands',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80',
    rating: 4.8,
    category: ['beach', 'adventure'],
    creator: 'u1',
  },
  {
    id: 'p8',
    title: 'Manali',
    description: 'A Himalayan jewel in Himachal Pradesh — snow-capped peaks, pine forests, apple orchards and the mighty Beas River.',
    address: 'Manali, Himachal Pradesh, India',
    location: { lat: 32.2396, lng: 77.1887 },
    country: 'India',
    continent: 'North India',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=80',
    rating: 4.7,
    category: ['mountain', 'adventure'],
    creator: 'u2',
  },
  {
    id: 'p9',
    title: 'Udaipur',
    description: 'The Venice of the East — a romantic city of shimmering lakes, white marble palaces and lush hills.',
    address: 'Udaipur, Rajasthan, India',
    location: { lat: 24.5854, lng: 73.7125 },
    country: 'India',
    continent: 'North India',
    image: 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=1200&q=80',
    rating: 4.8,
    category: ['cultural', 'city'],
    creator: 'u1',
  },
  {
    id: 'p10',
    title: 'Darjeeling',
    description: "The Queen of Hills — endless tea gardens cascading down misty slopes, with Kanchenjunga towering above.",
    address: 'Darjeeling, West Bengal, India',
    location: { lat: 27.0360, lng: 88.2627 },
    country: 'India',
    continent: 'East India',
    image: 'https://images.unsplash.com/photo-1506038634487-60a69ae4b7b1?w=1200&q=80',
    rating: 4.6,
    category: ['mountain', 'cultural'],
    creator: 'u2',
  },
  {
    id: 'p11',
    title: 'Rishikesh',
    description: 'The Yoga Capital of the World — nestled in the Himalayan foothills where the Ganges roars through.',
    address: 'Rishikesh, Uttarakhand, India',
    location: { lat: 30.0869, lng: 78.2676 },
    country: 'India',
    continent: 'North India',
    image: 'https://images.unsplash.com/photo-1583396082781-89ef7a841c72?w=1200&q=80',
    rating: 4.7,
    category: ['adventure', 'cultural'],
    creator: 'u1',
  },
  {
    id: 'p12',
    title: 'Hampi',
    description: 'A surreal landscape of giant boulders and ancient Vijayanagara Empire ruins. UNESCO World Heritage Site.',
    address: 'Hampi, Karnataka, India',
    location: { lat: 15.3350, lng: 76.4600 },
    country: 'India',
    continent: 'South India',
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1200&q=80',
    rating: 4.7,
    category: ['cultural', 'adventure'],
    creator: 'u2',
  },
  {
    id: 'p13',
    title: 'Jaisalmer',
    description: 'The Golden City — a living fort rising from the Thar Desert like a mirage. Golden sandstone havelis and camel safaris.',
    address: 'Jaisalmer, Rajasthan, India',
    location: { lat: 26.9157, lng: 70.9083 },
    country: 'India',
    continent: 'North India',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&q=80',
    rating: 4.8,
    category: ['desert', 'cultural'],
    creator: 'u1',
  },
  {
    id: 'p14',
    title: 'Munnar',
    description: 'A hill station in Kerala draped in endless carpets of tea plantations. Rolling green hills and misty mornings.',
    address: 'Munnar, Kerala, India',
    location: { lat: 10.0889, lng: 77.0595 },
    country: 'India',
    continent: 'South India',
    image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1200&q=80',
    rating: 4.7,
    category: ['mountain', 'cultural'],
    creator: 'u2',
  },
  {
    id: 'p15',
    title: 'Kaziranga',
    description: "Home to two-thirds of the world's one-horned rhinoceroses. UNESCO World Heritage Site in Assam.",
    address: 'Kaziranga National Park, Assam, India',
    location: { lat: 26.5775, lng: 93.1711 },
    country: 'India',
    continent: 'East India',
    image: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=1200&q=80',
    rating: 4.6,
    category: ['wildlife', 'adventure'],
    creator: 'u1',
  },
];

// ── CRUD Operations ──────────────────────────────────────────────

export function getAllPlaces() {
  return [...PLACES];
}

export function getPlaceById(id) {
  return PLACES.find(p => p.id === id) || null;
}

export function getPlacesByUserId(userId) {
  return PLACES.filter(p => p.creator === userId);
}

export function createPlace(placeData) {
  const newPlace = {
    id: generateId(),
    ...placeData,
    createdAt: new Date().toISOString(),
  };
  PLACES.push(newPlace);
  return newPlace;
}

export function updatePlace(id, updateData) {
  const index = PLACES.findIndex(p => p.id === id);
  if (index === -1) return null;

  PLACES[index] = { ...PLACES[index], ...updateData, updatedAt: new Date().toISOString() };
  return PLACES[index];
}

export function deletePlace(id) {
  const index = PLACES.findIndex(p => p.id === id);
  if (index === -1) return false;
  PLACES.splice(index, 1);
  return true;
}

export default {
  getAllPlaces,
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
};
