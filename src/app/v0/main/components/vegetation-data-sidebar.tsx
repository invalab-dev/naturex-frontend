"use client"

import {ForwardRefExoticComponent, RefAttributes, useEffect, useRef, useState} from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  Filter,
  Download,
  Calendar,
  BarChart3,
  MapPin,
  Leaf,
  TreePine,
  Cross as Grass,
  Mountain, LucideProps,
} from "lucide-react"

interface VegetationDataSidebarProps {
  className?: string
}
type VegetationType = {
  id: string,
  name: string,
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>,
  color: string,
  percentage: number
}

export function VegetationDataSidebar({ className }: VegetationDataSidebarProps) {
  const [selectedRegion, setSelectedRegion] = useState("서울특별시")
  const [selectedVegetationTypes, setSelectedVegetationTypes] = useState<string[]>(["활엽수림"])
  const [dateRange, setDateRange] = useState({ start: "2024-01-01", end: "2024-12-31" })
  const [isLoading, setIsLoading] = useState(false)
  const [vegetationTypes, setVegetationTypes] = useState<null | VegetationType[]>(null)
  useEffect(() => {
    setVegetationTypes([
      { id: "deciduous", name: "활엽수림", icon: Leaf, color: "bg-green-500", percentage: Math.floor(Math.random() * 40) + 10 },
      { id: "coniferous", name: "침엽수림", icon: TreePine, color: "bg-emerald-600", percentage: Math.floor(Math.random() * 40) + 10 },
      { id: "mixed", name: "혼효림", icon: Mountain, color: "bg-teal-500", percentage: Math.floor(Math.random() * 40) + 10 },
      { id: "grassland", name: "초지", icon: Grass, color: "bg-lime-500", percentage: Math.floor(Math.random() * 40) + 10 },
    ]);
  }, []);

  const regions = [
    "서울특별시",
    "경기도",
    "강원도",
    "충청북도",
    "충청남도",
    "전라북도",
    "전라남도",
    "경상북도",
    "경상남도",
    "제주도",
  ]

  const handleVegetationTypeToggle = (typeId: string) => {
    setSelectedVegetationTypes((prev) =>
      prev.includes(typeId) ? prev.filter((id) => id !== typeId) : [...prev, typeId],
    )
  }

  const handleDataQuery = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  return (
    <Card className={`w-80 bg-card/95 backdrop-blur-sm border-border ${className}`}>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">식생 데이터 조회</h2>
        </div>

        {/* Region Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-muted-foreground">지역 선택</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-input text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
            >
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Range */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-muted-foreground">조사 기간</Label>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
                className="pl-10"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Vegetation Types */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-muted-foreground">식생 유형</Label>
          <div className="grid grid-cols-2 gap-2">
            {vegetationTypes?.map((type) => {
              const Icon = type.icon
              const isSelected = selectedVegetationTypes.includes(type.id)
              return (
                <button
                  key={type.id}
                  onClick={() => handleVegetationTypeToggle(type.id)}
                  className={`p-3 rounded-lg border transition-all ${
                    isSelected ? "border-primary bg-primary/10 text-primary" : "border-border bg-card hover:bg-muted"
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <Icon className="h-5 w-5" />
                    <span className="text-xs font-medium">{type.name}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <Separator />

        {/* Search Area */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-muted-foreground">상세 검색</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="지역명, 좌표 등으로 검색..." className="pl-10" />
          </div>
        </div>

        {/* Query Button */}
        <Button
          onClick={handleDataQuery}
          disabled={isLoading}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              데이터 조회 중...
            </>
          ) : (
            <>
              <Filter className="h-4 w-4 mr-2" />
              데이터 조회
            </>
          )}
        </Button>

        {/* Results Summary */}
        {!isLoading && (
          <div className="space-y-3">
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">조회 결과</span>
                <Badge variant="secondary">1,247개 지점</Badge>
              </div>

              {/* Data Distribution */}
              <div className="space-y-2">
                {vegetationTypes?.map((type) => {
                  return (
                    <div key={type.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{type.name}</span>
                        <span className="text-foreground font-medium">{type.percentage}%</span>
                      </div>
                      <Progress value={type.percentage} className="h-2" />
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Export Options */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <Download className="h-4 w-4 mr-1" />
                CSV
              </Button>
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <Download className="h-4 w-4 mr-1" />
                JSON
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
