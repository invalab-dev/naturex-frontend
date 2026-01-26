"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Home, Clipboard, BarChart3, Settings, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

interface MultiStepSidebarProps {
  currentStep: "home" | "planning" | "analysis" | "management"
  onStepChange: (step: "home" | "planning" | "analysis" | "management") => void
  language: "kr" | "en"
}

export function MultiStepSidebar({ currentStep, onStepChange, language }: MultiStepSidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  const steps = [
    {
      id: "home" as const,
      icon: Home,
      kr: "홈",
      en: "Home",
      description: { kr: "전체 프로세스 개요", en: "Workflow Overview" },
    },
    {
      id: "planning" as const,
      icon: Clipboard,
      kr: "계획",
      en: "Planning",
      description: { kr: "데이터 준비", en: "Data Preparation" },
    },
    {
      id: "analysis" as const,
      icon: BarChart3,
      kr: "분석",
      en: "Analysis",
      description: { kr: "핵심 분석 결과", en: "Analysis Results" },
    },
    {
      id: "management" as const,
      icon: Settings,
      kr: "관리",
      en: "Management",
      description: { kr: "비용관리·우선순위", en: "Cost & Priority" },
    },
  ]

  return (
    <div
      className={cn(
        "h-screen bg-gradient-to-b from-blue-50 to-indigo-50 border-r border-blue-200 flex flex-col transition-all duration-300 shadow-lg",
        collapsed ? "w-20" : "w-[260px]",
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-blue-200 flex items-center justify-between bg-white/80 backdrop-blur-sm">
        {!collapsed && (
          <div>
            <h2 className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {language === "kr" ? "운영비 절감" : "Efficiency"}
            </h2>
            <p className="text-xs text-blue-600">{language === "kr" ? "단계별 진행" : "Step by Step"}</p>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0 text-blue-500 hover:text-blue-700 hover:bg-blue-100"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Step List */}
      <nav className="flex-1 p-3 space-y-2">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isActive = currentStep === step.id
          const isCompleted = steps.findIndex((s) => s.id === currentStep) > index

          return (
            <button
              key={step.id}
              onClick={() => onStepChange(step.id)}
              className={cn(
                "w-full flex items-start gap-3 p-3 rounded-lg transition-all duration-200 text-left h-20",
                isActive && "bg-gradient-to-r from-blue-500 to-indigo-500 shadow-md border-0 text-white",
                !isActive && "hover:bg-white/60 hover:shadow-sm",
                collapsed && "justify-center",
              )}
            >
              {/* Step Number & Icon */}
              <div
                className={cn(
                  "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                  isActive && "bg-white text-blue-600 ring-2 ring-white/50",
                  isCompleted && !isActive && "bg-blue-100 text-blue-600",
                  !isActive && !isCompleted && "bg-white/80 text-gray-500",
                )}
              >
                <Icon className="w-5 h-5" />
              </div>

              {/* Step Info */}
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={cn("text-xs font-semibold", isActive ? "text-white/90" : "text-blue-600")}>
                      STEP {index + 1}
                    </span>
                  </div>
                  <h3 className={cn("font-semibold text-sm mt-1", isActive ? "text-white" : "text-gray-900")}>
                    {language === "kr" ? step.kr : step.en}
                  </h3>
                  <p className={cn("text-xs mt-0.5", isActive ? "text-white/80" : "text-gray-600")}>
                    {language === "kr" ? step.description.kr : step.description.en}
                  </p>
                </div>
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
