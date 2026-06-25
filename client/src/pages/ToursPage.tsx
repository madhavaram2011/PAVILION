import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { FiArrowRight, FiClock, FiUsers, FiStar, FiMapPin, FiWind, FiCompass, FiX, FiSearch } from 'react-icons/fi'
import { GiCompass, GiSunrise } from 'react-icons/gi'

// ─── TOUR DATA ────────────────────────────────────────────────────────────────
// Premium fallback tours — rendered immediately if API is empty/unreachable
const FALLBACK_TOURS = [
  {
    id: 'fb-1', slug: 'golden-triangle-tour',
    title: 'Golden Triangle Tour',
    subtitle: 'India\'s Iconic Trio',
    location: 'Delhi · Agra · Jaipur',
    state: 'Multi-State', region: 'North', type: 'Cultural',
    duration: 7, groupSize: 12, rating: 4.9, reviews: 428,
    price: 58000, difficulty: 'EASY',
    altitude: '216m', season: 'Oct – Mar', wind: 'Moderate',
    cover: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1600&q=90',
    thumb: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&q=80',
    excerpt: 'Marvel at the Taj Mahal at sunrise, explore Mughal forts in Delhi, and lose yourself in the rose-pink bazaars of Jaipur. India\'s most iconic triangle awaits.',
    highlights: ['Taj Mahal sunrise', 'Red Fort Delhi', 'Amber Fort Jaipur'],
    accent: '#b8892a', accentDim: 'rgba(184,137,42,0.1)',
    boardingCode: 'GT-01', departure: '06:00', status: 'ON TIME',
    featured: true,
  },
  {
    id: 'fb-2', slug: 'kerala-backwater-luxury-cruise',
    title: 'Kerala Backwater Luxury Cruise',
    subtitle: "God's Own Country",
    location: 'Alleppey · Kumarakom · Varkala',
    state: 'Kerala', region: 'South', type: 'Beach',
    duration: 8, groupSize: 10, rating: 4.9, reviews: 312,
    price: 72000, difficulty: 'EASY',
    altitude: '0m', season: 'Nov – Feb', wind: 'Light',
    cover: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1600&q=90',
    thumb: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&q=80',
    excerpt: 'Glide through shimmering emerald canals aboard a premium kettuvallam houseboat. Sunrise yoga on deck, candlelit dinners, and the timeless rhythm of village Kerala.',
    highlights: ['Luxury houseboat', 'Varkala cliff beach', 'Kathakali performance'],
    accent: '#0d7a55', accentDim: 'rgba(13,122,85,0.08)',
    boardingCode: 'KL-02', departure: '07:30', status: 'ON TIME',
    featured: true,
  },
  {
    id: 'fb-3', slug: 'royal-rajasthan-expedition',
    title: 'Royal Rajasthan Expedition',
    subtitle: 'Land of the Kings',
    location: 'Jaipur · Jodhpur · Jaisalmer · Udaipur',
    state: 'Rajasthan', region: 'North', type: 'Cultural',
    duration: 10, groupSize: 10, rating: 4.8, reviews: 289,
    price: 85000, difficulty: 'MODERATE',
    altitude: '231m', season: 'Oct – Mar', wind: 'Dry',
    cover: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1600&q=90',
    thumb: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&q=80',
    excerpt: 'A regal odyssey through India\'s royal heartland — golden deserts, lake palaces, blue cities, and a private dinner inside a 400-year-old haveli under a chandelier sky.',
    highlights: ['Desert camel safari', 'Lake Palace Udaipur', 'Mehrangarh Fort'],
    accent: '#c07a10', accentDim: 'rgba(192,122,16,0.1)',
    boardingCode: 'RJ-03', departure: '07:00', status: 'FILLING',
    featured: true,
  },
]

// Fetched from API - keeping this for reference only
const TOURS_PLACEHOLDER = [
  {
    id: 1, slug: 'kerala-backwaters-houseboat',
    title: 'Kerala Backwaters',
    subtitle: "God's Own Country",
    location: 'Alleppey & Kumarakom',
    state: 'Kerala', region: 'South', type: 'Beach',
    duration: 7, groupSize: 12, rating: 4.9, reviews: 312,
    price: 42000, difficulty: 'EASY',
    altitude: '0m', season: 'Nov – Feb', wind: 'Light',
    cover: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1600&q=90',
    thumb: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&q=80',
    excerpt: 'Drift through emerald palm-fringed canals on a traditional kettuvallam houseboat. Dawn mists, village life, and cardamom-scented air.',
    highlights: ['Houseboat overnight', 'Spice garden walk', 'Village cooking class'],
    accent: '#0d7a55', accentDim: 'rgba(13,122,85,0.08)',
    boardingCode: 'KL-01', departure: '06:00', status: 'ON TIME',
    featured: true,
  },
  {
    id: 2, slug: 'rajasthan-royal-heritage',
    title: 'Rajasthan Heritage Trail',
    subtitle: 'Land of the Kings',
    location: 'Jaipur · Jodhpur · Jaisalmer · Udaipur',
    state: 'Rajasthan', region: 'North', type: 'Cultural',
    duration: 10, groupSize: 10, rating: 4.8, reviews: 287,
    price: 68000, difficulty: 'MODERATE',
    altitude: '231m', season: 'Oct – Mar', wind: 'Dry',
    cover: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1600&q=90',
    thumb: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&q=80',
    excerpt: "From the Pink City's bazaars to Jaisalmer's golden fort rising from desert sands — a regal journey through India's royal heartland.",
    highlights: ['Palace dinner', 'Desert camel safari', 'Blue City walk'],
    accent: '#c07a10', accentDim: 'rgba(192,122,16,0.1)',
    boardingCode: 'RJ-02', departure: '07:30', status: 'ON TIME',
    featured: true,
  },
  {
    id: 3, slug: 'goa-beach-and-culture',
    title: 'Goa Beach Escape',
    subtitle: 'Pearl of the Orient',
    location: 'North & South Goa',
    state: 'Goa', region: 'West', type: 'Beach',
    duration: 5, groupSize: 14, rating: 4.7, reviews: 198,
    price: 28000, difficulty: 'EASY',
    altitude: '7m', season: 'Nov – Mar', wind: 'Sea Breeze',
    cover: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1600&q=90',
    thumb: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&q=80',
    excerpt: "White sands, Portuguese-era churches, spice-laden fish curries, and sunsets over the Arabian Sea.",
    highlights: ['Sunset cruise', 'Old Goa churches', 'Spice plantation'],
    accent: '#0e7a8a', accentDim: 'rgba(14,122,138,0.08)',
    boardingCode: 'GA-03', departure: '09:00', status: 'ON TIME',
    featured: false,
  },
  {
    id: 4, slug: 'himalayan-spiti-circuit',
    title: 'Himalayan High Trek',
    subtitle: 'Roof of the World',
    location: 'Manali · Spiti Valley',
    state: 'Himachal Pradesh', region: 'North', type: 'Adventure',
    duration: 12, groupSize: 8, rating: 4.9, reviews: 154,
    price: 75000, difficulty: 'HARD',
    altitude: '4500m', season: 'May – Sep', wind: 'Variable',
    cover: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1600&q=90',
    thumb: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&q=80',
    excerpt: 'Cross ancient passes at 4,500m, sleep under skies ablaze with stars, walk ancient Spiti Valley trade routes.',
    highlights: ['Key Monastery', 'Chandratal Lake', 'Rohtang Pass'],
    accent: '#1a5fa8', accentDim: 'rgba(26,95,168,0.08)',
    boardingCode: 'HP-04', departure: '05:00', status: 'LIMITED',
    featured: true,
  },
  {
    id: 5, slug: 'varanasi-spiritual-immersion',
    title: 'Varanasi Spiritual Journey',
    subtitle: 'City of Light',
    location: 'Varanasi & Sarnath',
    state: 'Uttar Pradesh', region: 'North', type: 'Spiritual',
    duration: 4, groupSize: 10, rating: 4.9, reviews: 231,
    price: 22000, difficulty: 'EASY',
    altitude: '80m', season: 'Oct – Mar', wind: 'Calm',
    cover: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1600&q=90',
    thumb: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=400&q=80',
    excerpt: "Watch the Ganga Aarti illuminate sacred ghats at dusk. Follow pilgrims through ancient alleys. Witness India's most profound living ritual.",
    highlights: ['Dawn boat ride', 'Ganga Aarti ceremony', 'Sarnath ruins'],
    accent: '#6d41b8', accentDim: 'rgba(109,65,184,0.08)',
    boardingCode: 'UP-05', departure: '04:30', status: 'ON TIME',
    featured: false,
  },
  {
    id: 6, slug: 'northeast-living-roots',
    title: 'Northeast Explorer',
    subtitle: 'The Last Wilderness',
    location: 'Meghalaya · Assam · Nagaland',
    state: 'Northeast India', region: 'Northeast', type: 'Adventure',
    duration: 14, groupSize: 8, rating: 4.8, reviews: 97,
    price: 89000, difficulty: 'HARD',
    altitude: '1525m', season: 'Oct – Apr', wind: 'Moist',
    cover: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1600&q=90',
    thumb: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=400&q=80',
    excerpt: 'Cross living root bridges, track rhinos in Kaziranga, share firelight with Naga tribal communities.',
    highlights: ['Living root bridges', 'Kaziranga safari', 'Dzukou Valley trek'],
    accent: '#1a7a52', accentDim: 'rgba(26,122,82,0.08)',
    boardingCode: 'NE-06', departure: '06:30', status: 'ON TIME',
    featured: true,
  },
  {
    id: 7, slug: 'ladakh-moonland-odyssey',
    title: 'Ladakh Moonland Odyssey',
    subtitle: 'Land of High Passes',
    location: 'Leh · Nubra · Pangong',
    state: 'Ladakh', region: 'North', type: 'Adventure',
    duration: 9, groupSize: 8, rating: 5.0, reviews: 178,
    price: 82000, difficulty: 'HARD',
    altitude: '3500m', season: 'Jun – Sep', wind: 'Strong',
    cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=90',
    thumb: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
    excerpt: "The world's highest motorable passes, turquoise lakes mirroring Himalayan peaks, monasteries perched on clifftops.",
    highlights: ['Pangong Lake sunrise', 'Nubra Valley', 'Khardung La pass'],
    accent: '#1a5fa8', accentDim: 'rgba(26,95,168,0.08)',
    boardingCode: 'LA-07', departure: '05:30', status: 'FILLING',
    featured: false,
  },
  {
    id: 8, slug: 'andaman-island-paradise',
    title: 'Andaman Island Paradise',
    subtitle: 'Coral Kingdom',
    location: 'Havelock · Neil · Port Blair',
    state: 'Andaman & Nicobar', region: 'East', type: 'Beach',
    duration: 8, groupSize: 12, rating: 4.9, reviews: 201,
    price: 65000, difficulty: 'EASY',
    altitude: '10m', season: 'Oct – May', wind: 'Warm',
    cover: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1600&q=90',
    thumb: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80',
    excerpt: "Asia's finest beach at Radhanagar, coral gardens alive with colour, and bioluminescent plankton lighting the surf.",
    highlights: ['Radhanagar Beach', 'Coral snorkelling', 'Bioluminescent kayak'],
    accent: '#0e7a8a', accentDim: 'rgba(14,122,138,0.08)',
    boardingCode: 'AN-08', departure: '08:00', status: 'ON TIME',
    featured: false,
  },
  {
    id: 9, slug: 'rann-of-kutch-festival',
    title: 'Rann of Kutch Festival',
    subtitle: 'White Desert Wonder',
    location: 'Great Rann of Kutch',
    state: 'Gujarat', region: 'West', type: 'Cultural',
    duration: 5, groupSize: 10, rating: 4.8, reviews: 112,
    price: 32000, difficulty: 'EASY',
    altitude: '16m', season: 'Nov – Feb', wind: 'Dry',
    cover: 'https://images.unsplash.com/photo-1523978591478-c753949ff840?w=1600&q=90',
    thumb: 'https://images.unsplash.com/photo-1523978591478-c753949ff840?w=400&q=80',
    excerpt: "Under a full moon, the Rann transforms into a white infinity mirror. By day, meet master craftsmen of Kutch's legendary embroidery villages.",
    highlights: ['Full moon night walk', 'Kutch embroidery', 'Wild ass sanctuary'],
    accent: '#b8892a', accentDim: 'rgba(184,137,42,0.1)',
    boardingCode: 'GJ-09', departure: '07:00', status: 'ON TIME',
    featured: false,
  },
  {
    id: 10, slug: 'sundarbans-tiger-delta',
    title: 'Sundarbans Tiger Delta',
    subtitle: 'Royal Bengal Country',
    location: 'Sundarbans, West Bengal',
    state: 'West Bengal', region: 'East', type: 'Adventure',
    duration: 5, groupSize: 10, rating: 4.7, reviews: 89,
    price: 38000, difficulty: 'MODERATE',
    altitude: '0m', season: 'Sep – Mar', wind: 'Humid',
    cover: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1600&q=90',
    thumb: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&q=80',
    excerpt: "Navigate the world's largest mangrove delta by boat, listening for Royal Bengal tigers at the water's edge.",
    highlights: ['Tiger boat safari', 'Mangrove forest walk', 'Village homestay'],
    accent: '#a03060', accentDim: 'rgba(160,48,96,0.08)',
    boardingCode: 'WB-10', departure: '06:00', status: 'ON TIME',
    featured: false,
  },
  {
    id: 11, slug: 'amritsar-golden-temple',
    title: 'Punjab Golden Temple',
    subtitle: 'Soul of the Sikhs',
    location: 'Amritsar · Wagah Border',
    state: 'Punjab', region: 'North', type: 'Spiritual',
    duration: 3, groupSize: 16, rating: 4.8, reviews: 267,
    price: 18000, difficulty: 'EASY',
    altitude: '234m', season: 'All Year', wind: 'Moderate',
    cover: 'https://images.unsplash.com/photo-1609766418204-94aae0ecfdfc?w=1600&q=90',
    thumb: 'https://images.unsplash.com/photo-1609766418204-94aae0ecfdfc?w=400&q=80',
    excerpt: "The Golden Temple glows at dawn like a jewel set in still water. Share langar with pilgrims, then watch the electric Wagah ceremony.",
    highlights: ['Golden Temple dawn', 'Langar experience', 'Wagah ceremony'],
    accent: '#b8892a', accentDim: 'rgba(184,137,42,0.1)',
    boardingCode: 'PB-11', departure: '04:00', status: 'ON TIME',
    featured: false,
  },
  {
    id: 12, slug: 'hampi-badami-trail',
    title: 'Hampi & Badami Trail',
    subtitle: 'Ruins of an Empire',
    location: 'Hampi & Badami, Karnataka',
    state: 'Karnataka', region: 'South', type: 'Cultural',
    duration: 6, groupSize: 12, rating: 4.7, reviews: 143,
    price: 35000, difficulty: 'MODERATE',
    altitude: '467m', season: 'Oct – Feb', wind: 'Warm',
    cover: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=90',
    thumb: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    excerpt: 'Wander the ruins of the Vijayanagara empire — a boulder-strewn dreamscape of ancient temples at golden hour.',
    highlights: ['Virupaksha Temple', 'Matanga Hill sunrise', 'Badami caves'],
    accent: '#c05a18', accentDim: 'rgba(192,90,24,0.08)',
    boardingCode: 'KA-12', departure: '06:30', status: 'ON TIME',
    featured: false,
  },
]

// Regions are embedded in RegionOrbit component
const TYPES = ['All', 'Adventure', 'Cultural', 'Beach', 'Spiritual']

const REGION_FLAGS: Record<string, string> = {
  North: '🏔️', South: '🌴', East: '🐯', West: '🏖️', Northeast: '🌿',
}

const STATUS_STYLE: Record<string, { color: string; pulse: boolean }> = {
  'ON TIME': { color: '#1a7a3c', pulse: false },
  'LIMITED': { color: '#c05a18', pulse: true },
  'FILLING': { color: '#b8892a', pulse: true },
}

// ─── STAR CANVAS — removed for light theme, replaced by paper texture overlay ──
function PaperOverlay() {
  return (
    <div style={{
      position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.025'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'repeat',
      opacity: 0.6,
    }} />
  )
}

// ─── BOARDING PREVIEW (full-screen cinematic panel) ──────────────────────────
function BoardingPreview({ tour, onClose }: { tour: any; onClose: () => void }) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useTransform(mouseY, [-300, 300], [6, -6])
  const rotateY = useTransform(mouseX, [-300, 300], [-6, 6])

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  const handleMouse = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left - rect.width / 2)
    mouseY.set(e.clientY - rect.top - rect.height / 2)
  }, [mouseX, mouseY])

  return (
    <AnimatePresence>
      {tour && (
        <motion.div
          key={tour.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 500,
            background: 'rgba(28,25,23,0.7)', backdropFilter: 'blur(20px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 'clamp(20px,4vw,60px)',
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.88, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            onMouseMove={handleMouse}
            onMouseLeave={() => { mouseX.set(0); mouseY.set(0) }}
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 1100, borderRadius: 4,
              overflow: 'hidden', position: 'relative',
              border: `1px solid ${tour.accent}40`,
              boxShadow: `0 0 80px ${tour.accent}18, 0 24px 64px rgba(28,25,23,0.18)`,
              rotateX, rotateY,
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Full bleed image */}
            <div style={{ position: 'relative', height: 'clamp(420px,55vh,620px)', overflow: 'hidden' }}>
              <motion.div
                initial={{ scale: 1.08 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: `url(${tour.cover})`,
                  backgroundSize: 'cover', backgroundPosition: 'center',
                }}
              />
              {/* Multi-layer gradient — keeps image readable */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.08) 100%)' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,8,5,0.98) 0%, transparent 55%)' }} />

              {/* Top bar — boarding pass strip */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '20px 28px',
                background: 'rgba(253,251,247,0.12)', backdropFilter: 'blur(8px)',
                borderBottom: `1px solid ${tour.accent}30`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 9, letterSpacing: '0.3em', color: 'rgba(253,251,247,0.6)', textTransform: 'uppercase' }}>Pavilion Expeditions</span>
                  <span style={{ width: 1, height: 12, background: 'rgba(253,251,247,0.2)', display: 'inline-block' }} />
                  <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 9, letterSpacing: '0.25em', color: tour.accent }}>BOARDING PASS · {tour.boardingCode}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.2em', color: 'rgba(253,251,247,0.4)', textTransform: 'uppercase' }}>Departure {tour.departure}</span>
                  <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(253,251,247,0.1)', border: '1px solid rgba(253,251,247,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(253,251,247,0.7)' }}>
                    <FiX size={13} />
                  </button>
                </div>
              </div>

              {/* Hero text */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '0 32px 32px', maxWidth: 600 }}>
                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  style={{ fontFamily: '"Space Mono",monospace', fontSize: 9, letterSpacing: '0.3em', color: tour.accent, textTransform: 'uppercase', marginBottom: 8 }}>
                  {REGION_FLAGS[tour.region]} {tour.region} India · {tour.state}
                </motion.p>
                <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                  style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 'clamp(3rem,6vw,7rem)', letterSpacing: '0.02em', lineHeight: 0.88, color: '#fff', marginBottom: 12 }}>
                  {tour.title}
                </motion.h2>
                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  style={{ fontFamily: '"Crimson Text",serif', fontStyle: 'italic', fontSize: 18, color: 'rgba(253,251,247,0.7)', lineHeight: 1.6 }}>
                  {tour.excerpt}
                </motion.p>
              </div>

              {/* Right data panel — instrument cluster */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
                style={{
                  position: 'absolute', bottom: 28, right: 28,
                  display: 'flex', flexDirection: 'column', gap: 6,
                  background: 'rgba(253,251,247,0.92)', backdropFilter: 'blur(12px)',
                  border: `1px solid ${tour.accent}25`, borderRadius: 3, padding: '14px 18px',
                }}>
                {[
                  { icon: <FiClock size={10} />, label: 'Duration', val: `${tour.duration} days` },
                  { icon: <GiSunrise size={10} />, label: 'Best Season', val: tour.season },
                  { icon: <FiWind size={10} />, label: 'Wind', val: tour.wind },
                  { icon: <FiCompass size={10} />, label: 'Altitude', val: tour.altitude },
                  { icon: <FiUsers size={10} />, label: 'Group', val: `Max ${tour.groupSize}` },
                  { icon: <FiStar size={10} />, label: 'Rating', val: `${tour.rating} (${tour.reviews})` },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ color: tour.accent }}>{item.icon}</span>
                    <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.12em', color: 'rgba(28,25,23,0.4)', minWidth: 68 }}>{item.label}</span>
                    <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 9, color: '#1c1917' }}>{item.val}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Bottom strip — highlights + CTA */}
            <div style={{
              background: '#faf6f0',
              borderTop: `2px solid ${tour.accent}`,
              padding: '22px 32px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap',
            }}>
              {/* Highlights */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {tour.highlights.map((h: string, i: number) => (
                  <motion.span key={h} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.07 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: tour.accentDim, border: `1px solid ${tour.accent}35`, borderRadius: 100, fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.1em', color: tour.accent }}>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: tour.accent, flexShrink: 0 }} />{h}
                  </motion.span>
                ))}
              </div>

              {/* Price + CTA */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexShrink: 0 }}>
                <div>
                  <p style={{ fontFamily: '"Space Mono",monospace', fontSize: 7, letterSpacing: '0.2em', color: 'rgba(28,25,23,0.4)', margin: 0, textTransform: 'uppercase' }}>From</p>
                  <p style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 38, color: tour.accent, lineHeight: 1, margin: 0 }}>₹{tour.price.toLocaleString('en-IN')}</p>
                </div>
                <Link to={`/booking/${tour.slug}`} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  background: tour.accent,
                  color: '#fdfbf7', fontFamily: '"Space Mono",monospace', fontSize: 10,
                  letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700,
                  padding: '14px 26px', borderRadius: 2, textDecoration: 'none',
                  boxShadow: `0 8px 32px ${tour.accent}30`,
                }}>
                  Board Now <FiArrowRight size={12} />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* ESC hint */}
          <p style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.3em', color: 'rgba(28,25,23,0.35)', textTransform: 'uppercase' }}>ESC to close</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── DEPARTURE ROW (the main manifest entry) ──────────────────────────────────
function DepartureRow({ tour, index, onBoard }: { tour: any; index: number; onBoard: () => void }) {
  const [hovered, setHovered] = useState(false)
  const st = STATUS_STYLE[tour.status] || STATUS_STYLE['ON TIME']

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, scale: 0.98 }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative', overflow: 'hidden',
        borderBottom: `1px solid rgba(28,25,23,${hovered ? '0.12' : '0.06'})`,
        transition: 'all 0.3s ease',
        background: hovered ? `${tour.accentDim}` : 'transparent',
        cursor: 'pointer',
      }}
      onClick={onBoard}
    >
      {/* Hover image bleed — very subtle on light bg */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              position: 'absolute', inset: 0,
              backgroundImage: `url(${tour.thumb})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
              filter: 'brightness(0.92) saturate(0.35)',
              opacity: 0.06,
              zIndex: 0,
            }}
          />
        )}
      </AnimatePresence>

      {/* Left color stripe */}
      <motion.div
        animate={{ scaleY: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
        style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
          background: `linear-gradient(to bottom,${tour.accent},${tour.accent}44)`,
          transformOrigin: 'top', borderRadius: '0 2px 2px 0',
        }}
      />

      <div style={{
        position: 'relative', zIndex: 1,
        display: 'grid',
        gridTemplateColumns: '80px 1fr 200px 120px 120px 110px 140px',
        alignItems: 'center',
        padding: '18px clamp(20px,4vw,60px)',
        gap: 12,
      }}>
        {/* Boarding code */}
        <div>
          <p style={{ fontFamily: '"Space Mono",monospace', fontSize: 11, letterSpacing: '0.15em', color: tour.accent, margin: 0, fontWeight: 700 }}>{tour.boardingCode}</p>
          <p style={{ fontFamily: '"Space Mono",monospace', fontSize: 7, letterSpacing: '0.2em', color: 'rgba(28,25,23,0.35)', margin: '2px 0 0', textTransform: 'uppercase' }}>{tour.departure}</p>
        </div>

        {/* Destination */}
        <div style={{ paddingLeft: 8, borderLeft: '1px solid rgba(28,25,23,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
            <span style={{ fontSize: 14 }}>{REGION_FLAGS[tour.region]}</span>
            <span style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 24, letterSpacing: '0.05em', color: hovered ? '#1c1917' : '#292524', lineHeight: 1, transition: 'color 0.3s' }}>{tour.title}</span>
            {tour.featured && <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 6, letterSpacing: '0.2em', padding: '2px 7px', background: 'rgba(184,137,42,0.1)', border: '1px solid rgba(184,137,42,0.35)', color: '#b8892a', borderRadius: 100, textTransform: 'uppercase' }}>FEATURED</span>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <FiMapPin size={8} color="rgba(184,137,42,0.5)" />
            <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.08em', color: 'rgba(28,25,23,0.4)' }}>{tour.location}</span>
          </div>
        </div>

        {/* Region + Type */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 7, letterSpacing: '0.15em', padding: '3px 9px', background: `${tour.accent}12`, border: `1px solid ${tour.accent}35`, color: tour.accent, borderRadius: 100, textTransform: 'uppercase' }}>{tour.region}</span>
          <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 7, letterSpacing: '0.15em', padding: '3px 9px', background: 'rgba(28,25,23,0.05)', border: '1px solid rgba(28,25,23,0.12)', color: 'rgba(28,25,23,0.5)', borderRadius: 100, textTransform: 'uppercase' }}>{tour.type}</span>
        </div>

        {/* Duration */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <FiClock size={10} color="rgba(28,25,23,0.3)" />
          <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 9, color: 'rgba(28,25,23,0.55)' }}>{tour.duration} days</span>
        </div>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <FiStar size={10} color="#c07a10" style={{ fill: '#c07a10' }} />
          <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 10, color: '#1c1917', fontWeight: 700 }}>{tour.rating}</span>
          <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 7, color: 'rgba(28,25,23,0.3)' }}>({tour.reviews})</span>
        </div>

        {/* Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <motion.div
            animate={st.pulse ? { scale: [1, 1.4, 1], opacity: [1, 0.5, 1] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ width: 6, height: 6, borderRadius: '50%', background: st.color, boxShadow: `0 0 6px ${st.color}60` }}
          />
          <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.15em', color: st.color, textTransform: 'uppercase' }}>{tour.status}</span>
        </div>

        {/* Price + action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'flex-end' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 22, color: tour.accent, lineHeight: 1, margin: 0 }}>₹{(tour.price / 1000).toFixed(0)}k</p>
          </div>
          <motion.div
            animate={{ x: hovered ? 0 : -4, opacity: hovered ? 1 : 0.4 }}
            style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.2em', color: tour.accent, textTransform: 'uppercase' }}
          >
            Board <FiArrowRight size={9} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

// ─── REGION ORBIT SELECTOR ────────────────────────────────────────────────────
function RegionOrbit({ active, onSelect }: { active: string; onSelect: (r: string) => void }) {
  const regions = [
    { id: 'North', angle: 270, emoji: '🏔️', color: '#1a5fa8', label: 'North' },
    { id: 'South', angle: 90, emoji: '🌴', color: '#0d7a55', label: 'South' },
    { id: 'West', angle: 180, emoji: '🏖️', color: '#c05a18', label: 'West' },
    { id: 'East', angle: 0, emoji: '🐯', color: '#a03060', label: 'East' },
    { id: 'Northeast', angle: 315, emoji: '🌿', color: '#6d41b8', label: 'NE' },
  ]

  return (
    <div style={{ position: 'relative', width: 200, height: 200, flexShrink: 0 }}>
      {/* Orbit rings */}
      {[60, 88].map((r, i) => (
        <div key={r} style={{
          position: 'absolute', width: r * 2, height: r * 2,
          border: '1px solid rgba(28,25,23,0.1)',
          borderRadius: '50%', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          animation: `orbitSpin ${30 + i * 15}s linear infinite ${i % 2 ? 'reverse' : ''}`,
        }} />
      ))}

      {/* Center */}
      <button
        onClick={() => onSelect('All')}
        style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          width: 50, height: 50, borderRadius: '50%', cursor: 'pointer',
          background: active === 'All' ? 'rgba(184,137,42,0.15)' : 'rgba(28,25,23,0.04)',
          border: `1.5px solid ${active === 'All' ? '#b8892a' : 'rgba(28,25,23,0.14)'}`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          boxShadow: active === 'All' ? '0 0 20px rgba(184,137,42,0.2)' : 'none',
          transition: 'all 0.3s',
          fontSize: 18,
        }}
      >
        🇮🇳
      </button>

      {/* Region nodes */}
      {regions.map(reg => {
        const rad = (reg.angle - 90) * Math.PI / 180
        const r = 78
        const cx = 100 + r * Math.cos(rad)
        const cy = 100 + r * Math.sin(rad)
        const isActive = active === reg.id
        return (
          <button
            key={reg.id}
            onClick={() => onSelect(isActive ? 'All' : reg.id)}
            style={{
              position: 'absolute',
              left: cx, top: cy,
              width: 36, height: 36, borderRadius: '50%', cursor: 'pointer',
              background: isActive ? `${reg.color}18` : 'rgba(28,25,23,0.04)',
              border: `1.5px solid ${isActive ? reg.color : 'rgba(28,25,23,0.12)'}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              boxShadow: isActive ? `0 0 16px ${reg.color}40` : 'none',
              transform: `translate(-50%,-50%) scale(${isActive ? 1.2 : 1})`,
              transition: 'all 0.3s',
              fontSize: 14,
            }}
          >
            {reg.emoji}
          </button>
        )
      })}
    </div>
  )
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function ToursPage() {
  const [tours, setTours] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [regionFilter, setRegionFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [selectedTour, setSelectedTour] = useState<any | null>(null)
  const [scrollY, setScrollY] = useState(0)

  // Fetch tours from API on mount; fall back to premium mock data on failure or empty response
  useEffect(() => {
    const controller = new AbortController()
    fetch('http://localhost:5000/api/tours', { signal: controller.signal })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(data => {
        const fetched = Array.isArray(data?.data?.tours) ? data.data.tours : []
        // If API returns empty array, use fallback tours so the page is never blank
        setTours(fetched.length > 0 ? fetched : FALLBACK_TOURS)
        setLoading(false)
      })
      .catch(err => {
        if (err?.name === 'AbortError') return
        console.warn('Tours API unavailable — showing premium fallback tours:', err?.message)
        // Graceful degradation: load fallback tours instead of showing error screen
        setTours(FALLBACK_TOURS)
        setError(null)
        setLoading(false)
      })
    return () => controller.abort()
  }, [])

  useEffect(() => {
    const h = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  // Lock body scroll when preview open
  useEffect(() => {
    document.body.style.overflow = selectedTour ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [selectedTour])

  const filtered = useMemo(() => (tours ?? []).filter((t: any) => {
    if (!t) return false
    if (regionFilter !== 'All' && t?.region !== regionFilter) return false
    if (typeFilter !== 'All' && t?.type !== typeFilter) return false
    if (search) {
      const q = search.toLowerCase()
      const title = t?.title?.toLowerCase() ?? ''
      const location = t?.location?.toLowerCase() ?? ''
      const state = t?.state?.toLowerCase() ?? ''
      if (!title.includes(q) && !location.includes(q) && !state.includes(q)) return false
    }
    return true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [tours, regionFilter, typeFilter, search])

  // Show loading state only while genuinely loading and no data is available yet
  if (loading && tours.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: '#fdfbf7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          <div style={{ width: 60, height: 60, border: '3px solid rgba(184,137,42,0.15)', borderTop: '3px solid #b8892a', borderRadius: '50%', margin: '0 auto 20px', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ fontFamily: '"Space Mono",monospace', fontSize: 14, color: 'rgba(28,25,23,0.4)' }}>Loading tours...</p>
        </div>
      </div>
    )
  }

  // `error` is now only set for truly unrecoverable cases; fallback tours handle the common case
  // (this branch is intentionally left as a safety net but will rarely be reached)
  if (error && tours.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: '#fdfbf7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: '"Space Mono",monospace', fontSize: 14, color: '#b83232', marginBottom: 20 }}>{error}</p>
          <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', background: '#b8892a', color: '#fdfbf7', border: 'none', borderRadius: 2, cursor: 'pointer', fontFamily: '"Space Mono",monospace' }}>
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fdfbf7', color: '#1c1917', fontFamily: '"Crimson Text",Georgia,serif', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { background: #fdfbf7; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #fdfbf7; }
        ::-webkit-scrollbar-thumb { background: rgba(184,137,42,0.25); border-radius: 2px; }
        input::placeholder { color: rgba(28,25,23,0.35); }
        input:focus { outline: none; }
        @keyframes orbitSpin { from{transform:translate(-50%,-50%) rotate(0deg)} to{transform:translate(-50%,-50%) rotate(360deg)} }
        @keyframes tickerScroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes departureFade {
          0% { opacity: 0.3; } 50% { opacity: 1; } 100% { opacity: 0.3; }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); }
        }
      `}</style>

      <PaperOverlay />

      {/* Scroll progress — tricolour */}
      <motion.div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 2, zIndex: 9999,
        transformOrigin: '0%',
        scaleX: scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1),
        background: 'linear-gradient(90deg,#ff9933 33%,rgba(28,25,23,0.4) 33% 66%,#138808 66%)',
      }} />

      {/* Boarding preview modal */}
      <BoardingPreview tour={selectedTour} onClose={() => setSelectedTour(null)} />

      {/* ── HERO — DEPARTURE TERMINAL ──────────────────────────────────────── */}
      <section style={{
        position: 'relative', minHeight: '100vh', overflow: 'hidden',
        display: 'flex', alignItems: 'flex-end',
        padding: '0 clamp(20px,5vw,80px) 0', zIndex: 1,
      }}>
        {/* Background — collage of India */}
        <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr' }}>
          {[
            'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=70',
            'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=70',
            'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=70',
            'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=70',
            'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&q=70',
            'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=70',
          ].map((src, i) => (
            <div key={i} style={{
              backgroundImage: `url(${src})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
              filter: 'brightness(0.45) saturate(0.6)',
              transform: `translateY(${scrollY * (0.1 + i * 0.03)}px)`,
              transition: 'transform 0.05s linear',
            }} />
          ))}
        </div>
        {/* Gradient overlay — lighter fade to warm white */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(253,251,247,0.15) 0%, rgba(253,251,247,0.5) 50%, rgba(253,251,247,1) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(253,251,247,0.55) 0%, transparent 35%, transparent 65%, rgba(253,251,247,0.55) 100%)' }} />

        {/* Tricolour strip */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, display: 'flex' }}>
          <div style={{ flex: 1, background: '#ff9933' }} /><div style={{ flex: 1, background: 'rgba(28,25,23,0.35)' }} /><div style={{ flex: 1, background: '#138808' }} />
        </div>

        {/* Grid lines — very subtle on light */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(28,25,23,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(28,25,23,0.025) 1px,transparent 1px)', backgroundSize: '80px 80px', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, width: '100%', paddingBottom: 60 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: 40, alignItems: 'end', maxWidth: 1300, margin: '0 auto' }}>
            <div>
              {/* Terminal label */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                <GiCompass style={{ color: '#b8892a', fontSize: 14 }} />
                <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(184,137,42,0.8)' }}>PAVILION DEPARTURE TERMINAL · INDIA</span>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1a7a3c', boxShadow: '0 0 8px rgba(26,122,60,0.6)', animation: 'departureFade 2s ease-in-out infinite' }} />
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 'clamp(4rem,9vw,11rem)', letterSpacing: '0.02em', lineHeight: 0.88, color: '#1c1917', marginBottom: 20 }}>
                ALL<br />
                <span style={{ WebkitTextStroke: '1px rgba(184,137,42,0.4)', color: 'transparent' }}>DEPARTURES</span><br />
                <span style={{ color: '#b8892a' }}>NOW OPEN</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                style={{ fontFamily: '"Crimson Text",serif', fontStyle: 'italic', fontSize: 19, color: 'rgba(28,25,23,0.6)', maxWidth: 500, lineHeight: 1.65, marginBottom: 32 }}>
                {tours.length} handcrafted expeditions across every corner of Incredible India. Select your route. Board your journey.
              </motion.p>

              {/* Search */}
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 12, border: '1px solid rgba(184,137,42,0.3)', padding: '12px 18px', borderRadius: 2, background: 'rgba(253,251,247,0.9)', backdropFilter: 'blur(12px)', minWidth: 360 }}>
                <FiSearch size={13} color="rgba(184,137,42,0.6)" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search destination, state, type..."
                  style={{ background: 'none', border: 'none', fontFamily: '"Space Mono",monospace', fontSize: 11, letterSpacing: '0.1em', color: '#1c1917', width: 280 }} />
                {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}><FiX size={12} color="rgba(28,25,23,0.4)" /></button>}
              </motion.div>
            </div>

            {/* Orbit region selector */}
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <RegionOrbit active={regionFilter} onSelect={setRegionFilter} />
              <p style={{ fontFamily: '"Space Mono",monospace', fontSize: 7, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(28,25,23,0.35)', textAlign: 'center' }}>Select Region</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── DEPARTURE BOARD ───────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', zIndex: 1, paddingBottom: 100 }}>

        {/* Board header */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 100,
          background: 'rgba(250,246,240,0.97)', backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(28,25,23,0.06)',
          borderBottom: '1px solid rgba(28,25,23,0.08)',
        }}>
          {/* Column headers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '80px 1fr 200px 120px 120px 110px 140px',
            padding: '10px clamp(20px,4vw,60px)',
            gap: 12, alignItems: 'center',
          }}>
            {['FLIGHT', 'DESTINATION', 'REGION / TYPE', 'DURATION', 'RATING', 'STATUS', 'FARE'].map((col, i) => (
              <span key={col} style={{ fontFamily: '"Space Mono",monospace', fontSize: 7, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(28,25,23,0.35)', paddingLeft: i === 1 ? 8 : 0 }}>{col}</span>
            ))}
          </div>

          {/* Type filter strip */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px clamp(20px,4vw,60px)',
            borderTop: '1px solid rgba(28,25,23,0.06)',
          }}>
            <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 7, letterSpacing: '0.3em', color: 'rgba(28,25,23,0.3)', textTransform: 'uppercase', marginRight: 4 }}>TYPE</span>
            {TYPES.map(t => {
              const colors: Record<string, string> = { Adventure: '#1a5fa8', Cultural: '#b8892a', Beach: '#0e7a8a', Spiritual: '#6d41b8', All: '#1c1917' }
              const active = typeFilter === t
              return (
                <motion.button key={t} onClick={() => setTypeFilter(t)} whileTap={{ scale: 0.95 }}
                  style={{
                    padding: '4px 12px', borderRadius: 100, cursor: 'pointer',
                    fontFamily: '"Space Mono",monospace', fontSize: 7, letterSpacing: '0.15em', textTransform: 'uppercase',
                    background: active ? `${colors[t] || '#1c1917'}14` : 'transparent',
                    border: `1px solid ${active ? (colors[t] || '#1c1917') + '60' : 'rgba(28,25,23,0.1)'}`,
                    color: active ? colors[t] || '#1c1917' : 'rgba(28,25,23,0.35)',
                    transition: 'all 0.2s', outline: 'none',
                  }}>{t}</motion.button>
              )
            })}

            {/* Results count */}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
              <motion.span key={filtered.length} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 28, color: '#b8892a', lineHeight: 1 }}>
                {filtered.length}
              </motion.span>
              <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 7, letterSpacing: '0.25em', color: 'rgba(28,25,23,0.3)', textTransform: 'uppercase' }}>departures</span>
              {(regionFilter !== 'All' || typeFilter !== 'All' || search) && (
                <button onClick={() => { setRegionFilter('All'); setTypeFilter('All'); setSearch('') }}
                  style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: '1px solid rgba(180,32,32,0.25)', borderRadius: 100, padding: '3px 10px', cursor: 'pointer', fontFamily: '"Space Mono",monospace', fontSize: 7, letterSpacing: '0.15em', color: 'rgba(180,32,32,0.55)', textTransform: 'uppercase' }}>
                  <FiX size={8} /> Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Departure manifest rows */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ textAlign: 'center', padding: '80px 0', borderBottom: '1px solid rgba(28,25,23,0.06)' }}>
              <p style={{ fontSize: 48, marginBottom: 12 }}>🗺️</p>
              <p style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 28, color: 'rgba(28,25,23,0.3)', letterSpacing: '0.05em', marginBottom: 20 }}>No departures match your route</p>
              <button onClick={() => { setRegionFilter('All'); setTypeFilter('All'); setSearch('') }}
                style={{ padding: '10px 24px', borderRadius: 2, cursor: 'pointer', background: 'rgba(184,137,42,0.08)', border: '1px solid rgba(184,137,42,0.3)', color: '#b8892a', fontFamily: '"Space Mono",monospace', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                Show All Departures
              </button>
            </motion.div>
          ) : (
            <motion.div key={`${regionFilter}-${typeFilter}-${search}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {filtered.map((tour, i) => (
                <DepartureRow key={tour.id} tour={tour} index={i} onBoard={() => setSelectedTour(tour)} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom hint */}
        <div style={{ textAlign: 'center', padding: '36px', borderTop: '1px solid rgba(28,25,23,0.06)' }}>
          <p style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(28,25,23,0.25)' }}>
            Hover any departure to preview · Click to board
          </p>
          <p style={{ fontFamily: '"Crimson Text",serif', fontStyle: 'italic', fontSize: 14, color: 'rgba(28,25,23,0.3)', marginTop: 6 }}>
            More destinations launching as we expand across every state of India
          </p>
        </div>
      </section>

      {/* ── BESPOKE CTA ─────────────────────────────────────────────────────── */}
      <section style={{
        margin: '0 clamp(20px,5vw,80px)', marginBottom: 80,
        position: 'relative', overflow: 'hidden', borderRadius: 3,
        border: '1px solid rgba(184,137,42,0.18)',
        padding: 'clamp(40px,6vw,72px)',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?w=1400&q=70)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'brightness(0.08) saturate(0.3)',
        }} />
        {/* Warm light wash over image */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(253,251,247,0.88)' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, display: 'flex' }}>
          <div style={{ flex: 1, background: '#ff9933' }} /><div style={{ flex: 1, background: 'rgba(28,25,23,0.3)' }} /><div style={{ flex: 1, background: '#138808' }} />
        </div>
        <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
          <div>
            <p style={{ fontFamily: '"Space Mono",monospace', fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#b8892a', marginBottom: 14 }}>Private Expeditions</p>
            <h2 style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 'clamp(2.5rem,4vw,5rem)', letterSpacing: '0.03em', color: '#1c1917', lineHeight: 0.92, marginBottom: 16 }}>
              NO DEPARTURE<br />THAT FITS?<br /><span style={{ color: '#b8892a' }}>CHARTER YOUR OWN.</span>
            </h2>
            <p style={{ fontFamily: '"Crimson Text",serif', fontStyle: 'italic', fontSize: 17, color: 'rgba(28,25,23,0.55)', lineHeight: 1.65, marginBottom: 28 }}>
              Every destination in India is reachable. Tell us where you want to go and we'll design the entire itinerary around you.
            </p>
            <Link to="/contact" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: '#b8892a', color: '#fdfbf7',
              fontFamily: '"Space Mono",monospace', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700,
              padding: '13px 26px', textDecoration: 'none', borderRadius: 2,
              boxShadow: '0 8px 28px rgba(184,137,42,0.25)',
            }}>
              Plan My Journey <FiArrowRight size={12} />
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { n: '28+', label: 'States Covered', sub: 'and growing' },
              { n: '4.9★', label: 'Avg Rating', sub: '12,000+ travellers' },
              { n: '100%', label: 'Local Guides', sub: 'born in each region' },
              { n: '24/7', label: 'On-Ground Support', sub: 'always reachable' },
            ].map(item => (
              <div key={item.label} style={{ border: '1px solid rgba(184,137,42,0.14)', borderRadius: 2, padding: '20px 18px', background: 'rgba(253,251,247,0.7)' }}>
                <p style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 34, color: '#b8892a', lineHeight: 1, margin: '0 0 4px' }}>{item.n}</p>
                <p style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(28,25,23,0.55)', margin: '0 0 2px' }}>{item.label}</p>
                <p style={{ fontFamily: '"Crimson Text",serif', fontStyle: 'italic', fontSize: 12, color: 'rgba(28,25,23,0.35)', margin: 0 }}>{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ticker — safe even when tours is empty */}
      {tours.length > 0 && (
        <div style={{ borderTop: '1px solid rgba(28,25,23,0.07)', padding: '14px 0', overflow: 'hidden', zIndex: 1, position: 'relative', background: '#faf6f0' }}>
          <div style={{ display: 'flex', animation: 'tickerScroll 50s linear infinite', width: 'max-content' }}>
            {[...tours, ...tours].map((t, i) => t && (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 28px', borderRight: '1px solid rgba(28,25,23,0.07)', whiteSpace: 'nowrap' }}>
                <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.12em', color: t?.accent ?? '#b8892a' }}>{t?.boardingCode ?? '—'}</span>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: t?.accent ?? '#b8892a', flexShrink: 0 }} />
                <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, color: 'rgba(28,25,23,0.5)', letterSpacing: '0.08em' }}>{t?.title ?? 'Tour'}</span>
                <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 7, color: 'rgba(28,25,23,0.3)' }}>₹{((t?.price ?? 0) / 1000).toFixed(0)}k</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}