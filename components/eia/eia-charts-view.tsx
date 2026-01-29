'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const ndviData = [
  { range: '0.0-0.2', count: 12 },
  { range: '0.2-0.4', count: 28 },
  { range: '0.4-0.6', count: 45 },
  { range: '0.6-0.8', count: 67 },
  { range: '0.8-1.0', count: 38 },
];

const habitatData = [
  { name: 'Forest', value: 45.2, color: '#059669' },
  { name: 'Grassland', value: 28.7, color: '#eab308' },
  { name: 'Wetland', value: 15.3, color: '#06b6d4' },
  { name: 'Urban', value: 10.8, color: '#6b7280' },
];

export function EIAChartsView() {
  return (
    <div className="h-full space-y-4 overflow-auto">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">NDVI Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ndviData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="range"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <YAxis
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                }}
              />
              <Bar
                dataKey="count"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Habitat Composition</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="60%" height={200}>
              <PieChart>
                <Pie
                  data={habitatData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                >
                  {habitatData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {habitatData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-2 text-sm"
                >
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="flex-1">{item.name}</span>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Patch Fragmentation Index</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Number of Patches
              </span>
              <span className="text-sm font-semibold">143</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Mean Patch Size
              </span>
              <span className="text-sm font-semibold">0.89 ha</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Fragmentation Score
              </span>
              <span className="text-sm font-semibold text-yellow-600">
                Moderate
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
