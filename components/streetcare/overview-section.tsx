'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Calendar, Bug, TrendingUp } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';

const healthData = [
  { name: 'Excellent', value: 340, color: '#10b981' },
  { name: 'Good', value: 520, color: '#3b82f6' },
  { name: 'Fair', value: 280, color: '#f59e0b' },
  { name: 'Poor', value: 150, color: '#ef4444' },
  { name: 'Dead', value: 30, color: '#6b7280' },
];

const riskData = [
  { name: 'Low', count: 580 },
  { name: 'Medium', count: 420 },
  { name: 'High', count: 240 },
  { name: 'Critical', count: 80 },
];

const trendData = [
  { month: 'Jan', height: 12.5, dbh: 28.3 },
  { month: 'Feb', height: 12.6, dbh: 28.5 },
  { month: 'Mar', height: 12.8, dbh: 28.7 },
  { month: 'Apr', height: 13.1, dbh: 29.0 },
  { month: 'May', height: 13.3, dbh: 29.2 },
  { month: 'Jun', height: 13.5, dbh: 29.5 },
];

export function OverviewSection() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Comprehensive tree management dashboard
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Urgent Action Required
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">23</div>
            <p className="text-xs text-muted-foreground mt-1">
              Trees requiring immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Inspection Due
            </CardTitle>
            <Calendar className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">87</div>
            <p className="text-xs text-muted-foreground mt-1">
              Trees due for inspection this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Detected Pest Types
            </CardTitle>
            <Bug className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active pest species identified
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Grade Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Health Grade Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={healthData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label
                >
                  {healthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk Level Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Risk Level Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={riskData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Structural Change Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            LiDAR-Based Structural Change Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="height"
                stroke="#10b981"
                name="Height (m)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="dbh"
                stroke="#3b82f6"
                name="DBH (cm)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Minimap */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">City-Wide Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
              <img
                src="/city-map-with-tree-locations-markers.jpg"
                alt="City map"
                className="w-full h-full object-cover rounded-md"
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Data Sources Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-sm text-muted-foreground">LiDAR Scans</span>
              <span className="font-medium">1,320 datasets</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-sm text-muted-foreground">
                Drone Images
              </span>
              <span className="font-medium">4,850 images</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-sm text-muted-foreground">
                Manual Inspections
              </span>
              <span className="font-medium">987 reports</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-sm text-muted-foreground">
                Pest Detection AI
              </span>
              <span className="font-medium">2,340 analyses</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Last Updated
              </span>
              <span className="font-medium">2 hours ago</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
