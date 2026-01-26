"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LayoutDashboard, List, Map, ScanLine, TreePine, FileText, Upload, BarChart3 } from "lucide-react"

interface ForestManagementSidebarProps {
  onUploadClick?: () => void
}

const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "inventory", label: "Forest Inventory", icon: List },
  { id: "map-viewer", label: "Map Viewer", icon: Map },
  { id: "lidar", label: "LiDAR Analysis", icon: ScanLine },
  { id: "health", label: "Forest Health", icon: TreePine },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "reports", label: "Reports", icon: FileText },
]

export function ForestManagementSidebar({ onUploadClick }: ForestManagementSidebarProps) {
  const [activeNav, setActiveNav] = useState("map-viewer")

  return (
    <aside className="w-56 border-r border-border bg-muted/30">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-sm text-foreground">Forest Management</h2>
        <p className="text-xs text-muted-foreground mt-0.5">산림경영</p>
      </div>

      <nav className="p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeNav === item.id

          return (
            <Button
              key={item.id}
              variant={isActive ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveNav(item.id)}
              className={cn("w-full justify-start gap-2 h-9 text-sm", isActive && "bg-secondary font-medium")}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </Button>
          )
        })}
      </nav>

      <div className="p-3 border-t border-border mt-4">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2 bg-transparent"
          onClick={onUploadClick}
        >
          <Upload size={16} />
          <span>Upload Data</span>
        </Button>
      </div>
    </aside>
  )
}
