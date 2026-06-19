import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { FiArrowRight, FiClock, FiUsers, FiMapPin, FiArrowDown, FiSun } from 'react-icons/fi'
import { GiCompass } from 'react-icons/gi'

// ─────────────────────────────────────────────────────────────────────────────
// CHOOSE YOUR INDIA — category data, image/description pairs verified to match
// ─────────────────────────────────────────────────────────────────────────────
const JOURNEYS = [
  {
    id: 'heritage',
    label: 'Heritage',
    mark: 'I',
    color: '#C8722C',
    headline: 'Stone that remembers everything',
    body: 'Mughal marble, Rajput sandstone, Dravidian temple towers carved over centuries. India\'s heritage isn\'t roped off behind glass — it\'s lived in, prayed in, and walked through daily.',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1400&q=85',
    places: ['Taj Mahal, Agra', 'Amber Fort, Jaipur', 'Mehrangarh, Jodhpur', 'Khajjiar Nag Temple'],
  },
  {
    id: 'spiritual',
    label: 'Spiritual',
    mark: 'II',
    color: '#B8924A',
    headline: 'A stillness older than memory',
    body: 'Lamps drift across the Ganges at dusk in Varanasi, smoke curling off the ghats as bells ring out over the water. Five thousand years of ritual, unbroken, waiting on the riverbank.',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1400&q=85',
    places: ['Varanasi Ghats, UP', 'Golden Temple, Amritsar', 'Pushkar Lake, Rajasthan', 'Tsuglagkhang, McLeod Ganj'],
  },
  {
    id: 'wilderness',
    label: 'Wilderness',
    mark: 'III',
    color: '#5B7A52',
    headline: 'Wild at a scale that humbles',
    body: 'Bengal tigers move unhurried through dry deciduous forest beneath the ruins of a 10th-century fort. Crocodiles bask in quiet lakes. The wild here has never needed an audience.',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1400&q=85',
    places: ['Ranthambore, Rajasthan', 'Kalatop Sanctuary, HP', 'Great Himalayan NP', 'Pin Valley, Spiti'],
  },
  {
    id: 'adventure',
    label: 'Adventure',
    mark: 'IV',
    color: '#A14E3B',
    headline: 'The Himalaya keeps no promises easy',
    body: 'Cross a 4,550-metre pass into a cold desert where monasteries cling to cliff faces. Camp beside a turquoise lake at the edge of the map. This is mountain travel with real stakes.',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1400&q=85',
    places: ['Spiti Valley, Himachal', 'Rohtang Pass, Manali', 'Chandratal Lake', 'Triund Trek, Dharamshala'],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// SEASON DATA
// ─────────────────────────────────────────────────────────────────────────────
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const SEASON_DATA = [
  { region: 'Rajasthan & North Plains', icon: '🏰', color: '#C8722C', months: [2, 2, 2, 3, 4, 4, 4, 4, 3, 1, 1, 1], tip: 'Oct–Mar is ideal — cool desert nights and clear skies for fort exploration.' },
  { region: 'Kerala & South Coast', icon: '🌴', color: '#0F6B4C', months: [1, 1, 2, 2, 3, 4, 4, 4, 3, 2, 1, 1], tip: 'Nov–Feb is perfect for backwaters and beaches before the monsoon arrives.' },
  { region: 'Ladakh & High Himalaya', icon: '🏔️', color: '#A14E3B', months: [4, 4, 4, 4, 3, 2, 1, 1, 2, 3, 4, 4], tip: 'Jul–Sep is the window — roads open, skies clear, the high lakes at their most vivid.' },
  { region: 'Himachal Hill Country', icon: '🌲', color: '#5B7A52', months: [4, 4, 2, 2, 1, 1, 3, 3, 1, 2, 3, 4], tip: 'Mar–Jun and Sep–Nov bring clear valley views before and after the monsoon.' },
  { region: 'Northeast India', icon: '🌿', color: '#27613F', months: [2, 2, 1, 1, 2, 4, 4, 4, 3, 1, 1, 2], tip: 'Oct–Apr is when living root bridges are most accessible and skies clearest.' },
  { region: 'Andaman Islands', icon: '🐠', color: '#2D6E8E', months: [1, 1, 1, 1, 2, 4, 4, 4, 3, 2, 1, 1], tip: 'Oct–May — dive season, bioluminescent nights, calm turquoise water.' },
]
const SEASON_COLORS = {
  1: { bg: '#0F6B4C', label: 'Peak' },
  2: { bg: '#C8722C', label: 'Good' },
  3: { bg: '#D9C7A3', label: 'Fair' },
  4: { bg: 'rgba(31,27,22,0.10)', label: 'Avoid' },
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK TOURS — fallback itinerary dossiers, used until the API responds
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_TOURS = [
  {
    _id: 'mock-1',
    slug: 'spiti-cold-desert-circuit',
    title: 'The Spiti Cold Desert Circuit',
    destination: { name: 'Spiti Valley, Himachal Pradesh' },
    coverImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&q=85',
    duration: 7,
    groupSize: { max: 10 },
    difficulty: 'Demanding',
    price: 48500,
    discountPrice: 42900,
    highlights: [
      'Key Monastery at dawn, before the day-trippers arrive',
      'Camp overnight on the shore of Chandratal Lake',
      'Cross Kunzum Pass at 4,551 metres',
      'Visit Hikkim, the world\'s highest post office',
    ],
  },
  {
    _id: 'mock-2',
    slug: 'varanasi-ganges-immersion',
    title: 'Varanasi: A Ganges Immersion',
    destination: { name: 'Varanasi, Uttar Pradesh' },
    coverImage: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1200&q=85',
    duration: 4,
    groupSize: { max: 8 },
    difficulty: 'Gentle',
    price: 24000,
    discountPrice: null,
    highlights: [
      'Sunrise boat ride past eighty-four ghats',
      'Private seat at the evening Ganga Aarti',
      'Walking tour of the silk weaving lanes',
      'Morning at Sarnath, where the Buddha first taught',
    ],
  },
  {
    _id: 'mock-3',
    slug: 'rajasthan-forts-and-deserts',
    title: 'Rajasthan: Forts & Golden Sands',
    destination: { name: 'Jaipur to Jaisalmer, Rajasthan' },
    coverImage: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1200&q=85',
    duration: 9,
    groupSize: { max: 12 },
    difficulty: 'Moderate',
    price: 67000,
    discountPrice: 59900,
    highlights: [
      'Private dawn entry to Amber Fort, before the gates open to the public',
      'Overnight in a heritage haveli inside the living fort of Jaisalmer',
      'Camel safari into the Sam dunes for sunset',
      'Blue-lane walking tour of old Jodhpur',
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// AMBIENT MOTIF CANVAS — quiet line-drawn compass rose, used once, in the hero
// ─────────────────────────────────────────────────────────────────────────────
function CompassMotif({ color }: { color: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const W = 520
    canvas.width = W
    canvas.height = W
    const cx = W / 2
    const cy = W / 2
    let t = 0
    const hex = color.replace('#', '')
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)

    const draw = () => {
      t += 0.0022
      ctx.clearRect(0, 0, W, W)

        // outer hairline rings
        ;[226, 188, 150].forEach((rad, i) => {
          ctx.beginPath()
          ctx.arc(cx, cy, rad, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(${r},${g},${b},${0.08 + i * 0.02})`
          ctx.lineWidth = 0.6
          ctx.stroke()
        })

      // rotating tick marks like a compass face
      for (let i = 0; i < 36; i++) {
        const a = (i / 36) * Math.PI * 2 + t
        const inner = i % 9 === 0 ? 196 : 212
        const outer = 226
        const x1 = cx + inner * Math.cos(a)
        const y1 = cy + inner * Math.sin(a)
        const x2 = cx + outer * Math.cos(a)
        const y2 = cy + outer * Math.sin(a)
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.strokeStyle = `rgba(${r},${g},${b},${i % 9 === 0 ? 0.5 : 0.18})`
        ctx.lineWidth = i % 9 === 0 ? 1.3 : 0.6
        ctx.stroke()
      }

      // slow needle
      const a1 = t * 0.7
      const a2 = a1 + Math.PI
      ctx.beginPath()
      ctx.moveTo(cx + 92 * Math.cos(a1), cy + 92 * Math.sin(a1))
      ctx.lineTo(cx, cy)
      ctx.lineTo(cx + 92 * Math.cos(a2), cy + 92 * Math.sin(a2))
      ctx.strokeStyle = `rgba(${r},${g},${b},0.55)`
      ctx.lineWidth = 1
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(cx, cy, 4, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${r},${g},${b},0.8)`
      ctx.fill()

      animRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(animRef.current)
  }, [color])
  return <canvas ref={ref} style={{ width: '100%', height: '100%' }} />
}

// ─────────────────────────────────────────────────────────────────────────────
// HOVER-UNDERLINE LINK — shared micro-interaction for CTAs
// ─────────────────────────────────────────────────────────────────────────────
function UnderlineLink({
  to,
  children,
  color = '#1F1B16',
  size = 12,
}: {
  to: string
  children: React.ReactNode
  color?: string
  size?: number
}) {
  const [hover, setHover] = useState(false)
  return (
    <Link
      to={to}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        fontFamily: '"Inter",sans-serif',
        fontSize: size,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        fontWeight: 600,
        color,
        textDecoration: 'none',
        paddingBottom: 4,
      }}
    >
      <span style={{ position: 'relative' }}>
        {children}
        <motion.span
          initial={{ scaleX: 0 }}
          animate={{ scaleX: hover ? 1 : 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: -4,
            height: 1,
            background: color,
            transformOrigin: 'left',
          }}
        />
      </span>
      <motion.span animate={{ x: hover ? 4 : 0 }} transition={{ duration: 0.25 }} style={{ display: 'flex' }}>
        <FiArrowRight size={size} />
      </motion.span>
    </Link>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO — cinematic, minimal, no stat bar, no "Incredible India"
// ─────────────────────────────────────────────────────────────────────────────
function HeroSection() {
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)
  const springX = useSpring(mouseX, { stiffness: 26, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 26, damping: 20 })
  const pX = useTransform(springX, [0, 1], [-16, 16])
  const pY = useTransform(springY, [0, 1], [-9, 9])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
      mouseX.set((e.clientX - rect.left) / rect.width)
      mouseY.set((e.clientY - rect.top) / rect.height)
    },
    [mouseX, mouseY]
  )

  return (
    <section
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative',
        minHeight: '92vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        background: '#FDFBF7',
      }}
    >
      {/* faint paper texture line */}
      <div style={{ position: 'absolute', top: 56, left: 0, right: 0, height: 1, background: 'rgba(31,27,22,0.08)' }} />

      {/* ambient compass motif, right side */}
      <motion.div
        style={{
          position: 'absolute',
          right: 'clamp(-6vw,-2vw,2vw)',
          top: '50%',
          translateY: '-50%',
          width: 'clamp(360px,40vw,560px)',
          height: 'clamp(360px,40vw,560px)',
          x: pX,
          y: pY,
          opacity: 0.9,
        }}
      >
        <CompassMotif color="#C8722C" />
      </motion.div>

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: 1320,
          margin: '0 auto',
          padding: '0 clamp(28px,6vw,96px)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 30 }}
        >
          <div style={{ width: 40, height: 1, background: '#C8722C' }} />
          <span
            style={{
              fontFamily: '"Inter",sans-serif',
              fontSize: 11,
              letterSpacing: '0.42em',
              textTransform: 'uppercase',
              color: '#8A6A3D',
              fontWeight: 600,
            }}
          >
            Pavilion — A Travel Journal of India
          </span>
        </motion.div>

        <div style={{ overflow: 'hidden' }}>
          <motion.h1
            initial={{ y: '110%' }}
            animate={{ y: '0%' }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: '"Fraunces",serif',
              fontWeight: 480,
              fontStyle: 'normal',
              fontSize: 'clamp(2.6rem,6.2vw,5.6rem)',
              lineHeight: 1.04,
              letterSpacing: '-0.01em',
              color: '#1F1B16',
              margin: 0,
              maxWidth: 920,
            }}
          >
            Journeys written slowly,
          </motion.h1>
        </div>
        <div style={{ overflow: 'hidden' }}>
          <motion.h1
            initial={{ y: '110%' }}
            animate={{ y: '0%' }}
            transition={{ duration: 0.9, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: '"Fraunces",serif',
              fontWeight: 480,
              fontStyle: 'italic',
              fontSize: 'clamp(2.6rem,6.2vw,5.6rem)',
              lineHeight: 1.04,
              letterSpacing: '-0.01em',
              color: '#C8722C',
              margin: 0,
              maxWidth: 920,
            }}
          >
            across an old country.
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          style={{
            fontFamily: '"Inter",sans-serif',
            fontSize: 'clamp(15px,1.3vw,17px)',
            lineHeight: 1.75,
            color: 'rgba(31,27,22,0.62)',
            maxWidth: 480,
            margin: '28px 0 0',
          }}
        >
          No checklists. No crowds chasing the same photograph. Pavilion plans journeys
          around the people, rituals, and landscapes that make each region of India
          unmistakably itself.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          style={{ display: 'flex', gap: 40, alignItems: 'center', marginTop: 44, flexWrap: 'wrap' }}
        >
          <Link
            to="/destinations"
            style={{
              background: '#0F6B4C',
              color: '#FDFBF7',
              fontFamily: '"Inter",sans-serif',
              fontSize: 12,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontWeight: 600,
              padding: '16px 34px',
              borderRadius: 2,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              boxShadow: '0 10px 28px rgba(15,107,76,0.22)',
            }}
            onMouseEnter={(e) => {
              ; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
                ; (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 36px rgba(15,107,76,0.3)'
            }}
            onMouseLeave={(e) => {
              ; (e.currentTarget as HTMLElement).style.transform = 'none'
                ; (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 28px rgba(15,107,76,0.22)'
            }}
          >
            Begin a Journey
          </Link>

          <UnderlineLink to="/tours">Read the Itineraries</UnderlineLink>
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        style={{
          position: 'absolute',
          bottom: 30,
          left: 'clamp(28px,6vw,96px)',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
          <FiArrowDown size={14} color="rgba(31,27,22,0.32)" />
        </motion.div>
        <span
          style={{
            fontFamily: '"Inter",sans-serif',
            fontSize: 10,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(31,27,22,0.32)',
          }}
        >
          Scroll to wander
        </span>
      </motion.div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CHOOSE YOUR INDIA — quiet tabbed dossier, accurate image/copy per category
// ─────────────────────────────────────────────────────────────────────────────
function JourneyExplorer() {
  const [active, setActive] = useState(0)
  const cur = JOURNEYS[active]

  return (
    <section style={{ position: 'relative', background: '#FDFBF7', borderTop: '1px solid rgba(31,27,22,0.08)' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '120px clamp(28px,6vw,96px)' }}>
        <div style={{ marginBottom: 64, maxWidth: 620 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div style={{ width: 40, height: 1, background: '#C8722C' }} />
            <span
              style={{
                fontFamily: '"Inter",sans-serif',
                fontSize: 11,
                letterSpacing: '0.36em',
                textTransform: 'uppercase',
                color: '#8A6A3D',
                fontWeight: 600,
              }}
            >
              Four Ways to Travel
            </span>
          </div>
          <h2
            style={{
              fontFamily: '"Fraunces",serif',
              fontWeight: 480,
              fontSize: 'clamp(2.4rem,4.6vw,4rem)',
              lineHeight: 1.06,
              color: '#1F1B16',
              margin: 0,
            }}
          >
            Choose your <span style={{ fontStyle: 'italic', color: '#C8722C' }}>India</span>
          </h2>
          <p
            style={{
              fontFamily: '"Inter",sans-serif',
              fontSize: 16,
              lineHeight: 1.8,
              color: 'rgba(31,27,22,0.6)',
              marginTop: 18,
            }}
          >
            India is not one place. It is every place. These are the four lenses we
            travel through most — pick the one that calls to you.
          </p>
        </div>

        {/* Tab row */}
        <div
          style={{
            display: 'flex',
            gap: 0,
            borderTop: '1px solid rgba(31,27,22,0.12)',
            borderBottom: '1px solid rgba(31,27,22,0.12)',
            flexWrap: 'wrap',
          }}
        >
          {JOURNEYS.map((j, i) => (
            <button
              key={j.id}
              onClick={() => setActive(i)}
              style={{
                flex: '1 1 200px',
                textAlign: 'left',
                padding: '22px 22px',
                background: active === i ? 'rgba(200,114,44,0.06)' : 'transparent',
                border: 'none',
                borderRight: '1px solid rgba(31,27,22,0.1)',
                borderBottom: active === i ? `2px solid ${j.color}` : '2px solid transparent',
                cursor: 'pointer',
                transition: 'background 0.3s ease, border-color 0.3s ease',
              }}
            >
              <span
                style={{
                  fontFamily: '"Inter",sans-serif',
                  fontSize: 10,
                  letterSpacing: '0.2em',
                  color: active === i ? j.color : 'rgba(31,27,22,0.3)',
                  display: 'block',
                  marginBottom: 6,
                  fontWeight: 600,
                }}
              >
                {j.mark}
              </span>
              <span
                style={{
                  fontFamily: '"Fraunces",serif',
                  fontSize: 22,
                  color: active === i ? '#1F1B16' : 'rgba(31,27,22,0.34)',
                  display: 'block',
                  transition: 'color 0.3s ease',
                }}
              >
                {j.label}
              </span>
            </button>
          ))}
        </div>

        {/* Content panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 0,
              marginTop: 0,
            }}
          >
            <div
              style={{
                padding: '54px 56px 54px 0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <h3
                style={{
                  fontFamily: '"Fraunces",serif',
                  fontStyle: 'italic',
                  fontSize: 'clamp(1.7rem,2.6vw,2.5rem)',
                  lineHeight: 1.18,
                  color: '#1F1B16',
                  marginBottom: 18,
                }}
              >
                {cur.headline}
              </h3>
              <p
                style={{
                  fontFamily: '"Inter",sans-serif',
                  fontSize: 16,
                  lineHeight: 1.85,
                  color: 'rgba(31,27,22,0.62)',
                  marginBottom: 30,
                }}
              >
                {cur.body}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 36 }}>
                {cur.places.map((p) => (
                  <span
                    key={p}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      fontFamily: '"Inter",sans-serif',
                      fontSize: 11,
                      letterSpacing: '0.03em',
                      padding: '7px 14px',
                      borderRadius: 100,
                      background: `${cur.color}10`,
                      border: `1px solid ${cur.color}38`,
                      color: cur.color,
                      fontWeight: 500,
                    }}
                  >
                    <FiMapPin size={10} />
                    {p}
                  </span>
                ))}
              </div>
              <UnderlineLink to="/destinations" color={cur.color}>
                Explore this path
              </UnderlineLink>
            </div>

            <div style={{ position: 'relative', overflow: 'hidden', minHeight: 440 }}>
              <motion.div
                key={cur.image}
                initial={{ scale: 1.08, opacity: 0.6 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url(${cur.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(135deg, ${cur.color}22 0%, transparent 55%)`,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 24,
                  right: 28,
                  fontFamily: '"Fraunces",serif',
                  fontStyle: 'italic',
                  fontSize: 15,
                  letterSpacing: '0.04em',
                  color: '#FDFBF7',
                  background: 'rgba(31,27,22,0.45)',
                  padding: '8px 16px',
                  borderRadius: 2,
                  backdropFilter: 'blur(6px)',
                }}
              >
                {cur.label}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ITINERARY DOSSIER CARD — for Featured Tours
// ─────────────────────────────────────────────────────────────────────────────
function ItineraryCard({ tour, index }: { tour: any; index: number }) {
  const [hover, setHover] = useState(false)
  const price = tour.discountPrice ?? tour.price
  const hasDiscount = Boolean(tour.discountPrice) && tour.discountPrice < tour.price

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: '#FFFFFF',
        border: '1px solid rgba(31,27,22,0.1)',
        borderRadius: 4,
        overflow: 'hidden',
        transition: 'box-shadow 0.35s ease, transform 0.35s ease',
        transform: hover ? 'translateY(-6px)' : 'none',
        boxShadow: hover ? '0 22px 50px rgba(31,27,22,0.12)' : '0 2px 12px rgba(31,27,22,0.05)',
      }}
    >
      {/* Image with dossier numbering */}
      <div style={{ position: 'relative', height: 210, overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${tour.coverImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: hover ? 'scale(1.06)' : 'scale(1)',
            transition: 'transform 0.7s ease',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(31,27,22,0.55) 0%, transparent 50%)',
          }}
        />
        <span
          style={{
            position: 'absolute',
            top: 16,
            left: 16,
            fontFamily: '"Fraunces",serif',
            fontStyle: 'italic',
            fontSize: 28,
            color: 'rgba(253,251,247,0.85)',
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        <span
          style={{
            position: 'absolute',
            bottom: 14,
            left: 16,
            fontFamily: '"Inter",sans-serif',
            fontSize: 10,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#FDFBF7',
            background: 'rgba(31,27,22,0.55)',
            padding: '5px 11px',
            borderRadius: 2,
          }}
        >
          {tour.difficulty}
        </span>
      </div>

      {/* Dossier body */}
      <div style={{ padding: '26px 26px 28px' }}>
        <p
          style={{
            fontFamily: '"Inter",sans-serif',
            fontSize: 10,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#C8722C',
            fontWeight: 600,
            margin: '0 0 8px',
          }}
        >
          {tour.destination?.name}
        </p>
        <h3
          style={{
            fontFamily: '"Fraunces",serif',
            fontSize: 25,
            lineHeight: 1.2,
            color: '#1F1B16',
            margin: '0 0 18px',
          }}
        >
          {tour.title}
        </h3>

        {/* day-by-day highlight bullets */}
        <ul style={{ listStyle: 'none', margin: '0 0 22px', padding: 0 }}>
          {(tour.highlights || []).slice(0, 4).map((h: string, i: number) => (
            <li
              key={i}
              style={{
                display: 'flex',
                gap: 12,
                alignItems: 'flex-start',
                marginBottom: 11,
                fontFamily: '"Inter",sans-serif',
                fontSize: 13.5,
                lineHeight: 1.6,
                color: 'rgba(31,27,22,0.68)',
              }}
            >
              <span
                style={{
                  fontFamily: '"JetBrains Mono",monospace',
                  fontSize: 10,
                  color: '#C8722C',
                  paddingTop: 2,
                  flexShrink: 0,
                  width: 14,
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span>{h}</span>
            </li>
          ))}
        </ul>

        {/* metadata badges */}
        <div
          style={{
            display: 'flex',
            gap: 16,
            paddingTop: 18,
            borderTop: '1px solid rgba(31,27,22,0.1)',
            marginBottom: 18,
          }}
        >
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontFamily: '"Inter",sans-serif',
              fontSize: 11.5,
              color: 'rgba(31,27,22,0.55)',
            }}
          >
            <FiClock size={12} color="#C8722C" /> {tour.duration} days
          </span>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontFamily: '"Inter",sans-serif',
              fontSize: 11.5,
              color: 'rgba(31,27,22,0.55)',
            }}
          >
            <FiUsers size={12} color="#C8722C" /> Max {tour.groupSize?.max}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            {hasDiscount && (
              <span
                style={{
                  display: 'block',
                  fontFamily: '"Inter",sans-serif',
                  fontSize: 11,
                  color: 'rgba(31,27,22,0.35)',
                  textDecoration: 'line-through',
                }}
              >
                ₹{tour.price?.toLocaleString('en-IN')}
              </span>
            )}
            <span
              style={{
                fontFamily: '"Fraunces",serif',
                fontSize: 19,
                color: '#0F6B4C',
              }}
            >
              ₹{price?.toLocaleString('en-IN')}
            </span>
          </div>
          <Link
            to={`/tours/${tour.slug}`}
            style={{
              fontFamily: '"Inter",sans-serif',
              fontSize: 11,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              fontWeight: 600,
              color: '#1F1B16',
              textDecoration: 'none',
              borderBottom: '1px solid #1F1B16',
              paddingBottom: 2,
            }}
          >
            View Dossier
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// BEST TIME TO VISIT
// ─────────────────────────────────────────────────────────────────────────────
function BestTimeSection() {
  const [activeMonth, setActiveMonth] = useState<number | null>(null)
  const peakThisMonth =
    activeMonth !== null ? SEASON_DATA.filter((r) => r.months[activeMonth] === 1).map((r) => r.region) : []
  const goodThisMonth =
    activeMonth !== null ? SEASON_DATA.filter((r) => r.months[activeMonth] === 2).map((r) => r.region) : []

  return (
    <section style={{ position: 'relative', padding: '120px clamp(28px,6vw,96px)', background: '#F7F1E6' }}>
      <div style={{ maxWidth: 1140, margin: '0 auto' }}>
        <div style={{ marginBottom: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <FiSun size={16} color="#C8722C" />
            <span
              style={{
                fontFamily: '"Inter",sans-serif',
                fontSize: 11,
                letterSpacing: '0.36em',
                textTransform: 'uppercase',
                color: '#8A6A3D',
                fontWeight: 600,
              }}
            >
              Plan Your Trip
            </span>
          </div>
          <h2
            style={{
              fontFamily: '"Fraunces",serif',
              fontWeight: 480,
              fontSize: 'clamp(2.3rem,4.4vw,3.8rem)',
              lineHeight: 1.08,
              color: '#1F1B16',
              margin: 0,
            }}
          >
            Best time to <span style={{ fontStyle: 'italic', color: '#0F6B4C' }}>visit India</span>
          </h2>
          <p
            style={{
              fontFamily: '"Inter",sans-serif',
              fontSize: 16,
              color: 'rgba(31,27,22,0.6)',
              marginTop: 18,
              maxWidth: 540,
              lineHeight: 1.8,
            }}
          >
            India's geography is vast enough that every month is perfect somewhere.
            Tap a month to see where.
          </p>
        </div>

        {/* Month buttons */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 28, flexWrap: 'wrap' }}>
          {MONTHS.map((m, i) => {
            const isActive = activeMonth === i
            const peakCount = SEASON_DATA.filter((r) => r.months[i] === 1).length
            return (
              <button
                key={m}
                onClick={() => setActiveMonth(isActive ? null : i)}
                style={{
                  position: 'relative',
                  padding: '10px 17px',
                  borderRadius: 2,
                  fontFamily: '"Inter",sans-serif',
                  fontSize: 11,
                  letterSpacing: '0.08em',
                  background: isActive ? '#0F6B4C' : '#FDFBF7',
                  border: `1px solid ${isActive ? '#0F6B4C' : 'rgba(31,27,22,0.14)'}`,
                  color: isActive ? '#FDFBF7' : '#1F1B16',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {m}
                {peakCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: -6,
                      right: -6,
                      width: 16,
                      height: 16,
                      background: '#C8722C',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: '"JetBrains Mono",monospace',
                      fontSize: 8,
                      color: '#FDFBF7',
                      fontWeight: 700,
                    }}
                  >
                    {peakCount}
                  </span>
                )}
              </button>
            )
          })}
          {activeMonth !== null && (
            <button
              onClick={() => setActiveMonth(null)}
              style={{
                padding: '10px 14px',
                borderRadius: 2,
                fontFamily: '"Inter",sans-serif',
                fontSize: 10,
                background: 'transparent',
                border: '1px solid rgba(31,27,22,0.16)',
                color: 'rgba(31,27,22,0.45)',
                cursor: 'pointer',
                letterSpacing: '0.05em',
              }}
            >
              Clear
            </button>
          )}
        </div>

        <AnimatePresence>
          {activeMonth !== null && (
            <motion.div
              key={activeMonth}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                marginBottom: 28,
                padding: '18px 22px',
                background: '#FDFBF7',
                border: '1px solid rgba(200,114,44,0.28)',
                borderRadius: 4,
                display: 'flex',
                gap: 36,
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: '"Inter",sans-serif',
                    fontSize: 10,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'rgba(31,27,22,0.4)',
                    margin: '0 0 4px',
                  }}
                >
                  Peak in {MONTHS[activeMonth]}
                </p>
                <p
                  style={{
                    fontFamily: '"Fraunces",serif',
                    fontSize: 19,
                    color: '#0F6B4C',
                    margin: 0,
                  }}
                >
                  {peakThisMonth.length > 0 ? peakThisMonth.join(' · ') : 'No peak regions this month'}
                </p>
              </div>
              {goodThisMonth.length > 0 && (
                <div>
                  <p
                    style={{
                      fontFamily: '"Inter",sans-serif',
                      fontSize: 10,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: 'rgba(31,27,22,0.4)',
                      margin: '0 0 4px',
                    }}
                  >
                    Also good
                  </p>
                  <p
                    style={{
                      fontFamily: '"Fraunces",serif',
                      fontSize: 16,
                      color: '#C8722C',
                      margin: 0,
                    }}
                  >
                    {goodThisMonth.join(' · ')}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Season grid */}
        <div style={{ overflowX: 'auto', marginBottom: 36 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
            <thead>
              <tr>
                <th
                  style={{
                    fontFamily: '"Inter",sans-serif',
                    fontSize: 10,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'rgba(31,27,22,0.4)',
                    textAlign: 'left',
                    padding: '0 12px 18px 0',
                    fontWeight: 500,
                    width: 200,
                  }}
                >
                  Region
                </th>
                {MONTHS.map((m, i) => (
                  <th
                    key={m}
                    onClick={() => setActiveMonth(activeMonth === i ? null : i)}
                    style={{
                      fontFamily: '"Inter",sans-serif',
                      fontSize: 11,
                      color: activeMonth === i ? '#C8722C' : 'rgba(31,27,22,0.5)',
                      padding: '0 0 18px',
                      textAlign: 'center',
                      fontWeight: activeMonth === i ? 700 : 400,
                      cursor: 'pointer',
                      width: 42,
                    }}
                  >
                    {m}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SEASON_DATA.map((row) => (
                <tr key={row.region} style={{ borderTop: '1px solid rgba(31,27,22,0.08)' }}>
                  <td style={{ padding: '11px 12px 11px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <span style={{ fontSize: 16 }}>{row.icon}</span>
                      <p style={{ fontFamily: '"Inter",sans-serif', fontSize: 12, color: '#1F1B16', margin: 0 }}>
                        {row.region}
                      </p>
                    </div>
                  </td>
                  {row.months.map((rating, mi) => {
                    const sc = SEASON_COLORS[rating as keyof typeof SEASON_COLORS]
                    return (
                      <td key={mi} style={{ padding: '11px 2px', textAlign: 'center' }}>
                        <div
                          title={`${row.region} in ${MONTHS[mi]}: ${sc.label}`}
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: 3,
                            margin: '0 auto',
                            background: sc.bg,
                            border: activeMonth === mi ? '2px solid rgba(31,27,22,0.35)' : '2px solid transparent',
                            transition: 'border 0.2s',
                          }}
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
          <span
            style={{
              fontFamily: '"Inter",sans-serif',
              fontSize: 10,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(31,27,22,0.4)',
            }}
          >
            Legend
          </span>
          {Object.entries(SEASON_COLORS).map(([k, v]) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 14, height: 14, borderRadius: 3, background: v.bg, border: '1px solid rgba(31,27,22,0.1)' }} />
              <span style={{ fontFamily: '"Inter",sans-serif', fontSize: 11.5, color: 'rgba(31,27,22,0.55)' }}>
                {v.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// FINAL CTA — warm, welcoming, no fake address grid
// ─────────────────────────────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section
      style={{
        position: 'relative',
        padding: '130px clamp(28px,6vw,96px)',
        background: '#1F1B16',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            "url('https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1600&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.1,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 40%, rgba(200,114,44,0.1) 0%, transparent 65%)',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <GiCompass style={{ color: '#C8722C', fontSize: 36, marginBottom: 24 }} />
          <h2
            style={{
              fontFamily: '"Fraunces",serif',
              fontWeight: 480,
              fontSize: 'clamp(2.4rem,5.5vw,4.6rem)',
              lineHeight: 1.08,
              color: '#FDFBF7',
              margin: '0 0 22px',
            }}
          >
            Come and see it <span style={{ fontStyle: 'italic', color: '#C8722C' }}>for yourself.</span>
          </h2>
          <p
            style={{
              fontFamily: '"Inter",sans-serif',
              fontSize: 17,
              lineHeight: 1.85,
              color: 'rgba(253,251,247,0.6)',
              maxWidth: 480,
              margin: '0 auto 44px',
            }}
          >
            Tell us a little about how you like to travel, and we'll plan a route
            around it — real places, honest pacing, no tourist traps.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/destinations"
              style={{
                background: '#0F6B4C',
                color: '#FDFBF7',
                fontFamily: '"Inter",sans-serif',
                fontSize: 12,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                fontWeight: 600,
                padding: '17px 38px',
                borderRadius: 2,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 12,
                transition: 'transform 0.25s ease',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = 'none')}
            >
              Explore Destinations <FiArrowRight size={14} />
            </Link>
            <UnderlineLink to="/tours" color="#FDFBF7" size={12}>
              See All Itineraries
            </UnderlineLink>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER — minimalist: wordmark, one gold email link, copyright. Nothing else.
// ─────────────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer
      style={{
        background: '#FDFBF7',
        borderTop: '1px solid rgba(31,27,22,0.1)',
        padding: '56px clamp(28px,6vw,96px)',
        textAlign: 'center',
      }}
    >
      <p
        style={{
          fontFamily: '"Fraunces",serif',
          fontStyle: 'italic',
          fontSize: 22,
          color: '#1F1B16',
          margin: '0 0 16px',
          letterSpacing: '0.01em',
        }}
      >
        Pavilion
      </p>
      <a
        href="mailto:explore@pavilion.in"
        style={{
          fontFamily: '"Inter",sans-serif',
          fontSize: 13,
          letterSpacing: '0.06em',
          color: '#B8924A',
          textDecoration: 'none',
          borderBottom: '1px solid rgba(184,146,74,0.4)',
          paddingBottom: 2,
        }}
      >
        explore@pavilion.in
      </a>
      <p
        style={{
          fontFamily: '"Inter",sans-serif',
          fontSize: 11,
          color: 'rgba(31,27,22,0.4)',
          margin: '22px 0 0',
          letterSpacing: '0.03em',
        }}
      >
        © {new Date().getFullYear()} Pavilion. A travel journal of India.
      </p>
    </footer>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [featuredTours, setFeaturedTours] = useState<any[]>([])

  useEffect(() => {
    fetch('http://localhost:5000/api/tours/featured')
      .then((r) => r.json())
      .then((data) => {
        const tours = data.data?.tours || []
        if (tours.length > 0) setFeaturedTours(tours.slice(0, 3))
      })
      .catch(() => {
        // silent — MOCK_TOURS fallback handles this
      })
  }, [])

  const toursToShow = featuredTours.length > 0 ? featuredTours : MOCK_TOURS

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#FDFBF7',
        color: '#1F1B16',
        fontFamily: '"Inter",sans-serif',
        overflowX: 'hidden',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,480;0,9..144,560;1,9..144,400;1,9..144,480&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        *,*::before,*::after { box-sizing:border-box; }
        body { overflow-x:hidden; background:#FDFBF7; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:#FDFBF7; }
        ::-webkit-scrollbar-thumb { background:rgba(200,114,44,0.4); border-radius:2px; }
        a { -webkit-tap-highlight-color: transparent; }
        button:focus-visible, a:focus-visible { outline: 2px solid #C8722C; outline-offset: 3px; }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      <HeroSection />
      <JourneyExplorer />

      {/* ── FEATURED ITINERARIES ── */}
      <section
        style={{
          position: 'relative',
          padding: '120px clamp(28px,6vw,96px)',
          background: '#FDFBF7',
          borderTop: '1px solid rgba(31,27,22,0.08)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: 52,
            flexWrap: 'wrap',
            gap: 20,
          }}
        >
          <div style={{ maxWidth: 560 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <div style={{ width: 40, height: 1, background: '#C8722C' }} />
              <span
                style={{
                  fontFamily: '"Inter",sans-serif',
                  fontSize: 11,
                  letterSpacing: '0.36em',
                  textTransform: 'uppercase',
                  color: '#8A6A3D',
                  fontWeight: 600,
                }}
              >
                Handpicked Itineraries
              </span>
            </div>
            <h2
              style={{
                fontFamily: '"Fraunces",serif',
                fontWeight: 480,
                fontSize: 'clamp(2.3rem,4.4vw,3.8rem)',
                lineHeight: 1.08,
                color: '#1F1B16',
                margin: 0,
              }}
            >
              From the <span style={{ fontStyle: 'italic', color: '#C8722C' }}>field journal</span>
            </h2>
          </div>
          <UnderlineLink to="/tours">All Itineraries</UnderlineLink>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
            gap: 26,
          }}
        >
          {toursToShow.map((tour: any, i: number) => (
            <ItineraryCard key={tour._id} tour={tour} index={i} />
          ))}
        </div>
      </section>

      <BestTimeSection />
      <FinalCTA />
      <Footer />
    </div>
  )
}