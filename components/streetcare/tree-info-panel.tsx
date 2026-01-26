"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TreeTable } from "./tree-table"
import { TreeHeightChart } from "./tree-height-chart"
import { AlertCircle, TreePine, Ruler, Maximize2 } from "lucide-react"

interface TreeInfoPanelProps {
  treeId: string | null
}

const treeDetails = {
  "TR-001": {
    species: "Ginkgo biloba",
    height: 12.5,
    crownWidth: 8.2,
    dbh: 35.4,
    risk: "Low",
    health: "Excellent",
    lastInspection: "2025-11-20",
  },
  "TR-002": {
    species: "Prunus serrulata",
    height: 9.8,
    crownWidth: 6.5,
    dbh: 28.3,
    risk: "Medium",
    health: "Good",
    lastInspection: "2025-11-18",
  },
  "TR-003": {
    species: "Pinus densiflora",
    height: 15.2,
    crownWidth: 9.8,
    dbh: 42.1,
    risk: "High",
    health: "Fair",
    lastInspection: "2025-11-15",
  },
}

export function TreeInfoPanel({ treeId }: TreeInfoPanelProps) {
  const defaultTree = treeDetails["TR-001"]
  const tree = treeId && treeId in treeDetails ? treeDetails[treeId as keyof typeof treeDetails] : defaultTree
  const displayId = treeId && treeId in treeDetails ? treeId : "TR-001"

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Tree Details Card */}
      <Card>
        <CardHeader className="border-b border-border">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">Tree Information</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{displayId}</p>
            </div>
            <Badge variant={tree.risk === "High" ? "destructive" : tree.risk === "Medium" ? "secondary" : "default"}>
              {tree.risk} Risk
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <TreePine className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">{tree.species}</p>
                <p className="text-xs text-muted-foreground">Species</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <Ruler size={14} className="text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Height</p>
                </div>
                <p className="text-lg font-semibold">{tree.height}m</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <Maximize2 size={14} className="text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Crown Width</p>
                </div>
                <p className="text-lg font-semibold">{tree.crownWidth}m</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <AlertCircle size={14} className="text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">DBH</p>
                </div>
                <p className="text-lg font-semibold">{tree.dbh}cm</p>
              </div>
            </div>

            <div className="pt-4 border-t border-border space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Health Status</span>
                <span className="text-sm font-medium">{tree.health}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Last Inspection</span>
                <span className="text-sm font-medium">{tree.lastInspection}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Tabs */}
      <Card className="flex-1 flex flex-col">
        <Tabs defaultValue="table" className="flex flex-col h-full">
          <CardHeader className="border-b border-border pb-3">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="table">Tree List</TabsTrigger>
              <TabsTrigger value="chart">Height Distribution</TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent className="flex-1 pt-4 overflow-auto">
            <TabsContent value="table" className="mt-0">
              <TreeTable />
            </TabsContent>
            <TabsContent value="chart" className="mt-0">
              <TreeHeightChart />
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  )
}
