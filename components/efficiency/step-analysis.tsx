'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EfficiencyLocationView } from './location-view';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  Target,
  ArrowRight,
  CheckCircle2,
  DollarSign,
  ShieldCheck,
  Leaf,
  BarChart3,
} from 'lucide-react';

interface StepAnalysisProps {
  language: 'kr' | 'en';
}

export function StepAnalysis({ language }: StepAnalysisProps) {
  const [analysisObjective, setAnalysisObjective] = useState<string>('cost');
  const [analysisApproach, setAnalysisApproach] = useState<string>('balanced');
  const [showResults, setShowResults] = useState(false);

  const objectives = [
    {
      id: 'cost',
      icon: DollarSign,
      labelKr: '운영비 최소화',
      labelEn: 'Minimize Operating Costs',
      descKr: '유지관리 비용을 최소화하는 전략 도출',
      descEn: 'Derive strategies to minimize maintenance costs',
    },
    {
      id: 'risk',
      icon: ShieldCheck,
      labelKr: '리스크 저감',
      labelEn: 'Risk Mitigation',
      descKr: '고위험 수목 및 시설물 위험 요소 우선 관리',
      descEn: 'Prioritize high-risk trees and facility hazards',
    },
    {
      id: 'health',
      icon: Leaf,
      labelKr: '식생 건강도 향상',
      labelEn: 'Improve Vegetation Health',
      descKr: '장기적 생태계 건강도 증진',
      descEn: 'Enhance long-term ecosystem health',
    },
    {
      id: 'balance',
      icon: BarChart3,
      labelKr: '통합 최적화',
      labelEn: 'Integrated Optimization',
      descKr: '비용, 리스크, 건강도를 균형있게 고려',
      descEn: 'Balance cost, risk, and health considerations',
    },
  ];

  const approaches = [
    {
      id: 'conservative',
      labelKr: '보수적 접근',
      labelEn: 'Conservative Approach',
      descKr: '기존 관리 방식 유지, 점진적 개선',
      descEn: 'Maintain current practices, gradual improvements',
      riskLevel: 'Low',
      savingsRange: '10-20%',
    },
    {
      id: 'balanced',
      labelKr: '균형적 접근',
      labelEn: 'Balanced Approach',
      descKr: 'AI 추천과 현장 전문가 의견 절충',
      descEn: 'Balance AI recommendations with field expertise',
      riskLevel: 'Medium',
      savingsRange: '30-50%',
    },
    {
      id: 'aggressive',
      labelKr: '적극적 접근',
      labelEn: 'Aggressive Approach',
      descKr: 'AI 기반 최적화 전략 적극 적용',
      descEn: 'Aggressively apply AI-based optimization',
      riskLevel: 'Medium-High',
      savingsRange: '50-70%',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          {language === 'kr' ? '분석 단계' : 'Analysis Stage'}
        </h1>
        <p className="text-gray-600 mt-2 leading-relaxed">
          {language === 'kr'
            ? '분석 목적과 방향을 설정하고, 예상 결과를 확인합니다'
            : 'Configure analysis objectives and approach, then preview expected results'}
        </p>
      </div>

      <Card className="p-6 bg-white border-2 border-blue-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-blue-100">
            <Target className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            {language === 'kr' ? '분석 목적 선택' : 'Select Analysis Objective'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {objectives.map((obj) => {
            const Icon = obj.icon;
            return (
              <button
                key={obj.id}
                onClick={() => setAnalysisObjective(obj.id)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  analysisObjective === obj.id
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg ${analysisObjective === obj.id ? 'bg-blue-500' : 'bg-gray-100'}`}
                  >
                    <Icon
                      className={`w-5 h-5 ${analysisObjective === obj.id ? 'text-white' : 'text-gray-600'}`}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-gray-900 mb-1">
                      {language === 'kr' ? obj.labelKr : obj.labelEn}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {language === 'kr' ? obj.descKr : obj.descEn}
                    </p>
                  </div>
                  {analysisObjective === obj.id && (
                    <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-blue-100">
            <ArrowRight className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            {language === 'kr' ? '분석 방향 선택' : 'Select Analysis Approach'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {approaches.map((approach) => (
            <button
              key={approach.id}
              onClick={() => setAnalysisApproach(approach.id)}
              className={`p-5 rounded-xl border-2 transition-all text-left ${
                analysisApproach === approach.id
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-base text-gray-900">
                  {language === 'kr' ? approach.labelKr : approach.labelEn}
                </h3>
                {analysisApproach === approach.id && (
                  <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
                )}
              </div>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                {language === 'kr' ? approach.descKr : approach.descEn}
              </p>
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="text-gray-500">
                    {language === 'kr' ? '리스크 수준:' : 'Risk Level:'}
                  </span>
                  <span
                    className={`ml-2 font-semibold ${
                      approach.riskLevel === 'Low'
                        ? 'text-green-600'
                        : approach.riskLevel === 'Medium'
                          ? 'text-yellow-600'
                          : 'text-orange-600'
                    }`}
                  >
                    {approach.riskLevel}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">
                    {language === 'kr' ? '예상 절감:' : 'Est. Savings:'}
                  </span>
                  <span className="ml-2 font-semibold text-blue-600">
                    {approach.savingsRange}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            onClick={() => setShowResults(!showResults)}
            size="lg"
            className="bg-[#118DFF] hover:bg-[#0E7ADB] text-white"
          >
            {showResults
              ? language === 'kr'
                ? '예상 결과 숨기기'
                : 'Hide Expected Results'
              : language === 'kr'
                ? '예상 결과 보기'
                : 'Show Expected Results'}
          </Button>
        </div>
      </Card>

      {showResults && (
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 shadow-sm">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 rounded-xl bg-blue-500">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {language === 'kr'
                  ? '예상 분석 결과'
                  : 'Expected Analysis Results'}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {language === 'kr'
                  ? '선택한 분석 목적과 방향에 따른 예상 결과를 미리 확인할 수 있습니다.'
                  : 'Preview expected results based on your selected objectives and approach.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-5 border border-blue-200 shadow-sm">
              <div className="text-sm text-gray-600 mb-2">
                {language === 'kr'
                  ? '현재 유지 시나리오'
                  : 'Current Maintenance Scenario'}
              </div>
              <div className="text-3xl font-bold text-yellow-600 mb-1">68%</div>
              <div className="text-xs text-gray-500">
                {language === 'kr' ? '평균 건강도' : 'Avg Health Score'}
              </div>
              <img
                src="/forest-health-medium.jpg"
                alt="Current scenario"
                className="w-full h-24 object-cover rounded-lg mt-4"
              />
            </div>

            <div className="bg-white rounded-xl p-5 border-2 border-blue-500 shadow-lg">
              <div className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                {language === 'kr'
                  ? 'AI 추천 시나리오'
                  : 'AI Recommended Scenario'}
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                  {language === 'kr' ? '추천' : 'Recommended'}
                </span>
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-1">87%</div>
              <div className="text-xs text-gray-500">
                {language === 'kr' ? '예상 건강도' : 'Expected Health'}
              </div>
              <img
                src="/healthy-green-forest.jpg"
                alt="AI recommended scenario"
                className="w-full h-24 object-cover rounded-lg mt-4"
              />
            </div>

            <div className="bg-white rounded-xl p-5 border border-blue-200 shadow-sm">
              <div className="text-sm text-gray-600 mb-2">
                {language === 'kr' ? '비용 절감 예상' : 'Expected Cost Savings'}
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-1">43%</div>
              <div className="text-xs text-gray-500">
                {language === 'kr' ? '3년 누적' : '3-year cumulative'}
              </div>
              <img
                src="/cost-savings-chart-blue.jpg"
                alt="Cost savings"
                className="w-full h-24 object-cover rounded-lg mt-4"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-blue-200">
            <h4 className="font-semibold text-gray-900 mb-4">
              {language === 'kr'
                ? '3개년 변화 예측'
                : '3-Year Change Projection'}
            </h4>
            <img
              src="/vegetation-health-improvement-timeline-chart.jpg"
              alt="3-year projection"
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm text-gray-600">
                  {language === 'kr' ? '1년차' : 'Year 1'}
                </div>
                <div className="text-xl font-bold text-blue-600">+12%</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">
                  {language === 'kr' ? '2년차' : 'Year 2'}
                </div>
                <div className="text-xl font-bold text-blue-600">+19%</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">
                  {language === 'kr' ? '3년차' : 'Year 3'}
                </div>
                <div className="text-xl font-bold text-blue-600">+28%</div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Analysis Tabs */}
      <Tabs defaultValue="location" className="space-y-6">
        <TabsList className="bg-white border-2 border-blue-200">
          <TabsTrigger value="location">
            {language === 'kr' ? '위치 기반 보기' : 'Location View'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="location">
          <EfficiencyLocationView />
        </TabsContent>
      </Tabs>
    </div>
  );
}
