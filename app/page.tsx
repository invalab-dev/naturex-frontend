"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProjectRecommendationAssistant } from "@/components/project-recommendation-assistant"
import { ContactModal } from "@/components/contact-modal"
import { GlobalHeader } from "@/components/global-header"
import { useRouter } from "next/navigation"
import { getAuthSession } from "@/lib/auth-data"
import {
  Building2,
  TreePine,
  Sprout,
  Factory,
  Landmark,
  Globe,
  TrendingUp,
  FileCheck,
  ArrowRight,
  Mail,
} from "lucide-react"

type Language = "ko" | "en"

export default function HomePage() {
  const router = useRouter()
  const [language, setLanguage] = useState<Language>("ko")
  const [contactModalOpen, setContactModalOpen] = useState(false)

  useEffect(() => {
    const session = getAuthSession()

    if (!session) {
      // Not logged in -> redirect to login
      router.replace("/login?redirect=/app")
    } else {
      // Logged in -> redirect based on role
      if (session.role === "admin") {
        router.replace("/admin")
      } else {
        router.replace("/app")
      }
    }
  }, [router])

  return (
      <></>
  )
  // const content = {
  //   tagline: {
  //     ko: "Where nature's X is discovered",
  //     en: "Where nature's X is discovered",
  //   },
  //   subtitle: {
  //     ko: "We explore nature to uncover its hidden value.",
  //     en: "We explore nature to uncover its hidden value.",
  //   },
  //   services: {
  //     title: { ko: "NatureX Service Hub", en: "NatureX Service Hub" },
  //     efficiency: {
  //       title: { ko: "운영비 절감", en: "Operational Efficiency" },
  //       description: {
  //         ko: "AI 기반 분석으로 유지관리 우선순위를 자동화하여 불필요한 작업과 비용을 줄입니다.",
  //         en: "Automate maintenance priorities with AI-based natural asset analysis to reduce unnecessary work and costs.",
  //       },
  //       coreMessage: {
  //         ko: "관리 우선순위 자동화로 운영비 절감",
  //         en: "Reduce operating costs through automated management prioritization",
  //       },
  //       industries: [
  //         {
  //           icon: Landmark,
  //           label: { ko: "지자체·공공기관", en: "Local Government & Public" },
  //         },
  //         {
  //           icon: TreePine,
  //           label: { ko: "산림·임업 관리", en: "Forestry Management" },
  //         },
  //         {
  //           icon: Sprout,
  //           label: { ko: "농업·스마트팜", en: "Agriculture & Smart Farm" },
  //         },
  //         {
  //           icon: Factory,
  //           label: { ko: "인프라·시설 운영", en: "Infrastructure Operations" },
  //         },
  //       ],
  //     },
  //     assets: {
  //       title: { ko: "자산 가치 향상", en: "Asset Value Enhancement" },
  //       description: {
  //         ko: "생산성·바이오매스·탄소 지표를 기반으로 자연자산의 장기 가치를 정량화하고 극대화합니다.",
  //         en: "Quantify and maximize long-term value of natural assets based on productivity, biomass, and carbon metrics.",
  //       },
  //       coreMessage: {
  //         ko: "자연자산을 비용이 아닌 자산으로 관리",
  //         en: "Manage natural assets as value, not costs",
  //       },
  //       industries: [
  //         {
  //           icon: TreePine,
  //           label: { ko: "산림 자산 보유", en: "Forest Asset Management" },
  //         },
  //         {
  //           icon: Globe,
  //           label: { ko: "탄소배출권", en: "Carbon & Natural Capital" },
  //         },
  //         {
  //           icon: Factory,
  //           label: { ko: "그린인프라 개발", en: "Energy & Infrastructure" },
  //         },
  //         {
  //           icon: Building2,
  //           label: { ko: "개발·부동산 사업", en: "Development & Real Estate" },
  //         },
  //       ],
  //     },
  //     reporting: {
  //       title: { ko: "생물다양성 프로젝트", en: "Biodiversity Project" },
  //       description: {
  //         ko: "생물다양성 보전·복원 프로젝트를 설계하고 실행하며, ESG 및 TNFD 공시로 연결합니다.",
  //         en: "Design and implement biodiversity conservation and restoration projects, linked to ESG and TNFD disclosures.",
  //       },
  //       coreMessage: {
  //         ko: "생물다양성 프로젝트로 ESG·TNFD 공시 대응",
  //         en: "Achieve ESG·TNFD compliance through biodiversity projects",
  //       },
  //       industries: [
  //         {
  //           icon: Building2,
  //           label: { ko: "기업(ESG·CSR)", en: "Enterprise & Global Corp." },
  //         },
  //         {
  //           icon: TrendingUp,
  //           label: { ko: "금융기관", en: "Financial Institutions" },
  //         },
  //         {
  //           icon: FileCheck,
  //           label: { ko: "투자기관·펀드", en: "Investment Firms & Funds" },
  //         },
  //         {
  //           icon: Landmark,
  //           label: { ko: "공공기관·지자체", en: "Public Institutions" },
  //         },
  //       ],
  //     },
  //   },
  //   cta: {
  //     button: { ko: "프로젝트 시작하기", en: "Start a Project" },
  //   },
  //   about: {
  //     link: { ko: "eXplore nature's X with InvaLab", en: "eXplore nature's X with InvaLab" },
  //   },
  // }
  //
  // return (
  //   <div className="flex flex-col min-h-screen bg-[#F5F7FB]">
  //     {/* Global Header */}
  //     <GlobalHeader />
  //
  //     {/* Hero Section */}
  //     <main className="flex-1 pt-14">
  //       <div className="max-w-6xl mx-auto px-6 py-24">
  //         {/* Hero Content */}
  //         <div className="text-center mb-20">
  //           <h1 className="text-5xl font-bold text-[#111827] mb-6 leading-tight text-balance">
  //             {content.tagline[language]}
  //           </h1>
  //           <p className="text-xl text-[#6B7280] leading-relaxed text-pretty">{content.subtitle[language]}</p>
  //         </div>
  //
  //         {/* Services Section */}
  //         <div className="mt-16">
  //           <h2 className="text-3xl font-bold text-[#111827] mb-12 text-center leading-tight">
  //             {content.services.title[language]}
  //           </h2>
  //           <div className="grid md:grid-cols-3 gap-8">
  //             {/* Service 1: Efficiency */}
  //             <div className="bg-white rounded-xl border-2 border-[#118DFF]/20 p-6 hover:shadow-xl transition-all hover:border-[#118DFF]">
  //               <h3 className="text-2xl font-bold text-[#118DFF] mb-4 leading-tight">
  //                 {content.services.efficiency.title[language]}
  //               </h3>
  //               <p className="text-[#374151] leading-relaxed mb-6 text-sm">
  //                 {content.services.efficiency.description[language]}
  //               </p>
  //
  //               <div className="mb-6">
  //                 <div className="grid grid-cols-2 gap-3">
  //                   {content.services.efficiency.industries.map((industry, idx) => {
  //                     const Icon = industry.icon
  //                     return (
  //                       <div key={idx} className="flex items-center gap-2 bg-[#118DFF]/5 rounded-lg p-2.5">
  //                         <Icon className="w-4 h-4 text-[#118DFF] flex-shrink-0" />
  //                         <span className="text-xs text-[#374151] leading-tight">{industry.label[language]}</span>
  //                       </div>
  //                     )
  //                   })}
  //                 </div>
  //               </div>
  //
  //               <div className="pt-4 border-t border-[#E5E7EB]">
  //                 <p className="text-sm font-semibold text-[#118DFF] leading-relaxed">
  //                   {content.services.efficiency.coreMessage[language]}
  //                 </p>
  //               </div>
  //             </div>
  //
  //             {/* Service 2: Assets */}
  //             <div className="bg-white rounded-xl border-2 border-[#118DFF]/20 p-6 hover:shadow-xl transition-all hover:border-[#118DFF]">
  //               <h3 className="text-2xl font-bold text-[#118DFF] mb-4 leading-tight">
  //                 {content.services.assets.title[language]}
  //               </h3>
  //               <p className="text-[#374151] leading-relaxed mb-6 text-sm">
  //                 {content.services.assets.description[language]}
  //               </p>
  //
  //               <div className="mb-6">
  //                 <div className="grid grid-cols-2 gap-3">
  //                   {content.services.assets.industries.map((industry, idx) => {
  //                     const Icon = industry.icon
  //                     return (
  //                       <div key={idx} className="flex items-center gap-2 bg-[#118DFF]/5 rounded-lg p-2.5">
  //                         <Icon className="w-4 h-4 text-[#118DFF] flex-shrink-0" />
  //                         <span className="text-xs text-[#374151] leading-tight">{industry.label[language]}</span>
  //                       </div>
  //                     )
  //                   })}
  //                 </div>
  //               </div>
  //
  //               <div className="pt-4 border-t border-[#E5E7EB]">
  //                 <p className="text-sm font-semibold text-[#118DFF] leading-relaxed">
  //                   {content.services.assets.coreMessage[language]}
  //                 </p>
  //               </div>
  //             </div>
  //
  //             {/* Service 3: Reporting */}
  //             <div className="bg-white rounded-xl border-2 border-[#118DFF]/20 p-6 hover:shadow-xl transition-all hover:border-[#118DFF]">
  //               <h3 className="text-2xl font-bold text-[#118DFF] mb-4 leading-tight">
  //                 {content.services.reporting.title[language]}
  //               </h3>
  //               <p className="text-[#374151] leading-relaxed mb-6 text-sm">
  //                 {content.services.reporting.description[language]}
  //               </p>
  //
  //               <div className="mb-6">
  //                 <div className="grid grid-cols-2 gap-3">
  //                   {content.services.reporting.industries.map((industry, idx) => {
  //                     const Icon = industry.icon
  //                     return (
  //                       <div key={idx} className="flex items-center gap-2 bg-[#118DFF]/5 rounded-lg p-2.5">
  //                         <Icon className="w-4 h-4 text-[#118DFF] flex-shrink-0" />
  //                         <span className="text-xs text-[#374151] leading-tight">{industry.label[language]}</span>
  //                       </div>
  //                     )
  //                   })}
  //                 </div>
  //               </div>
  //
  //               <div className="pt-4 border-t border-[#E5E7EB]">
  //                 <p className="text-sm font-semibold text-[#118DFF] leading-relaxed">
  //                   {content.services.reporting.coreMessage[language]}
  //                 </p>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //
  //         {/* AI Assistant Section */}
  //         <div className="mt-24">
  //           <ProjectRecommendationAssistant language={language} />
  //         </div>
  //
  //         {/* Bottom CTA Section */}
  //         <div className="mt-16 -mx-6 px-6 py-12 bg-[#F5F7FB] border-t border-[#E5E7EB] shadow-inner">
  //           <div className="max-w-4xl mx-auto text-center">
  //             <h2 className="text-3xl font-bold text-[#111827] mb-4 leading-tight text-balance">
  //               {language === "ko" ? "이제 프로젝트를 시작할 준비가 되셨나요?" : "Ready to start your project?"}
  //             </h2>
  //             <p className="text-lg text-[#6B7280] mb-8 leading-relaxed text-pretty">
  //               {language === "ko"
  //                 ? "NatureX는 프로젝트 단위로 운영비 절감, 자산 가치 향상, ESG·TNFD 공시를 관리합니다."
  //                 : "NatureX manages operational efficiency, asset value enhancement, and ESG·TNFD disclosure on a project basis."}
  //             </p>
  //
  //             <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
  //               <Button
  //                 asChild
  //                 size="lg"
  //                 className="bg-[#118DFF] hover:bg-[#0d7ae6] text-white px-8 py-6 text-lg shadow-lg"
  //               >
  //                 <Link href="/app">
  //                   <span>{language === "ko" ? "프로젝트 시작하기" : "Start a Project"}</span>
  //                   <ArrowRight className="w-5 h-5 ml-2" />
  //                 </Link>
  //               </Button>
  //
  //               <Button
  //                 onClick={() => setContactModalOpen(true)}
  //                 size="lg"
  //                 variant="outline"
  //                 className="border-2 border-[#118DFF] text-[#118DFF] hover:bg-[#118DFF] hover:text-white px-8 py-6 text-lg"
  //               >
  //                 <Mail className="w-5 h-5 mr-2" />
  //                 <span>{language === "ko" ? "문의하기" : "Contact Us"}</span>
  //               </Button>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </main>
  //
  //     {/* Contact Modal */}
  //     <ContactModal open={contactModalOpen} onOpenChange={setContactModalOpen} language={language} />
  //   </div>
  // )
}
