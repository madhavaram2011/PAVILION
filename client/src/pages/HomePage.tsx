import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, useScroll, useTransform as useScrollTransform } from 'framer-motion'
import { FiArrowRight, FiClock, FiUsers, FiMapPin, FiArrowDown } from 'react-icons/fi'
import { GiCompass, GiLotusFlower } from 'react-icons/gi'

// ─── CORRECT DESTINATION DATA WITH ACCURATE IMAGES ───────────────────────────
const INDIA_DESTINATIONS = [
  {
    name: 'Rajasthan',
    tag: 'Golden Deserts & Royal Forts',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=900&q=85',
    region: 'North India',
    tours: 12,
    accent: '#F4A62A',
    desc: 'Sand dunes glowing copper at dusk. Century-old forts piercing the horizon. The Pink City\'s labyrinthine bazaars.',
  },
  {
    name: 'Kerala',
    tag: 'Backwaters & Spice Trails',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=900&q=85',
    region: 'South India',
    tours: 10,
    accent: '#1A9B6C',
    desc: 'Emerald canals on a kettuvallam houseboat. Mist-covered tea estates. The scent of cardamom at dawn.',
  },
  {
    name: 'Ladakh',
    tag: 'Rooftop of the World',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=900&q=85',
    region: 'North India',
    tours: 8,
    accent: '#FF6B35',
    desc: 'Turquoise lakes mirroring the heavens. Monasteries balanced on clifftops. The sky at 4,500 metres.',
  },
  {
    name: 'Varanasi',
    tag: 'Sacred City on the Ganga',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=900&q=85',
    region: 'North India',
    tours: 6,
    accent: '#c9a96e',
    desc: 'The oldest living city on earth. Ganga Aarti igniting the riverbanks. Lanes unchanged for three millennia.',
  },
  {
    name: 'Andaman',
    tag: 'Pristine Coral Shores',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=900&q=85',
    region: 'Islands',
    tours: 5,
    accent: '#22d3ee',
    desc: 'Asia\'s finest beach. Coral gardens alive with colour. Bioluminescent surf lighting the night.',
  },
  {
    name: 'Meghalaya',
    tag: 'Living Root Bridges & Clouds',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=900&q=85',
    region: 'Northeast India',
    tours: 6,
    accent: '#34d399',
    desc: 'Bridges grown from living roots. Clouds that walk through your window. The wettest, greenest corner of the subcontinent.',
  },
]

// ─── JOURNEY TYPES ────────────────────────────────────────────────────────────
const JOURNEYS = [
  {
    id: 'heritage', label: 'Heritage', emoji: '🏛️', color: '#F4A62A',
    headline: 'Walk inside living history',
    body: 'India\'s past isn\'t in museums. It breathes in every stone, every ritual, every face. From Mughal masterpieces to ancient Dravidian temple cities.',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&q=85',
    places: ['Taj Mahal, Agra', 'Hampi, Karnataka', 'Khajuraho Temples', 'Konark Sun Temple'],
    link: '/destinations',
  },
  {
    id: 'nature', label: 'Wilderness', emoji: '🌿', color: '#1A9B6C',
    headline: 'India\'s wild side has no edge',
    body: 'One-horned rhinos in misty grasslands. Tigers padding through sal forests. Whales off the Andaman coast. Wilderness at a scale that humbles.',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=85',
    places: ['Kaziranga, Assam', 'Bandhavgarh Reserve', 'Sundarbans Delta', 'Valley of Flowers'],
    link: '/destinations',
  },
  {
    id: 'spiritual', label: 'Spiritual', emoji: '🪔', color: '#a78bfa',
    headline: 'Find something you didn\'t know you were looking for',
    body: 'Varanasi at dawn. The Golden Temple at 4am. A silent monastery above the clouds in Ladakh. These are places that change people. Quietly. Permanently.',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1200&q=85',
    places: ['Varanasi Ghats, UP', 'Golden Temple, Amritsar', 'Tawang Monastery', 'Rishikesh, Uttarakhand'],
    link: '/destinations',
  },
  {
    id: 'adventure', label: 'Adventure', emoji: '🏔️', color: '#FF6B35',
    headline: 'The Himalayas don\'t disappoint',
    body: 'Cross passes at 5,000m. Camp on frozen lakes. Trek through valleys unchanged since the Silk Road. India\'s mountains are a life goal, not a checkbox.',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&q=85',
    places: ['Spiti Valley, Himachal', 'Ladakh High Passes', 'Dzukou Valley, Nagaland', 'Roopkund Trek'],
    link: '/tours',
  },
]

// ─── SEASON DATA ──────────────────────────────────────────────────────────────
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const SEASON_DATA = [
  { region: 'Rajasthan & North Plains', icon: '🏰', color: '#F4A62A', months: [2, 2, 2, 3, 4, 4, 4, 4, 3, 1, 1, 1], tip: 'Oct–Mar is ideal — cool desert nights and clear skies for fort exploration.' },
  { region: 'Kerala & South Coast', icon: '🌴', color: '#1A6B5A', months: [1, 1, 2, 2, 3, 4, 4, 4, 3, 2, 1, 1], tip: 'Nov–Feb is perfect for backwaters and beaches before the monsoon arrives.' },
  { region: 'Ladakh & High Himalayas', icon: '🏔️', color: '#FF6B35', months: [4, 4, 4, 4, 3, 2, 1, 1, 2, 3, 4, 4], tip: 'Jul–Sep is the window — roads open, skies clear, Pangong at its most vivid.' },
  { region: 'Goa & West Coast', icon: '🏖️', color: '#9B59B6', months: [1, 1, 1, 2, 3, 4, 4, 4, 3, 2, 1, 1], tip: 'Nov–Mar brings warm days, calm seas, and the full festival season.' },
  { region: 'Northeast India', icon: '🌿', color: '#27AE60', months: [2, 2, 1, 1, 2, 4, 4, 4, 3, 1, 1, 2], tip: 'Oct–Apr is when living root bridges are most accessible and skies clearest.' },
  { region: 'Andaman Islands', icon: '🐠', color: '#2980B9', months: [1, 1, 1, 1, 2, 4, 4, 4, 3, 2, 1, 1], tip: 'Oct–May — dive season, bioluminescent nights, and Radhanagar Beach at its finest.' },
]
const SEASON_COLORS = { 1: { bg: '#1A6B5A', label: 'Peak' }, 2: { bg: '#F4A62A', label: 'Good' }, 3: { bg: '#c8a882', label: 'Fair' }, 4: { bg: 'rgba(44,26,14,0.12)', label: 'Avoid' } }

// ─── ANIMATED PARTICLE CANVAS ─────────────────────────────────────────────────
function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return
    const ctx = canvas.getContext('2d')!; let raf: number
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize(); window.addEventListener('resize', resize)
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.3,
      a: Math.random() * 0.5 + 0.1,
    }))
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(244,166,42,${p.a})`; ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={ref} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }} />
}

// ─── MANDALA CANVAS ───────────────────────────────────────────────────────────
function MandalaCanvas({ color }: { color: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const W = 560; canvas.width = W; canvas.height = W
    const cx = W / 2; const cy = W / 2; let t = 0
    const hex = color.replace('#', '')
    const r = parseInt(hex.slice(0, 2), 16); const g = parseInt(hex.slice(2, 4), 16); const b = parseInt(hex.slice(4, 6), 16)
    const draw = () => {
      t += 0.005; ctx.clearRect(0, 0, W, W)
      const rings = [
        { r: 230, petals: 32, len: 16, lw: 0.3, alpha: 0.10, speed: 0.6 },
        { r: 195, petals: 24, len: 20, lw: 0.5, alpha: 0.15, speed: -0.5 },
        { r: 158, petals: 16, len: 22, lw: 0.7, alpha: 0.22, speed: 0.8 },
        { r: 118, petals: 12, len: 20, lw: 0.9, alpha: 0.32, speed: -0.7 },
        { r: 80, petals: 8, len: 22, lw: 1.1, alpha: 0.42, speed: 1.0 },
        { r: 46, petals: 6, len: 16, lw: 1.3, alpha: 0.55, speed: -0.6 },
      ]
      rings.forEach(ring => {
        const angle = t * ring.speed
        for (let i = 0; i < ring.petals; i++) {
          const a = (i / ring.petals) * Math.PI * 2 + angle
          const x1 = cx + ring.r * Math.cos(a); const y1 = cy + ring.r * Math.sin(a)
          const x2 = cx + (ring.r + ring.len) * Math.cos(a); const y2 = cy + (ring.r + ring.len) * Math.sin(a)
          ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2)
          ctx.strokeStyle = `rgba(${r},${g},${b},${ring.alpha})`; ctx.lineWidth = ring.lw; ctx.stroke()
          ctx.beginPath(); ctx.arc(x2, y2, ring.lw * 1.6, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${r},${g},${b},${ring.alpha * 1.8})`; ctx.fill()
        }
        ctx.beginPath(); ctx.arc(cx, cy, ring.r, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${r},${g},${b},${ring.alpha * 0.4})`; ctx.lineWidth = 0.4; ctx.stroke()
      })
      // Compass rose center
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2 + t * 0.25
        ctx.beginPath(); ctx.moveTo(cx, cy)
        ctx.lineTo(cx + 48 * Math.cos(a), cy + 48 * Math.sin(a))
        ctx.strokeStyle = `rgba(${r},${g},${b},0.55)`; ctx.lineWidth = i % 2 === 0 ? 1.6 : 0.7; ctx.stroke()
      }
      ctx.beginPath(); ctx.arc(cx, cy, 16, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(${r},${g},${b},0.65)`; ctx.lineWidth = 1.5; ctx.stroke()
      ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${r},${g},${b},0.95)`; ctx.fill()
      animRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(animRef.current)
  }, [color])
  return <canvas ref={ref} style={{ width: '100%', height: '100%' }} />
}

// ─── HERO SECTION ─────────────────────────────────────────────────────────────
function HeroSection() {
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)
  const springX = useSpring(mouseX, { stiffness: 30, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 30, damping: 20 })
  const pX = useTransform(springX, [0, 1], [-28, 28])
  const pY = useTransform(springY, [0, 1], [-14, 14])
  const pXs = useTransform(springX, [0, 1], [-12, 12])
  const pYs = useTransform(springY, [0, 1], [-7, 7])
  const rotZ = useTransform(springX, [0, 1], [-3, 3])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
  }, [mouseX, mouseY])

  const WORDS = ['Culture.', 'Discovery.', 'Heritage.', 'Wilderness.', 'Ritual.', 'Depth.', 'Wonder.']
  const [wordIdx, setWordIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setWordIdx(i => (i + 1) % WORDS.length), 2200)
    return () => clearInterval(t)
  }, [])

  // Floating info pills
  const PILLS = [
    { text: '28+ States', sub: 'to explore', color: '#F4A62A', x: '70%', y: '20%', delay: 1.3 },
    { text: '42 UNESCO Sites', sub: 'world heritage', color: '#34d399', x: '74%', y: '55%', delay: 1.6 },
    { text: '4,000+ years', sub: 'of civilisation', color: '#a78bfa', x: '65%', y: '75%', delay: 1.9 },
  ]

  return (
    <section
      style={{ position: 'relative', height: '100vh', minHeight: 700, overflow: 'hidden', background: '#0A0705' }}
      onMouseMove={handleMouseMove}
    >
      {/* Background image with slight parallax */}
      <motion.div style={{ position: 'absolute', inset: 0, y: useTransform(springY, [0, 1], [-20, 20]) }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1920&q=85')", backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.16) saturate(0.45)' }} />
      </motion.div>

      {/* Gradient overlays */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 65% 45%, rgba(244,166,42,0.09) 0%, transparent 60%)', zIndex: 1 }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%', background: 'linear-gradient(to top, #0A0705 0%, transparent 100%)', zIndex: 2 }} />
      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '60%', background: 'linear-gradient(to right, rgba(10,7,5,0.9) 0%, transparent 100%)', zIndex: 2 }} />

      {/* Tricolour top strip */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, display: 'flex', zIndex: 10 }}>
        <div style={{ flex: 1, background: '#FF9933' }} /><div style={{ flex: 1, background: 'rgba(255,255,255,0.75)' }} /><div style={{ flex: 1, background: '#138808' }} />
      </div>

      {/* Animated Mandala — right side with parallax */}
      <motion.div style={{
        position: 'absolute', right: '-2vw', top: '50%', translateY: '-50%',
        width: 'clamp(400px,46vw,640px)', height: 'clamp(400px,46vw,640px)',
        zIndex: 3, x: pXs, y: pYs, rotate: rotZ, opacity: 0.9,
      }}>
        <MandalaCanvas color="#F4A62A" />
      </motion.div>

      {/* Floating info pills */}
      {PILLS.map((pill, i) => (
        <motion.div key={pill.text}
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: pill.delay, type: 'spring', stiffness: 200, damping: 18 }}
          style={{
            position: 'absolute', left: pill.x, top: pill.y, zIndex: 5,
            background: 'rgba(10,7,5,0.85)', border: `1px solid ${pill.color}45`,
            borderRadius: 8, padding: '10px 18px', backdropFilter: 'blur(14px)'
          }}>
          <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3 + i * 0.7, repeat: Infinity, ease: 'easeInOut', delay: i * 0.8 }}>
            <p style={{ fontFamily: '"Space Mono",monospace', fontSize: 12, fontWeight: 700, color: pill.color, margin: 0, letterSpacing: '0.04em' }}>{pill.text}</p>
            <p style={{ fontFamily: '"Space Mono",monospace', fontSize: 7, letterSpacing: '0.25em', textTransform: 'uppercase', color: `${pill.color}70`, margin: '2px 0 0' }}>{pill.sub}</p>
          </motion.div>
        </motion.div>
      ))}

      {/* Main copy */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 clamp(32px,7vw,120px)', zIndex: 6 }}>
        {/* Overline */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
          style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
          <div style={{ width: 36, height: 1, background: 'rgba(244,166,42,0.7)' }} />
          <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 9, letterSpacing: '0.52em', textTransform: 'uppercase', color: 'rgba(244,166,42,0.8)' }}>Pavilion · Curated India Journeys</span>
        </motion.div>

        {/* DISCOVER */}
        <div style={{ overflow: 'hidden' }}>
          <motion.div initial={{ y: 80 }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}>
            <p style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 'clamp(1.2rem,2vw,2rem)', letterSpacing: '0.6em', color: 'rgba(255,248,240,0.18)', margin: 0, lineHeight: 1 }}>DISCOVER</p>
          </motion.div>
        </div>

        {/* INCREDIBLE */}
        <div style={{ overflow: 'hidden' }}>
          <motion.div style={{ x: pX, y: pY }} initial={{ y: 120 }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}>
            <h1 style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 'clamp(5rem,11vw,14rem)', letterSpacing: '0.022em', lineHeight: 0.84, margin: 0, color: '#FFF8F0' }}>INCREDIBLE</h1>
          </motion.div>
        </div>

        {/* INDIA */}
        <div style={{ overflow: 'hidden' }}>
          <motion.div style={{ x: pXs, y: pYs }} initial={{ y: 120 }} animate={{ y: 0 }} transition={{ duration: 1.05, delay: 0.46, ease: [0.16, 1, 0.3, 1] }}>
            <h1 style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 'clamp(5rem,11vw,14rem)', letterSpacing: '0.022em', lineHeight: 0.84, margin: 0, color: '#F4A62A' }}>INDIA</h1>
          </motion.div>
        </div>

        {/* Rotating tagline */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
          style={{ marginTop: 24, display: 'flex', alignItems: 'baseline', gap: 10, maxWidth: 540 }}>
          <p style={{ fontFamily: '"Crimson Text",serif', fontStyle: 'italic', fontSize: 'clamp(16px,1.5vw,21px)', color: 'rgba(255,248,240,0.38)', margin: 0, whiteSpace: 'nowrap' }}>India's</p>
          <div style={{ overflow: 'hidden', height: 'clamp(22px,2vw,28px)', position: 'relative', minWidth: 170 }}>
            <AnimatePresence mode="wait">
              <motion.span key={wordIdx}
                initial={{ y: 32, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -32, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{ position: 'absolute', fontFamily: '"Crimson Text",serif', fontStyle: 'italic', fontSize: 'clamp(16px,1.5vw,21px)', color: '#F4A62A', whiteSpace: 'nowrap' }}>
                {WORDS[wordIdx]}
              </motion.span>
            </AnimatePresence>
          </div>
          <p style={{ fontFamily: '"Crimson Text",serif', fontStyle: 'italic', fontSize: 'clamp(16px,1.5vw,21px)', color: 'rgba(255,248,240,0.38)', margin: 0, whiteSpace: 'nowrap' }}>Guided by locals.</p>
        </motion.div>

        {/* CTAs */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.08, duration: 0.7 }}
          style={{ display: 'flex', gap: 14, marginTop: 36, flexWrap: 'wrap' }}>
          <Link to="/destinations"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#FF6B35', color: '#0A0705', fontFamily: '"Space Mono",monospace', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700, padding: '15px 30px', borderRadius: 2, textDecoration: 'none', boxShadow: '0 8px 36px rgba(255,107,53,0.45)', transition: 'transform 0.2s, box-shadow 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 14px 44px rgba(255,107,53,0.6)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 36px rgba(255,107,53,0.45)' }}>
            Start Exploring <FiArrowRight size={13} />
          </Link>
          <Link to="/tours"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, border: '1px solid rgba(255,248,240,0.22)', color: 'rgba(255,248,240,0.65)', fontFamily: '"Space Mono",monospace', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', padding: '15px 30px', borderRadius: 2, textDecoration: 'none', backdropFilter: 'blur(10px)', transition: 'border-color 0.25s, color 0.25s, background 0.25s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(244,166,42,0.55)'; (e.currentTarget as HTMLElement).style.color = '#F4A62A'; (e.currentTarget as HTMLElement).style.background = 'rgba(244,166,42,0.06)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,248,240,0.22)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,248,240,0.65)'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
            Browse Tours
          </Link>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }}
        style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', zIndex: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
          <FiArrowDown size={16} color="rgba(255,248,240,0.25)" />
        </motion.div>
        <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 7, letterSpacing: '0.45em', color: 'rgba(255,248,240,0.18)', textTransform: 'uppercase' }}>Scroll</span>
      </motion.div>
    </section>
  )
}

// ─── DESTINATION CARD — no fake ratings ───────────────────────────────────────
function DestCard({ dest, index }: { dest: typeof INDIA_DESTINATIONS[0]; index: number }) {
  const [hover, setHover] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative', borderRadius: 6, overflow: 'hidden', cursor: 'pointer',
        transform: hover ? 'translateY(-12px) scale(1.01)' : 'none',
        transition: 'transform 0.45s cubic-bezier(0.22,1,0.36,1), box-shadow 0.45s',
        boxShadow: hover ? `0 28px 70px rgba(0,0,0,0.2), 0 0 0 2px ${dest.accent}70` : '0 4px 24px rgba(0,0,0,0.08)'
      }}>
      {/* Image */}
      <div style={{ height: 260, overflow: 'hidden', position: 'relative' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${dest.image})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          transform: hover ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 0.8s cubic-bezier(0.22,1,0.36,1)'
        }} />
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, rgba(20,13,5,0.97) 0%, rgba(20,13,5,0.2) 60%, transparent 100%)` }} />
        {/* Accent bar bottom */}
        <motion.div animate={{ scaleX: hover ? 1 : 0 }} initial={{ scaleX: 0 }} style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${dest.accent}, transparent)`, transformOrigin: 'left' }} transition={{ duration: 0.4 }} />
        {/* Region badge */}
        <div style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(10,7,5,0.8)', backdropFilter: 'blur(10px)', border: `1px solid ${dest.accent}40`, borderRadius: 20, padding: '4px 12px' }}>
          <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.15em', color: dest.accent, textTransform: 'uppercase' }}>{dest.region}</span>
        </div>
        {/* Title overlay */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '0 20px 20px' }}>
          <h3 style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 34, letterSpacing: '0.04em', color: '#FFF8F0', margin: '0 0 2px', lineHeight: 1 }}>{dest.name}</h3>
          <p style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', color: `${dest.accent}CC`, margin: 0 }}>{dest.tag}</p>
        </div>
      </div>
      {/* Card body */}
      <div style={{ padding: '18px 20px 20px', background: '#FFF8F0', borderTop: `3px solid ${dest.accent}` }}>
        <p style={{ fontFamily: '"Crimson Text",serif', fontStyle: 'italic', fontSize: 14, color: 'rgba(44,26,14,0.65)', lineHeight: 1.65, margin: '0 0 14px' }}>{dest.desc}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 9, color: dest.accent, letterSpacing: '0.1em' }}>{dest.tours} tours available</span>
          <motion.div animate={{ x: hover ? 5 : 0 }} transition={{ duration: 0.2 }}>
            <FiArrowRight size={15} color={dest.accent} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

// ─── JOURNEY EXPLORER ─────────────────────────────────────────────────────────
function JourneyExplorer() {
  const [active, setActive] = useState(0)
  const cur = JOURNEYS[active]

  return (
    <section style={{ position: 'relative', zIndex: 1, background: '#0A0705', overflow: 'hidden' }}>
      <div style={{ height: 3, display: 'flex' }}>
        <div style={{ flex: 1, background: '#FF9933' }} /><div style={{ flex: 1, background: 'rgba(255,255,255,0.4)' }} /><div style={{ flex: 1, background: '#138808' }} />
      </div>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '100px clamp(24px,6vw,80px)' }}>
        {/* Header */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
            <div style={{ width: 32, height: 1, background: 'rgba(244,166,42,0.6)' }} />
            <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 9, letterSpacing: '0.48em', textTransform: 'uppercase', color: 'rgba(244,166,42,0.65)' }}>What Awaits You</span>
          </div>
          <h2 style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 'clamp(3rem,6vw,7.5rem)', letterSpacing: '0.02em', lineHeight: 0.88, color: '#FFF8F0', margin: '0 0 16px' }}>
            CHOOSE YOUR<br /><span style={{ color: '#F4A62A' }}>INDIA</span>
          </h2>
          <p style={{ fontFamily: '"Crimson Text",serif', fontStyle: 'italic', fontSize: 18, color: 'rgba(255,248,240,0.4)', maxWidth: 480, lineHeight: 1.7, margin: 0 }}>
            India is not one place. It is every place. Pick the version that calls to you.
          </p>
        </div>

        {/* Tab row */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 0, flexWrap: 'wrap' }}>
          {JOURNEYS.map((j, i) => (
            <motion.button key={j.id} onClick={() => setActive(i)}
              whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
              style={{
                flex: '1 1 auto', minWidth: 130, padding: '20px 22px', textAlign: 'left',
                background: active === i ? `${j.color}12` : 'transparent', border: 'none',
                borderTop: `2.5px solid ${active === i ? j.color : 'rgba(255,255,255,0.08)'}`,
                cursor: 'pointer', transition: 'all 0.3s'
              }}>
              <span style={{ fontSize: 22, display: 'block', marginBottom: 8, filter: active === i ? 'none' : 'grayscale(0.8) opacity(0.45)', transition: 'filter 0.3s' }}>{j.emoji}</span>
              <span style={{
                fontFamily: '"Bebas Neue",sans-serif', fontSize: 24, letterSpacing: '0.05em',
                color: active === i ? '#FFF8F0' : 'rgba(255,248,240,0.28)',
                display: 'block', lineHeight: 1, transition: 'color 0.3s'
              }}>{j.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Content panel */}
        <AnimatePresence mode="wait">
          <motion.div key={active}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0,
              background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderTop: 'none'
            }}>
            {/* Left */}
            <div style={{ padding: '52px 52px 52px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h3 style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 'clamp(1.8rem,3.2vw,3.2rem)', letterSpacing: '0.03em', lineHeight: 0.95, color: '#FFF8F0', marginBottom: 18 }}>{cur.headline}</h3>
              <p style={{ fontFamily: '"Crimson Text",serif', fontStyle: 'italic', fontSize: 18, color: 'rgba(255,248,240,0.5)', lineHeight: 1.8, marginBottom: 30 }}>{cur.body}</p>
              {/* Place pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 34 }}>
                {cur.places.map(p => (
                  <span key={p} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.1em', padding: '6px 13px', borderRadius: 100, background: `${cur.color}14`, border: `1px solid ${cur.color}38`, color: cur.color }}>
                    <FiMapPin size={8} />{p}
                  </span>
                ))}
              </div>
              <Link to={cur.link}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: '"Space Mono",monospace', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: cur.color, textDecoration: 'none', fontWeight: 700, width: 'fit-content', transition: 'gap 0.25s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.gap = '16px'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.gap = '10px'}>
                Explore this path <FiArrowRight size={13} />
              </Link>
            </div>
            {/* Right image */}
            <div style={{ position: 'relative', overflow: 'hidden', minHeight: 420 }}>
              <motion.div key={cur.image}
                initial={{ scale: 1.1, opacity: 0.5 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                style={{ position: 'absolute', inset: 0, backgroundImage: `url(${cur.image})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.5) saturate(0.65)' }} />
              <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to right, rgba(10,7,5,0.65) 0%, transparent 55%)` }} />
              <div style={{ position: 'absolute', bottom: 28, right: 28, fontFamily: '"Bebas Neue",sans-serif', fontSize: 110, letterSpacing: '0.02em', color: `${cur.color}14`, lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>0{active + 1}</div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

// ─── BEST TIME SECTION ────────────────────────────────────────────────────────
function BestTimeSection() {
  const [activeMonth, setActiveMonth] = useState<number | null>(null)
  const peakThisMonth = activeMonth !== null ? SEASON_DATA.filter(r => r.months[activeMonth] === 1).map(r => r.region) : []
  const goodThisMonth = activeMonth !== null ? SEASON_DATA.filter(r => r.months[activeMonth] === 2).map(r => r.region) : []

  return (
    <section style={{ position: 'relative', zIndex: 1, padding: '96px clamp(24px,6vw,100px)', background: '#FFF8F0' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ marginBottom: 52 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 22 }}>🗓️</span>
            <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', color: '#FF6B35' }}>Plan Your Trip</span>
          </div>
          <h2 style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 'clamp(3rem,6vw,6.5rem)', letterSpacing: '0.02em', lineHeight: 0.9, color: '#2C1A0E', margin: 0 }}>
            BEST TIME TO<br /><span style={{ color: '#FF6B35' }}>VISIT INDIA</span>
          </h2>
          <div style={{ display: 'flex', height: 4, width: 160, borderRadius: 2, overflow: 'hidden', marginTop: 18 }}>
            <div style={{ flex: 1, background: '#FF9933' }} /><div style={{ flex: 1, background: '#F4A62A' }} /><div style={{ flex: 1, background: '#1A6B5A' }} />
          </div>
          <p style={{ fontFamily: '"Crimson Text",serif', fontStyle: 'italic', fontSize: 18, color: 'rgba(44,26,14,0.55)', marginTop: 16, maxWidth: 520, lineHeight: 1.7 }}>
            India's vast geography means every month is perfect somewhere. Tap a month to find out where.
          </p>
        </div>

        {/* Month buttons */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 32, flexWrap: 'wrap' }}>
          {MONTHS.map((m, i) => {
            const isActive = activeMonth === i
            const peakCount = SEASON_DATA.filter(r => r.months[i] === 1).length
            return (
              <motion.button key={m} onClick={() => setActiveMonth(isActive ? null : i)} whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }}
                style={{ position: 'relative', padding: '10px 16px', borderRadius: 3, fontFamily: '"Space Mono",monospace', fontSize: 10, letterSpacing: '0.15em', background: isActive ? '#FF6B35' : '#FFF0E0', border: `1px solid ${isActive ? '#FF6B35' : 'rgba(44,26,14,0.12)'}`, color: isActive ? '#fff' : '#4A3520', cursor: 'pointer', transition: 'all 0.2s', fontWeight: isActive ? 700 : 400, boxShadow: isActive ? '0 6px 20px rgba(255,107,53,0.35)' : 'none' }}>
                {m}
                {peakCount > 0 && <span style={{ position: 'absolute', top: -5, right: -5, width: 15, height: 15, background: '#1A6B5A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Space Mono",monospace', fontSize: 7, color: '#fff', fontWeight: 700 }}>{peakCount}</span>}
              </motion.button>
            )
          })}
          {activeMonth !== null && (
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setActiveMonth(null)}
              style={{ padding: '10px 14px', borderRadius: 3, fontFamily: '"Space Mono",monospace', fontSize: 9, background: 'transparent', border: '1px solid rgba(44,26,14,0.15)', color: 'rgba(44,26,14,0.4)', cursor: 'pointer', letterSpacing: '0.1em' }}>
              Clear ✕
            </motion.button>
          )}
        </div>

        {/* Highlight bar */}
        <AnimatePresence>
          {activeMonth !== null && (
            <motion.div key={activeMonth} initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ marginBottom: 28, padding: '18px 22px', background: 'rgba(255,107,53,0.06)', border: '1px solid rgba(255,107,53,0.22)', borderRadius: 6, display: 'flex', gap: 36, flexWrap: 'wrap', alignItems: 'center' }}>
              <div>
                <p style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(44,26,14,0.4)', margin: '0 0 4px' }}>Peak in {MONTHS[activeMonth]}</p>
                <p style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 22, color: '#1A6B5A', margin: 0, letterSpacing: '0.04em' }}>{peakThisMonth.length > 0 ? peakThisMonth.join(' · ') : 'No peak regions this month'}</p>
              </div>
              {goodThisMonth.length > 0 && (
                <div>
                  <p style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(44,26,14,0.4)', margin: '0 0 4px' }}>Also good</p>
                  <p style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 18, color: '#F4A62A', margin: 0, letterSpacing: '0.04em' }}>{goodThisMonth.join(' · ')}</p>
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
                <th style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(44,26,14,0.4)', textAlign: 'left', padding: '0 12px 18px 0', fontWeight: 400, width: 200 }}>Region</th>
                {MONTHS.map((m, i) => (
                  <th key={m} style={{ fontFamily: '"Space Mono",monospace', fontSize: 9, letterSpacing: '0.08em', color: activeMonth === i ? '#FF6B35' : 'rgba(44,26,14,0.5)', padding: '0 0 18px', textAlign: 'center', fontWeight: activeMonth === i ? 700 : 400, cursor: 'pointer', transition: 'color 0.2s', width: 42 }}
                    onClick={() => setActiveMonth(activeMonth === i ? null : i)}>{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SEASON_DATA.map(row => (
                <tr key={row.region} style={{ borderTop: '1px solid rgba(44,26,14,0.06)' }}>
                  <td style={{ padding: '10px 12px 10px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <span style={{ fontSize: 16 }}>{row.icon}</span>
                      <p style={{ fontFamily: '"Space Mono",monospace', fontSize: 9, color: '#2C1A0E', margin: 0 }}>{row.region}</p>
                    </div>
                  </td>
                  {row.months.map((rating, mi) => {
                    const sc = SEASON_COLORS[rating as keyof typeof SEASON_COLORS]
                    return (
                      <td key={mi} style={{ padding: '10px 2px', textAlign: 'center' }}>
                        <motion.div whileHover={{ scale: 1.2 }} style={{ width: 28, height: 28, borderRadius: 4, margin: '0 auto', background: sc.bg, border: activeMonth === mi ? '2px solid rgba(44,26,14,0.35)' : '2px solid transparent', transition: 'border 0.2s' }} title={`${row.region} in ${MONTHS[mi]}: ${sc.label}`} />
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend + tip cards */}
        <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap', marginBottom: 36 }}>
          <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(44,26,14,0.35)' }}>Legend:</span>
          {Object.entries(SEASON_COLORS).map(([k, v]) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 16, height: 16, borderRadius: 3, background: v.bg, border: '1px solid rgba(44,26,14,0.1)' }} />
              <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 9, color: 'rgba(44,26,14,0.55)', letterSpacing: '0.1em' }}>{v.label}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {SEASON_DATA.map((row, i) => (
            <motion.div key={row.region} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              style={{ padding: '18px 20px', background: '#FFF0E0', border: '1px solid rgba(44,26,14,0.08)', borderLeft: `3px solid ${row.color}`, borderRadius: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 8 }}>
                <span style={{ fontSize: 18 }}>{row.icon}</span>
                <p style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 18, letterSpacing: '0.04em', color: '#2C1A0E', margin: 0 }}>{row.region}</p>
              </div>
              <p style={{ fontFamily: '"Crimson Text",serif', fontStyle: 'italic', fontSize: 14, color: 'rgba(44,26,14,0.6)', lineHeight: 1.65, margin: 0 }}>{row.tip}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [featuredTours, setFeaturedTours] = useState<any[]>([])

  useEffect(() => {
    fetch('http://localhost:5000/api/tours/featured')
      .then(r => r.json())
      .then(data => setFeaturedTours((data.data?.tours || []).slice(0, 3)))
      .catch(() => { })
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#FFF8F0', color: '#2C1A0E', fontFamily: '"Crimson Text",Georgia,serif', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
        *,*::before,*::after { box-sizing:border-box; }
        body { overflow-x:hidden; background:#FFF8F0; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:#FFF8F0; }
        ::-webkit-scrollbar-thumb { background:rgba(255,107,53,0.4); border-radius:2px; }
        @keyframes spinSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .tour-card { transition:transform 0.38s cubic-bezier(0.22,1,0.36,1), box-shadow 0.38s; }
        .tour-card:hover { transform:translateY(-9px); box-shadow:0 22px 55px rgba(0,0,0,0.13); }
      `}</style>

      <ParticleCanvas />

      {/* ── HERO ── */}
      <HeroSection />

      {/* ── DESTINATIONS ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '100px clamp(24px,6vw,100px)', background: '#FFF8F0' }}>
        <div style={{ marginBottom: 60, maxWidth: 640 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
            <GiLotusFlower style={{ color: '#FF6B35', fontSize: 20 }} />
            <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', color: '#FF6B35' }}>Where We Take You</span>
          </div>
          <h2 style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 'clamp(3rem,6vw,6.5rem)', letterSpacing: '0.02em', lineHeight: 0.9, color: '#2C1A0E', margin: 0 }}>
            INDIA'S FINEST<br /><span style={{ color: '#FF6B35' }}>DESTINATIONS</span>
          </h2>
          <div style={{ display: 'flex', height: 4, width: 160, borderRadius: 2, overflow: 'hidden', marginTop: 20 }}>
            <div style={{ flex: 1, background: '#FF9933' }} /><div style={{ flex: 1, background: '#F4A62A' }} /><div style={{ flex: 1, background: '#1A6B5A' }} />
          </div>
          <p style={{ fontFamily: '"Crimson Text",serif', fontStyle: 'italic', fontSize: 17, color: 'rgba(44,26,14,0.55)', marginTop: 16, lineHeight: 1.75 }}>
            Every destination here is real and lived-in. No tourist traps — only places with soul, depth and genuine cultural richness.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: 22, marginBottom: 48 }}>
          {INDIA_DESTINATIONS.map((d, i) => <DestCard key={d.name} dest={d} index={i} />)}
        </div>
        <div style={{ textAlign: 'center' }}>
          <Link to="/destinations"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 12, border: '2px solid #1A6B5A', color: '#1A6B5A', fontFamily: '"Space Mono",monospace', fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700, padding: '15px 34px', borderRadius: 2, textDecoration: 'none', transition: 'background 0.28s, color 0.28s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#1A6B5A'; (e.currentTarget as HTMLElement).style.color = '#FFF8F0' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#1A6B5A' }}>
            View All Destinations <FiArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── JOURNEY EXPLORER ── */}
      <JourneyExplorer />

      {/* ── FEATURED TOURS ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '0 clamp(24px,6vw,100px) 100px', background: '#FFF8F0', borderTop: '1px solid rgba(255,107,53,0.1)' }}>
        <div style={{ paddingTop: 80, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 44, flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <GiCompass style={{ color: '#F4A62A', fontSize: 20 }} />
              <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', color: '#F4A62A' }}>Handpicked for You</span>
            </div>
            <h2 style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 'clamp(2.8rem,5vw,5.5rem)', letterSpacing: '0.02em', lineHeight: 0.9, color: '#2C1A0E', margin: 0 }}>
              FEATURED<br /><span style={{ color: '#F4A62A' }}>TOURS</span>
            </h2>
          </div>
          <Link to="/tours"
            style={{ display: 'flex', alignItems: 'center', gap: 9, border: '1px solid rgba(244,166,42,0.4)', padding: '11px 22px', borderRadius: 2, textDecoration: 'none', fontFamily: '"Space Mono",monospace', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#F4A62A', transition: 'background 0.2s' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(244,166,42,0.08)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}>
            All Tours <FiArrowRight size={11} />
          </Link>
        </div>

        {featuredTours.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '64px 0', border: '1px dashed rgba(44,26,14,0.14)', borderRadius: 6 }}>
            <motion.span animate={{ rotate: [0, 15, -15, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }} style={{ display: 'inline-block', fontSize: 50, marginBottom: 16 }}>🧭</motion.span>
            <h3 style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 32, letterSpacing: '0.04em', color: 'rgba(44,26,14,0.3)', marginBottom: 10 }}>Tours launching soon</h3>
            <p style={{ fontFamily: '"Crimson Text",serif', fontStyle: 'italic', fontSize: 16, color: 'rgba(44,26,14,0.4)', marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>We're curating extraordinary journeys across every corner of India.</p>
            <Link to="/tours" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: '#FF6B35', color: '#fff', fontFamily: '"Space Mono",monospace', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, padding: '12px 24px', borderRadius: 2, textDecoration: 'none' }}>
              Browse Available Tours <FiArrowRight size={11} />
            </Link>
          </motion.div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 22 }}>
            {featuredTours.map((t: any, i: number) => (
              <motion.div key={t._id} initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="tour-card">
                <Link to={`/tours/${t.slug}`} style={{ display: 'block', textDecoration: 'none', background: '#FFF8F0', border: '1px solid rgba(44,26,14,0.1)', borderRadius: 6, overflow: 'hidden' }}>
                  <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${t.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'transform 0.7s ease' }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = 'scale(1.07)')}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = 'scale(1)')} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(44,26,14,0.88) 0%, transparent 55%)' }} />
                    <div style={{ position: 'absolute', top: 12, left: 12, background: '#FF6B35', borderRadius: 2, padding: '3px 10px', fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.2em', color: '#fff', textTransform: 'uppercase' }}>{t.difficulty}</div>
                  </div>
                  <div style={{ padding: '18px 20px 22px' }}>
                    <p style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#FF6B35', margin: '0 0 5px' }}>{t.destination?.name}</p>
                    <h3 style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 26, letterSpacing: '0.04em', color: '#2C1A0E', margin: '0 0 8px', lineHeight: 1 }}>{t.title}</h3>
                    <p style={{ fontFamily: '"Crimson Text",serif', fontStyle: 'italic', fontSize: 14, color: 'rgba(44,26,14,0.55)', lineHeight: 1.6, margin: '0 0 14px' }}>{(t.summary || '').substring(0, 90)}…</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(44,26,14,0.08)', paddingTop: 12 }}>
                      <div style={{ display: 'flex', gap: 14 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: '"Space Mono",monospace', fontSize: 9, color: 'rgba(44,26,14,0.45)' }}><FiClock size={10} color="#FF6B35" /> {t.duration}D</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: '"Space Mono",monospace', fontSize: 9, color: 'rgba(44,26,14,0.45)' }}><FiUsers size={10} color="#FF6B35" /> Max {t.groupSize?.max}</span>
                      </div>
                      <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 12, fontWeight: 700, color: '#1A6B5A' }}>FROM ₹{(t.discountPrice ?? t.price)?.toLocaleString()}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ── BEST TIME ── */}
      <BestTimeSection />

      {/* ── FINAL CTA ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '100px clamp(24px,6vw,100px)', overflow: 'hidden', background: '#0A0705' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1600&q=80')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.07 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(244,166,42,0.07) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, display: 'flex' }}>
          <div style={{ flex: 1, background: '#FF9933' }} /><div style={{ flex: 1, background: 'rgba(255,255,255,0.5)' }} /><div style={{ flex: 1, background: '#138808' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <motion.div animate={{ rotate: [0, 15, -15, 10, -10, 0] }} transition={{ duration: 4, repeat: Infinity, repeatDelay: 3 }} style={{ display: 'inline-block', marginBottom: 26 }}>
              <GiCompass style={{ color: '#F4A62A', fontSize: 56 }} />
            </motion.div>
            <p style={{ fontFamily: '"Space Mono",monospace', fontSize: 9, letterSpacing: '0.48em', textTransform: 'uppercase', color: 'rgba(244,166,42,0.6)', marginBottom: 18 }}>Your journey begins here</p>
            <h2 style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 'clamp(3rem,7vw,7rem)', letterSpacing: '0.02em', lineHeight: 0.9, color: '#FFF8F0', marginBottom: 22 }}>
              INDIA IS WAITING<br /><span style={{ color: '#F4A62A' }}>FOR YOU</span>
            </h2>
            <p style={{ fontFamily: '"Crimson Text",serif', fontStyle: 'italic', fontSize: 19, color: 'rgba(255,248,240,0.48)', lineHeight: 1.85, maxWidth: 540, margin: '0 auto 44px' }}>
              Pavilion is a project built from genuine love for this country. Explore freely, discover honestly, and travel with real curiosity.
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/destinations"
                style={{ background: '#FF6B35', color: '#fff', fontFamily: '"Space Mono",monospace', fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700, padding: '16px 38px', borderRadius: 2, textDecoration: 'none', boxShadow: '0 8px 32px rgba(255,107,53,0.38)', display: 'inline-flex', alignItems: 'center', gap: 12, transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 14px 44px rgba(255,107,53,0.55)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(255,107,53,0.38)' }}>
                Explore Destinations <FiArrowRight size={14} />
              </Link>
              <Link to="/about"
                style={{ border: '1px solid rgba(255,248,240,0.22)', color: 'rgba(255,248,240,0.62)', fontFamily: '"Space Mono",monospace', fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 38px', borderRadius: 2, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 12, backdropFilter: 'blur(10px)', transition: 'border-color 0.25s, color 0.25s, background 0.25s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(244,166,42,0.5)'; (e.currentTarget as HTMLElement).style.color = '#F4A62A'; (e.currentTarget as HTMLElement).style.background = 'rgba(244,166,42,0.06)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,248,240,0.22)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,248,240,0.62)'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                About Pavilion
              </Link>
            </div>
          </motion.div>
        </div>

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, display: 'flex' }}>
          <div style={{ flex: 1, background: '#FF9933' }} /><div style={{ flex: 1, background: 'rgba(255,255,255,0.5)' }} /><div style={{ flex: 1, background: '#138808' }} />
        </div>
      </section>
    </div>
  )
}