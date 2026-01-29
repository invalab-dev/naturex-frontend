'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Plus,
  Settings,
  Eye,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronRight,
  X,
  MapPin,
  Edit,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  getProjects,
  deleteProject,
  getOrganizations,
  updateProjectDeliveryStage,
  DELIVERY_STAGES,
  getUsers,
  type Project,
  type DeliveryStage,
} from '@/lib/data-service';
import { startImpersonation } from '@/lib/impersonation';

export default function AdminProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [orgs, setOrgs] = useState<Array<{ orgId: string; name: string }>>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isStageEditOpen, setIsStageEditOpen] = useState(false);
  const [stageChangeMemo, setStageChangeMemo] = useState('');
  const [newStage, setNewStage] = useState<DeliveryStage>('pending');

  // Filters
  const [filterOrg, setFilterOrg] = useState<string>('all');
  const [filterTheme, setFilterTheme] = useState<string>('all');
  const [filterStage, setFilterStage] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    loadProjects();
    setOrgs(getOrganizations());

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('filter') === 'unconfigured') {
        setFilterStage('unconfigured');
      }
    }
  }, []);

  useEffect(() => {
    applyFilters();
  }, [projects, filterOrg, filterTheme, filterStage, searchQuery]);

  const loadProjects = () => {
    setProjects(getProjects());
  };

  const applyFilters = () => {
    let filtered = [...projects];

    if (filterOrg !== 'all') {
      filtered = filtered.filter((p) => p.orgId === filterOrg);
    }
    if (filterTheme !== 'all') {
      filtered = filtered.filter((p) => p.theme === filterTheme);
    }
    if (filterStage !== 'all') {
      if (filterStage === 'unconfigured') {
        filtered = filtered.filter((p) => p.widgetStatus === 'none');
      } else {
        filtered = filtered.filter((p) => p.deliveryStage === filterStage);
      }
    }
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.location.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    setFilteredProjects(filtered);
  };

  const handleDelete = (projectId: string) => {
    if (confirm('정말 삭제하시겠습니까? 위젯 설정도 함께 삭제됩니다.')) {
      deleteProject(projectId);
      loadProjects();
      setSelectedProject(null);
    }
  };

  const handleStageChange = () => {
    if (!selectedProject) return;
    updateProjectDeliveryStage(
      selectedProject.projectId,
      newStage,
      stageChangeMemo,
    );
    loadProjects();
    setSelectedProject((prev) =>
      prev ? { ...prev, deliveryStage: newStage } : null,
    );
    setIsStageEditOpen(false);
    setStageChangeMemo('');
  };

  const handleImpersonateCustomer = (project: Project) => {
    const users = getUsers();
    const customerUser = users.find(
      (u) => u.role === 'customer' && u.orgId === project.orgId,
    );

    if (!customerUser) {
      alert('이 조직에 등록된 고객 사용자가 없습니다.');
      return;
    }

    startImpersonation(project.orgId, customerUser.userId);
    window.open(`/app/projects/${project.projectId}`, '_blank');
  };

  const getOrgName = (orgId: string) => {
    const org = orgs.find((o) => o.orgId === orgId);
    return org?.name || orgId;
  };

  const getThemeBadge = (theme: string) => {
    const styles = {
      efficiency: 'bg-blue-100 text-blue-700',
      asset: 'bg-green-100 text-green-700',
      biodiversity: 'bg-purple-100 text-purple-700',
    };
    const labels = {
      efficiency: '운영비 절감',
      asset: '자산 가치 향상',
      biodiversity: '생물다양성',
    };
    return (
      <span
        className={`text-xs px-2 py-1 rounded font-medium ${styles[theme as keyof typeof styles]}`}
      >
        {labels[theme as keyof typeof labels]}
      </span>
    );
  };

  const getStageOrder = (stage: DeliveryStage): number => {
    const order: Record<DeliveryStage, number> = {
      pending: 1,
      analyzing: 2,
      delivering: 3,
      executing: 4,
      completed: 5,
    };
    return order[stage];
  };

  const renderMiniPipeline = (currentStage: DeliveryStage) => {
    const stages: DeliveryStage[] = [
      'pending',
      'analyzing',
      'delivering',
      'executing',
      'completed',
    ];
    const currentOrder = getStageOrder(currentStage);

    return (
      <div className="flex items-center gap-1">
        {stages.map((stage, index) => {
          const stageOrder = getStageOrder(stage);
          const isActive = stageOrder === currentOrder;
          const isPassed = stageOrder < currentOrder;

          return (
            <div
              key={stage}
              className={`w-8 h-1.5 rounded-full ${
                isActive
                  ? 'bg-[#118DFF]'
                  : isPassed
                    ? 'bg-green-500'
                    : 'bg-gray-200'
              }`}
              title={DELIVERY_STAGES[stage].kr}
            />
          );
        })}
      </div>
    );
  };

  const getWidgetStatusBadge = (project: Project) => {
    const { widgetStatus } = project;
    if (widgetStatus === 'complete') {
      return (
        <div className="flex items-center gap-1 text-xs text-green-700 font-medium">
          <CheckCircle2 className="w-4 h-4" />
          구성됨
        </div>
      );
    }
    if (widgetStatus === 'partial') {
      return (
        <div className="flex items-center gap-1 text-xs text-blue-600 font-medium">
          <Clock className="w-4 h-4" />
          부분 구성
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1 text-xs text-orange-600 font-medium">
        <AlertCircle className="w-4 h-4" />
        미설정
      </div>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F7FB]">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#111827] mb-2">
                프로젝트 관리
              </h1>
              <p className="text-[#6B7280]">
                서비스 제공 단계와 위젯을 관리합니다
              </p>
            </div>
            <Link href="/admin/projects/new">
              <Button className="bg-[#118DFF] hover:bg-[#0D6FCC] gap-2">
                <Plus className="w-4 h-4" />
                프로젝트 생성
              </Button>
            </Link>
          </div>

          {/* Filter Bar */}
          <Card className="p-4 bg-white border-[#E5E7EB] mb-6">
            <div className="grid md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">검색</Label>
                <Input
                  placeholder="프로젝트명 또는 위치 검색"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">조직 필터</Label>
                <Select value={filterOrg} onValueChange={setFilterOrg}>
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">전체 조직</SelectItem>
                    {orgs.map((org) => (
                      <SelectItem key={org.orgId} value={org.orgId}>
                        {org.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">테마 필터</Label>
                <Select value={filterTheme} onValueChange={setFilterTheme}>
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">전체 테마</SelectItem>
                    <SelectItem value="efficiency">운영비 절감</SelectItem>
                    <SelectItem value="asset">자산 가치 향상</SelectItem>
                    <SelectItem value="biodiversity">생물다양성</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">서비스 제공 단계</Label>
                <Select value={filterStage} onValueChange={setFilterStage}>
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">전체 단계</SelectItem>
                    <SelectItem value="unconfigured">위젯 미설정</SelectItem>
                    {Object.entries(DELIVERY_STAGES).map(([key, { kr }]) => (
                      <SelectItem key={key} value={key}>
                        {kr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Project Table */}
          <Card className="bg-white border-[#E5E7EB] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F5F7FB] border-b border-[#E5E7EB]">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                      프로젝트명
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                      조직명
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                      테마
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                      서비스 제공 단계
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                      위젯 구성
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                      최근 활동
                    </th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {filteredProjects.map((project) => (
                    <tr
                      key={project.projectId}
                      className="hover:bg-[#F9FAFB] cursor-pointer transition-colors"
                      onClick={() => setSelectedProject(project)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-[#111827]">
                            {project.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-[#6B7280] mt-1">
                          <MapPin className="w-3 h-3" />
                          {project.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#6B7280]">
                        {getOrgName(project.orgId)}
                      </td>
                      <td className="px-6 py-4">
                        {getThemeBadge(project.theme)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1.5">
                          <div
                            className="text-xs font-medium"
                            style={{
                              color:
                                DELIVERY_STAGES[project.deliveryStage].color,
                            }}
                          >
                            {DELIVERY_STAGES[project.deliveryStage].kr}
                          </div>
                          {renderMiniPipeline(project.deliveryStage)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getWidgetStatusBadge(project)}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#6B7280]">
                        {project.lastActivityAt
                          ? new Date(project.lastActivityAt).toLocaleDateString(
                              'ko-KR',
                            )
                          : new Date(project.createdAt).toLocaleDateString(
                              'ko-KR',
                            )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/projects/${project.projectId}/builder`}
                          >
                            <Button
                              size="sm"
                              className="gap-2 bg-[#118DFF] hover:bg-[#0D6FCC]"
                            >
                              <Settings className="w-4 h-4" />
                              빌더 열기
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="gap-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleImpersonateCustomer(project);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                            고객 화면
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProject(project);
                            }}
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredProjects.length === 0 && (
                <div className="text-center py-12 text-[#6B7280]">
                  {projects.length === 0
                    ? '등록된 프로젝트가 없습니다'
                    : '필터 조건에 맞는 프로젝트가 없습니다'}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Project Detail Side Panel */}
      {selectedProject && (
        <div className="w-[480px] border-l border-[#E5E7EB] bg-white overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#111827]">
                프로젝트 상세
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedProject(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Project Overview */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-[#6B7280] mb-3">
                기본 정보
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-[#6B7280] mb-1">프로젝트명</div>
                  <div className="font-medium text-[#111827]">
                    {selectedProject.name}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#6B7280] mb-1">조직</div>
                  <div className="font-medium text-[#111827]">
                    {getOrgName(selectedProject.orgId)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#6B7280] mb-1">테마</div>
                  <div>{getThemeBadge(selectedProject.theme)}</div>
                </div>
                <div>
                  <div className="text-xs text-[#6B7280] mb-1">위치</div>
                  <div className="font-medium text-[#111827]">
                    {selectedProject.location}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#6B7280] mb-1">생성일</div>
                  <div className="text-sm text-[#111827]">
                    {new Date(selectedProject.createdAt).toLocaleDateString(
                      'ko-KR',
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Service Delivery Pipeline */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-[#6B7280]">
                  서비스 제공 단계
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#118DFF] hover:text-[#0D6FCC]"
                  onClick={() => {
                    setNewStage(selectedProject.deliveryStage);
                    setIsStageEditOpen(!isStageEditOpen);
                  }}
                >
                  <Edit className="w-3 h-3 mr-1" />
                  단계 변경
                </Button>
              </div>

              {/* Stage Change Form */}
              {isStageEditOpen && (
                <Card className="p-4 mb-4 bg-[#F5F7FB] border-[#E5E7EB]">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs">새 단계</Label>
                      <Select
                        value={newStage}
                        onValueChange={(v) => setNewStage(v as DeliveryStage)}
                      >
                        <SelectTrigger className="mt-1 bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {Object.entries(DELIVERY_STAGES).map(
                            ([key, { kr }]) => (
                              <SelectItem key={key} value={key}>
                                {kr}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">메모 (선택사항)</Label>
                      <Textarea
                        value={stageChangeMemo}
                        onChange={(e) => setStageChangeMemo(e.target.value)}
                        placeholder="단계 변경 사유를 입력하세요..."
                        className="mt-1 bg-white"
                        rows={2}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-[#118DFF] hover:bg-[#0D6FCC]"
                        onClick={handleStageChange}
                      >
                        저장
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={() => setIsStageEditOpen(false)}
                      >
                        취소
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              <p className="text-xs text-[#6B7280] mb-4">
                이 단계는 NatureX의 실제 서비스 제공 프로세스를 나타냅니다.
              </p>

              <div className="space-y-2">
                {Object.entries(DELIVERY_STAGES).map(([key, { kr, color }]) => {
                  const isActive = selectedProject.deliveryStage === key;
                  const isPassed =
                    getStageOrder(selectedProject.deliveryStage) >
                    getStageOrder(key as DeliveryStage);

                  return (
                    <div
                      key={key}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                        isActive
                          ? 'border-[#118DFF] bg-[#118DFF]/5 shadow-sm'
                          : isPassed
                            ? 'border-green-200 bg-green-50'
                            : 'border-[#E5E7EB] bg-white'
                      }`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full flex items-center justify-center ${
                          isPassed
                            ? 'bg-green-500'
                            : isActive
                              ? 'bg-[#118DFF]'
                              : 'bg-[#E5E7EB]'
                        }`}
                      >
                        {isPassed && (
                          <CheckCircle2 className="w-2 h-2 text-white" />
                        )}
                      </div>
                      <span
                        className={`text-sm font-medium flex-1 ${
                          isActive
                            ? 'text-[#118DFF]'
                            : isPassed
                              ? 'text-green-700'
                              : 'text-[#6B7280]'
                        }`}
                      >
                        {kr}
                      </span>
                      {isActive && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#118DFF] text-white">
                          현재
                        </span>
                      )}
                      {isPassed && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-500 text-white">
                          완료
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Widget Status */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-[#6B7280] mb-3">
                위젯 구성 상태
              </h3>
              <div className="p-4 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB]">
                {getWidgetStatusBadge(selectedProject)}
                <div className="mt-2 text-xs text-[#6B7280]">
                  {selectedProject.widgetCompletion.configured}/
                  {selectedProject.widgetCompletion.total} 위젯 활성화
                </div>
                <p className="text-xs text-[#6B7280] mt-2">
                  위젯 빌더에서 고객이 볼 대시보드를 구성하세요
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Link
                href={`/admin/projects/${selectedProject.projectId}/builder`}
                className="block"
              >
                <Button className="w-full bg-[#118DFF] hover:bg-[#0D6FCC] gap-2">
                  <Settings className="w-4 h-4" />
                  위젯 빌더 열기
                </Button>
              </Link>
              <Button
                variant="outline"
                className="w-full gap-2 bg-transparent"
                onClick={() => handleImpersonateCustomer(selectedProject)}
              >
                <Eye className="w-4 h-4" />
                고객 화면 미리보기
              </Button>
              <Button
                variant="outline"
                className="w-full gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                onClick={() => handleDelete(selectedProject.projectId)}
              >
                <Trash2 className="w-4 h-4" />
                프로젝트 삭제
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
