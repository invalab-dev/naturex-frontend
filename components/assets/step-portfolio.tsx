import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TreeDeciduous, MapPin, Upload, Plus } from "lucide-react"

interface AssetsStepPortfolioProps {
  language: "kr" | "en"
}

export function AssetsStepPortfolio({ language }: AssetsStepPortfolioProps) {
  const mockAssets = [
    {
      id: 1,
      name: language === "kr" ? "서울 도시숲 A" : "Seoul Urban Forest A",
      location: language === "kr" ? "서울시 강남구" : "Gangnam-gu, Seoul",
      area: "15.2 ha",
      trees: 1834,
      carbonStock: "2,450 tCO2",
      status: language === "kr" ? "활성" : "Active",
    },
    {
      id: 2,
      name: language === "kr" ? "경기 산림 B" : "Gyeonggi Forest B",
      location: language === "kr" ? "경기도 남양주시" : "Namyangju-si, Gyeonggi",
      area: "42.8 ha",
      trees: 5621,
      carbonStock: "7,890 tCO2",
      status: language === "kr" ? "활성" : "Active",
    },
    {
      id: 3,
      name: language === "kr" ? "부산 해안림 C" : "Busan Coastal Forest C",
      location: language === "kr" ? "부산시 해운대구" : "Haeundae-gu, Busan",
      area: "8.6 ha",
      trees: 892,
      carbonStock: "1,120 tCO2",
      status: language === "kr" ? "분석중" : "Analyzing",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">{language === "kr" ? "자산 포트폴리오" : "Asset Portfolio"}</h2>
          <p className="text-muted-foreground">
            {language === "kr"
              ? "보유한 자연자산 현황을 관리하고 모니터링합니다"
              : "Manage and monitor your natural asset portfolio"}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            {language === "kr" ? "데이터 업로드" : "Upload Data"}
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            {language === "kr" ? "자산 추가" : "Add Asset"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {mockAssets.map((asset) => (
          <Card key={asset.id} className="border-slate-700 bg-slate-900/50 hover:bg-slate-900/70 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <TreeDeciduous className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{asset.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{asset.location}</span>
                    </div>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    asset.status === "Active" || asset.status === "활성"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-amber-500/20 text-amber-400"
                  }`}
                >
                  {asset.status}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">{language === "kr" ? "면적" : "Area"}</div>
                  <div className="text-sm font-semibold">{asset.area}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">{language === "kr" ? "수목 수" : "Trees"}</div>
                  <div className="text-sm font-semibold">{asset.trees.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    {language === "kr" ? "탄소 저장량" : "Carbon Stock"}
                  </div>
                  <div className="text-sm font-semibold">{asset.carbonStock}</div>
                </div>
                <div className="flex items-end justify-end">
                  <Button variant="outline" size="sm">
                    {language === "kr" ? "상세보기" : "View Details"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
