"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Building2, FolderKanban, Settings, Inbox } from "lucide-react"

export function AdminSidebar() {
  const pathname = usePathname()

  const menuItems = [
    { href: "/admin", label: "홈", icon: Home },
    { href: "/admin/orgs", label: "조직관리", icon: Building2 },
    { href: "/admin/projects", label: "프로젝트 관리", icon: FolderKanban },
    { href: "/admin/requests", label: "프로젝트 요청", icon: Inbox },
    { href: "/admin/widgets", label: "위젯 설정", icon: Settings },
  ]

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin"
    }
    return pathname?.startsWith(href)
  }

  return (
    <div className="w-64 bg-white border-r border-[#E5E7EB] h-screen fixed left-0 top-0 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-[#E5E7EB]">
        <h1 className="text-xl font-bold text-[#111827]">NatureX Admin</h1>
        <p className="text-xs text-[#6B7280] mt-1">고객 프로젝트 관리 콘솔</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg mb-1 transition-colors ${
                active ? "bg-[#118DFF] text-white" : "text-[#4B5563] hover:bg-[#F5F7FB] hover:text-[#118DFF]"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-[#E5E7EB] text-xs text-[#9CA3AF]">v1.0.0 · InvaLab Co.</div>
    </div>
  )
}
