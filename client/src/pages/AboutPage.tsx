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
      <rect x="68" y="155" width="84" height="170" rx="10" fill="#1a3a1c" />
      <path d="M96 155 L110 182 L124 155" fill="#122813" />
      <path d="M110 155 L110 195" stroke="#c9a96e" strokeWidth="2" strokeDasharray="4 3" />
      {[168, 185, 202, 219, 235, 252].map((y, i) => (
        <g key={i}>
          <circle cx="110" cy={y} r="3" fill="#c9a96e" />
          <circle cx="110" cy={y} r="1.4" fill="#f0ebe0" />
        </g>
      ))}
      <path d="M92 160 Q110 152 128 160" stroke="#c9a96e" strokeWidth="2.5" fill="none" />
      <path d="M72 158 Q55 180 38 230 Q30 255 45 272" stroke="#c9a96e" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.85" />
      <path d="M68 162 Q52 192 54 225" stroke="#122813" strokeWidth="15" strokeLinecap="round" fill="none" />
      <path d="M152 162 Q172 140 178 110 Q180 95 172 88" stroke="#122813" strokeWidth="13" strokeLinecap="round" fill="none" />
      <path d="M76 318 L80 380 L100 380 L110 355 L120 380 L140 380 L144 318Z" fill="#122813" />
      <rect x="102" y="124" width="16" height="34" rx="8" fill="#c8956c" />
      <ellipse cx="110" cy="98" rx="32" ry="36" fill="#c8956c" />
      <ellipse cx="110" cy="68" rx="36" ry="18" fill="#c9a96e" />
      <ellipse cx="110" cy="65" rx="30" ry="14" fill="#e8c47a" />
      <path d="M75 72 Q78 50 110 48 Q142 50 145 72" fill="#c9a96e" />
      <path d="M78 68 Q110 58 142 68" stroke="rgba(201,169,110,0.4)" strokeWidth="1.5" fill="none" />
      <path d="M80 72 Q110 62 140 72" stroke="rgba(201,169,110,0.4)" strokeWidth="1.5" fill="none" />
      <circle cx="110" cy="53" r="5" fill="#ff9933" />
      <circle cx="110" cy="53" r="2.5" fill="#fff" />
      <ellipse cx="99" cy="97" rx="5" ry="5.5" fill="#1a0800" />
      <ellipse cx="121" cy="97" rx="5" ry="5.5" fill="#1a0800" />
      <circle cx="101" cy="95.5" r="1.8" fill="white" />
      <circle cx="123" cy="95.5" r="1.8" fill="white" />
      <path d="M97 115 Q110 128 123 115" stroke="#8b4513" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M107 104 Q104 110 107 113 Q110 115 113 113 Q116 110 113 104" stroke="#a0704a" strokeWidth="1.2" fill="none" />
      <path d="M101 112 Q110 109 119 112" stroke="#4a2800" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <ellipse cx="170" cy="100" rx="9" ry="12" fill="#c8956c" transform="rotate(-15 170 100)" />
      <path d="M164 90 Q162 80 164 74" stroke="#c8956c" strokeWidth="4" strokeLinecap="round" />
      <path d="M168 88 Q167 77 169 71" stroke="#c8956c" strokeWidth="4" strokeLinecap="round" />
      <path d="M173 89 Q173 78 174 72" stroke="#c8956c" strokeWidth="4" strokeLinecap="round" />
      <path d="M177 92 Q178 82 178 77" stroke="#c8956c" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="51" cy="230" rx="8" ry="11" fill="#c8956c" />
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

/* ── India facts ─────────────────────────────────────────────────────────────── */
const INDIA_FACTS = [
  { icon: '🏔️', label: '28+ States', sub: 'To Explore' },
  { icon: '🌊', label: '7500 km', sub: 'Coastline' },
  { icon: '🛕', label: '2M+', sub: 'Temples & Sites' },
  { icon: '🌿', label: '90+', sub: 'National Parks' },
  { icon: '🎭', label: '22', sub: 'Official Languages' },
  { icon: '🏛️', label: '42', sub: 'UNESCO Sites' },
]

/* ── Regions ─────────────────────────────────────────────────────────────────── */
const REGIONS = [
  {
    name: 'North India', icon: '🏔️', color: '#38bdf8',
    desc: 'Golden forts rising from desert sands, ancient ghats where pilgrims bathe at dawn, and the crown jewel Taj Mahal.',
    detail: 'Rajasthan · Uttar Pradesh · Himachal Pradesh · Uttarakhand',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80',
  },
  {
    name: 'South India', icon: '🌴', color: '#34d399',
    desc: 'Dravidian temple towers soaring over rice-paddy plains, emerald backwaters, and hill stations shrouded in cardamom mist.',
    detail: 'Kerala · Tamil Nadu · Karnataka · Andhra Pradesh',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
  },
  {
    name: 'West India', icon: '🏖️', color: '#fb923c',
    desc: 'Portuguese forts overlooking the Arabian Sea, the vast salt desert of Kutch, and Buddhist caves carved into basalt cliffs.',
    detail: 'Goa · Maharashtra · Gujarat · Rajasthan (West)',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
  },
  {
    name: 'East India', icon: '🐯', color: '#f472b6',
    desc: "Sunrise over Kanchenjunga from Darjeeling's tea estates, royal Bengal tigers prowling mangrove islands, the Sun Temple at the Bay.",
    detail: 'West Bengal · Odisha · Bihar · Jharkhand',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  },
  {
    name: 'Northeast', icon: '🌿', color: '#a78bfa',
    desc: 'Ancient bridges woven from rubber tree roots, one-horned rhinos in misty grasslands, Tibetan monasteries on Himalayan ridges.',
    detail: 'Meghalaya · Assam · Arunachal Pradesh · Nagaland',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80',
  },
  {
    name: 'Islands', icon: '🐠', color: '#22d3ee',
    desc: "Asia's finest beach at Radhanagar, coral gardens teeming with life, bioluminescent plankton lighting the surf at dusk.",
    detail: 'Andaman & Nicobar · Lakshadweep',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
  },
]

/* ── Styles ─────────────────────────────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  @keyframes spinSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmerLine { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
`

const mono = '"Space Mono", monospace'
const bebas = '"Bebas Neue", sans-serif'
const crimson = '"Crimson Text", serif'
const gold = '#c9a96e'
const bg = '#03060f'
const ivory = '#F4F0E8'
const ivoryDark = '#E8E2D4'
const text = '#f0ebe0'
const textDim = 'rgba(240,235,224,0.5)'
const textFaint = 'rgba(240,235,224,0.28)'
const goldBorder = 'rgba(201,169,110,0.18)'
const ink = '#1C1410'
const inkDim = 'rgba(28,20,16,0.55)'
const inkFaint = 'rgba(28,20,16,0.32)'

export default function AboutPage() {
  const [activeRegion, setActiveRegion] = useState<number | null>(null)

  return (
    <div style={{ minHeight: '100vh', background: bg, color: text, fontFamily: crimson, overflowX: 'hidden' }}>
      <style>{CSS}</style>
      <StarCanvas />
      <MandalaCanvas />

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* HERO — Welcome Character Section                                        */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', zIndex: 1 }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1920&q=85')", backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.1) saturate(0.35)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(3,6,15,0.98) 0%, rgba(3,6,15,0.7) 55%, rgba(3,6,15,0.4) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(3,6,15,1) 0%, transparent 50%)' }} />
        {[300, 420, 560].map((s, i) => (
          <div key={i} style={{ position: 'absolute', width: s, height: s, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', borderRadius: '50%', border: '1px solid rgba(201,169,110,0.04)', animation: `spinSlow ${60 + i * 25}s linear infinite`, pointerEvents: 'none' }} />
        ))}

        <div style={{ position: 'relative', zIndex: 2, width: '100%', padding: '100px clamp(20px,6vw,80px) 80px', maxWidth: 1200, margin: '0 auto' }}>

          {/* ── STORYTELLING CARD LAYOUT ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>

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

            {/* RIGHT — Character card (clean, balanced container) */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ position: 'relative' }}
            >
              {/* Card container */}
              <div style={{
                position: 'relative',
                border: `1px solid rgba(201,169,110,0.2)`,
                borderRadius: 4,
                background: 'rgba(8,14,32,0.7)',
                backdropFilter: 'blur(16px)',
                padding: '36px 32px 28px',
                overflow: 'hidden',
              }}>
                {/* Gold shimmer line top */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${gold}, transparent)` }} />

                {/* Speech bubble (integrated into card) */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, type: 'spring', stiffness: 200 }}
                  style={{ marginBottom: 20 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: `linear-gradient(135deg, ${gold}, rgba(201,169,110,0.4))`, border: `1px solid ${gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>🙏</div>
                    <p style={{ fontFamily: mono, fontSize: 7, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.6)', margin: 0 }}>Your Pavilion Guide</p>
                  </div>
                  <p style={{ fontFamily: crimson, fontStyle: 'italic', fontSize: 18, color: text, lineHeight: 1.55, margin: '0 0 4px', paddingLeft: 38 }}>
                    "Namaste! Welcome to Pavilion."
                  </p>
                  <p style={{ fontFamily: mono, fontSize: 8, color: 'rgba(201,169,110,0.55)', letterSpacing: '0.1em', paddingLeft: 38, margin: 0 }}>
                    Let me show you India's finest hidden gems.
                  </p>
                </motion.div>

                {/* Divider */}
                <div style={{ height: 1, background: 'rgba(201,169,110,0.1)', margin: '0 0 20px' }} />

                {/* Character centered in card */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', position: 'relative', minHeight: 220 }}>
                  <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ filter: 'drop-shadow(0 20px 40px rgba(201,169,110,0.2))' }}>
                    <GuideCharacter />
                  </motion.div>

                  {/* Floating fact pills — anchored within card */}
                  {[
                    { text: '28+ States', color: '#38bdf8', x: -108, y: 30 },
                    { text: '42 UNESCO Sites', color: '#34d399', x: 58, y: 60 },
                    { text: '1.4B Stories', color: '#c9a96e', x: -90, y: 140 },
                  ].map((p, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
                      transition={{ opacity: { delay: 1.0 + i * 0.2 }, scale: { delay: 1.0 + i * 0.2, type: 'spring' }, y: { duration: 3 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.8 } }}
                      style={{ position: 'absolute', top: '50%', left: '50%', transform: `translate(calc(-50% + ${p.x}px), calc(-50% + ${p.y}px))`, background: 'rgba(3,6,15,0.92)', border: `1px solid ${p.color}35`, borderRadius: 4, padding: '6px 13px', backdropFilter: 'blur(10px)', pointerEvents: 'none' }}
                    >
                      <span style={{ fontFamily: mono, fontSize: 9, color: p.color, fontWeight: 700, letterSpacing: '0.06em' }}>{p.text}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Card footer — stat strip */}
                <div style={{ marginTop: 20, paddingTop: 18, borderTop: '1px solid rgba(201,169,110,0.1)', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0 }}>
                  {[
                    { val: '500+', label: 'Curated Tours' },
                    { val: '4.9★', label: 'Avg Rating' },
                    { val: '12k+', label: 'Travellers' },
                  ].map((s, i) => (
                    <div key={i} style={{ textAlign: 'center', borderRight: i < 2 ? '1px solid rgba(201,169,110,0.1)' : 'none', padding: '0 8px' }}>
                      <p style={{ fontFamily: bebas, fontSize: 22, letterSpacing: '0.04em', color: gold, margin: 0, lineHeight: 1 }}>{s.val}</p>
                      <p style={{ fontFamily: mono, fontSize: 7, letterSpacing: '0.2em', textTransform: 'uppercase', color: textFaint, margin: '3px 0 0' }}>{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Bottom shimmer line */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, rgba(201,169,110,0.15), transparent)` }} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* INDIA FACTS STRIP                                                       */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
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

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* MISSION SECTION                                                         */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '96px clamp(20px,6vw,80px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
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
            <div style={{ position: 'absolute', top: -12, left: -12, width: 60, height: 60, border: '2px solid rgba(201,169,110,0.25)', borderRadius: 2, borderRight: 'none', borderBottom: 'none' }} />
            <div style={{ position: 'absolute', bottom: -12, right: -12, width: 60, height: 60, border: '2px solid rgba(201,169,110,0.25)', borderRadius: 2, borderLeft: 'none', borderTop: 'none' }} />
          </motion.div>

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

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* EVERY CORNER OF THIS VAST LAND — Luxury Journal Layout                  */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', zIndex: 1, background: ivory, overflow: 'hidden' }}>
        {/* Subtle mandala watermark */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 700, borderRadius: '50%', border: '1px solid rgba(201,169,110,0.08)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 520, height: 520, borderRadius: '50%', border: '1px solid rgba(201,169,110,0.06)', pointerEvents: 'none' }} />

        {/* Section masthead */}
        <div style={{ borderBottom: `1px solid rgba(28,20,16,0.1)`, padding: '56px clamp(20px,6vw,80px) 48px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'end' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
                <div style={{ width: 3, height: 36, background: `linear-gradient(to bottom, #FF9933, #138808)`, borderRadius: 2, flexShrink: 0 }} />
                <span style={{ fontFamily: mono, fontSize: 8, letterSpacing: '0.4em', textTransform: 'uppercase', color: inkFaint }}>Pavilion · Territory Atlas</span>
              </div>
              <h2 style={{ fontFamily: bebas, fontSize: 'clamp(3rem,6vw,6.5rem)', letterSpacing: '0.02em', lineHeight: 0.88, color: ink, margin: 0 }}>
                EVERY CORNER<br />OF THIS<br /><em style={{ fontStyle: 'normal', color: '#b5863a' }}>VAST LAND</em>
              </h2>
            </div>
            <div style={{ paddingBottom: 6 }}>
              <p style={{ fontFamily: crimson, fontStyle: 'italic', fontSize: 20, color: inkDim, lineHeight: 1.75, margin: '0 0 20px', maxWidth: 440 }}>
                Six distinct Indias. Each one a civilisation unto itself. Here is how we navigate the subcontinent — and where we are taking you.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ height: 1, width: 40, background: 'rgba(28,20,16,0.15)' }} />
                <span style={{ fontFamily: mono, fontSize: 7, letterSpacing: '0.3em', textTransform: 'uppercase', color: inkFaint }}>Expanding to all 28 states</span>
              </div>
            </div>
          </div>
        </div>

        {/* Regions — editorial list layout */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(20px,6vw,80px)' }}>
          {REGIONS.map((r, i) => {
            const isActive = activeRegion === i
            const isEven = i % 2 === 0
            return (
              <motion.div
                key={r.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.6 }}
                onMouseEnter={() => setActiveRegion(i)}
                onMouseLeave={() => setActiveRegion(null)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: isEven ? '1fr 380px' : '380px 1fr',
                  gap: 0,
                  borderBottom: `1px solid rgba(28,20,16,0.08)`,
                  transition: 'background 0.3s',
                  background: isActive ? `rgba(201,169,110,0.06)` : 'transparent',
                  cursor: 'default',
                }}
              >
                {/* Text column */}
                <div style={{
                  order: isEven ? 0 : 1,
                  padding: '48px 40px 48px 0',
                  paddingLeft: isEven ? 0 : 40,
                  paddingRight: isEven ? 40 : 0,
                  borderRight: isEven ? `1px solid rgba(28,20,16,0.08)` : 'none',
                  borderLeft: isEven ? 'none' : `1px solid rgba(28,20,16,0.08)`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 2, border: `1px solid ${r.color}40`, background: `${r.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0, transition: 'transform 0.3s', transform: isActive ? 'scale(1.12)' : 'scale(1)' }}>{r.icon}</div>
                    <span style={{ fontFamily: mono, fontSize: 7, letterSpacing: '0.3em', textTransform: 'uppercase', color: isActive ? r.color : inkFaint, transition: 'color 0.3s' }}>{r.detail}</span>
                  </div>

                  <h3 style={{ fontFamily: bebas, fontSize: 'clamp(2.2rem,3.5vw,3.8rem)', letterSpacing: '0.03em', lineHeight: 0.92, color: isActive ? ink : 'rgba(28,20,16,0.85)', marginBottom: 14, transition: 'color 0.3s' }}>{r.name}</h3>

                  {/* Fine rule before description */}
                  <div style={{ width: 48, height: 1, background: r.color, marginBottom: 16, opacity: isActive ? 1 : 0.4, transition: 'opacity 0.3s, width 0.3s', ...(isActive ? { width: 72 } : {}) }} />

                  <p style={{ fontFamily: crimson, fontStyle: 'italic', fontSize: 17, color: inkDim, lineHeight: 1.75, margin: 0, maxWidth: 400 }}>{r.desc}</p>
                </div>

                {/* Image column */}
                <div style={{
                  order: isEven ? 1 : 0,
                  position: 'relative',
                  overflow: 'hidden',
                  minHeight: 280,
                }}>
                  <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url(${r.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: isActive ? 'brightness(0.65) saturate(0.75)' : 'brightness(0.45) saturate(0.5)',
                    transform: isActive ? 'scale(1.04)' : 'scale(1)',
                    transition: 'all 0.6s ease',
                  }} />

                  {/* Color accent overlay on hover */}
                  <div style={{ position: 'absolute', inset: 0, background: `${r.color}`, opacity: isActive ? 0.08 : 0, transition: 'opacity 0.4s' }} />

                  {/* Index number — large typographic watermark */}
                  <div style={{
                    position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: bebas, fontSize: 120, letterSpacing: '0.02em',
                    color: isActive ? `${r.color}25` : 'rgba(255,255,255,0.06)',
                    userSelect: 'none', pointerEvents: 'none',
                    transition: 'color 0.4s',
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>

                  {/* Bottom label */}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 20px', background: 'linear-gradient(to top, rgba(28,20,16,0.8) 0%, transparent 100%)' }}>
                    <p style={{ fontFamily: mono, fontSize: 7, letterSpacing: '0.28em', textTransform: 'uppercase', color: isActive ? r.color : 'rgba(240,235,224,0.4)', margin: 0, transition: 'color 0.3s' }}>
                      {r.name.toUpperCase()} · India
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Section footer note */}
        <div style={{ borderTop: `1px solid rgba(28,20,16,0.08)`, padding: '32px clamp(20px,6vw,80px)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <p style={{ fontFamily: mono, fontSize: 8, letterSpacing: '0.2em', color: inkFaint, margin: 0 }}>
              Six regions mapped · More added every month
            </p>
            <Link to="/destinations" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: ink, color: ivory, fontFamily: mono, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, padding: '11px 22px', borderRadius: 2, textDecoration: 'none' }}>
              Full Map <FiArrowRight size={11} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* WHAT MAKES PAVILION DIFFERENT                                           */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '96px clamp(20px,6vw,80px)', background: bg }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontFamily: mono, fontSize: 8, letterSpacing: '0.4em', textTransform: 'uppercase', color: gold, marginBottom: 14 }}>◈ What Makes This Different</p>
            <h2 style={{ fontFamily: bebas, fontSize: 'clamp(2.5rem,5.5vw,5rem)', letterSpacing: '0.02em', lineHeight: 0.9, color: text }}>
              REAL INDIA.<br /><em style={{ color: gold, fontStyle: 'normal' }}>NOT THE POSTCARD VERSION.</em>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 40 }}>
            {[
              { title: 'Authenticity First', icon: '🪔', desc: 'Every destination here is real and lived-in. No generic tourist traps — only places with soul, history, and genuine cultural depth.', color: '#c9a96e' },
              { title: 'All of India', icon: '🗺️', desc: 'We are building towards complete coverage of all 28 states and 8 union territories — from Lakshadweep to Arunachal Pradesh.', color: '#38bdf8' },
              { title: 'Built With Respect', icon: '🙏', desc: "India's diversity is its strength. Every community, every faith, every cuisine is represented here with the care it deserves.", color: '#34d399' },
            ].map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                style={{ border: '1px solid rgba(255,255,255,0.05)', borderRadius: 3, padding: '32px 28px', background: 'rgba(255,255,255,0.02)', transition: 'border-color 0.3s, background 0.3s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${item.color}30`; (e.currentTarget as HTMLElement).style.background = `${item.color}05` }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)' }}>
                <span style={{ fontSize: 36, display: 'block', marginBottom: 20 }}>{item.icon}</span>
                <h3 style={{ fontFamily: bebas, fontSize: 26, letterSpacing: '0.04em', color: text, marginBottom: 12, lineHeight: 1 }}>{item.title}</h3>
                <p style={{ fontFamily: crimson, fontStyle: 'italic', fontSize: 15, color: textFaint, lineHeight: 1.7, margin: '0 0 20px' }}>{item.desc}</p>
                <div style={{ width: 32, height: 2, background: item.color, borderRadius: 2, opacity: 0.7 }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* PLATFORM STATUS                                                         */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '80px clamp(20px,6vw,80px)', background: 'rgba(201,169,110,0.015)', borderTop: `1px solid rgba(201,169,110,0.07)` }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontFamily: mono, fontSize: 8, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(240,235,224,0.22)', marginBottom: 14 }}>◈ Always Evolving</p>
          <h2 style={{ fontFamily: bebas, fontSize: 'clamp(2.5rem,5.5vw,5rem)', letterSpacing: '0.02em', lineHeight: 0.9, color: text, marginBottom: 20 }}>
            WE'RE JUST<br /><em style={{ color: gold, fontStyle: 'normal' }}>GETTING STARTED</em>
          </h2>
          <p style={{ fontFamily: crimson, fontStyle: 'italic', fontSize: 18, color: textDim, lineHeight: 1.8, maxWidth: 600, margin: '0 auto 40px' }}>
            The backend is being built. New destinations, new tours, new stories are being added every week. This is a living platform that will grow to cover every inch of this incredible country.
          </p>

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

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* CTA                                                                     */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
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

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* FOOTER                                                                  */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      <footer style={{ position: 'relative', zIndex: 1, padding: '24px clamp(20px,6vw,80px)', borderTop: `1px solid rgba(201,169,110,0.07)`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <p style={{ fontFamily: mono, fontSize: 8, letterSpacing: '0.2em', color: 'rgba(240,235,224,0.18)' }}>© 2024 Pavilion · Discover Incredible India</p>
        <p style={{ fontFamily: mono, fontSize: 8, letterSpacing: '0.2em', color: 'rgba(240,235,224,0.18)' }}>A personal project built with love for India 🇮🇳</p>
      </footer>
    </div>
  )
}