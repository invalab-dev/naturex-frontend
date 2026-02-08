"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  User,
  Building2,
  Bell,
  Shield,
  CreditCard,
  Settings,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

type SettingsTab =
  | "profile"
  | "account"
  | "organization"
  | "notifications"
  | "security"
  | "billing";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  return (
    <div className="flex h-full bg-[#F5F7FB]">
      {/* Left Settings Sidebar */}
      <div className="w-[220px] bg-white border-r border-[#E5E7EB] flex-shrink-0">
        <div className="p-6">
          <h2 className="text-base font-semibold text-[#111827] mb-4">설정</h2>
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                activeTab === "profile"
                  ? "bg-[#EFF6FF] text-[#118DFF]"
                  : "text-[#374151] hover:bg-[#F9FAFB]"
              }`}
            >
              <User className="w-4 h-4" />
              <span>프로필</span>
            </button>
            <button
              onClick={() => setActiveTab("account")}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                activeTab === "account"
                  ? "bg-[#EFF6FF] text-[#118DFF]"
                  : "text-[#374151] hover:bg-[#F9FAFB]"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>계정</span>
            </button>
            <button
              onClick={() => setActiveTab("organization")}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                activeTab === "organization"
                  ? "bg-[#EFF6FF] text-[#118DFF]"
                  : "text-[#374151] hover:bg-[#F9FAFB]"
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>조직</span>
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                activeTab === "notifications"
                  ? "bg-[#EFF6FF] text-[#118DFF]"
                  : "text-[#374151] hover:bg-[#F9FAFB]"
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>알림</span>
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                activeTab === "security"
                  ? "bg-[#EFF6FF] text-[#118DFF]"
                  : "text-[#374151] hover:bg-[#F9FAFB]"
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>보안</span>
            </button>
            <button
              onClick={() => setActiveTab("billing")}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                activeTab === "billing"
                  ? "bg-[#EFF6FF] text-[#118DFF]"
                  : "text-[#374151] hover:bg-[#F9FAFB]"
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>결제</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Right Content Panel */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-8">
          {activeTab === "profile" && <ProfileContent />}
          {activeTab === "account" && <AccountContent />}
          {activeTab === "organization" && <OrganizationContent />}
          {activeTab === "notifications" && <NotificationsContent />}
          {activeTab === "security" && <SecurityContent />}
          {activeTab === "billing" && <BillingContent />}
        </div>
      </div>
    </div>
  );
}

function ProfileContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#111827] mb-1">프로필</h1>
        <p className="text-sm text-[#6B7280]">
          개인 정보 및 프로필 설정을 관리합니다.
        </p>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-[#374151]">
            이름
          </Label>
          <Input
            id="name"
            placeholder="홍길동"
            defaultValue="Dr. Shin"
            className="border-[#E5E7EB] focus:border-[#118DFF] focus:ring-1 focus:ring-[#118DFF]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-[#374151]">
            이메일
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="email@example.com"
            defaultValue="dr.shin@invalab.com"
            className="border-[#E5E7EB] focus:border-[#118DFF] focus:ring-1 focus:ring-[#118DFF]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium text-[#374151]">
            전화번호
          </Label>
          <Input
            id="phone"
            placeholder="010-1234-5678"
            className="border-[#E5E7EB] focus:border-[#118DFF] focus:ring-1 focus:ring-[#118DFF]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio" className="text-sm font-medium text-[#374151]">
            소개
          </Label>
          <Textarea
            id="bio"
            placeholder="자기소개를 입력하세요"
            rows={3}
            className="border-[#E5E7EB] focus:border-[#118DFF] focus:ring-1 focus:ring-[#118DFF] resize-none"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button className="bg-[#118DFF] hover:bg-[#0d6ecc] text-white px-6">
          저장
        </Button>
      </div>
    </div>
  );
}

function AccountContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#111827] mb-1">계정</h1>
        <p className="text-sm text-[#6B7280]">
          로그인 및 계정 설정을 관리합니다.
        </p>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 space-y-5">
        <div className="space-y-2">
          <Label
            htmlFor="username"
            className="text-sm font-medium text-[#374151]"
          >
            사용자 이름
          </Label>
          <Input
            id="username"
            placeholder="username"
            defaultValue="dr.shin"
            className="border-[#E5E7EB] focus:border-[#118DFF] focus:ring-1 focus:ring-[#118DFF]"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="language"
            className="text-sm font-medium text-[#374151]"
          >
            언어
          </Label>
          <select
            id="language"
            className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md text-sm focus:border-[#118DFF] focus:ring-1 focus:ring-[#118DFF] focus:outline-none"
          >
            <option value="ko">한국어</option>
            <option value="en">English</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="timezone"
            className="text-sm font-medium text-[#374151]"
          >
            시간대
          </Label>
          <select
            id="timezone"
            className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md text-sm focus:border-[#118DFF] focus:ring-1 focus:ring-[#118DFF] focus:outline-none"
          >
            <option value="Asia/Seoul">Asia/Seoul (GMT+9)</option>
            <option value="America/New_York">America/New_York (GMT-5)</option>
            <option value="Europe/London">Europe/London (GMT+0)</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button className="bg-[#118DFF] hover:bg-[#0d6ecc] text-white px-6">
          저장
        </Button>
      </div>
    </div>
  );
}

function OrganizationContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#111827] mb-1">조직</h1>
        <p className="text-sm text-[#6B7280]">
          조직 정보 및 멤버를 관리합니다.
        </p>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 space-y-5">
        <div className="space-y-2">
          <Label
            htmlFor="orgName"
            className="text-sm font-medium text-[#374151]"
          >
            조직 이름
          </Label>
          <Input
            id="orgName"
            placeholder="조직 이름"
            defaultValue="인바랩"
            className="border-[#E5E7EB] focus:border-[#118DFF] focus:ring-1 focus:ring-[#118DFF]"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="industry"
            className="text-sm font-medium text-[#374151]"
          >
            산업 분야
          </Label>
          <Input
            id="industry"
            placeholder="산업 분야"
            defaultValue="환경 기술"
            className="border-[#E5E7EB] focus:border-[#118DFF] focus:ring-1 focus:ring-[#118DFF]"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="orgSize"
            className="text-sm font-medium text-[#374151]"
          >
            조직 규모
          </Label>
          <select
            id="orgSize"
            className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md text-sm focus:border-[#118DFF] focus:ring-1 focus:ring-[#118DFF] focus:outline-none"
          >
            <option value="1-10">1-10명</option>
            <option value="11-50">11-50명</option>
            <option value="51-200">51-200명</option>
            <option value="201+">201명 이상</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="website"
            className="text-sm font-medium text-[#374151]"
          >
            웹사이트
          </Label>
          <Input
            id="website"
            placeholder="https://example.com"
            className="border-[#E5E7EB] focus:border-[#118DFF] focus:ring-1 focus:ring-[#118DFF]"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button className="bg-[#118DFF] hover:bg-[#0d6ecc] text-white px-6">
          저장
        </Button>
      </div>
    </div>
  );
}

function NotificationsContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#111827] mb-1">알림</h1>
        <p className="text-sm text-[#6B7280]">알림 설정을 관리합니다.</p>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 space-y-5">
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm font-medium text-[#374151]">이메일 알림</p>
            <p className="text-xs text-[#6B7280] mt-0.5">
              프로젝트 업데이트를 이메일로 받습니다
            </p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between py-2 border-t border-[#E5E7EB]">
          <div>
            <p className="text-sm font-medium text-[#374151]">프로젝트 알림</p>
            <p className="text-xs text-[#6B7280] mt-0.5">
              프로젝트 상태 변경 시 알림을 받습니다
            </p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between py-2 border-t border-[#E5E7EB]">
          <div>
            <p className="text-sm font-medium text-[#374151]">마케팅 알림</p>
            <p className="text-xs text-[#6B7280] mt-0.5">
              새로운 기능 및 업데이트를 받습니다
            </p>
          </div>
          <Switch />
        </div>

        <div className="flex items-center justify-between py-2 border-t border-[#E5E7EB]">
          <div>
            <p className="text-sm font-medium text-[#374151]">보안 알림</p>
            <p className="text-xs text-[#6B7280] mt-0.5">
              보안 관련 중요 알림을 받습니다
            </p>
          </div>
          <Switch defaultChecked />
        </div>
      </div>

      <div className="flex justify-end">
        <Button className="bg-[#118DFF] hover:bg-[#0d6ecc] text-white px-6">
          저장
        </Button>
      </div>
    </div>
  );
}

function SecurityContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#111827] mb-1">보안</h1>
        <p className="text-sm text-[#6B7280]">계정 보안 설정을 관리합니다.</p>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 space-y-5">
        <div className="space-y-2">
          <Label
            htmlFor="currentPassword"
            className="text-sm font-medium text-[#374151]"
          >
            현재 비밀번호
          </Label>
          <Input
            id="currentPassword"
            type="password"
            placeholder="현재 비밀번호 입력"
            className="border-[#E5E7EB] focus:border-[#118DFF] focus:ring-1 focus:ring-[#118DFF]"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="newPassword"
            className="text-sm font-medium text-[#374151]"
          >
            새 비밀번호
          </Label>
          <Input
            id="newPassword"
            type="password"
            placeholder="새 비밀번호 입력"
            className="border-[#E5E7EB] focus:border-[#118DFF] focus:ring-1 focus:ring-[#118DFF]"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-[#374151]"
          >
            비밀번호 확인
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="새 비밀번호 다시 입력"
            className="border-[#E5E7EB] focus:border-[#118DFF] focus:ring-1 focus:ring-[#118DFF]"
          />
        </div>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[#374151]">2단계 인증</p>
            <p className="text-xs text-[#6B7280] mt-0.5">
              추가 보안 레이어로 계정을 보호합니다
            </p>
          </div>
          <Switch />
        </div>
      </div>

      <div className="flex justify-end">
        <Button className="bg-[#118DFF] hover:bg-[#0d6ecc] text-white px-6">
          저장
        </Button>
      </div>
    </div>
  );
}

function BillingContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#111827] mb-1">결제</h1>
        <p className="text-sm text-[#6B7280]">
          결제 정보 및 플랜을 관리합니다.
        </p>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        <div className="mb-4">
          <p className="text-sm font-medium text-[#374151]">현재 플랜</p>
          <p className="text-2xl font-semibold text-[#111827] mt-2">
            Enterprise
          </p>
          <p className="text-sm text-[#6B7280] mt-1">무제한 프로젝트 및 팀원</p>
        </div>
        <Button
          variant="outline"
          className="border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB] bg-transparent"
        >
          플랜 변경
        </Button>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 space-y-4">
        <p className="text-sm font-medium text-[#374151]">결제 방법</p>
        <div className="flex items-center justify-between py-3 border border-[#E5E7EB] rounded-md px-4">
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-[#6B7280]" />
            <div>
              <p className="text-sm font-medium text-[#374151]">
                •••• •••• •••• 4242
              </p>
              <p className="text-xs text-[#6B7280]">만료: 12/2025</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="text-xs text-[#6B7280] hover:text-[#374151]"
          >
            수정
          </Button>
        </div>
        <Button
          variant="outline"
          className="w-full border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB] bg-transparent"
        >
          결제 방법 추가
        </Button>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        <p className="text-sm font-medium text-[#374151] mb-4">결제 내역</p>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-[#E5E7EB]">
            <div>
              <p className="text-sm text-[#374151]">2024년 1월 결제</p>
              <p className="text-xs text-[#6B7280]">2024.01.01</p>
            </div>
            <p className="text-sm font-medium text-[#374151]">₩500,000</p>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-[#E5E7EB]">
            <div>
              <p className="text-sm text-[#374151]">2023년 12월 결제</p>
              <p className="text-xs text-[#6B7280]">2023.12.01</p>
            </div>
            <p className="text-sm font-medium text-[#374151]">₩500,000</p>
          </div>
        </div>
      </div>
    </div>
  );
}
