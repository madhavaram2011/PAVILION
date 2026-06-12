import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiUser, FiMail, FiSave, FiCamera, FiLock, FiEye, FiEyeOff, FiBookOpen, FiHeart, FiSettings, FiCheck, FiArrowRight } from 'react-icons/fi'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

type Tab = 'profile' | 'security' | 'preferences'

function StarCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return
    const ctx = canvas.getContext('2d')!; let raf: number
    const stars = Array.from({ length: 140 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.1 + 0.2, a: Math.random(), speed: Math.random() * 0.003 + 0.001 }))
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize(); window.addEventListener('resize', resize)
    let t = 0
    const draw = () => {
      t += 0.005; ctx.clearRect(0, 0, canvas.width, canvas.height)
      stars.forEach(s => { const f = s.a * (0.3 + 0.5 * Math.abs(Math.sin(t * s.speed + s.a * 8))); ctx.beginPath(); ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(255,255,255,${f})`; ctx.fill() })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={ref} style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, updateUser, logout } = useAuthStore()
  const [tab, setTab] = useState<Tab>('profile')
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [oldPass, setOldPass] = useState('')
  const [newPass, setNewPass] = useState('')

  const handleSaveProfile = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    updateUser({ name, email }); setSaving(false); setSaved(true)
    toast.success('Profile updated!')
    setTimeout(() => setSaved(false), 2500)
  }

  const handleChangePassword = async () => {
    if (!oldPass || newPass.length < 8) { toast.error('New password must be at least 8 characters'); return }
    setSaving(true); await new Promise(r => setTimeout(r, 800))
    toast.success('Password changed!'); setOldPass(''); setNewPass(''); setSaving(false)
  }

  const initials = (user?.name ?? 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'profile', label: 'Profile', icon: FiUser },
    { key: 'security', label: 'Security', icon: FiLock },
    { key: 'preferences', label: 'Preferences', icon: FiSettings },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#03060f', color: '#f0ebe0', fontFamily: '"Crimson Text",Georgia,serif', paddingTop: 80 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #03060f; }
        ::-webkit-scrollbar-thumb { background: rgba(201,169,110,0.3); border-radius: 2px; }
        @keyframes spinSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .prof-input { width:100%; background:rgba(255,255,255,0.04); border:1px solid rgba(201,169,110,0.12); outline:none; padding:12px 16px; font-family:"Space Mono",monospace; font-size:11px; letter-spacing:0.06em; color:#f0ebe0; border-radius:2px; transition:border-color 0.3s,background 0.3s; }
        .prof-input::placeholder { color:rgba(240,235,224,0.2); }
        .prof-input:focus { border-color:rgba(201,169,110,0.4); background:rgba(201,169,110,0.04); }
        .prof-input:disabled { opacity:0.35; cursor:not-allowed; }
      `}</style>

      <StarCanvas />
      <div style={{ position: 'fixed', width: 500, height: 500, top: -100, right: -100, borderRadius: '50%', background: 'radial-gradient(circle,#1a2a4a,transparent)', filter: 'blur(100px)', opacity: 0.1, pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 clamp(20px,4vw,60px) 80px', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontFamily: '"Space Mono",monospace', fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.5)', marginBottom: 10 }}>Account</p>
          <h1 style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 'clamp(3rem,6vw,6rem)', letterSpacing: '0.03em', lineHeight: 0.9, color: '#f0ebe0', marginBottom: 20 }}>MY PROFILE</h1>
          <div style={{ height: 1, background: 'linear-gradient(90deg, rgba(201,169,110,0.4), transparent)', width: 200 }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 20 }}>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Avatar card */}
            <div style={{ border: '1px solid rgba(201,169,110,0.12)', borderRadius: 2, padding: '28px 20px', textAlign: 'center', background: 'rgba(8,14,32,0.6)' }}>
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: 16 }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(201,169,110,0.4),rgba(201,169,110,0.1))', border: '1px solid rgba(201,169,110,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                  {user?.avatar
                    ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    : <span style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 28, letterSpacing: '0.05em', color: '#c9a96e' }}>{initials}</span>}
                </div>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  style={{ position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, background: '#c9a96e', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <FiCamera size={12} color="#03060f" />
                </motion.button>
              </div>
              <h2 style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 22, letterSpacing: '0.06em', color: '#f0ebe0', margin: '0 0 4px' }}>{user?.name}</h2>
              <p style={{ fontFamily: '"Space Mono",monospace', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.6)', margin: 0 }}>{user?.role} member</p>
              <div style={{ marginTop: 16, border: '1px solid rgba(201,169,110,0.15)', borderRadius: 2, padding: '10px', background: 'rgba(201,169,110,0.05)' }}>
                <p style={{ fontFamily: '"Space Mono",monospace', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.5)', margin: '0 0 4px' }}>Member since</p>
                <p style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 20, color: '#c9a96e', margin: 0, letterSpacing: '0.05em' }}>{user?.createdAt ? new Date(user.createdAt).getFullYear() : '2024'}</p>
              </div>
            </div>

            {/* Quick links */}
            <div style={{ border: '1px solid rgba(201,169,110,0.12)', borderRadius: 2, overflow: 'hidden', background: 'rgba(8,14,32,0.6)' }}>
              {[
                { to: '/bookings', icon: FiBookOpen, label: 'My Bookings' },
                { to: '/tours', icon: FiHeart, label: 'Wishlist' },
              ].map(({ to, icon: Icon, label }) => (
                <Link key={to} to={to} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', textDecoration: 'none', borderBottom: '1px solid rgba(201,169,110,0.06)', transition: 'background 0.2s', color: 'rgba(240,235,224,0.5)', fontFamily: '"Space Mono",monospace', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(201,169,110,0.06)'; (e.currentTarget as HTMLElement).style.color = '#c9a96e' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'rgba(240,235,224,0.5)' }}>
                  <Icon size={14} />{label}<FiArrowRight size={10} style={{ marginLeft: 'auto', opacity: 0.4 }} />
                </Link>
              ))}
              <button
                onClick={() => {
                  logout()
                  navigate('/')
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 18px',
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  borderTop: '1px solid rgba(201,169,110,0.06)',
                  color: 'rgba(239,68,68,0.7)',
                  fontFamily: '"Space Mono",monospace',
                  fontSize: 10,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
                onMouseEnter={e => (e.currentTarget).style.color = '#ef4444'}
                onMouseLeave={e => (e.currentTarget).style.color = 'rgba(239,68,68,0.7)'}
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Main panel */}
          <div>
            {/* Tab bar */}
            <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
              {TABS.map(({ key, label, icon: Icon }) => (
                <motion.button key={key} onClick={() => setTab(key)} whileHover={tab !== key ? { y: -1 } : {}}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', borderRadius: 2, fontFamily: '"Space Mono",monospace', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s', background: tab === key ? '#c9a96e' : 'rgba(8,14,32,0.6)', border: tab === key ? '1px solid #c9a96e' : '1px solid rgba(201,169,110,0.12)', color: tab === key ? '#03060f' : 'rgba(240,235,224,0.4)', fontWeight: tab === key ? 700 : 400 }}>
                  <Icon size={13} />{label}
                </motion.button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {/* Profile tab */}
              {tab === 'profile' && (
                <motion.div key="profile" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.25 }}
                  style={{ border: '1px solid rgba(201,169,110,0.12)', borderRadius: 2, padding: '32px', background: 'rgba(8,14,32,0.6)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
                    <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 9, letterSpacing: '0.3em', color: 'rgba(240,235,224,0.25)' }}>◈ PERSONAL INFORMATION</span>
                    <div style={{ flex: 1, height: 1, background: 'rgba(201,169,110,0.08)' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {[
                      { label: 'Full Name', icon: FiUser, val: name, set: setName, type: 'text', ph: 'Your full name' },
                      { label: 'Email Address', icon: FiMail, val: email, set: setEmail, type: 'email', ph: 'your@email.com' },
                    ].map(({ label, icon: Icon, val, set, type, ph }) => (
                      <div key={label}>
                        <label style={{ fontFamily: '"Space Mono",monospace', fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(240,235,224,0.4)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                          <Icon size={11} color="#c9a96e" />{label}
                        </label>
                        <input type={type} value={val} onChange={e => set(e.target.value)} placeholder={ph} className="prof-input" />
                      </div>
                    ))}
                    <div>
                      <label style={{ fontFamily: '"Space Mono",monospace', fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(240,235,224,0.4)', display: 'block', marginBottom: 10 }}>Member Since</label>
                      <input type="text" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'} disabled className="prof-input" />
                    </div>
                  </div>
                  <motion.button onClick={handleSaveProfile} disabled={saving} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                    style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 10, background: '#c9a96e', border: 'none', borderRadius: 2, padding: '14px 28px', fontFamily: '"Space Mono",monospace', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, color: '#03060f', cursor: saving ? 'default' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                    <AnimatePresence mode="wait">
                      {saving ? <motion.div key="spin" initial={{ scale: 0 }} animate={{ scale: 1 }}><div style={{ width: 14, height: 14, border: '2px solid rgba(3,6,15,0.3)', borderTop: '2px solid #03060f', borderRadius: '50%', animation: 'spinSlow 0.8s linear infinite' }} /></motion.div>
                        : saved ? <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }}><FiCheck size={13} /></motion.div>
                          : <motion.div key="save" initial={{ scale: 0 }} animate={{ scale: 1 }}><FiSave size={13} /></motion.div>}
                    </AnimatePresence>
                    {saved ? 'Saved!' : 'Save Changes'}
                  </motion.button>
                </motion.div>
              )}

              {/* Security tab */}
              {tab === 'security' && (
                <motion.div key="security" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.25 }}
                  style={{ border: '1px solid rgba(201,169,110,0.12)', borderRadius: 2, padding: '32px', background: 'rgba(8,14,32,0.6)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
                    <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 9, letterSpacing: '0.3em', color: 'rgba(240,235,224,0.25)' }}>◈ CHANGE PASSWORD</span>
                    <div style={{ flex: 1, height: 1, background: 'rgba(201,169,110,0.08)' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {[
                      { label: 'Current Password', val: oldPass, set: setOldPass, show: showOld, toggle: () => setShowOld(s => !s) },
                      { label: 'New Password', val: newPass, set: setNewPass, show: showNew, toggle: () => setShowNew(s => !s) },
                    ].map(({ label, val, set, show, toggle }) => (
                      <div key={label}>
                        <label style={{ fontFamily: '"Space Mono",monospace', fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(240,235,224,0.4)', display: 'block', marginBottom: 10 }}>{label}</label>
                        <div style={{ position: 'relative' }}>
                          <input type={show ? 'text' : 'password'} value={val} onChange={e => set(e.target.value)} placeholder="••••••••" className="prof-input" style={{ paddingRight: 44 }} />
                          <button onClick={toggle} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(240,235,224,0.3)', cursor: 'pointer' }}>
                            {show ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                          </button>
                        </div>
                      </div>
                    ))}
                    {newPass.length > 0 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div style={{ display: 'flex', gap: 4 }}>
                          {[1, 2, 3, 4].map(i => {
                            const str = newPass.length < 6 ? 1 : newPass.length < 10 ? 2 : /[A-Z]/.test(newPass) && /[0-9]/.test(newPass) ? 4 : 3
                            const colors = ['', '#ef4444', '#f59e0b', '#4ade80', '#10b981']
                            return <div key={i} style={{ height: 2, flex: 1, borderRadius: 2, background: i <= str ? colors[str] : 'rgba(255,255,255,0.08)', transition: 'background 0.3s' }} />
                          })}
                        </div>
                      </motion.div>
                    )}
                  </div>
                  <motion.button onClick={handleChangePassword} disabled={saving} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                    style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 10, background: '#c9a96e', border: 'none', borderRadius: 2, padding: '14px 28px', fontFamily: '"Space Mono",monospace', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, color: '#03060f', cursor: 'pointer' }}>
                    {saving ? <div style={{ width: 14, height: 14, border: '2px solid rgba(3,6,15,0.3)', borderTop: '2px solid #03060f', borderRadius: '50%', animation: 'spinSlow 0.8s linear infinite' }} /> : <FiLock size={13} />}
                    Update Password
                  </motion.button>
                </motion.div>
              )}

              {/* Preferences tab */}
              {tab === 'preferences' && (
                <motion.div key="preferences" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.25 }}
                  style={{ border: '1px solid rgba(201,169,110,0.12)', borderRadius: 2, padding: '32px', background: 'rgba(8,14,32,0.6)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
                    <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 9, letterSpacing: '0.3em', color: 'rgba(240,235,224,0.25)' }}>◈ NOTIFICATIONS & PREFERENCES</span>
                    <div style={{ flex: 1, height: 1, background: 'rgba(201,169,110,0.08)' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {[
                      { label: 'Email me about new tours', sub: 'Get notified when new tours are added', defaultOn: true },
                      { label: 'Booking confirmations', sub: 'Receive confirmation emails', defaultOn: true },
                      { label: 'Special offers & discounts', sub: 'Exclusive deals for members', defaultOn: false },
                      { label: 'Travel tips & destination guides', sub: 'Weekly newsletter', defaultOn: false },
                    ].map(({ label, sub, defaultOn }, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 0', borderBottom: '1px solid rgba(201,169,110,0.06)' }}>
                        <div>
                          <p style={{ fontFamily: '"Space Mono",monospace', fontSize: 11, color: 'rgba(240,235,224,0.7)', letterSpacing: '0.06em', margin: '0 0 4px' }}>{label}</p>
                          <p style={{ fontFamily: '"Crimson Text",serif', fontStyle: 'italic', fontSize: 14, color: 'rgba(240,235,224,0.3)', margin: 0 }}>{sub}</p>
                        </div>
                        <label style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer', flexShrink: 0, marginLeft: 20 }}>
                          <input type="checkbox" defaultChecked={defaultOn} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} className="toggle-cb" />
                          <div style={{ width: 40, height: 20, background: defaultOn ? '#c9a96e' : 'rgba(255,255,255,0.08)', borderRadius: 10, transition: 'background 0.3s', position: 'relative' }}>
                            <div style={{ position: 'absolute', top: 2, left: defaultOn ? 22 : 2, width: 16, height: 16, borderRadius: '50%', background: '#f0ebe0', transition: 'left 0.3s', boxShadow: '0 1px 4px rgba(0,0,0,0.4)' }} />
                          </div>
                        </label>
                      </motion.div>
                    ))}
                  </div>
                  <motion.button onClick={() => toast.success('Preferences saved!')} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                    style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 10, background: '#c9a96e', border: 'none', borderRadius: 2, padding: '14px 28px', fontFamily: '"Space Mono",monospace', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, color: '#03060f', cursor: 'pointer' }}>
                    <FiSave size={13} />Save Preferences
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}