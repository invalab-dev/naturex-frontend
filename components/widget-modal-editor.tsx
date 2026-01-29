'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  X,
  Save,
  Info,
  Database,
  BarChart3,
  Eye,
  Download,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Clipboard,
  Settings,
  TrendingUp,
  Leaf,
  Bug,
  Map,
  PieChart,
  LineChart,
  Gauge,
  Grid3X3,
  FileText,
  FileSpreadsheet,
  Link2,
} from 'lucide-react';
import {
  type WidgetCatalogItem,
  saveWidgetToCatalog,
  deleteWidgetFromCatalog,
} from '@/lib/widget-catalog';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface WidgetModalEditorProps {
  widget: WidgetCatalogItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (widget: WidgetCatalogItem) => void;
  onDelete?: (widgetId: string) => void;
}

// Extended metric type for rich documentation
interface ExtendedMetric {
  key: string;
  labelKr: string;
  labelEn: string;
  unit: string | null;
  format: 'number' | 'percent' | 'score' | 'text';
  descriptionKr?: string;
  meaningKr?: string;
  interpretationKr?: string;
  references?: { title: string; source: string }[];
  threshold?: {
    good?: number;
    warn?: number;
    bad?: number;
  };
}

export function WidgetModalEditor({
  widget,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: WidgetModalEditorProps) {
  const { toast } = useToast();
  const [editedWidget, setEditedWidget] = useState<WidgetCatalogItem | null>(
    null,
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedVizPreview, setSelectedVizPreview] = useState<string | null>(
    null,
  );
  const isNewWidget = widget && !widget.createdAt;

  // Extended state for new fields
  const [serviceThemes, setServiceThemes] = useState<string[]>([]);
  const [usageStages, setUsageStages] = useState<string[]>([]);
  const [customDataDescription, setCustomDataDescription] = useState('');
  const [exportFormats, setExportFormats] = useState<string[]>([]);
  const [extendedMetrics, setExtendedMetrics] = useState<ExtendedMetric[]>([]);

  useEffect(() => {
    if (widget) {
      setEditedWidget({ ...widget });
      setHasUnsavedChanges(false);
      // Initialize extended state
      setServiceThemes((widget as any).serviceThemes || [widget.category]);
      setUsageStages((widget as any).usageStages || []);
      setCustomDataDescription((widget as any).customDataDescription || '');
      setExportFormats((widget as any).exportFormats || ['pdf', 'csv']);
      setExtendedMetrics(
        widget.metrics.map((m) => ({
          ...m,
          descriptionKr: (m as any).descriptionKr || '',
          meaningKr: (m as any).meaningKr || '',
          interpretationKr: (m as any).interpretationKr || '',
          references: (m as any).references || [],
        })),
      );
    }
  }, [widget]);

  if (!isOpen || !editedWidget) return null;

  const handleSave = () => {
    const updatedWidget = {
      ...editedWidget,
      serviceThemes,
      usageStages,
      customDataDescription,
      exportFormats,
      metrics: extendedMetrics,
      updatedAt: new Date().toISOString(),
      createdAt: editedWidget.createdAt || new Date().toISOString(),
    };

    saveWidgetToCatalog(updatedWidget as WidgetCatalogItem);
    toast({
      title: '저장 완료',
      description: `위젯 "${updatedWidget.nameKr}"이(가) 저장되었습니다`,
    });
    setHasUnsavedChanges(false);
    onSave(updatedWidget as WidgetCatalogItem);
    onClose();
  };

  const handleDelete = () => {
    if (!editedWidget.id) return;
    deleteWidgetFromCatalog(editedWidget.id);
    toast({
      title: '삭제 완료',
      description: `위젯 "${editedWidget.nameKr}"이(가) 삭제되었습니다`,
      variant: 'destructive',
    });
    if (onDelete) onDelete(editedWidget.id);
    setShowDeleteDialog(false);
    onClose();
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        '저장하지 않은 변경사항이 있습니다. 닫으시겠습니까?',
      );
      if (!confirmed) return;
    }
    setHasUnsavedChanges(false);
    onClose();
  };

  const handleChange = (updates: Partial<WidgetCatalogItem>) => {
    setEditedWidget({ ...editedWidget, ...updates });
    setHasUnsavedChanges(true);
  };

  const toggleServiceTheme = (theme: string) => {
    setServiceThemes((prev) =>
      prev.includes(theme) ? prev.filter((t) => t !== theme) : [...prev, theme],
    );
    setHasUnsavedChanges(true);
  };

  const toggleUsageStage = (stage: string) => {
    setUsageStages((prev) =>
      prev.includes(stage) ? prev.filter((s) => s !== stage) : [...prev, stage],
    );
    setHasUnsavedChanges(true);
  };

  const toggleExportFormat = (format: string) => {
    setExportFormats((prev) =>
      prev.includes(format)
        ? prev.filter((f) => f !== format)
        : [...prev, format],
    );
    setHasUnsavedChanges(true);
  };

  const updateExtendedMetric = (
    index: number,
    updates: Partial<ExtendedMetric>,
  ) => {
    const newMetrics = [...extendedMetrics];
    newMetrics[index] = { ...newMetrics[index], ...updates };
    setExtendedMetrics(newMetrics);
    setHasUnsavedChanges(true);
  };

  const addReference = (metricIndex: number) => {
    const newMetrics = [...extendedMetrics];
    if (!newMetrics[metricIndex].references) {
      newMetrics[metricIndex].references = [];
    }
    newMetrics[metricIndex].references!.push({ title: '', source: '' });
    setExtendedMetrics(newMetrics);
    setHasUnsavedChanges(true);
  };

  const removeReference = (metricIndex: number, refIndex: number) => {
    const newMetrics = [...extendedMetrics];
    newMetrics[metricIndex].references = newMetrics[
      metricIndex
    ].references!.filter((_, i) => i !== refIndex);
    setExtendedMetrics(newMetrics);
    setHasUnsavedChanges(true);
  };

  const updateReference = (
    metricIndex: number,
    refIndex: number,
    field: 'title' | 'source',
    value: string,
  ) => {
    const newMetrics = [...extendedMetrics];
    newMetrics[metricIndex].references![refIndex][field] = value;
    setExtendedMetrics(newMetrics);
    setHasUnsavedChanges(true);
  };

  // Visualization types with icons
  const visualizationTypes = [
    {
      type: 'heatmap',
      label: '지도 Heatmap',
      icon: Map,
      desc: '밀도 기반 히트맵 시각화',
    },
    {
      type: 'choropleth',
      label: 'Choropleth',
      icon: Grid3X3,
      desc: '영역별 색상 등급 지도',
    },
    {
      type: 'point_polygon',
      label: 'Point / Polygon Map',
      icon: Map,
      desc: '포인트 및 폴리곤 지도',
    },
    {
      type: 'bar_chart',
      label: 'Bar Chart',
      icon: BarChart3,
      desc: '막대형 비교 차트',
    },
    {
      type: 'line_chart',
      label: 'Line Chart',
      icon: LineChart,
      desc: '시계열 추이 차트',
    },
    {
      type: 'gauge',
      label: 'Gauge / Score Card',
      icon: Gauge,
      desc: '게이지 또는 스코어 카드',
    },
  ];

  // Data sources
  const dataSources = [
    { key: 'rgbOrtho', label: 'Drone RGB', desc: 'RGB 정사영상 (드론/항공)' },
    { key: 'lidarLaz', label: 'LiDAR (LAZ)', desc: 'LiDAR 포인트 클라우드' },
    {
      key: 'multispectral',
      label: 'Multispectral',
      desc: '멀티스펙트럴 센서 데이터',
    },
    { key: 'csvOptional', label: 'CSV', desc: '구조화된 테이블 데이터' },
    { key: 'custom', label: '기타 (Custom)', desc: '기타 커스텀 데이터' },
  ];

  // Export formats
  const exportFormatOptions = [
    { key: 'pdf', label: 'PDF', desc: 'PDF 리포트', group: 'reports' },
    {
      key: 'docx',
      label: 'Word (.docx)',
      desc: 'Microsoft Word 문서',
      group: 'reports',
    },
    { key: 'hwp', label: 'HWP (한글)', desc: '한글 문서', group: 'reports' },
    { key: 'csv', label: 'CSV', desc: '데이터 테이블', group: 'data' },
    { key: 'geojson', label: 'GeoJSON', desc: '공간 데이터', group: 'data' },
  ];

  // Preview component for visualization
  const renderVisualizationPreview = (type: string) => {
    switch (type) {
      case 'heatmap':
        return (
          <div className="bg-gradient-to-br from-green-200 via-yellow-200 to-red-300 rounded-lg h-48 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-30">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-red-500"
                  style={{
                    width: Math.random() * 40 + 20,
                    height: Math.random() * 40 + 20,
                    left: `${Math.random() * 80 + 10}%`,
                    top: `${Math.random() * 80 + 10}%`,
                    opacity: Math.random() * 0.5 + 0.3,
                  }}
                />
              ))}
            </div>
            <span className="text-sm text-gray-700 bg-white/80 px-3 py-1 rounded">
              Heatmap Preview
            </span>
          </div>
        );
      case 'choropleth':
        return (
          <div className="bg-white rounded-lg h-48 flex items-center justify-center border border-[#E5E7EB] relative overflow-hidden">
            <div className="grid grid-cols-4 gap-1 p-4 w-full h-full">
              {[...Array(16)].map((_, i) => (
                <div
                  key={i}
                  className="rounded"
                  style={{
                    backgroundColor: [
                      '#22C55E',
                      '#3B82F6',
                      '#EAB308',
                      '#EF4444',
                    ][Math.floor(Math.random() * 4)],
                    opacity: 0.6 + Math.random() * 0.4,
                  }}
                />
              ))}
            </div>
          </div>
        );
      case 'bar_chart':
        return (
          <div className="bg-white rounded-lg h-48 flex items-end justify-around p-4 border border-[#E5E7EB]">
            {[65, 85, 45, 70, 55, 90].map((h, i) => (
              <div
                key={i}
                className="w-8 bg-[#118DFF] rounded-t"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        );
      case 'line_chart':
        return (
          <div className="bg-white rounded-lg h-48 flex items-center justify-center border border-[#E5E7EB] p-4">
            <svg viewBox="0 0 200 100" className="w-full h-full">
              <polyline
                fill="none"
                stroke="#118DFF"
                strokeWidth="2"
                points="0,80 30,60 60,70 90,40 120,50 150,30 180,45 200,20"
              />
              <polyline
                fill="none"
                stroke="#22C55E"
                strokeWidth="2"
                strokeDasharray="4"
                points="0,90 30,75 60,85 90,60 120,70 150,55 180,60 200,50"
              />
            </svg>
          </div>
        );
      case 'gauge':
        return (
          <div className="bg-white rounded-lg h-48 flex flex-col items-center justify-center border border-[#E5E7EB] p-4">
            <div className="text-4xl font-bold text-[#118DFF]">78.5</div>
            <div className="text-sm text-gray-500 mt-1">종합 점수</div>
            <div className="w-32 h-2 bg-gray-200 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-[#118DFF] rounded-full"
                style={{ width: '78.5%' }}
              />
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
            <span className="text-sm text-gray-500">시각화 미리보기</span>
          </div>
        );
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={handleClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-xl shadow-2xl w-full max-w-[1000px] max-h-[90vh] flex flex-col pointer-events-auto overflow-hidden border border-[#E5E7EB]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#E5E7EB] bg-white flex-shrink-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <Input
                  value={editedWidget.nameKr}
                  onChange={(e) => handleChange({ nameKr: e.target.value })}
                  className="text-xl font-bold text-[#111827] border-none p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                  placeholder="위젯 이름"
                />
                <p className="text-sm text-[#6B7280] mt-1">
                  분석 로직 · 시각화 · 서비스 정의
                </p>
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
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="border-[#E5E7EB] bg-transparent"
                >
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
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                  className="h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start border-b border-[#E5E7EB] rounded-none h-auto p-0 bg-transparent">
                <TabsTrigger
                  value="overview"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#118DFF] px-6 py-3"
                >
                  <Info className="w-4 h-4 mr-2" />
                  개요
                </TabsTrigger>
                <TabsTrigger
                  value="inputs"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#118DFF] px-6 py-3"
                >
                  <Database className="w-4 h-4 mr-2" />
                  입력 데이터
                </TabsTrigger>
                <TabsTrigger
                  value="metrics"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#118DFF] px-6 py-3"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  지표·계산
                </TabsTrigger>
                <TabsTrigger
                  value="visuals"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#118DFF] px-6 py-3"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  시각화 및 생성
                </TabsTrigger>
                <TabsTrigger
                  value="exports"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#118DFF] px-6 py-3"
                >
                  <Download className="w-4 h-4 mr-2" />
                  다운로드 포함
                </TabsTrigger>
              </TabsList>

              {/* TAB 1: Overview */}
              <TabsContent value="overview" className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 space-y-4">
                  <h3 className="font-semibold text-[#111827] text-base">
                    기본 정보
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nameKr">위젯 이름 (한글)</Label>
                      <Input
                        id="nameKr"
                        value={editedWidget.nameKr}
                        onChange={(e) =>
                          handleChange({ nameKr: e.target.value })
                        }
                        className="bg-white border-[#E5E7EB]"
                        placeholder="예: 수목 건강도 분석"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nameEn">Widget Name (English)</Label>
                      <Input
                        id="nameEn"
                        value={editedWidget.nameEn}
                        onChange={(e) =>
                          handleChange({ nameEn: e.target.value })
                        }
                        className="bg-white border-[#E5E7EB]"
                        placeholder="e.g. Tree Health Analysis"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="descKr">설명 (한글)</Label>
                    <Textarea
                      id="descKr"
                      value={editedWidget.descriptionKr}
                      onChange={(e) =>
                        handleChange({ descriptionKr: e.target.value })
                      }
                      className="bg-white border-[#E5E7EB] min-h-[80px]"
                      placeholder="위젯이 제공하는 기능과 목적을 설명하세요"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="descEn">Description (English)</Label>
                    <Textarea
                      id="descEn"
                      value={editedWidget.descriptionEn}
                      onChange={(e) =>
                        handleChange({ descriptionEn: e.target.value })
                      }
                      className="bg-white border-[#E5E7EB] min-h-[80px]"
                      placeholder="Describe the widget's purpose and functionality"
                    />
                  </div>
                </div>

                {/* Service Theme Selection */}
                <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 space-y-4">
                  <div>
                    <h3 className="font-semibold text-[#111827] text-base">
                      서비스 테마 적용
                    </h3>
                    <p className="text-sm text-[#6B7280] mt-1">
                      이 위젯이 사용될 수 있는 서비스 테마를 선택하세요 (복수
                      선택 가능)
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => toggleServiceTheme('efficiency')}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        serviceThemes.includes('efficiency')
                          ? 'border-[#118DFF] bg-[#118DFF] text-white'
                          : 'border-[#E5E7EB] bg-white hover:border-[#118DFF]'
                      }`}
                    >
                      <TrendingUp
                        className={`w-6 h-6 mb-2 ${serviceThemes.includes('efficiency') ? 'text-white' : 'text-[#118DFF]'}`}
                      />
                      <div
                        className={`font-medium ${serviceThemes.includes('efficiency') ? 'text-white' : 'text-[#111827]'}`}
                      >
                        운영비 절감
                      </div>
                      <div
                        className={`text-xs mt-1 ${serviceThemes.includes('efficiency') ? 'text-white/80' : 'text-[#6B7280]'}`}
                      >
                        Efficiency
                      </div>
                    </button>

                    <button
                      onClick={() => toggleServiceTheme('asset_value')}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        serviceThemes.includes('asset_value')
                          ? 'border-[#118DFF] bg-[#118DFF] text-white'
                          : 'border-[#E5E7EB] bg-white hover:border-[#118DFF]'
                      }`}
                    >
                      <Leaf
                        className={`w-6 h-6 mb-2 ${serviceThemes.includes('asset_value') ? 'text-white' : 'text-[#22C55E]'}`}
                      />
                      <div
                        className={`font-medium ${serviceThemes.includes('asset_value') ? 'text-white' : 'text-[#111827]'}`}
                      >
                        자산 가치 향상
                      </div>
                      <div
                        className={`text-xs mt-1 ${serviceThemes.includes('asset_value') ? 'text-white/80' : 'text-[#6B7280]'}`}
                      >
                        Asset Value
                      </div>
                    </button>

                    <button
                      onClick={() => toggleServiceTheme('biodiversity')}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        serviceThemes.includes('biodiversity')
                          ? 'border-[#118DFF] bg-[#118DFF] text-white'
                          : 'border-[#E5E7EB] bg-white hover:border-[#118DFF]'
                      }`}
                    >
                      <Bug
                        className={`w-6 h-6 mb-2 ${serviceThemes.includes('biodiversity') ? 'text-white' : 'text-[#8B5CF6]'}`}
                      />
                      <div
                        className={`font-medium ${serviceThemes.includes('biodiversity') ? 'text-white' : 'text-[#111827]'}`}
                      >
                        생물다양성 프로젝트
                      </div>
                      <div
                        className={`text-xs mt-1 ${serviceThemes.includes('biodiversity') ? 'text-white/80' : 'text-[#6B7280]'}`}
                      >
                        Biodiversity
                      </div>
                    </button>
                  </div>
                </div>

                {/* Usage Stage Selection */}
                <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 space-y-4">
                  <div>
                    <h3 className="font-semibold text-[#111827] text-base">
                      사용 단계
                    </h3>
                    <p className="text-sm text-[#6B7280] mt-1">
                      이 위젯이 사용되는 서비스 단계를 선택하세요
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => toggleUsageStage('planning')}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        usageStages.includes('planning')
                          ? 'border-[#118DFF] bg-[#118DFF] text-white'
                          : 'border-[#E5E7EB] bg-white hover:border-[#118DFF]'
                      }`}
                    >
                      <Clipboard
                        className={`w-6 h-6 mb-2 ${usageStages.includes('planning') ? 'text-white' : 'text-[#118DFF]'}`}
                      />
                      <div
                        className={`font-medium ${usageStages.includes('planning') ? 'text-white' : 'text-[#111827]'}`}
                      >
                        계획
                      </div>
                      <div
                        className={`text-xs mt-1 ${usageStages.includes('planning') ? 'text-white/80' : 'text-[#6B7280]'}`}
                      >
                        Planning
                      </div>
                    </button>

                    <button
                      onClick={() => toggleUsageStage('analysis')}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        usageStages.includes('analysis')
                          ? 'border-[#118DFF] bg-[#118DFF] text-white'
                          : 'border-[#E5E7EB] bg-white hover:border-[#118DFF]'
                      }`}
                    >
                      <BarChart3
                        className={`w-6 h-6 mb-2 ${usageStages.includes('analysis') ? 'text-white' : 'text-[#118DFF]'}`}
                      />
                      <div
                        className={`font-medium ${usageStages.includes('analysis') ? 'text-white' : 'text-[#111827]'}`}
                      >
                        분석
                      </div>
                      <div
                        className={`text-xs mt-1 ${usageStages.includes('analysis') ? 'text-white/80' : 'text-[#6B7280]'}`}
                      >
                        Analysis
                      </div>
                    </button>

                    <button
                      onClick={() => toggleUsageStage('management')}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        usageStages.includes('management')
                          ? 'border-[#118DFF] bg-[#118DFF] text-white'
                          : 'border-[#E5E7EB] bg-white hover:border-[#118DFF]'
                      }`}
                    >
                      <Settings
                        className={`w-6 h-6 mb-2 ${usageStages.includes('management') ? 'text-white' : 'text-[#118DFF]'}`}
                      />
                      <div
                        className={`font-medium ${usageStages.includes('management') ? 'text-white' : 'text-[#111827]'}`}
                      >
                        관리
                      </div>
                      <div
                        className={`text-xs mt-1 ${usageStages.includes('management') ? 'text-white/80' : 'text-[#6B7280]'}`}
                      >
                        Management
                      </div>
                    </button>
                  </div>
                </div>
              </TabsContent>

              {/* TAB 2: Inputs */}
              <TabsContent value="inputs" className="p-6 space-y-6">
                <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 space-y-4">
                  <div>
                    <h3 className="font-semibold text-[#111827] text-base">
                      필수 데이터 소스
                    </h3>
                    <p className="text-sm text-[#6B7280] mt-1">
                      이 위젯 분석에 필요한 데이터 소스를 선택하세요
                    </p>
                  </div>

                  <div className="space-y-3">
                    {dataSources.map(({ key, label, desc }) => {
                      const isCustom = key === 'custom';
                      const isChecked = isCustom
                        ? (editedWidget.requiredInputs as any).custom === true
                        : editedWidget.requiredInputs[
                            key as keyof typeof editedWidget.requiredInputs
                          ];

                      return (
                        <div key={key}>
                          <div
                            className={`flex items-center justify-between p-4 bg-[#F9FAFB] border rounded-lg transition-colors ${
                              isChecked
                                ? 'border-[#118DFF] bg-[#118DFF]/5'
                                : 'border-[#E5E7EB] hover:border-[#118DFF]'
                            }`}
                          >
                            <div className="flex-1">
                              <Label
                                htmlFor={`input-${key}`}
                                className="cursor-pointer font-medium text-[#111827]"
                              >
                                {label}
                              </Label>
                              <p className="text-xs text-[#6B7280] mt-0.5">
                                {desc}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <Checkbox
                                id={`input-${key}`}
                                checked={isChecked}
                                onCheckedChange={(checked) => {
                                  handleChange({
                                    requiredInputs: {
                                      ...editedWidget.requiredInputs,
                                      [key]: checked as boolean,
                                    },
                                  });
                                }}
                              />
                            </div>
                          </div>

                          {/* Custom data description */}
                          {isCustom && isChecked && (
                            <div className="mt-3 ml-4 p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg">
                              <Label
                                htmlFor="customDataDesc"
                                className="text-sm font-medium text-[#111827]"
                              >
                                기타 데이터 설명
                              </Label>
                              <Textarea
                                id="customDataDesc"
                                value={customDataDescription}
                                onChange={(e) => {
                                  setCustomDataDescription(e.target.value);
                                  setHasUnsavedChanges(true);
                                }}
                                className="mt-2 bg-white border-[#E5E7EB] min-h-[80px]"
                                placeholder="커스텀 데이터 소스에 대한 설명을 입력하세요 (센서 유형, 포맷, 수집 방법 등)"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>

              {/* TAB 3: Metrics & Computation */}
              <TabsContent value="metrics" className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-[#111827] text-base">
                      지표 목록
                    </h3>
                    <p className="text-sm text-[#6B7280] mt-1">
                      분석 결과로 산출되는 측정 가능한 지표들
                    </p>
                  </div>
                  <Button
                    className="gap-2 bg-[#118DFF] hover:bg-[#0D6FCC] text-white"
                    onClick={() => {
                      const newMetric: ExtendedMetric = {
                        key: `metric_${Date.now()}`,
                        labelKr: '새 지표',
                        labelEn: 'New Metric',
                        unit: null,
                        format: 'number',
                        descriptionKr: '',
                        meaningKr: '',
                        interpretationKr: '',
                        references: [],
                      };
                      setExtendedMetrics([...extendedMetrics, newMetric]);
                      setHasUnsavedChanges(true);
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    지표 추가
                  </Button>
                </div>

                {extendedMetrics.length === 0 ? (
                  <div className="text-center py-12 text-[#9CA3AF] bg-white border border-[#E5E7EB] rounded-lg">
                    <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">
                      지표를 추가하여 분석 결과를 정의하세요
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {extendedMetrics.map((metric, index) => (
                      <div
                        key={index}
                        className="bg-white border border-[#E5E7EB] rounded-lg overflow-hidden"
                      >
                        {/* Metric Header */}
                        <div className="flex items-center justify-between px-5 py-4 bg-[#F9FAFB] border-b border-[#E5E7EB]">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-[#118DFF]">
                              지표 #{index + 1}
                            </span>
                            <span className="text-sm text-[#6B7280]">
                              {metric.labelKr || '이름 없음'}
                            </span>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => {
                                if (index === 0) return;
                                const newMetrics = [...extendedMetrics];
                                [newMetrics[index - 1], newMetrics[index]] = [
                                  newMetrics[index],
                                  newMetrics[index - 1],
                                ];
                                setExtendedMetrics(newMetrics);
                                setHasUnsavedChanges(true);
                              }}
                              disabled={index === 0}
                            >
                              <ChevronUp className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => {
                                if (index === extendedMetrics.length - 1)
                                  return;
                                const newMetrics = [...extendedMetrics];
                                [newMetrics[index], newMetrics[index + 1]] = [
                                  newMetrics[index + 1],
                                  newMetrics[index],
                                ];
                                setExtendedMetrics(newMetrics);
                                setHasUnsavedChanges(true);
                              }}
                              disabled={index === extendedMetrics.length - 1}
                            >
                              <ChevronDown className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => {
                                setExtendedMetrics(
                                  extendedMetrics.filter((_, i) => i !== index),
                                );
                                setHasUnsavedChanges(true);
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Metric Content */}
                        <div className="p-5 space-y-5">
                          {/* Basic Info */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">
                                지표 이름 (한글)
                              </Label>
                              <Input
                                placeholder="위험도 점수"
                                value={metric.labelKr}
                                onChange={(e) =>
                                  updateExtendedMetric(index, {
                                    labelKr: e.target.value,
                                  })
                                }
                                className="bg-white border-[#E5E7EB]"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">
                                Metric Name (English)
                              </Label>
                              <Input
                                placeholder="Risk Score"
                                value={metric.labelEn}
                                onChange={(e) =>
                                  updateExtendedMetric(index, {
                                    labelEn: e.target.value,
                                  })
                                }
                                className="bg-white border-[#E5E7EB]"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">
                                Key (API 필드명)
                              </Label>
                              <Input
                                placeholder="risk_score"
                                value={metric.key}
                                onChange={(e) =>
                                  updateExtendedMetric(index, {
                                    key: e.target.value,
                                  })
                                }
                                className="font-mono text-sm bg-white border-[#E5E7EB]"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">
                                단위
                              </Label>
                              <Input
                                placeholder="%"
                                value={metric.unit || ''}
                                onChange={(e) =>
                                  updateExtendedMetric(index, {
                                    unit: e.target.value || null,
                                  })
                                }
                                className="bg-white border-[#E5E7EB]"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">
                                형식
                              </Label>
                              <Select
                                value={metric.format}
                                onValueChange={(value: any) =>
                                  updateExtendedMetric(index, { format: value })
                                }
                              >
                                <SelectTrigger className="bg-white border-[#E5E7EB]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-[#E5E7EB]">
                                  <SelectItem value="number">숫자</SelectItem>
                                  <SelectItem value="percent">
                                    백분율
                                  </SelectItem>
                                  <SelectItem value="score">점수</SelectItem>
                                  <SelectItem value="text">텍스트</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {/* 계산 개요 설명 */}
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">
                              계산 개요 설명
                            </Label>
                            <Textarea
                              placeholder="이 지표가 어떻게 계산되는지 간략히 설명하세요"
                              value={metric.descriptionKr || ''}
                              onChange={(e) =>
                                updateExtendedMetric(index, {
                                  descriptionKr: e.target.value,
                                })
                              }
                              className="bg-white border-[#E5E7EB] min-h-[60px]"
                            />
                          </div>

                          {/* 지표 의미 설명 */}
                          <div className="space-y-2 bg-[#F9FAFB] p-4 rounded-lg">
                            <Label className="text-sm font-medium text-[#111827]">
                              지표 의미 설명
                            </Label>
                            <p className="text-xs text-[#6B7280] mb-2">
                              이 지표가 무엇을 나타내며, 의사결정에 어떻게
                              활용되는지 설명하세요
                            </p>
                            <Textarea
                              placeholder="예: 이 점수는 수목의 전체적인 건강 상태를 0-100 사이의 값으로 나타냅니다. 점수가 높을수록 건강한 상태를 의미하며, 관리 우선순위 결정에 핵심 지표로 활용됩니다."
                              value={metric.meaningKr || ''}
                              onChange={(e) =>
                                updateExtendedMetric(index, {
                                  meaningKr: e.target.value,
                                })
                              }
                              className="bg-white border-[#E5E7EB] min-h-[100px]"
                            />
                          </div>

                          {/* 해석 및 원인 설명 */}
                          <div className="space-y-2 bg-[#F9FAFB] p-4 rounded-lg">
                            <Label className="text-sm font-medium text-[#111827]">
                              해석 및 원인 설명
                            </Label>
                            <p className="text-xs text-[#6B7280] mb-2">
                              높은/낮은 값의 의미와 가능한 원인을 설명하세요
                              (리포트에 활용됨)
                            </p>
                            <Textarea
                              placeholder="예: 점수가 30 이하일 경우 고위험 상태로 분류됩니다. 주요 원인으로는 기울기 과다(15도 이상), NDVI 저하(0.4 미만), 수관 밀도 감소 등이 있으며, 이는 구조적 불안정이나 질병에 의한 것일 수 있습니다."
                              value={metric.interpretationKr || ''}
                              onChange={(e) =>
                                updateExtendedMetric(index, {
                                  interpretationKr: e.target.value,
                                })
                              }
                              className="bg-white border-[#E5E7EB] min-h-[100px]"
                            />
                          </div>

                          {/* 참고 문헌 */}
                          <div className="space-y-3 bg-[#F9FAFB] p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <Label className="text-sm font-medium text-[#111827]">
                                  참고 문헌
                                </Label>
                                <p className="text-xs text-[#6B7280] mt-0.5">
                                  관련 논문, 표준, 가이드라인 등
                                </p>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1 border-[#E5E7EB]"
                                onClick={() => addReference(index)}
                              >
                                <Plus className="w-3 h-3" />
                                문헌 추가
                              </Button>
                            </div>

                            {metric.references &&
                            metric.references.length > 0 ? (
                              <div className="space-y-2">
                                {metric.references.map((ref, refIndex) => (
                                  <div
                                    key={refIndex}
                                    className="flex gap-2 items-start bg-white p-3 rounded-lg border border-[#E5E7EB]"
                                  >
                                    <div className="flex-1 space-y-2">
                                      <Input
                                        placeholder="문헌 제목"
                                        value={ref.title}
                                        onChange={(e) =>
                                          updateReference(
                                            index,
                                            refIndex,
                                            'title',
                                            e.target.value,
                                          )
                                        }
                                        className="bg-white border-[#E5E7EB] text-sm"
                                      />
                                      <div className="flex items-center gap-2">
                                        <Link2 className="w-4 h-4 text-[#6B7280] flex-shrink-0" />
                                        <Input
                                          placeholder="출처 / DOI / URL"
                                          value={ref.source}
                                          onChange={(e) =>
                                            updateReference(
                                              index,
                                              refIndex,
                                              'source',
                                              e.target.value,
                                            )
                                          }
                                          className="bg-white border-[#E5E7EB] text-sm"
                                        />
                                      </div>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                      onClick={() =>
                                        removeReference(index, refIndex)
                                      }
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-4 text-[#9CA3AF] text-sm">
                                참고 문헌을 추가하세요
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* TAB 4: Visualization & Generation */}
              <TabsContent value="visuals" className="p-6 space-y-6">
                <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 space-y-4">
                  <div>
                    <h3 className="font-semibold text-[#111827] text-base">
                      지원 시각화 타입
                    </h3>
                    <p className="text-sm text-[#6B7280] mt-1">
                      이 위젯이 지원하는 차트 및 맵 표현 방식을 선택하세요
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {visualizationTypes.map(
                      ({ type, label, icon: Icon, desc }) => {
                        const viz = editedWidget.visualizations.find(
                          (v) => v.type === type,
                        );
                        const isEnabled = viz?.enabled ?? false;

                        return (
                          <button
                            key={type}
                            onClick={() => {
                              const newViz = editedWidget.visualizations.map(
                                (v) =>
                                  v.type === type
                                    ? { ...v, enabled: !v.enabled }
                                    : v,
                              );
                              // Add if not exists
                              if (
                                !editedWidget.visualizations.find(
                                  (v) => v.type === type,
                                )
                              ) {
                                newViz.push({
                                  type: type as any,
                                  enabled: true,
                                });
                              }
                              handleChange({ visualizations: newViz });
                              setSelectedVizPreview(type);
                            }}
                            className={`p-4 rounded-lg border-2 transition-all text-left ${
                              isEnabled
                                ? 'border-[#118DFF] bg-[#118DFF]/5'
                                : 'border-[#E5E7EB] bg-white hover:border-[#118DFF]'
                            }`}
                          >
                            <Icon
                              className={`w-6 h-6 mb-2 ${isEnabled ? 'text-[#118DFF]' : 'text-[#6B7280]'}`}
                            />
                            <div
                              className={`font-medium text-sm ${isEnabled ? 'text-[#118DFF]' : 'text-[#111827]'}`}
                            >
                              {label}
                            </div>
                            <div className="text-xs text-[#6B7280] mt-1">
                              {desc}
                            </div>
                          </button>
                        );
                      },
                    )}
                  </div>
                </div>

                {/* Visualization Preview */}
                <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-[#111827] text-base">
                        고객 화면 예시
                      </h3>
                      <p className="text-sm text-[#6B7280] mt-1">
                        선택한 시각화가 고객에게 어떻게 보이는지 미리보기
                      </p>
                    </div>
                    <Select
                      value={selectedVizPreview || ''}
                      onValueChange={setSelectedVizPreview}
                    >
                      <SelectTrigger className="w-[180px] bg-white border-[#E5E7EB]">
                        <SelectValue placeholder="시각화 선택" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-[#E5E7EB]">
                        {visualizationTypes.map(({ type, label }) => (
                          <SelectItem key={type} value={type}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="border border-dashed border-[#E5E7EB] rounded-lg p-4">
                    <div className="text-xs text-[#6B7280] mb-3 flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      고객 화면 미리보기
                    </div>
                    {selectedVizPreview ? (
                      renderVisualizationPreview(selectedVizPreview)
                    ) : (
                      <div className="bg-gray-50 rounded-lg h-48 flex items-center justify-center text-[#9CA3AF]">
                        <p className="text-sm">
                          시각화 타입을 선택하면 미리보기가 표시됩니다
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* TAB 5: Exports */}
              <TabsContent value="exports" className="p-6 space-y-6">
                <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 space-y-4">
                  <div>
                    <h3 className="font-semibold text-[#111827] text-base">
                      다운로드 포함
                    </h3>
                    <p className="text-sm text-[#6B7280] mt-1">
                      고객이 다운로드할 수 있는 파일 형식을 선택하세요
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-[#6B7280] uppercase tracking-wider">
                        리포트
                      </Label>
                      <div className="grid grid-cols-3 gap-3 mt-2">
                        {exportFormatOptions
                          .filter((f) => f.group === 'reports')
                          .map(({ key, label, desc }) => (
                            <button
                              key={key}
                              onClick={() => toggleExportFormat(key)}
                              className={`p-4 rounded-lg border-2 transition-all text-left ${
                                exportFormats.includes(key)
                                  ? 'border-[#118DFF] bg-[#118DFF]/5'
                                  : 'border-[#E5E7EB] bg-white hover:border-[#118DFF]'
                              }`}
                            >
                              <FileText
                                className={`w-5 h-5 mb-2 ${exportFormats.includes(key) ? 'text-[#118DFF]' : 'text-[#6B7280]'}`}
                              />
                              <div
                                className={`font-medium text-sm ${exportFormats.includes(key) ? 'text-[#118DFF]' : 'text-[#111827]'}`}
                              >
                                {label}
                              </div>
                              <div className="text-xs text-[#6B7280] mt-1">
                                {desc}
                              </div>
                            </button>
                          ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-[#6B7280] uppercase tracking-wider">
                        데이터
                      </Label>
                      <div className="grid grid-cols-3 gap-3 mt-2">
                        {exportFormatOptions
                          .filter((f) => f.group === 'data')
                          .map(({ key, label, desc }) => (
                            <button
                              key={key}
                              onClick={() => toggleExportFormat(key)}
                              className={`p-4 rounded-lg border-2 transition-all text-left ${
                                exportFormats.includes(key)
                                  ? 'border-[#118DFF] bg-[#118DFF]/5'
                                  : 'border-[#E5E7EB] bg-white hover:border-[#118DFF]'
                              }`}
                            >
                              <FileSpreadsheet
                                className={`w-5 h-5 mb-2 ${exportFormats.includes(key) ? 'text-[#118DFF]' : 'text-[#6B7280]'}`}
                              />
                              <div
                                className={`font-medium text-sm ${exportFormats.includes(key) ? 'text-[#118DFF]' : 'text-[#111827]'}`}
                              >
                                {label}
                              </div>
                              <div className="text-xs text-[#6B7280] mt-1">
                                {desc}
                              </div>
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-4 mt-4">
                    <p className="text-sm text-[#6B7280]">
                      선택된 형식은 고객 다운로드 메뉴에 표시됩니다.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-white border-[#E5E7EB]">
          <AlertDialogHeader>
            <AlertDialogTitle>위젯 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              이 위젯을 삭제하시겠습니까? 삭제된 위젯은 복구할 수 없습니다.
              <br />
              <span className="font-medium text-[#111827] mt-2 block">
                &quot;{editedWidget.nameKr}&quot;
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#E5E7EB]">
              취소
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
