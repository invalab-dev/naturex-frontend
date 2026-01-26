"use client"

import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function AdminTopBar() {
  const { user, logout } = useAuth()

  return (
    <div className="bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-end gap-4">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-[#111827] font-medium">{user?.name || "Admin"}</span>
        <span className="px-2 py-0.5 bg-[#118DFF] text-white text-xs font-medium rounded">ADMIN</span>
      </div>
      <Button variant="ghost" size="sm" onClick={logout} className="gap-2 text-[#6B7280] hover:text-[#111827]">
        <LogOut className="w-4 h-4" />
        로그아웃
      </Button>
    </div>
  )
}
