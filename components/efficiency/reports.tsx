"use client"

import { useState } from "react"
import { FileText, Download, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

export function EfficiencyReports() {
  const [selectedSections, setSelectedSections] = useState<string[]>([
    "overview",
    "risk",
    "hotspot",
    "priority",
    "cost",
  ])
  const [includeBranding, setIncludeBranding] = useState(true)
  const [customerName, setCustomerName] = useState("서울시 도시녹지과")
  const [isGenerating, setIsGenerating] = useState(false)

  const sections = [
    { id: "overview", label: "현황 요약 (Health/Risk Summary)" },
    { id: "risk", label: "위험도 분포 및 분석" },
    { id: "hotspot", label: "Hotspot Map (위험지역 지도)" },
    { id: "priority", label: "우선관리 추천 (Priority Actions)" },
    { id: "cost", label: "비용 절감 분석 (Cost Savings)" },
    { id: "data", label: "데이터 출처 및 분석 방법론" },
  ]

  const toggleSection = (id: string) => {
    setSelectedSections((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]))
  }

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      alert("PDF 리포트가 생성되었습니다!")
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <FileText size={20} />
          PDF 리포트 자동 생성
        </h3>

        {/* Section Selection */}
        <div className="mb-6">
          <p className="text-sm font-medium text-foreground mb-3">포함할 항목 선택:</p>
          <div className="space-y-2">
            {sections.map((section) => (
              <div
                key={section.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/50 cursor-pointer transition-colors"
                onClick={() => toggleSection(section.id)}
              >
                <Checkbox checked={selectedSections.includes(section.id)} />
                <span className="text-foreground flex-1">{section.label}</span>
                {selectedSections.includes(section.id) && <CheckCircle size={16} className="text-emerald-400" />}
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-700 pt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">고객명 (자동 삽입)</label>
            <Input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="예: 서울시 도시녹지과"
              className="max-w-md"
            />
          </div>

          <div className="flex items-center gap-3">
            <Checkbox checked={includeBranding} onCheckedChange={(checked) => setIncludeBranding(checked as boolean)} />
            <label
              className="text-sm text-foreground cursor-pointer"
              onClick={() => setIncludeBranding(!includeBranding)}
            >
              브랜드 로고 및 컬러 테마 포함 (InvaLab / NatureX)
            </label>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-6 mt-6">
          <Button
            size="lg"
            className="w-full"
            disabled={selectedSections.length === 0 || isGenerating}
            onClick={handleGenerate}
          >
            {isGenerating ? (
              <>생성 중...</>
            ) : (
              <>
                <Download size={18} className="mr-2" />
                리포트 다운로드 ({selectedSections.length}개 항목 선택됨)
              </>
            )}
          </Button>

          {selectedSections.length > 0 && (
            <div className="mt-4 p-4 bg-slate-800/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-2">포함될 내용:</p>
              <ul className="space-y-1 text-xs text-slate-300">
                <li>• 고객명: {customerName}</li>
                <li>• 분석 데이터: RGB, LiDAR, Multispectral, GIS</li>
                <li>• 생성 일시: {new Date().toLocaleDateString("ko-KR")}</li>
                <li>• 브랜딩: {includeBranding ? "포함" : "미포함"}</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Preview info */}
      <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-6">
        <h4 className="text-sm font-semibold text-foreground mb-3">리포트 구성 예시</h4>
        <div className="space-y-2 text-sm text-slate-300">
          <p>• 표지: 프로젝트명, 고객명, 분석 기간</p>
          <p>• 1장: 현황 요약 (수목 수, 건강지수, 위험도 분포)</p>
          <p>• 2장: 지도 시각화 (Hotspot Map, 필지별 위험도)</p>
          <p>• 3장: 우선관리 추천 (Critical/Short-term/Planned)</p>
          <p>• 4장: 비용 절감 분석 (A/B 시나리오 비교)</p>
          <p>• 5장: 데이터 출처 및 분석 방법론</p>
        </div>
      </div>
    </div>
  )
}
