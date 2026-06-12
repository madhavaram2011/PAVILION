import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { User } from '../types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  _hasHydrated: boolean
  setAuth: (user: User, token: string) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
  setHasHydrated: (val: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      _hasHydrated: false,

      setAuth: (user, token) => {
        try {
          localStorage.setItem('pavilion_token', token)
        } catch (e) {
          // ignore
        }
        set({ user, token, isAuthenticated: true })
      },

      logout: () => {
        try {
          localStorage.removeItem('pavilion_token')
        } catch (e) {
          // ignore
        }
        set({ user: null, token: null, isAuthenticated: false })
      },

      updateUser: (partial) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : null,
        })),

      setHasHydrated: (val) => set({ _hasHydrated: val }),
    }),
    {
      name: 'pavilion-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
      onRehydrateStorage: () => (state) => {
        // Called once localStorage data has been loaded into the store
        state?.setHasHydrated(true)
      },
    }
  )
)