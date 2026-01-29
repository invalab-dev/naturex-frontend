"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import {
  Gauge,
  TrendingUp,
  Leaf,
  MapPin,
  Building2,
  TreePine,
  Sprout,
  Factory,
  Landmark,
  Globe,
  FileCheck,
  ArrowRight,
  Mail,
} from "lucide-react"
import { ServiceWorkflowCard } from "@/components/service-workflow-card"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProjectRecommendationAssistant } from "@/components/project-recommendation-assistant"
import { ContactModal } from "@/components/contact-modal"

const themeConfig = {
  efficiency: {
    label: "운영비 절감",
    icon: Gauge,
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
  },
  asset: {
    label: "자산 가치 향상",
    icon: TrendingUp,
    bgColor: "bg-green-50",
    textColor: "text-green-700",
  },
  biodiversity: {
    label: "생물다양성",
    icon: Leaf,
    bgColor: "bg-teal-50",
    textColor: "text-teal-700",
  },
}

export default function AppHomePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [projects, setProjects] = useState<any[]>([])
  const [contactModalOpen, setContactModalOpen] = useState(false)
  const [language] = useState<string>(user?.language)

  useEffect(() => {
    if (!user) return

    const sorted = loadedProjects.sort(
      (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    setProjects(sorted.slice(0, 3))

    if (user.orgId) {
      const orgs = getOrgs()
      const org = orgs.find((o) => o.id === user.orgId)
      if (org) setOrgName(org.name)
    }
  }, [user])

  const content = {
    services: {
      efficiency: {
        title: "운영비 절감",
        description: "AI 기반 분석으로 유지관리 우선순위를 자동화하여 불필요한 작업과 비용을 줄입니다.",
        coreMessage: "관리 우선순위 자동화로 운영비 절감",
        industries: [
          { icon: Landmark, label: "지자체·공공기관" },
          { icon: TreePine, label: "산림·임업 관리" },
          { icon: Sprout, label: "농업·스마트팜" },
          { icon: Factory, label: "인프라·시설 운영" },
        ],
      },
      assets: {
        title: "자산 가치 향상",
        description: "생산성·바이오매스·탄소 지표를 기반으로 자연자산의 장기 가치를 정량화하고 극대화합니다.",
        coreMessage: "자연자산을 비용이 아닌 자산으로 관리",
        industries: [
          { icon: TreePine, label: "산림 자산 보유" },
          { icon: Globe, label: "탄소배출권" },
          { icon: Factory, label: "그린인프라 개발" },
          { icon: Building2, label: "개발·부동산 사업" },
        ],
      },
      reporting: {
        title: "생물다양성 프로젝트",
        description: "생물다양성 보전·복원 프로젝트를 설계하고 실행하며, ESG 및 TNFD 공시로 연결합니다.",
        coreMessage: "생물다양성 프로젝트로 ESG·TNFD 공시 대응",
        industries: [
          { icon: Building2, label: "기업(ESG·CSR)" },
          { icon: TrendingUp, label: "금융기관" },
          { icon: FileCheck, label: "투자기관·펀드" },
          { icon: Landmark, label: "공공기관·지자체" },
        ],
      },
    },
  }

  return (
    <div className="min-h-screen bg-[#F5F7FB] p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {user && (
          <div className="text-xs text-[#9CA3AF]">
            Session Debug: role={user.role}, userId={user.userId}, orgId={user.orgId || "N/A"}
          </div>
        )}

        {/* Welcome Card */}
        <Card className="p-8 bg-white border-[#E5E7EB]">
          <h1 className="text-3xl font-bold text-[#111827] mb-2">안녕하세요, {user?.name}님</h1>
          <p className="text-lg text-[#6B7280]">
            {orgName && <span className="font-medium text-[#118DFF]">{orgName}</span>}
            {orgName ? "의 " : ""}자연자산 프로젝트를 관리하고 분석 결과를 확인하세요.
          </p>
        </Card>

        <ServiceWorkflowCard />

        {/* NatureX Service Hub */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-[#111827] mb-6">NatureX Service Hub</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Service 1: Efficiency */}
            <div className="bg-white rounded-xl border-2 border-[#118DFF]/20 p-6 hover:shadow-xl transition-all hover:border-[#118DFF]">
              <h3 className="text-xl font-bold text-[#118DFF] mb-3">{content.services.efficiency.title}</h3>
              <p className="text-sm text-[#374151] leading-relaxed mb-4">{content.services.efficiency.description}</p>

              <div className="mb-4">
                <div className="grid grid-cols-2 gap-2">
                  {content.services.efficiency.industries.map((industry, idx) => {
                    const Icon = industry.icon
                    return (
                      <div key={idx} className="flex items-center gap-2 bg-[#118DFF]/5 rounded-lg p-2">
                        <Icon className="w-4 h-4 text-[#118DFF] flex-shrink-0" />
                        <span className="text-xs text-[#374151]">{industry.label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-[#E5E7EB]">
                <p className="text-sm font-semibold text-[#118DFF]">{content.services.efficiency.coreMessage}</p>
              </div>
            </div>

            {/* Service 2: Assets */}
            <div className="bg-white rounded-xl border-2 border-[#118DFF]/20 p-6 hover:shadow-xl transition-all hover:border-[#118DFF]">
              <h3 className="text-xl font-bold text-[#118DFF] mb-3">{content.services.assets.title}</h3>
              <p className="text-sm text-[#374151] leading-relaxed mb-4">{content.services.assets.description}</p>

              <div className="mb-4">
                <div className="grid grid-cols-2 gap-2">
                  {content.services.assets.industries.map((industry, idx) => {
                    const Icon = industry.icon
                    return (
                      <div key={idx} className="flex items-center gap-2 bg-[#118DFF]/5 rounded-lg p-2">
                        <Icon className="w-4 h-4 text-[#118DFF] flex-shrink-0" />
                        <span className="text-xs text-[#374151]">{industry.label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-[#E5E7EB]">
                <p className="text-sm font-semibold text-[#118DFF]">{content.services.assets.coreMessage}</p>
              </div>
            </div>

            {/* Service 3: Reporting */}
            <div className="bg-white rounded-xl border-2 border-[#118DFF]/20 p-6 hover:shadow-xl transition-all hover:border-[#118DFF]">
              <h3 className="text-xl font-bold text-[#118DFF] mb-3">{content.services.reporting.title}</h3>
              <p className="text-sm text-[#374151] leading-relaxed mb-4">{content.services.reporting.description}</p>

              <div className="mb-4">
                <div className="grid grid-cols-2 gap-2">
                  {content.services.reporting.industries.map((industry, idx) => {
                    const Icon = industry.icon
                    return (
                      <div key={idx} className="flex items-center gap-2 bg-[#118DFF]/5 rounded-lg p-2">
                        <Icon className="w-4 h-4 text-[#118DFF] flex-shrink-0" />
                        <span className="text-xs text-[#374151]">{industry.label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-[#E5E7EB]">
                <p className="text-sm font-semibold text-[#118DFF]">{content.services.reporting.coreMessage}</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Assistant Section */}
        <div className="mt-16">
          <ProjectRecommendationAssistant language={language} />
        </div>

        {/* Recent Projects */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#111827]">최근 프로젝트</h2>
            <Link href="/app/projects">
              <Button variant="ghost" size="sm" className="text-[#118DFF] hover:text-[#0D6FCC] bg-transparent">
                전체 보기 →
              </Button>
            </Link>
          </div>

          {projects.length === 0 ? (
            <Card className="p-12 bg-white border-[#E5E7EB] text-center">
              <p className="text-[#6B7280] mb-4">등록된 프로젝트가 없습니다.</p>
              <Button
                onClick={() => router.push("/app/projects/new")}
                className="bg-[#118DFF] hover:bg-[#0d6ecc] text-white"
              >
                새 프로젝트 생성
              </Button>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {projects.map((project: any) => {
                const theme = themeConfig[project.theme as keyof typeof themeConfig]
                const ThemeIcon = theme?.icon || Leaf

                return (
                  <Link key={project.projectId} href={`/app/projects/${project.projectId}`}>
                    <Card className="p-5 bg-white border-[#E5E7EB] hover:border-[#118DFF] hover:shadow-sm transition-all">
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${theme?.bgColor} ${theme?.textColor}`}
                        >
                          <ThemeIcon className="w-3 h-3" />
                          {theme?.label}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-[#111827] mb-1 line-clamp-1">{project.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-[#6B7280] mb-3">
                        <MapPin className="w-3 h-3" />
                        {project.location}
                      </div>
                      <div className="text-xs text-[#9CA3AF]">
                        {new Date(project.createdAt).toLocaleDateString("ko-KR")}
                      </div>
                    </Card>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-16 bg-[#F5F7FB] border-t border-[#E5E7EB] shadow-inner -mx-8 px-8 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-[#111827] mb-4">이제 프로젝트를 시작할 준비가 되셨나요?</h2>
            <p className="text-base text-[#6B7280] mb-8">
              NatureX는 프로젝트 단위로 운영비 절감, 자산 가치 향상, ESG·TNFD 공시를 관리합니다.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="bg-[#118DFF] hover:bg-[#0d7ae6] text-white px-8 py-6 text-lg shadow-lg"
              >
                <Link href="/app/projects/new">
                  <span>프로젝트 시작하기</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>

              <Button
                onClick={() => setContactModalOpen(true)}
                size="lg"
                variant="outline"
                className="border-2 border-[#118DFF] text-[#118DFF] hover:bg-[#118DFF] hover:text-white px-8 py-6 text-lg"
              >
                <Mail className="w-5 h-5 mr-2" />
                <span>문의하기</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ContactModal open={contactModalOpen} onOpenChange={setContactModalOpen} language={language} />
    </div>
  )
}
