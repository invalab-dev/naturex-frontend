"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, UsersIcon, Mail, Trash2, Shield, Building2 } from "lucide-react"
import { getUsers, getOrgs, createCustomerUser, createOrg, deleteUser, type User, type Org } from "@/lib/data-type"

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [orgs, setOrgs] = useState<Org[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [showNewOrgForm, setShowNewOrgForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    orgId: "",
    newOrgName: "",
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setUsers(getUsers())
    setOrgs(getOrgs())
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    let targetOrgId = formData.orgId
    if (showNewOrgForm && formData.newOrgName) {
      const newOrg = createOrg(formData.newOrgName)
      targetOrgId = newOrg.id
    }

    createCustomerUser(formData.email, formData.password, formData.name, targetOrgId)

    loadData()
    setIsDialogOpen(false)
    resetForm()
  }

  const handleDelete = (userId: string) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      deleteUser(userId)
      loadData()
    }
  }

  const resetForm = () => {
    setFormData({ name: "", email: "", password: "", orgId: "", newOrgName: "" })
    setShowNewOrgForm(false)
  }

  const getOrgName = (orgId?: string | null) => {
    if (!orgId) return "-"
    const org = orgs.find((o) => o.id === orgId)
    return org?.name || orgId
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#111827] mb-2">사용자 관리</h1>
          <p className="text-[#6B7280]">고객 계정을 생성하고 관리합니다.</p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-[#118DFF] hover:bg-[#0D6FCC] gap-2">
              <Plus className="w-4 h-4" />
              고객 계정 생성
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-[#E5E7EB]">
            <DialogHeader>
              <DialogTitle className="text-[#111827]">고객 계정 생성</DialogTitle>
              <DialogDescription className="text-[#6B7280]">새 고객 사용자 정보를 입력하세요.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#374151]">
                  고객 이름
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="홍길동"
                  className="border-[#E5E7EB]"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#374151]">
                  고객 이메일
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="customer@company.com"
                  className="border-[#E5E7EB]"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#374151]">
                  비밀번호
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="비밀번호 입력"
                  className="border-[#E5E7EB]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[#374151]">고객사 조직</Label>
                {!showNewOrgForm ? (
                  <>
                    <Select
                      value={formData.orgId}
                      onValueChange={(value) => setFormData({ ...formData, orgId: value })}
                    >
                      <SelectTrigger className="border-[#E5E7EB]">
                        <SelectValue placeholder="기존 조직 선택" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-[#E5E7EB]">
                        {orgs.map((org) => (
                          <SelectItem key={org.id} value={org.id}>
                            {org.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowNewOrgForm(true)}
                      className="w-full mt-2 border-[#E5E7EB] text-[#118DFF]"
                    >
                      <Building2 className="w-4 h-4 mr-2" />새 고객사 생성
                    </Button>
                  </>
                ) : (
                  <>
                    <Input
                      value={formData.newOrgName}
                      onChange={(e) => setFormData({ ...formData, newOrgName: e.target.value })}
                      placeholder="새 고객사 이름"
                      className="border-[#E5E7EB]"
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowNewOrgForm(false)
                        setFormData({ ...formData, newOrgName: "" })
                      }}
                      className="w-full mt-2 border-[#E5E7EB] text-[#6B7280]"
                    >
                      기존 조직 선택으로 돌아가기
                    </Button>
                  </>
                )}
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="border-[#E5E7EB]"
                >
                  취소
                </Button>
                <Button type="submit" className="bg-[#118DFF] hover:bg-[#0D6FCC]">
                  생성
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id} className="p-6 bg-white border-[#E5E7EB]">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="p-3 bg-[#118DFF]/10 rounded-lg">
                  <UsersIcon className="w-6 h-6 text-[#118DFF]" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-[#111827]">{user.name}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded ${user.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}
                    >
                      {user.role === "admin" ? "Admin" : "Customer"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#6B7280] mb-1">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </div>
                  {user.role === "customer" && (
                    <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                      <Shield className="w-4 h-4" />
                      {getOrgName(user.orgId)}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(user.id)}
                  className="border-[#E5E7EB] hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
        {users.length === 0 && (
          <Card className="p-12 bg-white border-[#E5E7EB] text-center">
            <p className="text-[#6B7280]">등록된 사용자가 없습니다.</p>
          </Card>
        )}
      </div>
    </div>
  )
}
