"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const requestHistory = [
  {
    id: "REQ-001",
    location: "Gangnam-gu, Teheran-ro",
    requestedAt: "2025-01-10",
    serviceType: "Full LiDAR + Drone Survey",
    status: "Completed",
    estimatedDelivery: "2025-01-20",
  },
  {
    id: "REQ-002",
    location: "Songpa-gu, Olympic Park Area",
    requestedAt: "2025-01-08",
    serviceType: "Pest Detection Survey",
    status: "In Progress",
    estimatedDelivery: "2025-01-18",
  },
  {
    id: "REQ-003",
    location: "Jongno-gu, Downtown District",
    requestedAt: "2025-01-05",
    serviceType: "Risk Assessment",
    status: "Pending",
    estimatedDelivery: "2025-01-25",
  },
];

export function MonitorRequestSection() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Monitor Request</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Request professional monitoring services from InvaLab
        </p>
      </div>

      {/* Request Form */}
      <Card>
        <CardHeader>
          <CardTitle>New Monitoring Request</CardTitle>
          <CardDescription>
            Submit a request for professional tree monitoring and analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="service-type">Service Type</Label>
              <select
                id="service-type"
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
              >
                <option>Full LiDAR + Drone Survey</option>
                <option>Drone Imagery Only</option>
                <option>LiDAR Analysis Only</option>
                <option>Pest Detection Survey</option>
                <option>Risk Assessment</option>
                <option>Custom Service</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferred-date">Preferred Date</Label>
              <Input id="preferred-date" type="date" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location-input">Target Location</Label>
            <Input
              id="location-input"
              placeholder="e.g., Gangnam-gu, Teheran-ro, Seoul"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="area-size">Estimated Area Size (hectares)</Label>
            <Input id="area-size" type="number" placeholder="e.g., 5.5" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="special-requirements">Special Requirements</Label>
            <Textarea
              id="special-requirements"
              placeholder="Describe any specific requirements, focus areas, or concerns..."
              rows={4}
            />
          </div>

          <Button className="w-full">
            <Send className="h-4 w-4 mr-2" />
            Submit Request
          </Button>
        </CardContent>
      </Card>

      {/* Request History */}
      <Card>
        <CardHeader>
          <CardTitle>Request History</CardTitle>
          <CardDescription>
            Track your monitoring service requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Service Type</TableHead>
                <TableHead>Requested At</TableHead>
                <TableHead>Est. Delivery</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requestHistory.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-mono text-xs">
                    {request.id}
                  </TableCell>
                  <TableCell className="font-medium">
                    {request.location}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {request.serviceType}
                  </TableCell>
                  <TableCell className="text-sm">
                    {request.requestedAt}
                  </TableCell>
                  <TableCell className="text-sm">
                    {request.estimatedDelivery}
                  </TableCell>
                  <TableCell>
                    {request.status === "Completed" ? (
                      <Badge
                        variant="outline"
                        className="bg-green-500/10 text-green-500"
                      >
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    ) : request.status === "In Progress" ? (
                      <Badge
                        variant="outline"
                        className="bg-blue-500/10 text-blue-500"
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        In Progress
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-amber-500/10 text-amber-500"
                      >
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
