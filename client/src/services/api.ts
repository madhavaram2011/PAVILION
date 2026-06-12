import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'

const DEFAULT_API = 'http://localhost:5000/api'
const baseURL = import.meta.env.VITE_API_URL || DEFAULT_API

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor – attach JWT from Zustand store (with localStorage fallback)
api.interceptors.request.use((config) => {
  // Prefer live Zustand state (always correct after hydration);
  // fall back to the raw localStorage key written by setAuth.
  const token =
    useAuthStore.getState().token ||
    localStorage.getItem('pavilion_token')

  // Temporary debug – remove once confirmed working
  console.log('Token:', token)

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor – handle auth errors globally
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong'
    const status  = error.response?.status
    const url     = error.config?.url || ''

    // Only force-logout + redirect on 401 from PROTECTED routes.
    // Do NOT redirect when the failing request is itself a login/register/refresh
    // call — those legitimately return 401 for bad credentials and the calling
    // code (LoginPage, RegisterPage) should handle it with a toast.
    const isAuthRoute =
      url.includes('/auth/login') ||
      url.includes('/auth/register') ||
      url.includes('/auth/refresh')

    if (status === 401 && !isAuthRoute) {
      try { useAuthStore.getState().logout() } catch (_) {}
      toast.error('Session expired. Please log in again.')
      window.location.replace('/login')
    }

    return Promise.reject({ message, status })
  }
)

export default api