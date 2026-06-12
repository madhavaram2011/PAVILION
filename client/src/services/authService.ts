import api from './api'
import type { AuthResponse, User } from '../types'

export const authService = {
  register: async (
    nameOrData: string | { name: string; email: string; password: string },
    maybeEmail?: string,
    maybePassword?: string
  ): Promise<AuthResponse> => {
    let payload
    if (typeof nameOrData === 'object') {
      payload = nameOrData
    } else {
      payload = { name: nameOrData, email: maybeEmail!, password: maybePassword! }
    }
    const res = await api.post<AuthResponse>('/auth/register', payload)
    return res.data
  },

  login: async (
    emailOrData: string | { email: string; password: string },
    maybePassword?: string
  ): Promise<AuthResponse> => {
    const payload = typeof emailOrData === 'object' ? emailOrData : { email: emailOrData, password: maybePassword! }
    const res = await api.post<AuthResponse>('/auth/login', payload)
    return res.data
  },

  logout: async (): Promise<void> => {
    try {
      localStorage.removeItem('pavilion_token')
    } catch (e) {
      // ignore
    }
  },

  getMe: async (): Promise<User> => {
    const res = await api.get<{ data: User }>('/auth/me')
    return res.data.data
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const res = await api.patch<{ data: User }>('/auth/update-me', data)
    return res.data.data
  },
}