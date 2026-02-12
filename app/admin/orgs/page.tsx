'use client';

import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
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
  CheckCircle2,
  ExternalLink,
  FolderKanban,
  MoreVertical,
  Plus,
  Search,
  X,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  type Organization,
  OrganizationSize,
  OrganizationStatus,
  OrganizationType,
  ProjectStatus,
  ProjectTheme,
} from '@/lib/data-type';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

export default function AdminOrgsPage() {
  const router = useRouter();
  const [selectedOrgForDetail, setSelectedOrgForDetail] =
    useState<Organization | null>(null);
  const [selectedOrgForEdit, setSelectedOrgForEdit] =
    useState<Organization | null>(null);
  const [isDoingLoadData, setIsDoingLoadData] = useState<boolean>(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [organizationStatusFilter, setOrganizationStatusFilter] = useState<
    keyof typeof OrganizationStatus | 'ALL'
  >('ALL');
  const [projectStatusFilter, setProjectStatusFilter] = useState<
    ProjectStatus[]
  >([]);
  const [sortBy, setSortBy] = useState('recent');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const [formData, setFormData] = useState<{
    name: string | null;
    type: OrganizationType;
    size: OrganizationSize;
    contact: string | null;
    website: string | null;
    status: OrganizationStatus;
  }>({
    name: null,
    type: OrganizationType.PUBLIC,
    size: OrganizationSize.SOLO,
    contact: null,
    website: null,
    status: OrganizationStatus.ACTIVE,
  });

  type StatsType = {
    organizations: Organization[];
    projectCountsGroupByThemeAndStatus: {
      organizationId: string;
      total: number;
      value: {
        theme: ProjectTheme;
        status: ProjectStatus;
        count: number;
      }[];
    }[];
  };

  const [stats, setStats] = useState<StatsType>({
    organizations: [],
    projectCountsGroupByThemeAndStatus: [],
  });

  async function loadData(
    organizationId?: string | string[] | null,
    exclude: boolean = false,
  ) {
    try {
      const q1 = organizationId
        ? (Array.isArray(organizationId) ? organizationId : [organizationId])
            .map((e) => `organizationId=${e}`)
            .join('&')
        : '';
      const organizations = (await (
        await fetch(
          new URL(
            `organizations?exclude=${exclude}${q1.length > 0 ? '&' : ''}${q1}`,
            process.env.NEXT_PUBLIC_NATUREX_BACKEND,
          ),
          {
            method: 'GET',
            credentials: 'include',
          },
        )
      ).json()) as Organization[];

      const q2 = organizations.map((e) => `organizationId=${e.id}`).join('&');
      const projectCountsGroupByThemeAndStatus = (await (
        await fetch(
          new URL(
            `projects/countGroupByThemeAndStatus?${q2}`,
            process.env.NEXT_PUBLIC_NATUREX_BACKEND,
          ),
          {
            method: 'GET',
            credentials: 'include',
          },
        )
      ).json()) as {
        organizationId: string;
        total: number;
        value: {
          theme: ProjectTheme;
          status: ProjectStatus;
          count: number;
        }[];
      }[];

      return {
        organizations,
        projectCountsGroupByThemeAndStatus,
      };
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    setIsDoingLoadData(true);
    loadData().then((r) => {
      if (!r) return;
      setStats(r);
    });
    setIsDoingLoadData(false);
  }, []);

  // Filtered and sorted organizations
  const filteredOrganizations = useMemo(() => {
    let filtered = stats.organizations;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (org) =>
          org.name.toLowerCase().includes(query) ||
          org.id.toLowerCase().includes(query) ||
          org.contact?.toLowerCase().includes(query),
      );
    }

    // Status filter
    if (organizationStatusFilter !== 'ALL') {
      filtered = filtered.filter(
        (org) => org.status === OrganizationStatus[organizationStatusFilter],
      );
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'recent') {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else if (sortBy === 'projects') {
        return (
          stats.projectCountsGroupByThemeAndStatus.find(
            (e) => e.organizationId == b.id,
          )!.total -
          stats.projectCountsGroupByThemeAndStatus.find(
            (e) => e.organizationId == a.id,
          )!.total
        );
      }
      return 0;
    });

    return filtered;
  }, [
    stats,
    searchQuery,
    organizationStatusFilter,
    projectStatusFilter,
    sortBy,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredOrganizations.length / itemsPerPage);
  const paginatedOrgs = filteredOrganizations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleDelete = (organizationId: string) => {
    const projectCount = stats.projectCountsGroupByThemeAndStatus.find(
      (e) => e.organizationId === organizationId,
    )!.total;
    if (projectCount > 0) {
      alert(
        `이 조직에 ${projectCount}개의 프로젝트가 있어 삭제할 수 없습니다.`,
      );
      return;
    }
    if (confirm('정말 삭제하시겠습니까?')) {
      setIsDoingLoadData(true);
      fetch(
        new URL(
          `organizations/${organizationId}`,
          process.env.NEXT_PUBLIC_NATUREX_BACKEND,
        ),
        {
          method: 'DELETE',
          credentials: 'include',
        },
      )
        .then((_) => {
          return loadData();
        })
        .then((r) => {
          if (!r) return;
          setStats(r);
        })
        .finally(() => {
          setIsDoingLoadData(false);
        });
      unselectOrg(organizationId);
    }
  };

  const handleEdit = (organizationId: string) => {
    setIsDoingLoadData(true);
    fetch(
      new URL(
        `organizations/${organizationId}`,
        process.env.NEXT_PUBLIC_NATUREX_BACKEND,
      ),
      {
        method: 'PATCH',
        credentials: 'include',
        body: JSON.stringify(formData),
      },
    )
      .then((_) => {
        return loadData();
      })
      .then((r) => {
        if (!r) return;
        setStats(r);
      })
      .finally(() => {
        setIsDoingLoadData(false);
      });
    unselectOrg(organizationId);
  };

  function unselectOrg(organizationId: string) {
    if (organizationId == selectedOrgForDetail?.id) {
      setSelectedOrgForDetail(null);
    }
    if (organizationId == selectedOrgForEdit?.id) {
      setSelectedOrgForEdit(null);
    }
  }

  const toggleProjectStatusFilter = (status: ProjectStatus) => {
    setProjectStatusFilter((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status],
    );
  };

  const getStatusBadge = (status: Organization['status']) => {
    const configs = {
      ACTIVE: { label: 'Active', className: 'bg-green-100 text-green-800' },
      INACTIVE: {
        label: 'Inactive',
        className: 'bg-yellow-100 text-yellow-800',
      },
      ARCHIVED: { label: 'Archived', className: 'bg-gray-100 text-gray-800' },
    } satisfies {
      [key in keyof typeof OrganizationStatus]: {
        label: string;
        className: string;
      };
    };
    const config = configs[status] || {
      label: status,
      className: 'bg-gray-100 text-gray-800',
    };
    return (
      <Badge variant="secondary" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#F5F7FB]">
      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col ${selectedOrgForDetail || selectedOrgForEdit ? 'mr-96' : ''}`}
      >
        {/* Top Control Bar */}
        <div className="bg-white border-b border-[#E5E7EB] px-8 py-4">
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="조직명, Org ID, 담당자 검색..."
                className="pl-10 bg-white border-[#E5E7EB]"
              />
            </div>

            {/* Status Filter */}
            <Select
              value={organizationStatusFilter}
              onValueChange={(e) =>
                setOrganizationStatusFilter(
                  e as keyof typeof OrganizationStatus | 'ALL',
                )
              }
            >
              <SelectTrigger className="w-40 bg-white border-[#E5E7EB]">
                <SelectValue placeholder="상태" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="ALL">All</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-white border-[#E5E7EB]">
                  서비스 제공 상태
                  {projectStatusFilter.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-2 bg-[#118DFF] text-white"
                    >
                      {projectStatusFilter.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white">
                {Object.values(ProjectStatus).map((e) => (
                  <DropdownMenuItem
                    key={e}
                    onClick={() => toggleProjectStatusFilter(e)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      {projectStatusFilter.includes(e) && (
                        <CheckCircle2 className="w-4 h-4 text-[#118DFF]" />
                      )}
                      <span>{e}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-44 bg-white border-[#E5E7EB]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="recent">최근 생성</SelectItem>
                <SelectItem value="projects">프로젝트 수 많은 순</SelectItem>
              </SelectContent>
            </Select>

            {/* Create Button */}
            <Link href="/admin/orgs/new">
              <Button className="bg-[#118DFF] hover:bg-[#0D6FCC] gap-2 ml-auto">
                <Plus className="w-4 h-4" />
                조직 생성
              </Button>
            </Link>
          </div>

          {/* Active Filters Display */}
          {(searchQuery ||
            organizationStatusFilter !== 'ALL' ||
            projectStatusFilter.length > 0) && (
            <div className="flex items-center gap-2 mt-3">
              <span className="text-sm text-[#6B7280]">활성 필터:</span>
              {searchQuery && (
                <Badge
                  variant="secondary"
                  className="bg-[#F5F7FB] text-[#111827] gap-1"
                >
                  검색: {searchQuery}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => setSearchQuery('')}
                  />
                </Badge>
              )}
              {organizationStatusFilter !== 'ALL' && (
                <Badge
                  variant="secondary"
                  className="bg-[#F5F7FB] text-[#111827] gap-1"
                >
                  상태: {organizationStatusFilter}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => setOrganizationStatusFilter('ALL')}
                  />
                </Badge>
              )}
              {projectStatusFilter.map((projectStatus) => (
                <Badge
                  key={projectStatus}
                  variant="secondary"
                  className="bg-[#F5F7FB] text-[#111827] gap-1"
                >
                  {projectStatus}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => toggleProjectStatusFilter(projectStatus)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto px-8 py-6">
          <div className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#F5F7FB] border-b border-[#E5E7EB]">
                <tr>
                  {['조직명', '프로젝트 수', '상태', 'ACTIONS'].map(
                    (columnName) => (
                      <th
                        key={columnName}
                        className="px-6 py-3 text-center text-xs font-medium text-[#6B7280] uppercase tracking-wider"
                      >
                        {columnName}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              {isDoingLoadData ? (
                <tbody>
                  <tr>
                    <td colSpan={4}>로딩 중...</td>
                  </tr>
                </tbody>
              ) : paginatedOrgs.length === 0 ? (
                <tbody>
                  <tr>
                    <td
                      colSpan={4}
                      className="py-12 text-center text-[#6B7280]"
                    >
                      {searchQuery ||
                      organizationStatusFilter !== 'ALL' ||
                      projectStatusFilter.length > 0
                        ? '검색 결과가 없습니다.'
                        : '등록된 조직이 없습니다.'}
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody className="divide-y divide-[#E5E7EB]">
                  {paginatedOrgs.map((org) => {
                    const projectCountGroupByThemeAndStatus =
                      stats.projectCountsGroupByThemeAndStatus.find(
                        (e) => e.organizationId == org.id,
                      )!;
                    return (
                      <tr
                        key={org.id}
                        onClick={() => {
                          setSelectedOrgForDetail(null);
                          setSelectedOrgForDetail(org);
                        }}
                        className="hover:bg-[#F5F7FB] cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col justify-center items-center">
                            <div className="text-sm font-medium text-[#111827]">
                              {org.name}
                            </div>
                            <div className="text-sm text-[#6B7280]">
                              {org.type}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex justify-center items-center gap-2">
                            <FolderKanban className="w-4 h-4 text-[#6B7280]" />
                            <span className="text-sm font-medium text-[#111827]">
                              {projectCountGroupByThemeAndStatus.total}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex justify-center items-center">
                            {getStatusBadge(org.status)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-center items-center">
                            <DropdownMenu>
                              <DropdownMenuTrigger
                                asChild
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="bg-white"
                              >
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedOrgForDetail(null);
                                    setSelectedOrgForEdit(org);
                                  }}
                                >
                                  수정
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(org.id);
                                  }}
                                  className="text-red-600"
                                >
                                  삭제
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              )}
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-[#6B7280]">
                총 {filteredOrganizations.length}개 중{' '}
                {(currentPage - 1) * itemsPerPage + 1}-
                {Math.min(
                  currentPage * itemsPerPage,
                  filteredOrganizations.length,
                )}
                개 표시
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  이전
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={
                        page === currentPage
                          ? 'bg-[#118DFF] hover:bg-[#0D6FCC]'
                          : ''
                      }
                    >
                      {page}
                    </Button>
                  ),
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  다음
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail Panel */}
      {selectedOrgForDetail && (
        <div className="fixed right-0 top-16 bottom-0 w-96 bg-white border-l border-[#E5E7EB] shadow-lg overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#111827]">조직 상세</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedOrgForDetail(null)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="p-6 space-y-6">
            {/* Organization Summary */}
            <div>
              <h3 className="text-sm font-medium text-[#6B7280] mb-3">
                조직 정보
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-[#6B7280] mb-1">조직명</div>
                  <div className="text-sm font-medium text-[#111827]">
                    {selectedOrgForDetail.name}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#6B7280] mb-1">Org ID</div>
                  <code className="text-xs px-2 py-1 bg-[#F5F7FB] text-[#6B7280] rounded font-mono">
                    {selectedOrgForDetail.id}
                  </code>
                </div>
                <div>
                  <div className="text-xs text-[#6B7280] mb-1">상태</div>
                  {getStatusBadge(selectedOrgForDetail.status)}
                </div>
                <div>
                  <div className="text-xs text-[#6B7280] mb-1">생성일</div>
                  <div className="text-sm text-[#111827]">
                    {new Date(
                      selectedOrgForDetail.createdAt,
                    ).toLocaleDateString('ko-KR')}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#6B7280] mb-1">담당자</div>
                  <div className="text-sm text-[#111827]">
                    {selectedOrgForDetail.contact ?? '없음'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#6B7280] mb-1">웹사이트</div>
                  <div className="text-sm text-[#111827]">
                    {selectedOrgForDetail.website ?? '없음'}
                  </div>
                </div>
              </div>
            </div>

            {/* Active Services & Projects */}
            <div>
              <h3 className="text-sm font-medium text-[#6B7280] mb-3">
                프로젝트
              </h3>
              <div className="space-y-2">
                {Object.values(ProjectTheme).map((projectTheme) => {
                  const count = stats.projectCountsGroupByThemeAndStatus
                    .find((e) => e.organizationId == selectedOrgForDetail.id)!
                    .value.filter((e) => e.theme == projectTheme)
                    .reduce((s, c) => s + c.count, 0);
                  return (
                    <div
                      key={projectTheme}
                      className="flex items-center justify-between p-3 bg-[#F5F7FB] rounded-lg"
                    >
                      <span className="text-sm text-[#111827]">
                        {projectTheme}
                      </span>
                      <Badge
                        variant="secondary"
                        className={
                          count > 0
                            ? 'bg-[#118DFF] text-white'
                            : 'bg-white text-[#6B7280]'
                        }
                      >
                        {count}건
                      </Badge>
                    </div>
                  );
                })}
              </div>
              <Button
                variant="outline"
                className="w-full mt-3 bg-transparent"
                onClick={() =>
                  router.push(`/admin/projects?org=${selectedOrgForDetail.id}`)
                }
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                프로젝트 관리로 이동
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Panel */}
      {selectedOrgForEdit && (
        <div className="fixed right-0 top-16 bottom-0 w-96 bg-white border-l border-[#E5E7EB] shadow-lg overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#111827]">조직 수정</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedOrgForEdit(null)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="p-6 space-y-6">
            {/* Organization Summary */}
            <div>
              <h3 className="text-sm font-medium text-[#6B7280] mb-3">
                조직 정보
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-[#6B7280] mb-1">조직명</div>
                  <Input
                    value={selectedOrgForEdit.name}
                    onChange={(e) =>
                      setFormData((prevState) => {
                        return {
                          ...prevState,
                          name: e.target.value,
                        };
                      })
                    }
                    className="pl-10 bg-white border-[#E5E7EB]"
                  />
                </div>
                <div>
                  <div className="text-xs text-[#6B7280] mb-1">상태</div>
                  <div className="space-y-3">
                    {Object.values(OrganizationStatus).map((status) => (
                      <div
                        key={status}
                        className="flex items-start gap-3 p-4 rounded-lg border border-[#E5E7EB] hover:border-[#118DFF] transition-colors"
                        onClick={() => {
                          setFormData((prevState) => {
                            return {
                              ...prevState,
                              status,
                            };
                          });
                        }}
                      >
                        {status}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#6B7280] mb-1">업종</div>
                  <div className="space-y-3">
                    {Object.values(OrganizationType).map((type) => (
                      <div
                        key={type}
                        className="flex items-start gap-3 p-4 rounded-lg border border-[#E5E7EB] hover:border-[#118DFF] transition-colors"
                        onClick={() => {
                          setFormData((prevState) => {
                            return {
                              ...prevState,
                              type,
                            };
                          });
                        }}
                      >
                        {type}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#6B7280] mb-1">규모</div>
                  <div className="space-y-3">
                    {Object.values(OrganizationSize).map((size) => (
                      <div
                        key={size}
                        className="flex items-start gap-3 p-4 rounded-lg border border-[#E5E7EB] hover:border-[#118DFF] transition-colors"
                        onClick={() => {
                          setFormData((prevState) => {
                            return {
                              ...prevState,
                              size,
                            };
                          });
                        }}
                      >
                        {status}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#6B7280] mb-1">담당자</div>
                  <div className="text-sm text-[#111827]">
                    <Input
                      value={selectedOrgForEdit.website ?? undefined}
                      onChange={(e) =>
                        setFormData((prevState) => {
                          return {
                            ...prevState,
                            contact: e.target.value,
                          };
                        })
                      }
                      className="pl-10 bg-white border-[#E5E7EB]"
                    />
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#6B7280] mb-1">웹사이트</div>
                  <div className="text-sm text-[#111827]">
                    <Input
                      value={selectedOrgForEdit.website ?? undefined}
                      onChange={(e) =>
                        setFormData((prevState) => {
                          return {
                            ...prevState,
                            website: e.target.value,
                          };
                        })
                      }
                      className="pl-10 bg-white border-[#E5E7EB]"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="bg-[#118DFF] hover:bg-[#0D6FCC] text-white"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleEdit(selectedOrgForEdit.id);
                  }}
                >
                  저장
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
