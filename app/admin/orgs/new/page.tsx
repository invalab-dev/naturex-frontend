"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Building2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { saveOrganization, type Organization } from "@/lib/data-service"

export default function NewOrgPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    orgId: "",
    industry: "",
    contact: "",
    contactName: "",
    status: "onboarding" as Organization["status"],
    defaultServices: [] as string[],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const org: Organization = {
      orgId: formData.orgId || `org-${Date.now()}`,
      name: formData.name,
      industry: formData.industry,
      contact: formData.contact,
      status: formData.status,
      createdAt: new Date().toISOString(),
    }

    saveOrganization(org)
    router.push("/admin/orgs")
  }

  const toggleService = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      defaultServices: prev.defaultServices.includes(service)
        ? prev.defaultServices.filter((s) => s !== service)
        : [...prev.defaultServices, service],
    }))
  }

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center p-8">
      <Card className="w-full max-w-2xl bg-white border-[#E5E7EB] shadow-lg">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <Link href="/admin/orgs">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                돌아가기
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-[#118DFF]/10 rounded-lg">
              <Building2 className="w-6 h-6 text-[#118DFF]" />
            </div>
            <h1 className="text-3xl font-bold text-[#111827]">새 조직 생성</h1>
          </div>
          <p className="text-[#6B7280] mb-8">조직은 프로젝트와 서비스 제공의 기본 단위입니다.</p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* (A) 기본 정보 */}
            <div className="space-y-4">
              <div className="pb-2 border-b border-[#E5E7EB]">
                <h2 className="text-lg font-semibold text-[#111827]">기본 정보</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    조직명 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="예: 서울시청"
                    required
                    className="bg-white border-[#E5E7EB]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="orgId" className="text-sm font-medium">
                    조직 ID <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="orgId"
                    value={formData.orgId}
                    onChange={(e) => setFormData({ ...formData, orgId: e.target.value })}
                    placeholder="예: seoul-city"
                    required
                    className="bg-white border-[#E5E7EB]"
                  />
                  <p className="text-xs text-[#6B7280]">영문, 숫자, 하이픈만 사용 가능</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry" className="text-sm font-medium">
                  업종
                </Label>
                <Input
                  id="industry"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  placeholder="예: 지자체, 기업, 공공기관"
                  className="bg-white border-[#E5E7EB]"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactName" className="text-sm font-medium">
                    담당자 이름
                  </Label>
                  <Input
                    id="contactName"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    placeholder="예: 홍길동"
                    className="bg-white border-[#E5E7EB]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact" className="text-sm font-medium">
                    담당자 이메일
                  </Label>
                  <Input
                    id="contact"
                    type="email"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    placeholder="contact@example.com"
                    className="bg-white border-[#E5E7EB]"
                  />
                </div>
              </div>
            </div>

            {/* (B) 기본 서비스 설정 */}
            <div className="space-y-4">
              <div className="pb-2 border-b border-[#E5E7EB]">
                <h2 className="text-lg font-semibold text-[#111827]">기본 서비스 설정</h2>
                <p className="text-sm text-[#6B7280] mt-1">선택 시 프로젝트 생성 시 기본 위젯 템플릿이 적용됩니다.</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 rounded-lg border border-[#E5E7EB] hover:border-[#118DFF] transition-colors">
                  <Checkbox
                    id="service-efficiency"
                    checked={formData.defaultServices.includes("efficiency")}
                    onCheckedChange={() => toggleService("efficiency")}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor="service-efficiency" className="font-medium cursor-pointer">
                      운영비 절감
                    </Label>
                    <p className="text-sm text-[#6B7280] mt-1">탄소배출권, 에너지 절감, 운영 효율화 관련 서비스</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg border border-[#E5E7EB] hover:border-[#118DFF] transition-colors">
                  <Checkbox
                    id="service-asset"
                    checked={formData.defaultServices.includes("asset")}
                    onCheckedChange={() => toggleService("asset")}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor="service-asset" className="font-medium cursor-pointer">
                      자산 가치 향상
                    </Label>
                    <p className="text-sm text-[#6B7280] mt-1">
                      ESG 평가, 부동산 가치 상승, 브랜드 이미지 개선 관련 서비스
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg border border-[#E5E7EB] hover:border-[#118DFF] transition-colors">
                  <Checkbox
                    id="service-biodiversity"
                    checked={formData.defaultServices.includes("biodiversity")}
                    onCheckedChange={() => toggleService("biodiversity")}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor="service-biodiversity" className="font-medium cursor-pointer">
                      생물다양성 프로젝트
                    </Label>
                    <p className="text-sm text-[#6B7280] mt-1">
                      생태계 복원, 생물종 보전, 자연기반해법(NbS) 관련 서비스
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* (C) 생성 액션 */}
            <div className="flex gap-3 justify-end pt-6 border-t border-[#E5E7EB]">
              <Link href="/admin/orgs">
                <Button type="button" variant="outline" size="lg">
                  취소
                </Button>
              </Link>
              <Button type="submit" size="lg" className="bg-[#118DFF] hover:bg-[#0D6FCC]">
                조직 생성
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}
