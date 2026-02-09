'use client';

import type React from 'react';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  ArrowLeft,
  FolderKanban,
  CheckCircle2,
  Leaf,
  TrendingUp,
  TreePine,
  Search,
  Map,
  Download,
  BarChart3,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  createProject,
  getOrganizations,
  type Organization,
  type ProjectTheme,
  type ResultConfig,
} from '@/lib/data-service';

export default function NewProjectPage() {
  const router = useRouter();
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [orgSearch, setOrgSearch] = useState('');
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const [formData, setFormData] = useState({
    orgId: '',
    orgName: '',
    name: '',
    description: '',
    theme: '' as ProjectTheme | '',
    location: '',
  });

  const [resultConfig, setResultConfig] = useState<ResultConfig>({
    map: { enabled: false, types: [] },
    downloads: { enabled: false },
    tables: { enabled: false, types: [] },
  });

  useEffect(() => {
    (async () => {
      setOrgs(await getOrganizations());
    })();
  }, []);

  const filteredOrgs = orgs.filter(
    (org) =>
      org.name.toLowerCase().includes(orgSearch.toLowerCase()) ||
      (org.industry || '').toLowerCase().includes(orgSearch.toLowerCase()),
  );

  const handleOrgSelect = (org: Organization) => {
    setFormData({ ...formData, orgId: org.orgId, orgName: org.name });
    setOrgSearch(org.name);
    setShowOrgDropdown(false);
  };

  const toggleMapType = (type: 'geojson' | 'tiles3d' | 'laz') => {
    setResultConfig((prev) => ({
      ...prev,
      map: {
        ...prev.map,
        types: prev.map.types.includes(type)
          ? prev.map.types.filter((t) => t !== type)
          : [...prev.map.types, type],
      },
    }));
  };

  const toggleTableType = (type: 'table' | 'bar' | 'line' | 'kpi') => {
    setResultConfig((prev) => ({
      ...prev,
      tables: {
        ...prev.tables,
        types: prev.tables.types.includes(type)
          ? prev.tables.types.filter((t) => t !== type)
          : [...prev.tables.types, type],
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.orgId ||
      !formData.theme ||
      !formData.name ||
      !formData.location
    )
      return;

    const projectId = formData.name
      ? `proj-${formData.name
          .toLowerCase()
          .replace(/[^a-z0-9가-힣]/g, '-')
          .slice(0, 20)}-${Date.now().toString().slice(-4)}`
      : `proj-${Date.now()}`;

    await createProject({
      projectId,
      orgId: formData.orgId,
      name: formData.name,
      theme: formData.theme as ProjectTheme,
      location: formData.location,
      description: formData.description || null,
      resultConfig,
    });

    router.push(`/admin/projects?created=${projectId}`);
  };

  const themeOptions: Array<{
    value: ProjectTheme;
    label: string;
    icon: any;
    description: string;
  }> = [
    {
      value: 'efficiency',
      label: '운영비 절감',
      icon: TrendingUp,
      description: '유지관리 효율화, 에너지 절감, 비용 최적화',
    },
    {
      value: 'asset',
      label: '자산 가치 향상',
      icon: Leaf,
      description: 'ESG 평가, 자산 가치 정량화, 포트폴리오 우선순위',
    },
    {
      value: 'biodiversity',
      label: '생물다양성 프로젝트',
      icon: TreePine,
      description: '생태복원, 서식지 분석, TNFD 대응',
    },
  ];

  const isFormValid =
    formData.orgId && formData.theme && formData.name && formData.location;

  return (
    <div className="min-h-screen bg-[#F5F7FB] p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link href="/admin/projects">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 mb-4 text-[#6B7280] hover:text-[#111827]"
            >
              <ArrowLeft className="w-4 h-4" />
              프로젝트 목록
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-[#118DFF]/10 rounded-lg">
              <FolderKanban className="w-6 h-6 text-[#118DFF]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#111827]">
                새 프로젝트 생성
              </h1>
              <p className="text-sm text-[#6B7280]">
                프로젝트 정보와 결과 제공 유형을 설정합니다.
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <form onSubmit={handleSubmit}>
              <Card className="bg-white border-[#E5E7EB] p-6 space-y-6 mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-[#111827] mb-1">
                    프로젝트 기본 정보
                  </h2>
                  <p className="text-sm text-[#6B7280]">
                    프로젝트의 기본 정보를 입력하세요.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-[#374151]"
                  >
                    프로젝트명 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="예: 서울숲 생태복원 프로젝트"
                    className="bg-white border-[#E5E7EB] h-11 placeholder:text-slate-400"
                    required
                  />
                </div>

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
                          setOrgSearch(e.target.value);
                          setShowOrgDropdown(true);
                          if (!e.target.value) {
                            setFormData({
                              ...formData,
                              orgId: '',
                              orgName: '',
                            });
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
                          <div className="p-3 text-sm text-[#6B7280]">
                            검색 결과가 없습니다
                          </div>
                        ) : (
                          filteredOrgs.map((org) => (
                            <button
                              key={org.orgId}
                              type="button"
                              onClick={() => handleOrgSelect(org)}
                              className={`w-full px-4 py-3 text-left hover:bg-[#F5F7FB] flex items-center justify-between ${
                                formData.orgId === org.orgId
                                  ? 'bg-[#118DFF]/5'
                                  : ''
                              }`}
                            >
                              <div>
                                <div className="font-medium text-[#111827]">
                                  {org.name}
                                </div>
                                <div className="text-xs text-[#6B7280]">
                                  {org.industry}
                                </div>
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

                <div className="space-y-2">
                  <Label
                    htmlFor="location"
                    className="text-sm font-medium text-[#374151]"
                  >
                    프로젝트 위치 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="예: 서울시 성동구"
                    className="bg-white border-[#E5E7EB] h-11 placeholder:text-slate-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-sm font-medium text-[#374151]"
                  >
                    설명
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="프로젝트 설명(옵션)"
                    className="bg-white border-[#E5E7EB] min-h-[90px]"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-[#374151]">
                    테마 <span className="text-red-500">*</span>
                  </Label>
                  <div className="grid md:grid-cols-3 gap-3">
                    {themeOptions.map((t) => (
                      <button
                        type="button"
                        key={t.value}
                        onClick={() =>
                          setFormData({ ...formData, theme: t.value })
                        }
                        className={`p-4 rounded-lg border text-left ${
                          formData.theme === t.value
                            ? 'border-[#118DFF] bg-[#118DFF]/5'
                            : 'border-[#E5E7EB] bg-white'
                        }`}
                      >
                        <div className="font-semibold text-[#111827]">
                          {t.label}
                        </div>
                        <div className="text-xs text-[#6B7280] mt-1">
                          {t.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={!isFormValid}
                  className="bg-[#118DFF] hover:bg-[#0D6FCC] text-white"
                >
                  생성
                </Button>
              </Card>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white border-[#E5E7EB] p-6 space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-[#111827]">
                  결과 제공 설정
                </h2>
                <p className="text-sm text-[#6B7280]">
                  프로젝트 납품 유형을 선택하세요.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 rounded-lg border border-[#E5E7EB]">
                  <Checkbox
                    id="rc-map"
                    checked={resultConfig.map.enabled}
                    onCheckedChange={(v) =>
                      setResultConfig((p) => ({
                        ...p,
                        map: { ...p.map, enabled: !!v },
                      }))
                    }
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-medium">
                      <Map className="w-4 h-4" /> 지도
                    </div>
                    <div className="text-xs text-[#6B7280] mt-1">
                      GeoJSON / 3D Tiles / LAZ
                    </div>
                    {resultConfig.map.enabled && (
                      <div className="mt-3 space-y-2">
                        {(['geojson', 'tiles3d', 'laz'] as const).map((t) => (
                          <label
                            key={t}
                            className="flex items-center gap-2 text-sm"
                          >
                            <Checkbox
                              checked={resultConfig.map.types.includes(t)}
                              onCheckedChange={() => toggleMapType(t)}
                            />
                            {t}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg border border-[#E5E7EB]">
                  <Checkbox
                    id="rc-download"
                    checked={resultConfig.downloads.enabled}
                    onCheckedChange={(v) =>
                      setResultConfig((p) => ({
                        ...p,
                        downloads: { enabled: !!v },
                      }))
                    }
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-medium">
                      <Download className="w-4 h-4" /> 파일
                    </div>
                    <div className="text-xs text-[#6B7280] mt-1">
                      HWP/XLSX/PDF
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg border border-[#E5E7EB]">
                  <Checkbox
                    id="rc-table"
                    checked={resultConfig.tables.enabled}
                    onCheckedChange={(v) =>
                      setResultConfig((p) => ({
                        ...p,
                        tables: { ...p.tables, enabled: !!v },
                      }))
                    }
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-medium">
                      <BarChart3 className="w-4 h-4" /> 시각화
                    </div>
                    <div className="text-xs text-[#6B7280] mt-1">
                      table/bar/line/kpi
                    </div>
                    {resultConfig.tables.enabled && (
                      <div className="mt-3 space-y-2">
                        {(['table', 'bar', 'line', 'kpi'] as const).map((t) => (
                          <label
                            key={t}
                            className="flex items-center gap-2 text-sm"
                          >
                            <Checkbox
                              checked={resultConfig.tables.types.includes(t)}
                              onCheckedChange={() => toggleTableType(t)}
                            />
                            {t}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
