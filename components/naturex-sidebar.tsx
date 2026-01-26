"use client"

import { useState } from "react"
import { NatureXLogo } from "./naturex-logo"
import { ProductModeSelector, type ProductMode } from "./product-mode-selector"
import { Home, FileText, Settings, Database, TreePine, Layers, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface NavItem {
  id: string
  label: string
  icon: any
  modes: ProductMode[]
}

const navigationItems: NavItem[] = [
  { id: "home", label: "Home", icon: Home, modes: ["streetcare", "eia", "custom"] },
  { id: "streetcare", label: "StreetCare", icon: TreePine, modes: ["streetcare", "eia", "custom"] },
  { id: "eia", label: "EIA", icon: Layers, modes: ["streetcare", "eia", "custom"] },
  { id: "custom", label: "Custom Projects", icon: BarChart3, modes: ["streetcare", "eia", "custom"] },
  { id: "data", label: "Data Library", icon: Database, modes: ["streetcare", "eia", "custom"] },
  { id: "reports", label: "Reports", icon: FileText, modes: ["streetcare", "eia", "custom"] },
  { id: "settings", label: "Settings", icon: Settings, modes: ["streetcare", "eia", "custom"] },
]

interface NatureXSidebarProps {
  productMode: ProductMode
  onProductModeChange: (mode: ProductMode) => void
}

export function NatureXSidebar({ productMode, onProductModeChange }: NatureXSidebarProps) {
  const [activeNav, setActiveNav] = useState("home")

  const filteredItems = navigationItems.filter((item) => item.modes.includes(productMode))

  return (
    <aside className="w-64 h-screen border-r border-sidebar-border bg-sidebar flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <NatureXLogo />
        <p className="text-xs text-muted-foreground mt-1">by InvaLab</p>
      </div>

      {/* Product Mode Selector */}
      <div className="p-4 border-b border-sidebar-border">
        <ProductModeSelector value={productMode} onChange={onProductModeChange} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {filteredItems.map((item) => {
          const Icon = item.icon
          const isActive = activeNav === item.id

          return (
            <Button
              key={item.id}
              variant={isActive ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveNav(item.id)}
              className={cn(
                "w-full justify-start gap-3 h-10",
                isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
              )}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="text-xs text-muted-foreground">
          <p className="font-medium mb-1">Ecological Analysis Platform</p>
          <p>v1.00 • 2025</p>
        </div>
      </div>
    </aside>
  )
}
