import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCheck, FiCalendar, FiUsers, FiMessageSquare, FiShield, FiArrowRight, FiStar, FiArrowLeft, FiUser } from 'react-icons/fi'
import { GiCompass } from 'react-icons/gi'
import { format } from 'date-fns'
import { tourService, bookingService } from '../services/travelService'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'
import type { Tour } from '../types'

type Step = 'details' | 'review' | 'confirmed'

function AirplaneCursor() {
  const planeRef = useRef<HTMLDivElement>(null)
  const trailRefs = useRef<(HTMLDivElement | null)[]>([])
  const pos = useRef({ x: 0, y: 0 })
  const actual = useRef({ x: 0, y: 0 })
  const prevPos = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>(0)
  const [visible, setVisible] = useState(false)
  const TRAIL = 8

  useEffect(() => {
    const move = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
      setVisible(true)
    }
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
        const lag = (i + 1) * 0.06
        el.style.left = (pos.current.x + (actual.current.x - pos.current.x) * lag) + 'px'
        el.style.top = (pos.current.y + (actual.current.y - pos.current.y) * lag) + 'px'
        el.style.opacity = String((1 - i / TRAIL) * 0.4)
        const sz = `${4 - i * 0.4}px`
        el.style.width = sz
        el.style.height = sz
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
          ref={(el) => {
            trailRefs.current[i] = el
          }}
          style={{
            position: 'fixed',
            borderRadius: '50%',
            background: '#f97316',
            pointerEvents: 'none',
            zIndex: 9997,
            transform: 'translate(-50%,-50%)',
          }}
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

    const stars = Array.from({ length: 160 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.1 + 0.2,
      a: Math.random(),
      speed: Math.random() * 0.003 + 0.001,
    }))

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    let t = 0
    const draw = () => {
      t += 0.005
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      stars.forEach((s) => {
        const f = s.a * (0.3 + 0.5 * Math.abs(Math.sin(t * s.speed + s.a * 8)))
        ctx.beginPath()
        ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${f})`
        ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])
  return <canvas ref={ref} style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />
}

function ConfettiBurst() {
  const pieces = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    color: ['#f97316', '#22c55e', '#38bdf8', '#fbbf24', '#a78bfa', '#fff'][i % 6],
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    dur: Math.random() * 0.8 + 0.6,
    rotate: Math.random() * 720 - 360,
    size: Math.random() * 8 + 4,
  }))
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', borderRadius: 3 }}>
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            borderRadius: p.id % 3 === 0 ? '50%' : 2,
            background: p.color,
            left: `${p.x}%`,
            top: -10,
          }}
          initial={{ y: 0, opacity: 1, rotate: 0 }}
          animate={{ y: 500, opacity: 0, rotate: p.rotate }}
          transition={{ duration: p.dur, delay: p.delay, ease: 'easeIn' }}
        />
      ))}
    </div>
  )
}

const TRUST = [
  { icon: '🔒', label: 'SSL Secured' },
  { icon: '💳', label: 'Safe Payment' },
  { icon: '✈️', label: 'IATA Certified' },
  { icon: '⭐', label: '4.9 Rated' },
]

export default function BookingPage() {
  const params = useParams<{ tourId: string }>()
  const tourSlug = params.tourId
  const navigate = useNavigate()
  const location = useLocation()
  const [tour, setTour] = useState<Tour | null>(null)
  const [loading, setLoading] = useState(false)
  const [tourLoading, setTourLoading] = useState(true)
  const [tourError, setTourError] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null)

  const [step, setStep] = useState<Step>('details')
  const [selectedDate, setSelectedDate] = useState('')
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)

  // Contact info state
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [specialRequests, setSpecialRequests] = useState('')

  const { register } = useForm()

  // Fetch tour on mount
  useEffect(() => {
    if (!tourSlug) {
      setTourError('No tour slug provided')
      setTourLoading(false)
      return
    }

    const fetchTour = async () => {
      try {
        setTourLoading(true)
        setTourError(null)
        // Uses /api/tours/id/{slug} — backend now handles both slugs and ObjectIds
        const data = await tourService.getById(tourSlug)
        setTour(data)
        setSelectedDate(data.startDates?.[0] || '')
      } catch (err: any) {
        console.error('Failed to fetch tour:', err)
        setTourError(err.message || 'Failed to load tour details')
      } finally {
        setTourLoading(false)
      }
    }

    fetchTour()
  }, [tourSlug])

  if (tourLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#fdfbf7', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, cursor: 'none' }}>
        <AirplaneCursor />
        <div style={{ width: 60, height: 60, border: '2px solid rgba(249,115,22,0.3)', borderTop: '2px solid #f97316', borderRadius: '50%', animation: 'spinSlow 0.8s linear infinite' }} />
        <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: '"Space Mono",monospace' }}>Loading tour details...</p>
      </div>
    )
  }

  if (!tour || tourError) {
    return (
      <div style={{ minHeight: '100vh', background: '#fdfbf7', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, cursor: 'none' }}>
        <AirplaneCursor />
        <GiCompass style={{ color: '#f97316', fontSize: 64 }} />
        <h2 style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 40, letterSpacing: '0.05em', color: 'rgba(255,255,255,0.4)' }}>
          {tourError || 'Tour not found'}
        </h2>
        <Link to="/tours" style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', color: '#fff', fontFamily: '"Space Mono",monospace', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, padding: '12px 22px', borderRadius: 2, textDecoration: 'none' }}>
          Browse Tours
        </Link>
      </div>
    )
  }

  const totalParticipants = adults + children
  const pricePerPerson = tour.discountPrice ?? tour.price ?? 0
  const total = pricePerPerson * totalParticipants
  const startDates = tour.startDates ?? []
  const dateToFormat = selectedDate || startDates[0] || ''
  const formattedStartDate = dateToFormat
    ? format(new Date(dateToFormat), 'dd MMM yyyy')
    : 'TBA'

  const onConfirm = async () => {
    // Check authentication first
    const { isAuthenticated, token } = useAuthStore.getState()
    if (!isAuthenticated || !token) {
      toast.error('Please log in to complete your booking')
      navigate('/login', { state: { from: location.pathname } })
      return
    }

    // Validate contact info
    if (!contactName.trim() || !contactEmail.trim() || !contactPhone.trim()) {
      toast.error('Please fill in all contact information fields')
      setStep('details')
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(contactEmail)) {
      toast.error('Please enter a valid email address')
      return
    }

    // Validate at least 1 participant
    if (totalParticipants < 1) {
      toast.error('Please select at least 1 participant')
      setStep('details')
      return
    }

    try {
      setLoading(true)

      const bookingData = {
        tourId: tour._id,
        travelDate: selectedDate,
        guests: {
          adults,
          children,
          infants: 0,
        },
        contactInfo: {
          name: contactName,
          email: contactEmail,
          phone: contactPhone,
        },
        specialRequests: specialRequests || '',
      }

      const result = await bookingService.create(bookingData)

      setLoading(false)
      setShowConfetti(true)
      setConfirmedBooking(result)
      setStep('confirmed')

      toast.success('Booking confirmed! 🎉')

      // Confetti fades after 3s — user clicks "View My Bookings" when ready
      setTimeout(() => setShowConfetti(false), 3000)
    } catch (err: any) {
      setLoading(false)
      const errorMsg = err.message || 'Failed to create booking'
      toast.error(errorMsg)
      console.error('Booking error:', err)
    }
  }

  const STEPS = [
    { key: 'details', label: 'Trip Details' },
    { key: 'review', label: 'Review & Pay' },
    { key: 'confirmed', label: 'Confirmed' },
  ]

  const bookingRef = confirmedBooking?.bookingReference || 'PV-' + Date.now().toString().slice(-6)

  return (
    <div style={{ minHeight: '100vh', background: '#fdfbf7', color: '#fff', fontFamily: '"Crimson Text",Georgia,serif', paddingTop: 80, cursor: 'none' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');*,*::before,*::after{box-sizing:border-box;cursor:none!important;}body{overflow-x:hidden;background:#fdfbf7;}::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-track{background:#fdfbf7;}::-webkit-scrollbar-thumb{background:rgba(249,115,22,0.4);border-radius:2px;}@keyframes spinSlow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}.book-input{width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);outline:none;padding:12px 16px;font-family:"Space Mono",monospace;font-size:10px;letter-spacing:0.06em;color:#fff;border-radius:2px;transition:border-color 0.3s,background 0.3s;resize:none;}.book-input::placeholder{color:rgba(255,255,255,0.18);}.book-input:focus{border-color:rgba(249,115,22,0.45);background:rgba(249,115,22,0.04);}`}</style>
      <StarCanvas />
      <AirplaneCursor />
      <div style={{ position: 'fixed', width: 600, height: 600, top: -150, right: -100, borderRadius: '50%', background: 'radial-gradient(circle,rgba(249,115,22,0.06),transparent)', filter: 'blur(100px)', opacity: 1, pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 clamp(20px,4vw,60px) 80px', position: 'relative', zIndex: 1 }}>
        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 44 }}>
          {STEPS.map((s, i) => {
            const cur = STEPS.findIndex((x) => x.key === step)
            const done = cur > i
            const active = s.key === step
            return (
              <div key={s.key} style={{ display: 'flex', alignItems: 'center' }}>
                <motion.div
                  animate={{
                    background: active ? '#f97316' : done ? 'rgba(249,115,22,0.12)' : 'transparent',
                    borderColor: active ? '#f97316' : done ? 'rgba(249,115,22,0.5)' : 'rgba(255,255,255,0.1)',
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 16px',
                    borderRadius: 2,
                    fontFamily: '"Space Mono",monospace',
                    fontSize: 9,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    border: '1px solid',
                    color: active ? '#fff' : done ? '#f97316' : 'rgba(255,255,255,0.3)',
                    fontWeight: active ? 700 : 400,
                    transition: 'all 0.4s',
                  }}
                >
                  <AnimatePresence mode="wait">
                    {done ? (
                      <motion.div key="ck" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <FiCheck size={10} />
                      </motion.div>
                    ) : (
                      <motion.span key="n" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        {i + 1}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {s.label}
                </motion.div>
                {i < STEPS.length - 1 && <div style={{ width: 28, height: 1, background: cur > i ? 'rgba(249,115,22,0.4)' : 'rgba(255,255,255,0.07)', margin: '0 3px', transition: 'background 0.5s' }} />}
              </div>
            )
          })}
        </div>

        {/* Confirmed */}
        {step === 'confirmed' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            style={{ border: '1px solid rgba(249,115,22,0.2)', borderRadius: 3, padding: '56px 36px', textAlign: 'center', position: 'relative', overflow: 'hidden', background: 'rgba(249,115,22,0.03)' }}
          >
            {showConfetti && <ConfettiBurst />}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
              style={{ width: 88, height: 88, borderRadius: '50%', border: '1px solid rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 22px', position: 'relative' }}
            >
              <FiCheck color="#22c55e" size={34} />
              <motion.div
                style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid rgba(34,197,94,0.4)' }}
                animate={{ scale: [1, 1.6, 2], opacity: [0.6, 0.2, 0] }}
                transition={{ duration: 1.5, repeat: 3 }}
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h2 style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 52, letterSpacing: '0.04em', color: '#fff', marginBottom: 8, lineHeight: 1 }}>BOOKING CONFIRMED!</h2>
              <p style={{ fontFamily: '"Crimson Text",serif', fontStyle: 'italic', fontSize: 17, color: 'rgba(255,255,255,0.45)', marginBottom: 14 }}>Your adventure is booked. A confirmation email has been sent to {contactEmail}</p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: 2, padding: '8px 18px', marginBottom: 28 }}>
                <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 11, letterSpacing: '0.15em', color: '#f97316', fontWeight: 700 }}>Booking ref: {bookingRef}</span>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: 3, padding: '18px 22px', marginBottom: 24, textAlign: 'left', background: 'rgba(255,255,255,0.02)' }}
            >
              {[
                ['Tour', tour.title],
                ['Date', formattedStartDate],
                ['Participants', `${totalParticipants} people (${adults} adults, ${children} children)`],
                ['Total Paid', `$${total.toLocaleString()}`],
              ].map(([l, v]) => (
                <div key={l as string} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 9, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.35)' }}>{l}</span>
                  <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 10, color: '#fff', fontWeight: 700 }}>{v}</span>
                </div>
              ))}
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                to="/bookings"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'linear-gradient(135deg,#f97316,#ea580c)',
                  color: '#fff',
                  fontFamily: '"Space Mono",monospace',
                  fontSize: 10,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  padding: '13px 22px',
                  borderRadius: 2,
                  textDecoration: 'none',
                  boxShadow: '0 8px 28px rgba(249,115,22,0.35)',
                }}
              >
                View My Bookings <FiArrowRight size={12} />
              </Link>
              <Link
                to="/tours"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'rgba(255,255,255,0.55)',
                  fontFamily: '"Space Mono",monospace',
                  fontSize: 10,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  padding: '13px 22px',
                  borderRadius: 2,
                  textDecoration: 'none',
                }}
              >
                Explore More
              </Link>
            </motion.div>
          </motion.div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16, alignItems: 'start' }}>
            <div>
              <AnimatePresence mode="wait">
                {step === 'details' && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 18 }}
                    style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 3, padding: '28px', background: 'rgba(255,255,255,0.02)' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f97316', boxShadow: '0 0 8px #f97316' }} />
                      <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)' }}>Trip Details</span>
                    </div>

                    {/* Date */}
                    <div style={{ marginBottom: 24 }}>
                      <label style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.32)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                        <FiCalendar size={10} color="#f97316" />
                        Start Date
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 7 }}>
                        {startDates.length > 0 ? startDates.map((date) => (
                          <motion.button
                            key={date}
                            onClick={() => setSelectedDate(date)}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            style={{
                              padding: '11px 7px',
                              borderRadius: 2,
                              fontFamily: '"Space Mono",monospace',
                              fontSize: 9,
                              letterSpacing: '0.06em',
                              cursor: 'none',
                              transition: 'all 0.2s',
                              background: selectedDate === date ? '#f97316' : 'transparent',
                              border: selectedDate === date ? '1px solid #f97316' : '1px solid rgba(255,255,255,0.08)',
                              color: selectedDate === date ? '#fff' : 'rgba(255,255,255,0.4)',
                              fontWeight: selectedDate === date ? 700 : 400,
                            }}
                          >
                            {format(new Date(date), 'dd MMM yyyy')}
                          </motion.button>
                        )) : (
                          <span style={{ color: 'rgba(255,255,255,0.45)', fontFamily: '"Space Mono",monospace', fontSize: 10 }}>Dates not available</span>
                        )}
                      </div>
                    </div>

                    {/* Participants */}
                    <div style={{ marginBottom: 24 }}>
                      <label style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.32)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                        <FiUsers size={10} color="#f97316" />
                        Participants
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                        {/* Adults */}
                        <div>
                          <label style={{ fontFamily: '"Space Mono",monospace', fontSize: 7, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', display: 'block', marginBottom: 8 }}>Adults</label>
                          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                            <motion.button
                              onClick={() => setAdults(Math.max(1, adults - 1))}
                              whileTap={{ scale: 0.9 }}
                              style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.04)', border: 'none', fontFamily: '"Space Mono",monospace', fontSize: 14, color: '#f97316', cursor: 'none' }}
                            >
                              −
                            </motion.button>
                            <motion.span
                              key={adults}
                              initial={{ scale: 1.3, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              style={{ padding: '8px 14px', fontFamily: '"Bebas Neue",sans-serif', fontSize: 18, letterSpacing: '0.04em', color: '#fff', flex: 1, textAlign: 'center' }}
                            >
                              {adults}
                            </motion.span>
                            <motion.button
                              onClick={() => setAdults(Math.min(tour.groupSize?.max ?? 1, adults + 1))}
                              whileTap={{ scale: 0.9 }}
                              style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.04)', border: 'none', fontFamily: '"Space Mono",monospace', fontSize: 14, color: '#f97316', cursor: 'none' }}
                            >
                              +
                            </motion.button>
                          </div>
                        </div>
                        {/* Children */}
                        <div>
                          <label style={{ fontFamily: '"Space Mono",monospace', fontSize: 7, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', display: 'block', marginBottom: 8 }}>Children</label>
                          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                            <motion.button
                              onClick={() => setChildren(Math.max(0, children - 1))}
                              whileTap={{ scale: 0.9 }}
                              style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.04)', border: 'none', fontFamily: '"Space Mono",monospace', fontSize: 14, color: '#f97316', cursor: 'none' }}
                            >
                              −
                            </motion.button>
                            <motion.span
                              key={children}
                              initial={{ scale: 1.3, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              style={{ padding: '8px 14px', fontFamily: '"Bebas Neue",sans-serif', fontSize: 18, letterSpacing: '0.04em', color: '#fff', flex: 1, textAlign: 'center' }}
                            >
                              {children}
                            </motion.span>
                            <motion.button
                              onClick={() => setChildren(Math.min((tour.groupSize?.max ?? 1) - adults, children + 1))}
                              whileTap={{ scale: 0.9 }}
                              style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.04)', border: 'none', fontFamily: '"Space Mono",monospace', fontSize: 14, color: '#f97316', cursor: 'none' }}
                            >
                              +
                            </motion.button>
                          </div>
                        </div>
                      </div>
                      <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 9, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em' }}>MAX {tour.groupSize?.max ?? 1} total</span>
                      <motion.div
                        key={total}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginTop: 12, border: '1px solid rgba(249,115,22,0.2)', borderRadius: 2, padding: '9px 16px', background: 'rgba(249,115,22,0.06)' }}
                      >
                        <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 9, color: 'rgba(249,115,22,0.6)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Subtotal</span>
                        <span style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 26, background: 'linear-gradient(135deg,#f97316,#fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                          ${total.toLocaleString()}
                        </span>
                      </motion.div>
                    </div>

                    {/* Contact Information */}
                    <div style={{ marginBottom: 24 }}>
                      <label style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.32)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                        <FiUser size={10} color="#f97316" />
                        Contact Information
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
                        <input
                          type="text"
                          placeholder="Full Name"
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          className="book-input"
                          style={{ fontFamily: '"Space Mono",monospace', fontSize: 10, letterSpacing: '0.06em', padding: '12px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#fff', borderRadius: 2, outline: 'none' }}
                        />
                        <input
                          type="email"
                          placeholder="Email Address"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          className="book-input"
                          style={{ fontFamily: '"Space Mono",monospace', fontSize: 10, letterSpacing: '0.06em', padding: '12px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#fff', borderRadius: 2, outline: 'none' }}
                        />
                        <input
                          type="tel"
                          placeholder="Phone Number"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          className="book-input"
                          style={{ fontFamily: '"Space Mono",monospace', fontSize: 10, letterSpacing: '0.06em', padding: '12px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#fff', borderRadius: 2, outline: 'none' }}
                        />
                      </div>
                    </div>

                    {/* Special Requests */}
                    <div style={{ marginBottom: 24 }}>
                      <label style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.32)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                        <FiMessageSquare size={10} color="#f97316" />
                        Special Requests <span style={{ color: 'rgba(255,255,255,0.18)', textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
                      </label>
                      <textarea
                        {...register('specialRequests')}
                        rows={4}
                        placeholder="Dietary requirements, accessibility needs, celebrations..."
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        className="book-input"
                      />
                    </div>

                    <motion.button
                      onClick={() => setStep('review')}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 10,
                        background: 'linear-gradient(135deg,#f97316,#ea580c)',
                        border: 'none',
                        borderRadius: 2,
                        padding: '15px',
                        fontFamily: '"Space Mono",monospace',
                        fontSize: 10,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                        color: '#fff',
                        cursor: 'none',
                        boxShadow: '0 8px 28px rgba(249,115,22,0.35)',
                      }}
                    >
                      Continue to Review <FiArrowRight size={12} />
                    </motion.button>
                  </motion.div>
                )}

                {step === 'review' && (
                  <motion.div
                    key="review"
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -18 }}
                    style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 3, padding: '28px', background: 'rgba(255,255,255,0.02)' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
                      <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)' }}>Review Your Booking</span>
                    </div>

                    <div style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: 2, padding: '0 18px', marginBottom: 18, background: 'rgba(255,255,255,0.01)' }}>
                      {[
                        ['Tour', tour.title],
                        ['Destination', tour.destination ? `${tour.destination.name}` : 'N/A'],
                        ['Start Date', formattedStartDate],
                        ['Duration', `${tour.duration} days`],
                        ['Participants', `${totalParticipants} people (${adults} adults, ${children} children)`],
                        ['Contact', contactName],
                        ['Email', contactEmail],
                        ['Price/person', `$${pricePerPerson.toLocaleString()}`],
                      ].map(([l, v]) => (
                        <div key={l as string} style={{ display: 'flex', justifyContent: 'space-between', padding: '13px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 9, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)' }}>{l}</span>
                          <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 10, color: '#fff' }}>{v}</span>
                        </div>
                      ))}
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0 13px' }}>
                        <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#f97316', fontWeight: 700 }}>TOTAL</span>
                        <span style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 32, background: 'linear-gradient(135deg,#f97316,#fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                          ${total.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 12, border: '1px solid rgba(34,197,94,0.15)', borderRadius: 2, padding: '13px 16px', marginBottom: 16, background: 'rgba(34,197,94,0.04)' }}>
                      <FiShield color="#22c55e" size={15} style={{ marginTop: 2, flexShrink: 0 }} />
                      <p style={{ fontFamily: '"Space Mono",monospace', fontSize: 9, color: 'rgba(34,197,94,0.75)', lineHeight: 1.7, letterSpacing: '0.05em', margin: 0 }}>
                        Free cancellation up to 30 days before departure. Your payment is protected by our secure booking guarantee.
                      </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 7, marginBottom: 20 }}>
                      {TRUST.map((b) => (
                        <div key={b.label} style={{ textAlign: 'center', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 2, padding: '10px 5px', background: 'rgba(255,255,255,0.01)' }}>
                          <span style={{ fontSize: 17 }}>{b.icon}</span>
                          <p style={{ fontFamily: '"Space Mono",monospace', fontSize: 7, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', margin: '6px 0 0', lineHeight: 1.3 }}>
                            {b.label}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: 9 }}>
                      <motion.button
                        onClick={() => setStep('details')}
                        whileTap={{ scale: 0.97 }}
                        style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 8,
                          border: '1px solid rgba(255,255,255,0.1)',
                          background: 'transparent',
                          borderRadius: 2,
                          padding: '13px',
                          fontFamily: '"Space Mono",monospace',
                          fontSize: 9,
                          letterSpacing: '0.15em',
                          textTransform: 'uppercase',
                          color: 'rgba(255,255,255,0.4)',
                          cursor: 'none',
                        }}
                      >
                        <FiArrowLeft size={11} />
                        Back
                      </motion.button>
                      <motion.button
                        onClick={onConfirm}
                        disabled={loading}
                        whileHover={!loading ? { y: -2 } : {}}
                        style={{
                          flex: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 10,
                          background: loading ? 'rgba(249,115,22,0.5)' : 'linear-gradient(135deg,#f97316,#ea580c)',
                          border: 'none',
                          borderRadius: 2,
                          padding: '13px',
                          fontFamily: '"Space Mono",monospace',
                          fontSize: 10,
                          letterSpacing: '0.2em',
                          textTransform: 'uppercase',
                          fontWeight: 700,
                          color: '#fff',
                          cursor: 'none',
                          boxShadow: loading ? 'none' : '0 8px 28px rgba(249,115,22,0.35)',
                        }}
                      >
                        {loading ? (
                          <>
                            <div style={{ width: 15, height: 15, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spinSlow 0.8s linear infinite' }} />
                            Confirming...
                          </>
                        ) : (
                          'Confirm & Book'
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 3, overflow: 'hidden', position: 'sticky', top: 100, background: 'rgba(255,255,255,0.01)' }}
            >
              <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
                <img src={tour.coverImage} alt={tour.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,4,15,0.8) 0%, transparent 60%)' }} />
                <div style={{ position: 'absolute', bottom: 10, left: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <FiStar size={10} color="#fbbf24" style={{ fill: '#fbbf24' }} />
                  <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 10, color: '#fff', fontWeight: 700 }}>{tour.rating ?? '4.9'}</span>
                </div>
              </div>
              <div style={{ padding: '18px' }}>
                <h3 style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 22, letterSpacing: '0.05em', color: '#fff', margin: '0 0 3px', lineHeight: 1 }}>
                  {tour.title}
                </h3>
                <p style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', margin: '0 0 14px' }}>
                  {tour.destination?.name}
                </p>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>
                      ${pricePerPerson.toLocaleString()} × {totalParticipants}
                    </span>
                    <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 10, color: '#f97316', fontWeight: 700 }}>${total.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, color: 'rgba(255,255,255,0.25)' }}>Taxes & fees</span>
                    <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, color: 'rgba(255,255,255,0.35)' }}>Included</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
