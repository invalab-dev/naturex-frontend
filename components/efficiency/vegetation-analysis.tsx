"use client"

import { useState } from "react"
import { Leaf, TreePine, Flower2, TrendingUp, AlertCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const vegetationStructureData = [
  { name: "Trees", value: 45, health: 78 },
  { name: "Shrubs", value: 25, health: 82 },
  { name: "Herbaceous", value: 18, health: 71 },
  { name: "Bare Ground", value: 8, health: 0 },
  { name: "Invasive Species", value: 4, health: 0 },
]

const heightDistributionData = [
  { range: "0-5m", count: 487 },
  { range: "5-10m", count: 842 },
  { range: "10-15m", count: 1024 },
  { range: "15-20m", count: 394 },
  { range: "20m+", count: 100 },
]

const biomassData = [
  { area: "Zone A", biomass: 142, lai: 4.2, carbon: 68 },
  { area: "Zone B", biomass: 178, lai: 5.1, carbon: 85 },
  { area: "Zone C", biomass: 96, lai: 3.4, carbon: 46 },
  { area: "Zone D", biomass: 203, lai: 5.8, carbon: 97 },
  { area: "Zone E", biomass: 134, lai: 4.5, carbon: 64 },
]

const invasiveHotspotsData = [
  { id: "HS-01", species: "Kudzu", coverage: 820, risk: "High", lat: 37.5665, lng: 126.978 },
  { id: "HS-02", species: "Japanese Knotweed", coverage: 540, risk: "High", lat: 37.5632, lng: 126.982 },
  { id: "HS-03", species: "Purple Loosestrife", coverage: 320, risk: "Medium", lat: 37.5698, lng: 126.975 },
  { id: "HS-04", species: "Garlic Mustard", coverage: 180, risk: "Medium", lat: 37.5621, lng: 126.981 },
]

const COLORS = ["#10b981", "#22c55e", "#86efac", "#94a3b8", "#ef4444"]

interface VegetationStructureAnalysisProps {
  language: "kr" | "en"
}

export function VegetationStructureAnalysis({ language }: VegetationStructureAnalysisProps) {
  const [activeSection, setActiveSection] = useState("summary")
  const [mapLayer, setMapLayer] = useState<"standard" | "satellite" | "terrain">("standard")

  const renderMapIframe = (center: [number, number], overlayType: string) => {
    return (
      <iframe
        srcDoc={`
          <!DOCTYPE html>
          <html>
            <head>
              <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
              <style>
                body { margin: 0; padding: 0; }
                #map { width: 100%; height: 100vh; }
              </style>
            </head>
            <body>
              <div id="map"></div>
              <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
              <script>
                const map = L.map('map').setView([${center[0]}, ${center[1]}], 13);
                
                const tileUrls = {
                  standard: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                  satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                  terrain: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
                };
                
                let currentLayer = '${mapLayer}';
                let tileLayer = L.tileLayer(tileUrls[currentLayer], {
                  attribution: '© OpenStreetMap contributors'
                }).addTo(map);
                
                // Overlay based on section type
                ${
                  overlayType === "vegetation"
                    ? `
                  const zones = [
                    { coords: [[37.570, 126.975], [37.570, 126.980], [37.568, 126.980], [37.568, 126.975]], color: '#10b981', label: 'Trees (45%)' },
                    { coords: [[37.565, 126.976], [37.565, 126.979], [37.563, 126.979], [37.563, 126.976]], color: '#22c55e', label: 'Shrubs (25%)' },
                    { coords: [[37.567, 126.982], [37.567, 126.985], [37.565, 126.985], [37.565, 126.982]], color: '#86efac', label: 'Herbaceous (18%)' }
                  ];
                  zones.forEach(zone => {
                    L.polygon(zone.coords, {
                      color: zone.color,
                      fillColor: zone.color,
                      fillOpacity: 0.4,
                      weight: 2
                    }).addTo(map).bindPopup(zone.label);
                  });
                `
                    : overlayType === "tree"
                      ? `
                  // Tree markers with height gradient
                  const trees = [
                    {lat: 37.5665, lng: 126.978, height: 15},
                    {lat: 37.5675, lng: 126.979, height: 12},
                    {lat: 37.5655, lng: 126.976, height: 8},
                    {lat: 37.5685, lng: 126.980, height: 18}
                  ];
                  trees.forEach(tree => {
                    const color = tree.height > 15 ? '#10b981' : tree.height > 10 ? '#22c55e' : '#86efac';
                    L.circleMarker([tree.lat, tree.lng], {
                      radius: 8,
                      fillColor: color,
                      color: '#fff',
                      weight: 2,
                      opacity: 1,
                      fillOpacity: 0.8
                    }).addTo(map).bindPopup('Height: ' + tree.height + 'm');
                  });
                `
                      : overlayType === "weed"
                        ? `
                  // Invasive species hotspots
                  const hotspots = [
                    {coords: [[37.568, 126.975], [37.568, 126.978], [37.566, 126.978], [37.566, 126.975]], risk: 'High'},
                    {coords: [[37.564, 126.980], [37.564, 126.982], [37.562, 126.982], [37.562, 126.980]], risk: 'Medium'}
                  ];
                  hotspots.forEach(hs => {
                    L.polygon(hs.coords, {
                      color: hs.risk === 'High' ? '#ef4444' : '#f59e0b',
                      fillColor: hs.risk === 'High' ? '#ef4444' : '#f59e0b',
                      fillOpacity: 0.3,
                      weight: 2
                    }).addTo(map).bindPopup(hs.risk + ' Risk Invasive Area');
                  });
                `
                        : `
                  // Biomass/productivity zones
                  const bioZones = [
                    {coords: [[37.570, 126.975], [37.570, 126.978], [37.568, 126.978], [37.568, 126.975]], value: 'High'},
                    {coords: [[37.565, 126.979], [37.565, 126.981], [37.563, 126.981], [37.563, 126.979]], value: 'Medium'},
                    {coords: [[37.567, 126.982], [37.567, 126.984], [37.565, 126.984], [37.565, 126.982]], value: 'Low'}
                  ];
                  bioZones.forEach(zone => {
                    const color = zone.value === 'High' ? '#10b981' : zone.value === 'Medium' ? '#f59e0b' : '#94a3b8';
                    L.polygon(zone.coords, {
                      color: color,
                      fillColor: color,
                      fillOpacity: 0.4,
                      weight: 2
                    }).addTo(map).bindPopup(zone.value + ' Biomass');
                  });
                `
                }
              </script>
            </body>
          </html>
        `}
        className="w-full h-full border-0"
        sandbox="allow-scripts allow-same-origin"
      />
    )
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeSection} onValueChange={setActiveSection}>
        <TabsList className="bg-white border-2 border-blue-200">
          <TabsTrigger value="summary">
            <Leaf className="w-4 h-4 mr-2" />
            {language === "kr" ? "식생 구조 요약" : "Vegetation Structure Summary"}
          </TabsTrigger>
          <TabsTrigger value="tree">
            <TreePine className="w-4 h-4 mr-2" />
            {language === "kr" ? "수목층 분석" : "Tree Layer Analysis"}
          </TabsTrigger>
          <TabsTrigger value="undergrowth">
            <Flower2 className="w-4 h-4 mr-2" />
            {language === "kr" ? "관목·초본·잡초층" : "Vegetation & Weed Layer"}
          </TabsTrigger>
          <TabsTrigger value="productivity">
            <TrendingUp className="w-4 h-4 mr-2" />
            {language === "kr" ? "생산성 및 바이오매스" : "Productivity & Biomass"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Summary Cards */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {language === "kr" ? "전체 식생 구조" : "Vegetation Structure Overview"}
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {vegetationStructureData.map((item, idx) => (
                  <div key={idx} className="rounded-xl border-2 border-blue-200 bg-white p-4 shadow-sm">
                    <div className="text-xs text-gray-600 mb-1">{item.name}</div>
                    <div className="text-2xl font-bold text-gray-900">{item.value}%</div>
                    {item.health > 0 && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 bg-blue-100 rounded-full h-1.5">
                          <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${item.health}%` }} />
                        </div>
                        <span className="text-xs text-gray-600">
                          {language === "kr" ? "건강도: " : "Health: "}
                          {item.health}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="rounded-xl border-2 border-blue-200 bg-white p-4 shadow-sm">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  {language === "kr" ? "식생 분포" : "Vegetation Distribution"}
                </h4>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={vegetationStructureData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {vegetationStructureData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        border: "2px solid #bfdbfe",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right: Map Viewer */}
            <div className="rounded-xl border-2 border-blue-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-900">
                  {language === "kr" ? "식생 구조 지도" : "Vegetation Structure Map"}
                </h4>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant={mapLayer === "standard" ? "default" : "outline"}
                    onClick={() => setMapLayer("standard")}
                    className="text-xs"
                  >
                    {language === "kr" ? "일반" : "Standard"}
                  </Button>
                  <Button
                    size="sm"
                    variant={mapLayer === "satellite" ? "default" : "outline"}
                    onClick={() => setMapLayer("satellite")}
                    className="text-xs"
                  >
                    {language === "kr" ? "위성" : "Satellite"}
                  </Button>
                  <Button
                    size="sm"
                    variant={mapLayer === "terrain" ? "default" : "outline"}
                    onClick={() => setMapLayer("terrain")}
                    className="text-xs"
                  >
                    {language === "kr" ? "지형" : "Terrain"}
                  </Button>
                </div>
              </div>
              <div className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
                {renderMapIframe([37.5665, 126.978], "vegetation")}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tree" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {language === "kr" ? "수목층 상세 분석" : "Tree Layer Details"}
              </h3>

              <div className="rounded-xl border-2 border-blue-200 bg-white p-4 shadow-sm">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  {language === "kr" ? "높이 분포" : "Height Distribution"}
                </h4>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={heightDistributionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                    <XAxis dataKey="range" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        border: "2px solid #bfdbfe",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border-2 border-blue-200 bg-white p-4 shadow-sm">
                  <div className="text-xs text-gray-600 mb-1">{language === "kr" ? "평균 높이" : "Avg Height"}</div>
                  <div className="text-2xl font-bold text-gray-900">12.4m</div>
                </div>
                <div className="rounded-xl border-2 border-blue-200 bg-white p-4 shadow-sm">
                  <div className="text-xs text-gray-600 mb-1">{language === "kr" ? "평균 DBH" : "Avg DBH"}</div>
                  <div className="text-2xl font-bold text-gray-900">28.7cm</div>
                </div>
                <div className="rounded-xl border-2 border-blue-200 bg-white p-4 shadow-sm">
                  <div className="text-xs text-gray-600 mb-1">
                    {language === "kr" ? "평균 수관폭" : "Avg Crown Width"}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">5.8m</div>
                </div>
                <div className="rounded-xl border-2 border-blue-200 bg-white p-4 shadow-sm">
                  <div className="text-xs text-gray-600 mb-1">
                    {language === "kr" ? "경사·구조 위험" : "Leaning Risk"}
                  </div>
                  <div className="text-2xl font-bold text-red-500">18%</div>
                </div>
              </div>

              <div className="rounded-xl border-2 border-blue-200 bg-white p-4 shadow-sm">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">
                  {language === "kr" ? "피해 패턴 감지" : "Damage Pattern Detection"}
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">
                      {language === "kr" ? "수관 피해 (RGB)" : "Crown damage (RGB)"}
                    </span>
                    <span className="text-yellow-600 font-semibold">342 trees</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">
                      {language === "kr" ? "엽록체 감소 (MS)" : "Chlorophyll decline (MS)"}
                    </span>
                    <span className="text-orange-500 font-semibold">178 trees</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">
                      {language === "kr" ? "구조적 결함 (LiDAR)" : "Structural defect (LiDAR)"}
                    </span>
                    <span className="text-red-500 font-semibold">89 trees</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border-2 border-blue-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-900">
                  {language === "kr" ? "수목 밀도 및 건강도 지도" : "Tree Density & Health Map"}
                </h4>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant={mapLayer === "standard" ? "default" : "outline"}
                    onClick={() => setMapLayer("standard")}
                    className="text-xs"
                  >
                    {language === "kr" ? "일반" : "Standard"}
                  </Button>
                  <Button
                    size="sm"
                    variant={mapLayer === "satellite" ? "default" : "outline"}
                    onClick={() => setMapLayer("satellite")}
                    className="text-xs"
                  >
                    {language === "kr" ? "위성" : "Satellite"}
                  </Button>
                  <Button
                    size="sm"
                    variant={mapLayer === "terrain" ? "default" : "outline"}
                    onClick={() => setMapLayer("terrain")}
                    className="text-xs"
                  >
                    {language === "kr" ? "지형" : "Terrain"}
                  </Button>
                </div>
              </div>
              <div className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
                {renderMapIframe([37.5665, 126.978], "tree")}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="undergrowth" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {language === "kr" ? "관목·초본·잡초층" : "Undergrowth & Weeds"}
              </h3>

              <div className="rounded-xl border-2 border-blue-200 bg-white p-4 shadow-sm">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  {language === "kr" ? "외래종 핫스포츠" : "Invasive Species Hotspots"}
                </h4>
                <div className="space-y-3">
                  {invasiveHotspotsData.map((hotspot) => (
                    <div
                      key={hotspot.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-200"
                    >
                      <div className="flex items-center gap-3">
                        <AlertCircle
                          className={`w-5 h-5 ${hotspot.risk === "High" ? "text-red-500" : "text-yellow-500"}`}
                        />
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{hotspot.id}</div>
                          <div className="text-xs text-gray-600">{hotspot.species}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900">{hotspot.coverage}㎡</div>
                        <div className={`text-xs ${hotspot.risk === "High" ? "text-red-500" : "text-yellow-500"}`}>
                          {hotspot.risk}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border-2 border-blue-200 bg-white p-4 shadow-sm">
                  <div className="text-xs text-gray-600 mb-1">{language === "kr" ? "관목 밀도" : "Shrub Density"}</div>
                  <div className="text-2xl font-bold text-emerald-400">Medium-High</div>
                </div>
                <div className="rounded-xl border-2 border-blue-200 bg-white p-4 shadow-sm">
                  <div className="text-xs text-gray-600 mb-1">
                    {language === "kr" ? "초본 건강도" : "Herbaceous Health"}
                  </div>
                  <div className="text-2xl font-bold text-blue-400">71%</div>
                </div>
                <div className="rounded-xl border-2 border-blue-200 bg-white p-4 shadow-sm">
                  <div className="text-xs text-gray-600 mb-1">{language === "kr" ? "잡초 인덱스" : "Weed Index"}</div>
                  <div className="text-2xl font-bold text-yellow-400">0.42</div>
                </div>
                <div className="rounded-xl border-2 border-blue-200 bg-white p-4 shadow-sm">
                  <div className="text-xs text-gray-600 mb-1">
                    {language === "kr" ? "외래종 분포 면적" : "Invasive Coverage"}
                  </div>
                  <div className="text-2xl font-bold text-red-400">1,860㎡</div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border-2 border-blue-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-900">
                  {language === "kr" ? "잡초 및 외래종 분포 지도" : "Weed & Invasive Species Map"}
                </h4>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant={mapLayer === "standard" ? "default" : "outline"}
                    onClick={() => setMapLayer("standard")}
                    className="text-xs"
                  >
                    {language === "kr" ? "일반" : "Standard"}
                  </Button>
                  <Button
                    size="sm"
                    variant={mapLayer === "satellite" ? "default" : "outline"}
                    onClick={() => setMapLayer("satellite")}
                    className="text-xs"
                  >
                    {language === "kr" ? "위성" : "Satellite"}
                  </Button>
                  <Button
                    size="sm"
                    variant={mapLayer === "terrain" ? "default" : "outline"}
                    onClick={() => setMapLayer("terrain")}
                    className="text-xs"
                  >
                    {language === "kr" ? "지형" : "Terrain"}
                  </Button>
                </div>
              </div>
              <div className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
                {renderMapIframe([37.5665, 126.978], "weed")}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="productivity" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {language === "kr" ? "생산성 및 바이오매스" : "Productivity & Biomass"}
              </h3>

              <div className="rounded-xl border-2 border-blue-200 bg-white p-4 shadow-sm">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  {language === "kr" ? "구역별 바이오매스" : "Biomass by Zone"}
                </h4>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={biomassData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                    <XAxis dataKey="area" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        border: "2px solid #bfdbfe",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="biomass" fill="#3b82f6" name="Biomass (t/ha)" />
                    <Bar dataKey="carbon" fill="#3b82f6" name="Carbon (t/ha)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-xl border-2 border-blue-200 bg-white p-4 shadow-sm">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  {language === "kr" ? "LAI 분포" : "LAI Distribution"}
                </h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={biomassData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                    <XAxis dataKey="area" stroke="#64748b" />
                    <YAxis stroke="#64748b" domain={[0, 8]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        border: "2px solid #bfdbfe",
                        borderRadius: "8px",
                      }}
                    />
                    <Line type="monotone" dataKey="lai" stroke="#a855f7" strokeWidth={2} name="LAI" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border-2 border-blue-200 bg-white p-4 shadow-sm">
                  <div className="text-xs text-gray-600 mb-1">
                    {language === "kr" ? "생산성 점수 (NDVI)" : "Productivity Score (NDVI)"}
                  </div>
                  <div className="text-2xl font-bold text-emerald-400">0.78</div>
                </div>
                <div className="rounded-xl border-2 border-blue-200 bg-white p-4 shadow-sm">
                  <div className="text-xs text-gray-600 mb-1">
                    {language === "kr" ? "탄소 추정치" : "Carbon Estimation"}
                  </div>
                  <div className="text-2xl font-bold text-blue-400">72 t/ha</div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border-2 border-blue-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-900">
                  {language === "kr" ? "생산성 분포 지도" : "Productivity Distribution Map"}
                </h4>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant={mapLayer === "standard" ? "default" : "outline"}
                    onClick={() => setMapLayer("standard")}
                    className="text-xs"
                  >
                    {language === "kr" ? "일반" : "Standard"}
                  </Button>
                  <Button
                    size="sm"
                    variant={mapLayer === "satellite" ? "default" : "outline"}
                    onClick={() => setMapLayer("satellite")}
                    className="text-xs"
                  >
                    {language === "kr" ? "위성" : "Satellite"}
                  </Button>
                  <Button
                    size="sm"
                    variant={mapLayer === "terrain" ? "default" : "outline"}
                    onClick={() => setMapLayer("terrain")}
                    className="text-xs"
                  >
                    {language === "kr" ? "지형" : "Terrain"}
                  </Button>
                </div>
              </div>
              <div className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
                {renderMapIframe([37.5665, 126.978], "biomass")}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
