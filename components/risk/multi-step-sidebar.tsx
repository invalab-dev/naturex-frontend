"use client";

import { Home, MapPin, Shield, FileCheck } from "lucide-react";
import {
  SharedMultiStepSidebar,
  riskTheme,
  type StepItem,
} from "@/components/sidebar/shared-multi-step-sidebar";

interface MultiStepSidebarProps {
  currentStep: "home" | "locate" | "assess" | "prepare";
  onStepChange: (step: "home" | "locate" | "assess" | "prepare") => void;
  language: "kr" | "en";
}

export function RiskMultiStepSidebar({
  currentStep,
  onStepChange,
  language,
}: MultiStepSidebarProps) {
  const steps: StepItem[] = [
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
  ];

  return (
    <SharedMultiStepSidebar
      currentStep={currentStep}
      onStepChange={onStepChange}
      language={language}
      steps={steps}
      title={{ kr: "규제·리스크", en: "Regulatory" }}
      subtitle={{ kr: "단계별 진행", en: "Step by Step" }}
      theme={riskTheme}
    />
  );
}
