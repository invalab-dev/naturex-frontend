"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  X,
  Map,
  Download,
  BarChart3,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  FileText,
  Layers,
  Table,
  LineChart,
  LayoutDashboard,
  AlertCircle,
  Globe,
  Box,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  HelpCircle,
  ExternalLink,
} from "lucide-react"
import {
  getProjectDeliverables,
  addMapLayer,
  updateMapLayer,
  deleteMapLayer,
  addDeliverableFile,
  updateDeliverableFile,
  deleteDeliverableFile,
  addChartDataset,
  updateChartDataset,
  deleteChartDataset,
  type Project,
  type MapLayer,
  type DeliverableFile,
  type ChartDataset,
  DELIVERY_STAGES,
  themeLabels,
} from "@/lib/data-service"
import { useToast } from "@/hooks/use-toast"

interface ResultDeliveryModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
  isAdmin?: boolean
}

// Template data for different chart types
const CHART_TEMPLATES = {
  table: {
    name: "표 템플릿",
    columns: ["metric_name (필수)", "value (필수)", "unit (선택)", "description (선택)", "category (선택)"],
    example: [
      { metric_name: "수목 생장량", value: 125.3, unit: "cm/year", description: "연간 평균 생장량", category: "생장" },
      { metric_name: "엽면적 지수", value: 4.2, unit: "m²/m²", description: "LAI 측정값", category: "구조" },
    ],
    csv: "metric_name,value,unit,description,category\n수목 생장량,125.3,cm/year,연간 평균 생장량,생장\n엽면적 지수,4.2,m²/m²,LAI 측정값,구조",
  },
  line_chart: {
    name: "선 그래프 템플릿 (시계열)",
    columns: ["date (YYYY-MM-DD) (필수)", "metric_name (필수)", "value (필수)", "unit (선택)"],
    example: [
      { date: "2024-01-15", metric_name: "NDVI", value: 0.65, unit: "" },
      { date: "2024-02-15", metric_name: "NDVI", value: 0.72, unit: "" },
      { date: "2024-03-15", metric_name: "NDVI", value: 0.81, unit: "" },
    ],
    csv: "date,metric_name,value,unit\n2024-01-15,NDVI,0.65,\n2024-02-15,NDVI,0.72,\n2024-03-15,NDVI,0.81,",
  },
  bar_chart: {
    name: "막대 그래프 템플릿",
    columns: ["category (필수)", "metric_name (필수)", "value (필수)", "unit (선택)"],
    example: [
      { category: "A구역", metric_name: "수목 밀도", value: 45, unit: "본/ha" },
      { category: "B구역", metric_name: "수목 밀도", value: 62, unit: "본/ha" },
      { category: "C구역", metric_name: "수목 밀도", value: 38, unit: "본/ha" },
    ],
    csv: "category,metric_name,value,unit\nA구역,수목 밀도,45,본/ha\nB구역,수목 밀도,62,본/ha\nC구역,수목 밀도,38,본/ha",
  },
  kpi: {
    name: "KPI 카드 템플릿",
    columns: ["kpi_name (필수)", "value (필수)", "unit (선택)", "trend (선택: up/down/flat)"],
    example: [
      { kpi_name: "총 탄소 저장량", value: 1250, unit: "tCO₂", trend: "up" },
      { kpi_name: "연간 산소 생산량", value: 825, unit: "t/년", trend: "up" },
    ],
    csv: "kpi_name,value,unit,trend\n총 탄소 저장량,1250,tCO₂,up\n연간 산소 생산량,825,t/년,up",
  },
}

const MAP_TYPES = [
  { value: "geojson", label: "GeoJSON 레이어", icon: Globe, color: "green", desc: "고객 지도에서 레이어로 바로 표시됩니다." },
  { value: "laz", label: "LAZ/LAS 원본 (내부용)", icon: Box, color: "purple", desc: "원본 저장(내부 처리용). 3D 변환 후 Tileset 업로드를 권장합니다." },
  { value: "tiles3d", label: "3D Tileset (뷰어용)", icon: Box, color: "blue", desc: "고객이 3D로 탐색할 수 있는 결과 레이어입니다." },
]

const DOWNLOAD_TYPES = [
  { value: "hwp", label: "한글 (HWP)", icon: FileText, color: "blue", accept: ".hwp,.hwpx" },
  { value: "xlsx", label: "엑셀 (XLSX)", icon: FileSpreadsheet, color: "green", accept: ".xlsx,.xls" },
  { value: "pdf", label: "PDF", icon: FileText, color: "red", accept: ".pdf" },
]

const CHART_TYPES = [
  { value: "table", label: "표 (Table)", icon: Table },
  { value: "bar_chart", label: "막대그래프 (Bar)", icon: BarChart3 },
  { value: "line_chart", label: "선그래프 (Line)", icon: LineChart },
  { value: "kpi", label: "KPI 카드", icon: LayoutDashboard },
]

export function ResultDeliveryModal({ project, isOpen, onClose, isAdmin = true }: ResultDeliveryModalProps) {
  const { toast } = useToast()
  const [maps, setMaps] = useState<MapLayer[]>([])
  const [downloads, setDownloads] = useState<DeliverableFile[]>([])
  const [visuals, setVisuals] = useState<ChartDataset[]>([])
  const [activeTab, setActiveTab] = useState("maps")
  
  // Type selectors
  const [selectedMapType, setSelectedMapType] = useState<string>("geojson")
  const [selectedDownloadType, setSelectedDownloadType] = useState<string>("hwp")
  const [selectedChartType, setSelectedChartType] = useState<string>("table")
  const [showGuide, setShowGuide] = useState(false)
  const [previewData, setPreviewData] = useState<ChartDataset["data"] | null>(null)
  const [newChartTitle, setNewChartTitle] = useState("")
  const [newChartDescription, setNewChartDescription] = useState("")
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mapFileInputRef = useRef<HTMLInputElement>(null)
  const chartFileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (project && isOpen) {
      refreshResults()
    }
  }, [project, isOpen])

  const refreshResults = () => {
    if (project) {
      const deliverables = getProjectDeliverables(project.projectId)
      setMaps(deliverables.maps)
      setDownloads(deliverables.downloads)
      setVisuals(deliverables.visuals)
    }
  }

  // Download template
  const downloadTemplate = (type: string) => {
    const template = CHART_TEMPLATES[type as keyof typeof CHART_TEMPLATES]
    if (!template) return
    
    const blob = new Blob([template.csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `naturex_${type}_template.csv`
    link.click()
    URL.revokeObjectURL(url)
    
    toast({ title: "템플릿 다운로드", description: `${template.name}이 다운로드되었습니다.` })
  }

  // Load example data for preview
  const loadExampleData = () => {
    const template = CHART_TEMPLATES[selectedChartType as keyof typeof CHART_TEMPLATES]
    if (!template) return
    setPreviewData(template.example as ChartDataset["data"])
    toast({ title: "예시 데이터 로드", description: "미리보기에 예시 데이터가 표시됩니다." })
  }

  // Map Layer Handlers
  const handleMapUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !project) return

    const ext = file.name.split(".").pop()?.toLowerCase()
    
    if (selectedMapType === "geojson" && (ext === "geojson" || ext === "json")) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const geojsonData = JSON.parse(event.target?.result as string)
          const newLayer = addMapLayer(project.projectId, {
            name: file.name.replace(/\.[^/.]+$/, ""),
            dataType: "geojson",
            fileName: file.name,
            fileSize: file.size,
            isPublic: true,
            geojsonData,
          })
          setMaps([...maps, newLayer])
          toast({ title: "GeoJSON 레이어 업로드 완료", description: "고객 지도에서 바로 확인할 수 있습니다." })
        } catch {
          toast({ title: "파일 파싱 오류", description: "올바른 GeoJSON 파일인지 확인하세요", variant: "destructive" })
        }
      }
      reader.readAsText(file)
    } else {
      const newLayer = addMapLayer(project.projectId, {
        name: file.name.replace(/\.[^/.]+$/, ""),
        dataType: selectedMapType as MapLayer["dataType"],
        fileName: file.name,
        fileSize: file.size,
        isPublic: selectedMapType === "tiles3d",
      })
      setMaps([...maps, newLayer])
      toast({ 
        title: "파일 업로드 완료", 
        description: selectedMapType === "laz" ? "내부 처리용으로 저장되었습니다." : "3D 레이어로 등록되었습니다." 
      })
    }

    if (mapFileInputRef.current) mapFileInputRef.current.value = ""
  }

  const handleToggleLayerVisibility = (layerId: string, isPublic: boolean) => {
    if (!project) return
    updateMapLayer(project.projectId, layerId, { isPublic })
    setMaps(maps.map((m) => (m.id === layerId ? { ...m, isPublic } : m)))
  }

  const handleDeleteLayer = (layerId: string) => {
    if (!project || !confirm("이 레이어를 삭제하시겠습니까?")) return
    deleteMapLayer(project.projectId, layerId)
    setMaps(maps.filter((m) => m.id !== layerId))
    toast({ title: "레이어 삭제됨" })
  }

  // File Download Handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !project) return

    const newFile = addDeliverableFile(project.projectId, {
      name: file.name.replace(/\.[^/.]+$/, ""),
      fileType: selectedDownloadType as DeliverableFile["fileType"],
      fileName: file.name,
      fileSize: file.size,
      isPublic: true,
    })
    setDownloads([...downloads, newFile])
    toast({ title: "결과 파일 업로드 완료", description: file.name })

    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleToggleFileVisibility = (fileId: string, isPublic: boolean) => {
    if (!project) return
    updateDeliverableFile(project.projectId, fileId, { isPublic })
    setDownloads(downloads.map((d) => (d.id === fileId ? { ...d, isPublic } : d)))
  }

  const handleDeleteFile = (fileId: string) => {
    if (!project || !confirm("이 파일을 삭제하시겠습니까?")) return
    deleteDeliverableFile(project.projectId, fileId)
    setDownloads(downloads.filter((d) => d.id !== fileId))
    toast({ title: "파일 삭제됨" })
  }

  // Chart Dataset Handlers
  const handleChartUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !project) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string
        let data: ChartDataset["data"] = []

        if (file.name.endsWith(".json")) {
          data = JSON.parse(content)
        } else if (file.name.endsWith(".csv")) {
          const lines = content.split("\n")
          const headers = lines[0].split(",").map((h) => h.trim())
          data = lines
            .slice(1)
            .filter((l) => l.trim())
            .map((line) => {
              const values = line.split(",")
              const row: Record<string, string | number> = {}
              headers.forEach((header, i) => {
                const val = values[i]?.trim() || ""
                row[header] = header === "value" ? parseFloat(val) || 0 : val
              })
              return row as ChartDataset["data"][0]
            })
        }

        setPreviewData(data)
        toast({ title: "데이터 파싱 완료", description: `${data.length}개 행이 로드되었습니다. 저장하려면 '시각화 저장' 버튼을 클릭하세요.` })
      } catch {
        toast({ title: "파일 파싱 오류", description: "올바른 CSV/JSON 파일인지 확인하세요", variant: "destructive" })
      }
    }
    reader.readAsText(file)

    if (chartFileInputRef.current) chartFileInputRef.current.value = ""
  }

  const handleSaveChart = () => {
    if (!project || !previewData || previewData.length === 0) {
      toast({ title: "데이터 없음", description: "먼저 데이터를 업로드하거나 예시를 로드하세요.", variant: "destructive" })
      return
    }

    const newChart = addChartDataset(project.projectId, {
      title: newChartTitle || `시각화_${Date.now()}`,
      description: newChartDescription,
      visualizationType: selectedChartType as ChartDataset["visualizationType"],
      data: previewData,
      isPublic: true,
    })
    setVisuals([...visuals, newChart])
    setPreviewData(null)
    setNewChartTitle("")
    setNewChartDescription("")
    toast({ title: "시각화 저장 완료", description: "고객 대시보드에 표시됩니다." })
  }

  const handleUpdateChartType = (chartId: string, visualizationType: ChartDataset["visualizationType"]) => {
    if (!project) return
    updateChartDataset(project.projectId, chartId, { visualizationType })
    setVisuals(visuals.map((v) => (v.id === chartId ? { ...v, visualizationType } : v)))
  }

  const handleToggleChartVisibility = (chartId: string, isPublic: boolean) => {
    if (!project) return
    updateChartDataset(project.projectId, chartId, { isPublic })
    setVisuals(visuals.map((v) => (v.id === chartId ? { ...v, isPublic } : v)))
  }

  const handleDeleteChart = (chartId: string) => {
    if (!project || !confirm("이 시각화를 삭제하시겠습니까?")) return
    deleteChartDataset(project.projectId, chartId)
    setVisuals(visuals.filter((v) => v.id !== chartId))
    toast({ title: "시각화 삭제됨" })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "—"
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getFileTypeIcon = (type: string) => {
    switch (type) {
      case "hwp": return <FileText className="w-5 h-5 text-blue-600" />
      case "xlsx": return <FileSpreadsheet className="w-5 h-5 text-green-600" />
      case "pdf": return <FileText className="w-5 h-5 text-red-600" />
      default: return <FileText className="w-5 h-5 text-gray-600" />
    }
  }

  const getMapTypeIcon = (type: string) => {
    switch (type) {
      case "geojson": return <Globe className="w-5 h-5 text-green-600" />
      case "laz": return <Box className="w-5 h-5 text-purple-600" />
      case "tiles3d": return <Box className="w-5 h-5 text-blue-600" />
      default: return <Map className="w-5 h-5 text-gray-600" />
    }
  }

  const getVisualTypeIcon = (type: string) => {
    switch (type) {
      case "table": return <Table className="w-4 h-4" />
      case "bar_chart": return <BarChart3 className="w-4 h-4" />
      case "line_chart": return <LineChart className="w-4 h-4" />
      case "kpi": return <LayoutDashboard className="w-4 h-4" />
      default: return <BarChart3 className="w-4 h-4" />
    }
  }

  const handleViewCustomerDashboard = () => {
    if (!project) return
    toast({
      title: "고객 화면으로 이동합니다",
      description: `${project.name} 대시보드를 새 탭에서 엽니다`,
    })
    window.open(`/app/projects/${project.projectId}`, "_blank")
  }

  if (!project) return null

  const stageInfo = DELIVERY_STAGES[project.deliveryStage]
  const selectedMapTypeInfo = MAP_TYPES.find(t => t.value === selectedMapType)
  const selectedDownloadTypeInfo = DOWNLOAD_TYPES.find(t => t.value === selectedDownloadType)
  const selectedChartTemplate = CHART_TEMPLATES[selectedChartType as keyof typeof CHART_TEMPLATES]

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className="p-0 bg-white overflow-hidden border-0 shadow-2xl rounded-2xl"
        style={{ 
          width: "min(92vw, 1280px)", 
          maxWidth: "1280px",
          height: "min(92vh, 900px)",
          maxHeight: "900px",
        }}
      >
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-[#E5E7EB] bg-white flex-shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <DialogTitle className="text-xl font-bold text-[#1F2937]">{project.name}</DialogTitle>
                <Badge style={{ backgroundColor: `${stageInfo.color}20`, color: stageInfo.color }}>
                  {stageInfo.kr}
                </Badge>
                <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-slate-100 text-slate-700">
                  {themeLabels[project.theme]}
                </span>
              </div>
              <p className="text-sm text-[#6B7280]">{project.location}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleViewCustomerDashboard}
                className="gap-2 bg-transparent"
              >
                <ExternalLink className="w-4 h-4" />
                고객화면 보기
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-[#6B7280] hover:text-[#1F2937]">
                
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Admin Banner */}
        {isAdmin && (
          <div className="mx-6 mt-4 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-start gap-3 flex-shrink-0">
            <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-sm text-amber-800 font-medium block">
                관리자 전용 결과 관리 화면
              </span>
              <span className="text-xs text-amber-700">
                체크박스를 선택한 항목만 고객 페이지에 표시됩니다. 체크 해제 시 고객은 볼 수 없습니다.
              </span>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="mx-6 mt-4 bg-[#F5F7FB] p-1 rounded-lg w-fit flex-shrink-0">
              <TabsTrigger value="maps" className="gap-2 px-4 data-[state=active]:bg-white">
                <Map className="w-4 h-4" />
                지도 ({maps.length})
              </TabsTrigger>
              <TabsTrigger value="downloads" className="gap-2 px-4 data-[state=active]:bg-white">
                <Download className="w-4 h-4" />
                다운로드 ({downloads.length})
              </TabsTrigger>
              <TabsTrigger value="charts" className="gap-2 px-4 data-[state=active]:bg-white">
                <BarChart3 className="w-4 h-4" />
                표·도표 ({visuals.length})
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto p-6">
              {/* Maps Tab */}
              <TabsContent value="maps" className="mt-0 space-y-4 h-full">
                {isAdmin && (
                  <Card className="p-4 bg-white border-[#E5E7EB]">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-[#374151]">지도 유형 선택</Label>
                        <div className="grid grid-cols-3 gap-3 mt-2">
                          {MAP_TYPES.map((type) => (
                            <button
                              key={type.value}
                              onClick={() => setSelectedMapType(type.value)}
                              className={`p-3 rounded-lg border-2 text-left transition-all ${
                                selectedMapType === type.value
                                  ? "border-[#118DFF] bg-blue-50"
                                  : "border-[#E5E7EB] hover:border-[#D1D5DB]"
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <type.icon className={`w-4 h-4 text-${type.color}-600`} />
                                <span className="font-medium text-sm text-[#1F2937]">{type.label}</span>
                              </div>
                              <p className="text-xs text-[#6B7280]">{type.desc}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          ref={mapFileInputRef}
                          type="file"
                          accept={selectedMapType === "geojson" ? ".geojson,.json" : ".las,.laz"}
                          onChange={handleMapUpload}
                          className="hidden"
                        />
                        <Button
                          onClick={() => mapFileInputRef.current?.click()}
                          className="gap-2 bg-[#118DFF] hover:bg-[#0D6FCC] text-white"
                        >
                          <Upload className="w-4 h-4" />
                          {selectedMapTypeInfo?.label} 업로드
                        </Button>
                        <span className="text-xs text-[#6B7280]">
                          {selectedMapType === "geojson" && "지원 형식: .geojson, .json"}
                          {selectedMapType === "laz" && "지원 형식: .las, .laz"}
                          {selectedMapType === "tiles3d" && "지원 형식: tileset.json 포함 폴더"}
                        </span>
                      </div>
                    </div>
                  </Card>
                )}

                <div className="space-y-3">
                  {maps.length === 0 && (
                    <div className="text-center py-12 text-[#6B7280] bg-[#F9FAFB] rounded-lg border border-dashed border-[#E5E7EB]">
                      <Layers className="w-10 h-10 mx-auto mb-3 text-[#9CA3AF]" />
                      <p>업로드된 지도 데이터가 없습니다</p>
                      {isAdmin && <p className="text-sm mt-1">위에서 유형을 선택하고 업로드하세요</p>}
                    </div>
                  )}

                  {maps.map((layer) => (
                    <Card key={layer.id} className="p-4 border-[#E5E7EB] bg-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            layer.dataType === "geojson" ? "bg-green-100" :
                            layer.dataType === "tiles3d" ? "bg-blue-100" : "bg-purple-100"
                          }`}>
                            {getMapTypeIcon(layer.dataType)}
                          </div>
                          <div>
                            <div className="font-medium text-[#1F2937]">{layer.name}</div>
                            <div className="text-xs text-[#6B7280] flex items-center gap-2">
                              <span className="uppercase font-mono bg-gray-100 px-1.5 py-0.5 rounded">{layer.dataType}</span>
                              <span>{formatFileSize(layer.fileSize)}</span>
                              <span>{new Date(layer.uploadedAt).toLocaleDateString("ko-KR")}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {isAdmin ? (
                            <>
                              <label className="flex items-center gap-2 cursor-pointer select-none">
                                <Checkbox 
                                  checked={layer.isPublic} 
                                  onCheckedChange={(checked) => handleToggleLayerVisibility(layer.id, checked === true)} 
                                />
                                <span className={`text-xs ${layer.isPublic ? "text-green-600 font-medium" : "text-[#9CA3AF]"}`}>
                                  {layer.isPublic ? "고객에게 공개" : "비공개 (고객 화면에 안 보임)"}
                                </span>
                              </label>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteLayer(layer.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          ) : layer.isPublic && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                              <Eye className="w-3 h-3 inline mr-1" />보기 가능
                            </span>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Downloads Tab */}
              <TabsContent value="downloads" className="mt-0 space-y-4 h-full">
                {isAdmin && (
                  <Card className="p-4 bg-white border-[#E5E7EB]">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-[#374151]">다운로드 유형 선택</Label>
                        <div className="grid grid-cols-3 gap-3 mt-2">
                          {DOWNLOAD_TYPES.map((type) => (
                            <button
                              key={type.value}
                              onClick={() => setSelectedDownloadType(type.value)}
                              className={`p-3 rounded-lg border-2 text-left transition-all ${
                                selectedDownloadType === type.value
                                  ? "border-[#118DFF] bg-blue-50"
                                  : "border-[#E5E7EB] hover:border-[#D1D5DB]"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <type.icon className={`w-4 h-4 text-${type.color}-600`} />
                                <span className="font-medium text-sm text-[#1F2937]">{type.label}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept={selectedDownloadTypeInfo?.accept}
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <Button
                          onClick={() => fileInputRef.current?.click()}
                          className="gap-2 bg-[#118DFF] hover:bg-[#0D6FCC] text-white"
                        >
                          <Upload className="w-4 h-4" />
                          파일 업로드
                        </Button>
                        <span className="text-xs text-[#6B7280]">지원 형식: {selectedDownloadTypeInfo?.accept}</span>
                      </div>
                    </div>
                  </Card>
                )}

                <div className="space-y-3">
                  {downloads.length === 0 && (
                    <div className="text-center py-12 text-[#6B7280] bg-[#F9FAFB] rounded-lg border border-dashed border-[#E5E7EB]">
                      <FileText className="w-10 h-10 mx-auto mb-3 text-[#9CA3AF]" />
                      <p>업로드된 결과 파일이 없습니다</p>
                      {isAdmin && <p className="text-sm mt-1">위에서 유형을 선택하고 업로드하세요</p>}
                    </div>
                  )}

                  {downloads.map((file) => (
                    <Card key={file.id} className="p-4 border-[#E5E7EB] bg-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                            {getFileTypeIcon(file.fileType)}
                          </div>
                          <div>
                            <div className="font-medium text-[#1F2937]">{file.name}</div>
                            <div className="text-xs text-[#6B7280] flex items-center gap-2">
                              <span className="uppercase font-mono bg-gray-100 px-1.5 py-0.5 rounded">{file.fileType}</span>
                              <span>{formatFileSize(file.fileSize)}</span>
                              <span>{new Date(file.uploadedAt).toLocaleDateString("ko-KR")}</span>
                            </div>
                            {file.description && <p className="text-xs text-[#9CA3AF] mt-1">{file.description}</p>}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {isAdmin ? (
                            <>
                              <label className="flex items-center gap-2 cursor-pointer select-none">
                                <Checkbox 
                                  checked={file.isPublic} 
                                  onCheckedChange={(checked) => handleToggleFileVisibility(file.id, checked === true)} 
                                />
                                <span className={`text-xs ${file.isPublic ? "text-green-600 font-medium" : "text-[#9CA3AF]"}`}>
                                  {file.isPublic ? "고객에게 공개" : "비공개 (고객 화면에 안 보임)"}
                                </span>
                              </label>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteFile(file.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          ) : file.isPublic && (
                            <Button variant="outline" size="sm" className="gap-2">
                              <Download className="w-4 h-4" />다운로드
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Charts Tab */}
              <TabsContent value="charts" className="mt-0 space-y-4 h-full">
                {isAdmin && (
                  <>
                    <Card className="p-4 bg-white border-[#E5E7EB]">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-[#374151]">표/도표 유형 선택</Label>
                          <div className="grid grid-cols-4 gap-3 mt-2">
                            {CHART_TYPES.map((type) => (
                              <button
                                key={type.value}
                                onClick={() => {
                                  setSelectedChartType(type.value)
                                  setPreviewData(null)
                                }}
                                className={`p-3 rounded-lg border-2 text-center transition-all ${
                                  selectedChartType === type.value
                                    ? "border-[#118DFF] bg-blue-50"
                                    : "border-[#E5E7EB] hover:border-[#D1D5DB]"
                                }`}
                              >
                                <type.icon className="w-5 h-5 mx-auto mb-1 text-[#6B7280]" />
                                <span className="font-medium text-sm text-[#1F2937]">{type.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Template Downloads */}
                        <div className="bg-[#F9FAFB] rounded-lg p-4 border border-[#E5E7EB]">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <FileSpreadsheet className="w-4 h-4 text-[#6B7280]" />
                              <span className="font-medium text-sm text-[#374151]">샘플 템플릿 다운로드</span>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setShowGuide(!showGuide)}
                              className="gap-1 bg-white"
                            >
                              <HelpCircle className="w-3 h-3" />
                              작성 가이드
                              {showGuide ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </Button>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadTemplate(selectedChartType)}
                              className="gap-2 bg-white"
                            >
                              <Download className="w-4 h-4" />
                              {selectedChartTemplate?.name} 다운로드
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={loadExampleData}
                              className="gap-2 bg-white"
                            >
                              <Eye className="w-4 h-4" />
                              예시 보기
                            </Button>
                          </div>

                          {showGuide && selectedChartTemplate && (
                            <div className="mt-4 p-3 bg-white rounded border border-[#E5E7EB]">
                              <p className="text-sm font-medium text-[#374151] mb-2">필수 컬럼:</p>
                              <ul className="text-xs text-[#6B7280] space-y-1 mb-3">
                                {selectedChartTemplate.columns.map((col, i) => (
                                  <li key={i} className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#118DFF]" />
                                    {col}
                                  </li>
                                ))}
                              </ul>
                              <p className="text-xs text-[#9CA3AF]">
                                - 값(value)은 숫자만 입력하세요<br />
                                - 날짜(date)는 YYYY-MM-DD 형식을 사용하세요<br />
                                - metric_name은 고객이 이해하는 한글명 사용 가능
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Upload Area */}
                        <div className="flex items-center gap-3">
                          <input
                            ref={chartFileInputRef}
                            type="file"
                            accept=".csv,.json"
                            onChange={handleChartUpload}
                            className="hidden"
                          />
                          <Button
                            onClick={() => chartFileInputRef.current?.click()}
                            className="gap-2 bg-[#118DFF] hover:bg-[#0D6FCC] text-white"
                          >
                            <Upload className="w-4 h-4" />
                            데이터 업로드 (CSV/JSON)
                          </Button>
                        </div>
                      </div>
                    </Card>

                    {/* Preview Area */}
                    {previewData && previewData.length > 0 && (
                      <Card className="p-4 bg-white border-[#E5E7EB]">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-[#1F2937]">데이터 미리보기 ({previewData.length}행)</h4>
                            <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                              {CHART_TYPES.find(t => t.value === selectedChartType)?.label}
                            </Badge>
                          </div>

                          {/* Data Table Preview */}
                          <div className="border border-[#E5E7EB] rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                            <table className="w-full text-sm">
                              <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                                <tr>
                                  {Object.keys(previewData[0] || {}).map((key) => (
                                    <th key={key} className="px-3 py-2 text-left text-xs font-medium text-[#6B7280]">
                                      {key}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[#E5E7EB]">
                                {previewData.slice(0, 5).map((row, i) => (
                                  <tr key={i}>
                                    {Object.values(row).map((val, j) => (
                                      <td key={j} className="px-3 py-2 text-[#374151]">
                                        {String(val)}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            {previewData.length > 5 && (
                              <div className="px-3 py-2 text-xs text-[#9CA3AF] bg-[#F9FAFB] border-t border-[#E5E7EB]">
                                ... 외 {previewData.length - 5}행 더 있음
                              </div>
                            )}
                          </div>

                          {/* Title & Description */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm">시각화 제목</Label>
                              <Input
                                value={newChartTitle}
                                onChange={(e) => setNewChartTitle(e.target.value)}
                                placeholder="예: 월별 NDVI 변화"
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-sm">설명 (선택)</Label>
                              <Input
                                value={newChartDescription}
                                onChange={(e) => setNewChartDescription(e.target.value)}
                                placeholder="예: 2024년 1~6월 측정 결과"
                                className="mt-1"
                              />
                            </div>
                          </div>

                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setPreviewData(null)} className="bg-transparent">
                              취소
                            </Button>
                            <Button onClick={handleSaveChart} className="bg-[#118DFF] hover:bg-[#0D6FCC] text-white">
                              시각화 저장
                            </Button>
                          </div>
                        </div>
                      </Card>
                    )}
                  </>
                )}

                {/* Saved Charts List */}
                <div className="space-y-3">
                  {visuals.length === 0 && !previewData && (
                    <div className="text-center py-12 text-[#6B7280] bg-[#F9FAFB] rounded-lg border border-dashed border-[#E5E7EB]">
                      <BarChart3 className="w-10 h-10 mx-auto mb-3 text-[#9CA3AF]" />
                      <p>등록된 시각화가 없습니다</p>
                      {isAdmin && <p className="text-sm mt-1">위에서 유형을 선택하고 데이터를 업로드하세요</p>}
                    </div>
                  )}

                  {visuals.map((visual) => (
                    <Card key={visual.id} className="p-4 border-[#E5E7EB] bg-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            {getVisualTypeIcon(visual.visualizationType)}
                          </div>
                          <div>
                            <div className="font-medium text-[#1F2937]">{visual.title}</div>
                            <div className="text-xs text-[#6B7280] flex items-center gap-2">
                              <span>{visual.data.length}개 데이터</span>
                              <span>{new Date(visual.uploadedAt).toLocaleDateString("ko-KR")}</span>
                            </div>
                            {visual.description && <p className="text-xs text-[#9CA3AF] mt-1">{visual.description}</p>}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {isAdmin && (
                            <Select
                              value={visual.visualizationType}
                              onValueChange={(value: ChartDataset["visualizationType"]) => handleUpdateChartType(visual.id, value)}
                            >
                              <SelectTrigger className="w-32 h-8 bg-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-white">
                                <SelectItem value="table">표</SelectItem>
                                <SelectItem value="bar_chart">막대 차트</SelectItem>
                                <SelectItem value="line_chart">선 차트</SelectItem>
                                <SelectItem value="kpi">KPI 카드</SelectItem>
                              </SelectContent>
                            </Select>
                          )}

                          {isAdmin ? (
                            <>
                              <label className="flex items-center gap-2 cursor-pointer select-none">
                                <Checkbox 
                                  checked={visual.isPublic} 
                                  onCheckedChange={(checked) => handleToggleChartVisibility(visual.id, checked === true)} 
                                />
                                <span className={`text-xs ${visual.isPublic ? "text-green-600 font-medium" : "text-[#9CA3AF]"}`}>
                                  {visual.isPublic ? "고객에게 공개" : "비공개 (고객 화면에 안 보임)"}
                                </span>
                              </label>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteChart(visual.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
