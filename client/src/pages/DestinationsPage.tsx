import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

// ── DESIGN TOKENS ───────────────────────────────────────────────────────────
const T = {
  saffron: '#E8720C',
  saffronLight: '#F4A340',
  gold: '#C9922A',
  goldLight: '#E8C87A',
  crimson: '#9B1B30',
  crimsonLight: '#C5495A',
  charcoal: '#1A1209',
  velvet: '#120E08',
  ivory: '#FDF6ED',
  ivoryDim: '#F2E8D8',
  emerald: '#1A6B4A',
  emeraldLight: '#2A9C6A',
  goldBorder: 'rgba(201,146,42,0.28)',
}

const FONTS = {
  display: '"Playfair Display", Georgia, serif',
  body: '"Crimson Text", Georgia, serif',
  mono: '"Space Mono", monospace',
}

// ── API region key → UI display label ────────────────────────────────────────
// The API/DB stores short keys ('North', 'South'…); the UI uses long labels.
const API_TO_UI_REGION: Record<string, string> = {
  North:     'North India',
  South:     'South India',
  West:      'West India',
  East:      'East India',
  Northeast: 'Northeast India',
  Central:   'Central India',
  Islands:   'Islands',
}

// ── STATIC CONFIG ────────────────────────────────────────────────────────────
const REGIONS = ['All', 'North India', 'South India', 'West India', 'East India', 'Northeast India', 'Central India', 'Islands']

const REGION_LABELS: Record<string, string> = {
  All: 'All India', 'North India': 'North', 'South India': 'South', 'West India': 'West',
  'East India': 'East', 'Northeast India': 'North-East', 'Central India': 'Central', Islands: 'Islands',
}

const REGION_TAGLINES: Record<string, string> = {
  All: 'One subcontinent. Infinite wonders.',
  'North India': 'Where the Himalayas touch the sky',
  'South India': 'Dravidian temples & emerald backwaters',
  'West India': 'Beaches, deserts & the city of dreams',
  'East India': 'Tea gardens, temples & untamed wild',
  'Northeast India': 'Last wilderness of the subcontinent',
  'Central India': 'Tiger country & ancient temple art',
  Islands: 'Coral kingdoms & turquoise infinity',
}

const REGION_IMAGES: Record<string, string> = {
  All: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1800&q=75',
  'North India': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1800&q=75',
  'South India': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1800&q=75',
  'West India': 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1800&q=75',
  'East India': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1800&q=75',
  'Northeast India': 'https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?auto=format&fit=crop&w=1800&q=75',
  'Central India': 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1800&q=75',
  Islands: 'https://images.unsplash.com/photo-1573790387438-4da905039392?auto=format&fit=crop&w=1800&q=75',
}

// landmark badges shown inside the Region Hub when a region is active
const REGION_LANDMARKS: Record<string, { icon: string; label: string }[]> = {
  'North India': [{ icon: '🏰', label: 'Forts' }, { icon: '🏔️', label: 'Peaks' }, { icon: '🛕', label: 'Temples' }],
  'South India': [{ icon: '🛕', label: 'Temples' }, { icon: '🌴', label: 'Backwaters' }, { icon: '🏛️', label: 'Heritage' }],
  'West India': [{ icon: '🏜️', label: 'Desert' }, { icon: '🏖️', label: 'Beaches' }, { icon: '🏰', label: 'Palaces' }],
  'East India': [{ icon: '🍃', label: 'Tea Gardens' }, { icon: '🐯', label: 'Wildlife' }, { icon: '🛕', label: 'Temples' }],
  'Northeast India': [{ icon: '⛰️', label: 'Valleys' }, { icon: '🌿', label: 'Rainforest' }, { icon: '🎏', label: 'Culture' }],
  'Central India': [{ icon: '🐅', label: 'Tiger Reserves' }, { icon: '🏛️', label: 'Temples' }, { icon: '🌳', label: 'Forests' }],
  Islands: [{ icon: '🏝️', label: 'Islands' }, { icon: '🤿', label: 'Coral Reefs' }, { icon: '🌊', label: 'Beaches' }],
}

const ARCHETYPES = [
  { id: 'heritage', label: 'Heritage & Spiritual', emoji: '🛕', types: ['Cultural', 'Spiritual'] },
  { id: 'himalayan', label: 'Himalayan Treks', emoji: '🏔️', types: ['Mountain', 'Adventure'] },
  { id: 'coastal', label: 'Coastal & Goa', emoji: '🏖️', types: ['Beach', 'Desert'] },
  { id: 'wildlife', label: 'Wildlife Safaris', emoji: '🐅', types: ['Wildlife'] },
]

const TYPE_ICON: Record<string, string> = {
  Beach: '🌊', Mountain: '⛰️', Desert: '🏜️', Wildlife: '🐾', Cultural: '🏛️', Adventure: '🧗', Spiritual: '🕌',
}

// ── REGION VIDEO BACKGROUNDS ─────────────────────────────────────────────────
// Direct MP4 links — autoplay, muted, loop via HTML5 <video>
const REGION_VIDEOS: Record<string, string> = {
  'North India':    'https://videos.pexels.com/video-files/8547787/8547787-hd_1920_1080_24fps.mp4',
  'South India':    'https://videos.pexels.com/video-files/3571264/3571264-hd_1280_720_30fps.mp4',
  'West India':     'https://videos.pexels.com/video-files/5538345/5538345-hd_1920_1080_25fps.mp4',
  'East India':     'https://videos.pexels.com/video-files/4763822/4763822-hd_1920_1080_25fps.mp4',
  'Northeast India':'https://videos.pexels.com/video-files/6985347/6985347-hd_1920_1080_25fps.mp4',
  'Central India':  'https://videos.pexels.com/video-files/3571260/3571260-hd_1280_720_30fps.mp4',
  Islands:          'https://videos.pexels.com/video-files/1409899/1409899-hd_1920_1080_24fps.mp4',
}

// ── REGION HOVER TOOLTIPS ────────────────────────────────────────────────────
const REGION_TOOLTIP: Record<string, { icon: string; text: string }[]> = {
  'North India':    [{ icon: '🏔️', text: 'Himalayan Peaks' }, { icon: '🏰', text: 'Mughal Forts' }],
  'South India':    [{ icon: '🌴', text: 'Palm Lagoons' }, { icon: '🛶', text: 'Houseboat Cruises' }],
  'West India':     [{ icon: '🏜️', text: 'Golden Dunes' }, { icon: '🏖️', text: 'Goan Shores' }],
  'East India':     [{ icon: '🍃', text: 'Tea Estates' }, { icon: '🐯', text: 'Tiger Trails' }],
  'Northeast India':[{ icon: '🌿', text: 'Living Roots' }, { icon: '🎏', text: 'Tribal Culture' }],
  'Central India':  [{ icon: '🐅', text: 'Tiger Country' }, { icon: '🏛️', text: 'Rock Temples' }],
  Islands:          [{ icon: '🏝️', text: 'Coral Atolls' }, { icon: '🤿', text: 'Reef Diving' }],
}

// ── INDIA SVG MAP ZONES ───────────────────────────────────────────────────────
// Each zone is a simplified polygon path that approximates India's geography
// viewBox: 0 0 300 360  (width × height)
const INDIA_ZONES: { id: string; label: string; emoji: string; d: string; labelX: number; labelY: number }[] = [
  {
    id: 'North India',
    label: 'North',
    emoji: '🏔️',
    labelX: 118,
    labelY: 78,
    // Kashmir + Himachal + Punjab + Haryana + UP + Uttarakhand + Rajasthan (top)
    d: 'M 72,10 L 95,8 L 118,4 L 140,6 L 162,12 L 185,20 L 200,35 L 205,52 L 198,65 L 180,72 L 160,75 L 140,80 L 118,85 L 96,80 L 76,72 L 58,60 L 52,44 L 60,28 Z',
  },
  {
    id: 'Northeast India',
    label: 'North-East',
    emoji: '🌿',
    labelX: 224,
    labelY: 80,
    // Assam + Arunachal + Meghalaya + Nagaland + Manipur + Mizoram + Tripura
    d: 'M 200,35 L 240,28 L 265,38 L 272,58 L 260,75 L 238,82 L 218,88 L 205,75 L 198,65 Z',
  },
  {
    id: 'West India',
    label: 'West',
    emoji: '🏜️',
    labelX: 72,
    labelY: 148,
    // Rajasthan (bottom) + Gujarat + Maharashtra (west)
    d: 'M 52,44 L 76,72 L 80,95 L 78,120 L 70,145 L 62,168 L 58,192 L 68,210 L 78,222 L 85,228 L 78,240 L 65,250 L 48,235 L 38,212 L 32,188 L 35,162 L 40,138 L 42,110 L 44,85 L 48,62 Z',
  },
  {
    id: 'Central India',
    label: 'Central',
    emoji: '🐅',
    labelX: 148,
    labelY: 158,
    // MP + Chhattisgarh + Jharkhand
    d: 'M 96,80 L 118,85 L 140,80 L 160,75 L 180,72 L 198,65 L 218,88 L 210,108 L 198,128 L 182,142 L 162,152 L 140,158 L 118,155 L 98,148 L 82,138 L 78,120 L 80,95 Z',
  },
  {
    id: 'East India',
    label: 'East',
    emoji: '🐯',
    labelX: 218,
    labelY: 142,
    // West Bengal + Odisha + Bihar + Jharkhand (east)
    d: 'M 205,75 L 218,88 L 238,82 L 260,75 L 262,100 L 252,120 L 240,138 L 225,155 L 210,162 L 198,148 L 182,142 L 198,128 L 210,108 Z',
  },
  {
    id: 'South India',
    label: 'South',
    emoji: '🌴',
    labelX: 148,
    labelY: 240,
    // Karnataka + Kerala + Tamil Nadu + Andhra + Telangana
    d: 'M 78,222 L 85,228 L 98,148 L 118,155 L 140,158 L 162,152 L 182,142 L 198,148 L 210,162 L 220,180 L 222,202 L 215,222 L 202,240 L 188,258 L 170,272 L 152,282 L 138,286 L 126,282 L 112,272 L 100,255 L 88,238 Z',
  },
  {
    id: 'Islands',
    label: 'Islands',
    emoji: '🏝️',
    labelX: 88,
    labelY: 310,
    // Andaman & Nicobar + Lakshadweep (symbolic small islands)
    d: 'M 70,290 L 78,285 L 88,290 L 94,300 L 90,312 L 80,318 L 70,312 L 66,302 Z M 102,298 L 108,295 L 114,300 L 112,308 L 104,310 L 100,305 Z',
  },
]

const REGION_FILL: Record<string, string> = {
  'North India':    '#3A6B9B',
  'Northeast India':'#2E7A58',
  'West India':     '#B56B2A',
  'Central India':  '#7A4E2D',
  'East India':     '#4E6E3A',
  'South India':    '#2A7A5A',
  Islands:          '#2A5A8A',
}

// ── INTERACTIVE REGION HUB ───────────────────────────────────────────────────
interface HubProps {
  region: string
  onRegionSelect: (r: string) => void
  selectedState: string | null
  onStateSelect: (s: string) => void
  statesForRegion: string[]
}

function RegionHub({ region, onRegionSelect, selectedState, onStateSelect, statesForRegion }: HubProps) {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null)
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const landmarks = region !== 'All' ? REGION_LANDMARKS[region] || [] : []

  const handleZoneMouseMove = (e: React.MouseEvent<SVGElement>, zoneId: string) => {
    const rect = (e.currentTarget.closest('svg') as SVGElement)?.getBoundingClientRect()
    if (rect) {
      setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }
    setHoveredZone(zoneId)
  }

  return (
    <div
      className="rounded-2xl border p-5 md:p-6"
      style={{ borderColor: T.goldBorder, background: 'linear-gradient(160deg, rgba(253,246,237,0.04), rgba(253,246,237,0.01))' }}
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="text-[9px] tracking-[0.4em] uppercase" style={{ fontFamily: FONTS.mono, color: 'rgba(232,194,122,0.55)' }}>
          ◈ Interactive Map of India
        </span>
        <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${T.goldBorder}, transparent)` }} />
      </div>

      {/* ── SVG INDIA MAP ── */}
      <div className="relative" style={{ userSelect: 'none' }}>
        <svg
          viewBox="0 0 300 340"
          className="w-full"
          style={{ filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.6))' }}
          onMouseLeave={() => setHoveredZone(null)}
        >
          {/* Ocean background */}
          <defs>
            <radialGradient id="oceanGrad" cx="50%" cy="60%" r="70%">
              <stop offset="0%" stopColor="#0A1A2E" />
              <stop offset="100%" stopColor="#060D18" />
            </radialGradient>
            <filter id="zoneGlow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <rect width="300" height="340" fill="url(#oceanGrad)" rx="12" />

          {/* Subtle ocean shimmer lines */}
          {[60, 100, 140, 180, 220, 260, 300].map(y => (
            <line key={y} x1="0" y1={y} x2="300" y2={y}
              stroke="rgba(100,180,255,0.04)" strokeWidth="1" />
          ))}

          {/* India zone paths */}
          {INDIA_ZONES.map(zone => {
            const isActive = region === zone.id
            const isHovered = hoveredZone === zone.id
            const baseFill = REGION_FILL[zone.id] || '#555'
            return (
              <g key={zone.id}>
                <path
                  d={zone.d}
                  fill={isActive
                    ? T.saffron + 'EE'
                    : isHovered
                      ? baseFill + 'EE'
                      : baseFill + '99'
                  }
                  stroke={isActive ? T.saffronLight : isHovered ? '#fff' : 'rgba(255,255,255,0.15)'}
                  strokeWidth={isActive ? 1.8 : isHovered ? 1.2 : 0.6}
                  style={{
                    cursor: 'pointer',
                    transition: 'fill 0.3s, stroke 0.2s, filter 0.2s',
                    filter: isActive
                      ? `drop-shadow(0 0 10px ${T.saffron}88)`
                      : isHovered
                        ? `drop-shadow(0 0 8px ${baseFill}AA)`
                        : 'none',
                  }}
                  onClick={() => onRegionSelect(isActive ? 'All' : zone.id)}
                  onMouseMove={e => handleZoneMouseMove(e as any, zone.id)}
                  onMouseLeave={() => setHoveredZone(null)}
                />
                {/* Zone label */}
                <text
                  x={zone.labelX}
                  y={zone.labelY}
                  textAnchor="middle"
                  fontSize={isActive ? 7.5 : 6.5}
                  fontWeight={isActive ? 700 : 500}
                  fill={isActive ? T.ivory : 'rgba(255,255,255,0.65)'}
                  style={{ fontFamily: 'monospace', pointerEvents: 'none', transition: 'all 0.2s' }}
                >
                  {zone.emoji} {zone.label}
                </text>
                {/* Active pulse ring */}
                {isActive && (
                  <circle
                    cx={zone.labelX}
                    cy={zone.labelY - 14}
                    r="5"
                    fill="none"
                    stroke={T.saffronLight}
                    strokeWidth="1"
                    style={{ animation: 'hubPulse 1.8s ease-in-out infinite' }}
                  />
                )}
              </g>
            )
          })}

          {/* Hover tooltip inside SVG */}
          {hoveredZone && REGION_TOOLTIP[hoveredZone] && (
            <g
              transform={`translate(${Math.min(tooltipPos.x + 10, 210)}, ${Math.max(tooltipPos.y - 55, 8)})`}
              style={{ pointerEvents: 'none' }}
            >
              <rect
                x="0" y="0"
                width="88" height={hoveredZone === 'South India' ? 46 : 38}
                rx="6"
                fill="rgba(18,10,4,0.92)"
                stroke={T.saffron + '88'}
                strokeWidth="1"
              />
              {REGION_TOOLTIP[hoveredZone].map((tip, i) => (
                <text key={i} x="8" y={16 + i * 16}
                  fontSize="8" fill={i === 0 ? T.saffronLight : T.goldLight}
                  style={{ fontFamily: 'monospace' }}
                >
                  {tip.icon} {tip.text}
                </text>
              ))}
            </g>
          )}

          {/* Compass rose */}
          <g transform="translate(266, 28)" opacity="0.35">
            <text x="0" y="0" textAnchor="middle" fontSize="7" fill={T.goldLight} style={{ fontFamily: 'monospace' }}>N</text>
            <line x1="0" y1="2" x2="0" y2="9" stroke={T.goldLight} strokeWidth="0.8" />
            <line x1="-6" y1="5" x2="6" y2="5" stroke={T.goldLight} strokeWidth="0.8" />
          </g>
        </svg>

        {/* Hint text */}
        <p className="text-center text-[8px] uppercase tracking-[0.24em] mt-2"
          style={{ fontFamily: FONTS.mono, color: 'rgba(253,246,237,0.22)' }}>
          Hover to preview · Click to explore
        </p>
      </div>

      {/* landmark badges — emerald / saffron pulse, only shown for an active region */}
      {landmarks.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4 mb-2">
          {landmarks.map((l, i) => {
            const glow = i % 2 === 0 ? T.emeraldLight : T.saffronLight
            return (
              <div
                key={l.label}
                className="flex items-center gap-1.5 rounded-full border px-3 py-1.5"
                style={{
                  borderColor: `${glow}55`,
                  background: `${glow}14`,
                  boxShadow: `0 0 14px ${glow}30`,
                  animation: `badgeGlow 2.4s ease-in-out ${i * 0.3}s infinite`,
                }}
              >
                <span className="text-xs">{l.icon}</span>
                <span className="text-[8px] uppercase tracking-[0.15em]" style={{ fontFamily: FONTS.mono, color: glow }}>{l.label}</span>
              </div>
            )
          })}
        </div>
      )}

      {/* state-border buttons */}
      {statesForRegion.length > 0 && (
        <div className="mt-3">
          <div className="text-[8px] uppercase tracking-[0.3em] mb-2" style={{ fontFamily: FONTS.mono, color: 'rgba(253,246,237,0.32)' }}>
            Filter by State
          </div>
          <div className="flex flex-wrap gap-1.5">
            {statesForRegion.map(s => {
              const isActive = selectedState === s
              return (
                <button
                  key={s}
                  onClick={() => onStateSelect(s)}
                  className="rounded-full border px-3 py-1 text-[8.5px] uppercase tracking-[0.12em] transition-all duration-200"
                  style={{
                    fontFamily: FONTS.mono,
                    borderColor: isActive ? T.crimsonLight : 'rgba(201,146,42,0.18)',
                    background: isActive ? `${T.crimson}22` : 'transparent',
                    color: isActive ? T.crimsonLight : 'rgba(253,246,237,0.4)',
                    fontWeight: isActive ? 700 : 400,
                  }}
                >
                  {s}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {region === 'All' && (
        <p className="text-xs italic mt-3" style={{ fontFamily: FONTS.body, color: 'rgba(253,246,237,0.28)' }}>
          Click a region to explore its landmarks and filter destinations.
        </p>
      )}
    </div>
  )
}

// ── LUXURY POSTCARD CARD ─────────────────────────────────────────────────────
interface CardProps {
  dest: any
  index: number
  dimmed: boolean
}

function DestinationCard({ dest, index, dimmed }: CardProps) {
  const [hovered, setHovered] = useState(false)
  const icon = TYPE_ICON[dest.type] || '✦'

  const openMaps = useCallback(() => {
    const q = encodeURIComponent(`${dest.name}, ${dest.state}, India`)
    window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, '_blank', 'noopener,noreferrer')
  }, [dest.name, dest.state])

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-lg overflow-hidden transition-all duration-300"
      style={{
        background: hovered
          ? 'linear-gradient(150deg, #FDF9F2 0%, #F7EDD8 55%, #F2E5C8 100%)'
          : 'linear-gradient(150deg, #FAF5EC 0%, #F4EBD4 55%, #EDE1C5 100%)',
        border: `1px solid ${hovered ? T.saffron + '90' : 'rgba(185,140,55,0.32)'}`,
        boxShadow: hovered
          ? `0 22px 50px rgba(18,14,8,0.5), 0 0 0 1px ${T.saffron}22`
          : '0 4px 14px rgba(18,14,8,0.28)',
        transform: dimmed ? 'none' : hovered ? 'translateY(-6px)' : 'translateY(0)',
        opacity: dimmed ? 0.32 : 1,
        filter: dimmed ? 'grayscale(60%)' : 'none',
        animation: `cardReveal 0.4s ${Math.min(index * 0.02, 0.5)}s both`,
      }}
    >
      <div className="h-[3px]" style={{ background: `linear-gradient(90deg, ${T.saffron}, ${T.crimson}55, transparent)` }} />

      <div className="p-4">
        <div className="flex items-start justify-between mb-2.5">
          <div
            className="inline-flex items-center gap-1.5 rounded px-2 py-1 border"
            style={{ borderColor: `${T.saffron}50`, background: `${T.saffron}10` }}
          >
            <span className="text-[10px]">{icon}</span>
            <span className="text-[7px] uppercase tracking-[0.18em] font-bold" style={{ fontFamily: FONTS.mono, color: T.saffron }}>{dest.type}</span>
          </div>

          {/* circular postmark stamp badge */}
          <div
            className="relative w-9 h-9 rounded-full flex flex-col items-center justify-center border flex-shrink-0"
            style={{
              borderColor: `${T.crimson}55`,
              background: `${T.crimson}08`,
              boxShadow: hovered ? `0 0 10px ${T.crimson}28` : 'none',
            }}
          >
            <div className="absolute inset-0 rounded-full border border-dashed" style={{ borderColor: `${T.crimson}30`, margin: 2 }} />
            <span className="text-[7px] leading-none" style={{ color: '#7A2030' }}>★</span>
            <span style={{ fontFamily: FONTS.display, fontSize: 12, fontWeight: 700, color: '#7A2030', lineHeight: 1.1 }}>{dest.rating}</span>
          </div>
        </div>

        <div style={{ fontFamily: FONTS.display, fontSize: 18, fontWeight: 700, color: '#221808', lineHeight: 1.2, marginBottom: 4 }}>
          {dest.name}
        </div>

        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-px" style={{ background: `${T.saffron}70` }} />
          <span className="text-[7px] uppercase tracking-[0.2em]" style={{ fontFamily: FONTS.mono, color: '#8A6430' }}>{dest.state}</span>
        </div>

        <div className="border-t border-dashed mb-2.5" style={{ borderColor: 'rgba(160,115,48,0.25)' }} />

        <button
          onClick={openMaps}
          title={`Open ${dest.name} in Google Maps`}
          className="w-full flex items-center justify-center gap-2 rounded py-2 border transition-all duration-200"
          style={{
            borderColor: hovered ? `${T.crimson}70` : 'rgba(145,105,40,0.3)',
            background: hovered ? `linear-gradient(135deg, ${T.crimson}18, ${T.saffron}10)` : 'rgba(145,105,40,0.06)',
            color: hovered ? T.crimson : '#7A5C28',
          }}
        >
          <span className="text-[11px]">📍</span>
          <span className="text-[7.5px] uppercase tracking-[0.18em] font-bold" style={{ fontFamily: FONTS.mono }}>View on Map</span>
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none" style={{ opacity: 0.65 }}>
            <path d="M1.5 7.5L7.5 1.5M7.5 1.5H3M7.5 1.5V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}

// ── ARCHETYPE CHIP ───────────────────────────────────────────────────────────
function ArchetypeChip({ archetype, isActive, onClick }: { archetype: typeof ARCHETYPES[0]; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full border px-4 py-2 transition-all duration-200"
      style={{
        fontFamily: FONTS.mono,
        borderColor: isActive ? `${T.gold}80` : 'rgba(185,140,55,0.2)',
        background: isActive ? `linear-gradient(135deg, ${T.gold}22, ${T.gold}08)` : 'rgba(18,14,8,0.4)',
        color: isActive ? T.goldLight : 'rgba(253,246,237,0.45)',
        boxShadow: isActive ? `0 0 18px ${T.gold}28` : 'none',
      }}
    >
      <span className="text-sm">{archetype.emoji}</span>
      <span className="text-[9px] uppercase tracking-[0.16em] font-bold">{archetype.label}</span>
    </button>
  )
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function DestinationsPage() {
  const [region, setRegion] = useState('All')
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const [archetype, setArchetype] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  // ── Live data from API ─────────────────────────────────────────────────────
  const [allDestinations, setAllDestinations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const hasFetched = useRef(false)

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true

    const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

    fetch(`${API}/destinations?limit=200&sort=-rating`)
      .then(res => {
        if (!res.ok) throw new Error(`API error ${res.status}`)
        return res.json()
      })
      .then(json => {
        // Map short API region keys → UI labels so all existing filter logic works
        const mapped = (json?.data?.destinations ?? []).map((d: any) => ({
          ...d,
          region: API_TO_UI_REGION[d.region] ?? d.region,
        }))
        setAllDestinations(mapped)
        setLoading(false)
      })
      .catch(err => {
        console.error('Destinations fetch failed:', err)
        setFetchError(err.message)
        setLoading(false)
      })
  }, [])

  const handleRegionSelect = useCallback((r: string) => {
    setRegion(r)
    setSelectedState(null)
  }, [])

  const handleStateSelect = useCallback((s: string) => {
    setSelectedState(prev => (prev === s ? null : s))
  }, [])

  const handleArchetypeSelect = useCallback((id: string) => {
    setArchetype(prev => (prev === id ? null : id))
  }, [])

  const statesForRegion = useMemo(() => {
    if (region === 'All') return []
    const set = new Set<string>()
    allDestinations.forEach((d: any) => { if (d.region === region) set.add(d.state) })
    return Array.from(set).sort()
  }, [region, allDestinations])

  // base filter — region, archetype and search. selectedState only dims, never removes,
  // so the Region Hub's highlight interaction feels instant rather than a hard re-filter.
  const filtered = useMemo(() => {
    const archObj = ARCHETYPES.find(a => a.id === archetype)
    const q = search.toLowerCase()
    return allDestinations.filter((d: any) => {
      const regionMatch = region === 'All' || d.region === region
      const archMatch = !archObj || archObj.types.includes(d.type)
      const searchMatch = !q || d.name.toLowerCase().includes(q) || d.state.toLowerCase().includes(q) || d.type.toLowerCase().includes(q)
      return regionMatch && archMatch && searchMatch
    })
  }, [region, archetype, search, allDestinations])

  const clearAll = useCallback(() => {
    setRegion('All'); setSelectedState(null); setArchetype(null); setSearch('')
  }, [])

  const hasFilters = region !== 'All' || selectedState || archetype || search

  // ── Loading skeleton ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6"
        style={{ background: T.velvet, color: T.ivory, fontFamily: FONTS.body }}>
        <div style={{ fontFamily: FONTS.display, fontSize: 28, fontWeight: 700, color: T.saffronLight }}>PAVILION</div>
        <div style={{ fontFamily: FONTS.mono, fontSize: 10, letterSpacing: '0.3em', color: 'rgba(232,200,122,0.4)', textTransform: 'uppercase' }}>
          Loading 145 destinations…
        </div>
        {/* Animated dots */}
        <div className="flex gap-2">
          {[0,1,2].map(i => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: '50%', background: T.saffron,
              animation: `hubPulse 1.4s ease-in-out ${i * 0.2}s infinite`,
            }} />
          ))}
        </div>
        <style>{`@keyframes hubPulse { 0%,100%{opacity:0.9;transform:scale(1)}50%{opacity:0.3;transform:scale(1.8)} }`}</style>
      </div>
    )
  }

  // ── Fetch error fallback ─────────────────────────────────────────────────────
  if (fetchError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ background: T.velvet, color: T.ivory, fontFamily: FONTS.body }}>
        <div className="text-5xl">⚠️</div>
        <div style={{ fontFamily: FONTS.display, fontSize: 22, color: T.saffronLight }}>Could not load destinations</div>
        <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: 'rgba(255,100,100,0.7)', letterSpacing: '0.2em' }}>
          {fetchError} — make sure the server is running on port 5000
        </div>
        <button onClick={() => { hasFetched.current = false; setLoading(true); setFetchError(null) }}
          style={{ marginTop: 12, padding: '10px 24px', border: `1px solid ${T.goldBorder}`, borderRadius: 6,
            background: 'transparent', color: T.goldLight, fontFamily: FONTS.mono, fontSize: 10,
            letterSpacing: '0.2em', cursor: 'pointer', textTransform: 'uppercase' }}>
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: T.velvet, color: T.ivory, fontFamily: FONTS.body }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700;900&family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${T.velvet}; }
        ::-webkit-scrollbar-thumb { background: rgba(201,146,42,0.35); border-radius: 4px; }
        input::placeholder { color: rgba(232,200,122,0.28); }
        input:focus { outline: none; }
        @keyframes hubPulse { 0%,100% { opacity: 0.9; transform: scale(1); } 50% { opacity: 0.3; transform: scale(1.8); } }
        @keyframes badgeGlow { 0%,100% { box-shadow: 0 0 8px currentColor; } 50% { box-shadow: 0 0 18px currentColor; } }
        @keyframes cardReveal { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes heroFade { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @media (prefers-reduced-motion: reduce) { * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }
      `}</style>

      {/* ── NAV ── */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-12 h-16 border-b"
        style={{ background: 'rgba(18,14,8,0.92)', backdropFilter: 'blur(16px)', borderColor: 'rgba(185,140,55,0.14)' }}
      >
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full border flex items-center justify-center" style={{ borderColor: `${T.gold}70` }}>
            <div className="w-2 h-2 rounded-full" style={{ background: T.gold }} />
          </div>
          <div>
            <div style={{ fontFamily: FONTS.display, fontSize: 18, fontWeight: 700, letterSpacing: '0.08em', color: T.ivory, lineHeight: 1 }}>PAVILION</div>
            <div className="text-[7px] uppercase tracking-[0.4em]" style={{ fontFamily: FONTS.mono, color: `${T.goldLight}60` }}>India</div>
          </div>
        </Link>
        <div className="hidden md:flex gap-8 text-[9px] uppercase tracking-[0.2em]" style={{ fontFamily: FONTS.mono }}>
          <Link to="/destinations" style={{ color: T.saffronLight, borderBottom: `1px solid ${T.saffronLight}60`, paddingBottom: 2 }}>Destinations</Link>
          <Link to="/tours" style={{ color: 'rgba(253,246,237,0.35)' }}>Tours</Link>
          <Link to="/about" style={{ color: 'rgba(253,246,237,0.35)' }}>About</Link>
          <Link to="/contact" style={{ color: 'rgba(253,246,237,0.35)' }}>Contact</Link>
        </div>
        <Link
          to="/register"
          className="text-[9px] uppercase tracking-[0.18em] border rounded px-4 py-2"
          style={{ fontFamily: FONTS.mono, color: T.gold, borderColor: T.goldBorder }}
        >
          Get Started
        </Link>
      </nav>

      {/* ── CINEMATIC DYNAMIC BANNER ── */}
      <div className="relative h-[60vh] min-h-[420px] flex items-end overflow-hidden">
        {/* Static image base layer */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
          style={{
            backgroundImage: `url(${REGION_IMAGES[region] || REGION_IMAGES.All})`,
            opacity: region !== 'All' && REGION_VIDEOS[region] ? 0 : 1,
          }}
        />

        {/* Video loop layer — fades in when a region with video is selected */}
        {region !== 'All' && REGION_VIDEOS[region] && (
          <video
            key={region}          // remount on region change to restart video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: 1, transition: 'opacity 0.7s ease' }}
          >
            <source src={REGION_VIDEOS[region]} type="video/mp4" />
          </video>
        )}

        {/* Gradient overlays */}
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(180deg, rgba(18,14,8,0.12) 0%, rgba(18,14,8,0.38) 45%, ${T.velvet} 97%)` }}
        />
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(90deg, ${T.velvet}90 0%, transparent 45%, transparent 70%, ${T.velvet}40 100%)` }}
        />

        {/* Region video badge */}
        {region !== 'All' && REGION_VIDEOS[region] && (
          <div
            className="absolute top-5 right-6 flex items-center gap-2 rounded-full border px-3 py-1.5"
            style={{
              borderColor: `${T.saffron}55`,
              background: 'rgba(18,10,4,0.75)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <span className="text-[9px]" style={{ color: T.saffronLight }}>▶</span>
            <span className="text-[8px] uppercase tracking-[0.22em]" style={{ fontFamily: FONTS.mono, color: 'rgba(253,246,237,0.7)' }}>Live Video</span>
          </div>
        )}

        <div className="relative w-full px-6 md:px-14 pb-12" style={{ animation: 'heroFade 0.7s both' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-7 h-px" style={{ background: `linear-gradient(90deg, ${T.saffron}, transparent)` }} />
            <span className="text-[9px] uppercase tracking-[0.42em]" style={{ fontFamily: FONTS.mono, color: T.saffronLight }}>Discover India</span>
          </div>
          <h1
            style={{
              fontFamily: FONTS.display, fontWeight: 900, fontSize: 'clamp(46px,7vw,84px)', lineHeight: 1,
              background: `linear-gradient(135deg, ${T.ivory} 0%, ${T.goldLight} 55%, ${T.saffronLight} 100%)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 14,
            }}
          >
            {region === 'All' ? 'Destinations' : region}
          </h1>
          <p style={{ fontFamily: FONTS.body, fontStyle: 'italic', fontSize: 18, color: 'rgba(253,246,237,0.7)', maxWidth: 460 }}>
            {REGION_TAGLINES[region]}
          </p>
        </div>
      </div>

      {/* ── ARCHETYPE CHIPS ── */}
      <div className="flex flex-wrap justify-center gap-3 px-6 py-7 border-b" style={{ borderColor: 'rgba(185,140,55,0.12)' }}>
        {ARCHETYPES.map(a => (
          <ArchetypeChip key={a.id} archetype={a} isActive={archetype === a.id} onClick={() => handleArchetypeSelect(a.id)} />
        ))}
      </div>

      {/* ── REGION HUB + SEARCH ── */}
      <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-[1fr_360px] gap-8 items-start">
        <div>
          <div className="flex items-baseline gap-3 mb-1">
            <span style={{ fontFamily: FONTS.display, fontSize: 42, fontWeight: 700, color: T.saffronLight, lineHeight: 1 }}>{filtered.length}</span>
            <span className="text-[9px] uppercase tracking-[0.3em]" style={{ fontFamily: FONTS.mono, color: 'rgba(232,200,122,0.4)' }}>
              {filtered.length === 1 ? 'Destination Found' : 'Destinations Found'}
            </span>
          </div>
          <p className="text-sm italic mb-6" style={{ fontFamily: FONTS.body, color: 'rgba(253,246,237,0.4)' }}>
            {selectedState ? `Highlighting destinations in ${selectedState}` : 'Use the hub to explore by region, landmark and state'}
          </p>

          <div className="relative max-w-md mb-4">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm opacity-40">🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search destination, state, type…"
              className="w-full rounded-full border py-3 pl-11 pr-4 text-xs"
              style={{ fontFamily: FONTS.mono, background: 'rgba(255,255,255,0.03)', borderColor: T.goldBorder, color: T.ivory }}
            />
          </div>

          {hasFilters && (
            <button
              onClick={clearAll}
              className="text-[8.5px] uppercase tracking-[0.18em] rounded-full border px-4 py-2"
              style={{ fontFamily: FONTS.mono, borderColor: 'rgba(200,60,60,0.3)', color: 'rgba(220,100,100,0.8)', background: 'rgba(200,60,60,0.08)' }}
            >
              Clear All Filters ✕
            </button>
          )}
        </div>

        <RegionHub
          region={region}
          onRegionSelect={handleRegionSelect}
          selectedState={selectedState}
          onStateSelect={handleStateSelect}
          statesForRegion={statesForRegion}
        />
      </div>

      {/* ── POSTCARD GRID ── */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        <div className="flex items-center gap-4 mb-6 pt-6 border-t" style={{ borderColor: 'rgba(185,140,55,0.1)' }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: T.saffron, boxShadow: `0 0 10px ${T.saffron}` }} />
          <span className="text-[9px] uppercase tracking-[0.3em]" style={{ fontFamily: FONTS.mono, color: 'rgba(232,200,122,0.4)' }}>Postcard Collection</span>
          <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${T.saffron}40, transparent)` }} />
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {filtered.map((d: any, i: number) => (
              <DestinationCard
                key={`${d.name}-${i}`}
                dest={d}
                index={i}
                dimmed={!!selectedState && d.state !== selectedState}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 rounded-2xl border border-dashed" style={{ borderColor: 'rgba(185,140,55,0.14)' }}>
            <div className="text-5xl mb-4">🗺️</div>
            <div style={{ fontFamily: FONTS.display, fontSize: 26, color: 'rgba(253,246,237,0.32)' }}>No destinations found</div>
            <p className="text-sm italic mt-2 mb-6" style={{ fontFamily: FONTS.body, color: 'rgba(253,246,237,0.22)' }}>Try adjusting your filters or search query</p>
            <button
              onClick={clearAll}
              className="px-6 py-2.5 rounded text-[9px] uppercase tracking-[0.2em] border"
              style={{ fontFamily: FONTS.mono, color: T.goldLight, borderColor: T.goldBorder, background: `${T.gold}10` }}
            >
              Show Everything
            </button>
          </div>
        )}
      </div>
    </div>
  )
}