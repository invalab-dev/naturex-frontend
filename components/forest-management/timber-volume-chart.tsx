"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

const volumeData = [
  { species: "소나무", volume: 1240, growth: 85 },
  { species: "상수리나무", volume: 890, growth: 62 },
  { species: "잣나무", volume: 780, growth: 48 },
  { species: "일본잎갈나무", volume: 230, growth: 28 },
  { species: "전나무", volume: 100, growth: 12 },
]

export function TimberVolumeChart() {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-semibold mb-1">Timber Volume by Species</h4>
        <p className="text-xs text-muted-foreground">Standing volume (m³) and annual growth rate</p>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={volumeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="species" tick={{ fontSize: 11 }} stroke="hsl(var(--foreground))" />
            <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
            />
            <Legend />
            <Bar dataKey="volume" fill="hsl(var(--primary))" name="Volume (m³)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="growth" fill="hsl(var(--chart-2))" name="Annual Growth (m³)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
        <div>
          <div className="text-xs text-muted-foreground mb-1">Total Standing Volume</div>
          <div className="text-2xl font-bold">3,240 m³</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">Annual Growth Rate</div>
          <div className="text-2xl font-bold">235 m³/yr</div>
        </div>
      </div>
    </div>
  )
}
