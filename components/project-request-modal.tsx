"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { createProjectRequest, getOrganizationById } from "@/lib/data-service"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Gauge, TrendingUp, Leaf, CheckCircle2 } from "lucide-react"

interface ProjectRequestModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProjectRequestModal({ open, onOpenChange }: ProjectRequestModalProps) {
  const { user } = useAuth()
  const { toast } = useToast()

  const [selectedPurpose, setSelectedPurpose] = useState<"efficiency" | "asset" | "biodiversity" | null>(null)
  const [location, setLocation] = useState("")
  const [availableData, setAvailableData] = useState<string[]>([])
  const [expectedOutputs, setExpectedOutputs] = useState<string[]>([])
  const [additionalNotes, setAdditionalNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const purposes = [
    {
      value: "efficiency" as const,
      label: "운영비 절감",
      description: "AI 기반 유지관리 우선순위 자동화",
      icon: Gauge,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      value: "asset" as const,
      label: "자산 가치 향상",
      description: "자연자산의 장기 가치 정량화",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      value: "biodiversity" as const,
      label: "생물다양성 프로젝트",
      description: "ESG·TNFD 공시 대응 및 생태 복원",
      icon: Leaf,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200",
    },
  ]

  const dataOptions = [
    { value: "drone_rgb", label: "드론 RGB" },
    { value: "lidar", label: "LiDAR" },
    { value: "satellite", label: "위성" },
    { value: "none", label: "데이터 없음 (취득 요청)" },
  ]

  const outputOptions = [
    { value: "dashboard", label: "대시보드" },
    { value: "pdf_report", label: "PDF 보고서" },
    { value: "data_download", label: "데이터 다운로드" },
  ]

  const handleDataToggle = (value: string) => {
    setAvailableData((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]))
  }

  const handleOutputToggle = (value: string) => {
    setExpectedOutputs((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]))
  }

  const handleSubmit = async () => {
    if (!user || !selectedPurpose || !location) {
      toast({
        title: "입력 오류",
        description: "필수 항목을 모두 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const org = user.orgId ? getOrganizationById(user.orgId) : null

      const request = createProjectRequest({
        orgId: user.orgId || "",
        orgName: org?.name || "Unknown Organization",
        requestedBy: user.name,
        requestedByEmail: user.email,
        purpose: selectedPurpose,
        location,
        availableData: availableData as any,
        expectedOutputs: expectedOutputs as any,
        additionalNotes: additionalNotes || undefined,
      })

      toast({
        title: "요청이 전달되었습니다",
        description: "NatureX 팀이 검토 후 프로젝트를 구성합니다.",
      })

      // Reset form
      setSelectedPurpose(null)
      setLocation("")
      setAvailableData([])
      setExpectedOutputs([])
      setAdditionalNotes("")

      onOpenChange(false)
    } catch (error) {
      console.error("[v0] Failed to submit request:", error)
      toast({
        title: "요청 실패",
        description: "프로젝트 요청 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-white border-[#E5E7EB]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#111827]">새 프로젝트 요청</DialogTitle>
          <DialogDescription className="text-[#6B7280]">
            NatureX 팀이 고객님의 목적에 맞는 프로젝트를 구성해드립니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Section 1: Purpose Selection */}
          <div>
            <Label className="text-base font-semibold text-[#111827] mb-3 block">1. 프로젝트 목적 선택 *</Label>
            <div className="grid gap-3">
              {purposes.map((purpose) => {
                const Icon = purpose.icon
                const isSelected = selectedPurpose === purpose.value
                return (
                  <button
                    key={purpose.value}
                    type="button"
                    onClick={() => setSelectedPurpose(purpose.value)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? `${purpose.borderColor} ${purpose.bgColor}`
                        : "border-[#E5E7EB] bg-white hover:border-[#D1D5DB]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`w-5 h-5 mt-0.5 ${isSelected ? purpose.color : "text-[#6B7280]"}`} />
                      <div className="flex-1">
                        <div className="font-semibold text-[#111827] mb-1">{purpose.label}</div>
                        <div className="text-sm text-[#6B7280]">{purpose.description}</div>
                      </div>
                      {isSelected && <CheckCircle2 className={`w-5 h-5 ${purpose.color}`} />}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Section 2: Location */}
          <div>
            <Label htmlFor="location" className="text-base font-semibold text-[#111827] mb-3 block">
              2. 대상 지역 / 자산 설명 *
            </Label>
            <Textarea
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="예: 서울시 성동구 서울숲 / 경기도 양평군 산림 지역 (약 50ha)"
              className="min-h-[80px] bg-white border-[#E5E7EB] placeholder:text-[#9CA3AF]"
            />
          </div>

          {/* Section 3: Available Data */}
          <div>
            <Label className="text-base font-semibold text-[#111827] mb-3 block">3. 보유 데이터 여부</Label>
            <div className="space-y-2">
              {dataOptions.map((option) => (
                <div key={option.value} className="flex items-center gap-2">
                  <Checkbox
                    id={`data-${option.value}`}
                    checked={availableData.includes(option.value)}
                    onCheckedChange={() => handleDataToggle(option.value)}
                  />
                  <label htmlFor={`data-${option.value}`} className="text-sm text-[#374151] cursor-pointer">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Expected Outputs */}
          <div>
            <Label className="text-base font-semibold text-[#111827] mb-3 block">4. 기대 결과</Label>
            <div className="space-y-2">
              {outputOptions.map((option) => (
                <div key={option.value} className="flex items-center gap-2">
                  <Checkbox
                    id={`output-${option.value}`}
                    checked={expectedOutputs.includes(option.value)}
                    onCheckedChange={() => handleOutputToggle(option.value)}
                  />
                  <label htmlFor={`output-${option.value}`} className="text-sm text-[#374151] cursor-pointer">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Additional Notes */}
          <div>
            <Label htmlFor="notes" className="text-base font-semibold text-[#111827] mb-3 block">
              5. 추가 요청 사항 (선택)
            </Label>
            <Textarea
              id="notes"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="기타 요구사항이나 특이사항을 자유롭게 작성해주세요."
              className="min-h-[100px] bg-white border-[#E5E7EB] placeholder:text-[#9CA3AF]"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-4 border-t border-[#E5E7EB]">
          <Button onClick={() => onOpenChange(false)} variant="outline" disabled={isSubmitting}>
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedPurpose || !location || isSubmitting}
            className="bg-[#118DFF] hover:bg-[#0d6ecc] text-white"
          >
            {isSubmitting ? "제출 중..." : "요청 제출"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
