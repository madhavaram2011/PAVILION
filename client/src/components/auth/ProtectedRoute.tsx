import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

export default function ProtectedRoute() {
  const { isAuthenticated, _hasHydrated } = useAuthStore()

  // Wait for Zustand persist to finish loading from localStorage
  // before making any auth decision. Without this, the store starts
  // with isAuthenticated=false and immediately redirects to /login.
  if (!_hasHydrated) {
    return null // or a spinner — just don't redirect yet
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}