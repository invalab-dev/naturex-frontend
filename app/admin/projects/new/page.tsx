"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, FolderKanban, CheckCircle2, Leaf, TrendingUp, TreePine, Search, Map, Download, BarChart3, Info } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getOrganizations, saveProject, type Project, type Organization, type ResultConfig } from "@/lib/data-service"

export default function NewProjectPage() {
  const router = useRouter()
  const [orgs, setOrgs] = useState<Organization[]>([])
  const [orgSearch, setOrgSearch] = useState("")
  const [showOrgDropdown, setShowOrgDropdown] = useState(false)
  const [formData, setFormData] = useState({
    orgId: "",
    orgName: "",
    name: "",
    description: "",
    theme: "" as "efficiency" | "asset" | "biodiversity" | "",
    location: "",
  })

  // Result configuration state
  const [resultConfig, setResultConfig] = useState<ResultConfig>({
    map: { enabled: false, types: [] },
    downloads: { enabled: false },
    tables: { enabled: false, types: [] },
  })

  const projectId = formData.name
    ? `proj-${formData.name.toLowerCase().replace(/[^a-z0-9가-힣]/g, "-").slice(0, 20)}-${Date.now().toString().slice(-4)}`
    : "proj-xxxx"

  useEffect(() => {
    setOrgs(getOrganizations())
  }, [])

  const filteredOrgs = orgs.filter(
    (org) =>
      org.name.toLowerCase().includes(orgSearch.toLowerCase()) ||
      org.industry.toLowerCase().includes(orgSearch.toLowerCase())
  )

  const handleOrgSelect = (org: Organization) => {
    setFormData({ ...formData, orgId: org.orgId, orgName: org.name })
    setOrgSearch(org.name)
    setShowOrgDropdown(false)
  }

  // Map type toggle
  const toggleMapType = (type: "geojson" | "tiles3d" | "laz") => {
    setResultConfig(prev => ({
      ...prev,
      map: {
        ...prev.map,
        types: prev.map.types.includes(type)
          ? prev.map.types.filter(t => t !== type)
          : [...prev.map.types, type]
      }
    }))
  }

  // Table type toggle
  const toggleTableType = (type: "table" | "bar" | "line" | "kpi") => {
    setResultConfig(prev => ({
      ...prev,
      tables: {
        ...prev.tables,
        types: prev.tables.types.includes(type)
          ? prev.tables.types.filter(t => t !== type)
          : [...prev.tables.types, type]
      }
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.orgId || !formData.theme || !formData.name) {
      return
    }

    const project: Project = {
      projectId,
      name: formData.name,
      orgId: formData.orgId,
      theme: formData.theme,
      location: formData.location,
      description: formData.description,
      deliveryStage: "pending",
      lastActivityAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      resultConfig: resultConfig,
    }

    saveProject(project)
    router.push(`/admin/projects?created=${project.projectId}`)
  }

  const themeOptions = [
    {
      value: "efficiency",
      label: "운영비 절감",
      icon: TrendingUp,
      description: "유지관리 효율화, 에너지 절감, 비용 최적화",
      color: "#3B82F6",
    },
    {
      value: "asset",
      label: "자산 가치 향상",
      icon: Leaf,
      description: "ESG 평가, 탄소저장량, 자산 가치 정량화",
      color: "#10B981",
    },
    {
      value: "biodiversity",
      label: "생물다양성 프로젝트",
      icon: TreePine,
      description: "생태복원, 서식지 분석, TNFD 대응",
      color: "#8B5CF6",
    },
  ]

  const isFormValid = formData.orgId && formData.theme && formData.name && formData.location

  // Count selected result types for preview
  const selectedResultCount = [
    resultConfig.map.enabled,
    resultConfig.downloads.enabled,
    resultConfig.tables.enabled,
  ].filter(Boolean).length

  return (
    <div className="min-h-screen bg-[#F5F7FB] p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin/projects">
            <Button variant="ghost" size="sm" className="gap-2 mb-4 text-[#6B7280] hover:text-[#111827]">
              <ArrowLeft className="w-4 h-4" />
              프로젝트 목록
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-[#118DFF]/10 rounded-lg">
              <FolderKanban className="w-6 h-6 text-[#118DFF]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#111827]">새 프로젝트 생성</h1>
              <p className="text-sm text-[#6B7280]">
                프로젝트 정보와 결과 제공 유형을 설정합니다.
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left Column - Project Info Form */}
          <div className="lg:col-span-3 space-y-6">
            <form onSubmit={handleSubmit}>
              {/* Basic Info Card */}
              <Card className="bg-white border-[#E5E7EB] p-6 space-y-6 mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-[#111827] mb-1">프로젝트 기본 정보</h2>
                  <p className="text-sm text-[#6B7280]">프로젝트의 기본 정보를 입력하세요.</p>
                </div>

                {/* Project Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-[#374151]">
                    프로젝트명 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="예: 서울숲 생태복원 프로젝트"
                    className="bg-white border-[#E5E7EB] h-11 placeholder:text-slate-400"
                    required
                  />
                </div>

                {/* Customer Org Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#374151]">
                    고객 조직 <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                      <Input
                        value={orgSearch}
                        onChange={(e) => {
                          setOrgSearch(e.target.value)
                          setShowOrgDropdown(true)
                          if (!e.target.value) {
                            setFormData({ ...formData, orgId: "", orgName: "" })
                          }
                        }}
                        onFocus={() => setShowOrgDropdown(true)}
                        placeholder="조직 검색..."
                        className="bg-white border-[#E5E7EB] h-11 pl-10 placeholder:text-slate-400"
                      />
                    </div>
                    {showOrgDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-[#E5E7EB] rounded-lg shadow-lg max-h-60 overflow-auto">
                        {filteredOrgs.length === 0 ? (
                          <div className="p-3 text-sm text-[#6B7280]">검색 결과가 없습니다</div>
                        ) : (
                          filteredOrgs.map((org) => (
                            <button
                              key={org.orgId}
                              type="button"
                              onClick={() => handleOrgSelect(org)}
                              className={`w-full px-4 py-3 text-left hover:bg-[#F5F7FB] flex items-center justify-between ${
                                formData.orgId === org.orgId ? "bg-[#118DFF]/5" : ""
                              }`}
                            >
                              <div>
                                <div className="font-medium text-[#111827]">{org.name}</div>
                                <div className="text-xs text-[#6B7280]">{org.industry}</div>
                              </div>
                              {formData.orgId === org.orgId && (
                                <CheckCircle2 className="w-5 h-5 text-[#118DFF]" />
                              )}
                            </button>
                          ))
                        )}
                        <Link href="/admin/orgs/new" className="block">
                          <div className="px-4 py-3 text-sm text-[#118DFF] hover:bg-[#F5F7FB] border-t border-[#E5E7EB]">
                            + 새 조직 생성
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-medium text-[#374151]">
                    프로젝트 위치 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="예: 서울시 성동구"
                    className="bg-white border-[#E5E7EB] h-11 placeholder:text-slate-400"
                    required
                  />
                </div>

                {/* Theme Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-[#374151]">
                    서비스 테마 <span className="text-red-500">*</span>
                  </Label>
                  <div className="grid gap-3">
                    {themeOptions.map((option) => {
                      const Icon = option.icon
                      const isSelected = formData.theme === option.value
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, theme: option.value as any })}
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            isSelected
                              ? "border-[#118DFF] bg-[#118DFF]/5"
                              : "border-[#E5E7EB] hover:border-[#D1D5DB] bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="p-2 rounded-lg"
                              style={{ backgroundColor: `${option.color}15` }}
                            >
                              <Icon className="w-5 h-5" style={{ color: option.color }} />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-[#111827]">{option.label}</div>
                              <div className="text-xs text-[#6B7280]">{option.description}</div>
                            </div>
                            {isSelected && <CheckCircle2 className="w-5 h-5 text-[#118DFF]" />}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium text-[#374151]">
                    프로젝트 설명 <span className="text-[#9CA3AF]">(선택)</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="프로젝트에 대한 간단한 설명을 입력하세요"
                    className="bg-white border-[#E5E7EB] min-h-[80px] resize-none placeholder:text-slate-400"
                  />
                </div>
              </Card>

              {/* Result Configuration Card */}
              <Card className="bg-white border-[#E5E7EB] p-6 space-y-6 mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-[#111827] mb-1">결과 제공 유형 설정</h2>
                  <p className="text-sm text-[#6B7280]">이 프로젝트에서 고객에게 제공할 결과 유형을 선택하세요.</p>
                </div>

                {/* Map Results */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-4 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB]">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Map className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <Checkbox
                          checked={resultConfig.map.enabled}
                          onCheckedChange={(checked) => 
                            setResultConfig(prev => ({ 
                              ...prev, 
                              map: { 
                                ...prev.map, 
                                enabled: checked === true,
                                types: checked === true ? prev.map.types : []
                              } 
                            }))
                          }
                        />
                        <span className="font-medium text-[#111827]">지도 결과를 제공함</span>
                      </label>
                    </div>
                  </div>

                  {resultConfig.map.enabled && (
                    <div className="ml-4 pl-4 border-l-2 border-blue-200 space-y-3">
                      <div className="text-sm font-medium text-[#374151]">지도 유형 선택</div>
                      <div className="space-y-2">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <Checkbox
                            checked={resultConfig.map.types.includes("geojson")}
                            onCheckedChange={() => toggleMapType("geojson")}
                          />
                          <span className="text-sm text-[#374151]">GeoJSON (2D 지도 레이어)</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <Checkbox
                            checked={resultConfig.map.types.includes("tiles3d")}
                            onCheckedChange={() => toggleMapType("tiles3d")}
                          />
                          <span className="text-sm text-[#374151]">3D Tileset (3D 지도)</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <Checkbox
                            checked={resultConfig.map.types.includes("laz")}
                            onCheckedChange={() => toggleMapType("laz")}
                          />
                          <span className="text-sm text-[#374151]">LAZ / LAS (원본 저장용, 고객 비노출)</span>
                        </label>
                      </div>
                      <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                        <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-blue-700">
                          GeoJSON / 3D Tileset만 고객 화면에 표시 가능합니다. LAZ/LAS는 내부 분석용으로만 저장됩니다.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Download Files */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-4 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB]">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Download className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <Checkbox
                          checked={resultConfig.downloads.enabled}
                          onCheckedChange={(checked) => 
                            setResultConfig(prev => ({ 
                              ...prev, 
                              downloads: { enabled: checked === true } 
                            }))
                          }
                        />
                        <span className="font-medium text-[#111827]">파일 다운로드를 제공함</span>
                      </label>
                    </div>
                  </div>

                  {resultConfig.downloads.enabled && (
                    <div className="ml-4 pl-4 border-l-2 border-green-200">
                      <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                        <Info className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-green-700">
                          분석 완료 후 InvaLab에서 결과 파일을 업로드합니다.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Tables & Charts */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-4 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB]">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <BarChart3 className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <Checkbox
                          checked={resultConfig.tables.enabled}
                          onCheckedChange={(checked) => 
                            setResultConfig(prev => ({ 
                              ...prev, 
                              tables: { 
                                ...prev.tables, 
                                enabled: checked === true,
                                types: checked === true ? prev.tables.types : []
                              } 
                            }))
                          }
                        />
                        <span className="font-medium text-[#111827]">표 또는 도표를 제공함</span>
                      </label>
                    </div>
                  </div>

                  {resultConfig.tables.enabled && (
                    <div className="ml-4 pl-4 border-l-2 border-purple-200 space-y-3">
                      <div className="text-sm font-medium text-[#374151]">표현 유형 선택</div>
                      <div className="space-y-2">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <Checkbox
                            checked={resultConfig.tables.types.includes("table")}
                            onCheckedChange={() => toggleTableType("table")}
                          />
                          <span className="text-sm text-[#374151]">표 (Table)</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <Checkbox
                            checked={resultConfig.tables.types.includes("bar")}
                            onCheckedChange={() => toggleTableType("bar")}
                          />
                          <span className="text-sm text-[#374151]">막대그래프 (Bar)</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <Checkbox
                            checked={resultConfig.tables.types.includes("line")}
                            onCheckedChange={() => toggleTableType("line")}
                          />
                          <span className="text-sm text-[#374151]">선그래프 (Line)</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <Checkbox
                            checked={resultConfig.tables.types.includes("kpi")}
                            onCheckedChange={() => toggleTableType("kpi")}
                          />
                          <span className="text-sm text-[#374151]">KPI 카드</span>
                        </label>
                      </div>
                      <div className="flex items-start gap-2 p-3 bg-purple-50 rounded-lg">
                        <Info className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-purple-700">
                          선택한 유형에 맞춰 분석 결과가 대시보드로 제공됩니다.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Info Footer */}
                <div className="pt-4 border-t border-[#E5E7EB]">
                  <p className="text-xs text-[#6B7280]">
                    선택한 결과 유형은 이후 프로젝트 관리 화면에서 실제 데이터 업로드로 이어집니다.
                  </p>
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Link href="/admin/projects" className="flex-1">
                  <Button type="button" variant="outline" className="w-full h-11 bg-white">
                    취소
                  </Button>
                </Link>
                <Button
                  type="submit"
                  className="flex-1 h-11 bg-[#118DFF] hover:bg-[#0D6FCC] text-white"
                  disabled={!isFormValid}
                >
                  프로젝트 생성
                </Button>
              </div>
            </form>
          </div>

          {/* Right Column - Preview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project ID Preview */}
            <Card className="bg-white border-[#E5E7EB] p-5">
              <h3 className="text-sm font-medium text-[#374151] mb-3">프로젝트 정보</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-[#6B7280] mb-1">프로젝트 ID</div>
                  <code className="text-sm font-mono text-[#111827] bg-[#F5F7FB] px-2 py-1 rounded block">
                    {projectId}
                  </code>
                </div>
                <div>
                  <div className="text-xs text-[#6B7280] mb-1">고객 대시보드 경로</div>
                  <code className="text-sm font-mono text-[#118DFF] bg-[#F5F7FB] px-2 py-1 rounded block">
                    /app/projects/{formData.name ? projectId : "{projectId}"}
                  </code>
                </div>
              </div>
            </Card>

            {/* Selected Results Preview */}
            <Card className="bg-white border-[#E5E7EB] p-5">
              <h3 className="text-sm font-medium text-[#374151] mb-3">
                결과 제공 설정
                {selectedResultCount > 0 && (
                  <span className="ml-2 text-xs font-normal text-[#118DFF]">
                    ({selectedResultCount}개 선택됨)
                  </span>
                )}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${resultConfig.map.enabled ? "bg-blue-500" : "bg-[#E5E7EB]"}`} />
                  <span className={resultConfig.map.enabled ? "text-[#111827]" : "text-[#9CA3AF]"}>
                    지도 레이어
                    {resultConfig.map.enabled && resultConfig.map.types.length > 0 && (
                      <span className="text-xs text-[#6B7280] ml-1">
                        ({resultConfig.map.types.map(t => 
                          t === "geojson" ? "GeoJSON" : t === "tiles3d" ? "3D" : "LAZ"
                        ).join(", ")})
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${resultConfig.downloads.enabled ? "bg-green-500" : "bg-[#E5E7EB]"}`} />
                  <span className={resultConfig.downloads.enabled ? "text-[#111827]" : "text-[#9CA3AF]"}>
                    다운로드 파일
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${resultConfig.tables.enabled ? "bg-purple-500" : "bg-[#E5E7EB]"}`} />
                  <span className={resultConfig.tables.enabled ? "text-[#111827]" : "text-[#9CA3AF]"}>
                    표·도표
                    {resultConfig.tables.enabled && resultConfig.tables.types.length > 0 && (
                      <span className="text-xs text-[#6B7280] ml-1">
                        ({resultConfig.tables.types.map(t => 
                          t === "table" ? "표" : t === "bar" ? "막대" : t === "line" ? "선" : "KPI"
                        ).join(", ")})
                      </span>
                    )}
                  </span>
                </div>
              </div>
              {selectedResultCount === 0 && (
                <p className="text-xs text-[#9CA3AF] mt-4">
                  결과 유형을 선택해주세요.
                </p>
              )}
            </Card>

            {/* Tips */}
            <Card className="bg-[#118DFF]/5 border-[#118DFF]/20 p-5">
              <h3 className="text-sm font-medium text-[#118DFF] mb-2">다음 단계</h3>
              <ol className="text-sm text-[#374151] space-y-2 list-decimal list-inside">
                <li>프로젝트 생성</li>
                <li>분석 결과 업로드 (지도, 파일, 차트)</li>
                <li>고객 공개 설정</li>
                <li>고객 대시보드 확인</li>
              </ol>
            </Card>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showOrgDropdown && (
        <div className="fixed inset-0 z-0" onClick={() => setShowOrgDropdown(false)} />
      )}
    </div>
  )
}
