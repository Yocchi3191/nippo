import type { credentials } from './credentials'

const STORAGE_KEY = 'nippo_auth'

export function useAuth() {
  return {
    login: (credentials: credentials): boolean => {
      // TODO: バックエンドAPIと繋ぎこむ
      localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials))
      return false
    },
    logout: (): void => {
      localStorage.removeItem(STORAGE_KEY)
    },
    isAuthenticated: (): boolean => {
      return localStorage.getItem(STORAGE_KEY) !== null
    },
  }
}
