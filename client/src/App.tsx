import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import DestinationsPage from './pages/DestinationsPage'
import DestinationDetailPage from './pages/DestinationDetailPage'
import ToursPage from './pages/ToursPage'
import TourDetailPage from './pages/TourDetailPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import BookingPage from './pages/BookingPage'
import ProfilePage from './pages/ProfilePage'
import MyBookingsPage from './pages/MyBookingsPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import NotFoundPage from './pages/NotFoundPage'
import ProtectedRoute from './components/auth/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="destinations" element={<DestinationsPage />} />
        <Route path="destinations/:id" element={<DestinationDetailPage />} />
        <Route path="tours" element={<ToursPage />} />
        <Route path="tours/:slug" element={<TourDetailPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="booking/:tourId" element={<BookingPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="bookings" element={<MyBookingsPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}