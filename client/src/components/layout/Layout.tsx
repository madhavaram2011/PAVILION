import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])

  const authRoutes = ['/login', '/register']
  const isAuthPage = authRoutes.includes(pathname)

  return (
    // 🏛️ Force-injecting our unified Luxury Journal Palette right at the root layout wrapper
    <div className="min-h-screen flex flex-col bg-[#fdfbf7] text-[#1c1917] font-sans antialiased">

      {!isAuthPage && <Navbar />}

      {/* Ensuring the main dynamic slot acts as a strict light background mask.
        This forces child routes like BookingPage or TourDetailPage to sit on top of our ivory cream base.
      */}
      <main className="flex-1 bg-[#fdfbf7]">
        <Outlet />
      </main>

      {!isAuthPage && <Footer />}
    </div>
  )
}