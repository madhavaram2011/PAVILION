import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle, FiArrowRight } from 'react-icons/fi'
import { GiCompass } from 'react-icons/gi'
import { useAuthStore } from '../store/authStore'
import api from '../services/api'
import toast from 'react-hot-toast'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
type FormData = z.infer<typeof schema>

/* ── Airplane Cursor ─────────────────────────────────────────────────────── */
function AirplaneCursor() {
  const planeRef = useRef<HTMLDivElement>(null)
  const trailRefs = useRef<(HTMLDivElement | null)[]>([])
  const pos = useRef({ x: 0, y: 0 })
  const actual = useRef({ x: 0, y: 0 })
  const prevPos = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>(0)
  const [visible, setVisible] = useState(false)
  const TRAIL = 10
  useEffect(() => {
    const move = (e: MouseEvent) => { pos.current = { x: e.clientX, y: e.clientY }; setVisible(true) }
    const leave = () => setVisible(false)
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseleave', leave)
    const animate = () => {
      actual.current.x += (pos.current.x - actual.current.x) * 0.14
      actual.current.y += (pos.current.y - actual.current.y) * 0.14
      const angle = Math.atan2(pos.current.y - prevPos.current.y, pos.current.x - prevPos.current.x) * (180 / Math.PI)
      prevPos.current = { ...actual.current }
      if (planeRef.current) {
        planeRef.current.style.left = actual.current.x + 'px'
        planeRef.current.style.top = actual.current.y + 'px'
        planeRef.current.style.transform = `translate(-50%,-50%) rotate(${angle + 45}deg)`
      }
      trailRefs.current.forEach((el, i) => {
        if (!el) return
        const lag = (i + 1) * 0.055
        el.style.left = (pos.current.x + (actual.current.x - pos.current.x) * lag) + 'px'
        el.style.top = (pos.current.y + (actual.current.y - pos.current.y) * lag) + 'px'
        el.style.opacity = String((1 - i / TRAIL) * 0.35)
        const sz = `${4.5 - i * 0.38}px`
        el.style.width = sz; el.style.height = sz
      })
      rafRef.current = requestAnimationFrame(animate)
    }
    animate()
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseleave', leave); cancelAnimationFrame(rafRef.current) }
  }, [])
  if (!visible) return null
  return (
    <>
      {Array.from({ length: TRAIL }).map((_, i) => (
        <div key={i} ref={el => { trailRefs.current[i] = el }}
          style={{ position: 'fixed', borderRadius: '50%', background: '#f97316', pointerEvents: 'none', zIndex: 9997, transform: 'translate(-50%,-50%)', transition: 'width 0.1s, height 0.1s' }} />
      ))}
      <div ref={planeRef} style={{ position: 'fixed', pointerEvents: 'none', zIndex: 9999, width: 30, height: 30 }}>
        <svg viewBox="0 0 24 24" fill="none" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 0 10px rgba(249,115,22,1))' }}>
          <path d="M21 3L3 10.5L10 13L13 21L21 3Z" fill="#f97316" stroke="#fff" strokeWidth="0.7" strokeLinejoin="round" />
        </svg>
      </div>
    </>
  )
}

/* ── Star Canvas ─────────────────────────────────────────────────────────── */
function StarCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return
    const ctx = canvas.getContext('2d')!; let raf: number
    const stars = Array.from({ length: 240 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.4 + 0.2,
      a: Math.random(), speed: Math.random() * 0.003 + 0.001,
    }))
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize(); window.addEventListener('resize', resize)
    let t = 0
    const draw = () => {
      t += 0.006; ctx.clearRect(0, 0, canvas.width, canvas.height)
      stars.forEach(s => {
        const f = s.a * (0.4 + 0.6 * Math.abs(Math.sin(t * s.speed + s.a * 8)))
        ctx.beginPath(); ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${f})`; ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />
}

/* ── India Destinations Carousel ─────────────────────────────────────────── */
const SLIDES = [
  { name: 'Taj Mahal', region: 'Agra, UP', tag: 'HERITAGE', img: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=80', color: '#f59e0b' },
  { name: 'Pangong Lake', region: 'Ladakh', tag: 'ADVENTURE', img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80', color: '#38bdf8' },
  { name: 'Kerala Backwaters', region: 'God\'s Own Country', tag: 'SERENE', img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80', color: '#34d399' },
  { name: 'Hawa Mahal', region: 'Jaipur, Rajasthan', tag: 'ROYAL', img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&q=80', color: '#f97316' },
  { name: 'Varanasi Ghats', region: 'Uttar Pradesh', tag: 'SACRED', img: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&q=80', color: '#a78bfa' },
]

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)
  const [activeSlide, setActiveSlide] = useState(0)
  const [slideProgress, setSlideProgress] = useState(0)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) })

  // Auto-advance slides
  useEffect(() => {
    const dur = 4500; const step = 50; let elapsed = 0
    const t = setInterval(() => {
      elapsed += step
      setSlideProgress((elapsed / dur) * 100)
      if (elapsed >= dur) { setActiveSlide(s => (s + 1) % SLIDES.length); elapsed = 0; setSlideProgress(0) }
    }, step)
    return () => clearInterval(t)
  }, [activeSlide])

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const res = await api.post<{ accessToken: string; data: { user: any } }>('/auth/login', {
        email: data.email,
        password: data.password,
      })
      const { accessToken, data: { user } } = res.data
      setAuth(user, accessToken)
      toast.success(`Welcome back, ${user.name}! 🇮🇳`)
      // Redirect back to the page they came from (e.g. /booking/...) or home
      const from = (location.state as any)?.from || '/'
      navigate(from, { replace: true })
    } catch (err: any) {
      toast.error(err.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  const slide = SLIDES[activeSlide]

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', fontFamily: '"Crimson Text",Georgia,serif', cursor: 'none', background: '#06040f' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
        *,*::before,*::after { box-sizing:border-box; cursor:none!important; }
        ::-webkit-scrollbar { width:3px; }
        ::-webkit-scrollbar-track { background:#06040f; }
        ::-webkit-scrollbar-thumb { background:rgba(249,115,22,0.4); border-radius:2px; }
        @keyframes spinSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes spinSlowR { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.15)} }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        .li { width:100%; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); outline:none; padding:14px 14px 14px 48px; font-family:"Space Mono",monospace; font-size:11px; letter-spacing:0.08em; color:#fff; border-radius:2px; transition:border-color 0.3s,background 0.3s,box-shadow 0.3s; }
        .li::placeholder { color:rgba(255,255,255,0.18); }
        .li:focus { border-color:rgba(249,115,22,0.6); background:rgba(249,115,22,0.04); box-shadow:0 0 0 3px rgba(249,115,22,0.08); }
        .li.err { border-color:rgba(239,68,68,0.5); }
        .li:focus.err { box-shadow:0 0 0 3px rgba(239,68,68,0.08); }
      `}</style>

      <AirplaneCursor />

      {/* ── LEFT — Visual Panel ─────────────────────────────────────────────── */}
      <div style={{ position: 'relative', overflow: 'hidden', background: '#04060e' }}>
        <StarCanvas />

        {/* Nebula glow */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(249,115,22,0.07) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 1 }} />

        {/* Orbit rings */}
        {[340, 480, 620].map((s, i) => (
          <div key={i} style={{
            position: 'absolute', width: s, height: s, top: '50%', left: '50%',
            borderRadius: '50%', border: `1px solid rgba(249,115,22,${0.04 - i * 0.01})`,
            transform: 'translate(-50%,-50%)',
            animation: i % 2 === 0 ? `spinSlow ${80 + i * 30}s linear infinite` : `spinSlowR ${90 + i * 25}s linear infinite`,
            pointerEvents: 'none', zIndex: 1,
          }} />
        ))}

        {/* Main globe */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Globe */}
          <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }} style={{ position: 'relative', marginBottom: 40 }}>
            {/* Glow ring */}
            <div style={{ position: 'absolute', inset: -30, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)', filter: 'blur(20px)' }} />

            <motion.div animate={{ rotate: 360 }} transition={{ duration: 160, repeat: Infinity, ease: 'linear' }}
              style={{ width: 260, height: 260, borderRadius: '50%', overflow: 'hidden', boxShadow: 'inset -60px -20px 100px rgba(0,0,0,0.95), 0 0 80px rgba(249,115,22,0.12)', position: 'relative' }}>
              <img src="https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=700&q=90" alt="Earth" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.12)' }} />
              {/* Scan line */}
              <motion.div style={{ position: 'absolute', left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,transparent,rgba(249,115,22,0.5),transparent)' }}
                animate={{ top: ['0%', '100%', '0%'] }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} />
            </motion.div>

            {/* Counter-rotating ring */}
            <motion.div animate={{ rotate: -360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              style={{ position: 'absolute', width: 330, height: 330, top: '50%', left: '50%', transform: 'translate(-50%,-50%) rotateX(68deg)', border: '1px dashed rgba(249,115,22,0.15)', borderRadius: '50%', pointerEvents: 'none' }} />

            {/* Floating stat badges */}
            {[
              { text: '28+ States', sub: 'Covered', color: '#f97316', x: -145, y: -40 },
              { text: '4.9 ★', sub: 'Rating', color: '#fbbf24', x: 110, y: 20 },
              { text: '500+ Tours', sub: 'Curated', color: '#34d399', x: -120, y: 95 },
            ].map((b, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1, y: [0, -8 + i * 2, 0] }}
                transition={{ opacity: { delay: 1.2 + i * 0.25 }, scale: { delay: 1.2 + i * 0.25, type: 'spring', stiffness: 200 }, y: { duration: 3.5 + i * 0.7, repeat: Infinity, ease: 'easeInOut', delay: i * 0.9 } }}
                style={{ position: 'absolute', top: '50%', left: '50%', transform: `translate(calc(-50% + ${b.x}px), calc(-50% + ${b.y}px))`, background: 'rgba(6,4,15,0.92)', border: `1px solid ${b.color}25`, borderRadius: 4, padding: '9px 16px', backdropFilter: 'blur(16px)', zIndex: 20 }}>
                <p style={{ fontFamily: '"Space Mono",monospace', fontSize: 11, fontWeight: 700, color: b.color, margin: 0, letterSpacing: '0.06em' }}>{b.text}</p>
                <p style={{ fontFamily: '"Space Mono",monospace', fontSize: 7, letterSpacing: '0.28em', textTransform: 'uppercase', color: b.color + '55', margin: '2px 0 0' }}>{b.sub}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Destination strip */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6 }}
            style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
            {SLIDES.map((s, i) => (
              <motion.button key={i} onClick={() => { setActiveSlide(i); setSlideProgress(0) }}
                animate={{ width: i === activeSlide ? 76 : 44, opacity: i === activeSlide ? 1 : 0.4 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{ height: 46, borderRadius: 2, overflow: 'hidden', position: 'relative', cursor: 'none', border: i === activeSlide ? `1px solid ${s.color}70` : '1px solid rgba(255,255,255,0.08)', padding: 0, background: 'none', flexShrink: 0 }}>
                <img src={s.img} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {i === activeSlide && (
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.15)' }}>
                    <motion.div style={{ height: '100%', background: slide.color, width: `${slideProgress}%` }} />
                  </div>
                )}
              </motion.button>
            ))}
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div key={activeSlide} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }}
              style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: '"Space Mono",monospace', fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: slide.color, margin: '0 0 3px' }}>{slide.name}</p>
              <p style={{ fontFamily: '"Space Mono",monospace', fontSize: 7, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', margin: 0 }}>{slide.region} · {slide.tag}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom quote */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
          style={{ position: 'absolute', bottom: 40, left: 44, right: 44, zIndex: 10 }}>
          <div style={{ width: 32, height: 1, background: 'rgba(249,115,22,0.3)', marginBottom: 14 }} />
          <p style={{ fontFamily: '"Crimson Text",serif', fontStyle: 'italic', fontSize: 15, color: 'rgba(255,255,255,0.4)', lineHeight: 1.65, margin: '0 0 8px' }}>
            "India is not a country. It is a universe — and every corner of it deserves to be discovered."
          </p>
          <p style={{ fontFamily: '"Space Mono",monospace', fontSize: 7, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)', margin: 0 }}>— Pavilion</p>
        </motion.div>

        {/* India flag strip top */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, display: 'flex', zIndex: 20 }}>
          <div style={{ flex: 1, background: '#FF9933' }} />
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.65)' }} />
          <div style={{ flex: 1, background: '#138808' }} />
        </div>
      </div>

      {/* ── RIGHT — Form Panel ──────────────────────────────────────────────── */}
      <div style={{ background: '#06040f', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 28px', position: 'relative', overflow: 'hidden' }}>
        {/* Subtle corner glow */}
        <div style={{ position: 'absolute', width: 500, height: 500, top: -150, right: -150, borderRadius: '50%', background: 'radial-gradient(circle,rgba(249,115,22,0.07),transparent)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 400, height: 400, bottom: -100, left: -100, borderRadius: '50%', background: 'radial-gradient(circle,rgba(56,189,248,0.04),transparent)', filter: 'blur(80px)', pointerEvents: 'none' }} />

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 10 }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none', marginBottom: 52 }}>
            <motion.div whileHover={{ rotate: 25 }} transition={{ type: 'spring', stiffness: 260 }}
              style={{ width: 44, height: 44, borderRadius: '50%', border: '1px solid rgba(249,115,22,0.35)', background: 'rgba(249,115,22,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GiCompass style={{ color: '#f97316', fontSize: 24 }} />
            </motion.div>
            <div>
              <p style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 24, letterSpacing: '0.18em', color: '#fff', lineHeight: 1, margin: 0 }}>PAVILION</p>
              <p style={{ fontFamily: '"Space Mono",monospace', fontSize: 7, letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgba(249,115,22,0.55)', margin: '3px 0 0' }}>Discover Incredible India</p>
            </div>
          </Link>

          {/* Heading */}
          <div style={{ marginBottom: 36 }}>
            <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 56, letterSpacing: '0.04em', color: '#fff', marginBottom: 6, lineHeight: 0.95 }}>
              WELCOME<br /><span style={{ color: '#f97316' }}>BACK</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
              style={{ fontFamily: '"Crimson Text",serif', fontStyle: 'italic', fontSize: 16, color: 'rgba(255,255,255,0.38)', margin: 0 }}>
              Sign in to continue your India journey
            </motion.p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Email */}
            <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <label style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.28em', textTransform: 'uppercase', color: focused === 'email' ? '#f97316' : 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: 7, marginBottom: 9, transition: 'color 0.3s' }}>
                <FiMail size={10} /> Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <FiMail size={14} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: focused === 'email' ? '#f97316' : 'rgba(255,255,255,0.2)', transition: 'color 0.3s', pointerEvents: 'none' }} />
                <input {...register('email')} type="email" placeholder="your@email.com"
                  className={`li${errors.email ? ' err' : ''}`}
                  onFocus={() => setFocused('email')} onBlur={() => setFocused(null)} />
              </div>
              <AnimatePresence>
                {errors.email && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#ef4444', fontFamily: '"Space Mono",monospace', fontSize: 9, marginTop: 6 }}>
                    <FiAlertCircle size={10} />{errors.email.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Password */}
            <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 9 }}>
                <label style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.28em', textTransform: 'uppercase', color: focused === 'password' ? '#f97316' : 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: 7, transition: 'color 0.3s' }}>
                  <FiLock size={10} /> Password
                </label>
                <Link to="#" style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.1em', color: 'rgba(249,115,22,0.6)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#f97316'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(249,115,22,0.6)'}>
                  Forgot?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <FiLock size={14} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: focused === 'password' ? '#f97316' : 'rgba(255,255,255,0.2)', transition: 'color 0.3s', pointerEvents: 'none' }} />
                <input {...register('password')} type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                  className={`li${errors.password ? ' err' : ''}`} style={{ paddingRight: 48 }}
                  onFocus={() => setFocused('password')} onBlur={() => setFocused(null)} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.28)', cursor: 'none', padding: 4, transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#f97316'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.28)'}>
                  {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#ef4444', fontFamily: '"Space Mono",monospace', fontSize: 9, marginTop: 6 }}>
                    <FiAlertCircle size={10} />{errors.password.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Submit */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <motion.button type="submit" disabled={loading}
                whileHover={!loading ? { y: -3, boxShadow: '0 16px 48px rgba(249,115,22,0.45)' } : {}}
                whileTap={!loading ? { scale: 0.97 } : {}}
                style={{ width: '100%', background: loading ? 'rgba(249,115,22,0.4)' : 'linear-gradient(135deg,#f97316,#ea580c)', border: 'none', borderRadius: 2, padding: '16px', fontFamily: '"Space Mono",monospace', fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 700, color: '#fff', cursor: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, boxShadow: loading ? 'none' : '0 8px 32px rgba(249,115,22,0.35)', transition: 'all 0.3s' }}>
                <AnimatePresence mode="wait">
                  {loading
                    ? <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spinSlow 0.8s linear infinite' }} />
                      Signing in...
                    </motion.div>
                    : <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      Sign In <FiArrowRight size={14} />
                    </motion.div>
                  }
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </form>

          {/* Divider */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '28px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
            <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.1em' }}>OR</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
          </motion.div>

          {/* Register link */}
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}
            style={{ textAlign: 'center', fontFamily: '"Crimson Text",serif', fontSize: 16, color: 'rgba(255,255,255,0.42)', margin: '0 0 32px' }}>
            New to Pavilion?{' '}
            <Link to="/register" style={{ color: '#f97316', fontWeight: 600, textDecoration: 'none', fontStyle: 'italic' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.textDecoration = 'underline'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.textDecoration = 'none'}>
              Create your account
            </Link>
          </motion.p>

          {/* Trust strip */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}
            style={{ display: 'flex', justifyContent: 'center', gap: 28, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            {['🔒 Secure', '🌍 28+ States', '★ 4.9 Rated'].map(b => (
              <span key={b} style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.18)' }}>{b}</span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}