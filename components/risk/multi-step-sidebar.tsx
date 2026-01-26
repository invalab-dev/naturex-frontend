"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Home, MapPin, Shield, FileCheck, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

interface MultiStepSidebarProps {
  currentStep: "home" | "locate" | "assess" | "prepare"
  onStepChange: (step: "home" | "locate" | "assess" | "prepare") => void
  language: "kr" | "en"
}

export function RiskMultiStepSidebar({ currentStep, onStepChange, language }: MultiStepSidebarProps) {
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
      id: "locate" as const,
      icon: MapPin,
      kr: "지역 식별",
      en: "Locate",
      description: { kr: "위험 구역 탐색", en: "Identify Risk Zones" },
    },
    {
      id: "assess" as const,
      icon: Shield,
      kr: "리스크 평가",
      en: "Assess",
      description: { kr: "위험도 분석", en: "Risk Analysis" },
    },
    {
      id: "prepare" as const,
      icon: FileCheck,
      kr: "대응 준비",
      en: "Prepare",
      description: { kr: "근거자료·대응방안", en: "Evidence & Response" },
    },
  ]

  return (
    <div
      className={cn(
        "h-screen bg-slate-900/90 border-r border-slate-800 flex flex-col transition-all duration-300",
        collapsed ? "w-20" : "w-[260px]",
      )}
    >
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        {!collapsed && (
          <div>
            <h2 className="text-sm font-bold text-slate-200">{language === "kr" ? "규제·리스크" : "Regulatory"}</h2>
            <p className="text-xs text-slate-400">{language === "kr" ? "단계별 진행" : "Step by Step"}</p>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0 text-slate-400 hover:text-slate-200"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

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
                isActive && "bg-slate-800 shadow-lg",
                !isActive && "hover:bg-slate-800/50",
                collapsed && "justify-center",
              )}
            >
              <div
                className={cn(
                  "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                  isActive && "bg-red-500/20 text-red-400 ring-2 ring-red-500/50",
                  isCompleted && !isActive && "bg-red-500/10 text-red-500",
                  !isActive && !isCompleted && "bg-slate-800 text-slate-400",
                )}
              >
                <Icon className="w-5 h-5" />
              </div>

              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold text-slate-400">STEP {index + 1}</span>
                  <h3 className={cn("font-semibold text-sm mt-1", isActive ? "text-red-400" : "text-slate-200")}>
                    {language === "kr" ? step.kr : step.en}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
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
