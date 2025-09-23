import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {BarChart3, MapPin, Users, Database, Brain, Clock2} from "lucide-react"

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h1 className="text-xl font-semibold">NATUREX</h1>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  로그인
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">회원가입</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            NATUREX
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground text-pretty">
            원격탐사 멀티모달(위성, 드론, 사진) 자료를 활용한 산림관리 및 환경영향평가 솔루션
          </p>
          {/*<div className="mt-10 flex items-center justify-center gap-4">*/}
          {/*  <Link href="/signup">*/}
          {/*    <Button size="lg" className="px-8">*/}
          {/*      무료로 시작하기*/}
          {/*    </Button>*/}
          {/*  </Link>*/}
          {/*  <Link href="/login">*/}
          {/*    <Button variant="outline" size="lg" className="px-8 bg-transparent">*/}
          {/*      기존 계정으로 로그인*/}
          {/*    </Button>*/}
          {/*  </Link>*/}
          {/*</div>*/}
        </div>

        {/* Features */}
        <div className="mt-24 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border-0 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Clock2 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>시간 기반 데이터</CardTitle>
              <CardDescription>전국 식생 분포와 환경 데이터를 시간별로 확인할 수 있습니다.</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>자체 AI</CardTitle>
              <CardDescription>자체 AI 이미지 처리 기술을 활용하여 데이터를 처리합니다.</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>진단 및 분석</CardTitle>
              <CardDescription>생태계 영향 및 다양성을 ESG 관점에서 진단 및 분석합니다.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>
    </div>
  )
}
