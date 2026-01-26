"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  X,
  Save,
  Info,
  Database,
  BarChart3,
  Eye,
  FileText,
  Rocket,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
} from "lucide-react"
import { type WidgetCatalogItem, saveWidgetToCatalog, getWidgetUsageStats } from "@/lib/widget-catalog"
import { useToast } from "@/hooks/use-toast"

interface WidgetDetailPanelProps {
  widget: WidgetCatalogItem
  onClose: () => void
  onUpdate: (widget: WidgetCatalogItem) => void
}

export function WidgetDetailPanel({ widget, onClose, onUpdate }: WidgetDetailPanelProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<"overview" | "inputs" | "metrics" | "visuals" | "insights" | "usage">(
    "overview",
  )
  const [editedWidget, setEditedWidget] = useState<WidgetCatalogItem>(widget)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    saveWidgetToCatalog(editedWidget)
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "저장 완료",
        description: "위젯 설정이 업데이트되었습니다",
      })
      onUpdate(editedWidget)
    }, 500)
  }

  const tabs = [
    { id: "overview", label: "개요", icon: Info },
    { id: "inputs", label: "입력", icon: Database },
    { id: "metrics", label: "지표/결과", icon: BarChart3 },
    { id: "visuals", label: "시각화", icon: Eye },
    { id: "insights", label: "해석/원인", icon: FileText },
    { id: "usage", label: "배포", icon: Rocket },
  ]

  const usageStats = getWidgetUsageStats(widget.id)

  return (
    <div className="fixed right-0 top-0 h-screen w-[480px] bg-white border-l border-[#E5E7EB] shadow-2xl flex flex-col z-50">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#E5E7EB] bg-[#F9FAFB]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-[#111827]">위젯 설정</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="text-sm text-[#6B7280]">{widget.nameKr}</div>
        <div className="text-xs text-[#9CA3AF]">{widget.id}</div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#E5E7EB] bg-white overflow-x-auto">
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? "border-[#118DFF] text-[#118DFF]"
                    : "border-transparent text-[#6B7280] hover:text-[#111827]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "overview" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nameKr">한글 이름</Label>
              <Input
                id="nameKr"
                value={editedWidget.nameKr}
                onChange={(e) => setEditedWidget({ ...editedWidget, nameKr: e.target.value })}
                className="bg-[#F5F7FB] border-[#E5E7EB]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nameEn">영문 이름</Label>
              <Input
                id="nameEn"
                value={editedWidget.nameEn}
                onChange={(e) => setEditedWidget({ ...editedWidget, nameEn: e.target.value })}
                className="bg-[#F5F7FB] border-[#E5E7EB]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descKr">한글 설명 (1줄)</Label>
              <Textarea
                id="descKr"
                value={editedWidget.descriptionKr}
                onChange={(e) => setEditedWidget({ ...editedWidget, descriptionKr: e.target.value })}
                className="bg-[#F5F7FB] border-[#E5E7EB] min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descEn">영문 설명 (1줄)</Label>
              <Textarea
                id="descEn"
                value={editedWidget.descriptionEn}
                onChange={(e) => setEditedWidget({ ...editedWidget, descriptionEn: e.target.value })}
                className="bg-[#F5F7FB] border-[#E5E7EB] min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">아이콘 (Lucide 이름)</Label>
              <Input
                id="icon"
                value={editedWidget.icon}
                onChange={(e) => setEditedWidget({ ...editedWidget, icon: e.target.value })}
                className="bg-[#F5F7FB] border-[#E5E7EB]"
                placeholder="예: AlertTriangle"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">카테고리</Label>
              <Select
                value={editedWidget.category}
                onValueChange={(value: any) => setEditedWidget({ ...editedWidget, category: value })}
              >
                <SelectTrigger className="bg-white border-[#E5E7EB]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="common">공통</SelectItem>
                  <SelectItem value="efficiency">운영비 절감</SelectItem>
                  <SelectItem value="asset_value">자산 가치</SelectItem>
                  <SelectItem value="biodiversity">생물다양성</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">상태</Label>
              <Select
                value={editedWidget.status}
                onValueChange={(value: any) => setEditedWidget({ ...editedWidget, status: value })}
              >
                <SelectTrigger className="bg-white border-[#E5E7EB]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="active">활성</SelectItem>
                  <SelectItem value="draft">초안</SelectItem>
                  <SelectItem value="deprecated">종료</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="visibility">기본 노출 대상</Label>
              <Select
                value={editedWidget.defaultVisibility}
                onValueChange={(value: any) => setEditedWidget({ ...editedWidget, defaultVisibility: value })}
              >
                <SelectTrigger className="bg-white border-[#E5E7EB]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="customer">고객</SelectItem>
                  <SelectItem value="admin">관리자</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="layout">기본 레이아웃</Label>
              <Select
                value={editedWidget.defaultLayout}
                onValueChange={(value: any) => setEditedWidget({ ...editedWidget, defaultLayout: value })}
              >
                <SelectTrigger className="bg-white border-[#E5E7EB]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="full">전체 (Full)</SelectItem>
                  <SelectItem value="half">반 (Half)</SelectItem>
                  <SelectItem value="third">1/3 (Third)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {activeTab === "inputs" && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
              필수 입력이 없으면 고객 화면에서 "데이터 부족" 상태로 표시됩니다.
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-[#F5F7FB] rounded-lg">
                <Label htmlFor="input-satellite" className="cursor-pointer flex-1">
                  Satellite (위성 영상)
                </Label>
                <Checkbox
                  id="input-satellite"
                  checked={editedWidget.requiredInputs.satellite}
                  onCheckedChange={(checked) =>
                    setEditedWidget({
                      ...editedWidget,
                      requiredInputs: { ...editedWidget.requiredInputs, satellite: checked as boolean },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-[#F5F7FB] rounded-lg">
                <Label htmlFor="input-rgb" className="cursor-pointer flex-1">
                  RGB Ortho (RGB 정사영상)
                </Label>
                <Checkbox
                  id="input-rgb"
                  checked={editedWidget.requiredInputs.rgbOrtho}
                  onCheckedChange={(checked) =>
                    setEditedWidget({
                      ...editedWidget,
                      requiredInputs: { ...editedWidget.requiredInputs, rgbOrtho: checked as boolean },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-[#F5F7FB] rounded-lg">
                <Label htmlFor="input-lidar" className="cursor-pointer flex-1">
                  LiDAR LAZ (LiDAR 포인트 클라우드)
                </Label>
                <Checkbox
                  id="input-lidar"
                  checked={editedWidget.requiredInputs.lidarLaz}
                  onCheckedChange={(checked) =>
                    setEditedWidget({
                      ...editedWidget,
                      requiredInputs: { ...editedWidget.requiredInputs, lidarLaz: checked as boolean },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-[#F5F7FB] rounded-lg">
                <Label htmlFor="input-ms" className="cursor-pointer flex-1">
                  Multispectral (멀티스펙트럴)
                </Label>
                <Checkbox
                  id="input-ms"
                  checked={editedWidget.requiredInputs.multispectral}
                  onCheckedChange={(checked) =>
                    setEditedWidget({
                      ...editedWidget,
                      requiredInputs: { ...editedWidget.requiredInputs, multispectral: checked as boolean },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-[#F5F7FB] rounded-lg">
                <Label htmlFor="input-csv" className="cursor-pointer flex-1">
                  CSV Optional (추가 CSV 데이터)
                </Label>
                <Checkbox
                  id="input-csv"
                  checked={editedWidget.requiredInputs.csvOptional}
                  onCheckedChange={(checked) =>
                    setEditedWidget({
                      ...editedWidget,
                      requiredInputs: { ...editedWidget.requiredInputs, csvOptional: checked as boolean },
                    })
                  }
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "metrics" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <Label>지표 목록</Label>
              <Button
                size="sm"
                variant="outline"
                className="gap-2 bg-transparent"
                onClick={() => {
                  const newMetric = {
                    key: `metric_${Date.now()}`,
                    labelKr: "새 지표",
                    labelEn: "New Metric",
                    unit: null,
                    format: "number" as const,
                  }
                  setEditedWidget({
                    ...editedWidget,
                    metrics: [...editedWidget.metrics, newMetric],
                  })
                }}
              >
                <Plus className="w-3 h-3" />
                지표 추가
              </Button>
            </div>

            {editedWidget.metrics.length === 0 ? (
              <div className="text-center py-8 text-[#9CA3AF] text-sm">
                <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>지표가 없습니다</p>
              </div>
            ) : (
              <div className="space-y-3">
                {editedWidget.metrics.map((metric, index) => (
                  <Card key={index} className="p-4 bg-[#F5F7FB] border-[#E5E7EB]">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-[#111827]">지표 {index + 1}</span>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => {
                            if (index === 0) return
                            const newMetrics = [...editedWidget.metrics]
                            ;[newMetrics[index - 1], newMetrics[index]] = [newMetrics[index], newMetrics[index - 1]]
                            setEditedWidget({ ...editedWidget, metrics: newMetrics })
                          }}
                          disabled={index === 0}
                        >
                          <ChevronUp className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => {
                            if (index === editedWidget.metrics.length - 1) return
                            const newMetrics = [...editedWidget.metrics]
                            ;[newMetrics[index], newMetrics[index + 1]] = [newMetrics[index + 1], newMetrics[index]]
                            setEditedWidget({ ...editedWidget, metrics: newMetrics })
                          }}
                          disabled={index === editedWidget.metrics.length - 1}
                        >
                          <ChevronDown className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                          onClick={() => {
                            setEditedWidget({
                              ...editedWidget,
                              metrics: editedWidget.metrics.filter((_, i) => i !== index),
                            })
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Input
                        placeholder="Key (예: risk_score)"
                        value={metric.key}
                        onChange={(e) => {
                          const newMetrics = [...editedWidget.metrics]
                          newMetrics[index] = { ...metric, key: e.target.value }
                          setEditedWidget({ ...editedWidget, metrics: newMetrics })
                        }}
                        className="text-sm bg-white"
                      />
                      <Input
                        placeholder="한글 라벨"
                        value={metric.labelKr}
                        onChange={(e) => {
                          const newMetrics = [...editedWidget.metrics]
                          newMetrics[index] = { ...metric, labelKr: e.target.value }
                          setEditedWidget({ ...editedWidget, metrics: newMetrics })
                        }}
                        className="text-sm bg-white"
                      />
                      <Input
                        placeholder="영문 라벨"
                        value={metric.labelEn}
                        onChange={(e) => {
                          const newMetrics = [...editedWidget.metrics]
                          newMetrics[index] = { ...metric, labelEn: e.target.value }
                          setEditedWidget({ ...editedWidget, metrics: newMetrics })
                        }}
                        className="text-sm bg-white"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          placeholder="단위 (예: %, m)"
                          value={metric.unit || ""}
                          onChange={(e) => {
                            const newMetrics = [...editedWidget.metrics]
                            newMetrics[index] = { ...metric, unit: e.target.value || null }
                            setEditedWidget({ ...editedWidget, metrics: newMetrics })
                          }}
                          className="text-sm bg-white"
                        />
                        <Select
                          value={metric.format}
                          onValueChange={(value: any) => {
                            const newMetrics = [...editedWidget.metrics]
                            newMetrics[index] = { ...metric, format: value }
                            setEditedWidget({ ...editedWidget, metrics: newMetrics })
                          }}
                        >
                          <SelectTrigger className="text-sm bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="number">숫자</SelectItem>
                            <SelectItem value="percent">퍼센트</SelectItem>
                            <SelectItem value="score">점수</SelectItem>
                            <SelectItem value="text">텍스트</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "visuals" && (
          <div className="space-y-4">
            <Label>지원 시각화 타입</Label>
            <div className="space-y-3">
              {editedWidget.visualizations.map((viz, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-[#F5F7FB] rounded-lg">
                  <Label htmlFor={`viz-${viz.type}`} className="cursor-pointer flex-1 capitalize">
                    {viz.type === "kpi" && "KPI 카드"}
                    {viz.type === "map" && "지도 레이어"}
                    {viz.type === "table" && "테이블 목록"}
                    {viz.type === "timeseries" && "시계열 차트"}
                    {viz.type === "histogram" && "히스토그램"}
                    {viz.type === "heatmap" && "히트맵"}
                  </Label>
                  <Checkbox
                    id={`viz-${viz.type}`}
                    checked={viz.enabled}
                    onCheckedChange={(checked) => {
                      const newViz = [...editedWidget.visualizations]
                      newViz[index] = { ...viz, enabled: checked as boolean }
                      setEditedWidget({ ...editedWidget, visualizations: newViz })
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "insights" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="summaryKr">한글 요약</Label>
              <Textarea
                id="summaryKr"
                value={editedWidget.insightTemplates.summaryKr}
                onChange={(e) =>
                  setEditedWidget({
                    ...editedWidget,
                    insightTemplates: { ...editedWidget.insightTemplates, summaryKr: e.target.value },
                  })
                }
                className="bg-[#F5F7FB] border-[#E5E7EB] min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="summaryEn">영문 요약</Label>
              <Textarea
                id="summaryEn"
                value={editedWidget.insightTemplates.summaryEn}
                onChange={(e) =>
                  setEditedWidget({
                    ...editedWidget,
                    insightTemplates: { ...editedWidget.insightTemplates, summaryEn: e.target.value },
                  })
                }
                className="bg-[#F5F7FB] border-[#E5E7EB] min-h-[80px]"
              />
            </div>

            <div className="border-t border-[#E5E7EB] pt-4 mt-4">
              <div className="flex items-center justify-between mb-3">
                <Label>원인 규칙</Label>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 bg-transparent"
                  onClick={() => {
                    const newRule = {
                      condition: "",
                      causeKr: "",
                      causeEn: "",
                      source: "LiDAR" as const,
                    }
                    setEditedWidget({
                      ...editedWidget,
                      insightTemplates: {
                        ...editedWidget.insightTemplates,
                        causeRules: [...editedWidget.insightTemplates.causeRules, newRule],
                      },
                    })
                  }}
                >
                  <Plus className="w-3 h-3" />
                  규칙 추가
                </Button>
              </div>

              {editedWidget.insightTemplates.causeRules.length === 0 ? (
                <div className="text-center py-6 text-[#9CA3AF] text-sm">
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>원인 규칙이 없습니다</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {editedWidget.insightTemplates.causeRules.map((rule, index) => (
                    <Card key={index} className="p-3 bg-[#F5F7FB] border-[#E5E7EB]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-[#6B7280]">규칙 {index + 1}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-red-600"
                          onClick={() => {
                            setEditedWidget({
                              ...editedWidget,
                              insightTemplates: {
                                ...editedWidget.insightTemplates,
                                causeRules: editedWidget.insightTemplates.causeRules.filter((_, i) => i !== index),
                              },
                            })
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Input
                          placeholder="조건 (예: leaning_angle > 10)"
                          value={rule.condition}
                          onChange={(e) => {
                            const newRules = [...editedWidget.insightTemplates.causeRules]
                            newRules[index] = { ...rule, condition: e.target.value }
                            setEditedWidget({
                              ...editedWidget,
                              insightTemplates: { ...editedWidget.insightTemplates, causeRules: newRules },
                            })
                          }}
                          className="text-xs bg-white"
                        />
                        <Input
                          placeholder="한글 원인"
                          value={rule.causeKr}
                          onChange={(e) => {
                            const newRules = [...editedWidget.insightTemplates.causeRules]
                            newRules[index] = { ...rule, causeKr: e.target.value }
                            setEditedWidget({
                              ...editedWidget,
                              insightTemplates: { ...editedWidget.insightTemplates, causeRules: newRules },
                            })
                          }}
                          className="text-xs bg-white"
                        />
                        <Input
                          placeholder="영문 원인"
                          value={rule.causeEn}
                          onChange={(e) => {
                            const newRules = [...editedWidget.insightTemplates.causeRules]
                            newRules[index] = { ...rule, causeEn: e.target.value }
                            setEditedWidget({
                              ...editedWidget,
                              insightTemplates: { ...editedWidget.insightTemplates, causeRules: newRules },
                            })
                          }}
                          className="text-xs bg-white"
                        />
                        <Select
                          value={rule.source}
                          onValueChange={(value: any) => {
                            const newRules = [...editedWidget.insightTemplates.causeRules]
                            newRules[index] = { ...rule, source: value }
                            setEditedWidget({
                              ...editedWidget,
                              insightTemplates: { ...editedWidget.insightTemplates, causeRules: newRules },
                            })
                          }}
                        >
                          <SelectTrigger className="text-xs bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="LiDAR">LiDAR</SelectItem>
                            <SelectItem value="RGB">RGB</SelectItem>
                            <SelectItem value="Multispectral">Multispectral</SelectItem>
                            <SelectItem value="Satellite">Satellite</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "usage" && (
          <div className="space-y-4">
            <div className="bg-[#F5F7FB] rounded-lg p-4">
              <h3 className="text-sm font-semibold text-[#111827] mb-3">사용 현황</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">사용 중인 프로젝트</span>
                  <span className="font-medium text-[#111827]">{usageStats.projectCount}개</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">프로젝트별 설정 수정</span>
                  <span className="font-medium text-[#111827]">{usageStats.overrideCount}개</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">최종 업데이트</span>
                  <span className="font-medium text-[#111827]">
                    {new Date(widget.updatedAt).toLocaleDateString("ko-KR")}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Button className="w-full bg-[#118DFF] hover:bg-[#0D6FCC] gap-2">
                <Rocket className="w-4 h-4" />
                프로젝트에 적용
              </Button>
              <p className="text-xs text-[#6B7280] text-center">선택한 프로젝트의 위젯 구성에 이 위젯을 추가합니다</p>
            </div>

            <div className="border-t border-[#E5E7EB] pt-4">
              <Button variant="outline" className="w-full gap-2 bg-transparent">
                기본 템플릿에 반영
              </Button>
              <p className="text-xs text-[#6B7280] text-center mt-2">조직별 기본 템플릿 업데이트 (선택사항)</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-[#E5E7EB] bg-[#F9FAFB]">
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
            취소
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="flex-1 bg-[#118DFF] hover:bg-[#0D6FCC] gap-2">
            <Save className="w-4 h-4" />
            {isSaving ? "저장 중..." : "저장"}
          </Button>
        </div>
      </div>
    </div>
  )
}
