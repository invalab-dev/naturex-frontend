"use client";

import { TrendingDown, DollarSign, Users, Clock, Wrench } from "lucide-react";

export function EfficiencyCostInsights() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <TrendingDown size={20} className="text-emerald-400" />
          관리 방식 비교 (A/B 시나리오)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Scenario A: Current */}
          <div className="bg-slate-800/50 rounded-lg p-5 space-y-4">
            <h4 className="font-semibold text-foreground text-lg mb-3">
              A) 현재 관리 방식
            </h4>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Users size={18} className="text-slate-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">필요 인력</p>
                  <p className="text-lg font-semibold text-foreground">
                    24명 (연간)
                  </p>
                  <p className="text-xs text-slate-400">
                    평균 작업시간: 2,880시간
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Wrench size={18} className="text-slate-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">장비 사용량</p>
                  <p className="text-lg font-semibold text-foreground">
                    고소작업차 480회
                  </p>
                  <p className="text-xs text-slate-400">가지치기 장비 240회</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <DollarSign size={18} className="text-slate-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">예상 비용</p>
                  <p className="text-xl font-bold text-foreground">6.5억원</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock size={18} className="text-slate-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">관리 주기</p>
                  <p className="text-lg font-semibold text-foreground">
                    3개월 (균일)
                  </p>
                  <p className="text-xs text-slate-400">
                    전체 구간 동일 주기 적용
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Scenario B: AI Recommended */}
          <div className="bg-emerald-500/5 border-2 border-emerald-500/50 rounded-lg p-5 space-y-4">
            <h4 className="font-semibold text-emerald-400 text-lg mb-3">
              B) AI 추천 방식
            </h4>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Users size={18} className="text-emerald-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-slate-300">필요 인력</p>
                  <p className="text-lg font-semibold text-emerald-400">
                    15명 (-38%)
                  </p>
                  <p className="text-xs text-emerald-300/70">
                    평균 작업시간: 1,680시간
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Wrench size={18} className="text-emerald-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-slate-300">장비 사용량</p>
                  <p className="text-lg font-semibold text-emerald-400">
                    고소작업차 280회 (-42%)
                  </p>
                  <p className="text-xs text-emerald-300/70">
                    가지치기 장비 145회 (-40%)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <DollarSign size={18} className="text-emerald-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-slate-300">예상 비용</p>
                  <p className="text-xl font-bold text-emerald-400">
                    3.7억원 (-43%)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock size={18} className="text-emerald-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-slate-300">관리 주기</p>
                  <p className="text-lg font-semibold text-emerald-400">
                    위험도별 동적 조정
                  </p>
                  <p className="text-xs text-emerald-300/70">
                    High 1개월, Med 3개월, Low 6개월
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={18} className="text-emerald-400" />
              <span className="text-sm font-medium text-emerald-300">
                절감 가능 총 비용
              </span>
            </div>
            <p className="text-3xl font-bold text-emerald-400">2.8억원</p>
            <p className="text-xs text-emerald-300/70 mt-1">연간 절감율 43%</p>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={18} className="text-blue-400" />
              <span className="text-sm font-medium text-blue-300">
                절감 가능 작업 시간
              </span>
            </div>
            <p className="text-3xl font-bold text-blue-400">1,200시간</p>
            <p className="text-xs text-blue-300/70 mt-1">연간 절감율 42%</p>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wrench size={18} className="text-purple-400" />
              <span className="text-sm font-medium text-purple-300">
                장비 운영 효율
              </span>
            </div>
            <p className="text-3xl font-bold text-purple-400">+41%</p>
            <p className="text-xs text-purple-300/70 mt-1">불필요 투입 제거</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          추천 우선관리 구역 지도
        </h3>
        <div className="rounded-lg border border-slate-700 overflow-hidden">
          <svg viewBox="0 0 800 400" className="w-full h-[400px]">
            <rect width="800" height="400" fill="#1e293b" />
            {/* Grid */}
            {Array.from({ length: 20 }).map((_, i) => (
              <g key={i}>
                <line
                  x1={i * 40}
                  y1="0"
                  x2={i * 40}
                  y2="400"
                  stroke="#334155"
                  strokeWidth="0.5"
                />
                <line
                  x1="0"
                  y1={i * 20}
                  x2="800"
                  y2={i * 20}
                  stroke="#334155"
                  strokeWidth="0.5"
                />
              </g>
            ))}

            {/* Management zones with different priorities */}
            {/* High priority zone */}
            <rect
              x="100"
              y="80"
              width="200"
              height="150"
              fill="#ef444440"
              stroke="#ef4444"
              strokeWidth="2"
              rx="8"
            />
            <text
              x="200"
              y="160"
              fill="#ef4444"
              fontSize="14"
              textAnchor="middle"
              fontWeight="bold"
            >
              High Priority
            </text>

            {/* Medium priority zone */}
            <rect
              x="350"
              y="120"
              width="180"
              height="180"
              fill="#eab30840"
              stroke="#eab308"
              strokeWidth="2"
              rx="8"
            />
            <text
              x="440"
              y="215"
              fill="#eab308"
              fontSize="14"
              textAnchor="middle"
              fontWeight="bold"
            >
              Medium Priority
            </text>

            {/* Low priority zone */}
            <rect
              x="580"
              y="100"
              width="160"
              height="200"
              fill="#10b98130"
              stroke="#10b981"
              strokeWidth="2"
              rx="8"
            />
            <text
              x="660"
              y="205"
              fill="#10b981"
              fontSize="14"
              textAnchor="middle"
              fontWeight="bold"
            >
              Low Priority
            </text>

            {/* Legend */}
            <g transform="translate(20, 320)">
              <rect
                width="150"
                height="60"
                fill="#1e293b"
                stroke="#475569"
                strokeWidth="1"
                rx="4"
              />
              <circle cx="15" cy="20" r="6" fill="#ef4444" />
              <text x="30" y="25" fill="#e2e8f0" fontSize="12">
                1개월 주기
              </text>
              <circle cx="15" cy="38" r="6" fill="#eab308" />
              <text x="30" y="43" fill="#e2e8f0" fontSize="12">
                3개월 주기
              </text>
              <circle cx="15" cy="56" r="6" fill="#10b981" />
              <text
                x="30"
                y="61"
                fill="#e2e8f0"
                fontSize="12"
                transform="translate(0, -5)"
              >
                6개월 주기
              </text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
