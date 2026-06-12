import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'

/* ── Star Canvas ────────────────────────────────────────────────────────────── */
function StarCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return
    const ctx = canvas.getContext('2d')!; let raf: number
    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.3 + 0.2,
      a: Math.random(), speed: Math.random() * 0.003 + 0.001,
    }))
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize(); window.addEventListener('resize', resize)
    let t = 0
    const draw = () => {
      t += 0.005; ctx.clearRect(0, 0, canvas.width, canvas.height)
      stars.forEach(s => {
        const f = s.a * (0.3 + 0.5 * Math.abs(Math.sin(t * s.speed + s.a * 8)))
        ctx.beginPath(); ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${f})`; ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={ref} style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />
}

/* ── Mandala Pattern BG ──────────────────────────────────────────────────────── */
function MandalaCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; drawMandala() }
    const drawMandala = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const gap = 64
      for (let x = 0; x < canvas.width + gap; x += gap) {
        for (let y = 0; y < canvas.height + gap; y += gap) {
          ctx.beginPath(); ctx.arc(x, y, 1.1, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(201,169,110,0.12)'; ctx.fill()
          ctx.strokeStyle = 'rgba(255,107,53,0.05)'; ctx.lineWidth = 0.5
          ctx.beginPath(); ctx.moveTo(x - 6, y); ctx.lineTo(x + 6, y)
          ctx.moveTo(x, y - 6); ctx.lineTo(x, y + 6); ctx.stroke()
        }
      }
    }
    resize(); window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])
  return <canvas ref={ref} style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, opacity: 0.6 }} />
}

/* ── Indian Guide SVG Character ─────────────────────────────────────────────── */
function GuideCharacter() {
  return (
    <svg viewBox="0 0 220 400" style={{ width: 200, position: 'relative', zIndex: 10 }} fill="none">
      {/* Sherwani body */}
      <rect x="68" y="155" width="84" height="170" rx="10" fill="#1a3a1c" />
      <path d="M96 155 L110 182 L124 155" fill="#122813" />
      <path d="M110 155 L110 195" stroke="#c9a96e" strokeWidth="2" strokeDasharray="4 3" />
      {[168, 185, 202, 219, 235, 252].map((y, i) => (
        <g key={i}>
          <circle cx="110" cy={y} r="3" fill="#c9a96e" />
          <circle cx="110" cy={y} r="1.4" fill="#f0ebe0" />
        </g>
      ))}
      {/* Collar */}
      <path d="M92 160 Q110 152 128 160" stroke="#c9a96e" strokeWidth="2.5" fill="none" />
      {/* Dupatta / Stole */}
      <path d="M72 158 Q55 180 38 230 Q30 255 45 272" stroke="#c9a96e" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.85" />
      {/* Left sleeve */}
      <path d="M68 162 Q52 192 54 225" stroke="#122813" strokeWidth="15" strokeLinecap="round" fill="none" />
      {/* Right sleeve — waving/welcoming hand */}
      <path d="M152 162 Q172 140 178 110 Q180 95 172 88" stroke="#122813" strokeWidth="13" strokeLinecap="round" fill="none" />
      {/* Legs */}
      <path d="M76 318 L80 380 L100 380 L110 355 L120 380 L140 380 L144 318Z" fill="#122813" />
      {/* Neck */}
      <rect x="102" y="124" width="16" height="34" rx="8" fill="#c8956c" />
      {/* Head */}
      <ellipse cx="110" cy="98" rx="32" ry="36" fill="#c8956c" />
      {/* Turban */}
      <ellipse cx="110" cy="68" rx="36" ry="18" fill="#c9a96e" />
      <ellipse cx="110" cy="65" rx="30" ry="14" fill="#e8c47a" />
      <path d="M75 72 Q78 50 110 48 Q142 50 145 72" fill="#c9a96e" />
      {/* Turban fabric wrap lines */}
      <path d="M78 68 Q110 58 142 68" stroke="rgba(201,169,110,0.4)" strokeWidth="1.5" fill="none" />
      <path d="M80 72 Q110 62 140 72" stroke="rgba(201,169,110,0.4)" strokeWidth="1.5" fill="none" />
      {/* Turban jewel */}
      <circle cx="110" cy="53" r="5" fill="#ff9933" />
      <circle cx="110" cy="53" r="2.5" fill="#fff" />
      {/* Eyes */}
      <ellipse cx="99" cy="97" rx="5" ry="5.5" fill="#1a0800" />
      <ellipse cx="121" cy="97" rx="5" ry="5.5" fill="#1a0800" />
      <circle cx="101" cy="95.5" r="1.8" fill="white" />
      <circle cx="123" cy="95.5" r="1.8" fill="white" />
      {/* Warm smile */}
      <path d="M97 115 Q110 128 123 115" stroke="#8b4513" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Nose */}
      <path d="M107 104 Q104 110 107 113 Q110 115 113 113 Q116 110 113 104" stroke="#a0704a" strokeWidth="1.2" fill="none" />
      {/* Moustache */}
      <path d="M101 112 Q110 109 119 112" stroke="#4a2800" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      {/* Right hand — waving */}
      <ellipse cx="170" cy="100" rx="9" ry="12" fill="#c8956c" transform="rotate(-15 170 100)" />
      {/* Fingers slightly spread */}
      <path d="M164 90 Q162 80 164 74" stroke="#c8956c" strokeWidth="4" strokeLinecap="round" />
      <path d="M168 88 Q167 77 169 71" stroke="#c8956c" strokeWidth="4" strokeLinecap="round" />
      <path d="M173 89 Q173 78 174 72" stroke="#c8956c" strokeWidth="4" strokeLinecap="round" />
      <path d="M177 92 Q178 82 178 77" stroke="#c8956c" strokeWidth="4" strokeLinecap="round" />
      {/* Left hand */}
      <ellipse cx="51" cy="230" rx="8" ry="11" fill="#c8956c" />
      {/* Namaste gesture subtle lines */}
      <path d="M158 170 L175 160" stroke="rgba(201,169,110,0.3)" strokeWidth="1" strokeDasharray="3 4" />
    </svg>
  )
}

/* ── Tricolour Bar ───────────────────────────────────────────────────────────── */
function TriBar({ width = 160, height = 3 }: { width?: string | number; height?: number }) {
  return (
    <div style={{ display: 'flex', height, borderRadius: 2, overflow: 'hidden', width }}>
      <div style={{ flex: 1, background: '#FF9933' }} />
      <div style={{ flex: 1, background: 'rgba(240,235,224,0.55)' }} />
      <div style={{ flex: 1, background: '#138808' }} />
    </div>
  )
}

/* ── Floating India fact cards ──────────────────────────────────────────────── */
const INDIA_FACTS = [
  { icon: '🏔️', label: '28+ States', sub: 'To Explore' },
  { icon: '🌊', label: '7500 km', sub: 'Coastline' },
  { icon: '🛕', label: '2M+', sub: 'Temples & Sites' },
  { icon: '🌿', label: '90+', sub: 'National Parks' },
  { icon: '🎭', label: '22', sub: 'Official Languages' },
  { icon: '🏛️', label: '42', sub: 'UNESCO Sites' },
]

/* ── Regions we cover ──────────────────────────────────────────────────────── */
const REGIONS = [
  { name: 'North India', icon: '🏔️', color: '#38bdf8', desc: 'Golden forts, sacred ghats, Himalayan passes, and the crown jewel Taj Mahal.' },
  { name: 'South India', icon: '🌴', color: '#34d399', desc: 'Dravidian temple towers, emerald backwaters, spice gardens, and hill stations.' },
  { name: 'West India', icon: '🏖️', color: '#fb923c', desc: 'Portuguese Goa, Kutch salt desert, Ajanta caves, and the city of dreams.' },
  { name: 'East India', icon: '🐯', color: '#f472b6', desc: 'Tea-garden Darjeeling, Sundarbans tigers, Konark sun temple, and the Bay of Bengal.' },
  { name: 'Northeast', icon: '🌿', color: '#a78bfa', desc: 'Living root bridges, Kaziranga rhinos, Tawang monasteries, and untamed wilderness.' },
  { name: 'Islands', icon: '🐠', color: '#22d3ee', desc: 'Radhanagar beaches, coral gardens, bioluminescent shores, and absolute solitude.' },
]

/* ── Styles ─────────────────────────────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  @keyframes floatSlow { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-14px) rotate(2deg)} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spinSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes ping { 0%{transform:scale(1);opacity:0.7} 100%{transform:scale(2.2);opacity:0} }
  @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
`

const mono = '"Space Mono", monospace'
const bebas = '"Bebas Neue", sans-serif'
const crimson = '"Crimson Text", serif'
const gold = '#c9a96e'
const bg = '#03060f'
const text = '#f0ebe0'
const textDim = 'rgba(240,235,224,0.5)'
const textFaint = 'rgba(240,235,224,0.28)'
const goldBorder = 'rgba(201,169,110,0.18)'

export default function AboutPage() {
  const [activeRegion, setActiveRegion] = useState<number | null>(null)

  return (
    <div style={{ minHeight: '100vh', background: bg, color: text, fontFamily: crimson, overflowX: 'hidden' }}>
      <style>{CSS}</style>
      <StarCanvas />
      <MandalaCanvas />

      {/* ── HERO — Welcome Character Section ────────────────────────────────── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', zIndex: 1 }}>
        {/* Background hero image */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1920&q=85')", backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.1) saturate(0.35)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(3,6,15,0.98) 0%, rgba(3,6,15,0.7) 55%, rgba(3,6,15,0.4) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(3,6,15,1) 0%, transparent 50%)' }} />

        {/* Orbit rings */}
        {[300, 420, 560].map((s, i) => (
          <div key={i} style={{ position: 'absolute', width: s, height: s, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', borderRadius: '50%', border: '1px solid rgba(201,169,110,0.04)', animation: `spinSlow ${60 + i * 25}s linear infinite`, pointerEvents: 'none' }} />
        ))}

        {/* Main layout */}
        <div style={{ position: 'relative', zIndex: 2, width: '100%', padding: '100px clamp(20px,6vw,80px) 80px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center', maxWidth: 1200, margin: '0 auto' }}>

          {/* LEFT — Text */}
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: `1px solid ${goldBorder}`, borderRadius: 2, padding: '7px 16px', marginBottom: 28, background: 'rgba(201,169,110,0.08)' }}>
              <span>🇮🇳</span>
              <span style={{ fontFamily: mono, fontSize: 8, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.8)' }}>A Journey Through India</span>
            </div>

            <h1 style={{ fontFamily: bebas, fontSize: 'clamp(3.5rem,7.5vw,8rem)', letterSpacing: '0.02em', lineHeight: 0.88, color: text, marginBottom: 18 }}>
              DISCOVER<br />
              <span style={{ color: gold }}>INCREDIBLE</span><br />
              INDIA
            </h1>

            <TriBar width={180} />

            <p style={{ fontFamily: crimson, fontStyle: 'italic', fontSize: 20, color: textDim, lineHeight: 1.75, margin: '24px 0 14px', maxWidth: 500 }}>
              From the snow-capped peaks of Ladakh to the sun-kissed shores of the Andamans — this is your window into the real India.
            </p>
            <p style={{ fontFamily: crimson, fontSize: 16, color: textFaint, lineHeight: 1.7, marginBottom: 36, maxWidth: 480 }}>
              Every destination, every trail, every temple on this platform has been carefully curated to help you experience India not as a tourist — but as a true explorer.
            </p>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link to="/destinations" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: gold, color: bg, fontFamily: mono, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, padding: '13px 26px', borderRadius: 2, textDecoration: 'none' }}>
                Explore Destinations <FiArrowRight size={12} />
              </Link>
              <Link to="/tours" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid rgba(240,235,224,0.2)', color: 'rgba(240,235,224,0.65)', fontFamily: mono, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '13px 26px', borderRadius: 2, textDecoration: 'none' }}>
                Browse Tours
              </Link>
            </div>
          </motion.div>

          {/* RIGHT — Character + Speech bubble */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>

            {/* Speech bubble */}
            <motion.div initial={{ opacity: 0, scale: 0.8, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.7, type: 'spring', stiffness: 200 }}
              style={{ background: 'rgba(8,14,32,0.92)', border: `1px solid rgba(201,169,110,0.3)`, borderRadius: '16px 16px 16px 4px', padding: '14px 20px', marginBottom: 24, backdropFilter: 'blur(12px)', maxWidth: 320, alignSelf: 'flex-start', marginLeft: 20 }}>
              <p style={{ fontFamily: crimson, fontStyle: 'italic', fontSize: 17, color: text, margin: '0 0 6px', lineHeight: 1.5 }}>
                "Namaste! 🙏 Welcome to Pavilion."
              </p>
              <p style={{ fontFamily: mono, fontSize: 9, color: 'rgba(201,169,110,0.65)', letterSpacing: '0.12em', margin: 0 }}>
                Let me show you India's finest hidden gems.
              </p>
            </motion.div>

            {/* Character */}
            <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{ filter: 'drop-shadow(0 20px 40px rgba(201,169,110,0.2))' }}>
              <GuideCharacter />
            </motion.div>

            {/* Floating fact pills */}
            {[
              { text: '28+ States', color: '#38bdf8', x: -80, y: 80, delay: 1.0 },
              { text: '42 UNESCO Sites', color: '#34d399', x: 70, y: 120, delay: 1.3 },
              { text: '1.4B Stories', color: '#c9a96e', x: -60, y: 220, delay: 1.6 },
            ].map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
                transition={{ opacity: { delay: p.delay }, scale: { delay: p.delay, type: 'spring' }, y: { duration: 3 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.8 } }}
                style={{ position: 'absolute', top: '50%', left: '50%', transform: `translate(calc(-50% + ${p.x}px), calc(-50% + ${p.y}px))`, background: 'rgba(3,6,15,0.88)', border: `1px solid ${p.color}30`, borderRadius: 4, padding: '7px 14px', backdropFilter: 'blur(10px)' }}>
                <span style={{ fontFamily: mono, fontSize: 10, color: p.color, fontWeight: 700 }}>{p.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── INDIA FACTS STRIP ───────────────────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 1, padding: '48px clamp(20px,6vw,80px)', borderTop: `1px solid rgba(201,169,110,0.07)`, borderBottom: `1px solid rgba(201,169,110,0.07)`, background: 'rgba(201,169,110,0.02)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', maxWidth: 1100, margin: '0 auto', gap: 0 }}>
          {INDIA_FACTS.map((f, i) => (
            <motion.div key={f.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              style={{ textAlign: 'center', padding: '0 16px', borderRight: i < 5 ? `1px solid rgba(201,169,110,0.07)` : 'none' }}>
              <span style={{ fontSize: 24, display: 'block', marginBottom: 8 }}>{f.icon}</span>
              <div style={{ fontFamily: bebas, fontSize: 28, letterSpacing: '0.04em', color: gold, lineHeight: 1, marginBottom: 4 }}>{f.label}</div>
              <div style={{ fontFamily: mono, fontSize: 7, letterSpacing: '0.25em', textTransform: 'uppercase', color: textFaint }}>{f.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── MISSION SECTION ─────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '96px clamp(20px,6vw,80px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          {/* Image side */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            style={{ position: 'relative' }}>
            <div style={{ borderRadius: 3, overflow: 'hidden', position: 'relative' }}>
              <img src="https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=900&q=80" alt="Varanasi Ghats" loading="lazy"
                style={{ width: '100%', height: 480, objectFit: 'cover', display: 'block', filter: 'brightness(0.7) saturate(0.8)' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(3,6,15,0.6) 0%, transparent 55%)' }} />
              <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
                <div style={{ background: 'rgba(3,6,15,0.88)', border: `1px solid ${goldBorder}`, borderRadius: 2, padding: '12px 18px', backdropFilter: 'blur(10px)' }}>
                  <p style={{ fontFamily: mono, fontSize: 7, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.5)', margin: '0 0 4px' }}>Sacred & Ancient</p>
                  <p style={{ fontFamily: bebas, fontSize: 22, letterSpacing: '0.05em', color: text, margin: 0 }}>Varanasi, Uttar Pradesh</p>
                </div>
              </div>
            </div>
            {/* Decorative corner accent */}
            <div style={{ position: 'absolute', top: -12, left: -12, width: 60, height: 60, border: '2px solid rgba(201,169,110,0.25)', borderRadius: 2, borderRight: 'none', borderBottom: 'none' }} />
            <div style={{ position: 'absolute', bottom: -12, right: -12, width: 60, height: 60, border: '2px solid rgba(201,169,110,0.25)', borderRadius: 2, borderLeft: 'none', borderTop: 'none' }} />
          </motion.div>

          {/* Text side */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <p style={{ fontFamily: mono, fontSize: 8, letterSpacing: '0.35em', textTransform: 'uppercase', color: gold, marginBottom: 16 }}>◈ Our Mission</p>
            <h2 style={{ fontFamily: bebas, fontSize: 'clamp(2.5rem,5vw,5rem)', letterSpacing: '0.02em', lineHeight: 0.9, color: text, marginBottom: 18 }}>
              INDIA IS NOT<br />A DESTINATION —<br /><em style={{ color: gold, fontStyle: 'normal' }}>IT'S AN EXPERIENCE</em>
            </h2>
            <TriBar width={160} />
            <p style={{ fontFamily: crimson, fontStyle: 'italic', fontSize: 18, color: textDim, lineHeight: 1.8, margin: '22px 0 16px' }}>
              Pavilion is built on a simple belief: <em style={{ color: text }}>India is the most extraordinary place on Earth</em> — and most people only ever see a fraction of it.
            </p>
            <p style={{ fontFamily: crimson, fontSize: 16, color: textDim, lineHeight: 1.75, marginBottom: 16, borderLeft: '3px solid rgba(201,169,110,0.3)', paddingLeft: 18 }}>
              This platform exists to change that. Whether you're an Indian who has never explored your own backyard, or a traveller crossing oceans to be here — Pavilion gives you access to the real India.
            </p>
            <p style={{ fontFamily: crimson, fontSize: 16, color: textFaint, lineHeight: 1.75 }}>
              Its living cultures. Its sacred landscapes. Its people. Its stories. All 28 states. All in one place.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── REGIONS WE COVER ────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '80px clamp(20px,6vw,80px)', background: 'rgba(201,169,110,0.015)', borderTop: `1px solid rgba(201,169,110,0.07)`, borderBottom: `1px solid rgba(201,169,110,0.07)` }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'center', marginBottom: 14 }}>
            <div style={{ width: 40, height: 1, background: 'rgba(201,169,110,0.2)' }} />
            <span style={{ fontFamily: mono, fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(240,235,224,0.22)' }}>◈ What We Cover</span>
            <div style={{ width: 40, height: 1, background: 'rgba(201,169,110,0.2)' }} />
          </div>
          <h2 style={{ fontFamily: bebas, fontSize: 'clamp(2.5rem,5.5vw,5rem)', letterSpacing: '0.02em', lineHeight: 0.9, color: text }}>
            EVERY CORNER OF<br /><em style={{ color: gold, fontStyle: 'normal' }}>THIS VAST LAND</em>
          </h2>
          <p style={{ fontFamily: crimson, fontStyle: 'italic', fontSize: 17, color: textFaint, marginTop: 14, maxWidth: 520, margin: '14px auto 0' }}>
            As we build, we're mapping every state, every district, every hidden corner of India. Here's what's coming.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 3, maxWidth: 1080, margin: '0 auto' }}>
          {REGIONS.map((r, i) => (
            <motion.div key={r.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              onMouseEnter={() => setActiveRegion(i)} onMouseLeave={() => setActiveRegion(null)}
              style={{ border: activeRegion === i ? `1px solid ${r.color}40` : '1px solid rgba(201,169,110,0.08)', borderRadius: 2, padding: '28px 24px', position: 'relative', overflow: 'hidden', transition: 'border-color 0.3s, background 0.3s', background: activeRegion === i ? `${r.color}06` : 'transparent', cursor: 'default' }}>
              <div style={{ width: 48, height: 48, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 14, border: `1px solid ${r.color}35`, background: `${r.color}12`, transition: 'transform 0.3s', transform: activeRegion === i ? 'scale(1.1)' : 'scale(1)' }}>{r.icon}</div>
              <h3 style={{ fontFamily: bebas, fontSize: 22, letterSpacing: '0.05em', color: activeRegion === i ? r.color : text, marginBottom: 8, lineHeight: 1, transition: 'color 0.3s' }}>{r.name}</h3>
              <p style={{ fontFamily: crimson, fontStyle: 'italic', fontSize: 14, color: textFaint, lineHeight: 1.65 }}>{r.desc}</p>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${r.color},transparent)`, opacity: activeRegion === i ? 0.8 : 0, transition: 'opacity 0.3s' }} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── WHAT MAKES PAVILION DIFFERENT ───────────────────────────────────── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '96px clamp(20px,6vw,80px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontFamily: mono, fontSize: 8, letterSpacing: '0.4em', textTransform: 'uppercase', color: gold, marginBottom: 14 }}>◈ What Makes This Different</p>
            <h2 style={{ fontFamily: bebas, fontSize: 'clamp(2.5rem,5.5vw,5rem)', letterSpacing: '0.02em', lineHeight: 0.9, color: text }}>
              REAL INDIA.<br /><em style={{ color: gold, fontStyle: 'normal' }}>NOT THE POSTCARD VERSION.</em>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 40 }}>
            {[
              {
                num: '01', title: 'Authenticity First', icon: '🪔',
                desc: 'Every destination here is real and lived-in. No generic tourist traps — only places with soul, history, and genuine cultural depth.',
                color: '#c9a96e',
              },
              {
                num: '02', title: 'All of India', icon: '🗺️',
                desc: 'We are building towards complete coverage of all 28 states and 8 union territories — from Lakshadweep to Arunachal Pradesh.',
                color: '#38bdf8',
              },
              {
                num: '03', title: 'Built With Respect', icon: '🙏',
                desc: `India's diversity is its strength. Every community, every faith, every cuisine is represented here with the care it deserves.`, color: '#34d399',
              },
            ].map((item, i) => (
              <motion.div key={item.num} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                style={{ position: 'relative', paddingTop: 24 }}>
                <div style={{ position: 'absolute', top: 0, left: 0, fontFamily: bebas, fontSize: 70, letterSpacing: '0.02em', color: `${item.color}10`, lineHeight: 1, userSelect: 'none' }}>{item.num}</div>
                <span style={{ fontSize: 36, display: 'block', marginBottom: 16, position: 'relative', zIndex: 1 }}>{item.icon}</span>
                <h3 style={{ fontFamily: bebas, fontSize: 26, letterSpacing: '0.04em', color: text, marginBottom: 10, position: 'relative', zIndex: 1 }}>{item.title}</h3>
                <p style={{ fontFamily: crimson, fontStyle: 'italic', fontSize: 15, color: textFaint, lineHeight: 1.7, position: 'relative', zIndex: 1 }}>{item.desc}</p>
                <div style={{ width: 32, height: 2, background: item.color, borderRadius: 2, marginTop: 18, opacity: 0.7 }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMING SOON / BUILDING ──────────────────────────────────────────── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '80px clamp(20px,6vw,80px)', background: 'rgba(201,169,110,0.015)', borderTop: `1px solid rgba(201,169,110,0.07)` }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontFamily: mono, fontSize: 8, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(240,235,224,0.22)', marginBottom: 14 }}>◈ Always Evolving</p>
          <h2 style={{ fontFamily: bebas, fontSize: 'clamp(2.5rem,5.5vw,5rem)', letterSpacing: '0.02em', lineHeight: 0.9, color: text, marginBottom: 20 }}>
            WE'RE JUST<br /><em style={{ color: gold, fontStyle: 'normal' }}>GETTING STARTED</em>
          </h2>
          <p style={{ fontFamily: crimson, fontStyle: 'italic', fontSize: 18, color: textDim, lineHeight: 1.8, maxWidth: 600, margin: '0 auto 40px' }}>
            The backend is being built. New destinations, new tours, new stories are being added every week. This is a living platform that will grow to cover every inch of this incredible country.
          </p>

          {/* Progress states */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3, maxWidth: 800, margin: '0 auto' }}>
            {[
              { label: 'Destinations', status: 'Live', color: '#22c55e' },
              { label: 'Tours', status: 'Live', color: '#22c55e' },
              { label: 'Bookings', status: 'Building', color: '#f59e0b' },
              { label: 'Full Backend', status: 'Coming', color: '#38bdf8' },
            ].map(s => (
              <div key={s.label} style={{ border: `1px solid ${s.color}25`, borderRadius: 2, padding: '16px 12px', textAlign: 'center', background: `${s.color}06` }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, margin: '0 auto 8px', boxShadow: s.status === 'Live' ? `0 0 8px ${s.color}` : 'none' }} />
                <p style={{ fontFamily: bebas, fontSize: 16, letterSpacing: '0.05em', color: text, margin: '0 0 4px' }}>{s.label}</p>
                <p style={{ fontFamily: mono, fontSize: 7, letterSpacing: '0.2em', textTransform: 'uppercase', color: s.color }}>{s.status}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', textAlign: 'center', overflow: 'hidden', padding: '100px clamp(20px,6vw,80px)', zIndex: 1 }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?w=1600&q=80')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.08 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(3,6,15,0.6) 0%, rgba(3,6,15,0.97) 100%)' }} />
        <TriBar height={2} width="100%" />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 560, margin: '0 auto', paddingTop: 44 }}>
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ fontSize: 48, marginBottom: 20 }}>🙏</motion.div>
          <h2 style={{ fontFamily: bebas, fontSize: 'clamp(3rem,7vw,6rem)', letterSpacing: '0.02em', lineHeight: 0.9, color: text, marginBottom: 18 }}>
            INDIA IS WAITING<br /><em style={{ color: gold, fontStyle: 'normal' }}>FOR YOU</em>
          </h2>
          <p style={{ fontFamily: crimson, fontStyle: 'italic', fontSize: 18, color: textDim, lineHeight: 1.7, marginBottom: 36 }}>
            Every extraordinary corner of this land deserves to be discovered. Start your journey today.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/destinations" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: gold, color: bg, fontFamily: mono, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, padding: '13px 26px', borderRadius: 2, textDecoration: 'none' }}>
              Explore Destinations <FiArrowRight size={12} />
            </Link>
            <Link to="/tours" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid rgba(240,235,224,0.2)', color: 'rgba(240,235,224,0.65)', fontFamily: mono, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '13px 26px', borderRadius: 2, textDecoration: 'none' }}>
              Browse Tours
            </Link>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}><TriBar height={2} width="100%" /></div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer style={{ position: 'relative', zIndex: 1, padding: '24px clamp(20px,6vw,80px)', borderTop: `1px solid rgba(201,169,110,0.07)`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <p style={{ fontFamily: mono, fontSize: 8, letterSpacing: '0.2em', color: 'rgba(240,235,224,0.18)' }}>© 2024 Pavilion · Discover Incredible India</p>
        <p style={{ fontFamily: mono, fontSize: 8, letterSpacing: '0.2em', color: 'rgba(240,235,224,0.18)' }}>A personal project built with love for India 🇮🇳</p>
      </footer>
    </div>
  )
}