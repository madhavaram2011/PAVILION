import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GiCompass } from 'react-icons/gi'
import { FiArrowLeft, FiSearch } from 'react-icons/fi'

function StarCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return
    const ctx = canvas.getContext('2d')!; let raf: number
    const stars = Array.from({ length: 250 }, () => ({
      x: Math.random(), y: Math.random(), r: Math.random() * 1.4 + 0.2,
      a: Math.random(), speed: Math.random() * 0.003 + 0.001,
    }))
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize(); window.addEventListener('resize', resize)
    let t = 0
    const draw = () => {
      t += 0.005; ctx.clearRect(0, 0, canvas.width, canvas.height)
      stars.forEach(s => {
        const f = s.a * (0.35 + 0.55 * Math.abs(Math.sin(t * s.speed + s.a * 8)))
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

const POPULAR = ['Ladakh', 'Kerala Backwaters', 'Jaipur', 'Varanasi', 'Goa', 'Coorg']

export default function NotFoundPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#03060f', color: '#f0ebe0', fontFamily: '"Crimson Text",Georgia,serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #03060f; }
        ::-webkit-scrollbar-thumb { background: rgba(201,169,110,0.3); border-radius: 2px; }
        @keyframes spinSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes ping { 0%{transform:scale(1);opacity:0.7} 100%{transform:scale(2.2);opacity:0} }
      `}</style>

      <StarCanvas />

      {/* Nebulae */}
      {[
        { w: 700, h: 700, top: -200, left: -200, c: '#1a2a4a' },
        { w: 500, h: 500, bottom: -100, right: -100, c: '#2d1b4a' },
      ].map((n, i) => (
        <div key={i} style={{ position: 'fixed', width: n.w, height: n.h, top: n.top, left: n.left, borderRadius: '50%', background: `radial-gradient(circle,${n.c},transparent)`, filter: 'blur(100px)', opacity: 0.12, pointerEvents: 'none', zIndex: 0 }} />
      ))}

      {/* Giant 404 ghost text */}
      <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', userSelect: 'none' }}>
        <span style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 'clamp(200px,35vw,480px)', letterSpacing: '0.02em', color: 'rgba(255,255,255,0.02)', WebkitTextStroke: '1px rgba(201,169,110,0.04)', userSelect: 'none' }}>404</span>
      </div>

      {/* Orbit rings */}
      {[180, 260, 340].map((s, i) => (
        <div key={i} style={{ position: 'fixed', width: s, height: s, top: '50%', left: '50%', borderRadius: '50%', border: '1px solid rgba(201,169,110,0.05)', transform: 'translate(-50%,-50%)', animation: `spinSlow ${50 + i * 20}s linear infinite`, pointerEvents: 'none', zIndex: 0 }} />
      ))}

      <div style={{ maxWidth: 600, width: '100%', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, type: 'spring', stiffness: 150 }}>

          {/* Compass icon with rings */}
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: 32 }}>
            {[56, 80, 104].map((s, i) => (
              <motion.div key={s}
                style={{ position: 'absolute', width: s * 2, height: s * 2, top: '50%', left: '50%', borderRadius: '50%', border: '1px solid rgba(201,169,110,0.15)', transform: 'translate(-50%,-50%)' }}
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.08, 0.3] }}
                transition={{ duration: 2 + i, repeat: Infinity, delay: i * 0.6 }}
              />
            ))}
            <div style={{ width: 110, height: 110, borderRadius: '50%', background: 'rgba(201,169,110,0.07)', border: '1px solid rgba(201,169,110,0.25)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <motion.div animate={{ rotate: [0, 18, -22, 12, -8, 0] }} transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' }}>
                <GiCompass style={{ color: '#c9a96e', fontSize: 52 }} />
              </motion.div>
            </div>
            {/* LOST badge */}
            <div style={{ position: 'absolute', top: -6, right: -10, background: '#ef4444', borderRadius: 2, padding: '3px 8px', fontFamily: '"Space Mono",monospace', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff', fontWeight: 700, boxShadow: '0 4px 16px rgba(239,68,68,0.4)' }}>LOST</div>
          </div>

          {/* 404 heading */}
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 'clamp(5rem,14vw,10rem)', letterSpacing: '0.04em', lineHeight: 0.85, color: 'rgba(240,235,224,0.06)', WebkitTextStroke: '1px rgba(201,169,110,0.2)', margin: '0 0 -10px' }}>
            404
          </motion.h1>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 42, letterSpacing: '0.04em', color: '#f0ebe0', margin: '0 0 16px' }}>YOU'RE OFF THE MAP</h2>
            <p style={{ fontFamily: '"Crimson Text",serif', fontStyle: 'italic', fontSize: 18, color: 'rgba(240,235,224,0.45)', lineHeight: 1.7, marginBottom: 36, maxWidth: 440, margin: '0 auto 36px' }}>
              Looks like this page wandered into uncharted territory. Even the best explorers get lost sometimes.
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 48, flexWrap: 'wrap' }}>
            <Link to="/"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#c9a96e', color: '#03060f', fontFamily: '"Space Mono",monospace', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, padding: '14px 28px', borderRadius: 2, textDecoration: 'none', boxShadow: '0 8px 32px rgba(201,169,110,0.25)', transition: 'all 0.3s' }}>
              <FiArrowLeft size={13} />Back to Home
            </Link>
            <Link to="/tours"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid rgba(201,169,110,0.25)', color: 'rgba(240,235,224,0.7)', fontFamily: '"Space Mono",monospace', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '14px 28px', borderRadius: 2, textDecoration: 'none', transition: 'all 0.3s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,169,110,0.5)'; (e.currentTarget as HTMLElement).style.color = '#c9a96e' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,169,110,0.25)'; (e.currentTarget as HTMLElement).style.color = 'rgba(240,235,224,0.7)' }}>
              <FiSearch size={13} />Explore Tours
            </Link>
          </motion.div>

          {/* Popular destinations */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            style={{ borderTop: '1px solid rgba(201,169,110,0.08)', paddingTop: 32 }}>
            <p style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(240,235,224,0.2)', marginBottom: 16 }}>Popular Destinations</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              {POPULAR.map((dest, i) => (
                <motion.div key={dest} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7 + i * 0.07 }}>
                  <Link to="/destinations"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 2, fontFamily: '"Space Mono",monospace', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', background: 'rgba(201,169,110,0.06)', border: '1px solid rgba(201,169,110,0.12)', color: 'rgba(240,235,224,0.4)', transition: 'all 0.25s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(201,169,110,0.12)'; (e.currentTarget as HTMLElement).style.color = '#c9a96e'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,169,110,0.3)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(201,169,110,0.06)'; (e.currentTarget as HTMLElement).style.color = 'rgba(240,235,224,0.4)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,169,110,0.12)' }}>
                    {dest}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}