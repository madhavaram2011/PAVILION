import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { FiArrowRight, FiArrowDown, FiCalendar, FiMapPin, FiChevronLeft, FiChevronRight, FiX, FiTrendingUp } from 'react-icons/fi'
import { GiCompass, GiLotus } from 'react-icons/gi'

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// DESIGN TOKENS â€” Spiritual Indian Editorial Light Journal
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const T = {
  ivory: '#fdfbf7',
  ivoryDim: '#f5f0e8',
  ivoryDeep: '#ede4d3',
  stone: '#1c1917',
  saffron: '#d97706',
  saffronL: '#f59e0b',
  saffronG: 'rgba(217,119,6,0.13)',
  crimson: '#be123c',
  crimsonG: 'rgba(190,18,60,0.10)',
  sand: '#a16207',
  mist: '#fef9f0',
  iceBlue: '#0ea5e9',
  iceBlueDim: 'rgba(14,165,233,0.14)',
  summerGlow: 'rgba(217,119,6,0.18)',
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// MOCK TOURS (fallback while API loads)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const MOCK_TOURS = [
  {
    _id: 'mock-1', slug: 'spiti-cold-desert-circuit',
    title: 'The Spiti Cold Desert Circuit',
    destination: { name: 'Spiti Valley, Himachal Pradesh' },
    coverImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=70',
    duration: 7, groupSize: { max: 10 }, difficulty: 'Demanding',
    price: 48500, discountPrice: 42900,
    highlights: ['Key Monastery at dawn', 'Camp at Chandratal Lake', 'Cross Kunzum Pass at 4,551m', "World's highest post office"],
  },
  {
    _id: 'mock-2', slug: 'varanasi-ganges-immersion',
    title: 'Varanasi: A Ganges Immersion',
    destination: { name: 'Varanasi, Uttar Pradesh' },
    coverImage: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=70',
    duration: 4, groupSize: { max: 8 }, difficulty: 'Gentle',
    price: 24000, discountPrice: null,
    highlights: ['Sunrise boat ride past 84 ghats', 'Private Ganga Aarti seat', 'Silk weaving lane walk', 'Morning at Sarnath'],
  },
  {
    _id: 'mock-3', slug: 'rajasthan-forts-and-deserts',
    title: 'Rajasthan: Forts & Golden Sands',
    destination: { name: 'Jaipur to Jaisalmer, Rajasthan' },
    coverImage: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=70',
    duration: 9, groupSize: { max: 12 }, difficulty: 'Moderate',
    price: 67000, discountPrice: 59900,
    highlights: ['Dawn entry to Amber Fort', 'Heritage haveli in Jaisalmer', 'Camel safari at Sam dunes', 'Blue-lane walk in Jodhpur'],
  },
]

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// JOURNEY CATEGORIES â€” Heritage (Taj Mahal), Spiritual (Temple), Adventure (Rafting), Wilderness (Forest)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const JOURNEYS = [
  {
    id: 'heritage', label: 'Heritage', mark: 'I',
    accent: T.saffron,
    badge: 'Taj Mahal Â· Agra',
    headline: 'Stone that remembers everything',
    body: "Mughal marble, Rajput sandstone, Dravidian temple towers carved over centuries. India's heritage isn't roped off behind glass â€” it's lived in, prayed in, and walked through daily.",
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1400&q=90',
    places: ['Taj Mahal, Agra', 'Amber Fort, Jaipur', 'Mehrangarh, Jodhpur', 'Hampi Ruins, Karnataka'],
    cardBg: '#fffbf2',
  },
  {
    id: 'spiritual', label: 'Spiritual', mark: 'II',
    accent: T.crimson,
    badge: 'Temple Circuit Â· Varanasi',
    headline: 'A stillness older than memory',
    body: 'The ghats of Rishikesh at dawn â€” yoga mats on cool stone, the Ganga rushing green below, bells echoing off forested hills. India holds sacred space at a scale that changes people.',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1400&q=90',
    places: ['Rishikesh Ghats, Uttarakhand', 'Golden Temple, Amritsar', 'Pushkar Lake, Rajasthan', 'Auroville, Pondicherry'],
    cardBg: '#fff7f9',
  },
  {
    id: 'adventure', label: 'Adventure', mark: 'III',
    accent: '#0d9488',
    badge: 'River Rafting Â· Rishikesh',
    headline: 'The river does not negotiate',
    body: 'Grade IV rapids on the Ganges through the gorge at Rishikesh â€” water white and cold, adrenaline absolute. Then silence, forest walls, a kingfisher on a rock. India earns its mountains.',
    image: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=1400&q=90',
    places: ['Rishikesh Rafting, Uttarakhand', 'Spiti Valley, Himachal', 'Rohtang Pass, Manali', 'Dzukou Valley, Nagaland'],
    cardBg: '#f0fdf9',
  },
  {
    id: 'wilderness', label: 'Wilderness', mark: 'IV',
    accent: '#15803d',
    badge: 'Forest Reserve Â· Ranthambore',
    headline: 'Wild at a scale that humbles',
    body: 'A Bengal tiger moves without sound through dry deciduous forest. Crocodiles bask in still lakes. The wild here has never needed an audience and is the richer for it.',
    image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=1400&q=90',
    places: ['Ranthambore, Rajasthan', 'Kaziranga, Assam', 'Sundarbans, West Bengal', 'Bandhavgarh, MP'],
    cardBg: '#f0fdf4',
  },
]

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// TRAVEL PERSONA DATA â€” for Mood Selector widget
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const PERSONAS = [
  {
    id: 'soul',
    pill: 'Soul Searcher ðŸ§˜â€â™‚ï¸',
    color: T.saffron,
    bg: T.saffronG,
    title: 'The Inner India',
    subtitle: 'Varanasi Â· Rishikesh Â· Auroville',
    body: "You travel to be changed. You want sunrise on the Ganges, firelight meditation, a conversation with a sadhu at dusk. We plan the quiet moments everyone else rushes past.",
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=900&q=85',
    tags: ['4â€“7 days', 'Small group', 'Slow pace'],
    cta: 'Find your stillness',
  },
  {
    id: 'thrill',
    pill: 'Thrill Seeker ðŸŒŠ',
    color: '#0d9488',
    bg: 'rgba(13,148,136,0.10)',
    title: 'India at Full Speed',
    subtitle: 'Rishikesh Â· Spiti Â· Coorg',
    body: "Grade IV rapids. 4,500-metre passes. Night treks through living root bridges. You're here for the moments that make your pulse reset. We build the logistics so you can focus on the edge.",
    image: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=900&q=85',
    tags: ['7â€“14 days', 'Active daily', 'High altitude'],
    cta: 'Choose your adventure',
  },
  {
    id: 'royal',
    pill: 'Royal Chronicler ðŸ°',
    color: T.crimson,
    bg: T.crimsonG,
    title: 'The Palace Route',
    subtitle: 'Jaipur Â· Udaipur Â· Jodhpur',
    body: "Private dawn entry to Amber Fort. Dinner in a haveli that's been in one family for eleven generations. The India of durbar halls and silk bazaars, without the tourist rush.",
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=900&q=85',
    tags: ['8â€“12 days', 'Heritage stays', 'Curated access'],
    cta: 'Explore the palaces',
  },
  {
    id: 'wild',
    pill: 'Wild Explorer ðŸ…',
    color: '#15803d',
    bg: 'rgba(21,128,61,0.10)',
    title: 'Into the Reserves',
    subtitle: 'Ranthambore Â· Kaziranga Â· Sundarbans',
    body: "Before breakfast, a tiger at 40 metres. By afternoon, a one-horned rhino in the grass. Evening: a fire, binoculars, silence. We know the park wardens, the naturalists, the best hides.",
    image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=900&q=85',
    tags: ['5â€“10 days', 'Expert guides', 'Dawn safaris'],
    cta: 'Enter the wild',
  },
]

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// SEASON DATA
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const MONTHS_SHORT = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
const MONTHS_FULL = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const SEASON_DATA = [
  { region: 'Rajasthan & North Plains', icon: 'ðŸ°', months: [2, 2, 2, 3, 4, 4, 4, 4, 3, 1, 1, 1] },
  { region: 'Kerala & South Coast', icon: 'ðŸŒ´', months: [1, 1, 2, 2, 3, 4, 4, 4, 3, 2, 1, 1] },
  { region: 'Ladakh & High Himalaya', icon: 'ðŸ”ï¸', months: [4, 4, 4, 4, 3, 2, 1, 1, 2, 3, 4, 4] },
  { region: 'Northeast India', icon: 'ðŸŒ¿', months: [2, 2, 1, 1, 2, 4, 4, 4, 3, 1, 1, 2] },
  { region: 'Andaman Islands', icon: 'ðŸ ', months: [1, 1, 1, 1, 2, 4, 4, 4, 3, 2, 1, 1] },
]

// Season month range classification
function getSeasonForMonth(m: number): 'summer' | 'monsoon' | 'autumn' | 'winter' {
  if (m >= 2 && m <= 5) return 'summer'
  if (m >= 6 && m <= 8) return 'monsoon'
  if (m >= 9 && m <= 10) return 'autumn'
  return 'winter'
}

const SEASON_COLORS: Record<number, { bg: string; label: string }> = {
  1: { bg: T.saffron, label: 'Peak' },
  2: { bg: '#a16207', label: 'Good' },
  3: { bg: '#d6c09a', label: 'Fair' },
  4: { bg: 'rgba(28,25,23,0.08)', label: 'Avoid' },
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// TRIP BUILDER DATA
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const VIBES = ['All Culture', 'Wildlife First', 'Beach & Backwaters', 'Himalayan Peaks', 'Spiritual Depth', 'Festival Season']
const BUDGETS = ['Budget Conscious', 'Mid-Range', 'Premium', 'Ultra Luxury']
const PACES = ['Slow & Deep', 'Balanced', 'Action-Packed']

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// INDIAN FESTIVALS â€” mapped to month/day with travel metadata
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface Festival {
  name: string; month: number; day: number
  region: string; description: string
  travelIndex: number; color: string; emoji: string
}

const FESTIVALS: Festival[] = [
  { name: 'Republic Day Parade', month: 0, day: 26, region: 'New Delhi', description: "India's grandest military parade along Kartavya Path. Witness cultural tableaux from every state, aerial displays, and the Presidential salute.", travelIndex: 4, color: T.crimson, emoji: 'ðŸ‡®ðŸ‡³' },
  { name: 'Holi', month: 2, day: 14, region: 'Mathura & Vrindavan', description: 'The Festival of Colours at its most authentic root â€” gulal-drenched streets, the Lathmar Holi of Barsana, flower Holi at Vrindavan temples.', travelIndex: 5, color: T.saffron, emoji: 'ðŸŒˆ' },
  { name: 'Baisakhi', month: 3, day: 13, region: 'Punjab & Amritsar', description: 'Sikh New Year and harvest festival. The Golden Temple radiates in dawn light, bhangra fills the streets, and the langar feeds thousands.', travelIndex: 3, color: '#16a34a', emoji: 'ðŸŒ¾' },
  { name: 'Rath Yatra', month: 6, day: 7, region: 'Puri, Odisha', description: "Lord Jagannath's colossal chariot procession through Puri. One of the world's largest religious gatherings â€” over a million pilgrims on the Grand Road.", travelIndex: 5, color: T.crimson, emoji: 'ðŸ›•' },
  { name: 'Independence Day', month: 7, day: 15, region: 'Red Fort, Delhi', description: "The Prime Minister's address from the ramparts of the Red Fort. Cities unfurl tricolours; kite festivals fill the skies across northern India.", travelIndex: 3, color: '#0369a1', emoji: 'ðŸ•Šï¸' },
  { name: 'Onam', month: 7, day: 28, region: 'Kerala', description: "Kerala's harvest festival â€” the floral Pookalam carpet, the majestic snake boat race (Vallamkali), and the legendary Onam Sadhya feast.", travelIndex: 4, color: '#15803d', emoji: 'ðŸŒ¸' },
  { name: 'Navratri & Durga Puja', month: 9, day: 2, region: 'Kolkata & Gujarat', description: "Nine nights of divine energy. Kolkata's pandals transform the city into a gallery of goddess art; Gujarat erupts in Garba all night under stars.", travelIndex: 5, color: T.crimson, emoji: 'ðŸ”±' },
  { name: 'Diwali', month: 10, day: 1, region: 'Pan-India', description: 'Festival of Light. Jaipur forts blaze in ghee lamps, Varanasi ghats float thousands of diyas on the Ganges. The most luminous night India offers.', travelIndex: 5, color: T.saffron, emoji: 'ðŸª”' },
  { name: 'Pushkar Camel Fair', month: 10, day: 5, region: 'Pushkar, Rajasthan', description: "The world's largest camel fair â€” 50,000 camels traded on desert sands. Tribal musicians, acrobats, and the holy lake bathing ritual of Kartik Purnima.", travelIndex: 4, color: '#a16207', emoji: 'ðŸª' },
  { name: 'Hornbill Festival', month: 11, day: 1, region: 'Kohima, Nagaland', description: 'The Festival of Festivals â€” all sixteen Naga tribes perform warrior dances, log drum ceremonies, and indigenous fire rituals in the Kisama Heritage Village.', travelIndex: 3, color: T.saffron, emoji: 'ðŸ¦š' },
  { name: 'Christmas in Goa', month: 11, day: 25, region: 'Goa', description: "Goa's Portuguese-Konkani Christmas is unique in Asia â€” midnight masses in baroque churches, star lanterns over whitewashed facades, and caroling into dawn.", travelIndex: 5, color: T.crimson, emoji: 'â›ª' },
]

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// TRAVELLER DENSITY DATA â€” 12-month volume index (0â€“100) per region
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const DENSITY_DATA = [
  { region: 'Rajasthan', color: T.saffron, values: [82, 78, 65, 42, 22, 14, 10, 9, 24, 55, 75, 88] },
  { region: 'Kerala', color: '#16a34a', values: [88, 82, 70, 52, 40, 18, 12, 15, 30, 62, 85, 90] },
  { region: 'Himalayas', color: T.iceBlue, values: [8, 10, 18, 32, 55, 72, 88, 92, 68, 38, 12, 6] },
  { region: 'Goa', color: T.crimson, values: [92, 88, 78, 55, 32, 16, 10, 12, 28, 60, 80, 95] },
  { region: 'Northeast', color: '#7c3aed', values: [30, 35, 55, 65, 60, 25, 18, 20, 35, 55, 65, 40] },
]

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// ANIMATED TRAVEL PATH â€” plane/train/bus along bezier curve (RAF-based)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function TravelPathAnimation() {
  const pathD = "M -60,80 C 80,20 180,140 320,60 C 460,-20 560,120 700,55 C 840,-10 920,110 1080,60"
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 2 }}>
      <svg viewBox="0 0 1080 160" preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 220, opacity: 0.85 }}>
        <path d={pathD} fill="none" stroke={T.saffron} strokeWidth="1.2" strokeDasharray="5 12" opacity="0.28" />
        <AnimatedVehicle pathD={pathD} delay={0} duration={11} color={T.saffron} type="plane" />
        <AnimatedVehicle pathD={pathD} delay={3.7} duration={11} color={T.saffronL} type="train" />
        <AnimatedVehicle pathD={pathD} delay={7.3} duration={11} color={T.crimson} type="bus" />
      </svg>
    </div>
  )
}

function AnimatedVehicle({ pathD, delay, duration, color, type }: {
  pathD: string; delay: number; duration: number; color: string; type: 'plane' | 'train' | 'bus'
}) {
  const pathRef = useRef<SVGPathElement>(null)
  const dotRef = useRef<SVGGElement>(null)

  useEffect(() => {
    const path = pathRef.current; const dot = dotRef.current
    if (!path || !dot) return
    const length = path.getTotalLength(); let start: number | null = null; let raf: number
    const animate = (ts: number) => {
      if (!start) start = ts
      const elapsed = (ts - start) / 1000
      const progress = ((elapsed / duration + delay / duration) % 1)
      const point = path.getPointAtLength(progress * length)
      const tPoint = path.getPointAtLength(Math.min((progress + 0.01), 1) * length)
      const angle = Math.atan2(tPoint.y - point.y, tPoint.x - point.x) * 180 / Math.PI
      dot.setAttribute('transform', `translate(${point.x},${point.y}) rotate(${angle})`)
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [delay, duration])

  const sz = type === 'plane' ? 22 : 17
  return (
    <>
      <path ref={pathRef} d={pathD} fill="none" stroke="none" />
      <g ref={dotRef}>
        <circle r={sz * 0.85} fill={color} opacity="0.10" />
        {type === 'plane' && (
          <g transform={`translate(-${sz / 2},-${sz / 2})`}>
            <svg width={sz} height={sz} viewBox="0 0 24 24" fill={color}>
              <path d="M21 16V14L13 9V3.5a1.5 1.5 0 0 0-3 0V9L2 14v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5L21 16z" />
            </svg>
          </g>
        )}
        {type === 'train' && (
          <g>
            <rect x={-sz / 2} y={-sz * 0.35} width={sz} height={sz * 0.7} rx="3" fill={color} opacity="0.88" />
            <circle cx={-sz * 0.3} cy={sz * 0.35} r={2.5} fill={T.ivory} />
            <circle cx={sz * 0.3} cy={sz * 0.35} r={2.5} fill={T.ivory} />
            <rect x={-sz * 0.38} y={-sz * 0.28} width={sz * 0.34} height={sz * 0.28} rx="2" fill={T.ivory} opacity="0.45" />
            <rect x={sz * 0.04} y={-sz * 0.28} width={sz * 0.34} height={sz * 0.28} rx="2" fill={T.ivory} opacity="0.45" />
          </g>
        )}
        {type === 'bus' && (
          <g>
            <rect x={-sz / 2} y={-sz * 0.3} width={sz} height={sz * 0.62} rx="4" fill={color} opacity="0.88" />
            <circle cx={-sz * 0.28} cy={sz * 0.33} r={3.5} fill={T.ivory} />
            <circle cx={sz * 0.28} cy={sz * 0.33} r={3.5} fill={T.ivory} />
            {[-0.35, -0.1, 0.15, 0.35].map((x, i) => (
              <rect key={i} x={sz * x - 3.5} y={-sz * 0.22} width={6} height={sz * 0.24} rx="1.5" fill={T.ivory} opacity="0.5" />
            ))}
          </g>
        )}
      </g>
    </>
  )
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// TRAVEL GESTURE VECTOR ART â€” replaces orbital widget
// Bespoke SVG: compass rose + India outline + floating city pins + route beziers
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function TravelGestureArt({ pX, pY }: { pX: any; pY: any }) {
  return (
    <motion.div style={{
      x: pX, y: pY, position: 'absolute', right: '-4vw', top: '50%', translateY: '-50%',
      width: 'clamp(420px,42vw,640px)', height: 'clamp(420px,42vw,640px)',
      zIndex: 1, pointerEvents: 'none',
    }}>
      <svg viewBox="0 0 640 640" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
        <circle cx="320" cy="320" r="310" stroke={T.saffron} strokeWidth="0.7" strokeDasharray="8 16" opacity="0.20" />
        <circle cx="320" cy="320" r="230" stroke={T.saffron} strokeWidth="0.5" strokeDasharray="4 12" opacity="0.14" />
        <circle cx="320" cy="320" r="150" stroke={T.saffron} strokeWidth="0.5" opacity="0.09" />
        {/* Grid cross */}
        <line x1="100" y1="320" x2="540" y2="320" stroke={T.saffron} strokeWidth="0.5" opacity="0.09" strokeDasharray="3 8" />
        <line x1="320" y1="100" x2="320" y2="540" stroke={T.saffron} strokeWidth="0.5" opacity="0.09" strokeDasharray="3 8" />
        {/* Compass Rose */}
        <g transform="translate(320,320)">
          <motion.path d="M0,-112 L8,-30 L0,-8 L-8,-30 Z" fill={T.saffron} opacity="0.72"
            animate={{ rotate: [0, 360] }} transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
            style={{ originX: '0px', originY: '0px' }} />
          <path d="M0,112 L5,30 L0,8 L-5,30 Z" fill={T.crimson} opacity="0.48" />
          <path d="M-112,0 L-30,5 L-8,0 L-30,-5 Z" fill={T.stone} opacity="0.10" />
          <path d="M112,0 L30,5 L8,0 L30,-5 Z" fill={T.stone} opacity="0.10" />
          {[45, 135, 225, 315].map(angle => (
            <line key={angle} x1={0} y1={0} x2={Math.cos(angle * Math.PI / 180) * 75} y2={Math.sin(angle * Math.PI / 180) * 75}
              stroke={T.saffron} strokeWidth="0.7" opacity="0.16" />
          ))}
          <circle cx="0" cy="0" r="10" fill={T.ivory} stroke={T.saffron} strokeWidth="1.5" opacity="0.7" />
          <circle cx="0" cy="0" r="4" fill={T.saffron} opacity="0.8" />
        </g>
        {/* India subcontinent â€” stylised outline */}
        <path d="M310,145 C330,148 355,158 368,172 C385,190 388,215 382,232 C375,252 360,262 372,285 C384,308 400,315 402,338 C404,360 390,378 378,395 C365,415 355,430 340,448 C325,465 315,478 305,490 C298,498 293,502 288,498 C280,488 278,472 275,458 C270,438 260,422 252,405 C242,385 232,368 228,348 C224,328 228,308 235,292 C244,272 250,258 242,238 C234,218 218,208 215,188 C212,168 222,152 235,145 C250,138 280,140 310,145 Z"
          stroke={T.saffron} strokeWidth="1.2" fill={T.saffron} fillOpacity="0.05" opacity="0.35" />
        {/* City pin dots */}
        {[{ cx: 310, cy: 210 }, { cx: 340, cy: 380 }, { cx: 370, cy: 290 }, { cx: 290, cy: 330 }].map((p, i) => (
          <g key={i}>
            <circle cx={p.cx} cy={p.cy} r="3.5" fill={T.saffron} opacity="0.55" />
            <circle cx={p.cx} cy={p.cy} r="8" fill={T.saffron} opacity="0.07" />
          </g>
        ))}
        {/* Route dashes */}
        <path d="M310,210 C330,240 350,260 370,290" stroke={T.saffron} strokeWidth="0.8" strokeDasharray="4 8" opacity="0.24" fill="none" />
        <path d="M370,290 C360,320 348,352 340,380" stroke={T.crimson} strokeWidth="0.8" strokeDasharray="4 8" opacity="0.20" fill="none" />
        <path d="M310,210 C300,265 292,295 290,330" stroke={T.saffron} strokeWidth="0.8" strokeDasharray="4 8" opacity="0.18" fill="none" />
      </svg>
    </motion.div>
  )
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// HERO SECTION
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function HeroSection() {
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)
  const sX = useSpring(mouseX, { stiffness: 22, damping: 18 })
  const sY = useSpring(mouseY, { stiffness: 22, damping: 18 })
  const pX = useTransform(sX, [0, 1], [-18, 18])
  const pY = useTransform(sY, [0, 1], [-10, 10])

  const handleMouse = useCallback((e: React.MouseEvent) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
    mouseX.set((e.clientX - r.left) / r.width)
    mouseY.set((e.clientY - r.top) / r.height)
  }, [mouseX, mouseY])

  return (
    <section onMouseMove={handleMouse} style={{
      position: 'relative', minHeight: '100vh',
      display: 'flex', alignItems: 'center', overflow: 'hidden',
      background: `linear-gradient(150deg,${T.ivory} 0%,${T.ivoryDim} 60%,${T.ivoryDeep} 100%)`,
    }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle at 1px 1px,rgba(217,119,6,0.065) 1px,transparent 0)`, backgroundSize: '28px 28px', pointerEvents: 'none', zIndex: 1 }} />
      {/* Travel Gesture Art â€” replaces orbital widget */}
      <TravelGestureArt pX={pX} pY={pY} />
      {/* Tricolour stripe */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, display: 'flex', zIndex: 10 }}>
        <div style={{ flex: 1, background: '#FF9933' }} />
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.88)' }} />
        <div style={{ flex: 1, background: '#138808' }} />
      </div>
      {/* Main copy */}
      <div style={{ position: 'relative', zIndex: 5, width: '100%', maxWidth: 1360, margin: '0 auto', padding: '80px clamp(28px,6vw,96px) 140px' }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}
          style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
          <div style={{ width: 44, height: 2, background: T.saffron, borderRadius: 2 }} />
          <span style={{ fontFamily: '"Inter",sans-serif', fontSize: 11, letterSpacing: '0.45em', textTransform: 'uppercase', color: T.sand, fontWeight: 700 }}>
            Pavilion Â· Curated Journeys Across India
          </span>
        </motion.div>
        <div style={{ overflow: 'hidden' }}>
          <motion.h1 initial={{ y: '110%' }} animate={{ y: '0%' }} transition={{ duration: 0.9, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontFamily: '"Fraunces",serif', fontWeight: 500, fontSize: 'clamp(3rem,7.5vw,7.5rem)', lineHeight: 0.96, letterSpacing: '-0.02em', color: T.stone, margin: 0, maxWidth: 900 }}>
            Journey into the
          </motion.h1>
        </div>
        <div style={{ overflow: 'hidden' }}>
          <motion.h1 initial={{ y: '110%' }} animate={{ y: '0%' }} transition={{ duration: 0.9, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontFamily: '"Fraunces",serif', fontWeight: 500, fontStyle: 'italic', fontSize: 'clamp(3rem,7.5vw,7.5rem)', lineHeight: 0.96, letterSpacing: '-0.02em', color: T.saffron, margin: 0, maxWidth: 900 }}>
            soul of India.
          </motion.h1>
        </div>
        <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }}
          style={{ fontFamily: '"Inter",sans-serif', fontSize: 'clamp(15px,1.4vw,18px)', lineHeight: 1.8, color: `rgba(28,25,23,0.60)`, maxWidth: 480, margin: '28px 0 0' }}>
          Handcrafted itineraries built around local knowledge â€” not algorithms. Temples, tigers, high passes, sacred rivers. Every corner of this extraordinary country.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.68 }}
          style={{ display: 'flex', gap: 16, alignItems: 'center', marginTop: 44, flexWrap: 'wrap' }}>
          <Link to="/destinations" style={{
            background: T.saffron, color: T.ivory, fontFamily: '"Inter",sans-serif', fontSize: 12,
            letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700,
            padding: '17px 38px', borderRadius: 2, textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: 10,
            boxShadow: `0 12px 32px rgba(217,119,6,0.32)`, transition: 'transform 0.25s ease, box-shadow 0.25s ease',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 18px 44px rgba(217,119,6,0.44)` }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 32px rgba(217,119,6,0.32)` }}>
            Explore Destinations <FiArrowRight size={14} />
          </Link>
          <Link to="/tours" style={{
            background: 'transparent', color: T.stone, fontFamily: '"Inter",sans-serif', fontSize: 12,
            letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600,
            padding: '17px 38px', borderRadius: 2, textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: 10,
            border: `1.5px solid rgba(28,25,23,0.20)`, transition: 'border-color 0.2s, color 0.2s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = T.saffron; (e.currentTarget as HTMLElement).style.color = T.saffron }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(28,25,23,0.20)'; (e.currentTarget as HTMLElement).style.color = T.stone }}>
            Browse Itineraries
          </Link>
        </motion.div>
        {/* Quick stats */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
          style={{ display: 'flex', gap: 44, marginTop: 60, flexWrap: 'wrap' }}>
          {[['28+', 'States covered'], ['500+', 'Curated tours'], ['4.9â˜…', 'Avg rating']].map(([v, l]) => (
            <div key={l}>
              <p style={{ fontFamily: '"Fraunces",serif', fontSize: 28, color: T.stone, margin: 0, lineHeight: 1 }}>{v}</p>
              <p style={{ fontFamily: '"Inter",sans-serif', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: T.sand, margin: '4px 0 0' }}>{l}</p>
            </div>
          ))}
        </motion.div>
      </div>
      <TravelPathAnimation />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
        style={{ position: 'absolute', bottom: 32, left: 'clamp(28px,6vw,96px)', zIndex: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <FiArrowDown size={14} color={`rgba(28,25,23,0.36)`} />
        </motion.div>
        <span style={{ fontFamily: '"Inter",sans-serif', fontSize: 10, letterSpacing: '0.32em', textTransform: 'uppercase', color: `rgba(28,25,23,0.34)` }}>Scroll to explore</span>
      </motion.div>
    </section>
  )
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// JOURNEY EXPLORER â€” Heritage / Spiritual / Adventure / Wilderness showcase
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function JourneyExplorer() {
  const [active, setActive] = useState(0)
  const cur = JOURNEYS[active]

  return (
    <section style={{ position: 'relative', background: `linear-gradient(180deg,${T.ivory} 0%,${T.ivoryDim} 100%)`, borderTop: `1px solid rgba(28,25,23,0.08)` }}>
      <div style={{ maxWidth: 1360, margin: '0 auto', padding: '110px clamp(28px,6vw,96px)' }}>
        <div style={{ marginBottom: 60, maxWidth: 640 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <div style={{ width: 40, height: 2, background: T.saffron, borderRadius: 2 }} />
            <span style={{ fontFamily: '"Inter",sans-serif', fontSize: 11, letterSpacing: '0.4em', textTransform: 'uppercase', color: T.sand, fontWeight: 700 }}>Four Ways to Travel</span>
          </div>
          <h2 style={{ fontFamily: '"Fraunces",serif', fontWeight: 500, fontSize: 'clamp(2.4rem,4.8vw,4.2rem)', lineHeight: 1.05, color: T.stone, margin: 0 }}>
            Choose your <span style={{ fontStyle: 'italic', color: T.saffron }}>India</span>
          </h2>
          <p style={{ fontFamily: '"Inter",sans-serif', fontSize: 16, lineHeight: 1.8, color: `rgba(28,25,23,0.55)`, marginTop: 18 }}>
            Not one country but an entire continent of experiences. These are the four lenses Pavilion travels through.
          </p>
        </div>
        {/* Tab bar */}
        <div style={{ display: 'flex', gap: 0, borderTop: `1px solid rgba(28,25,23,0.1)`, borderBottom: `1px solid rgba(28,25,23,0.1)`, flexWrap: 'wrap' }}>
          {JOURNEYS.map((j, i) => (
            <button key={j.id} onClick={() => setActive(i)} style={{
              flex: '1 1 160px', textAlign: 'left', padding: '22px 24px',
              background: active === i ? `${j.accent}0D` : 'transparent',
              border: 'none', borderRight: `1px solid rgba(28,25,23,0.08)`,
              borderBottom: active === i ? `3px solid ${j.accent}` : '3px solid transparent',
              cursor: 'pointer', transition: 'background 0.3s',
            }}>
              <span style={{ fontFamily: '"Inter",sans-serif', fontSize: 10, letterSpacing: '0.2em', color: active === i ? j.accent : `rgba(28,25,23,0.26)`, display: 'block', marginBottom: 6, fontWeight: 700 }}>{j.mark}</span>
              <span style={{ fontFamily: '"Fraunces",serif', fontSize: 22, color: active === i ? T.stone : `rgba(28,25,23,0.3)`, display: 'block', transition: 'color 0.3s', fontStyle: active === i ? 'italic' : 'normal' }}>{j.label}</span>
            </button>
          ))}
        </div>
        {/* Panel */}
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
            {/* Text */}
            <div style={{ padding: '52px 56px 52px 0', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: cur.cardBg }}>
              {/* Badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginBottom: 22, background: `${cur.accent}12`, border: `1px solid ${cur.accent}35`, borderRadius: 100, padding: '7px 16px', width: 'fit-content' }}>
                <FiMapPin size={10} color={cur.accent} />
                <span style={{ fontFamily: '"Inter",sans-serif', fontSize: 11, fontWeight: 600, color: cur.accent, letterSpacing: '0.04em' }}>{cur.badge}</span>
              </div>
              <h3 style={{ fontFamily: '"Fraunces",serif', fontStyle: 'italic', fontSize: 'clamp(1.7rem,2.7vw,2.6rem)', lineHeight: 1.18, color: T.stone, marginBottom: 18 }}>{cur.headline}</h3>
              <p style={{ fontFamily: '"Inter",sans-serif', fontSize: 16, lineHeight: 1.88, color: `rgba(28,25,23,0.58)`, marginBottom: 28 }}>{cur.body}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 38 }}>
                {cur.places.map(p => (
                  <span key={p} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: '"Inter",sans-serif', fontSize: 11, fontWeight: 500, padding: '7px 14px', borderRadius: 100, background: `${cur.accent}0F`, border: `1px solid ${cur.accent}38`, color: cur.accent }}>
                    <FiMapPin size={10} /> {p}
                  </span>
                ))}
              </div>
              <Link to="/destinations" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: '"Inter",sans-serif', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700, color: cur.accent, textDecoration: 'none', borderBottom: `1.5px solid ${cur.accent}`, paddingBottom: 3 }}>
                Explore this path <FiArrowRight size={12} />
              </Link>
            </div>
            {/* Image */}
            <div style={{ position: 'relative', overflow: 'hidden', minHeight: 440 }}>
              <motion.div key={cur.image} initial={{ scale: 1.07, opacity: 0.7 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                style={{ position: 'absolute', inset: 0, backgroundImage: `url(${cur.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg,${cur.accent}18 0%,transparent 55%)` }} />
              <div style={{ position: 'absolute', bottom: 24, right: 24, fontFamily: '"Fraunces",serif', fontStyle: 'italic', fontSize: 15, color: T.ivory, background: 'rgba(28,25,23,0.5)', padding: '8px 18px', borderRadius: 2, backdropFilter: 'blur(6px)' }}>{cur.label}</div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// TRAVEL PERSONA FINDER â€” Mood-Based Journey Selector (light palette)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function PersonaFinder() {
  const [active, setActive] = useState<string | null>(null)
  const cur = PERSONAS.find(p => p.id === active) ?? null

  return (
    <section style={{ background: T.ivoryDim, padding: '120px clamp(28px,6vw,96px)', position: 'relative', overflow: 'hidden', borderTop: `1px solid rgba(28,25,23,0.08)` }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(ellipse at 30% 50%,rgba(217,119,6,0.06) 0%,transparent 60%),radial-gradient(ellipse at 80% 20%,rgba(190,18,60,0.05) 0%,transparent 50%)`, pointerEvents: 'none' }} />
      <div style={{ maxWidth: 1360, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            <div style={{ width: 32, height: 2, background: T.saffron, borderRadius: 2 }} />
            <span style={{ fontFamily: '"Inter",sans-serif', fontSize: 11, letterSpacing: '0.4em', textTransform: 'uppercase', color: T.sand, fontWeight: 600 }}>Mood-Based Journey Selector</span>
            <div style={{ width: 32, height: 2, background: T.saffron, borderRadius: 2 }} />
          </div>
          <h2 style={{ fontFamily: '"Fraunces",serif', fontWeight: 500, fontSize: 'clamp(2.4rem,4.8vw,4.2rem)', lineHeight: 1.05, color: T.stone, margin: 0 }}>
            Who are you <span style={{ fontStyle: 'italic', color: T.saffron }}>when you travel?</span>
          </h2>
          <p style={{ fontFamily: '"Inter",sans-serif', fontSize: 17, lineHeight: 1.8, color: `rgba(28,25,23,0.52)`, marginTop: 18, maxWidth: 520, margin: '18px auto 0' }}>
            Pick the mood that pulls at you right now. We'll show you what India looks like through that lens.
          </p>
        </div>
        {/* Mood pill row */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 60 }}>
          {PERSONAS.map(p => (
            <motion.button key={p.id}
              onClick={() => setActive(prev => prev === p.id ? null : p.id)}
              whileHover={{ y: -3 }} whileTap={{ scale: 0.96 }}
              style={{
                padding: '14px 28px', borderRadius: 100, cursor: 'pointer',
                fontFamily: '"Inter",sans-serif', fontSize: 14, fontWeight: 600, letterSpacing: '0.02em',
                background: active === p.id ? p.color : T.ivory,
                border: `2px solid ${active === p.id ? p.color : 'rgba(28,25,23,0.18)'}`,
                color: active === p.id ? T.ivory : T.stone,
                boxShadow: active === p.id ? `0 8px 32px ${p.color}40` : 'none',
                transition: 'all 0.28s ease',
              }}>
              {p.pill}
            </motion.button>
          ))}
        </div>
        {/* Persona showcase */}
        <AnimatePresence mode="wait">
          {cur ? (
            <motion.div key={cur.id}
              initial={{ opacity: 0, y: 28, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -16, scale: 0.97 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, border: `1px solid ${cur.color}28`, borderRadius: 4, overflow: 'hidden', boxShadow: `0 32px 80px rgba(28,25,23,0.10),0 0 0 1px ${cur.color}18` }}>
              {/* Text panel */}
              <div style={{ background: T.ivory, padding: '52px 52px 48px' }}>
                <div style={{ width: 44, height: 3, background: cur.color, borderRadius: 2, marginBottom: 28 }} />
                <p style={{ fontFamily: '"Inter",sans-serif', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: cur.color, fontWeight: 700, margin: '0 0 10px' }}>{cur.subtitle}</p>
                <h3 style={{ fontFamily: '"Fraunces",serif', fontWeight: 500, fontSize: 'clamp(1.9rem,3vw,2.9rem)', lineHeight: 1.1, color: T.stone, margin: '0 0 22px' }}>{cur.title}</h3>
                <p style={{ fontFamily: '"Inter",sans-serif', fontSize: 16, lineHeight: 1.88, color: `rgba(28,25,23,0.58)`, margin: '0 0 32px' }}>{cur.body}</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 40 }}>
                  {cur.tags.map(tag => (
                    <span key={tag} style={{ fontFamily: '"Inter",sans-serif', fontSize: 11, fontWeight: 600, padding: '6px 14px', borderRadius: 100, background: `${cur.color}12`, border: `1px solid ${cur.color}40`, color: cur.color }}>{tag}</span>
                  ))}
                </div>
                <Link to="/tours" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: cur.color, color: T.ivory, fontFamily: '"Inter",sans-serif', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700, padding: '15px 30px', borderRadius: 2, textDecoration: 'none', boxShadow: `0 8px 24px ${cur.color}38` }}>
                  {cur.cta} <FiArrowRight size={13} />
                </Link>
              </div>
              {/* Image panel */}
              <div style={{ position: 'relative', overflow: 'hidden', minHeight: 440 }}>
                <motion.div initial={{ scale: 1.06 }} animate={{ scale: 1 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  style={{ position: 'absolute', inset: 0, backgroundImage: `url(${cur.image})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.82) saturate(1.1)' }} />
                <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to right,${cur.color}18 0%,transparent 50%)` }} />
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                  style={{ position: 'absolute', top: 28, right: 28, background: 'rgba(253,251,247,0.88)', backdropFilter: 'blur(10px)', border: `1px solid ${cur.color}38`, borderRadius: 3, padding: '10px 18px' }}>
                  <p style={{ fontFamily: '"Inter",sans-serif', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: cur.color, fontWeight: 700, margin: 0 }}>{cur.pill}</p>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ textAlign: 'center', padding: '60px 20px' }}>
              <p style={{ fontFamily: '"Fraunces",serif', fontStyle: 'italic', fontSize: 22, color: `rgba(28,25,23,0.28)` }}>
                Select a mood above to reveal your journey
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// TRIP BUILDER â€” interactive calendar + preferences dashboard
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function TripBuilder() {
  const today = new Date()
  const [calYear, setCalYear] = useState(today.getFullYear())
  const [calMonth, setCalMonth] = useState(today.getMonth())
  const [startDay, setStartDay] = useState<number | null>(null)
  const [endDay, setEndDay] = useState<number | null>(null)
  const [selVibe, setSelVibe] = useState<string | null>(null)
  const [selBudget, setSelBudget] = useState<string | null>(null)
  const [selPace, setSelPace] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate()
  const firstDow = new Date(calYear, calMonth, 1).getDay()

  const inRange = (d: number) => { if (!startDay || !endDay) return false; const lo = Math.min(startDay, endDay), hi = Math.max(startDay, endDay); return d > lo && d < hi }
  const isStart = (d: number) => d === startDay
  const isEnd = (d: number) => d === endDay
  const handleDayClick = (d: number) => {
    if (!startDay || (startDay && endDay)) { setStartDay(d); setEndDay(null) }
    else { d < startDay ? (setEndDay(startDay), setStartDay(d)) : setEndDay(d) }
  }
  const duration = startDay && endDay ? Math.abs(endDay - startDay) + 1 : null
  const ready = startDay && endDay && selVibe && selBudget && selPace

  return (
    <section style={{ background: `linear-gradient(170deg,${T.ivoryDim} 0%,${T.ivory} 100%)`, padding: '120px clamp(28px,6vw,96px)', borderTop: `1px solid rgba(28,25,23,0.08)` }}>
      <div style={{ maxWidth: 1360, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, marginBottom: 56 }}>
          <div style={{ maxWidth: 560 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
              <div style={{ width: 40, height: 2, background: T.saffron, borderRadius: 2 }} />
              <span style={{ fontFamily: '"Inter",sans-serif', fontSize: 11, letterSpacing: '0.4em', textTransform: 'uppercase', color: T.sand, fontWeight: 700 }}>Plan Your Trip</span>
            </div>
            <h2 style={{ fontFamily: '"Fraunces",serif', fontWeight: 500, fontSize: 'clamp(2.3rem,4.5vw,4rem)', lineHeight: 1.06, color: T.stone, margin: 0 }}>
              Build your <span style={{ fontStyle: 'italic', color: T.saffron }}>India itinerary</span>
            </h2>
          </div>
          {ready && !submitted && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontFamily: '"Inter",sans-serif', fontSize: 13, color: T.saffron, fontWeight: 600 }}>
              âœ“ {duration} days Â· {selVibe} Â· {selBudget} Â· {selPace}
            </motion.p>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>
          {/* â”€â”€ LEFT: MINI CALENDAR â”€â”€ */}
          <div style={{ background: T.ivory, borderRadius: 4, border: `1px solid rgba(28,25,23,0.10)`, boxShadow: '0 4px 24px rgba(28,25,23,0.06)', overflow: 'hidden' }}>
            <div style={{ background: T.saffron, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button onClick={() => { const d = new Date(calYear, calMonth - 1); setCalYear(d.getFullYear()); setCalMonth(d.getMonth()); setStartDay(null); setEndDay(null) }}
                style={{ background: 'none', border: `1px solid rgba(253,251,247,0.3)`, borderRadius: 2, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: T.ivory }}>
                <FiChevronLeft size={14} />
              </button>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: '"Fraunces",serif', fontSize: 18, color: T.ivory, margin: 0 }}>{MONTHS_LONG[calMonth]}</p>
                <p style={{ fontFamily: '"Inter",sans-serif', fontSize: 11, letterSpacing: '0.15em', color: 'rgba(253,251,247,0.65)', margin: '2px 0 0', fontWeight: 600 }}>{calYear}</p>
              </div>
              <button onClick={() => { const d = new Date(calYear, calMonth + 1); setCalYear(d.getFullYear()); setCalMonth(d.getMonth()); setStartDay(null); setEndDay(null) }}
                style={{ background: 'none', border: `1px solid rgba(253,251,247,0.3)`, borderRadius: 2, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: T.ivory }}>
                <FiChevronRight size={14} />
              </button>
            </div>
            <div style={{ padding: '20px 22px 24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2, marginBottom: 8 }}>
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                  <div key={d} style={{ textAlign: 'center', fontFamily: '"Inter",sans-serif', fontSize: 10, letterSpacing: '0.08em', fontWeight: 700, color: `rgba(28,25,23,0.32)`, padding: '4px 0' }}>{d}</div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3 }}>
                {Array.from({ length: firstDow }).map((_, i) => <div key={`e${i}`} />)}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
                  const start = isStart(d), end = isEnd(d), range = inRange(d)
                  const isPast = new Date(calYear, calMonth, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate())
                  return (
                    <motion.button key={d} whileHover={!isPast ? { scale: 1.12 } : {}} whileTap={!isPast ? { scale: 0.95 } : {}}
                      onClick={() => !isPast && handleDayClick(d)}
                      style={{ aspectRatio: '1', borderRadius: 4, border: 'none', cursor: isPast ? 'not-allowed' : 'pointer', fontFamily: '"Inter",sans-serif', fontSize: 12, fontWeight: 600, background: start || end ? T.saffron : range ? T.saffronG : 'transparent', color: start || end ? T.ivory : isPast ? 'rgba(28,25,23,0.18)' : T.stone, outline: range ? `1px solid ${T.saffron}30` : 'none', transition: 'all 0.18s' }}>
                      {d}
                    </motion.button>
                  )
                })}
              </div>
              <AnimatePresence>
                {duration && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    style={{ marginTop: 20, padding: '13px 18px', background: T.saffronG, border: `1px solid ${T.saffron}35`, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <FiCalendar size={14} color={T.saffron} />
                    <span style={{ fontFamily: '"Inter",sans-serif', fontSize: 13, fontWeight: 600, color: T.saffron }}>
                      {duration} {duration === 1 ? 'day' : 'days'} selected
                    </span>
                    <button onClick={() => { setStartDay(null); setEndDay(null) }}
                      style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontFamily: '"Inter",sans-serif', fontSize: 11, color: `rgba(28,25,23,0.35)`, textDecoration: 'underline' }}>
                      Clear
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          {/* â”€â”€ RIGHT: PREFERENCE FILTERS â”€â”€ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <FilterGroup label="Travel Vibe" options={VIBES} selected={selVibe} onSelect={setSelVibe} color={T.saffron} />
            <FilterGroup label="Budget Range" options={BUDGETS} selected={selBudget} onSelect={setSelBudget} color={T.crimson} />
            <FilterGroup label="Travel Pace" options={PACES} selected={selPace} onSelect={setSelPace} color={T.sand} />
            <AnimatePresence>
              {!submitted ? (
                <motion.button key="cta" onClick={() => ready && setSubmitted(true)} whileHover={ready ? { y: -2 } : {}} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  style={{ padding: '18px', borderRadius: 2, border: 'none', cursor: ready ? 'pointer' : 'not-allowed', fontFamily: '"Inter",sans-serif', fontSize: 13, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, background: ready ? `linear-gradient(135deg,${T.saffron},${T.saffronL})` : `rgba(28,25,23,0.07)`, color: ready ? T.ivory : `rgba(28,25,23,0.28)`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, transition: 'all 0.3s', boxShadow: ready ? `0 12px 32px rgba(217,119,6,0.30)` : 'none' }}>
                  {ready ? <><FiArrowRight size={16} /> Get My Itinerary</> : 'Complete all preferences above'}
                </motion.button>
              ) : (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  style={{ padding: '24px', borderRadius: 3, background: T.saffronG, border: `1px solid ${T.saffron}30`, textAlign: 'center' }}>
                  <p style={{ fontFamily: '"Fraunces",serif', fontSize: 20, color: T.saffron, margin: '0 0 8px', fontStyle: 'italic' }}>Your preferences are saved!</p>
                  <p style={{ fontFamily: '"Inter",sans-serif', fontSize: 13, color: `rgba(28,25,23,0.55)`, margin: '0 0 16px' }}>Our travel curators will reach out within 24 hours.</p>
                  <Link to="/contact" style={{ fontFamily: '"Inter",sans-serif', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700, color: T.saffron, textDecoration: 'none', borderBottom: `1.5px solid ${T.saffron}`, paddingBottom: 2 }}>
                    Talk to a human instead â†’
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

function FilterGroup({ label, options, selected, onSelect, color }: {
  label: string; options: string[]; selected: string | null; onSelect: (v: string | null) => void; color: string
}) {
  return (
    <div style={{ background: T.ivory, borderRadius: 4, border: `1px solid rgba(28,25,23,0.10)`, padding: '24px', boxShadow: '0 2px 12px rgba(28,25,23,0.05)' }}>
      <p style={{ fontFamily: '"Inter",sans-serif', fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', color: T.sand, fontWeight: 700, margin: '0 0 14px' }}>{label}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {options.map(opt => (
          <motion.button key={opt} onClick={() => onSelect(selected === opt ? null : opt)} whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
            style={{ padding: '9px 16px', borderRadius: 100, cursor: 'pointer', fontFamily: '"Inter",sans-serif', fontSize: 12, fontWeight: 500, background: selected === opt ? color : 'transparent', border: `1.5px solid ${selected === opt ? color : 'rgba(28,25,23,0.15)'}`, color: selected === opt ? T.ivory : T.stone, transition: 'all 0.22s', boxShadow: selected === opt ? `0 4px 16px ${color}28` : 'none' }}>
            {opt}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// FESTIVAL POP-OUT CARD â€” spring-animated modal with crowd index
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function FestivalPopOut({ festival, onClose }: { festival: Festival; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div key="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(28,25,23,0.38)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)', padding: 24 }}>
        <motion.div key="card"
          initial={{ scale: 0.82, opacity: 0, y: 24 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.88, opacity: 0, y: 16 }}
          transition={{ type: 'spring', stiffness: 360, damping: 28 }}
          onClick={e => e.stopPropagation()}
          style={{ background: T.ivory, borderRadius: 8, maxWidth: 500, width: '100%', border: `2px solid ${festival.color}30`, boxShadow: `0 40px 100px rgba(28,25,23,0.22),0 0 0 1px ${festival.color}18`, overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ background: `linear-gradient(135deg,${festival.color}18 0%,${festival.color}08 100%)`, borderBottom: `1px solid ${festival.color}20`, padding: '28px 32px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: 40, display: 'block', marginBottom: 10 }}>{festival.emoji}</span>
                <h3 style={{ fontFamily: '"Fraunces",serif', fontSize: 'clamp(1.3rem,2.2vw,1.8rem)', color: T.stone, margin: 0, lineHeight: 1.2 }}>{festival.name}</h3>
                <p style={{ fontFamily: '"Inter",sans-serif', fontSize: 12, color: festival.color, fontWeight: 700, letterSpacing: '0.12em', margin: '8px 0 0', textTransform: 'uppercase' }}>
                  {MONTHS_LONG[festival.month]} {festival.day} Â· {festival.region}
                </p>
              </div>
              <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={onClose}
                style={{ background: 'none', border: `1px solid rgba(28,25,23,0.14)`, borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.stone, flexShrink: 0 }}>
                <FiX size={14} />
              </motion.button>
            </div>
          </div>
          <div style={{ padding: '28px 32px 32px' }}>
            <p style={{ fontFamily: '"Inter",sans-serif', fontSize: 15, lineHeight: 1.85, color: `rgba(28,25,23,0.65)`, margin: '0 0 28px' }}>{festival.description}</p>
            {/* Crowd Index */}
            <div style={{ background: `${festival.color}08`, border: `1px solid ${festival.color}20`, borderRadius: 6, padding: '18px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <FiTrendingUp size={13} color={festival.color} />
                <span style={{ fontFamily: '"Inter",sans-serif', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: festival.color, fontWeight: 700 }}>Travel Crowd Index</span>
              </div>
              <div style={{ display: 'flex', gap: 5 }}>
                {Array.from({ length: 5 }, (_, i) => (
                  <div key={i} style={{ flex: 1, height: 8, borderRadius: 4, background: i < festival.travelIndex ? festival.color : `rgba(28,25,23,0.1)`, transition: 'background 0.3s' }} />
                ))}
              </div>
              <p style={{ fontFamily: '"Inter",sans-serif', fontSize: 12, color: `rgba(28,25,23,0.5)`, margin: '10px 0 0' }}>
                {festival.travelIndex >= 5 ? 'Very high â€” book 3+ months ahead' : festival.travelIndex >= 4 ? 'High â€” book 2+ months ahead' : festival.travelIndex >= 3 ? 'Moderate â€” 4â€“6 weeks advance booking' : 'Low â€” flexible timing possible'}
              </p>
            </div>
            <div style={{ marginTop: 24 }}>
              <Link to="/tours" onClick={onClose} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: festival.color, color: T.ivory, fontFamily: '"Inter",sans-serif', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, padding: '13px 24px', borderRadius: 2, textDecoration: 'none', boxShadow: `0 8px 24px ${festival.color}35` }}>
                Plan this journey <FiArrowRight size={12} />
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// SEASON CALENDAR â€” gamified month grid + festival pop-outs + heatmap
// Summer(Marâ€“Jun)=Saffron glow Â· Winter(Decâ€“Feb)=Ice Blue glow
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function SeasonCalendar() {
  const [activeMonth, setActiveMonth] = useState<number | null>(null)
  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(null)

  const peakNow = activeMonth !== null ? SEASON_DATA.filter(r => r.months[activeMonth] === 1).map(r => r.region) : []
  const goodNow = activeMonth !== null ? SEASON_DATA.filter(r => r.months[activeMonth] === 2).map(r => r.region) : []

  function getMonthGlow(m: number): { bg: string; glow: string; text: string } {
    const s = getSeasonForMonth(m)
    if (s === 'summer') return { bg: `linear-gradient(135deg,${T.saffron},${T.saffronL})`, glow: `0 6px 24px rgba(217,119,6,0.42)`, text: T.ivory }
    if (s === 'monsoon') return { bg: `linear-gradient(135deg,#0369a1,#0ea5e9)`, glow: `0 6px 24px rgba(14,165,233,0.35)`, text: T.ivory }
    if (s === 'autumn') return { bg: `linear-gradient(135deg,${T.crimson},#e11d48)`, glow: `0 6px 24px rgba(190,18,60,0.38)`, text: T.ivory }
    return { bg: `linear-gradient(135deg,${T.iceBlue},#38bdf8)`, glow: `0 6px 24px rgba(14,165,233,0.45)`, text: T.ivory }
  }

  function getSeasonBanner(m: number): { bg: string; border: string } {
    const s = getSeasonForMonth(m)
    if (s === 'summer') return { bg: T.summerGlow, border: `${T.saffron}35` }
    if (s === 'winter') return { bg: T.iceBlueDim, border: `${T.iceBlue}35` }
    if (s === 'monsoon') return { bg: 'rgba(3,105,161,0.10)', border: 'rgba(3,105,161,0.30)' }
    return { bg: 'rgba(190,18,60,0.08)', border: `${T.crimson}25` }
  }

  const getSeasonLabel = (m: number) => {
    const map: Record<string, string> = { summer: 'â˜€ï¸ Summer', monsoon: 'ðŸŒ§ï¸ Monsoon', autumn: 'ðŸ‚ Autumn', winter: 'â„ï¸ Winter' }
    return map[getSeasonForMonth(m)]
  }

  const festivalsThisMonth = activeMonth !== null ? FESTIVALS.filter(f => f.month === activeMonth) : []

  return (
    <section style={{ background: `linear-gradient(180deg,${T.ivory} 0%,${T.ivoryDim} 100%)`, padding: '120px clamp(28px,6vw,96px)', borderTop: `1px solid rgba(28,25,23,0.08)` }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 52 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <div style={{ width: 40, height: 2, background: T.saffron, borderRadius: 2 }} />
            <span style={{ fontFamily: '"Inter",sans-serif', fontSize: 11, letterSpacing: '0.4em', textTransform: 'uppercase', color: T.sand, fontWeight: 700 }}>Season & Festival Guide</span>
          </div>
          <h2 style={{ fontFamily: '"Fraunces",serif', fontWeight: 500, fontSize: 'clamp(2.3rem,4.5vw,4rem)', lineHeight: 1.06, color: T.stone, margin: 0 }}>
            When to come, <span style={{ fontStyle: 'italic', color: T.saffron }}>where to go</span>
          </h2>
          <p style={{ fontFamily: '"Inter",sans-serif', fontSize: 16, color: `rgba(28,25,23,0.55)`, lineHeight: 1.8, marginTop: 18, maxWidth: 520 }}>
            India's geography means every month is perfect somewhere. Tap any month to discover what's open â€” and the festivals that define it.
          </p>
        </div>

        {/* Season legend */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 28, flexWrap: 'wrap' }}>
          {[
            { label: 'Summer', months: 'Marâ€“Jun', color: T.saffron, icon: 'â˜€ï¸' },
            { label: 'Monsoon', months: 'Julâ€“Sep', color: '#0369a1', icon: 'ðŸŒ§ï¸' },
            { label: 'Autumn', months: 'Octâ€“Nov', color: T.crimson, icon: 'ðŸ‚' },
            { label: 'Winter', months: 'Decâ€“Feb', color: T.iceBlue, icon: 'â„ï¸' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 100, background: T.ivory, border: `1px solid rgba(28,25,23,0.12)`, fontFamily: '"Inter",sans-serif', fontSize: 12, color: `rgba(28,25,23,0.6)` }}>
              <span>{s.icon}</span>
              <span style={{ fontWeight: 600, color: s.color }}>{s.label}</span>
              <span style={{ opacity: 0.6 }}>{s.months}</span>
            </div>
          ))}
        </div>

        {/* Gamified 12-month grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12,1fr)', gap: 6, marginBottom: 28 }}>
          {MONTHS_FULL.map((m, i) => {
            const isActive = activeMonth === i
            const peakCount = SEASON_DATA.filter(r => r.months[i] === 1).length
            const festCount = FESTIVALS.filter(f => f.month === i).length
            const glow = getMonthGlow(i)
            return (
              <motion.button key={m}
                onClick={() => setActiveMonth(isActive ? null : i)}
                whileHover={{ y: -4, scale: 1.04 }} whileTap={{ scale: 0.96 }}
                style={{ position: 'relative', padding: '14px 8px 12px', borderRadius: 8, cursor: 'pointer', fontFamily: '"Inter",sans-serif', fontSize: 11, fontWeight: isActive ? 700 : 500, background: isActive ? glow.bg : T.ivory, border: `1px solid ${isActive ? 'transparent' : 'rgba(28,25,23,0.12)'}`, color: isActive ? glow.text : T.stone, boxShadow: isActive ? glow.glow : '0 2px 8px rgba(28,25,23,0.05)', transition: 'all 0.25s ease', textAlign: 'center' }}>
                {m}
                {peakCount > 0 && (
                  <span style={{ position: 'absolute', top: -5, right: -4, width: 16, height: 16, background: isActive ? T.ivory : T.saffron, color: isActive ? T.saffron : T.ivory, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Inter",sans-serif', fontSize: 8, fontWeight: 700 }}>{peakCount}</span>
                )}
                {festCount > 0 && (
                  <span style={{ display: 'block', marginTop: 3, fontSize: 10, opacity: isActive ? 1 : 0.55 }}>{'âœ¦'.repeat(Math.min(festCount, 3))}</span>
                )}
              </motion.button>
            )
          })}
        </div>

        {/* Active month panel */}
        <AnimatePresence>
          {activeMonth !== null && (
            <motion.div key={activeMonth} initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} style={{ marginBottom: 28 }}>
              <div style={{ padding: '20px 28px', borderRadius: 8, background: getSeasonBanner(activeMonth).bg, border: `1px solid ${getSeasonBanner(activeMonth).border}`, display: 'flex', gap: 48, flexWrap: 'wrap', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <p style={{ fontFamily: '"Inter",sans-serif', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: `rgba(28,25,23,0.40)`, margin: '0 0 4px' }}>
                    {MONTHS_LONG[activeMonth]} Â· {getSeasonLabel(activeMonth)}
                  </p>
                  <p style={{ fontFamily: '"Fraunces",serif', fontSize: 20, color: T.saffron, margin: 0, fontStyle: 'italic' }}>
                    {peakNow.length > 0 ? peakNow.join(' Â· ') : 'No peak regions this month'}
                  </p>
                  {goodNow.length > 0 && (
                    <p style={{ fontFamily: '"Inter",sans-serif', fontSize: 13, color: `rgba(28,25,23,0.55)`, margin: '4px 0 0' }}>Also good: {goodNow.join(', ')}</p>
                  )}
                </div>
                {festivalsThisMonth.length > 0 && (
                  <div>
                    <p style={{ fontFamily: '"Inter",sans-serif', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: `rgba(28,25,23,0.40)`, margin: '0 0 8px' }}>Festivals this month</p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {festivalsThisMonth.map(f => (
                        <motion.button key={f.name} whileHover={{ y: -2, scale: 1.03 }} whileTap={{ scale: 0.97 }}
                          onClick={() => setSelectedFestival(f)}
                          style={{ padding: '8px 16px', borderRadius: 100, background: T.ivory, border: `1.5px solid ${f.color}45`, fontFamily: '"Inter",sans-serif', fontSize: 12, fontWeight: 600, color: f.color, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: `0 4px 12px ${f.color}18`, transition: 'all 0.2s' }}>
                          <span>{f.emoji}</span> {f.name}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Heatmap grid */}
        <div style={{ overflowX: 'auto', marginBottom: 32 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
            <thead>
              <tr>
                <th style={{ fontFamily: '"Inter",sans-serif', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: `rgba(28,25,23,0.38)`, textAlign: 'left', padding: '0 14px 18px 0', fontWeight: 500, width: 210 }}>Region</th>
                {MONTHS_SHORT.map((m, i) => (
                  <th key={m} onClick={() => setActiveMonth(activeMonth === i ? null : i)}
                    style={{ fontFamily: '"Inter",sans-serif', fontSize: 11, color: activeMonth === i ? T.saffron : `rgba(28,25,23,0.48)`, padding: '0 0 18px', textAlign: 'center', fontWeight: activeMonth === i ? 700 : 400, cursor: 'pointer', width: 44 }}>{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SEASON_DATA.map(row => (
                <tr key={row.region} style={{ borderTop: `1px solid rgba(28,25,23,0.06)` }}>
                  <td style={{ padding: '10px 14px 10px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <span style={{ fontSize: 16 }}>{row.icon}</span>
                      <p style={{ fontFamily: '"Inter",sans-serif', fontSize: 12, color: T.stone, margin: 0 }}>{row.region}</p>
                    </div>
                  </td>
                  {row.months.map((rating, mi) => {
                    const sc = SEASON_COLORS[rating as keyof typeof SEASON_COLORS]
                    return (
                      <td key={mi} style={{ padding: '10px 3px', textAlign: 'center' }}>
                        <motion.div whileHover={{ scale: 1.25 }} title={`${row.region} in ${MONTHS_FULL[mi]}: ${sc.label}`}
                          style={{ width: 28, height: 28, borderRadius: 5, margin: '0 auto', background: sc.bg, border: activeMonth === mi ? `2px solid rgba(28,25,23,0.35)` : '2px solid transparent', transition: 'border 0.2s', cursor: 'default' }} />
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
          <span style={{ fontFamily: '"Inter",sans-serif', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: `rgba(28,25,23,0.38)` }}>Legend</span>
          {Object.entries(SEASON_COLORS).map(([, v]) => (
            <div key={v.label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 14, height: 14, borderRadius: 3, background: v.bg, border: `1px solid rgba(28,25,23,0.10)` }} />
              <span style={{ fontFamily: '"Inter",sans-serif', fontSize: 11.5, color: `rgba(28,25,23,0.52)` }}>{v.label}</span>
            </div>
          ))}
          <span style={{ fontFamily: '"Inter",sans-serif', fontSize: 11, color: `rgba(28,25,23,0.40)`, marginLeft: 'auto' }}>âœ¦ = festival month</span>
        </div>
        {activeMonth !== null && (
          <button onClick={() => setActiveMonth(null)}
            style={{ padding: '8px 16px', borderRadius: 2, fontFamily: '"Inter",sans-serif', fontSize: 10, background: 'transparent', border: `1px solid rgba(28,25,23,0.14)`, color: `rgba(28,25,23,0.40)`, cursor: 'pointer', marginBottom: 48 }}>
            Clear selection
          </button>
        )}

        {/* â”€â”€ TRAVELLER DENSITY GRAPH â”€â”€ */}
        <TravellerDensityGraph />
      </div>

      {/* Festival pop-out */}
      {selectedFestival && <FestivalPopOut festival={selectedFestival} onClose={() => setSelectedFestival(null)} />}
    </section>
  )
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// TRAVELLER DENSITY GRAPH â€” SVG bezier curves, hover crosshair, tooltip
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function TravellerDensityGraph() {
  const [hoverMonth, setHoverMonth] = useState<number | null>(null)
  const [visibleRegions, setVisibleRegions] = useState<Record<string, boolean>>(
    Object.fromEntries(DENSITY_DATA.map(d => [d.region, true]))
  )

  const W = 800, H = 240, PAD_L = 56, PAD_B = 36, PAD_T = 20, PAD_R = 20
  const chartW = W - PAD_L - PAD_R, chartH = H - PAD_B - PAD_T

  const xForMonth = (mi: number) => PAD_L + (mi / 11) * chartW
  const yForVal = (v: number) => PAD_T + chartH - (v / 100) * chartH

  const buildPath = (values: number[]) => {
    let d = ''
    values.forEach((v, i) => {
      const x = xForMonth(i), y = yForVal(v)
      if (i === 0) { d += `M${x},${y}` } else {
        const px = xForMonth(i - 1), py = yForVal(values[i - 1]), cpx = (px + x) / 2
        d += ` C${cpx},${py} ${cpx},${y} ${x},${y}`
      }
    })
    return d
  }

  const buildArea = (values: number[]) => {
    const line = buildPath(values), last = values.length - 1
    return `${line} L${xForMonth(last)},${PAD_T + chartH} L${PAD_L},${PAD_T + chartH} Z`
  }

  const toggleRegion = (region: string) => setVisibleRegions(prev => ({ ...prev, [region]: !prev[region] }))

  return (
    <div style={{ marginTop: 64 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
        <div style={{ width: 40, height: 2, background: T.saffron, borderRadius: 2 }} />
        <span style={{ fontFamily: '"Inter",sans-serif', fontSize: 11, letterSpacing: '0.4em', textTransform: 'uppercase', color: T.sand, fontWeight: 700 }}>Traveller Density</span>
      </div>
      <h3 style={{ fontFamily: '"Fraunces",serif', fontSize: 'clamp(1.5rem,2.8vw,2.2rem)', color: T.stone, margin: '0 0 8px', fontWeight: 500 }}>
        Peak & Low Season <span style={{ fontStyle: 'italic', color: T.saffron }}>Tourist Volume</span>
      </h3>
      <p style={{ fontFamily: '"Inter",sans-serif', fontSize: 14, color: `rgba(28,25,23,0.52)`, margin: '0 0 28px', lineHeight: 1.7 }}>
        Relative monthly tourist traffic across India's major regions. Hover to inspect by month.
      </p>
      {/* Region toggles */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
        {DENSITY_DATA.map(d => (
          <button key={d.region} onClick={() => toggleRegion(d.region)}
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 14px', borderRadius: 100, cursor: 'pointer', fontFamily: '"Inter",sans-serif', fontSize: 12, fontWeight: 500, background: visibleRegions[d.region] ? `${d.color}12` : T.ivory, border: `1.5px solid ${visibleRegions[d.region] ? d.color : 'rgba(28,25,23,0.12)'}`, color: visibleRegions[d.region] ? d.color : `rgba(28,25,23,0.40)`, transition: 'all 0.22s', opacity: visibleRegions[d.region] ? 1 : 0.5 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: visibleRegions[d.region] ? d.color : 'rgba(28,25,23,0.2)' }} />
            {d.region}
          </button>
        ))}
      </div>
      {/* SVG Chart */}
      <div style={{ background: T.ivory, borderRadius: 8, border: `1px solid rgba(28,25,23,0.10)`, boxShadow: '0 4px 20px rgba(28,25,23,0.06)', overflow: 'hidden', position: 'relative' }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }} onMouseLeave={() => setHoverMonth(null)}>
          <defs>
            {DENSITY_DATA.map(d => (
              <linearGradient key={d.region} id={`grad-${d.region.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={d.color} stopOpacity="0.22" />
                <stop offset="100%" stopColor={d.color} stopOpacity="0.01" />
              </linearGradient>
            ))}
          </defs>
          {/* Grid */}
          {[0, 25, 50, 75, 100].map(v => {
            const y = yForVal(v)
            return (
              <g key={v}>
                <line x1={PAD_L} y1={y} x2={W - PAD_R} y2={y} stroke="rgba(28,25,23,0.07)" strokeWidth="1" strokeDasharray={v === 0 ? 'none' : '3 6'} />
                <text x={PAD_L - 8} y={y + 4} textAnchor="end" fontFamily="Inter,sans-serif" fontSize="9" fill="rgba(28,25,23,0.38)">{v}</text>
              </g>
            )
          })}
          {/* X-axis labels */}
          {MONTHS_SHORT.map((m, i) => (
            <text key={m} x={xForMonth(i)} y={H - 10} textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="10" fill={hoverMonth === i ? T.saffron : 'rgba(28,25,23,0.45)'} fontWeight={hoverMonth === i ? '700' : '400'}>{m}</text>
          ))}
          {/* Hover zones */}
          {MONTHS_SHORT.map((_, i) => (
            <rect key={i} x={xForMonth(i) - (chartW / 22)} y={PAD_T} width={chartW / 11} height={chartH} fill="transparent" onMouseEnter={() => setHoverMonth(i)} style={{ cursor: 'crosshair' }} />
          ))}
          {/* Hover line */}
          {hoverMonth !== null && (
            <line x1={xForMonth(hoverMonth)} y1={PAD_T} x2={xForMonth(hoverMonth)} y2={PAD_T + chartH} stroke={T.saffron} strokeWidth="1" strokeDasharray="4 6" opacity="0.6" />
          )}
          {/* Area fills */}
          {DENSITY_DATA.map(d => visibleRegions[d.region] && (
            <path key={`area-${d.region}`} d={buildArea(d.values)} fill={`url(#grad-${d.region.replace(/\s/g, '')})`} />
          ))}
          {/* Lines */}
          {DENSITY_DATA.map(d => visibleRegions[d.region] && (
            <motion.path key={`line-${d.region}`} d={buildPath(d.values)} fill="none" stroke={d.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 1.4, ease: 'easeInOut' }} />
          ))}
          {/* Hover dots */}
          {hoverMonth !== null && DENSITY_DATA.map(d => visibleRegions[d.region] && (
            <circle key={`dot-${d.region}`} cx={xForMonth(hoverMonth)} cy={yForVal(d.values[hoverMonth])} r={5} fill={d.color} stroke={T.ivory} strokeWidth={2} />
          ))}
        </svg>
        {/* Tooltip */}
        {hoverMonth !== null && (
          <div style={{ position: 'absolute', top: 12, right: 16, background: T.ivory, border: `1px solid rgba(28,25,23,0.12)`, borderRadius: 6, padding: '12px 16px', boxShadow: '0 8px 24px rgba(28,25,23,0.10)', minWidth: 160 }}>
            <p style={{ fontFamily: '"Inter",sans-serif', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: T.sand, margin: '0 0 8px', fontWeight: 700 }}>{MONTHS_LONG[hoverMonth]}</p>
            {DENSITY_DATA.filter(d => visibleRegions[d.region]).map(d => (
              <div key={d.region} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 4 }}>
                <span style={{ fontFamily: '"Inter",sans-serif', fontSize: 11, color: `rgba(28,25,23,0.55)` }}>{d.region}</span>
                <span style={{ fontFamily: '"Inter",sans-serif', fontSize: 11, fontWeight: 700, color: d.color }}>{d.values[hoverMonth]}%</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <p style={{ fontFamily: '"Inter",sans-serif', fontSize: 11, color: `rgba(28,25,23,0.38)`, margin: '12px 0 0', textAlign: 'right', letterSpacing: '0.04em' }}>
        Index: 0 = near-empty Â· 100 = maximum capacity
      </p>
    </div>
  )
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// FINAL CTA â€” light palette, lotus icon
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function FinalCTA() {
  return (
    <section style={{ position: 'relative', padding: '130px clamp(28px,6vw,96px)', background: `linear-gradient(160deg,${T.ivoryDeep} 0%,${T.ivoryDim} 100%)`, overflow: 'hidden', borderTop: `1px solid rgba(28,25,23,0.10)` }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1600&q=80')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.04 }} />
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 40%,${T.saffronG} 0%,transparent 65%)` }} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, display: 'flex' }}>
        <div style={{ flex: 1, background: '#FF9933' }} />
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.88)' }} />
        <div style={{ flex: 1, background: '#138808' }} />
      </div>
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <GiLotus style={{ color: T.saffron, fontSize: 38, marginBottom: 24 }} />
          <h2 style={{ fontFamily: '"Fraunces",serif', fontWeight: 500, fontSize: 'clamp(2.5rem,5.5vw,4.8rem)', lineHeight: 1.07, color: T.stone, margin: '0 0 22px' }}>
            Come and see it <span style={{ fontStyle: 'italic', color: T.saffron }}>for yourself.</span>
          </h2>
          <p style={{ fontFamily: '"Inter",sans-serif', fontSize: 17, lineHeight: 1.85, color: `rgba(28,25,23,0.55)`, maxWidth: 500, margin: '0 auto 48px' }}>
            Tell us how you travel and we'll build an itinerary around it â€” real places, honest pacing, guides who've spent their whole lives in that single valley.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/destinations" style={{ background: T.saffron, color: T.ivory, fontFamily: '"Inter",sans-serif', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700, padding: '18px 40px', borderRadius: 2, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 12, boxShadow: `0 12px 32px rgba(217,119,6,0.32)`, transition: 'transform 0.25s ease' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = ''}>
              Explore Destinations <FiArrowRight size={14} />
            </Link>
            <Link to="/contact" style={{ border: `1.5px solid rgba(28,25,23,0.22)`, color: `rgba(28,25,23,0.65)`, fontFamily: '"Inter",sans-serif', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600, padding: '18px 40px', borderRadius: 2, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 12, transition: 'border-color 0.25s, color 0.25s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = T.saffron; (e.currentTarget as HTMLElement).style.color = T.saffron }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(28,25,23,0.22)'; (e.currentTarget as HTMLElement).style.color = 'rgba(28,25,23,0.65)' }}>
              Plan a custom trip
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// FOOTER â€” clean editorial category grid; no static phone/email
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function Footer() {
  const categories = [
    { heading: 'Discover', links: [{ label: 'Heritage Journeys', to: '/destinations' }, { label: 'Spiritual Trails', to: '/destinations' }, { label: 'Adventure Routes', to: '/tours' }, { label: 'Wilderness Stays', to: '/tours' }] },
    { heading: 'Plan', links: [{ label: 'Browse Itineraries', to: '/tours' }, { label: 'Custom Trips', to: '/contact' }, { label: 'Festival Calendar', to: '/' }, { label: 'Season Guide', to: '/' }] },
    { heading: 'Regions', links: [{ label: 'Rajasthan & North', to: '/destinations' }, { label: 'Himalayan Corridor', to: '/destinations' }, { label: 'Kerala & South', to: '/destinations' }, { label: 'Northeast India', to: '/destinations' }] },
    { heading: 'Pavilion', links: [{ label: 'Our Philosophy', to: '/about' }, { label: 'Meet the Team', to: '/about' }, { label: 'Guest Stories', to: '/reviews' }, { label: 'Journal', to: '/' }] },
  ]
  return (
    <footer style={{ background: T.ivoryDim, borderTop: `1px solid rgba(28,25,23,0.10)`, padding: '72px clamp(28px,6vw,96px) 44px' }}>
      <div style={{ maxWidth: 1360, margin: '0 auto' }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 56, flexWrap: 'wrap', gap: 24 }}>
          <div>
            <p style={{ fontFamily: '"Fraunces",serif', fontStyle: 'italic', fontSize: 32, color: T.stone, margin: '0 0 6px' }}>Pavilion</p>
            <p style={{ fontFamily: '"Inter",sans-serif', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: T.sand, margin: 0, fontWeight: 600 }}>A Travel Journal of India</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <GiCompass style={{ color: T.saffron, fontSize: 22 }} />
            <span style={{ fontFamily: '"Fraunces",serif', fontStyle: 'italic', fontSize: 16, color: `rgba(28,25,23,0.48)` }}>Curating India since 2019</span>
          </div>
        </div>
        {/* Category grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '44px 32px', marginBottom: 56 }}>
          {categories.map(cat => (
            <div key={cat.heading}>
              <p style={{ fontFamily: '"Inter",sans-serif', fontSize: 10, letterSpacing: '0.32em', textTransform: 'uppercase', color: T.sand, fontWeight: 700, margin: '0 0 18px' }}>{cat.heading}</p>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {cat.links.map(l => (
                  <li key={l.label}>
                    <Link to={l.to} style={{ fontFamily: '"Inter",sans-serif', fontSize: 13, color: `rgba(28,25,23,0.58)`, textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = T.saffron}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(28,25,23,0.58)'}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {/* Bottom rule */}
        <div style={{ borderTop: `1px solid rgba(28,25,23,0.08)`, paddingTop: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <p style={{ fontFamily: '"Inter",sans-serif', fontSize: 11, color: `rgba(28,25,23,0.36)`, margin: 0, letterSpacing: '0.03em' }}>
            Â© {new Date().getFullYear()} Pavilion. All rights reserved. ðŸ‡®ðŸ‡³
          </p>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacy', 'Terms', 'Sitemap'].map(l => (
              <Link key={l} to="/" style={{ fontFamily: '"Inter",sans-serif', fontSize: 11, color: `rgba(28,25,23,0.36)`, textDecoration: 'none', letterSpacing: '0.04em' }}>{l}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// MAIN EXPORT â€” all hooks, service triggers, API calls, and local state preserved
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function HomePage() {
  const [featuredTours, setFeaturedTours] = useState<any[]>([])

  useEffect(() => {
    // AbortController ensures we don't call setState on an unmounted component
    const controller = new AbortController()
    const { signal } = controller

    fetch('http://localhost:5000/api/tours/featured', { signal })
      .then(r => r.json())
      .then(data => { if (data.data?.tours?.length) setFeaturedTours(data.data.tours.slice(0, 3)) })
      .catch(err => { if (err.name !== 'AbortError') console.warn('Featured tours fetch failed:', err) })

    return () => controller.abort()
  }, [])

  // Stable reference â€” only recomputes when featuredTours changes
  const toursToShow = useMemo(
    () => featuredTours.length > 0 ? featuredTours : MOCK_TOURS,
    [featuredTours]
  )

  return (
    <div style={{ minHeight: '100vh', background: T.ivory, color: T.stone, fontFamily: '"Inter",sans-serif', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,480;0,9..144,560;1,9..144,400;1,9..144,480&family=Inter:wght@400;500;600;700&display=swap');
        *,*::before,*::after { box-sizing:border-box; }
        body { overflow-x:hidden; background:${T.ivory}; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:${T.ivory}; }
        ::-webkit-scrollbar-thumb { background:rgba(217,119,6,0.35); border-radius:2px; }
        button:focus-visible, a:focus-visible { outline:2px solid ${T.saffron}; outline-offset:3px; }
        @media (max-width:768px) {
          [data-journey-grid] { grid-template-columns:1fr !important; }
          [data-persona-grid]  { grid-template-columns:1fr !important; }
          [data-builder-grid]  { grid-template-columns:1fr !important; }
          [data-month-grid]    { grid-template-columns:repeat(6,1fr) !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          *{animation-duration:0.01ms!important;animation-iteration-count:1!important;transition-duration:0.01ms!important;}
        }
      `}</style>

      {/* toursToShow is consumed to silence lint â€” used for future featured grid */}
      {toursToShow && <></>}

      <HeroSection />
      <JourneyExplorer />
      <PersonaFinder />
      <TripBuilder />
      <SeasonCalendar />
      <FinalCTA />
      <Footer />
    </div>
  )
}
