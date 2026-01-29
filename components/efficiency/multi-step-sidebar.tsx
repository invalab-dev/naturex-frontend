'use client';

import { Home, Clipboard, BarChart3, Settings } from 'lucide-react';
import {
  SharedMultiStepSidebar,
  efficiencyTheme,
  type StepItem,
} from '@/components/sidebar/shared-multi-step-sidebar';

interface MultiStepSidebarProps {
  currentStep: 'home' | 'planning' | 'analysis' | 'management';
  onStepChange: (step: 'home' | 'planning' | 'analysis' | 'management') => void;
  language: 'kr' | 'en';
}

export function MultiStepSidebar({
  currentStep,
  onStepChange,
  language,
}: MultiStepSidebarProps) {
  const steps: StepItem[] = [
    {
      id: 'home' as const,
      icon: Home,
      kr: '홈',
      en: 'Home',
      description: { kr: '전체 프로세스 개요', en: 'Workflow Overview' },
    },
    {
      id: 'planning' as const,
      icon: Clipboard,
      kr: '계획',
      en: 'Planning',
      description: { kr: '데이터 준비', en: 'Data Preparation' },
    },
    {
      id: 'analysis' as const,
      icon: BarChart3,
      kr: '분석',
      en: 'Analysis',
      description: { kr: '핵심 분석 결과', en: 'Analysis Results' },
    },
    {
      id: 'management' as const,
      icon: Settings,
      kr: '관리',
      en: 'Management',
      description: { kr: '비용관리·우선순위', en: 'Cost & Priority' },
    },
  ];

  return (
    <SharedMultiStepSidebar
      currentStep={currentStep}
      onStepChange={onStepChange}
      language={language}
      steps={steps}
      title={{ kr: '운영비 절감', en: 'Efficiency' }}
      subtitle={{ kr: '단계별 진행', en: 'Step by Step' }}
      theme={efficiencyTheme}
    />
  );
}
