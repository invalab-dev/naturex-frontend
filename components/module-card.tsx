'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface ModuleCardProps {
  title: string;
  description: string[];
  usp?: string;
  icon: LucideIcon;
  href?: string;
  onEnter?: () => void;
}

export function ModuleCard({
  title,
  description,
  usp,
  icon: Icon,
  href,
  onEnter,
}: ModuleCardProps) {
  const handleClick = () => {
    if (onEnter) onEnter();
  };

  const buttonContent = (
    <Button onClick={handleClick} className="w-full">
      Enter Module
    </Button>
  );

  return (
    <Card className="flex flex-col hover:border-primary transition-colors">
      <CardHeader>
        <div className="flex items-center gap-3 mb-4">
          <Icon className="w-6 h-6 text-primary flex-shrink-0" />
          <CardTitle className="text-lg leading-tight line-clamp-2">
            {title}
          </CardTitle>
        </div>
        <CardDescription className="sr-only">Module features</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {usp && (
          <div className="mb-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-sm font-semibold text-foreground leading-relaxed line-clamp-2">
              {usp}
            </p>
          </div>
        )}
        <ul className="space-y-2 text-sm text-muted-foreground">
          {description.map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-primary mt-0.5 flex-shrink-0">•</span>
              <span className="line-clamp-1">{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        {href ? (
          <Link href={href} className="w-full">
            {buttonContent}
          </Link>
        ) : (
          buttonContent
        )}
      </CardFooter>
    </Card>
  );
}
