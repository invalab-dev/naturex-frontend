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
import { createOrganization, type Organization } from "@/lib/data-service"

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await createOrganization({
      orgId: formData.orgId || `org-${Date.now()}`,
      name: formData.name,
      industry: formData.industry,
      contact: formData.contact,
      status: formData.status,
    })

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
                    className="bg-white border-[#E5E7EB] placeholder:text-slate-400"
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
                    className="bg-white border-[#E5E7EB] placeholder:text-slate-400"
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
                  className="bg-white border-[#E5E7EB] placeholder:text-slate-400"
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
                    className="bg-white border-[#E5E7EB] placeholder:text-slate-400"
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
                    className="bg-white border-[#E5E7EB] placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="pb-2 border-b border-[#E5E7EB]">
                <h2 className="text-lg font-semibold text-[#111827]">기본 서비스 설정</h2>
                <p className="text-sm text-[#6B7280] mt-1">(UI 설정용) 현재 Milestone 1에서는 저장하지 않습니다.</p>
              </div>

              <div className="space-y-3">
                {[
                  { id: 'efficiency', label: '운영비 절감', desc: '탄소배출권, 에너지 절감, 운영 효율화 관련 서비스' },
                  { id: 'asset', label: '자산 가치 향상', desc: 'ESG 평가, 부동산 가치 상승, 브랜드 이미지 개선 관련 서비스' },
                  { id: 'biodiversity', label: '생물다양성', desc: '생태복원, 서식지 분석, TNFD 대응' },
                ].map((s) => (
                  <div key={s.id} className="flex items-start gap-3 p-4 rounded-lg border border-[#E5E7EB] hover:border-[#118DFF] transition-colors">
                    <Checkbox
                      id={`service-${s.id}`}
                      checked={formData.defaultServices.includes(s.id)}
                      onCheckedChange={() => toggleService(s.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label htmlFor={`service-${s.id}`} className="font-medium cursor-pointer">
                        {s.label}
                      </Label>
                      <p className="text-sm text-[#6B7280] mt-1">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="submit" className="bg-[#118DFF] hover:bg-[#0D6FCC]">
                생성
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}
