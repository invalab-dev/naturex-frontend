"use client"

import { Home, FolderTree, TrendingUp, Target } from "lucide-react"
import { SharedMultiStepSidebar, assetsTheme, type StepItem } from "@/components/sidebar/shared-multi-step-sidebar"

interface MultiStepSidebarProps {
  currentStep: "home" | "portfolio" | "valuation" | "optimization"
  onStepChange: (step: "home" | "portfolio" | "valuation" | "optimization") => void
  language: "kr" | "en"
}

export function AssetsMultiStepSidebar({ currentStep, onStepChange, language }: MultiStepSidebarProps) {
  const steps: StepItem[] = [
    {
      id: "home" as const,
      icon: Home,
      kr: "홈",
      en: "Home",
      description: { kr: "전체 프로세스 개요", en: "Workflow Overview" },
    },
    {
      id: "portfolio" as const,
      icon: FolderTree,
      kr: "포트폴리오",
      en: "Portfolio",
      description: { kr: "자산 현황 관리", en: "Asset Management" },
    },
    {
      id: "valuation" as const,
      icon: TrendingUp,
      kr: "가치 평가",
      en: "Valuation",
      description: { kr: "탄소·구조 정량화", en: "Carbon & Structure" },
    },
    {
      id: "optimization" as const,
      icon: Target,
      kr: "최적화",
      en: "Optimization",
      description: { kr: "시나리오·장기가치", en: "Scenarios & Long-term" },
    },
  ]

  return (
    <SharedMultiStepSidebar
      currentStep={currentStep}
      onStepChange={onStepChange}
      language={language}
      steps={steps}
      title={{ kr: "자산 가치", en: "Asset Value" }}
      subtitle={{ kr: "단계별 진행", en: "Step by Step" }}
      theme={assetsTheme}
    />
  )
}
