"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GlobalHeader } from "@/components/global-header"
import { Building2, TreePine, Sprout, Factory, Landmark, Globe, TrendingUp, FileCheck } from "lucide-react"

type Language = "ko" | "en"

const AboutPage = () => {
  const [language, setLanguage] = useState<Language>("ko")

  const content = {
    tagline: {
      ko: "Where nature's X is discovered",
      en: "Where nature's X is discovered",
    },
    subtitle: {
      ko: "We explore nature to uncover its hidden value.",
      en: "We explore nature to uncover its hidden value.",
    },
    services: {
      title: { ko: "NatureX Service Hub", en: "NatureX Service Hub" },
      efficiency: {
        title: { ko: "운영비 절감", en: "Operational Efficiency" },
        description: {
          ko: "AI 기반 자연자산 분석으로 유지관리 우선순위를 자동화하여 불필요한 작업과 비용을 줄입니다.",
          en: "Automate maintenance priorities with AI-based natural asset analysis to reduce unnecessary work and costs.",
        },
        coreMessage: {
          ko: "관리 우선순위 자동화로 운영비 절감",
          en: "Reduce operating costs through automated management prioritization",
        },
        industries: [
          {
            icon: Landmark,
            label: { ko: "지자체·공공기관", en: "Local Government & Public" },
          },
          {
            icon: TreePine,
            label: { ko: "산림·임업 관리", en: "Forestry Management" },
          },
          {
            icon: Sprout,
            label: { ko: "농업·스마트팜", en: "Agriculture & Smart Farm" },
          },
          {
            icon: Factory,
            label: { ko: "인프라·시설 운영", en: "Infrastructure Operations" },
          },
        ],
      },
      assets: {
        title: { ko: "자산 가치 향상", en: "Asset Value Enhancement" },
        description: {
          ko: "생산성·바이오매스·탄소 지표를 기반으로 자연자산의 장기 가치를 정량화하고 극대화합니다.",
          en: "Quantify and maximize long-term value of natural assets based on productivity, biomass, and carbon metrics.",
        },
        coreMessage: {
          ko: "자연자산을 비용이 아닌 자산으로 관리",
          en: "Manage natural assets as value, not costs",
        },
        industries: [
          {
            icon: TreePine,
            label: { ko: "산림 자산 보유", en: "Forest Asset Management" },
          },
          {
            icon: Globe,
            label: { ko: "탄소·자연자본 프로젝트", en: "Carbon & Natural Capital" },
          },
          {
            icon: Factory,
            label: { ko: "에너지·인프라 개발", en: "Energy & Infrastructure" },
          },
          {
            icon: Building2,
            label: { ko: "개발·부동산 사업", en: "Development & Real Estate" },
          },
        ],
      },
      reporting: {
        title: { ko: "생물다양성 프로젝트", en: "Biodiversity Project" },
        description: {
          ko: "생물다양성 보전·복원 프로젝트를 설계하고 실행하며, ESG 및 TNFD 공시로 연결합니다.",
          en: "Design and implement biodiversity conservation and restoration projects, linked to ESG and TNFD disclosures.",
        },
        coreMessage: {
          ko: "생물다양성 프로젝트로 ESG·TNFD 공시 대응",
          en: "Achieve ESG·TNFD compliance through biodiversity projects",
        },
        industries: [
          {
            icon: Building2,
            label: { ko: "대기업·글로벌 기업", en: "Enterprise & Global Corp." },
          },
          {
            icon: TrendingUp,
            label: { ko: "금융기관", en: "Financial Institutions" },
          },
          {
            icon: FileCheck,
            label: { ko: "투자기관·펀드", en: "Investment Firms & Funds" },
          },
          {
            icon: Landmark,
            label: { ko: "공공기관·지자체", en: "Public Institutions" },
          },
        ],
      },
    },
    cta: {
      button: { ko: "프로젝트 시작하기", en: "Start a Project" },
    },
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F7FB]">
      {/* Global Header */}
      <GlobalHeader />

      {/* Hero Section */}
      <main className="flex-1 pt-14">
        <div className="max-w-6xl mx-auto px-6 py-24">
          {/* Hero Content */}
          <div className="text-center mb-20">
            <h1 className="text-5xl font-bold text-[#111827] mb-6 leading-tight text-balance">
              {content.tagline[language]}
            </h1>
            <p className="text-xl text-[#6B7280] leading-relaxed text-pretty">{content.subtitle[language]}</p>
          </div>

          {/* Services Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-[#111827] mb-12 text-center leading-tight">
              {content.services.title[language]}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Service 1: Efficiency */}
              <div className="bg-white rounded-xl border-2 border-[#118DFF]/20 p-6 hover:shadow-xl transition-all hover:border-[#118DFF]">
                <h3 className="text-2xl font-bold text-[#118DFF] mb-4 leading-tight">
                  {content.services.efficiency.title[language]}
                </h3>
                <p className="text-[#374151] leading-relaxed mb-6 text-sm">
                  {content.services.efficiency.description[language]}
                </p>

                <div className="mb-6">
                  <div className="grid grid-cols-2 gap-3">
                    {content.services.efficiency.industries.map((industry, idx) => {
                      const Icon = industry.icon
                      return (
                        <div key={idx} className="flex items-center gap-2 bg-[#D1E3FF] rounded-lg p-2.5">
                          <Icon className="w-4 h-4 text-[#118DFF] flex-shrink-0" />
                          <span className="text-xs text-[#374151] leading-tight">{industry.label[language]}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#D1E3FF]">
                  <p className="text-sm font-semibold text-[#118DFF] leading-relaxed">
                    {content.services.efficiency.coreMessage[language]}
                  </p>
                </div>
              </div>

              {/* Service 2: Assets */}
              <div className="bg-white rounded-xl border-2 border-[#10B981]/20 p-6 hover:shadow-xl transition-all hover:border-[#10B981]">
                <h3 className="text-2xl font-bold text-[#10B981] mb-4 leading-tight">
                  {content.services.assets.title[language]}
                </h3>
                <p className="text-[#374151] leading-relaxed mb-6 text-sm">
                  {content.services.assets.description[language]}
                </p>

                <div className="mb-6">
                  <div className="grid grid-cols-2 gap-3">
                    {content.services.assets.industries.map((industry, idx) => {
                      const Icon = industry.icon
                      return (
                        <div key={idx} className="flex items-center gap-2 bg-[#ECFDF5] rounded-lg p-2.5">
                          <Icon className="w-4 h-4 text-[#10B981] flex-shrink-0" />
                          <span className="text-xs text-[#374151] leading-tight">{industry.label[language]}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#ECFDF5]">
                  <p className="text-sm font-semibold text-[#10B981] leading-relaxed">
                    {content.services.assets.coreMessage[language]}
                  </p>
                </div>
              </div>

              {/* Service 3: Reporting */}
              <div className="bg-white rounded-xl border-2 border-[#8B5CF6]/20 p-6 hover:shadow-xl transition-all hover:border-[#8B5CF6]">
                <h3 className="text-2xl font-bold text-[#8B5CF6] mb-4 leading-tight">
                  {content.services.reporting.title[language]}
                </h3>
                <p className="text-[#374151] leading-relaxed mb-6 text-sm">
                  {content.services.reporting.description[language]}
                </p>

                <div className="mb-6">
                  <div className="grid grid-cols-2 gap-3">
                    {content.services.reporting.industries.map((industry, idx) => {
                      const Icon = industry.icon
                      return (
                        <div key={idx} className="flex items-center gap-2 bg-[#E5E7EB] rounded-lg p-2.5">
                          <Icon className="w-4 h-4 text-[#8B5CF6] flex-shrink-0" />
                          <span className="text-xs text-[#374151] leading-tight">{industry.label[language]}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E5E7EB]">
                  <p className="text-sm font-semibold text-[#8B5CF6] leading-relaxed">
                    {content.services.reporting.coreMessage[language]}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <Link href="/">
              <Button className="bg-[#118DFF] hover:bg-[#0F7FE6] text-white px-8 py-6 text-lg">
                {content.cta.button[language]}
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AboutPage
