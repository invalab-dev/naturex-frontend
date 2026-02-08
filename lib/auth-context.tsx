"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export type AuthSession = {
  id: string
  email: string
  roles: Array<"ADMIN" | "USER">
  name?: string | null
  organizationId?: string | null

  // FE convenience fields (keeps existing UI logic mostly unchanged)
  role: "admin" | "customer"
  orgId?: string | null
}

interface AuthContextType {
  user: AuthSession | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function mapMe(me: any): AuthSession {
  const roles: Array<"ADMIN" | "USER"> = Array.isArray(me.roles) ? me.roles : []
  const isAdmin = roles.includes("ADMIN")
  return {
    id: String(me.id),
    email: String(me.email),
    roles,
    name: me.name ?? null,
    organizationId: me.organizationId ?? null,
    role: isAdmin ? "admin" : "customer",
    orgId: me.organizationId ?? null,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(new URL("/auth/me", process.env.NEXT_PUBLIC_NATUREX_BACKEND), {
          method: "GET",
          credentials: "include",
        })
        if (!res.ok) return
        const me = await res.json()
        setUser(mapMe(me))
      } catch {
        // ignore
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(new URL("/auth/login", process.env.NEXT_PUBLIC_NATUREX_BACKEND), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) return false
      const me = await res.json()
      setUser(mapMe(me))
      return true
    } catch {
      return false
    }
  }

  const logout = async () => {
    try {
      await fetch(new URL("/auth/logout", process.env.NEXT_PUBLIC_NATUREX_BACKEND), {
        method: "PUT",
        credentials: "include",
      })
    } finally {
      setUser(null)
    }
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
