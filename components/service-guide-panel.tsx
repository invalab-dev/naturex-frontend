"use client"

import type React from "react"
import { Target, Upload, GitBranch, FileCheck } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

interface GuideSection {
  title: { kr: string; en: string }
  icon: React.ElementType
  items: { kr: string[]; en: string[] }
}

interface ServiceGuidePanelProps {
  open: boolean
  onClose: () => void
  serviceType: "efficiency" | "risk" | "assets" | "reporting"
  language?: "kr" | "en"
}

const guideContent = {
  efficiency: {
    title: { kr: "🌳 운영비 절감 (Efficiency) 가이드", en: "🌳 Operational Efficiency Guide" },
    sections: [
      {
        title: { kr: "Purpose", en: "Purpose" },
        icon: Target,
        items: {
          kr: ["관리비 절감", "위험·건강도 자동 감지", "우선관리 구간 자동 추천"],
          en: ["Cost reduction", "Automated health & risk detection", "Priority management recommendations"],
        },
      },
      {
        title: { kr: "Required Inputs", en: "Required Inputs" },
        icon: Upload,
        items: {
          kr: ["RGB 정사영상", "LiDAR(고도·구조)", "다분광(Multispectral)", "필지·도로 GIS", "수목 DB(Optional)"],
          en: [
            "RGB orthophoto",
            "LiDAR (height & structure)",
            "Multispectral",
            "Parcel/road GIS",
            "Tree DB (optional)",
          ],
        },
      },
      {
        title: { kr: "Processing Pipeline", en: "Processing Pipeline" },
        icon: GitBranch,
        items: {
          kr: [
            "1. LiDAR + Multispectral + RGB 전처리",
            "2. Vegetation structure classification (tree/shrub/herbaceous)",
            "3. Weed & invasive detection",
            "4. Biomass & productivity modeling",
            "5. Health & Risk scoring",
          ],
          en: [
            "1. LiDAR/Multispectral/RGB preprocessing",
            "2. Vegetation structure classification (tree/shrub/herbaceous)",
            "3. Weed & invasive detection",
            "4. Biomass & productivity modeling",
            "5. Health & Risk scoring",
          ],
        },
      },
      {
        title: { kr: "Outputs", en: "Outputs" },
        icon: FileCheck,
        items: {
          kr: [
            "위험도 지도",
            "Vegetation structure breakdown",
            "Invasive species risk heatmap",
            "Biomass/LAI/production maps",
            "우선관리 리스트",
            "예상 비용 절감율",
            "자동 보고서(PDF)",
          ],
          en: [
            "Risk heatmap",
            "Vegetation structure breakdown",
            "Invasive species risk heatmap",
            "Biomass/LAI/production maps",
            "Priority management list",
            "Estimated cost savings rate",
            "Automated report (PDF)",
          ],
        },
      },
    ],
  },
  risk: {
    title: {
      kr: "🛡 규제·리스크 대응 (Regulatory & Risk Mitigation) 가이드",
      en: "🛡 Regulatory & Risk Mitigation Guide",
    },
    sections: [
      {
        title: { kr: "Purpose", en: "Purpose" },
        icon: Target,
        items: {
          kr: ["사업 대상지의 규제·민감구역 자동 식별", "환경영향평가(EIA) 대응", "도시·국토계획 심의자료 자동 생성"],
          en: [
            "Auto-identify regulatory & sensitive areas",
            "EIA compliance support",
            "Auto-generate review materials for urban planning",
          ],
        },
      },
      {
        title: { kr: "Required Inputs", en: "Required Inputs" },
        icon: Upload,
        items: {
          kr: ["대상 지역(좌표/폴리곤)", "보호구역/생태등급/위험구역 레이어", "개발안 또는 계획안(Optional)"],
          en: [
            "Target area (coordinates/polygon)",
            "Protected/ecological/risk zone layers",
            "Development plan (optional)",
          ],
        },
      },
      {
        title: { kr: "Processing Pipeline", en: "Processing Pipeline" },
        icon: GitBranch,
        items: {
          kr: [
            "1. 민감구역 Layer Overlay",
            "2. 법정 등급/규제요인 자동 감지",
            "3. 환경·생태·기후 기반 리스크 스코어링",
            "4. 규제 체크리스트 자동 생성",
            "5. 심의/감사용 근거자료 패키지화",
          ],
          en: [
            "1. Sensitive area layer overlay",
            "2. Auto-detect legal grades/regulatory factors",
            "3. Environmental/ecological/climate risk scoring",
            "4. Auto-generate regulatory checklist",
            "5. Package evidence materials for review/audit",
          ],
        },
      },
      {
        title: { kr: "Outputs", en: "Outputs" },
        icon: FileCheck,
        items: {
          kr: [
            "리스크 히트맵",
            "규제 체크리스트",
            "민감구역 요약표",
            "심의용 근거자료 PDF",
            "규제 충돌 여부(적합/부적합)",
          ],
          en: [
            "Risk heatmap",
            "Regulatory checklist",
            "Sensitive area summary",
            "Evidence materials PDF",
            "Compliance status (pass/fail)",
          ],
        },
      },
    ],
  },
  assets: {
    title: {
      kr: "🌲 자산 가치 향상 (Natural Asset Value Enhancement) 가이드",
      en: "🌲 Natural Asset Value Enhancement Guide",
    },
    sections: [
      {
        title: { kr: "Purpose", en: "Purpose" },
        icon: Target,
        items: {
          kr: [
            "자연자산(산림·습지 등)의 장기 가치 극대화",
            "탄소·바이오매스 기반 평가",
            "복원·벌채·투자 시나리오 ROI 분석",
          ],
          en: [
            "Maximize long-term value of natural assets",
            "Carbon & biomass-based valuation",
            "ROI analysis for restoration/harvest/investment scenarios",
          ],
        },
      },
      {
        title: { kr: "Required Inputs", en: "Required Inputs" },
        icon: Upload,
        items: {
          kr: ["LiDAR (3D 구조)", "Multispectral (생육·건강도)", "자산 경계(폴리곤)", "관리계획안(Optional)"],
          en: [
            "LiDAR (3D structure)",
            "Multispectral (health & growth)",
            "Asset boundary (polygon)",
            "Management plan (optional)",
          ],
        },
      },
      {
        title: { kr: "Processing Pipeline", en: "Processing Pipeline" },
        icon: GitBranch,
        items: {
          kr: [
            "1. Height / Biomass / Carbon 계산",
            "2. 생산성(LAI 등) 산출",
            "3. Restoration / Harvest / Business Scenario 분석",
            "4. ROI 비교",
            "5. 장기 가치(리스크-리턴) 평가",
          ],
          en: [
            "1. Calculate Height/Biomass/Carbon",
            "2. Compute productivity (LAI, etc.)",
            "3. Analyze restoration/harvest/business scenarios",
            "4. Compare ROI",
            "5. Long-term value (risk-return) assessment",
          ],
        },
      },
      {
        title: { kr: "Outputs", en: "Outputs" },
        icon: FileCheck,
        items: {
          kr: [
            "carbon stock map",
            "biomass/structure map",
            "시나리오별 ROI",
            "포트폴리오 가치지수",
            "장기 가치 분석 리포트",
          ],
          en: [
            "Carbon stock map",
            "Biomass/structure map",
            "ROI by scenario",
            "Portfolio value index",
            "Long-term value analysis report",
          ],
        },
      },
    ],
  },
  reporting: {
    title: { kr: "🧭 ESG·TNFD 공시 지원 (ESG & TNFD Reporting) 가이드", en: "🧭 ESG & TNFD Reporting Guide" },
    sections: [
      {
        title: { kr: "Purpose", en: "Purpose" },
        icon: Target,
        items: {
          kr: ["TNFD LEAP 자동화", "의존·영향·리스크·기회 정량화", "ESG/TNFD 보고서 자동 생성"],
          en: [
            "Automate TNFD LEAP",
            "Quantify dependencies/impacts/risks/opportunities",
            "Auto-generate ESG/TNFD reports",
          ],
        },
      },
      {
        title: { kr: "Required Inputs", en: "Required Inputs" },
        icon: Upload,
        items: {
          kr: ["사업장 위치", "자연자본 레이어(산림/습지/수계/도시녹지 등)", "기업 활동 데이터(Optional)"],
          en: [
            "Facility location",
            "Natural capital layers (forest/wetland/water/urban green)",
            "Corporate activity data (optional)",
          ],
        },
      },
      {
        title: { kr: "Processing Pipeline", en: "Processing Pipeline" },
        icon: GitBranch,
        items: {
          kr: [
            "1. LEAP 단계 자동 구성",
            "2. 생태계서비스 의존·영향 정량화",
            "3. 리스크·기회 스코어링",
            "4. Disclosure Builder 자동 문서 생성",
            "5. 보고서(Word/PDF) 출력",
          ],
          en: [
            "1. Auto-configure LEAP stages",
            "2. Quantify ecosystem service dependencies & impacts",
            "3. Risk & opportunity scoring",
            "4. Auto-generate disclosure builder documents",
            "5. Export reports (Word/PDF)",
          ],
        },
      },
      {
        title: { kr: "Outputs", en: "Outputs" },
        icon: FileCheck,
        items: {
          kr: [
            "LEAP Summary",
            "Dependency & Impact Charts",
            "Risk & Opportunity Matrix",
            "ESG/TNFD 문단 자동 생성",
            "최종 보고서(PDF/Word)",
          ],
          en: [
            "LEAP Summary",
            "Dependency & Impact charts",
            "Risk & Opportunity matrix",
            "Auto-generated ESG/TNFD paragraphs",
            "Final report (PDF/Word)",
          ],
        },
      },
    ],
  },
}

export function ServiceGuidePanel({ open, onClose, serviceType, language = "kr" }: ServiceGuidePanelProps) {
  const guide = guideContent[serviceType]

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent side="right" className="w-[420px] bg-slate-900 border-slate-700 overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-foreground">{guide.title[language]}</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {guide.sections.map((section, idx) => {
            const Icon = section.icon
            return (
              <div key={idx} className="space-y-3">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-sm font-semibold text-foreground">{section.title[language]}</h4>
                </div>
                <ul className="space-y-1.5 ml-6">
                  {section.items[language].map((item, iIdx) => (
                    <li key={iIdx} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-emerald-400 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </SheetContent>
    </Sheet>
  )
}
