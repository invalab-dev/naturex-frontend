"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  deleteProject,
  getOrganizations,
  getProjects,
  getUsers,
  updateProjectDeliveryStage,
  DELIVERY_STAGES,
  themeLabels,
  type DeliveryStage,
  type Project,
} from "@/lib/data-service";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { ResultDeliveryModal } from "@/components/result-delivery-modal";

export default function AdminProjectsPage() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [orgs, setOrgs] = useState<Array<{ orgId: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isStageEditOpen, setIsStageEditOpen] = useState(false);
  const [stageChangeMemo, setStageChangeMemo] = useState("");
  const [newStage, setNewStage] = useState<DeliveryStage>("pending");

  const [filterOrg, setFilterOrg] = useState<string>("all");
  const [filterTheme, setFilterTheme] = useState<string>("all");
  const [filterStage, setFilterStage] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [resultModalProject, setResultModalProject] = useState<Project | null>(
    null,
  );

  const load = async () => {
    setLoading(true);
    try {
      const [p, o] = await Promise.all([getProjects(), getOrganizations()]);
      setProjects(p);
      setOrgs(o.map((x) => ({ orgId: x.orgId, name: x.name })));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    let out = [...projects];

    if (filterOrg !== "all") out = out.filter((p) => p.orgId === filterOrg);
    if (filterTheme !== "all") out = out.filter((p) => p.theme === filterTheme);
    if (filterStage !== "all")
      out = out.filter((p) => p.deliveryStage === filterStage);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      out = out.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q),
      );
    }

    return out;
  }, [projects, filterOrg, filterTheme, filterStage, searchQuery]);

  const getOrgName = (orgId: string) =>
    orgs.find((o) => o.orgId === orgId)?.name || orgId;

  const remove = async (projectId: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await deleteProject(projectId);
    await load();
    setSelectedProject(null);
  };

  const submitStageChange = async () => {
    if (!selectedProject) return;
    await updateProjectDeliveryStage(
      selectedProject.projectId,
      newStage,
      stageChangeMemo,
    );
    await load();
    setIsStageEditOpen(false);
    setStageChangeMemo("");
    toast({
      title: "단계 변경됨",
      description: `${selectedProject.name} → ${DELIVERY_STAGES[newStage].kr}`,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#111827] mb-2">
            프로젝트 관리
          </h1>
          <p className="text-[#6B7280]">
            분석 결과 납품 및 고객 화면을 관리합니다
          </p>
        </div>
        <Link href="/admin/projects/new">
          <Button className="bg-[#118DFF] hover:bg-[#0D6FCC] text-white">
            프로젝트 생성
          </Button>
        </Link>
      </div>

      <Card className="p-4 bg-white border-[#E5E7EB] mb-6">
        <div className="grid md:grid-cols-5 gap-4">
          <div className="space-y-2">
            <Label className="text-sm">조직</Label>
            <Select value={filterOrg} onValueChange={setFilterOrg}>
              <SelectTrigger className="border-[#E5E7EB]">
                <SelectValue placeholder="조직" />
              </SelectTrigger>
              <SelectContent className="bg-white border-[#E5E7EB]">
                <SelectItem value="all">전체</SelectItem>
                {orgs.map((o) => (
                  <SelectItem key={o.orgId} value={o.orgId}>
                    {o.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm">테마</Label>
            <Select value={filterTheme} onValueChange={setFilterTheme}>
              <SelectTrigger className="border-[#E5E7EB]">
                <SelectValue placeholder="테마" />
              </SelectTrigger>
              <SelectContent className="bg-white border-[#E5E7EB]">
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="efficiency">
                  {themeLabels.efficiency}
                </SelectItem>
                <SelectItem value="asset">{themeLabels.asset}</SelectItem>
                <SelectItem value="biodiversity">
                  {themeLabels.biodiversity}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm">단계</Label>
            <Select value={filterStage} onValueChange={setFilterStage}>
              <SelectTrigger className="border-[#E5E7EB]">
                <SelectValue placeholder="단계" />
              </SelectTrigger>
              <SelectContent className="bg-white border-[#E5E7EB]">
                <SelectItem value="all">전체</SelectItem>
                {Object.entries(DELIVERY_STAGES).map(([k, v]) => (
                  <SelectItem key={k} value={k}>
                    {v.kr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label className="text-sm">검색</Label>
            <Input
              placeholder="프로젝트명 또는 위치"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white"
            />
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="text-sm text-[#6B7280]">Loading...</div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((p) => (
            <Card key={p.projectId} className="p-5 bg-white border-[#E5E7EB]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold text-[#111827]">{p.name}</div>
                  <div className="text-xs text-[#6B7280] mt-1">
                    {getOrgName(p.orgId)} · {themeLabels[p.theme]} ·{" "}
                    {DELIVERY_STAGES[p.deliveryStage as DeliveryStage]?.kr ??
                      p.deliveryStage}
                  </div>
                  <div className="text-xs text-[#6B7280] mt-1">
                    {p.location}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setResultModalProject(p);
                      setIsResultModalOpen(true);
                    }}
                  >
                    결과 납품
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedProject(p);
                      setNewStage(
                        (p.deliveryStage as DeliveryStage) || "pending",
                      );
                      setIsStageEditOpen(true);
                    }}
                  >
                    단계 변경
                  </Button>
                  <Button variant="outline" onClick={() => remove(p.projectId)}>
                    삭제
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          {filtered.length === 0 && (
            <Card className="p-8 bg-white border-[#E5E7EB] text-center text-sm text-[#6B7280]">
              프로젝트가 없습니다.
            </Card>
          )}
        </div>
      )}

      {isStageEditOpen && selectedProject && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-50">
          <Card className="w-full max-w-xl p-6 bg-white space-y-4">
            <div className="text-lg font-semibold">
              단계 변경: {selectedProject.name}
            </div>
            <div className="space-y-2">
              <Label>새 단계</Label>
              <Select
                value={newStage}
                onValueChange={(v) => setNewStage(v as DeliveryStage)}
              >
                <SelectTrigger className="border-[#E5E7EB]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-[#E5E7EB]">
                  {Object.entries(DELIVERY_STAGES).map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {v.kr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>메모(선택)</Label>
              <Textarea
                value={stageChangeMemo}
                onChange={(e) => setStageChangeMemo(e.target.value)}
                className="border-[#E5E7EB]"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsStageEditOpen(false)}
              >
                취소
              </Button>
              <Button
                className="bg-[#118DFF] hover:bg-[#0D6FCC] text-white"
                onClick={submitStageChange}
              >
                저장
              </Button>
            </div>
          </Card>
        </div>
      )}

      <ResultDeliveryModal
        project={resultModalProject}
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
        isAdmin
      />
    </div>
  );
}
