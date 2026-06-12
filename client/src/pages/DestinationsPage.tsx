import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import MapModal from '../components/map/MapModal'
import { getDestinationCoords } from '../utils/destinationCoords'

// ── DATA ─────────────────────────────────────────────────────────────────────
const REGIONS = [
  {
    id: 'North India', icon: '🏔️', color: '#38bdf8', glow: '#0ea5e9',
    label: 'North India', short: 'North',
    tagline: 'Where the Himalayas touch the sky',
    landmarks: ['Taj Mahal', 'Varanasi Ghats', 'Jaisalmer Fort', 'Jim Corbett'],
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=85',
    stats: { tours: 12, rating: '4.8', best: 'Oct–Mar' },
    desc: 'Golden forts rising from desert sands, ancient ghats where pilgrims bathe at dawn, and the crown jewel of the Mughal empire.',
    destCount: 12, angle: 270,
  },
  {
    id: 'South India', icon: '🌴', color: '#34d399', glow: '#10b981',
    label: 'South India', short: 'South',
    tagline: 'Dravidian temples & emerald backwaters',
    landmarks: ['Kerala Backwaters', 'Hampi Ruins', 'Meenakshi Temple', 'Nilgiri Hills'],
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=85',
    stats: { tours: 10, rating: '4.9', best: 'Nov–Feb' },
    desc: 'Gliding through palm-fringed backwaters on a houseboat, ancient gopurams rising against sunset, spice gardens perfuming the mountain air.',
    destCount: 10, angle: 90,
  },
  {
    id: 'West India', icon: '🏖️', color: '#fb923c', glow: '#f97316',
    label: 'West India', short: 'West',
    tagline: 'Beaches, caves & the city of dreams',
    landmarks: ['Goa Beaches', 'Ajanta & Ellora', 'Rann of Kutch', 'Mumbai'],
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=85',
    stats: { tours: 8, rating: '4.7', best: 'Nov–Mar' },
    desc: 'Portuguese forts overlooking turquoise Arabian Sea, ancient Buddhist caves carved into basalt cliffs, the salt desert glowing white under a full moon.',
    destCount: 8, angle: 180,
  },
  {
    id: 'East India', icon: '🐯', color: '#f472b6', glow: '#ec4899',
    label: 'East India', short: 'East',
    tagline: 'Tea gardens, temples & untamed wild',
    landmarks: ['Darjeeling', 'Sundarbans', 'Konark Sun Temple', 'Puri Beach'],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85',
    stats: { tours: 7, rating: '4.6', best: 'Sep–Mar' },
    desc: "Sunrise over Kanchenjunga from Darjeeling's tea estates, royal Bengal tigers prowling mangrove islands, the 13th-century Sun Temple at the Bay of Bengal.",
    destCount: 7, angle: 0,
  },
  {
    id: 'Northeast India', icon: '🌿', color: '#a78bfa', glow: '#8b5cf6',
    label: 'Northeast India', short: 'Northeast',
    tagline: 'Last wilderness of the subcontinent',
    landmarks: ['Living Root Bridges', 'Kaziranga', 'Tawang Monastery', 'Loktak Lake'],
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=85',
    stats: { tours: 6, rating: '4.8', best: 'Oct–Apr' },
    desc: 'Ancient living bridges woven from rubber tree roots, one-horned rhinos in misty grasslands, Tibetan monasteries perched on Himalayan ridges.',
    destCount: 6, angle: 315,
  },
  {
    id: 'Central India', icon: '🦁', color: '#fbbf24', glow: '#f59e0b',
    label: 'Central India', short: 'Central',
    tagline: 'Tiger country & ancient temple art',
    landmarks: ['Khajuraho', 'Bandhavgarh', 'Kanha', 'Sanchi Stupa'],
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=85',
    stats: { tours: 6, rating: '4.7', best: 'Oct–Jun' },
    desc: "Erotic temple carvings at Khajuraho speak of a civilisation at peace with itself, and some of India's finest tiger reserves deep in Sal forest.",
    destCount: 6, angle: 135,
  },
  {
    id: 'Islands', icon: '🐠', color: '#22d3ee', glow: '#06b6d4',
    label: 'Islands', short: 'Islands',
    tagline: 'Coral kingdoms & turquoise infinity',
    landmarks: ['Radhanagar Beach', 'Neil Island', 'Havelock', 'Lakshadweep'],
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=85',
    stats: { tours: 5, rating: '4.9', best: 'Oct–May' },
    desc: "Asia's finest beach at Radhanagar, coral gardens teeming with life, bioluminescent plankton lighting the surf, absolute isolation from the world.",
    destCount: 5, angle: 45,
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

const REGION_NAME_MAP: Record<string, string> = {
  North: 'North India',
  South: 'South India',
  East: 'East India',
  West: 'West India',
  Northeast: 'Northeast India',
  Central: 'Central India',
  Islands: 'Islands',
  'North India': 'North India',
  'South India': 'South India',
  'East India': 'East India',
  'West India': 'West India',
  'Northeast India': 'Northeast India',
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

    const stars = Array.from({ length: 280 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.2,
      op: Math.random() * 0.6 + 0.08,
      speed: Math.random() * 0.4 + 0.04,
      phase: Math.random() * Math.PI * 2,
    }))

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    let t = 0
    const draw = () => {
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
    draw()

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [canvasRef])
}

// ── REGION NODE ──────────────────────────────────────────────────────────────
function RegionNode({ region, isActive, isHighlighted: _isHighlighted, isDimmed, onClick }: {
  region: typeof REGIONS[0]; isActive: boolean; isHighlighted: boolean; isDimmed: boolean; onClick: () => void
}) {
  const [hov, setHov] = useState(false)
  const rad = (region.angle - 90) * Math.PI / 180
  const R = 200
  const cx = 270 + R * Math.cos(rad)
  const cy = 270 + R * Math.sin(rad)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'absolute', left: cx, top: cy,
        transform: 'translate(-50%, -50%)',
        cursor: 'pointer', zIndex: 30,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7,
        opacity: isDimmed ? 0.18 : 1,
        transition: 'opacity 0.4s ease',
      }}
    >
      {/* Outer glow ring */}
      {(isActive || hov) && (
        <div style={{
          position: 'absolute',
          width: isActive ? 100 : 76, height: isActive ? 100 : 76,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${region.color}35 0%, transparent 70%)`,
          filter: 'blur(10px)',
          transition: 'all 0.5s ease',
        }} />
      )}

      {/* Main orb */}
      <div style={{
        width: isActive || hov ? 72 : 58,
        height: isActive || hov ? 72 : 58,
        borderRadius: '50%',
        background: isActive
          ? `radial-gradient(circle at 35% 35%, ${region.color}55, ${region.color}15)`
          : `radial-gradient(circle at 35% 35%, ${region.color}30, ${region.color}08)`,
        border: `1.5px solid ${region.color}${isActive ? 'cc' : hov ? '88' : '44'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: isActive || hov ? 28 : 22,
        transform: isActive || hov ? 'scale(1.0)' : 'scale(1)',
        transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        boxShadow: isActive
          ? `0 0 32px ${region.color}55, 0 0 70px ${region.color}22, inset 0 1px 0 rgba(255,255,255,0.15)`
          : hov ? `0 0 18px ${region.color}40, inset 0 1px 0 rgba(255,255,255,0.1)` : 'none',
        position: 'relative',
        backdropFilter: 'blur(4px)',
      }}>
        {/* Ping ring when active */}
        {isActive && (
          <div style={{
            position: 'absolute', inset: -7, borderRadius: '50%',
            border: `1px solid ${region.color}45`,
            animation: 'ping 2.2s ease-out infinite',
          }} />
        )}
        {/* Second ping */}
        {isActive && (
          <div style={{
            position: 'absolute', inset: -14, borderRadius: '50%',
            border: `1px solid ${region.color}20`,
            animation: 'ping 2.2s ease-out 0.7s infinite',
          }} />
        )}
        <span style={{ filter: isDimmed ? 'grayscale(1)' : 'none' }}>{region.icon}</span>
      </div>

      {/* Label */}
      <div style={{ textAlign: 'center' }}>
        <span style={{
          fontFamily: "'Space Mono', monospace", fontSize: 8.5,
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: isActive ? '#fff' : hov ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.38)',
          transition: 'color 0.3s', whiteSpace: 'nowrap', display: 'block',
          textShadow: isActive ? `0 0 20px ${region.color}` : 'none',
        }}>{region.short}</span>
        {(isActive || hov) && (
          <span style={{
            fontFamily: "'Space Mono', monospace", fontSize: 6.5,
            color: region.color, letterSpacing: '0.1em', display: 'block', marginTop: 1,
            opacity: 0.8,
          }}>{region.destCount} places</span>
        )}
      </div>
    </div>
  )
}

// ── DETAIL PANEL ─────────────────────────────────────────────────────────────
function DetailPanel({ region, onClose, regionDests, onMapClick }: {
  region: typeof REGIONS[0] | null; onClose: () => void
  regionDests: typeof DESTINATIONS; onMapClick: (name: string) => void
}) {
  const [activeTab, setActiveTab] = useState<'overview' | 'places'>('overview')
  const [hovDest, setHovDest] = useState<string | null>(null)

  // Reset tab when region changes
  useEffect(() => { setActiveTab('overview') }, [region?.id])

  return (
    <div style={{
      position: 'fixed', right: 0, top: 0, bottom: 0, width: 430,
      background: 'linear-gradient(160deg, rgba(5,3,18,0.98) 0%, rgba(3,3,12,0.99) 100%)',
      backdropFilter: 'blur(28px)',
      borderLeft: region ? `1px solid ${region.color}25` : '1px solid rgba(255,255,255,0.05)',
      zIndex: 500,
      transform: region ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)',
      overflowY: 'auto', overflowX: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      {region && (
        <>
          {/* Hero */}
          <div style={{ position: 'relative', height: 240, flexShrink: 0, overflow: 'hidden' }}>
            <img
              src={region.image} alt={region.label}
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.38) saturate(0.7)', transition: 'transform 6s ease' }}
              onLoad={e => { (e.target as HTMLImageElement).style.transform = 'scale(1.04)' }}
            />
            {/* Color tint */}
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${region.color}30 0%, transparent 55%)` }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(5,3,18,0.15) 0%, rgba(5,3,18,0.98) 100%)' }} />

            {/* Top bar */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 9,
                background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(10px)',
                border: `1px solid ${region.color}35`, borderRadius: 3, padding: '7px 14px',
              }}>
                <span style={{ fontSize: 14 }}>{region.icon}</span>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 8, letterSpacing: '0.28em', textTransform: 'uppercase', color: region.color }}>{region.short}</span>
              </div>
              <button onClick={onClose} style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.13)',
                color: 'rgba(255,255,255,0.55)', cursor: 'pointer', fontSize: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.16)'; (e.currentTarget as HTMLElement).style.color = '#fff' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)' }}
              >✕</button>
            </div>

            {/* Title */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 22px 18px' }}>
              <p style={{ fontFamily: "'Space Mono',monospace", fontSize: 8, letterSpacing: '0.32em', textTransform: 'uppercase', color: region.color, marginBottom: 5, opacity: 0.85 }}>{region.tagline}</p>
              <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 52, letterSpacing: '0.03em', lineHeight: 0.9, color: '#fff', margin: 0 }}>{region.label}</h2>
            </div>
            {/* Color line */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${region.color}, transparent)` }} />
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
            {[
              { val: String(region.stats.tours), label: 'Tours' },
              { val: region.stats.rating + '★', label: 'Rating' },
              { val: String(region.destCount), label: 'Places' },
              { val: region.stats.best, label: 'Season', sm: true },
            ].map((s, i) => (
              <div key={i} style={{ padding: '13px 6px', textAlign: 'center', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none', background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent' }}>
                <div style={{ fontFamily: s.sm ? "'Space Mono',monospace" : "'Bebas Neue',sans-serif", fontSize: s.sm ? 9 : 26, letterSpacing: s.sm ? '0.04em' : '0.04em', color: region.color, lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 6.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', marginTop: 5 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
            {(['overview', 'places'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                flex: 1, padding: '12px', fontFamily: "'Space Mono',monospace", fontSize: 8,
                letterSpacing: '0.25em', textTransform: 'uppercase', cursor: 'pointer',
                background: activeTab === tab ? `${region.color}12` : 'transparent',
                border: 'none',
                borderBottom: activeTab === tab ? `2px solid ${region.color}` : '2px solid transparent',
                color: activeTab === tab ? region.color : 'rgba(255,255,255,0.28)',
                transition: 'all 0.25s',
              }}>{tab === 'overview' ? 'Overview' : `Places (${regionDests.length})`}</button>
            ))}
          </div>

          {/* Tab content */}
          <div style={{ padding: '20px 22px', flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>

            {activeTab === 'overview' && (
              <>
                <p style={{ fontFamily: "'Crimson Text',serif", fontStyle: 'italic', fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, margin: 0 }}>{region.desc}</p>

                {/* Landmarks */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: region.color }} />
                    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 7, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)' }}>Signature Places</span>
                    <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${region.color}30, transparent)` }} />
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {region.landmarks.map(lm => (
                      <span key={lm} style={{
                        fontFamily: "'Space Mono',monospace", fontSize: 7.5, letterSpacing: '0.1em', textTransform: 'uppercase',
                        padding: '5px 11px', borderRadius: 2,
                        background: `${region.color}12`, border: `1px solid ${region.color}35`, color: region.color,
                        transition: 'all 0.2s', cursor: 'default',
                      }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = `${region.color}25`}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = `${region.color}12`}
                      >{lm}</span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <Link to="/tours" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  padding: '15px 20px', borderRadius: 2,
                  background: `linear-gradient(135deg, ${region.color}ee, ${region.color}88)`,
                  color: '#03060f', fontFamily: "'Space Mono',monospace", fontSize: 10,
                  letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700,
                  textDecoration: 'none', flexShrink: 0,
                  boxShadow: `0 8px 28px ${region.color}30`, transition: 'opacity 0.2s, transform 0.2s',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.88'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
                >Explore {region.short} Tours →</Link>
              </>
            )}

            {activeTab === 'places' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {regionDests.map(dest => {
                  const hasCoords = !!getDestinationCoords(dest.name)
                  return (
                    <div key={dest.name}
                      onMouseEnter={() => setHovDest(dest.name)}
                      onMouseLeave={() => setHovDest(null)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '11px 13px', borderRadius: 2, cursor: 'default',
                        background: hovDest === dest.name ? `${region.color}12` : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${hovDest === dest.name ? region.color + '35' : 'rgba(255,255,255,0.05)'}`,
                        transition: 'all 0.2s',
                      }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: region.color, opacity: 0.7, flexShrink: 0 }} />
                        <div>
                          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 9.5, color: hovDest === dest.name ? '#fff' : 'rgba(255,255,255,0.6)', letterSpacing: '0.04em', marginBottom: 2 }}>{dest.name}</div>
                          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 6.5, color: `${region.color}80`, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{dest.type}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 8, color: '#f5c842' }}>★{dest.rating}</span>
                        {hasCoords && (
                          <button
                            onClick={() => onMapClick(dest.name)}
                            title="Open the map preview"
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: 6,
                              padding: '6px 10px', borderRadius: 4, cursor: 'pointer',
                              background: hovDest === dest.name ? `${region.color}20` : 'rgba(255,255,255,0.04)',
                              border: `1px solid ${hovDest === dest.name ? region.color + '50' : 'rgba(255,255,255,0.1)'}`,
                              color: hovDest === dest.name ? region.color : 'rgba(255,255,255,0.35)',
                              fontFamily: "'Space Mono',monospace", fontSize: 8, letterSpacing: '0.08em',
                              textTransform: 'uppercase', transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${region.color}28`; (e.currentTarget as HTMLElement).style.color = region.color }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = hovDest === dest.name ? `${region.color}20` : 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLElement).style.color = hovDest === dest.name ? region.color : 'rgba(255,255,255,0.35)' }}
                          >
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                              <span>📍</span>
                              <span style={{ fontWeight: 700 }}>View on Map</span>
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

// ── DESTINATION CARD ──────────────────────────────────────────────────────────
function DestCard({ dest, index, onMapClick }: {
  dest: typeof DESTINATIONS[0]; index: number; onMapClick?: (name: string) => void
}) {
  const [hovered, setHovered] = useState(false)
  const reg = REGIONS.find(r => r.id === dest.region)!
  const hasCoords = !!getDestinationCoords(dest.name)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? `${reg.color}0e` : 'rgba(255,255,255,0.025)',
        border: `1px solid ${hovered ? reg.color + '55' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 3, padding: '13px 15px', cursor: 'default',
        transition: 'all 0.28s ease',
        transform: hovered ? 'translateY(-3px)' : 'none',
        boxShadow: hovered ? `0 8px 28px ${reg.color}15` : 'none',
        animation: `fadeUp 0.4s ${index * 0.025}s both`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: reg.color, boxShadow: hovered ? `0 0 9px ${reg.color}` : 'none', transition: 'box-shadow 0.3s', marginTop: 1 }} />
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 7, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '2px 7px', borderRadius: 100, background: `${reg.color}18`, color: reg.color, border: `1px solid ${reg.color}30` }}>{dest.type}</span>
        </div>
        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 8.5, color: '#f5c842', letterSpacing: '0.04em' }}>★{dest.rating}</span>
      </div>

      <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 17, letterSpacing: '0.05em', color: hovered ? '#fff' : 'rgba(255,255,255,0.7)', marginBottom: 10, lineHeight: 1.1, transition: 'color 0.2s' }}>{dest.name}</div>

      {hovered && hasCoords && (
        <button
          onClick={() => onMapClick?.(dest.name)}
          title="Open the map preview"
          style={{
            width: '100%', padding: '8px 0', borderRadius: 4,
            border: `1px solid ${reg.color}50`, background: `${reg.color}14`,
            color: reg.color, fontFamily: "'Space Mono',monospace",
            fontSize: 9, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase',
            cursor: 'pointer', transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = `${reg.color}28`}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = `${reg.color}14`}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span>📍</span>
            <span style={{ fontWeight: 800 }}>View on Map</span>
          </span>
        </button>
      )}
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
      <div style={{ padding: '0 16px', borderRight: '1px solid rgba(255,255,255,0.07)', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 7, marginRight: 10 }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', animation: 'pingDot 1.5s infinite' }} />
        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 7, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.16)' }}>Live</span>
      </div>
      <div style={{ overflow: 'hidden', flex: 1 }}>
        <div style={{ display: 'flex', animation: 'tickerScroll 65s linear infinite', width: 'max-content' }}>
          {doubled.map((d, i) => {
            const reg = REGIONS.find(r => r.id === normalizeRegion(d.region)) || REGIONS[0]
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 22px', borderRight: '1px solid rgba(255,255,255,0.04)', whiteSpace: 'nowrap' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: reg.color, flexShrink: 0 }} />
                <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.04em' }}>{d.name}</span>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 7, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)' }}>{d.type}</span>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 8, color: '#f5c842' }}>★{d.rating}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function DestinationsPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useStarField(canvasRef)

  const [activeRegion, setActiveRegion] = useState<typeof REGIONS[0] | null>(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [showGrid, setShowGrid] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [apiDestinations, setApiDestinations] = useState<typeof DESTINATIONS>([])
  const [loading, setLoading] = useState(true)

  // Map modal state
  const [mapOpen, setMapOpen] = useState(false)
  const [mapDest, setMapDest] = useState<{
    name: string
    lat: number
    lng: number
    address: string
    rating?: number
    category?: string[]
    coverImage?: string
    bestTimeToVisit?: string
    entryFee?: string
    timings?: string
    howToReach?: { byAir?: string; byTrain?: string; byRoad?: string }
    nearbyAttractions?: string[]
  } | null>(null)

  // Fetch real destinations from API
  useEffect(() => {
    fetch('http://localhost:5000/api/destinations?limit=200')
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
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    const h = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  const openMap = useCallback((destName: string) => {
    const coords = getDestinationCoords(destName)
    if (coords) {
      const dest = DESTINATIONS.find(d => d.name === destName)
      setMapDest({
        name: destName,
        ...coords,
        rating: dest?.rating || 4.5,
        category: [dest?.type?.toLowerCase() || 'destination'],
      })
      setMapOpen(true)
    }
  }, [])

  const closeMap = useCallback(() => { setMapOpen(false); setMapDest(null) }, [])

  const destToUse = apiDestinations.length > 0 ? apiDestinations : DESTINATIONS

  const filteredDests = useMemo(() =>
    destToUse.filter(d => {
      const ms = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.region.toLowerCase().includes(search.toLowerCase()) || d.type.toLowerCase().includes(search.toLowerCase())
      const mc = category === 'All' || d.type === category
      const mr = !activeRegion || d.region === activeRegion.id
      return ms && mc && mr
    }), [search, category, activeRegion, destToUse])

  const matchedRegions = useMemo(() => {
    if (!search) return new Set<string>()
    return new Set(destToUse.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.type.toLowerCase().includes(search.toLowerCase())).map(d => d.region))
  }, [search, destToUse])

  const handleRegionClick = (reg: typeof REGIONS[0]) => {
    setActiveRegion(prev => prev?.id === reg.id ? null : reg)
    setShowGrid(true)
  }

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') { setActiveRegion(null); setShowGrid(false) } }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  const scrollPct = Math.min(100, (scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1)) * 100)
  const regionDests = activeRegion ? destToUse.filter(d => d.region === activeRegion.id) : []

  return (
    <div className="destinations-page pt-20" style={{ minHeight: '100vh', background: '#03060f', color: '#fff', fontFamily: "'Space Mono', monospace", overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
        .destinations-page, .destinations-page * { box-sizing: border-box; }
        body { overflow-x: hidden; }
        @keyframes ping { 0% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(1.65); opacity: 0; } }
        @keyframes pingDot { 0%, 100% { opacity: 0.7; transform: scale(1); } 50% { opacity: 1; transform: scale(1.4); } }
        @keyframes spin { from { transform: translate(-50%,-50%) rotate(0deg); } to { transform: translate(-50%,-50%) rotate(360deg); } }
        @keyframes spinR { from { transform: translate(-50%,-50%) rotate(0deg); } to { transform: translate(-50%,-50%) rotate(-360deg); } }
        @keyframes tickerScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes fadeUp { from { opacity:0; transform: translateY(18px); } to { opacity:1; transform: translateY(0); } }
        @keyframes coreGlow { 0%,100% { box-shadow: 0 0 30px rgba(245,200,66,0.22), 0 0 60px rgba(245,200,66,0.08); } 50% { box-shadow: 0 0 55px rgba(245,200,66,0.38), 0 0 110px rgba(245,200,66,0.14); } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
      `}</style>

      {/* Star canvas */}
      <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />

      {/* Nebulae */}
      {[
        { w: 700, h: 700, top: -150, left: -100, c: '#1e3a5f' },
        { w: 550, h: 550, bottom: -100, right: -50, c: '#2d1b69' },
        { w: 450, h: 450, top: '35%', left: '15%', c: '#0d4a3a' },
      ].map((n, i) => (
        <div key={i} style={{
          position: 'fixed', width: n.w, height: n.h,
          top: n.top, left: n.left,
          borderRadius: '50%', background: `radial-gradient(circle, ${n.c}, transparent)`,
          filter: 'blur(90px)', opacity: 0.12, pointerEvents: 'none', zIndex: 0,
          animation: `float ${8 + i * 3}s ease-in-out infinite alternate`,
        }} />
      ))}

      {/* Scroll progress */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 2, zIndex: 9999, background: 'rgba(255,255,255,0.04)' }}>
        <div style={{ height: '100%', background: 'linear-gradient(90deg,#ff9933,rgba(240,235,224,0.8),#138808)', width: `${scrollPct}%`, transition: 'width 0.05s linear' }} />
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
          <div style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid rgba(201,169,110,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#c9a96e' }} />
          </div>
          <div>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, letterSpacing: '0.16em', color: 'rgba(255,255,255,0.88)', lineHeight: 1 }}>PAVILION</div>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 6.5, letterSpacing: '0.38em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', lineHeight: 1.3 }}>India</div>
          </div>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {[{ l: 'Destinations', p: '/destinations', a: true }, { l: 'Tours', p: '/tours' }, { l: 'About', p: '/about' }, { l: 'Contact', p: '/contact' }].map(({ l, p, a }) => (
            <Link key={l} to={p} style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: a ? 'rgba(245,200,66,0.75)' : 'rgba(255,255,255,0.28)', textDecoration: 'none', transition: 'color 0.2s', borderBottom: a ? '1px solid rgba(245,200,66,0.35)' : 'none', paddingBottom: a ? 2 : 0 }}
              onMouseEnter={e => { if (!a) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.65)' }}
              onMouseLeave={e => { if (!a) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.28)' }}
            >{l}</Link>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/login" style={{ fontFamily: "'Space Mono',monospace", fontSize: 8.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', textDecoration: 'none', transition: 'color 0.2s', display: 'flex', alignItems: 'center' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.25)'}
          >Sign In</Link>
          <Link to="/register" style={{ fontFamily: "'Space Mono',monospace", fontSize: 8.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#c9a96e', border: '1px solid rgba(201,169,110,0.4)', padding: '7px 16px', borderRadius: 2, textDecoration: 'none', transition: 'all 0.2s', display: 'flex', alignItems: 'center' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(201,169,110,0.1)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
          >Get Started</Link>
        </div>
      </div>

      {/* ── HERO — ORBITAL MAP ───────────────────────────────────────────── */}
      <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 64, zIndex: 1 }}>

        {/* Count badge top-left */}
        <div style={{ position: 'absolute', top: 88, left: 'clamp(20px,4vw,56px)', zIndex: 20 }}>
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 88, letterSpacing: '0.02em', lineHeight: 1, background: 'linear-gradient(135deg,rgba(255,255,255,0.7) 0%,rgba(255,255,255,0.08) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {filteredDests.length < destToUse.length ? filteredDests.length : apiDestinations.length || DESTINATIONS.length}
          </div>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 8, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)', marginTop: -8 }}>Destinations</div>
        </div>

        {/* Top-right */}
        <div style={{ position: 'absolute', top: 100, right: 'clamp(20px,4vw,56px)', textAlign: 'right', zIndex: 20 }}>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 7.5, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)', marginBottom: 6 }}>7 Regions</div>
          <div style={{ fontFamily: "'Crimson Text',serif", fontStyle: 'italic', fontSize: 14, color: 'rgba(255,255,255,0.3)', maxWidth: 160, lineHeight: 1.6 }}>One subcontinent.<br />Infinite wonders.</div>
        </div>

        {/* ── ORBITAL SYSTEM ── */}
        <div style={{ position: 'relative', width: 540, height: 540, flexShrink: 0 }}>

          {/* Orbit rings — styled like the original but refined */}
          {[100, 220, 360, 510].map((size, i) => (
            <div key={i} style={{
              position: 'absolute', width: size, height: size, borderRadius: '50%',
              border: `1px solid rgba(255,255,255,${i === 2 ? '0.06' : '0.03'})`,
              top: '50%', left: '50%',
              transform: 'translate(-50%,-50%)',
              animation: i % 2 === 0
                ? `spin ${55 + i * 18}s linear infinite`
                : `spinR ${65 + i * 18}s linear infinite`,
            }} />
          ))}

          {/* Tick marks on outer ring */}
          {Array.from({ length: 24 }).map((_, i) => {
            const ang = (i / 24) * Math.PI * 2
            const r2 = 262
            return (
              <div key={i} style={{
                position: 'absolute', top: '50%', left: '50%',
                width: 1, height: i % 6 === 0 ? 12 : 6,
                background: i % 6 === 0 ? 'rgba(245,200,66,0.25)' : 'rgba(255,255,255,0.08)',
                transformOrigin: '50% 0%',
                transform: `translate(-50%, -${r2}px) rotate(${ang}rad)`,
              }} />
            )
          })}

          {/* SVG connectors */}
          <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 15 }} viewBox="0 0 540 540" width="540" height="540">
            {REGIONS.map((reg, i) => {
              const rad = (reg.angle - 90) * Math.PI / 180
              const cx = 270 + 200 * Math.cos(rad)
              const cy = 270 + 200 * Math.sin(rad)
              const isActive = activeRegion?.id === reg.id
              const isHl = matchedRegions.has(reg.id)
              return (
                <line key={i} x1="270" y1="270" x2={cx} y2={cy}
                  stroke={reg.color}
                  strokeWidth={isActive || isHl ? 1.2 : 0.5}
                  strokeOpacity={isActive || isHl ? 0.55 : 0.1}
                  strokeDasharray={isActive ? 'none' : '4 6'}
                  style={{ transition: 'all 0.4s ease' }}
                />
              )
            })}
          </svg>

          {/* Center core */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            width: 96, height: 96, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245,200,66,0.25) 0%, rgba(245,200,66,0.04) 65%, transparent 100%)',
            border: '1px solid rgba(245,200,66,0.38)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            zIndex: 20, animation: 'coreGlow 4s ease-in-out infinite',
          }}>
            {/* Ping rings */}
            {[{ inset: -9, delay: '0s' }, { inset: -22, delay: '1s' }].map((p, i) => (
              <div key={i} style={{
                position: 'absolute', inset: p.inset, borderRadius: '50%',
                border: '1px solid rgba(245,200,66,0.2)',
                animation: `ping 3s ease-out ${p.delay} infinite`,
              }} />
            ))}
            <span style={{ fontSize: 36, lineHeight: 1 }}>🇮🇳</span>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 7, letterSpacing: '0.3em', color: 'rgba(245,200,66,0.65)', textTransform: 'uppercase', marginTop: 3 }}>India</span>
          </div>

          {/* Region nodes */}
          {REGIONS.map(reg => {
            const isDimmed = matchedRegions.size > 0 ? !matchedRegions.has(reg.id) : false
            const isHl = matchedRegions.has(reg.id)
            return (
              <RegionNode
                key={reg.id} region={reg}
                isActive={activeRegion?.id === reg.id}
                isHighlighted={isHl} isDimmed={isDimmed}
                onClick={() => handleRegionClick(reg)}
              />
            )
          })}
        </div>

        {/* Search + controls */}
        <div style={{ marginTop: 28, display: 'flex', alignItems: 'center', gap: 10, zIndex: 10, position: 'relative', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 13, opacity: 0.3 }}>🔍</span>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search destinations..."
              style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 2, padding: '10px 16px 10px 40px',
                fontSize: 11, fontFamily: "'Space Mono',monospace", letterSpacing: '0.06em',
                color: '#fff', outline: 'none', width: 270, transition: 'border-color 0.3s, background 0.3s',
              }}
              onFocus={e => { e.target.style.borderColor = 'rgba(201,169,110,0.5)'; e.target.style.background = 'rgba(255,255,255,0.07)' }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.05)' }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: 19, height: 19, fontSize: 10, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>✕</button>
            )}
          </div>
          <button onClick={() => setShowGrid(s => !s)} style={{
            background: showGrid ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.12)', borderRadius: 2,
            padding: '10px 20px', fontFamily: "'Space Mono',monospace",
            fontSize: 8, letterSpacing: '0.25em', textTransform: 'uppercase',
            color: showGrid ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.45)', cursor: 'pointer', transition: 'all 0.3s',
          }}>{showGrid ? 'Hide Grid' : 'View All'}</button>
        </div>

        {/* Hint text */}
        <p style={{ fontFamily: "'Space Mono',monospace", fontSize: 7.5, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.12)', marginTop: 16, zIndex: 10 }}>
          Click any region to explore · ESC to close
        </p>
      </div>

      {/* ── DESTINATION GRID ─────────────────────────────────────────────── */}
      {showGrid && (
        <div style={{ position: 'relative', zIndex: 10, background: 'linear-gradient(to bottom, rgba(3,6,15,0) 0%, rgba(3,6,15,1) 60px)', padding: '0 clamp(20px,4vw,56px) 120px' }}>

          {/* Region filter strip */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>
            <button onClick={() => setActiveRegion(null)} style={{
              fontFamily: "'Space Mono',monospace", fontSize: 7.5, letterSpacing: '0.2em', textTransform: 'uppercase',
              padding: '6px 15px', borderRadius: 2, cursor: 'pointer',
              background: !activeRegion ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${!activeRegion ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)'}`,
              color: !activeRegion ? '#fff' : 'rgba(255,255,255,0.38)', transition: 'all 0.2s',
            }}>All Regions</button>
            {REGIONS.map(reg => (
              <button key={reg.id} onClick={() => setActiveRegion(prev => prev?.id === reg.id ? null : reg)} style={{
                fontFamily: "'Space Mono',monospace", fontSize: 7.5, letterSpacing: '0.18em', textTransform: 'uppercase',
                padding: '6px 14px', borderRadius: 2, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6,
                background: activeRegion?.id === reg.id ? `${reg.color}18` : 'rgba(255,255,255,0.02)',
                border: `1px solid ${activeRegion?.id === reg.id ? reg.color + '55' : 'rgba(255,255,255,0.07)'}`,
                color: activeRegion?.id === reg.id ? reg.color : 'rgba(255,255,255,0.38)', transition: 'all 0.2s',
              }}>
                <span style={{ fontSize: 10 }}>{reg.icon}</span> {reg.short}
              </button>
            ))}
          </div>

          {/* Category filter */}
          <div style={{ display: 'flex', gap: 5, marginBottom: 26, flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)} style={{
                fontFamily: "'Space Mono',monospace", fontSize: 7.5, letterSpacing: '0.16em', textTransform: 'uppercase',
                padding: '5px 13px', borderRadius: 100, cursor: 'pointer',
                background: category === cat ? 'rgba(56,189,248,0.18)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${category === cat ? '#38bdf875' : 'rgba(255,255,255,0.07)'}`,
                color: category === cat ? '#38bdf8' : 'rgba(255,255,255,0.32)', transition: 'all 0.2s',
              }}>{cat}</button>
            ))}
          </div>

          {/* Results header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 14 }}>
            <div>
              <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 36, color: '#fff', letterSpacing: '0.02em' }}>{filteredDests.length}</span>
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: 'rgba(255,255,255,0.28)', marginLeft: 10, letterSpacing: '0.2em', textTransform: 'uppercase' }}>destinations found</span>
            </div>
            {(search || activeRegion || category !== 'All') && (
              <button onClick={() => { setSearch(''); setActiveRegion(null); setCategory('All') }}
                style={{ fontFamily: "'Space Mono',monospace", fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(239,68,68,0.55)', background: 'none', border: 'none', cursor: 'pointer' }}>
                Clear all ✕
              </button>
            )}
          </div>

          {/* Grid */}
          {filteredDests.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))', gap: 10 }}>
              {filteredDests.map((d, i) => <DestCard key={`${d.name}-${i}`} dest={d} index={i} onMapClick={openMap} />)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 0', background: 'rgba(255,255,255,0.02)', borderRadius: 3, border: '1px dashed rgba(255,255,255,0.07)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🗺️</div>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>No destinations found</div>
              <button onClick={() => { setSearch(''); setActiveRegion(null); setCategory('All') }}
                style={{ marginTop: 20, padding: '10px 28px', borderRadius: 2, background: 'rgba(56,189,248,0.14)', border: '1px solid rgba(56,189,248,0.38)', color: '#38bdf8', fontFamily: "'Space Mono',monospace", fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer' }}>
                Show Everything
              </button>
            </div>
          )}
        </div>
      )}

      {/* Ticker */}
      <DestinationTicker destinations={destToUse} />

      {/* Detail panel */}
      <DetailPanel region={activeRegion} onClose={() => setActiveRegion(null)} regionDests={regionDests} onMapClick={openMap} />

      {/* Map modal */}
      {mapDest && (
        <MapModal
          isOpen={mapOpen}
          onClose={closeMap}
          destination={mapDest}
        />
      )}
    </div>
  )
}