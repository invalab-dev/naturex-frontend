"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, TrendingDown, TrendingUp, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ProjectSidebarProps {
  projectId: string
  projectName: string
}

export function ProjectSidebar({ projectId, projectName }: ProjectSidebarProps) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + "/")
  }

  const baseUrl = `/app/projects/${projectId}`

  return (
    <div className="w-64 h-screen bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
      {/* Project Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <h2 className="font-semibold text-slate-900 dark:text-slate-100 truncate">{projectName}</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Project Workspace</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <Link href={baseUrl}>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
              pathname === baseUrl && "bg-blue-50 dark:bg-blue-950/30 text-[#118DFF] dark:text-[#118DFF] font-medium",
            )}
          >
            <LayoutDashboard className="w-5 h-5" />
            Project Overview
          </Button>
        </Link>

        <Link href={`${baseUrl}/efficiency`}>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
              isActive(`${baseUrl}/efficiency`) &&
                "bg-blue-50 dark:bg-blue-950/30 text-[#118DFF] dark:text-[#118DFF] font-medium",
            )}
          >
            <TrendingDown className="w-5 h-5" />
            Efficiency
          </Button>
        </Link>

        <Link href={`${baseUrl}/asset-value`}>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
              isActive(`${baseUrl}/asset-value`) &&
                "bg-blue-50 dark:bg-blue-950/30 text-[#118DFF] dark:text-[#118DFF] font-medium",
            )}
          >
            <TrendingUp className="w-5 h-5" />
            Asset Value
          </Button>
        </Link>

        <Link href={`${baseUrl}/esg-tnfd`}>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
              isActive(`${baseUrl}/esg-tnfd`) &&
                "bg-blue-50 dark:bg-blue-950/30 text-[#118DFF] dark:text-[#118DFF] font-medium",
            )}
          >
            <Leaf className="w-5 h-5" />
            ESG & TNFD
          </Button>
        </Link>
      </nav>
    </div>
  )
}
