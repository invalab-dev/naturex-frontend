"use client";

import { useState, useEffect } from "react";
import { MapPin, Trash2, Circle, MoveHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Point {
  x: number;
  y: number;
  lat: number;
  lng: number;
}

interface Polygon {
  id: string;
  points: Point[];
  completed: boolean;
}

interface PolygonMapProps {
  onPolygonsChange?: (polygons: Polygon[]) => void;
  bufferRadius: number;
  language?: "ko" | "en";
}

export function PolygonMap({
  onPolygonsChange,
  bufferRadius,
  language = "ko",
}: PolygonMapProps) {
  const [polygons, setPolygons] = useState<Polygon[]>([]);
  const [drawMode, setDrawMode] = useState<
    "off" | "point" | "line" | "polygon"
  >("off");
  const [mapLayer, setMapLayer] = useState<"normal" | "satellite" | "terrain">(
    "normal",
  );

  const translations = {
    ko: {
      drawPoint: "점 추가",
      drawLine: "선 그리기",
      drawPolygon: "영역 그리기",
      finishDrawing: "완료",
      deleteAll: "전체 삭제",
      selectedAreas: "선택된 영역 수",
      totalArea: "총 면적",
      centerPoint: "중심점 좌표",
      bufferRadius: "버퍼 반경",
      normal: "일반지도",
      satellite: "위성",
      terrain: "지형",
      instruction: "지도를 클릭하여 그리세요.",
    },
    en: {
      drawPoint: "Add Point",
      drawLine: "Draw Line",
      drawPolygon: "Draw Area",
      finishDrawing: "Finish",
      deleteAll: "Delete All",
      selectedAreas: "Selected areas",
      totalArea: "Total area",
      centerPoint: "Center",
      bufferRadius: "Buffer radius",
      normal: "Standard",
      satellite: "Satellite",
      terrain: "Terrain",
      instruction: "Click on the map to draw.",
    },
  };

  const t = translations[language];

  const calculateStats = () => {
    const totalPolygons = polygons.length;
    const totalArea = polygons.reduce(
      (sum, poly) => sum + poly.points.length * 0.5,
      0,
    );

    let totalLat = 0;
    let totalLng = 0;
    let totalPoints = 0;

    polygons.forEach((poly) => {
      poly.points.forEach((point) => {
        totalLat += point.lat;
        totalLng += point.lng;
        totalPoints++;
      });
    });

    const centerLat =
      totalPoints > 0 ? (totalLat / totalPoints).toFixed(4) : "0.0000";
    const centerLng =
      totalPoints > 0 ? (totalLng / totalPoints).toFixed(4) : "0.0000";

    return {
      count: totalPolygons,
      area: totalArea.toFixed(1),
      center: { lat: centerLat, lng: centerLng },
    };
  };

  const stats = calculateStats();

  const getTileUrl = () => {
    switch (mapLayer) {
      case "satellite":
        return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
      case "terrain":
        return "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png";
      default:
        return "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    }
  };

  useEffect(() => {
    const iframe = document.getElementById(
      "polygon-map-iframe",
    ) as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        { type: "changeLayer", tileUrl: getTileUrl() },
        "*",
      );
    }
  }, [mapLayer]);

  useEffect(() => {
    const iframe = document.getElementById(
      "polygon-map-iframe",
    ) as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        { type: "setDrawMode", drawMode, bufferRadius },
        "*",
      );
    }
  }, [drawMode, bufferRadius]);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data.type === "shapeComplete") {
        const newPolygon: Polygon = {
          id: Date.now().toString(),
          points: e.data.points,
          completed: true,
        };
        const updatedPolygons = [...polygons, newPolygon];
        setPolygons(updatedPolygons);
        if (onPolygonsChange) {
          onPolygonsChange(updatedPolygons);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [polygons, onPolygonsChange]);

  const handleDeleteAll = () => {
    setPolygons([]);
    if (onPolygonsChange) {
      onPolygonsChange([]);
    }
    const iframe = document.getElementById(
      "polygon-map-iframe",
    ) as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({ type: "clearAll" }, "*");
    }
  };

  const mapHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    body { margin: 0; padding: 0; }
    #map { width: 100%; height: 100%; }
    .draw-instruction {
      position: absolute;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(16, 185, 129, 0.95);
      color: white;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
      z-index: 1000;
      display: none;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <div id="instruction" class="draw-instruction">${t.instruction}</div>
  <script>
    const map = L.map('map').setView([37.5665, 126.9780], 13);
    
    let currentLayer = L.tileLayer('${getTileUrl()}', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    let drawMode = 'off';
    let currentPoints = [];
    let currentPolyline = null;
    let allShapes = [];
    let bufferRadius = ${bufferRadius};
    const instructionDiv = document.getElementById('instruction');

    map.on('click', function(e) {
      if (drawMode === 'off') return;

      const point = {
        x: e.containerPoint.x,
        y: e.containerPoint.y,
        lat: e.latlng.lat,
        lng: e.latlng.lng
      };

      currentPoints.push(e.latlng);

      if (drawMode === 'point') {
        const marker = L.circleMarker(e.latlng, {
          radius: 6,
          color: 'rgb(59, 130, 246)',
          fillColor: 'rgb(59, 130, 246)',
          fillOpacity: 1
        }).addTo(map);

        const buffer = L.circle(e.latlng, {
          radius: bufferRadius,
          color: 'rgb(99, 102, 241)',
          fillColor: 'rgb(99, 102, 241)',
          fillOpacity: 0.1,
          weight: 1,
          dashArray: '5, 5'
        }).addTo(map);

        allShapes.push({ marker, buffer });

        window.parent.postMessage({
          type: 'shapeComplete',
          points: [point]
        }, '*');

        currentPoints = [];
      } else if (drawMode === 'line' || drawMode === 'polygon') {
        if (currentPolyline) {
          map.removeLayer(currentPolyline);
        }

        currentPolyline = L.polyline(currentPoints, {
          color: 'rgb(59, 130, 246)',
          weight: 3
        }).addTo(map);

        L.circleMarker(e.latlng, {
          radius: 4,
          color: 'rgb(59, 130, 246)',
          fillColor: 'white',
          fillOpacity: 1,
          weight: 2
        }).addTo(map);
      }
    });

    window.addEventListener('message', function(e) {
      if (e.data.type === 'changeLayer') {
        map.removeLayer(currentLayer);
        currentLayer = L.tileLayer(e.data.tileUrl, {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(map);
      }

      if (e.data.type === 'setDrawMode') {
        const previousMode = drawMode;
        drawMode = e.data.drawMode;
        bufferRadius = e.data.bufferRadius;
        
        instructionDiv.style.display = drawMode !== 'off' ? 'block' : 'none';
        
        if (previousMode !== 'off' && drawMode === 'off' && currentPoints.length >= 2) {
          if (currentPolyline) {
            map.removeLayer(currentPolyline);
          }

          const points = currentPoints.map((latlng) => ({
            x: 0,
            y: 0,
            lat: latlng.lat,
            lng: latlng.lng
          }));

          let finalShape;
          let bufferShape;

          if (previousMode === 'line') {
            finalShape = L.polyline(currentPoints, {
              color: 'rgb(16, 185, 129)',
              weight: 3
            }).addTo(map);

            bufferShape = L.polyline(currentPoints, {
              color: 'rgb(99, 102, 241)',
              weight: bufferRadius / 5,
              opacity: 0.2
            }).addTo(map);
          } else if (previousMode === 'polygon' && currentPoints.length >= 3) {
            finalShape = L.polygon(currentPoints, {
              color: 'rgb(16, 185, 129)',
              weight: 2,
              fillColor: 'rgb(16, 185, 129)',
              fillOpacity: 0.2
            }).addTo(map);

            const bounds = finalShape.getBounds();
            const center = bounds.getCenter();
            
            bufferShape = L.circle(center, {
              radius: bufferRadius,
              color: 'rgb(99, 102, 241)',
              fillColor: 'rgb(99, 102, 241)',
              fillOpacity: 0.05,
              weight: 1,
              dashArray: '5, 5'
            }).addTo(map);
          }

          if (finalShape) {
            allShapes.push({ shape: finalShape, buffer: bufferShape });

            window.parent.postMessage({
              type: 'shapeComplete',
              points: points
            }, '*');
          }

          currentPoints = [];
          currentPolyline = null;
        }
      }

      if (e.data.type === 'clearAll') {
        allShapes.forEach(item => {
          if (item.marker) map.removeLayer(item.marker);
          if (item.shape) map.removeLayer(item.shape);
          if (item.buffer) map.removeLayer(item.buffer);
        });
        allShapes = [];
        currentPoints = [];
        if (currentPolyline) {
          map.removeLayer(currentPolyline);
          currentPolyline = null;
        }
      }
    });
  </script>
</body>
</html>
`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            onClick={() => setDrawMode(drawMode === "point" ? "off" : "point")}
            variant={drawMode === "point" ? "default" : "outline"}
            size="sm"
            className="rounded-lg"
          >
            <Circle size={16} className="mr-2" />
            {t.drawPoint}
          </Button>

          <Button
            onClick={() => setDrawMode(drawMode === "line" ? "off" : "line")}
            variant={drawMode === "line" ? "default" : "outline"}
            size="sm"
            className="rounded-lg"
          >
            <MoveHorizontal size={16} className="mr-2" />
            {t.drawLine}
          </Button>

          <Button
            onClick={() =>
              setDrawMode(drawMode === "polygon" ? "off" : "polygon")
            }
            variant={drawMode === "polygon" ? "default" : "outline"}
            size="sm"
            className="rounded-lg"
          >
            <MapPin size={16} className="mr-2" />
            {t.drawPolygon}
          </Button>

          {polygons.length > 0 && (
            <Button
              onClick={handleDeleteAll}
              variant="destructive"
              size="sm"
              className="rounded-lg"
            >
              <Trash2 size={16} className="mr-2" />
              {t.deleteAll}
            </Button>
          )}
        </div>

        <div className="flex gap-1 rounded-lg border border-slate-700 bg-slate-900/80 p-1">
          {(["normal", "satellite", "terrain"] as const).map((layer) => (
            <button
              key={layer}
              onClick={() => setMapLayer(layer)}
              className={`px-3 py-1 text-xs rounded transition-all ${
                mapLayer === layer
                  ? "bg-emerald-600 text-white"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              {t[layer]}
            </button>
          ))}
        </div>
      </div>

      <div
        className="rounded-2xl border border-slate-700 relative overflow-hidden"
        style={{ height: "500px" }}
      >
        <iframe
          id="polygon-map-iframe"
          srcDoc={mapHtml}
          className="w-full h-full"
          title="Polygon Drawing Map"
          sandbox="allow-scripts allow-same-origin"
        />

        {polygons.length > 0 && (
          <div className="absolute bottom-4 right-4 bg-slate-900/95 border border-slate-700 rounded-lg p-4 text-xs space-y-1.5 backdrop-blur-sm z-10">
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400">{t.selectedAreas}:</span>
              <span className="text-emerald-400 font-semibold">
                {stats.count}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400">{t.totalArea}:</span>
              <span className="text-slate-200 font-medium">
                {stats.area} ha
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400">{t.centerPoint}:</span>
              <span className="text-slate-200 font-mono text-[10px]">
                ({stats.center.lat}, {stats.center.lng})
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400">{t.bufferRadius}:</span>
              <span className="text-blue-400 font-medium">{bufferRadius}m</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
