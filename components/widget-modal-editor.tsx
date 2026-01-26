"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  AlertTriangle,
} from "lucide-react"
import { type WidgetCatalogItem, saveWidgetToCatalog, deleteWidgetFromCatalog } from "@/lib/widget-catalog"
import { useToast } from "@/hooks/use-toast"
import type { JSX } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface WidgetModalEditorProps {
  widget: WidgetCatalogItem | null
  isOpen: boolean
  onClose: () => void
  onSave: (widget: WidgetCatalogItem) => void
  onDelete?: (widgetId: string) => void
}

export function WidgetModalEditor({ widget, isOpen, onClose, onSave, onDelete }: WidgetModalEditorProps) {
  const { toast } = useToast()
  const [editedWidget, setEditedWidget] = useState<WidgetCatalogItem | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const isNewWidget = widget && !widget.createdAt

  useEffect(() => {
    if (widget) {
      setEditedWidget({ ...widget })
      setHasUnsavedChanges(false)
    }
  }, [widget])

  if (!isOpen || !editedWidget) return null

  const handleSave = () => {
    const updatedWidget = {
      ...editedWidget,
      updatedAt: new Date().toISOString(),
      createdAt: editedWidget.createdAt || new Date().toISOString(),
    }

    saveWidgetToCatalog(updatedWidget)
    toast({
      title: "저장 완료",
      description: `위젯 "${updatedWidget.nameKr}"이(가) 저장되었습니다`,
    })
    setHasUnsavedChanges(false)
    onSave(updatedWidget)
    onClose()
  }

  const handleDelete = () => {
    if (!editedWidget.id) return
    deleteWidgetFromCatalog(editedWidget.id)
    toast({
      title: "삭제 완료",
      description: `위젯 "${editedWidget.nameKr}"이(가) 삭제되었습니다`,
      variant: "destructive",
    })
    if (onDelete) onDelete(editedWidget.id)
    setShowDeleteDialog(false)
    onClose()
  }

  const handleClose = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm("저장하지 않은 변경사항이 있습니다. 닫으시겠습니까?")
      if (!confirmed) return
    }
    setHasUnsavedChanges(false)
    onClose()
  }

  const handleChange = (updates: Partial<WidgetCatalogItem>) => {
    setEditedWidget({ ...editedWidget, ...updates })
    setHasUnsavedChanges(true)
  }

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      common: "공통",
      efficiency: "운영비 절감",
      asset_value: "자산 가치 향상",
      biodiversity: "생물다양성",
    }
    return labels[cat] || cat
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, JSX.Element> = {
      active: (
        <span className="px-2 py-1 text-xs font-medium rounded-md bg-green-100 text-green-700">활성 (Active)</span>
      ),
      draft: (
        <span className="px-2 py-1 text-xs font-medium rounded-md bg-yellow-100 text-yellow-700">초안 (Draft)</span>
      ),
      deprecated: (
        <span className="px-2 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-600">종료 (Deprecated)</span>
      ),
    }
    return badges[status] || null
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={handleClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-xl shadow-2xl w-full max-w-[960px] max-h-[85vh] flex flex-col pointer-events-auto overflow-hidden border border-[#E5E7EB]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-6 py-5 border-b border-[#E5E7EB] bg-white flex-shrink-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <Input
                  value={editedWidget.nameKr}
                  onChange={(e) => handleChange({ nameKr: e.target.value })}
                  className="text-xl font-bold text-[#111827] border-none p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                  placeholder="위젯 이름"
                />
                <p className="text-sm text-[#6B7280] mt-1">분석 로직 · 시각화 · 서비스 배포 설정</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleSave}
                  disabled={!hasUnsavedChanges}
                  className="bg-[#118DFF] hover:bg-[#0D6FCC] text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  저장
                </Button>
                <Button variant="outline" onClick={handleClose} className="border-[#E5E7EB] bg-transparent">
                  취소
                </Button>
                {!isNewWidget && (
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteDialog(true)}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    삭제
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-xs font-medium rounded-md bg-[#118DFF]/10 text-[#118DFF]">
                {getCategoryLabel(editedWidget.category)}
              </span>
              {getStatusBadge(editedWidget.status)}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start border-b border-[#E5E7EB] rounded-none h-auto p-0 bg-transparent">
                <TabsTrigger
                  value="overview"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#118DFF]"
                >
                  <Info className="w-4 h-4 mr-2" />
                  개요
                </TabsTrigger>
                <TabsTrigger
                  value="inputs"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#118DFF]"
                >
                  <Database className="w-4 h-4 mr-2" />
                  입력 데이터
                </TabsTrigger>
                <TabsTrigger
                  value="metrics"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#118DFF]"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  지표·계산
                </TabsTrigger>
                <TabsTrigger
                  value="visuals"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#118DFF]"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  시각화
                </TabsTrigger>
                <TabsTrigger
                  value="insights"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#118DFF]"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  해석·원인
                </TabsTrigger>
                <TabsTrigger
                  value="usage"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#118DFF]"
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  배포·사용
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="p-6 space-y-6">
                <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 space-y-4">
                  <h3 className="font-semibold text-[#111827]">기본 정보</h3>

                  <div className="space-y-2">
                    <Label htmlFor="nameKr">위젯 이름 (한글)</Label>
                    <Input
                      id="nameKr"
                      value={editedWidget.nameKr}
                      onChange={(e) => handleChange({ nameKr: e.target.value })}
                      className="bg-white border-[#E5E7EB]"
                      placeholder="예: 수목 건강도 분석"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nameEn">Widget Name (English)</Label>
                    <Input
                      id="nameEn"
                      value={editedWidget.nameEn}
                      onChange={(e) => handleChange({ nameEn: e.target.value })}
                      className="bg-white border-[#E5E7EB]"
                      placeholder="e.g. Tree Health Analysis"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="descKr">설명 (한글)</Label>
                    <Textarea
                      id="descKr"
                      value={editedWidget.descriptionKr}
                      onChange={(e) => handleChange({ descriptionKr: e.target.value })}
                      className="bg-white border-[#E5E7EB] min-h-[80px]"
                      placeholder="위젯이 제공하는 기능과 목적을 설명하세요"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="descEn">Description (English)</Label>
                    <Textarea
                      id="descEn"
                      value={editedWidget.descriptionEn}
                      onChange={(e) => handleChange({ descriptionEn: e.target.value })}
                      className="bg-white border-[#E5E7EB] min-h-[80px]"
                      placeholder="Describe the widget's purpose and functionality"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">카테고리</Label>
                      <Select
                        value={editedWidget.category}
                        onValueChange={(value: any) => handleChange({ category: value })}
                      >
                        <SelectTrigger className="bg-white border-[#E5E7EB]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-[#E5E7EB]">
                          <SelectItem value="common">공통</SelectItem>
                          <SelectItem value="efficiency">운영비 절감</SelectItem>
                          <SelectItem value="asset_value">자산 가치 향상</SelectItem>
                          <SelectItem value="biodiversity">생물다양성</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">상태</Label>
                      <Select
                        value={editedWidget.status}
                        onValueChange={(value: any) => handleChange({ status: value })}
                      >
                        <SelectTrigger className="bg-white border-[#E5E7EB]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-[#E5E7EB]">
                          <SelectItem value="draft">초안 (Draft)</SelectItem>
                          <SelectItem value="active">활성 (Active)</SelectItem>
                          <SelectItem value="deprecated">종료 (Deprecated)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 space-y-4">
                  <h3 className="font-semibold text-[#111827]">사용 단계</h3>
                  <p className="text-sm text-[#6B7280]">이 위젯이 사용되는 서비스 단계를 선택하세요</p>
                  <div className="grid grid-cols-3 gap-2">
                    {["Planning", "Analysis", "Management"].map((stage) => (
                      <button
                        key={stage}
                        className="px-4 py-2 text-sm border border-[#E5E7EB] rounded-lg hover:border-[#118DFF] hover:bg-[#118DFF]/5 transition-colors"
                      >
                        {stage}
                      </button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="inputs" className="p-6 space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">필수 입력 데이터</p>
                      <p>선택한 데이터가 없으면 고객 화면에서 "데이터 부족" 상태로 표시됩니다.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 space-y-3">
                  <h3 className="font-semibold text-[#111827] mb-4">필수 데이터 소스</h3>
                  {[
                    { key: "rgbOrtho", label: "RGB Ortho", desc: "RGB 정사영상 (드론/항공)" },
                    { key: "lidarLaz", label: "LiDAR LAZ", desc: "LiDAR 포인트 클라우드" },
                    { key: "multispectral", label: "Multispectral", desc: "멀티스펙트럴 센서 데이터" },
                    { key: "satellite", label: "Satellite", desc: "위성 영상" },
                    { key: "csvOptional", label: "CSV (Optional)", desc: "추가 필드 조사 데이터" },
                  ].map(({ key, label, desc }) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg hover:border-[#118DFF] transition-colors"
                    >
                      <div className="flex-1">
                        <Label htmlFor={`input-${key}`} className="cursor-pointer font-medium text-[#111827]">
                          {label}
                        </Label>
                        <p className="text-xs text-[#6B7280] mt-0.5">{desc}</p>
                      </div>
                      <Checkbox
                        id={`input-${key}`}
                        checked={editedWidget.requiredInputs[key as keyof typeof editedWidget.requiredInputs]}
                        onCheckedChange={(checked) =>
                          handleChange({
                            requiredInputs: { ...editedWidget.requiredInputs, [key]: checked as boolean },
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="metrics" className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-[#111827]">지표 목록</h3>
                    <p className="text-sm text-[#6B7280] mt-1">분석 결과로 산출되는 측정 가능한 지표들</p>
                  </div>
                  <Button
                    size="sm"
                    className="gap-2 bg-[#118DFF] hover:bg-[#0D6FCC] text-white"
                    onClick={() => {
                      const newMetric = {
                        key: `metric_${Date.now()}`,
                        labelKr: "새 지표",
                        labelEn: "New Metric",
                        unit: null,
                        format: "number" as const,
                      }
                      handleChange({
                        metrics: [...editedWidget.metrics, newMetric],
                      })
                    }}
                  >
                    <Plus className="w-3 h-3" />
                    지표 추가
                  </Button>
                </div>

                {editedWidget.metrics.length === 0 ? (
                  <div className="text-center py-12 text-[#9CA3AF]">
                    <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">지표를 추가하여 분석 결과를 정의하세요</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {editedWidget.metrics.map((metric, index) => (
                      <div key={index} className="p-4 bg-white border border-[#E5E7EB] rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-semibold text-[#111827]">지표 #{index + 1}</span>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={() => {
                                if (index === 0) return
                                const newMetrics = [...editedWidget.metrics]
                                ;[newMetrics[index - 1], newMetrics[index]] = [newMetrics[index], newMetrics[index - 1]]
                                handleChange({ metrics: newMetrics })
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
                                handleChange({ metrics: newMetrics })
                              }}
                              disabled={index === editedWidget.metrics.length - 1}
                            >
                              <ChevronDown className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => {
                                handleChange({
                                  metrics: editedWidget.metrics.filter((_, i) => i !== index),
                                })
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="col-span-2">
                            <Label className="text-xs text-[#6B7280]">Key (API 필드명)</Label>
                            <Input
                              placeholder="risk_score"
                              value={metric.key}
                              onChange={(e) => {
                                const newMetrics = [...editedWidget.metrics]
                                newMetrics[index] = { ...metric, key: e.target.value }
                                handleChange({ metrics: newMetrics })
                              }}
                              className="text-sm bg-white border-[#E5E7EB] mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-[#6B7280]">한글명</Label>
                            <Input
                              placeholder="위험도 점수"
                              value={metric.labelKr}
                              onChange={(e) => {
                                const newMetrics = [...editedWidget.metrics]
                                newMetrics[index] = { ...metric, labelKr: e.target.value }
                                handleChange({ metrics: newMetrics })
                              }}
                              className="text-sm bg-white border-[#E5E7EB] mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-[#6B7280]">영문명</Label>
                            <Input
                              placeholder="Risk Score"
                              value={metric.labelEn}
                              onChange={(e) => {
                                const newMetrics = [...editedWidget.metrics]
                                newMetrics[index] = { ...metric, labelEn: e.target.value }
                                handleChange({ metrics: newMetrics })
                              }}
                              className="text-sm bg-white border-[#E5E7EB] mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-[#6B7280]">단위</Label>
                            <Input
                              placeholder="%"
                              value={metric.unit || ""}
                              onChange={(e) => {
                                const newMetrics = [...editedWidget.metrics]
                                newMetrics[index] = { ...metric, unit: e.target.value || null }
                                handleChange({ metrics: newMetrics })
                              }}
                              className="text-sm bg-white border-[#E5E7EB] mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-[#6B7280]">형식</Label>
                            <Select
                              value={metric.format}
                              onValueChange={(value: any) => {
                                const newMetrics = [...editedWidget.metrics]
                                newMetrics[index] = { ...metric, format: value }
                                handleChange({ metrics: newMetrics })
                              }}
                            >
                              <SelectTrigger className="bg-white border-[#E5E7EB] h-9 text-sm mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-[#E5E7EB]">
                                <SelectItem value="number">숫자</SelectItem>
                                <SelectItem value="percent">백분율</SelectItem>
                                <SelectItem value="score">점수</SelectItem>
                                <SelectItem value="text">텍스트</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="visuals" className="p-6 space-y-6">
                <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 space-y-4">
                  <h3 className="font-semibold text-[#111827]">지원 시각화 타입</h3>
                  <p className="text-sm text-[#6B7280]">이 위젯이 지원하는 차트 및 맵 표현 방식</p>

                  <div className="space-y-3 mt-4">
                    {editedWidget.visualizations.map((viz, index) => {
                      const vizLabels: Record<string, { label: string; desc: string }> = {
                        kpi: { label: "KPI 카드", desc: "단일 핵심 지표 표시" },
                        table: { label: "테이블", desc: "데이터 목록을 표 형태로 표시" },
                        map: { label: "지도 (Map)", desc: "공간 데이터 시각화" },
                        timeseries: { label: "시계열 차트", desc: "시간에 따른 변화 추이" },
                        histogram: { label: "히스토그램", desc: "분포 및 빈도 표시" },
                        heatmap: { label: "히트맵", desc: "밀도 및 강도 시각화" },
                      }
                      const info = vizLabels[viz.type] || { label: viz.type, desc: "" }

                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg hover:border-[#118DFF] transition-colors"
                        >
                          <div className="flex-1">
                            <Label htmlFor={`viz-${viz.type}`} className="cursor-pointer font-medium text-[#111827]">
                              {info.label}
                            </Label>
                            <p className="text-xs text-[#6B7280] mt-0.5">{info.desc}</p>
                          </div>
                          <Checkbox
                            id={`viz-${viz.type}`}
                            checked={viz.enabled}
                            onCheckedChange={(checked) => {
                              const newViz = [...editedWidget.visualizations]
                              newViz[index] = { ...viz, enabled: checked as boolean }
                              handleChange({ visualizations: newViz })
                            }}
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="bg-white border border-[#E5E7EB] rounded-lg p-4">
                  <h3 className="font-semibold text-[#111827] mb-2">색상 스케일</h3>
                  <p className="text-sm text-[#6B7280] mb-4">맵 및 차트에 사용할 색상 팔레트</p>
                  <div className="flex gap-2">
                    {["#22C55E", "#3B82F6", "#EF4444", "#F59E0B", "#8B5CF6"].map((color) => (
                      <button
                        key={color}
                        className="w-10 h-10 rounded-lg border-2 border-[#E5E7EB] hover:border-[#118DFF] transition-colors"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="insights" className="p-6 space-y-6">
                <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 space-y-4">
                  <h3 className="font-semibold text-[#111827]">자동 생성 해석 문구</h3>
                  <p className="text-sm text-[#6B7280]">
                    고객 리포트에 직접 사용될 요약 문구입니다. {"{"}변수명{"}"} 형태로 동적 값을 삽입할 수 있습니다.
                  </p>

                  <div className="space-y-2">
                    <Label htmlFor="summaryKr">한글 요약 템플릿</Label>
                    <Textarea
                      id="summaryKr"
                      value={editedWidget.insightTemplates.summaryKr}
                      onChange={(e) =>
                        handleChange({
                          insightTemplates: { ...editedWidget.insightTemplates, summaryKr: e.target.value },
                        })
                      }
                      className="bg-white border-[#E5E7EB] min-h-[100px] font-mono text-sm"
                      placeholder="예: 총 {tree_count}그루의 나무가 발견되었으며, 이 중 {risk_count}그루가 위험 상태입니다."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="summaryEn">English Summary Template</Label>
                    <Textarea
                      id="summaryEn"
                      value={editedWidget.insightTemplates.summaryEn}
                      onChange={(e) =>
                        handleChange({
                          insightTemplates: { ...editedWidget.insightTemplates, summaryEn: e.target.value },
                        })
                      }
                      className="bg-white border-[#E5E7EB] min-h-[100px] font-mono text-sm"
                      placeholder="e.g. A total of {tree_count} trees were detected, {risk_count} of which are at risk."
                    />
                  </div>
                </div>

                <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-[#111827]">원인 매핑 규칙</h3>
                      <p className="text-sm text-[#6B7280] mt-1">분석 결과에 따라 자동으로 원인을 추론</p>
                    </div>
                    <Button
                      size="sm"
                      className="gap-2 bg-[#118DFF] hover:bg-[#0D6FCC] text-white"
                      onClick={() => {
                        const newRule = {
                          condition: "",
                          causeKr: "",
                          causeEn: "",
                          source: "RGB" as const,
                        }
                        handleChange({
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
                    <div className="text-center py-8 text-[#9CA3AF] text-sm">
                      <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>원인 규칙을 추가하세요</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {editedWidget.insightTemplates.causeRules.map((rule, index) => (
                        <div key={index} className="p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-[#6B7280]">규칙 #{index + 1}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => {
                                handleChange({
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
                                handleChange({
                                  insightTemplates: { ...editedWidget.insightTemplates, causeRules: newRules },
                                })
                              }}
                              className="text-xs font-mono bg-white border-[#E5E7EB]"
                            />
                            <Input
                              placeholder="원인 (한글)"
                              value={rule.causeKr}
                              onChange={(e) => {
                                const newRules = [...editedWidget.insightTemplates.causeRules]
                                newRules[index] = { ...rule, causeKr: e.target.value }
                                handleChange({
                                  insightTemplates: { ...editedWidget.insightTemplates, causeRules: newRules },
                                })
                              }}
                              className="text-xs bg-white border-[#E5E7EB]"
                            />
                            <Select
                              value={rule.source}
                              onValueChange={(value: any) => {
                                const newRules = [...editedWidget.insightTemplates.causeRules]
                                newRules[index] = { ...rule, source: value }
                                handleChange({
                                  insightTemplates: { ...editedWidget.insightTemplates, causeRules: newRules },
                                })
                              }}
                            >
                              <SelectTrigger className="bg-white border-[#E5E7EB] h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-[#E5E7EB]">
                                <SelectItem value="RGB">RGB</SelectItem>
                                <SelectItem value="LiDAR">LiDAR</SelectItem>
                                <SelectItem value="Multispectral">Multispectral</SelectItem>
                                <SelectItem value="Satellite">Satellite</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="usage" className="p-6 space-y-6">
                <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 space-y-4">
                  <h3 className="font-semibold text-[#111827]">서비스 테마 적용</h3>
                  <p className="text-sm text-[#6B7280]">이 위젯을 사용할 수 있는 서비스 테마를 선택하세요</p>

                  <div className="space-y-2">
                    {[
                      { value: "efficiency", label: "운영비 절감" },
                      { value: "asset_value", label: "자산 가치 향상" },
                      { value: "biodiversity", label: "생물다양성 프로젝트" },
                    ].map(({ value, label }) => (
                      <div
                        key={value}
                        className="flex items-center justify-between p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg"
                      >
                        <Label htmlFor={`theme-${value}`} className="cursor-pointer font-medium text-[#111827]">
                          {label}
                        </Label>
                        <Checkbox id={`theme-${value}`} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 space-y-4">
                  <h3 className="font-semibold text-[#111827]">고객 화면 표시</h3>

                  <div className="space-y-2">
                    <Label htmlFor="customerName">고객용 위젯 이름</Label>
                    <Input
                      id="customerName"
                      value={editedWidget.nameKr}
                      onChange={(e) => handleChange({ nameKr: e.target.value })}
                      className="bg-white border-[#E5E7EB]"
                      placeholder="고객에게 표시될 이름"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customerDesc">고객용 설명</Label>
                    <Textarea
                      id="customerDesc"
                      value={editedWidget.descriptionKr}
                      onChange={(e) => handleChange({ descriptionKr: e.target.value })}
                      className="bg-white border-[#E5E7EB] min-h-[60px]"
                      placeholder="고객에게 표시될 설명"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="visibility">기본 노출 대상</Label>
                    <Select
                      value={editedWidget.defaultVisibility}
                      onValueChange={(value: any) => handleChange({ defaultVisibility: value })}
                    >
                      <SelectTrigger className="bg-white border-[#E5E7EB]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-[#E5E7EB]">
                        <SelectItem value="customer">고객 (Customer)</SelectItem>
                        <SelectItem value="admin">관리자 전용 (Admin Only)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 space-y-4">
                  <h3 className="font-semibold text-[#111827]">다운로드 포함</h3>
                  <p className="text-sm text-[#6B7280]">고객이 다운로드할 수 있는 파일 형식</p>

                  <div className="space-y-2">
                    {[
                      { value: "pdf", label: "PDF 리포트" },
                      { value: "csv", label: "CSV 데이터" },
                      { value: "geojson", label: "GeoJSON (공간 데이터)" },
                    ].map(({ value, label }) => (
                      <div
                        key={value}
                        className="flex items-center justify-between p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg"
                      >
                        <Label htmlFor={`export-${value}`} className="cursor-pointer font-medium text-[#111827]">
                          {label}
                        </Label>
                        <Checkbox id={`export-${value}`} />
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-white border-[#E5E7EB]">
          <AlertDialogHeader>
            <AlertDialogTitle>위젯 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              이 위젯을 삭제하시겠습니까? 삭제된 위젯은 복구할 수 없습니다.
              <br />
              <span className="font-medium text-[#111827] mt-2 block">"{editedWidget.nameKr}"</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#E5E7EB]">취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
