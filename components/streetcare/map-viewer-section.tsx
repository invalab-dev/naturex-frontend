"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Layers, Filter, Database, Sparkles } from "lucide-react"
import { InteractiveMap } from "./interactive-map"

interface TreeData {
  id: string
  name: string
  species: string
  riskLevel: string
  lat: number
  lng: number
  height: number
  dbh: number
  crownWidth: number
  lastInspection: string
  location: string
  dataSource: string
}

export function MapViewerSection() {
  const [showAnomalies, setShowAnomalies] = useState(false)
  const [selectedLayer, setSelectedLayer] = useState("rgb")
  const [selectedTree, setSelectedTree] = useState<TreeData | null>(null)

  const getDataSourceBadge = (source: string) => {
    switch (source) {
      case "invalab":
        return (
          <Badge variant="outline" className="bg-purple-500/10 text-purple-500 text-xs">
            <Database className="h-3 w-3 mr-1" />
            InvaLab Provided Data
          </Badge>
        )
      case "customer":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 text-xs">
            <Database className="h-3 w-3 mr-1" />
            Customer Provided Data
          </Badge>
        )
      case "ai":
        return (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 text-xs">
            <Sparkles className="h-3 w-3 mr-1" />
            AI Processed Result
          </Badge>
        )
      default:
        return null
    }
  }

  const getRiskBadge = (riskLevel: string) => {
    const colorClass =
      riskLevel === "Critical"
        ? "bg-red-500/10 text-red-500 border-red-500/20"
        : riskLevel === "High"
          ? "bg-orange-500/10 text-orange-500 border-orange-500/20"
          : riskLevel === "Medium"
            ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
            : "bg-green-500/10 text-green-500 border-green-500/20"

    return (
      <Badge variant="outline" className={colorClass}>
        {riskLevel}
      </Badge>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Map Viewer</h1>
          <p className="text-sm text-muted-foreground mt-1">Interactive geospatial analysis</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Switch id="anomalies" checked={showAnomalies} onCheckedChange={setShowAnomalies} />
            <Label htmlFor="anomalies" className="text-sm">
              Anomalies Only
            </Label>
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Map Layers & Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Layer Selection</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="rgb" className="text-sm font-normal">
                      RGB Imagery
                    </Label>
                    <Badge variant="outline" className="bg-purple-500/10 text-purple-500 text-[10px] px-1 py-0">
                      InvaLab
                    </Badge>
                  </div>
                  <Switch id="rgb" checked={selectedLayer === "rgb"} onCheckedChange={() => setSelectedLayer("rgb")} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="ndvi" className="text-sm font-normal">
                      NDVI
                    </Label>
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 text-[10px] px-1 py-0">
                      AI
                    </Badge>
                  </div>
                  <Switch
                    id="ndvi"
                    checked={selectedLayer === "ndvi"}
                    onCheckedChange={() => setSelectedLayer("ndvi")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="dem" className="text-sm font-normal">
                    DEM
                  </Label>
                  <Switch id="dem" checked={selectedLayer === "dem"} onCheckedChange={() => setSelectedLayer("dem")} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="chm" className="text-sm font-normal">
                    CHM
                  </Label>
                  <Switch id="chm" checked={selectedLayer === "chm"} onCheckedChange={() => setSelectedLayer("chm")} />
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t">
              <Label className="text-sm font-medium">Filter by Species</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Species</SelectItem>
                  <SelectItem value="zelkova">느티나무</SelectItem>
                  <SelectItem value="ginkgo">은행나무</SelectItem>
                  <SelectItem value="cherry">왕벚나무</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3 pt-3 border-t">
              <Label className="text-sm font-medium">Filter by Risk</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3 pt-3 border-t">
              <Label className="text-sm font-medium">Heatmap Options</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="tilt" className="text-sm font-normal">
                    Tilt Change
                  </Label>
                  <Switch id="tilt" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="pest-cluster" className="text-sm font-normal">
                    Pest Cluster
                  </Label>
                  <Switch id="pest-cluster" />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t">
              <Button className="w-full bg-transparent" variant="outline">
                Show Work Route
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Map Display and Tree Information */}
        <div className="lg:col-span-3 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardContent className="p-0">
                <div className="aspect-[16/10] rounded-md overflow-hidden">
                  <InteractiveMap onTreeSelect={setSelectedTree} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Tree Information</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedTree ? (
                  <div className="space-y-3">
                    <div>
                      <div className="font-mono text-xs text-muted-foreground">Tree ID</div>
                      <div className="font-semibold">{selectedTree.id}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Species</div>
                      <div className="text-sm">{selectedTree.name}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Location</div>
                      <div className="text-sm">{selectedTree.location}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Risk Level</div>
                      <div className="mt-1">{getRiskBadge(selectedTree.riskLevel)}</div>
                    </div>
                    <div className="pt-2 border-t space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Height</span>
                        <span className="font-medium">{selectedTree.height}m</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">DBH</span>
                        <span className="font-medium">{selectedTree.dbh}cm</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Crown Width</span>
                        <span className="font-medium">{selectedTree.crownWidth}m</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Last Inspection</span>
                        <span className="font-medium">{selectedTree.lastInspection}</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="text-xs text-muted-foreground mb-2">Data Source</div>
                      {getDataSourceBadge(selectedTree.dataSource)}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground text-center py-8">
                    Click a tree marker on the map to view details
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Legend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Map Legend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow"></div>
                    <span className="text-sm">Low Risk</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-amber-500 border-2 border-white shadow"></div>
                    <span className="text-sm">Medium Risk</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-orange-500 border-2 border-white shadow"></div>
                    <span className="text-sm">High Risk</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow"></div>
                    <span className="text-sm">Critical Risk</span>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Data Sources</p>
                  <div className="flex flex-wrap gap-2">
                    {getDataSourceBadge("invalab")}
                    {getDataSourceBadge("customer")}
                    {getDataSourceBadge("ai")}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
