import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { FiArrowRight, FiClock, FiUsers, FiMapPin, FiChevronDown } from 'react-icons/fi'
import { GiCompass, GiLotusFlower } from 'react-icons/gi'

// ─── DATA ─────────────────────────────────────────────────────────────────────
const INDIA_DESTINATIONS = [
  {
    name: 'Rajasthan',
    tag: 'Golden Deserts & Royal Forts',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=900&q=85',
    region: 'North India',
    tours: 12,
    accent: '#F4A62A',
    desc: `Step into a land where sand dunes glow copper at dusk and century-old forts pierce the horizon. From the Pink City bazaars to Jaisalmer's golden mirage.`,
  },
  {
    name: 'Kerala',
    tag: 'Backwaters & Spice Trails',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=900&q=85',
    region: 'South India',
    tours: 10,
    accent: '#1A9B6C',
    desc: 'Drift through emerald canals on a kettuvallam houseboat, wake to mist-covered tea estates, and follow the scent of cardamom through ancient spice gardens.',
  },
  {
    name: 'Ladakh',
    tag: 'Rooftop of the World',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=900&q=85',
    region: 'North India',
    tours: 8,
    accent: '#FF6B35',
    desc: 'Where the sky meets bone-white mountains and turquoise lakes mirror the heavens. A landscape so alien it will recalibrate everything you know about beauty.',
  },
  {
    name: 'Varanasi',
    tag: 'Sacred City on the Ganga',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=900&q=85',
    region: 'North India',
    tours: 6,
    accent: '#F4A62A',
    desc: 'The oldest living city on earth. Watch the Ganga Aarti ignite the riverbanks at dusk, walk lanes unchanged for millennia, and feel time dissolve.',
  },
  {
    name: 'Andaman',
    tag: 'Pristine Coral Shores',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=900&q=85',
    region: 'Islands',
    tours: 5,
    accent: '#22d3ee',
    desc: `Asia's finest beach at Radhanagar, bioluminescent surf at night, coral gardens alive with colour — an archipelago that exists outside the ordinary world.`,
  },
  {
    name: 'Meghalaya',
    tag: 'Living Root Bridges & Clouds',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=900&q=85',
    region: 'Northeast India',
    tours: 6,
    accent: '#34d399',
    desc: `The wettest place on earth and one of its most beautiful. Bridges grown from living roots, clouds that walk through your window, and valleys untouched by time.`,
  },
]

// Journey Pathways — replaces "How Pavilion Works"
const JOURNEYS = [
  {
    id: 'heritage',
    label: 'Heritage & History',
    emoji: '🏛️',
    color: '#F4A62A',
    headline: 'Walk inside living history',
    body: `From Mughal masterpieces to Dravidian temple cities — India's past isn't in museums. It breathes in every stone, every ritual, every face.`,
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&q=85',
    places: ['Taj Mahal, Agra', 'Hampi Ruins, Karnataka', 'Khajuraho Temples', 'Konark Sun Temple'],
    link: '/destinations',
  },
  {
    id: 'nature',
    label: 'Wilderness & Nature',
    emoji: '🌿',
    color: '#1A9B6C',
    headline: `India's wild side has no edge`,
    body: `One-horned rhinos in mist-wrapped grasslands. Tigers padding through sal forests. Whales off the Andaman coast. Wilderness at a scale that humbles.`,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=85',
    places: ['Kaziranga, Assam', 'Bandhavgarh Tiger Reserve', 'Sundarbans Delta', 'Valley of Flowers, Uttarakhand'],
    link: '/destinations',
  },
  {
    id: 'spiritual',
    label: 'Spiritual Journeys',
    emoji: '🪔',
    color: '#a78bfa',
    headline: `Find something you didn't know you were looking for`,
    body: `Varanasi at dawn. The Golden Temple at 4am. A silent monastery above the clouds in Ladakh. These are places that change people. Quietly. Permanently.`,
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1200&q=85',
    places: ['Varanasi Ghats, UP', 'Golden Temple, Amritsar', 'Tawang Monastery, Arunachal', 'Rishikesh, Uttarakhand'],
    link: '/destinations',
  },
  {
    id: 'adventure',
    label: 'Adventure & Altitude',
    emoji: '🏔️',
    color: '#FF6B35',
    headline: `The Himalayas don't disappoint`,
    body: `Cross passes at 5,000m. Camp on frozen lakes. Trek through valleys that haven't changed since the Silk Road. India's mountains are a life goal, not a checkbox.`,
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&q=85',
    places: ['Spiti Valley, Himachal', 'Ladakh High Passes', 'Dzukou Valley, Nagaland', 'Roopkund Trek, Uttarakhand'],
    link: '/tours',
  },
]

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const SEASON_DATA = [
  { region: 'Rajasthan & North Plains', icon: '🏰', color: '#F4A62A', months: [2, 2, 2, 3, 4, 4, 4, 4, 3, 1, 1, 1], tip: 'Oct–Mar is ideal — cool desert nights and clear skies for fort exploration.' },
  { region: 'Kerala & South Coast', icon: '🌴', color: '#1A6B5A', months: [1, 1, 2, 2, 3, 4, 4, 4, 3, 2, 1, 1], tip: 'Nov–Feb is perfect for backwaters and beaches before the monsoon arrives.' },
  { region: 'Ladakh & High Himalayas', icon: '🏔️', color: '#FF6B35', months: [4, 4, 4, 4, 3, 2, 1, 1, 2, 3, 4, 4], tip: 'Jul–Sep is the window — roads open, skies clear, Pangong at its most vivid.' },
  { region: 'Goa & West Coast', icon: '🏖️', color: '#9B59B6', months: [1, 1, 1, 2, 3, 4, 4, 4, 3, 2, 1, 1], tip: 'Nov–Mar brings warm days, calm seas, and the full festival season.' },
  { region: 'Northeast India', icon: '🌿', color: '#27AE60', months: [2, 2, 1, 1, 2, 4, 4, 4, 3, 1, 1, 2], tip: 'Oct–Apr is when living root bridges are most accessible and skies clearest.' },
  { region: 'Andaman Islands', icon: '🐠', color: '#2980B9', months: [1, 1, 1, 1, 2, 4, 4, 4, 3, 2, 1, 1], tip: 'Oct–May — dive season, bioluminescent nights, and Radhanagar Beach at its finest.' },
]
const SEASON_COLORS = { 1: { bg: '#1A6B5A', label: 'Peak' }, 2: { bg: '#F4A62A', label: 'Good' }, 3: { bg: '#c8a882', label: 'Fair' }, 4: { bg: 'rgba(44,26,14,0.15)', label: 'Avoid' } }

// ─── FLORAL DOT CANVAS ────────────────────────────────────────────────────────
function FloralCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return
    const ctx = canvas.getContext('2d')!; let raf: number
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize(); window.addEventListener('resize', resize)
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const gap = 52
      for (let x = 0; x < canvas.width + gap; x += gap) {
        for (let y = 0; y < canvas.height + gap; y += gap) {
          ctx.beginPath(); ctx.arc(x, y, 1.2, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(244,166,42,0.18)'; ctx.fill()
          ctx.strokeStyle = 'rgba(255,107,53,0.07)'; ctx.lineWidth = 0.5
          ctx.beginPath(); ctx.moveTo(x - 5, y); ctx.lineTo(x + 5, y); ctx.moveTo(x, y - 5); ctx.lineTo(x, y + 5); ctx.stroke()
        }
      }
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={ref} style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, opacity: 0.5 }} />
}

// ─── MANDALA CANVAS ───────────────────────────────────────────────────────────
function MandalaCanvas({ color }: { color: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const W = 520; canvas.width = W; canvas.height = W
    const cx = W / 2; const cy = W / 2
    let t = 0
    const hex = color.replace('#', '')
    const r = parseInt(hex.slice(0, 2), 16); const g = parseInt(hex.slice(2, 4), 16); const b = parseInt(hex.slice(4, 6), 16)
    const draw = () => {
      t += 0.004
      ctx.clearRect(0, 0, W, W)
      const rings = [
        { r: 210, petals: 24, len: 18, lw: 0.4, alpha: 0.12, speed: 1 },
        { r: 175, petals: 16, len: 22, lw: 0.6, alpha: 0.18, speed: -0.7 },
        { r: 138, petals: 12, len: 20, lw: 0.8, alpha: 0.25, speed: 1.2 },
        { r: 100, petals: 8, len: 24, lw: 1, alpha: 0.35, speed: -1 },
        { r: 62, petals: 6, len: 18, lw: 1.2, alpha: 0.45, speed: 0.8 },
      ]
      rings.forEach(ring => {
        const angle = t * ring.speed
        for (let i = 0; i < ring.petals; i++) {
          const a = (i / ring.petals) * Math.PI * 2 + angle
          const x1 = cx + ring.r * Math.cos(a); const y1 = cy + ring.r * Math.sin(a)
          const x2 = cx + (ring.r + ring.len) * Math.cos(a); const y2 = cy + (ring.r + ring.len) * Math.sin(a)
          ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2)
          ctx.strokeStyle = `rgba(${r},${g},${b},${ring.alpha})`
          ctx.lineWidth = ring.lw; ctx.stroke()
          ctx.beginPath(); ctx.arc(x2, y2, ring.lw * 1.4, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${r},${g},${b},${ring.alpha * 1.5})`; ctx.fill()
        }
        ctx.beginPath(); ctx.arc(cx, cy, ring.r, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${r},${g},${b},${ring.alpha * 0.5})`
        ctx.lineWidth = 0.5; ctx.stroke()
      })
      const spokes = 8
      for (let i = 0; i < spokes; i++) {
        const a = (i / spokes) * Math.PI * 2 + t * 0.3
        ctx.beginPath(); ctx.moveTo(cx, cy)
        ctx.lineTo(cx + 42 * Math.cos(a), cy + 42 * Math.sin(a))
        ctx.strokeStyle = `rgba(${r},${g},${b},0.5)`; ctx.lineWidth = i % 2 === 0 ? 1.5 : 0.7; ctx.stroke()
      }
      ctx.beginPath(); ctx.arc(cx, cy, 14, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(${r},${g},${b},0.6)`; ctx.lineWidth = 1.5; ctx.stroke()
      ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${r},${g},${b},0.9)`; ctx.fill()
      animRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(animRef.current)
  }, [color])
  return <canvas ref={ref} style={{ width: '100%', height: '100%', opacity: 0.85 }} />
}

// ─── HERO SECTION ─────────────────────────────────────────────────────────────
function HeroSection() {
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)
  const springX = useSpring(mouseX, { stiffness: 35, damping: 22 })
  const springY = useSpring(mouseY, { stiffness: 35, damping: 22 })
  const pX = useTransform(springX, [0, 1], [-22, 22])
  const pY = useTransform(springY, [0, 1], [-12, 12])
  const pXs = useTransform(springX, [0, 1], [-10, 10])
  const pYs = useTransform(springY, [0, 1], [-6, 6])
  const rotZ = useTransform(springX, [0, 1], [-2.5, 2.5])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
  }, [mouseX, mouseY])

  const WORDS = ['Culture.', 'Discovery.', 'Heritage.', 'Wilderness.', 'Ritual.', 'Depth.']
  const [wordIdx, setWordIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setWordIdx(i => (i + 1) % WORDS.length), 2200)
    return () => clearInterval(t)
  }, [])

  // Floating India fact pills
  const FACTS = [
    { text: '28+ States', sub: 'to explore', color: '#F4A62A', x: '72%', y: '22%' },
    { text: '42 UNESCO Sites', sub: 'world heritage', color: '#34d399', x: '68%', y: '62%' },
    { text: '4,000+ years', sub: 'of civilisation', color: '#a78bfa', x: '78%', y: '42%' },
  ]

  return (
    <section
      style={{ position: 'relative', height: '100vh', minHeight: 700, overflow: 'hidden', background: '#0A0705' }}
      onMouseMove={handleMouseMove}
    >
      <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1920&q=80')", backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.18) saturate(0.5)', zIndex: 0 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 60% 50%, rgba(255,107,53,0.07) 0%, transparent 65%), radial-gradient(ellipse at 20% 80%, rgba(244,166,42,0.05) 0%, transparent 50%)', zIndex: 1 }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%', background: 'linear-gradient(to top, #0A0705 0%, transparent 100%)', zIndex: 2 }} />
      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '55%', background: 'linear-gradient(to right, rgba(10,7,5,0.85) 0%, transparent 100%)', zIndex: 2 }} />

      {/* Tricolour */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, display: 'flex', zIndex: 10 }}>
        <div style={{ flex: 1, background: '#FF9933' }} /><div style={{ flex: 1, background: 'rgba(255,255,255,0.75)' }} /><div style={{ flex: 1, background: '#138808' }} />
      </div>

      {/* Mandala — right side */}
      <motion.div style={{ position: 'absolute', right: '-4vw', top: '50%', translateY: '-50%', width: 'clamp(380px,44vw,620px)', height: 'clamp(380px,44vw,620px)', zIndex: 3, x: pXs, y: pYs, rotate: rotZ }}>
        <MandalaCanvas color="#F4A62A" />
      </motion.div>

      {/* Floating fact pills */}
      {FACTS.map((f, i) => (
        <motion.div key={f.text}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
          transition={{ opacity: { delay: 1.4 + i * 0.2 }, scale: { delay: 1.4 + i * 0.2, type: 'spring' }, y: { duration: 3.5 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 1 } }}
          style={{ position: 'absolute', left: f.x, top: f.y, zIndex: 4, background: 'rgba(10,7,5,0.88)', border: `1px solid ${f.color}40`, borderRadius: 6, padding: '10px 16px', backdropFilter: 'blur(12px)' }}>
          <p style={{ fontFamily: '"Space Mono", monospace', fontSize: 11, fontWeight: 700, color: f.color, margin: 0, letterSpacing: '0.05em' }}>{f.text}</p>
          <p style={{ fontFamily: '"Space Mono", monospace', fontSize: 7, letterSpacing: '0.2em', textTransform: 'uppercase', color: `${f.color}60`, margin: '2px 0 0' }}>{f.sub}</p>
        </motion.div>
      ))}

      {/* LEFT: main copy */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 clamp(32px,7vw,120px)', zIndex: 5 }}>
        <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
          style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 32, height: 1, background: 'rgba(244,166,42,0.7)' }} />
          <span style={{ fontFamily: '"Space Mono", monospace', fontSize: 9, letterSpacing: '0.5em', textTransform: 'uppercase', color: 'rgba(244,166,42,0.8)' }}>Pavilion · Curated India Journeys</span>
        </motion.div>

        <div style={{ overflow: 'hidden' }}>
          <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }} style={{ x: pXs, y: pYs }}>
            <p style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 'clamp(1.3rem,2vw,2.1rem)', letterSpacing: '0.55em', color: 'rgba(255,248,240,0.2)', margin: 0, lineHeight: 1 }}>DISCOVER</p>
          </motion.div>
        </div>
        <div style={{ overflow: 'hidden' }}>
          <motion.div initial={{ y: 140, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.05, delay: 0.38, ease: [0.16, 1, 0.3, 1] }} style={{ x: pX, y: pY }}>
            <h1 style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 'clamp(5rem,10.5vw,13rem)', letterSpacing: '0.025em', lineHeight: 0.85, margin: 0, color: '#FFF8F0' }}>INCREDIBLE</h1>
          </motion.div>
        </div>
        <div style={{ overflow: 'hidden' }}>
          <motion.div initial={{ y: 140, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.1, delay: 0.46, ease: [0.16, 1, 0.3, 1] }} style={{ x: pXs, y: pYs }}>
            <h1 style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 'clamp(5rem,10.5vw,13rem)', letterSpacing: '0.025em', lineHeight: 0.85, margin: 0, color: '#F4A62A' }}>INDIA</h1>
          </motion.div>
        </div>

        {/* Rotating tagline */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}
          style={{ marginTop: 22, display: 'flex', alignItems: 'baseline', gap: 10, maxWidth: 520 }}>
          <p style={{ fontFamily: '"Crimson Text", serif', fontStyle: 'italic', fontSize: 'clamp(16px,1.4vw,20px)', color: 'rgba(255,248,240,0.38)', margin: 0, whiteSpace: 'nowrap' }}>India&apos;s</p>
          <div style={{ overflow: 'hidden', height: 'clamp(20px,1.8vw,26px)', position: 'relative', minWidth: 160 }}>
            <AnimatePresence mode="wait">
              <motion.span key={wordIdx} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -30, opacity: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                style={{ position: 'absolute', fontFamily: '"Crimson Text", serif', fontStyle: 'italic', fontSize: 'clamp(16px,1.4vw,20px)', color: '#F4A62A', whiteSpace: 'nowrap' }}>
                {WORDS[wordIdx]}
              </motion.span>
            </AnimatePresence>
          </div>
          <p style={{ fontFamily: '"Crimson Text", serif', fontStyle: 'italic', fontSize: 'clamp(16px,1.4vw,20px)', color: 'rgba(255,248,240,0.38)', margin: 0, whiteSpace: 'nowrap' }}>Guided by locals.</p>
        </motion.div>

        {/* CTAs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05, duration: 0.7 }}
          style={{ display: 'flex', gap: 12, marginTop: 32, flexWrap: 'wrap' }}>
          <Link to="/destinations"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#FF6B35', color: '#0A0705', fontFamily: '"Space Mono", monospace', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, padding: '14px 28px', borderRadius: 2, textDecoration: 'none', boxShadow: '0 8px 32px rgba(255,107,53,0.4)', transition: 'transform 0.2s, box-shadow 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(255,107,53,0.55)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(255,107,53,0.4)' }}>
            Start Exploring <FiArrowRight size={12} />
          </Link>
          <Link to="/tours"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, border: '1px solid rgba(255,248,240,0.2)', color: 'rgba(255,248,240,0.65)', fontFamily: '"Space Mono", monospace', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '14px 28px', borderRadius: 2, textDecoration: 'none', backdropFilter: 'blur(8px)', transition: 'border-color 0.25s, color 0.25s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(244,166,42,0.5)'; (e.currentTarget as HTMLElement).style.color = '#F4A62A' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,248,240,0.2)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,248,240,0.65)' }}>
            Browse Tours
          </Link>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
        style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <motion.div animate={{ scaleY: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: 1, height: 36, background: 'linear-gradient(to bottom, transparent, rgba(255,248,240,0.3))' }} />
        <span style={{ fontFamily: '"Space Mono", monospace', fontSize: 7, letterSpacing: '0.4em', color: 'rgba(255,248,240,0.18)', textTransform: 'uppercase' }}>Scroll</span>
      </motion.div>
    </section>
  )
}

// ─── DESTINATION CARD (no ratings — in-progress project) ──────────────────────
function DestCard({ dest, index }: { dest: typeof INDIA_DESTINATIONS[0]; index: number }) {
  const [hover, setHover] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ delay: index * 0.09, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ position: 'relative', borderRadius: 4, overflow: 'hidden', cursor: 'pointer', transform: hover ? 'translateY(-10px)' : 'none', transition: 'transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s', boxShadow: hover ? `0 24px 60px rgba(0,0,0,0.18), 0 0 0 2px ${dest.accent}60` : '0 4px 20px rgba(0,0,0,0.08)' }}>
      <div style={{ height: 280, overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${dest.image})`, backgroundSize: 'cover', backgroundPosition: 'center', transform: hover ? 'scale(1.08)' : 'scale(1)', transition: 'transform 0.7s ease' }} />
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, rgba(26,20,10,0.95) 0%, rgba(26,20,10,0.3) 55%, transparent 100%)` }} />
        {/* Region badge — no fake ratings */}
        <div style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(255,248,240,0.12)', backdropFilter: 'blur(8px)', border: `1px solid ${dest.accent}40`, borderRadius: 100, padding: '4px 12px' }}>
          <span style={{ fontFamily: '"Space Mono", monospace', fontSize: 8, letterSpacing: '0.15em', color: dest.accent, textTransform: 'uppercase' }}>{dest.region}</span>
        </div>
      </div>
      <div style={{ padding: '20px 22px 22px', background: '#FFF8F0', borderTop: `3px solid ${dest.accent}` }}>
        <h3 style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 28, letterSpacing: '0.04em', color: '#2C1A0E', margin: '0 0 4px', lineHeight: 1 }}>{dest.name}</h3>
        <p style={{ fontFamily: '"Space Mono", monospace', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(44,26,14,0.45)', margin: '0 0 10px' }}>{dest.tag}</p>
        <p style={{ fontFamily: '"Crimson Text", serif', fontStyle: 'italic', fontSize: 14, color: 'rgba(44,26,14,0.6)', lineHeight: 1.55, margin: '0 0 14px' }}>{dest.desc}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: '"Space Mono", monospace', fontSize: 9, color: dest.accent, letterSpacing: '0.1em' }}>{dest.tours} tours available</span>
          <motion.div animate={{ x: hover ? 4 : 0 }} transition={{ duration: 0.25 }}><FiArrowRight size={15} color={dest.accent} /></motion.div>
        </div>
      </div>
    </motion.div>
  )
}

// ─── JOURNEY EXPLORER — replaces "How It Works" ──────────────────────────────
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
        <div style={{ marginBottom: 60 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 28, height: 1, background: 'rgba(244,166,42,0.6)' }} />
            <span style={{ fontFamily: '"Space Mono", monospace', fontSize: 9, letterSpacing: '0.45em', textTransform: 'uppercase', color: 'rgba(244,166,42,0.65)' }}>What Awaits You</span>
          </div>
          <h2 style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 'clamp(3rem,6vw,7rem)', letterSpacing: '0.02em', lineHeight: 0.88, color: '#FFF8F0', margin: 0 }}>
            CHOOSE YOUR<br /><span style={{ color: '#F4A62A' }}>INDIA</span>
          </h2>
          <p style={{ fontFamily: '"Crimson Text", serif', fontStyle: 'italic', fontSize: 18, color: 'rgba(255,248,240,0.4)', maxWidth: 500, lineHeight: 1.7, marginTop: 14 }}>
            India is not one place. It is every place. Pick the version that calls to you.
          </p>
        </div>

        {/* Tab buttons */}
        <div style={{ display: 'flex', gap: 3, marginBottom: 0, flexWrap: 'wrap' }}>
          {JOURNEYS.map((j, i) => (
            <button key={j.id} onClick={() => setActive(i)}
              style={{ flex: '1 1 auto', minWidth: 140, padding: '18px 20px', textAlign: 'left', background: active === i ? 'rgba(255,255,255,0.05)' : 'transparent', border: 'none', borderTop: `2px solid ${active === i ? j.color : 'rgba(255,255,255,0.08)'}`, cursor: 'pointer', transition: 'all 0.3s' }}>
              <p style={{ fontFamily: '"Space Mono", monospace', fontSize: 18, margin: '0 0 6px', filter: active === i ? 'none' : 'grayscale(1) opacity(0.5)' }}>{j.emoji}</p>
              <p style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 22, letterSpacing: '0.05em', color: active === i ? '#FFF8F0' : 'rgba(255,248,240,0.3)', margin: 0, lineHeight: 1, transition: 'color 0.3s' }}>{j.label}</p>
            </button>
          ))}
        </div>

        {/* Content panel */}
        <AnimatePresence mode="wait">
          <motion.div key={active}
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderTop: 'none' }}>
            {/* Left: text */}
            <div style={{ padding: '52px 52px 52px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h3 style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 'clamp(2rem,3.5vw,3.2rem)', letterSpacing: '0.03em', lineHeight: 0.95, color: '#FFF8F0', marginBottom: 16 }}>{cur.headline}</h3>
              <p style={{ fontFamily: '"Crimson Text", serif', fontStyle: 'italic', fontSize: 18, color: 'rgba(255,248,240,0.5)', lineHeight: 1.75, marginBottom: 28 }}>{cur.body}</p>
              {/* Place pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
                {cur.places.map(p => (
                  <span key={p} style={{ fontFamily: '"Space Mono", monospace', fontSize: 8, letterSpacing: '0.1em', padding: '5px 12px', borderRadius: 100, background: `${cur.color}12`, border: `1px solid ${cur.color}35`, color: cur.color }}>
                    <FiMapPin size={8} style={{ marginRight: 5, verticalAlign: 'middle' }} />{p}
                  </span>
                ))}
              </div>
              <Link to={cur.link}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontFamily: '"Space Mono", monospace', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: cur.color, textDecoration: 'none', fontWeight: 700, transition: 'gap 0.25s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.gap = '14px'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.gap = '9px'}>
                Explore this path <FiArrowRight size={12} />
              </Link>
            </div>
            {/* Right: image */}
            <div style={{ position: 'relative', overflow: 'hidden', minHeight: 400 }}>
              <motion.div key={cur.image}
                initial={{ scale: 1.08, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{ position: 'absolute', inset: 0, backgroundImage: `url(${cur.image})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.55) saturate(0.7)' }} />
              <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to right, rgba(10,7,5,0.6) 0%, transparent 60%)` }} />
              {/* Decorative journey number */}
              <div style={{ position: 'absolute', bottom: 24, right: 28, fontFamily: '"Bebas Neue", sans-serif', fontSize: 100, letterSpacing: '0.02em', color: `${cur.color}15`, lineHeight: 1, userSelect: 'none' }}>0{active + 1}</div>
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
        <div style={{ marginBottom: 56 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 20 }}>🗓️</span>
            <span style={{ fontFamily: '"Space Mono", monospace', fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#FF6B35' }}>Plan Your Trip</span>
          </div>
          <h2 style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 'clamp(3rem,6vw,6.5rem)', letterSpacing: '0.02em', lineHeight: 0.9, color: '#2C1A0E', margin: 0 }}>
            BEST TIME TO<br /><span style={{ color: '#FF6B35' }}>VISIT INDIA</span>
          </h2>
          <div style={{ display: 'flex', height: 4, width: 160, borderRadius: 2, overflow: 'hidden', marginTop: 18 }}>
            <div style={{ flex: 1, background: '#FF9933' }} /><div style={{ flex: 1, background: '#F4A62A' }} /><div style={{ flex: 1, background: '#1A6B5A' }} />
          </div>
          <p style={{ fontFamily: '"Crimson Text", serif', fontStyle: 'italic', fontSize: 18, color: 'rgba(44,26,14,0.55)', marginTop: 16, maxWidth: 520, lineHeight: 1.7 }}>
            India&apos;s vast geography means every month is perfect somewhere. Tap a month to find out where.
          </p>
        </div>

        {/* Month buttons */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 32, flexWrap: 'wrap' }}>
          {MONTHS.map((m, i) => {
            const isActive = activeMonth === i
            const peakCount = SEASON_DATA.filter(r => r.months[i] === 1).length
            return (
              <motion.button key={m} onClick={() => setActiveMonth(isActive ? null : i)} whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}
                style={{ position: 'relative', padding: '10px 16px', borderRadius: 2, fontFamily: '"Space Mono", monospace', fontSize: 10, letterSpacing: '0.15em', background: isActive ? '#FF6B35' : '#FFF0E0', border: `1px solid ${isActive ? '#FF6B35' : 'rgba(44,26,14,0.12)'}`, color: isActive ? '#fff' : '#4A3520', cursor: 'pointer', transition: 'all 0.2s', fontWeight: isActive ? 700 : 400, boxShadow: isActive ? '0 4px 16px rgba(255,107,53,0.3)' : 'none' }}>
                {m}
                {peakCount > 0 && <span style={{ position: 'absolute', top: -5, right: -5, width: 14, height: 14, background: '#1A6B5A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Space Mono", monospace', fontSize: 7, color: '#fff', fontWeight: 700 }}>{peakCount}</span>}
              </motion.button>
            )
          })}
          {activeMonth !== null && <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setActiveMonth(null)} style={{ padding: '10px 14px', borderRadius: 2, fontFamily: '"Space Mono", monospace', fontSize: 9, background: 'transparent', border: '1px solid rgba(44,26,14,0.15)', color: 'rgba(44,26,14,0.4)', cursor: 'pointer', letterSpacing: '0.1em' }}>Clear ✕</motion.button>}
        </div>

        {/* Highlight bar */}
        <AnimatePresence>
          {activeMonth !== null && (
            <motion.div key={activeMonth} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ marginBottom: 28, padding: '16px 20px', background: 'rgba(255,107,53,0.06)', border: '1px solid rgba(255,107,53,0.2)', borderRadius: 4, display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'center' }}>
              <div>
                <p style={{ fontFamily: '"Space Mono", monospace', fontSize: 8, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(44,26,14,0.4)', margin: '0 0 4px' }}>Peak season in {MONTHS[activeMonth]}</p>
                <p style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 22, color: '#1A6B5A', margin: 0, letterSpacing: '0.04em' }}>{peakThisMonth.length > 0 ? peakThisMonth.join(' · ') : 'No peak regions'}</p>
              </div>
              {goodThisMonth.length > 0 && <div>
                <p style={{ fontFamily: '"Space Mono", monospace', fontSize: 8, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(44,26,14,0.4)', margin: '0 0 4px' }}>Also good in {MONTHS[activeMonth]}</p>
                <p style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 18, color: '#F4A62A', margin: 0, letterSpacing: '0.04em' }}>{goodThisMonth.join(' · ')}</p>
              </div>}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid table */}
        <div style={{ overflowX: 'auto', marginBottom: 40 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
            <thead>
              <tr>
                <th style={{ fontFamily: '"Space Mono", monospace', fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(44,26,14,0.4)', textAlign: 'left', padding: '0 12px 16px 0', fontWeight: 400, whiteSpace: 'nowrap', width: 200 }}>Region</th>
                {MONTHS.map((m, i) => (
                  <th key={m} style={{ fontFamily: '"Space Mono", monospace', fontSize: 9, letterSpacing: '0.08em', color: activeMonth === i ? '#FF6B35' : 'rgba(44,26,14,0.5)', padding: '0 0 16px', textAlign: 'center', fontWeight: activeMonth === i ? 700 : 400, cursor: 'pointer', transition: 'color 0.2s', width: 42 }}
                    onClick={() => setActiveMonth(activeMonth === i ? null : i)}>{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SEASON_DATA.map(row => (
                <tr key={row.region} style={{ borderTop: '1px solid rgba(44,26,14,0.06)' }}>
                  <td style={{ padding: '10px 12px 10px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 16 }}>{row.icon}</span>
                      <p style={{ fontFamily: '"Space Mono", monospace', fontSize: 9, letterSpacing: '0.08em', color: '#2C1A0E', margin: 0 }}>{row.region}</p>
                    </div>
                  </td>
                  {row.months.map((rating, mi) => {
                    const sc = SEASON_COLORS[rating as keyof typeof SEASON_COLORS]
                    return (
                      <td key={mi} style={{ padding: '10px 2px', textAlign: 'center' }}>
                        <motion.div whileHover={{ scale: 1.15 }} style={{ width: 28, height: 28, borderRadius: 3, margin: '0 auto', background: sc.bg, border: activeMonth === mi ? '2px solid rgba(44,26,14,0.3)' : '2px solid transparent', transition: 'border 0.2s' }} title={`${row.region} in ${MONTHS[mi]}: ${sc.label}`} />
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
          <span style={{ fontFamily: '"Space Mono", monospace', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(44,26,14,0.35)' }}>Legend:</span>
          {Object.entries(SEASON_COLORS).map(([k, v]) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 16, height: 16, borderRadius: 3, background: v.bg, border: '1px solid rgba(44,26,14,0.1)' }} />
              <span style={{ fontFamily: '"Space Mono", monospace', fontSize: 9, color: 'rgba(44,26,14,0.55)', letterSpacing: '0.1em' }}>{v.label}</span>
            </div>
          ))}
        </div>

        {/* Region tip cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {SEASON_DATA.map((row, i) => (
            <motion.div key={row.region} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              style={{ padding: '18px 20px', background: '#FFF0E0', border: '1px solid rgba(44,26,14,0.08)', borderLeft: `3px solid ${row.color}`, borderRadius: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 18 }}>{row.icon}</span>
                <p style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 17, letterSpacing: '0.04em', color: '#2C1A0E', margin: 0 }}>{row.region}</p>
              </div>
              <p style={{ fontFamily: '"Crimson Text", serif', fontStyle: 'italic', fontSize: 14, color: 'rgba(44,26,14,0.6)', lineHeight: 1.6, margin: 0 }}>{row.tip}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [featuredTours, setFeaturedTours] = useState<any[]>([])

  useEffect(() => {
    fetch('http://localhost:5000/api/tours/featured')
      .then(r => r.json())
      .then(data => { setFeaturedTours((data.data?.tours || []).slice(0, 3)) })
      .catch(() => { })
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#FFF8F0', color: '#2C1A0E', fontFamily: '"Crimson Text", Georgia, serif', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { overflow-x: hidden; background: #FFF8F0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #FFF8F0; }
        ::-webkit-scrollbar-thumb { background: rgba(255,107,53,0.35); border-radius: 2px; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes spinSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .tour-card { transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s; }
        .tour-card:hover { transform: translateY(-8px); box-shadow: 0 20px 50px rgba(0,0,0,0.12); }
      `}</style>

      <FloralCanvas />

      {/* ── HERO ── */}
      <HeroSection />

      {/* ── FEATURED DESTINATIONS ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '96px clamp(24px,6vw,100px)', background: '#FFF8F0' }}>
        <div style={{ marginBottom: 56, maxWidth: 620 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <GiLotusFlower style={{ color: '#FF6B35', fontSize: 18 }} />
            <span style={{ fontFamily: '"Space Mono", monospace', fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#FF6B35' }}>Where We Take You</span>
          </div>
          <h2 style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 'clamp(3rem,6vw,6.5rem)', letterSpacing: '0.02em', lineHeight: 0.9, color: '#2C1A0E', margin: 0 }}>
            INDIA&apos;S FINEST<br /><span style={{ color: '#FF6B35' }}>DESTINATIONS</span>
          </h2>
          <div style={{ display: 'flex', height: 4, width: 160, borderRadius: 2, overflow: 'hidden', marginTop: 18 }}>
            <div style={{ flex: 1, background: '#FF9933' }} /><div style={{ flex: 1, background: '#F4A62A' }} /><div style={{ flex: 1, background: '#1A6B5A' }} />
          </div>
          <p style={{ fontFamily: '"Crimson Text", serif', fontStyle: 'italic', fontSize: 16, color: 'rgba(44,26,14,0.55)', marginTop: 14, lineHeight: 1.7 }}>
            Every destination here is lived-in and real — no tourist traps. Each one handpicked for soul, depth and genuine cultural richness.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20, marginBottom: 44 }}>
          {INDIA_DESTINATIONS.map((d, i) => <DestCard key={d.name} dest={d} index={i} />)}
        </div>
        <div style={{ textAlign: 'center' }}>
          <Link to="/destinations"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, border: '2px solid #1A6B5A', color: '#1A6B5A', fontFamily: '"Space Mono", monospace', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, padding: '14px 32px', borderRadius: 2, textDecoration: 'none', transition: 'background 0.25s, color 0.25s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#1A6B5A'; (e.currentTarget as HTMLElement).style.color = '#FFF8F0' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#1A6B5A' }}>
            View All Destinations <FiArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── JOURNEY EXPLORER (replaces How It Works) ── */}
      <JourneyExplorer />

      {/* ── FEATURED TOURS ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '0 clamp(24px,6vw,100px) 96px', background: '#FFF8F0', borderTop: '1px solid rgba(255,107,53,0.1)' }}>
        <div style={{ paddingTop: 80, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 44, flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <GiCompass style={{ color: '#F4A62A', fontSize: 18 }} />
              <span style={{ fontFamily: '"Space Mono", monospace', fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#F4A62A' }}>Handpicked for You</span>
            </div>
            <h2 style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 'clamp(2.8rem,5vw,5.5rem)', letterSpacing: '0.02em', lineHeight: 0.9, color: '#2C1A0E', margin: 0 }}>
              FEATURED<br /><span style={{ color: '#F4A62A' }}>TOURS</span>
            </h2>
          </div>
          <Link to="/tours"
            style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid rgba(244,166,42,0.4)', padding: '10px 20px', borderRadius: 2, textDecoration: 'none', fontFamily: '"Space Mono", monospace', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F4A62A', transition: 'background 0.2s' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(244,166,42,0.08)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}>
            All Tours <FiArrowRight size={11} />
          </Link>
        </div>

        {featuredTours.length === 0 ? (
          /* Graceful empty state instead of blank space */
          <div style={{ textAlign: 'center', padding: '60px 0', border: '1px dashed rgba(44,26,14,0.12)', borderRadius: 4 }}>
            <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>🧭</span>
            <h3 style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 32, letterSpacing: '0.04em', color: 'rgba(44,26,14,0.3)', marginBottom: 10 }}>Tours launching soon</h3>
            <p style={{ fontFamily: '"Crimson Text", serif', fontStyle: 'italic', fontSize: 16, color: 'rgba(44,26,14,0.4)', marginBottom: 24 }}>We&apos;re curating extraordinary journeys across India. Check back shortly.</p>
            <Link to="/tours" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#FF6B35', color: '#fff', fontFamily: '"Space Mono", monospace', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, padding: '12px 24px', borderRadius: 2, textDecoration: 'none' }}>
              Browse Available Tours <FiArrowRight size={11} />
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {featuredTours.map((t: any, i: number) => (
              <motion.div key={t._id} initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="tour-card">
                <Link to={`/tours/${t.slug}`} style={{ display: 'block', textDecoration: 'none', background: '#FFF8F0', border: '1px solid rgba(44,26,14,0.1)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${t.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'transform 0.7s ease' }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = 'scale(1.07)')}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = 'scale(1)')} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(44,26,14,0.85) 0%, transparent 55%)' }} />
                    <div style={{ position: 'absolute', top: 12, left: 12, background: '#FF6B35', borderRadius: 2, padding: '3px 10px', fontFamily: '"Space Mono", monospace', fontSize: 8, letterSpacing: '0.2em', color: '#fff', textTransform: 'uppercase' }}>{t.difficulty}</div>
                  </div>
                  <div style={{ padding: '18px 20px 20px' }}>
                    <p style={{ fontFamily: '"Space Mono", monospace', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#FF6B35', margin: '0 0 5px' }}>{t.destination?.name}</p>
                    <h3 style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 26, letterSpacing: '0.04em', color: '#2C1A0E', margin: '0 0 8px', lineHeight: 1 }}>{t.title}</h3>
                    <p style={{ fontFamily: '"Crimson Text", serif', fontStyle: 'italic', fontSize: 14, color: 'rgba(44,26,14,0.55)', lineHeight: 1.55, margin: '0 0 14px' }}>{(t.summary || '').substring(0, 90)}…</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(44,26,14,0.08)', paddingTop: 12 }}>
                      <div style={{ display: 'flex', gap: 14 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: '"Space Mono", monospace', fontSize: 9, color: 'rgba(44,26,14,0.45)' }}><FiClock size={10} color="#FF6B35" /> {t.duration}D</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: '"Space Mono", monospace', fontSize: 9, color: 'rgba(44,26,14,0.45)' }}><FiUsers size={10} color="#FF6B35" /> Max {t.groupSize?.max}</span>
                      </div>
                      <span style={{ fontFamily: '"Space Mono", monospace', fontSize: 12, fontWeight: 700, color: '#1A6B5A' }}>FROM ₹{(t.discountPrice ?? t.price)?.toLocaleString()}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ── BEST TIME TO VISIT ── */}
      <BestTimeSection />

      {/* ── FINAL CTA — welcoming, grounded ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '100px clamp(24px,6vw,100px)', overflow: 'hidden', background: '#0A0705' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1600&q=80')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.08 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(244,166,42,0.06) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, display: 'flex' }}>
          <div style={{ flex: 1, background: '#FF9933' }} /><div style={{ flex: 1, background: 'rgba(255,255,255,0.5)' }} /><div style={{ flex: 1, background: '#138808' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            {/* Animated compass */}
            <motion.div animate={{ rotate: [0, 15, -15, 10, -10, 0] }} transition={{ duration: 4, repeat: Infinity, repeatDelay: 3 }}
              style={{ display: 'inline-block', marginBottom: 24 }}>
              <GiCompass style={{ color: '#F4A62A', fontSize: 52 }} />
            </motion.div>

            <p style={{ fontFamily: '"Space Mono", monospace', fontSize: 9, letterSpacing: '0.45em', textTransform: 'uppercase', color: 'rgba(244,166,42,0.6)', marginBottom: 16 }}>Your journey begins here</p>

            <h2 style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 'clamp(3rem,7vw,6.5rem)', letterSpacing: '0.02em', lineHeight: 0.9, color: '#FFF8F0', marginBottom: 20 }}>
              INDIA IS WAITING<br /><span style={{ color: '#F4A62A' }}>FOR YOU</span>
            </h2>

            <p style={{ fontFamily: '"Crimson Text", serif', fontStyle: 'italic', fontSize: 19, color: 'rgba(255,248,240,0.5)', lineHeight: 1.8, maxWidth: 520, margin: '0 auto 40px' }}>
              Pavilion is a project born from a love of this country and everything it holds. Explore freely, discover honestly, and travel with genuine curiosity.
            </p>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/destinations"
                style={{ background: '#FF6B35', color: '#fff', fontFamily: '"Space Mono", monospace', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, padding: '15px 36px', borderRadius: 2, textDecoration: 'none', boxShadow: '0 8px 28px rgba(255,107,53,0.35)', display: 'inline-flex', alignItems: 'center', gap: 10, transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(255,107,53,0.5)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 28px rgba(255,107,53,0.35)' }}>
                Explore Destinations <FiArrowRight size={13} />
              </Link>
              <Link to="/about"
                style={{ border: '1px solid rgba(255,248,240,0.2)', color: 'rgba(255,248,240,0.6)', fontFamily: '"Space Mono", monospace', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '15px 36px', borderRadius: 2, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10, backdropFilter: 'blur(8px)', transition: 'border-color 0.25s, color 0.25s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(244,166,42,0.4)'; (e.currentTarget as HTMLElement).style.color = '#F4A62A' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,248,240,0.2)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,248,240,0.6)' }}>
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