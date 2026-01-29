'use client';

import type React from 'react';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Leaf, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitted(true);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#118DFF] flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-semibold text-slate-900">
              NatureX
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            비밀번호 찾기
          </h1>
          <p className="text-sm text-slate-600">
            가입하신 이메일 주소를 입력해주세요.
          </p>
        </div>

        {/* Forgot Password Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-slate-700"
                >
                  이메일
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@naturex.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
                <p className="text-xs text-slate-500">
                  비밀번호 재설정 링크를 이메일로 보내드립니다.
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-[#118DFF] hover:bg-[#0D6FCC] text-white font-medium"
              >
                {isLoading ? '전송 중...' : '재설정 링크 전송'}
              </Button>
            </form>
          ) : (
            // Success Message
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                이메일을 확인해주세요
              </h3>
              <p className="text-sm text-slate-600 mb-6">
                {email}로 비밀번호 재설정 링크를 전송했습니다.
                <br />
                이메일을 확인하여 비밀번호를 재설정해주세요.
              </p>
              <Button
                onClick={() => setIsSubmitted(false)}
                variant="outline"
                className="w-full h-11"
              >
                다시 전송
              </Button>
            </div>
          )}

          {/* Back to Login Link */}
          <div className="mt-6">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-[#118DFF] hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              로그인으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
