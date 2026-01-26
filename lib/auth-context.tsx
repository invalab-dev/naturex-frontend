"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import {
  initializeAuthData,
  authenticateUser,
  setAuthSession,
  getAuthSession,
  clearAuthSession,
  type AuthSession,
} from "./auth-data"

interface AuthContextType {
  user: AuthSession | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize auth data on first load
    initializeAuthData()

    // Load existing session
    const session = getAuthSession()
    if (session) {
      setUser(session)
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    const authenticatedUser = authenticateUser(email, password)
    if (authenticatedUser) {
      setAuthSession(authenticatedUser)
      setUser(getAuthSession())
      return true
    }
    return false
  }

  const logout = () => {
    clearAuthSession()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
