"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { BarChart3, Eye, EyeOff } from "lucide-react"
import {useRouter} from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoginSuccess, setIsLoginSuccess] = useState<boolean | undefined>(undefined);

  // TODO: useTransition으로 추후 처리
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log("Login attempt:", { email, password })

    setIsSubmitting(true);
    fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    }).then((response) => {
      setIsSubmitting(false);

      if(response.ok) {
        setIsLoginSuccess(true);
        router.push("/main");
      } else {
        setIsLoginSuccess(false);
      }
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BarChart3 className="h-6 w-6" />
            </div>
            <span className="text-xl font-semibold">NATUREX</span>
          </Link>
        </div>

        {/* Login Form */}
        <Card className="border-0 bg-card/50 backdrop-blur shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl">로그인</CardTitle>
            <CardDescription>이메일과 비밀번호를 입력하여 로그인하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {/*<div className="flex items-center justify-between">*/}
              {/*  <div className="flex items-center space-x-2">*/}
              {/*    <Checkbox*/}
              {/*      id="remember"*/}
              {/*      checked={rememberMe}*/}
              {/*      onCheckedChange={(checked) => setRememberMe(checked as boolean)}*/}
              {/*    />*/}
              {/*    <Label htmlFor="remember" className="text-sm">*/}
              {/*      로그인 상태 유지*/}
              {/*    </Label>*/}
              {/*  </div>*/}
              {/*  <Link href="/forgot-password" className="text-sm text-primary hover:underline">*/}
              {/*    비밀번호 찾기*/}
              {/*  </Link>*/}
              {/*</div>*/}

              <div className={"h-10"}>
                { isLoginSuccess === false ?
                  <span className={"text-sm text-red-500"}>이메일 또는 비밀번호가 잘못되었습니다. <br/> 이메일과 비밀번호를 정확히 입력해 주세요.</span> :
                  <></>
                }
              </div>

              <Button type="submit" className="w-full h-11" disabled={isSubmitting}>
                로그인
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">계정이 없으신가요? </span>
              <Link href="/signup" className="text-primary hover:underline font-medium">
                회원가입
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>© 2025 naturex. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
