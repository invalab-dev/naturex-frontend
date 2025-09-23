"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, Eye, EyeOff } from "lucide-react"
import {toast} from "sonner";
import {useRouter} from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSamePassword, setIsSamePassword] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
    agreePrivacy: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Handle signup logic here
    const isSamePassword = formData.password == formData.confirmPassword
    setIsSamePassword(isSamePassword);

    if(!isSamePassword) {
      return;
    }

    setIsSubmitting(true);
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      }),
    }).then((response) => {
      console.log(response);
      setIsSubmitting(false);

      if(response.ok) {
        toast.promise(new Promise((r) => setTimeout(r, 2000)), {
          loading: "계정 생성 중...",
          success: () => {
            router.push("/login")
            return "계정이 생성되었습니다. 로그인 해주세요."
          }
        });
      } else {
        toast("이미 등록된 이메일입니다.", {
          description: "해당 이메일로 로그인하거나, 새롭게 등록해주세요."
        })
      }
    });
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
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

        {/* Signup Form */}
        <Card className="border-0 bg-card/50 backdrop-blur shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl">회원가입</CardTitle>
            <CardDescription>아래 정보를 입력하여 계정을 생성하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <div className={"h-3 flex flex-row items-center justify-between"}>
                  <Label htmlFor="name">이름</Label>
                  {/*{isSamePassword ? "" : <div className={"text-sm text-red-400"}>비밀번호가 일치하지 않습니다.</div>}*/}
                </div>
                <Input
                  id="name"
                  type="text"
                  placeholder="홍길동"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <div className={"h-3 flex flex-row items-center justify-between"}>
                  <Label htmlFor="email">이메일</Label>
                  {/*{isSamePassword ? "" : <div className={"text-sm text-red-400"}>비밀번호가 일치하지 않습니다.</div>}*/}
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <div className={"h-3 flex flex-row items-center justify-between"}>
                  <Label htmlFor="password">비밀번호</Label>
                  {/*{isSamePassword ? "" : <div className={"text-sm text-red-400"}>비밀번호가 일치하지 않습니다.</div>}*/}
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="8자 이상의 비밀번호"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
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

              <div className="space-y-2">
                <div className={"h-3 flex flex-row items-center justify-between"}>
                  <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                  {isSamePassword ? "" : <div className={"text-sm text-red-400"}>비밀번호가 일치하지 않습니다.</div>}
                </div>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="비밀번호를 다시 입력하세요"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    required
                    className="h-11 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) => handleInputChange("agreeTerms", checked as boolean)}
                    className="mt-1"
                  />
                  <Label htmlFor="terms" className="text-sm leading-5">
                    <Link href="" className="text-primary hover:underline">
                      이용약관
                    </Link>
                    <span className={"-m-2"}>에 동의합니다</span>
                  </Label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="privacy"
                    checked={formData.agreePrivacy}
                    onCheckedChange={(checked) => handleInputChange("agreePrivacy", checked as boolean)}
                    className="mt-1"
                  />
                  <Label htmlFor="privacy" className="text-sm leading-5">
                    <Link href="" className="text-primary hover:underline">
                      개인정보 처리방침
                    </Link>
                    <span className={"-m-2"}>에 동의합니다</span>
                  </Label>
                </div>
              </div>

              <Button type="submit" className="w-full h-11" disabled={isSubmitting || (!formData.agreeTerms || !formData.agreePrivacy)}>
                계정 만들기
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">이미 계정이 있으신가요? </span>
              <Link href="/login" className="text-primary hover:underline font-medium">
                로그인
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
