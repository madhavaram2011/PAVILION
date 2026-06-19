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

/* ── Join The Tribe — multi-figure welcoming scene ────────────────────────
   Four stylised figures: waving, namaste, arms-open, pointing-inward.
   Rendered entirely in SVG with warm ivory tones + teal accents.
────────────────────────────────────────────────────────────────────────── */
function TribeScene() {
  return (
    <svg viewBox="0 0 520 340" style={{ width: '100%', maxWidth: 460, display: 'block' }} fill="none" xmlns="http://www.w3.org/2000/svg">

      {/* ── Figure A — left, saree, waving ── */}
      {/* body */}
      <rect x="38" y="148" width="62" height="120" rx="8" fill="#1e3a5f" />
      {/* saree drape */}
      <path d="M38 160 Q22 180 18 220 Q14 245 26 260" stroke="#c9a96e" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.85" />
      {/* legs */}
      <path d="M44 262 L47 320 L60 320 L69 300 L78 320 L91 320 L94 262Z" fill="#162e4a" />
      {/* neck */}
      <rect x="62" y="120" width="16" height="30" rx="7" fill="#d4a574" />
      {/* head */}
      <ellipse cx="70" cy="102" rx="22" ry="24" fill="#d4a574" />
      {/* hair bun */}
      <path d="M49 93 Q50 72 70 69 Q90 72 91 93" fill="#1a0800" />
      <ellipse cx="90" cy="72" rx="9" ry="9" fill="#1a0800" />
      <circle cx="90" cy="67" r="3" fill="#c9a96e" />
      {/* bindi */}
      <circle cx="70" cy="88" r="3" fill="#dc2626" />
      {/* eyes */}
      <ellipse cx="63" cy="101" rx="3.5" ry="4" fill="#1a0800" />
      <ellipse cx="77" cy="101" rx="3.5" ry="4" fill="#1a0800" />
      <circle cx="64" cy="99.5" r="1.4" fill="white" />
      <circle cx="78" cy="99.5" r="1.4" fill="white" />
      {/* smile */}
      <path d="M62 113 Q70 121 78 113" stroke="#8b4513" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* RIGHT arm — waving up */}
      <path d="M100 162 Q118 140 122 110 Q124 95 116 88" stroke="#162e4a" strokeWidth="11" strokeLinecap="round" fill="none" />
      <ellipse cx="113" cy="82" rx="9" ry="11" fill="#d4a574" transform="rotate(-15 113 82)" />
      {/* wave fingers */}
      <path d="M108 74 L106 66" stroke="#d4a574" strokeWidth="3" strokeLinecap="round" />
      <path d="M113 72 L112 63" stroke="#d4a574" strokeWidth="3" strokeLinecap="round" />
      <path d="M118 74 L118 65" stroke="#d4a574" strokeWidth="3" strokeLinecap="round" />
      {/* LEFT arm down */}
      <ellipse cx="28" cy="210" rx="7" ry="10" fill="#d4a574" />
      {/* earring */}
      <circle cx="49" cy="107" r="4" fill="#c9a96e" />

      {/* ── Figure B — centre-left, sherwani, namaste ── */}
      <rect x="156" y="138" width="66" height="128" rx="8" fill="#1d3a1f" />
      {/* sherwani buttons */}
      <path d="M189 138 L189 170" stroke="#c9a96e" strokeWidth="1.5" strokeDasharray="4 3" />
      {[155, 168, 181, 194, 207].map((y, i) => (
        <g key={i}><circle cx="189" cy={y} r="2.2" fill="#c9a96e" /><circle cx="189" cy={y} r="1" fill="#f0ebe0" /></g>
      ))}
      {/* legs */}
      <path d="M163 260 L166 320 L180 320 L189 302 L198 320 L212 320 L215 260Z" fill="#142c16" />
      {/* neck */}
      <rect x="182" y="112" width="14" height="28" rx="6" fill="#c8956c" />
      {/* head */}
      <ellipse cx="189" cy="94" rx="24" ry="26" fill="#c8956c" />
      {/* turban */}
      <ellipse cx="189" cy="76" rx="28" ry="13" fill="#c9a96e" />
      <ellipse cx="189" cy="73" rx="22" ry="10" fill="#e8c47a" />
      <circle cx="189" cy="65" r="4" fill="#ff9933" />
      <circle cx="189" cy="65" r="2" fill="#fff" />
      {/* eyes */}
      <ellipse cx="181" cy="93" rx="3.8" ry="4.5" fill="#1a0800" />
      <ellipse cx="197" cy="93" rx="3.8" ry="4.5" fill="#1a0800" />
      <circle cx="182.5" cy="91.5" r="1.5" fill="white" />
      <circle cx="198.5" cy="91.5" r="1.5" fill="white" />
      {/* closed-eye joyful smile */}
      <path d="M177 107 Q189 117 201 107" stroke="#8b4513" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <ellipse cx="174" cy="104" rx="6" ry="3.5" fill="rgba(255,150,100,0.2)" />
      <ellipse cx="204" cy="104" rx="6" ry="3.5" fill="rgba(255,150,100,0.2)" />
      {/* namaste arms folded at chest */}
      <path d="M156 152 Q138 166 134 188 Q132 200 140 206" stroke="#142c16" strokeWidth="11" strokeLinecap="round" fill="none" />
      <path d="M222 152 Q240 166 244 188 Q246 200 238 206" stroke="#142c16" strokeWidth="11" strokeLinecap="round" fill="none" />
      <ellipse cx="140" cy="210" rx="8" ry="10" fill="#c8956c" />
      <ellipse cx="238" cy="210" rx="8" ry="10" fill="#c8956c" />
      {/* joined palms visual */}
      <path d="M156 185 Q189 175 222 185" stroke="#c9a96e" strokeWidth="1" fill="none" opacity="0.35" />

      {/* ── Figure C — centre-right, salwar, arms open ── */}
      <rect x="290" y="145" width="60" height="122" rx="8" fill="#2d1b4a" />
      {/* dupatta */}
      <path d="M290 155 Q272 175 266 215 Q260 240 272 252" stroke="#c9a96e" strokeWidth="4.5" strokeLinecap="round" fill="none" opacity="0.8" />
      {/* legs */}
      <path d="M296 261 L299 320 L312 320 L320 302 L328 320 L341 320 L344 261Z" fill="#1e1030" />
      {/* neck */}
      <rect x="314" y="118" width="12" height="28" rx="5" fill="#d4a574" />
      {/* head */}
      <ellipse cx="320" cy="101" rx="21" ry="23" fill="#d4a574" />
      {/* hair — open */}
      <path d="M300 92 Q302 73 320 70 Q338 73 340 92" fill="#1a0800" />
      <path d="M300 92 Q296 114 298 132" stroke="#1a0800" strokeWidth="8" strokeLinecap="round" fill="none" />
      {/* bindi */}
      <circle cx="320" cy="87" r="2.8" fill="#dc2626" />
      {/* eyes */}
      <ellipse cx="313" cy="100" rx="3.3" ry="3.8" fill="#1a0800" />
      <ellipse cx="327" cy="100" rx="3.3" ry="3.8" fill="#1a0800" />
      <circle cx="314.2" cy="98.5" r="1.3" fill="white" />
      <circle cx="328.2" cy="98.5" r="1.3" fill="white" />
      {/* warm smile */}
      <path d="M312 112 Q320 120 328 112" stroke="#8b4513" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* arms open wide — welcoming */}
      <path d="M290 158 Q268 148 252 138 Q240 130 234 124" stroke="#1e1030" strokeWidth="11" strokeLinecap="round" fill="none" />
      <ellipse cx="228" cy="120" rx="9" ry="11" fill="#d4a574" transform="rotate(20 228 120)" />
      <path d="M350 158 Q372 148 388 138 Q400 130 406 124" stroke="#1e1030" strokeWidth="11" strokeLinecap="round" fill="none" />
      <ellipse cx="412" cy="120" rx="9" ry="11" fill="#d4a574" transform="rotate(-20 412 120)" />
      {/* nose pin */}
      <circle cx="323" cy="107" r="2" fill="#c9a96e" />
      {/* earring */}
      <circle cx="299" cy="107" r="3.5" fill="#c9a96e" />

      {/* ── Figure D — right, dhoti, pointing inward ── */}
      <rect x="390" y="150" width="58" height="118" rx="8" fill="#1e3a5f" />
      {/* dhoti fold */}
      <path d="M390 162 Q372 178 368 218 Q365 242 378 256" stroke="#c9a96e" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.7" />
      {/* legs */}
      <path d="M396 262 L399 320 L412 320 L419 302 L426 320 L439 320 L442 262Z" fill="#162e4a" />
      {/* neck */}
      <rect x="411" y="124" width="14" height="28" rx="6" fill="#c8956c" />
      {/* head */}
      <ellipse cx="418" cy="106" rx="22" ry="24" fill="#c8956c" />
      {/* hair short */}
      <path d="M397 97 Q398 80 418 77 Q438 80 439 97" fill="#1a0800" />
      {/* eyes */}
      <ellipse cx="410" cy="105" rx="3.5" ry="4" fill="#1a0800" />
      <ellipse cx="426" cy="105" rx="3.5" ry="4" fill="#1a0800" />
      <circle cx="411.5" cy="103.5" r="1.4" fill="white" />
      <circle cx="427.5" cy="103.5" r="1.4" fill="white" />
      {/* knowing smile */}
      <path d="M408 118 Q418 127 428 118" stroke="#8b4513" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* mustache */}
      <path d="M411 114 Q418 117 425 114" stroke="#1a0800" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* RIGHT arm — pointing left/inward toward group */}
      <path d="M390 164 Q368 154 348 152" stroke="#162e4a" strokeWidth="11" strokeLinecap="round" fill="none" />
      <ellipse cx="342" cy="151" rx="10" ry="8" fill="#c8956c" transform="rotate(-10 342 151)" />
      {/* pointing finger */}
      <path d="M334 148 L320 146" stroke="#c8956c" strokeWidth="4" strokeLinecap="round" />
      {/* LEFT arm down */}
      <ellipse cx="456" cy="215" rx="7" ry="10" fill="#c8956c" />
      {/* pocket square accent */}
      <path d="M395 155 Q400 150 405 155" stroke="#c9a96e" strokeWidth="1.5" fill="none" opacity="0.6" />

      {/* ── Ground line ── */}
      <line x1="14" y1="320" x2="506" y2="320" stroke="rgba(20,184,166,0.15)" strokeWidth="1" />

      {/* ── Floating teal confetti dots ── */}
      {[
        { cx: 130, cy: 60, r: 4, c: '#14b8a6', op: 0.6 },
        { cx: 260, cy: 40, r: 3, c: '#f0ebe0', op: 0.4 },
        { cx: 370, cy: 55, r: 5, c: '#14b8a6', op: 0.5 },
        { cx: 460, cy: 80, r: 3, c: '#c9a96e', op: 0.5 },
        { cx: 80, cy: 290, r: 3, c: '#14b8a6', op: 0.35 },
        { cx: 440, cy: 295, r: 4, c: '#c9a96e', op: 0.4 },
      ].map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill={d.c} opacity={d.op} />
      ))}

      {/* ── Connective arc between figures — "together" motif ── */}
      <path d="M70 96 Q189 44 320 99 Q370 80 418 104" stroke="rgba(20,184,166,0.12)" strokeWidth="1.5" fill="none" strokeDasharray="6 4" />
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

/* ── India destination snippets ─────────────────────────────────────────── */
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
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) })

  const pw = watch('password', '')
  const name = watch('name', '')
  const email = watch('email', '')
  const strength = pw.length === 0 ? 0 : pw.length < 6 ? 1 : pw.length < 10 ? 2 : /[A-Z]/.test(pw) && /[0-9]/.test(pw) ? 4 : 3

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
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', fontFamily: '"Crimson Text",Georgia,serif', background: '#06040f' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { cursor: default; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #06040f; }
        ::-webkit-scrollbar-thumb { background: rgba(20,184,166,0.4); border-radius: 2px; }
        @keyframes spinSlow { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        .ri {
          width: 100%; background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08); outline: none;
          padding: 13px 13px 13px 46px;
          font-family: "Space Mono", monospace; font-size: 11px;
          letter-spacing: 0.08em; color: #fff; border-radius: 2px;
          transition: border-color 0.3s, background 0.3s, box-shadow 0.3s;
          cursor: text;
        }
        .ri::placeholder { color: rgba(255,255,255,0.17); }
        .ri:focus { border-color: rgba(20,184,166,0.6); background: rgba(20,184,166,0.04); box-shadow: 0 0 0 3px rgba(20,184,166,0.08); }
        .ri.err { border-color: rgba(239,68,68,0.5); }
        button { cursor: pointer; }
        input[type="checkbox"] { cursor: pointer; }
        @media (max-width: 768px) {
          .reg-grid { grid-template-columns: 1fr !important; }
          .reg-visual { display: none !important; }
        }
      `}</style>

      {/* ── LEFT — Form ────────────────────────────────────────────────────── */}
      <div style={{ background: '#06040f', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 28px', overflowY: 'auto', position: 'relative' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, top: -160, left: -160, borderRadius: '50%', background: 'radial-gradient(circle,rgba(20,184,166,0.06),transparent)', filter: 'blur(90px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 400, height: 400, bottom: -100, right: -80, borderRadius: '50%', background: 'radial-gradient(circle,rgba(167,139,250,0.05),transparent)', filter: 'blur(80px)', pointerEvents: 'none' }} />

        <motion.div
          initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 10 }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none', marginBottom: 40 }}>
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
          <motion.h1
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
            style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 52, letterSpacing: '0.04em', color: '#f0ebe0', marginBottom: 6, lineHeight: 0.95 }}>
            START YOUR<br /><span style={{ color: '#14b8a6' }}>JOURNEY</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 }}
            style={{ fontFamily: '"Crimson Text",serif', fontStyle: 'italic', fontSize: 15, color: 'rgba(240,235,224,0.36)', margin: '0 0 30px' }}>
            Create your Pavilion account — it's free
          </motion.p>

          {/* Step progress indicators */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            style={{ display: 'flex', gap: 6, marginBottom: 28, alignItems: 'center' }}>
            {[name.length >= 2, email.includes('@'), pw.length >= 8].map((done, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', border: `1px solid ${done ? '#14b8a6' : 'rgba(255,255,255,0.12)'}`, background: done ? 'rgba(20,184,166,0.15)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
                  {done
                    ? <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><FiCheck size={10} color="#14b8a6" /></motion.div>
                    : <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, color: 'rgba(255,255,255,0.3)' }}>{i + 1}</span>
                  }
                </div>
                {i < 2 && <div style={{ width: 24, height: 1, background: done ? 'rgba(20,184,166,0.4)' : 'rgba(255,255,255,0.07)', transition: 'background 0.4s' }} />}
              </div>
            ))}
            <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 7, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.2)', marginLeft: 8 }}>PROGRESS</span>
          </motion.div>

          {/* Form fields */}
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 17 }}>

            {/* Name */}
            <motion.div initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
              <label style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.26em', textTransform: 'uppercase', color: focused === 'name' ? '#14b8a6' : 'rgba(240,235,224,0.28)', display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8, transition: 'color 0.3s' }}>
                <FiUser size={10} /> Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <FiUser size={13} style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: focused === 'name' ? '#14b8a6' : 'rgba(255,255,255,0.2)', transition: 'color 0.3s', pointerEvents: 'none' }} />
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
                {errors.name && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#ef4444', fontFamily: '"Space Mono",monospace', fontSize: 9, marginTop: 6 }}>
                    <FiAlertCircle size={10} />{errors.name.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Email */}
            <motion.div initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.43 }}>
              <label style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.26em', textTransform: 'uppercase', color: focused === 'email' ? '#14b8a6' : 'rgba(240,235,224,0.28)', display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8, transition: 'color 0.3s' }}>
                <FiMail size={10} /> Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <FiMail size={13} style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: focused === 'email' ? '#14b8a6' : 'rgba(255,255,255,0.2)', transition: 'color 0.3s', pointerEvents: 'none' }} />
                <input {...register('email')} type="email" placeholder="your@email.com"
                  className={`ri${errors.email ? ' err' : ''}`}
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
            <motion.div initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.51 }}>
              <label style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.26em', textTransform: 'uppercase', color: focused === 'password' ? '#14b8a6' : 'rgba(240,235,224,0.28)', display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8, transition: 'color 0.3s' }}>
                <FiLock size={10} /> Password
              </label>
              <div style={{ position: 'relative' }}>
                <FiLock size={13} style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: focused === 'password' ? '#14b8a6' : 'rgba(255,255,255,0.2)', transition: 'color 0.3s', pointerEvents: 'none' }} />
                <input {...register('password')} type={showPw ? 'text' : 'password'} placeholder="Min. 8 characters"
                  className={`ri${errors.password ? ' err' : ''}`} style={{ paddingRight: 46 }}
                  onFocus={() => setFocused('password')} onBlur={() => setFocused(null)} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.26)', cursor: 'pointer', padding: 4, transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#14b8a6'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.26)'}>
                  {showPw ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>
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
                {errors.password && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#ef4444', fontFamily: '"Space Mono",monospace', fontSize: 9, marginTop: 6 }}>
                    <FiAlertCircle size={10} />{errors.password.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Confirm Password */}
            <motion.div initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.59 }}>
              <label style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.26em', textTransform: 'uppercase', color: focused === 'confirm' ? '#14b8a6' : 'rgba(240,235,224,0.28)', display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8, transition: 'color 0.3s' }}>
                <FiLock size={10} /> Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <FiLock size={13} style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: focused === 'confirm' ? '#14b8a6' : 'rgba(255,255,255,0.2)', transition: 'color 0.3s', pointerEvents: 'none' }} />
                <input {...register('confirm')} type={showConfirm ? 'text' : 'password'} placeholder="Repeat password"
                  className={`ri${errors.confirm ? ' err' : ''}`} style={{ paddingRight: 46 }}
                  onFocus={() => setFocused('confirm')} onBlur={() => setFocused(null)} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.26)', cursor: 'pointer', padding: 4, transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#14b8a6'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.26)'}>
                  {showConfirm ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>
              <AnimatePresence>
                {errors.confirm && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#ef4444', fontFamily: '"Space Mono",monospace', fontSize: 9, marginTop: 6 }}>
                    <FiAlertCircle size={10} />{errors.confirm.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Submit */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.68 }}>
              <motion.button type="submit" disabled={loading}
                whileHover={!loading ? { y: -3, boxShadow: '0 16px 48px rgba(20,184,166,0.4)' } : {}}
                whileTap={!loading ? { scale: 0.97 } : {}}
                style={{ width: '100%', background: loading ? 'rgba(20,184,166,0.4)' : 'linear-gradient(135deg,#14b8a6,#0d9488)', border: 'none', borderRadius: 2, padding: '16px', fontFamily: '"Space Mono",monospace', fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 700, color: '#fff', cursor: loading ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, boxShadow: loading ? 'none' : '0 8px 32px rgba(20,184,166,0.3)', transition: 'all 0.3s', marginTop: 4 }}>
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
              <Link to="#" style={{ color: 'rgba(20,184,166,0.65)', textDecoration: 'none', cursor: 'pointer' }}>Terms</Link>
              {' '}&amp;{' '}
              <Link to="#" style={{ color: 'rgba(20,184,166,0.65)', textDecoration: 'none', cursor: 'pointer' }}>Privacy Policy</Link>
            </p>
            <p style={{ fontFamily: '"Crimson Text",serif', fontSize: 16, color: 'rgba(240,235,224,0.4)', margin: 0 }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#14b8a6', fontWeight: 600, textDecoration: 'none', fontStyle: 'italic', cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.textDecoration = 'underline'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.textDecoration = 'none'}>
                Sign in
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* ── RIGHT — Visual Panel ─────────────────────────────────────────────── */}
      <div className="reg-visual" style={{ background: 'linear-gradient(160deg,#06040f 0%,#080a18 50%,#04110a 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 44px', position: 'relative', overflow: 'hidden' }}>
        <StarCanvas />

        {/* Atmospheric glows */}
        <div style={{ position: 'absolute', width: 600, height: 600, bottom: -200, right: -200, borderRadius: '50%', background: 'radial-gradient(circle,rgba(20,184,166,0.07),transparent)', filter: 'blur(100px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 500, height: 500, top: -100, left: -100, borderRadius: '50%', background: 'radial-gradient(circle,rgba(249,115,22,0.04),transparent)', filter: 'blur(80px)', pointerEvents: 'none' }} />

        {/* India flag strip */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, display: 'flex', zIndex: 20 }}>
          <div style={{ flex: 1, background: '#FF9933' }} />
          <div style={{ flex: 1, background: 'rgba(240,235,224,0.65)' }} />
          <div style={{ flex: 1, background: '#138808' }} />
        </div>

        {/* Teal corner bracket */}
        <svg style={{ position: 'absolute', top: 16, right: 16, zIndex: 5, pointerEvents: 'none' }} width="40" height="40" viewBox="0 0 40 40">
          <path d="M2 38 L2 2 L38 2" stroke="#14b8a6" strokeWidth="1.5" fill="none" strokeLinecap="square" />
        </svg>
        <svg style={{ position: 'absolute', bottom: 16, left: 16, zIndex: 5, pointerEvents: 'none' }} width="40" height="40" viewBox="0 0 40 40">
          <path d="M38 2 L38 38 L2 38" stroke="#14b8a6" strokeWidth="1.5" fill="none" strokeLinecap="square" />
        </svg>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 10 }}>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            style={{ marginBottom: 10 }}>
            <p style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.38em', textTransform: 'uppercase', color: '#14b8a6', marginBottom: 10 }}>Join 50,000+ explorers</p>
            <h2 style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 'clamp(2.4rem, 4vw, 3.4rem)', letterSpacing: '0.03em', color: '#f0ebe0', lineHeight: 0.95, marginBottom: 6 }}>
              YOUR TRIBE<br />
              <span style={{ color: 'transparent', WebkitTextStroke: '1px rgba(20,184,166,0.5)' }}>AWAITS YOU.</span>
            </h2>
          </motion.div>

          {/* Tribe illustration */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
            style={{ margin: '4px 0 16px' }}>
            <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
              <TribeScene />
            </motion.div>
          </motion.div>

          {/* India highlights marquee */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
            style={{ overflow: 'hidden', marginBottom: 20 }}>
            <div style={{ display: 'flex', animation: 'marquee 18s linear infinite', width: 'max-content' }}>
              {[...INDIA_HIGHLIGHTS, ...INDIA_HIGHLIGHTS].map((h, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 20px', borderRight: '1px solid rgba(255,255,255,0.06)', whiteSpace: 'nowrap' }}>
                  <span style={{ fontSize: 13 }}>{h.icon}</span>
                  <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, color: 'rgba(240,235,224,0.45)', letterSpacing: '0.08em' }}>{h.place}</span>
                  <span style={{ fontFamily: '"Crimson Text",serif', fontStyle: 'italic', fontSize: 12, color: 'rgba(240,235,224,0.22)' }}>{h.desc}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Feature list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {[
              { icon: '🗺️', text: '500+ curated destinations across 28 states' },
              { icon: '🧭', text: 'Handpicked tours with local expert guides' },
              { icon: '❤️', text: 'Save destinations to your personal wishlist' },
              { icon: '📋', text: 'Track and manage all your bookings easily' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.0 + i * 0.1 }}
                style={{ display: 'flex', alignItems: 'center', gap: 12, border: '1px solid rgba(255,255,255,0.05)', borderRadius: 2, padding: '10px 13px', background: 'rgba(255,255,255,0.02)', transition: 'border-color 0.3s, background 0.3s', cursor: 'default' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(20,184,166,0.2)'; (e.currentTarget as HTMLElement).style.background = 'rgba(20,184,166,0.04)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)' }}>
                <div style={{ width: 30, height: 30, border: '1px solid rgba(20,184,166,0.18)', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0, background: 'rgba(20,184,166,0.06)' }}>
                  {item.icon}
                </div>
                <p style={{ fontFamily: '"Space Mono",monospace', fontSize: 9, color: 'rgba(240,235,224,0.45)', letterSpacing: '0.04em', flex: 1, margin: 0, lineHeight: 1.5 }}>
                  {item.text}
                </p>
                <div style={{ width: 17, height: 17, borderRadius: '50%', border: '1px solid rgba(34,197,94,0.35)', background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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