import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FiSend, FiAlertCircle, FiCheck, FiMail } from 'react-icons/fi'
import toast from 'react-hot-toast'

const schema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Enter a valid email'),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
})
type FormData = z.infer<typeof schema>

const SUBJECTS = [
  'I want to suggest a destination',
  'Found an error / wrong info',
  'Collaboration / contribution',
  'General feedback',
  'Just saying hello 👋',
]

/* ── Star Canvas ────────────────────────────────────────────────────────────── */
function StarCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return
    const ctx = canvas.getContext('2d')!; let raf: number
    const stars = Array.from({ length: 160 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.2 + 0.2,
      a: Math.random(),
      speed: Math.random() * 0.003 + 0.001,
    }))
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize(); window.addEventListener('resize', resize)
    let t = 0
    const draw = () => {
      t += 0.005; ctx.clearRect(0, 0, canvas.width, canvas.height)
      stars.forEach(s => {
        const f = s.a * (0.35 + 0.5 * Math.abs(Math.sin(t * s.speed + s.a * 8)))
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

/* ── Indian Guide Character ─────────────────────────────────────────────────── */
function ContactGuide({ width = 200 }: { width?: number }) {
  return (
    <svg viewBox="0 0 240 420" style={{ width, display: 'block' }} fill="none">
      <rect x="72" y="158" width="96" height="178" rx="12" fill="#1e3a5f" />
      <path d="M72 165 Q50 185 38 240 Q28 270 42 295" stroke="#c9a96e" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.9" />
      <path d="M168 172 Q186 160 192 135 Q195 115 186 107" stroke="#1e3a5f" strokeWidth="14" strokeLinecap="round" fill="none" />
      <path d="M80 328 L84 390 L104 390 L120 365 L136 390 L156 390 L160 328Z" fill="#162e4a" />
      <rect x="106" y="126" width="28" height="36" rx="10" fill="#d4a574" />
      <ellipse cx="120" cy="100" rx="34" ry="38" fill="#d4a574" />
      <path d="M86 90 Q88 60 120 56 Q152 60 154 90 Q148 64 120 62 Q92 64 86 90Z" fill="#1a0800" />
      <path d="M86 90 Q80 120 84 140 Q88 155 92 160" stroke="#1a0800" strokeWidth="10" strokeLinecap="round" fill="none" />
      <ellipse cx="152" cy="62" rx="14" ry="14" fill="#1a0800" />
      <circle cx="152" cy="55" r="4" fill="#c9a96e" />
      <circle cx="152" cy="55" r="2" fill="#ff9933" />
      <ellipse cx="107" cy="98" rx="5.5" ry="6" fill="#1a0800" />
      <ellipse cx="133" cy="98" rx="5.5" ry="6" fill="#1a0800" />
      <circle cx="109" cy="96" r="2" fill="white" />
      <circle cx="135" cy="96" r="2" fill="white" />
      <path d="M106 118 Q120 132 134 118" stroke="#8b4513" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M117 106 Q114 112 117 115 Q120 117 123 115 Q126 112 123 106" stroke="#b07a50" strokeWidth="1.2" fill="none" />
      <circle cx="126" cy="112" r="2.5" fill="#c9a96e" />
      <circle cx="126" cy="112" r="1.2" fill="#fff" />
      <circle cx="120" cy="82" r="4" fill="#dc2626" />
      <circle cx="120" cy="82" r="2" fill="#ff8888" />
      <circle cx="85" cy="108" r="5" fill="#c9a96e" stroke="#f0ebe0" strokeWidth="0.5" />
      <rect x="83" y="113" width="4" height="10" rx="2" fill="#c9a96e" />
      <path d="M168 178 Q192 158 198 128 Q200 112 190 105" stroke="#162e4a" strokeWidth="14" strokeLinecap="round" fill="none" />
      <ellipse cx="188" cy="98" rx="12" ry="14" fill="#d4a574" transform="rotate(-20 188 98)" />
      <rect x="176" y="74" width="28" height="20" rx="3" fill="#f0ebe0" stroke="#c9a96e" strokeWidth="1" />
      <path d="M176 76 L190 86 L204 76" stroke="#c9a96e" strokeWidth="1.5" fill="none" />
      <path d="M176 92 L185 85" stroke="#c9a96e" strokeWidth="1" fill="none" />
      <path d="M204 92 L195 85" stroke="#c9a96e" strokeWidth="1" fill="none" />
      <ellipse cx="38" cy="248" rx="9" ry="12" fill="#d4a574" />
      {[235, 242, 249].map((y, i) => (
        <ellipse key={i} cx="38" cy={y} rx="10" ry="4" fill="none" stroke={(['#c9a96e', '#ff9933', '#c9a96e'] as const)[i]} strokeWidth="2" />
      ))}
      <path d="M88 170 Q120 165 152 170" stroke="#c9a96e" strokeWidth="1" fill="none" opacity="0.5" />
      <path d="M88 184 Q120 179 152 184" stroke="#c9a96e" strokeWidth="0.8" fill="none" opacity="0.35" />
      {[{ x: 55, y: 190 }, { x: 45, y: 218 }, { x: 50, y: 245 }].map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3" fill="rgba(201,169,110,0.6)" />
          <circle cx={p.x} cy={p.y} r="1.5" fill="rgba(255,107,53,0.6)" />
        </g>
      ))}
    </svg>
  )
}

const mono = '"Space Mono", monospace'
const bebas = '"Bebas Neue", sans-serif'
const crimson = '"Crimson Text", serif'
const gold = '#c9a96e'
const bg = '#03060f'
const text = '#f0ebe0'
const textDim = 'rgba(240,235,224,0.5)'
const textFaint = 'rgba(240,235,224,0.28)'
const goldBorder = 'rgba(201,169,110,0.18)'

export default function ContactPage() {
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async () => {
    setSending(true)
    await new Promise(r => setTimeout(r, 1200))
    toast.success("Message sent! I'll get back to you soon 🙏")
    setSent(true); setSending(false)
    setTimeout(() => { setSent(false); reset() }, 5000)
  }

  return (
    <div style={{ minHeight: '100vh', background: bg, color: text, fontFamily: crimson, overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #03060f; }
        ::-webkit-scrollbar-thumb { background: rgba(201,169,110,0.3); border-radius: 2px; }
        @keyframes spinSlow { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        .ci {
          width: 100%; background: rgba(255,255,255,0.04);
          border: 1px solid rgba(201,169,110,0.12); outline: none;
          padding: 13px 16px; font-family: "Space Mono", monospace;
          font-size: 11px; letter-spacing: 0.06em; color: #f0ebe0;
          border-radius: 2px; transition: border-color 0.3s, background 0.3s;
        }
        .ci::placeholder { color: rgba(240,235,224,0.18); }
        .ci:focus { border-color: rgba(201,169,110,0.45); background: rgba(201,169,110,0.04); }
        .ci.err { border-color: rgba(239,68,68,0.45); }
        select.ci option { background: #03060f; }
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: start;
        }
        @media (max-width: 800px) {
          .contact-grid { grid-template-columns: 1fr; gap: 32px; }
        }
      `}</style>

      <StarCanvas />

      {/* Atmospheric nebulae */}
      <div style={{ position: 'fixed', width: 600, height: 600, top: -150, left: -100, borderRadius: '50%', background: 'radial-gradient(circle,#1a2a4a,transparent)', filter: 'blur(100px)', opacity: 0.1, pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', width: 500, height: 500, bottom: '5%', right: -80, borderRadius: '50%', background: 'radial-gradient(circle,#2d1b4a,transparent)', filter: 'blur(100px)', opacity: 0.1, pointerEvents: 'none', zIndex: 0 }} />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        minHeight: '52vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'flex-end',
        padding: '100px 40px 0', zIndex: 1,
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1600&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.08) saturate(0.3)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(3,6,15,0.4) 0%, rgba(3,6,15,1) 100%)' }} />

        <div style={{
          position: 'relative', zIndex: 10,
          maxWidth: 1040, width: '100%', margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1fr auto',
          gap: 40, alignItems: 'flex-end',
        }}>
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              style={{ fontFamily: mono, fontSize: 9, letterSpacing: '0.45em', textTransform: 'uppercase', color: gold, marginBottom: 14 }}>
              ◈ Write to me
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
              style={{ fontFamily: bebas, fontSize: 'clamp(3.5rem,8vw,8rem)', letterSpacing: '0.02em', lineHeight: 0.9, color: text, marginBottom: 18 }}>
              HAVE SOMETHING<br />
              <span style={{ color: gold }}>TO SAY?</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              style={{ fontFamily: crimson, fontStyle: 'italic', fontSize: 18, color: textDim, maxWidth: 480, lineHeight: 1.7 }}>
              Spotted a hidden gem we missed? Found a mistake? Just want to say something nice about India? I'd love to hear from you.
            </motion.p>
          </div>

          {/* Hero illustration + speech bubble */}
          <motion.div
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.8 }}
            style={{ position: 'relative', flexShrink: 0, width: 220 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9, type: 'spring' }}
              style={{
                position: 'absolute', top: 20, right: 215,
                background: 'rgba(8,14,32,0.95)',
                border: '1px solid rgba(201,169,110,0.3)',
                borderRadius: '12px 12px 4px 12px',
                padding: '10px 16px', backdropFilter: 'blur(12px)',
                whiteSpace: 'nowrap', zIndex: 20,
              }}>
              <p style={{ fontFamily: crimson, fontStyle: 'italic', fontSize: 15, color: text, margin: '0 0 3px' }}>"I'm all ears! 🇮🇳"</p>
              <p style={{ fontFamily: mono, fontSize: 8, color: 'rgba(201,169,110,0.6)', letterSpacing: '0.12em', margin: 0 }}>Tell me about India's hidden gems</p>
            </motion.div>
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
              <ContactGuide width={220} />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 1, padding: '60px clamp(20px,6vw,80px) 100px', maxWidth: 1040, margin: '0 auto' }}>
        <div className="contact-grid">

          {/* ── LEFT: clean minimal side panel ───────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Support touchpoint */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              style={{ border: `1px solid ${goldBorder}`, borderRadius: 2, background: 'rgba(8,14,32,0.7)', backdropFilter: 'blur(12px)', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: `1px solid rgba(201,169,110,0.08)` }}>
                <p style={{ fontFamily: mono, fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(240,235,224,0.25)', margin: 0 }}>◈ Get In Touch</p>
              </div>
              <div style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  border: '1px solid rgba(201,169,110,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(201,169,110,0.06)',
                }}>
                  <FiMail size={20} color={gold} />
                </div>
                <div>
                  <p style={{ fontFamily: mono, fontSize: 8, letterSpacing: '0.28em', textTransform: 'uppercase', color: textFaint, margin: '0 0 10px' }}>Direct Email</p>
                  <a
                    href="mailto:explore@pavilion.in"
                    style={{ fontFamily: mono, fontSize: 13, letterSpacing: '0.06em', color: gold, textDecoration: 'none', borderBottom: '1px solid rgba(201,169,110,0.3)', paddingBottom: 2, transition: 'border-color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = gold)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(201,169,110,0.3)')}>
                    explore@pavilion.in
                  </a>
                  <p style={{ fontFamily: crimson, fontStyle: 'italic', fontSize: 15, color: textDim, margin: '14px 0 0', lineHeight: 1.65 }}>
                    I read every message personally and usually reply within a day or two.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* What you can write about */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 }}
              style={{ border: `1px solid ${goldBorder}`, borderRadius: 2, background: 'rgba(8,14,32,0.7)', backdropFilter: 'blur(12px)', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: `1px solid rgba(201,169,110,0.08)` }}>
                <p style={{ fontFamily: mono, fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(240,235,224,0.25)', margin: 0 }}>◈ What To Write About</p>
              </div>
              {[
                { icon: '📍', text: 'A destination we should add to the map' },
                { icon: '🐛', text: 'Something that looks wrong or broken' },
                { icon: '💡', text: 'A suggestion to improve the platform' },
                { icon: '🤝', text: 'Collaboration or contribution ideas' },
                { icon: '💬', text: "Just share your love for India!" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 24px', borderBottom: i < 4 ? '1px solid rgba(201,169,110,0.05)' : 'none' }}>
                  <span style={{ fontSize: 17, flexShrink: 0, lineHeight: 1 }}>{item.icon}</span>
                  <p style={{ fontFamily: crimson, fontSize: 15, color: textDim, margin: 0, lineHeight: 1.45 }}>{item.text}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Illustration anchoring the left column */}
            <motion.div
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              style={{ display: 'flex', justifyContent: 'center', paddingTop: 12 }}>
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}>
                <ContactGuide width={148} />
              </motion.div>
            </motion.div>
          </div>

          {/* ── RIGHT: Contact form ───────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div style={{ border: `1px solid ${goldBorder}`, borderRadius: 2, padding: '36px', background: 'rgba(8,14,32,0.7)', backdropFilter: 'blur(12px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 30 }}>
                <span style={{ fontFamily: mono, fontSize: 9, letterSpacing: '0.3em', color: 'rgba(240,235,224,0.22)', whiteSpace: 'nowrap' }}>◈ SEND A MESSAGE</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(201,169,110,0.08)' }} />
              </div>

              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    style={{ textAlign: 'center', padding: '56px 0' }}>
                    <motion.div
                      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                      style={{ width: 80, height: 80, borderRadius: '50%', border: '1px solid rgba(74,222,128,0.3)', background: 'rgba(74,222,128,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', position: 'relative' }}>
                      <FiCheck size={30} color="#4ade80" />
                      <motion.div
                        style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid rgba(74,222,128,0.4)' }}
                        animate={{ scale: [1, 1.7], opacity: [0.6, 0] }}
                        transition={{ duration: 1.5, repeat: 3 }} />
                    </motion.div>
                    <h3 style={{ fontFamily: bebas, fontSize: 40, letterSpacing: '0.05em', color: text, marginBottom: 8 }}>Sent! 🙏</h3>
                    <p style={{ fontFamily: crimson, fontStyle: 'italic', fontSize: 16, color: textDim }}>
                      Thank you for reaching out. I'll get back to you soon.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div>
                        <label style={{ fontFamily: mono, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(240,235,224,0.38)', display: 'block', marginBottom: 8 }}>Your Name</label>
                        <input {...register('name')} type="text" placeholder="Rohan Sharma" className={`ci${errors.name ? ' err' : ''}`} />
                        {errors.name && <p style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#ef4444', fontFamily: mono, fontSize: 9, marginTop: 5 }}><FiAlertCircle size={10} />{errors.name.message}</p>}
                      </div>
                      <div>
                        <label style={{ fontFamily: mono, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(240,235,224,0.38)', display: 'block', marginBottom: 8 }}>Email</label>
                        <input {...register('email')} type="email" placeholder="you@example.com" className={`ci${errors.email ? ' err' : ''}`} />
                        {errors.email && <p style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#ef4444', fontFamily: mono, fontSize: 9, marginTop: 5 }}><FiAlertCircle size={10} />{errors.email.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label style={{ fontFamily: mono, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(240,235,224,0.38)', display: 'block', marginBottom: 8 }}>What's this about?</label>
                      <select {...register('subject')} className={`ci${errors.subject ? ' err' : ''}`}>
                        <option value="">Choose a topic...</option>
                        {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                      </select>
                      {errors.subject && <p style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#ef4444', fontFamily: mono, fontSize: 9, marginTop: 5 }}><FiAlertCircle size={10} />{errors.subject.message}</p>}
                    </div>

                    <div>
                      <label style={{ fontFamily: mono, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(240,235,224,0.38)', display: 'block', marginBottom: 8 }}>Your Message</label>
                      <textarea {...register('message')} rows={7} placeholder="Tell me about a hidden waterfall in Meghalaya, or the best chai shop in Banaras... anything India-related!" className={`ci${errors.message ? ' err' : ''}`} style={{ resize: 'none' }} />
                      {errors.message && <p style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#ef4444', fontFamily: mono, fontSize: 9, marginTop: 5 }}><FiAlertCircle size={10} />{errors.message.message}</p>}
                    </div>

                    <motion.button
                      type="submit"
                      disabled={sending}
                      whileHover={!sending ? { y: -2 } : {}}
                      whileTap={!sending ? { scale: 0.97 } : {}}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                        background: gold, border: 'none', borderRadius: 2, padding: '16px',
                        fontFamily: mono, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase',
                        fontWeight: 700, color: bg,
                        cursor: sending ? 'default' : 'pointer',
                        opacity: sending ? 0.7 : 1,
                        boxShadow: sending ? 'none' : '0 8px 28px rgba(201,169,110,0.3)',
                        transition: 'all 0.3s',
                      }}>
                      {sending
                        ? <><div style={{ width: 16, height: 16, border: '2px solid rgba(3,6,15,0.3)', borderTop: '2px solid #03060f', borderRadius: '50%', animation: 'spinSlow 0.8s linear infinite' }} />Sending...</>
                        : <><FiSend size={14} />Send Message</>}
                    </motion.button>

                    <p style={{ fontFamily: mono, fontSize: 8, color: textFaint, textAlign: 'center', letterSpacing: '0.08em', lineHeight: 1.7 }}>
                      No spam, no newsletters — just a real conversation about India 🇮🇳
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

        </div>
      </div>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer style={{
        position: 'relative', zIndex: 1,
        padding: '24px clamp(20px,6vw,80px)',
        borderTop: '1px solid rgba(201,169,110,0.07)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12,
      }}>
        <p style={{ fontFamily: mono, fontSize: 8, letterSpacing: '0.2em', color: 'rgba(240,235,224,0.18)' }}>© 2024 Pavilion · Discover Incredible India</p>
        <p style={{ fontFamily: mono, fontSize: 8, letterSpacing: '0.2em', color: 'rgba(240,235,224,0.18)' }}>A personal project built with love for India 🇮🇳</p>
      </footer>
    </div>
  )
}