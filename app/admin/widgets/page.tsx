'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Plus,
  MoreVertical,
  Database,
  FileText,
  Activity,
  Leaf,
  Eye,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Copy,
  Ban,
  Edit3,
} from 'lucide-react';
import {
  getWidgetCatalog,
  categoryLabels,
  type WidgetCatalogItem,
} from '@/lib/widget-catalog';
import { WidgetModalEditor } from '@/components/widget-modal-editor';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function WidgetCatalogPage() {
  const [widgets, setWidgets] =
    useState<WidgetCatalogItem[]>(getWidgetCatalog());
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'updated' | 'name'>('updated');
  const [selectedWidget, setSelectedWidget] =
    useState<WidgetCatalogItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categoryCounts = useMemo(() => {
    const counts = {
      all: widgets.length,
      common: 0,
      efficiency: 0,
      asset_value: 0,
      biodiversity: 0,
    };

    widgets.forEach((w) => {
      counts[w.category]++;
    });

    return counts;
  }, [widgets]);

  const statusCounts = useMemo(() => {
    const counts = {
      active: 0,
      draft: 0,
      deprecated: 0,
    };

    widgets.forEach((w) => {
      counts[w.status]++;
    });

    return counts;
  }, [widgets]);

  // Filter and sort widgets
  const filteredWidgets = useMemo(() => {
    let result = [...widgets];

    // Search filter
    if (searchQuery) {
      result = result.filter(
        (w) =>
          w.nameKr.toLowerCase().includes(searchQuery.toLowerCase()) ||
          w.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
          w.id.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter((w) => w.category === categoryFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((w) => w.status === statusFilter);
    }

    // Sort
    if (sortBy === 'updated') {
      result.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
    } else {
      result.sort((a, b) => a.nameKr.localeCompare(b.nameKr));
    }

    return result;
  }, [widgets, searchQuery, categoryFilter, statusFilter, sortBy]);

  const handleRefresh = () => {
    setWidgets(getWidgetCatalog());
  };

  const handleOpenModal = (widget: WidgetCatalogItem) => {
    setSelectedWidget(widget);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedWidget(null);
  };

  const handleSaveWidget = (updated: WidgetCatalogItem) => {
    setWidgets((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
    handleRefresh();
  };

  const handleDuplicateWidget = (widget: WidgetCatalogItem) => {
    const duplicated: WidgetCatalogItem = {
      ...widget,
      id: `${widget.id}_copy_${Date.now()}`,
      nameKr: `${widget.nameKr} (복사본)`,
      nameEn: `${widget.nameEn} (Copy)`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setWidgets((prev) => [...prev, duplicated]);
    handleRefresh();
  };

  const handleDeprecateWidget = (widget: WidgetCatalogItem) => {
    const updated = {
      ...widget,
      status: 'deprecated' as const,
      updatedAt: new Date().toISOString(),
    };
    setWidgets((prev) => prev.map((w) => (w.id === widget.id ? updated : w)));
    handleRefresh();
  };

  const handleDeleteWidget = (widgetId: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== widgetId));
    handleRefresh();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'common':
        return Database;
      case 'efficiency':
        return Activity;
      case 'asset_value':
        return Leaf;
      case 'biodiversity':
        return FileText;
      default:
        return Database;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <div className="flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-1 rounded-md">
            <CheckCircle2 className="w-3 h-3" />
            활성
          </div>
        );
      case 'draft':
        return (
          <div className="flex items-center gap-1 text-xs text-yellow-700 bg-yellow-50 px-2 py-1 rounded-md">
            <Clock className="w-3 h-3" />
            초안
          </div>
        );
      case 'deprecated':
        return (
          <div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
            <XCircle className="w-3 h-3" />
            종료
          </div>
        );
      default:
        return null;
    }
  };

  const getRequiredInputChips = (widget: WidgetCatalogItem) => {
    const inputs = [];
    if (widget.requiredInputs.satellite) inputs.push('SAT');
    if (widget.requiredInputs.rgbOrtho) inputs.push('RGB');
    if (widget.requiredInputs.lidarLaz) inputs.push('LiDAR');
    if (widget.requiredInputs.multispectral) inputs.push('MS');
    if (widget.requiredInputs.csvOptional) inputs.push('CSV');
    return inputs;
  };

  const handleCategoryClick = (category: string) => {
    setCategoryFilter(categoryFilter === category ? 'all' : category);
  };

  const handleStatusClick = (status: string) => {
    setStatusFilter(statusFilter === status ? 'all' : status);
  };

  const handleResetFilters = () => {
    setCategoryFilter('all');
    setStatusFilter('all');
    setSearchQuery('');
  };

  const handleCreateWidget = () => {
    const newWidget: WidgetCatalogItem = {
      id: `widget_${Date.now()}`,
      nameKr: '새 위젯',
      nameEn: 'New Widget',
      descriptionKr: '',
      descriptionEn: '',
      category: 'common',
      status: 'draft',
      icon: 'Database',
      defaultVisibility: 'customer',
      defaultLayout: 'full',
      requiredInputs: {
        satellite: false,
        rgbOrtho: false,
        lidarLaz: false,
        multispectral: false,
        csvOptional: false,
      },
      metrics: [],
      visualizations: [
        { type: 'kpi', enabled: true },
        { type: 'table', enabled: false },
        { type: 'map', enabled: false },
        { type: 'timeseries', enabled: false },
        { type: 'histogram', enabled: false },
        { type: 'heatmap', enabled: false },
      ],
      insightTemplates: {
        summaryKr: '',
        summaryEn: '',
        causeRules: [],
      },
      updatedAt: new Date().toISOString(),
    };
    setSelectedWidget(newWidget);
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-[#F5F7FB]">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-[#E5E7EB] px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-[#111827]">위젯 설정</h1>
              <p className="text-sm text-[#6B7280] mt-1">
                전체 위젯 카탈로그 관리 · 프로젝트에서 사용할 위젯 정의
              </p>
            </div>
            <Button
              onClick={handleCreateWidget}
              className="bg-[#118DFF] hover:bg-[#0D6FCC] text-white gap-2"
            >
              <Plus className="w-4 h-4" />
              위젯 생성
            </Button>
          </div>

          <div className="mb-6 space-y-4">
            {/* Total count card */}
            <Card className="bg-white border-[#E5E7EB] p-4 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#6B7280] mb-1">전체 위젯</p>
                  <p className="text-3xl font-bold text-[#111827]">
                    {categoryCounts.all}
                  </p>
                </div>
                <Database className="w-10 h-10 text-[#118DFF] opacity-20" />
              </div>
            </Card>

            {/* Category breakdown */}
            <div>
              <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3">
                카테고리별 위젯
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleResetFilters}
                  className={`px-4 py-2.5 rounded-lg border transition-all ${
                    categoryFilter === 'all' &&
                    statusFilter === 'all' &&
                    !searchQuery
                      ? 'bg-[#118DFF] text-white border-[#118DFF]'
                      : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#118DFF]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">전체 보기</span>
                    <span className="text-sm opacity-75">
                      {categoryCounts.all}
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => handleCategoryClick('common')}
                  className={`px-4 py-2.5 rounded-lg border transition-all ${
                    categoryFilter === 'common'
                      ? 'bg-[#118DFF] text-white border-[#118DFF]'
                      : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#118DFF]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    <span className="font-medium">공통</span>
                    <span className="text-sm opacity-75">
                      {categoryCounts.common}
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => handleCategoryClick('efficiency')}
                  className={`px-4 py-2.5 rounded-lg border transition-all ${
                    categoryFilter === 'efficiency'
                      ? 'bg-[#118DFF] text-white border-[#118DFF]'
                      : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#118DFF]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    <span className="font-medium">운영비 절감</span>
                    <span className="text-sm opacity-75">
                      {categoryCounts.efficiency}
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => handleCategoryClick('asset_value')}
                  className={`px-4 py-2.5 rounded-lg border transition-all ${
                    categoryFilter === 'asset_value'
                      ? 'bg-[#118DFF] text-white border-[#118DFF]'
                      : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#118DFF]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Leaf className="w-4 h-4" />
                    <span className="font-medium">자산 가치 향상</span>
                    <span className="text-sm opacity-75">
                      {categoryCounts.asset_value}
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => handleCategoryClick('biodiversity')}
                  className={`px-4 py-2.5 rounded-lg border transition-all ${
                    categoryFilter === 'biodiversity'
                      ? 'bg-[#118DFF] text-white border-[#118DFF]'
                      : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#118DFF]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span className="font-medium">생물다양성</span>
                    <span className="text-sm opacity-75">
                      {categoryCounts.biodiversity}
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Status breakdown */}
            <div>
              <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3">
                상태별 위젯
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleStatusClick('active')}
                  className={`px-4 py-2.5 rounded-lg border transition-all ${
                    statusFilter === 'active'
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:border-green-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="font-medium">활성</span>
                    <span className="text-sm opacity-75">
                      {statusCounts.active}
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => handleStatusClick('draft')}
                  className={`px-4 py-2.5 rounded-lg border transition-all ${
                    statusFilter === 'draft'
                      ? 'bg-yellow-600 text-white border-yellow-600'
                      : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:border-yellow-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">초안</span>
                    <span className="text-sm opacity-75">
                      {statusCounts.draft}
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => handleStatusClick('deprecated')}
                  className={`px-4 py-2.5 rounded-lg border transition-all ${
                    statusFilter === 'deprecated'
                      ? 'bg-gray-600 text-white border-gray-600'
                      : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    <span className="font-medium">종료</span>
                    <span className="text-sm opacity-75">
                      {statusCounts.deprecated}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Control bar */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <Input
                placeholder="위젯명, ID, 카테고리 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-[#E5E7EB]"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[160px] bg-white border-[#E5E7EB]">
                <SelectValue placeholder="카테고리" />
              </SelectTrigger>
              <SelectContent className="bg-white border-[#E5E7EB]">
                <SelectItem value="all">전체 카테고리</SelectItem>
                <SelectItem value="common">공통</SelectItem>
                <SelectItem value="efficiency">운영비 절감</SelectItem>
                <SelectItem value="asset_value">자산 가치</SelectItem>
                <SelectItem value="biodiversity">생물다양성</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] bg-white border-[#E5E7EB]">
                <SelectValue placeholder="상태" />
              </SelectTrigger>
              <SelectContent className="bg-white border-[#E5E7EB]">
                <SelectItem value="all">전체 상태</SelectItem>
                <SelectItem value="active">활성</SelectItem>
                <SelectItem value="draft">초안</SelectItem>
                <SelectItem value="deprecated">종료</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={sortBy}
              onValueChange={(v: 'updated' | 'name') => setSortBy(v)}
            >
              <SelectTrigger className="w-[140px] bg-white border-[#E5E7EB]">
                <SelectValue placeholder="정렬" />
              </SelectTrigger>
              <SelectContent className="bg-white border-[#E5E7EB]">
                <SelectItem value="updated">최근 수정순</SelectItem>
                <SelectItem value="name">이름순</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Widget table */}
        <div className="flex-1 overflow-y-auto p-8">
          <Card className="bg-white border-[#E5E7EB] shadow-sm rounded-xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                      위젯명
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                      카테고리
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                      상태
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                      기본 노출
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                      필수 입력
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                      최근 수정일
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider w-16">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {filteredWidgets.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-12 text-center text-[#9CA3AF]"
                      >
                        <Database className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">검색 결과가 없습니다</p>
                      </td>
                    </tr>
                  ) : (
                    filteredWidgets.map((widget) => {
                      const CategoryIcon = getCategoryIcon(widget.category);
                      const inputs = getRequiredInputChips(widget);

                      return (
                        <tr
                          key={widget.id}
                          onClick={() => handleOpenModal(widget)}
                          className="cursor-pointer hover:bg-[#F9FAFB] transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#118DFF]/10 flex items-center justify-center">
                                <CategoryIcon className="w-4 h-4 text-[#118DFF]" />
                              </div>
                              <div>
                                <div className="font-medium text-[#111827]">
                                  {widget.nameKr}
                                </div>
                                <div className="text-xs text-[#6B7280]">
                                  {widget.nameEn}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-[#6B7280]">
                              {categoryLabels[widget.category]}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {getStatusBadge(widget.status)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-[#6B7280]">
                              {widget.defaultVisibility === 'customer' ? (
                                <span className="flex items-center gap-1 text-green-700">
                                  <Eye className="w-3 h-3" />
                                  고객
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-orange-700">
                                  관리자
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-1 flex-wrap">
                              {inputs.length === 0 ? (
                                <span className="text-xs text-[#9CA3AF]">
                                  없음
                                </span>
                              ) : (
                                inputs.map((input) => (
                                  <span
                                    key={input}
                                    className="text-xs bg-[#F3F4F6] text-[#4B5563] px-2 py-1 rounded"
                                  >
                                    {input}
                                  </span>
                                ))
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1 text-sm text-[#6B7280]">
                              <Calendar className="w-3 h-3" />
                              {new Date(widget.updatedAt).toLocaleDateString(
                                'ko-KR',
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreVertical className="w-4 h-4 text-[#6B7280]" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="bg-white border-[#E5E7EB]"
                              >
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenModal(widget);
                                  }}
                                  className="gap-2"
                                >
                                  <Edit3 className="w-4 h-4" />
                                  편집
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDuplicateWidget(widget);
                                  }}
                                  className="gap-2"
                                >
                                  <Copy className="w-4 h-4" />
                                  복제
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (
                                      confirm(
                                        `"${widget.nameKr}" 위젯을 비활성화하시겠습니까?`,
                                      )
                                    ) {
                                      handleDeprecateWidget(widget);
                                    }
                                  }}
                                  className="gap-2 text-red-600"
                                  disabled={widget.status === 'deprecated'}
                                >
                                  <Ban className="w-4 h-4" />
                                  비활성화
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteWidget(widget.id);
                                  }}
                                  className="gap-2 text-red-600"
                                >
                                  <Ban className="w-4 h-4" />
                                  삭제
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      <WidgetModalEditor
        widget={selectedWidget}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveWidget}
        onDelete={handleDeleteWidget}
      />
    </div>
  );
}
