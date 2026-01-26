"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Calendar, TrendingUp } from "lucide-react"

const availableReports = [
  {
    id: 1,
    title: "Safety Grade Report",
    description: "Comprehensive safety assessment and grade classification for all trees",
    lastGenerated: "2025-01-20",
    type: "Safety",
    size: "2.4 MB",
  },
  {
    id: 2,
    title: "Pest Detection Report",
    description: "AI-analyzed pest identification and infestation severity mapping",
    lastGenerated: "2025-01-18",
    type: "Health",
    size: "1.8 MB",
  },
  {
    id: 3,
    title: "Hotspot Analysis Report",
    description: "Geographic clustering of high-risk areas requiring immediate attention",
    lastGenerated: "2025-01-15",
    type: "Analysis",
    size: "3.1 MB",
  },
  {
    id: 4,
    title: "Structural LiDAR Analysis",
    description: "Detailed structural measurements and change detection from LiDAR data",
    lastGenerated: "2025-01-12",
    type: "Technical",
    size: "5.7 MB",
  },
  {
    id: 5,
    title: "Monthly Maintenance Plan",
    description: "Scheduled maintenance activities and resource allocation for next 30 days",
    lastGenerated: "2025-01-10",
    type: "Planning",
    size: "1.2 MB",
  },
  {
    id: 6,
    title: "Quarterly Assessment Summary",
    description: "Executive summary of tree conditions and management outcomes Q1 2025",
    lastGenerated: "2025-01-05",
    type: "Summary",
    size: "890 KB",
  },
]

export function ReportsSection() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Generate and export analysis reports</p>
        </div>
        <Button className="bg-primary">
          <FileText className="h-4 w-4 mr-2" />
          Auto-Generate Report
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:border-primary cursor-pointer transition-colors">
          <CardContent className="pt-6 text-center">
            <FileText className="h-8 w-8 mx-auto mb-3 text-primary" />
            <div className="font-medium text-sm">Trees Requiring Action</div>
            <p className="text-xs text-muted-foreground mt-1">23 trees identified</p>
          </CardContent>
        </Card>

        <Card className="hover:border-primary cursor-pointer transition-colors">
          <CardContent className="pt-6 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-3 text-amber-500" />
            <div className="font-medium text-sm">Risk Trend Report</div>
            <p className="text-xs text-muted-foreground mt-1">Last 6 months</p>
          </CardContent>
        </Card>

        <Card className="hover:border-primary cursor-pointer transition-colors">
          <CardContent className="pt-6 text-center">
            <Calendar className="h-8 w-8 mx-auto mb-3 text-green-500" />
            <div className="font-medium text-sm">Inspection Schedule</div>
            <p className="text-xs text-muted-foreground mt-1">Next 30 days</p>
          </CardContent>
        </Card>

        <Card className="hover:border-primary cursor-pointer transition-colors">
          <CardContent className="pt-6 text-center">
            <Download className="h-8 w-8 mx-auto mb-3 text-blue-500" />
            <div className="font-medium text-sm">Export All Data</div>
            <p className="text-xs text-muted-foreground mt-1">CSV format</p>
          </CardContent>
        </Card>
      </div>

      {/* Available Reports List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Available Reports ({availableReports.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {availableReports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-2 bg-primary/10 rounded-md">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{report.title}</div>
                    <p className="text-xs text-muted-foreground mt-1">{report.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {report.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">Last generated: {report.lastGenerated}</span>
                      <span className="text-xs text-muted-foreground">{report.size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    CSV
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Custom Report Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Create a custom report by selecting specific data ranges, tree groups, and analysis types.
          </p>
          <Button variant="outline">Configure Custom Report</Button>
        </CardContent>
      </Card>
    </div>
  )
}
