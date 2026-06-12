import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCalendar, FiUsers, FiMapPin, FiClock, FiXCircle, FiCheckCircle, FiArrowRight } from 'react-icons/fi'
import { GiCompass } from 'react-icons/gi'
import { format } from 'date-fns'
import { bookingService } from '../services/travelService'
import toast from 'react-hot-toast'

type BookingStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed'

const STATUS: Record<BookingStatus, { color: string; bg: string; border: string; label: string }> = {
  confirmed: { color: '#22c55e', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)', label: 'Confirmed' },
  pending:   { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', label: 'Pending' },
  cancelled: { color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', label: 'Cancelled' },
  completed: { color: '#f97316', bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.2)', label: 'Completed' },
}

const FILTERS: { key: 'all' | BookingStatus; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'pending', label: 'Pending' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
]

function AirplaneCursor() {
  const planeRef  = useRef<HTMLDivElement>(null)
  const trailRefs = useRef<(HTMLDivElement | null)[]>([])
  const pos       = useRef({ x: 0, y: 0 })
  const actual    = useRef({ x: 0, y: 0 })
  const prevPos   = useRef({ x: 0, y: 0 })
  const rafRef    = useRef<number>(0)
  const [visible, setVisible] = useState(false)
  const TRAIL = 8

  useEffect(() => {
    const move  = (e: MouseEvent) => { pos.current = { x: e.clientX, y: e.clientY }; setVisible(true) }
    const leave = () => setVisible(false)
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseleave', leave)

    const animate = () => {
      actual.current.x += (pos.current.x - actual.current.x) * 0.14
      actual.current.y += (pos.current.y - actual.current.y) * 0.14
      const angle = Math.atan2(pos.current.y - prevPos.current.y, pos.current.x - prevPos.current.x) * (180 / Math.PI)
      prevPos.current = { ...actual.current }
      if (planeRef.current) {
        planeRef.current.style.left      = actual.current.x + 'px'
        planeRef.current.style.top       = actual.current.y + 'px'
        planeRef.current.style.transform = `translate(-50%,-50%) rotate(${angle + 45}deg)`
      }
      trailRefs.current.forEach((el, i) => {
        if (!el) return
        const lag = (i + 1) * 0.06
        el.style.left    = (pos.current.x + (actual.current.x - pos.current.x) * lag) + 'px'
        el.style.top     = (pos.current.y + (actual.current.y - pos.current.y) * lag) + 'px'
        el.style.opacity = String((1 - i / TRAIL) * 0.4)
        const sz         = `${4 - i * 0.4}px`
        el.style.width   = sz
        el.style.height  = sz
      })
      rafRef.current = requestAnimationFrame(animate)
    }
    animate()
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseleave', leave)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  if (!visible) return null
  return (
    <>
      {Array.from({ length: TRAIL }).map((_, i) => (
        <div
          key={i}
          ref={el => { trailRefs.current[i] = el }}
          style={{ position: 'fixed', borderRadius: '50%', background: '#f97316', pointerEvents: 'none', zIndex: 9997, transform: 'translate(-50%,-50%)' }}
        />
      ))}
      <div ref={planeRef} style={{ position: 'fixed', pointerEvents: 'none', zIndex: 9999, width: 28, height: 28 }}>
        <svg viewBox="0 0 24 24" fill="none" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 0 8px rgba(249,115,22,0.9))' }}>
          <path d="M21 3L3 10.5L10 13L13 21L21 3Z" fill="#f97316" stroke="#fff" strokeWidth="0.8" strokeLinejoin="round" />
        </svg>
      </div>
    </>
  )
}

function StarCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let raf: number
    const stars = Array.from({ length: 150 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.1 + 0.2,
      a: Math.random(), speed: Math.random() * 0.003 + 0.001,
    }))
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize()
    window.addEventListener('resize', resize)
    let t = 0
    const draw = () => {
      t += 0.005
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      stars.forEach(s => {
        const f = s.a * (0.3 + 0.5 * Math.abs(Math.sin(t * s.speed + s.a * 8)))
        ctx.beginPath()
        ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${f})`
        ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={ref} style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />
}

export default function MyBookingsPage() {
  const [filter, setFilter]           = useState<'all' | BookingStatus>('all')
  const [bookings, setBookings]       = useState<any[]>([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState<string | null>(null)
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  // Fetch real bookings from API
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await bookingService.getMine()
        setBookings(data)
      } catch (err: any) {
        console.error('Failed to load bookings:', err)
        setError(err.message || 'Failed to load bookings')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = filter === 'all'
    ? bookings
    : bookings.filter(b => b.status === filter)

  const counts = bookings.reduce<Record<string, number>>((acc, b) => {
    acc.all = (acc.all ?? 0) + 1
    acc[b.status] = (acc[b.status] ?? 0) + 1
    return acc
  }, {})

  const handleCancel = async (id: string) => {
    try {
      setCancellingId(id)
      await bookingService.cancel(id)
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: 'cancelled' } : b))
      toast.success('Booking cancelled successfully')
    } catch (err: any) {
      toast.error(err.message || 'Failed to cancel booking')
    } finally {
      setCancellingId(null)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#06040f', color: '#fff', fontFamily: '"Crimson Text",Georgia,serif', paddingTop: 80, cursor: 'none' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
        *,*::before,*::after { box-sizing: border-box; cursor: none !important; }
        body { background: #06040f; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #06040f; }
        ::-webkit-scrollbar-thumb { background: rgba(249,115,22,0.4); border-radius: 2px; }
        @keyframes spinSlow { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
      `}</style>

      <StarCanvas />
      <AirplaneCursor />
      <div style={{ position: 'fixed', width: 600, height: 600, top: -100, left: -100, borderRadius: '50%', background: 'radial-gradient(circle,rgba(249,115,22,0.05),transparent)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 clamp(20px,4vw,60px) 80px', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ marginBottom: 44 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f97316', boxShadow: '0 0 8px #f97316' }} />
            <p style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(249,115,22,0.6)', margin: 0 }}>Account</p>
          </div>
          <h1 style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 'clamp(3rem,6vw,5.5rem)', letterSpacing: '0.03em', lineHeight: 0.9, color: '#fff', marginBottom: 16 }}>MY BOOKINGS</h1>
          <div style={{ height: 2, background: 'linear-gradient(90deg,rgba(249,115,22,0.5),transparent)', width: 180 }} />
        </div>

        {/* Loading state */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: 20 }}>
            <div style={{ width: 48, height: 48, border: '2px solid rgba(249,115,22,0.2)', borderTop: '2px solid #f97316', borderRadius: '50%', animation: 'spinSlow 0.8s linear infinite' }} />
            <p style={{ fontFamily: '"Space Mono",monospace', fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em' }}>Loading your journeys...</p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{ border: '1px solid rgba(239,68,68,0.2)', borderRadius: 3, padding: '36px', textAlign: 'center', background: 'rgba(239,68,68,0.04)' }}>
            <p style={{ fontFamily: '"Space Mono",monospace', fontSize: 10, color: 'rgba(239,68,68,0.7)', marginBottom: 16 }}>{error}</p>
            <Link to="/tours" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#f97316,#ea580c)', color: '#fff', fontFamily: '"Space Mono",monospace', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, padding: '12px 22px', borderRadius: 2, textDecoration: 'none' }}>
              Explore Tours <FiArrowRight size={12} />
            </Link>
          </motion.div>
        )}

        {!loading && !error && (
          <>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 3, marginBottom: 36 }}>
              {[
                { label: 'Total Trips',  val: bookings.length, color: '#f97316' },
                { label: 'Upcoming',     val: bookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length, color: '#22c55e' },
                { label: 'Completed',    val: bookings.filter(b => b.status === 'completed').length, color: '#38bdf8' },
              ].map(({ label, val, color }, i) => (
                <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  style={{ border: `1px solid ${color}18`, borderTop: `2px solid ${color}`, background: `${color}06`, borderRadius: 2, padding: '18px', textAlign: 'center' }}>
                  <p style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 50, letterSpacing: '0.02em', background: `linear-gradient(135deg,${color},${color}80)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1, margin: 0 }}>{val}</p>
                  <p style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginTop: 5 }}>{label}</p>
                </motion.div>
              ))}
            </div>

            {/* Filter tabs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 28 }}>
              {FILTERS.map(({ key, label }) => {
                const count  = counts[key] ?? 0
                const active = filter === key
                return (
                  <motion.button key={key} onClick={() => setFilter(key)} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 16px', borderRadius: 2, fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'none', transition: 'all 0.2s', background: active ? '#f97316' : 'transparent', border: active ? '1px solid #f97316' : '1px solid rgba(255,255,255,0.08)', color: active ? '#fff' : 'rgba(255,255,255,0.38)', fontWeight: active ? 700 : 400 }}>
                    {label}
                    {count > 0 && (
                      <span style={{ background: active ? 'rgba(255,255,255,0.2)' : 'rgba(249,115,22,0.15)', color: active ? '#fff' : '#f97316', borderRadius: '50%', width: 17, height: 17, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700 }}>{count}</span>
                    )}
                  </motion.button>
                )
              })}
            </div>

            {/* Bookings list */}
            <AnimatePresence mode="popLayout">
              {filtered.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {filtered.map((booking, i) => {
                    const status    = (booking.status ?? 'pending') as BookingStatus
                    const st        = STATUS[status] ?? STATUS.pending
                    const isCancelling = cancellingId === booking._id
                    const tourTitle = booking.tour?.title ?? 'Tour'
                    const tourSlug  = booking.tour?.slug ?? ''
                    const tourImage = booking.tour?.coverImage ?? ''
                    const destName  = booking.destination?.name ?? (booking.tour?.destination?.name ?? '')
                    const duration  = booking.tour?.duration ?? '—'
                    const travDate  = booking.travelDate ? format(new Date(booking.travelDate), 'dd MMM yyyy') : '—'
                    const guests    = (booking.guests?.adults ?? 0) + (booking.guests?.children ?? 0)
                    const ref       = booking.bookingReference ?? '—'
                    const price     = booking.totalPrice ?? 0

                    return (
                      <motion.div
                        key={booking._id}
                        layout
                        initial={{ opacity: 0, y: 22 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: i * 0.07, type: 'spring', stiffness: 200, damping: 20 }}
                        style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden', display: 'flex', transition: 'border-color 0.3s', cursor: 'none' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(249,115,22,0.25)'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'}
                      >
                        {/* Cover image */}
                        {tourImage && (
                          <div style={{ width: 170, flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
                            <img src={tourImage} alt={tourTitle}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                              onMouseEnter={e => (e.target as HTMLElement).style.transform = 'scale(1.06)'}
                              onMouseLeave={e => (e.target as HTMLElement).style.transform = 'scale(1)'}
                            />
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right,transparent,rgba(6,4,15,0.3))' }} />
                          </div>
                        )}

                        {/* Content */}
                        <div style={{ flex: 1, padding: '22px 24px', background: 'rgba(255,255,255,0.01)' }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, marginBottom: 10 }}>
                            <div>
                              {/* Status badge */}
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 2, background: st.bg, border: `1px solid ${st.border}`, marginBottom: 7 }}>
                                {status === 'pending'
                                  ? <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ width: 5, height: 5, borderRadius: '50%', background: st.color }} />
                                  : status === 'confirmed'
                                    ? <FiCheckCircle size={10} color={st.color} />
                                    : <FiXCircle size={10} color={st.color} />
                                }
                                <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: st.color }}>{st.label}</span>
                              </div>
                              <h3 style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 26, letterSpacing: '0.04em', color: '#fff', margin: 0, lineHeight: 1 }}>{tourTitle}</h3>
                            </div>
                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                              <p style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 34, background: 'linear-gradient(135deg,#f97316,#fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1, margin: 0 }}>
                                ₹{price.toLocaleString()}
                              </p>
                              <p style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.1em', marginTop: 3, textTransform: 'uppercase' }}>{guests} People</p>
                            </div>
                          </div>

                          {/* Meta info */}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
                            {[
                              destName  && { icon: <FiMapPin size={10} />,    text: destName },
                              travDate  && { icon: <FiCalendar size={10} />,  text: travDate },
                              duration  && { icon: <FiClock size={10} />,     text: `${duration} days` },
                              guests    && { icon: <FiUsers size={10} />,     text: `${guests} travellers` },
                            ].filter(Boolean).map((item: any) => (
                              <span key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: '"Space Mono",monospace', fontSize: 9, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>
                                <span style={{ color: '#f97316' }}>{item.icon}</span>{item.text}
                              </span>
                            ))}
                          </div>

                          {/* Footer row */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 13 }}>
                            <p style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.1em' }}>
                              REF: <span style={{ color: '#f97316' }}>{ref}</span>
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                              {tourSlug && (
                                <Link to={`/tours/${tourSlug}`} style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: '"Space Mono",monospace', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#f97316', textDecoration: 'none' }}>
                                  View Tour <FiArrowRight size={9} />
                                </Link>
                              )}
                              {status === 'confirmed' && (
                                <motion.button
                                  onClick={() => handleCancel(booking._id)}
                                  disabled={isCancelling}
                                  whileTap={{ scale: 0.95 }}
                                  style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: '"Space Mono",monospace', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#ef4444', background: 'none', border: 'none', cursor: 'none', opacity: isCancelling ? 0.5 : 1 }}
                                >
                                  {isCancelling && <div style={{ width: 9, height: 9, border: '1.5px solid rgba(239,68,68,0.4)', borderTop: '1.5px solid #ef4444', borderRadius: '50%', animation: 'spinSlow 0.8s linear infinite' }} />}
                                  Cancel
                                </motion.button>
                              )}
                              {status === 'completed' && tourSlug && (
                                <Link to={`/booking/${tourSlug}`} style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff', background: 'linear-gradient(135deg,#f97316,#ea580c)', padding: '6px 12px', borderRadius: 2, textDecoration: 'none', fontWeight: 700 }}>
                                  Book Again <FiArrowRight size={9} />
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: 3, padding: '72px 36px', textAlign: 'center', background: 'rgba(255,255,255,0.01)' }}
                >
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    style={{ display: 'inline-block', marginBottom: 20 }}
                  >
                    <GiCompass style={{ color: 'rgba(249,115,22,0.3)', fontSize: 60 }} />
                  </motion.div>
                  <h3 style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 34, letterSpacing: '0.04em', color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>
                    {filter === 'all' ? 'No bookings yet' : `No ${filter} bookings`}
                  </h3>
                  <p style={{ fontFamily: '"Crimson Text",serif', fontStyle: 'italic', fontSize: 15, color: 'rgba(255,255,255,0.25)', marginBottom: 24 }}>
                    {filter === 'all' ? "Your adventures begin the moment you book." : `No ${filter} bookings found.`}
                  </p>
                  <Link to="/tours" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#f97316,#ea580c)', color: '#fff', fontFamily: '"Space Mono",monospace', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, padding: '12px 22px', borderRadius: 2, textDecoration: 'none', boxShadow: '0 8px 28px rgba(249,115,22,0.3)' }}>
                    Explore Tours <FiArrowRight size={12} />
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  )
}