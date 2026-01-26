"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react"

const evaluationResults = [
  {
    category: "Biodiversity Index",
    value: "High",
    score: 8.4,
    status: "good",
    description: "Rich species diversity detected",
  },
  {
    category: "Habitat Quality",
    value: "Good",
    score: 7.2,
    status: "good",
    description: "Well-preserved forest structure",
  },
  {
    category: "Corridor Connectivity",
    value: "Moderate",
    score: 6.1,
    status: "warning",
    description: "Partial fragmentation observed",
  },
  {
    category: "Legal Compliance",
    value: "Alert",
    score: 4.8,
    status: "alert",
    description: "Grade I species in impact zone",
  },
  {
    category: "Buffer Zone Impact",
    value: "Moderate",
    score: 6.5,
    status: "warning",
    description: "30m buffer required",
  },
]

const protectedSpecies = [
  { name: "Pinus densiflora", korean: "소나무", grade: "I", count: 847 },
  { name: "Zelkova serrata", korean: "느티나무", grade: "I", count: 234 },
]

export function EvaluationResultsPanel() {
  return (
    <div className="h-full flex flex-col gap-4">
      <Card className="flex-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Evaluation Results</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100%-2rem)]">
            <div className="space-y-4 pr-4">
              {evaluationResults.map((result, index) => (
                <Card key={index} className="bg-muted/30 border-border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="text-sm font-medium mb-1">{result.category}</div>
                        <div className="text-xs text-muted-foreground">{result.description}</div>
                      </div>
                      {result.status === "good" && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                      {result.status === "warning" && <AlertTriangle className="w-5 h-5 text-yellow-500" />}
                      {result.status === "alert" && <AlertCircle className="w-5 h-5 text-red-500" />}
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={
                          result.status === "good"
                            ? "secondary"
                            : result.status === "warning"
                              ? "outline"
                              : "destructive"
                        }
                        className="text-xs"
                      >
                        {result.value}
                      </Badge>
                      <span className="text-sm font-semibold">{result.score}/10</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            Protected Species
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {protectedSpecies.map((species, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex-1">
                  <div className="font-medium text-xs">{species.name}</div>
                  <div className="text-xs text-muted-foreground">{species.korean}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive" className="text-xs">
                    Grade {species.grade}
                  </Badge>
                  <span className="text-xs font-medium w-12 text-right">{species.count}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
