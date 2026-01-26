"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Globe, ChevronDown, Home, FolderKanban, Plus } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function GlobalHeader() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [language, setLanguage] = useState<"ko" | "en">("ko")

  useEffect(() => {
    const saved = localStorage.getItem("naturex_language")
    if (saved === "ko" || saved === "en") {
      setLanguage(saved)
    }
  }, [])

  const handleLanguageChange = (lang: "ko" | "en") => {
    setLanguage(lang)
    localStorage.setItem("naturex_language", lang)
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const getRoleBadge = () => {
    if (!user) return null
    if (user.role === "admin") {
      return "ADMIN"
    }
    return "CUSTOMER"
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-[#E5E7EB] bg-white flex items-center justify-between px-6 shadow-sm">
      {/* Left: Logo + Navigation */}
      <div className="flex items-center gap-6">
        <Link
          href={user ? (user.role === "admin" ? "/admin" : "/app") : "/"}
          className="text-base font-semibold text-[#118DFF] hover:text-[#0F7FE6] transition-colors"
        >
          NatureX
        </Link>

        {user && (
          <nav className="flex items-center gap-1">
            {user.role === "admin" ? (
              <>
                <Link href="/admin">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#374151] hover:bg-[#F3F4F6] rounded-md transition-colors">
                    <Home className="w-4 h-4" />
                    Admin
                  </button>
                </Link>
                <Link href="/app/projects">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#374151] hover:bg-[#F3F4F6] rounded-md transition-colors">
                    <FolderKanban className="w-4 h-4" />
                    Projects
                  </button>
                </Link>
                <Link href="/app/projects/new">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#374151] hover:bg-[#F3F4F6] rounded-md transition-colors">
                    <Plus className="w-4 h-4" />
                    New Project
                  </button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/app">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#374151] hover:bg-[#F3F4F6] rounded-md transition-colors">
                    <Home className="w-4 h-4" />
                    Home
                  </button>
                </Link>
                <Link href="/app/projects">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#374151] hover:bg-[#F3F4F6] rounded-md transition-colors">
                    <FolderKanban className="w-4 h-4" />
                    Projects
                  </button>
                </Link>
              </>
            )}
          </nav>
        )}
      </div>

      {/* Right: Language Selector + Auth Button */}
      <div className="flex items-center gap-3">
        {/* Language Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#374151] hover:bg-[#F3F4F6] rounded-md transition-colors focus:outline-none">
              <Globe className="w-4 h-4" />
              <span>언어</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32 bg-white border border-[#E5E7EB] shadow-md">
            <DropdownMenuItem
              onClick={() => handleLanguageChange("ko")}
              className="cursor-pointer hover:bg-[#F3F4F6] text-[#374151]"
            >
              <span className={language === "ko" ? "font-semibold text-[#118DFF]" : ""}>한국어</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleLanguageChange("en")}
              className="cursor-pointer hover:bg-[#F3F4F6] text-[#374151]"
            >
              <span className={language === "en" ? "font-semibold text-[#118DFF]" : ""}>English</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Auth Button */}
        {!user ? (
          <Link
            href="/login"
            className="px-4 py-1.5 text-sm text-[#118DFF] hover:bg-[#118DFF]/5 border border-[#118DFF] rounded-md transition-colors"
          >
            로그인
          </Link>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#374151] hover:bg-[#F3F4F6] rounded-md transition-colors focus:outline-none">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{user.name}</span>
                  <span className="px-2 py-0.5 text-xs font-medium bg-[#118DFF]/10 text-[#118DFF] rounded">
                    {getRoleBadge()}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 bg-white border border-[#E5E7EB] shadow-md">
              <DropdownMenuItem
                onClick={() => router.push(user.role === "admin" ? "/admin" : "/app")}
                className="cursor-pointer hover:bg-[#F3F4F6] text-[#374151]"
              >
                Dashboard
              </DropdownMenuItem>
              {user.role === "admin" && (
                <DropdownMenuItem
                  onClick={() => router.push("/admin/users")}
                  className="cursor-pointer hover:bg-[#F3F4F6] text-[#374151]"
                >
                  Users
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator className="bg-[#E5E7EB]" />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:bg-[#F3F4F6] text-red-600">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  )
}
