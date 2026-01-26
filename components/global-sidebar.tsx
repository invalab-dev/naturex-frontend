"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Home, FolderKanban, Settings, LogOut, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"

export function GlobalSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const router = useRouter()

  const isActive = (path: string) => {
    if (pathname === "/app/projects/new") {
      return false
    }

    if (path === "/app") {
      return pathname === "/app"
    }
    return pathname === path || pathname.startsWith(path + "/")
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <div className="w-64 h-screen bg-white border-r border-[#E5E7EB] flex flex-col">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 p-6 border-b border-[#E5E7EB]">
        <div className="text-xl font-bold text-[#118DFF]">NatureX</div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        <Link href="/app">
          <button
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              "text-slate-700 hover:bg-slate-50",
              isActive("/app") && "bg-blue-50 text-[#118DFF] border-l-4 border-[#118DFF] pl-[8px]",
            )}
          >
            <Home className="w-5 h-5" />홈
          </button>
        </Link>

        <Link href="/app/projects">
          <button
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              "text-slate-700 hover:bg-slate-50",
              isActive("/app/projects") && "bg-blue-50 text-[#118DFF] border-l-4 border-[#118DFF] pl-[8px]",
            )}
          >
            <FolderKanban className="w-5 h-5" />
            프로젝트
          </button>
        </Link>

        <Link href="/app/settings">
          <button
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              "text-slate-700 hover:bg-slate-50",
              isActive("/app/settings") && "bg-blue-50 text-[#118DFF] border-l-4 border-[#118DFF] pl-[8px]",
            )}
          >
            <Settings className="w-5 h-5" />
            설정
          </button>
        </Link>
      </nav>

      <div className="p-4 border-t border-[#E5E7EB] space-y-2">
        <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-[#118DFF] flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-slate-900 truncate">{user?.name || "사용자"}</div>
            <div className="text-xs text-slate-500 truncate">{user?.email}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          로그아웃
        </button>
      </div>
    </div>
  )
}
