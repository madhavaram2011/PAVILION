import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiArrowLeft, FiArrowRight, FiHeart, FiShare2, FiCheck } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

const DESTINATIONS_DATA: Record<string, any> = {
  nepal: {
    slug: 'nepal', name: 'Nepal', tagline: 'Where the Himalayas Pierce the Sky', subtitle: 'SOUTH ASIA · HIMALAYAS',
    region: 'Asia', type: 'MOUNTAIN',
    cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=900&q=80',
      'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=900&q=80',
      'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=900&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80',
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900&q=80',
    ],
    intro: "Nepal is not a destination. It is a reckoning. Eight of the world's fourteen eight-thousanders stand here — including Everest, the crown jewel of human ambition. But Nepal is also ancient monasteries ringing with prayer bells, terraced fields carved from impossible slopes, and a people whose warmth is as legendary as their mountains.",
    facts: [
      { label: 'CAPITAL', val: 'Kathmandu' },
      { label: 'ALTITUDE RANGE', val: '60m – 8,849m' },
      { label: 'BEST MONTHS', val: 'Oct – Nov / Mar – May' },
      { label: 'LANGUAGE', val: 'Nepali' },
      { label: 'CURRENCY', val: 'Nepalese Rupee' },
      { label: 'TIME ZONE', val: 'UTC +5:45' },
    ],
    climate: [
      { month: 'JAN', temp: 2, rain: 'DRY', }, { month: 'FEB', temp: 5, rain: 'DRY', },
      { month: 'MAR', temp: 11, rain: 'LOW', }, { month: 'APR', temp: 16, rain: 'LOW', },
      { month: 'MAY', temp: 20, rain: 'MED', }, { month: 'JUN', temp: 22, rain: 'HIGH', },
      { month: 'JUL', temp: 23, rain: 'PEAK', }, { month: 'AUG', temp: 22, rain: 'PEAK', },
      { month: 'SEP', temp: 21, rain: 'HIGH', }, { month: 'OCT', temp: 16, rain: 'LOW', },
      { month: 'NOV', temp: 10, rain: 'DRY', }, { month: 'DEC', temp: 4, rain: 'DRY', },
    ],
    experiences: [
      { title: 'Everest Base Camp', category: 'ICONIC TREK', duration: '14 days', description: "The world's most famous trek. Stand in the shadow of the world's highest peak and hear the Khumbu Icefall roar.", img: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&q=80' },
      { title: 'Annapurna Circuit', category: 'CLASSIC TREK', duration: '18 days', description: 'Cross Thorong La at 5,416m. Walk through rice paddies, apple orchards, and glacial moonscapes in a single loop.', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80' },
      { title: 'Kathmandu Valley', category: 'CULTURAL', duration: '4 days', description: 'Seven UNESCO World Heritage sites within cycling distance. Ancient kingdoms, living goddesses, and sacred squares.', img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&q=80' },
    ],
    tours: [
      { slug: 'himalayan-circuit', title: 'Himalayan Circuit', duration: 21, price: 6800, rating: 4.9, difficulty: 'EXTREME' },
      { slug: 'everest-base-camp', title: 'Everest Base Camp Classic', duration: 14, price: 3900, rating: 4.8, difficulty: 'HARD' },
    ],
    warnings: [
      'Altitude sickness is a real risk above 3,000m. Ascend slowly.',
      'Permits required for all trekking regions — we handle this.',
      'Weather windows are narrow. Oct–Nov and Mar–May only.',
    ],
  },
}

const DIFF_COLOR: Record<string, string> = { MODERATE: '#4ade80', HARD: '#facc15', EXTREME: '#f97316' }
const RAIN_COLOR: Record<string, string> = { DRY: '#4ade80', LOW: '#86efac', MED: '#facc15', HIGH: '#fb923c', PEAK: '#f97316' }

// ── STARFIELD — no custom cursor override ─────────────────────────────────────
function StarCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return
    const ctx = canvas.getContext('2d')!; let raf: number
    const stars = Array.from({ length: 200 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.2 + 0.2, a: Math.random(), speed: Math.random() * 0.004 + 0.001 }))
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize(); window.addEventListener('resize', resize)
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      stars.forEach(s => { s.a += s.speed; ctx.beginPath(); ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(255,255,255,${0.2 + 0.55 * Math.abs(Math.sin(s.a))})`; ctx.fill() })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={ref} style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />
}

// ── EXPERIENCE CARD ──────────────────────────────────────────────────────────
function ExperienceCard({ exp, index }: { exp: any; index: number }) {
  const [hover, setHover] = useState(false)
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'grid', gridTemplateColumns: '220px 1fr',
        border: hover ? '1px solid rgba(201,169,110,0.2)' : '1px solid rgba(201,169,110,0.07)',
        borderRadius: 2, overflow: 'hidden',
        background: hover ? 'rgba(201,169,110,0.03)' : 'transparent',
        transition: 'all 0.3s',
      }}>
      <div style={{
        backgroundImage: `url(${exp.img})`, backgroundSize: 'cover', backgroundPosition: 'center',
        transform: hover ? 'scale(1.06)' : 'scale(1)', transition: 'transform 0.6s',
        minHeight: 140,
      }} />
      <div style={{ padding: '24px 28px' }}>
        <p style={{ fontFamily: '"Space Mono", monospace', fontSize: 9, letterSpacing: '0.2em', color: '#c9a96e', marginBottom: 8 }}>{exp.category} · {exp.duration}</p>
        <h3 style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 28, letterSpacing: '0.04em', color: '#f0ebe0', marginBottom: 10 }}>{exp.title}</h3>
        <p style={{ fontFamily: '"Crimson Text", serif', fontStyle: 'italic', fontSize: 15, color: 'rgba(240,235,224,0.52)', lineHeight: 1.6 }}>{exp.description}</p>
      </div>
    </motion.div>
  )
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
export default function DestinationDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const dest = DESTINATIONS_DATA[slug!] || Object.values(DESTINATIONS_DATA)[0]
  const [scrollY, setScrollY] = useState(0)
  const [activeGallery, setActiveGallery] = useState(0)
  const [wishlisted, setWishlisted] = useState(false)
  const [showShareToast, setShowShareToast] = useState(false)
  const maxTemp = Math.max(...dest.climate.map((c: any) => c.temp))

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href)
    setShowShareToast(true)
    setTimeout(() => setShowShareToast(false), 2200)
  }

  return (
    // NOTE: No cursor: none here — system cursor is correct behavior
    <div style={{ minHeight: '100vh', background: '#03060f', color: '#f0ebe0', fontFamily: '"Crimson Text", Georgia, serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono&family=Bebas+Neue&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #03060f; }
        ::-webkit-scrollbar-thumb { background: rgba(201,169,110,0.3); border-radius: 2px; }
      `}</style>

      <StarCanvas />

      {/* Scroll progress */}
      <motion.div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 2, zIndex: 9999,
        background: 'linear-gradient(90deg,#c9a96e,#f0e0b0,#c9a96e)', transformOrigin: '0%',
        scaleX: scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1),
      }} />

      {/* Share toast */}
      <AnimatePresence>
        {showShareToast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            style={{
              position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)',
              background: 'rgba(201,169,110,0.15)', border: '1px solid rgba(201,169,110,0.4)',
              backdropFilter: 'blur(16px)', padding: '12px 24px', borderRadius: 2, zIndex: 9998,
              fontFamily: '"Space Mono", monospace', fontSize: 11, letterSpacing: '0.15em', color: '#c9a96e',
              display: 'flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap',
            }}>
            <FiCheck size={13} /> LINK COPIED TO CLIPBOARD
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO ── */}
      <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0, backgroundImage: `url(${dest.cover})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          transform: `translateY(${scrollY * 0.4}px)`, filter: 'brightness(0.26) saturate(0.6)',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #03060f 0%, rgba(3,6,15,0.5) 40%, rgba(3,6,15,0.1) 100%)' }} />
        {/* Vignette */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.45) 100%)', pointerEvents: 'none' }} />

        {/* Back */}
        <Link to="/destinations" style={{
          position: 'absolute', top: 32, left: 'clamp(20px,6vw,100px)',
          display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', zIndex: 10,
          padding: '8px 16px', background: 'rgba(3,6,15,0.5)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(201,169,110,0.15)', borderRadius: 1, transition: 'border-color 0.2s',
        }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,169,110,0.4)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,169,110,0.15)'}
        >
          <FiArrowLeft size={13} color="#c9a96e" />
          <span style={{ fontFamily: '"Space Mono", monospace', fontSize: 10, letterSpacing: '0.2em', color: '#c9a96e' }}>ALL DESTINATIONS</span>
        </Link>

        {/* Action buttons */}
        <div style={{ position: 'absolute', top: 32, right: 'clamp(20px,6vw,100px)', display: 'flex', gap: 8, zIndex: 10 }}>
          <motion.button onClick={() => setWishlisted(w => !w)} whileTap={{ scale: 0.88 }}
            style={{
              width: 42, height: 42, borderRadius: '50%',
              background: wishlisted ? 'rgba(239,68,68,0.15)' : 'rgba(3,6,15,0.5)',
              border: wishlisted ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(240,235,224,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              backdropFilter: 'blur(8px)', transition: 'all 0.3s',
            }}>
            <FiHeart size={15} color={wishlisted ? '#ef4444' : 'rgba(240,235,224,0.6)'} style={{ fill: wishlisted ? '#ef4444' : 'none' }} />
          </motion.button>
          <motion.button onClick={handleShare} whileTap={{ scale: 0.88 }}
            style={{
              width: 42, height: 42, borderRadius: '50%', background: 'rgba(3,6,15,0.5)',
              border: '1px solid rgba(240,235,224,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', backdropFilter: 'blur(8px)',
            }}>
            <FiShare2 size={15} color="rgba(240,235,224,0.6)" />
          </motion.button>
        </div>

        {/* Hero text */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 clamp(20px,6vw,100px) 70px' }}>
          <p style={{ fontFamily: '"Space Mono", monospace', fontSize: 10, letterSpacing: '0.3em', color: '#c9a96e', marginBottom: 14 }}>{dest.subtitle}</p>
          <h1 style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 'clamp(5rem,11vw,13rem)', letterSpacing: '0.02em', lineHeight: 0.88, color: '#f0ebe0', marginBottom: 24 }}>{dest.name}</h1>
          <p style={{ fontFamily: '"Crimson Text", serif', fontStyle: 'italic', fontSize: 22, color: 'rgba(240,235,224,0.5)', maxWidth: 600, lineHeight: 1.6 }}>"{dest.tagline}"</p>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: 32, right: 'clamp(20px,6vw,100px)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <motion.div animate={{ scaleY: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }}
            style={{ width: 1, height: 48, background: 'linear-gradient(to bottom, transparent, rgba(201,169,110,0.4))' }} />
          <span style={{ fontFamily: '"Space Mono", monospace', fontSize: 8, letterSpacing: '0.25em', color: 'rgba(201,169,110,0.4)', writingMode: 'vertical-rl' }}>SCROLL TO EXPLORE</span>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px clamp(20px,6vw,60px) 120px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 80 }}>

          {/* ── LEFT ── */}
          <div>
            {/* Intro */}
            <p style={{ fontFamily: '"Crimson Text", serif', fontStyle: 'italic', fontSize: 22, color: 'rgba(240,235,224,0.7)', lineHeight: 1.75, marginBottom: 70, borderLeft: '3px solid rgba(201,169,110,0.35)', paddingLeft: 28 }}>
              {dest.intro}
            </p>

            {/* Gallery */}
            <div style={{ marginBottom: 70 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <span style={{ fontFamily: '"Space Mono", monospace', fontSize: 9, letterSpacing: '0.3em', color: 'rgba(240,235,224,0.2)' }}>◈ TERRITORY GALLERY</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(201,169,110,0.08)' }} />
              </div>
              <motion.div
                key={activeGallery}
                initial={{ opacity: 0.7, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                style={{ height: 460, borderRadius: 2, overflow: 'hidden', marginBottom: 6, backgroundImage: `url(${dest.gallery[activeGallery]})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${dest.gallery.length}, 1fr)`, gap: 4 }}>
                {dest.gallery.map((img: string, i: number) => (
                  <motion.div key={i} onClick={() => setActiveGallery(i)} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    style={{
                      height: 70, backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center',
                      opacity: activeGallery === i ? 1 : 0.32,
                      border: activeGallery === i ? '1px solid #c9a96e' : '1px solid transparent',
                      cursor: 'pointer', transition: 'opacity 0.2s, border 0.2s', borderRadius: 1,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Experiences */}
            <div style={{ marginBottom: 70 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
                <span style={{ fontFamily: '"Space Mono", monospace', fontSize: 9, letterSpacing: '0.3em', color: 'rgba(240,235,224,0.2)' }}>◈ SIGNATURE EXPERIENCES</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(201,169,110,0.08)' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {dest.experiences.map((exp: any, i: number) => (
                  <ExperienceCard key={i} exp={exp} index={i} />
                ))}
              </div>
            </div>

            {/* Climate */}
            <div style={{ marginBottom: 70 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
                <span style={{ fontFamily: '"Space Mono", monospace', fontSize: 9, letterSpacing: '0.3em', color: 'rgba(240,235,224,0.2)' }}>◈ CLIMATE GUIDE</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(201,169,110,0.08)' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 4 }}>
                {dest.climate.map((c: any) => (
                  <div key={c.month} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontFamily: '"Space Mono", monospace', fontSize: 8, color: 'rgba(240,235,224,0.22)', letterSpacing: '0.1em' }}>{c.month}</span>
                    <div style={{ width: '100%', height: 60, display: 'flex', alignItems: 'flex-end' }}>
                      <motion.div
                        initial={{ height: 0 }} whileInView={{ height: `${Math.max(10, (c.temp / maxTemp) * 100)}%` }}
                        viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.05 }}
                        style={{ width: '100%', background: RAIN_COLOR[c.rain], borderRadius: '1px 1px 0 0', opacity: 0.75 }}
                      />
                    </div>
                    <span style={{ fontFamily: '"Space Mono", monospace', fontSize: 9, color: RAIN_COLOR[c.rain] }}>{c.temp}°</span>
                    <span style={{ fontFamily: '"Space Mono", monospace', fontSize: 7, letterSpacing: '0.1em', color: 'rgba(240,235,224,0.18)', textAlign: 'center' }}>{c.rain}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 20, marginTop: 16, flexWrap: 'wrap' }}>
                {Object.entries(RAIN_COLOR).map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: v, opacity: 0.75 }} />
                    <span style={{ fontFamily: '"Space Mono", monospace', fontSize: 8, color: 'rgba(240,235,224,0.28)', letterSpacing: '0.15em' }}>{k}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Warnings */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <span style={{ fontFamily: '"Space Mono", monospace', fontSize: 9, letterSpacing: '0.3em', color: '#f97316' }}>◈ EXPEDITION NOTES</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(249,115,22,0.1)' }} />
              </div>
              {dest.warnings.map((w: string, i: number) => (
                <motion.div key={i} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '14px 0', borderBottom: '1px solid rgba(249,115,22,0.06)' }}>
                  <span style={{ color: '#f97316', fontSize: 16, flexShrink: 0, marginTop: 1 }}>!</span>
                  <p style={{ fontFamily: '"Crimson Text", serif', fontSize: 16, color: 'rgba(240,235,224,0.52)', lineHeight: 1.55 }}>{w}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div style={{ position: 'sticky', top: 32 }}>
            {/* Quick facts */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              style={{ border: '1px solid rgba(201,169,110,0.15)', borderRadius: 2, padding: 28, marginBottom: 16, background: 'rgba(201,169,110,0.02)' }}>
              <p style={{ fontFamily: '"Space Mono", monospace', fontSize: 9, letterSpacing: '0.25em', color: 'rgba(240,235,224,0.22)', marginBottom: 20 }}>TERRITORY DOSSIER</p>
              {dest.facts.map((f: any) => (
                <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '10px 0', borderBottom: '1px solid rgba(240,235,224,0.04)' }}>
                  <span style={{ fontFamily: '"Space Mono", monospace', fontSize: 9, letterSpacing: '0.15em', color: 'rgba(240,235,224,0.25)' }}>{f.label}</span>
                  <span style={{ fontFamily: '"Space Mono", monospace', fontSize: 10, color: 'rgba(240,235,224,0.6)', textAlign: 'right', maxWidth: '55%' }}>{f.val}</span>
                </div>
              ))}
            </motion.div>

            {/* Tours */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
              style={{ border: '1px solid rgba(201,169,110,0.15)', borderRadius: 2, padding: 28, background: 'rgba(201,169,110,0.02)' }}>
              <p style={{ fontFamily: '"Space Mono", monospace', fontSize: 9, letterSpacing: '0.25em', color: 'rgba(240,235,224,0.22)', marginBottom: 20 }}>EXPEDITIONS HERE</p>
              {dest.tours.map((t: any, i: number) => (
                <Link key={i} to={`/tours/${t.slug}`}
                  style={{ display: 'block', textDecoration: 'none', padding: '16px 0', borderBottom: '1px solid rgba(240,235,224,0.04)', transition: 'background 0.2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.paddingLeft = '6px'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.paddingLeft = '0px'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <h4 style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 20, letterSpacing: '0.04em', color: '#f0ebe0' }}>{t.title}</h4>
                    <FiArrowRight size={12} color="#c9a96e" />
                  </div>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <span style={{ fontFamily: '"Space Mono", monospace', fontSize: 9, color: 'rgba(240,235,224,0.28)', letterSpacing: '0.1em' }}>{t.duration}D</span>
                    <span style={{ fontFamily: '"Space Mono", monospace', fontSize: 9, color: DIFF_COLOR[t.difficulty] || '#c9a96e', letterSpacing: '0.1em' }}>{t.difficulty}</span>
                    <span style={{ fontFamily: '"Space Mono", monospace', fontSize: 9, color: '#c9a96e', letterSpacing: '0.1em', marginLeft: 'auto' }}>${t.price.toLocaleString()}</span>
                  </div>
                </Link>
              ))}

              <Link to="/tours" style={{
                display: 'flex', alignItems: 'center', gap: 10, marginTop: 20, textDecoration: 'none',
                border: '1px solid rgba(201,169,110,0.22)', padding: '12px 16px', borderRadius: 1,
                fontFamily: '"Space Mono", monospace', fontSize: 10, letterSpacing: '0.15em', color: '#c9a96e',
                justifyContent: 'center', transition: 'background 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(201,169,110,0.08)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
              >
                VIEW ALL EXPEDITIONS <FiArrowRight size={12} />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}