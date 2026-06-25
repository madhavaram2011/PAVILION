import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700&family=DM+Mono:wght@300;400&display=swap');
  .pav-nav-link {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    text-decoration: none;
    transition: color 0.25s;
    position: relative;
  }
  .pav-nav-link::after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 0;
    width: 0;
    height: 1px;
    background: #b8892a;
    transition: width 0.3s;
  }
  .pav-nav-link:hover::after,
  .pav-nav-link.active::after { width: 100%; }
`

const NAV_LINKS = [
  { label: 'Destinations', path: '/destinations' },
  { label: 'Tours', path: '/tours' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { user } = useAuthStore()

  const isHome = location.pathname === '/'
  const solid = !isHome || scrolled

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <style>{CSS}</style>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 500,
        height: solid ? 62 : 76,
        padding: '0 clamp(24px,5vw,80px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: solid ? 'rgba(253,251,247,0.97)' : 'transparent',
        backdropFilter: solid ? 'blur(20px)' : 'none',
        borderBottom: solid ? '1px solid rgba(184,137,42,0.14)' : 'none',
        boxShadow: solid ? '0 1px 0 rgba(184,137,42,0.06)' : 'none',
        transition: 'height 0.4s ease, background 0.4s ease, border-color 0.4s ease',
      }}>

        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <div style={{
            width: 32, height: 32,
            border: '1px solid rgba(184,137,42,0.45)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', flexShrink: 0,
          }}>
            <div style={{ position: 'absolute', inset: 5, border: '1px solid rgba(184,137,42,0.2)', borderRadius: '50%' }} />
            <div style={{ width: 5, height: 5, background: '#b8892a', borderRadius: '50%' }} />
          </div>
          <div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, letterSpacing: '0.18em', color: '#1c1917', lineHeight: 1 }}>PAVILION</div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 7, letterSpacing: '0.4em', color: 'rgba(184,137,42,0.6)', marginTop: 2, textTransform: 'uppercase' }}>India</div>
          </div>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 34 }}>
          {NAV_LINKS.map(({ label, path }) => {
            const active = location.pathname === path || location.pathname.startsWith(path + '/')
            return (
              <Link key={path} to={path}
                className={`pav-nav-link${active ? ' active' : ''}`}
                style={{ color: active ? '#b8892a' : 'rgba(28,25,23,0.5)' }}>
                {label}
              </Link>
            )
          })}
        </div>

        {/* Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          {user ? (
            <>
              <Link to="/my-bookings" style={{
                fontFamily: 'DM Mono, monospace', fontSize: 10, letterSpacing: '0.18em',
                textTransform: 'uppercase', color: 'rgba(28,25,23,0.45)',
                textDecoration: 'none', transition: 'color 0.25s',
              }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#1c1917'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(28,25,23,0.45)'}>
                Bookings
              </Link>
              <Link to="/profile" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 32, height: 32, borderRadius: '50%',
                background: 'rgba(184,137,42,0.1)', border: '1px solid rgba(184,137,42,0.3)',
                fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#b8892a',
                textDecoration: 'none', transition: 'background 0.25s',
              }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(184,137,42,0.2)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(184,137,42,0.1)'}>
                {(user.name ?? 'U')[0].toUpperCase()}
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" style={{
                fontFamily: 'DM Mono, monospace', fontSize: 10, letterSpacing: '0.18em',
                textTransform: 'uppercase', color: 'rgba(28,25,23,0.45)',
                textDecoration: 'none', transition: 'color 0.25s',
              }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#1c1917'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(28,25,23,0.45)'}>
                Sign In
              </Link>
              <Link to="/register" style={{
                fontFamily: 'DM Mono, monospace', fontSize: 10, letterSpacing: '0.18em',
                textTransform: 'uppercase', color: '#fdfbf7',
                background: '#b8892a', padding: '8px 18px', borderRadius: 2,
                textDecoration: 'none', transition: 'opacity 0.25s', whiteSpace: 'nowrap',
              }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.85'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>
    </>
  )
}