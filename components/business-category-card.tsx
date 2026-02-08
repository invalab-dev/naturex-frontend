"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

interface BusinessCategoryCardProps {
  icon: LucideIcon;
  title: string;
  titleEn: string;
  subtitle: string;
  bullets: string[];
  uspBullet: string;
  ctaLabel: string;
  ctaHref: string;
}

export function BusinessCategoryCard({
  icon: Icon,
  title,
  titleEn,
  subtitle,
  bullets,
  uspBullet,
  ctaLabel,
  ctaHref,
}: BusinessCategoryCardProps) {
  return (
    <Card className="flex flex-col justify-between rounded-2xl border border-slate-700 bg-slate-900/80 p-6 gap-4 hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-200">
      <div className="space-y-4">
        {/* Icon */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Icon size={24} />
          </div>
        </div>

        {/* Title */}
        <div>
          <h3 className="text-xl font-bold text-foreground mb-1">{title}</h3>
          <p className="text-xs text-muted-foreground">{titleEn}</p>
        </div>

        {/* Subtitle */}
        <p className="text-sm text-slate-300 leading-relaxed">{subtitle}</p>

        {/* Bullets */}
        <ul className="space-y-2 text-sm text-slate-200">
          {bullets.map((bullet, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5">•</span>
              <span>{bullet}</span>
            </li>
          ))}
          {/* USP Bullet */}
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 mt-0.5">•</span>
            <span className="italic text-emerald-300 font-medium">
              {uspBullet}
            </span>
          </li>
        </ul>
      </div>

      {/* CTA Button */}
      <Link href={ctaHref}>
        <Button variant="secondary" size="sm" className="w-full">
          {ctaLabel}
        </Button>
      </Link>
    </Card>
  );
}
