import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { FiArrowRight, FiStar, FiClock, FiUsers } from 'react-icons/fi'
import { GiCompass, GiLotusFlower } from 'react-icons/gi'
import { MOCK_TOURS } from '../utils/mockData'

// ─── DATA ─────────────────────────────────────────────────────────────────────
const INDIA_DESTINATIONS = [
  { name: 'Rajasthan', tag: 'Golden Deserts & Forts', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=85', rating: 4.9, tours: 12, accent: '#F4A62A' },
  { name: 'Kerala', tag: 'Backwaters & Spice Trails', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=85', rating: 4.9, tours: 10, accent: '#1A6B5A' },
  { name: 'Ladakh', tag: 'Rooftop of the World', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=85', rating: 4.8, tours: 8, accent: '#FF6B35' },
  { name: 'Varanasi', tag: 'Sacred City on the Ganga', image: 'https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=800&q=85', rating: 4.8, tours: 6, accent: '#F4A62A' },
  { name: 'Andaman', tag: 'Pristine Island Shores', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=85', rating: 4.9, tours: 5, accent: '#1A6B5A' },
  { name: 'Meghalaya', tag: 'Living Root Bridges', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=85', rating: 4.8, tours: 6, accent: '#FF6B35' },
]

const STATS = [
  { end: 28, suffix: '+', label: 'States Covered' },
  { end: 500, suffix: '+', label: 'Curated Tours' },
  { end: 12, suffix: 'k+', label: 'Happy Travellers' },
  { end: 4.9, suffix: '', label: 'Average Rating', isDecimal: true },
]

// The 3 pillars — what Pavilion actually does
const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Discover',
    headline: 'India has 28 states. Each one a different world.',
    body: 'Browse destinations curated by people who actually live there — not by algorithm. Every listing is backed by on-ground expertise.',
    color: '#FF6B35',
    icon: '🔭',
    link: '/destinations',
    linkLabel: 'Explore Destinations',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=900&q=85',
  },
  {
    step: '02',
    title: 'Connect',
    headline: 'Your guide was born there. That changes everything.',
    body: 'Every tour on Pavilion is led by a certified local expert — someone with the languages, the relationships, and the knowledge no guidebook can replicate.',
    color: '#F4A62A',
    icon: '🤝',
    link: '/tours',
    linkLabel: 'Browse Tours',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=900&q=85',
  },
  {
    step: '03',
    title: 'Experience',
    headline: 'Not a tourist. A traveller.',
    body: 'Village kitchens, private temple access at dawn, rides on working houseboats. Pavilion crafts moments that belong to you alone.',
    color: '#1A9B6C',
    icon: '✨',
    link: '/tours',
    linkLabel: 'See Experiences',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=900&q=85',
  },
]

const WHY_ITEMS = [
  { icon: '🧭', title: 'Certified Local Guides', desc: 'Every tour led by guides born in the destination — people who know the real stories behind every stone, temple and lane.', accent: '#FF6B35' },
  { icon: '🌿', title: 'Responsible Travel', desc: 'Carbon-offset every booking. We invest directly in local communities and preserve the landscapes that make India extraordinary.', accent: '#1A6B5A' },
  { icon: '🛡️', title: 'Fully Supported 24/7', desc: 'From the moment you book to your safe return home — our on-ground team is always one call away.', accent: '#F4A62A' },
  { icon: '✨', title: 'Authentic Immersion', desc: 'No tourist bubbles. Village kitchens, sunrise rituals, private heritage access — you live India, not just visit it.', accent: '#FF6B35' },
]

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const SEASON_DATA = [
  { region: 'Rajasthan & North Plains', icon: '🏰', color: '#F4A62A', months: [2,2,2,3,4,4,4,4,3,1,1,1], tip: 'Oct–Mar is ideal — cool desert nights and clear skies for fort exploration.' },
  { region: 'Kerala & South Coast',     icon: '🌴', color: '#1A6B5A', months: [1,1,2,2,3,4,4,4,3,2,1,1], tip: 'Nov–Feb is perfect for backwaters and beaches before the monsoon arrives.' },
  { region: 'Ladakh & High Himalayas',  icon: '🏔️', color: '#FF6B35', months: [4,4,4,4,3,2,1,1,2,3,4,4], tip: 'Jul–Sep is the window — roads open, skies clear, Pangong at its most vivid.' },
  { region: 'Goa & West Coast',         icon: '🏖️', color: '#9B59B6', months: [1,1,1,2,3,4,4,4,3,2,1,1], tip: 'Nov–Mar brings warm days, calm seas, and the full festival season.' },
  { region: 'Northeast India',          icon: '🌿', color: '#27AE60', months: [2,2,1,1,2,4,4,4,3,1,1,2], tip: 'Oct–Apr is when living root bridges are most accessible and skies clearest.' },
  { region: 'Andaman Islands',          icon: '🐠', color: '#2980B9', months: [1,1,1,1,2,4,4,4,3,2,1,1], tip: 'Oct–May — dive season, bioluminescent nights, and Radhanagar Beach at its finest.' },
]
const SEASON_COLORS = { 1:{bg:'#1A6B5A',label:'Peak'}, 2:{bg:'#F4A62A',label:'Good'}, 3:{bg:'#E8DCC8',label:'Fair'}, 4:{bg:'#F0E6E6',label:'Avoid'} }

// ─── ANIMATED COUNTER ─────────────────────────────────────────────────────────
function Counter({ end, suffix = '', isDecimal = false }: { end: number; suffix?: string; isDecimal?: boolean }) {
  const [val, setVal] = useState(isDecimal ? end.toFixed(1) : '0')
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (started) return
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      setStarted(true); obs.disconnect()
      if (isDecimal) {
        let cur = 0; const t = setInterval(() => { cur += end/40; if (cur >= end) { setVal(end.toFixed(1)); clearInterval(t) } else setVal(cur.toFixed(1)) }, 30)
      } else {
        let cur = 0; const t = setInterval(() => { cur += end/50; if (cur >= end) { setVal(String(end)); clearInterval(t) } else setVal(String(Math.floor(cur))) }, 20)
      }
    }, { threshold: 0.6 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [end, started, isDecimal])
  return <span ref={ref}>{val}{suffix}</span>
}

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
          ctx.strokeStyle = 'rgba(255,107,53,0.08)'; ctx.lineWidth = 0.5
          ctx.beginPath(); ctx.moveTo(x-5, y); ctx.lineTo(x+5, y); ctx.moveTo(x, y-5); ctx.lineTo(x, y+5); ctx.stroke()
        }
      }
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={ref} style={{ position:'fixed', inset:0, width:'100%', height:'100%', pointerEvents:'none', zIndex:0, opacity:0.6 }} />
}

// ─── ANIMATED MANDALA / COMPASS ───────────────────────────────────────────────
function MandalaCanvas({ color }: { color: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const W = 520; canvas.width = W; canvas.height = W
    const cx = W/2; const cy = W/2
    let t = 0
    const draw = () => {
      t += 0.004
      ctx.clearRect(0, 0, W, W)
      const rings = [
        { r: 210, petals: 24, len: 18, lw: 0.4, alpha: 0.12, speed: 1 },
        { r: 175, petals: 16, len: 22, lw: 0.6, alpha: 0.18, speed: -0.7 },
        { r: 138, petals: 12, len: 20, lw: 0.8, alpha: 0.25, speed: 1.2 },
        { r: 100, petals: 8,  len: 24, lw: 1,   alpha: 0.35, speed: -1 },
        { r:  62, petals: 6,  len: 18, lw: 1.2, alpha: 0.45, speed: 0.8 },
      ]
      // Parse accent color to rgba
      const hex = color.replace('#','')
      const r = parseInt(hex.slice(0,2),16); const g = parseInt(hex.slice(2,4),16); const b = parseInt(hex.slice(4,6),16)

      rings.forEach(ring => {
        const angle = t * ring.speed
        for (let i = 0; i < ring.petals; i++) {
          const a = (i / ring.petals) * Math.PI * 2 + angle
          const x1 = cx + ring.r * Math.cos(a)
          const y1 = cy + ring.r * Math.sin(a)
          const x2 = cx + (ring.r + ring.len) * Math.cos(a)
          const y2 = cy + (ring.r + ring.len) * Math.sin(a)
          ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2)
          ctx.strokeStyle = `rgba(${r},${g},${b},${ring.alpha})`
          ctx.lineWidth = ring.lw; ctx.stroke()
          // dot at tip
          ctx.beginPath(); ctx.arc(x2, y2, ring.lw * 1.4, 0, Math.PI*2)
          ctx.fillStyle = `rgba(${r},${g},${b},${ring.alpha * 1.5})`; ctx.fill()
        }
        // ring circle
        ctx.beginPath(); ctx.arc(cx, cy, ring.r, 0, Math.PI*2)
        ctx.strokeStyle = `rgba(${r},${g},${b},${ring.alpha * 0.5})`
        ctx.lineWidth = 0.5; ctx.stroke()
      })
      // Center compass rose
      const spokes = 8
      for (let i = 0; i < spokes; i++) {
        const a = (i / spokes) * Math.PI * 2 + t * 0.3
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.lineTo(cx + 42 * Math.cos(a), cy + 42 * Math.sin(a))
        ctx.strokeStyle = `rgba(${r},${g},${b},0.5)`; ctx.lineWidth = i % 2 === 0 ? 1.5 : 0.7; ctx.stroke()
      }
      ctx.beginPath(); ctx.arc(cx, cy, 14, 0, Math.PI*2)
      ctx.strokeStyle = `rgba(${r},${g},${b},0.6)`; ctx.lineWidth = 1.5; ctx.stroke()
      ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI*2)
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
  const pX  = useTransform(springX, [0,1], [-22, 22])
  const pY  = useTransform(springY, [0,1], [-12, 12])
  const pXs = useTransform(springX, [0,1], [-10, 10])
  const pYs = useTransform(springY, [0,1], [-6,  6])
  const rotZ = useTransform(springX, [0,1], [-2.5, 2.5])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
    mouseX.set((e.clientX - r.left) / r.width)
    mouseY.set((e.clientY - r.top)  / r.height)
  }, [mouseX, mouseY])

  // Rotating words — what Pavilion is about
  const WORDS = ['Culture.', 'Discovery.', 'Heritage.', 'Wilderness.', 'Ritual.', 'Depth.']
  const [wordIdx, setWordIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setWordIdx(i => (i+1) % WORDS.length), 2200)
    return () => clearInterval(t)
  }, [])

  return (
    <section
      style={{ position:'relative', height:'100vh', minHeight:700, overflow:'hidden', background:'#0A0705' }}
      onMouseMove={handleMouseMove}
    >
      {/* Deep textured background */}
      <div style={{ position:'absolute', inset:0, backgroundImage:"url('https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1920&q=80')", backgroundSize:'cover', backgroundPosition:'center', filter:'brightness(0.18) saturate(0.5)', zIndex:0 }} />
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 60% 50%, rgba(255,107,53,0.07) 0%, transparent 65%), radial-gradient(ellipse at 20% 80%, rgba(244,166,42,0.05) 0%, transparent 50%)', zIndex:1 }} />
      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'55%', background:'linear-gradient(to top, #0A0705 0%, transparent 100%)', zIndex:2 }} />
      <div style={{ position:'absolute', top:0, left:0, bottom:0, width:'55%', background:'linear-gradient(to right, rgba(10,7,5,0.85) 0%, transparent 100%)', zIndex:2 }} />

      {/* Tricolour */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:3, display:'flex', zIndex:10 }}>
        <div style={{ flex:1, background:'#FF9933' }} /><div style={{ flex:1, background:'rgba(255,255,255,0.75)' }} /><div style={{ flex:1, background:'#138808' }} />
      </div>

      {/* Mandala — right side, parallax */}
      <motion.div style={{ position:'absolute', right:'-4vw', top:'50%', translateY:'-50%', width:'clamp(380px,44vw,620px)', height:'clamp(380px,44vw,620px)', zIndex:3, x: pXs, y: pYs, rotate: rotZ }}>
        <MandalaCanvas color="#F4A62A" />
      </motion.div>

      {/* LEFT: main copy */}
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', justifyContent:'center', padding:'0 clamp(32px,7vw,120px)', zIndex:5 }}>

        {/* Overline */}
        <motion.div initial={{ opacity:0, x:-24 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.8, delay:0.2 }}
          style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
          <div style={{ width:32, height:1, background:'rgba(244,166,42,0.7)' }} />
          <span style={{ fontFamily:'"Space Mono", monospace', fontSize:9, letterSpacing:'0.5em', textTransform:'uppercase', color:'rgba(244,166,42,0.8)' }}>Pavilion · Curated Journeys</span>
        </motion.div>

        {/* DISCOVER — slow layer */}
        <div style={{ overflow:'hidden' }}>
          <motion.div initial={{ y:100, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ duration:1, delay:0.3, ease:[0.16,1,0.3,1] }} style={{ x:pXs, y:pYs }}>
            <p style={{ fontFamily:'"Bebas Neue", sans-serif', fontSize:'clamp(1.3rem,2vw,2.1rem)', letterSpacing:'0.55em', color:'rgba(255,248,240,0.2)', margin:0, lineHeight:1 }}>DISCOVER</p>
          </motion.div>
        </div>

        {/* INCREDIBLE — fast layer */}
        <div style={{ overflow:'hidden' }}>
          <motion.div initial={{ y:140, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ duration:1.05, delay:0.38, ease:[0.16,1,0.3,1] }} style={{ x:pX, y:pY }}>
            <h1 style={{ fontFamily:'"Bebas Neue", sans-serif', fontSize:'clamp(5rem,10.5vw,13rem)', letterSpacing:'0.025em', lineHeight:0.85, margin:0, color:'#FFF8F0' }}>INCREDIBLE</h1>
          </motion.div>
        </div>

        {/* INDIA — accent */}
        <div style={{ overflow:'hidden' }}>
          <motion.div initial={{ y:140, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ duration:1.1, delay:0.46, ease:[0.16,1,0.3,1] }} style={{ x:pXs, y:pYs }}>
            <h1 style={{ fontFamily:'"Bebas Neue", sans-serif', fontSize:'clamp(5rem,10.5vw,13rem)', letterSpacing:'0.025em', lineHeight:0.85, margin:0, color:'#F4A62A' }}>INDIA</h1>
          </motion.div>
        </div>

        {/* Rotating tagline */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.85 }}
          style={{ marginTop:22, display:'flex', alignItems:'baseline', gap:10, maxWidth:520 }}>
          <p style={{ fontFamily:'"Crimson Text", serif', fontStyle:'italic', fontSize:'clamp(16px,1.4vw,20px)', color:'rgba(255,248,240,0.38)', margin:0, whiteSpace:'nowrap' }}>
            India's
          </p>
          <div style={{ overflow:'hidden', height:'clamp(20px,1.8vw,26px)', position:'relative', minWidth:160 }}>
            <AnimatePresence mode="wait">
              <motion.span
                key={wordIdx}
                initial={{ y: 30, opacity:0 }}
                animate={{ y: 0,  opacity:1 }}
                exit={{   y:-30, opacity:0 }}
                transition={{ duration:0.45, ease:[0.22,1,0.36,1] }}
                style={{ position:'absolute', fontFamily:'"Crimson Text", serif', fontStyle:'italic', fontSize:'clamp(16px,1.4vw,20px)', color:'#F4A62A', whiteSpace:'nowrap' }}
              >
                {WORDS[wordIdx]}
              </motion.span>
            </AnimatePresence>
          </div>
          <p style={{ fontFamily:'"Crimson Text", serif', fontStyle:'italic', fontSize:'clamp(16px,1.4vw,20px)', color:'rgba(255,248,240,0.38)', margin:0, whiteSpace:'nowrap' }}>
            Guided by locals.
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:1.05, duration:0.7 }}
          style={{ display:'flex', gap:12, marginTop:32, flexWrap:'wrap' }}>
          <Link to="/destinations" style={{ display:'inline-flex', alignItems:'center', gap:10, background:'#FF6B35', color:'#0A0705', fontFamily:'"Space Mono", monospace', fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', fontWeight:700, padding:'14px 28px', borderRadius:2, textDecoration:'none', boxShadow:'0 8px 32px rgba(255,107,53,0.4)', transition:'transform 0.2s, box-shadow 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform='translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow='0 12px 40px rgba(255,107,53,0.55)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform='none';             (e.currentTarget as HTMLElement).style.boxShadow='0 8px 32px rgba(255,107,53,0.4)' }}>
            Start Exploring <FiArrowRight size={12} />
          </Link>
          <Link to="/tours" style={{ display:'inline-flex', alignItems:'center', gap:10, border:'1px solid rgba(255,248,240,0.2)', color:'rgba(255,248,240,0.65)', fontFamily:'"Space Mono", monospace', fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', padding:'14px 28px', borderRadius:2, textDecoration:'none', backdropFilter:'blur(8px)', transition:'border-color 0.25s, color 0.25s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor='rgba(244,166,42,0.5)'; (e.currentTarget as HTMLElement).style.color='#F4A62A' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor='rgba(255,248,240,0.2)'; (e.currentTarget as HTMLElement).style.color='rgba(255,248,240,0.65)' }}>
            Browse Tours
          </Link>
        </motion.div>
      </div>

      {/* Bottom data strip */}
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.3 }}
        style={{ position:'absolute', bottom:40, left:'clamp(32px,7vw,120px)', zIndex:5, display:'flex', gap:48, alignItems:'flex-end' }}>
        {[{ label:'States Covered', val:'28+' }, { label:'Curated Tours', val:'500+' }, { label:'Avg Rating', val:'4.9★' }].map(item => (
          <div key={item.label}>
            <p style={{ fontFamily:'"Space Mono", monospace', fontSize:7, letterSpacing:'0.3em', textTransform:'uppercase', color:'rgba(255,248,240,0.2)', margin:'0 0 3px' }}>{item.label}</p>
            <p style={{ fontFamily:'"Bebas Neue", sans-serif', fontSize:26, letterSpacing:'0.04em', color:'rgba(255,248,240,0.7)', margin:0, lineHeight:1 }}>{item.val}</p>
          </div>
        ))}
      </motion.div>

      {/* Scroll cue */}
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.6 }}
        style={{ position:'absolute', bottom:24, left:'50%', transform:'translateX(-50%)', zIndex:5, display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
        <motion.div animate={{ scaleY:[0.4,1,0.4] }} transition={{ duration:2, repeat:Infinity, ease:'easeInOut' }}
          style={{ width:1, height:36, background:'linear-gradient(to bottom, transparent, rgba(255,248,240,0.3))' }} />
        <span style={{ fontFamily:'"Space Mono", monospace', fontSize:7, letterSpacing:'0.4em', color:'rgba(255,248,240,0.18)', textTransform:'uppercase' }}>Scroll</span>
      </motion.div>
    </section>
  )
}

// ─── DEST CARD ────────────────────────────────────────────────────────────────
function DestCard({ dest, index }: { dest: typeof INDIA_DESTINATIONS[0]; index: number }) {
  const [hover, setHover] = useState(false)
  return (
    <motion.div
      initial={{ opacity:0, y:32 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
      transition={{ delay:index*0.09, duration:0.6, ease:[0.22,1,0.36,1] }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ position:'relative', borderRadius:4, overflow:'hidden', cursor:'pointer', transform:hover?'translateY(-10px)':'none', transition:'transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s', boxShadow:hover?`0 24px 60px rgba(0,0,0,0.18), 0 0 0 2px ${dest.accent}60`:'0 4px 20px rgba(0,0,0,0.08)' }}
    >
      <div style={{ height:280, overflow:'hidden', position:'relative' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:`url(${dest.image})`, backgroundSize:'cover', backgroundPosition:'center', transform:hover?'scale(1.08)':'scale(1)', transition:'transform 0.7s ease' }} />
        <div style={{ position:'absolute', inset:0, background:`linear-gradient(to top, rgba(26,20,10,0.92) 0%, rgba(26,20,10,0.3) 55%, transparent 100%)` }} />
        <div style={{ position:'absolute', top:14, right:14, background:'rgba(255,248,240,0.92)', backdropFilter:'blur(8px)', borderRadius:100, padding:'4px 10px', display:'flex', alignItems:'center', gap:4 }}>
          <FiStar size={10} style={{ fill:'#F4A62A', color:'#F4A62A' }} />
          <span style={{ fontFamily:'"Space Mono", monospace', fontSize:10, fontWeight:700, color:'#3D2B00' }}>{dest.rating}</span>
        </div>
      </div>
      <div style={{ padding:'20px 22px 22px', background:'#FFF8F0', borderTop:`3px solid ${dest.accent}` }}>
        <h3 style={{ fontFamily:'"Bebas Neue", sans-serif', fontSize:28, letterSpacing:'0.04em', color:'#2C1A0E', margin:'0 0 4px', lineHeight:1 }}>{dest.name}</h3>
        <p style={{ fontFamily:'"Space Mono", monospace', fontSize:9, letterSpacing:'0.15em', textTransform:'uppercase', color:'rgba(44,26,14,0.45)', margin:'0 0 14px' }}>{dest.tag}</p>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <span style={{ fontFamily:'"Space Mono", monospace', fontSize:9, color:dest.accent, letterSpacing:'0.1em' }}>{dest.tours} tours available</span>
          <motion.div animate={{ x:hover?4:0 }} transition={{ duration:0.25 }}><FiArrowRight size={15} color={dest.accent} /></motion.div>
        </div>
      </div>
    </motion.div>
  )
}

// ─── HOW IT WORKS SECTION ─────────────────────────────────────────────────────
function HowItWorksSection() {
  const [active, setActive] = useState(0)
  const cur = HOW_IT_WORKS[active]

  return (
    <section style={{ position:'relative', zIndex:1, background:'#0A0705', overflow:'hidden' }}>
      {/* Top tricolour */}
      <div style={{ height:3, display:'flex' }}>
        <div style={{ flex:1, background:'#FF9933' }} /><div style={{ flex:1, background:'rgba(255,255,255,0.4)' }} /><div style={{ flex:1, background:'#138808' }} />
      </div>

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'100px clamp(24px,6vw,80px)' }}>
        {/* Header */}
        <div style={{ marginBottom:72, display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:24 }}>
          <div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:10, marginBottom:16 }}>
              <div style={{ width:28, height:1, background:'rgba(244,166,42,0.6)' }} />
              <span style={{ fontFamily:'"Space Mono", monospace', fontSize:9, letterSpacing:'0.45em', textTransform:'uppercase', color:'rgba(244,166,42,0.65)' }}>The Pavilion Way</span>
            </div>
            <h2 style={{ fontFamily:'"Bebas Neue", sans-serif', fontSize:'clamp(3rem,6vw,7rem)', letterSpacing:'0.02em', lineHeight:0.88, color:'#FFF8F0', margin:0 }}>
              HOW PAVILION<br /><span style={{ color:'#F4A62A' }}>WORKS</span>
            </h2>
          </div>
          <p style={{ fontFamily:'"Crimson Text", serif', fontStyle:'italic', fontSize:18, color:'rgba(255,248,240,0.4)', maxWidth:380, lineHeight:1.7, margin:0 }}>
            Three principles built into every single tour we offer — from a 3-day ghat walk to a 21-day Himalayan circuit.
          </p>
        </div>

        {/* Step tabs */}
        <div style={{ display:'flex', gap:3, marginBottom:0 }}>
          {HOW_IT_WORKS.map((step, i) => (
            <button key={step.step} onClick={() => setActive(i)}
              style={{ flex:1, padding:'16px 20px', textAlign:'left', background: active===i ? 'rgba(255,255,255,0.05)' : 'transparent', border:'none', borderTop:`2px solid ${active===i ? step.color : 'rgba(255,255,255,0.08)'}`, cursor:'pointer', transition:'all 0.3s' }}>
              <p style={{ fontFamily:'"Space Mono", monospace', fontSize:8, letterSpacing:'0.3em', color: active===i ? step.color : 'rgba(255,248,240,0.25)', margin:'0 0 6px', textTransform:'uppercase', transition:'color 0.3s' }}>{step.step}</p>
              <p style={{ fontFamily:'"Bebas Neue", sans-serif', fontSize:26, letterSpacing:'0.05em', color: active===i ? '#FFF8F0' : 'rgba(255,248,240,0.35)', margin:0, lineHeight:1, transition:'color 0.3s' }}>{step.title}</p>
            </button>
          ))}
        </div>

        {/* Active content panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-16 }}
            transition={{ duration:0.5, ease:[0.22,1,0.36,1] }}
            style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:0, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderTop:'none' }}
          >
            {/* Left: text */}
            <div style={{ padding:'52px 52px 52px 40px', display:'flex', flexDirection:'column', justifyContent:'center' }}>
              <span style={{ fontSize:40, display:'block', marginBottom:20 }}>{cur.icon}</span>
              <h3 style={{ fontFamily:'"Bebas Neue", sans-serif', fontSize:'clamp(2rem,3.5vw,3.2rem)', letterSpacing:'0.03em', lineHeight:0.95, color:'#FFF8F0', marginBottom:16 }}>{cur.headline}</h3>
              <p style={{ fontFamily:'"Crimson Text", serif', fontStyle:'italic', fontSize:18, color:'rgba(255,248,240,0.5)', lineHeight:1.75, marginBottom:32 }}>{cur.body}</p>
              <Link to={cur.link} style={{ display:'inline-flex', alignItems:'center', gap:9, fontFamily:'"Space Mono", monospace', fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:cur.color, textDecoration:'none', fontWeight:700, transition:'gap 0.25s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.gap='14px'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.gap='9px'}>
                {cur.linkLabel} <FiArrowRight size={12} />
              </Link>
            </div>
            {/* Right: image */}
            <div style={{ position:'relative', overflow:'hidden', minHeight:360 }}>
              <div style={{ position:'absolute', inset:0, backgroundImage:`url(${cur.image})`, backgroundSize:'cover', backgroundPosition:'center', filter:'brightness(0.55) saturate(0.7)', transition:'all 0.6s ease' }} />
              <div style={{ position:'absolute', inset:0, background:`linear-gradient(to right, rgba(10,7,5,0.6) 0%, transparent 60%)` }} />
              {/* Step number watermark */}
              <div style={{ position:'absolute', bottom:24, right:28, fontFamily:'"Bebas Neue", sans-serif', fontSize:120, letterSpacing:'0.02em', color:`${cur.color}18`, lineHeight:1, userSelect:'none', pointerEvents:'none' }}>{cur.step}</div>
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
  const peakThisMonth  = activeMonth !== null ? SEASON_DATA.filter(r => r.months[activeMonth] === 1).map(r => r.region) : []
  const goodThisMonth  = activeMonth !== null ? SEASON_DATA.filter(r => r.months[activeMonth] === 2).map(r => r.region) : []

  return (
    <section style={{ position:'relative', zIndex:1, padding:'96px clamp(24px,6vw,100px)', background:'#FFF8F0' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <div style={{ marginBottom:56 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:10, marginBottom:16 }}>
            <span style={{ fontSize:20 }}>🗓️</span>
            <span style={{ fontFamily:'"Space Mono", monospace', fontSize:9, letterSpacing:'0.4em', textTransform:'uppercase', color:'#FF6B35' }}>Plan Your Trip</span>
          </div>
          <h2 style={{ fontFamily:'"Bebas Neue", sans-serif', fontSize:'clamp(3rem,6vw,6.5rem)', letterSpacing:'0.02em', lineHeight:0.9, color:'#2C1A0E', margin:0 }}>
            BEST TIME TO<br /><span style={{ color:'#FF6B35' }}>VISIT INDIA</span>
          </h2>
          <div style={{ display:'flex', height:4, width:160, borderRadius:2, overflow:'hidden', marginTop:18 }}>
            <div style={{ flex:1, background:'#FF9933' }} /><div style={{ flex:1, background:'#F4A62A' }} /><div style={{ flex:1, background:'#1A6B5A' }} />
          </div>
          <p style={{ fontFamily:'"Crimson Text", serif', fontStyle:'italic', fontSize:18, color:'rgba(44,26,14,0.55)', marginTop:16, maxWidth:520, lineHeight:1.7 }}>
            India's vast geography means every month is perfect somewhere. Click a month to find out where.
          </p>
        </div>

        {/* Month buttons */}
        <div style={{ display:'flex', gap:6, marginBottom:32, flexWrap:'wrap' }}>
          {MONTHS.map((m, i) => {
            const isActive = activeMonth === i
            const peakCount = SEASON_DATA.filter(r => r.months[i] === 1).length
            return (
              <motion.button key={m} onClick={() => setActiveMonth(isActive ? null : i)} whileHover={{ y:-2 }} whileTap={{ scale:0.96 }}
                style={{ position:'relative', padding:'10px 16px', borderRadius:2, fontFamily:'"Space Mono", monospace', fontSize:10, letterSpacing:'0.15em', background:isActive?'#FF6B35':'#FFF0E0', border:`1px solid ${isActive?'#FF6B35':'rgba(44,26,14,0.12)'}`, color:isActive?'#fff':'#4A3520', cursor:'pointer', transition:'all 0.2s', fontWeight:isActive?700:400, boxShadow:isActive?'0 4px 16px rgba(255,107,53,0.3)':'none' }}>
                {m}
                {peakCount > 0 && <span style={{ position:'absolute', top:-5, right:-5, width:14, height:14, background:'#1A6B5A', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'"Space Mono", monospace', fontSize:7, color:'#fff', fontWeight:700 }}>{peakCount}</span>}
              </motion.button>
            )
          })}
          {activeMonth !== null && <motion.button initial={{ opacity:0 }} animate={{ opacity:1 }} onClick={() => setActiveMonth(null)} style={{ padding:'10px 14px', borderRadius:2, fontFamily:'"Space Mono", monospace', fontSize:9, background:'transparent', border:'1px solid rgba(44,26,14,0.15)', color:'rgba(44,26,14,0.4)', cursor:'pointer', letterSpacing:'0.1em' }}>Clear ✕</motion.button>}
        </div>

        {/* Highlight bar */}
        <AnimatePresence>
          {activeMonth !== null && (
            <motion.div key={activeMonth} initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
              style={{ marginBottom:28, padding:'16px 20px', background:'rgba(255,107,53,0.06)', border:'1px solid rgba(255,107,53,0.2)', borderRadius:4, display:'flex', gap:32, flexWrap:'wrap', alignItems:'center' }}>
              <div>
                <p style={{ fontFamily:'"Space Mono", monospace', fontSize:8, letterSpacing:'0.25em', textTransform:'uppercase', color:'rgba(44,26,14,0.4)', margin:'0 0 4px' }}>Peak season in {MONTHS[activeMonth]}</p>
                <p style={{ fontFamily:'"Bebas Neue", sans-serif', fontSize:22, color:'#1A6B5A', margin:0, letterSpacing:'0.04em' }}>{peakThisMonth.length > 0 ? peakThisMonth.join(' · ') : 'No peak regions'}</p>
              </div>
              {goodThisMonth.length > 0 && <div>
                <p style={{ fontFamily:'"Space Mono", monospace', fontSize:8, letterSpacing:'0.25em', textTransform:'uppercase', color:'rgba(44,26,14,0.4)', margin:'0 0 4px' }}>Also good in {MONTHS[activeMonth]}</p>
                <p style={{ fontFamily:'"Bebas Neue", sans-serif', fontSize:18, color:'#F4A62A', margin:0, letterSpacing:'0.04em' }}>{goodThisMonth.join(' · ')}</p>
              </div>}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid table */}
        <div style={{ overflowX:'auto', marginBottom:40 }}>
          <table style={{ width:'100%', borderCollapse:'collapse', minWidth:700 }}>
            <thead>
              <tr>
                <th style={{ fontFamily:'"Space Mono", monospace', fontSize:8, letterSpacing:'0.15em', textTransform:'uppercase', color:'rgba(44,26,14,0.4)', textAlign:'left', padding:'0 12px 16px 0', fontWeight:400, whiteSpace:'nowrap', width:200 }}>Region</th>
                {MONTHS.map((m, i) => (
                  <th key={m} style={{ fontFamily:'"Space Mono", monospace', fontSize:9, letterSpacing:'0.08em', color:activeMonth===i?'#FF6B35':'rgba(44,26,14,0.5)', padding:'0 0 16px', textAlign:'center', fontWeight:activeMonth===i?700:400, cursor:'pointer', transition:'color 0.2s', width:42 }}
                    onClick={() => setActiveMonth(activeMonth===i?null:i)}>{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SEASON_DATA.map(row => (
                <tr key={row.region} style={{ borderTop:'1px solid rgba(44,26,14,0.06)' }}>
                  <td style={{ padding:'10px 12px 10px 0' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <span style={{ fontSize:16 }}>{row.icon}</span>
                      <p style={{ fontFamily:'"Space Mono", monospace', fontSize:9, letterSpacing:'0.08em', color:'#2C1A0E', margin:0 }}>{row.region}</p>
                    </div>
                  </td>
                  {row.months.map((rating, mi) => {
                    const sc = SEASON_COLORS[rating as keyof typeof SEASON_COLORS]
                    return (
                      <td key={mi} style={{ padding:'10px 2px', textAlign:'center' }}>
                        <motion.div whileHover={{ scale:1.15 }} style={{ width:28, height:28, borderRadius:3, margin:'0 auto', background:sc.bg, border:activeMonth===mi?'2px solid rgba(44,26,14,0.3)':'2px solid transparent', transition:'border 0.2s' }} title={`${row.region} in ${MONTHS[mi]}: ${sc.label}`} />
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div style={{ display:'flex', gap:20, alignItems:'center', flexWrap:'wrap', marginBottom:40 }}>
          <span style={{ fontFamily:'"Space Mono", monospace', fontSize:8, letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(44,26,14,0.35)' }}>Legend:</span>
          {Object.entries(SEASON_COLORS).map(([k, v]) => (
            <div key={k} style={{ display:'flex', alignItems:'center', gap:7 }}>
              <div style={{ width:16, height:16, borderRadius:3, background:v.bg, border:'1px solid rgba(44,26,14,0.1)' }} />
              <span style={{ fontFamily:'"Space Mono", monospace', fontSize:9, color:'rgba(44,26,14,0.55)', letterSpacing:'0.1em' }}>{v.label}</span>
            </div>
          ))}
        </div>

        {/* Region tip cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:16 }}>
          {SEASON_DATA.map((row, i) => (
            <motion.div key={row.region} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.07 }}
              style={{ padding:'18px 20px', background:'#FFF0E0', border:'1px solid rgba(44,26,14,0.08)', borderLeft:`3px solid ${row.color}`, borderRadius:4 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                <span style={{ fontSize:18 }}>{row.icon}</span>
                <p style={{ fontFamily:'"Bebas Neue", sans-serif', fontSize:17, letterSpacing:'0.04em', color:'#2C1A0E', margin:0 }}>{row.region}</p>
              </div>
              <p style={{ fontFamily:'"Crimson Text", serif', fontStyle:'italic', fontSize:14, color:'rgba(44,26,14,0.6)', lineHeight:1.6, margin:0 }}>{row.tip}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const featured = MOCK_TOURS.filter((t: any) => t.isFeatured).slice(0, 3)

  return (
    <div style={{ minHeight:'100vh', background:'#FFF8F0', color:'#2C1A0E', fontFamily:'"Crimson Text", Georgia, serif', overflowX:'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { overflow-x: hidden; background: #FFF8F0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #FFF8F0; }
        ::-webkit-scrollbar-thumb { background: rgba(255,107,53,0.35); border-radius: 2px; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes spinSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes tickerScroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .tour-card { transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s; }
        .tour-card:hover { transform: translateY(-8px); box-shadow: 0 20px 50px rgba(0,0,0,0.12); }
      `}</style>

      <FloralCanvas />

      {/* ── HERO ── */}
      <HeroSection />

      {/* ── STATS BAND ── */}
      <section style={{ position:'relative', zIndex:1, background:'#FF6B35', padding:'36px clamp(24px,6vw,100px)' }}>
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:3, display:'flex' }}>
          <div style={{ flex:1, background:'#FF9933' }} /><div style={{ flex:1, background:'rgba(255,255,255,0.6)' }} /><div style={{ flex:1, background:'#138808' }} />
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20, maxWidth:900, margin:'0 auto', textAlign:'center' }}>
          {STATS.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.08 }}>
              <p style={{ fontFamily:'"Bebas Neue", sans-serif', fontSize:54, letterSpacing:'0.02em', color:'#FFF8F0', lineHeight:1, margin:'0 0 5px' }}>
                <Counter end={s.end} suffix={s.suffix} isDecimal={s.isDecimal} />
              </p>
              <p style={{ fontFamily:'"Space Mono", monospace', fontSize:9, letterSpacing:'0.25em', textTransform:'uppercase', color:'rgba(255,248,240,0.65)', margin:0 }}>{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS (replaces map) ── */}
      <HowItWorksSection />

      {/* ── FEATURED DESTINATIONS ── */}
      <section style={{ position:'relative', zIndex:1, padding:'96px clamp(24px,6vw,100px)', background:'#FFF8F0' }}>
        <div style={{ marginBottom:56, maxWidth:620 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:10, marginBottom:16 }}>
            <GiLotusFlower style={{ color:'#FF6B35', fontSize:18 }} />
            <span style={{ fontFamily:'"Space Mono", monospace', fontSize:9, letterSpacing:'0.4em', textTransform:'uppercase', color:'#FF6B35' }}>Where We Take You</span>
          </div>
          <h2 style={{ fontFamily:'"Bebas Neue", sans-serif', fontSize:'clamp(3rem,6vw,6.5rem)', letterSpacing:'0.02em', lineHeight:0.9, color:'#2C1A0E', margin:0 }}>
            INDIA'S FINEST<br /><span style={{ color:'#FF6B35' }}>DESTINATIONS</span>
          </h2>
          <div style={{ display:'flex', height:4, width:160, borderRadius:2, overflow:'hidden', marginTop:18 }}>
            <div style={{ flex:1, background:'#FF9933' }} /><div style={{ flex:1, background:'#F4A62A' }} /><div style={{ flex:1, background:'#1A6B5A' }} />
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:20, marginBottom:44 }}>
          {INDIA_DESTINATIONS.map((d, i) => <DestCard key={d.name} dest={d} index={i} />)}
        </div>
        <div style={{ textAlign:'center' }}>
          <Link to="/destinations" style={{ display:'inline-flex', alignItems:'center', gap:10, border:'2px solid #1A6B5A', color:'#1A6B5A', fontFamily:'"Space Mono", monospace', fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', fontWeight:700, padding:'14px 32px', borderRadius:2, textDecoration:'none', transition:'background 0.25s, color 0.25s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background='#1A6B5A'; (e.currentTarget as HTMLElement).style.color='#FFF8F0' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background='transparent'; (e.currentTarget as HTMLElement).style.color='#1A6B5A' }}>
            View All Destinations <FiArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── FEATURED TOURS ── */}
      <section style={{ position:'relative', zIndex:1, padding:'0 clamp(24px,6vw,100px) 96px', background:'#FFF8F0', borderTop:'1px solid rgba(255,107,53,0.1)' }}>
        <div style={{ paddingTop:80, display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:44, flexWrap:'wrap', gap:20 }}>
          <div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:10, marginBottom:14 }}>
              <GiCompass style={{ color:'#F4A62A', fontSize:18 }} />
              <span style={{ fontFamily:'"Space Mono", monospace', fontSize:9, letterSpacing:'0.4em', textTransform:'uppercase', color:'#F4A62A' }}>Handpicked for You</span>
            </div>
            <h2 style={{ fontFamily:'"Bebas Neue", sans-serif', fontSize:'clamp(2.8rem,5vw,5.5rem)', letterSpacing:'0.02em', lineHeight:0.9, color:'#2C1A0E', margin:0 }}>
              FEATURED<br /><span style={{ color:'#F4A62A' }}>TOURS</span>
            </h2>
          </div>
          <Link to="/tours" style={{ display:'flex', alignItems:'center', gap:8, border:'1px solid rgba(244,166,42,0.4)', padding:'10px 20px', borderRadius:2, textDecoration:'none', fontFamily:'"Space Mono", monospace', fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:'#F4A62A', transition:'background 0.2s' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background='rgba(244,166,42,0.08)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background='transparent')}>
            All Tours <FiArrowRight size={11} />
          </Link>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))', gap:20 }}>
          {featured.map((t: any, i: number) => (
            <motion.div key={t._id} initial={{ opacity:0, y:36 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.1 }} className="tour-card">
              <Link to={`/tours/${t.slug}`} style={{ display:'block', textDecoration:'none', background:'#FFF8F0', border:'1px solid rgba(44,26,14,0.1)', borderRadius:4, overflow:'hidden' }}>
                <div style={{ position:'relative', height:220, overflow:'hidden' }}>
                  <div style={{ position:'absolute', inset:0, backgroundImage:`url(${t.coverImage})`, backgroundSize:'cover', backgroundPosition:'center', transition:'transform 0.7s ease' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform='scale(1.07)')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform='scale(1)')} />
                  <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(44,26,14,0.85) 0%, transparent 55%)' }} />
                  <div style={{ position:'absolute', top:12, left:12, background:'#FF6B35', borderRadius:2, padding:'3px 10px', fontFamily:'"Space Mono", monospace', fontSize:8, letterSpacing:'0.2em', color:'#fff', textTransform:'uppercase' }}>{t.difficulty}</div>
                  <div style={{ position:'absolute', top:12, right:12, background:'rgba(255,248,240,0.92)', borderRadius:100, padding:'3px 9px', display:'flex', alignItems:'center', gap:4 }}>
                    <FiStar size={9} style={{ fill:'#F4A62A', color:'#F4A62A' }} />
                    <span style={{ fontFamily:'"Space Mono", monospace', fontSize:9, color:'#2C1A0E', fontWeight:700 }}>{t.rating}</span>
                  </div>
                </div>
                <div style={{ padding:'18px 20px 20px' }}>
                  <p style={{ fontFamily:'"Space Mono", monospace', fontSize:8, letterSpacing:'0.2em', textTransform:'uppercase', color:'#FF6B35', margin:'0 0 5px' }}>{t.destination?.name}</p>
                  <h3 style={{ fontFamily:'"Bebas Neue", sans-serif', fontSize:26, letterSpacing:'0.04em', color:'#2C1A0E', margin:'0 0 8px', lineHeight:1 }}>{t.title}</h3>
                  <p style={{ fontFamily:'"Crimson Text", serif', fontStyle:'italic', fontSize:14, color:'rgba(44,26,14,0.55)', lineHeight:1.55, margin:'0 0 14px' }}>{(t.summary||'').substring(0,80)}…</p>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', borderTop:'1px solid rgba(44,26,14,0.08)', paddingTop:12 }}>
                    <div style={{ display:'flex', gap:14 }}>
                      <span style={{ display:'flex', alignItems:'center', gap:5, fontFamily:'"Space Mono", monospace', fontSize:9, color:'rgba(44,26,14,0.45)' }}><FiClock size={10} color="#FF6B35" /> {t.duration}D</span>
                      <span style={{ display:'flex', alignItems:'center', gap:5, fontFamily:'"Space Mono", monospace', fontSize:9, color:'rgba(44,26,14,0.45)' }}><FiUsers size={10} color="#FF6B35" /> Max {t.groupSize?.max}</span>
                    </div>
                    <span style={{ fontFamily:'"Space Mono", monospace', fontSize:12, fontWeight:700, color:'#1A6B5A' }}>FROM ${(t.discountPrice??t.price)?.toLocaleString()}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── WHY PAVILION ── */}
      <section style={{ position:'relative', zIndex:1, padding:'96px clamp(24px,6vw,100px)', background:'#1A6B5A', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:4, display:'flex' }}>
          <div style={{ flex:1, background:'#FF9933' }} /><div style={{ flex:1, background:'rgba(255,255,255,0.5)' }} /><div style={{ flex:1, background:'#138808' }} />
        </div>
        <div style={{ position:'absolute', right:-100, top:'50%', transform:'translateY(-50%)', width:500, height:500, borderRadius:'50%', border:'1px solid rgba(255,255,255,0.05)', animation:'spinSlow 120s linear infinite', pointerEvents:'none' }} />
        <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:72, alignItems:'center', position:'relative', zIndex:1 }}>
          <div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:10, marginBottom:20 }}>
              <div style={{ width:28, height:2, background:'#F4A62A', borderRadius:2 }} />
              <span style={{ fontFamily:'"Space Mono", monospace', fontSize:9, letterSpacing:'0.4em', textTransform:'uppercase', color:'rgba(255,248,240,0.55)' }}>What Sets Us Apart</span>
            </div>
            <h2 style={{ fontFamily:'"Bebas Neue", sans-serif', fontSize:'clamp(3rem,5.5vw,6rem)', letterSpacing:'0.02em', lineHeight:0.92, color:'#FFF8F0', marginBottom:22 }}>
              TRAVEL THAT<br /><span style={{ color:'#F4A62A' }}>TRANSFORMS</span>
            </h2>
            <p style={{ fontFamily:'"Crimson Text", serif', fontStyle:'italic', fontSize:20, color:'rgba(255,248,240,0.6)', lineHeight:1.75, marginBottom:36, maxWidth:420 }}>
              Every journey we design is built to leave you changed — immersed in real India, guided by the people who call it home.
            </p>
            <Link to="/about" style={{ display:'inline-flex', alignItems:'center', gap:10, background:'#F4A62A', color:'#2C1A0E', fontFamily:'"Space Mono", monospace', fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', fontWeight:700, padding:'14px 28px', borderRadius:2, textDecoration:'none', boxShadow:'0 8px 28px rgba(244,166,42,0.3)' }}>
              Our Story <FiArrowRight size={13} />
            </Link>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {WHY_ITEMS.map((item, i) => (
              <motion.div key={item.title} initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.1 }}
                style={{ background:'rgba(255,248,240,0.06)', border:'1px solid rgba(255,248,240,0.1)', borderRadius:4, padding:'24px 20px', transition:'background 0.25s' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background='rgba(255,248,240,0.1)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background='rgba(255,248,240,0.06)')}>
                <span style={{ fontSize:26, display:'block', marginBottom:12 }}>{item.icon}</span>
                <h4 style={{ fontFamily:'"Bebas Neue", sans-serif', fontSize:22, letterSpacing:'0.04em', color:'#FFF8F0', margin:'0 0 8px', lineHeight:1 }}>{item.title}</h4>
                <p style={{ fontFamily:'"Crimson Text", serif', fontStyle:'italic', fontSize:14, color:'rgba(255,248,240,0.5)', lineHeight:1.65, margin:0 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BEST TIME TO VISIT ── */}
      <BestTimeSection />

      {/* ── TICKER ── */}
      <div style={{ borderTop:'1px solid rgba(44,26,14,0.08)', borderBottom:'1px solid rgba(44,26,14,0.08)', background:'#FFF0E0', padding:'12px 0', overflow:'hidden', position:'relative', zIndex:1 }}>
        <div style={{ display:'flex', animation:'tickerScroll 40s linear infinite', width:'max-content' }}>
          {[...INDIA_DESTINATIONS, ...INDIA_DESTINATIONS].map((d, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:8, padding:'0 28px', borderRight:'1px solid rgba(44,26,14,0.08)', whiteSpace:'nowrap' }}>
              <div style={{ width:5, height:5, borderRadius:'50%', background:d.accent, flexShrink:0 }} />
              <span style={{ fontFamily:'"Space Mono", monospace', fontSize:10, color:'#4A3520', letterSpacing:'0.08em' }}>{d.name}</span>
              <span style={{ fontFamily:'"Space Mono", monospace', fontSize:8, letterSpacing:'0.15em', textTransform:'uppercase', color:'rgba(44,26,14,0.3)' }}>{d.tag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── FINAL CTA — intent-driven ── */}
      <section style={{ position:'relative', zIndex:1, padding:'100px clamp(24px,6vw,100px)', overflow:'hidden', background:'#0A0705' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:"url('https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1600&q=80')", backgroundSize:'cover', backgroundPosition:'center', opacity:0.1 }} />
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 50% 50%, rgba(244,166,42,0.06) 0%, transparent 70%)' }} />
        <div style={{ position:'absolute', top:0, left:0, right:0, height:3, display:'flex' }}>
          <div style={{ flex:1, background:'#FF9933' }} /><div style={{ flex:1, background:'rgba(255,255,255,0.5)' }} /><div style={{ flex:1, background:'#138808' }} />
        </div>

        <div style={{ position:'relative', zIndex:1, maxWidth:800, margin:'0 auto' }}>
          {/* Two-column intent statement */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'center', marginBottom:72 }}>
            <div>
              <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
                <p style={{ fontFamily:'"Space Mono", monospace', fontSize:9, letterSpacing:'0.45em', textTransform:'uppercase', color:'rgba(244,166,42,0.6)', marginBottom:16 }}>Why Pavilion exists</p>
                <h2 style={{ fontFamily:'"Bebas Neue", sans-serif', fontSize:'clamp(2.8rem,5vw,5.5rem)', letterSpacing:'0.02em', lineHeight:0.9, color:'#FFF8F0', marginBottom:0 }}>
                  INDIA DESERVES<br /><span style={{ color:'#F4A62A' }}>BETTER TRAVEL.</span>
                </h2>
              </motion.div>
            </div>
            <div>
              <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:0.15 }}>
                <p style={{ fontFamily:'"Crimson Text", serif', fontStyle:'italic', fontSize:19, color:'rgba(255,248,240,0.5)', lineHeight:1.8, margin:'0 0 24px' }}>
                  Most platforms sell India like a checklist. Pavilion was built to do the opposite — to connect curious people with guides who've spent their whole lives in a single valley, a single city, a single tradition.
                </p>
                <p style={{ fontFamily:'"Crimson Text", serif', fontStyle:'italic', fontSize:17, color:'rgba(255,248,240,0.3)', lineHeight:1.75, margin:0 }}>
                  That's the only way India reveals itself. Slowly. Personally. Unforgettably.
                </p>
              </motion.div>
            </div>
          </div>

          {/* CTAs */}
          <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:0.25 }}
            style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap', paddingTop:48, borderTop:'1px solid rgba(255,255,255,0.06)' }}>
            <Link to="/destinations" style={{ background:'#FF6B35', color:'#fff', fontFamily:'"Space Mono", monospace', fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', fontWeight:700, padding:'15px 36px', borderRadius:2, textDecoration:'none', boxShadow:'0 8px 28px rgba(255,107,53,0.35)', display:'inline-flex', alignItems:'center', gap:10 }}>
              Start Exploring <FiArrowRight size={13} />
            </Link>
            <Link to="/contact" style={{ border:'1px solid rgba(255,248,240,0.2)', color:'rgba(255,248,240,0.6)', fontFamily:'"Space Mono", monospace', fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', padding:'15px 36px', borderRadius:2, textDecoration:'none', display:'inline-flex', alignItems:'center', gap:10, backdropFilter:'blur(8px)', transition:'border-color 0.25s, color 0.25s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor='rgba(244,166,42,0.4)'; (e.currentTarget as HTMLElement).style.color='#F4A62A' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor='rgba(255,248,240,0.2)'; (e.currentTarget as HTMLElement).style.color='rgba(255,248,240,0.6)' }}>
              Plan a Custom Trip
            </Link>
          </motion.div>
        </div>

        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:3, display:'flex' }}>
          <div style={{ flex:1, background:'#FF9933' }} /><div style={{ flex:1, background:'rgba(255,255,255,0.5)' }} /><div style={{ flex:1, background:'#138808' }} />
        </div>
      </section>
    </div>
  )
}