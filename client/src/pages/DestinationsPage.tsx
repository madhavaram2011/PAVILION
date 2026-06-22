import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

// ── DESIGN TOKENS — Luxury Indian Editorial Light Journal ────────────────────
const T = {
  // Light base palette (mirrors HomePage)
  cream:        '#FDF6EC',
  cream2:       '#F7EDD8',
  mist:         '#FAF3E6',
  ivory:        '#FDFBF7',
  ivoryDim:     '#F2E8D8',
  stone50:      '#FAFAF9',

  // Primary accents — warm Indian palette
  saffron:      '#F4A228',   // festive marigold gold (amber-500 equivalent)
  saffronLight: '#F7B845',
  amber:        '#C8531A',   // terracotta / amber-600
  gold:         '#D4922A',
  goldLight:    '#E8C87A',
  crimson:      '#9B1B30',   // sunset crimson / rose-600
  crimsonLight: '#C5495A',

  // Emerald green — Palace Emerald
  emerald:      '#0A5C3E',
  emeraldLight: '#0D7A52',

  // Typography — deep charcoal / mahogany
  mahogany:     '#2C1204',
  charcoal:     '#1C1917',   // stone-900
  body:         '#44403C',   // stone-700
  muted:        '#78716C',   // stone-500
  subtle:       '#A8A29E',   // stone-400

  // Border tokens
  goldBorder:   'rgba(212,146,42,0.18)',
  stoneBorder:  'rgba(28,25,23,0.10)',
}

const FONTS = {
  display: '"Playfair Display", Georgia, serif',
  body:    '"Crimson Text", Georgia, serif',
  mono:    '"Space Mono", monospace',
  sans:    '"Inter", sans-serif',
}

// ── API region key → UI display label ────────────────────────────────────────
const API_TO_UI_REGION: Record<string, string> = {
  North:     'North India',
  South:     'South India',
  West:      'West India',
  East:      'East India',
  Northeast: 'Northeast India',
  Central:   'Central India',
  Islands:   'Islands',
}

// ── STATIC CONFIG ─────────────────────────────────────────────────────────────
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
  'North India':    [{ icon: '🏰', label: 'Forts' }, { icon: '🏔️', label: 'Peaks' }, { icon: '🛕', label: 'Temples' }],
  'South India':    [{ icon: '🛕', label: 'Temples' }, { icon: '🌴', label: 'Backwaters' }, { icon: '🏛️', label: 'Heritage' }],
  'West India':     [{ icon: '🏜️', label: 'Desert' }, { icon: '🏖️', label: 'Beaches' }, { icon: '🏰', label: 'Palaces' }],
  'East India':     [{ icon: '🍃', label: 'Tea Gardens' }, { icon: '🐯', label: 'Wildlife' }, { icon: '🛕', label: 'Temples' }],
  'Northeast India':[{ icon: '⛰️', label: 'Valleys' }, { icon: '🌿', label: 'Rainforest' }, { icon: '🎏', label: 'Culture' }],
  'Central India':  [{ icon: '🐅', label: 'Tiger Reserves' }, { icon: '🏛️', label: 'Temples' }, { icon: '🌳', label: 'Forests' }],
  Islands:          [{ icon: '🏝️', label: 'Islands' }, { icon: '🤿', label: 'Coral Reefs' }, { icon: '🌊', label: 'Beaches' }],
}

const ARCHETYPES = [
  { id: 'heritage',  label: 'Heritage & Spiritual', emoji: '🛕', types: ['Cultural', 'Spiritual'] },
  { id: 'himalayan', label: 'Himalayan Treks',       emoji: '🏔️', types: ['Mountain', 'Adventure'] },
  { id: 'coastal',   label: 'Coastal & Goa',         emoji: '🏖️', types: ['Beach', 'Desert'] },
  { id: 'wildlife',  label: 'Wildlife Safaris',       emoji: '🐅', types: ['Wildlife'] },
]

const TYPE_ICON: Record<string, string> = {
  Beach: '🌊', Mountain: '⛰️', Desert: '🏜️', Wildlife: '🐾', Cultural: '🏛️', Adventure: '🧗', Spiritual: '🕌',
}

// ── REGION VIDEO BACKGROUNDS ──────────────────────────────────────────────────
const REGION_VIDEOS: Record<string, string> = {
  'North India':    'https://videos.pexels.com/video-files/8547787/8547787-hd_1920_1080_24fps.mp4',
  'South India':    'https://videos.pexels.com/video-files/3571264/3571264-hd_1280_720_30fps.mp4',
  'West India':     'https://videos.pexels.com/video-files/5538345/5538345-hd_1920_1080_25fps.mp4',
  'East India':     'https://videos.pexels.com/video-files/4763822/4763822-hd_1920_1080_25fps.mp4',
  'Northeast India':'https://videos.pexels.com/video-files/6985347/6985347-hd_1920_1080_25fps.mp4',
  'Central India':  'https://videos.pexels.com/video-files/3571260/3571260-hd_1280_720_30fps.mp4',
  Islands:          'https://videos.pexels.com/video-files/1409899/1409899-hd_1920_1080_24fps.mp4',
}

// ── REGION HOVER TOOLTIPS ─────────────────────────────────────────────────────
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
// viewBox: 0 0 300 360
const INDIA_ZONES: { id: string; label: string; emoji: string; d: string; labelX: number; labelY: number }[] = [
  {
    id: 'North India', label: 'North', emoji: '🏔️', labelX: 118, labelY: 78,
    d: 'M 72,10 L 95,8 L 118,4 L 140,6 L 162,12 L 185,20 L 200,35 L 205,52 L 198,65 L 180,72 L 160,75 L 140,80 L 118,85 L 96,80 L 76,72 L 58,60 L 52,44 L 60,28 Z',
  },
  {
    id: 'Northeast India', label: 'North-East', emoji: '🌿', labelX: 224, labelY: 80,
    d: 'M 200,35 L 240,28 L 265,38 L 272,58 L 260,75 L 238,82 L 218,88 L 205,75 L 198,65 Z',
  },
  {
    id: 'West India', label: 'West', emoji: '🏜️', labelX: 72, labelY: 148,
    d: 'M 52,44 L 76,72 L 80,95 L 78,120 L 70,145 L 62,168 L 58,192 L 68,210 L 78,222 L 85,228 L 78,240 L 65,250 L 48,235 L 38,212 L 32,188 L 35,162 L 40,138 L 42,110 L 44,85 L 48,62 Z',
  },
  {
    id: 'Central India', label: 'Central', emoji: '🐅', labelX: 148, labelY: 158,
    d: 'M 96,80 L 118,85 L 140,80 L 160,75 L 180,72 L 198,65 L 218,88 L 210,108 L 198,128 L 182,142 L 162,152 L 140,158 L 118,155 L 98,148 L 82,138 L 78,120 L 80,95 Z',
  },
  {
    id: 'East India', label: 'East', emoji: '🐯', labelX: 218, labelY: 142,
    d: 'M 205,75 L 218,88 L 238,82 L 260,75 L 262,100 L 252,120 L 240,138 L 225,155 L 210,162 L 198,148 L 182,142 L 198,128 L 210,108 Z',
  },
  {
    id: 'South India', label: 'South', emoji: '🌴', labelX: 148, labelY: 240,
    d: 'M 78,222 L 85,228 L 98,148 L 118,155 L 140,158 L 162,152 L 182,142 L 198,148 L 210,162 L 220,180 L 222,202 L 215,222 L 202,240 L 188,258 L 170,272 L 152,282 L 138,286 L 126,282 L 112,272 L 100,255 L 88,238 Z',
  },
  {
    id: 'Islands', label: 'Islands', emoji: '🏝️', labelX: 88, labelY: 310,
    d: 'M 70,290 L 78,285 L 88,290 L 94,300 L 90,312 L 80,318 L 70,312 L 66,302 Z M 102,298 L 108,295 L 114,300 L 112,308 L 104,310 L 100,305 Z',
  },
]

// Light-theme friendly fills for each region — warm muted tones
const REGION_FILL: Record<string, string> = {
  'North India':    '#6B9FC0',
  'Northeast India':'#5BA87A',
  'West India':     '#D4895A',
  'Central India':  '#A0714A',
  'East India':     '#7A9A5C',
  'South India':    '#4D9E7A',
  Islands:          '#4D85B5',
}

// ── INTERACTIVE REGION HUB ────────────────────────────────────────────────────
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
      style={{
        borderColor: T.goldBorder,
        background: 'rgba(255,255,255,0.60)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 2px 16px rgba(44,18,4,0.06)',
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="text-[9px] tracking-[0.4em] uppercase" style={{ fontFamily: FONTS.mono, color: T.muted }}>
          ◈ Interactive Map of India
        </span>
        <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${T.goldBorder}, transparent)` }} />
      </div>

      {/* ── SVG INDIA MAP ── */}
      <div className="relative" style={{ userSelect: 'none' }}>
        <svg
          viewBox="0 0 300 340"
          className="w-full"
          style={{ filter: 'drop-shadow(0 4px 16px rgba(44,18,4,0.10))' }}
          onMouseLeave={() => setHoveredZone(null)}
        >
          {/* Ocean background — warm azure for light theme */}
          <defs>
            <radialGradient id="oceanGradLight" cx="50%" cy="60%" r="70%">
              <stop offset="0%"   stopColor="#C8DFF0" />
              <stop offset="100%" stopColor="#A8C8E8" />
            </radialGradient>
            <filter id="zoneGlowLight">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <rect width="300" height="340" fill="url(#oceanGradLight)" rx="12" />

          {/* Subtle ocean shimmer lines */}
          {[60, 100, 140, 180, 220, 260, 300].map(y => (
            <line key={y} x1="0" y1={y} x2="300" y2={y}
              stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
          ))}

          {/* India zone paths */}
          {INDIA_ZONES.map((zone: any) => {
            const isActive  = region === zone.id
            const isHovered = hoveredZone === zone.id
            const baseFill  = REGION_FILL[zone.id] || '#888'
            return (
              <g key={zone.id}>
                <path
                  d={zone.d}
                  fill={isActive
                    ? T.amber + 'EE'
                    : isHovered
                      ? baseFill + 'EE'
                      : baseFill + 'BB'
                  }
                  stroke={isActive ? T.saffron : isHovered ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.45)'}
                  strokeWidth={isActive ? 1.8 : isHovered ? 1.2 : 0.6}
                  style={{
                    cursor: 'pointer',
                    transition: 'fill 0.3s, stroke 0.2s, filter 0.2s',
                    filter: isActive
                      ? `drop-shadow(0 0 10px ${T.amber}88)`
                      : isHovered
                        ? `drop-shadow(0 0 8px ${baseFill}99)`
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
                  fill={isActive ? '#FFF' : 'rgba(255,255,255,0.85)'}
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
                width="92" height={hoveredZone === 'South India' ? 46 : 38}
                rx="6"
                fill="rgba(253,246,236,0.96)"
                stroke={T.amber + '80'}
                strokeWidth="1"
              />
              {REGION_TOOLTIP[hoveredZone].map((tip: any, i: number) => (
                <text key={i} x="8" y={16 + i * 16}
                  fontSize="8" fill={i === 0 ? T.amber : T.gold}
                  style={{ fontFamily: 'monospace' }}
                >
                  {tip.icon} {tip.text}
                </text>
              ))}
            </g>
          )}

          {/* Compass rose */}
          <g transform="translate(266, 28)" opacity="0.5">
            <text x="0" y="0" textAnchor="middle" fontSize="7" fill={T.gold} style={{ fontFamily: 'monospace' }}>N</text>
            <line x1="0" y1="2" x2="0" y2="9" stroke={T.gold} strokeWidth="0.8" />
            <line x1="-6" y1="5" x2="6" y2="5" stroke={T.gold} strokeWidth="0.8" />
          </g>
        </svg>

        {/* Hint text */}
        <p className="text-center text-[8px] uppercase tracking-[0.24em] mt-2"
          style={{ fontFamily: FONTS.mono, color: T.subtle }}>
          Hover to preview · Click to explore
        </p>
      </div>

      {/* landmark badges — emerald / saffron pulse, only shown for an active region */}
      {landmarks.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4 mb-2">
          {landmarks.map((l: any, i: number) => {
            const isEven = i % 2 === 0
            const borderCol = isEven ? T.emerald : T.amber
            const bgCol     = isEven ? 'rgba(10,92,62,0.08)' : 'rgba(200,83,26,0.08)'
            return (
              <div
                key={l.label}
                className="flex items-center gap-1.5 rounded-full border px-3 py-1.5"
                style={{
                  borderColor: `${borderCol}50`,
                  background: bgCol,
                  animation: `badgeGlow 2.4s ease-in-out ${i * 0.3}s infinite`,
                }}
              >
                <span className="text-xs">{l.icon}</span>
                <span className="text-[8px] uppercase tracking-[0.15em]" style={{ fontFamily: FONTS.mono, color: borderCol }}>{l.label}</span>
              </div>
            )
          })}
        </div>
      )}

      {/* state-border buttons */}
      {statesForRegion.length > 0 && (
        <div className="mt-3">
          <div className="text-[8px] uppercase tracking-[0.3em] mb-2" style={{ fontFamily: FONTS.mono, color: T.subtle }}>
            Filter by State
          </div>
          <div className="flex flex-wrap gap-1.5">
            {statesForRegion.map((s: any) => {
              const isActive = selectedState === s
              return (
                <button
                  key={s}
                  onClick={() => onStateSelect(s)}
                  className="rounded-full border px-3 py-1 text-[8.5px] uppercase tracking-[0.12em] transition-all duration-200"
                  style={{
                    fontFamily: FONTS.mono,
                    borderColor: isActive ? T.crimson : T.goldBorder,
                    background: isActive ? `${T.crimson}12` : 'transparent',
                    color: isActive ? T.crimson : T.muted,
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
        <p className="text-xs italic mt-3" style={{ fontFamily: FONTS.body, color: T.subtle }}>
          Click a region to explore its landmarks and filter destinations.
        </p>
      )}
    </div>
  )
}

// ── LUXURY POSTCARD CARD ──────────────────────────────────────────────────────
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
          ? 'linear-gradient(150deg, #FFFFFF 0%, #FDF6EC 55%, #F7EDD8 100%)'
          : 'linear-gradient(150deg, #FDFBF7 0%, #FAF3E6 55%, #F2E8D8 100%)',
        border: `1px solid ${hovered ? T.amber + '70' : 'rgba(212,146,42,0.22)'}`,
        boxShadow: hovered
          ? `0 22px 50px rgba(44,18,4,0.12), 0 0 0 1px ${T.amber}18`
          : '0 2px 10px rgba(44,18,4,0.06)',
        transform: dimmed ? 'none' : hovered ? 'translateY(-6px)' : 'translateY(0)',
        opacity: dimmed ? 0.32 : 1,
        filter: dimmed ? 'grayscale(40%)' : 'none',
        animation: `cardReveal 0.4s ${Math.min(index * 0.02, 0.5)}s both`,
      }}
    >
      {/* Top accent line — saffron to crimson gradient */}
      <div className="h-[3px]" style={{ background: `linear-gradient(90deg, ${T.saffron}, ${T.crimson}66, transparent)` }} />

      <div className="p-4">
        <div className="flex items-start justify-between mb-2.5">
          {/* Type badge */}
          <div
            className="inline-flex items-center gap-1.5 rounded px-2 py-1 border"
            style={{ borderColor: `${T.amber}40`, background: `${T.amber}0E` }}
          >
            <span className="text-[10px]">{icon}</span>
            <span className="text-[7px] uppercase tracking-[0.18em] font-bold" style={{ fontFamily: FONTS.mono, color: T.amber }}>{dest.type}</span>
          </div>

          {/* Postmark stamp badge */}
          <div
            className="relative w-9 h-9 rounded-full flex flex-col items-center justify-center border flex-shrink-0"
            style={{
              borderColor: `${T.crimson}44`,
              background: `${T.crimson}08`,
              boxShadow: hovered ? `0 0 10px ${T.crimson}22` : 'none',
            }}
          >
            <div className="absolute inset-0 rounded-full border border-dashed" style={{ borderColor: `${T.crimson}28`, margin: 2 }} />
            <span className="text-[7px] leading-none" style={{ color: T.crimson }}>★</span>
            <span style={{ fontFamily: FONTS.display, fontSize: 12, fontWeight: 700, color: T.crimson, lineHeight: 1.1 }}>{dest.rating}</span>
          </div>
        </div>

        {/* Destination name */}
        <div style={{ fontFamily: FONTS.display, fontSize: 18, fontWeight: 700, color: T.charcoal, lineHeight: 1.2, marginBottom: 4 }}>
          {dest.name}
        </div>

        {/* State label */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-px" style={{ background: `${T.amber}80` }} />
          <span className="text-[7px] uppercase tracking-[0.2em]" style={{ fontFamily: FONTS.mono, color: T.body }}>{dest.state}</span>
        </div>

        <div className="border-t border-dashed mb-2.5" style={{ borderColor: 'rgba(212,146,42,0.18)' }} />

        {/* Maps button */}
        <button
          onClick={openMaps}
          title={`Open ${dest.name} in Google Maps`}
          className="w-full flex items-center justify-center gap-2 rounded py-2 border transition-all duration-200"
          style={{
            borderColor: hovered ? `${T.crimson}60` : T.goldBorder,
            background: hovered ? `linear-gradient(135deg, ${T.crimson}12, ${T.amber}0A)` : 'rgba(212,146,42,0.04)',
            color: hovered ? T.crimson : T.body,
          }}
        >
          <span className="text-[11px]">📍</span>
          <span className="text-[7.5px] uppercase tracking-[0.18em] font-bold" style={{ fontFamily: FONTS.mono }}>View on Map</span>
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none" style={{ opacity: 0.55 }}>
            <path d="M1.5 7.5L7.5 1.5M7.5 1.5H3M7.5 1.5V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}

// ── ARCHETYPE CHIP ────────────────────────────────────────────────────────────
function ArchetypeChip({ archetype, isActive, onClick }: { archetype: typeof ARCHETYPES[0]; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full border px-4 py-2 transition-all duration-200"
      style={{
        fontFamily: FONTS.mono,
        borderColor: isActive ? `${T.amber}70` : T.goldBorder,
        background: isActive
          ? `linear-gradient(135deg, ${T.amber}18, ${T.saffron}0C)`
          : 'rgba(255,255,255,0.50)',
        color: isActive ? T.amber : T.muted,
        boxShadow: isActive ? `0 4px 18px ${T.amber}20` : 'none',
        backdropFilter: 'blur(8px)',
      }}
    >
      <span className="text-sm">{archetype.emoji}</span>
      <span className="text-[9px] uppercase tracking-[0.16em] font-bold">{archetype.label}</span>
    </button>
  )
}

// ── MAIN PAGE ──────────────────────────────────────────────────────────────────
export default function DestinationsPage() {
  const [region, setRegion]             = useState('All')
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const [archetype, setArchetype]       = useState<string | null>(null)
  const [search, setSearch]             = useState('')

  // ── Live data from API ────────────────────────────────────────────────────
  const [allDestinations, setAllDestinations] = useState<any[]>([])
  const [loading, setLoading]                 = useState(true)
  const [fetchError, setFetchError]           = useState<string | null>(null)
  const hasFetched                            = useRef(false)

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

  const filtered = useMemo(() => {
    const archObj = ARCHETYPES.find(a => a.id === archetype)
    const q = search.toLowerCase()
    return allDestinations.filter((d: any) => {
      const regionMatch = region === 'All' || d.region === region
      const archMatch   = !archObj || archObj.types.includes(d.type)
      const searchMatch = !q || d.name.toLowerCase().includes(q) || d.state.toLowerCase().includes(q) || d.type.toLowerCase().includes(q)
      return regionMatch && archMatch && searchMatch
    })
  }, [region, archetype, search, allDestinations])

  const clearAll = useCallback(() => {
    setRegion('All'); setSelectedState(null); setArchetype(null); setSearch('')
  }, [])

  const hasFilters = region !== 'All' || selectedState || archetype || search

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-6"
        style={{ background: T.ivory, fontFamily: FONTS.body }}
      >
        {/* Tricolour top bar */}
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, display: 'flex', zIndex: 50 }}>
          <div style={{ flex: 1, background: '#FF9933' }} />
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.9)' }} />
          <div style={{ flex: 1, background: '#138808' }} />
        </div>
        <div style={{ fontFamily: FONTS.display, fontSize: 28, fontWeight: 700, color: T.amber }}>PAVILION</div>
        <div style={{ fontFamily: FONTS.mono, fontSize: 10, letterSpacing: '0.3em', color: T.muted, textTransform: 'uppercase' }}>
          Loading destinations…
        </div>
        <div className="flex gap-2">
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: '50%', background: T.amber,
              animation: `hubPulse 1.4s ease-in-out ${i * 0.2}s infinite`,
            }} />
          ))}
        </div>
        <style>{`@keyframes hubPulse { 0%,100%{opacity:0.9;transform:scale(1)}50%{opacity:0.3;transform:scale(1.8)} }`}</style>
      </div>
    )
  }

  // ── Fetch error fallback ───────────────────────────────────────────────────
  if (fetchError) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ background: T.ivory, fontFamily: FONTS.body }}
      >
        <div className="text-5xl">⚠️</div>
        <div style={{ fontFamily: FONTS.display, fontSize: 22, color: T.amber }}>Could not load destinations</div>
        <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: T.crimson, letterSpacing: '0.2em' }}>
          {fetchError} — make sure the server is running on port 5000
        </div>
        <button
          onClick={() => { hasFetched.current = false; setLoading(true); setFetchError(null) }}
          style={{
            marginTop: 12, padding: '10px 24px',
            border: `1px solid ${T.goldBorder}`, borderRadius: 6,
            background: 'transparent', color: T.amber,
            fontFamily: FONTS.mono, fontSize: 10,
            letterSpacing: '0.2em', cursor: 'pointer', textTransform: 'uppercase',
          }}
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: T.ivory, color: T.charcoal, fontFamily: FONTS.body }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700;900&family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Space+Mono:wght@400;700&family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${T.mist}; }
        ::-webkit-scrollbar-thumb { background: rgba(212,146,42,0.30); border-radius: 4px; }
        input::placeholder { color: ${T.subtle}; }
        input:focus { outline: none; }
        @keyframes hubPulse   { 0%,100% { opacity: 0.9; transform: scale(1); } 50% { opacity: 0.3; transform: scale(1.8); } }
        @keyframes badgeGlow  { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }
        @keyframes cardReveal { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes heroFade   { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @media (prefers-reduced-motion: reduce) { * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }
      `}</style>

      {/* Tricolour stripe at very top */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, display: 'flex', zIndex: 100 }}>
        <div style={{ flex: 1, background: '#FF9933' }} />
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.9)' }} />
        <div style={{ flex: 1, background: '#138808' }} />
      </div>

      {/* ── NAV ── */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-12 h-16 border-b"
        style={{
          background: 'rgba(253,251,247,0.92)',
          backdropFilter: 'blur(16px)',
          borderColor: T.goldBorder,
          marginTop: 3,
        }}
      >
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full border flex items-center justify-center" style={{ borderColor: `${T.gold}70` }}>
            <div className="w-2 h-2 rounded-full" style={{ background: T.gold }} />
          </div>
          <div>
            <div style={{ fontFamily: FONTS.display, fontSize: 18, fontWeight: 700, letterSpacing: '0.08em', color: T.mahogany, lineHeight: 1 }}>PAVILION</div>
            <div className="text-[7px] uppercase tracking-[0.4em]" style={{ fontFamily: FONTS.mono, color: T.muted }}>India</div>
          </div>
        </Link>

        <div className="hidden md:flex gap-8 text-[9px] uppercase tracking-[0.2em]" style={{ fontFamily: FONTS.mono }}>
          <Link to="/destinations" style={{ color: T.amber, borderBottom: `1px solid ${T.amber}70`, paddingBottom: 2 }}>Destinations</Link>
          <Link to="/tours"        style={{ color: T.muted, textDecoration: 'none' }} className="hover:text-amber-600 transition-colors">Tours</Link>
          <Link to="/about"        style={{ color: T.muted, textDecoration: 'none' }} className="hover:text-amber-600 transition-colors">About</Link>
          <Link to="/contact"      style={{ color: T.muted, textDecoration: 'none' }} className="hover:text-amber-600 transition-colors">Contact</Link>
        </div>

        <Link
          to="/register"
          className="text-[9px] uppercase tracking-[0.18em] border rounded px-4 py-2 transition-all duration-200"
          style={{ fontFamily: FONTS.mono, color: T.amber, borderColor: T.goldBorder }}
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

        {/* Video loop layer */}
        {region !== 'All' && REGION_VIDEOS[region] && (
          <video
            key={region}
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

        {/* Gradient overlays — lighter base, still atmospheric */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(44,18,4,0.08) 0%, rgba(44,18,4,0.30) 45%, rgba(44,18,4,0.72) 97%)' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(90deg, rgba(44,18,4,0.60) 0%, transparent 45%, transparent 70%, rgba(44,18,4,0.25) 100%)` }}
        />

        {/* Live video badge */}
        {region !== 'All' && REGION_VIDEOS[region] && (
          <div
            className="absolute top-5 right-6 flex items-center gap-2 rounded-full border px-3 py-1.5"
            style={{
              borderColor: `${T.saffron}55`,
              background: 'rgba(253,246,236,0.85)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <span className="text-[9px]" style={{ color: T.amber }}>▶</span>
            <span className="text-[8px] uppercase tracking-[0.22em]" style={{ fontFamily: FONTS.mono, color: T.body }}>Live Video</span>
          </div>
        )}

        {/* Hero copy */}
        <div className="relative w-full px-6 md:px-14 pb-12" style={{ animation: 'heroFade 0.7s both' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-7 h-px" style={{ background: `linear-gradient(90deg, ${T.saffron}, transparent)` }} />
            <span className="text-[9px] uppercase tracking-[0.42em]" style={{ fontFamily: FONTS.mono, color: T.saffronLight }}>Discover India</span>
          </div>
          <h1
            style={{
              fontFamily: FONTS.display, fontWeight: 900, fontSize: 'clamp(46px,7vw,84px)', lineHeight: 1,
              background: `linear-gradient(135deg, #FFFFFF 0%, ${T.goldLight} 55%, ${T.saffronLight} 100%)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 14,
            }}
          >
            {region === 'All' ? 'Destinations' : region}
          </h1>
          <p style={{ fontFamily: FONTS.body, fontStyle: 'italic', fontSize: 18, color: 'rgba(253,246,237,0.80)', maxWidth: 460 }}>
            {REGION_TAGLINES[region]}
          </p>
        </div>
      </div>

      {/* ── ARCHETYPE CHIPS ── */}
      <div
        className="flex flex-wrap justify-center gap-3 px-6 py-7 border-b"
        style={{ borderColor: T.goldBorder, background: `linear-gradient(180deg, ${T.cream2} 0%, ${T.mist} 100%)` }}
      >
        {ARCHETYPES.map(a => (
          <ArchetypeChip key={a.id} archetype={a} isActive={archetype === a.id} onClick={() => handleArchetypeSelect(a.id)} />
        ))}
      </div>

      {/* ── REGION HUB + SEARCH ── */}
      <div
        className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-[1fr_360px] gap-8 items-start"
        style={{ background: T.ivory }}
      >
        <div>
          {/* Count + label */}
          <div className="flex items-baseline gap-3 mb-1">
            <span style={{ fontFamily: FONTS.display, fontSize: 42, fontWeight: 700, color: T.amber, lineHeight: 1 }}>{filtered.length}</span>
            <span className="text-[9px] uppercase tracking-[0.3em]" style={{ fontFamily: FONTS.mono, color: T.muted }}>
              {filtered.length === 1 ? 'Destination Found' : 'Destinations Found'}
            </span>
          </div>
          <p className="text-sm italic mb-6" style={{ fontFamily: FONTS.body, color: T.body }}>
            {selectedState
              ? `Highlighting destinations in ${selectedState}`
              : 'Use the hub to explore by region, landmark and state'}
          </p>

          {/* Search input */}
          <div className="relative max-w-md mb-4">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ opacity: 0.5 }}>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search destination, state, type…"
              className="w-full rounded-full border py-3 pl-11 pr-4 text-xs transition-all duration-200"
              style={{
                fontFamily: FONTS.mono,
                background: 'rgba(255,255,255,0.80)',
                borderColor: T.goldBorder,
                color: T.charcoal,
                backdropFilter: 'blur(8px)',
                boxShadow: '0 1px 6px rgba(44,18,4,0.06)',
              }}
            />
          </div>

          {/* Clear all button */}
          {hasFilters && (
            <button
              onClick={clearAll}
              className="text-[8.5px] uppercase tracking-[0.18em] rounded-full border px-4 py-2 transition-all duration-200"
              style={{
                fontFamily: FONTS.mono,
                borderColor: `${T.crimson}30`,
                color: T.crimson,
                background: `${T.crimson}08`,
              }}
            >
              Clear All Filters ✕
            </button>
          )}
        </div>

        {/* Region Hub map */}
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
        {/* Section divider */}
        <div className="flex items-center gap-4 mb-6 pt-6 border-t" style={{ borderColor: T.goldBorder }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: T.amber }} />
          <span className="text-[9px] uppercase tracking-[0.3em]" style={{ fontFamily: FONTS.mono, color: T.muted }}>Postcard Collection</span>
          <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${T.goldBorder}, transparent)` }} />
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
          <div
            className="text-center py-24 rounded-2xl border border-dashed"
            style={{
              borderColor: T.goldBorder,
              background: 'rgba(255,255,255,0.50)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div className="text-5xl mb-4">🗺️</div>
            <div style={{ fontFamily: FONTS.display, fontSize: 26, color: T.muted }}>No destinations found</div>
            <p className="text-sm italic mt-2 mb-6" style={{ fontFamily: FONTS.body, color: T.subtle }}>
              Try adjusting your filters or search query
            </p>
            <button
              onClick={clearAll}
              className="px-6 py-2.5 rounded text-[9px] uppercase tracking-[0.2em] border transition-all duration-200"
              style={{
                fontFamily: FONTS.mono,
                color: T.amber,
                borderColor: T.goldBorder,
                background: `${T.amber}0C`,
              }}
            >
              Show Everything
            </button>
          </div>
        )}
      </div>

      {/* ── FOOTER FLOURISH ── */}
      <footer
        className="border-t py-10 px-6 text-center"
        style={{ borderColor: T.goldBorder, background: T.cream2 }}
      >
        <div style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: 700, color: T.mahogany, marginBottom: 6 }}>PAVILION</div>
        <p style={{ fontFamily: FONTS.mono, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: T.subtle }}>
          Curated journeys across the Indian subcontinent
        </p>
        <div className="flex justify-center gap-6 mt-6 text-[8px] uppercase tracking-[0.2em]" style={{ fontFamily: FONTS.mono }}>
          {['/', '/destinations', '/tours', '/about', '/contact'].map((href, i) => (
            <Link
              key={href}
              to={href}
              style={{ color: T.muted, textDecoration: 'none' }}
              className="hover:text-amber-600 transition-colors"
            >
              {['Home', 'Destinations', 'Tours', 'About', 'Contact'][i]}
            </Link>
          ))}
        </div>
        <p style={{ fontFamily: FONTS.mono, fontSize: 8, color: T.subtle, marginTop: 20 }}>
          © {new Date().getFullYear()} Pavilion India · All rights reserved
        </p>
      </footer>
    </div>
  )
}