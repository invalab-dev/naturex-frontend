"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileText, CheckCircle2, Clock, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const uploadHistory = [
  {
    id: "UP-001",
    filename: "drone_imagery_gangnam.tif",
    uploadedAt: "2025-01-15 14:32",
    size: "245 MB",
    status: "Completed",
    type: "Drone Imagery",
  },
  {
    id: "UP-002",
    filename: "lidar_scan_seoul_district3.las",
    uploadedAt: "2025-01-14 09:15",
    size: "1.2 GB",
    status: "Processing",
    type: "LiDAR Data",
  },
  {
    id: "UP-003",
    filename: "tree_inventory_manual.csv",
    uploadedAt: "2025-01-12 16:48",
    size: "5.3 MB",
    status: "Completed",
    type: "Manual Data",
  },
]

export function UploadDataSection() {
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    // Handle file upload logic here
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Upload Data</h1>
        <p className="text-sm text-muted-foreground mt-1">Upload your own tree monitoring data</p>
      </div>

      {/* Upload Zone */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Files</CardTitle>
          <CardDescription>Drag and drop files or click to browse</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm font-medium mb-1">Drop files here or click to upload</p>
            <p className="text-xs text-muted-foreground mb-4">Supported: .tif, .las, .laz, .csv, .xlsx</p>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Browse Files
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data-type">Data Type</Label>
              <select id="data-type" className="w-full h-10 px-3 rounded-md border border-input bg-background">
                <option>Drone Imagery</option>
                <option>LiDAR Scan</option>
                <option>Manual Measurement</option>
                <option>Photo Documentation</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location/District</Label>
              <Input id="location" placeholder="e.g., Gangnam-gu, Seoul" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload History */}
      <Card>
        <CardHeader>
          <CardTitle>My Uploads</CardTitle>
          <CardDescription>History of your uploaded data</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Upload ID</TableHead>
                <TableHead>Filename</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Uploaded At</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data Source</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {uploadHistory.map((upload) => (
                <TableRow key={upload.id}>
                  <TableCell className="font-mono text-xs">{upload.id}</TableCell>
                  <TableCell className="font-medium">{upload.filename}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{upload.type}</TableCell>
                  <TableCell className="text-sm">{upload.uploadedAt}</TableCell>
                  <TableCell className="text-sm">{upload.size}</TableCell>
                  <TableCell>
                    {upload.status === "Completed" ? (
                      <Badge variant="outline" className="bg-green-500/10 text-green-500">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
                        <Clock className="h-3 w-3 mr-1" />
                        Processing
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 text-xs">
                      Customer Provided Data
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
