// Widget Catalog Data Model - Global widget definitions for NatureX Admin

export interface WidgetMetric {
  key: string // e.g. "risk_score"
  labelKr: string
  labelEn: string
  unit: string | null // "%", "score", "tCO2e"
  format: "number" | "percent" | "score" | "text"
  threshold?: {
    good?: number
    warn?: number
    bad?: number
  }
}

export interface WidgetVisualization {
  type: "kpi" | "table" | "map" | "timeseries" | "histogram" | "heatmap"
  enabled: boolean
}

export interface WidgetCauseRule {
  condition: string // e.g. "leaning_angle > 10"
  causeKr: string
  causeEn: string
  source: "LiDAR" | "RGB" | "Multispectral" | "Satellite"
}

export interface WidgetInsightTemplates {
  summaryKr: string
  summaryEn: string
  causeRules: WidgetCauseRule[]
}

export interface WidgetCatalogItem {
  id: string // widget-risk-score
  nameKr: string
  nameEn: string
  descriptionKr: string
  descriptionEn: string
  category: "common" | "efficiency" | "asset_value" | "biodiversity"
  status: "active" | "draft" | "deprecated"
  icon: string // lucide icon name
  defaultVisibility: "customer" | "admin"
  defaultLayout: "full" | "half" | "third"
  requiredInputs: {
    rgbOrtho: boolean
    lidarLaz: boolean
    multispectral: boolean
    csvOptional: boolean
    satellite: boolean
  }
  metrics: WidgetMetric[]
  visualizations: WidgetVisualization[]
  insightTemplates: WidgetInsightTemplates
  updatedAt: string
}

export interface WidgetProjectOverride {
  projectId: string
  widgetId: string
  overrides: Partial<WidgetCatalogItem>
  updatedAt: string
}

// Storage keys
const STORAGE_KEYS = {
  catalog: "naturex_widget_catalog",
  overrides: "naturex_project_widget_overrides",
}

// Initialize default widget catalog
export function initializeWidgetCatalog() {
  if (localStorage.getItem(STORAGE_KEYS.catalog)) return

  const defaultCatalog: WidgetCatalogItem[] = [
    // Common widgets
    {
      id: "widget-service-workflow",
      nameKr: "서비스 진행 현황",
      nameEn: "Service Workflow",
      descriptionKr: "InvaLab 서비스 단계별 진행 상황 추적",
      descriptionEn: "Track InvaLab service delivery stages",
      category: "common",
      status: "active",
      icon: "Workflow",
      defaultVisibility: "customer",
      defaultLayout: "full",
      requiredInputs: {
        rgbOrtho: false,
        lidarLaz: false,
        multispectral: false,
        csvOptional: false,
        satellite: false,
      },
      metrics: [
        {
          key: "current_stage",
          labelKr: "현재 단계",
          labelEn: "Current Stage",
          unit: null,
          format: "text",
        },
        {
          key: "progress_percent",
          labelKr: "진행률",
          labelEn: "Progress",
          unit: "%",
          format: "percent",
        },
      ],
      visualizations: [
        { type: "kpi", enabled: true },
        { type: "table", enabled: false },
        { type: "map", enabled: false },
        { type: "timeseries", enabled: false },
        { type: "histogram", enabled: false },
        { type: "heatmap", enabled: false },
      ],
      insightTemplates: {
        summaryKr: "현재 서비스가 정상적으로 진행 중입니다.",
        summaryEn: "Service delivery is progressing normally.",
        causeRules: [],
      },
      updatedAt: new Date().toISOString(),
    },
    {
      id: "widget-data-intake",
      nameKr: "데이터 수집 현황",
      nameEn: "Data Intake Status",
      descriptionKr: "수집된 센서 데이터 유형 및 상태",
      descriptionEn: "Collected sensor data types and status",
      category: "common",
      status: "active",
      icon: "Database",
      defaultVisibility: "customer",
      defaultLayout: "half",
      requiredInputs: {
        rgbOrtho: false,
        lidarLaz: false,
        multispectral: false,
        csvOptional: false,
        satellite: false,
      },
      metrics: [
        {
          key: "data_types_collected",
          labelKr: "수집된 데이터 종류",
          labelEn: "Data Types",
          unit: null,
          format: "number",
        },
      ],
      visualizations: [
        { type: "kpi", enabled: true },
        { type: "table", enabled: true },
        { type: "map", enabled: false },
        { type: "timeseries", enabled: false },
        { type: "histogram", enabled: false },
        { type: "heatmap", enabled: false },
      ],
      insightTemplates: {
        summaryKr: "필요한 센서 데이터가 모두 수집되었습니다.",
        summaryEn: "All required sensor data has been collected.",
        causeRules: [],
      },
      updatedAt: new Date().toISOString(),
    },
    {
      id: "widget-report-export",
      nameKr: "보고서 다운로드",
      nameEn: "Report Export",
      descriptionKr: "분석 결과 리포트 및 원본 데이터 다운로드",
      descriptionEn: "Download analysis reports and raw data",
      category: "common",
      status: "active",
      icon: "FileDown",
      defaultVisibility: "customer",
      defaultLayout: "half",
      requiredInputs: {
        rgbOrtho: false,
        lidarLaz: false,
        multispectral: false,
        csvOptional: false,
        satellite: false,
      },
      metrics: [],
      visualizations: [
        { type: "kpi", enabled: false },
        { type: "table", enabled: true },
        { type: "map", enabled: false },
        { type: "timeseries", enabled: false },
        { type: "histogram", enabled: false },
        { type: "heatmap", enabled: false },
      ],
      insightTemplates: {
        summaryKr: "보고서를 다운로드할 수 있습니다.",
        summaryEn: "Reports are available for download.",
        causeRules: [],
      },
      updatedAt: new Date().toISOString(),
    },

    // Efficiency widgets
    {
      id: "widget-veg-structure",
      nameKr: "식생 구조 요약",
      nameEn: "Vegetation Structure Summary",
      descriptionKr: "LiDAR 기반 수목 높이, 밀도, 구조 분석",
      descriptionEn: "LiDAR-based tree height, density, structure analysis",
      category: "efficiency",
      status: "active",
      icon: "Trees",
      defaultVisibility: "customer",
      defaultLayout: "full",
      requiredInputs: {
        rgbOrtho: true,
        lidarLaz: true,
        multispectral: false,
        csvOptional: false,
        satellite: false,
      },
      metrics: [
        {
          key: "avg_tree_height",
          labelKr: "평균 수고",
          labelEn: "Avg Tree Height",
          unit: "m",
          format: "number",
        },
        {
          key: "tree_density",
          labelKr: "수목 밀도",
          labelEn: "Tree Density",
          unit: "trees/ha",
          format: "number",
        },
      ],
      visualizations: [
        { type: "kpi", enabled: true },
        { type: "table", enabled: true },
        { type: "map", enabled: true },
        { type: "timeseries", enabled: false },
        { type: "histogram", enabled: true },
        { type: "heatmap", enabled: false },
      ],
      insightTemplates: {
        summaryKr: "LiDAR 데이터를 통해 수목의 3차원 구조를 정밀 분석했습니다.",
        summaryEn: "Precise 3D tree structure analysis from LiDAR data.",
        causeRules: [
          {
            condition: "density > 800",
            causeKr: "높은 수목 밀도로 인한 경쟁 스트레스 가능성",
            causeEn: "High tree density may cause competition stress",
            source: "LiDAR",
          },
        ],
      },
      updatedAt: new Date().toISOString(),
    },
    {
      id: "widget-risk-score",
      nameKr: "리스크 점수",
      nameEn: "Risk/Health Score",
      descriptionKr: "AI 기반 수목 건강도 및 위험도 평가",
      descriptionEn: "AI-powered tree health and risk assessment",
      category: "efficiency",
      status: "active",
      icon: "AlertTriangle",
      defaultVisibility: "customer",
      defaultLayout: "half",
      requiredInputs: {
        rgbOrtho: true,
        lidarLaz: true,
        multispectral: false,
        csvOptional: false,
        satellite: false,
      },
      metrics: [
        {
          key: "risk_score",
          labelKr: "리스크 점수",
          labelEn: "Risk Score",
          unit: "score",
          format: "score",
          threshold: {
            good: 30,
            warn: 60,
            bad: 80,
          },
        },
        {
          key: "high_risk_count",
          labelKr: "고위험 수목",
          labelEn: "High Risk Trees",
          unit: "trees",
          format: "number",
        },
      ],
      visualizations: [
        { type: "kpi", enabled: true },
        { type: "table", enabled: true },
        { type: "map", enabled: true },
        { type: "timeseries", enabled: false },
        { type: "histogram", enabled: false },
        { type: "heatmap", enabled: true },
      ],
      insightTemplates: {
        summaryKr: "AI 분석을 통해 고위험 수목을 식별했습니다.",
        summaryEn: "AI analysis identified high-risk trees.",
        causeRules: [
          {
            condition: "leaning_angle > 15",
            causeKr: "심한 기울기로 인한 도복 위험",
            causeEn: "High leaning angle poses fall risk",
            source: "LiDAR",
          },
          {
            condition: "ndvi < 0.4",
            causeKr: "낮은 NDVI 값은 스트레스 또는 질병 의심",
            causeEn: "Low NDVI indicates stress or disease",
            source: "RGB",
          },
        ],
      },
      updatedAt: new Date().toISOString(),
    },
    {
      id: "widget-priority-list",
      nameKr: "관리 우선순위 목록",
      nameEn: "Priority List",
      descriptionKr: "즉시 조치가 필요한 수목 순위",
      descriptionEn: "Ranked list of trees requiring immediate action",
      category: "efficiency",
      status: "active",
      icon: "ListOrdered",
      defaultVisibility: "customer",
      defaultLayout: "half",
      requiredInputs: {
        rgbOrtho: true,
        lidarLaz: true,
        multispectral: false,
        csvOptional: false,
        satellite: false,
      },
      metrics: [
        {
          key: "priority_1_count",
          labelKr: "최우선 관리 대상",
          labelEn: "Priority 1 Trees",
          unit: "trees",
          format: "number",
        },
      ],
      visualizations: [
        { type: "kpi", enabled: false },
        { type: "table", enabled: true },
        { type: "map", enabled: true },
        { type: "timeseries", enabled: false },
        { type: "histogram", enabled: false },
        { type: "heatmap", enabled: false },
      ],
      insightTemplates: {
        summaryKr: "위험도와 위치를 종합하여 우선순위를 산정했습니다.",
        summaryEn: "Priorities calculated from risk and location factors.",
        causeRules: [],
      },
      updatedAt: new Date().toISOString(),
    },
    {
      id: "widget-cost-simulation",
      nameKr: "비용 시뮬레이션",
      nameEn: "Cost Simulation",
      descriptionKr: "관리 시나리오별 예상 비용 및 효과",
      descriptionEn: "Cost estimates for different management scenarios",
      category: "efficiency",
      status: "active",
      icon: "DollarSign",
      defaultVisibility: "customer",
      defaultLayout: "full",
      requiredInputs: {
        rgbOrtho: true,
        lidarLaz: true,
        multispectral: false,
        csvOptional: true,
        satellite: false,
      },
      metrics: [
        {
          key: "estimated_cost",
          labelKr: "예상 비용",
          labelEn: "Estimated Cost",
          unit: "원",
          format: "number",
        },
        {
          key: "roi_percent",
          labelKr: "비용 절감률",
          labelEn: "Cost Savings",
          unit: "%",
          format: "percent",
        },
      ],
      visualizations: [
        { type: "kpi", enabled: true },
        { type: "table", enabled: true },
        { type: "map", enabled: false },
        { type: "timeseries", enabled: false },
        { type: "histogram", enabled: false },
        { type: "heatmap", enabled: false },
      ],
      insightTemplates: {
        summaryKr: "우선순위 관리를 통해 예산을 효율적으로 운영할 수 있습니다.",
        summaryEn: "Priority-based management optimizes budget allocation.",
        causeRules: [],
      },
      updatedAt: new Date().toISOString(),
    },
    {
      id: "widget-execution-tracking",
      nameKr: "작업 실행 추적",
      nameEn: "Execution Tracking",
      descriptionKr: "관리 작업 진행 현황 및 완료율",
      descriptionEn: "Management work progress and completion rate",
      category: "efficiency",
      status: "active",
      icon: "CheckCircle",
      defaultVisibility: "customer",
      defaultLayout: "half",
      requiredInputs: {
        rgbOrtho: false,
        lidarLaz: false,
        multispectral: false,
        csvOptional: true,
        satellite: false,
      },
      metrics: [
        {
          key: "completion_rate",
          labelKr: "완료율",
          labelEn: "Completion Rate",
          unit: "%",
          format: "percent",
        },
      ],
      visualizations: [
        { type: "kpi", enabled: true },
        { type: "table", enabled: true },
        { type: "map", enabled: false },
        { type: "timeseries", enabled: true },
        { type: "histogram", enabled: false },
        { type: "heatmap", enabled: false },
      ],
      insightTemplates: {
        summaryKr: "작업 진행률을 실시간으로 확인할 수 있습니다.",
        summaryEn: "Real-time work progress monitoring available.",
        causeRules: [],
      },
      updatedAt: new Date().toISOString(),
    },

    // Asset Value widgets
    {
      id: "widget-productivity-lai",
      nameKr: "생산성 및 LAI",
      nameEn: "Productivity & LAI",
      descriptionKr: "엽면적지수(LAI) 기반 광합성 효율 평가",
      descriptionEn: "Leaf Area Index (LAI) based photosynthesis efficiency",
      category: "asset_value",
      status: "active",
      icon: "Leaf",
      defaultVisibility: "customer",
      defaultLayout: "full",
      requiredInputs: {
        rgbOrtho: true,
        lidarLaz: false,
        multispectral: true,
        csvOptional: false,
        satellite: false,
      },
      metrics: [
        {
          key: "avg_lai",
          labelKr: "평균 LAI",
          labelEn: "Average LAI",
          unit: "m²/m²",
          format: "number",
        },
        {
          key: "productivity_index",
          labelKr: "생산성 지수",
          labelEn: "Productivity Index",
          unit: "score",
          format: "score",
        },
      ],
      visualizations: [
        { type: "kpi", enabled: true },
        { type: "table", enabled: false },
        { type: "map", enabled: true },
        { type: "timeseries", enabled: true },
        { type: "histogram", enabled: false },
        { type: "heatmap", enabled: true },
      ],
      insightTemplates: {
        summaryKr: "멀티스펙트럴 분석을 통해 식생 생산성을 평가했습니다.",
        summaryEn: "Vegetation productivity assessed via multispectral analysis.",
        causeRules: [
          {
            condition: "lai < 2.0",
            causeKr: "낮은 LAI는 광합성 효율 저하를 의미합니다",
            causeEn: "Low LAI indicates reduced photosynthesis efficiency",
            source: "Multispectral",
          },
        ],
      },
      updatedAt: new Date().toISOString(),
    },
    {
      id: "widget-biomass",
      nameKr: "바이오매스",
      nameEn: "Biomass",
      descriptionKr: "식생 바이오매스 총량 추정",
      descriptionEn: "Total vegetation biomass estimation",
      category: "asset_value",
      status: "active",
      icon: "Weight",
      defaultVisibility: "customer",
      defaultLayout: "half",
      requiredInputs: {
        rgbOrtho: true,
        lidarLaz: true,
        multispectral: true,
        csvOptional: false,
        satellite: false,
      },
      metrics: [
        {
          key: "total_biomass",
          labelKr: "총 바이오매스",
          labelEn: "Total Biomass",
          unit: "tons",
          format: "number",
        },
      ],
      visualizations: [
        { type: "kpi", enabled: true },
        { type: "table", enabled: false },
        { type: "map", enabled: true },
        { type: "timeseries", enabled: false },
        { type: "histogram", enabled: true },
        { type: "heatmap", enabled: false },
      ],
      insightTemplates: {
        summaryKr: "LiDAR와 멀티스펙트럴 융합으로 바이오매스를 정밀 추정했습니다.",
        summaryEn: "Precision biomass estimation via LiDAR-multispectral fusion.",
        causeRules: [],
      },
      updatedAt: new Date().toISOString(),
    },
    {
      id: "widget-carbon",
      nameKr: "탄소 저장량",
      nameEn: "Carbon Estimate",
      descriptionKr: "탄소 흡수 및 저장 능력 정량화",
      descriptionEn: "Quantified carbon sequestration and storage capacity",
      category: "asset_value",
      status: "active",
      icon: "CloudRain",
      defaultVisibility: "customer",
      defaultLayout: "half",
      requiredInputs: {
        rgbOrtho: true,
        lidarLaz: true,
        multispectral: true,
        csvOptional: false,
        satellite: false,
      },
      metrics: [
        {
          key: "carbon_stock",
          labelKr: "탄소 저장량",
          labelEn: "Carbon Stock",
          unit: "tCO2e",
          format: "number",
        },
        {
          key: "carbon_credit_value",
          labelKr: "탄소크레딧 가치",
          labelEn: "Carbon Credit Value",
          unit: "원",
          format: "number",
        },
      ],
      visualizations: [
        { type: "kpi", enabled: true },
        { type: "table", enabled: false },
        { type: "map", enabled: true },
        { type: "timeseries", enabled: true },
        { type: "histogram", enabled: false },
        { type: "heatmap", enabled: false },
      ],
      insightTemplates: {
        summaryKr: "자연 기반 탄소 흡수원의 경제적 가치를 산정했습니다.",
        summaryEn: "Economic value of nature-based carbon sink calculated.",
        causeRules: [],
      },
      updatedAt: new Date().toISOString(),
    },
    {
      id: "widget-scenario-roi",
      nameKr: "시나리오별 ROI",
      nameEn: "Scenario ROI",
      descriptionKr: "투자 시나리오별 자산 가치 변화 예측",
      descriptionEn: "Predicted asset value changes for investment scenarios",
      category: "asset_value",
      status: "active",
      icon: "TrendingUp",
      defaultVisibility: "admin",
      defaultLayout: "full",
      requiredInputs: {
        rgbOrtho: true,
        lidarLaz: true,
        multispectral: true,
        csvOptional: true,
        satellite: false,
      },
      metrics: [
        {
          key: "roi_5year",
          labelKr: "5년 ROI",
          labelEn: "5-Year ROI",
          unit: "%",
          format: "percent",
        },
      ],
      visualizations: [
        { type: "kpi", enabled: true },
        { type: "table", enabled: true },
        { type: "map", enabled: false },
        { type: "timeseries", enabled: true },
        { type: "histogram", enabled: false },
        { type: "heatmap", enabled: false },
      ],
      insightTemplates: {
        summaryKr: "다양한 투자 시나리오의 장기 수익성을 비교 분석했습니다.",
        summaryEn: "Long-term profitability compared across investment scenarios.",
        causeRules: [],
      },
      updatedAt: new Date().toISOString(),
    },

    // Biodiversity widgets
    {
      id: "widget-biodiversity-index",
      nameKr: "생물다양성 지수",
      nameEn: "Biodiversity Indicators",
      descriptionKr: "종 다양성, Shannon 지수 등 생태 지표",
      descriptionEn: "Species diversity, Shannon index, ecological indicators",
      category: "biodiversity",
      status: "active",
      icon: "Bug",
      defaultVisibility: "customer",
      defaultLayout: "full",
      requiredInputs: {
        rgbOrtho: true,
        lidarLaz: false,
        multispectral: true,
        csvOptional: false,
        satellite: true,
      },
      metrics: [
        {
          key: "shannon_index",
          labelKr: "Shannon 다양성 지수",
          labelEn: "Shannon Diversity Index",
          unit: null,
          format: "number",
        },
        {
          key: "species_richness",
          labelKr: "종 풍부도",
          labelEn: "Species Richness",
          unit: "species",
          format: "number",
        },
      ],
      visualizations: [
        { type: "kpi", enabled: true },
        { type: "table", enabled: true },
        { type: "map", enabled: true },
        { type: "timeseries", enabled: true },
        { type: "histogram", enabled: false },
        { type: "heatmap", enabled: false },
      ],
      insightTemplates: {
        summaryKr: "위성 및 드론 데이터로 생태계 건강도를 평가했습니다.",
        summaryEn: "Ecosystem health assessed via satellite and drone data.",
        causeRules: [
          {
            condition: "shannon < 1.5",
            causeKr: "낮은 Shannon 지수는 생태계 단순화를 나타냅니다",
            causeEn: "Low Shannon index indicates ecosystem simplification",
            source: "Satellite",
          },
        ],
      },
      updatedAt: new Date().toISOString(),
    },
    {
      id: "widget-habitat-map",
      nameKr: "서식지 맵",
      nameEn: "Habitat Map",
      descriptionKr: "주요 서식지 유형 및 분포 현황",
      descriptionEn: "Major habitat types and distribution status",
      category: "biodiversity",
      status: "active",
      icon: "MapPin",
      defaultVisibility: "customer",
      defaultLayout: "full",
      requiredInputs: {
        rgbOrtho: true,
        lidarLaz: true,
        multispectral: true,
        csvOptional: false,
        satellite: true,
      },
      metrics: [
        {
          key: "habitat_types",
          labelKr: "서식지 유형 수",
          labelEn: "Habitat Types",
          unit: "types",
          format: "number",
        },
      ],
      visualizations: [
        { type: "kpi", enabled: false },
        { type: "table", enabled: true },
        { type: "map", enabled: true },
        { type: "timeseries", enabled: false },
        { type: "histogram", enabled: false },
        { type: "heatmap", enabled: true },
      ],
      insightTemplates: {
        summaryKr: "다중 센서 융합으로 서식지를 정밀 매핑했습니다.",
        summaryEn: "Precision habitat mapping via multi-sensor fusion.",
        causeRules: [],
      },
      updatedAt: new Date().toISOString(),
    },
    {
      id: "widget-restoration-plan",
      nameKr: "복원 핫스팟 및 계획",
      nameEn: "Hotspot & Restoration Plan",
      descriptionKr: "우선 복원 지역 및 전략 제안",
      descriptionEn: "Priority restoration areas and strategy recommendations",
      category: "biodiversity",
      status: "active",
      icon: "Sprout",
      defaultVisibility: "customer",
      defaultLayout: "full",
      requiredInputs: {
        rgbOrtho: true,
        lidarLaz: true,
        multispectral: true,
        csvOptional: false,
        satellite: true,
      },
      metrics: [
        {
          key: "restoration_priority_areas",
          labelKr: "우선 복원 지역",
          labelEn: "Priority Areas",
          unit: "areas",
          format: "number",
        },
      ],
      visualizations: [
        { type: "kpi", enabled: false },
        { type: "table", enabled: true },
        { type: "map", enabled: true },
        { type: "timeseries", enabled: false },
        { type: "histogram", enabled: false },
        { type: "heatmap", enabled: true },
      ],
      insightTemplates: {
        summaryKr: "생태 복원 효과가 높은 지역을 AI가 추천했습니다.",
        summaryEn: "AI recommended high-impact ecological restoration areas.",
        causeRules: [],
      },
      updatedAt: new Date().toISOString(),
    },
    {
      id: "widget-tnfd-esg",
      nameKr: "ESG/TNFD 공시",
      nameEn: "ESG/TNFD Mapping",
      descriptionKr: "TNFD 프레임워크 기반 자연자본 공시 준비",
      descriptionEn: "TNFD framework-based natural capital disclosure prep",
      category: "biodiversity",
      status: "active",
      icon: "FileText",
      defaultVisibility: "customer",
      defaultLayout: "full",
      requiredInputs: {
        rgbOrtho: true,
        lidarLaz: true,
        multispectral: true,
        csvOptional: false,
        satellite: true,
      },
      metrics: [],
      visualizations: [
        { type: "kpi", enabled: false },
        { type: "table", enabled: true },
        { type: "map", enabled: false },
        { type: "timeseries", enabled: false },
        { type: "histogram", enabled: false },
        { type: "heatmap", enabled: false },
      ],
      insightTemplates: {
        summaryKr: "TNFD 공시 요구사항에 맞춰 데이터를 정리했습니다.",
        summaryEn: "Data organized to meet TNFD disclosure requirements.",
        causeRules: [],
      },
      updatedAt: new Date().toISOString(),
    },
  ]

  localStorage.setItem(STORAGE_KEYS.catalog, JSON.stringify(defaultCatalog))
}

// Catalog operations
export function getWidgetCatalog(): WidgetCatalogItem[] {
  const data = localStorage.getItem(STORAGE_KEYS.catalog)
  return data ? JSON.parse(data) : []
}

export function getWidgetById(widgetId: string): WidgetCatalogItem | undefined {
  const catalog = getWidgetCatalog()
  return catalog.find((w) => w.id === widgetId)
}

export function saveWidgetToCatalog(widget: WidgetCatalogItem): void {
  const catalog = getWidgetCatalog()
  const index = catalog.findIndex((w) => w.id === widget.id)
  if (index >= 0) {
    catalog[index] = { ...widget, updatedAt: new Date().toISOString() }
  } else {
    catalog.push({ ...widget, updatedAt: new Date().toISOString() })
  }
  localStorage.setItem(STORAGE_KEYS.catalog, JSON.stringify(catalog))
}

export function deleteWidgetFromCatalog(widgetId: string): void {
  const catalog = getWidgetCatalog().filter((w) => w.id !== widgetId)
  localStorage.setItem(STORAGE_KEYS.catalog, JSON.stringify(catalog))
}

// Project overrides operations
export function getProjectOverrides(projectId?: string): WidgetProjectOverride[] {
  const data = localStorage.getItem(STORAGE_KEYS.overrides)
  const overrides = data ? JSON.parse(data) : []
  if (projectId) {
    return overrides.filter((o: WidgetProjectOverride) => o.projectId === projectId)
  }
  return overrides
}

export function saveProjectOverride(override: WidgetProjectOverride): void {
  const overrides = getProjectOverrides()
  const index = overrides.findIndex((o) => o.projectId === override.projectId && o.widgetId === override.widgetId)
  const updated = { ...override, updatedAt: new Date().toISOString() }
  if (index >= 0) {
    overrides[index] = updated
  } else {
    overrides.push(updated)
  }
  localStorage.setItem(STORAGE_KEYS.overrides, JSON.stringify(overrides))
}

export function deleteProjectOverride(projectId: string, widgetId: string): void {
  const overrides = getProjectOverrides().filter((o) => !(o.projectId === projectId && o.widgetId === widgetId))
  localStorage.setItem(STORAGE_KEYS.overrides, JSON.stringify(overrides))
}

// Helper to get effective widget config for a project (catalog + overrides)
export function getEffectiveWidgetConfig(widgetId: string, projectId: string): WidgetCatalogItem | undefined {
  const baseWidget = getWidgetById(widgetId)
  if (!baseWidget) return undefined

  const overrides = getProjectOverrides(projectId)
  const override = overrides.find((o) => o.widgetId === widgetId)

  if (override) {
    return { ...baseWidget, ...override.overrides }
  }
  return baseWidget
}

// Get usage stats for a widget
export function getWidgetUsageStats(widgetId: string): {
  projectCount: number
  overrideCount: number
} {
  // This would require checking project widget configs
  // For MVP, return placeholder
  const overrides = getProjectOverrides().filter((o) => o.widgetId === widgetId)
  return {
    projectCount: 0, // Would need to scan all project configs
    overrideCount: overrides.length,
  }
}

// Category labels
export const categoryLabels = {
  common: "공통",
  efficiency: "운영비 절감",
  asset_value: "자산 가치",
  biodiversity: "생물다양성",
} as const

// Status labels
export const statusLabels = {
  active: "활성",
  draft: "초안",
  deprecated: "종료",
} as const
