"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  ChevronUp,
  ChevronDown,
  Eye,
  Save,
  ArrowLeft,
  Settings,
  Layout,
  Grid3x3,
  Lock,
  Unlock,
  Search,
  Sparkles,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import {
  getProjectById,
  getWidgetConfig,
  saveWidgetConfig,
  setProjectWidgets,
  type Project,
  type Widget,
  type WidgetConfig,
} from "@/lib/data-service"
import {
  getWidgetCatalog,
  getProjectOverrides,
  saveProjectOverride,
  deleteProjectOverride,
  type WidgetCatalogItem,
  categoryLabels,
} from "@/lib/widget-catalog"
import { useToast } from "@/hooks/use-toast"

export default function WidgetBuilderPage() {
  const params = useParams()
  const projectId = params.projectId as string
  const router = useRouter()
  const { toast } = useToast()
  const [project, setProject] = useState<Project | null>(null)
  const [widgets, setWidgets] = useState<Widget[]>([])
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const [catalogWidgets, setCatalogWidgets] = useState<WidgetCatalogItem[]>([])
  const [projectOverrides, setProjectOverrides] = useState<Map<string, boolean>>(new Map())
  const [overrideMode, setOverrideMode] = useState(false)

  useEffect(() => {
    const proj = getProjectById(projectId)
    if (!proj) {
      router.push("/admin/projects")
      return
    }
    setProject(proj)

    const catalog = getWidgetCatalog()
    setCatalogWidgets(catalog)

    // Load existing widget config
    let config = getWidgetConfig(projectId)
    if (!config) {
      const themeWidgets = catalog.filter((w) => w.category === proj.theme || w.category === "common")
      const initialWidgets: Widget[] = themeWidgets.map((w, index) => ({
        id: w.id,
        title: w.nameKr,
        description: w.descriptionKr,
        enabled: w.status === "active" && index < 5, // Enable first 5 by default
        permission: w.defaultVisibility === "customer" ? "customer_view" : "admin_only",
        order: index + 1,
        component: w.id, // Use catalog ID as component reference
      }))

      config = {
        projectId: projectId,
        theme: proj.theme,
        widgets: initialWidgets,
        updatedAt: new Date().toISOString(),
      }
    }

    setWidgets(config.widgets)
    if (config.widgets.length > 0) {
      setSelectedWidget(config.widgets[0])
    }

    const overrides = getProjectOverrides(projectId)
    const overrideMap = new Map<string, boolean>()
    overrides.forEach((o) => overrideMap.set(o.widgetId, true))
    setProjectOverrides(overrideMap)
  }, [projectId, router])

  const handleToggleWidget = (widgetId: string) => {
    setWidgets((prev) => prev.map((w) => (w.id === widgetId ? { ...w, enabled: !w.enabled } : w)))
  }

  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const newWidgets = [...widgets]
    ;[newWidgets[index - 1], newWidgets[index]] = [newWidgets[index], newWidgets[index - 1]]
    newWidgets.forEach((w, i) => (w.order = i + 1))
    setWidgets(newWidgets)
  }

  const handleMoveDown = (index: number) => {
    if (index === widgets.length - 1) return
    const newWidgets = [...widgets]
    ;[newWidgets[index], newWidgets[index + 1]] = [newWidgets[index + 1], newWidgets[index]]
    newWidgets.forEach((w, i) => (w.order = i + 1))
    setWidgets(newWidgets)
  }

  const handleUpdateWidget = (updates: Partial<Widget>) => {
    if (!selectedWidget) return
    setWidgets((prev) => prev.map((w) => (w.id === selectedWidget.id ? { ...w, ...updates } : w)))
    setSelectedWidget({ ...selectedWidget, ...updates })
  }

  const handleToggleOverride = () => {
    if (!selectedWidget) return
    const newOverrideMode = !overrideMode
    setOverrideMode(newOverrideMode)

    if (newOverrideMode) {
      // Enable override tracking
      const newMap = new Map(projectOverrides)
      newMap.set(selectedWidget.id, true)
      setProjectOverrides(newMap)
      toast({
        title: "프로젝트별 설정 활성화",
        description: "이 위젯의 설정을 프로젝트별로 수정할 수 있습니다",
      })
    } else {
      // Remove override
      const newMap = new Map(projectOverrides)
      newMap.delete(selectedWidget.id)
      setProjectOverrides(newMap)
      deleteProjectOverride(projectId, selectedWidget.id)
      toast({
        title: "프로젝트별 설정 비활성화",
        description: "기본 위젯 설정을 사용합니다",
      })
    }
  }

  const handleApplyDefaultTemplate = () => {
    if (!project) return
    if (confirm("기본 템플릿을 적용하시겠습니까? 현재 설정이 초기화됩니다.")) {
      const themeWidgets = catalogWidgets.filter((w) => w.category === project.theme || w.category === "common")
      const defaultWidgets: Widget[] = themeWidgets
        .filter((w) => w.status === "active")
        .map((w, index) => ({
          id: w.id,
          title: w.nameKr,
          description: w.descriptionKr,
          enabled: index < 5,
          permission: w.defaultVisibility === "customer" ? "customer_view" : "admin_only",
          order: index + 1,
          component: w.id,
        }))

      setWidgets(defaultWidgets)
      setSelectedWidget(defaultWidgets[0] || null)
      toast({
        title: "기본 템플릿 적용됨",
        description: `${categoryLabels[project.theme]} 테마의 기본 위젯 구성을 불러왔습니다`,
      })
    }
  }

  const handleSave = () => {
    if (!project) return
    setIsSaving(true)

    // Save widget config (legacy format for builder)
    const config: WidgetConfig = {
      projectId: project.projectId,
      theme: project.theme,
      widgets,
      updatedAt: new Date().toISOString(),
    }
    saveWidgetConfig(config)

    // Update project's assignedWidgetIds - Single Source of Truth
    const enabledWidgetIds = widgets
      .filter((w) => w.enabled)
      .sort((a, b) => a.order - b.order)
      .map((w) => w.id)
    setProjectWidgets(project.projectId, enabledWidgetIds)

    // Handle project-specific overrides
    projectOverrides.forEach((hasOverride, widgetId) => {
      if (hasOverride) {
        const widget = widgets.find((w) => w.id === widgetId)
        const catalogWidget = catalogWidgets.find((w) => w.id === widgetId)
        if (widget && catalogWidget) {
          // Check if widget differs from catalog defaults
          const hasChanges =
            widget.title !== catalogWidget.nameKr ||
            widget.description !== catalogWidget.descriptionKr ||
            widget.permission !== (catalogWidget.defaultVisibility === "customer" ? "customer_view" : "admin_only")

          if (hasChanges) {
            saveProjectOverride({
              projectId,
              widgetId,
              overrides: {
                nameKr: widget.title,
                descriptionKr: widget.description,
                defaultVisibility: widget.permission === "customer_view" ? "customer" : "admin",
              },
              updatedAt: new Date().toISOString(),
            })
          }
        }
      }
    })

    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "저장 완료",
        description: "위젯 구성이 저장되었습니다. 고객 대시보드에 즉시 반영됩니다.",
      })
    }, 500)
  }

  const handlePreview = () => {
    window.open(`/app/projects/${projectId}?preview=true`, "_blank")
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5F7FB]">
        <div className="text-[#6B7280]">Loading...</div>
      </div>
    )
  }

  const enabledWidgets = widgets.filter((w) => w.enabled)

  const availableCatalogWidgets = catalogWidgets.filter(
    (w) =>
      (w.category === project.theme || w.category === "common") &&
      w.status === "active" &&
      (w.nameKr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.id.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  // Categorize available widgets
  const commonWidgets = availableCatalogWidgets.filter((w) => w.category === "common")
  const themeWidgets = availableCatalogWidgets.filter((w) => w.category !== "common")

  return (
    <div className="max-w-[1800px] mx-auto px-8 py-8">
      <div className="mb-6">
        <Link href="/admin/projects">
          <Button variant="ghost" size="sm" className="gap-2 mb-4 text-[#6B7280] hover:text-[#111827]">
            <ArrowLeft className="w-4 h-4" />
            프로젝트 목록으로
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#111827] mb-2">위젯 빌더</h1>
            <p className="text-sm text-[#6B7280]">{project.name} · 고객사가 볼 대시보드 위젯을 구성하세요</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleApplyDefaultTemplate}
              variant="outline"
              className="gap-2 bg-transparent border-[#118DFF] text-[#118DFF] hover:bg-[#118DFF]/5"
            >
              <Sparkles className="w-4 h-4" />
              기본 템플릿 적용
            </Button>
            <Button onClick={handlePreview} variant="outline" className="gap-2 bg-transparent">
              <Eye className="w-4 h-4" />
              고객 화면 보기
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="bg-[#118DFF] hover:bg-[#0D6FCC] gap-2">
              <Save className="w-4 h-4" />
              {isSaving ? "저장 중..." : "저장"}
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">위젯 카탈로그 연동 (Single Source of Truth)</p>
          <p>
            위젯은 <strong>위젯 설정</strong>에서 중앙 관리됩니다. 여기서는 어떤 위젯을 이 프로젝트에 제공할지 선택합니다. 
            위젯 내용이 업데이트되면 해당 위젯을 사용하는 모든 프로젝트에 자동 반영됩니다.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left: Widget Library with search and categories */}
        <div className="col-span-3">
          <Card className="p-6 bg-white border-[#E5E7EB] sticky top-6">
            <div className="flex items-center gap-2 mb-4">
              <Grid3x3 className="w-5 h-5 text-[#118DFF]" />
              <h2 className="text-lg font-semibold text-[#111827]">위젯 라이브러리</h2>
            </div>

            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                <Input
                  placeholder="위젯 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-[#F5F7FB] border-[#E5E7EB]"
                />
              </div>
            </div>

            <div className="space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto">
              {themeWidgets.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-[#9CA3AF] mb-2 uppercase">
                    테마 위젯 ({categoryLabels[project.theme]})
                  </div>
                  <div className="space-y-2">
                    {themeWidgets.map((catalogWidget) => {
                      const widget = widgets.find((w) => w.id === catalogWidget.id)
                      const isSelected = selectedWidget?.id === catalogWidget.id
                      const hasOverride = projectOverrides.has(catalogWidget.id)

                      return (
                        <div
                          key={catalogWidget.id}
                          className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                            isSelected
                              ? "border-[#118DFF] bg-[#118DFF]/5"
                              : "border-[#E5E7EB] hover:border-[#118DFF]/50"
                          }`}
                          onClick={() => {
                            if (widget) setSelectedWidget(widget)
                          }}
                        >
                          <Checkbox
                            checked={widget?.enabled || false}
                            onCheckedChange={() => {
                              if (widget) {
                                handleToggleWidget(widget.id)
                              } else {
                                // Add widget to project
                                const newWidget: Widget = {
                                  id: catalogWidget.id,
                                  title: catalogWidget.nameKr,
                                  description: catalogWidget.descriptionKr,
                                  enabled: true,
                                  permission:
                                    catalogWidget.defaultVisibility === "customer" ? "customer_view" : "admin_only",
                                  order: widgets.length + 1,
                                  component: catalogWidget.id,
                                }
                                setWidgets([...widgets, newWidget])
                                setSelectedWidget(newWidget)
                              }
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="font-medium text-sm text-[#111827]">{catalogWidget.nameKr}</div>
                              {hasOverride && (
                                <span className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">
                                  Override
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-[#6B7280] leading-relaxed line-clamp-2">
                              {catalogWidget.descriptionKr}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {commonWidgets.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-[#9CA3AF] mb-2 uppercase">공통 위젯</div>
                  <div className="space-y-2">
                    {commonWidgets.map((catalogWidget) => {
                      const widget = widgets.find((w) => w.id === catalogWidget.id)
                      const isSelected = selectedWidget?.id === catalogWidget.id
                      const hasOverride = projectOverrides.has(catalogWidget.id)

                      return (
                        <div
                          key={catalogWidget.id}
                          className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                            isSelected
                              ? "border-[#118DFF] bg-[#118DFF]/5"
                              : "border-[#E5E7EB] hover:border-[#118DFF]/50"
                          }`}
                          onClick={() => {
                            if (widget) setSelectedWidget(widget)
                          }}
                        >
                          <Checkbox
                            checked={widget?.enabled || false}
                            onCheckedChange={() => {
                              if (widget) {
                                handleToggleWidget(widget.id)
                              } else {
                                const newWidget: Widget = {
                                  id: catalogWidget.id,
                                  title: catalogWidget.nameKr,
                                  description: catalogWidget.descriptionKr,
                                  enabled: true,
                                  permission:
                                    catalogWidget.defaultVisibility === "customer" ? "customer_view" : "admin_only",
                                  order: widgets.length + 1,
                                  component: catalogWidget.id,
                                }
                                setWidgets([...widgets, newWidget])
                                setSelectedWidget(newWidget)
                              }
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="font-medium text-sm text-[#111827]">{catalogWidget.nameKr}</div>
                              {hasOverride && (
                                <span className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">
                                  Override
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-[#6B7280] leading-relaxed line-clamp-2">
                              {catalogWidget.descriptionKr}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {availableCatalogWidgets.length === 0 && (
                <div className="text-center py-8 text-[#9CA3AF] text-sm">검색 결과가 없습니다</div>
              )}
            </div>
          </Card>
        </div>

        {/* Center: Preview */}
        <div className="col-span-6">
          <Card className="p-6 bg-white border-[#E5E7EB]">
            <div className="flex items-center gap-2 mb-4">
              <Layout className="w-5 h-5 text-[#118DFF]" />
              <h2 className="text-lg font-semibold text-[#111827]">고객 화면 미리보기</h2>
            </div>
            <p className="text-sm text-[#6B7280] mb-6">
              고객사가 보게 될 대시보드 ({enabledWidgets.length}개 위젯 활성화됨)
            </p>

            {enabledWidgets.length === 0 ? (
              <div className="text-center py-16 text-[#6B7280] bg-[#F5F7FB] rounded-lg">
                <Grid3x3 className="w-12 h-12 mx-auto mb-3 text-[#9CA3AF]" />
                <p>활성화된 위젯이 없습니다</p>
                <p className="text-sm mt-1">왼쪽에서 위젯을 선택하여 활성화하세요</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto pr-2">
                {enabledWidgets
                  .sort((a, b) => a.order - b.order)
                  .map((widget, index) => (
                    <Card
                      key={widget.id}
                      className={`p-5 border-2 transition-all cursor-pointer ${
                        selectedWidget?.id === widget.id
                          ? "border-[#118DFF] shadow-lg bg-[#118DFF]/5"
                          : "border-[#E5E7EB] hover:border-[#118DFF]/30"
                      }`}
                      onClick={() => setSelectedWidget(widget)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#118DFF] text-white text-xs font-bold">
                              {index + 1}
                            </span>
                            <h3 className="font-semibold text-[#111827]">{widget.title}</h3>
                            {widget.permission === "admin_only" && (
                              <div className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                                <Lock className="w-3 h-3" />
                                관리자 전용
                              </div>
                            )}
                            {projectOverrides.has(widget.id) && (
                              <div className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                                Override
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-[#6B7280]">{widget.description}</p>
                        </div>
                        <div className="flex flex-col gap-1 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleMoveUp(widgets.findIndex((w) => w.id === widget.id))
                            }}
                            disabled={index === 0}
                            className="h-8 w-8 p-0"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleMoveDown(widgets.findIndex((w) => w.id === widget.id))
                            }}
                            disabled={index === enabledWidgets.length - 1}
                            className="h-8 w-8 p-0"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right: Widget Settings */}
        <div className="col-span-3">
          <Card className="p-6 bg-white border-[#E5E7EB] sticky top-6">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-[#118DFF]" />
              <h2 className="text-lg font-semibold text-[#111827]">위젯 설정</h2>
            </div>

            {selectedWidget ? (
              <div className="space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto pr-2">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="override-mode" className="text-sm font-medium cursor-pointer">
                      프로젝트별 설정 (Override)
                    </Label>
                    <Checkbox
                      id="override-mode"
                      checked={projectOverrides.has(selectedWidget.id)}
                      onCheckedChange={handleToggleOverride}
                    />
                  </div>
                  <p className="text-xs text-orange-700">
                    {projectOverrides.has(selectedWidget.id)
                      ? "이 프로젝트만의 커스텀 설정이 활성화되었습니다"
                      : "기본 위젯 설정을 사용합니다"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                    제목
                  </Label>
                  <Input
                    id="title"
                    value={selectedWidget.title}
                    onChange={(e) => handleUpdateWidget({ title: e.target.value })}
                    className="text-sm bg-[#F5F7FB] border-[#E5E7EB]"
                    disabled={!projectOverrides.has(selectedWidget.id)}
                  />
                  {!projectOverrides.has(selectedWidget.id) && (
                    <p className="text-xs text-[#9CA3AF]">프로젝트별 설정을 활성화하여 수정하세요</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    설명
                  </Label>
                  <Textarea
                    id="description"
                    value={selectedWidget.description}
                    onChange={(e) => handleUpdateWidget({ description: e.target.value })}
                    className="text-sm min-h-[80px] bg-[#F5F7FB] border-[#E5E7EB]"
                    disabled={!projectOverrides.has(selectedWidget.id)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="permission" className="text-sm font-medium">
                    접근 권한
                  </Label>
                  <Select
                    value={selectedWidget.permission}
                    onValueChange={(value: "customer_view" | "admin_only") => handleUpdateWidget({ permission: value })}
                    disabled={!projectOverrides.has(selectedWidget.id)}
                  >
                    <SelectTrigger className="text-sm bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="customer_view">
                        <div className="flex items-center gap-2">
                          <Unlock className="w-4 h-4 text-green-600" />
                          <span>고객 공개</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="admin_only">
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4 text-orange-500" />
                          <span>관리자 전용</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-[#6B7280]">
                    {selectedWidget.permission === "customer_view"
                      ? "이 위젯은 고객사 대시보드에 표시됩니다"
                      : "이 위젯은 관리자만 볼 수 있습니다"}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E5E7EB]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[#111827]">활성화 상태</span>
                    <Checkbox
                      checked={selectedWidget.enabled}
                      onCheckedChange={(checked) => handleUpdateWidget({ enabled: checked as boolean })}
                    />
                  </div>
                  <p className="text-xs text-[#6B7280]">
                    {selectedWidget.enabled ? "이 위젯이 대시보드에 표시됩니다" : "이 위젯이 숨겨집니다"}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E5E7EB]">
                  <div className="text-xs text-[#9CA3AF] space-y-1">
                    <div>
                      <span className="font-medium">Component:</span>{" "}
                      <code className="text-[#6B7280]">{selectedWidget.component}</code>
                    </div>
                    <div>
                      <span className="font-medium">Order:</span>{" "}
                      <code className="text-[#6B7280]">{selectedWidget.order}</code>
                    </div>
                    <div>
                      <span className="font-medium">ID:</span>{" "}
                      <code className="text-[#6B7280]">{selectedWidget.id}</code>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-[#9CA3AF] text-sm">
                <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>위젯을 선택하여</p>
                <p>설정을 변경하세요</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
