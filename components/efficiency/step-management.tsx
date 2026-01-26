"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EfficiencyCostInsights } from "./cost-insights"
import { EfficiencyPriorityActions } from "./priority-actions"
import { EfficiencyReports } from "./reports"
import { VegetationStructureAnalysis } from "./vegetation-analysis"

interface StepManagementProps {
  language: "kr" | "en"
}

export function StepManagement({ language }: StepManagementProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{language === "kr" ? "관리 단계" : "Management Stage"}</h1>
        <p className="text-gray-600 mt-2 leading-relaxed">
          {language === "kr"
            ? "식생 분석, 비용 관리, 우선순위, 리포팅"
            : "Vegetation analysis, cost management, priorities, reporting"}
        </p>
      </div>

      {/* Management Tabs */}
      <Tabs defaultValue="vegetation" className="space-y-6">
        <TabsList className="bg-white border-2 border-blue-200">
          <TabsTrigger value="vegetation">{language === "kr" ? "식생 구조 분석" : "Vegetation Analysis"}</TabsTrigger>
          <TabsTrigger value="cost">{language === "kr" ? "비용 관리" : "Cost Management"}</TabsTrigger>
          <TabsTrigger value="priority">{language === "kr" ? "우선 관리 목록" : "Priority List"}</TabsTrigger>
          <TabsTrigger value="report">{language === "kr" ? "리포트 생성" : "Generate Report"}</TabsTrigger>
        </TabsList>

        <TabsContent value="vegetation">
          <VegetationStructureAnalysis language={language} />
        </TabsContent>

        <TabsContent value="cost">
          <EfficiencyCostInsights />
        </TabsContent>

        <TabsContent value="priority">
          <EfficiencyPriorityActions />
        </TabsContent>

        <TabsContent value="report">
          <EfficiencyReports />
        </TabsContent>
      </Tabs>
    </div>
  )
}
