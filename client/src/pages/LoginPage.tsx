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

/* ── Star Canvas ─────────────────────────────────────────────────────────── */
function StarCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return
    const ctx = canvas.getContext('2d')!; let raf: number
    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.1 + 0.2,
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
        ctx.fillStyle = `rgba(240,235,224,${f})`; ctx.fill()
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
  { name: 'Pangong Lake', region: 'Ladakh', tag: 'ADVENTURE', img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80', color: '#14b8a6' },
  { name: 'Kerala Backwaters', region: "God's Own Country", tag: 'SERENE', img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80', color: '#34d399' },
  { name: 'Hawa Mahal', region: 'Jaipur, Rajasthan', tag: 'ROYAL', img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&q=80', color: '#f97316' },
  { name: 'Varanasi Ghats', region: 'Uttar Pradesh', tag: 'SACRED', img: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&q=80', color: '#a78bfa' },
]

/* ── Geometric India Poster Panel ────────────────────────────────────────── */
function IndiaPosterPanel({ activeSlide, slideProgress, setActiveSlide, setSlideProgress }: {
  activeSlide: number
  slideProgress: number
  setActiveSlide: (i: number) => void
  setSlideProgress: (n: number) => void
}) {
  const slide = SLIDES[activeSlide]

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#0a0f1e', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '0 0 40px' }}>
      <StarCanvas />

      {/* India flag strip */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, display: 'flex', zIndex: 20 }}>
        <div style={{ flex: 1, background: '#FF9933' }} />
        <div style={{ flex: 1, background: 'rgba(240,235,224,0.7)' }} />
        <div style={{ flex: 1, background: '#138808' }} />
      </div>

      {/* Grid lines */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }} xmlns="http://www.w3.org/2000/svg">
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={`v${i}`} x1={`${(i + 1) * 12.5}%`} y1="0" x2={`${(i + 1) * 12.5}%`} y2="100%" stroke="rgba(20,184,166,0.07)" strokeWidth="1" />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={`${(i + 1) * 10}%`} x2="100%" y2={`${(i + 1) * 10}%`} stroke="rgba(20,184,166,0.07)" strokeWidth="1" />
        ))}
        {/* Diagonal accent */}
        <line x1="0" y1="100%" x2="100%" y2="0" stroke="rgba(20,184,166,0.05)" strokeWidth="1" />
      </svg>

      {/* Teal corner accent — geometric bracket */}
      <svg style={{ position: 'absolute', top: 16, left: 16, zIndex: 5, pointerEvents: 'none' }} width="48" height="48" viewBox="0 0 48 48">
        <path d="M2 46 L2 2 L46 2" stroke="#14b8a6" strokeWidth="2" fill="none" strokeLinecap="square" />
      </svg>
      <svg style={{ position: 'absolute', bottom: 16, right: 16, zIndex: 5, pointerEvents: 'none' }} width="48" height="48" viewBox="0 0 48 48">
        <path d="M46 2 L46 46 L2 46" stroke="#14b8a6" strokeWidth="2" fill="none" strokeLinecap="square" />
      </svg>

      {/* Main poster typography block */}
      <div style={{ position: 'relative', zIndex: 10, padding: '64px 44px 0', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ fontFamily: '"Space Mono", monospace', fontSize: 8, letterSpacing: '0.42em', textTransform: 'uppercase', color: '#14b8a6', marginBottom: 22 }}>
          ◈ Discover India
        </motion.p>

        {/* Giant stacked destination names */}
        <div style={{ overflow: 'hidden', marginBottom: 28 }}>
          {['RAJASTHAN', 'KERALA', 'LADAKH', 'VARANASI'].map((name, i) => (
            <motion.p
              key={name}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: '"Bebas Neue", sans-serif',
                fontSize: 'clamp(2.6rem, 5vw, 4.2rem)',
                letterSpacing: '0.06em',
                lineHeight: 1.0,
                margin: 0,
                color: i === 0 ? '#f0ebe0' : i === 1 ? 'rgba(240,235,224,0.45)' : i === 2 ? 'rgba(240,235,224,0.22)' : 'rgba(240,235,224,0.1)',
                WebkitTextStroke: i > 0 ? '1px rgba(20,184,166,0.15)' : undefined,
              }}>
              {name}
            </motion.p>
          ))}
        </div>

        {/* Teal divider bar */}
        <motion.div
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.8, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: 2, background: 'linear-gradient(90deg, #14b8a6, transparent)', width: '60%', transformOrigin: 'left', marginBottom: 24 }}
        />

        {/* Stat row */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          style={{ display: 'flex', gap: 28, marginBottom: 36 }}>
          {[
            { val: '28+', label: 'States' },
            { val: '500+', label: 'Tours' },
            { val: '4.9★', label: 'Rating' },
          ].map(s => (
            <div key={s.label}>
              <p style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 28, letterSpacing: '0.06em', color: '#14b8a6', margin: 0, lineHeight: 1 }}>{s.val}</p>
              <p style={{ fontFamily: '"Space Mono", monospace', fontSize: 7, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(240,235,224,0.28)', margin: '4px 0 0' }}>{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Destination thumbnail strip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
          style={{ display: 'flex', gap: 6 }}>
          {SLIDES.map((s, i) => (
            <motion.button
              key={i}
              onClick={() => { setActiveSlide(i); setSlideProgress(0) }}
              animate={{ width: i === activeSlide ? 80 : 46, opacity: i === activeSlide ? 1 : 0.38 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{
                height: 48, borderRadius: 2, overflow: 'hidden', position: 'relative',
                border: i === activeSlide ? `1px solid ${s.color}80` : '1px solid rgba(255,255,255,0.06)',
                padding: 0, background: 'none', flexShrink: 0, cursor: 'pointer',
              }}>
              <img src={s.img} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {i === activeSlide && (
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.1)' }}>
                  <div style={{ height: '100%', background: slide.color, width: `${slideProgress}%`, transition: 'width 0.05s linear' }} />
                </div>
              )}
            </motion.button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div key={activeSlide} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.25 }}
            style={{ marginTop: 10 }}>
            <p style={{ fontFamily: '"Space Mono", monospace', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: slide.color, margin: '0 0 2px' }}>{slide.name}</p>
            <p style={{ fontFamily: '"Space Mono", monospace', fontSize: 7, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(240,235,224,0.2)', margin: 0 }}>{slide.region} · {slide.tag}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom quote */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
        style={{ position: 'relative', zIndex: 10, padding: '0 44px' }}>
        <div style={{ width: 28, height: 1, background: 'rgba(20,184,166,0.4)', marginBottom: 12 }} />
        <p style={{ fontFamily: '"Crimson Text", serif', fontStyle: 'italic', fontSize: 14, color: 'rgba(240,235,224,0.35)', lineHeight: 1.65, margin: '0 0 6px', maxWidth: 320 }}>
          "Every corner of India is a world unto itself — and it's all waiting for you."
        </p>
        <p style={{ fontFamily: '"Space Mono", monospace', fontSize: 7, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(240,235,224,0.16)', margin: 0 }}>— Pavilion</p>
      </motion.div>
    </div>
  )
}

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
      const from = (location.state as any)?.from || '/'
      navigate(from, { replace: true })
    } catch (err: any) {
      toast.error(err.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', fontFamily: '"Crimson Text",Georgia,serif', background: '#06040f' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { cursor: default; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #06040f; }
        ::-webkit-scrollbar-thumb { background: rgba(20,184,166,0.4); border-radius: 2px; }
        @keyframes spinSlow { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        .li {
          width: 100%; background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08); outline: none;
          padding: 14px 14px 14px 48px;
          font-family: "Space Mono", monospace; font-size: 11px;
          letter-spacing: 0.08em; color: #fff; border-radius: 2px;
          transition: border-color 0.3s, background 0.3s, box-shadow 0.3s;
          cursor: text;
        }
        .li::placeholder { color: rgba(255,255,255,0.18); }
        .li:focus { border-color: rgba(20,184,166,0.6); background: rgba(20,184,166,0.04); box-shadow: 0 0 0 3px rgba(20,184,166,0.08); }
        .li.err { border-color: rgba(239,68,68,0.5); }
        .li:focus.err { box-shadow: 0 0 0 3px rgba(239,68,68,0.08); }
        button { cursor: pointer; }
        input[type="checkbox"] { cursor: pointer; }
        @media (max-width: 768px) {
          .login-grid { grid-template-columns: 1fr !important; }
          .login-visual { display: none !important; }
        }
      `}</style>

      {/* ── LEFT — Geometric India Poster ──────────────────────────────────── */}
      <div className="login-visual" style={{ position: 'relative', overflow: 'hidden' }}>
        <IndiaPosterPanel
          activeSlide={activeSlide}
          slideProgress={slideProgress}
          setActiveSlide={setActiveSlide}
          setSlideProgress={setSlideProgress}
        />
      </div>

      {/* ── RIGHT — Form Panel ──────────────────────────────────────────────── */}
      <div style={{ background: '#06040f', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 28px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, top: -150, right: -150, borderRadius: '50%', background: 'radial-gradient(circle,rgba(20,184,166,0.07),transparent)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 400, height: 400, bottom: -100, left: -100, borderRadius: '50%', background: 'radial-gradient(circle,rgba(249,115,22,0.04),transparent)', filter: 'blur(80px)', pointerEvents: 'none' }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 10 }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none', marginBottom: 52 }}>
            <motion.div
              whileHover={{ rotate: 25 }} transition={{ type: 'spring', stiffness: 260 }}
              style={{ width: 44, height: 44, borderRadius: '50%', border: '1px solid rgba(20,184,166,0.4)', background: 'rgba(20,184,166,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <GiCompass style={{ color: '#14b8a6', fontSize: 24 }} />
            </motion.div>
            <div>
              <p style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 24, letterSpacing: '0.18em', color: '#f0ebe0', lineHeight: 1, margin: 0 }}>PAVILION</p>
              <p style={{ fontFamily: '"Space Mono",monospace', fontSize: 7, letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgba(20,184,166,0.6)', margin: '3px 0 0' }}>Discover Incredible India</p>
            </div>
          </Link>

          {/* Heading */}
          <div style={{ marginBottom: 36 }}>
            <motion.h1
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 56, letterSpacing: '0.04em', color: '#f0ebe0', marginBottom: 6, lineHeight: 0.95 }}>
              WELCOME<br /><span style={{ color: '#14b8a6' }}>BACK</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
              style={{ fontFamily: '"Crimson Text",serif', fontStyle: 'italic', fontSize: 16, color: 'rgba(240,235,224,0.38)', margin: 0 }}>
              Sign in to continue your India journey
            </motion.p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Email */}
            <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <label style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.28em', textTransform: 'uppercase', color: focused === 'email' ? '#14b8a6' : 'rgba(240,235,224,0.3)', display: 'flex', alignItems: 'center', gap: 7, marginBottom: 9, transition: 'color 0.3s' }}>
                <FiMail size={10} /> Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <FiMail size={14} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: focused === 'email' ? '#14b8a6' : 'rgba(255,255,255,0.2)', transition: 'color 0.3s', pointerEvents: 'none' }} />
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
                <label style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.28em', textTransform: 'uppercase', color: focused === 'password' ? '#14b8a6' : 'rgba(240,235,224,0.3)', display: 'flex', alignItems: 'center', gap: 7, transition: 'color 0.3s' }}>
                  <FiLock size={10} /> Password
                </label>
                <Link to="#" style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.1em', color: 'rgba(20,184,166,0.6)', textDecoration: 'none', transition: 'color 0.2s', cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#14b8a6'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(20,184,166,0.6)'}>
                  Forgot?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <FiLock size={14} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: focused === 'password' ? '#14b8a6' : 'rgba(255,255,255,0.2)', transition: 'color 0.3s', pointerEvents: 'none' }} />
                <input {...register('password')} type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                  className={`li${errors.password ? ' err' : ''}`} style={{ paddingRight: 48 }}
                  onFocus={() => setFocused('password')} onBlur={() => setFocused(null)} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.28)', cursor: 'pointer', padding: 4, transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#14b8a6'}
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
                whileHover={!loading ? { y: -3, boxShadow: '0 16px 48px rgba(20,184,166,0.4)' } : {}}
                whileTap={!loading ? { scale: 0.97 } : {}}
                style={{ width: '100%', background: loading ? 'rgba(20,184,166,0.4)' : 'linear-gradient(135deg,#14b8a6,#0d9488)', border: 'none', borderRadius: 2, padding: '16px', fontFamily: '"Space Mono",monospace', fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 700, color: '#fff', cursor: loading ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, boxShadow: loading ? 'none' : '0 8px 32px rgba(20,184,166,0.3)', transition: 'all 0.3s' }}>
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
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '28px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
            <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, color: 'rgba(240,235,224,0.18)', letterSpacing: '0.1em' }}>OR</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
          </motion.div>

          {/* Register link */}
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}
            style={{ textAlign: 'center', fontFamily: '"Crimson Text",serif', fontSize: 16, color: 'rgba(240,235,224,0.42)', margin: '0 0 32px' }}>
            New to Pavilion?{' '}
            <Link to="/register" style={{ color: '#14b8a6', fontWeight: 600, textDecoration: 'none', fontStyle: 'italic' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.textDecoration = 'underline'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.textDecoration = 'none'}>
              Create your account
            </Link>
          </motion.p>

          {/* Trust strip */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}
            style={{ display: 'flex', justifyContent: 'center', gap: 28, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            {['🔒 Secure', '🌍 28+ States', '★ 4.9 Rated'].map(b => (
              <span key={b} style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.1em', color: 'rgba(240,235,224,0.18)' }}>{b}</span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}