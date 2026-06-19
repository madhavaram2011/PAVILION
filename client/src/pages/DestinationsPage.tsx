import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'

// ── DATA ─────────────────────────────────────────────────────────────────────
const REGIONS = [
  {
    id: 'All', icon: '🇮🇳', color: '#c9a96e', glow: '#a97c3f',
    label: 'All India', short: 'All',
  },
  {
    id: 'North India', icon: '🏔️', color: '#38bdf8', glow: '#0ea5e9',
    label: 'North India', short: 'North',
    tagline: 'Where the Himalayas touch the sky',
    landmarks: ['Taj Mahal', 'Varanasi Ghats', 'Jaisalmer Fort', 'Jim Corbett'],
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=85',
    stats: { tours: 12, rating: '4.8', best: 'Oct–Mar' },
    desc: 'Golden forts rising from desert sands, ancient ghats where pilgrims bathe at dawn, and the crown jewel of the Mughal empire.',
    destCount: 12,
  },
  {
    id: 'South India', icon: '🌴', color: '#34d399', glow: '#10b981',
    label: 'South India', short: 'South',
    tagline: 'Dravidian temples & emerald backwaters',
    landmarks: ['Kerala Backwaters', 'Hampi Ruins', 'Meenakshi Temple', 'Nilgiri Hills'],
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=85',
    stats: { tours: 10, rating: '4.9', best: 'Nov–Feb' },
    desc: 'Gliding through palm-fringed backwaters on a houseboat, ancient gopurams rising against sunset, spice gardens perfuming the mountain air.',
    destCount: 10,
  },
  {
    id: 'West India', icon: '🏖️', color: '#fb923c', glow: '#f97316',
    label: 'West India', short: 'West',
    tagline: 'Beaches, caves & the city of dreams',
    landmarks: ['Goa Beaches', 'Ajanta & Ellora', 'Rann of Kutch', 'Mumbai'],
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=85',
    stats: { tours: 8, rating: '4.7', best: 'Nov–Mar' },
    desc: 'Portuguese forts overlooking turquoise Arabian Sea, ancient Buddhist caves carved into basalt cliffs, the salt desert glowing white under a full moon.',
    destCount: 8,
  },
  {
    id: 'East India', icon: '🐯', color: '#f472b6', glow: '#ec4899',
    label: 'East India', short: 'East',
    tagline: 'Tea gardens, temples & untamed wild',
    landmarks: ['Darjeeling', 'Sundarbans', 'Konark Sun Temple', 'Puri Beach'],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85',
    stats: { tours: 7, rating: '4.6', best: 'Sep–Mar' },
    desc: "Sunrise over Kanchenjunga from Darjeeling's tea estates, royal Bengal tigers prowling mangrove islands, the 13th-century Sun Temple at the Bay of Bengal.",
    destCount: 7,
  },
  {
    id: 'Northeast India', icon: '🌿', color: '#a78bfa', glow: '#8b5cf6',
    label: 'North-East', short: 'NE',
    tagline: 'Last wilderness of the subcontinent',
    landmarks: ['Living Root Bridges', 'Kaziranga', 'Tawang Monastery', 'Loktak Lake'],
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=85',
    stats: { tours: 6, rating: '4.8', best: 'Oct–Apr' },
    desc: 'Ancient living bridges woven from rubber tree roots, one-horned rhinos in misty grasslands, Tibetan monasteries perched on Himalayan ridges.',
    destCount: 6,
  },
  {
    id: 'Central India', icon: '🦁', color: '#fbbf24', glow: '#f59e0b',
    label: 'Central India', short: 'Central',
    tagline: 'Tiger country & ancient temple art',
    landmarks: ['Khajuraho', 'Bandhavgarh', 'Kanha', 'Sanchi Stupa'],
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=85',
    stats: { tours: 6, rating: '4.7', best: 'Oct–Jun' },
    desc: "Erotic temple carvings at Khajuraho speak of a civilisation at peace with itself, and some of India's finest tiger reserves deep in Sal forest.",
    destCount: 6,
  },
  {
    id: 'Islands', icon: '🐠', color: '#22d3ee', glow: '#06b6d4',
    label: 'Islands', short: 'Islands',
    tagline: 'Coral kingdoms & turquoise infinity',
    landmarks: ['Radhanagar Beach', 'Neil Island', 'Havelock', 'Lakshadweep'],
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=85',
    stats: { tours: 5, rating: '4.9', best: 'Oct–May' },
    desc: "Asia's finest beach at Radhanagar, coral gardens teeming with life, bioluminescent plankton lighting the surf, absolute isolation from the world.",
    destCount: 5,
  },
]

const DESTINATIONS = [
  { name: 'Taj Mahal', region: 'North India', type: 'Cultural', rating: 4.9 },
  { name: 'Varanasi', region: 'North India', type: 'Spiritual', rating: 4.8 },
  { name: 'Jaisalmer', region: 'North India', type: 'Desert', rating: 4.7 },
  { name: 'Rishikesh', region: 'North India', type: 'Adventure', rating: 4.6 },
  { name: 'Jim Corbett', region: 'North India', type: 'Wildlife', rating: 4.7 },
  { name: 'Shimla', region: 'North India', type: 'Mountain', rating: 4.5 },
  { name: 'Amritsar', region: 'North India', type: 'Spiritual', rating: 4.8 },
  { name: 'Ladakh', region: 'North India', type: 'Adventure', rating: 4.9 },
  { name: 'Agra', region: 'North India', type: 'Cultural', rating: 4.7 },
  { name: 'Nainital', region: 'North India', type: 'Mountain', rating: 4.5 },
  { name: 'Mathura', region: 'North India', type: 'Spiritual', rating: 4.4 },
  { name: 'Mussoorie', region: 'North India', type: 'Mountain', rating: 4.5 },
  { name: 'Kerala Backwaters', region: 'South India', type: 'Beach', rating: 4.9 },
  { name: 'Hampi', region: 'South India', type: 'Cultural', rating: 4.8 },
  { name: 'Meenakshi Temple', region: 'South India', type: 'Spiritual', rating: 4.7 },
  { name: 'Munnar', region: 'South India', type: 'Mountain', rating: 4.8 },
  { name: 'Coorg', region: 'South India', type: 'Mountain', rating: 4.6 },
  { name: 'Mysore', region: 'South India', type: 'Cultural', rating: 4.7 },
  { name: 'Ooty', region: 'South India', type: 'Mountain', rating: 4.5 },
  { name: 'Pondicherry', region: 'South India', type: 'Beach', rating: 4.6 },
  { name: 'Mahabalipuram', region: 'South India', type: 'Cultural', rating: 4.7 },
  { name: 'Alleppey', region: 'South India', type: 'Beach', rating: 4.8 },
  { name: 'Goa', region: 'West India', type: 'Beach', rating: 4.8 },
  { name: 'Ajanta Caves', region: 'West India', type: 'Cultural', rating: 4.7 },
  { name: 'Rann of Kutch', region: 'West India', type: 'Desert', rating: 4.9 },
  { name: 'Mumbai', region: 'West India', type: 'Cultural', rating: 4.5 },
  { name: 'Ellora Caves', region: 'West India', type: 'Cultural', rating: 4.7 },
  { name: 'Udaipur', region: 'West India', type: 'Cultural', rating: 4.8 },
  { name: 'Jodhpur', region: 'West India', type: 'Cultural', rating: 4.7 },
  { name: 'Mount Abu', region: 'West India', type: 'Mountain', rating: 4.4 },
  { name: 'Darjeeling', region: 'East India', type: 'Mountain', rating: 4.8 },
  { name: 'Sundarbans', region: 'East India', type: 'Wildlife', rating: 4.7 },
  { name: 'Konark', region: 'East India', type: 'Cultural', rating: 4.8 },
  { name: 'Puri', region: 'East India', type: 'Beach', rating: 4.5 },
  { name: 'Kolkata', region: 'East India', type: 'Cultural', rating: 4.6 },
  { name: 'Gangtok', region: 'East India', type: 'Mountain', rating: 4.7 },
  { name: 'Kalimpong', region: 'East India', type: 'Mountain', rating: 4.5 },
  { name: 'Kaziranga', region: 'Northeast India', type: 'Wildlife', rating: 4.9 },
  { name: 'Tawang', region: 'Northeast India', type: 'Spiritual', rating: 4.8 },
  { name: 'Cherrapunji', region: 'Northeast India', type: 'Adventure', rating: 4.7 },
  { name: 'Ziro Valley', region: 'Northeast India', type: 'Cultural', rating: 4.6 },
  { name: 'Majuli Island', region: 'Northeast India', type: 'Cultural', rating: 4.7 },
  { name: 'Dzukou Valley', region: 'Northeast India', type: 'Adventure', rating: 4.8 },
  { name: 'Khajuraho', region: 'Central India', type: 'Cultural', rating: 4.8 },
  { name: 'Bandhavgarh', region: 'Central India', type: 'Wildlife', rating: 4.9 },
  { name: 'Kanha', region: 'Central India', type: 'Wildlife', rating: 4.8 },
  { name: 'Sanchi', region: 'Central India', type: 'Spiritual', rating: 4.6 },
  { name: 'Pench', region: 'Central India', type: 'Wildlife', rating: 4.7 },
  { name: 'Orchha', region: 'Central India', type: 'Cultural', rating: 4.6 },
  { name: 'Havelock Island', region: 'Islands', type: 'Beach', rating: 4.9 },
  { name: 'Neil Island', region: 'Islands', type: 'Beach', rating: 4.8 },
  { name: 'Lakshadweep', region: 'Islands', type: 'Beach', rating: 4.9 },
  { name: 'Radhanagar Beach', region: 'Islands', type: 'Beach', rating: 4.9 },
  { name: 'Ross Island', region: 'Islands', type: 'Cultural', rating: 4.5 },
]

const CATEGORIES = ['All', 'Beach', 'Mountain', 'Desert', 'Wildlife', 'Cultural', 'Adventure', 'Spiritual']

// FIX: Added 'Northeast India' → 'Northeast India' mapping (was missing, broke NE filter)
const REGION_NAME_MAP: Record<string, string> = {
  North: 'North India',
  South: 'South India',
  East: 'East India',
  West: 'West India',
  Northeast: 'Northeast India',
  'Northeast India': 'Northeast India',
  Central: 'Central India',
  Islands: 'Islands',
  'North India': 'North India',
  'South India': 'South India',
  'East India': 'East India',
  'West India': 'West India',
  'Central India': 'Central India',
}

const normalizeRegion = (region: string) => REGION_NAME_MAP[region] ?? region

// ── STAR FIELD HOOK ──────────────────────────────────────────────────────────
function useStarField(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let raf: number

    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.2,
      op: Math.random() * 0.6 + 0.08,
      speed: Math.random() * 0.4 + 0.04,
      phase: Math.random() * Math.PI * 2,
    }))

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    let t = 0
    let lastTime = 0
    const draw = (timestamp: number) => {
      // Throttle to ~30fps to reduce CPU usage across 145+ cards
      if (timestamp - lastTime < 33) { raf = requestAnimationFrame(draw); return }
      lastTime = timestamp
      t += 0.008
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      stars.forEach(s => {
        const flicker = s.op * (0.55 + 0.45 * Math.sin(t * s.speed + s.phase))
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${flicker})`
        ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [canvasRef])
}

// ── TYPE ICONS ────────────────────────────────────────────────────────────────
const TYPE_ICON: Record<string, string> = {
  Beach: '🏖️', Mountain: '⛰️', Desert: '🏜️', Wildlife: '🐾',
  Cultural: '🏛️', Adventure: '🧗', Spiritual: '🕌', Default: '✦',
}

// ── POSTCARD CARD ─────────────────────────────────────────────────────────────
// FIX: Added explicit prop types — previously onMapClick was passed but not in the type signature
interface DestCardProps {
  dest: typeof DESTINATIONS[0]
  index: number
}

function DestCard({ dest, index }: DestCardProps) {
  const [hovered, setHovered] = useState(false)
  const reg = REGIONS.find(r => r.id === dest.region) ?? REGIONS[1]
  const typeIcon = TYPE_ICON[dest.type] ?? TYPE_ICON.Default

  const openGoogleMaps = useCallback(() => {
    const query = encodeURIComponent(`${dest.name}, India`)
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${query}`,
      '_blank',
      'noopener,noreferrer'
    )
  }, [dest.name])

  return (
    <div
      className="postcard-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        // FIX: Moved gradient to a CSS class via inline style only — no stale-closure
        // hovered/non-hovered backgrounds are toggled purely via the state variable
        background: hovered
          ? 'linear-gradient(145deg, #fdf8f0 0%, #faf3e8 60%, #f5ece0 100%)'
          : 'linear-gradient(145deg, #faf5ed 0%, #f7f0e5 60%, #f2ead8 100%)',
        border: `1px solid ${hovered ? reg.color + 'aa' : 'rgba(201,169,110,0.28)'}`,
        borderRadius: 4,
        padding: 0,
        cursor: 'default',
        overflow: 'hidden',
        transition: 'all 0.32s cubic-bezier(0.22, 1, 0.36, 1)',
        transform: hovered ? 'translateY(-6px) rotate(-0.4deg)' : 'translateY(0) rotate(0deg)',
        boxShadow: hovered
          ? `0 20px 50px rgba(0,0,0,0.45), 0 6px 18px ${reg.color}30, 2px 2px 0 rgba(201,169,110,0.12)`
          : '0 3px 12px rgba(0,0,0,0.25), 1px 1px 0 rgba(201,169,110,0.08)',
        // Stagger the reveal animation — capped at 0.5s so late cards don't wait forever
        animation: `fadeUp 0.38s ${Math.min(index * 0.018, 0.5)}s both`,
      }}
    >
      {/* Colored top accent stripe */}
      <div style={{
        height: 3,
        background: `linear-gradient(90deg, ${reg.color}, ${reg.color}55, transparent)`,
        transition: 'opacity 0.3s',
        opacity: hovered ? 1 : 0.6,
      }} />

      {/* Postcard body */}
      <div style={{ padding: '14px 16px 12px' }}>

        {/* ── TOP ROW: type badge + stamp ── */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 10,
        }}>
          {/* Type badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '3px 9px', borderRadius: 2,
            border: `1px solid ${reg.color}50`,
            background: `${reg.color}12`,
          }}>
            <span style={{ fontSize: 9 }}>{typeIcon}</span>
            <span style={{
              fontFamily: "'Space Mono',monospace",
              fontSize: 6.5, letterSpacing: '0.2em',
              textTransform: 'uppercase', color: reg.color,
              fontWeight: 700,
            }}>{dest.type}</span>
          </div>

          {/* Stamp-style rating */}
          <div style={{
            width: 36, height: 36,
            border: `1.5px solid ${reg.color}60`,
            borderRadius: 2,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            background: `${reg.color}0a`,
            flexShrink: 0,
            boxShadow: hovered ? `0 0 10px ${reg.color}25` : 'none',
            transition: 'box-shadow 0.3s',
          }}>
            <span style={{ fontSize: 9, lineHeight: 1, color: '#8a6800' }}>★</span>
            <span style={{
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: 14, letterSpacing: '0.04em',
              color: '#8a6800', lineHeight: 1.1,
            }}>{dest.rating}</span>
          </div>
        </div>

        {/* ── DESTINATION NAME ── */}
        <div style={{
          fontFamily: "'Crimson Text',serif",
          fontSize: 20, fontWeight: 600,
          letterSpacing: '0.015em',
          color: hovered ? '#1a1209' : '#2a1f10',
          lineHeight: 1.15,
          marginBottom: 6,
          transition: 'color 0.25s',
        }}>{dest.name}</div>

        {/* ── REGION LINE ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          marginBottom: 12,
        }}>
          <div style={{
            width: 14, height: 1,
            background: `linear-gradient(90deg, ${reg.color}80, transparent)`,
          }} />
          <span style={{
            fontFamily: "'Space Mono',monospace",
            fontSize: 6.5, letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#a07840',
            opacity: 0.75,
          }}>{dest.region}</span>
        </div>

        {/* ── DIVIDER: classic postcard stamp-edge line ── */}
        <div style={{
          borderTop: '1px dashed rgba(160,120,64,0.25)',
          marginBottom: 10,
        }} />

        {/* ── FOOTER: Google Maps pin button ── */}
        {/* FIX: Removed stale-closure bug in onMouseLeave — was reading `hovered` which
            is always false inside the leave handler. Now uses CSS transition only. */}
        <button
          onClick={openGoogleMaps}
          title={`Open ${dest.name} on Google Maps`}
          className="pin-btn"
          style={{
            width: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            padding: '7px 0',
            borderRadius: 2,
            border: `1px solid ${hovered ? reg.color + '70' : 'rgba(160,120,64,0.28)'}`,
            background: hovered
              ? `linear-gradient(135deg, ${reg.color}18, ${reg.color}08)`
              : 'rgba(160,120,64,0.06)',
            color: hovered ? reg.color : '#8a6430',
            fontFamily: "'Space Mono',monospace",
            fontSize: 7.5, letterSpacing: '0.18em',
            textTransform: 'uppercase', fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.25s ease',
          }}
        >
          <span style={{ fontSize: 11 }}>📍</span>
          <span>Pin Location</span>
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none" style={{ opacity: 0.65 }}>
            <path
              d="M1.5 7.5L7.5 1.5M7.5 1.5H3M7.5 1.5V6"
              stroke="currentColor" strokeWidth="1.2"
              strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Subtle inner paper grain overlay */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 4,
        background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`,
        pointerEvents: 'none', zIndex: 1,
        opacity: hovered ? 0.5 : 0.8,
        transition: 'opacity 0.3s',
      }} />
    </div>
  )
}

// ── TICKER ───────────────────────────────────────────────────────────────────
function DestinationTicker({ destinations }: { destinations: typeof DESTINATIONS }) {
  const doubled = [...destinations, ...destinations]
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, height: 52,
      borderTop: '1px solid rgba(255,255,255,0.06)',
      background: 'rgba(3,5,15,0.9)', backdropFilter: 'blur(14px)',
      zIndex: 100, display: 'flex', alignItems: 'center', overflow: 'hidden',
    }}>
      <div style={{
        padding: '0 16px',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        flexShrink: 0,
        display: 'flex', alignItems: 'center', gap: 7,
        marginRight: 10,
      }}>
        <div style={{
          width: 5, height: 5, borderRadius: '50%',
          background: '#22c55e', animation: 'pingDot 1.5s infinite',
        }} />
        <span style={{
          fontFamily: "'Space Mono',monospace", fontSize: 7,
          letterSpacing: '0.4em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.16)',
        }}>Live</span>
      </div>

      <div style={{ overflow: 'hidden', flex: 1 }}>
        <div style={{
          display: 'flex',
          animation: 'tickerScroll 45s linear infinite',
          width: 'max-content',
          willChange: 'transform',
        }}>
          {doubled.map((d, i) => {
            const reg = REGIONS.find(r => r.id === normalizeRegion(d.region)) || REGIONS[1]
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '0 22px',
                borderRight: '1px solid rgba(255,255,255,0.04)',
                whiteSpace: 'nowrap',
              }}>
                <div style={{
                  width: 5, height: 5, borderRadius: '50%',
                  background: reg.color, flexShrink: 0,
                }} />
                <span style={{
                  fontFamily: "'Bebas Neue',sans-serif", fontSize: 14,
                  color: 'rgba(255,255,255,0.5)', letterSpacing: '0.04em',
                }}>{d.name}</span>
                <span style={{
                  fontFamily: "'Space Mono',monospace", fontSize: 7,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.18)',
                }}>{d.type}</span>
                <span style={{
                  fontFamily: "'Space Mono',monospace", fontSize: 8,
                  color: '#f5c842',
                }}>★{d.rating}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── FLOATING REGION FILTER ────────────────────────────────────────────────────
function FloatingRegionFilter({
  activeRegionId,
  onSelect,
}: {
  activeRegionId: string
  onSelect: (id: string) => void
}) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <div style={{
      position: 'fixed',
      top: 64, // sits just below the main nav
      left: 0, right: 0,
      zIndex: 190,
      display: 'flex',
      justifyContent: 'center',
      padding: '0 clamp(16px,4vw,56px)',
      pointerEvents: 'none',
    }}>
      <div style={{
        pointerEvents: 'all',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: scrolled ? '8px 18px' : '10px 20px',
        borderRadius: 40,
        background: scrolled ? 'rgba(3,6,15,0.88)' : 'rgba(3,6,15,0.72)',
        backdropFilter: 'blur(20px)',
        border: scrolled
          ? '1px solid rgba(255,255,255,0.08)'
          : '1px solid rgba(255,255,255,0.05)',
        boxShadow: scrolled
          ? '0 8px 40px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.04) inset'
          : '0 4px 24px rgba(0,0,0,0.3)',
        transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
        marginTop: 10,
      }}>
        {REGIONS.map(reg => (
          <RegionBadge
            key={reg.id}
            region={reg}
            isActive={activeRegionId === reg.id}
            onClick={() => onSelect(reg.id)}
          />
        ))}
      </div>
    </div>
  )
}

function RegionBadge({
  region, isActive, onClick,
}: {
  region: typeof REGIONS[0]
  isActive: boolean
  onClick: () => void
}) {
  const [hov, setHov] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: isActive ? '7px 16px' : '6px 13px',
        borderRadius: 30,
        cursor: 'pointer',
        border: isActive
          ? `1px solid ${region.color}70`
          : hov
            ? `1px solid ${region.color}35`
            : '1px solid rgba(255,255,255,0.07)',
        background: isActive
          ? `linear-gradient(135deg, ${region.color}22, ${region.color}10)`
          : hov
            ? `${region.color}0d`
            : 'transparent',
        boxShadow: isActive
          ? `0 0 18px ${region.color}30, 0 0 6px ${region.color}18 inset`
          : 'none',
        color: isActive
          ? region.color
          : hov ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.38)',
        fontFamily: "'Space Mono',monospace",
        fontSize: 8, letterSpacing: '0.18em',
        textTransform: 'uppercase',
        fontWeight: isActive ? 700 : 400,
        whiteSpace: 'nowrap',
        transition: 'all 0.22s cubic-bezier(0.16,1,0.3,1)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Active glow underline */}
      {isActive && (
        <span style={{
          position: 'absolute',
          bottom: 0, left: '20%', right: '20%',
          height: 1,
          background: `linear-gradient(90deg, transparent, ${region.color}90, transparent)`,
        }} />
      )}
      <span style={{ fontSize: 12, lineHeight: 1 }}>{region.icon}</span>
      {/* FIX: Use region.label (full name) consistently — was mixing label/short */}
      <span>{region.label}</span>
    </button>
  )
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function DestinationsPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useStarField(canvasRef)

  const [activeRegionId, setActiveRegionId] = useState('All')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [scrollY, setScrollY] = useState(0)
  const [apiDestinations, setApiDestinations] = useState<typeof DESTINATIONS>([])
  const [loading, setLoading] = useState(true)

  // Fetch real destinations from API
  useEffect(() => {
    fetch('http://localhost:5000/api/destinations?limit=200&page=1')
      .then(r => r.json())
      .then(data => {
        const apiData = data.data?.destinations || []
        const normalized = apiData.map((dest: any) => ({
          ...dest,
          region: normalizeRegion(dest.region || ''),
        }))
        setApiDestinations(normalized)
        setLoading(false)
      })
      .catch(() => {
        // Graceful fallback to static data on API failure
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    const h = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  const destToUse = apiDestinations.length > 0 ? apiDestinations : DESTINATIONS

  const filteredDests = useMemo(() =>
    destToUse.filter(d => {
      const ms = !search
        || d.name.toLowerCase().includes(search.toLowerCase())
        || d.region.toLowerCase().includes(search.toLowerCase())
        || d.type.toLowerCase().includes(search.toLowerCase())
      const mc = category === 'All' || d.type === category
      const mr = activeRegionId === 'All' || d.region === activeRegionId
      return ms && mc && mr
    }),
    [search, category, activeRegionId, destToUse]
  )

  // FIX: 'All' badge should never toggle off — only non-All regions toggle
  const handleRegionSelect = useCallback((id: string) => {
    if (id === 'All') {
      setActiveRegionId('All')
    } else {
      setActiveRegionId(prev => prev === id ? 'All' : id)
    }
  }, [])

  const scrollPct = Math.min(
    100,
    (scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1)) * 100
  )

  const activeRegionData = REGIONS.find(r => r.id === activeRegionId && r.id !== 'All')

  return (
    <div
      className="destinations-page pt-20"
      style={{
        minHeight: '100vh',
        background: '#03060f',
        color: '#fff',
        fontFamily: "'Space Mono', monospace",
        overflowX: 'hidden',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');

        .destinations-page, .destinations-page * { box-sizing: border-box; }
        body { overflow-x: hidden; }

        @keyframes ping { 0% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(1.65); opacity: 0; } }
        @keyframes pingDot { 0%, 100% { opacity: 0.7; transform: scale(1); } 50% { opacity: 1; transform: scale(1.4); } }
        @keyframes tickerScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes heroReveal { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }

        /* FIX: Pin button hover handled via CSS to avoid stale-closure JS bugs */
        .pin-btn:hover {
          transform: scale(1.015) !important;
          filter: brightness(1.1);
        }
        .pin-btn:active {
          transform: scale(0.99) !important;
        }

        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

        @media (prefers-reduced-motion: reduce) {
          .destinations-page *, .destinations-page canvas {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* Star canvas */}
      <canvas
        ref={canvasRef}
        style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
      />

      {/* Nebulae — fixed, GPU-composited */}
      {[
        { w: 700, h: 700, top: -150, left: -100, c: '#1e3a5f', dur: 8 },
        { w: 550, h: 550, bottom: -100, right: -50, c: '#2d1b69', dur: 11 },
        { w: 450, h: 450, top: '35%', left: '15%', c: '#0d4a3a', dur: 14 },
      ].map((n, i) => (
        <div key={i} style={{
          position: 'fixed',
          width: n.w, height: n.h,
          top: n.top as any, left: n.left as any,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${n.c}, transparent)`,
          filter: 'blur(90px)',
          opacity: 0.12,
          pointerEvents: 'none',
          zIndex: 0,
          animation: `float ${n.dur}s ease-in-out infinite alternate`,
        }} />
      ))}

      {/* Scroll progress bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 2,
        zIndex: 9999, background: 'rgba(255,255,255,0.04)',
      }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg,#ff9933,rgba(240,235,224,0.8),#138808)',
          width: `${scrollPct}%`,
          transition: 'width 0.05s linear',
        }} />
      </div>

      {/* ── HEADER ───────────────────────────────────────────────────────── */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        padding: '0 clamp(20px,4vw,56px)', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(3,6,15,0.75)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            border: '1px solid rgba(201,169,110,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#c9a96e' }} />
          </div>
          <div>
            <div style={{
              fontFamily: "'Bebas Neue',sans-serif", fontSize: 22,
              letterSpacing: '0.16em', color: 'rgba(255,255,255,0.88)', lineHeight: 1,
            }}>PAVILION</div>
            <div style={{
              fontFamily: "'Space Mono',monospace", fontSize: 6.5,
              letterSpacing: '0.38em', color: 'rgba(255,255,255,0.2)',
              textTransform: 'uppercase', lineHeight: 1.3,
            }}>India</div>
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {[
            { l: 'Destinations', p: '/destinations', a: true },
            { l: 'Tours', p: '/tours' },
            { l: 'About', p: '/about' },
            { l: 'Contact', p: '/contact' },
          ].map(({ l, p, a }) => (
            <Link
              key={l} to={p}
              style={{
                fontFamily: "'Space Mono',monospace", fontSize: 9,
                letterSpacing: '0.22em', textTransform: 'uppercase',
                color: a ? 'rgba(245,200,66,0.75)' : 'rgba(255,255,255,0.28)',
                textDecoration: 'none', transition: 'color 0.2s',
                borderBottom: a ? '1px solid rgba(245,200,66,0.35)' : 'none',
                paddingBottom: a ? 2 : 0,
              }}
              onMouseEnter={e => { if (!a) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.65)' }}
              onMouseLeave={e => { if (!a) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.28)' }}
            >{l}</Link>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Link
            to="/login"
            style={{
              fontFamily: "'Space Mono',monospace", fontSize: 8.5,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.25)', textDecoration: 'none',
              transition: 'color 0.2s', display: 'flex', alignItems: 'center',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.25)'}
          >Sign In</Link>
          <Link
            to="/register"
            style={{
              fontFamily: "'Space Mono',monospace", fontSize: 8.5,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: '#c9a96e', border: '1px solid rgba(201,169,110,0.4)',
              padding: '7px 16px', borderRadius: 2,
              textDecoration: 'none', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(201,169,110,0.1)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
          >Get Started</Link>
        </div>
      </div>

      {/* ── FLOATING REGION FILTER ────────────────────────────────────────── */}
      <FloatingRegionFilter activeRegionId={activeRegionId} onSelect={handleRegionSelect} />

      {/* ── HERO HEADLINE ─────────────────────────────────────────────────── */}
      <div style={{
        position: 'relative', zIndex: 1,
        paddingTop: 'calc(64px + 72px + 48px)',
        paddingBottom: 40,
        paddingLeft: 'clamp(20px,4vw,56px)',
        paddingRight: 'clamp(20px,4vw,56px)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', textAlign: 'center',
        animation: 'heroReveal 0.7s 0.1s both',
      }}>
        {/* Eyebrow label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ width: 24, height: 1, background: 'rgba(201,169,110,0.4)' }} />
          <span style={{
            fontFamily: "'Space Mono',monospace", fontSize: 7.5,
            letterSpacing: '0.42em', textTransform: 'uppercase',
            color: 'rgba(201,169,110,0.65)',
          }}>Discover India</span>
          <div style={{ width: 24, height: 1, background: 'rgba(201,169,110,0.4)' }} />
        </div>

        {/* Big title */}
        <h1 style={{
          fontFamily: "'Bebas Neue',sans-serif",
          fontSize: 'clamp(64px, 10vw, 110px)',
          letterSpacing: '0.04em', lineHeight: 0.92,
          margin: '0 0 12px',
          background: activeRegionData
            ? `linear-gradient(135deg, ${activeRegionData.color} 0%, rgba(255,255,255,0.6) 100%)`
            : 'linear-gradient(135deg, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.22) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          transition: 'all 0.4s ease',
        }}>
          {activeRegionData ? activeRegionData.label : 'Destinations'}
        </h1>

        {/* Subtitle */}
        <p style={{
          fontFamily: "'Crimson Text',serif",
          fontStyle: 'italic', fontSize: 17,
          color: activeRegionData ? `${activeRegionData.color}80` : 'rgba(255,255,255,0.28)',
          letterSpacing: '0.02em', margin: '0 0 28px',
          maxWidth: 460, lineHeight: 1.6,
          transition: 'color 0.4s ease',
        }}>
          {activeRegionData?.tagline ?? 'One subcontinent. Infinite wonders.'}
        </p>

        {/* Destination count badge */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{
            fontFamily: "'Bebas Neue',sans-serif", fontSize: 54,
            letterSpacing: '0.02em', lineHeight: 1,
            background: 'linear-gradient(135deg,rgba(255,255,255,0.7) 0%,rgba(255,255,255,0.12) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {loading ? '—' : filteredDests.length}
          </span>
          <span style={{
            fontFamily: "'Space Mono',monospace", fontSize: 8,
            letterSpacing: '0.4em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.18)',
          }}>
            {filteredDests.length === 1 ? 'Destination' : 'Destinations'}
          </span>
        </div>
      </div>

      {/* ── SEARCH + CATEGORY FILTERS ─────────────────────────────────────── */}
      <div style={{
        position: 'relative', zIndex: 10,
        padding: '0 clamp(20px,4vw,56px) 28px',
        display: 'flex', flexDirection: 'column',
        gap: 14, alignItems: 'center',
      }}>
        {/* Search input */}
        <div style={{ position: 'relative', width: '100%', maxWidth: 480 }}>
          <span style={{
            position: 'absolute', left: 16, top: '50%',
            transform: 'translateY(-50%)', fontSize: 14, opacity: 0.3,
          }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search destinations, regions, categories…"
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: 30, padding: '11px 44px 11px 44px',
              fontSize: 11, fontFamily: "'Space Mono',monospace",
              letterSpacing: '0.06em', color: '#fff',
              outline: 'none', transition: 'border-color 0.3s, background 0.3s',
            }}
            onFocus={e => {
              e.target.style.borderColor = 'rgba(201,169,110,0.45)'
              e.target.style.background = 'rgba(255,255,255,0.06)'
            }}
            onBlur={e => {
              e.target.style.borderColor = 'rgba(255,255,255,0.09)'
              e.target.style.background = 'rgba(255,255,255,0.04)'
            }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{
                position: 'absolute', right: 14, top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.1)', border: 'none',
                borderRadius: '50%', width: 20, height: 20,
                fontSize: 10, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}
            >✕</button>
          )}
        </div>

        {/* Category pills */}
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'center' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                fontFamily: "'Space Mono',monospace", fontSize: 7.5,
                letterSpacing: '0.16em', textTransform: 'uppercase',
                padding: '5px 13px', borderRadius: 100, cursor: 'pointer',
                background: category === cat ? 'rgba(56,189,248,0.18)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${category === cat ? '#38bdf875' : 'rgba(255,255,255,0.07)'}`,
                color: category === cat ? '#38bdf8' : 'rgba(255,255,255,0.32)',
                transition: 'all 0.2s',
              }}
            >{cat}</button>
          ))}
          {(search || category !== 'All' || activeRegionId !== 'All') && (
            <button
              onClick={() => { setSearch(''); setCategory('All'); setActiveRegionId('All') }}
              style={{
                fontFamily: "'Space Mono',monospace", fontSize: 7.5,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                padding: '5px 13px', borderRadius: 100, cursor: 'pointer',
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                color: 'rgba(239,68,68,0.7)', transition: 'all 0.2s',
              }}
            >Clear ✕</button>
          )}
        </div>
      </div>

      {/* ── DESTINATION GRID ─────────────────────────────────────────────── */}
      <div style={{
        position: 'relative', zIndex: 10,
        padding: '0 clamp(20px,4vw,56px) 100px',
      }}>
        {/* Results header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 20,
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          paddingBottom: 14,
        }}>
          <div>
            <span style={{
              fontFamily: "'Bebas Neue',sans-serif", fontSize: 36,
              color: '#fff', letterSpacing: '0.02em',
            }}>{filteredDests.length}</span>
            <span style={{
              fontFamily: "'Space Mono',monospace", fontSize: 9,
              color: 'rgba(255,255,255,0.28)', marginLeft: 10,
              letterSpacing: '0.2em', textTransform: 'uppercase',
            }}>destinations found</span>
          </div>
          {activeRegionData && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                fontFamily: "'Space Mono',monospace", fontSize: 8,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: activeRegionData.color, opacity: 0.8,
              }}>
                {activeRegionData.icon} {activeRegionData.tagline}
              </span>
            </div>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{
              fontFamily: "'Bebas Neue',sans-serif", fontSize: 28,
              color: 'rgba(255,255,255,0.22)', letterSpacing: '0.1em',
              animation: 'pingDot 1.4s infinite',
            }}>
              Loading…
            </div>
          </div>
        ) : filteredDests.length > 0 ? (
          <div style={{
            display: 'grid',
            // Auto-fill ensures all 145+ cards render with no JS virtualization needed
            gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))',
            gap: 10,
          }}>
            {filteredDests.map((d, i) => (
              <DestCard key={`${d.name}-${d.region}`} dest={d} index={i} />
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center', padding: '80px 0',
            background: 'rgba(255,255,255,0.02)', borderRadius: 3,
            border: '1px dashed rgba(255,255,255,0.07)',
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🗺️</div>
            <div style={{
              fontFamily: "'Bebas Neue',sans-serif", fontSize: 28,
              color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em',
            }}>No destinations found</div>
            <button
              onClick={() => { setSearch(''); setActiveRegionId('All'); setCategory('All') }}
              style={{
                marginTop: 20, padding: '10px 28px', borderRadius: 2,
                background: 'rgba(56,189,248,0.14)',
                border: '1px solid rgba(56,189,248,0.38)',
                color: '#38bdf8', fontFamily: "'Space Mono',monospace",
                fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >Show Everything</button>
          </div>
        )}
      </div>

      {/* ── BOTTOM TICKER ─────────────────────────────────────────────────── */}
      <DestinationTicker destinations={destToUse} />
    </div>
  )
}