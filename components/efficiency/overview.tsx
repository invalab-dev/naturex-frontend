"use client";

import {
  TreeDeciduous,
  AlertTriangle,
  TrendingDown,
  BarChart3,
  Activity,
  Database,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const healthScoreData = [
  { month: "Jan", health: 78, risk: 22 },
  { month: "Feb", health: 76, risk: 24 },
  { month: "Mar", health: 74, risk: 26 },
  { month: "Apr", health: 79, risk: 21 },
  { month: "May", health: 82, risk: 18 },
  { month: "Jun", health: 81, risk: 19 },
];

const ndviData = [
  { month: "Jan", ndvi: 0.62, ndre: 0.48 },
  { month: "Feb", ndvi: 0.58, ndre: 0.45 },
  { month: "Mar", ndvi: 0.71, ndre: 0.54 },
  { month: "Apr", ndvi: 0.76, ndre: 0.61 },
  { month: "May", ndvi: 0.82, ndre: 0.68 },
  { month: "Jun", ndvi: 0.79, ndre: 0.65 },
];

export function EfficiencyOverview() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-6">
          <div className="flex items-center gap-3 mb-2">
            <TreeDeciduous size={20} className="text-emerald-400" />
            <h3 className="text-sm font-medium text-muted-foreground">
              총 수목/자산 수
            </h3>
          </div>
          <p className="text-3xl font-bold text-foreground">2,847</p>
          <p className="text-xs text-slate-400 mt-1">Tree Count</p>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Activity size={20} className="text-blue-400" />
            <h3 className="text-sm font-medium text-muted-foreground">
              건강지수 평균
            </h3>
          </div>
          <p className="text-3xl font-bold text-foreground">78.4</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 bg-slate-800 rounded-full h-2">
              <div
                className="bg-blue-400 h-2 rounded-full"
                style={{ width: "78%" }}
              />
            </div>
            <span className="text-xs text-muted-foreground">78%</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle size={20} className="text-red-400" />
            <h3 className="text-sm font-medium text-muted-foreground">
              위험도 분포
            </h3>
          </div>
          <div className="space-y-1.5 mt-3">
            <div className="flex justify-between text-sm items-center">
              <span className="text-red-400 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400"></span>
                High
              </span>
              <span className="text-foreground font-semibold">512 (18%)</span>
            </div>
            <div className="flex justify-between text-sm items-center">
              <span className="text-yellow-400 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                Medium
              </span>
              <span className="text-foreground font-semibold">968 (34%)</span>
            </div>
            <div className="flex justify-between text-sm items-center">
              <span className="text-emerald-400 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                Low
              </span>
              <span className="text-foreground font-semibold">1,367 (48%)</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-emerald-700 bg-emerald-500/5 p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingDown size={20} className="text-emerald-400" />
            <h3 className="text-sm font-medium text-emerald-300">
              예상 비용 절감율
            </h3>
          </div>
          <p className="text-3xl font-bold text-emerald-400">43%</p>
          <p className="text-xs text-emerald-300/70 mt-1">
            연간 약 2.8억원 절감 가능
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 size={20} className="text-orange-400" />
            <h3 className="text-lg font-semibold text-foreground">
              Hotspot Count
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-300">Critical Hotspots</span>
              <span className="text-2xl font-bold text-red-400">24</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-300">Moderate Hotspots</span>
              <span className="text-2xl font-bold text-yellow-400">57</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-300">Low Priority Areas</span>
              <span className="text-2xl font-bold text-emerald-400">89</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Database size={20} className="text-blue-400" />
            <h3 className="text-lg font-semibold text-foreground">
              데이터 출처
            </h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-slate-300">
                드론 RGB 정사영상 (Orthomosaic)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              <span className="text-slate-300">항공 LiDAR Point Cloud</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span>
              <span className="text-slate-300">
                Multispectral TIFF (NDVI/NDRE)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-400"></span>
              <span className="text-slate-300">
                수목 현황 CSV (TreeID, XY, DBH)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
              <span className="text-slate-300">GIS 행정구역 Shapefile</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Health Score / Risk Score Timeline
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={healthScoreData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #475569",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#e2e8f0" }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="health"
              stroke="#10b981"
              strokeWidth={2}
              name="건강지수"
            />
            <Line
              type="monotone"
              dataKey="risk"
              stroke="#ef4444"
              strokeWidth={2}
              name="위험도"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          NDVI / NDRE Index Summary
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ndviData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" domain={[0, 1]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #475569",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#e2e8f0" }}
            />
            <Legend />
            <Bar dataKey="ndvi" fill="#22c55e" name="NDVI (식생지수)" />
            <Bar dataKey="ndre" fill="#a855f7" name="NDRE (엽록소)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
