import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiClock, FiUsers, FiStar, FiMapPin, FiChevronDown, FiCalendar, FiAlertTriangle, FiArrowRight, FiCheck, FiShare2, FiHeart } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

function AirplaneCursor() {
  const planeRef = useRef<HTMLDivElement>(null)
  const trailRefs = useRef<(HTMLDivElement | null)[]>([])
  const pos = useRef({ x: 0, y: 0 }); const actual = useRef({ x: 0, y: 0 }); const prevPos = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>(0); const [visible, setVisible] = useState(false); const TRAIL = 8
  useEffect(() => {
    const move = (e: MouseEvent) => { pos.current = { x: e.clientX, y: e.clientY }; setVisible(true) }
    const leave = () => setVisible(false)
    window.addEventListener('mousemove', move); window.addEventListener('mouseleave', leave)
    const animate = () => {
      actual.current.x += (pos.current.x - actual.current.x) * 0.14; actual.current.y += (pos.current.y - actual.current.y) * 0.14
      const angle = Math.atan2(pos.current.y - prevPos.current.y, pos.current.x - prevPos.current.x) * (180 / Math.PI)
      prevPos.current = { ...actual.current }
      if (planeRef.current) { planeRef.current.style.left = actual.current.x + 'px'; planeRef.current.style.top = actual.current.y + 'px'; planeRef.current.style.transform = `translate(-50%,-50%) rotate(${angle + 45}deg)` }
      trailRefs.current.forEach((el, i) => { if (!el) return; const lag = (i + 1) * 0.06; el.style.left = (pos.current.x + (actual.current.x - pos.current.x) * lag) + 'px'; el.style.top = (pos.current.y + (actual.current.y - pos.current.y) * lag) + 'px'; el.style.opacity = String((1 - i / TRAIL) * 0.4); const sz = `${4 - i * 0.4}px`; el.style.width = sz; el.style.height = sz })
      rafRef.current = requestAnimationFrame(animate)
    }
    animate()
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseleave', leave); cancelAnimationFrame(rafRef.current) }
  }, [])
  if (!visible) return null
  return (
    <>
      {Array.from({ length: TRAIL }).map((_, i) => <div key={i} ref={el => { trailRefs.current[i] = el }} style={{ position: 'fixed', borderRadius: '50%', background: '#f97316', pointerEvents: 'none', zIndex: 9997, transform: 'translate(-50%,-50%)' }} />)}
      <div ref={planeRef} style={{ position: 'fixed', pointerEvents: 'none', zIndex: 9999, width: 28, height: 28 }}>
        <svg viewBox="0 0 24 24" fill="none" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 0 8px rgba(249,115,22,0.9))' }}><path d="M21 3L3 10.5L10 13L13 21L21 3Z" fill="#f97316" stroke="#fff" strokeWidth="0.8" strokeLinejoin="round" /></svg>
      </div>
    </>
  )
}

function StarCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return; const ctx = canvas.getContext('2d')!; let raf: number
    const stars = Array.from({ length: 180 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.1 + 0.2, a: Math.random(), speed: Math.random() * 0.004 + 0.001 }))
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }; resize(); window.addEventListener('resize', resize)
    const draw = () => { ctx.clearRect(0, 0, canvas.width, canvas.height); stars.forEach(s => { s.a += s.speed; ctx.beginPath(); ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(255,255,255,${0.2 + 0.55 * Math.abs(Math.sin(s.a))})`; ctx.fill() }); raf = requestAnimationFrame(draw) }
    draw(); return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={ref} style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />
}

const TOURS_DATA: Record<string, any> = {
  'himalayan-circuit': {
    slug: 'himalayan-circuit', title: 'Himalayan Circuit', subtitle: 'NEPAL · TIBET · BHUTAN', region: 'Asia', difficulty: 'EXTREME', duration: 21, groupSize: 8, rating: 4.9, reviews: 127, price: 6800, category: 'Trek', tags: ['High Altitude', 'Cultural', 'Remote'],
    cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1800&q=80',
    gallery: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=900&q=80', 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=900&q=80', 'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=900&q=80', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80'],
    summary: 'A legendary traverse across three kingdoms — where glaciers carve the sky and ancient monasteries cling to cliffs at the edge of the world. This is not a walk. It is an initiation.',
    highlights: ['Cross Thorong La Pass at 5,416m — the highest trekking pass in the world', "Audience at Tiger's Nest Monastery, Bhutan's most sacred site", 'Traverse the forbidden plateau of Tibet under snow-capped giants', 'Camp at Everest Base Camp under the Khumbu Icefall', "Private cultural immersion with Sherpa families in Namche Bazaar"],
    included: ['All permits (Everest, Annapurna, Bhutan tariff)', 'Expert mountain guides — certified & local', 'All accommodations (teahouses to boutique lodges)', 'All meals on trail', 'Domestic flights within itinerary', 'Emergency evacuation insurance'],
    excluded: ['International flights', 'Nepal/Bhutan visa fees', 'Personal equipment', 'Travel insurance (mandatory)', 'Gratuities'],
    itinerary: [
      { day: '1–2', title: 'Kathmandu Arrival & Briefing', desc: "Land in Kathmandu. Acclimatization walk through Thamel's ancient streets. Gear check and expedition briefing." },
      { day: '3–7', title: 'Annapurna Circuit — High Camps', desc: 'Fly to Pokhara, then drive to Chame. Begin the legendary Annapurna Circuit, ascending through rhododendron forests.' },
      { day: '8', title: 'Thorong La Pass', desc: "3am start under headtorches. Summit the world's highest trekking pass at 5,416m as dawn breaks." },
      { day: '9–12', title: 'Tibet Plateau Transit', desc: 'Cross into Tibet via the Friendship Highway. Drive through Shigatse and Gyantse — towns frozen in another century.' },
      { day: '13–15', title: 'Everest Base Camp', desc: 'Trek to EBC at 5,364m. Sleep in the shadow of the world\'s highest peak. Wake to the roar of the Khumbu Icefall.' },
      { day: '16–19', title: "Bhutan — The Last Shangri-La", desc: "Fly to Paro. Trek to Tiger's Nest at dawn. Explore the fortress dzongs of Thimphu and Punakha." },
      { day: '20–21', title: 'Return & Debrief', desc: 'Final night in Kathmandu. Expedition debrief, celebration dinner, and farewell under the Himalayan stars.' },
    ],
    departures: [{ date: 'Mar 15, 2025', spots: 3, status: 'AVAILABLE' }, { date: 'Sep 10, 2025', spots: 6, status: 'AVAILABLE' }, { date: 'Oct 18, 2025', spots: 1, status: 'FILLING FAST' }, { date: 'Mar 20, 2026', spots: 8, status: 'OPEN' }],
    guides: [{ name: 'Pasang Sherpa', role: 'Lead Guide', exp: '18 seasons', summits: '12 × Everest', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80' }, { name: 'Tenzin Dorje', role: 'Cultural Expert', exp: '12 seasons', summits: 'Tibet & Bhutan specialist', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80' }],
  }
}

const DIFF_COLOR: Record<string, string> = { MODERATE: '#22c55e', HARD: '#f59e0b', EXTREME: '#ef4444' }

function ItineraryItem({ item, index }: { item: any; index: number }) {
  const [open, setOpen] = useState(index === 0)
  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%', background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 20, padding: '18px 0', textAlign: 'left', cursor: 'none' }}>
        <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 9, letterSpacing: '0.15em', color: open ? '#f97316' : 'rgba(249,115,22,0.35)', minWidth: 60, transition: 'color 0.3s' }}>DAY {item.day}</span>
        <span style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 21, letterSpacing: '0.05em', color: open ? '#fff' : 'rgba(255,255,255,0.5)', flex: 1, transition: 'color 0.3s' }}>{item.title}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}><FiChevronDown size={13} color="rgba(255,255,255,0.35)" /></motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} style={{ overflow: 'hidden' }}>
            <p style={{ fontFamily: '"Crimson Text",serif', fontStyle: 'italic', fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, padding: '0 0 18px 80px' }}>{item.desc}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function TourDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const tour = TOURS_DATA[slug!] || Object.values(TOURS_DATA)[0]
  const navigate = useNavigate()
  const [activeGallery, setActiveGallery] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const [selectedDeparture, setSelectedDeparture] = useState<number | null>(null)
  const [wishlisted, setWishlisted] = useState(false)
  const [showShareToast, setShowShareToast] = useState(false)
  const bookRef = useRef<HTMLDivElement>(null)

  useEffect(() => { const onScroll = () => setScrollY(window.scrollY); window.addEventListener('scroll', onScroll, { passive: true }); return () => window.removeEventListener('scroll', onScroll) }, [])
  const dc = DIFF_COLOR[tour.difficulty] || '#f97316'

  return (
    <div style={{ minHeight: '100vh', background: '#06040f', color: '#fff', fontFamily: '"Crimson Text",Georgia,serif', cursor: 'none' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Mono&family=Bebas+Neue&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');*,*::before,*::after{box-sizing:border-box;cursor:none!important;}body{overflow-x:hidden;background:#06040f;}::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-track{background:#06040f;}::-webkit-scrollbar-thumb{background:rgba(249,115,22,0.4);border-radius:2px;}@keyframes spinSlow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      <StarCanvas /><AirplaneCursor />

      <motion.div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 2, zIndex: 9999, background: 'linear-gradient(90deg,#f97316,#fbbf24,#f97316)', transformOrigin: '0%', scaleX: scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1) }} />

      <AnimatePresence>
        {showShareToast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            style={{ position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)', background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.4)', backdropFilter: 'blur(16px)', padding: '12px 22px', borderRadius: 2, zIndex: 9998, fontFamily: '"Space Mono",monospace', fontSize: 10, letterSpacing: '0.15em', color: '#f97316', display: 'flex', alignItems: 'center', gap: 10 }}>
            <FiCheck size={12} /> LINK COPIED
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO */}
      <div style={{ position: 'relative', height: '95vh', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${tour.cover})`, backgroundSize: 'cover', backgroundPosition: 'center', transform: `translateY(${scrollY * 0.35}px)`, filter: 'brightness(0.25) saturate(0.55)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #06040f 0%, rgba(6,4,15,0.35) 50%, rgba(6,4,15,0.1) 100%)' }} />

        <Link to="/tours" style={{ position: 'absolute', top: 32, left: 'clamp(20px,6vw,100px)', display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', zIndex: 10, padding: '8px 16px', background: 'rgba(6,4,15,0.6)', backdropFilter: 'blur(8px)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 2 }}>
          <FiArrowLeft size={12} color="#f97316" /><span style={{ fontFamily: '"Space Mono",monospace', fontSize: 9, letterSpacing: '0.2em', color: '#f97316', textTransform: 'uppercase' }}>Back</span>
        </Link>

        <div style={{ position: 'absolute', top: 32, right: 'clamp(20px,6vw,100px)', display: 'flex', gap: 8, zIndex: 10 }}>
          <motion.button onClick={() => setWishlisted(w => !w)} whileTap={{ scale: 0.88 }} style={{ width: 40, height: 40, borderRadius: '50%', background: wishlisted ? 'rgba(239,68,68,0.15)' : 'rgba(6,4,15,0.6)', border: wishlisted ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'none', backdropFilter: 'blur(8px)' }}>
            <FiHeart size={14} color={wishlisted ? '#ef4444' : 'rgba(255,255,255,0.55)'} style={{ fill: wishlisted ? '#ef4444' : 'none' }} />
          </motion.button>
          <motion.button onClick={() => { navigator.clipboard?.writeText(window.location.href); setShowShareToast(true); setTimeout(() => setShowShareToast(false), 2200) }} whileTap={{ scale: 0.88 }} style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(6,4,15,0.6)', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'none', backdropFilter: 'blur(8px)' }}>
            <FiShare2 size={14} color="rgba(255,255,255,0.55)" />
          </motion.button>
        </div>

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 clamp(20px,6vw,100px) 56px' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
            <span style={{ border: `1px solid ${dc}`, color: dc, fontFamily: '"Space Mono",monospace', fontSize: 9, letterSpacing: '0.2em', padding: '3px 10px', borderRadius: 2, background: `${dc}12` }}>{tour.difficulty}</span>
            {tour.tags.map((tag: string) => <span key={tag} style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.35)', fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.15em', padding: '3px 10px', borderRadius: 2 }}>{tag.toUpperCase()}</span>)}
          </div>
          <p style={{ fontFamily: '"Space Mono",monospace', fontSize: 10, letterSpacing: '0.25em', color: '#f97316', marginBottom: 10 }}>{tour.subtitle}</p>
          <h1 style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 'clamp(4rem,9vw,10rem)', letterSpacing: '0.03em', lineHeight: 0.9, color: '#fff', marginBottom: 24 }}>{tour.title}</h1>
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'center' }}>
            {[{ icon: <FiClock size={11} />, val: `${tour.duration} Days` }, { icon: <FiUsers size={11} />, val: `Max ${tour.groupSize}` }, { icon: <FiStar size={11} />, val: `${tour.rating} (${tour.reviews} reviews)` }, { icon: <FiMapPin size={11} />, val: tour.region }].map(({ icon, val }) => (
              <div key={val} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ color: '#f97316' }}>{icon}</span>
                <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 10, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.55)' }}>{val}</span>
              </div>
            ))}
            <motion.button onClick={() => bookRef.current?.scrollIntoView({ behavior: 'smooth' })} whileHover={{ y: -2 }} style={{ marginLeft: 'auto', background: 'linear-gradient(135deg,#f97316,#ea580c)', border: 'none', padding: '13px 28px', fontFamily: '"Space Mono",monospace', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff', borderRadius: 2, fontWeight: 700, cursor: 'none', boxShadow: '0 8px 28px rgba(249,115,22,0.4)' }}>
              Book Expedition
            </motion.button>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px clamp(20px,6vw,60px)', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 72, alignItems: 'start' }}>
          <div>
            <p style={{ fontFamily: '"Crimson Text",serif', fontStyle: 'italic', fontSize: 21, color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, marginBottom: 56, borderLeft: '3px solid rgba(249,115,22,0.4)', paddingLeft: 24 }}>{tour.summary}</p>

            {/* Highlights */}
            <div style={{ marginBottom: 56 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f97316', boxShadow: '0 0 8px #f97316' }} />
                <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)' }}>Expedition Highlights</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.05)' }} />
              </div>
              {tour.highlights.map((h: string, i: number) => (
                <motion.div key={i} initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                  style={{ display: 'flex', gap: 14, marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <FiCheck size={12} color="#22c55e" style={{ marginTop: 3, flexShrink: 0 }} />
                  <p style={{ fontFamily: '"Crimson Text",serif', fontSize: 16, color: 'rgba(255,255,255,0.62)', lineHeight: 1.55 }}>{h}</p>
                </motion.div>
              ))}
            </div>

            {/* Gallery */}
            <div style={{ marginBottom: 56 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 8px #38bdf8' }} />
                <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)' }}>Expedition Gallery</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.05)' }} />
              </div>
              <motion.div key={activeGallery} initial={{ opacity: 0.6, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
                style={{ height: 400, borderRadius: 3, overflow: 'hidden', backgroundImage: `url(${tour.gallery[activeGallery]})`, backgroundSize: 'cover', backgroundPosition: 'center', marginBottom: 6 }} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 4 }}>
                {tour.gallery.map((img: string, i: number) => (
                  <div key={i} onClick={() => setActiveGallery(i)} style={{ height: 76, backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: activeGallery === i ? 1 : 0.32, border: activeGallery === i ? '1px solid #f97316' : '1px solid transparent', cursor: 'none', transition: 'all 0.25s', borderRadius: 2 }} />
                ))}
              </div>
            </div>

            {/* Itinerary */}
            <div style={{ marginBottom: 56 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#a78bfa', boxShadow: '0 0 8px #a78bfa' }} />
                <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)' }}>Expedition Itinerary</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.05)' }} />
              </div>
              {tour.itinerary.map((item: any, i: number) => <ItineraryItem key={i} item={item} index={i} />)}
            </div>

            {/* Included/Excluded */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36, marginBottom: 56 }}>
              {[{ title: 'INCLUDED', items: tour.included, color: '#22c55e', mark: <FiCheck size={11} color="#22c55e" style={{ marginTop: 3, flexShrink: 0 }} /> }, { title: 'NOT INCLUDED', items: tour.excluded, color: '#ef4444', mark: <span style={{ color: '#ef4444', fontSize: 16, flexShrink: 0 }}>×</span> }].map(({ title, items, color, mark }) => (
                <div key={title}>
                  <p style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color, marginBottom: 16 }}>{title}</p>
                  {items.map((item: string, i: number) => (
                    <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>{mark}<p style={{ fontFamily: '"Crimson Text",serif', fontSize: 14, color: 'rgba(255,255,255,0.52)', lineHeight: 1.5 }}>{item}</p></div>
                  ))}
                </div>
              ))}
            </div>

            {/* Guides */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fbbf24', boxShadow: '0 0 8px #fbbf24' }} />
                <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)' }}>Your Guides</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.05)' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {tour.guides.map((g: any, i: number) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    style={{ padding: '22px', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 3, background: 'rgba(255,255,255,0.02)', transition: 'border-color 0.3s', cursor: 'none' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(249,115,22,0.3)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'}>
                    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                      <div style={{ width: 50, height: 50, borderRadius: '50%', flexShrink: 0, backgroundImage: `url(${g.img})`, backgroundSize: 'cover', backgroundPosition: 'center', border: '1px solid rgba(249,115,22,0.3)' }} />
                      <div>
                        <p style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 18, letterSpacing: '0.05em', color: '#fff', marginBottom: 2 }}>{g.name}</p>
                        <p style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#f97316', marginBottom: 6 }}>{g.role}</p>
                        <p style={{ fontFamily: '"Space Mono",monospace', fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>{g.exp} · {g.summits}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div ref={bookRef} style={{ position: 'sticky', top: 32 }}>
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              style={{ border: '1px solid rgba(249,115,22,0.2)', borderRadius: 3, padding: '28px', background: 'rgba(249,115,22,0.03)', marginBottom: 14 }}>
              <div style={{ marginBottom: 22 }}>
                <p style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 4 }}>FROM</p>
                <p style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 54, background: 'linear-gradient(135deg,#f97316,#fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1, letterSpacing: '0.02em' }}>${tour.price.toLocaleString()}</p>
                <p style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Per Person · All-Inclusive</p>
              </div>
              <p style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: 10 }}>Select Departure</p>
              {tour.departures.map((dep: any, i: number) => (
                <motion.button key={i} onClick={() => setSelectedDeparture(i)} whileHover={{ x: 3 }} style={{ width: '100%', marginBottom: 6, padding: '11px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: selectedDeparture === i ? 'rgba(249,115,22,0.1)' : 'transparent', border: selectedDeparture === i ? '1px solid rgba(249,115,22,0.5)' : '1px solid rgba(255,255,255,0.06)', borderRadius: 2, transition: 'all 0.2s', cursor: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <FiCalendar size={10} color={selectedDeparture === i ? '#f97316' : 'rgba(255,255,255,0.25)'} />
                    <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 10, color: selectedDeparture === i ? '#fff' : 'rgba(255,255,255,0.4)' }}>{dep.date}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    {dep.status === 'FILLING FAST' && <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ fontFamily: '"Space Mono",monospace', fontSize: 7, color: '#f59e0b', letterSpacing: '0.1em' }}>FILLING FAST</motion.span>}
                    <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, color: 'rgba(255,255,255,0.25)' }}>{dep.spots} SPOTS</span>
                  </div>
                </motion.button>
              ))}
              <motion.button whileHover={selectedDeparture !== null ? { y: -2 } : {}}
                onClick={() => { if (selectedDeparture !== null) navigate(`/book/${tour.slug}`) }}
                style={{ width: '100%', marginTop: 18, padding: '15px', background: selectedDeparture !== null ? 'linear-gradient(135deg,#f97316,#ea580c)' : 'rgba(249,115,22,0.1)', border: 'none', borderRadius: 2, fontFamily: '"Space Mono",monospace', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: selectedDeparture !== null ? '#fff' : 'rgba(249,115,22,0.3)', fontWeight: 700, cursor: selectedDeparture !== null ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: selectedDeparture !== null ? '0 8px 28px rgba(249,115,22,0.35)' : 'none', transition: 'all 0.3s' }}>
                {selectedDeparture !== null ? <><span>Reserve My Spot</span><FiArrowRight size={13} /></> : 'Select a Date First'}
              </motion.button>
              <p style={{ fontFamily: '"Space Mono",monospace', fontSize: 7, color: 'rgba(255,255,255,0.18)', textAlign: 'center', marginTop: 10, letterSpacing: '0.1em' }}>DEPOSIT HOLDS YOUR SPOT · FULL PAYMENT 90 DAYS BEFORE</p>
            </motion.div>
            <div style={{ padding: '16px 18px', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 3, background: 'rgba(239,68,68,0.03)', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <FiAlertTriangle size={12} color="#ef4444" style={{ marginTop: 2, flexShrink: 0 }} />
              <p style={{ fontFamily: '"Space Mono",monospace', fontSize: 9, color: 'rgba(255,255,255,0.35)', lineHeight: 1.7, letterSpacing: '0.05em' }}>Extreme-rated expedition. Prior high-altitude experience required. Medical clearance mandatory.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}