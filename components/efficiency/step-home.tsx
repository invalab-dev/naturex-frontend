"use client";

import { Card } from "@/components/ui/card";
import { ArrowRight, Clipboard, BarChart3, Settings } from "lucide-react";

interface StepHomeProps {
  language: "kr" | "en";
}

export function StepHome({ language }: StepHomeProps) {
  const content = {
    kr: {
      title: "운영비 절감 – 전체 프로세스",
      subtitle: "AI 기반 예측·우선순위로 유지관리 비용을 최소화합니다",
      planning: {
        title: "계획",
        items: [
          "고객 데이터 업로드",
          "위성 기반 사전 탐색",
          "(선택) 데이터 취득 요청",
        ],
      },
      analysis: {
        title: "분석",
        items: [
          "정사·LiDAR·다분광 자동 분석",
          "수목(Tree) + 관목(Shrub) + 초본(Herb) + 잡초/외래종(Weed/Invasive) 식생 구조 분석",
          "건강도·위험도·관리 우선순위 산출",
        ],
      },
      management: {
        title: "관리",
        items: [
          "비용추정 및 절감효과 시뮬레이션",
          "제거/관리 우선순위 제공",
          "GPS 기반 현장 작업 가이드",
          "자동 보고서 생성",
        ],
      },
    },
    en: {
      title: "Efficiency – Full Process",
      subtitle:
        "Minimize maintenance costs with AI-based predictions and priorities",
      planning: {
        title: "Planning",
        items: [
          "Upload customer data",
          "Satellite pre-screening",
          "(Optional) Data acquisition request",
        ],
      },
      analysis: {
        title: "Analysis",
        items: [
          "Auto-analyze orthomosaics, LiDAR, multispectral",
          "Vegetation structure: Tree + Shrub + Herb + Weed/Invasive analysis",
          "Calculate health, risk, and management priority",
        ],
      },
      management: {
        title: "Management",
        items: [
          "Cost estimation & savings simulation",
          "Removal/management priority list",
          "GPS-based field work guide",
          "Automated report generation",
        ],
      },
    },
  };

  const t = language === "kr" ? content.kr : content.en;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900">{t.title}</h1>
        <p className="text-base text-gray-600 leading-relaxed">{t.subtitle}</p>
      </div>

      <div className="flex items-stretch justify-center gap-4 py-12">
        <Card className="p-6 bg-white border-2 border-blue-200 w-[280px] flex flex-col shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-blue-50">
              <Clipboard className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-blue-600">
              {t.planning.title}
            </h3>
          </div>
          <ul className="space-y-2 flex-1">
            {t.planning.items.map((item, idx) => (
              <li
                key={idx}
                className="text-sm text-gray-700 leading-relaxed flex items-start gap-2"
              >
                <span className="text-blue-600 mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>

        <div className="flex items-center">
          <ArrowRight className="w-8 h-8 text-gray-400 flex-shrink-0" />
        </div>

        <Card className="p-6 bg-white border-2 border-blue-200 w-[280px] flex flex-col shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-blue-50">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-blue-600">
              {t.analysis.title}
            </h3>
          </div>
          <ul className="space-y-2 flex-1">
            {t.analysis.items.map((item, idx) => (
              <li
                key={idx}
                className="text-sm text-gray-700 leading-relaxed flex items-start gap-2"
              >
                <span className="text-blue-600 mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>

        <div className="flex items-center">
          <ArrowRight className="w-8 h-8 text-gray-400 flex-shrink-0" />
        </div>

        <Card className="p-6 bg-white border-2 border-blue-200 w-[280px] flex flex-col shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-blue-50">
              <Settings className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-blue-600">
              {t.management.title}
            </h3>
          </div>
          <ul className="space-y-2 flex-1">
            {t.management.items.map((item, idx) => (
              <li
                key={idx}
                className="text-sm text-gray-700 leading-relaxed flex items-start gap-2"
              >
                <span className="text-blue-600 mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Quick Start Guide */}
      <Card className="p-6 bg-white border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {language === "kr" ? "시작하기" : "Getting Started"}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {language === "kr"
            ? "좌측 사이드바에서 '계획' 단계를 클릭하여 데이터 업로드 또는 취득 요청으로 프로세스를 시작하세요. 데이터가 준비되면 '분석' 단계에서 AI 기반 식생 분석 결과를 확인하고, '관리' 단계에서 비용 절감 효과와 우선순위를 검토할 수 있습니다."
            : "Click the 'Planning' step in the left sidebar to start the process with data upload or acquisition request. Once data is ready, check AI-based vegetation analysis results in the 'Analysis' step, and review cost savings and priorities in the 'Management' step."}
        </p>
      </Card>
    </div>
  );
}
