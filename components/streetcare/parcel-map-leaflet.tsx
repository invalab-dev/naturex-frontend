"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Layers } from "lucide-react"

interface Tree {
  id: string
  lat: number
  lng: number
  risk: "Low" | "Medium" | "High" | "Critical"
  species: string
}

interface Parcel {
  id: string
  name: string
  address: string
  treeCount: number
  highRiskCount: number
  highestRisk: "Low" | "Medium" | "High" | "Critical"
  polygon: { lat: number; lng: number }[]
}

interface ParcelMapLeafletProps {
  parcels: Parcel[]
  trees: Tree[]
  selectedParcel: Parcel
  onParcelSelect: (parcel: Parcel) => void
  onTreeSelect: (tree: Tree) => void
  mapLayer: "street" | "satellite" | "terrain"
  onMapLayerChange: (layer: "street" | "satellite" | "terrain") => void
}

export function ParcelMapLeaflet({
  parcels,
  trees,
  selectedParcel,
  onParcelSelect,
  onTreeSelect,
  mapLayer,
  onMapLayerChange,
}: ParcelMapLeafletProps) {
  const [hoveredItem, setHoveredItem] = useState<{ type: "parcel" | "tree"; id: string } | null>(null)

  const latLngToXY = (lat: number, lng: number) => {
    const x = (lng - 126.998) * 10000 + 100
    const y = (37.512 - lat) * 10000 + 50
    return { x, y }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "#10b981"
      case "Medium":
        return "#f59e0b"
      case "High":
        return "#f97316"
      case "Critical":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  }

  const getMapBackground = () => {
    if (mapLayer === "satellite") {
      return {
        bg: "#1a2e1a",
        gridColor: "#2d4a2d",
        roadColor: "#3d5940",
        buildingColor: "#1f3320",
        label: "위성 지도 (Satellite View)",
      }
    }
    if (mapLayer === "terrain") {
      return {
        bg: "#2a3a2a",
        gridColor: "#4a5f45",
        roadColor: "#5d7358",
        buildingColor: "#3d5540",
        label: "지형 지도 (Terrain View)",
      }
    }
    return {
      bg: "#0f172a",
      gridColor: "#1e293b",
      roadColor: "#334155",
      buildingColor: "#1e293b",
      label: "일반 지도 (Street View)",
    }
  }

  const mapStyle = getMapBackground()

  return (
    <div className="relative w-full h-full bg-slate-950 rounded-lg border border-border overflow-hidden">
      {/* Map Layer Switcher */}
      <div className="absolute top-3 right-3 bg-background/95 backdrop-blur-sm border rounded-lg p-1.5 flex items-center gap-1 z-10 shadow-xl">
        <Button
          variant={mapLayer === "street" ? "default" : "ghost"}
          size="sm"
          className="h-7 px-2.5 text-xs"
          onClick={() => onMapLayerChange("street")}
        >
          <Layers className="h-3 w-3 mr-1.5" />
          일반지도
        </Button>
        <Button
          variant={mapLayer === "satellite" ? "default" : "ghost"}
          size="sm"
          className="h-7 px-2.5 text-xs"
          onClick={() => onMapLayerChange("satellite")}
        >
          <Layers className="h-3 w-3 mr-1.5" />
          위성지도
        </Button>
        <Button
          variant={mapLayer === "terrain" ? "default" : "ghost"}
          size="sm"
          className="h-7 px-2.5 text-xs"
          onClick={() => onMapLayerChange("terrain")}
        >
          <Layers className="h-3 w-3 mr-1.5" />
          지형지도
        </Button>
      </div>

      {/* Parcel Info Overlay */}
      <div className="absolute top-3 left-3 bg-background/95 backdrop-blur-sm border rounded-lg p-2.5 text-xs z-10 shadow-xl">
        <div className="font-semibold mb-1">{selectedParcel.name}</div>
        <div className="text-muted-foreground text-[10px]">{selectedParcel.address}</div>
        <div className="mt-1.5 flex items-center gap-3 text-[10px]">
          <span className="text-muted-foreground">
            Trees: <span className="text-foreground font-medium">{selectedParcel.treeCount}</span>
          </span>
          <span className="text-muted-foreground">
            High Risk: <span className="text-destructive font-medium">{selectedParcel.highRiskCount}</span>
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 bg-background/95 backdrop-blur-sm border rounded-lg p-2.5 text-xs space-y-1 z-10 shadow-xl">
        <div className="font-semibold mb-1.5 text-[10px] text-muted-foreground">RISK LEVEL</div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm" />
          <span className="text-[10px]">Low</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm" />
          <span className="text-[10px]">Medium</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-orange-500 shadow-sm" />
          <span className="text-[10px]">High</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm" />
          <span className="text-[10px]">Critical</span>
        </div>
      </div>

      {/* Map Type Label */}
      <div className="absolute bottom-3 right-3 bg-background/80 backdrop-blur-sm border rounded px-2 py-1 text-[10px] text-muted-foreground z-10">
        {mapStyle.label}
      </div>

      {/* SVG Map */}
      <svg viewBox="0 0 1000 500" className="w-full h-full" style={{ background: mapStyle.bg }}>
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path
              d="M 50 0 L 0 0 0 50"
              fill="none"
              stroke={mapStyle.gridColor}
              strokeWidth={mapLayer === "satellite" ? "0.5" : "1"}
              opacity={mapLayer === "satellite" ? "0.3" : "0.6"}
            />
          </pattern>
          {mapLayer === "terrain" && (
            <pattern id="terrain-texture" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="15" cy="15" r="1.5" fill={mapStyle.gridColor} opacity="0.4" />
              <circle cx="8" cy="22" r="1" fill={mapStyle.gridColor} opacity="0.3" />
              <circle cx="22" cy="8" r="1.2" fill={mapStyle.gridColor} opacity="0.35" />
            </pattern>
          )}
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width="1000" height="500" fill={mapLayer === "terrain" ? "url(#terrain-texture)" : mapStyle.bg} />
        <rect width="1000" height="500" fill="url(#grid)" />

        <g stroke={mapStyle.roadColor} strokeWidth={mapLayer === "satellite" ? "4" : "3"} fill="none" opacity="0.8">
          <line x1="200" y1="0" x2="200" y2="500" />
          <line x1="400" y1="0" x2="400" y2="500" />
          <line x1="600" y1="0" x2="600" y2="500" />
          <line x1="800" y1="0" x2="800" y2="500" />
          <line x1="0" y1="150" x2="1000" y2="150" />
          <line x1="0" y1="300" x2="1000" y2="300" />
        </g>

        {mapLayer === "street" && (
          <g fill={mapStyle.buildingColor} stroke="#334155" strokeWidth="1" opacity="0.5">
            <rect x="100" y="80" width="60" height="60" rx="2" />
            <rect x="220" y="90" width="50" height="50" rx="2" />
            <rect x="420" y="85" width="55" height="55" rx="2" />
            <rect x="620" y="80" width="60" height="58" rx="2" />
            <rect x="250" y="320" width="55" height="55" rx="2" />
            <rect x="550" y="310" width="58" height="60" rx="2" />
          </g>
        )}

        {mapLayer === "satellite" && (
          <g opacity="0.4">
            <circle cx="150" cy="120" r="30" fill="#2d5016" />
            <circle cx="280" cy="130" r="25" fill="#2d5016" />
            <circle cx="480" cy="125" r="28" fill="#2d5016" />
            <circle cx="680" cy="120" r="32" fill="#2d5016" />
            <circle cx="300" cy="340" r="27" fill="#2d5016" />
            <circle cx="600" cy="350" r="30" fill="#2d5016" />
          </g>
        )}

        {parcels.map((parcel) => {
          const coords = parcel.polygon.map((p) => latLngToXY(p.lat, p.lng))
          const pathData = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`).join(" ") + " Z"
          const isSelected = parcel.id === selectedParcel.id
          const isHovered = hoveredItem?.type === "parcel" && hoveredItem.id === parcel.id
          const color = getRiskColor(parcel.highestRisk)

          return (
            <g key={parcel.id}>
              {(isSelected || isHovered) && (
                <path
                  d={pathData}
                  fill={color}
                  fillOpacity="0.15"
                  stroke={color}
                  strokeWidth="8"
                  filter="url(#glow)"
                  className="pointer-events-none"
                />
              )}
              <path
                d={pathData}
                fill={color}
                fillOpacity={isSelected ? 0.4 : isHovered ? 0.3 : 0.2}
                stroke={color}
                strokeWidth={isSelected ? 4 : isHovered ? 3 : 2}
                strokeDasharray={isSelected ? "none" : isHovered ? "8,4" : "none"}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHoveredItem({ type: "parcel", id: parcel.id })}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => onParcelSelect(parcel)}
              />
              <text
                x={coords.reduce((sum, c) => sum + c.x, 0) / coords.length}
                y={coords.reduce((sum, c) => sum + c.y, 0) / coords.length}
                textAnchor="middle"
                fill="white"
                fontSize="13"
                fontWeight="bold"
                className="pointer-events-none"
                style={{
                  textShadow: "2px 2px 4px rgba(0,0,0,0.9), -1px -1px 2px rgba(0,0,0,0.8)",
                  filter: "drop-shadow(0 0 3px rgba(0,0,0,0.8))",
                }}
              >
                {parcel.name}
              </text>
            </g>
          )
        })}

        {trees.map((tree) => {
          const { x, y } = latLngToXY(tree.lat, tree.lng)
          const isHovered = hoveredItem?.type === "tree" && hoveredItem.id === tree.id
          const radius = isHovered ? 10 : 8
          const color = getRiskColor(tree.risk)

          return (
            <g key={tree.id}>
              <circle
                cx={x}
                cy={y}
                r={radius + 4}
                fill={color}
                opacity="0.25"
                filter={isHovered ? "url(#glow)" : "none"}
                className="pointer-events-none"
              />
              <circle
                cx={x}
                cy={y}
                r={radius}
                fill={color}
                stroke="white"
                strokeWidth="3"
                className="cursor-pointer transition-all duration-200"
                style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.6))" }}
                onMouseEnter={() => setHoveredItem({ type: "tree", id: tree.id })}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => onTreeSelect(tree)}
              />
              {isHovered && (
                <g>
                  <rect
                    x={x + 15}
                    y={y - 32}
                    width="140"
                    height="58"
                    fill="rgba(15, 23, 42, 0.98)"
                    rx="6"
                    stroke={color}
                    strokeWidth="2"
                    style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.8))" }}
                  />
                  <text x={x + 22} y={y - 14} fill="white" fontSize="12" fontWeight="bold">
                    {tree.id}
                  </text>
                  <text x={x + 22} y={y + 0} fill="white" fontSize="11">
                    {tree.species}
                  </text>
                  <text x={x + 22} y={y + 14} fill={color} fontSize="11" fontWeight="bold">
                    {tree.risk} Risk
                  </text>
                </g>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
