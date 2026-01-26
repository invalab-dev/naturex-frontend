import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, DollarSign, Leaf, BarChart3 } from "lucide-react"

interface AssetsStepValuationProps {
  language: "kr" | "en"
}

export function AssetsStepValuation({ language }: AssetsStepValuationProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">{language === "kr" ? "가치 평가" : "Asset Valuation"}</h2>
        <p className="text-muted-foreground">
          {language === "kr"
            ? "자연자산의 정량화된 가치를 분석하고 평가합니다"
            : "Analyze and assess the quantified value of natural assets"}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-slate-700 bg-slate-900/50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-emerald-400" />
              </div>
              <CardTitle className="text-lg">{language === "kr" ? "탄소 저장 가치" : "Carbon Storage Value"}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">11,460 tCO2</div>
            <div className="text-sm text-muted-foreground mb-4">
              {language === "kr" ? "총 탄소 저장량" : "Total Carbon Stock"}
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">{language === "kr" ? "+15% 전년 대비" : "+15% YoY"}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-700 bg-slate-900/50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-400" />
              </div>
              <CardTitle className="text-lg">
                {language === "kr" ? "예상 시장 가치" : "Estimated Market Value"}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{language === "kr" ? "₩8.2억" : "$620K"}</div>
            <div className="text-sm text-muted-foreground mb-4">
              {language === "kr" ? "탄소 크레딧 기준" : "Based on Carbon Credits"}
            </div>
            <div className="flex items-center gap-2 text-blue-400">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">{language === "kr" ? "+22% 전년 대비" : "+22% YoY"}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-700 bg-slate-900/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            {language === "kr" ? "자산별 가치 분포" : "Value Distribution by Asset"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                name: language === "kr" ? "서울 도시숲 A" : "Seoul Urban Forest A",
                value: 35,
                amount: language === "kr" ? "₩2.8억" : "$215K",
              },
              {
                name: language === "kr" ? "경기 산림 B" : "Gyeonggi Forest B",
                value: 50,
                amount: language === "kr" ? "₩4.1억" : "$310K",
              },
              {
                name: language === "kr" ? "부산 해안림 C" : "Busan Coastal Forest C",
                value: 15,
                amount: language === "kr" ? "₩1.2억" : "$95K",
              },
            ].map((asset, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{asset.name}</span>
                  <span className="text-sm font-semibold">{asset.amount}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full transition-all"
                    style={{ width: `${asset.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline">{language === "kr" ? "보고서 다운로드" : "Download Report"}</Button>
        <Button>{language === "kr" ? "상세 분석" : "Detailed Analysis"}</Button>
      </div>
    </div>
  )
}
