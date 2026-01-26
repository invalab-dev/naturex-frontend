import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, Target, AlertCircle, CheckCircle } from "lucide-react"

interface AssetsStepOptimizationProps {
  language: "kr" | "en"
}

export function AssetsStepOptimization({ language }: AssetsStepOptimizationProps) {
  const recommendations = [
    {
      priority: "high",
      titleKr: "수종 다양화",
      titleEn: "Species Diversification",
      descKr:
        "단일 수종 비중이 높은 구역에 다양한 수종을 식재하여 생태계 안정성과 탄소 저장 효율을 향상시킬 수 있습니다.",
      descEn:
        "Plant diverse species in areas with high single-species concentration to improve ecosystem stability and carbon storage efficiency.",
      impact: "+18%",
    },
    {
      priority: "medium",
      titleKr: "밀도 조정",
      titleEn: "Density Adjustment",
      descKr: "과밀 구역의 간벌을 통해 개체당 성장률을 높이고 장기적인 탄소 저장량을 증가시킬 수 있습니다.",
      descEn: "Increase individual growth rates and long-term carbon storage through thinning in overcrowded areas.",
      impact: "+12%",
    },
    {
      priority: "medium",
      titleKr: "토양 개선",
      titleEn: "Soil Improvement",
      descKr: "토양 분석 결과를 바탕으로 영양분 보충과 배수 개선을 통해 수목 건강도를 향상시킬 수 있습니다.",
      descEn: "Improve tree health through nutrient supplementation and drainage improvement based on soil analysis.",
      impact: "+9%",
    },
    {
      priority: "low",
      titleKr: "모니터링 강화",
      titleEn: "Enhanced Monitoring",
      descKr: "정기적인 LiDAR 스캔과 AI 분석을 통해 성장 추이를 추적하고 문제를 조기에 발견할 수 있습니다.",
      descEn: "Track growth trends and detect issues early through regular LiDAR scans and AI analysis.",
      impact: "+5%",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">{language === "kr" ? "최적화 분석" : "Optimization Analysis"}</h2>
        <p className="text-muted-foreground">
          {language === "kr"
            ? "자산 가치를 극대화하기 위한 맞춤형 관리 전략을 제안합니다"
            : "Customized management strategies to maximize asset value"}
        </p>
      </div>

      <Card className="border-emerald-700 bg-emerald-900/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-400" />
              {language === "kr" ? "최적화 잠재력" : "Optimization Potential"}
            </CardTitle>
            <div className="text-2xl font-bold text-emerald-400">+44%</div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {language === "kr"
              ? "제안된 전략을 모두 실행할 경우 예상되는 가치 증가율입니다. 단계적 실행 계획과 예산 수립을 권장합니다."
              : "Expected value increase if all proposed strategies are implemented. We recommend phased implementation planning and budgeting."}
          </p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {recommendations.map((rec, index) => {
          const priorityConfig = {
            high: {
              color: "border-red-700 bg-red-900/20",
              badge: "bg-red-500/20 text-red-400",
              icon: AlertCircle,
              label: language === "kr" ? "높음" : "High",
            },
            medium: {
              color: "border-amber-700 bg-amber-900/20",
              badge: "bg-amber-500/20 text-amber-400",
              icon: TrendingUp,
              label: language === "kr" ? "중간" : "Medium",
            },
            low: {
              color: "border-blue-700 bg-blue-900/20",
              badge: "bg-blue-500/20 text-blue-400",
              icon: CheckCircle,
              label: language === "kr" ? "낮음" : "Low",
            },
          }[rec.priority]

          const Icon = priorityConfig.icon

          return (
            <Card key={index} className={`${priorityConfig.color} border`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg">{language === "kr" ? rec.titleKr : rec.titleEn}</CardTitle>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig.badge}`}>
                          {priorityConfig.label}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{language === "kr" ? rec.descKr : rec.descEn}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <div className="text-lg font-bold text-emerald-400">{rec.impact}</div>
                    <div className="text-xs text-muted-foreground">{language === "kr" ? "예상 효과" : "Impact"}</div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          )
        })}
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline">{language === "kr" ? "실행 계획 다운로드" : "Download Action Plan"}</Button>
        <Button>{language === "kr" ? "전문가 상담 신청" : "Request Expert Consultation"}</Button>
      </div>
    </div>
  )
}
