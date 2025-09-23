"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Layers,
  Info,
  Ruler,
  Square,
  MapPin,
  Pencil,
  Maximize,
  Navigation,
  Eye,
  EyeOff,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Share2,
} from "lucide-react"

interface MapOverlayControlsProps {
  className?: string
}

export function MapOverlayControls({ className }: MapOverlayControlsProps) {
  const [activeLayer, setActiveLayer] = useState<string>("vegetation")
  const [layerOpacity, setLayerOpacity] = useState<number>(80)
  const [activeTool, setActiveTool] = useState<string | null>(null)
  const [mapStyle, setMapStyle] = useState<string>("standard")
  const [isFullscreen, setIsFullscreen] = useState(false)

  const layers = [
    { id: "vegetation", name: "식생 분포", color: "bg-green-500", visible: true },
    { id: "elevation", name: "고도", color: "bg-amber-500", visible: false },
    { id: "water", name: "수계", color: "bg-blue-500", visible: true },
    { id: "roads", name: "도로", color: "bg-gray-500", visible: false },
  ]

  const tools = [
    { id: "measure-distance", name: "거리 측정", icon: Ruler },
    { id: "measure-area", name: "면적 측정", icon: Square },
    { id: "add-marker", name: "마커 추가", icon: MapPin },
    { id: "draw-polygon", name: "영역 그리기", icon: Pencil },
  ]

  const mapStyles = [
    { id: "standard", name: "표준" },
    { id: "satellite", name: "위성" },
    { id: "terrain", name: "지형" },
    { id: "hybrid", name: "하이브리드" },
  ]

  const toggleLayer = (layerId: string) => {
    // Toggle layer visibility logic here
    console.log(`Toggle layer: ${layerId}`)
  }

  const selectTool = (toolId: string) => {
    setActiveTool(activeTool === toolId ? null : toolId)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
    // Fullscreen logic here
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Control Panel */}
      <Card className="w-64 bg-card/95 backdrop-blur-sm border-border">
        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">지도 제어</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
              <Maximize className="h-4 w-4" />
            </Button>
          </div>

          {/* Map Style Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">지도 스타일</Label>
            <div className="grid grid-cols-2 gap-1">
              {mapStyles.map((style) => (
                <Button
                  key={style.id}
                  variant={mapStyle === style.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMapStyle(style.id)}
                  className="text-xs"
                >
                  {style.name}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Layer Controls */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-muted-foreground">레이어 관리</Label>
            {layers.map((layer) => (
              <div key={layer.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${layer.color}`}></div>
                    <span className="text-sm text-foreground">{layer.name}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => toggleLayer(layer.id)} className="h-6 w-6 p-0">
                    {layer.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3 text-muted-foreground" />}
                  </Button>
                </div>
                {layer.visible && (
                  <div className="ml-5 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">투명도</span>
                      <span className="text-foreground">{layerOpacity}%</span>
                    </div>
                    <Slider
                      value={[layerOpacity]}
                      onValueChange={(value) => setLayerOpacity(value[0])}
                      max={100}
                      step={10}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <Separator />

          {/* Drawing Tools */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-muted-foreground">도구</Label>
            <div className="grid grid-cols-2 gap-2">
              {tools.map((tool) => {
                const Icon = tool.icon
                return (
                  <Button
                    key={tool.id}
                    variant={activeTool === tool.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => selectTool(tool.id)}
                    className="flex flex-col gap-1 h-auto py-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-xs">{tool.name}</span>
                  </Button>
                )
              })}
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Action Buttons */}
      <div className="flex flex-col gap-2">
        <Button variant="outline" size="sm" className="w-12 h-12 p-0 bg-card/95 backdrop-blur-sm border-border">
          <ZoomIn className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="sm" className="w-12 h-12 p-0 bg-card/95 backdrop-blur-sm border-border">
          <ZoomOut className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="sm" className="w-12 h-12 p-0 bg-card/95 backdrop-blur-sm border-border">
          <Navigation className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="sm" className="w-12 h-12 p-0 bg-card/95 backdrop-blur-sm border-border">
          <RotateCcw className="h-5 w-5" />
        </Button>
      </div>

      {/* Legend Panel */}
      <Card className="w-64 bg-card/95 backdrop-blur-sm border-border">
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">범례</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-600 rounded"></div>
                <span className="text-sm text-foreground">활엽수림</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                45%
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-emerald-700 rounded"></div>
                <span className="text-sm text-foreground">침엽수림</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                32%
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-teal-500 rounded"></div>
                <span className="text-sm text-foreground">혼효림</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                18%
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-lime-500 rounded"></div>
                <span className="text-sm text-foreground">초지</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                5%
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Export Panel */}
      <Card className="w-64 bg-card/95 backdrop-blur-sm border-border">
        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-foreground">내보내기</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
              <Download className="h-4 w-4 mr-1" />
              이미지
            </Button>
            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
              <Share2 className="h-4 w-4 mr-1" />
              공유
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
