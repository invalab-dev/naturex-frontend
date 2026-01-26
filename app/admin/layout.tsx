import type React from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminTopBar } from "@/components/admin-topbar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      <AdminSidebar />
      <div className="ml-64">
        <AdminTopBar />
        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  )
}
