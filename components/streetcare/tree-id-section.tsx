"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Activity } from "lucide-react"
import { SvgParcelMap } from "./svg-parcel-map"

interface Tree {
  id: string
  parcelId: string
  species: string
  height: number
  dbh: number
  crownWidth: number
  risk: "Low" | "Medium" | "High" | "Critical"
  lat: number
  lng: number
  lastInspection: string
  priorityScore: number
  riskReasons: {
    type: "LiDAR" | "RGB"
    reason: string
  }[]
  maintenanceAction: string
}

interface Parcel {
  id: string
  name: string
  address: string
  treeCount: number
  highestRisk: "Low" | "Medium" | "High" | "Critical"
  avgHeight: number
  avgDbh: number
  highRiskCount: number
  polygon: { lat: number; lng: number }[]
}

const parcels: Parcel[] = [
  {
    id: "P-001",
    name: "강남대로 A구간",
    address: "강남구 역삼동 142-5",
    treeCount: 12,
    highestRisk: "High",
    avgHeight: 14.2,
    avgDbh: 38.5,
    highRiskCount: 3,
    polygon: [
      { lat: 37.5, lng: 127.0 },
      { lat: 37.501, lng: 127.0005 },
      { lat: 37.5015, lng: 127.002 },
      { lat: 37.5005, lng: 127.0025 },
      { lat: 37.5, lng: 127.002 },
    ],
  },
  {
    id: "P-002",
    name: "서초대로 B구간",
    address: "서초구 서초동 89-12",
    treeCount: 8,
    highestRisk: "Critical",
    avgHeight: 12.8,
    avgDbh: 35.2,
    highRiskCount: 5,
    polygon: [
      { lat: 37.498, lng: 127.001 },
      { lat: 37.4985, lng: 127.0008 },
      { lat: 37.499, lng: 127.0015 },
      { lat: 37.4992, lng: 127.003 },
      { lat: 37.4985, lng: 127.0032 },
      { lat: 37.498, lng: 127.003 },
    ],
  },
  {
    id: "P-003",
    name: "여의도공원 C구간",
    address: "영등포구 여의도동 23-1",
    treeCount: 15,
    highestRisk: "Low",
    avgHeight: 10.5,
    avgDbh: 32.1,
    highRiskCount: 0,
    polygon: [
      { lat: 37.502, lng: 127.0 },
      { lat: 37.5025, lng: 127.0002 },
      { lat: 37.503, lng: 127.0008 },
      { lat: 37.5032, lng: 127.0018 },
      { lat: 37.5025, lng: 127.002 },
      { lat: 37.502, lng: 127.0015 },
    ],
  },
  {
    id: "P-004",
    name: "한강대교 D구간",
    address: "용산구 이촌동 56-3",
    treeCount: 10,
    highestRisk: "Medium",
    avgHeight: 11.8,
    avgDbh: 34.7,
    highRiskCount: 2,
    polygon: [
      { lat: 37.4965, lng: 127.0 },
      { lat: 37.497, lng: 127.0005 },
      { lat: 37.4972, lng: 127.0012 },
      { lat: 37.4968, lng: 127.0018 },
      { lat: 37.4963, lng: 127.0015 },
    ],
  },
]

const trees: Tree[] = [
  {
    id: "TR-001",
    parcelId: "P-001",
    species: "느티나무",
    height: 15.2,
    dbh: 42.5,
    crownWidth: 8.3,
    risk: "High",
    lat: 37.5005,
    lng: 127.001,
    lastInspection: "2025-01-15",
    priorityScore: 78,
    riskReasons: [
      { type: "LiDAR", reason: "Excessive trunk tilt detected (12° from vertical)" },
      { type: "LiDAR", reason: "Canopy asymmetry / crown imbalance" },
      { type: "RGB", reason: "Visible bark damage or dark lesions" },
    ],
    maintenanceAction: "Heavy pruning and structural support recommended within 2 weeks",
  },
  {
    id: "TR-002",
    parcelId: "P-001",
    species: "은행나무",
    height: 12.8,
    dbh: 38.2,
    crownWidth: 7.1,
    risk: "Medium",
    lat: 37.5008,
    lng: 127.0012,
    lastInspection: "2025-01-10",
    priorityScore: 52,
    riskReasons: [
      { type: "RGB", reason: "Leaf discoloration / chlorosis detected" },
      { type: "LiDAR", reason: "Significant canopy gap or broken branches" },
    ],
    maintenanceAction: "Light pruning and health monitoring",
  },
  {
    id: "TR-003",
    parcelId: "P-002",
    species: "왕벚나무",
    height: 9.5,
    dbh: 28.7,
    crownWidth: 6.4,
    risk: "Critical",
    lat: 37.4985,
    lng: 127.002,
    lastInspection: "2025-01-20",
    priorityScore: 92,
    riskReasons: [
      { type: "LiDAR", reason: "Abnormal height-to-DBH ratio (slenderness issue)" },
      { type: "RGB", reason: "Localized defoliation (crown thinning)" },
      { type: "RGB", reason: "Visible bark damage or dark lesions" },
      { type: "LiDAR", reason: "Excessive trunk tilt detected (18° from vertical)" },
    ],
    maintenanceAction: "Removal recommended - structural failure risk",
  },
  {
    id: "TR-004",
    parcelId: "P-001",
    species: "플라타너스",
    height: 13.5,
    dbh: 40.1,
    crownWidth: 7.8,
    risk: "Low",
    lat: 37.5012,
    lng: 127.0018,
    lastInspection: "2025-01-18",
    priorityScore: 28,
    riskReasons: [{ type: "LiDAR", reason: "Minor canopy gap detected" }],
    maintenanceAction: "Routine monitoring sufficient",
  },
]

const latLngToSvgCoords = (lat: number, lng: number) => {
  const x = (lng - 126.998) * 10000 + 100
  const y = (37.512 - lat) * 10000 + 50
  return { x, y }
}

const svgParcels = parcels.map((p) => ({
  id: p.id,
  name: p.name,
  riskLevel: p.highestRisk,
  points: p.polygon.map((point) => latLngToSvgCoords(point.lat, point.lng)),
}))

const svgTrees = trees.map((t) => {
  const coords = latLngToSvgCoords(t.lat, t.lng)
  return {
    id: t.id,
    parcelId: t.parcelId,
    species: t.species,
    x: coords.x,
    y: coords.y,
    height: t.height,
    dbh: t.dbh,
    risk: t.risk,
  }
})

export function TreeIdSection() {
  const [selectedParcel, setSelectedParcel] = useState<Parcel>(parcels[0])
  const [selectedTree, setSelectedTree] = useState<Tree | null>(null)
  const [riskFilter, setRiskFilter] = useState("all")
  const [speciesFilter, setSpeciesFilter] = useState("all")

  const treesInParcel = trees.filter((tree) => {
    if (tree.parcelId !== selectedParcel.id) return false
    if (riskFilter !== "all" && tree.risk.toLowerCase() !== riskFilter) return false
    if (speciesFilter !== "all" && tree.species !== speciesFilter) return false
    return true
  })

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "Medium":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20"
      case "High":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20"
      case "Critical":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return ""
    }
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Top: Full-width Parcel Map (45% height) */}
      <div className="h-[45%] border-b">
        <div className="h-full p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-foreground">Locations</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Parcel-based tree management view</p>
            </div>
            <div className="flex items-center gap-2">
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="w-36 h-8 text-xs">
                  <SelectValue placeholder="Risk Level" />
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
          </div>

          <div className="w-full h-[calc(100%-3rem)]">
            <SvgParcelMap
              parcels={svgParcels}
              trees={svgTrees}
              selectedParcelId={selectedParcel.id}
              onSelectParcel={(parcelId) => {
                const parcel = parcels.find((p) => p.id === parcelId)
                if (parcel) {
                  setSelectedParcel(parcel)
                  setSelectedTree(null)
                }
              }}
              selectedTreeId={selectedTree?.id}
              onSelectTree={(treeId) => {
                const tree = trees.find((t) => t.id === treeId)
                if (tree) setSelectedTree(tree)
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom: 2-column layout (Tree List | Tree Details) */}
      <div className="flex-1 grid grid-cols-2 gap-4 p-4 overflow-hidden">
        {/* Left: Tree List */}
        <Card className="flex flex-col overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <span>Trees in {selectedParcel.name}</span>
              <Badge variant="outline">{treesInParcel.length} trees</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-background">
                  <tr className="border-b">
                    <th className="text-left py-2 px-2 font-medium text-xs">Tree ID</th>
                    <th className="text-left py-2 px-2 font-medium text-xs">Species</th>
                    <th className="text-left py-2 px-2 font-medium text-xs">Height (m)</th>
                    <th className="text-left py-2 px-2 font-medium text-xs">DBH (cm)</th>
                    <th className="text-left py-2 px-2 font-medium text-xs">Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {treesInParcel.map((tree) => {
                    const isSelected = selectedTree?.id === tree.id
                    return (
                      <tr
                        key={tree.id}
                        className={`border-b cursor-pointer transition-colors ${
                          isSelected ? "bg-muted" : "hover:bg-muted/50"
                        }`}
                        onClick={() => setSelectedTree(tree)}
                      >
                        <td className="py-2 px-2 font-mono text-xs">{tree.id}</td>
                        <td className="py-2 px-2 text-xs">{tree.species}</td>
                        <td className="py-2 px-2 text-xs">{tree.height}</td>
                        <td className="py-2 px-2 text-xs">{tree.dbh}</td>
                        <td className="py-2 px-2">
                          <Badge variant="outline" className={`${getRiskColor(tree.risk)} text-xs cursor-pointer`}>
                            {tree.risk}
                          </Badge>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Right: Tree Details */}
        <Card className="flex flex-col overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              {selectedTree ? (
                <>
                  <AlertTriangle className="h-4 w-4 text-primary" />
                  Tree Details: {selectedTree.id}
                </>
              ) : (
                "Select a tree to view details"
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            {selectedTree ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Species</div>
                    <div className="text-sm font-medium">{selectedTree.species}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Priority Score</div>
                    <div className="text-sm font-bold text-primary">{selectedTree.priorityScore}/100</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Height</div>
                    <div className="text-sm font-medium">{selectedTree.height} m</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">DBH</div>
                    <div className="text-sm font-medium">{selectedTree.dbh} cm</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Crown Width</div>
                    <div className="text-sm font-medium">{selectedTree.crownWidth} m</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Last Inspection</div>
                    <div className="text-sm font-medium">{selectedTree.lastInspection}</div>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <div className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Risk Reasons (LiDAR & RGB based)
                  </div>
                  <div className="space-y-2.5">
                    {selectedTree.riskReasons.map((reason, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs">
                        <Badge
                          variant="outline"
                          className={
                            reason.type === "LiDAR"
                              ? "bg-blue-500/10 text-blue-500 border-blue-500/20 text-[10px] px-2 py-0.5 flex-shrink-0"
                              : "bg-purple-500/10 text-purple-500 border-purple-500/20 text-[10px] px-2 py-0.5 flex-shrink-0"
                          }
                        >
                          {reason.type}
                        </Badge>
                        <span className="text-muted-foreground flex-1 leading-relaxed">{reason.reason}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <div className="text-sm font-semibold mb-2">Predicted Maintenance Action</div>
                  <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg leading-relaxed">
                    {selectedTree.maintenanceAction}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                Click on a tree in the list or map to view detailed information
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
