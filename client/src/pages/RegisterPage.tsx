import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle, FiCheck, FiArrowRight } from 'react-icons/fi'
import { GiCompass } from 'react-icons/gi'
import { useAuthStore } from '../store/authStore'
import api from '../services/api'
import toast from 'react-hot-toast'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm: z.string(),
}).refine(d => d.password === d.confirm, { message: 'Passwords do not match', path: ['confirm'] })
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
    window.addEventListener('mousemove', move); window.addEventListener('mouseleave', leave)
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
        const sz = `${4.5 - i * 0.38}px`; el.style.width = sz; el.style.height = sz
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
          style={{ position: 'fixed', borderRadius: '50%', background: '#f97316', pointerEvents: 'none', zIndex: 9997, transform: 'translate(-50%,-50%)' }} />
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
    const stars = Array.from({ length: 200 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.3 + 0.2, a: Math.random(), speed: Math.random() * 0.003 + 0.001 }))
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize(); window.addEventListener('resize', resize)
    let t = 0
    const draw = () => {
      t += 0.005; ctx.clearRect(0, 0, canvas.width, canvas.height)
      stars.forEach(s => { const f = s.a * (0.4 + 0.6 * Math.abs(Math.sin(t * s.speed + s.a * 8))); ctx.beginPath(); ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(255,255,255,${f})`; ctx.fill() })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />
}

/* ── Indian Guide Character (Register variant — namaste pose) ─────────────── */
function WelcomeGuide() {
  return (
    <svg viewBox="0 0 200 340" style={{ width: 190, position: 'relative', zIndex: 10 }} fill="none">
      {/* Sherwani body */}
      <rect x="58" y="136" width="84" height="152" rx="10" fill="#1d3a1f" />
      <path d="M86 136 L100 158 L114 136" fill="#142c16" />
      <path d="M100 136 L100 175" stroke="#c9a96e" strokeWidth="1.8" strokeDasharray="4 3" />
      {[150, 165, 180, 195, 210].map((y, i) => (
        <g key={i}><circle cx="100" cy={y} r="2.8" fill="#c9a96e" /><circle cx="100" cy={y} r="1.3" fill="#f0ebe0" /></g>
      ))}
      <path d="M84 142 Q100 136 116 142" stroke="#c9a96e" strokeWidth="2.2" fill="none" />
      {/* Namaste hands (both arms folded at chest) */}
      <path d="M58 148 Q44 158 42 175 Q40 188 48 192" stroke="#142c16" strokeWidth="13" strokeLinecap="round" fill="none" />
      <path d="M142 148 Q156 158 158 175 Q160 188 152 192" stroke="#142c16" strokeWidth="13" strokeLinecap="round" fill="none" />
      {/* Left hand */}
      <ellipse cx="48" cy="196" rx="9" ry="12" fill="#c8956c" />
      {/* Right hand */}
      <ellipse cx="152" cy="196" rx="9" ry="12" fill="#c8956c" />
      {/* Joined hands */}
      <path d="M62 178 Q100 165 138 178" stroke="#c9a96e" strokeWidth="1.2" fill="none" opacity="0.4" />
      {/* Legs */}
      <path d="M66 280 L70 340 L88 340 L100 318 L112 340 L130 340 L134 280Z" fill="#142c16" />
      {/* Neck */}
      <rect x="94" y="108" width="12" height="30" rx="6" fill="#c8956c" />
      {/* Head */}
      <ellipse cx="100" cy="88" rx="30" ry="33" fill="#c8956c" />
      {/* Hair */}
      <path d="M71 78 Q73 55 100 53 Q127 55 129 78 Q123 60 100 58 Q77 60 71 78Z" fill="#1a0800" />
      {/* Turban */}
      <ellipse cx="100" cy="60" rx="34" ry="16" fill="#c9a96e" />
      <ellipse cx="100" cy="57" rx="28" ry="12" fill="#e8c47a" />
      <path d="M67 65 Q70 46 100 44 Q130 46 133 65" fill="#c9a96e" />
      <path d="M69 62 Q100 54 131 62" stroke="rgba(201,169,110,0.35)" strokeWidth="1.5" fill="none" />
      <path d="M70 67 Q100 59 130 67" stroke="rgba(201,169,110,0.35)" strokeWidth="1.5" fill="none" />
      {/* Turban jewel */}
      <circle cx="100" cy="48" r="5" fill="#ff9933" />
      <circle cx="100" cy="48" r="2.5" fill="#fff" />
      {/* Eyes */}
      <ellipse cx="90" cy="87" rx="4.5" ry="5.2" fill="#1a0800" />
      <ellipse cx="110" cy="87" rx="4.5" ry="5.2" fill="#1a0800" />
      <circle cx="91.5" cy="85.5" r="1.7" fill="white" />
      <circle cx="111.5" cy="85.5" r="1.7" fill="white" />
      {/* Warm closed-eye smile (joyful namaste) */}
      <path d="M86 102 Q100 114 114 102" stroke="#8b4513" strokeWidth="2.3" strokeLinecap="round" fill="none" />
      {/* Cheeks */}
      <ellipse cx="83" cy="99" rx="7" ry="4" fill="rgba(255,150,100,0.2)" />
      <ellipse cx="117" cy="99" rx="7" ry="4" fill="rgba(255,150,100,0.2)" />
      {/* Nose */}
      <path d="M97 93 Q95 98 97 101 Q100 103 103 101 Q105 98 103 93" stroke="#a0704a" strokeWidth="1.1" fill="none" />
      {/* Bindi */}
      <circle cx="100" cy="73" r="3.5" fill="#dc2626" />
      <circle cx="100" cy="73" r="1.6" fill="#ff6b6b" />
      {/* Dupatta */}
      <path d="M62 140 Q46 162 30 200 Q22 225 36 238" stroke="#c9a96e" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.85" />
    </svg>
  )
}

/* ── Password strength ────────────────────────────────────────────────────── */
const strengthMeta = [
  { label: '', color: '' },
  { label: 'Too short', color: '#ef4444' },
  { label: 'Fair', color: '#f59e0b' },
  { label: 'Good', color: '#22c55e' },
  { label: 'Strong 🔒', color: '#10b981' },
]

/* ── India destination snippets for the right panel ─────────────────────── */
const INDIA_HIGHLIGHTS = [
  { icon: '🏔️', place: 'Ladakh', desc: 'Moonscapes & azure lakes' },
  { icon: '🌊', place: 'Andaman', desc: 'Pristine coral shores' },
  { icon: '🕌', place: 'Hampi', desc: 'Ancient empire ruins' },
  { icon: '🌿', place: 'Meghalaya', desc: 'Living root bridges' },
  { icon: '🏖️', place: 'Goa', desc: 'Sun-soaked coastlines' },
]

export default function RegisterPage() {
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)
  const [, setStep] = useState(0) // form reveal steps
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) })

  const pw = watch('password', '')
  const name = watch('name', '')
  const email = watch('email', '')
  const strength = pw.length === 0 ? 0 : pw.length < 6 ? 1 : pw.length < 10 ? 2 : /[A-Z]/.test(pw) && /[0-9]/.test(pw) ? 4 : 3

  useEffect(() => { const t = setTimeout(() => setStep(1), 200); return () => clearTimeout(t) }, [])

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const res = await api.post<{ accessToken: string; data: { user: any } }>('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
      })
      const body = res.data
      const accessToken = body.accessToken
      const user = body.data?.user
      setAuth(user, accessToken)
      toast.success(`Welcome to Pavilion, ${user.name}! 🇮🇳`)
      navigate('/')
    } catch (err: any) {
      toast.error(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

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
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .ri { width:100%; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); outline:none; padding:13px 13px 13px 46px; font-family:"Space Mono",monospace; font-size:11px; letter-spacing:0.08em; color:#fff; border-radius:2px; transition:border-color 0.3s,background 0.3s,box-shadow 0.3s; }
        .ri::placeholder { color:rgba(255,255,255,0.17); }
        .ri:focus { border-color:rgba(249,115,22,0.6); background:rgba(249,115,22,0.04); box-shadow:0 0 0 3px rgba(249,115,22,0.08); }
        .ri.err { border-color:rgba(239,68,68,0.5); }
      `}</style>

      <AirplaneCursor />

      {/* ── LEFT — Form ────────────────────────────────────────────────────── */}
      <div style={{ background: '#06040f', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 28px', overflowY: 'auto', position: 'relative' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, top: -160, left: -160, borderRadius: '50%', background: 'radial-gradient(circle,rgba(249,115,22,0.06),transparent)', filter: 'blur(90px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 400, height: 400, bottom: -100, right: -80, borderRadius: '50%', background: 'radial-gradient(circle,rgba(167,139,250,0.05),transparent)', filter: 'blur(80px)', pointerEvents: 'none' }} />

        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 10 }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none', marginBottom: 40 }}>
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
          <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
            style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 52, letterSpacing: '0.04em', color: '#fff', marginBottom: 6, lineHeight: 0.95 }}>
            START YOUR<br /><span style={{ color: '#f97316' }}>JOURNEY</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 }}
            style={{ fontFamily: '"Crimson Text",serif', fontStyle: 'italic', fontSize: 15, color: 'rgba(255,255,255,0.36)', margin: '0 0 30px' }}>
            Create your Pavilion account — it's free
          </motion.p>

          {/* Step progress */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            style={{ display: 'flex', gap: 6, marginBottom: 28, alignItems: 'center' }}>
            {[name.length >= 2, email.includes('@'), pw.length >= 8].map((done, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', border: `1px solid ${done ? '#f97316' : 'rgba(255,255,255,0.12)'}`, background: done ? 'rgba(249,115,22,0.15)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
                  {done
                    ? <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><FiCheck size={10} color="#f97316" /></motion.div>
                    : <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, color: 'rgba(255,255,255,0.3)' }}>{i + 1}</span>}
                </div>
                {i < 2 && <div style={{ width: 24, height: 1, background: done ? 'rgba(249,115,22,0.4)' : 'rgba(255,255,255,0.07)', transition: 'background 0.4s' }} />}
              </div>
            ))}
            <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 7, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.2)', marginLeft: 8 }}>PROGRESS</span>
          </motion.div>

          {/* Form fields */}
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 17 }}>

            {/* Name */}
            <motion.div initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
              <label style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.26em', textTransform: 'uppercase', color: focused === 'name' ? '#f97316' : 'rgba(255,255,255,0.28)', display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8, transition: 'color 0.3s' }}>
                <FiUser size={10} /> Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <FiUser size={13} style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: focused === 'name' ? '#f97316' : 'rgba(255,255,255,0.2)', transition: 'color 0.3s', pointerEvents: 'none' }} />
                <input {...register('name')} type="text" placeholder="Priya Sharma"
                  className={`ri${errors.name ? ' err' : ''}`}
                  onFocus={() => setFocused('name')} onBlur={() => setFocused(null)} />
                <AnimatePresence>
                  {name.length >= 2 && !errors.name && (
                    <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0 }}
                      style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)' }}>
                      <FiCheck size={14} color="#22c55e" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <AnimatePresence>
                {errors.name && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#ef4444', fontFamily: '"Space Mono",monospace', fontSize: 9, marginTop: 6 }}>
                  <FiAlertCircle size={10} />{errors.name.message}</motion.p>}
              </AnimatePresence>
            </motion.div>

            {/* Email */}
            <motion.div initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.43 }}>
              <label style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.26em', textTransform: 'uppercase', color: focused === 'email' ? '#f97316' : 'rgba(255,255,255,0.28)', display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8, transition: 'color 0.3s' }}>
                <FiMail size={10} /> Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <FiMail size={13} style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: focused === 'email' ? '#f97316' : 'rgba(255,255,255,0.2)', transition: 'color 0.3s', pointerEvents: 'none' }} />
                <input {...register('email')} type="email" placeholder="your@email.com"
                  className={`ri${errors.email ? ' err' : ''}`}
                  onFocus={() => setFocused('email')} onBlur={() => setFocused(null)} />
              </div>
              <AnimatePresence>
                {errors.email && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#ef4444', fontFamily: '"Space Mono",monospace', fontSize: 9, marginTop: 6 }}>
                  <FiAlertCircle size={10} />{errors.email.message}</motion.p>}
              </AnimatePresence>
            </motion.div>

            {/* Password */}
            <motion.div initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.51 }}>
              <label style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.26em', textTransform: 'uppercase', color: focused === 'password' ? '#f97316' : 'rgba(255,255,255,0.28)', display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8, transition: 'color 0.3s' }}>
                <FiLock size={10} /> Password
              </label>
              <div style={{ position: 'relative' }}>
                <FiLock size={13} style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: focused === 'password' ? '#f97316' : 'rgba(255,255,255,0.2)', transition: 'color 0.3s', pointerEvents: 'none' }} />
                <input {...register('password')} type={showPw ? 'text' : 'password'} placeholder="Min. 8 characters"
                  className={`ri${errors.password ? ' err' : ''}`} style={{ paddingRight: 46 }}
                  onFocus={() => setFocused('password')} onBlur={() => setFocused(null)} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.26)', cursor: 'none', padding: 4, transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#f97316'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.26)'}>
                  {showPw ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>

              {/* Strength bar */}
              <AnimatePresence>
                {pw.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ marginTop: 8 }}>
                    <div style={{ display: 'flex', gap: 4, marginBottom: 5 }}>
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} style={{ height: 3, flex: 1, borderRadius: 2, background: i <= strength ? strengthMeta[strength].color : 'rgba(255,255,255,0.07)', transition: 'background 0.4s' }} />
                      ))}
                    </div>
                    <p style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, color: strengthMeta[strength].color, letterSpacing: '0.1em', margin: 0 }}>{strengthMeta[strength].label}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {errors.password && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#ef4444', fontFamily: '"Space Mono",monospace', fontSize: 9, marginTop: 6 }}>
                  <FiAlertCircle size={10} />{errors.password.message}</motion.p>}
              </AnimatePresence>
            </motion.div>

            {/* Confirm Password */}
            <motion.div initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.59 }}>
              <label style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.26em', textTransform: 'uppercase', color: focused === 'confirm' ? '#f97316' : 'rgba(255,255,255,0.28)', display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8, transition: 'color 0.3s' }}>
                <FiLock size={10} /> Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <FiLock size={13} style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: focused === 'confirm' ? '#f97316' : 'rgba(255,255,255,0.2)', transition: 'color 0.3s', pointerEvents: 'none' }} />
                <input {...register('confirm')} type={showConfirm ? 'text' : 'password'} placeholder="Repeat password"
                  className={`ri${errors.confirm ? ' err' : ''}`} style={{ paddingRight: 46 }}
                  onFocus={() => setFocused('confirm')} onBlur={() => setFocused(null)} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.26)', cursor: 'none', padding: 4, transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#f97316'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.26)'}>
                  {showConfirm ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>
              <AnimatePresence>
                {errors.confirm && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#ef4444', fontFamily: '"Space Mono",monospace', fontSize: 9, marginTop: 6 }}>
                  <FiAlertCircle size={10} />{errors.confirm.message}</motion.p>}
              </AnimatePresence>
            </motion.div>

            {/* Submit */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.68 }}>
              <motion.button type="submit" disabled={loading}
                whileHover={!loading ? { y: -3, boxShadow: '0 16px 48px rgba(249,115,22,0.45)' } : {}}
                whileTap={!loading ? { scale: 0.97 } : {}}
                style={{ width: '100%', background: loading ? 'rgba(249,115,22,0.4)' : 'linear-gradient(135deg,#f97316,#ea580c)', border: 'none', borderRadius: 2, padding: '16px', fontFamily: '"Space Mono",monospace', fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 700, color: '#fff', cursor: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, boxShadow: loading ? 'none' : '0 8px 32px rgba(249,115,22,0.35)', transition: 'all 0.3s', marginTop: 4 }}>
                <AnimatePresence mode="wait">
                  {loading
                    ? <motion.div key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spinSlow 0.8s linear infinite' }} />
                      Creating Account...
                    </motion.div>
                    : <motion.div key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      Create Account <FiArrowRight size={14} />
                    </motion.div>
                  }
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </form>

          {/* Legal & login link */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} style={{ marginTop: 20, textAlign: 'center' }}>
            <p style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.06em', lineHeight: 1.7, margin: '0 0 14px' }}>
              By creating an account you agree to our{' '}
              <Link to="#" style={{ color: 'rgba(249,115,22,0.6)', textDecoration: 'none' }}>Terms</Link>
              {' '}&amp;{' '}
              <Link to="#" style={{ color: 'rgba(249,115,22,0.6)', textDecoration: 'none' }}>Privacy Policy</Link>
            </p>
            <p style={{ fontFamily: '"Crimson Text",serif', fontSize: 16, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#f97316', fontWeight: 600, textDecoration: 'none', fontStyle: 'italic' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.textDecoration = 'underline'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.textDecoration = 'none'}>
                Sign in
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* ── RIGHT — Visual Panel ─────────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(160deg,#06040f 0%,#080a18 50%,#06100a 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 44px', position: 'relative', overflow: 'hidden' }}>
        <StarCanvas />

        {/* Nebula glow */}
        <div style={{ position: 'absolute', width: 600, height: 600, bottom: -200, right: -200, borderRadius: '50%', background: 'radial-gradient(circle,rgba(167,139,250,0.07),transparent)', filter: 'blur(100px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 500, height: 500, top: -100, left: -100, borderRadius: '50%', background: 'radial-gradient(circle,rgba(249,115,22,0.05),transparent)', filter: 'blur(80px)', pointerEvents: 'none' }} />

        {/* Orbit rings */}
        {[280, 400, 520].map((s, i) => (
          <div key={i} style={{ position: 'absolute', width: s, height: s, top: '40%', left: '50%', borderRadius: '50%', border: `1px solid rgba(249,115,22,${0.04 - i * 0.01})`, transform: 'translate(-50%,-50%)', animation: i % 2 === 0 ? `spinSlow ${70 + i * 30}s linear infinite` : `spinSlowR ${80 + i * 25}s linear infinite`, pointerEvents: 'none' }} />
        ))}

        {/* Flag top strip */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, display: 'flex', zIndex: 20 }}>
          <div style={{ flex: 1, background: '#FF9933' }} />
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.65)' }} />
          <div style={{ flex: 1, background: '#138808' }} />
        </div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          {/* Character */}
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>

            {/* Speech bubble */}
            <motion.div initial={{ opacity: 0, scale: 0.8, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 1, type: 'spring', stiffness: 180 }}
              style={{ background: 'rgba(8,14,32,0.92)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: '14px 14px 14px 4px', padding: '12px 18px', marginBottom: 20, backdropFilter: 'blur(12px)', maxWidth: 280, alignSelf: 'flex-start' }}>
              <p style={{ fontFamily: '"Crimson Text",serif', fontStyle: 'italic', fontSize: 16, color: '#fff', margin: '0 0 4px', lineHeight: 1.45 }}>"Namaste! 🙏 Welcome aboard."</p>
              <p style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, color: 'rgba(249,115,22,0.6)', letterSpacing: '0.12em', margin: 0 }}>India's finest awaits you</p>
            </motion.div>

            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{ filter: 'drop-shadow(0 16px 32px rgba(249,115,22,0.18))' }}>
              <WelcomeGuide />
            </motion.div>
          </motion.div>

          {/* Headline */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} style={{ marginBottom: 24 }}>
            <p style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.35em', textTransform: 'uppercase', color: '#f97316', marginBottom: 10 }}>Your account unlocks</p>
            <h2 style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 42, letterSpacing: '0.03em', color: '#fff', lineHeight: 0.95, marginBottom: 0 }}>
              ALL OF INDIA.<br />
              <span style={{ color: 'transparent', WebkitTextStroke: '1px rgba(249,115,22,0.4)' }}>ONE PLATFORM.</span>
            </h2>
          </motion.div>

          {/* India highlights ticker */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            style={{ overflow: 'hidden', marginBottom: 24 }}>
            <div style={{ display: 'flex', animation: 'marquee 18s linear infinite', width: 'max-content', gap: 0 }}>
              {[...INDIA_HIGHLIGHTS, ...INDIA_HIGHLIGHTS].map((h, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 20px', borderRight: '1px solid rgba(255,255,255,0.06)', whiteSpace: 'nowrap' }}>
                  <span style={{ fontSize: 14 }}>{h.icon}</span>
                  <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 9, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em' }}>{h.place}</span>
                  <span style={{ fontFamily: '"Crimson Text",serif', fontStyle: 'italic', fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>{h.desc}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Feature list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { icon: '🗺️', text: '500+ curated destinations across 28 states' },
              { icon: '🧭', text: 'Handpicked tours with local expert guides' },
              { icon: '❤️', text: 'Save destinations to your personal wishlist' },
              { icon: '📋', text: 'Track and manage all your bookings easily' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 + i * 0.1 }}
                style={{ display: 'flex', alignItems: 'center', gap: 14, border: '1px solid rgba(255,255,255,0.05)', borderRadius: 2, padding: '11px 14px', background: 'rgba(255,255,255,0.02)', transition: 'border-color 0.3s, background 0.3s', cursor: 'default' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(249,115,22,0.2)'; (e.currentTarget as HTMLElement).style.background = 'rgba(249,115,22,0.04)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)' }}>
                <div style={{ width: 32, height: 32, border: '1px solid rgba(249,115,22,0.18)', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0, background: 'rgba(249,115,22,0.06)' }}>
                  {item.icon}
                </div>
                <p style={{ fontFamily: '"Space Mono",monospace', fontSize: 10, color: 'rgba(255,255,255,0.48)', letterSpacing: '0.04em', flex: 1, margin: 0, lineHeight: 1.5 }}>
                  {item.text}
                </p>
                <div style={{ width: 18, height: 18, borderRadius: '50%', border: '1px solid rgba(34,197,94,0.35)', background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FiCheck size={9} color="#22c55e" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}