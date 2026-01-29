'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, FolderKanban, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  getOrganizations,
  saveProject,
  type Project,
} from '@/lib/data-service';

export default function NewProjectPage() {
  const router = useRouter();
  const [orgs, setOrgs] = useState<Array<{ orgId: string; name: string }>>([]);
  const [formData, setFormData] = useState({
    orgId: '',
    name: '',
    description: '',
    theme: '' as 'efficiency' | 'asset' | 'biodiversity' | '',
    location: '',
    status: 'intake' as Project['status'],
  });

  useEffect(() => {
    setOrgs(getOrganizations());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.orgId || !formData.theme) {
      alert('조직과 서비스 테마를 선택해주세요.');
      return;
    }

    const project: Project = {
      projectId: `proj-${Date.now()}`,
      name: formData.name,
      orgId: formData.orgId,
      theme: formData.theme,
      location: formData.location,
      status: formData.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveProject(project);
    // Auto-redirect to Widget Builder
    router.push(`/admin/projects/${project.projectId}/builder`);
  };

  const themeOptions = [
    {
      value: 'efficiency',
      label: '운영비 절감',
      description: '탄소배출권, 에너지 절감, 운영 효율화',
      examples: '탄소배출권 판매, 냉난방비 절감, 유지관리 효율화',
    },
    {
      value: 'asset',
      label: '자산 가치 향상',
      description: 'ESG 평가, 부동산 가치, 브랜드 이미지',
      examples: 'ESG 등급 상승, 부동산 가치 증대, 기업 이미지 개선',
    },
    {
      value: 'biodiversity',
      label: '생물다양성 프로젝트',
      description: '생태계 복원, 생물종 보전, NbS',
      examples: '서식지 복원, 종 다양성 증진, 자연기반해법 적용',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center p-8">
      <Card className="w-full max-w-3xl bg-white border-[#E5E7EB] shadow-lg">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <Link href="/admin/projects">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                돌아가기
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-[#118DFF]/10 rounded-lg">
              <FolderKanban className="w-6 h-6 text-[#118DFF]" />
            </div>
            <h1 className="text-3xl font-bold text-[#111827]">
              새 프로젝트 생성
            </h1>
          </div>
          <p className="text-[#6B7280] mb-8">
            조직에 NatureX 서비스를 제공하기 위한 프로젝트를 생성합니다.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* STEP 1. 조직 선택 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#E5E7EB]">
                <div className="w-8 h-8 rounded-full bg-[#118DFF] text-white flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <h2 className="text-lg font-semibold text-[#111827]">
                  조직 선택
                </h2>
                <span className="text-sm text-red-500 ml-auto">필수</span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="orgId" className="text-sm font-medium">
                  서비스를 제공할 조직을 선택하세요
                </Label>
                <Select
                  value={formData.orgId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, orgId: value })
                  }
                >
                  <SelectTrigger className="bg-white border-[#E5E7EB] h-12">
                    <SelectValue placeholder="조직을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {orgs.map((org) => (
                      <SelectItem key={org.orgId} value={org.orgId}>
                        {org.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2 text-sm text-[#6B7280] mt-2">
                  <span>조직이 없으신가요?</span>
                  <Link
                    href="/admin/orgs/new"
                    className="text-[#118DFF] hover:underline font-medium"
                  >
                    새 조직 생성 <ChevronRight className="w-3 h-3 inline" />
                  </Link>
                </div>
              </div>
            </div>

            {/* STEP 2. 프로젝트 기본 정보 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#E5E7EB]">
                <div className="w-8 h-8 rounded-full bg-[#118DFF] text-white flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <h2 className="text-lg font-semibold text-[#111827]">
                  프로젝트 기본 정보
                </h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    프로젝트명 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="예: 서울숲 생태복원 프로젝트"
                    required
                    className="bg-white border-[#E5E7EB]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-medium">
                    위치 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="예: 서울시 성동구"
                    required
                    className="bg-white border-[#E5E7EB]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    설명 (선택)
                  </Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="프로젝트에 대한 간단한 설명"
                    className="bg-white border-[#E5E7EB]"
                  />
                </div>
              </div>
            </div>

            {/* STEP 3. 서비스 테마 선택 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#E5E7EB]">
                <div className="w-8 h-8 rounded-full bg-[#118DFF] text-white flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <h2 className="text-lg font-semibold text-[#111827]">
                  서비스 테마 선택
                </h2>
                <span className="text-sm text-red-500 ml-auto">필수</span>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {themeOptions.map((option) => (
                  <Card
                    key={option.value}
                    onClick={() =>
                      setFormData({ ...formData, theme: option.value as any })
                    }
                    className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                      formData.theme === option.value
                        ? 'border-[#118DFF] border-2 bg-[#118DFF]/5'
                        : 'border-[#E5E7EB] hover:border-[#118DFF]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-[#111827]">
                        {option.label}
                      </h3>
                      {formData.theme === option.value && (
                        <div className="w-5 h-5 rounded-full bg-[#118DFF] flex items-center justify-center">
                          <ChevronRight className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-[#6B7280] mb-2">
                      {option.description}
                    </p>
                    <p className="text-xs text-[#9CA3AF]">
                      예: {option.examples}
                    </p>
                  </Card>
                ))}
              </div>
            </div>

            {/* STEP 4. 초기 상태 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#E5E7EB]">
                <div className="w-8 h-8 rounded-full bg-[#118DFF] text-white flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <h2 className="text-lg font-semibold text-[#111827]">
                  초기 상태
                </h2>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">
                  프로젝트 시작 상태
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger className="bg-white border-[#E5E7EB] h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="intake">
                      Intake (데이터 수신 대기)
                    </SelectItem>
                    <SelectItem value="analyzing">
                      Analyzing (분석 중)
                    </SelectItem>
                    <SelectItem value="draft">Draft (임시 저장)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-[#6B7280]">
                  대부분의 프로젝트는 Intake 상태로 시작합니다.
                </p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex gap-3 justify-end pt-6 border-t border-[#E5E7EB]">
              <Link href="/admin/projects">
                <Button type="button" variant="outline" size="lg">
                  취소
                </Button>
              </Link>
              <Button
                type="submit"
                size="lg"
                className="bg-[#118DFF] hover:bg-[#0D6FCC] gap-2"
                disabled={!formData.orgId || !formData.theme}
              >
                프로젝트 생성 및 위젯 구성
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
