'use client';

import type React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from '@/components/ui/dialog';
import { Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language: string;
}

export function ContactModal({
  open,
  onOpenChange,
  language,
}: ContactModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const content = {
    title: 'InvaLab에 문의하기',
    description: '필요 내용을 작성하면 이메일로 문의가 전송됩니다.',
    nameLabel: '이름',
    namePlaceholder: '홍길동',
    emailLabel: '이메일',
    emailPlaceholder: 'example@company.com',
    companyLabel: '회사/기관',
    companyPlaceholder: '주식회사 예시 (선택)',
    messageLabel: '문의 내용',
    messagePlaceholder: '문의하실 내용을 자유롭게 작성해 주세요.',
    submitButton: '메일 보내기',
    closeButton: '닫기',
    required: '필수',
    optional: '선택',
    errorName: '이름을 입력해 주세요.',
    errorEmail: '올바른 이메일 주소를 입력해 주세요.',
    errorMessage: '문의 내용을 입력해 주세요.',
    successToast: '메일 작성 창이 열렸습니다. 전송을 완료해 주세요.',
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = content.errorName;
    }

    if (!email.trim()) {
      newErrors.email = content.errorEmail;
    } else {
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = content.errorEmail;
      }
    }

    if (!message.trim()) {
      newErrors.message = content.errorMessage;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Construct mailto link with proper encoding
    const subjectText = company
      ? `[NatureX] 문의 - ${company}`
      : `[NatureX] 문의 - ${name}`;
    const subject = encodeURIComponent(subjectText);

    const bodyText = `이름: ${name}%0D%0A이메일: ${email}%0D%0A회사/기관: ${company || '(미입력)'}%0D%0A%0D%0A문의 내용:%0D%0A${message}`;
    const body = encodeURIComponent(bodyText).replace(/%0D%0A/g, '%0D%0A');

    // Open default email client
    window.location.href = `mailto:contact@invalab.com?subject=${subject}&body=${body}`;

    // Show success toast
    toast({
      title: content.successToast,
      duration: 3000,
    });

    // Reset form and close modal
    setTimeout(() => {
      setName('');
      setEmail('');
      setCompany('');
      setMessage('');
      setErrors({});
      onOpenChange(false);
    }, 500);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setErrors({});
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogOverlay className="bg-[rgba(17,24,39,0.55)] backdrop-blur-sm" />

      <DialogContent className="sm:max-w-[560px] bg-white border border-[#E5E7EB] rounded-xl shadow-2xl p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-[#E5E7EB]">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl font-bold text-[#111827] mb-2 flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#118DFF]" />
                {content.title}
              </DialogTitle>
              <DialogDescription className="text-sm text-[#6B7280] leading-relaxed">
                {content.description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
          {/* Name field */}
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-sm font-medium text-[#374151]"
            >
              {content.nameLabel} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: '' });
              }}
              placeholder={content.namePlaceholder}
              className={`bg-[#F9FAFB] border-[#E5E7EB] focus:ring-2 focus:ring-[#118DFF] focus:border-[#118DFF] ${
                errors.name ? 'border-red-400 focus:ring-red-400' : ''
              }`}
            />
            {errors.name && (
              <p className="text-xs text-red-600 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email field */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-[#374151]"
            >
              {content.emailLabel} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              placeholder={content.emailPlaceholder}
              className={`bg-[#F9FAFB] border-[#E5E7EB] focus:ring-2 focus:ring-[#118DFF] focus:border-[#118DFF] ${
                errors.email ? 'border-red-400 focus:ring-red-400' : ''
              }`}
            />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Company field (optional) */}
          <div className="space-y-2">
            <Label
              htmlFor="company"
              className="text-sm font-medium text-[#374151]"
            >
              {content.companyLabel}{' '}
              <span className="text-xs text-[#6B7280] ml-1">
                ({content.optional})
              </span>
            </Label>
            <Input
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder={content.companyPlaceholder}
              className="bg-[#F9FAFB] border-[#E5E7EB] focus:ring-2 focus:ring-[#118DFF] focus:border-[#118DFF]"
            />
          </div>

          {/* Message field */}
          <div className="space-y-2">
            <Label
              htmlFor="message"
              className="text-sm font-medium text-[#374151]"
            >
              {content.messageLabel} <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (errors.message) setErrors({ ...errors, message: '' });
              }}
              placeholder={content.messagePlaceholder}
              rows={5}
              className={`bg-[#F9FAFB] border-[#E5E7EB] focus:ring-2 focus:ring-[#118DFF] focus:border-[#118DFF] resize-none ${
                errors.message ? 'border-red-400 focus:ring-red-400' : ''
              }`}
            />
            {errors.message && (
              <p className="text-xs text-red-600 mt-1">{errors.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="flex-1 border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB]"
            >
              {content.closeButton}
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#118DFF] hover:bg-[#0F7FE6] text-white font-medium"
            >
              <Mail className="w-4 h-4 mr-2" />
              {content.submitButton}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
