"use client"

import { AlertTriangle, Clock, CheckCircle2, MapPin, TrendingUp, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

export function EfficiencyPriorityActions() {
  const actions = [
    {
      priority: "즉시 조치 필요 (Critical)",
      icon: AlertTriangle,
      color: "red",
      items: [
        {
          id: "T-1234",
          issue: "가지 균열 감지 + 기울기 이상",
          location: "종로구 세종대로 34",
          causes: ["LiDAR: Tilt 12.4°", "RGB: Crown Depression 감지"],
          priorityScore: 94,
        },
        {
          id: "T-1089",
          issue: "뿌리 노출 + 토양 유실",
          location: "강남구 테헤란로 152",
          causes: ["RGB: 지면 변형 3.2cm", "LiDAR: 수고 불균형"],
          priorityScore: 91,
        },
        {
          id: "T-2341",
          issue: "수고 초과 (전선 간섭 위험)",
          location: "마포구 월드컵로 240",
          causes: ["LiDAR: 높이 15.2m", "전선 이격거리 0.8m"],
          priorityScore: 89,
        },
      ],
    },
    {
      priority: "단기 조치 필요 (Short-term)",
      icon: Clock,
      color: "yellow",
      items: [
        {
          id: "T-0892",
          issue: "병해충 초기 징후",
          location: "송파구 올림픽로 300",
          causes: ["RGB: 엽색 변화 15%", "Multispectral: NDVI drop 0.12"],
          priorityScore: 72,
        },
        {
          id: "T-1455",
          issue: "수관폭 과다 (보행로 간섭)",
          location: "서초구 반포대로 58",
          causes: ["LiDAR: Crown width 8.3m", "보행로 폭 2.1m"],
          priorityScore: 68,
        },
        {
          id: "T-3304",
          issue: "NDRE 감소 (영양 스트레스)",
          location: "중구 을지로 128",
          causes: ["Multispectral: NDRE 0.38", "토양 pH 이상"],
          priorityScore: 65,
        },
      ],
    },
    {
      priority: "계획적 관리 가능 (Planned)",
      icon: CheckCircle2,
      color: "emerald",
      items: [
        {
          id: "T-3021",
          issue: "정기 가지치기 권장",
          location: "용산구 한강대로 405",
          causes: ["생육 패턴: 연간 생장률 +18%", "밀도 관리 필요"],
          priorityScore: 45,
        },
        {
          id: "T-1672",
          issue: "영양상태 모니터링",
          location: "성동구 왕십리로 222",
          causes: ["계절별 건강지수 추이", "NDVI 안정 범위"],
          priorityScore: 38,
        },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      {actions.map((category) => {
        const Icon = category.icon
        const colorClass = {
          red: "border-red-500 bg-red-500/5",
          yellow: "border-yellow-500 bg-yellow-500/5",
          emerald: "border-emerald-500 bg-emerald-500/5",
        }[category.color]

        const iconColorClass = {
          red: "text-red-400",
          yellow: "text-yellow-400",
          emerald: "text-emerald-400",
        }[category.color]

        return (
          <div key={category.priority} className={`rounded-xl border ${colorClass} p-6`}>
            <div className="flex items-center gap-3 mb-4">
              <Icon size={20} className={iconColorClass} />
              <h3 className="text-lg font-semibold text-foreground">{category.priority}</h3>
              <span className="text-sm text-muted-foreground">({category.items.length}건)</span>
            </div>

            <div className="space-y-3">
              {category.items.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-900/50 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-slate-400">{item.id}</span>
                        <Badge variant="outline" className="text-xs">
                          <TrendingUp size={12} className="mr-1" />
                          Priority {item.priorityScore}
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-foreground">{item.issue}</h4>
                    </div>
                    <Button size="sm" variant="ghost" className="gap-1">
                      <MapPin size={14} />
                      지도
                    </Button>
                  </div>

                  <p className="text-sm text-slate-300 mb-2 flex items-center gap-2">
                    <MapPin size={14} className="text-muted-foreground" />
                    {item.location}
                  </p>

                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">원인 및 근거:</p>
                    <div className="flex flex-wrap gap-2">
                      {item.causes.map((cause, idx) => (
                        <span key={idx} className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">
                          {cause}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      <Card className="rounded-xl border border-slate-700 bg-slate-900/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <MapPin size={20} />
            추천관리 지도 (Recommended Management Map)
          </h3>
          <Button size="sm" variant="outline" className="gap-2 bg-transparent">
            <Eye size={16} />
            상세보기
          </Button>
        </div>

        <p className="text-sm text-slate-400 mb-4">
          식물 다양성, 토양 조건, 병해충 분포, 기후 패턴, 교통 밀도 등을 종합 고려한 AI 추천 관리 전략입니다.
          <br />
          <span className="text-emerald-400">상세보기를 클릭하면 더 자세한 맵과 분석 결과를 확인할 수 있습니다.</span>
        </p>

        <div className="rounded-lg border border-slate-700 overflow-hidden mb-4">
          <iframe
            srcDoc={`
              <!DOCTYPE html>
              <html>
                <head>
                  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
                  <style>
                    body { margin: 0; padding: 0; }
                    #map { width: 100%; height: 100%; }
                  </style>
                </head>
                <body>
                  <div id="map"></div>
                  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
                  <script>
                    const map = L.map('map').setView([37.5665, 126.978], 12);
                    
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                      attribution: '© OpenStreetMap'
                    }).addTo(map);
                    
                    // Priority zones based on multiple factors
                    const zones = [
                      { coords: [[37.570, 126.975], [37.570, 126.980], [37.568, 126.980], [37.568, 126.975]], 
                        color: '#ef4444', label: 'Critical: 즉시조치 (교통밀도 높음, 병해충 위험)' },
                      { coords: [[37.565, 126.976], [37.565, 126.979], [37.563, 126.979], [37.563, 126.976]], 
                        color: '#eab308', label: 'Short-term: 단기조치 (토양 불량, 다양성 낮음)' },
                      { coords: [[37.567, 126.982], [37.567, 126.985], [37.565, 126.985], [37.565, 126.982]], 
                        color: '#10b981', label: 'Planned: 계획관리 (건강 양호, 예방 관리)' }
                    ];
                    
                    zones.forEach(zone => {
                      L.polygon(zone.coords, {
                        color: zone.color,
                        fillColor: zone.color,
                        fillOpacity: 0.3,
                        weight: 2
                      }).addTo(map).bindPopup(zone.label);
                    });
                    
                    // Add priority markers
                    const markers = [
                      {lat: 37.5695, lng: 126.9775, priority: 'high', text: '병해충+교통'},
                      {lat: 37.5640, lng: 126.9775, priority: 'medium', text: '토양개선'},
                      {lat: 37.5660, lng: 126.9835, priority: 'low', text: '정기관리'}
                    ];
                    
                    const colors = { high: '#ef4444', medium: '#eab308', low: '#10b981' };
                    markers.forEach(m => {
                      L.circleMarker([m.lat, m.lng], {
                        radius: 8,
                        fillColor: colors[m.priority],
                        color: '#fff',
                        weight: 2,
                        fillOpacity: 0.8
                      }).addTo(map).bindPopup(m.text);
                    });
                  </script>
                </body>
              </html>
            `}
            className="w-full h-[400px] border-0"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>

        <div className="grid grid-cols-3 gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span className="text-slate-300">즉시조치 (High Priority)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
            <span className="text-slate-300">단기조치 (Medium Priority)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
            <span className="text-slate-300">계획관리 (Low Priority)</span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
          <p className="text-xs text-slate-400">
            <strong className="text-emerald-400">고려 요소:</strong> 식물 다양성 지수, 토양 pH/영양도, 병해충 발생 이력,
            기후 패턴(온도/습도), 교통 밀도, 보행자 안전, 미세먼지 흡수율
          </p>
        </div>
      </Card>
    </div>
  )
}
