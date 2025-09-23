"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  MapPin,
  Calendar,
  TrendingUp,
  Download,
  Share2,
  Camera,
  BarChart3,
  Leaf,
  TreePine,
  Mountain,
  Cross as Grass,
  X,
} from "lucide-react"

interface VegetationPoint {
  id: string
  coordinates: [number, number]
  address: string
  vegetationType: string
  coverage: number
  lastSurvey: string
  elevation: number
  soilType: string
  climateZone: string
}

interface VegetationDetailModalProps {
  isOpen: boolean
  onClose: () => void
  point: VegetationPoint | null
}

export function VegetationDetailModal({ isOpen, onClose, point }: VegetationDetailModalProps) {
  const [activeTab, setActiveTab] = useState("overview")

  if (!point) return null

  const vegetationIcons = {
    활엽수림: Leaf,
    침엽수림: TreePine,
    혼효림: Mountain,
    초지: Grass,
  }

  const VegetationIcon = vegetationIcons[point.vegetationType as keyof typeof vegetationIcons] || Leaf

  // Mock time series data
  const timeSeriesData = [
    { year: "2020", coverage: 65 },
    { year: "2021", coverage: 68 },
    { year: "2022", coverage: 72 },
    { year: "2023", coverage: 75 },
    { year: "2024", coverage: point.coverage },
  ]

  const speciesData = [
    { name: "소나무", percentage: 35, color: "bg-green-600" },
    { name: "참나무", percentage: 28, color: "bg-green-500" },
    { name: "자작나무", percentage: 20, color: "bg-emerald-500" },
    { name: "기타", percentage: 17, color: "bg-teal-500" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <VegetationIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl">식생 상세 정보</DialogTitle>
                <DialogDescription className="flex items-center gap-2 mt-1">
                  <MapPin className="h-4 w-4" />
                  {point.coordinates[0].toFixed(6)}°N, {point.coordinates[1].toFixed(6)}°E
                </DialogDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">개요</TabsTrigger>
            <TabsTrigger value="analysis">분석</TabsTrigger>
            <TabsTrigger value="timeline">시계열</TabsTrigger>
            <TabsTrigger value="images">이미지</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    기본 정보
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">주소</span>
                    <span className="text-foreground font-medium">{point.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">식생 유형</span>
                    <Badge variant="secondary">{point.vegetationType}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">피복률</span>
                    <span className="text-foreground font-medium">{point.coverage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">고도</span>
                    <span className="text-foreground font-medium">{point.elevation}m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">토양 유형</span>
                    <span className="text-foreground font-medium">{point.soilType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">기후대</span>
                    <span className="text-foreground font-medium">{point.climateZone}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Survey Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    조사 정보
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">최근 조사일</span>
                    <span className="text-foreground font-medium">{point.lastSurvey}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">조사 방법</span>
                    <span className="text-foreground font-medium">위성 영상 분석</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">정확도</span>
                    <span className="text-foreground font-medium">95.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">데이터 출처</span>
                    <span className="text-foreground font-medium">국립산림과학원</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Coverage Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">식생 피복률</CardTitle>
                <CardDescription>현재 지점의 식생 피복 현황</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>피복률</span>
                    <span className="font-medium">{point.coverage}%</span>
                  </div>
                  <Progress value={point.coverage} className="h-3" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            {/* Species Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  수종 분포
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {speciesData.map((species) => (
                  <div key={species.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground">{species.name}</span>
                      <span className="font-medium">{species.percentage}%</span>
                    </div>
                    <Progress value={species.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Environmental Factors */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">환경 요인</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">연평균 기온</span>
                  <span className="text-lg font-semibold">12.5°C</span>
                </div>
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">연강수량</span>
                  <span className="text-lg font-semibold">1,245mm</span>
                </div>
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">일조시간</span>
                  <span className="text-lg font-semibold">2,180시간</span>
                </div>
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">습도</span>
                  <span className="text-lg font-semibold">68%</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  피복률 변화 추이
                </CardTitle>
                <CardDescription>최근 5년간 식생 피복률 변화</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {timeSeriesData.map((data, index) => (
                    <div key={data.year} className="flex items-center gap-4">
                      <span className="text-sm font-medium w-12">{data.year}</span>
                      <div className="flex-1">
                        <Progress value={data.coverage} className="h-3" />
                      </div>
                      <span className="text-sm font-medium w-12">{data.coverage}%</span>
                      {index > 0 && (
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-green-500" />
                          <span className="text-xs text-green-500">
                            +{data.coverage - timeSeriesData[index - 1].coverage}%
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">변화 요인 분석</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">긍정적 요인</span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• 산림 보호 정책 강화</li>
                    <li>• 조림 사업 확대</li>
                    <li>• 기후 조건 개선</li>
                  </ul>
                </div>
                <div className="p-3 bg-amber-50 dark:bg-amber-950 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span className="text-sm font-medium">주의 요인</span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• 도시 개발 압력</li>
                    <li>• 기후 변화 영향</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="images" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  위성 이미지
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <img
                      src="/satellite-image-of-forest-vegetation.jpg"
                      alt="2024년 위성 이미지"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                    <p className="text-sm text-center text-muted-foreground">2024년 현재</p>
                  </div>
                  <div className="space-y-2">
                    <img
                      src="/satellite-image-of-forest-vegetation-historical.jpg"
                      alt="2020년 위성 이미지"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                    <p className="text-sm text-center text-muted-foreground">2020년 비교</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">현장 사진</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3].map((i) => (
                    <img
                      key={i}
                      src={`/forest-field-photo-.jpg?height=120&width=120&query=forest field photo ${i}`}
                      alt={`현장 사진 ${i}`}
                      className="w-full h-24 object-cover rounded-lg border"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Separator />

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">마지막 업데이트: {point.lastSurvey}</div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              보고서 다운로드
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              공유
            </Button>
            <Button size="sm">상세 분석 요청</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
