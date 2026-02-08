"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Sparkles,
  TrendingDown,
  TrendingUp,
  FileCheck,
  ArrowRight,
} from "lucide-react";

type Language = "ko" | "en";

type ServiceType = "efficiency" | "asset-value" | "esg-tnfd";

interface Recommendation {
  service: ServiceType;
  reason: string;
}

interface ProjectRecommendationAssistantProps {
  language: Language;
}

export function ProjectRecommendationAssistant({
  language,
}: ProjectRecommendationAssistantProps) {
  const [input, setInput] = useState("");
  const [recommendation, setRecommendation] = useState<Recommendation | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);

  const content = {
    header: {
      ko: "어떤 프로젝트를 고민 중이신가요?",
      en: "What project are you considering?",
    },
    subheader: {
      ko: "자연자산 관리 목적을 입력하면 NatureX AI가 적합한 서비스를 추천해 드립니다.",
      en: "Enter your natural asset management needs and NatureX AI will recommend the right service.",
    },
    placeholder: {
      ko: "예: 가로수 유지관리 비용이 너무 많이 들어요.",
      en: "e.g., Tree maintenance costs are too high.",
    },
    button: {
      ko: "AI에게 물어보기",
      en: "Ask AI",
    },
    recommendationTitle: {
      ko: "추천 서비스",
      en: "Recommended Service",
    },
    services: {
      efficiency: {
        ko: "운영비 절감",
        en: "Operational Efficiency",
      },
      "asset-value": {
        ko: "자산 가치 향상",
        en: "Asset Value Enhancement",
      },
      "esg-tnfd": {
        ko: "ESG·TNFD 공시",
        en: "ESG·TNFD Disclosure",
      },
    },
    reasonLabel: {
      ko: "추천 이유:",
      en: "Recommendation Reason:",
    },
    ctaButton: {
      ko: "이 서비스로 프로젝트 시작하기",
      en: "Start Project with This Service",
    },
    otherServices: {
      ko: "다른 서비스도 함께 보기",
      en: "Explore Other Services",
    },
    additionalInfo: {
      ko: "이 프로젝트는 다른 서비스와 함께 사용하면 더 효과적입니다",
      en: "This project can be more effective when combined with other services",
    },
  };

  const analyzeInput = (userInput: string): Recommendation => {
    const lowerInput = userInput.toLowerCase();

    // Keywords for efficiency
    const efficiencyKeywords = [
      "비용",
      "유지관리",
      "관리",
      "위험",
      "우선순위",
      "효율",
      "절감",
      "cost",
      "maintenance",
      "risk",
      "priority",
      "efficiency",
    ];

    // Keywords for asset value
    const assetKeywords = [
      "생산성",
      "탄소",
      "가치",
      "roi",
      "자산",
      "투자",
      "수익",
      "productivity",
      "carbon",
      "value",
      "asset",
      "investment",
      "return",
    ];

    // Keywords for ESG/TNFD
    const esgKeywords = [
      "공시",
      "esg",
      "tnfd",
      "보고",
      "규제",
      "준수",
      "투명성",
      "disclosure",
      "reporting",
      "compliance",
      "regulation",
      "transparency",
    ];

    let efficiencyScore = 0;
    let assetScore = 0;
    let esgScore = 0;

    efficiencyKeywords.forEach((keyword) => {
      if (lowerInput.includes(keyword)) efficiencyScore++;
    });

    assetKeywords.forEach((keyword) => {
      if (lowerInput.includes(keyword)) assetScore++;
    });

    esgKeywords.forEach((keyword) => {
      if (lowerInput.includes(keyword)) esgScore++;
    });

    // Determine recommendation
    if (esgScore > efficiencyScore && esgScore > assetScore) {
      return {
        service: "esg-tnfd",
        reason:
          language === "ko"
            ? "ESG 공시, TNFD 규제 대응, 투명한 보고 체계에 대한 니즈가 중심이기 때문에 ESG·TNFD 공시 서비스가 가장 적합합니다."
            : "Your focus on ESG disclosure, TNFD compliance, and transparent reporting makes the ESG·TNFD Disclosure service most suitable.",
      };
    } else if (assetScore > efficiencyScore) {
      return {
        service: "asset-value",
        reason:
          language === "ko"
            ? "생산성 향상, 자산 가치 측정, 탄소 관리 및 투자 수익에 대한 고민이 중심이기 때문에 자산 가치 향상 서비스가 가장 적합합니다."
            : "Your focus on productivity improvement, asset valuation, carbon management, and investment returns makes the Asset Value Enhancement service most suitable.",
      };
    } else {
      return {
        service: "efficiency",
        reason:
          language === "ko"
            ? "유지관리 비용, 우선관리 대상, 현장 작업 효율에 대한 고민이 중심이기 때문에 운영비 절감 서비스가 가장 적합합니다."
            : "Your focus on maintenance costs, priority management, and operational efficiency makes the Operational Efficiency service most suitable.",
      };
    }
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;

    setIsLoading(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const result = analyzeInput(input);
      setRecommendation(result);
      setIsLoading(false);
    }, 1500);
  };

  const getServiceIcon = (service: ServiceType) => {
    switch (service) {
      case "efficiency":
        return TrendingDown;
      case "asset-value":
        return TrendingUp;
      case "esg-tnfd":
        return FileCheck;
    }
  };

  const getServiceRoute = (service: ServiceType) => {
    switch (service) {
      case "efficiency":
        return "/app/projects/new?track=efficiency";
      case "asset-value":
        return "/app/projects/new?track=asset-value";
      case "esg-tnfd":
        return "/app/projects/new?track=esg-tnfd";
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
      {/* Header */}
      <div className="flex items-start gap-3 mb-6">
        <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
          <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2 leading-tight">
            {content.header[language]}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {content.subheader[language]}
          </p>
        </div>
      </div>

      {/* Input Area */}
      {!recommendation && (
        <div className="space-y-4">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={content.placeholder[language]}
            className="min-h-[120px] resize-none border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
          />
          <Button
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-pulse" />
                {language === "ko" ? "분석 중..." : "Analyzing..."}
              </span>
            ) : (
              content.button[language]
            )}
          </Button>
        </div>
      )}

      {/* Recommendation Result */}
      {recommendation && (
        <div className="space-y-6">
          {/* Recommended Service Card */}
          <div className="border-2 border-blue-200 dark:border-blue-700 rounded-lg p-6 bg-blue-50/50 dark:bg-blue-950/20">
            <div className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">
              {content.recommendationTitle[language]}
            </div>

            <div className="flex items-center gap-3 mb-4">
              {(() => {
                const Icon = getServiceIcon(recommendation.service);
                return (
                  <>
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                      <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      {content.services[recommendation.service][language]}
                    </h3>
                  </>
                );
              })()}
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {content.reasonLabel[language]}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {recommendation.reason}
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            asChild
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-6 text-base"
          >
            <a href={getServiceRoute(recommendation.service)}>
              {content.ctaButton[language]}
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </Button>

          {/* Additional Info */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center leading-relaxed mb-3">
              {content.additionalInfo[language]}
            </p>
            <button
              onClick={() => setRecommendation(null)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline mx-auto block"
            >
              {content.otherServices[language]}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
