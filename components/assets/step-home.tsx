import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, TreeDeciduous, TrendingUp, BarChart3, FileText } from "lucide-react"

interface AssetsStepHomeProps {
  language: "kr" | "en"
}

export function AssetsStepHome({ language }: AssetsStepHomeProps) {
  const features = [
    {
      icon: TreeDeciduous,
      titleKr: "자산 포트폴리오",
      titleEn: "Asset Portfolio",
      descKr: "자연자산 현황을 한눈에 파악하고 관리합니다",
      descEn: "View and manage natural asset status at a glance",
    },
    {
      icon: TrendingUp,
      titleKr: "가치 평가",
      titleEn: "Valuation",
      descKr: "탄소 저장량, 생산성 등 정량화된 가치를 평가합니다",
      descEn: "Assess quantified value including carbon storage and productivity",
    },
    {
      icon: BarChart3,
      titleKr: "최적화 분석",
      titleEn: "Optimization Analysis",
      descKr: "자산 가치를 극대화하는 최적 관리 전략을 제안합니다",
      descEn: "Suggest optimal management strategies to maximize asset value",
    },
    {
      icon: FileText,
      titleKr: "보고서 생성",
      titleEn: "Report Generation",
      descKr: "투자자와 이해관계자를 위한 종합 보고서를 생성합니다",
      descEn: "Generate comprehensive reports for investors and stakeholders",
    },
  ]

  return (
    <div className="space-y-6">
      <Card className="border-slate-700 bg-slate-900/50">
        <CardHeader>
          <CardTitle className="text-xl">
            {language === "kr" ? "자산 가치 향상 서비스 소개" : "Asset Value Enhancement Service"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {language === "kr"
              ? "NatureX는 첨단 LiDAR 센싱과 AI 분석을 통해 자연자산의 3D 구조, 탄소 저장량, 생산성을 정량화합니다. 이를 통해 자연자본의 장기적 가치를 극대화하고 자산 가치를 향상시킬 수 있습니다."
              : "NatureX quantifies 3D structure, carbon storage, and productivity of natural assets through advanced LiDAR sensing and AI analysis. This maximizes the long-term value of natural capital and enhances asset value."}
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <Card key={index} className="border-slate-700 bg-slate-900/50 hover:bg-slate-900/70 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <CardTitle className="text-lg">{language === "kr" ? feature.titleKr : feature.titleEn}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{language === "kr" ? feature.descKr : feature.descEn}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="border-emerald-700 bg-emerald-900/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">{language === "kr" ? "시작하기" : "Get Started"}</h3>
              <p className="text-sm text-muted-foreground">
                {language === "kr"
                  ? "왼쪽 메뉴에서 단계를 선택하여 자산 가치 향상 프로세스를 시작하세요"
                  : "Select a step from the left menu to begin the asset value enhancement process"}
              </p>
            </div>
            <ArrowRight className="w-6 h-6 text-emerald-400" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
