"use client"

import type React from "react"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  createOrganization,
  deleteOrganization,
  getOrganizations,
  getProjects,
  themeLabels,
  DELIVERY_STAGES,
  updateOrganization,
  type DeliveryStage,
  type Organization,
  type Project,
} from "@/lib/data-service"

export default function AdminOrgsPage() {
  const router = useRouter()
  const [orgs, setOrgs] = useState<Organization[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  const [searchQuery, setSearchQuery] = useState("")

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null)
  const [formData, setFormData] = useState({
    orgId: "",
    name: "",
    industry: "",
    contact: "",
    status: "onboarding" as Organization["status"],
  })

  const loadData = async () => {
    setLoading(true)
    try {
      const [o, p] = await Promise.all([getOrganizations(), getProjects()])
      setOrgs(o)
      setProjects(p)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredOrgs = useMemo(() => {
    if (!searchQuery) return orgs
    const q = searchQuery.toLowerCase()
    return orgs.filter(
      (o) => o.name.toLowerCase().includes(q) || o.orgId.toLowerCase().includes(q) || (o.contact || "").toLowerCase().includes(q),
    )
  }, [orgs, searchQuery])

  const getProjectsByOrg = (orgId: string) => projects.filter((p) => p.orgId === orgId)

  const getStageOrder = (stage: DeliveryStage): number => {
    const order: Record<DeliveryStage, number> = {
      pending: 1,
      analyzing: 2,
      delivering: 3,
      executing: 4,
      completed: 5,
    }
    return order[stage] || 0
  }

  const getOrgSummary = (orgId: string) => {
    const ps = getProjectsByOrg(orgId)
    if (ps.length === 0) return { total: 0, topStage: "pending" as DeliveryStage }
    const top = ps
      .map((p) => p.deliveryStage)
      .filter((s): s is DeliveryStage => s !== "paused")
      .sort((a, b) => getStageOrder(b) - getStageOrder(a))[0]
    return { total: ps.length, topStage: top || "pending" }
  }

  const openCreate = () => {
    setEditingOrg(null)
    setFormData({ orgId: "", name: "", industry: "", contact: "", status: "onboarding" })
    setIsDialogOpen(true)
  }

  const openEdit = (org: Organization) => {
    setEditingOrg(org)
    setFormData({
      orgId: org.orgId,
      name: org.name,
      industry: org.industry,
      contact: org.contact,
      status: org.status,
    })
    setIsDialogOpen(true)
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.orgId || !formData.name) {
      alert("orgId/name은 필수입니다")
      return
    }

    if (editingOrg) {
      await updateOrganization(editingOrg.orgId, {
        name: formData.name,
        industry: formData.industry,
        contact: formData.contact,
        status: formData.status,
      })
    } else {
      await createOrganization({
        orgId: formData.orgId,
        name: formData.name,
        industry: formData.industry,
        contact: formData.contact,
        status: formData.status,
      })
    }

    setIsDialogOpen(false)
    await loadData()
  }

  const remove = async (orgId: string) => {
    const count = getProjectsByOrg(orgId).length
    if (count > 0) {
      alert(`이 조직에 ${count}개의 프로젝트가 있어 삭제할 수 없습니다.`)
      return
    }
    if (!confirm("정말 삭제하시겠습니까?")) return
    await deleteOrganization(orgId)
    await loadData()
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#111827] mb-2">조직 관리</h1>
          <p className="text-[#6B7280]">고객 조직을 생성하고 관리합니다.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/orgs/new">
            <Button variant="outline">새 조직(폼)</Button>
          </Link>
          <Button className="bg-[#118DFF] hover:bg-[#0D6FCC] text-white" onClick={openCreate}>
            빠른 생성
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <Input
          placeholder="조직 검색 (이름/orgId/이메일)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-white"
        />
      </div>

      {loading ? (
        <div className="text-sm text-[#6B7280]">Loading...</div>
      ) : (
        <div className="grid gap-3">
          {filteredOrgs.map((org) => {
            const summary = getOrgSummary(org.orgId)
            return (
              <Card key={org.orgId} className="p-5 bg-white border-[#E5E7EB]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold text-[#111827]">{org.name}</div>
                    <div className="text-xs text-[#6B7280] mt-1">
                      {org.orgId} · {org.industry || "-"} · {org.contact || "-"}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant="secondary">status={org.status}</Badge>
                      <Badge variant="secondary">projects={summary.total}</Badge>
                      <Badge variant="secondary">topStage={DELIVERY_STAGES[summary.topStage].kr}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.push(`/admin/projects?orgId=${org.orgId}`)}>
                      프로젝트
                    </Button>
                    <Button variant="outline" onClick={() => openEdit(org)}>
                      수정
                    </Button>
                    <Button variant="outline" onClick={() => remove(org.orgId)}>
                      삭제
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-50">
          <Card className="w-full max-w-xl p-6 bg-white">
            <div className="text-lg font-semibold mb-4">{editingOrg ? "조직 수정" : "조직 생성"}</div>
            <form onSubmit={submit} className="space-y-3">
              <Input
                placeholder="orgId (예: seoul-city)"
                value={formData.orgId}
                onChange={(e) => setFormData({ ...formData, orgId: e.target.value })}
                disabled={!!editingOrg}
              />
              <Input
                placeholder="조직명"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                placeholder="업종"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              />
              <Input
                placeholder="담당자 이메일"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              />
              <Input
                placeholder="status (active|onboarding|paused|archived)"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              />
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  취소
                </Button>
                <Button type="submit" className="bg-[#118DFF] hover:bg-[#0D6FCC] text-white">
                  저장
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}
