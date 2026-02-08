"use client";

import { Home, MapPin, BarChart3, FileText } from "lucide-react";
import {
  SharedMultiStepSidebar,
  reportingTheme,
  type StepItem,
} from "@/components/sidebar/shared-multi-step-sidebar";

interface MultiStepSidebarProps {
  currentStep: "home" | "leap" | "assessment" | "disclosure";
  onStepChange: (step: "home" | "leap" | "assessment" | "disclosure") => void;
  language: "kr" | "en";
}

export function ReportingMultiStepSidebar({
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
      id: "leap" as const,
      icon: MapPin,
      kr: "LEAP 프레임워크",
      en: "LEAP Framework",
      description: { kr: "Locate → Evaluate", en: "Locate → Evaluate" },
    },
    {
      id: "assessment" as const,
      icon: BarChart3,
      kr: "영향 평가",
      en: "Assessment",
      description: { kr: "의존·영향·리스크", en: "Dependency & Impact" },
    },
    {
      id: "disclosure" as const,
      icon: FileText,
      kr: "공시 작성",
      en: "Disclosure",
      description: { kr: "자동 문서 생성", en: "Auto Document" },
    },
  ];

  return (
    <SharedMultiStepSidebar
      currentStep={currentStep}
      onStepChange={onStepChange}
      language={language}
      steps={steps}
      title={{ kr: "ESG·TNFD", en: "ESG·TNFD" }}
      subtitle={{ kr: "단계별 진행", en: "Step by Step" }}
      theme={reportingTheme}
    />
  );
}
