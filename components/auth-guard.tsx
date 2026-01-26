"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  useEffect(() => {
    if (isLoading) return

    // Check if user is trying to access protected routes
    const isAdminRoute = pathname.startsWith("/admin")
    const isAppRoute = pathname.startsWith("/app")
    const isLoginRoute = pathname === "/login" || pathname.startsWith("/login")

    if (!user) {
      // Not logged in: redirect to login for protected routes
      if (isAdminRoute || isAppRoute) {
        router.replace(`/login?redirect=${pathname}`)
      }
    } else {
      // Logged in: check role-based access
      if (isAdminRoute && user.role !== "admin") {
        toast({
          title: "접근 권한이 없습니다.",
          description: "관리자 페이지에 접근할 수 없습니다.",
          variant: "destructive",
        })
        router.replace("/app")
      }
    }
  }, [user, isLoading, router, pathname, toast])

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
