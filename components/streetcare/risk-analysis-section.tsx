"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const riskTrend = [
  { month: "Jan", risk: 45 },
  { month: "Feb", risk: 48 },
  { month: "Mar", risk: 52 },
  { month: "Apr", risk: 55 },
  { month: "May", risk: 58 },
  { month: "Jun", risk: 62 },
];

const riskBreakdown = [
  { category: "Structural", value: 72, max: 100 },
  { category: "Pest/Disease", value: 58, max: 100 },
  { category: "Environment", value: 45, max: 100 },
  { category: "Incident History", value: 35, max: 100 },
];

export function RiskAnalysisSection() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Risk Analysis</h1>
        <p className="text-sm text-muted-foreground mt-1">
          AI-powered risk assessment and predictions
        </p>
      </div>

      {/* Risk Score Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Risk Score Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Structural Risk */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Structural (40%)</span>
                <span className="text-sm font-bold text-orange-500">
                  72/100
                </span>
              </div>
              <Progress value={72} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Based on LiDAR tilt, crack detection, and stability analysis
              </p>
            </div>

            {/* Pest/Disease Risk */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Pest/Disease (30%)</span>
                <span className="text-sm font-bold text-amber-500">58/100</span>
              </div>
              <Progress value={58} className="h-2" />
              <p className="text-xs text-muted-foreground">
                AI-detected pest signs and disease symptoms
              </p>
            </div>

            {/* Environmental Risk */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Environmental (20%)</span>
                <span className="text-sm font-bold text-green-500">45/100</span>
              </div>
              <Progress value={45} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Soil quality, drainage, and urban stress factors
              </p>
            </div>

            {/* Incident Correlation Risk */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  Past Incidents (10%)
                </span>
                <span className="text-sm font-bold text-blue-500">35/100</span>
              </div>
              <Progress value={35} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Historical damage and maintenance records
              </p>
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-base font-semibold">
                  Overall Risk Score
                </span>
                <Badge
                  variant="outline"
                  className="bg-orange-500/10 text-orange-500 text-base px-3 py-1"
                >
                  62/100
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Risk Trend Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={riskTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="risk"
                  stroke="#f59e0b"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-sm text-muted-foreground mt-4">
              Risk level has increased by{" "}
              <span className="font-semibold text-orange-500">17 points</span>{" "}
              over the last 6 months, indicating deteriorating conditions.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations */}
      <Card className="border-primary/50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-primary" />
            AI-Generated Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-sm">Pruning Required</div>
              <p className="text-sm text-muted-foreground mt-1">
                Tree TR-001 requires immediate crown reduction pruning to reduce
                wind resistance and prevent branch failure. Recommended
                reduction: 15-20%.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-sm">Soil Improvement</div>
              <p className="text-sm text-muted-foreground mt-1">
                Apply organic mulch and soil amendments around trees TR-002,
                TR-005, TR-008 to improve drainage and nutrient availability.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-sm">
                Urgent Removal Recommended
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Tree TR-012 shows critical structural failure with 85% decay at
                base. Immediate removal advised to prevent safety hazard.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-sm">Pest Control Treatment</div>
              <p className="text-sm text-muted-foreground mt-1">
                7 trees show signs of bark beetle infestation. Schedule systemic
                insecticide treatment within 2 weeks to prevent spread.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Risk Comparison: Similar Species Average
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                느티나무 (Zelkova)
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">62</span>
                <span className="text-sm text-muted-foreground">
                  vs. 58 avg
                </span>
              </div>
              <Badge
                variant="outline"
                className="bg-orange-500/10 text-orange-500"
              >
                +4 above average
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                은행나무 (Ginkgo)
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">55</span>
                <span className="text-sm text-muted-foreground">
                  vs. 52 avg
                </span>
              </div>
              <Badge
                variant="outline"
                className="bg-amber-500/10 text-amber-500"
              >
                +3 above average
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                왕벚나무 (Cherry)
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">48</span>
                <span className="text-sm text-muted-foreground">
                  vs. 51 avg
                </span>
              </div>
              <Badge
                variant="outline"
                className="bg-green-500/10 text-green-500"
              >
                -3 below average
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
