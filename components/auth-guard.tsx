"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const hasRedirected = useRef(false)

  useEffect(() => {
    if (isLoading) return
    if (hasRedirected.current) return

    // Check if user is trying to access protected routes
    const isAdminRoute = pathname.startsWith("/admin")
    const isAppRoute = pathname.startsWith("/app")

    if (!user) {
      // Not logged in: redirect to login for protected routes
      if (isAdminRoute || isAppRoute) {
        hasRedirected.current = true
        router.replace(`/login?redirect=${pathname}`)
      }
    } else {
      // Logged in: check role-based access
      if (isAdminRoute && user.role !== "admin") {
        hasRedirected.current = true
        toast({
          title: "접근 권한이 없습니다.",
          description: "관리자 페이지에 접근할 수 없습니다.",
          variant: "destructive",
        })
        router.replace("/app")
      }
    }
  }, [user, isLoading, pathname])

  // Reset redirect flag when pathname changes
  useEffect(() => {
    hasRedirected.current = false
  }, [pathname])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5F7FB]">
        <div className="text-[#6B7280]">Loading...</div>
      </div>
    )
  }

  // Admin route protection
  if (pathname.startsWith("/admin")) {
    if (!user) return null
    if (user.role !== "admin") {
      return null
    }
  }

  // App route protection
  if (pathname.startsWith("/app") && !user) {
    return null
  }

  return <>{children}</>
}
