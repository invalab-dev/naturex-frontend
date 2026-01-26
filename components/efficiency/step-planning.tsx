"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Satellite, Upload, ScanSearch } from "lucide-react"
import Link from "next/link"

interface StepPlanningProps {
  language: "kr" | "en"
}

export function StepPlanning({ language }: StepPlanningProps) {
  const content = {
    kr: {
      title: "계획 단계",
      subtitle: "데이터 준비 및 취득",
      satellite: {
        title: "위성 기반 사전 탐색",
        description: "고객이 사업지 후보지 또는 관심 구역을 위성 이미지로 먼저 확인할 수 있습니다.",
        features: ["전 세계 위성/항공 영상 조회", "지도 레이어 전환 (일반/위성/지형)", "주소·좌표 검색 및 이동"],
        button: "위성 기반 탐색 시작",
      },
      upload: {
        title: "고객 데이터 업로드",
        description: "보유하신 드론 데이터, LiDAR, 다분광 영상, CSV 등을 업로드하여 자동 분석을 시작합니다.",
        features: ["드론 RGB 정사영상 업로드", "LiDAR 포인트클라우드 업로드", "다분광 영상 및 CSV/GIS 데이터 업로드"],
        button: "데이터 업로드 시작",
      },
      request: {
        title: "데이터 취득 요청",
        description: "데이터가 없으신가요? 인베랩이 드론 촬영, LiDAR 취득, 현장조사를 수행해드립니다.",
        features: ["지도 기반 polygon 영역 선택", "Buffer 자동 적용", "제출: polygon + buffer 거리 + 요청 사유"],
        button: "데이터 취득 요청 보내기",
      },
    },
    en: {
      title: "Planning Stage",
      subtitle: "Data Preparation & Acquisition",
      satellite: {
        title: "Satellite Pre-Screening",
        description: "Preview your site candidates or areas of interest using satellite imagery first.",
        features: [
          "Global satellite/aerial imagery access",
          "Map layer switching (Street/Satellite/Terrain)",
          "Address/coordinate search & navigation",
        ],
        button: "Start Satellite Screening",
      },
      upload: {
        title: "Upload Customer Data",
        description: "Upload your drone data, LiDAR, multispectral imagery, CSV, etc. to start automatic analysis.",
        features: [
          "Upload drone RGB orthomosaic",
          "Upload LiDAR point cloud",
          "Upload multispectral imagery and CSV/GIS data",
        ],
        button: "Start Data Upload",
      },
      request: {
        title: "Request Data Acquisition",
        description: "Don't have data? InvaLab performs drone flights, LiDAR acquisition, and field surveys for you.",
        features: ["Map-based polygon area selection", "Auto-apply buffer", "Submit: polygon + buffer + reason"],
        button: "Send Data Acquisition Request",
      },
    },
  }

  const t = language === "kr" ? content.kr : content.en

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{t.title}</h1>
        <p className="text-base text-gray-600 leading-relaxed mt-2">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Satellite Pre-Screening */}
        <Card className="p-6 bg-white border-2 border-blue-200 hover:border-blue-400 transition-all shadow-sm hover:shadow-md">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-blue-50">
              <Satellite className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.satellite.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">{t.satellite.description}</p>
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">{language === "kr" ? "기능:" : "Features:"}</p>
                <ul className="space-y-1">
                  {t.satellite.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-gray-600 leading-relaxed flex items-center gap-2">
                      <span className="text-blue-600">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/hub/efficiency/satellite">
                <Button className="bg-[#118DFF] hover:bg-[#0E7ADB] text-white">{t.satellite.button}</Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Upload Customer Data */}
        <Card className="p-6 bg-white border-2 border-emerald-200 hover:border-emerald-400 transition-all shadow-sm hover:shadow-md">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-50">
              <Upload className="w-8 h-8 text-emerald-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.upload.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">{t.upload.description}</p>
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">{language === "kr" ? "기능:" : "Features:"}</p>
                <ul className="space-y-1">
                  {t.upload.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-gray-600 leading-relaxed flex items-center gap-2">
                      <span className="text-emerald-600">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/hub/efficiency/upload">
                <Button className="bg-[#118DFF] hover:bg-[#0E7ADB] text-white">{t.upload.button}</Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Data Acquisition Request */}
        <Card className="p-6 bg-white border-2 border-indigo-200 hover:border-indigo-400 transition-all shadow-sm hover:shadow-md">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-indigo-50">
              <ScanSearch className="w-8 h-8 text-indigo-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.request.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">{t.request.description}</p>
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">{language === "kr" ? "기능:" : "Features:"}</p>
                <ul className="space-y-1">
                  {t.request.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-gray-600 leading-relaxed flex items-center gap-2">
                      <span className="text-indigo-600">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/hub/efficiency/request">
                <Button className="bg-[#118DFF] hover:bg-[#0E7ADB] text-white">{t.request.button}</Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
