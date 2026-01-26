import { Card } from "@/components/ui/card"
import { Database, Microscope, LayoutDashboard, TrendingUp } from "lucide-react"

export function ServiceWorkflowCard() {
  const steps = [
    {
      icon: Database,
      title: "데이터 수신",
      description: "프로젝트 데이터 전달",
    },
    {
      icon: Microscope,
      title: "InvaLab 분석",
      description: "AI 기반 전문 분석",
    },
    {
      icon: LayoutDashboard,
      title: "대시보드 제공",
      description: "맞춤형 인사이트",
    },
    {
      icon: TrendingUp,
      title: "실행 추적",
      description: "성과 모니터링",
    },
  ]

  return (
    <Card className="p-6 bg-gradient-to-br from-[#118DFF]/5 to-white border-[#118DFF]/20">
      <h3 className="text-sm font-semibold text-[#111827] mb-4">서비스 워크플로우</h3>
      <div className="grid grid-cols-4 gap-3">
        {steps.map((step, index) => {
          const Icon = step.icon
          return (
            <div key={index} className="relative">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-white border-2 border-[#118DFF]/30 flex items-center justify-center mx-auto mb-2">
                  <Icon className="w-5 h-5 text-[#118DFF]" />
                </div>
                <div className="text-xs font-medium text-[#111827] mb-1">{step.title}</div>
                <div className="text-xs text-[#6B7280]">{step.description}</div>
              </div>
              {index < steps.length - 1 && (
                <div className="absolute top-6 left-[calc(50%+24px)] w-[calc(100%-48px)] h-0.5 bg-[#118DFF]/20" />
              )}
            </div>
          )
        })}
      </div>
      <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
        <p className="text-xs text-[#6B7280] text-center">InvaLab의 전문 서비스로 프로젝트를 효율적으로 관리하세요</p>
      </div>
    </Card>
  )
}
