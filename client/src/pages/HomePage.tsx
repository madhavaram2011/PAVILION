import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { FiArrowRight, FiArrowDown, FiCalendar, FiMapPin, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { GiCompass } from 'react-icons/gi'

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────────────────────────────────────
const T = {
  cream: '#FDF6EC',
  cream2: '#F7EDD8',
  saffron: '#F4A228',
  amber: '#C8531A',
  emerald: '#0A5C3E',
  emerald2: '#0D7A52',
  mahogany: '#2C1204',
  bronze: '#8B5E2A',
  gold: '#D4922A',
  mist: '#FAF3E6',
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK TOURS (fallback while API loads)
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// JOURNEY CATEGORIES — updated imagery per directive
// ─────────────────────────────────────────────────────────────────────────────
const JOURNEYS = [
  {
    id: 'heritage', label: 'Heritage', mark: 'I',
    color: T.amber,
    headline: 'Stone that remembers everything',
    body: "Mughal marble, Rajput sandstone, Dravidian temple towers carved over centuries. India's heritage isn't roped off behind glass — it's lived in, prayed in, and walked through daily.",
    // Grand palace/monument architecture shot
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1400&q=90',
    places: ['Taj Mahal, Agra', 'Amber Fort, Jaipur', 'Mehrangarh, Jodhpur', 'Hampi Ruins, Karnataka'],
  },
  {
    id: 'spiritual', label: 'Spiritual', mark: 'II',
    color: T.gold,
    headline: 'A stillness older than memory',
    body: 'The ghats of Rishikesh at dawn — yoga mats on cool stone, the Ganga rushing green below, bells echoing off forested hills. India holds sacred space at a scale that changes people.',
    // Rishikesh ghats / serene spiritual shot
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1400&q=90',
    places: ['Rishikesh Ghats, Uttarakhand', 'Golden Temple, Amritsar', 'Pushkar Lake, Rajasthan', 'Auroville, Pondicherry'],
  },
  {
    id: 'adventure', label: 'Adventure', mark: 'III',
    color: T.emerald,
    headline: 'The river does not negotiate',
    body: 'Grade IV rapids on the Ganges through the gorge at Rishikesh — water white and cold, adrenaline absolute. Then silence, forest walls, a kingfisher on a rock. India earns its mountains.',
    // Whitewater rafting action shot — Rishikesh
    image: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=1400&q=90',
    places: ['Rishikesh Rafting, Uttarakhand', 'Spiti Valley, Himachal', 'Rohtang Pass, Manali', 'Dzukou Valley, Nagaland'],
  },
  {
    id: 'wilderness', label: 'Wilderness', mark: 'IV',
    color: '#3A7D44',
    headline: 'Wild at a scale that humbles',
    body: 'A Bengal tiger moves without sound through dry deciduous forest. Crocodiles bask in still lakes. The wild here has never needed an audience and is the richer for it.',
    // Deep Indian jungle/tiger sanctuary shot
    image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=1400&q=90',
    places: ['Ranthambore, Rajasthan', 'Kaziranga, Assam', 'Sundarbans, West Bengal', 'Bandhavgarh, MP'],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// TRAVEL PERSONA DATA — for Mood Selector widget
// ─────────────────────────────────────────────────────────────────────────────
const PERSONAS = [
  {
    id: 'soul',
    pill: 'Soul Searcher 🧘‍♂️',
    color: T.gold,
    bg: 'rgba(212,146,42,0.12)',
    title: 'The Inner India',
    subtitle: 'Varanasi · Rishikesh · Auroville',
    body: "You travel to be changed. You want sunrise on the Ganges, firelight meditation, a conversation with a sadhu at dusk. We plan the quiet moments everyone else rushes past.",
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=900&q=85',
    tags: ['4–7 days', 'Small group', 'Slow pace'],
    cta: 'Find your stillness',
  },
  {
    id: 'thrill',
    pill: 'Thrill Seeker 🌊',
    color: T.emerald,
    bg: 'rgba(10,92,62,0.12)',
    title: 'India at Full Speed',
    subtitle: 'Rishikesh · Spiti · Coorg',
    body: "Grade IV rapids. 4,500-metre passes. Night treks through living root bridges. You're here for the moments that make your pulse reset. We build the logistics so you can focus on the edge.",
    image: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=900&q=85',
    tags: ['7–14 days', 'Active daily', 'High altitude'],
    cta: 'Choose your adventure',
  },
  {
    id: 'royal',
    pill: 'Royal Chronicler 🏰',
    color: T.amber,
    bg: 'rgba(200,83,26,0.10)',
    title: 'The Palace Route',
    subtitle: 'Jaipur · Udaipur · Jodhpur',
    body: "Private dawn entry to Amber Fort. Dinner in a haveli that's been in one family for eleven generations. The India of durbar halls and silk bazaars, without the tourist rush.",
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=900&q=85',
    tags: ['8–12 days', 'Heritage stays', 'Curated access'],
    cta: 'Explore the palaces',
  },
  {
    id: 'wild',
    pill: 'Wild Explorer 🐅',
    color: '#3A7D44',
    bg: 'rgba(58,125,68,0.12)',
    title: 'Into the Reserves',
    subtitle: 'Ranthambore · Kaziranga · Sundarbans',
    body: "Before breakfast, a tiger at 40 metres. By afternoon, a one-horned rhino in the grass. Evening: a fire, binoculars, silence. We know the park wardens, the naturalists, the best hides.",
    image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=900&q=85',
    tags: ['5–10 days', 'Expert guides', 'Dawn safaris'],
    cta: 'Enter the wild',
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// SEASON DATA
// ─────────────────────────────────────────────────────────────────────────────
const MONTHS_SHORT = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
const MONTHS_FULL = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const SEASON_DATA = [
  { region: 'Rajasthan & North Plains', icon: '🏰', color: T.amber, months: [2, 2, 2, 3, 4, 4, 4, 4, 3, 1, 1, 1] },
  { region: 'Kerala & South Coast', icon: '🌴', color: T.emerald, months: [1, 1, 2, 2, 3, 4, 4, 4, 3, 2, 1, 1] },
  { region: 'Ladakh & High Himalaya', icon: '🏔️', color: '#A14E3B', months: [4, 4, 4, 4, 3, 2, 1, 1, 2, 3, 4, 4] },
  { region: 'Northeast India', icon: '🌿', color: '#3A7D44', months: [2, 2, 1, 1, 2, 4, 4, 4, 3, 1, 1, 2] },
  { region: 'Andaman Islands', icon: '🐠', color: '#2D6E8E', months: [1, 1, 1, 1, 2, 4, 4, 4, 3, 2, 1, 1] },
]
const SEASON_COLORS: Record<number, { bg: string; label: string }> = {
  1: { bg: T.emerald, label: 'Peak' },
  2: { bg: T.amber, label: 'Good' },
  3: { bg: '#D9C7A3', label: 'Fair' },
  4: { bg: 'rgba(44,18,4,0.10)', label: 'Avoid' },
}

// ─────────────────────────────────────────────────────────────────────────────
// TRIP BUILDER DATA
// ─────────────────────────────────────────────────────────────────────────────
const VIBES = ['All Culture', 'Wildlife First', 'Beach & Backwaters', 'Himalayan Peaks', 'Spiritual Depth', 'Festival Season']
const BUDGETS = ['Budget Conscious', 'Mid-Range', 'Premium', 'Ultra Luxury']
const PACES = ['Slow & Deep', 'Balanced', 'Action-Packed']

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATED TRAVEL PATH — HERO SIGNATURE ELEMENT
// A bezier path across the hero; plane, train, bus animate along it
// ─────────────────────────────────────────────────────────────────────────────
function TravelPathAnimation() {
  // Three offset path descriptions for each vehicle
  const pathD = "M -60,80 C 80,20 180,140 320,60 C 460,-20 560,120 700,55 C 840,-10 920,110 1080,60"

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 2 }}>
      <svg
        viewBox="0 0 1080 160"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 220, opacity: 0.9 }}
      >
        {/* Dashed track line */}
        <path d={pathD} fill="none" stroke={T.saffron} strokeWidth="1.5"
          strokeDasharray="6 10" opacity="0.35" />

        {/* ── AIRPLANE ── */}
        <motion.g
          style={{ transformOrigin: 'center' }}
          initial={{ offsetDistance: '0%' }}
          animate={{ offsetDistance: '100%' }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear', delay: 0 }}
        >
          <motion.path
            d={pathD}
            style={{
              offsetPath: `path('${pathD}')`,
              offsetRotate: 'auto',
            } as any}
          />
          <AnimatedVehicle pathD={pathD} delay={0} duration={10} color={T.saffron} type="plane" />
        </motion.g>

        {/* ── TRAIN ── */}
        <AnimatedVehicle pathD={pathD} delay={3.3} duration={10} color={T.emerald} type="train" />

        {/* ── BUS ── */}
        <AnimatedVehicle pathD={pathD} delay={6.6} duration={10} color={T.amber} type="bus" />
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
    const path = pathRef.current
    const dot = dotRef.current
    if (!path || !dot) return
    const length = path.getTotalLength()
    let start: number | null = null
    let raf: number

    const animate = (ts: number) => {
      if (!start) start = ts
      const elapsed = (ts - start) / 1000
      const progress = ((elapsed / duration + delay / duration) % 1)
      const point = path.getPointAtLength(progress * length)
      const tangentPoint = path.getPointAtLength(Math.min((progress + 0.01), 1) * length)
      const angle = Math.atan2(tangentPoint.y - point.y, tangentPoint.x - point.x) * 180 / Math.PI
      dot.setAttribute('transform', `translate(${point.x},${point.y}) rotate(${angle})`)
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [delay, duration])

  const size = type === 'plane' ? 22 : 18

  return (
    <>
      <path ref={pathRef} d={pathD} fill="none" stroke="none" />
      <g ref={dotRef}>
        {/* glow halo */}
        <circle r={size * 0.9} fill={color} opacity="0.12" />
        {type === 'plane' && (
          // ✈ airplane
          <g transform={`translate(-${size / 2},-${size / 2})`}>
            <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
              <path d="M21 16V14L13 9V3.5a1.5 1.5 0 0 0-3 0V9L2 14v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5L21 16z" />
            </svg>
          </g>
        )}
        {type === 'train' && (
          // 🚂 train
          <g>
            <rect x={-size / 2} y={-size * 0.35} width={size} height={size * 0.7} rx="3" fill={color} opacity="0.9" />
            <circle cx={-size * 0.3} cy={size * 0.35} r={3} fill={T.cream} />
            <circle cx={size * 0.3} cy={size * 0.35} r={3} fill={T.cream} />
            <rect x={-size * 0.38} y={-size * 0.28} width={size * 0.34} height={size * 0.3} rx="2" fill={T.cream} opacity="0.5" />
            <rect x={size * 0.04} y={-size * 0.28} width={size * 0.34} height={size * 0.3} rx="2" fill={T.cream} opacity="0.5" />
          </g>
        )}
        {type === 'bus' && (
          // 🚌 bus
          <g>
            <rect x={-size / 2} y={-size * 0.3} width={size} height={size * 0.65} rx="4" fill={color} opacity="0.9" />
            <circle cx={-size * 0.28} cy={size * 0.35} r={4} fill={T.cream} />
            <circle cx={size * 0.28} cy={size * 0.35} r={4} fill={T.cream} />
            {[-0.35, -0.1, 0.15, 0.35].map((x, i) => (
              <rect key={i} x={size * x - 4} y={-size * 0.22} width={7} height={size * 0.26} rx="1.5" fill={T.cream} opacity="0.55" />
            ))}
          </g>
        )}
      </g>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO SECTION
// ─────────────────────────────────────────────────────────────────────────────
function HeroSection() {
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)
  const sX = useSpring(mouseX, { stiffness: 22, damping: 18 })
  const sY = useSpring(mouseY, { stiffness: 22, damping: 18 })
  const pX = useTransform(sX, [0, 1], [-14, 14])
  const pY = useTransform(sY, [0, 1], [-8, 8])

  const handleMouse = useCallback((e: React.MouseEvent) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
    mouseX.set((e.clientX - r.left) / r.width)
    mouseY.set((e.clientY - r.top) / r.height)
  }, [mouseX, mouseY])

  return (
    <section
      onMouseMove={handleMouse}
      style={{
        position: 'relative', minHeight: '100vh',
        display: 'flex', alignItems: 'center',
        overflow: 'hidden',
        background: `linear-gradient(145deg, ${T.cream} 0%, ${T.mist} 45%, #F0E6CC 100%)`,
      }}
    >
      {/* Subtle warm grain texture overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(200,83,26,0.07) 1px, transparent 0)`,
        backgroundSize: '32px 32px', pointerEvents: 'none', zIndex: 1,
      }} />

      {/* Large ambient circle — terracotta */}
      <motion.div style={{
        x: pX, y: pY, position: 'absolute', right: '-8vw', top: '50%', translateY: '-50%',
        width: 'clamp(460px,46vw,700px)', height: 'clamp(460px,46vw,700px)',
        borderRadius: '50%', zIndex: 1, pointerEvents: 'none',
      }}>
        <div style={{
          width: '100%', height: '100%', borderRadius: '50%',
          background: `radial-gradient(circle, rgba(244,162,40,0.18) 0%, rgba(200,83,26,0.08) 50%, transparent 75%)`,
          border: `1px solid rgba(212,146,42,0.2)`,
        }} />
        {/* Inner rings */}
        {[0.72, 0.52, 0.34].map((s, i) => (
          <motion.div key={i}
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{ duration: 55 + i * 18, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute', inset: `${(1 - s) * 50}%`, borderRadius: '50%',
              border: `1px dashed rgba(200,83,26,${0.12 + i * 0.04})`,
            }} />
        ))}
        {/* Compass GiCompass SVG */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          fontSize: 'clamp(100px,14vw,200px)',
          color: T.saffron, opacity: 0.12,
        }}>
          <GiCompass />
        </div>
      </motion.div>

      {/* Tricolour stripe at very top */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, display: 'flex', zIndex: 10 }}>
        <div style={{ flex: 1, background: '#FF9933' }} />
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.9)' }} />
        <div style={{ flex: 1, background: '#138808' }} />
      </div>

      {/* Main copy */}
      <div style={{
        position: 'relative', zIndex: 5,
        width: '100%', maxWidth: 1360, margin: '0 auto',
        padding: '80px clamp(28px,6vw,96px) 140px',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}
        >
          <div style={{ width: 44, height: 2, background: T.amber, borderRadius: 2 }} />
          <span style={{
            fontFamily: '"Inter",sans-serif', fontSize: 11,
            letterSpacing: '0.45em', textTransform: 'uppercase',
            color: T.bronze, fontWeight: 700,
          }}>
            Pavilion · Curated Journeys Across India
          </span>
        </motion.div>

        <div style={{ overflow: 'hidden' }}>
          <motion.h1
            initial={{ y: '110%' }} animate={{ y: '0%' }}
            transition={{ duration: 0.9, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: '"Fraunces",serif', fontWeight: 500,
              fontSize: 'clamp(3rem,7.5vw,7.5rem)',
              lineHeight: 0.96, letterSpacing: '-0.02em',
              color: T.mahogany, margin: 0, maxWidth: 900,
            }}
          >
            Journey into the
          </motion.h1>
        </div>
        <div style={{ overflow: 'hidden' }}>
          <motion.h1
            initial={{ y: '110%' }} animate={{ y: '0%' }}
            transition={{ duration: 0.9, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: '"Fraunces",serif', fontWeight: 500,
              fontStyle: 'italic',
              fontSize: 'clamp(3rem,7.5vw,7.5rem)',
              lineHeight: 0.96, letterSpacing: '-0.02em',
              color: T.amber, margin: 0, maxWidth: 900,
            }}
          >
            soul of India.
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          style={{
            fontFamily: '"Inter",sans-serif',
            fontSize: 'clamp(15px,1.4vw,18px)',
            lineHeight: 1.8, color: `rgba(44,18,4,0.62)`,
            maxWidth: 480, margin: '28px 0 0',
          }}
        >
          Handcrafted itineraries built around local knowledge — not algorithms. Temples, tigers, high passes, sacred rivers. Every corner of this extraordinary country.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.68 }}
          style={{ display: 'flex', gap: 16, alignItems: 'center', marginTop: 44, flexWrap: 'wrap' }}
        >
          <Link to="/destinations" style={{
            background: T.emerald, color: T.cream,
            fontFamily: '"Inter",sans-serif', fontSize: 12,
            letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700,
            padding: '17px 38px', borderRadius: 2, textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: 10,
            boxShadow: `0 12px 32px rgba(10,92,62,0.28)`,
            transition: 'transform 0.25s ease, box-shadow 0.25s ease',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 18px 44px rgba(10,92,62,0.36)` }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 32px rgba(10,92,62,0.28)` }}
          >
            Explore Destinations <FiArrowRight size={14} />
          </Link>
          <Link to="/tours" style={{
            background: 'transparent', color: T.mahogany,
            fontFamily: '"Inter",sans-serif', fontSize: 12,
            letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600,
            padding: '17px 38px', borderRadius: 2, textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: 10,
            border: `1.5px solid rgba(44,18,4,0.22)`,
            transition: 'border-color 0.2s, color 0.2s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = T.amber; (e.currentTarget as HTMLElement).style.color = T.amber }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(44,18,4,0.22)'; (e.currentTarget as HTMLElement).style.color = T.mahogany }}
          >
            Browse Itineraries
          </Link>
        </motion.div>

        {/* Quick stats */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
          style={{ display: 'flex', gap: 44, marginTop: 60, flexWrap: 'wrap' }}
        >
          {[['28+', 'States covered'], ['500+', 'Curated tours'], ['4.9★', 'Avg rating']].map(([v, l]) => (
            <div key={l}>
              <p style={{ fontFamily: '"Fraunces",serif', fontSize: 28, color: T.mahogany, margin: 0, lineHeight: 1 }}>{v}</p>
              <p style={{ fontFamily: '"Inter",sans-serif', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: T.bronze, margin: '4px 0 0' }}>{l}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── ANIMATED TRAVEL PATH ── */}
      <TravelPathAnimation />

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
        style={{ position: 'absolute', bottom: 32, left: 'clamp(28px,6vw,96px)', zIndex: 6, display: 'flex', alignItems: 'center', gap: 10 }}
      >
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <FiArrowDown size={14} color={`rgba(44,18,4,0.4)`} />
        </motion.div>
        <span style={{ fontFamily: '"Inter",sans-serif', fontSize: 10, letterSpacing: '0.32em', textTransform: 'uppercase', color: `rgba(44,18,4,0.38)` }}>
          Scroll to explore
        </span>
      </motion.div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CHOOSE YOUR INDIA — Journey Explorer
// ─────────────────────────────────────────────────────────────────────────────
function JourneyExplorer() {
  const [active, setActive] = useState(0)
  const cur = JOURNEYS[active]

  return (
    <section style={{
      position: 'relative',
      background: `linear-gradient(180deg, ${T.cream} 0%, ${T.cream2} 100%)`,
      borderTop: `1px solid rgba(44,18,4,0.08)`,
    }}>
      <div style={{ maxWidth: 1360, margin: '0 auto', padding: '110px clamp(28px,6vw,96px)' }}>

        {/* Header */}
        <div style={{ marginBottom: 60, maxWidth: 640 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <div style={{ width: 40, height: 2, background: T.amber, borderRadius: 2 }} />
            <span style={{ fontFamily: '"Inter",sans-serif', fontSize: 11, letterSpacing: '0.4em', textTransform: 'uppercase', color: T.bronze, fontWeight: 700 }}>Four Ways to Travel</span>
          </div>
          <h2 style={{ fontFamily: '"Fraunces",serif', fontWeight: 500, fontSize: 'clamp(2.4rem,4.8vw,4.2rem)', lineHeight: 1.05, color: T.mahogany, margin: 0 }}>
            Choose your <span style={{ fontStyle: 'italic', color: T.amber }}>India</span>
          </h2>
          <p style={{ fontFamily: '"Inter",sans-serif', fontSize: 16, lineHeight: 1.8, color: `rgba(44,18,4,0.58)`, marginTop: 18 }}>
            Not one country but an entire continent of experiences. These are the four lenses Pavilion travels through.
          </p>
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', gap: 0, borderTop: `1px solid rgba(44,18,4,0.12)`, borderBottom: `1px solid rgba(44,18,4,0.12)`, flexWrap: 'wrap' }}>
          {JOURNEYS.map((j, i) => (
            <button key={j.id} onClick={() => setActive(i)} style={{
              flex: '1 1 160px', textAlign: 'left', padding: '22px 24px',
              background: active === i ? `${j.color}10` : 'transparent',
              border: 'none',
              borderRight: `1px solid rgba(44,18,4,0.1)`,
              borderBottom: active === i ? `3px solid ${j.color}` : '3px solid transparent',
              cursor: 'pointer', transition: 'background 0.3s',
            }}>
              <span style={{ fontFamily: '"Inter",sans-serif', fontSize: 10, letterSpacing: '0.2em', color: active === i ? j.color : `rgba(44,18,4,0.28)`, display: 'block', marginBottom: 6, fontWeight: 700 }}>{j.mark}</span>
              <span style={{ fontFamily: '"Fraunces",serif', fontSize: 22, color: active === i ? T.mahogany : `rgba(44,18,4,0.32)`, display: 'block', transition: 'color 0.3s', fontStyle: active === i ? 'italic' : 'normal' }}>{j.label}</span>
            </button>
          ))}
        </div>

        {/* Panel */}
        <AnimatePresence mode="wait">
          <motion.div key={active}
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}
          >
            {/* Text */}
            <div style={{ padding: '52px 56px 52px 0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h3 style={{ fontFamily: '"Fraunces",serif', fontStyle: 'italic', fontSize: 'clamp(1.7rem,2.7vw,2.6rem)', lineHeight: 1.18, color: T.mahogany, marginBottom: 18 }}>
                {cur.headline}
              </h3>
              <p style={{ fontFamily: '"Inter",sans-serif', fontSize: 16, lineHeight: 1.88, color: `rgba(44,18,4,0.6)`, marginBottom: 28 }}>
                {cur.body}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 38 }}>
                {cur.places.map(p => (
                  <span key={p} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    fontFamily: '"Inter",sans-serif', fontSize: 11, fontWeight: 500,
                    padding: '7px 14px', borderRadius: 100,
                    background: `${cur.color}12`, border: `1px solid ${cur.color}40`, color: cur.color,
                  }}>
                    <FiMapPin size={10} /> {p}
                  </span>
                ))}
              </div>
              <Link to="/destinations" style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                fontFamily: '"Inter",sans-serif', fontSize: 12,
                letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700,
                color: cur.color, textDecoration: 'none',
                borderBottom: `1.5px solid ${cur.color}`, paddingBottom: 3,
              }}>
                Explore this path <FiArrowRight size={12} />
              </Link>
            </div>

            {/* Image */}
            <div style={{ position: 'relative', overflow: 'hidden', minHeight: 440 }}>
              <motion.div key={cur.image}
                initial={{ scale: 1.07, opacity: 0.7 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                style={{ position: 'absolute', inset: 0, backgroundImage: `url(${cur.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg,${cur.color}1A 0%, transparent 55%)` }} />
              <div style={{ position: 'absolute', bottom: 24, right: 24, fontFamily: '"Fraunces",serif', fontStyle: 'italic', fontSize: 15, color: T.cream, background: 'rgba(44,18,4,0.48)', padding: '8px 18px', borderRadius: 2, backdropFilter: 'blur(6px)' }}>{cur.label}</div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// TRAVEL PERSONA FINDER — replaces "Handpicked Itineraries"
// ─────────────────────────────────────────────────────────────────────────────
function PersonaFinder() {
  const [active, setActive] = useState<string | null>(null)
  const cur = PERSONAS.find(p => p.id === active) ?? null

  return (
    <section style={{
      background: `linear-gradient(160deg, ${T.mahogany} 0%, #3D1A06 100%)`,
      padding: '120px clamp(28px,6vw,96px)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Warm texture */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(ellipse at 30% 50%, rgba(244,162,40,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(200,83,26,0.07) 0%, transparent 50%)`, pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1360, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            <div style={{ width: 32, height: 2, background: T.saffron, borderRadius: 2 }} />
            <span style={{ fontFamily: '"Inter",sans-serif', fontSize: 11, letterSpacing: '0.4em', textTransform: 'uppercase', color: `rgba(253,246,236,0.5)`, fontWeight: 600 }}>Mood-Based Journey Selector</span>
            <div style={{ width: 32, height: 2, background: T.saffron, borderRadius: 2 }} />
          </div>
          <h2 style={{ fontFamily: '"Fraunces",serif', fontWeight: 500, fontSize: 'clamp(2.4rem,4.8vw,4.2rem)', lineHeight: 1.05, color: T.cream, margin: 0 }}>
            Who are you <span style={{ fontStyle: 'italic', color: T.saffron }}>when you travel?</span>
          </h2>
          <p style={{ fontFamily: '"Inter",sans-serif', fontSize: 17, lineHeight: 1.8, color: `rgba(253,246,236,0.5)`, marginTop: 18, maxWidth: 520, margin: '18px auto 0' }}>
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
                fontFamily: '"Inter",sans-serif', fontSize: 14, fontWeight: 600,
                letterSpacing: '0.02em',
                background: active === p.id ? p.color : 'rgba(253,246,236,0.07)',
                border: `2px solid ${active === p.id ? p.color : 'rgba(253,246,236,0.16)'}`,
                color: active === p.id ? T.cream : `rgba(253,246,236,0.7)`,
                boxShadow: active === p.id ? `0 8px 32px ${p.color}44` : 'none',
                transition: 'all 0.28s ease',
              }}
            >
              {p.pill}
            </motion.button>
          ))}
        </div>

        {/* Persona showcase */}
        <AnimatePresence mode="wait">
          {cur ? (
            <motion.div key={cur.id}
              initial={{ opacity: 0, y: 28, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.97 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0,
                border: `1px solid ${cur.color}30`,
                borderRadius: 4, overflow: 'hidden',
                boxShadow: `0 32px 80px rgba(0,0,0,0.4), 0 0 0 1px ${cur.color}20`,
              }}
            >
              {/* Text panel */}
              <div style={{ background: `rgba(44,18,4,0.85)`, backdropFilter: 'blur(12px)', padding: '52px 52px 48px' }}>
                {/* Accent line */}
                <div style={{ width: 44, height: 3, background: cur.color, borderRadius: 2, marginBottom: 28 }} />
                <p style={{ fontFamily: '"Inter",sans-serif', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: cur.color, fontWeight: 700, margin: '0 0 10px' }}>
                  {cur.subtitle}
                </p>
                <h3 style={{ fontFamily: '"Fraunces",serif', fontWeight: 500, fontSize: 'clamp(1.9rem,3vw,2.9rem)', lineHeight: 1.1, color: T.cream, margin: '0 0 22px' }}>
                  {cur.title}
                </h3>
                <p style={{ fontFamily: '"Inter",sans-serif', fontSize: 16, lineHeight: 1.88, color: `rgba(253,246,236,0.64)`, margin: '0 0 32px' }}>
                  {cur.body}
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 40 }}>
                  {cur.tags.map(tag => (
                    <span key={tag} style={{
                      fontFamily: '"Inter",sans-serif', fontSize: 11, fontWeight: 600,
                      padding: '6px 14px', borderRadius: 100,
                      background: `${cur.color}18`, border: `1px solid ${cur.color}45`, color: cur.color,
                    }}>{tag}</span>
                  ))}
                </div>
                <Link to="/tours" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  background: cur.color, color: T.mahogany,
                  fontFamily: '"Inter",sans-serif', fontSize: 12,
                  letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700,
                  padding: '15px 30px', borderRadius: 2, textDecoration: 'none',
                  boxShadow: `0 8px 24px ${cur.color}45`,
                }}>
                  {cur.cta} <FiArrowRight size={13} />
                </Link>
              </div>

              {/* Image panel with micro-interaction */}
              <div style={{ position: 'relative', overflow: 'hidden', minHeight: 440 }}>
                <motion.div
                  initial={{ scale: 1.06 }} animate={{ scale: 1 }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  style={{ position: 'absolute', inset: 0, backgroundImage: `url(${cur.image})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.72) saturate(1.1)' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to right, ${cur.color}20 0%, transparent 50%)` }} />
                {/* floating persona tag */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  style={{
                    position: 'absolute', top: 28, right: 28,
                    background: 'rgba(44,18,4,0.6)', backdropFilter: 'blur(10px)',
                    border: `1px solid ${cur.color}40`, borderRadius: 3,
                    padding: '10px 18px',
                  }}
                >
                  <p style={{ fontFamily: '"Inter",sans-serif', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: cur.color, fontWeight: 700, margin: 0 }}>{cur.pill}</p>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ textAlign: 'center', padding: '60px 20px' }}
            >
              <p style={{ fontFamily: '"Fraunces",serif', fontStyle: 'italic', fontSize: 22, color: `rgba(253,246,236,0.3)` }}>
                Select a mood above to reveal your journey
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// TRIP BUILDER — interactive dashboard with calendar + preferences
// ─────────────────────────────────────────────────────────────────────────────
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
  const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const inRange = (d: number) => {
    if (!startDay || !endDay) return false
    const lo = Math.min(startDay, endDay)
    const hi = Math.max(startDay, endDay)
    return d > lo && d < hi
  }
  const isStart = (d: number) => d === startDay
  const isEnd = (d: number) => d === endDay

  const handleDayClick = (d: number) => {
    if (!startDay || (startDay && endDay)) { setStartDay(d); setEndDay(null) }
    else { d < startDay ? (setEndDay(startDay), setStartDay(d)) : setEndDay(d) }
  }

  const duration = startDay && endDay ? Math.abs(endDay - startDay) + 1 : null
  const ready = startDay && endDay && selVibe && selBudget && selPace

  return (
    <section style={{
      background: `linear-gradient(170deg, ${T.cream2} 0%, ${T.mist} 100%)`,
      padding: '120px clamp(28px,6vw,96px)',
      borderTop: `1px solid rgba(44,18,4,0.08)`,
    }}>
      <div style={{ maxWidth: 1360, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, marginBottom: 56 }}>
          <div style={{ maxWidth: 560 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
              <div style={{ width: 40, height: 2, background: T.emerald, borderRadius: 2 }} />
              <span style={{ fontFamily: '"Inter",sans-serif', fontSize: 11, letterSpacing: '0.4em', textTransform: 'uppercase', color: T.bronze, fontWeight: 700 }}>Plan Your Trip</span>
            </div>
            <h2 style={{ fontFamily: '"Fraunces",serif', fontWeight: 500, fontSize: 'clamp(2.3rem,4.5vw,4rem)', lineHeight: 1.06, color: T.mahogany, margin: 0 }}>
              Build your <span style={{ fontStyle: 'italic', color: T.emerald }}>India itinerary</span>
            </h2>
          </div>
          {ready && !submitted && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontFamily: '"Inter",sans-serif', fontSize: 13, color: T.emerald, fontWeight: 600 }}>
              ✓ {duration} days · {selVibe} · {selBudget} · {selPace}
            </motion.p>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>

          {/* ── LEFT: MINI CALENDAR ── */}
          <div style={{
            background: '#FFFFFF', borderRadius: 4,
            border: `1px solid rgba(44,18,4,0.1)`,
            boxShadow: '0 4px 24px rgba(44,18,4,0.07)',
            overflow: 'hidden',
          }}>
            {/* Calendar header */}
            <div style={{ background: T.emerald, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button onClick={() => { const d = new Date(calYear, calMonth - 1); setCalYear(d.getFullYear()); setCalMonth(d.getMonth()); setStartDay(null); setEndDay(null) }}
                style={{ background: 'none', border: `1px solid rgba(253,246,236,0.3)`, borderRadius: 2, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: T.cream }}>
                <FiChevronLeft size={14} />
              </button>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: '"Fraunces",serif', fontSize: 18, color: T.cream, margin: 0 }}>{MONTH_NAMES[calMonth]}</p>
                <p style={{ fontFamily: '"Inter",sans-serif', fontSize: 11, letterSpacing: '0.15em', color: 'rgba(253,246,236,0.6)', margin: '2px 0 0', fontWeight: 600 }}>{calYear}</p>
              </div>
              <button onClick={() => { const d = new Date(calYear, calMonth + 1); setCalYear(d.getFullYear()); setCalMonth(d.getMonth()); setStartDay(null); setEndDay(null) }}
                style={{ background: 'none', border: `1px solid rgba(253,246,236,0.3)`, borderRadius: 2, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: T.cream }}>
                <FiChevronRight size={14} />
              </button>
            </div>

            <div style={{ padding: '20px 22px 24px' }}>
              {/* Day headers */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2, marginBottom: 8 }}>
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                  <div key={d} style={{ textAlign: 'center', fontFamily: '"Inter",sans-serif', fontSize: 10, letterSpacing: '0.08em', fontWeight: 700, color: `rgba(44,18,4,0.35)`, padding: '4px 0' }}>{d}</div>
                ))}
              </div>
              {/* Day cells */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3 }}>
                {Array.from({ length: firstDow }).map((_, i) => <div key={`e${i}`} />)}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
                  const start = isStart(d)
                  const end = isEnd(d)
                  const range = inRange(d)
                  const isPast = new Date(calYear, calMonth, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate())
                  return (
                    <motion.button key={d}
                      whileHover={!isPast ? { scale: 1.12 } : {}}
                      whileTap={!isPast ? { scale: 0.95 } : {}}
                      onClick={() => !isPast && handleDayClick(d)}
                      style={{
                        aspectRatio: '1', borderRadius: 4,
                        border: 'none', cursor: isPast ? 'not-allowed' : 'pointer',
                        fontFamily: '"Inter",sans-serif', fontSize: 12, fontWeight: 600,
                        background: start || end ? T.emerald : range ? `${T.emerald}18` : 'transparent',
                        color: start || end ? T.cream : isPast ? 'rgba(44,18,4,0.2)' : T.mahogany,
                        outline: range ? `1px solid ${T.emerald}30` : 'none',
                        transition: 'all 0.18s',
                      }}
                    >{d}</motion.button>
                  )
                })}
              </div>

              {/* Duration badge */}
              <AnimatePresence>
                {duration && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    style={{ marginTop: 20, padding: '13px 18px', background: `${T.saffron}15`, border: `1px solid ${T.saffron}40`, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <FiCalendar size={14} color={T.amber} />
                    <span style={{ fontFamily: '"Inter",sans-serif', fontSize: 13, fontWeight: 600, color: T.amber }}>
                      {duration} {duration === 1 ? 'day' : 'days'} selected
                    </span>
                    <button onClick={() => { setStartDay(null); setEndDay(null) }}
                      style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontFamily: '"Inter",sans-serif', fontSize: 11, color: `rgba(44,18,4,0.35)`, textDecoration: 'underline' }}>
                      Clear
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ── RIGHT: PREFERENCE FILTERS ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Vibe filter */}
            <FilterGroup
              label="Travel Vibe"
              options={VIBES}
              selected={selVibe}
              onSelect={setSelVibe}
              color={T.amber}
            />

            {/* Budget filter */}
            <FilterGroup
              label="Budget Range"
              options={BUDGETS}
              selected={selBudget}
              onSelect={setSelBudget}
              color={T.emerald}
            />

            {/* Pace filter */}
            <FilterGroup
              label="Travel Pace"
              options={PACES}
              selected={selPace}
              onSelect={setSelPace}
              color={T.bronze}
            />

            {/* CTA */}
            <AnimatePresence>
              {!submitted ? (
                <motion.button
                  key="cta"
                  onClick={() => ready && setSubmitted(true)}
                  whileHover={ready ? { y: -2 } : {}}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  style={{
                    padding: '18px', borderRadius: 2, border: 'none', cursor: ready ? 'pointer' : 'not-allowed',
                    fontFamily: '"Inter",sans-serif', fontSize: 13,
                    letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700,
                    background: ready
                      ? `linear-gradient(135deg, ${T.emerald}, #0D7A52)`
                      : `rgba(44,18,4,0.08)`,
                    color: ready ? T.cream : `rgba(44,18,4,0.3)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                    transition: 'all 0.3s',
                    boxShadow: ready ? `0 12px 32px rgba(10,92,62,0.28)` : 'none',
                  }}
                >
                  {ready ? <><FiArrowRight size={16} /> Get My Itinerary</> : 'Complete all preferences above'}
                </motion.button>
              ) : (
                <motion.div key="success"
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  style={{ padding: '24px', borderRadius: 3, background: `${T.emerald}12`, border: `1px solid ${T.emerald}30`, textAlign: 'center' }}
                >
                  <p style={{ fontFamily: '"Fraunces",serif', fontSize: 20, color: T.emerald, margin: '0 0 8px', fontStyle: 'italic' }}>Your preferences are saved!</p>
                  <p style={{ fontFamily: '"Inter",sans-serif', fontSize: 13, color: `rgba(44,18,4,0.55)`, margin: '0 0 16px' }}>Our travel curators will reach out within 24 hours.</p>
                  <Link to="/contact" style={{ fontFamily: '"Inter",sans-serif', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700, color: T.emerald, textDecoration: 'none', borderBottom: `1.5px solid ${T.emerald}`, paddingBottom: 2 }}>
                    Talk to a human instead →
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
    <div style={{ background: '#FFFFFF', borderRadius: 4, border: `1px solid rgba(44,18,4,0.1)`, padding: '24px', boxShadow: '0 2px 12px rgba(44,18,4,0.05)' }}>
      <p style={{ fontFamily: '"Inter",sans-serif', fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', color: T.bronze, fontWeight: 700, margin: '0 0 14px' }}>{label}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {options.map(opt => (
          <motion.button key={opt}
            onClick={() => onSelect(selected === opt ? null : opt)}
            whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
            style={{
              padding: '9px 16px', borderRadius: 100, cursor: 'pointer',
              fontFamily: '"Inter",sans-serif', fontSize: 12, fontWeight: 500,
              background: selected === opt ? color : 'transparent',
              border: `1.5px solid ${selected === opt ? color : 'rgba(44,18,4,0.16)'}`,
              color: selected === opt ? T.cream : T.mahogany,
              transition: 'all 0.22s',
              boxShadow: selected === opt ? `0 4px 16px ${color}30` : 'none',
            }}
          >{opt}</motion.button>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SEASON HEATMAP — Best Time to Visit
// ─────────────────────────────────────────────────────────────────────────────
function SeasonHeatmap() {
  const [activeMonth, setActiveMonth] = useState<number | null>(null)
  const peakNow = activeMonth !== null ? SEASON_DATA.filter(r => r.months[activeMonth] === 1).map(r => r.region) : []
  const goodNow = activeMonth !== null ? SEASON_DATA.filter(r => r.months[activeMonth] === 2).map(r => r.region) : []

  return (
    <section style={{ background: `linear-gradient(180deg, ${T.cream} 0%, #EDE0C4 100%)`, padding: '120px clamp(28px,6vw,96px)', borderTop: `1px solid rgba(44,18,4,0.08)` }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 52 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <div style={{ width: 40, height: 2, background: T.saffron, borderRadius: 2 }} />
            <span style={{ fontFamily: '"Inter",sans-serif', fontSize: 11, letterSpacing: '0.4em', textTransform: 'uppercase', color: T.bronze, fontWeight: 700 }}>Season Guide</span>
          </div>
          <h2 style={{ fontFamily: '"Fraunces",serif', fontWeight: 500, fontSize: 'clamp(2.3rem,4.5vw,4rem)', lineHeight: 1.06, color: T.mahogany, margin: 0 }}>
            When to come, <span style={{ fontStyle: 'italic', color: T.amber }}>where to go</span>
          </h2>
          <p style={{ fontFamily: '"Inter",sans-serif', fontSize: 16, color: `rgba(44,18,4,0.58)`, lineHeight: 1.8, marginTop: 18, maxWidth: 520 }}>
            India's geography means every month is perfect somewhere. Tap any month to discover what's open.
          </p>
        </div>

        {/* Month pills */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 28, flexWrap: 'wrap' }}>
          {MONTHS_FULL.map((m, i) => {
            const isActive = activeMonth === i
            const peakCount = SEASON_DATA.filter(r => r.months[i] === 1).length
            return (
              <motion.button key={m}
                onClick={() => setActiveMonth(isActive ? null : i)}
                whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}
                style={{
                  position: 'relative', padding: '10px 18px', borderRadius: 2, cursor: 'pointer',
                  fontFamily: '"Inter",sans-serif', fontSize: 11, fontWeight: isActive ? 700 : 400,
                  background: isActive ? T.amber : '#FDFBF7',
                  border: `1px solid ${isActive ? T.amber : 'rgba(44,18,4,0.14)'}`,
                  color: isActive ? T.cream : T.mahogany,
                  transition: 'all 0.2s',
                }}
              >
                {m}
                {peakCount > 0 && (
                  <span style={{
                    position: 'absolute', top: -7, right: -7,
                    width: 16, height: 16, background: T.emerald, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: '"Inter",sans-serif', fontSize: 8, color: T.cream, fontWeight: 700,
                  }}>{peakCount}</span>
                )}
              </motion.button>
            )
          })}
          {activeMonth !== null && (
            <button onClick={() => setActiveMonth(null)} style={{ padding: '10px 14px', borderRadius: 2, fontFamily: '"Inter",sans-serif', fontSize: 10, background: 'transparent', border: `1px solid rgba(44,18,4,0.16)`, color: `rgba(44,18,4,0.42)`, cursor: 'pointer' }}>Clear</button>
          )}
        </div>

        {/* Highlight bar */}
        <AnimatePresence>
          {activeMonth !== null && (
            <motion.div key={activeMonth}
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ marginBottom: 28, padding: '18px 24px', background: '#FDFBF7', border: `1px solid ${T.amber}40`, borderRadius: 4, display: 'flex', gap: 36, flexWrap: 'wrap' }}
            >
              <div>
                <p style={{ fontFamily: '"Inter",sans-serif', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: `rgba(44,18,4,0.38)`, margin: '0 0 4px' }}>Peak in {MONTHS_FULL[activeMonth]}</p>
                <p style={{ fontFamily: '"Fraunces",serif', fontSize: 19, color: T.emerald, margin: 0, fontStyle: 'italic' }}>{peakNow.length > 0 ? peakNow.join(' · ') : 'No peak regions this month'}</p>
              </div>
              {goodNow.length > 0 && (
                <div>
                  <p style={{ fontFamily: '"Inter",sans-serif', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: `rgba(44,18,4,0.38)`, margin: '0 0 4px' }}>Also good</p>
                  <p style={{ fontFamily: '"Fraunces",serif', fontSize: 17, color: T.amber, margin: 0, fontStyle: 'italic' }}>{goodNow.join(' · ')}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Heatmap grid */}
        <div style={{ overflowX: 'auto', marginBottom: 32 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
            <thead>
              <tr>
                <th style={{ fontFamily: '"Inter",sans-serif', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: `rgba(44,18,4,0.38)`, textAlign: 'left', padding: '0 14px 18px 0', fontWeight: 500, width: 210 }}>Region</th>
                {MONTHS_SHORT.map((m, i) => (
                  <th key={m} onClick={() => setActiveMonth(activeMonth === i ? null : i)} style={{ fontFamily: '"Inter",sans-serif', fontSize: 11, color: activeMonth === i ? T.amber : `rgba(44,18,4,0.5)`, padding: '0 0 18px', textAlign: 'center', fontWeight: activeMonth === i ? 700 : 400, cursor: 'pointer', width: 44 }}>{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SEASON_DATA.map(row => (
                <tr key={row.region} style={{ borderTop: `1px solid rgba(44,18,4,0.07)` }}>
                  <td style={{ padding: '10px 14px 10px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <span style={{ fontSize: 16 }}>{row.icon}</span>
                      <p style={{ fontFamily: '"Inter",sans-serif', fontSize: 12, color: T.mahogany, margin: 0 }}>{row.region}</p>
                    </div>
                  </td>
                  {row.months.map((rating, mi) => {
                    const sc = SEASON_COLORS[rating as keyof typeof SEASON_COLORS]
                    return (
                      <td key={mi} style={{ padding: '10px 3px', textAlign: 'center' }}>
                        <motion.div whileHover={{ scale: 1.2 }}
                          title={`${row.region} in ${MONTHS_FULL[mi]}: ${sc.label}`}
                          style={{ width: 28, height: 28, borderRadius: 4, margin: '0 auto', background: sc.bg, border: activeMonth === mi ? `2px solid rgba(44,18,4,0.4)` : '2px solid transparent', transition: 'border 0.2s', cursor: 'default' }}
                        />
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: '"Inter",sans-serif', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: `rgba(44,18,4,0.38)` }}>Legend</span>
          {Object.entries(SEASON_COLORS).map(([, v]) => (
            <div key={v.label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 14, height: 14, borderRadius: 3, background: v.bg, border: `1px solid rgba(44,18,4,0.12)` }} />
              <span style={{ fontFamily: '"Inter",sans-serif', fontSize: 11.5, color: `rgba(44,18,4,0.55)` }}>{v.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// FINAL CTA
// ─────────────────────────────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section style={{
      position: 'relative', padding: '130px clamp(28px,6vw,96px)',
      background: T.mahogany, overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1600&q=80')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.1 }} />
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 40%, ${T.amber}14 0%, transparent 65%)` }} />
      {/* Tricolour strip */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, display: 'flex' }}>
        <div style={{ flex: 1, background: '#FF9933' }} />
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.85)' }} />
        <div style={{ flex: 1, background: '#138808' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <GiCompass style={{ color: T.saffron, fontSize: 38, marginBottom: 24 }} />
          <h2 style={{ fontFamily: '"Fraunces",serif', fontWeight: 500, fontSize: 'clamp(2.5rem,5.5vw,4.8rem)', lineHeight: 1.07, color: T.cream, margin: '0 0 22px' }}>
            Come and see it <span style={{ fontStyle: 'italic', color: T.saffron }}>for yourself.</span>
          </h2>
          <p style={{ fontFamily: '"Inter",sans-serif', fontSize: 17, lineHeight: 1.85, color: `rgba(253,246,236,0.58)`, maxWidth: 500, margin: '0 auto 48px' }}>
            Tell us how you travel and we'll build an itinerary around it — real places, honest pacing, guides who've spent their whole lives in that single valley.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/destinations" style={{
              background: T.emerald, color: T.cream,
              fontFamily: '"Inter",sans-serif', fontSize: 12,
              letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700,
              padding: '18px 40px', borderRadius: 2, textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 12,
              boxShadow: `0 12px 32px rgba(10,92,62,0.36)`,
              transition: 'transform 0.25s ease',
            }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = ''}
            >
              Explore Destinations <FiArrowRight size={14} />
            </Link>
            <Link to="/contact" style={{
              border: `1.5px solid rgba(253,246,236,0.25)`, color: `rgba(253,246,236,0.7)`,
              fontFamily: '"Inter",sans-serif', fontSize: 12,
              letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600,
              padding: '18px 40px', borderRadius: 2, textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 12,
              transition: 'border-color 0.25s, color 0.25s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = T.saffron; (e.currentTarget as HTMLElement).style.color = T.saffron }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(253,246,236,0.25)'; (e.currentTarget as HTMLElement).style.color = 'rgba(253,246,236,0.7)' }}
            >
              Plan a custom trip
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{
      background: T.mist, borderTop: `1px solid rgba(44,18,4,0.1)`,
      padding: '56px clamp(28px,6vw,96px)', textAlign: 'center',
    }}>
      <p style={{ fontFamily: '"Fraunces",serif', fontStyle: 'italic', fontSize: 24, color: T.mahogany, margin: '0 0 14px' }}>Pavilion</p>
      <a href="mailto:explore@pavilion.in" style={{ fontFamily: '"Inter",sans-serif', fontSize: 13, letterSpacing: '0.06em', color: T.bronze, textDecoration: 'none', borderBottom: `1px solid rgba(139,94,42,0.4)`, paddingBottom: 2 }}>
        explore@pavilion.in
      </a>
      <p style={{ fontFamily: '"Inter",sans-serif', fontSize: 11, color: `rgba(44,18,4,0.38)`, margin: '22px 0 0', letterSpacing: '0.03em' }}>
        © {new Date().getFullYear()} Pavilion. A travel journal of India. 🇮🇳
      </p>
    </footer>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────
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

  // Stable reference — only recomputes when featuredTours changes
  const toursToShow = useMemo(
    () => featuredTours.length > 0 ? featuredTours : MOCK_TOURS,
    [featuredTours]
  )

  return (
    <div style={{ minHeight: '100vh', background: T.cream, color: T.mahogany, fontFamily: '"Inter",sans-serif', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,480;0,9..144,560;1,9..144,400;1,9..144,480&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        *,*::before,*::after { box-sizing:border-box; }
        body { overflow-x:hidden; background:${T.cream}; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:${T.cream}; }
        ::-webkit-scrollbar-thumb { background:rgba(200,83,26,0.35); border-radius:2px; }
        button:focus-visible, a:focus-visible { outline:2px solid ${T.amber}; outline-offset:3px; }
        @media (prefers-reduced-motion: reduce) {
          *{animation-duration:0.01ms!important;animation-iteration-count:1!important;transition-duration:0.01ms!important;}
        }
      `}</style>

      <HeroSection />
      <JourneyExplorer />
      <PersonaFinder />
      <TripBuilder />
      <SeasonHeatmap />
      <FinalCTA />
      <Footer />
    </div>
  )
}