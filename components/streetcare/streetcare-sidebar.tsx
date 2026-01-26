"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  MapPin,
  Map,
  TrendingUp,
  FileText,
  Upload,
  Send,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import type { StreetCareSection } from "@/app/streetcare/page"

interface StreetCareSidebarProps {
  activeSection: StreetCareSection
  onSectionChange: (section: StreetCareSection) => void
}

const navItems = [
  { id: "overview" as StreetCareSection, label: "Overview", icon: LayoutDashboard },
  { id: "tree-id" as StreetCareSection, label: "Locations", icon: MapPin },
  { id: "map-viewer" as StreetCareSection, label: "Map Viewer", icon: Map },
  { id: "risk-analysis" as StreetCareSection, label: "Risk Analysis", icon: TrendingUp },
  { id: "reports" as StreetCareSection, label: "Reports", icon: FileText },
]

const dataManagementItems = [
  { id: "upload-data" as StreetCareSection, label: "Upload Data", icon: Upload },
  { id: "monitor-request" as StreetCareSection, label: "Monitor Request", icon: Send },
]

export function StreetCareSidebar({ activeSection, onSectionChange }: StreetCareSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "border-r border-border bg-muted/30 transition-all duration-300 relative",
        isCollapsed ? "w-16" : "w-56",
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-4 z-10 h-6 w-6 rounded-full border bg-background shadow-sm"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </Button>

      <div className="p-4 border-b border-border">
        {!isCollapsed ? (
          <>
            <h2 className="font-semibold text-sm text-foreground">StreetCare</h2>
            <p className="text-xs text-muted-foreground mt-0.5">가로수 관리</p>
          </>
        ) : (
          <div className="h-8 flex items-center justify-center">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
        )}
      </div>

      <nav className="p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id

          return (
            <Button
              key={item.id}
              variant={isActive ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full h-9 text-sm transition-all",
                isCollapsed ? "justify-center px-2" : "justify-start gap-2",
                isActive && "bg-secondary font-medium",
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon size={16} />
              {!isCollapsed && <span>{item.label}</span>}
            </Button>
          )
        })}

        <div className="py-2">
          <div className="h-px bg-border" />
        </div>

        {dataManagementItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id

          return (
            <Button
              key={item.id}
              variant={isActive ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full h-9 text-sm transition-all",
                isCollapsed ? "justify-center px-2" : "justify-start gap-2",
                isActive && "bg-secondary font-medium",
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon size={16} />
              {!isCollapsed && <span>{item.label}</span>}
            </Button>
          )
        })}
      </nav>
    </aside>
  )
}
